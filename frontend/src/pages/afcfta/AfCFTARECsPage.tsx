import { Box, Card, Chip, Grid, Typography } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PublicIcon from '@mui/icons-material/Public';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const RECS = [
  {
    id: 'eac', name: 'East African Community', short: 'EAC', established: 2000, hq: 'Arusha, Tanzania',
    members: ['🇰🇪 Kenya', '🇹🇿 Tanzania', '🇺🇬 Uganda', '🇷🇼 Rwanda', '🇧🇮 Burundi', '🇨🇩 DRC', '🇸🇸 South Sudan'],
    intraPct: 21.3, growth: 8.7, volume: 8.2, topProducts: 'Tea, coffee, cement, petroleum, manufactures',
    quarterly: [
      { q: 'Q1 25', volume: 1.8 }, { q: 'Q2 25', volume: 2.0 }, { q: 'Q3 25', volume: 2.1 }, { q: 'Q4 25', volume: 2.3 },
    ],
  },
  {
    id: 'ecowas', name: 'Economic Community of West African States', short: 'ECOWAS', established: 1975, hq: 'Abuja, Nigeria',
    members: ['🇳🇬 Nigeria', '🇬🇭 Ghana', '🇸🇳 Senegal', '🇨🇮 Cote d\'Ivoire', '🇲🇱 Mali', '🇧🇫 Burkina Faso', '🇳🇪 Niger', '🇬🇳 Guinea', '🇹🇬 Togo', '🇧🇯 Benin', '🇸🇱 Sierra Leone', '🇱🇷 Liberia', '🇬🇲 Gambia', '🇬🇼 Guinea-Bissau', '🇨🇻 Cape Verde'],
    intraPct: 9.8, growth: 12.4, volume: 22.4, topProducts: 'Petroleum, food, cement, plastics, textiles',
    quarterly: [
      { q: 'Q1 25', volume: 5.0 }, { q: 'Q2 25', volume: 5.4 }, { q: 'Q3 25', volume: 5.6 }, { q: 'Q4 25', volume: 6.4 },
    ],
  },
  {
    id: 'comesa', name: 'Common Market for Eastern & Southern Africa', short: 'COMESA', established: 1994, hq: 'Lusaka, Zambia',
    members: ['🇰🇪 Kenya', '🇪🇬 Egypt', '🇪🇹 Ethiopia', '🇿🇲 Zambia', '🇿🇼 Zimbabwe', '🇲🇼 Malawi', '🇲🇺 Mauritius', '🇩🇯 Djibouti', '🇪🇷 Eritrea', '🇲🇬 Madagascar', '🇸🇩 Sudan', '🇱🇾 Libya', '🇹🇳 Tunisia'],
    intraPct: 11.2, growth: 6.9, volume: 14.8, topProducts: 'Fertilizers, steel, coffee, flowers, textiles',
    quarterly: [
      { q: 'Q1 25', volume: 3.4 }, { q: 'Q2 25', volume: 3.6 }, { q: 'Q3 25', volume: 3.8 }, { q: 'Q4 25', volume: 4.0 },
    ],
  },
  {
    id: 'sadc', name: 'Southern African Development Community', short: 'SADC', established: 1992, hq: 'Gaborone, Botswana',
    members: ['🇿🇦 South Africa', '🇲🇿 Mozambique', '🇧🇼 Botswana', '🇿🇼 Zimbabwe', '🇳🇦 Namibia', '🇿🇲 Zambia', '🇹🇿 Tanzania', '🇲🇼 Malawi', '🇦🇴 Angola', '🇨🇩 DRC', '🇲🇬 Madagascar', '🇲🇺 Mauritius', '🇸🇿 Eswatini', '🇱🇸 Lesotho', '🇸🇨 Seychelles', '🇰🇲 Comoros'],
    intraPct: 23.1, growth: 5.2, volume: 31.2, topProducts: 'Machinery, fuel, vehicles, diamonds, food',
    quarterly: [
      { q: 'Q1 25', volume: 7.2 }, { q: 'Q2 25', volume: 7.6 }, { q: 'Q3 25', volume: 7.9 }, { q: 'Q4 25', volume: 8.5 },
    ],
  },
  {
    id: 'cemac', name: 'Central African Economic & Monetary Community', short: 'CEMAC', established: 1994, hq: 'Bangui, CAR',
    members: ['🇨🇲 Cameroon', '🇨🇩 DRC', '🇬🇦 Gabon', '🇨🇬 Congo', '🇹🇩 Chad', '🇨🇫 CAR', '🇬🇶 Equatorial Guinea'],
    intraPct: 4.8, growth: 15.1, volume: 3.6, topProducts: 'Palm oil, timber, food, minerals',
    quarterly: [
      { q: 'Q1 25', volume: 0.7 }, { q: 'Q2 25', volume: 0.8 }, { q: 'Q3 25', volume: 0.9 }, { q: 'Q4 25', volume: 1.2 },
    ],
  },
];

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

