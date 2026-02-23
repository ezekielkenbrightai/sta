import { useMemo } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  SwapHoriz,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface DailyVolume {
  date: string;
  amount: number;
  count: number;
}

const DAILY_VOLUMES: DailyVolume[] = [
  { date: 'Feb 16', amount: 4200000, count: 42 },
  { date: 'Feb 17', amount: 3800000, count: 38 },
  { date: 'Feb 18', amount: 5100000, count: 51 },
  { date: 'Feb 19', amount: 4600000, count: 47 },
  { date: 'Feb 20', amount: 6200000, count: 58 },
  { date: 'Feb 21', amount: 5800000, count: 55 },
  { date: 'Feb 22', amount: 4900000, count: 49 },
];

interface RecentPayment {
  id: string;
  reference: string;
  trader: string;
  processing_bank: string;
  amount: number;
  currency: string;
  method: string;
  status: 'completed' | 'pending' | 'processing' | 'failed';
  timestamp: string;
}

const RECENT_PAYMENTS: RecentPayment[] = [
  { id: 'pay-001', reference: 'PAY-2026-0188', trader: 'Nairobi Exports Ltd', processing_bank: 'KCB Bank', amount: 48500, currency: 'KES', method: 'Bank Transfer', status: 'completed', timestamp: '2026-02-22 14:30' },
  { id: 'pay-002', reference: 'PAY-2026-0187', trader: 'Lagos Trading Co', processing_bank: 'KCB Bank', amount: 156000, currency: 'NGN', method: 'M-Pesa', status: 'processing', timestamp: '2026-02-22 13:15' },
  { id: 'pay-003', reference: 'PAY-2026-0186', trader: 'Kampala Imports Inc', processing_bank: 'Standard Bank', amount: 22500, currency: 'UGX', method: 'Card', status: 'completed', timestamp: '2026-02-22 11:45' },
  { id: 'pay-004', reference: 'PAY-2026-0185', trader: 'Accra Commodities Ltd', processing_bank: 'Standard Bank', amount: 87000, currency: 'GHS', method: 'Bank Transfer', status: 'pending', timestamp: '2026-02-22 10:20' },
  { id: 'pay-005', reference: 'PAY-2026-0184', trader: 'Dar es Salaam Freight', processing_bank: 'KCB Bank', amount: 31200, currency: 'TZS', method: 'Stable Coins', status: 'completed', timestamp: '2026-02-21 16:50' },
  { id: 'pay-006', reference: 'PAY-2026-0183', trader: 'Cairo Trade House', processing_bank: 'KCB Bank', amount: 45000, currency: 'EGP', method: 'Bank Transfer', status: 'failed', timestamp: '2026-02-21 15:30' },
];

interface MethodBreakdown {
  method: string;
  count: number;
  volume: number;
  color: string;
}

