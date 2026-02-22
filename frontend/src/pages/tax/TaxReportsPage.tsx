import { useState } from 'react';
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
  Assessment,
  Download,
  TrendingUp,
  Schedule,
  PieChart as PieChartIcon,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface RevenueReport {
  category: string;
  collected: number;
  target: number;
  color: string;
}

const REVENUE_REPORTS: RevenueReport[] = [
  { category: 'Customs Duty', collected: 13800000, target: 16000000, color: '#D4AF37' },
  { category: 'VAT on Imports', collected: 9200000, target: 10500000, color: '#3B82F6' },
  { category: 'Excise Duty', collected: 3600000, target: 4000000, color: '#22C55E' },
  { category: 'Withholding Tax', collected: 2000000, target: 2200000, color: '#E6A817' },
  { category: 'AfCFTA Preferential', collected: 450000, target: 600000, color: '#8B5CF6' },
];

interface TopTraderTax {
  name: string;
  total_tax: number;
  documents: number;
  compliance: number;
}

const TOP_TRADERS: TopTraderTax[] = [
  { name: 'Nairobi Exports Ltd', total_tax: 138250, documents: 28, compliance: 96 },
  { name: 'Lagos Trading Co', total_tax: 203200, documents: 42, compliance: 78 },
  { name: 'Kampala Imports Inc', total_tax: 98700, documents: 19, compliance: 91 },
  { name: 'Dar es Salaam Freight', total_tax: 76400, documents: 15, compliance: 88 },
  { name: 'Accra Commodities Ltd', total_tax: 154800, documents: 35, compliance: 94 },
  { name: 'Cairo Trade House', total_tax: 112500, documents: 22, compliance: 85 },
];

interface MonthlyCollection {
  month: string;
  collected: number;
  target: number;
}

const MONTHLY_COLLECTIONS: MonthlyCollection[] = [
  { month: 'Sep', collected: 25500000, target: 28000000 },
  { month: 'Oct', collected: 27150000, target: 29000000 },
  { month: 'Nov', collected: 24300000, target: 27000000 },
  { month: 'Dec', collected: 31800000, target: 33000000 },
  { month: 'Jan', collected: 30000000, target: 31000000 },
  { month: 'Feb', collected: 28600000, target: 32000000 },
];

