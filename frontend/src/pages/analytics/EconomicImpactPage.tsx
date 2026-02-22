import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  ShowChart,
  Factory,
  Public,
  TrendingUp,
  WorkOutline,
  MonetizationOn,
  Assessment,
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

// --- Mock data ---------------------------------------------------------------

interface SectorContribution {
  sector: string;
  gdpShare: number;
  tradeValue_usd: number;
  employment: number;
  growth: number;
  color: string;
}

interface RegionalImpact {
  region: string;
  flag: string;
  gdpContribution_usd: number;
  tradeVolume_usd: number;
  employment: number;
  fdi_usd: number;
  yoyGrowth: number;
}

interface GDPGrowthYear {
  year: string;
  totalGDP_growth: number;
  tradeFacilitation_growth: number;
  tradeFacilitation_share: number;
}

interface KPI {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: React.ReactNode;
}

const SECTORS: SectorContribution[] = [
  { sector: 'Agriculture & Agri-processing', gdpShare: 23.4, tradeValue_usd: 4_200_000_000, employment: 2_340_000, growth: 6.2, color: '#22C55E' },
  { sector: 'Manufacturing & Industry', gdpShare: 18.7, tradeValue_usd: 3_100_000_000, employment: 1_870_000, growth: 8.4, color: '#3B82F6' },
  { sector: 'Mining & Extractives', gdpShare: 12.1, tradeValue_usd: 2_800_000_000, employment: 420_000, growth: 4.1, color: '#D4AF37' },
  { sector: 'Services & ICT', gdpShare: 31.2, tradeValue_usd: 1_900_000_000, employment: 3_120_000, growth: 11.3, color: '#8B5CF6' },
  { sector: 'Transport & Logistics', gdpShare: 8.4, tradeValue_usd: 1_200_000_000, employment: 890_000, growth: 7.8, color: '#E6A817' },
  { sector: 'Energy & Utilities', gdpShare: 6.2, tradeValue_usd: 980_000_000, employment: 210_000, growth: 9.5, color: '#EF4444' },
];

const REGIONS: RegionalImpact[] = [
  { region: 'Nairobi Metro', flag: '🇰🇪', gdpContribution_usd: 8_400_000_000, tradeVolume_usd: 5_200_000_000, employment: 1_420_000, fdi_usd: 1_200_000_000, yoyGrowth: 12.4 },
  { region: 'Mombasa & Coast', flag: '🇰🇪', gdpContribution_usd: 3_100_000_000, tradeVolume_usd: 4_800_000_000, employment: 680_000, fdi_usd: 450_000_000, yoyGrowth: 8.7 },
  { region: 'Dar es Salaam', flag: '🇹🇿', gdpContribution_usd: 4_200_000_000, tradeVolume_usd: 3_900_000_000, employment: 920_000, fdi_usd: 620_000_000, yoyGrowth: 10.2 },
  { region: 'Kampala & Central', flag: '🇺🇬', gdpContribution_usd: 2_100_000_000, tradeVolume_usd: 1_800_000_000, employment: 540_000, fdi_usd: 280_000_000, yoyGrowth: 7.3 },
  { region: 'Addis Ababa', flag: '🇪🇹', gdpContribution_usd: 3_800_000_000, tradeVolume_usd: 2_400_000_000, employment: 780_000, fdi_usd: 890_000_000, yoyGrowth: 14.6 },
  { region: 'Kigali', flag: '🇷🇼', gdpContribution_usd: 1_200_000_000, tradeVolume_usd: 890_000_000, employment: 310_000, fdi_usd: 340_000_000, yoyGrowth: 18.2 },
];

const GDP_GROWTH: GDPGrowthYear[] = [
  { year: '2021', totalGDP_growth: 4.2, tradeFacilitation_growth: 1.1, tradeFacilitation_share: 26.2 },
  { year: '2022', totalGDP_growth: 5.1, tradeFacilitation_growth: 1.6, tradeFacilitation_share: 31.4 },
  { year: '2023', totalGDP_growth: 5.4, tradeFacilitation_growth: 1.9, tradeFacilitation_share: 35.2 },
  { year: '2024', totalGDP_growth: 5.8, tradeFacilitation_growth: 2.3, tradeFacilitation_share: 39.7 },
  { year: '2025', totalGDP_growth: 6.2, tradeFacilitation_growth: 2.8, tradeFacilitation_share: 45.2 },
  { year: '2026 (P)', totalGDP_growth: 6.7, tradeFacilitation_growth: 3.2, tradeFacilitation_share: 47.8 },
];