const METHOD_BREAKDOWN: MethodBreakdown[] = [
  { method: 'Bank Transfer', count: 124, volume: 18500000, color: '#3B82F6' },
  { method: 'Mobile Money (M-Pesa)', count: 89, volume: 8200000, color: '#22C55E' },
  { method: 'Card Payment', count: 45, volume: 4100000, color: '#E6A817' },
  { method: 'Stable Coins', count: 12, volume: 2800000, color: '#8B5CF6' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: 'Completed', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  processing: { label: 'Processing', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  failed: { label: 'Failed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `KSh ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `KSh ${(value / 1000).toFixed(0)}K`;
  return `KSh ${value.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PaymentDashboardPage() {
  const { filterCustom, orgName, isOversight } = useDataIsolation();

  const recentPayments = useMemo(
    () => filterCustom(RECENT_PAYMENTS, (p) => p.trader === orgName || p.processing_bank === orgName),
    [filterCustom, orgName],
  );

  const todayVolume = DAILY_VOLUMES[DAILY_VOLUMES.length - 1];
  const yesterdayVolume = DAILY_VOLUMES[DAILY_VOLUMES.length - 2];
  const volumeChange = ((todayVolume.amount - yesterdayVolume.amount) / yesterdayVolume.amount * 100).toFixed(1);
  const isUp = todayVolume.amount >= yesterdayVolume.amount;

  const totalMethodVolume = METHOD_BREAKDOWN.reduce((s, m) => s + m.volume, 0);

  const settledToday = useMemo(() => recentPayments.filter((p) => p.status === 'completed').length, [recentPayments]);
  const pendingToday = useMemo(() => recentPayments.filter((p) => p.status === 'pending' || p.status === 'processing').length, [recentPayments]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <AccountBalanceWallet sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Payment Dashboard</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          {isOversight ? 'Real-time payment processing and settlement overview.' : `Payment activity for ${orgName}.`}
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: "Today's Volume",
            value: formatCurrency(todayVolume.amount),
            sub: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                {isUp ? <TrendingUp sx={{ fontSize: 14, color: '#22C55E' }} /> : <TrendingDown sx={{ fontSize: 14, color: '#EF4444' }} />}
                <Typography sx={{ fontSize: 11, color: isUp ? '#22C55E' : '#EF4444' }}>{isUp ? '+' : ''}{volumeChange}% vs yesterday</Typography>
              </Box>
            ),
            color: '#D4AF37',
          },
          { label: 'Transactions Today', value: todayVolume.count.toString(), color: '#3B82F6' },
          { label: 'Settled', value: settledToday.toString(), color: '#22C55E', icon: <CheckCircle sx={{ fontSize: 16, color: '#22C55E' }} /> },
          { label: 'Pending/Processing', value: pendingToday.toString(), color: '#E6A817', icon: <Schedule sx={{ fontSize: 16, color: '#E6A817' }} /> },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {'icon' in s && s.icon}
                <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
              </Box>
              {'sub' in s && s.sub}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Daily Volume Trend */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              7-Day Payment Volume
            </Typography>
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={DAILY_VOLUMES} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid stroke="rgba(212,175,55,0.06)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  yAxisId="amount"
                  tick={{ fill: '#555', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}M`}
                />
                <YAxis
                  yAxisId="count"
                  orientation="right"
                  tick={{ fill: '#555', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8 }}
                  labelStyle={{ color: '#D4AF37' }}
                  itemStyle={{ color: '#b0b0b0' }}
                  formatter={(value, name) =>
                    name === 'amount' ? [formatCurrency(Number(value)), 'Volume'] : [value, 'Transactions']
                  }
                />
                <Bar yAxisId="amount" dataKey="amount" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={20} />
                <Line yAxisId="count" dataKey="count" stroke="#22C55E" strokeWidth={2} dot={{ fill: '#22C55E', r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Payment Method Breakdown */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              Payment Methods (MTD)
            </Typography>
            {METHOD_BREAKDOWN.map((m) => {
              const pct = (m.volume / totalMethodVolume * 100).toFixed(1);
              return (
                <Box key={m.method} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: m.color }} />
                      <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{m.method}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: m.color }}>
                        {formatCurrency(m.volume)}
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: '#777' }}>{m.count} txns ({pct}%)</Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Number(pct)}
                    sx={{ height: 6, borderRadius: 3, backgroundColor: `${m.color}15`, '& .MuiLinearProgress-bar': { backgroundColor: m.color, borderRadius: 3 } }}
                  />
                </Box>
              );
            })}
          </Card>
        </Grid>

        {/* Recent Payments */}
        <Grid size={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SwapHoriz sx={{ fontSize: 18, color: '#D4AF37' }} />
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Recent Transactions</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '130px 1fr 100px 60px 110px 90px 130px',
                gap: 1, px: 2.5, py: 1.5,
                borderBottom: '1px solid rgba(212,175,55,0.08)',
                backgroundColor: 'rgba(212,175,55,0.03)',
              }}
            >
              {['Reference', 'Trader', 'Amount', 'Ccy', 'Method', 'Status', 'Timestamp'].map((h) => (
                <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
              ))}
            </Box>
            {recentPayments.map((p, i) => {
              const sts = STATUS_CONFIG[p.status];
              return (
                <Box
                  key={p.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '130px 1fr 100px 60px 110px 90px 130px',
                    gap: 1, px: 2.5, py: 1.75,
                    alignItems: 'center',
                    borderBottom: i < recentPayments.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                    '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                    cursor: 'pointer',
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>{p.reference}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{p.trader}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{p.amount.toLocaleString()}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#999' }}>{p.currency}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{p.method}</Typography>
                  <Chip label={sts.label} size="small" sx={{ fontSize: 11, height: 22, backgroundColor: sts.bg, color: sts.color }} />
                  <Typography sx={{ fontSize: 11, color: '#777' }}>{p.timestamp}</Typography>
                </Box>
              );
            })}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
