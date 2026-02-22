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
  CurrencyExchange,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface FXRate {
  id: string;
  from: string;
  from_name: string;
  to: string;
  to_name: string;
  rate: number;
  change_24h: number;
  volume_24h: number;
}

const FX_RATES: FXRate[] = [
  { id: 'fx-001', from: 'KES', from_name: 'Kenyan Shilling', to: 'USD', to_name: 'US Dollar', rate: 0.00775, change_24h: 0.12, volume_24h: 4200000 },
  { id: 'fx-002', from: 'KES', from_name: 'Kenyan Shilling', to: 'NGN', to_name: 'Nigerian Naira', rate: 12.35, change_24h: -0.34, volume_24h: 1800000 },
  { id: 'fx-003', from: 'KES', from_name: 'Kenyan Shilling', to: 'ZAR', to_name: 'South African Rand', rate: 0.1432, change_24h: 0.08, volume_24h: 2100000 },
  { id: 'fx-004', from: 'KES', from_name: 'Kenyan Shilling', to: 'EGP', to_name: 'Egyptian Pound', rate: 0.382, change_24h: -0.15, volume_24h: 950000 },
  { id: 'fx-005', from: 'KES', from_name: 'Kenyan Shilling', to: 'GHS', to_name: 'Ghanaian Cedi', rate: 0.0985, change_24h: 0.22, volume_24h: 750000 },
  { id: 'fx-006', from: 'KES', from_name: 'Kenyan Shilling', to: 'TZS', to_name: 'Tanzanian Shilling', rate: 19.85, change_24h: -0.05, volume_24h: 1200000 },
  { id: 'fx-007', from: 'KES', from_name: 'Kenyan Shilling', to: 'UGX', to_name: 'Ugandan Shilling', rate: 28.92, change_24h: 0.18, volume_24h: 890000 },
  { id: 'fx-008', from: 'KES', from_name: 'Kenyan Shilling', to: 'RWF', to_name: 'Rwandan Franc', rate: 10.45, change_24h: 0.03, volume_24h: 420000 },
  { id: 'fx-009', from: 'KES', from_name: 'Kenyan Shilling', to: 'ETB', to_name: 'Ethiopian Birr', rate: 0.892, change_24h: -0.42, volume_24h: 680000 },
  { id: 'fx-010', from: 'KES', from_name: 'Kenyan Shilling', to: 'XOF', to_name: 'West African CFA', rate: 4.68, change_24h: 0.06, volume_24h: 320000 },
];

interface RecentSettlement {
  id: string;
  reference: string;
  from_amount: number;
  from_currency: string;
  to_amount: number;
  to_currency: string;
  rate: number;
  status: 'settled' | 'pending' | 'failed';
  settled_at: string;
}

const RECENT_SETTLEMENTS: RecentSettlement[] = [
  { id: 'fxs-001', reference: 'FXS-2026-0088', from_amount: 4850000, from_currency: 'KES', to_amount: 37588, to_currency: 'USD', rate: 0.00775, status: 'settled', settled_at: '2026-02-22 14:32' },
  { id: 'fxs-002', reference: 'FXS-2026-0087', from_amount: 1560000, from_currency: 'KES', to_amount: 19266000, to_currency: 'NGN', rate: 12.35, status: 'settled', settled_at: '2026-02-22 13:16' },
  { id: 'fxs-003', reference: 'FXS-2026-0086', from_amount: 870000, from_currency: 'KES', to_amount: 124584, to_currency: 'ZAR', rate: 0.1432, status: 'pending', settled_at: '—' },
  { id: 'fxs-004', reference: 'FXS-2026-0085', from_amount: 312000, from_currency: 'KES', to_amount: 6194400, to_currency: 'TZS', rate: 19.85, status: 'settled', settled_at: '2026-02-21 16:51' },
  { id: 'fxs-005', reference: 'FXS-2026-0084', from_amount: 450000, from_currency: 'KES', to_amount: 401040, to_currency: 'ETB', rate: 0.892, status: 'failed', settled_at: '—' },
];

const SETTLEMENT_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  settled: { label: 'Settled', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  failed: { label: 'Failed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toLocaleString();
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FXDashboardPage() {
  const totalVolume = useMemo(() => FX_RATES.reduce((s, r) => s + r.volume_24h, 0), []);
  const maxVolume = useMemo(() => Math.max(...FX_RATES.map((r) => r.volume_24h)), []);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <CurrencyExchange sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">FX Dashboard</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Real-time African currency exchange rates and settlement monitoring via PAPSS.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Currency Pairs', value: FX_RATES.length.toString(), color: '#D4AF37' },
          { label: '24h Volume', value: `KSh ${formatCurrency(totalVolume)}`, color: '#3B82F6' },
          { label: 'Settlements Today', value: RECENT_SETTLEMENTS.filter((s) => s.status === 'settled').length.toString(), color: '#22C55E' },
          { label: 'Avg Settlement', value: '< 3 sec', color: '#8B5CF6' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Exchange Rates */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Live Exchange Rates (Base: KES)</Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '55px 1fr 100px 70px 90px',
                gap: 1, px: 2.5, py: 1.5,
                borderBottom: '1px solid rgba(212,175,55,0.08)',
                backgroundColor: 'rgba(212,175,55,0.03)',
              }}
            >
              {['Ccy', 'Currency', 'Rate', '24h %', 'Volume'].map((h) => (
                <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
              ))}
            </Box>
            {FX_RATES.map((r, i) => (
              <Box
                key={r.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '55px 1fr 100px 70px 90px',
                  gap: 1, px: 2.5, py: 1.5,
                  alignItems: 'center',
                  borderBottom: i < FX_RATES.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                  '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#D4AF37', fontFamily: 'monospace' }}>{r.to}</Typography>
                <Box>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{r.to_name}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(r.volume_24h / maxVolume) * 100}
                    sx={{ height: 3, borderRadius: 2, mt: 0.5, backgroundColor: 'rgba(212,175,55,0.06)', '& .MuiLinearProgress-bar': { backgroundColor: 'rgba(212,175,55,0.3)' } }}
                  />
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', fontFamily: 'monospace' }}>
                  {r.rate < 1 ? r.rate.toFixed(5) : r.rate.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  {r.change_24h >= 0 ? (
                    <TrendingUp sx={{ fontSize: 14, color: '#22C55E' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 14, color: '#EF4444' }} />
                  )}
                  <Typography sx={{ fontSize: 12, color: r.change_24h >= 0 ? '#22C55E' : '#EF4444' }}>
                    {r.change_24h >= 0 ? '+' : ''}{r.change_24h.toFixed(2)}%
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 12, color: '#999' }}>{formatCurrency(r.volume_24h)}</Typography>
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Recent Settlements */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              Recent FX Settlements
            </Typography>
            {RECENT_SETTLEMENTS.map((s) => {
              const sts = SETTLEMENT_STATUS[s.status];
              return (
                <Box key={s.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{s.reference}</Typography>
                    <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: sts.bg, color: sts.color }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Box sx={{ textAlign: 'right', flex: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{s.from_amount.toLocaleString()}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#777' }}>{s.from_currency}</Typography>
                    </Box>
                    <CurrencyExchange sx={{ fontSize: 18, color: '#D4AF37' }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#22C55E' }}>{s.to_amount.toLocaleString()}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#777' }}>{s.to_currency}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 10, color: '#555' }}>Rate: {s.rate < 1 ? s.rate.toFixed(5) : s.rate.toFixed(2)}</Typography>
                    <Typography sx={{ fontSize: 10, color: '#555' }}>{s.settled_at}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
