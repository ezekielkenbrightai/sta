import { useState, useMemo } from 'react';
import {
  Box,
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
  History,
  Search as SearchIcon,
  FileDownload,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface PaymentRecord {
  id: string;
  reference: string;
  assessment_ref: string;
  trader: string;
  amount: number;
  currency: string;
  method: 'bank_transfer' | 'mobile_money' | 'card' | 'cbdc';
  status: 'completed' | 'pending' | 'processing' | 'failed' | 'refunded';
  initiated_at: string;
  completed_at: string | null;
}

const MOCK_PAYMENTS: PaymentRecord[] = [
  { id: 'ph-001', reference: 'PAY-2026-0188', assessment_ref: 'KE-2026-0042', trader: 'Nairobi Exports Ltd', amount: 48500, currency: 'KES', method: 'bank_transfer', status: 'completed', initiated_at: '2026-02-22 14:30', completed_at: '2026-02-22 14:32' },
  { id: 'ph-002', reference: 'PAY-2026-0187', assessment_ref: 'KE-2026-0040', trader: 'Lagos Trading Co', amount: 156000, currency: 'KES', method: 'mobile_money', status: 'completed', initiated_at: '2026-02-22 13:15', completed_at: '2026-02-22 13:15' },
  { id: 'ph-003', reference: 'PAY-2026-0186', assessment_ref: 'KE-2026-0039', trader: 'Kampala Imports Inc', amount: 22500, currency: 'KES', method: 'card', status: 'completed', initiated_at: '2026-02-22 11:45', completed_at: '2026-02-22 11:46' },
  { id: 'ph-004', reference: 'PAY-2026-0185', assessment_ref: 'KE-2026-0038', trader: 'Accra Commodities Ltd', amount: 87000, currency: 'KES', method: 'bank_transfer', status: 'pending', initiated_at: '2026-02-22 10:20', completed_at: null },
  { id: 'ph-005', reference: 'PAY-2026-0184', assessment_ref: 'KE-2026-0037', trader: 'Dar es Salaam Freight', amount: 31200, currency: 'KES', method: 'cbdc', status: 'completed', initiated_at: '2026-02-21 16:50', completed_at: '2026-02-21 16:50' },
  { id: 'ph-006', reference: 'PAY-2026-0183', assessment_ref: 'KE-2026-0036', trader: 'Cairo Trade House', amount: 45000, currency: 'KES', method: 'bank_transfer', status: 'failed', initiated_at: '2026-02-21 15:30', completed_at: null },
  { id: 'ph-007', reference: 'PAY-2026-0182', assessment_ref: 'KE-2026-0035', trader: 'Nairobi Exports Ltd', amount: 12750, currency: 'KES', method: 'mobile_money', status: 'completed', initiated_at: '2026-02-21 09:15', completed_at: '2026-02-21 09:15' },
  { id: 'ph-008', reference: 'PAY-2026-0181', assessment_ref: 'KE-2026-0034', trader: 'Lagos Trading Co', amount: 9800, currency: 'KES', method: 'card', status: 'refunded', initiated_at: '2026-02-20 14:00', completed_at: '2026-02-20 14:01' },
  { id: 'ph-009', reference: 'PAY-2026-0180', assessment_ref: 'KE-2026-0033', trader: 'Kampala Imports Inc', amount: 68200, currency: 'KES', method: 'bank_transfer', status: 'completed', initiated_at: '2026-02-20 11:30', completed_at: '2026-02-20 11:33' },
  { id: 'ph-010', reference: 'PAY-2026-0179', assessment_ref: 'KE-2026-0032', trader: 'Accra Commodities Ltd', amount: 41500, currency: 'KES', method: 'cbdc', status: 'processing', initiated_at: '2026-02-20 10:00', completed_at: null },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: 'Completed', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  processing: { label: 'Processing', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  failed: { label: 'Failed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  refunded: { label: 'Refunded', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

const METHOD_LABELS: Record<string, { label: string; color: string }> = {
  bank_transfer: { label: 'Bank Transfer', color: '#3B82F6' },
  mobile_money: { label: 'M-Pesa', color: '#22C55E' },
  card: { label: 'Card', color: '#E6A817' },
  cbdc: { label: 'CBDC', color: '#8B5CF6' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PaymentHistoryPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_PAYMENTS.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (methodFilter !== 'all' && p.method !== methodFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.reference.toLowerCase().includes(q) || p.trader.toLowerCase().includes(q) || p.assessment_ref.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, statusFilter, methodFilter]);

  const totalCompleted = MOCK_PAYMENTS.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <History sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Payment History</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            Complete transaction history with receipts and audit trail.
          </Typography>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Transactions', value: MOCK_PAYMENTS.length.toString(), color: '#D4AF37' },
          { label: 'Completed Value', value: `KSh ${(totalCompleted / 1000).toFixed(0)}K`, color: '#22C55E' },
          { label: 'Failed', value: MOCK_PAYMENTS.filter((p) => p.status === 'failed').length.toString(), color: '#EF4444' },
          { label: 'Refunded', value: MOCK_PAYMENTS.filter((p) => p.status === 'refunded').length.toString(), color: '#8B5CF6' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              fullWidth size="small"
              placeholder="Search by reference, trader, or assessment..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3.5 }}>
            <TextField fullWidth size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 3.5 }}>
            <TextField fullWidth size="small" select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} label="Method">
              <MenuItem value="all">All Methods</MenuItem>
              {Object.entries(METHOD_LABELS).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '120px 120px 1fr 100px 90px 90px 130px 50px',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['Payment Ref', 'Assessment', 'Trader', 'Amount', 'Method', 'Status', 'Date', ''].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {filtered.map((p, i) => {
          const sts = STATUS_CONFIG[p.status];
          const mtd = METHOD_LABELS[p.method];
          return (
            <Box
              key={p.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '120px 120px 1fr 100px 90px 90px 130px 50px',
                gap: 1, px: 2.5, py: 1.75,
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{p.reference}</Typography>
              <Typography sx={{ fontSize: 12, color: '#999', fontFamily: 'monospace' }}>{p.assessment_ref}</Typography>
              <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{p.trader}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>KSh {p.amount.toLocaleString()}</Typography>
              <Chip label={mtd.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: `${mtd.color}15`, color: mtd.color }} />
              <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: sts.bg, color: sts.color }} />
              <Typography sx={{ fontSize: 11, color: '#777' }}>{p.initiated_at}</Typography>
              <Tooltip title="Download receipt" arrow>
                <IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#D4AF37' } }} disabled={p.status !== 'completed'}>
                  <FileDownload sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {MOCK_PAYMENTS.length} transactions
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
