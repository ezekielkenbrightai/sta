import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Schedule,
  NotificationsActive,
  Public,
  Gavel,
  BarChart,
  AccountBalance,
  Flag,
  ArrowForward,
  Circle,
  Refresh,
  Speed,
  AssessmentOutlined,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// ─── Executive Color System (distinct from regular gold/black) ──────────────

const EX = {
  navy: '#0B1426',
  navyLight: '#0F1D35',
  navyMid: '#132240',
  gold: '#C9A84C',
  goldLight: '#E8D48B',
  goldMuted: 'rgba(201, 168, 76, 0.12)',
  goldBorder: 'rgba(201, 168, 76, 0.18)',
  goldGlow: 'rgba(201, 168, 76, 0.06)',
  white: '#F8F6F0',
  silver: '#A0A8B8',
  green: '#34D399',
  red: '#F87171',
  amber: '#FBBF24',
  blue: '#60A5FA',
  emerald: '#10B981',
  // Gradients
  gradientGold: 'linear-gradient(135deg, #C9A84C 0%, #E8D48B 50%, #C9A84C 100%)',
  gradientNavy: 'linear-gradient(180deg, #0B1426 0%, #0F1D35 100%)',
  gradientCard: 'linear-gradient(145deg, rgba(15,29,53,0.95) 0%, rgba(11,20,38,0.98) 100%)',
};

// ─── Mock Data — PS Trade Command Centre ────────────────────────────────────

