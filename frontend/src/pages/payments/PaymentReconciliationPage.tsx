import { useState, useMemo } from 'react';
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
  CompareArrows,
  Search as SearchIcon,
  Link as LinkIcon,
  LinkOff,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface ReconciliationItem {
  id: string;
  payment_ref: string;
  assessment_ref: string;
  trader: string;
  payment_amount: number;
  assessed_amount: number;
  difference: number;
  match_status: 'matched' | 'partial' | 'unmatched' | 'overpaid' | 'pending';
  payment_date: string;
  reconciled_at: string | null;
  reconciled_by: string | null;
}

const MOCK_ITEMS: ReconciliationItem[] = [
  { id: 'rec-001', payment_ref: 'PAY-2026-0188', assessment_ref: 'KE-2026-0042', trader: 'Nairobi Exports Ltd', payment_amount: 48500, assessed_amount: 48500, difference: 0, match_status: 'matched', payment_date: '2026-02-22', reconciled_at: '2026-02-22 14:35', reconciled_by: 'System (Auto)' },
  { id: 'rec-002', payment_ref: 'PAY-2026-0187', assessment_ref: 'KE-2026-0040', trader: 'Lagos Trading Co', payment_amount: 150000, assessed_amount: 156000, difference: -6000, match_status: 'partial', payment_date: '2026-02-22', reconciled_at: null, reconciled_by: null },
  { id: 'rec-003', payment_ref: 'PAY-2026-0186', assessment_ref: 'KE-2026-0039', trader: 'Kampala Imports Inc', payment_amount: 22500, assessed_amount: 22500, difference: 0, match_status: 'matched', payment_date: '2026-02-22', reconciled_at: '2026-02-22 11:48', reconciled_by: 'System (Auto)' },
  { id: 'rec-004', payment_ref: 'PAY-2026-0185', assessment_ref: '—', trader: 'Accra Commodities Ltd', payment_amount: 87000, assessed_amount: 0, difference: 87000, match_status: 'unmatched', payment_date: '2026-02-22', reconciled_at: null, reconciled_by: null },
  { id: 'rec-005', payment_ref: 'PAY-2026-0184', assessment_ref: 'KE-2026-0037', trader: 'Dar es Salaam Freight', payment_amount: 31200, assessed_amount: 31200, difference: 0, match_status: 'matched', payment_date: '2026-02-21', reconciled_at: '2026-02-21 16:52', reconciled_by: 'System (Auto)' },
  { id: 'rec-006', payment_ref: 'PAY-2026-0182', assessment_ref: 'KE-2026-0035', trader: 'Nairobi Exports Ltd', payment_amount: 14000, assessed_amount: 12750, difference: 1250, match_status: 'overpaid', payment_date: '2026-02-21', reconciled_at: null, reconciled_by: null },
  { id: 'rec-007', payment_ref: 'PAY-2026-0180', assessment_ref: 'KE-2026-0033', trader: 'Kampala Imports Inc', payment_amount: 68200, assessed_amount: 68200, difference: 0, match_status: 'matched', payment_date: '2026-02-20', reconciled_at: '2026-02-20 11:35', reconciled_by: 'System (Auto)' },
  { id: 'rec-008', payment_ref: 'PAY-2026-0179', assessment_ref: '—', trader: 'Cairo Trade House', payment_amount: 41500, assessed_amount: 0, difference: 41500, match_status: 'pending', payment_date: '2026-02-20', reconciled_at: null, reconciled_by: null },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  matched: { label: 'Matched', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', icon: CheckCircle },
  partial: { label: 'Partial Match', color: '#E6A817', bg: 'rgba(230,168,23,0.1)', icon: Warning },
  unmatched: { label: 'Unmatched', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: LinkOff },
  overpaid: { label: 'Overpaid', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', icon: Warning },
  pending: { label: 'Pending', color: '#999', bg: 'rgba(153,153,153,0.1)', icon: LinkOff },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PaymentReconciliationPage() {
  const { isOversight, filterByOrgName, orgName } = useDataIsolation();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const baseItems = useMemo(
    () => filterByOrgName(MOCK_ITEMS, 'trader'),
    [filterByOrgName],
  );

  const filtered = useMemo(() => {
    return baseItems.filter((r) => {
      if (statusFilter !== 'all' && r.match_status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return r.payment_ref.toLowerCase().includes(q) || r.trader.toLowerCase().includes(q) || r.assessment_ref.toLowerCase().includes(q);
      }
      return true;
    });
  }, [baseItems, search, statusFilter]);

  const matchedCount = baseItems.filter((r) => r.match_status === 'matched').length;
  const unmatchedCount = baseItems.filter((r) => r.match_status === 'unmatched' || r.match_status === 'pending').length;
  const matchRate = baseItems.length > 0 ? ((matchedCount / baseItems.length) * 100).toFixed(0) : '0';
  const totalDiff = baseItems.filter((r) => r.difference !== 0).reduce((s, r) => s + Math.abs(r.difference), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <CompareArrows sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">{isOversight ? 'Payment Reconciliation' : 'My Payment Reconciliation'}</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            {isOversight ? 'Match payments to tax assessments and resolve discrepancies.' : `Reconciliation status for ${orgName}.`}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<LinkIcon />}>
          Auto-Reconcile
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Items', value: baseItems.length.toString(), color: '#D4AF37' },
          { label: 'Match Rate', value: `${matchRate}%`, color: '#22C55E' },
          { label: 'Unmatched', value: unmatchedCount.toString(), color: '#EF4444' },
          { label: 'Total Discrepancy', value: `KSh ${totalDiff.toLocaleString()}`, color: '#E6A817' },
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
              placeholder="Search by payment ref, assessment, or trader..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField fullWidth size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Match Status">
              <MenuItem value="all">All</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '110px 110px 1fr 100px 100px 80px 100px 50px',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['Payment', 'Assessment', 'Trader', 'Paid', 'Assessed', 'Diff', 'Status', ''].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {filtered.map((r, i) => {
          const sts = STATUS_CONFIG[r.match_status];
          const Icon = sts.icon;
          return (
            <Box
              key={r.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '110px 110px 1fr 100px 100px 80px 100px 50px',
                gap: 1, px: 2.5, py: 1.75,
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{r.payment_ref}</Typography>
              <Typography sx={{ fontSize: 12, color: r.assessment_ref === '—' ? '#555' : '#999', fontFamily: 'monospace' }}>{r.assessment_ref}</Typography>
              <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{r.trader}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>KSh {r.payment_amount.toLocaleString()}</Typography>
              <Typography sx={{ fontSize: 13, color: r.assessed_amount > 0 ? '#b0b0b0' : '#555' }}>
                {r.assessed_amount > 0 ? `KSh ${r.assessed_amount.toLocaleString()}` : '—'}
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: r.difference === 0 ? '#22C55E' : r.difference > 0 ? '#E6A817' : '#EF4444' }}>
                {r.difference === 0 ? '0' : r.difference > 0 ? `+${r.difference.toLocaleString()}` : r.difference.toLocaleString()}
              </Typography>
              <Chip
                icon={<Icon sx={{ fontSize: 14 }} />}
                label={sts.label} size="small"
                sx={{ fontSize: 10, height: 22, backgroundColor: sts.bg, color: sts.color, '& .MuiChip-icon': { color: sts.color } }}
              />
              <Tooltip title={r.match_status === 'unmatched' ? 'Match manually' : 'View details'} arrow>
                <IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#D4AF37' } }}>
                  {r.match_status === 'unmatched' ? <LinkIcon sx={{ fontSize: 16 }} /> : <CompareArrows sx={{ fontSize: 16 }} />}
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {baseItems.length} reconciliation items
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
