import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  Handshake,
  Flag,
  Gavel,
  TrendingUp,
  Timeline,
  Public,
  CompareArrows,
  CheckCircle,
} from '@mui/icons-material';

// --- Mock data ---------------------------------------------------------------

interface CountryScorecard {
  country: string;
  flag: string;
  utilizationRate: number;
  tariffLinesLiberalized: number;
  rooCompliance: number;
  intraAfricanTrade: number;
  status: 'on-track' | 'behind' | 'advanced';
}

interface TariffCategory {
  category: string;
  totalLines: number;
  liberalized: number;
  progress: number;
  targetYear: string;
  color: string;
}

interface TradeAnalysis {
  sector: string;
  tradeCreation_usd: number;
  tradeDiversion_usd: number;
  netEffect_usd: number;
  jobs: number;
}

interface Milestone {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}

interface KPI {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: React.ReactNode;
}

const COUNTRY_SCORECARDS: CountryScorecard[] = [
  { country: 'Kenya', flag: '🇰🇪', utilizationRate: 68.4, tariffLinesLiberalized: 92.1, rooCompliance: 87.3, intraAfricanTrade: 42.1, status: 'on-track' },
  { country: 'Tanzania', flag: '🇹🇿', utilizationRate: 54.2, tariffLinesLiberalized: 88.7, rooCompliance: 81.6, intraAfricanTrade: 38.4, status: 'on-track' },
  { country: 'Uganda', flag: '🇺🇬', utilizationRate: 47.8, tariffLinesLiberalized: 85.3, rooCompliance: 79.2, intraAfricanTrade: 51.2, status: 'behind' },
  { country: 'Ethiopia', flag: '🇪🇹', utilizationRate: 31.5, tariffLinesLiberalized: 72.4, rooCompliance: 68.9, intraAfricanTrade: 22.7, status: 'behind' },
  { country: 'Rwanda', flag: '🇷🇼', utilizationRate: 72.1, tariffLinesLiberalized: 94.8, rooCompliance: 91.4, intraAfricanTrade: 48.6, status: 'advanced' },
  { country: 'DRC', flag: '🇨🇩', utilizationRate: 24.3, tariffLinesLiberalized: 61.2, rooCompliance: 54.7, intraAfricanTrade: 18.9, status: 'behind' },
  { country: 'Burundi', flag: '🇧🇮', utilizationRate: 38.7, tariffLinesLiberalized: 78.9, rooCompliance: 72.1, intraAfricanTrade: 44.3, status: 'on-track' },
  { country: 'South Sudan', flag: '🇸🇸', utilizationRate: 12.8, tariffLinesLiberalized: 42.1, rooCompliance: 38.4, intraAfricanTrade: 8.6, status: 'behind' },
];

const TARIFF_CATEGORIES: TariffCategory[] = [
  { category: 'Agricultural Products', totalLines: 1_842, liberalized: 1_620, progress: 88.0, targetYear: '2027', color: '#22C55E' },
  { category: 'Textiles & Apparel', totalLines: 1_254, liberalized: 1_078, progress: 86.0, targetYear: '2027', color: '#3B82F6' },
  { category: 'Machinery & Equipment', totalLines: 2_108, liberalized: 1_897, progress: 90.0, targetYear: '2026', color: '#D4AF37' },
  { category: 'Chemicals & Pharmaceuticals', totalLines: 1_432, liberalized: 1_160, progress: 81.0, targetYear: '2028', color: '#8B5CF6' },
  { category: 'Motor Vehicles & Parts', totalLines: 876, liberalized: 614, progress: 70.1, targetYear: '2029', color: '#E6A817' },
  { category: 'Petroleum & Energy', totalLines: 342, liberalized: 232, progress: 67.8, targetYear: '2030', color: '#EF4444' },
  { category: 'Minerals & Metals', totalLines: 1_098, liberalized: 934, progress: 85.1, targetYear: '2027', color: '#06B6D4' },
  { category: 'Electronics & ICT', totalLines: 764, liberalized: 695, progress: 91.0, targetYear: '2026', color: '#F97316' },
];

const TRADE_ANALYSIS: TradeAnalysis[] = [
  { sector: 'Agriculture', tradeCreation_usd: 420_000_000, tradeDiversion_usd: 85_000_000, netEffect_usd: 335_000_000, jobs: 45_000 },
  { sector: 'Manufacturing', tradeCreation_usd: 680_000_000, tradeDiversion_usd: 210_000_000, netEffect_usd: 470_000_000, jobs: 62_000 },
  { sector: 'Mining & Minerals', tradeCreation_usd: 310_000_000, tradeDiversion_usd: 120_000_000, netEffect_usd: 190_000_000, jobs: 18_000 },
  { sector: 'Services & ICT', tradeCreation_usd: 540_000_000, tradeDiversion_usd: 45_000_000, netEffect_usd: 495_000_000, jobs: 78_000 },
  { sector: 'Textiles', tradeCreation_usd: 280_000_000, tradeDiversion_usd: 160_000_000, netEffect_usd: 120_000_000, jobs: 34_000 },
  { sector: 'Pharmaceuticals', tradeCreation_usd: 190_000_000, tradeDiversion_usd: 30_000_000, netEffect_usd: 160_000_000, jobs: 12_000 },
];