const CURRENT_DATE = new Date().toLocaleDateString('en-KE', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

const NATIONAL_KPIs = [
  {
    label: 'Total Trade Volume',
    value: '$18.7B',
    period: 'FY 2025/26 YTD',
    change: +14.2,
    target: '$22.4B',
    progress: 83.5,
    icon: <Public sx={{ fontSize: 22 }} />,
    color: EX.gold,
  },
  {
    label: 'Trade Balance',
    value: '-$4.8B',
    period: 'Current Fiscal Year',
    change: +8.1,
    target: 'Reduce to -$3.5B',
    progress: 62,
    icon: <BarChart sx={{ fontSize: 22 }} />,
    color: EX.amber,
  },
  {
    label: 'Customs Revenue',
    value: 'KES 247.3B',
    period: 'Collected YTD',
    change: +11.8,
    target: 'KES 310B',
    progress: 79.8,
    icon: <AccountBalance sx={{ fontSize: 22 }} />,
    color: EX.emerald,
  },
  {
    label: 'Trade Facilitation Index',
    value: '3.8 / 5.0',
    period: 'WTO TFI Score',
    change: +6.2,
    target: '4.2 by 2027',
    progress: 76,
    icon: <Speed sx={{ fontSize: 22 }} />,
    color: EX.blue,
  },
];

const MONTHLY_TRADE_DATA = [
  { month: 'Jul', exports: 820, imports: 1120, target: 900 },
  { month: 'Aug', exports: 890, imports: 1080, target: 920 },
  { month: 'Sep', exports: 940, imports: 1150, target: 950 },
  { month: 'Oct', exports: 1010, imports: 1200, target: 980 },
  { month: 'Nov', exports: 1080, imports: 1180, target: 1010 },
  { month: 'Dec', exports: 950, imports: 1320, target: 1050 },
  { month: 'Jan', exports: 1120, imports: 1250, target: 1080 },
  { month: 'Feb', exports: 1180, imports: 1290, target: 1100 },
];

const TOP_EXPORT_SECTORS = [
  { name: 'Tea & Coffee', value: 3200, color: '#34D399' },
  { name: 'Horticulture', value: 2800, color: '#60A5FA' },
  { name: 'Textiles & Apparel', value: 1400, color: '#C9A84C' },
  { name: 'Minerals & Oil', value: 1100, color: '#FBBF24' },
  { name: 'Manufactured Goods', value: 900, color: '#A78BFA' },
  { name: 'Other', value: 600, color: '#6B7280' },
];

const TRADE_PARTNERS = [
  { country: 'Uganda', flag: '🇺🇬', exports: 1420, imports: 560, trend: +12.3, agreements: 3 },
  { country: 'Tanzania', flag: '🇹🇿', exports: 1180, imports: 890, trend: +8.7, agreements: 4 },
  { country: 'DRC', flag: '🇨🇩', exports: 980, imports: 340, trend: +22.1, agreements: 2 },
  { country: 'Ethiopia', flag: '🇪🇹', exports: 560, imports: 720, trend: +15.4, agreements: 3 },
  { country: 'Rwanda', flag: '🇷🇼', exports: 410, imports: 180, trend: +18.9, agreements: 5 },
  { country: 'South Africa', flag: '🇿🇦', exports: 380, imports: 1890, trend: -2.1, agreements: 6 },
  { country: 'Egypt', flag: '🇪🇬', exports: 290, imports: 780, trend: +9.4, agreements: 2 },
  { country: 'Nigeria', flag: '🇳🇬', exports: 220, imports: 450, trend: +31.2, agreements: 1 },
];

const POLICY_DIRECTIVES = [
  {
    id: 'p1',
    title: 'AfCFTA Phase II — Services Liberalisation Protocol',
    status: 'active',
    deadline: 'Mar 2026',
    progress: 68,
    category: 'Treaty',
  },
  {
    id: 'p2',
    title: 'National Export Development Strategy 2026–2030',
    status: 'review',
    deadline: 'Apr 2026',
    progress: 45,
    category: 'Strategy',
  },
  {
    id: 'p3',
    title: 'EAC Common External Tariff Revision',
    status: 'active',
    deadline: 'Jun 2026',
    progress: 82,
    category: 'Tariff',
  },
  {
    id: 'p4',
    title: 'Digital Trade Facilitation — Paperless Trade Protocol',
    status: 'active',
    deadline: 'Dec 2026',
    progress: 34,
    category: 'Digital',
  },
  {
    id: 'p5',
    title: 'Bilateral Trade Agreement — Kenya–DRC Acceleration',
    status: 'negotiation',
    deadline: 'May 2026',
    progress: 55,
    category: 'Bilateral',
  },
];

const PS_ALERTS = [
  {
    id: 'a1',
    severity: 'critical' as const,
    title: 'Export Decline Alert — Horticulture Sector',
    detail: 'Rose exports to EU dropped 18% this month due to new phytosanitary regulations. Requires immediate stakeholder engagement.',
    time: '2h ago',
    source: 'Trade Intelligence Unit',
  },
  {
    id: 'a2',
    severity: 'high' as const,
    title: 'AfCFTA Tariff Schedule Non-Compliance',
    detail: '3 commodity categories behind on tariff reduction timeline. Cabinet Secretary briefing recommended.',
    time: '4h ago',
    source: 'AfCFTA Secretariat',
  },
  {
    id: 'a3',
    severity: 'medium' as const,
    title: 'Customs Revenue Exceeds Q2 Target',
    detail: 'KES 62.8B collected vs KES 58.1B target. Driven by increased intra-African imports under AfCFTA.',
    time: '6h ago',
    source: 'Kenya Revenue Authority',
  },
  {
    id: 'a4',
    severity: 'info' as const,
    title: 'WTO Trade Policy Review — Kenya 2026',
    detail: 'Draft report submitted for Ministry review. Response deadline: 15 March 2026.',
    time: '1d ago',
    source: 'WTO Secretariat',
  },
];

const REGIONAL_BLOC_PERFORMANCE = [
  { bloc: 'EAC', trade: 4.8, growth: 14.2, share: 32.1 },
  { bloc: 'COMESA', trade: 3.2, growth: 9.7, share: 21.4 },
  { bloc: 'SADC', trade: 2.1, growth: 6.3, share: 14.1 },
  { bloc: 'AfCFTA', trade: 2.8, growth: 28.4, share: 18.7 },
  { bloc: 'Other Africa', trade: 2.0, growth: 11.1, share: 13.7 },
];

const SEVERITY_CONFIG = {
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)', label: 'CRITICAL' },
  high: { color: '#F59E0B', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)', label: 'HIGH' },
  medium: { color: '#10B981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)', label: 'MEDIUM' },
  info: { color: '#60A5FA', bg: 'rgba(96,165,250,0.06)', border: 'rgba(96,165,250,0.15)', label: 'INFO' },
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  active: { color: EX.emerald, label: 'Active' },
  review: { color: EX.amber, label: 'Under Review' },
  negotiation: { color: EX.blue, label: 'Negotiation' },
};

