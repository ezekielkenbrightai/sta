import { useState } from 'react';
import { Box, Card, Chip, Grid, TextField, Typography, MenuItem } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PublicIcon from '@mui/icons-material/Public';

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const ALL_CORRIDORS = [
  { from: '🇿🇦 South Africa', to: '🇲🇿 Mozambique', rec: 'SADC', volume: 4200, growth: 6.8, products: 'Machinery, fuel, vehicles', mode: 'Road/Rail', status: 'active' },
  { from: '🇳🇬 Nigeria', to: '🇬🇭 Ghana', rec: 'ECOWAS', volume: 3800, growth: 14.2, products: 'Petroleum, cement, food', mode: 'Sea', status: 'active' },
  { from: '🇰🇪 Kenya', to: '🇹🇿 Tanzania', rec: 'EAC', volume: 2900, growth: 9.1, products: 'Tea, coffee, manufactures', mode: 'Road', status: 'active' },
  { from: '🇿🇦 South Africa', to: '🇧🇼 Botswana', rec: 'SADC', volume: 2700, growth: 4.3, products: 'Diamonds, machinery, food', mode: 'Road/Rail', status: 'active' },
  { from: '🇪🇬 Egypt', to: '🇰🇪 Kenya', rec: 'COMESA', volume: 2400, growth: 11.6, products: 'Fertilizers, steel, ceramics', mode: 'Sea', status: 'active' },
  { from: '🇳🇬 Nigeria', to: '🇨🇮 Cote d\'Ivoire', rec: 'ECOWAS', volume: 2100, growth: 18.4, products: 'Petroleum, plastics, steel', mode: 'Road/Sea', status: 'active' },
  { from: '🇰🇪 Kenya', to: '🇺🇬 Uganda', rec: 'EAC', volume: 1900, growth: 7.2, products: 'Petroleum, iron, cement', mode: 'Road', status: 'active' },
  { from: '🇿🇦 South Africa', to: '🇿🇼 Zimbabwe', rec: 'SADC', volume: 1800, growth: 3.9, products: 'Fuel, machinery, chemicals', mode: 'Road/Rail', status: 'active' },
  { from: '🇹🇿 Tanzania', to: '🇷🇼 Rwanda', rec: 'EAC', volume: 1500, growth: 12.8, products: 'Cement, food, manufactures', mode: 'Road', status: 'active' },
  { from: '🇪🇹 Ethiopia', to: '🇩🇯 Djibouti', rec: 'COMESA', volume: 1300, growth: 5.4, products: 'Coffee, oilseeds, textiles', mode: 'Rail', status: 'active' },
  { from: '🇲🇦 Morocco', to: '🇸🇳 Senegal', rec: 'Other', volume: 1200, growth: 22.1, products: 'Processed food, textiles', mode: 'Sea', status: 'growing' },
  { from: '🇿🇦 South Africa', to: '🇳🇦 Namibia', rec: 'SADC', volume: 1100, growth: 2.1, products: 'Fuel, food, machinery', mode: 'Road', status: 'active' },
  { from: '🇪🇬 Egypt', to: '🇱🇾 Libya', rec: 'COMESA', volume: 980, growth: 8.3, products: 'Food, steel, cement', mode: 'Road', status: 'active' },
  { from: '🇨🇲 Cameroon', to: '🇨🇩 DRC', rec: 'CEMAC', volume: 860, growth: 15.1, products: 'Palm oil, timber, food', mode: 'River/Road', status: 'growing' },
  { from: '🇰🇪 Kenya', to: '🇪🇹 Ethiopia', rec: 'EAC/COMESA', volume: 780, growth: 19.7, products: 'Manufactures, food, chemicals', mode: 'Road', status: 'growing' },
];

const RECS = ['All', 'EAC', 'ECOWAS', 'COMESA', 'SADC', 'CEMAC', 'Other'];

function fmtM(v: number) { return v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${v}M`; }

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

export default function AfCFTACorridorsPage() {
  const [search, setSearch] = useState('');
  const [recFilter, setRecFilter] = useState('All');

  const filtered = ALL_CORRIDORS.filter((c) => {
    const matchSearch = !search || `${c.from} ${c.to} ${c.products}`.toLowerCase().includes(search.toLowerCase());
    const matchRec = recFilter === 'All' || c.rec.includes(recFilter);
    return matchSearch && matchRec;
  });

  const totalVolume = ALL_CORRIDORS.reduce((s, c) => s + c.volume, 0);
  const avgGrowth = ALL_CORRIDORS.reduce((s, c) => s + c.growth, 0) / ALL_CORRIDORS.length;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: "'Lora', serif", mb: 0.5 }}>Trade Corridors</Typography>
      <Typography sx={{ color: '#b0b0b0', fontSize: 14, mb: 3 }}>Active intra-African trade corridors and their performance</Typography>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Total Corridors" value={String(ALL_CORRIDORS.length)} sub="Tracked country pairs" color="#D4AF37" icon={<CompareArrowsIcon fontSize="small" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Total Volume" value={fmtM(totalVolume)} sub="Across all corridors" color="#22C55E" icon={<TrendingUpIcon fontSize="small" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Avg Growth Rate" value={`+${avgGrowth.toFixed(1)}%`} sub="YoY average" color="#3B82F6" icon={<LocalShippingIcon fontSize="small" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="RECs Covered" value="5" sub="Plus cross-REC corridors" color="#8B5CF6" icon={<PublicIcon fontSize="small" />} />
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ p: 2.5, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField size="small" placeholder="Search corridors..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 240 }} />
          <TextField size="small" select label="REC" value={recFilter} onChange={(e) => setRecFilter(e.target.value)} sx={{ minWidth: 160 }}>
            {RECS.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>
        </Box>
      </Card>

      {/* Table */}
      <Card sx={{ p: 2.5 }}>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 750 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '30px 1.2fr 1.2fr 80px 70px 70px 1.2fr 80px', gap: 1, pb: 1, borderBottom: '1px solid rgba(255,255,255,0.06)', mb: 1 }}>
              {['#', 'From', 'To', 'REC', 'Volume', 'Growth', 'Key Products', 'Mode'].map((h) => (
                <Typography key={h} sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</Typography>
              ))}
            </Box>
            {filtered.map((c, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '30px 1.2fr 1.2fr 80px 70px 70px 1.2fr 80px', gap: 1, py: 0.75, borderBottom: '1px solid rgba(255,255,255,0.03)', '&:hover': { bgcolor: 'rgba(212,175,55,0.04)' } }}>
                <Typography sx={{ fontSize: 12, color: '#777' }}>{i + 1}</Typography>
                <Typography sx={{ fontSize: 12 }}>{c.from}</Typography>
                <Typography sx={{ fontSize: 12 }}>{c.to}</Typography>
                <Chip label={c.rec} size="small" sx={{ fontSize: 9, height: 18, bgcolor: 'rgba(212,175,55,0.1)', color: '#D4AF37' }} />
                <Typography sx={{ fontSize: 12, fontFamily: "'Lora', serif", fontWeight: 600 }}>{fmtM(c.volume)}</Typography>
                <Typography sx={{ fontSize: 12, color: '#22C55E' }}>+{c.growth}%</Typography>
                <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{c.products}</Typography>
                <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{c.mode}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
