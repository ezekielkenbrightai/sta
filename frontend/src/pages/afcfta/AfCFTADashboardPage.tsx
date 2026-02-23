import { Box, Card, Chip, Grid, LinearProgress, Typography } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TimelineIcon from '@mui/icons-material/Timeline';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area,
} from 'recharts';

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const REGIONAL_COMPARISON = [
  { region: 'Europe', imports: 63.2, exports: 67.8 },
  { region: 'Asia', imports: 52.1, exports: 48.7 },
  { region: 'Americas', imports: 21.4, exports: 18.9 },
  { region: 'Africa', imports: 17.4, exports: 18.1 },
];

const RECS_DATA = [
  { rec: 'SADC', full: 'Southern African Development Community', intraPct: 23.1, growth: 5.2, corridor: 'South Africa ↔ Mozambique', volume: 31.2 },
  { rec: 'ECOWAS', full: 'Economic Community of West African States', intraPct: 9.8, growth: 12.4, corridor: 'Nigeria ↔ Ghana', volume: 22.4 },
  { rec: 'COMESA', full: 'Common Market for Eastern & Southern Africa', intraPct: 11.2, growth: 6.9, corridor: 'Kenya ↔ Egypt', volume: 14.8 },
  { rec: 'EAC', full: 'East African Community', intraPct: 21.3, growth: 8.7, corridor: 'Kenya ↔ Tanzania', volume: 8.2 },
  { rec: 'CEMAC', full: 'Central African Economic & Monetary Community', intraPct: 4.8, growth: 15.1, corridor: 'Cameroon ↔ DRC', volume: 3.6 },
];

const TOP_CORRIDORS = [
  { from: '🇿🇦 South Africa', to: '🇲🇿 Mozambique', volume: 4.2, growth: 6.8, products: 'Machinery, fuel, vehicles' },
  { from: '🇳🇬 Nigeria', to: '🇬🇭 Ghana', volume: 3.8, growth: 14.2, products: 'Petroleum, cement, food' },
  { from: '🇰🇪 Kenya', to: '🇹🇿 Tanzania', volume: 2.9, growth: 9.1, products: 'Tea, coffee, manufactures' },
  { from: '🇿🇦 South Africa', to: '🇧🇼 Botswana', volume: 2.7, growth: 4.3, products: 'Diamonds, machinery, food' },
  { from: '🇪🇬 Egypt', to: '🇰🇪 Kenya', volume: 2.4, growth: 11.6, products: 'Fertilizers, steel, ceramics' },
  { from: '🇳🇬 Nigeria', to: '🇨🇮 Cote d\'Ivoire', volume: 2.1, growth: 18.4, products: 'Petroleum, plastics, steel' },
  { from: '🇰🇪 Kenya', to: '🇺🇬 Uganda', volume: 1.9, growth: 7.2, products: 'Petroleum, iron, cement' },
  { from: '🇿🇦 South Africa', to: '🇿🇼 Zimbabwe', volume: 1.8, growth: 3.9, products: 'Fuel, machinery, chemicals' },
  { from: '🇹🇿 Tanzania', to: '🇷🇼 Rwanda', volume: 1.5, growth: 12.8, products: 'Cement, food, manufactures' },
  { from: '🇪🇹 Ethiopia', to: '🇩🇯 Djibouti', volume: 1.3, growth: 5.4, products: 'Coffee, oilseeds, textiles' },
];

const TARIFF_PROGRESS = [
  { label: 'Phase I — 90% of tariff lines', progress: 87.2, color: '#22C55E' },
  { label: 'Phase II — Sensitive products', progress: 42.8, color: '#E6A817' },
  { label: 'Phase III — Excluded products', progress: 12.4, color: '#EF4444' },
  { label: 'Overall AfCFTA Score', progress: 68.5, color: '#D4AF37' },
];

