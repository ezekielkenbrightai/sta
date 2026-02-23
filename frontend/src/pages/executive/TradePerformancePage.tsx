import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Public,
  CompareArrows,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

// ─── Executive palette ─────────────────────────────────────────────────────

const EX = {
  navy: '#0B1426',
  navyLight: '#0F1D35',
  navyMid: '#132240',
  gold: '#C9A84C',
  goldLight: '#E8D48B',
  goldBorder: 'rgba(201, 168, 76, 0.18)',
  white: '#F8F6F0',
  silver: '#A0A8B8',
  green: '#34D399',
  red: '#F87171',
  amber: '#FBBF24',
  blue: '#60A5FA',
  emerald: '#10B981',
  gradientCard: 'linear-gradient(145deg, rgba(15,29,53,0.95) 0%, rgba(11,20,38,0.98) 100%)',
  gradientGold: 'linear-gradient(135deg, #C9A84C 0%, #E8D48B 50%, #C9A84C 100%)',
};

// ─── Data ─────────────────────────────────────────────────────────────────

const ANNUAL_TRADE = [
  { year: '2020', exports: 6100, imports: 10200 },
  { year: '2021', exports: 6800, imports: 11400 },
  { year: '2022', exports: 7900, imports: 13100 },
  { year: '2023', exports: 8400, imports: 13800 },
  { year: '2024', exports: 9200, imports: 14500 },
  { year: '2025', exports: 10100, imports: 14900 },
  { year: '2026*', exports: 10800, imports: 15200 },
];

const COMMODITY_EXPORTS = [
  { name: 'Tea', value: 1820, change: +6.3 },
  { name: 'Cut Flowers', value: 1240, change: +11.8 },
  { name: 'Coffee', value: 980, change: -3.2 },
  { name: 'Vegetables', value: 760, change: +14.5 },
  { name: 'Textiles', value: 680, change: +22.1 },
  { name: 'Titanium Ore', value: 540, change: +8.7 },
  { name: 'Cement', value: 420, change: +18.9 },
  { name: 'Iron/Steel', value: 380, change: +31.2 },
  { name: 'Plastics', value: 310, change: +9.4 },
  { name: 'Petroleum', value: 290, change: +45.1 },
];

const TRADE_CORRIDORS = [
  { name: 'Northern Corridor (Mombasa → Kampala)', volume: 4200, utilization: 87, status: 'optimal' },
  { name: 'Central Corridor (Dar es Salaam → Kigali)', volume: 2100, utilization: 72, status: 'moderate' },
  { name: 'LAPSSET (Lamu → Isiolo → Moyale)', volume: 680, utilization: 34, status: 'developing' },
  { name: 'Nairobi → Addis Ababa Road', volume: 1100, utilization: 58, status: 'moderate' },
];

