import { useState, useMemo } from 'react';
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
  AccountBalance,
  Receipt,
  PieChart,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface RevenueStream {
  name: string;
  current_month: number;
  target: number;
  ytd: number;
  trend: number;
  color: string;
}

interface TopPayer {
  rank: number;
  name: string;
  country: string;
  flag: string;
  paid_usd: number;
  type: string;
  compliance: number;
}

const STREAMS: RevenueStream[] = [
  { name: 'Import Duties', current_month: 3_200_000_000, target: 3_500_000_000, ytd: 6_100_000_000, trend: 8.4, color: '#D4AF37' },
  { name: 'Excise Tax', current_month: 1_800_000_000, target: 2_000_000_000, ytd: 3_400_000_000, trend: 5.2, color: '#3B82F6' },
  { name: 'VAT on Imports', current_month: 2_400_000_000, target: 2_200_000_000, ytd: 4_900_000_000, trend: 12.7, color: '#22C55E' },
  { name: 'Export Levies', current_month: 450_000_000, target: 500_000_000, ytd: 870_000_000, trend: -3.1, color: '#8B5CF6' },
  { name: 'Customs Fees', current_month: 320_000_000, target: 350_000_000, ytd: 610_000_000, trend: 6.8, color: '#E6A817' },
  { name: 'Penalties & Fines', current_month: 85_000_000, target: 60_000_000, ytd: 180_000_000, trend: 45.2, color: '#EF4444' },
];

const TOP_PAYERS: TopPayer[] = [
  { rank: 1, name: 'Kenya Oil Refineries Ltd', country: 'Kenya', flag: '🇰🇪', paid_usd: 42_000_000, type: 'Petroleum', compliance: 100 },
  { rank: 2, name: 'East Africa Auto Group', country: 'Kenya', flag: '🇰🇪', paid_usd: 28_500_000, type: 'Motor Vehicles', compliance: 98 },
  { rank: 3, name: 'Cairo Electronics Import', country: 'Egypt', flag: '🇪🇬', paid_usd: 21_000_000, type: 'Electronics', compliance: 95 },
  { rank: 4, name: 'Lagos Steel Works', country: 'Nigeria', flag: '🇳🇬', paid_usd: 18_700_000, type: 'Steel & Metals', compliance: 92 },
  { rank: 5, name: 'Nairobi Pharma Distributors', country: 'Kenya', flag: '🇰🇪', paid_usd: 15_200_000, type: 'Pharmaceuticals', compliance: 100 },
  { rank: 6, name: 'Dar es Salaam Freight', country: 'Tanzania', flag: '🇹🇿', paid_usd: 12_800_000, type: 'General Cargo', compliance: 88 },
  { rank: 7, name: 'Addis Chemical Traders', country: 'Ethiopia', flag: '🇪🇹', paid_usd: 11_400_000, type: 'Chemicals', compliance: 94 },
  { rank: 8, name: 'Kampala Textiles Ltd', country: 'Uganda', flag: '🇺🇬', paid_usd: 9_800_000, type: 'Textiles', compliance: 91 },
];

const MONTHLY_TREND = [
  { month: 'Sep', value: 7.8 },
  { month: 'Oct', value: 8.1 },
  { month: 'Nov', value: 7.5 },
  { month: 'Dec', value: 9.2 },
  { month: 'Jan', value: 8.3 },
  { month: 'Feb', value: 8.7 },
];