const MONTHLY_TRADE = [
  { month: 'Mar', actual: 6.8, target: 6.5 },
  { month: 'Apr', actual: 7.1, target: 6.6 },
  { month: 'May', actual: 6.9, target: 6.8 },
  { month: 'Jun', actual: 7.4, target: 7.0 },
  { month: 'Jul', actual: 7.2, target: 7.1 },
  { month: 'Aug', actual: 7.8, target: 7.2 },
  { month: 'Sep', actual: 7.6, target: 7.3 },
  { month: 'Oct', actual: 8.1, target: 7.4 },
  { month: 'Nov', actual: 8.3, target: 7.5 },
  { month: 'Dec', actual: 7.9, target: 7.6 },
  { month: 'Jan', actual: 8.5, target: 7.7 },
  { month: 'Feb', actual: 8.8, target: 7.8 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

const fmtB = (v: number) => `$${v.toFixed(1)}B`;

function StatCard({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: React.ReactNode }) {
  return (
    <Card sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography sx={{ fontSize: 12, color: '#b0b0b0', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Typography>
        <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</Box>
      </Box>
      <Typography sx={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: '#f0f0f0', lineHeight: 1 }}>{value}</Typography>
      <Typography sx={{ fontSize: 12, color: '#22C55E', mt: 0.5 }}>{sub}</Typography>
    </Card>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function AfCFTADashboardPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: "'Lora', serif", mb: 0.5 }}>
        AfCFTA Trade Monitor
      </Typography>
      <Typography sx={{ color: '#b0b0b0', fontSize: 14, mb: 3 }}>
        Tracking intra-African trade integration under the African Continental Free Trade Area
      </Typography>

      {/* ── KPI Cards ──────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Intra-African Trade Share" value="17.4%" sub="Target: 25% by 2030" color="#D4AF37" icon={<PublicIcon fontSize="small" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Total Intra-African Trade" value="$96.2B" sub="+14.2% YoY" color="#22C55E" icon={<TrendingUpIcon fontSize="small" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Active Trade Corridors" value="847" sub="43 country pairs" color="#3B82F6" icon={<CompareArrowsIcon fontSize="small" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Trade Growth Rate" value="+14.2%" sub="YoY intra-African" color="#8B5CF6" icon={<TimelineIcon fontSize="small" />} />
        </Grid>
      </Grid>

      {/* ── Row 2: Regional Comparison + RECs Table ─────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Intra-Regional Trade Comparison */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>Intra-Regional Trade Comparison</Typography>
            <Typography sx={{ fontSize: 11, color: '#777', mb: 2 }}>As % of total trade — imports &amp; exports (2025)</Typography>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={REGIONAL_COMPARISON} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" domain={[0, 80]} tick={{ fill: '#777', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="region" tick={{ fill: '#b0b0b0', fontSize: 12 }} width={70} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, fontSize: 12 }} formatter={(value) => `${value}%`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="exports" name="Exports" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={14} />
                <Bar dataKey="imports" name="Imports" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* RECs Performance */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Regional Economic Communities</Typography>
            {RECS_DATA.map((r) => (
              <Box key={r.rec} sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)', '&:last-child': { mb: 0, pb: 0, borderBottom: 'none' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{r.rec}</Typography>
                    <Typography sx={{ fontSize: 10, color: '#777' }}>{r.full}</Typography>
                  </Box>
                  <Chip label={`${r.intraPct}%`} size="small" sx={{ fontSize: 11, height: 22, backgroundColor: 'rgba(212,175,55,0.12)', color: '#D4AF37', fontWeight: 600 }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, fontSize: 11, color: '#b0b0b0' }}>
                  <span>Vol: ${r.volume}B</span>
                  <span style={{ color: '#22C55E' }}>+{r.growth}% YoY</span>
                  <span>{r.corridor}</span>
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>

      {/* ── Row 3: Top Corridors + Tariff Progress + Trade Growth ── */}
      <Grid container spacing={2}>
        {/* Top Trade Corridors */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Top 10 Intra-African Trade Corridors</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 600 }}>
                {/* Header */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '30px 1fr 1fr 80px 70px 1fr', gap: 1, pb: 1, borderBottom: '1px solid rgba(255,255,255,0.06)', mb: 1 }}>
                  {['#', 'From', 'To', 'Volume', 'Growth', 'Key Products'].map((h) => (
                    <Typography key={h} sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</Typography>
                  ))}
                </Box>
                {/* Rows */}
                {TOP_CORRIDORS.map((c, i) => (
                  <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '30px 1fr 1fr 80px 70px 1fr', gap: 1, py: 0.75, borderBottom: '1px solid rgba(255,255,255,0.03)', '&:hover': { bgcolor: 'rgba(212,175,55,0.04)' } }}>
                    <Typography sx={{ fontSize: 12, color: '#777' }}>{i + 1}</Typography>
                    <Typography sx={{ fontSize: 12 }}>{c.from}</Typography>
                    <Typography sx={{ fontSize: 12 }}>{c.to}</Typography>
                    <Typography sx={{ fontSize: 12, fontFamily: "'Lora', serif", fontWeight: 600 }}>{fmtB(c.volume)}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#22C55E' }}>+{c.growth}%</Typography>
                    <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{c.products}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right column: Tariff Progress + Trade Growth */}
        <Grid size={{ xs: 12, lg: 5 }}>
          {/* Tariff Liberalization */}
          <Card sx={{ p: 2.5, mb: 2 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Tariff Liberalization Progress</Typography>
            {TARIFF_PROGRESS.map((t) => (
              <Box key={t.label} sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{t.label}</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: t.color }}>{t.progress}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={t.progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    '& .MuiLinearProgress-bar': { backgroundColor: t.color, borderRadius: 3 },
                  }}
                />
              </Box>
            ))}
          </Card>

          {/* Monthly Trade Growth */}
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>Intra-African Trade Growth</Typography>
            <Typography sx={{ fontSize: 11, color: '#777', mb: 2 }}>Monthly volume ($B) — actual vs target</Typography>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={MONTHLY_TRADE} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#777', fontSize: 10 }} />
                <YAxis tick={{ fill: '#777', fontSize: 10 }} domain={[5, 10]} tickFormatter={(v) => `$${v}B`} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, fontSize: 12 }} formatter={(value) => `$${value}B`} />
                <Area type="monotone" dataKey="target" stroke="#555" strokeDasharray="4 4" fill="none" name="Target" />
                <Area type="monotone" dataKey="actual" stroke="#D4AF37" fill="rgba(212,175,55,0.15)" name="Actual" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