function formatCurrency(value: number): string {
  if (value >= 1000000) return `KSh ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `KSh ${(value / 1000).toFixed(0)}K`;
  return `KSh ${value.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TaxReportsPage() {
  const [period, setPeriod] = useState('feb_2026');

  const totalCollected = REVENUE_REPORTS.reduce((s, r) => s + r.collected, 0);
  const totalTarget = REVENUE_REPORTS.reduce((s, r) => s + r.target, 0);
  const overallRate = ((totalCollected / totalTarget) * 100).toFixed(1);

  const maxTraderTax = Math.max(...TOP_TRADERS.map((t) => t.total_tax));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>Revenue Reports</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Tax revenue analytics and collection performance.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField select size="small" value={period} onChange={(e) => setPeriod(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="feb_2026">February 2026</MenuItem>
            <MenuItem value="jan_2026">January 2026</MenuItem>
            <MenuItem value="q4_2025">Q4 2025</MenuItem>
            <MenuItem value="fy_2025">FY 2025</MenuItem>
          </TextField>
          <Button variant="outlined" startIcon={<Download />} size="small">
            Export
          </Button>
        </Box>
      </Box>

      {/* Summary cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Collected', value: formatCurrency(totalCollected), color: '#22C55E', icon: <TrendingUp sx={{ fontSize: 16 }} /> },
          { label: 'Target', value: formatCurrency(totalTarget), color: '#3B82F6', icon: <Assessment sx={{ fontSize: 16 }} /> },
          { label: 'Collection Rate', value: `${overallRate}%`, color: '#D4AF37', icon: <PieChartIcon sx={{ fontSize: 16 }} /> },
          { label: 'Days Remaining', value: '6', color: '#E6A817', icon: <Schedule sx={{ fontSize: 16 }} /> },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
                <Box sx={{ color: s.color }}>{s.icon}</Box>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>
                {s.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* ── Revenue by Category ────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              Revenue by Category — Target vs Collected
            </Typography>
            {REVENUE_REPORTS.map((r) => {
              const pct = (r.collected / r.target * 100).toFixed(1);
              return (
                <Box key={r.category} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{r.category}</Typography>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: r.color }}>
                        {formatCurrency(r.collected)}
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: '#777' }}>
                        of {formatCurrency(r.target)} ({pct}%)
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(Number(pct), 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${r.color}15`,
                      '& .MuiLinearProgress-bar': { backgroundColor: r.color, borderRadius: 4 },
                    }}
                  />
                </Box>
              );
            })}
          </Card>
        </Grid>

        {/* ── Monthly Collection vs Target ──────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              Monthly Collection Performance
            </Typography>
            {MONTHLY_COLLECTIONS.map((m) => {
              const rate = (m.collected / m.target * 100).toFixed(0);
              const maxVal = Math.max(...MONTHLY_COLLECTIONS.map((mc) => mc.target));
              return (
                <Box key={m.month} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 12, color: '#999' }}>{m.month}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#f0f0f0' }}>
                      {formatCurrency(m.collected)} / {formatCurrency(m.target)}
                      <Typography component="span" sx={{ fontSize: 10, color: Number(rate) >= 90 ? '#22C55E' : '#E6A817', ml: 0.5 }}>
                        {rate}%
                      </Typography>
                    </Typography>
                  </Box>
                  <Box sx={{ position: 'relative', height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    <Box sx={{
                      position: 'absolute', top: 0, left: 0, height: '100%',
                      width: `${(m.target / maxVal) * 100}%`,
                      borderRadius: 5,
                      backgroundColor: 'rgba(59,130,246,0.15)',
                    }} />
                    <Box sx={{
                      position: 'absolute', top: 0, left: 0, height: '100%',
                      width: `${(m.collected / maxVal) * 100}%`,
                      borderRadius: 5,
                      backgroundColor: Number(rate) >= 90 ? '#22C55E' : '#E6A817',
                    }} />
                  </Box>
                </Box>
              );
            })}
            <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22C55E' }} />
                <Typography sx={{ fontSize: 10, color: '#777' }}>Collected</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.4)' }} />
                <Typography sx={{ fontSize: 10, color: '#777' }}>Target</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* ── Top Traders by Tax ─────────────────────────────────────── */}
        <Grid size={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Top Traders by Tax Contribution</Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 140px 100px 100px 1fr',
                gap: 1, px: 2.5, py: 1.5,
                borderBottom: '1px solid rgba(212,175,55,0.08)',
                backgroundColor: 'rgba(212,175,55,0.03)',
              }}
            >
              {['Trader', 'Total Tax', 'Documents', 'Compliance', 'Contribution'].map((h) => (
                <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
              ))}
            </Box>
            {TOP_TRADERS.sort((a, b) => b.total_tax - a.total_tax).map((t, i) => (
              <Box
                key={t.name}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 140px 100px 100px 1fr',
                  gap: 1, px: 2.5, py: 1.75,
                  alignItems: 'center',
                  borderBottom: i < TOP_TRADERS.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                  '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                }}
              >
                <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{t.name}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>{formatCurrency(t.total_tax)}</Typography>
                <Typography sx={{ fontSize: 13, color: '#b0b0b0' }}>{t.documents}</Typography>
                <Chip
                  label={`${t.compliance}%`}
                  size="small"
                  sx={{
                    fontSize: 11, height: 22,
                    backgroundColor: t.compliance >= 90 ? 'rgba(34,197,94,0.1)' : t.compliance >= 80 ? 'rgba(230,168,23,0.1)' : 'rgba(239,68,68,0.1)',
                    color: t.compliance >= 90 ? '#22C55E' : t.compliance >= 80 ? '#E6A817' : '#EF4444',
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(212,175,55,0.08)' }}>
                    <Box sx={{
                      height: '100%', borderRadius: 3, backgroundColor: '#D4AF37',
                      width: `${(t.total_tax / maxTraderTax) * 100}%`,
                    }} />
                  </Box>
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
