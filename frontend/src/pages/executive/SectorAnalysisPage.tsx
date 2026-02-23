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
  PieChart as PieIcon,
  Factory,
  Agriculture,
  LocalShipping,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

const EX = {
  navy: '#0B1426',
  navyLight: '#0F1D35',
  navyMid: '#132240',
  gold: '#C9A84C',
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

const SECTORS = [
  {
    name: 'Agriculture & Horticulture',
    icon: <Agriculture sx={{ fontSize: 20 }} />,
    gdpContribution: 22.4,
    exportValue: '$4.8B',
    employment: '5.4M',
    growth: +8.2,
    competitiveness: 78,
    subsectors: [
      { name: 'Tea', value: 1820, growth: 6.3 },
      { name: 'Cut Flowers', value: 1240, growth: 11.8 },
      { name: 'Vegetables', value: 760, growth: 14.5 },
      { name: 'Coffee', value: 580, growth: -3.2 },
      { name: 'Fruits', value: 400, growth: 9.1 },
    ],
  },
  {
    name: 'Manufacturing & Industry',
    icon: <Factory sx={{ fontSize: 20 }} />,
    gdpContribution: 7.6,
    exportValue: '$2.1B',
    employment: '2.8M',
    growth: +12.4,
    competitiveness: 62,
    subsectors: [
      { name: 'Textiles & Apparel', value: 680, growth: 22.1 },
      { name: 'Cement & Construction', value: 420, growth: 18.9 },
      { name: 'Iron & Steel', value: 380, growth: 31.2 },
      { name: 'Plastics', value: 310, growth: 9.4 },
      { name: 'Chemicals', value: 280, growth: 7.8 },
    ],
  },
  {
    name: 'Logistics & Services',
    icon: <LocalShipping sx={{ fontSize: 20 }} />,
    gdpContribution: 8.2,
    exportValue: '$1.6B',
    employment: '1.2M',
    growth: +15.7,
    competitiveness: 71,
    subsectors: [
      { name: 'Transport & Freight', value: 580, growth: 14.2 },
      { name: 'ICT & BPO', value: 420, growth: 28.4 },
      { name: 'Financial Services', value: 340, growth: 11.1 },
      { name: 'Tourism & Hospitality', value: 180, growth: 22.3 },
      { name: 'Construction Services', value: 80, growth: 8.5 },
    ],
  },
];

const COMPETITIVENESS_RADAR = [
  { indicator: 'Market Access', kenya: 72, benchmark: 80 },
  { indicator: 'Infrastructure', kenya: 58, benchmark: 75 },
  { indicator: 'Customs Efficiency', kenya: 74, benchmark: 82 },
  { indicator: 'Trade Finance', kenya: 65, benchmark: 78 },
  { indicator: 'Digital Trade', kenya: 68, benchmark: 85 },
  { indicator: 'Regulatory', kenya: 71, benchmark: 77 },
];

const SEZ_ZONES = [
  { name: 'Naivasha SEZ', sector: 'Textiles', jobs: 12400, exports: 340, utilization: 78 },
  { name: 'Dongo Kundu (Mombasa)', sector: 'Manufacturing', jobs: 8200, exports: 180, utilization: 45 },
  { name: 'Kisumu Lakeside EPZ', sector: 'Agro-processing', jobs: 3800, exports: 95, utilization: 62 },
  { name: 'Eldoret Logistics Hub', sector: 'Logistics', jobs: 2100, exports: 120, utilization: 38 },
];

const SECTOR_COLORS = [EX.gold, EX.emerald, EX.blue, EX.amber, '#A78BFA'];

export default function SectorAnalysisPage() {
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
        <Typography sx={{ fontSize: 10, fontWeight: 600, color: EX.gold, letterSpacing: '0.2em', textTransform: 'uppercase', mb: 0.25 }}>
          Strategic Intelligence
        </Typography>
        <Typography variant="h4" sx={{ fontFamily: "'Lora', serif", fontWeight: 700, color: EX.white, fontSize: { xs: 22, md: 28 } }}>
          Sector Analysis & Competitiveness
        </Typography>
        <Typography sx={{ fontSize: 12, color: EX.silver, mt: 0.5 }}>
          Detailed sectoral trade performance, export competitiveness benchmarking, and Special Economic Zone monitoring.
        </Typography>
      </Box>

      {/* Sector Cards */}
      {SECTORS.map((sector) => (
        <Card key={sector.name} sx={{ background: EX.gradientCard, border: `1px solid ${EX.goldBorder}`, borderRadius: '14px', p: 2.5, mb: 2.5, position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: EX.gradientGold } }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ color: EX.gold }}>{sector.icon}</Box>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}>
                  {sector.name}
                </Typography>
              </Box>
              <Grid container spacing={1}>
                {[
                  { label: 'GDP Share', value: `${sector.gdpContribution}%` },
                  { label: 'Export Value', value: sector.exportValue },
                  { label: 'Employment', value: sector.employment },
                  { label: 'Growth', value: `${sector.growth > 0 ? '+' : ''}${sector.growth}%`, color: sector.growth >= 0 ? EX.green : EX.red },
                ].map((s) => (
                  <Grid size={6} key={s.label}>
                    <Box sx={{ p: 1, borderRadius: '8px', border: `1px solid ${alpha(EX.silver, 0.06)}`, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: 9, color: EX.silver, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</Typography>
                      <Typography sx={{ fontSize: 16, fontWeight: 700, color: s.color || EX.white, fontFamily: "'Lora', serif" }}>{s.value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 10, color: EX.silver }}>Competitiveness Score</Typography>
                  <Typography sx={{ fontSize: 10, fontWeight: 600, color: sector.competitiveness >= 70 ? EX.emerald : EX.amber }}>{sector.competitiveness}/100</Typography>
                </Box>
                <LinearProgress variant="determinate" value={sector.competitiveness} sx={{ height: 5, borderRadius: 3, backgroundColor: alpha(EX.gold, 0.08), '& .MuiLinearProgress-bar': { borderRadius: 3, background: sector.competitiveness >= 70 ? EX.emerald : EX.amber } }} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: EX.silver, mb: 1 }}>Sub-Sector Export Performance (USD Millions)</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={sector.subsectors} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(EX.silver, 0.05)} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: EX.silver }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: EX.silver }} tickFormatter={(v) => `$${v}M`} />
                  <RTooltip contentStyle={{ backgroundColor: EX.navyLight, border: `1px solid ${EX.goldBorder}`, borderRadius: 8, fontSize: 11, color: EX.white }} formatter={(value) => [`$${value}M`]} />
                  <Bar dataKey="value" name="Export Value" radius={[4, 4, 0, 0]} maxBarSize={28}>
                    {sector.subsectors.map((_, i) => (
                      <Bar key={i} dataKey="value" fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Card>
      ))}

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {/* Competitiveness Radar */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ background: EX.gradientCard, border: `1px solid ${EX.goldBorder}`, borderRadius: '14px', p: 2.5, height: '100%', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: EX.gradientGold } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PieIcon sx={{ fontSize: 18, color: EX.gold }} />
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}>
                Trade Competitiveness Benchmark
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 10, color: EX.silver, mb: 1 }}>Kenya vs African Peer Average</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={COMPETITIVENESS_RADAR} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke={alpha(EX.silver, 0.1)} />
                <PolarAngleAxis dataKey="indicator" tick={{ fontSize: 9, fill: EX.silver }} />
                <PolarRadiusAxis tick={{ fontSize: 8, fill: EX.silver }} domain={[0, 100]} />
                <Radar name="Kenya" dataKey="kenya" stroke={EX.gold} fill={alpha(EX.gold, 0.2)} strokeWidth={2} />
                <Radar name="Peer Avg" dataKey="benchmark" stroke={alpha(EX.silver, 0.4)} fill={alpha(EX.silver, 0.05)} strokeWidth={1} strokeDasharray="4 4" />
              </RadarChart>
            </ResponsiveContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 3, borderRadius: 1, backgroundColor: EX.gold }} />
                <Typography sx={{ fontSize: 10, color: EX.silver }}>Kenya</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 3, borderRadius: 1, backgroundColor: alpha(EX.silver, 0.4), borderStyle: 'dashed' }} />
                <Typography sx={{ fontSize: 10, color: EX.silver }}>Peer Average</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* SEZ Performance */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ background: EX.gradientCard, border: `1px solid ${EX.goldBorder}`, borderRadius: '14px', p: 2.5, height: '100%', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: EX.gradientGold } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Factory sx={{ fontSize: 18, color: EX.gold }} />
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}>
                Special Economic Zones Performance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {SEZ_ZONES.map((z) => (
                <Box key={z.name} sx={{ p: 1.5, borderRadius: '10px', border: `1px solid ${alpha(EX.silver, 0.06)}`, background: alpha(EX.navyMid, 0.5) }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: EX.white }}>{z.name}</Typography>
                      <Chip label={z.sector} size="small" sx={{ fontSize: 8, height: 16, color: EX.gold, backgroundColor: alpha(EX.gold, 0.08), border: 'none', mt: 0.25 }} />
                    </Box>
                    <Typography sx={{ fontSize: 10, color: z.utilization >= 60 ? EX.emerald : EX.amber, fontWeight: 600 }}>
                      {z.utilization}% utilized
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 9, color: alpha(EX.silver, 0.5), textTransform: 'uppercase' }}>Jobs Created</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: EX.white }}>{z.jobs.toLocaleString()}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 9, color: alpha(EX.silver, 0.5), textTransform: 'uppercase' }}>Exports (USD M)</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: EX.emerald }}>${z.exports}M</Typography>
                    </Grid>
                    <Grid size={4}>
                      <LinearProgress variant="determinate" value={z.utilization} sx={{ mt: 1, height: 5, borderRadius: 3, backgroundColor: alpha(EX.gold, 0.08), '& .MuiLinearProgress-bar': { borderRadius: 3, background: z.utilization >= 60 ? EX.emerald : EX.amber } }} />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: `1px solid ${EX.goldBorder}` }}>
        <Typography sx={{ fontSize: 8, color: alpha(EX.silver, 0.25) }}>
          Classified — For Official Use Only — Powered by Smart Trade Africa
        </Typography>
      </Box>
    </Box>
  );
}
