import {
  Box,
  Card,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import {
  AccountBalanceWallet,
  SwapHoriz,
  Speed,
  People,
  BarChart as BarChartIcon,
  Public,
  TrendingUp,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ── TypeScript Interfaces ────────────────────────────────────────────────────

interface StableCoinsKpi {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface DigitalSettlement {
  id: string;
  from: string;
  to: string;
  amount: string;
  currency: string;
  status: 'completed' | 'pending' | 'processing';
  timestamp: string;
  txHash: string;
}

interface StableCoinsCorridor {
  from: string;
  fromFlag: string;
  to: string;
  toFlag: string;
  volume_mtd: number;
  transactions: number;
  avgSettlement: string;
  status: 'active' | 'pilot' | 'planned';
}

interface MonthlyVolume {
  month: string;
  volume: number;
  transactions: number;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const KPIS: StableCoinsKpi[] = [
  { label: 'Digital KES Balance', value: 'KES 2.47B', change: 18.4, icon: <AccountBalanceWallet sx={{ fontSize: 18 }} />, color: '#D4AF37' },
  { label: 'Digital Transactions MTD', value: '34,821', change: 23.7, icon: <SwapHoriz sx={{ fontSize: 18 }} />, color: '#22C55E' },
  { label: 'Settlement Speed (Avg)', value: '4.2 sec', change: -32.1, icon: <Speed sx={{ fontSize: 18 }} />, color: '#3B82F6' },
  { label: 'Active Wallets', value: '12,487', change: 15.9, icon: <People sx={{ fontSize: 18 }} />, color: '#8B5CF6' },
];

const SETTLEMENTS: DigitalSettlement[] = [
  { id: 'SC-001', from: 'KenTrade Holdings', to: 'TZ Export Corp', amount: 'KES 12,450,000', currency: 'dKES', status: 'completed', timestamp: '2 min ago', txHash: '0x7a3f...e821' },
  { id: 'SC-002', from: 'Mombasa Port Authority', to: 'Uganda Revenue', amount: 'UGX 87,200,000', currency: 'dUGX', status: 'completed', timestamp: '8 min ago', txHash: '0x9b2c...d445' },
  { id: 'SC-003', from: 'Nairobi Coffee Exporter', to: 'Dar es Salaam Imports', amount: 'KES 5,800,000', currency: 'dKES', status: 'processing', timestamp: '15 min ago', txHash: '0x4d1e...f932' },
  { id: 'SC-004', from: 'EAC Trade Finance Ltd', to: 'Rwanda Minerals Corp', amount: 'RWF 34,500,000', currency: 'dRWF', status: 'pending', timestamp: '22 min ago', txHash: '0x6c8a...b017' },
  { id: 'SC-005', from: 'Kampala Textiles', to: 'Kenya Garments Ltd', amount: 'KES 3,200,000', currency: 'dKES', status: 'completed', timestamp: '35 min ago', txHash: '0x2e5f...a773' },
  { id: 'SC-006', from: 'Zanzibar Spice Co', to: 'Mombasa Distributors', amount: 'TZS 18,900,000', currency: 'dTZS', status: 'completed', timestamp: '48 min ago', txHash: '0x1f3d...c289' },
];

const CORRIDORS: StableCoinsCorridor[] = [
  { from: 'Kenya', fromFlag: '\ud83c\uddf0\ud83c\uddea', to: 'Tanzania', toFlag: '\ud83c\uddf9\ud83c\uddff', volume_mtd: 4_200_000_000, transactions: 12847, avgSettlement: '3.8 sec', status: 'active' },
  { from: 'Kenya', fromFlag: '\ud83c\uddf0\ud83c\uddea', to: 'Uganda', toFlag: '\ud83c\uddfa\ud83c\uddec', volume_mtd: 2_870_000_000, transactions: 8234, avgSettlement: '4.1 sec', status: 'active' },
  { from: 'Tanzania', fromFlag: '\ud83c\uddf9\ud83c\uddff', to: 'Rwanda', toFlag: '\ud83c\uddf7\ud83c\uddfc', volume_mtd: 1_340_000_000, transactions: 3921, avgSettlement: '5.2 sec', status: 'pilot' },
  { from: 'Uganda', fromFlag: '\ud83c\uddfa\ud83c\uddec', to: 'DRC', toFlag: '\ud83c\udde8\ud83c\udde9', volume_mtd: 890_000_000, transactions: 2156, avgSettlement: '6.7 sec', status: 'pilot' },
  { from: 'Kenya', fromFlag: '\ud83c\uddf0\ud83c\uddea', to: 'Ethiopia', toFlag: '\ud83c\uddea\ud83c\uddf9', volume_mtd: 560_000_000, transactions: 1423, avgSettlement: '\u2014', status: 'planned' },
];

const MONTHLY_VOLUMES: MonthlyVolume[] = [
  { month: 'Sep', volume: 1_200_000_000, transactions: 18400 },
  { month: 'Oct', volume: 1_800_000_000, transactions: 24100 },
  { month: 'Nov', volume: 2_400_000_000, transactions: 28900 },
  { month: 'Dec', volume: 2_100_000_000, transactions: 26700 },
  { month: 'Jan', volume: 3_100_000_000, transactions: 31200 },
  { month: 'Feb', volume: 3_800_000_000, transactions: 34821 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatKES(v: number): string {
  if (v >= 1_000_000_000) return `KES ${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `KES ${(v / 1_000_000).toFixed(0)}M`;
  return `KES ${v.toLocaleString()}`;
}

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  completed: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  processing: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  pending: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
  active: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  pilot: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  planned: { color: '#888', bg: 'rgba(136,136,136,0.08)' },
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function StableCoinsDashboardPage() {

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <AccountBalanceWallet sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Stable Coins Overview</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Digital currency operations, cross-border settlements, and wallet analytics across East Africa.
        </Typography>
      </Box>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {KPIS.map((k) => (
          <Grid size={{ xs: 6, md: 3 }} key={k.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <Box sx={{ color: k.color }}>{k.icon}</Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{k.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: k.color }}>{k.value}</Typography>
              <Typography sx={{ fontSize: 11, color: k.change > 0 ? '#22C55E' : '#EF4444' }}>
                {k.change > 0 ? '+' : ''}{k.change}% vs last month
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Transaction Volume Chart */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>
                <BarChartIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Stable Coins Transaction Volume (6-Month)
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#555' }}>
                <TrendingUp sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5, color: '#22C55E' }} />
                +217% growth
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY_VOLUMES} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(212,175,55,0.06)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v: number) => `${(v / 1_000_000_000).toFixed(1)}B`}
                  tick={{ fill: '#555', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8 }}
                  labelStyle={{ color: '#D4AF37' }}
                  itemStyle={{ color: '#b0b0b0' }}
                  formatter={(value) => [formatKES(Number(value)), 'Volume']}
                />
                <Bar dataKey="volume" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Recent Settlements */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <SwapHoriz sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Recent Digital Settlements
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {SETTLEMENTS.map((s) => {
                const sc = STATUS_COLORS[s.status];
                return (
                  <Box key={s.id} sx={{ p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.06)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: "'Lora', serif" }}>{s.amount}</Typography>
                      <Chip label={s.status} size="small" sx={{ fontSize: 9, height: 16, color: sc.color, backgroundColor: sc.bg }} />
                    </Box>
                    <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{s.from} &rarr; {s.to}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography sx={{ fontSize: 10, color: '#555', fontFamily: 'monospace' }}>{s.txHash}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>{s.timestamp}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Cross-border Stable Coins Corridors */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <Public sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Cross-Border Stable Coins Corridors
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {CORRIDORS.map((c) => {
                const sc = STATUS_COLORS[c.status];
                return (
                  <Box key={`${c.from}-${c.to}`} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 16 }}>{c.fromFlag}</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{c.from}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#555' }}>&rarr;</Typography>
                        <Typography sx={{ fontSize: 16 }}>{c.toFlag}</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{c.to}</Typography>
                        <Chip label={c.status} size="small" sx={{ fontSize: 9, height: 16, color: sc.color, backgroundColor: sc.bg }} />
                      </Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#D4AF37', fontFamily: "'Lora', serif" }}>
                        {formatKES(c.volume_mtd)}
                      </Typography>
                    </Box>
                    <Grid container spacing={1.5}>
                      <Grid size={4}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Transactions</Typography>
                        <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.transactions.toLocaleString()}</Typography>
                      </Grid>
                      <Grid size={4}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Avg Settlement</Typography>
                        <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.avgSettlement}</Typography>
                      </Grid>
                      <Grid size={4}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Volume MTD</Typography>
                        <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{formatKES(c.volume_mtd)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
