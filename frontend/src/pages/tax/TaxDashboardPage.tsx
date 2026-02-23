import { useMemo, useState } from 'react';
import {
  Box,
  Button,
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
  Payment,
  OpenInNew,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  if (value >= 1000000) return `KSh ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `KSh ${(value / 1000).toFixed(0)}K`;
  return `KSh ${value.toLocaleString()}`;
}

function formatFullCurrency(value: number): string {
  return `KSh ${value.toLocaleString()}`;
}

// ─── Government mock data ───────────────────────────────────────────────────

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

const ALL_RECENT_ASSESSMENTS: RecentAssessment[] = [
  { id: 'ta-001', reference: 'KE-2026-0042', trader: 'Nairobi Exports Ltd', total_tax: 48500, status: 'paid', due_date: '2026-02-25' },
  { id: 'ta-002', reference: 'KE-2026-0041', trader: 'Nairobi Exports Ltd', total_tax: 12750, status: 'pending', due_date: '2026-03-01' },
  { id: 'ta-003', reference: 'KE-2026-0040', trader: 'Lagos Trading Co', total_tax: 156000, status: 'overdue', due_date: '2026-02-15' },
  { id: 'ta-004', reference: 'KE-2026-0038', trader: 'Nairobi Exports Ltd', total_tax: 37000, status: 'paid', due_date: '2026-02-20' },
  { id: 'ta-005', reference: 'KE-2026-0034', trader: 'Lagos Trading Co', total_tax: 22500, status: 'disputed', due_date: '2026-02-18' },
  { id: 'ta-006', reference: 'KE-2026-0033', trader: 'Nairobi Exports Ltd', total_tax: 31200, status: 'pending', due_date: '2026-03-05' },
];

// ─── Trader-specific mock data ──────────────────────────────────────────────

interface TraderTaxSummary {
  month: string;
  customs_duty: number;
  vat: number;
  excise: number;
}

const MY_TAX_HISTORY: TraderTaxSummary[] = [
  { month: 'Sep 2025', customs_duty: 18500, vat: 12950, excise: 3700 },
  { month: 'Oct 2025', customs_duty: 24500, vat: 16800, excise: 4900 },
  { month: 'Nov 2025', customs_duty: 12000, vat: 8400, excise: 2400 },
  { month: 'Dec 2025', customs_duty: 31000, vat: 21700, excise: 6200 },
  { month: 'Jan 2026', customs_duty: 22000, vat: 15400, excise: 4400 },
  { month: 'Feb 2026', customs_duty: 18000, vat: 9600, excise: 2400 },
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

// ─── Government Dashboard View ──────────────────────────────────────────────

function GovtTaxDashboard() {
  const [period, setPeriod] = useState('feb_2026');

  const currentMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1];
  const prevMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 2];
  const totalCurrent = currentMonth.customs_duty + currentMonth.vat + currentMonth.excise + currentMonth.withholding;
  const totalPrev = prevMonth.customs_duty + prevMonth.vat + prevMonth.excise + prevMonth.withholding;
  const growthPct = ((totalCurrent - totalPrev) / totalPrev * 100).toFixed(1);
  const isGrowth = totalCurrent >= totalPrev;

  const collectionRate = 87.3;
  const complianceRate = 92.1;
  const pendingCount = ALL_RECENT_ASSESSMENTS.filter((a) => a.status === 'pending').length;
  const overdueCount = ALL_RECENT_ASSESSMENTS.filter((a) => a.status === 'overdue').length;

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
          select size="small" value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="feb_2026">February 2026</MenuItem>
          <MenuItem value="jan_2026">January 2026</MenuItem>
          <MenuItem value="q4_2025">Q4 2025</MenuItem>
          <MenuItem value="fy_2025">FY 2025</MenuItem>
        </TextField>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Total Revenue (MTD)</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#D4AF37' }}>
              {formatCurrency(totalCurrent)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              {isGrowth ? <TrendingUp sx={{ fontSize: 14, color: '#22C55E' }} /> : <TrendingDown sx={{ fontSize: 14, color: '#EF4444' }} />}
              <Typography sx={{ fontSize: 11, color: isGrowth ? '#22C55E' : '#EF4444' }}>
                {isGrowth ? '+' : ''}{growthPct}% vs last month
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Collection Rate</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#22C55E' }}>{collectionRate}%</Typography>
            <LinearProgress variant="determinate" value={collectionRate}
              sx={{ mt: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(34,197,94,0.1)', '& .MuiLinearProgress-bar': { backgroundColor: '#22C55E' } }} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Pending Assessments</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#E6A817' }}>{pendingCount}</Typography>
            <Typography sx={{ fontSize: 11, color: '#777', mt: 0.5 }}>{overdueCount} overdue</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Compliance Rate</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#3B82F6' }}>{complianceRate}%</Typography>
            <LinearProgress variant="determinate" value={complianceRate}
              sx={{ mt: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(59,130,246,0.1)', '& .MuiLinearProgress-bar': { backgroundColor: '#3B82F6' } }} />
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue by Category */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Revenue by Category</Typography>
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
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: cat.color }}>{formatCurrency(value)}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#777' }}>{pct}%</Typography>
                    </Box>
                  </Box>
                  <LinearProgress variant="determinate" value={Number(pct)}
                    sx={{ height: 6, borderRadius: 3, backgroundColor: `${cat.color}15`, '& .MuiLinearProgress-bar': { backgroundColor: cat.color, borderRadius: 3 } }} />
                </Box>
              );
            })}
          </Card>
        </Grid>

        {/* Monthly Trend */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Monthly Revenue Trend</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY_REVENUE} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(212,175,55,0.06)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: string) => v.split(' ')[0]} />
                <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8 }}
                  labelStyle={{ color: '#D4AF37' }} itemStyle={{ color: '#b0b0b0' }}
                  formatter={(value) => [formatCurrency(Number(value))]} />
                <Legend verticalAlign="bottom" iconType="circle" iconSize={8}
                  wrapperStyle={{ fontSize: 10, color: '#777', paddingTop: 8 }} />
                <Bar dataKey="customs_duty" stackId="revenue" fill="#D4AF37" name="Customs Duty" radius={[0, 0, 0, 0]} />
                <Bar dataKey="vat" stackId="revenue" fill="#22C55E" name="VAT" />
                <Bar dataKey="excise" stackId="revenue" fill="#3B82F6" name="Excise" />
                <Bar dataKey="withholding" stackId="revenue" fill="#8B5CF6" name="Withholding" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Recent Assessments */}
        <Grid size={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Recent Tax Assessments</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '130px 1fr 130px 100px 110px', gap: 1, px: 2.5, py: 1.5,
              borderBottom: '1px solid rgba(212,175,55,0.08)', backgroundColor: 'rgba(212,175,55,0.03)' }}>
              {['Reference', 'Trader', 'Total Tax', 'Status', 'Due Date'].map((h) => (
                <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
              ))}
            </Box>
            {ALL_RECENT_ASSESSMENTS.map((a, i) => {
              const sts = STATUS_CONFIG[a.status];
              return (
                <Box key={a.id} sx={{
                  display: 'grid', gridTemplateColumns: '130px 1fr 130px 100px 110px', gap: 1, px: 2.5, py: 1.75,
                  alignItems: 'center', cursor: 'pointer',
                  borderBottom: i < ALL_RECENT_ASSESSMENTS.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                  '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                }}>
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

// ─── Trader Dashboard View ──────────────────────────────────────────────────

function TraderTaxDashboard() {
  const { orgName, filterByOrgName } = useDataIsolation();
  const traderName = orgName || 'My Company';

  // Filter assessments for this trader only
  const myAssessments = useMemo(() => filterByOrgName(ALL_RECENT_ASSESSMENTS, 'trader'), [filterByOrgName]);
  const totalOwed = myAssessments.filter((a) => a.status === 'pending' || a.status === 'overdue').reduce((s, a) => s + a.total_tax, 0);
  const totalPaid = myAssessments.filter((a) => a.status === 'paid').reduce((s, a) => s + a.total_tax, 0);
  const pendingCount = myAssessments.filter((a) => a.status === 'pending').length;
  const overdueCount = myAssessments.filter((a) => a.status === 'overdue').length;

  const currentMonthTax = MY_TAX_HISTORY[MY_TAX_HISTORY.length - 1];
  const myTotal = currentMonthTax.customs_duty + currentMonthTax.vat + currentMonthTax.excise;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>My Tax Obligations</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Tax assessments and payment status for {traderName}.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Payment />} size="small">
          Make Payment
        </Button>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Outstanding Balance</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: totalOwed > 0 ? '#EF4444' : '#22C55E' }}>
              {formatFullCurrency(totalOwed)}
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#777', mt: 0.5 }}>
              {pendingCount} pending, {overdueCount} overdue
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Total Paid (YTD)</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#22C55E' }}>
              {formatFullCurrency(totalPaid)}
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#777', mt: 0.5 }}>
              {myAssessments.filter((a) => a.status === 'paid').length} assessments cleared
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>This Month&apos;s Tax</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#D4AF37' }}>
              {formatFullCurrency(myTotal)}
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#777', mt: 0.5 }}>
              Feb 2026
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Compliance Status</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: overdueCount === 0 ? '#22C55E' : '#E6A817' }}>
              {overdueCount === 0 ? 'Good' : 'Attention'}
            </Typography>
            <Typography sx={{ fontSize: 11, color: overdueCount === 0 ? '#22C55E' : '#E6A817', mt: 0.5 }}>
              {overdueCount === 0 ? 'All payments up to date' : `${overdueCount} overdue payment(s)`}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Tax Breakdown (Current Month) */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>This Month&apos;s Tax Breakdown</Typography>
            {[
              { label: 'Customs Duty', value: currentMonthTax.customs_duty, color: '#D4AF37', icon: <Gavel sx={{ fontSize: 20 }} /> },
              { label: 'VAT', value: currentMonthTax.vat, color: '#3B82F6', icon: <Receipt sx={{ fontSize: 20 }} /> },
              { label: 'Excise Duty', value: currentMonthTax.excise, color: '#22C55E', icon: <AccountBalance sx={{ fontSize: 20 }} /> },
            ].map((cat) => {
              const pct = myTotal > 0 ? (cat.value / myTotal * 100).toFixed(1) : '0';
              return (
                <Box key={cat.label} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: cat.color }}>{cat.icon}</Box>
                      <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{cat.label}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: cat.color }}>{formatFullCurrency(cat.value)}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#777' }}>{pct}%</Typography>
                    </Box>
                  </Box>
                  <LinearProgress variant="determinate" value={Number(pct)}
                    sx={{ height: 6, borderRadius: 3, backgroundColor: `${cat.color}15`, '& .MuiLinearProgress-bar': { backgroundColor: cat.color, borderRadius: 3 } }} />
                </Box>
              );
            })}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>Total</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, fontFamily: "'Lora', serif", color: '#D4AF37' }}>{formatFullCurrency(myTotal)}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* My Tax History Chart */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>My Tax History (6 Months)</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MY_TAX_HISTORY} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(212,175,55,0.06)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: string) => v.split(' ')[0]} />
                <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8 }}
                  labelStyle={{ color: '#D4AF37' }} itemStyle={{ color: '#b0b0b0' }}
                  formatter={(value) => [formatFullCurrency(Number(value))]} />
                <Legend verticalAlign="bottom" iconType="circle" iconSize={8}
                  wrapperStyle={{ fontSize: 10, color: '#777', paddingTop: 8 }} />
                <Bar dataKey="customs_duty" stackId="tax" fill="#D4AF37" name="Customs Duty" />
                <Bar dataKey="vat" stackId="tax" fill="#3B82F6" name="VAT" />
                <Bar dataKey="excise" stackId="tax" fill="#22C55E" name="Excise" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* My Assessments */}
        <Grid size={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(212,175,55,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>My Tax Assessments</Typography>
              <Button size="small" endIcon={<OpenInNew sx={{ fontSize: 14 }} />} sx={{ fontSize: 12, color: '#D4AF37' }}
                href="/tax/assessments">
                View All
              </Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '130px 130px 100px 110px', gap: 1, px: 2.5, py: 1.5,
              borderBottom: '1px solid rgba(212,175,55,0.08)', backgroundColor: 'rgba(212,175,55,0.03)' }}>
              {['Reference', 'Total Tax', 'Status', 'Due Date'].map((h) => (
                <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
              ))}
            </Box>
            {myAssessments.map((a, i) => {
              const sts = STATUS_CONFIG[a.status];
              return (
                <Box key={a.id} sx={{
                  display: 'grid', gridTemplateColumns: '130px 130px 100px 110px', gap: 1, px: 2.5, py: 1.75,
                  alignItems: 'center', cursor: 'pointer',
                  borderBottom: i < myAssessments.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                  '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>{a.reference}</Typography>
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

// ─── Main Page Component ────────────────────────────────────────────────────

export default function TaxDashboardPage() {
  const { isOversight } = useDataIsolation();

  if (isOversight) {
    return <GovtTaxDashboard />;
  }

  return <TraderTaxDashboard />;
}
