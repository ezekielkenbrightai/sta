import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  CompareArrows,
  Search as SearchIcon,
  AutoFixHigh,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface ReconciliationItem {
  id: string;
  account_code: string;
  account_name: string;
  ledger_balance: number;
  external_balance: number;
  difference: number;
  status: 'matched' | 'difference' | 'pending' | 'adjusted';
  external_source: string;
  last_reconciled: string;
  items_checked: number;
  items_unmatched: number;
}

const MOCK_RECON: ReconciliationItem[] = [
  { id: 'rec-001', account_code: '1200', account_name: 'Cash & Bank (KES)', ledger_balance: 890000000, external_balance: 890000000, difference: 0, status: 'matched', external_source: 'KCB Bank Statement', last_reconciled: '2026-02-22', items_checked: 2156, items_unmatched: 0 },
  { id: 'rec-002', account_code: '1210', account_name: 'Bank — NGN Nostro', ledger_balance: 42000000, external_balance: 42150000, difference: 150000, status: 'difference', external_source: 'PAPSS Settlement Report', last_reconciled: '2026-02-22', items_checked: 341, items_unmatched: 2 },
  { id: 'rec-003', account_code: '1220', account_name: 'Bank — ZAR Nostro', ledger_balance: 28000000, external_balance: 28000000, difference: 0, status: 'matched', external_source: 'ABSA Bank Statement', last_reconciled: '2026-02-21', items_checked: 189, items_unmatched: 0 },
  { id: 'rec-004', account_code: '1100', account_name: 'Trade Receivables', ledger_balance: 245000000, external_balance: 244850000, difference: 150000, status: 'adjusted', external_source: 'Tax Assessment Register', last_reconciled: '2026-02-22', items_checked: 1842, items_unmatched: 1 },
  { id: 'rec-005', account_code: '2200', account_name: 'Tax Liabilities', ledger_balance: 342000000, external_balance: 342000000, difference: 0, status: 'matched', external_source: 'KRA iTax System', last_reconciled: '2026-02-22', items_checked: 1523, items_unmatched: 0 },
  { id: 'rec-006', account_code: '2100', account_name: 'Trade Payables', ledger_balance: 178000000, external_balance: 178500000, difference: 500000, status: 'difference', external_source: 'Supplier Statements', last_reconciled: '2026-02-20', items_checked: 987, items_unmatched: 3 },
  { id: 'rec-007', account_code: '4100', account_name: 'Customs Duty Revenue', ledger_balance: 1240000000, external_balance: 0, difference: 0, status: 'pending', external_source: 'Customs Declaration System', last_reconciled: '2026-02-15', items_checked: 0, items_unmatched: 0 },
  { id: 'rec-008', account_code: '5100', account_name: 'FX Settlement Costs', ledger_balance: 45000000, external_balance: 44800000, difference: 200000, status: 'difference', external_source: 'PAPSS Fee Report', last_reconciled: '2026-02-22', items_checked: 892, items_unmatched: 4 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  matched: { label: 'Matched', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', icon: CheckCircle },
  difference: { label: 'Difference', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: ErrorIcon },
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)', icon: Warning },
  adjusted: { label: 'Adjusted', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', icon: AutoFixHigh },
};

function formatAmount(v: number): string {
  if (v === 0) return '—';
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString();
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LedgerReconciliationPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_RECON.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return r.account_code.includes(q) || r.account_name.toLowerCase().includes(q) || r.external_source.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, statusFilter]);

  const matchedCount = MOCK_RECON.filter((r) => r.status === 'matched').length;
  const matchRate = ((matchedCount / MOCK_RECON.length) * 100).toFixed(0);
  const totalDifference = MOCK_RECON.reduce((s, r) => s + Math.abs(r.difference), 0);
  const totalUnmatched = MOCK_RECON.reduce((s, r) => s + r.items_unmatched, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <CompareArrows sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Ledger Reconciliation</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            Match ledger balances against external systems and bank statements.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AutoFixHigh />}>
          Auto-Reconcile
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Accounts Tracked', value: MOCK_RECON.length.toString(), color: '#D4AF37' },
          { label: 'Match Rate', value: `${matchRate}%`, color: '#22C55E' },
          { label: 'Total Difference', value: totalDifference > 0 ? `KSh ${formatAmount(totalDifference)}` : 'KSh 0', color: totalDifference > 0 ? '#EF4444' : '#22C55E' },
          { label: 'Unmatched Items', value: totalUnmatched.toString(), color: totalUnmatched > 0 ? '#E6A817' : '#22C55E' },
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
          <Grid size={{ xs: 12, sm: 7 }}>
            <TextField
              fullWidth size="small"
              placeholder="Search by account, name, or external source..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField fullWidth size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Reconciliation Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.map((r) => {
          const sts = STATUS_CONFIG[r.status];
          const Icon = sts.icon;
          return (
            <Card key={r.id} sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon sx={{ fontSize: 20, color: sts.color }} />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: 13, fontFamily: 'monospace', color: '#D4AF37', fontWeight: 600 }}>{r.account_code}</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{r.account_name}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>External: {r.external_source}</Typography>
                  </Box>
                </Box>
                <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 22, backgroundColor: sts.bg, color: sts.color }} />
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.25 }}>Ledger Balance</Typography>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, fontFamily: 'monospace', color: '#f0f0f0' }}>{formatAmount(r.ledger_balance)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.25 }}>External Balance</Typography>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, fontFamily: 'monospace', color: r.external_balance > 0 ? '#f0f0f0' : '#555' }}>
                    {r.external_balance > 0 ? formatAmount(r.external_balance) : 'Pending'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.25 }}>Difference</Typography>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, fontFamily: 'monospace', color: r.difference > 0 ? '#EF4444' : '#22C55E' }}>
                    {r.difference > 0 ? formatAmount(r.difference) : '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.25 }}>Items Checked</Typography>
                  <Typography sx={{ fontSize: 13, color: '#b0b0b0' }}>{r.items_checked.toLocaleString()}</Typography>
                  {r.items_unmatched > 0 && (
                    <Typography sx={{ fontSize: 10, color: '#EF4444' }}>{r.items_unmatched} unmatched</Typography>
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.25 }}>Last Reconciled</Typography>
                  <Typography sx={{ fontSize: 12, color: '#999' }}>{r.last_reconciled}</Typography>
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filtered.length} of {MOCK_RECON.length} reconciliation records
        </Typography>
      </Box>
    </Box>
  );
}
