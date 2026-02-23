import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  SwapHoriz,
  Speed,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface SettlementQueue {
  id: string;
  reference: string;
  trader: string;
  source_amount: number;
  source_currency: string;
  target_currency: string;
  rate: number;
  target_amount: number;
  status: 'queued' | 'processing' | 'settled' | 'failed';
  priority: 'high' | 'normal' | 'low';
  initiated_at: string;
  settled_at: string | null;
  settlement_time: string | null;
}

const SETTLEMENT_QUEUE: SettlementQueue[] = [
  { id: 'sq-001', reference: 'FXS-2026-0089', trader: 'Nairobi Exports Ltd', source_amount: 2500000, source_currency: 'KES', target_currency: 'NGN', rate: 12.35, target_amount: 30875000, status: 'settled', priority: 'high', initiated_at: '2026-02-22 14:30', settled_at: '2026-02-22 14:30', settlement_time: '2.1s' },
  { id: 'sq-002', reference: 'FXS-2026-0090', trader: 'Lagos Trading Co', source_amount: 5000000, source_currency: 'NGN', target_currency: 'KES', rate: 0.081, target_amount: 405000, status: 'processing', priority: 'high', initiated_at: '2026-02-22 14:35', settled_at: null, settlement_time: null },
  { id: 'sq-003', reference: 'FXS-2026-0091', trader: 'Accra Commodities Ltd', source_amount: 150000, source_currency: 'GHS', target_currency: 'KES', rate: 10.15, target_amount: 1522500, status: 'queued', priority: 'normal', initiated_at: '2026-02-22 14:40', settled_at: null, settlement_time: null },
  { id: 'sq-004', reference: 'FXS-2026-0092', trader: 'Cairo Trade House', source_amount: 800000, source_currency: 'EGP', target_currency: 'ZAR', rate: 0.375, target_amount: 300000, status: 'queued', priority: 'low', initiated_at: '2026-02-22 14:42', settled_at: null, settlement_time: null },
  { id: 'sq-005', reference: 'FXS-2026-0088', trader: 'Dar es Salaam Freight', source_amount: 1200000, source_currency: 'TZS', target_currency: 'KES', rate: 0.0504, target_amount: 60480, status: 'settled', priority: 'normal', initiated_at: '2026-02-22 13:20', settled_at: '2026-02-22 13:20', settlement_time: '1.8s' },
  { id: 'sq-006', reference: 'FXS-2026-0087', trader: 'Kampala Imports Inc', source_amount: 3000000, source_currency: 'UGX', target_currency: 'KES', rate: 0.0346, target_amount: 103800, status: 'settled', priority: 'normal', initiated_at: '2026-02-22 12:15', settled_at: '2026-02-22 12:15', settlement_time: '2.4s' },
  { id: 'sq-007', reference: 'FXS-2026-0086', trader: 'Nairobi Exports Ltd', source_amount: 750000, source_currency: 'KES', target_currency: 'ETB', rate: 0.892, target_amount: 669000, status: 'failed', priority: 'high', initiated_at: '2026-02-22 11:50', settled_at: null, settlement_time: null },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  queued: { label: 'Queued', color: '#999', bg: 'rgba(153,153,153,0.1)' },
  processing: { label: 'Processing', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  settled: { label: 'Settled', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  failed: { label: 'Failed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  high: { label: 'High', color: '#EF4444' },
  normal: { label: 'Normal', color: '#3B82F6' },
  low: { label: 'Low', color: '#999' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FXSettlementPage() {
  const { isOversight, filterByOrgName, orgName } = useDataIsolation();

  const [statusFilter, setStatusFilter] = useState('all');

  const baseQueue = useMemo(
    () => filterByOrgName(SETTLEMENT_QUEUE, 'trader'),
    [filterByOrgName],
  );

  const filtered = baseQueue.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  const settledCount = baseQueue.filter((s) => s.status === 'settled').length;
  const withTime = baseQueue.filter((s) => s.settlement_time);
  const avgTime = withTime.length > 0
    ? (withTime.map((s) => parseFloat(s.settlement_time!)).reduce((a, b) => a + b, 0) / withTime.length).toFixed(1)
    : '0';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <SwapHoriz sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">{isOversight ? 'FX Settlement' : 'My FX Settlements'}</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            {isOversight ? 'Real-time cross-currency settlement via PAPSS — atomic settlement in under 3 seconds.' : `FX settlement history for ${orgName}.`}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<SwapHoriz />}>
          New Settlement
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total in Queue', value: baseQueue.length.toString(), color: '#D4AF37' },
          { label: 'Settled Today', value: settledCount.toString(), color: '#22C55E' },
          { label: 'Avg Settlement Time', value: `${avgTime}s`, color: '#8B5CF6' },
          { label: 'Failed', value: baseQueue.filter((s) => s.status === 'failed').length.toString(), color: '#EF4444' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* PAPSS info banner */}
      <Card sx={{ p: 2, mb: 3, backgroundColor: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Speed sx={{ color: '#8B5CF6' }} />
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#8B5CF6' }}>PAPSS Integration Active</Typography>
            <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>
              Pan-African Payment and Settlement System — enabling instant cross-border settlements across 54 African currencies.
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Filter */}
      <Card sx={{ p: 2, mb: 3 }}>
        <TextField fullWidth size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status" sx={{ maxWidth: 250 }}>
          <MenuItem value="all">All Statuses</MenuItem>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
        </TextField>
      </Card>

      {/* Settlement cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map((s) => {
          const sts = STATUS_CONFIG[s.status];
          const pri = PRIORITY_CONFIG[s.priority];
          return (
            <Card key={s.id} sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{s.reference}</Typography>
                  <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: sts.bg, color: sts.color }} />
                  <Chip label={pri.label} size="small" variant="outlined" sx={{ fontSize: 10, height: 20, borderColor: `${pri.color}40`, color: pri.color }} />
                </Box>
                <Typography sx={{ fontSize: 12, color: '#777' }}>{s.trader}</Typography>
              </Box>

              {/* Conversion display */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, px: 1 }}>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#f0f0f0', fontFamily: "'Lora', serif" }}>
                    {s.source_amount.toLocaleString()}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#999' }}>{s.source_currency}</Typography>
                </Box>
                <Box sx={{ px: 2 }}>
                  <SwapHoriz sx={{ fontSize: 24, color: '#D4AF37' }} />
                  <Typography sx={{ fontSize: 10, color: '#555', textAlign: 'center' }}>
                    {s.rate < 1 ? s.rate.toFixed(5) : s.rate.toFixed(4)}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#22C55E', fontFamily: "'Lora', serif" }}>
                    {s.target_amount.toLocaleString()}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#999' }}>{s.target_currency}</Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'rgba(212,175,55,0.05)', mb: 1.5 }} />

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Initiated</Typography>
                  <Typography sx={{ fontSize: 12, color: '#f0f0f0' }}>{s.initiated_at}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Settled</Typography>
                  <Typography sx={{ fontSize: 12, color: s.settled_at ? '#22C55E' : '#555' }}>{s.settled_at || 'Pending'}</Typography>
                </Box>
                {s.settlement_time && (
                  <Box>
                    <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Time</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {s.status === 'settled' ? <CheckCircle sx={{ fontSize: 12, color: '#22C55E' }} /> : <Schedule sx={{ fontSize: 12, color: '#E6A817' }} />}
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#8B5CF6' }}>{s.settlement_time}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