export default function AfCFTARECsPage() {
  const totalVolume = RECS.reduce((s, r) => s + r.volume, 0);
  const totalMembers = new Set(RECS.flatMap((r) => r.members)).size;
  const avgGrowth = RECS.reduce((s, r) => s + r.growth, 0) / RECS.length;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: "'Lora', serif", mb: 0.5 }}>RECs Performance</Typography>
      <Typography sx={{ color: '#b0b0b0', fontSize: 14, mb: 3 }}>Regional Economic Communities — trade integration metrics</Typography>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="RECs Tracked" value={String(RECS.length)} sub="Major trade blocs" color="#D4AF37" icon={<GroupsIcon fontSize="small" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Combined Trade" value={`$${totalVolume.toFixed(1)}B`} sub="Intra-bloc trade" color="#22C55E" icon={<TrendingUpIcon fontSize="small" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Member States" value={String(totalMembers)} sub="Across all RECs" color="#3B82F6" icon={<PublicIcon fontSize="small" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Avg Growth" value={`+${avgGrowth.toFixed(1)}%`} sub="YoY average" color="#8B5CF6" icon={<AccountBalanceIcon fontSize="small" />} />
        </Grid>
      </Grid>

      {/* REC Cards */}
      {RECS.map((rec) => (
        <Card key={rec.id} sx={{ p: 2.5, mb: 2 }}>
          <Grid container spacing={2}>
            {/* Info */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Typography sx={{ fontSize: 18, fontFamily: "'Lora', serif", fontWeight: 700 }}>{rec.short}</Typography>
                <Chip label={`Est. ${rec.established}`} size="small" sx={{ fontSize: 9, height: 18, bgcolor: 'rgba(212,175,55,0.1)', color: '#D4AF37' }} />
                <Chip label={`${rec.intraPct}% intra-bloc`} size="small" sx={{ fontSize: 9, height: 18, bgcolor: 'rgba(34,197,94,0.1)', color: '#22C55E' }} />
              </Box>
              <Typography sx={{ fontSize: 13, color: '#b0b0b0', mb: 0.5 }}>{rec.name}</Typography>
              <Typography sx={{ fontSize: 11, color: '#777', mb: 1.5 }}>HQ: {rec.hq}</Typography>

              <Box sx={{ display: 'flex', gap: 3, mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Volume</Typography>
                  <Typography sx={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 700, color: '#D4AF37' }}>${rec.volume}B</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Growth</Typography>
                  <Typography sx={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 700, color: '#22C55E' }}>+{rec.growth}%</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Members</Typography>
                  <Typography sx={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 700, color: '#f0f0f0' }}>{rec.members.length}</Typography>
                </Box>
              </Box>

              <Typography sx={{ fontSize: 11, color: '#777', mb: 0.5 }}>Top Products: {rec.topProducts}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {rec.members.map((m) => (
                  <Chip key={m} label={m} size="small" sx={{ fontSize: 10, height: 20, bgcolor: 'rgba(255,255,255,0.05)', color: '#b0b0b0' }} />
                ))}
              </Box>
            </Grid>

            {/* Chart */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Typography sx={{ fontSize: 11, color: '#777', mb: 1 }}>Quarterly Trade Volume ($B)</Typography>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={rec.quarterly} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="q" tick={{ fill: '#777', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#777', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, fontSize: 12 }} formatter={(value) => `$${value}B`} />
                  <Bar dataKey="volume" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Card>
      ))}
    </Box>
  );
}