const MILESTONES: Milestone[] = [
  { date: 'Jan 2021', title: 'AfCFTA Trading Begins', description: 'Official start of trading under AfCFTA preferential terms', status: 'completed' },
  { date: 'Jul 2022', title: 'Pan-African Payment System Launch', description: 'PAPSS launched to facilitate intra-African trade payments', status: 'completed' },
  { date: 'Jan 2023', title: 'Phase I Protocols Adopted', description: 'Trade in goods, services, and dispute settlement protocols', status: 'completed' },
  { date: 'Jun 2024', title: 'Phase II Negotiations Complete', description: 'Investment, competition policy, and IP rights protocols', status: 'completed' },
  { date: 'Jan 2025', title: 'EAC Tariff Harmonization', description: 'East African Community completes 90% tariff line liberalization', status: 'completed' },
  { date: 'Mar 2026', title: 'Digital Trade Protocol', description: 'E-commerce and digital trade facilitation framework adoption', status: 'in-progress' },
  { date: 'Jul 2026', title: 'Phase III Negotiations', description: 'E-commerce protocol and guided trade initiative expansion', status: 'upcoming' },
  { date: 'Jan 2027', title: 'Full Tariff Liberalization Target', description: '97% of tariff lines to be liberalized across all members', status: 'upcoming' },
];

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  'on-track': { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  'behind': { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  'advanced': { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  'completed': { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  'in-progress': { color: '#D4AF37', bg: 'rgba(212,175,55,0.08)' },
  'upcoming': { color: '#555', bg: 'rgba(85,85,85,0.08)' },
};

function fmtM(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`;
  return `$${(v / 1000).toFixed(0)}K`;
}

// --- Page --------------------------------------------------------------------

export default function AfCFTAProgressPage() {
  const avgUtilization = (COUNTRY_SCORECARDS.reduce((s, c) => s + c.utilizationRate, 0) / COUNTRY_SCORECARDS.length).toFixed(1);
  const avgLiberalized = (TARIFF_CATEGORIES.reduce((s, t) => s + t.progress, 0) / TARIFF_CATEGORIES.length).toFixed(1);
  const avgROO = (COUNTRY_SCORECARDS.reduce((s, c) => s + c.rooCompliance, 0) / COUNTRY_SCORECARDS.length).toFixed(1);
  const avgIntraAfrican = (COUNTRY_SCORECARDS.reduce((s, c) => s + c.intraAfricanTrade, 0) / COUNTRY_SCORECARDS.length).toFixed(1);

  const kpis: KPI[] = [
    { label: 'AfCFTA Utilization Rate', value: `${avgUtilization}%`, sub: 'Avg across EAC members', color: '#D4AF37', icon: <Handshake sx={{ fontSize: 18, color: '#D4AF37' }} /> },
    { label: 'Tariff Lines Liberalized', value: `${avgLiberalized}%`, sub: 'Avg progress to target', color: '#22C55E', icon: <Gavel sx={{ fontSize: 18, color: '#22C55E' }} /> },
    { label: 'Rules of Origin Compliance', value: `${avgROO}%`, sub: 'Avg ROO compliance rate', color: '#3B82F6', icon: <Flag sx={{ fontSize: 18, color: '#3B82F6' }} /> },
    { label: 'Intra-African Trade', value: `${avgIntraAfrican}%`, sub: 'Share of total trade', color: '#8B5CF6', icon: <CompareArrows sx={{ fontSize: 18, color: '#8B5CF6' }} /> },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Public sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">AfCFTA Progress</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          African Continental Free Trade Area implementation tracking, tariff liberalization, and trade facilitation progress.
        </Typography>
      </Box>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((k) => (
          <Grid size={{ xs: 6, md: 3 }} key={k.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                {k.icon}
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{k.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: k.color }}>{k.value}</Typography>
              <Typography sx={{ fontSize: 11, color: '#777' }}>{k.sub}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Country Participation Scorecard */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <Flag sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Country Participation Scorecard (East Africa)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {COUNTRY_SCORECARDS.map((c) => {
                const sc = STATUS_COLORS[c.status];
                return (
                  <Box key={c.country} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 16 }}>{c.flag}</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{c.country}</Typography>
                      </Box>
                      <Chip
                        label={c.status}
                        size="small"
                        sx={{ fontSize: 9, height: 16, color: sc.color, backgroundColor: sc.bg, textTransform: 'capitalize' }}
                      />
                    </Box>
                    <Grid container spacing={1.5}>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Utilization</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: c.utilizationRate >= 60 ? '#22C55E' : c.utilizationRate >= 40 ? '#E6A817' : '#EF4444', fontFamily: 'monospace' }}>
                          {c.utilizationRate}%
                        </Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Tariff Lines</Typography>
                        <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace' }}>{c.tariffLinesLiberalized}%</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>ROO Compliance</Typography>
                        <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace' }}>{c.rooCompliance}%</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Intra-African</Typography>
                        <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace' }}>{c.intraAfricanTrade}%</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Tariff Reduction Progress + Milestones */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Tariff Reduction Progress */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <Gavel sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Tariff Reduction by Product Category
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {TARIFF_CATEGORIES.map((t) => (
                  <Box key={t.category} sx={{ pb: 1, borderBottom: '1px solid rgba(212,175,55,0.03)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography sx={{ fontSize: 11, color: '#e0e0e0', fontWeight: 500 }}>{t.category}</Typography>
                      <Typography sx={{ fontSize: 9, color: '#555' }}>Target: {t.targetYear}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={t.progress}
                        sx={{
                          flex: 1, height: 6, borderRadius: 3,
                          backgroundColor: 'rgba(212,175,55,0.08)',
                          '& .MuiLinearProgress-bar': { backgroundColor: t.color, borderRadius: 3 },
                        }}
                      />
                      <Typography sx={{ fontSize: 10, color: '#888', fontFamily: 'monospace', minWidth: 40, textAlign: 'right' }}>
                        {t.progress}%
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 9, color: '#555', mt: 0.25 }}>
                      {t.liberalized.toLocaleString()} / {t.totalLines.toLocaleString()} tariff lines
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Milestones Timeline */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <Timeline sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Key Milestones
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {MILESTONES.map((m, i) => {
                  const mc = STATUS_COLORS[m.status];
                  return (
                    <Box key={i} sx={{ display: 'flex', gap: 1.5, py: 0.75 }}>
                      {/* Timeline line + dot */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16, flexShrink: 0 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: mc.color, border: m.status === 'in-progress' ? '2px solid #D4AF37' : 'none' }} />
                        {i < MILESTONES.length - 1 && (
                          <Box sx={{ width: 1, flex: 1, backgroundColor: 'rgba(212,175,55,0.1)', minHeight: 20 }} />
                        )}
                      </Box>
                      <Box sx={{ flex: 1, pb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                          <Typography sx={{ fontSize: 10, color: '#777', fontFamily: 'monospace' }}>{m.date}</Typography>
                          {m.status === 'completed' && <CheckCircle sx={{ fontSize: 10, color: '#22C55E' }} />}
                        </Box>
                        <Typography sx={{ fontSize: 12, color: m.status === 'upcoming' ? '#555' : '#e0e0e0', fontWeight: 500 }}>
                          {m.title}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: '#555', lineHeight: 1.3 }}>
                          {m.description}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Trade Creation vs Trade Diversion */}
      <Card sx={{ p: 2.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
          <TrendingUp sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
          Trade Creation vs Trade Diversion Analysis
        </Typography>
        <Grid container spacing={2}>
          {TRADE_ANALYSIS.map((t) => {
            const creationPct = (t.tradeCreation_usd / (t.tradeCreation_usd + t.tradeDiversion_usd)) * 100;
            return (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={t.sector}>
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.06)' }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', mb: 1 }}>{t.sector}</Typography>

                  {/* Stacked bar */}
                  <Box sx={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', mb: 1 }}>
                    <Box sx={{ width: `${creationPct}%`, backgroundColor: '#22C55E' }} />
                    <Box sx={{ width: `${100 - creationPct}%`, backgroundColor: '#EF4444' }} />
                  </Box>

                  <Grid container spacing={1}>
                    <Grid size={6}>
                      <Typography sx={{ fontSize: 9, color: '#22C55E', textTransform: 'uppercase' }}>Creation</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace' }}>{fmtM(t.tradeCreation_usd)}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography sx={{ fontSize: 9, color: '#EF4444', textTransform: 'uppercase' }}>Diversion</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace' }}>{fmtM(t.tradeDiversion_usd)}</Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75, pt: 0.75, borderTop: '1px solid rgba(212,175,55,0.05)' }}>
                    <Typography sx={{ fontSize: 10, color: '#777' }}>Net Effect: <Box component="span" sx={{ color: '#22C55E', fontFamily: 'monospace' }}>{fmtM(t.netEffect_usd)}</Box></Typography>
                    <Typography sx={{ fontSize: 10, color: '#777' }}>{t.jobs.toLocaleString()} jobs</Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Card>
    </Box>
  );
}
