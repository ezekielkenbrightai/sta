import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Receipt,
  Gavel,
  AttachMoney,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface RevenueItem {
  month: string;
  customs_duty: number;
  vat: number;
  excise: number;
  withholding: number;
}

const MONTHLY_REVENUE: RevenueItem[] = [
  { month: 'Sep 2025', customs_duty: 12400000, vat: 8200000, excise: 3100000, withholding: 1800000 },
  { month: 'Oct 2025', customs_duty: 13100000, vat: 8700000, excise: 3400000, withholding: 1950000 },
  { month: 'Nov 2025', customs_duty: 11800000, vat: 7900000, excise: 2900000, withholding: 1700000 },
  { month: 'Dec 2025', customs_duty: 15200000, vat: 10100000, excise: 4200000, withholding: 2300000 },
  { month: 'Jan 2026', customs_duty: 14500000, vat: 9600000, excise: 3800000, withholding: 2100000 },
  { month: 'Feb 2026', customs_duty: 13800000, vat: 9200000, excise: 3600000, withholding: 2000000 },
];

interface RecentAssessment {
  id: string;
  reference: string;
  trader: string;
  total_tax: number;
  status: 'pending' | 'paid' | 'overdue' | 'disputed';
  due_date: string;
}

const RECENT_ASSESSMENTS: RecentAssessment[] = [
  { id: 'ta-001', reference: 'KE-2026-0042', trader: 'Nairobi Exports Ltd', total_tax: 48500, status: 'paid', due_date: '2026-02-25' },
  { id: 'ta-002', reference: 'KE-2026-0041', trader: 'Nairobi Exports Ltd', total_tax: 12750, status: 'pending', due_date: '2026-03-01' },
  { id: 'ta-003', reference: 'KE-2026-0040', trader: 'Lagos Trading Co', total_tax: 156000, status: 'overdue', due_date: '2026-02-15' },
  { id: 'ta-004', reference: 'KE-2026-0038', trader: 'Nairobi Exports Ltd', total_tax: 37000, status: 'paid', due_date: '2026-02-20' },
  { id: 'ta-005', reference: 'KE-2026-0034', trader: 'Lagos Trading Co', total_tax: 22500, status: 'disputed', due_date: '2026-02-18' },
  { id: 'ta-006', reference: 'KE-2026-0033', trader: 'Nairobi Exports Ltd', total_tax: 31200, status: 'pending', due_date: '2026-03-05' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  paid: { label: 'Paid', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  overdue: { label: 'Overdue', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  disputed: { label: 'Disputed', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

const TAX_CATEGORIES = [
  { label: 'Customs Duty', key: 'customs_duty' as const, color: '#D4AF37', icon: <Gavel sx={{ fontSize: 20 }} /> },
  { label: 'VAT', key: 'vat' as const, color: '#3B82F6', icon: <Receipt sx={{ fontSize: 20 }} /> },
  { label: 'Excise Duty', key: 'excise' as const, color: '#22C55E', icon: <AccountBalance sx={{ fontSize: 20 }} /> },
  { label: 'Withholding Tax', key: 'withholding' as const, color: '#E6A817', icon: <AttachMoney sx={{ fontSize: 20 }} /> },
];

function formatCurrency(value: number): string {
  if (value >= 1000000) return `KSh ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `KSh ${(value / 1000).toFixed(0)}K`;
  return `KSh ${value.toLocaleString()}`;
}

function formatFullCurrency(value: number): string {
  return `KSh ${value.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TaxDashboardPage() {
  const [period, setPeriod] = useState('feb_2026');

  const currentMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1];
  const prevMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 2];
  const totalCurrent = currentMonth.customs_duty + currentMonth.vat + currentMonth.excise + currentMonth.withholding;
  const totalPrev = prevMonth.customs_duty + prevMonth.vat + prevMonth.excise + prevMonth.withholding;
  const growthPct = ((totalCurrent - totalPrev) / totalPrev * 100).toFixed(1);
  const isGrowth = totalCurrent >= totalPrev;

  // Max for bar chart
  const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.customs_duty + m.vat + m.excise + m.withholding));

  const collectionRate = 87.3;
  const complianceRate = 92.1;
  const pendingCount = RECENT_ASSESSMENTS.filter((a) => a.status === 'pending').length;
  const overdueCount = RECENT_ASSESSMENTS.filter((a) => a.status === 'overdue').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>Tax Dashboard</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Revenue collection overview and tax assessment monitoring.
          </Typography>
        </Box>
        <TextField
          select
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="feb_2026">February 2026</MenuItem>
          <MenuItem value="jan_2026">January 2026</MenuItem>
          <MenuItem value="q4_2025">Q4 2025</MenuItem>
          <MenuItem value="fy_2025">FY 2025</MenuItem>
        </TextField>
      </Box>

      {/* ── Summary Stats ──────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Total Revenue (MTD)</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#D4AF37' }}>
              {formatCurrency(totalCurrent)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              {isGrowth ? (
                <TrendingUp sx={{ fontSize: 14, color: '#22C55E' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 14, color: '#EF4444' }} />
              )}
              <Typography sx={{ fontSize: 11, color: isGrowth ? '#22C55E' : '#EF4444' }}>
                {isGrowth ? '+' : ''}{growthPct}% vs last month
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Collection Rate</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#22C55E' }}>
              {collectionRate}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={collectionRate}
              sx={{ mt: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(34,197,94,0.1)', '& .MuiLinearProgress-bar': { backgroundColor: '#22C55E' } }}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Pending Assessments</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#E6A817' }}>
              {pendingCount}
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#777', mt: 0.5 }}>
              {overdueCount} overdue
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Compliance Rate</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#3B82F6' }}>
              {complianceRate}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={complianceRate}
              sx={{ mt: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(59,130,246,0.1)', '& .MuiLinearProgress-bar': { backgroundColor: '#3B82F6' } }}
            />
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* ── Revenue by Category ────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              Revenue by Category
            </Typography>
            {TAX_CATEGORIES.map((cat) => {
              const value = currentMonth[cat.key];
              const pct = (value / totalCurrent * 100).toFixed(1);
              return (
                <Box key={cat.key} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: cat.color }}>{cat.icon}</Box>
                      <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{cat.label}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: cat.color }}>
                        {formatCurrency(value)}
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: '#777' }}>{pct}%</Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Number(pct)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: `${cat.color}15`,
                      '& .MuiLinearProgress-bar': { backgroundColor: cat.color, borderRadius: 3 },
                    }}
                  />
                </Box>
              );
            })}
          </Card>
        </Grid>

        {/* ── Monthly Trend ─────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              Monthly Revenue Trend
            </Typography>
            {MONTHLY_REVENUE.map((m) => {
              const total = m.customs_duty + m.vat + m.excise + m.withholding;
              const pct = (total / maxRevenue) * 100;
              return (
                <Box key={m.month} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 12, color: '#999', minWidth: 70 }}>{m.month}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{formatCurrency(total)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '1px', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                    <Box sx={{ width: `${(m.customs_duty / total) * pct}%`, backgroundColor: '#D4AF37' }} />
                    <Box sx={{ width: `${(m.vat / total) * pct}%`, backgroundColor: '#3B82F6' }} />
                    <Box sx={{ width: `${(m.excise / total) * pct}%`, backgroundColor: '#22C55E' }} />
                    <Box sx={{ width: `${(m.withholding / total) * pct}%`, backgroundColor: '#E6A817' }} />
                    <Box sx={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)' }} />
                  </Box>
                </Box>
              );
            })}
            {/* Legend */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              {TAX_CATEGORIES.map((cat) => (
                <Box key={cat.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cat.color }} />
                  <Typography sx={{ fontSize: 10, color: '#777' }}>{cat.label}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* ── Recent Assessments ─────────────────────────────────────── */}
        <Grid size={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Recent Tax Assessments</Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '130px 1fr 130px 100px 110px',
                gap: 1,
                px: 2.5,
                py: 1.5,
                borderBottom: '1px solid rgba(212,175,55,0.08)',
                backgroundColor: 'rgba(212,175,55,0.03)',
              }}
            >
              {['Reference', 'Trader', 'Total Tax', 'Status', 'Due Date'].map((h) => (
                <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
              ))}
            </Box>
            {RECENT_ASSESSMENTS.map((a, i) => {
              const sts = STATUS_CONFIG[a.status];
              return (
                <Box
                  key={a.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '130px 1fr 130px 100px 110px',
                    gap: 1,
                    px: 2.5,
                    py: 1.75,
                    alignItems: 'center',
                    borderBottom: i < RECENT_ASSESSMENTS.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                    '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                    cursor: 'pointer',
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>{a.reference}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{a.trader}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{formatFullCurrency(a.total_tax)}</Typography>
                  <Chip label={sts.label} size="small" sx={{ fontSize: 11, height: 22, backgroundColor: sts.bg, color: sts.color }} />
                  <Typography sx={{ fontSize: 12, color: a.status === 'overdue' ? '#EF4444' : '#999' }}>{a.due_date}</Typography>
                </Box>
              );
            })}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