const COLORS = [EX.gold, EX.emerald, EX.blue, EX.amber, '#A78BFA', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TradePerformancePage() {
  return (
    <Box
      sx={{
        background: `linear-gradient(180deg, ${EX.navy} 0%, ${EX.navyLight} 100%)`,
        minHeight: '100vh',
        mx: -3, mt: -3, mb: -3,
        px: { xs: 2, md: 4 }, py: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: `1px solid ${EX.goldBorder}` }}>
        <Typography
          sx={{ fontSize: 10, fontWeight: 600, color: EX.gold, letterSpacing: '0.2em', textTransform: 'uppercase', mb: 0.25 }}
        >
          Strategic Intelligence
        </Typography>
        <Typography variant="h4" sx={{ fontFamily: "'Lora', serif", fontWeight: 700, color: EX.white, fontSize: { xs: 22, md: 28 } }}>
          National Trade Performance
        </Typography>
        <Typography sx={{ fontSize: 12, color: EX.silver, mt: 0.5 }}>
          Comprehensive analysis of Kenya's trade dynamics, export competitiveness, and corridor performance.
        </Typography>
      </Box>

      {/* Annual Trend */}
      <Card sx={{ background: EX.gradientCard, border: `1px solid ${EX.goldBorder}`, borderRadius: '14px', p: 2.5, mb: 3, position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: EX.gradientGold } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CompareArrows sx={{ fontSize: 18, color: EX.gold }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}>
            Annual Trade Balance (USD Millions)
          </Typography>
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={ANNUAL_TRADE} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradEx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={EX.emerald} stopOpacity={0.3} />
                <stop offset="95%" stopColor={EX.emerald} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradIm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={EX.red} stopOpacity={0.2} />
                <stop offset="95%" stopColor={EX.red} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={alpha(EX.silver, 0.06)} />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: EX.silver }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: EX.silver }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}B`} />
            <RTooltip contentStyle={{ backgroundColor: EX.navyLight, border: `1px solid ${EX.goldBorder}`, borderRadius: 8, fontSize: 11, color: EX.white }} formatter={(value) => [`$${value}M`]} />
            <Area type="monotone" dataKey="exports" stroke={EX.emerald} strokeWidth={2.5} fill="url(#gradEx)" name="Exports" />
            <Area type="monotone" dataKey="imports" stroke={EX.red} strokeWidth={2.5} fill="url(#gradIm)" name="Imports" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Top Commodities */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ background: EX.gradientCard, border: `1px solid ${EX.goldBorder}`, borderRadius: '14px', p: 2.5, height: '100%', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: EX.gradientGold } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TrendingUp sx={{ fontSize: 18, color: EX.gold }} />
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}>
                Top Export Commodities (USD Millions)
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={COMMODITY_EXPORTS} layout="vertical" margin={{ top: 0, right: 10, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(EX.silver, 0.05)} horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: EX.silver }} tickFormatter={(v) => `$${v}M`} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: EX.silver }} width={80} />
                <RTooltip contentStyle={{ backgroundColor: EX.navyLight, border: `1px solid ${EX.goldBorder}`, borderRadius: 8, fontSize: 11, color: EX.white }} formatter={(value) => [`$${value}M`]} />
                <Bar dataKey="value" name="Export Value" radius={[0, 4, 4, 0]} maxBarSize={16}>
                  {COMMODITY_EXPORTS.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Trade Corridors */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ background: EX.gradientCard, border: `1px solid ${EX.goldBorder}`, borderRadius: '14px', p: 2.5, height: '100%', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: EX.gradientGold } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Public sx={{ fontSize: 18, color: EX.gold }} />
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}>
                Strategic Trade Corridors
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {TRADE_CORRIDORS.map((c) => (
                <Box key={c.name} sx={{ p: 1.5, borderRadius: '10px', border: `1px solid ${alpha(EX.silver, 0.06)}`, background: alpha(EX.navyMid, 0.5) }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: EX.white }}>{c.name}</Typography>
                    <Chip
                      label={c.status}
                      size="small"
                      sx={{
                        fontSize: 8, height: 18, fontWeight: 600,
                        color: c.status === 'optimal' ? EX.emerald : c.status === 'moderate' ? EX.amber : EX.blue,
                        backgroundColor: c.status === 'optimal' ? alpha(EX.emerald, 0.1) : c.status === 'moderate' ? alpha(EX.amber, 0.1) : alpha(EX.blue, 0.1),
                        border: 'none',
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.75 }}>
                    <Typography sx={{ fontSize: 11, color: EX.silver }}>Volume: <b style={{ color: EX.white }}>${c.volume}M</b></Typography>
                    <Typography sx={{ fontSize: 11, color: EX.silver }}>Utilization: <b style={{ color: EX.white }}>{c.utilization}%</b></Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={c.utilization}
                    sx={{
                      height: 5, borderRadius: 3,
                      backgroundColor: alpha(EX.gold, 0.08),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: c.utilization >= 70 ? `linear-gradient(90deg, ${EX.emerald}, ${alpha(EX.emerald, 0.7)})` : c.utilization >= 40 ? `linear-gradient(90deg, ${EX.amber}, ${alpha(EX.amber, 0.7)})` : `linear-gradient(90deg, ${EX.blue}, ${alpha(EX.blue, 0.7)})`,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Commodity Growth Table */}
      <Card sx={{ background: EX.gradientCard, border: `1px solid ${EX.goldBorder}`, borderRadius: '14px', p: 2.5, position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: EX.gradientGold } }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif", mb: 2 }}>
          Year-on-Year Commodity Growth
        </Typography>
        <Grid container spacing={1}>
          {COMMODITY_EXPORTS.map((c) => (
            <Grid size={{ xs: 6, md: 4, lg: 2.4 }} key={c.name}>
              <Box sx={{ p: 1.5, borderRadius: '8px', border: `1px solid ${alpha(EX.silver, 0.06)}`, textAlign: 'center' }}>
                <Typography sx={{ fontSize: 11, color: EX.silver, mb: 0.5 }}>{c.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  {c.change >= 0 ? <TrendingUp sx={{ fontSize: 14, color: EX.green }} /> : <TrendingDown sx={{ fontSize: 14, color: EX.red }} />}
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: c.change >= 0 ? EX.green : EX.red }}>
                    {c.change >= 0 ? '+' : ''}{c.change}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: `1px solid ${EX.goldBorder}` }}>
        <Typography sx={{ fontSize: 8, color: alpha(EX.silver, 0.25) }}>
          Classified — For Official Use Only — Powered by Smart Trade Africa
        </Typography>
      </Box>
    </Box>
  );
}