function fmtB(v: number): string {
  if (v >= 1_000_000_000) return `KES ${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `KES ${(v / 1_000_000).toFixed(0)}M`;
  return `KES ${(v / 1000).toFixed(0)}K`;
}

function fmtUSD(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RevenueAnalyticsPage() {
  const [period, setPeriod] = useState('feb_2026');
  const totalCollected = useMemo(() => STREAMS.reduce((s, r) => s + r.current_month, 0), []);
  const totalTarget = useMemo(() => STREAMS.reduce((s, r) => s + r.target, 0), []);
  const collectionRate = ((totalCollected / totalTarget) * 100).toFixed(1);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <TrendingUp sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Revenue Analytics</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            Tax and customs revenue collection monitoring, trend analysis, and target tracking.
          </Typography>
        </Box>
        <TextField
          select size="small" value={period} onChange={(e) => setPeriod(e.target.value)}
          sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(212,175,55,0.04)' } }}
        >
          <MenuItem value="feb_2026">February 2026</MenuItem>
          <MenuItem value="jan_2026">January 2026</MenuItem>
          <MenuItem value="q4_2025">Q4 2025</MenuItem>
          <MenuItem value="fy_2025">FY 2025</MenuItem>
        </TextField>
      </Box>

      {/* Top KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Collected', value: fmtB(totalCollected), color: '#D4AF37', icon: <AccountBalance sx={{ fontSize: 18, color: '#D4AF37' }} /> },
          { label: 'Target', value: fmtB(totalTarget), color: '#3B82F6', icon: <Receipt sx={{ fontSize: 18, color: '#3B82F6' }} /> },
          { label: 'Collection Rate', value: `${collectionRate}%`, color: parseFloat(collectionRate) >= 95 ? '#22C55E' : '#E6A817', icon: <PieChart sx={{ fontSize: 18, color: '#22C55E' }} /> },
          { label: 'YTD Total', value: fmtB(STREAMS.reduce((s, r) => s + r.ytd, 0)), color: '#8B5CF6', icon: <TrendingUp sx={{ fontSize: 18, color: '#8B5CF6' }} /> },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                {s.icon}
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Revenue Streams */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Revenue by Stream</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {STREAMS.map((r) => {
                const pct = Math.min((r.current_month / r.target) * 100, 100);
                return (
                  <Box key={r.name} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: r.color }} />
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{r.name}</Typography>
                      </Box>
                      <Chip
                        label={`${r.trend > 0 ? '+' : ''}${r.trend}%`}
                        size="small"
                        sx={{ fontSize: 9, height: 16, color: r.trend > 0 ? '#22C55E' : '#EF4444', backgroundColor: r.trend > 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          flex: 1, height: 8, borderRadius: 4,
                          backgroundColor: 'rgba(212,175,55,0.08)',
                          '& .MuiLinearProgress-bar': { backgroundColor: pct >= 95 ? '#22C55E' : pct >= 80 ? '#E6A817' : '#EF4444', borderRadius: 4 },
                        }}
                      />
                      <Typography sx={{ fontSize: 11, color: '#888', fontFamily: 'monospace', minWidth: 40, textAlign: 'right' }}>{pct.toFixed(0)}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>Collected: <Box component="span" sx={{ color: '#b0b0b0' }}>{fmtB(r.current_month)}</Box></Typography>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>Target: <Box component="span" sx={{ color: '#b0b0b0' }}>{fmtB(r.target)}</Box></Typography>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>YTD: <Box component="span" sx={{ color: '#b0b0b0' }}>{fmtB(r.ytd)}</Box></Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 6-Month Trend */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Monthly Collection Trend (KES B)</Typography>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={MONTHLY_TREND} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(212,175,55,0.06)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8 }}
                    labelStyle={{ color: '#D4AF37' }}
                    itemStyle={{ color: '#b0b0b0' }}
                    formatter={(value: number) => [`${value}B`, 'Revenue']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {MONTHLY_TREND.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === MONTHLY_TREND.length - 1 ? '#D4AF37' : 'rgba(212,175,55,0.25)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Top Payers */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Top Revenue Contributors</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {TOP_PAYERS.map((p) => (
                  <Box key={p.rank} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.03)' }}>
                    <Typography sx={{ fontSize: 11, color: '#555', fontFamily: 'monospace', width: 16 }}>#{p.rank}</Typography>
                    <Typography sx={{ fontSize: 13 }}>{p.flag}</Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 12, color: '#e0e0e0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>{p.type}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{fmtUSD(p.paid_usd)}</Typography>
                      <Typography sx={{ fontSize: 9, color: p.compliance >= 95 ? '#22C55E' : '#E6A817' }}>{p.compliance}% compliant</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