// ─── Reusable Executive Card ────────────────────────────────────────────────

function ExecCard({
  children,
  sx,
  glow,
}: {
  children: React.ReactNode;
  sx?: Record<string, unknown>;
  glow?: boolean;
}) {
  return (
    <Card
      sx={{
        background: EX.gradientCard,
        border: `1px solid ${EX.goldBorder}`,
        borderRadius: '14px',
        p: 2.5,
        position: 'relative',
        overflow: 'hidden',
        ...(glow && {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: EX.gradientGold,
          },
        }),
        ...sx,
      }}
    >
      {children}
    </Card>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ExecutiveDashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const totalExports = useMemo(
    () => TOP_EXPORT_SECTORS.reduce((s, x) => s + x.value, 0),
    [],
  );

  return (
    <Box
      key={refreshKey}
      sx={{
        background: EX.gradientNavy,
        minHeight: '100vh',
        mx: -3,
        mt: -3,
        mb: -3,
        px: { xs: 2, md: 4 },
        py: 3,
      }}
    >
      {/* ═══ Header — Crest & Title ═══════════════════════════════════════ */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 4,
          pb: 3,
          borderBottom: `1px solid ${EX.goldBorder}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          {/* Crest / Seal */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: EX.gradientGold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 32px ${alpha(EX.gold, 0.25)}`,
              border: `2px solid ${alpha(EX.goldLight, 0.4)}`,
              flexShrink: 0,
            }}
          >
            <Box sx={{ textAlign: 'center', lineHeight: 1 }}>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: EX.navy,
                  fontFamily: "'Lora', serif",
                  letterSpacing: '0.05em',
                }}
              >
                REPUBLIC
              </Typography>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: EX.navy,
                  fontFamily: "'Lora', serif",
                  lineHeight: 1,
                }}
              >
                🇰🇪
              </Typography>
              <Typography
                sx={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: EX.navy,
                  fontFamily: "'Lora', serif",
                  letterSpacing: '0.08em',
                }}
              >
                OF KENYA
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: EX.gold,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                mb: 0.25,
              }}
            >
              Office of the Permanent Secretary
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Lora', serif",
                fontWeight: 700,
                color: EX.white,
                fontSize: { xs: 22, md: 28 },
                lineHeight: 1.15,
              }}
            >
              State Department for Trade
            </Typography>
            <Typography sx={{ fontSize: 12, color: EX.silver, mt: 0.5 }}>
              Executive Command Centre — {CURRENT_DATE}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Refresh intelligence data">
            <IconButton
              onClick={() => setRefreshKey((k) => k + 1)}
              sx={{ color: EX.silver, '&:hover': { color: EX.gold } }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: '20px',
              border: `1px solid ${alpha(EX.emerald, 0.3)}`,
              background: alpha(EX.emerald, 0.06),
            }}
          >
            <Circle sx={{ fontSize: 8, color: EX.emerald, animation: 'pulse 2s ease-in-out infinite' }} />
            <Typography sx={{ fontSize: 11, color: EX.emerald, fontWeight: 600 }}>LIVE</Typography>
          </Box>
        </Box>
      </Box>

      {/* ═══ National KPI Cards ═══════════════════════════════════════════ */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {NATIONAL_KPIs.map((kpi) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={kpi.label}>
            <ExecCard glow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(kpi.color, 0.12),
                    color: kpi.color,
                  }}
                >
                  {kpi.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 11, color: EX.silver, fontWeight: 500, lineHeight: 1.2 }}>
                    {kpi.label}
                  </Typography>
                  <Typography sx={{ fontSize: 9, color: alpha(EX.silver, 0.5) }}>{kpi.period}</Typography>
                </Box>
              </Box>
              <Typography
                sx={{
                  fontSize: 26,
                  fontWeight: 700,
                  fontFamily: "'Lora', serif",
                  color: EX.white,
                  lineHeight: 1,
                  mb: 1,
                }}
              >
                {kpi.value}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.25,
                    color: kpi.change > 0 ? EX.green : EX.red,
                  }}
                >
                  {kpi.change > 0 ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                    {kpi.change > 0 ? '+' : ''}
                    {kpi.change}%
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 10, color: alpha(EX.silver, 0.6) }}>vs previous year</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={kpi.progress}
                  sx={{
                    flex: 1,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: alpha(kpi.color, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      background: `linear-gradient(90deg, ${alpha(kpi.color, 0.6)}, ${kpi.color})`,
                    },
                  }}
                />
                <Typography sx={{ fontSize: 10, color: kpi.color, fontWeight: 600, minWidth: 30, textAlign: 'right' }}>
                  {kpi.progress}%
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 9, color: alpha(EX.silver, 0.5), mt: 0.5 }}>
                Target: {kpi.target}
              </Typography>
            </ExecCard>
          </Grid>
        ))}
      </Grid>

      {/* ═══ Row 2: Trade Trend + Strategic Alerts ══════════════════════ */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Trade Trend Chart */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <ExecCard glow sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: EX.white,
                    fontFamily: "'Lora', serif",
                  }}
                >
                  National Trade Performance
                </Typography>
                <Typography sx={{ fontSize: 11, color: EX.silver }}>
                  Monthly exports vs imports (USD millions)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {[
                  { label: 'Exports', color: EX.emerald },
                  { label: 'Imports', color: EX.blue },
                  { label: 'Target', color: EX.gold },
                ].map((l) => (
                  <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: l.color }} />
                    <Typography sx={{ fontSize: 10, color: EX.silver }}>{l.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={MONTHLY_TRADE_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradExports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={EX.emerald} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={EX.emerald} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradImports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={EX.blue} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={EX.blue} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(EX.silver, 0.06)} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: EX.silver }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: EX.silver }}
                  tickFormatter={(v) => `$${v}M`}
                />
                <RTooltip
                  contentStyle={{
                    backgroundColor: EX.navyLight,
                    border: `1px solid ${EX.goldBorder}`,
                    borderRadius: 8,
                    fontSize: 11,
                    color: EX.white,
                  }}
                  formatter={(value) => [`$${value}M`]}
                />
                <Area
                  type="monotone"
                  dataKey="exports"
                  stroke={EX.emerald}
                  strokeWidth={2}
                  fill="url(#gradExports)"
                  name="Exports"
                />
                <Area
                  type="monotone"
                  dataKey="imports"
                  stroke={EX.blue}
                  strokeWidth={2}
                  fill="url(#gradImports)"
                  name="Imports"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke={EX.gold}
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  fill="transparent"
                  name="Export Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ExecCard>
        </Grid>

        {/* Strategic Alerts (PS-level) */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <ExecCard glow sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <NotificationsActive sx={{ fontSize: 18, color: EX.gold }} />
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: EX.white,
                  fontFamily: "'Lora', serif",
                }}
              >
                Strategic Alerts & Briefings
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {PS_ALERTS.map((a) => {
                const sc = SEVERITY_CONFIG[a.severity];
                return (
                  <Box
                    key={a.id}
                    sx={{
                      p: 1.5,
                      borderRadius: '10px',
                      border: `1px solid ${sc.border}`,
                      background: sc.bg,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        border: `1px solid ${alpha(sc.color, 0.35)}`,
                        background: alpha(sc.color, 0.08),
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={sc.label}
                          size="small"
                          sx={{
                            fontSize: 8,
                            height: 18,
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            color: sc.color,
                            backgroundColor: alpha(sc.color, 0.12),
                            border: 'none',
                          }}
                        />
                        <Typography sx={{ fontSize: 11, color: alpha(EX.silver, 0.5) }}>{a.time}</Typography>
                      </Box>
                      <ArrowForward sx={{ fontSize: 14, color: alpha(EX.silver, 0.3) }} />
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: EX.white, mb: 0.25, lineHeight: 1.3 }}>
                      {a.title}
                    </Typography>
                    <Typography sx={{ fontSize: 10.5, color: alpha(EX.silver, 0.7), lineHeight: 1.4 }}>
                      {a.detail}
                    </Typography>
                    <Typography sx={{ fontSize: 9, color: alpha(EX.gold, 0.5), mt: 0.5 }}>
                      Source: {a.source}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </ExecCard>
        </Grid>
      </Grid>

      {/* ═══ Row 3: Trading Partners + Export Sectors + Policy Tracker ═══ */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Top Trading Partners */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <ExecCard glow sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Flag sx={{ fontSize: 18, color: EX.gold }} />
              <Typography
                sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}
              >
                Priority Trading Partners
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {TRADE_PARTNERS.map((p, i) => (
                <Box
                  key={p.country}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1,
                    px: 1.25,
                    borderRadius: '8px',
                    background: i === 0 ? alpha(EX.gold, 0.04) : 'transparent',
                    borderBottom: `1px solid ${alpha(EX.silver, 0.04)}`,
                    '&:hover': { background: alpha(EX.gold, 0.04) },
                    transition: 'background 0.15s ease',
                  }}
                >
                  <Typography sx={{ fontSize: 10, color: alpha(EX.silver, 0.4), width: 14, textAlign: 'right' }}>
                    {i + 1}
                  </Typography>
                  <Typography sx={{ fontSize: 18 }}>{p.flag}</Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: EX.white }}>{p.country}</Typography>
                      <Chip
                        label={`${p.agreements} treaties`}
                        size="small"
                        sx={{
                          fontSize: 8,
                          height: 15,
                          color: alpha(EX.gold, 0.7),
                          backgroundColor: alpha(EX.gold, 0.08),
                          border: 'none',
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.25 }}>
                      <Typography sx={{ fontSize: 10, color: EX.emerald }}>
                        ↑ ${p.exports}M
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: EX.blue }}>
                        ↓ ${p.imports}M
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: p.trend >= 0 ? EX.green : EX.red,
                      }}
                    >
                      {p.trend >= 0 ? '+' : ''}
                      {p.trend}%
                    </Typography>
                    <Typography sx={{ fontSize: 8, color: alpha(EX.silver, 0.4) }}>YoY</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </ExecCard>
        </Grid>

        {/* Export Sector Breakdown */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <ExecCard glow sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AssessmentOutlined sx={{ fontSize: 18, color: EX.gold }} />
              <Typography
                sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}
              >
                Export Sectors
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 10, color: EX.silver, mb: 1 }}>
              Contribution to national exports (USD millions)
            </Typography>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={TOP_EXPORT_SECTORS}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="transparent"
                >
                  {TOP_EXPORT_SECTORS.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <RTooltip
                  contentStyle={{
                    backgroundColor: EX.navyLight,
                    border: `1px solid ${EX.goldBorder}`,
                    borderRadius: 8,
                    fontSize: 11,
                    color: EX.white,
                  }}
                  formatter={(value) => [`$${value}M`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
              {TOP_EXPORT_SECTORS.map((s) => (
                <Box key={s.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: s.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 10, color: EX.silver, flex: 1 }}>{s.name}</Typography>
                  <Typography sx={{ fontSize: 10, color: EX.white, fontWeight: 600 }}>
                    {((s.value / totalExports) * 100).toFixed(0)}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </ExecCard>
        </Grid>

        {/* Regional Bloc Performance */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ExecCard glow sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Public sx={{ fontSize: 18, color: EX.gold }} />
              <Typography
                sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}
              >
                Regional Bloc Performance
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 10, color: EX.silver, mb: 2 }}>
              Intra-African trade by regional economic community
            </Typography>
            <ResponsiveContainer width="100%" height={160}>
              <RBarChart data={REGIONAL_BLOC_PERFORMANCE} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(EX.silver, 0.05)} horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: EX.silver }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <YAxis
                  type="category"
                  dataKey="bloc"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: EX.silver }}
                  width={55}
                />
                <RTooltip
                  contentStyle={{
                    backgroundColor: EX.navyLight,
                    border: `1px solid ${EX.goldBorder}`,
                    borderRadius: 8,
                    fontSize: 11,
                    color: EX.white,
                  }}
                  formatter={(value) => [`$${value}B`]}
                />
                <Bar dataKey="trade" name="Trade Volume" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {REGIONAL_BLOC_PERFORMANCE.map((entry, i) => (
                    <Cell
                      key={entry.bloc}
                      fill={[EX.gold, EX.emerald, EX.blue, EX.amber, alpha(EX.silver, 0.4)][i]}
                    />
                  ))}
                </Bar>
              </RBarChart>
            </ResponsiveContainer>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1.5 }}>
              {REGIONAL_BLOC_PERFORMANCE.map((b) => (
                <Box key={b.bloc} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 10, color: EX.silver }}>{b.bloc}</Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography sx={{ fontSize: 10, color: EX.green }}>+{b.growth}%</Typography>
                    <Typography sx={{ fontSize: 10, color: alpha(EX.silver, 0.5) }}>{b.share}% share</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </ExecCard>
        </Grid>
      </Grid>

      {/* ═══ Row 4: Policy Tracker ═══════════════════════════════════════ */}
      <ExecCard glow>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
          <Gavel sx={{ fontSize: 18, color: EX.gold }} />
          <Typography
            sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}
          >
            Policy & Treaty Implementation Tracker
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {POLICY_DIRECTIVES.map((p) => {
            const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG.active;
            return (
              <Box
                key={p.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  borderRadius: '10px',
                  border: `1px solid ${alpha(EX.silver, 0.06)}`,
                  background: alpha(EX.navyMid, 0.5),
                  '&:hover': { border: `1px solid ${EX.goldBorder}` },
                  transition: 'border-color 0.2s ease',
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip
                      label={p.category}
                      size="small"
                      sx={{
                        fontSize: 8,
                        height: 18,
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        color: EX.gold,
                        backgroundColor: alpha(EX.gold, 0.08),
                        border: 'none',
                      }}
                    />
                    <Chip
                      label={sc.label}
                      size="small"
                      sx={{
                        fontSize: 8,
                        height: 18,
                        fontWeight: 600,
                        color: sc.color,
                        backgroundColor: alpha(sc.color, 0.1),
                        border: 'none',
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: EX.white, lineHeight: 1.3 }}>
                    {p.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 60 }}>
                  <Schedule sx={{ fontSize: 12, color: alpha(EX.silver, 0.4) }} />
                  <Typography sx={{ fontSize: 10, color: EX.silver }}>{p.deadline}</Typography>
                </Box>
                <Box sx={{ minWidth: 120, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={p.progress}
                    sx={{
                      flex: 1,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: alpha(EX.gold, 0.08),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: p.progress >= 70
                          ? `linear-gradient(90deg, ${EX.emerald}, ${alpha(EX.emerald, 0.7)})`
                          : p.progress >= 40
                            ? `linear-gradient(90deg, ${EX.amber}, ${alpha(EX.amber, 0.7)})`
                            : `linear-gradient(90deg, ${EX.blue}, ${alpha(EX.blue, 0.7)})`,
                      },
                    }}
                  />
                  <Typography sx={{ fontSize: 10, color: EX.silver, fontWeight: 600, minWidth: 28, textAlign: 'right' }}>
                    {p.progress}%
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </ExecCard>

      {/* ═══ Footer Seal ═════════════════════════════════════════════════ */}
      <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: `1px solid ${EX.goldBorder}` }}>
        <Typography
          sx={{
            fontSize: 9,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: alpha(EX.gold, 0.4),
            fontWeight: 600,
          }}
        >
          Republic of Kenya — Ministry of Investments, Trade and Industry
        </Typography>
        <Typography sx={{ fontSize: 8, color: alpha(EX.silver, 0.25), mt: 0.5 }}>
          Classified — For Official Use Only — Powered by Smart Trade Africa
        </Typography>
      </Box>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </Box>
  );
}
