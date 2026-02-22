import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Receipt,
  Payment,
  CheckCircle,
  Warning,
  Download,
} from '@mui/icons-material';

// ─── Types & Mock data ───────────────────────────────────────────────────────

interface TaxPayment {
  id: string;
  assessment_ref: string;
  document_ref: string;
  trader_name: string;
  amount: number;
  method: 'bank_transfer' | 'mobile_money' | 'card' | 'cbdc';
  payment_ref: string;
  status: 'completed' | 'pending' | 'processing' | 'failed' | 'refunded';
  paid_at: string | null;
  created_at: string;
}

const MOCK_PAYMENTS: TaxPayment[] = [
  {
    id: 'tp-001', assessment_ref: 'TA-2026-0042', document_ref: 'KE-2026-0042',
    trader_name: 'Nairobi Exports Ltd', amount: 48500, method: 'bank_transfer',
    payment_ref: 'BNK-20260221-4852', status: 'completed', paid_at: '2026-02-21T15:30:00Z', created_at: '2026-02-21T14:00:00Z',
  },
  {
    id: 'tp-002', assessment_ref: 'TA-2026-0038', document_ref: 'KE-2026-0038',
    trader_name: 'Nairobi Exports Ltd', amount: 37000, method: 'mobile_money',
    payment_ref: 'MPE-20260220-3701', status: 'completed', paid_at: '2026-02-20T10:15:00Z', created_at: '2026-02-20T09:45:00Z',
  },
  {
    id: 'tp-003', assessment_ref: 'TA-2026-0041', document_ref: 'KE-2026-0041',
    trader_name: 'Nairobi Exports Ltd', amount: 12750, method: 'card',
    payment_ref: 'CRD-20260219-1275', status: 'pending', paid_at: null, created_at: '2026-02-19T16:00:00Z',
  },
  {
    id: 'tp-004', assessment_ref: 'TA-2026-0040', document_ref: 'KE-2026-0040',
    trader_name: 'Lagos Trading Co', amount: 156000, method: 'bank_transfer',
    payment_ref: 'BNK-20260215-1560', status: 'failed', paid_at: null, created_at: '2026-02-15T11:00:00Z',
  },
  {
    id: 'tp-005', assessment_ref: 'TA-2026-0037', document_ref: 'KE-2026-0037',
    trader_name: 'Lagos Trading Co', amount: 24700, method: 'bank_transfer',
    payment_ref: 'BNK-20260218-2470', status: 'processing', paid_at: null, created_at: '2026-02-18T09:30:00Z',
  },
  {
    id: 'tp-006', assessment_ref: 'TA-2026-0033', document_ref: 'KE-2026-0033',
    trader_name: 'Nairobi Exports Ltd', amount: 31200, method: 'cbdc',
    payment_ref: 'CBDC-20260222-3120', status: 'pending', paid_at: null, created_at: '2026-02-22T08:00:00Z',
  },
  {
    id: 'tp-007', assessment_ref: 'TA-2026-0035', document_ref: 'KE-2026-0035',
    trader_name: 'Nairobi Exports Ltd', amount: 9520, method: 'mobile_money',
    payment_ref: 'MPE-20260217-0952', status: 'refunded', paid_at: '2026-02-17T12:00:00Z', created_at: '2026-02-17T11:00:00Z',
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: 'Completed', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  processing: { label: 'Processing', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  failed: { label: 'Failed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  refunded: { label: 'Refunded', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  mobile_money: 'M-Pesa',
  card: 'Card',
  cbdc: 'CBDC',
};

function formatCurrency(value: number): string {
  return `KSh ${value.toLocaleString()}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TaxPaymentPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_PAYMENTS.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.document_ref.toLowerCase().includes(q) ||
          p.trader_name.toLowerCase().includes(q) ||
          p.payment_ref.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, statusFilter]);

  const stats = useMemo(() => ({
    total: MOCK_PAYMENTS.length,
    completed: MOCK_PAYMENTS.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0),
    pending: MOCK_PAYMENTS.filter((p) => p.status === 'pending' || p.status === 'processing').reduce((s, p) => s + p.amount, 0),
    failed: MOCK_PAYMENTS.filter((p) => p.status === 'failed').length,
  }), []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>Tax Payments</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Track and manage tax payment transactions.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Payment />}>
          Make Payment
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Payments', value: stats.total.toString(), color: '#D4AF37', icon: <Receipt sx={{ fontSize: 16 }} /> },
          { label: 'Collected', value: formatCurrency(stats.completed), color: '#22C55E', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
          { label: 'Pending', value: formatCurrency(stats.pending), color: '#E6A817', icon: <Payment sx={{ fontSize: 16 }} /> },
          { label: 'Failed', value: stats.failed.toString(), color: '#EF4444', icon: <Warning sx={{ fontSize: 16 }} /> },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
                <Box sx={{ color: s.color }}>{s.icon}</Box>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>
                {s.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 7 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by reference, trader, payment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment>,
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField fullWidth size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <MenuItem key={key} value={key}>{cfg.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr 130px 100px 120px 100px 100px 40px',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['Document', 'Trader', 'Payment Ref', 'Amount', 'Method', 'Status', 'Date', ''].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>No payments match your filters.</Typography>
          </Box>
        ) : (
          filtered.map((p, i) => {
            const sts = STATUS_CONFIG[p.status];
            return (
              <Box
                key={p.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 130px 100px 120px 100px 100px 40px',
                  gap: 1, px: 2.5, py: 1.75,
                  alignItems: 'center',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                  '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>{p.document_ref}</Typography>
                <Typography sx={{ fontSize: 13, color: '#f0f0f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.trader_name}</Typography>
                <Typography sx={{ fontSize: 11, color: '#999', fontFamily: 'monospace' }}>{p.payment_ref}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{formatCurrency(p.amount)}</Typography>
                <Chip
                  label={METHOD_LABELS[p.method]}
                  size="small"
                  sx={{ fontSize: 11, height: 22, backgroundColor: 'rgba(212,175,55,0.08)', color: '#b0b0b0' }}
                />
                <Chip label={sts.label} size="small" sx={{ fontSize: 11, height: 22, backgroundColor: sts.bg, color: sts.color }} />
                <Typography sx={{ fontSize: 12, color: '#999' }}>{formatDate(p.paid_at || p.created_at)}</Typography>
                <Tooltip title="Download receipt" arrow>
                  <IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#D4AF37' } }} disabled={p.status !== 'completed'}>
                    <Download sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            );
          })
        )}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {MOCK_PAYMENTS.length} payments
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
