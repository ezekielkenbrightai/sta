import { Box, Card, Chip, Grid, LinearProgress, Typography } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const PRODUCT_CATEGORIES = [
  { category: 'Agricultural Products', totalLines: 2840, liberalized: 2556, progress: 90.0, phase: 'Phase I', avgReduction: 72 },
  { category: 'Textiles & Clothing', totalLines: 1420, liberalized: 1135, progress: 79.9, phase: 'Phase I', avgReduction: 58 },
  { category: 'Machinery & Equipment', totalLines: 980, liberalized: 931, progress: 95.0, phase: 'Phase I', avgReduction: 85 },
  { category: 'Chemicals', totalLines: 760, liberalized: 684, progress: 90.0, phase: 'Phase I', avgReduction: 68 },
  { category: 'Motor Vehicles', totalLines: 340, liberalized: 204, progress: 60.0, phase: 'Phase II', avgReduction: 45 },
  { category: 'Petroleum Products', totalLines: 280, liberalized: 56, progress: 20.0, phase: 'Sensitive', avgReduction: 15 },
  { category: 'Minerals & Metals', totalLines: 520, liberalized: 468, progress: 90.0, phase: 'Phase I', avgReduction: 78 },
  { category: 'Electronics', totalLines: 640, liberalized: 608, progress: 95.0, phase: 'Phase I', avgReduction: 92 },
  { category: 'Sugar & Confectionery', totalLines: 180, liberalized: 54, progress: 30.0, phase: 'Sensitive', avgReduction: 20 },
  { category: 'Dairy Products', totalLines: 210, liberalized: 63, progress: 30.0, phase: 'Sensitive', avgReduction: 18 },
];

const COUNTRY_COMPLIANCE = [
  { country: '🇷🇼 Rwanda', compliance: 94.8, status: 'advanced', linesNotified: 7200, linesImplemented: 6826 },
  { country: '🇰🇪 Kenya', compliance: 92.1, status: 'on-track', linesNotified: 7200, linesImplemented: 6631 },
  { country: '🇬🇭 Ghana', compliance: 89.4, status: 'on-track', linesNotified: 7200, linesImplemented: 6437 },
  { country: '🇹🇿 Tanzania', compliance: 88.7, status: 'on-track', linesNotified: 7200, linesImplemented: 6386 },
  { country: '🇿🇦 South Africa', compliance: 86.2, status: 'on-track', linesNotified: 7200, linesImplemented: 6206 },
  { country: '🇳🇬 Nigeria', compliance: 78.3, status: 'behind', linesNotified: 7200, linesImplemented: 5638 },
  { country: '🇪🇬 Egypt', compliance: 74.6, status: 'behind', linesNotified: 7200, linesImplemented: 5371 },
  { country: '🇪🇹 Ethiopia', compliance: 72.4, status: 'behind', linesNotified: 7200, linesImplemented: 5213 },
  { country: '🇨🇩 DRC', compliance: 61.2, status: 'behind', linesNotified: 7200, linesImplemented: 4406 },
];

const TIMELINE = [
  { year: '2021', target: 90, actual: 42 },
  { year: '2022', target: 90, actual: 56 },
  { year: '2023', target: 90, actual: 68 },
  { year: '2024', target: 90, actual: 78 },
  { year: '2025', target: 90, actual: 87 },
  { year: '2026*', target: 90, actual: 90 },
  { year: '2027', target: 97, actual: 0 },
];

const phaseColor = (p: string) => {
  if (p === 'Phase I') return '#22C55E';
  if (p === 'Phase II') return '#3B82F6';
  if (p === 'Sensitive') return '#E6A817';
  return '#EF4444';
};

const statusColor = (s: string) => {
  if (s === 'advanced') return '#22C55E';
  if (s === 'on-track') return '#3B82F6';
  return '#E6A817';
};

function StatCard({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: React.ReactNode }) {
  return (
    <Card sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography sx={{ fontSize: 12, color: '#b0b0b0', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Typography>
        <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</Box>
      </Box>
      <Typography sx={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 700, color: '#f0f0f0', lineHeight: 1 }}>{value}</Typography>
      <Typography sx={{ fontSize: 12, color: '#22C55E', mt: 0.5 }}>{sub}</Typography>
    </Card>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function AfCFTATariffTrackerPage() {
  const totalLines = PRODUCT_CATEGORIES.reduce((s, p) => s + p.totalLines, 0);
  const totalLiberalized = PRODUCT_CATEGORIES.reduce((s, p) => s + p.liberalized, 0);
  const overallPct = ((totalLiberalized / totalLines) * 100).toFixed(1);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: "'Lora', serif", mb: 0.5 }}>Tariff Tracker</Typography>
      <Typography sx={{ color: '#b0b0b0', fontSize: 14, mb: 3 }}>AfCFTA tariff liberalization progress by product category and country</Typography>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Total Tariff Lines" value={totalLines.toLocaleString()} sub="Tracked across categories" color="#D4AF37" icon={<GavelIcon fontSize="small" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Lines Liberalized" value={totalLiberalized.toLocaleString()} sub={`${overallPct}% of total`} color="#22C55E" icon={<CheckCircleIcon fontSize="small" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Avg Tariff Reduction" value="59%" sub="Across all products" color="#3B82F6" icon={<TrendingDownIcon fontSize="small" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Target Year" value="2030" sub="Full Phase I completion" color="#8B5CF6" icon={<ScheduleIcon fontSize="small" />} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Product Categories */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Liberalization by Product Category</Typography>
            {PRODUCT_CATEGORIES.map((p) => (
              <Box key={p.category} sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: 12 }}>{p.category}</Typography>
                    <Chip label={p.phase} size="small" sx={{ fontSize: 8, height: 16, bgcolor: `${phaseColor(p.phase)}18`, color: phaseColor(p.phase) }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Typography sx={{ fontSize: 10, color: '#777' }}>{p.liberalized.toLocaleString()} / {p.totalLines.toLocaleString()}</Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: phaseColor(p.phase), minWidth: 40, textAlign: 'right' }}>{p.progress}%</Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={p.progress}
                  sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { bgcolor: phaseColor(p.phase), borderRadius: 3 } }}
                />
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Country Compliance */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Country Compliance</Typography>
            {COUNTRY_COMPLIANCE.map((c) => (
              <Box key={c.country} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, pb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)', '&:last-child': { mb: 0, pb: 0, borderBottom: 'none' } }}>
                <Typography sx={{ fontSize: 13, minWidth: 130 }}>{c.country}</Typography>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={c.compliance}
                    sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { bgcolor: statusColor(c.status), borderRadius: 3 } }}
                  />
                </Box>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: statusColor(c.status), minWidth: 45, textAlign: 'right' }}>{c.compliance}%</Typography>
                <Chip label={c.status} size="small" sx={{ fontSize: 8, height: 16, bgcolor: `${statusColor(c.status)}18`, color: statusColor(c.status), textTransform: 'capitalize' }} />
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>

      {/* Implementation Timeline */}
      <Card sx={{ p: 2.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>Implementation Timeline — Phase I Tariff Lines</Typography>
        <Typography sx={{ fontSize: 11, color: '#777', mb: 2 }}>% of tariff lines liberalized vs 90% target (* projected)</Typography>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={TIMELINE} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fill: '#b0b0b0', fontSize: 11 }} />
            <YAxis tick={{ fill: '#777', fontSize: 10 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, fontSize: 12 }} formatter={(value) => `${value}%`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="actual" name="Actual" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={28} />
            <Bar dataKey="target" name="Target" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
}