function fmtB(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`;
  return `$${(v / 1000).toFixed(0)}K`;
}

function fmtK(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return String(v);
}

// --- Page --------------------------------------------------------------------

export default function EconomicImpactPage() {
  const totalTradeGDP = SECTORS.reduce((s, sec) => s + sec.tradeValue_usd, 0);
  const totalEmployment = SECTORS.reduce((s, sec) => s + sec.employment, 0);
  const totalFDI = REGIONS.reduce((s, r) => s + r.fdi_usd, 0);
  const latestGDP = GDP_GROWTH[GDP_GROWTH.length - 1];

  const kpis: KPI[] = [
    { label: 'Trade Contribution to GDP', value: fmtB(totalTradeGDP), sub: '32.4% of regional GDP', color: '#D4AF37', icon: <ShowChart sx={{ fontSize: 18, color: '#D4AF37' }} /> },
    { label: 'Employment Impact', value: fmtK(totalEmployment), sub: 'Direct trade-related jobs', color: '#22C55E', icon: <WorkOutline sx={{ fontSize: 18, color: '#22C55E' }} /> },
    { label: 'FDI Attracted', value: fmtB(totalFDI), sub: '+22.3% YoY increase', color: '#3B82F6', icon: <MonetizationOn sx={{ fontSize: 18, color: '#3B82F6' }} /> },
    { label: 'GDP Multiplier', value: `${latestGDP.tradeFacilitation_share}%`, sub: 'Trade facilitation share of growth', color: '#8B5CF6', icon: <TrendingUp sx={{ fontSize: 18, color: '#8B5CF6' }} /> },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Assessment sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">GDP Impact Analysis</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Economic impact of trade facilitation on GDP growth, employment, and foreign direct investment across East Africa.
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

      <Grid container spacing={2}>
        {/* Sector Contribution Breakdown */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <Factory sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Sector Contribution Breakdown
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {SECTORS.map((sec) => (
                <Box key={sec.sector} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: sec.color }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{sec.sector}</Typography>
                    </Box>
                    <Chip
                      label={`+${sec.growth}% YoY`}
                      size="small"
                      sx={{ fontSize: 9, height: 16, color: '#22C55E', backgroundColor: 'rgba(34,197,94,0.08)' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <LinearProgress
                      variant="determinate"
                      value={sec.gdpShare}
                      sx={{
                        flex: 1, height: 8, borderRadius: 4,
                        backgroundColor: 'rgba(212,175,55,0.08)',
                        '& .MuiLinearProgress-bar': { backgroundColor: sec.color, borderRadius: 4 },
                      }}
                    />
                    <Typography sx={{ fontSize: 11, color: '#888', fontFamily: 'monospace', minWidth: 40, textAlign: 'right' }}>{sec.gdpShare}%</Typography>
                  </Box>
                  <Grid container spacing={1.5}>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>GDP Share</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{sec.gdpShare}%</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Trade Value</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{fmtB(sec.tradeValue_usd)}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Employment</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{fmtK(sec.employment)} jobs</Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* YoY GDP Growth */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                GDP Growth Attributable to Trade Facilitation
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={GDP_GROWTH} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(212,175,55,0.06)" strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={(v: number) => `${v}%`}
                    tick={{ fill: '#555', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8 }}
                    labelStyle={{ color: '#D4AF37' }}
                    itemStyle={{ color: '#b0b0b0' }}
                    formatter={(value: number) => [`${value}%`]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 10, color: '#555' }}
                    iconSize={10}
                  />
                  <Bar dataKey="totalGDP_growth" name="Total GDP Growth" stackId="gdp" fill="#D4AF37" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="tradeFacilitation_growth" name="Trade Facilitation" stackId="gdp" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Regional Economic Impact */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <Public sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Regional Economic Impact
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {REGIONS.map((r) => (
                  <Box key={r.region} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.03)' }}>
                    <Typography sx={{ fontSize: 14 }}>{r.flag}</Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 12, color: '#e0e0e0', fontWeight: 500 }}>{r.region}</Typography>
                        <Chip label={`+${r.yoyGrowth}%`} size="small" sx={{ fontSize: 9, height: 16, color: '#22C55E', backgroundColor: 'rgba(34,197,94,0.08)' }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5, mt: 0.25 }}>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>GDP: {fmtB(r.gdpContribution_usd)}</Typography>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>FDI: {fmtB(r.fdi_usd)}</Typography>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>Jobs: {fmtK(r.employment)}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>
                      {fmtB(r.tradeVolume_usd)}
                    </Typography>
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
