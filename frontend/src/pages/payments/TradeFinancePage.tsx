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
  RequestQuote,
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface TradeFinanceFacility {
  id: string;
  reference: string;
  trader: string;
  type: 'lc' | 'trade_loan' | 'guarantee' | 'collection' | 'pre_export';
  amount: number;
  currency: string;
  tenor_days: number;
  interest_rate: number;
  status: 'active' | 'pending_approval' | 'approved' | 'disbursed' | 'matured' | 'defaulted';
  issued_date: string;
  maturity_date: string;
  counterparty_bank: string;
}

const MOCK_FACILITIES: TradeFinanceFacility[] = [
  { id: 'tf-001', reference: 'LC-2026-0023', trader: 'Nairobi Exports Ltd', type: 'lc', amount: 50000000, currency: 'KES', tenor_days: 180, interest_rate: 0, status: 'active', issued_date: '2026-02-15', maturity_date: '2026-08-15', counterparty_bank: 'Standard Bank (ZA)' },
  { id: 'tf-002', reference: 'TL-2026-0015', trader: 'Lagos Trading Co', type: 'trade_loan', amount: 120000000, currency: 'KES', tenor_days: 365, interest_rate: 12.5, status: 'disbursed', issued_date: '2025-06-30', maturity_date: '2026-06-30', counterparty_bank: '—' },
  { id: 'tf-003', reference: 'BG-2026-0008', trader: 'Accra Commodities Ltd', type: 'guarantee', amount: 25000000, currency: 'KES', tenor_days: 90, interest_rate: 2.0, status: 'active', issued_date: '2026-01-01', maturity_date: '2026-04-01', counterparty_bank: 'GCB Bank (GH)' },
  { id: 'tf-004', reference: 'DC-2026-0012', trader: 'Cairo Trade House', type: 'collection', amount: 80000000, currency: 'KES', tenor_days: 60, interest_rate: 0, status: 'pending_approval', issued_date: '—', maturity_date: '—', counterparty_bank: 'National Bank of Egypt' },
  { id: 'tf-005', reference: 'PE-2026-0006', trader: 'Dar es Salaam Freight', type: 'pre_export', amount: 35000000, currency: 'KES', tenor_days: 120, interest_rate: 11.0, status: 'disbursed', issued_date: '2026-01-15', maturity_date: '2026-05-15', counterparty_bank: '—' },
  { id: 'tf-006', reference: 'LC-2026-0022', trader: 'Kampala Imports Inc', type: 'lc', amount: 15000000, currency: 'KES', tenor_days: 90, interest_rate: 0, status: 'matured', issued_date: '2025-12-01', maturity_date: '2026-03-01', counterparty_bank: 'Bank of Africa (UG)' },
  { id: 'tf-007', reference: 'TL-2026-0016', trader: 'Nairobi Exports Ltd', type: 'trade_loan', amount: 45000000, currency: 'KES', tenor_days: 270, interest_rate: 13.0, status: 'approved', issued_date: '—', maturity_date: '—', counterparty_bank: '—' },
];

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  lc: { label: 'Letter of Credit', color: '#3B82F6' },
  trade_loan: { label: 'Trade Loan', color: '#D4AF37' },
  guarantee: { label: 'Bank Guarantee', color: '#22C55E' },
  collection: { label: 'Documentary Collection', color: '#E6A817' },
  pre_export: { label: 'Pre-Export Finance', color: '#8B5CF6' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  pending_approval: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  approved: { label: 'Approved', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  disbursed: { label: 'Disbursed', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  matured: { label: 'Matured', color: '#999', bg: 'rgba(153,153,153,0.1)' },
  defaulted: { label: 'Defaulted', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

function formatAmount(value: number): string {
  if (value >= 1000000) return `KSh ${(value / 1000000).toFixed(0)}M`;
  if (value >= 1000) return `KSh ${(value / 1000).toFixed(0)}K`;
  return `KSh ${value.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TradeFinancePage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_FACILITIES.filter((f) => {
      if (typeFilter !== 'all' && f.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return f.reference.toLowerCase().includes(q) || f.trader.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, typeFilter]);

  const totalExposure = MOCK_FACILITIES.filter((f) => f.status === 'active' || f.status === 'disbursed').reduce((s, f) => s + f.amount, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <RequestQuote sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Trade Finance</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            Manage letters of credit, trade loans, guarantees, and other trade finance instruments.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          New Facility
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Facilities', value: MOCK_FACILITIES.length.toString(), color: '#D4AF37' },
          { label: 'Active Exposure', value: formatAmount(totalExposure), color: '#3B82F6' },
          { label: 'Pending Approval', value: MOCK_FACILITIES.filter((f) => f.status === 'pending_approval' || f.status === 'approved').length.toString(), color: '#E6A817' },
          { label: 'Avg Interest Rate', value: `${(MOCK_FACILITIES.filter((f) => f.interest_rate > 0).reduce((s, f) => s + f.interest_rate, 0) / MOCK_FACILITIES.filter((f) => f.interest_rate > 0).length).toFixed(1)}%`, color: '#22C55E' },
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
              placeholder="Search by reference or trader..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField fullWidth size="small" select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Type">
              <MenuItem value="all">All Types</MenuItem>
              {Object.entries(TYPE_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 120px 90px 70px 60px 90px 90px 50px',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['Reference', 'Trader', 'Type', 'Amount', 'Tenor', 'Rate', 'Maturity', 'Status', ''].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {filtered.map((f, i) => {
          const type = TYPE_CONFIG[f.type];
          const sts = STATUS_CONFIG[f.status];
          return (
            <Box
              key={f.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 120px 90px 70px 60px 90px 90px 50px',
                gap: 1, px: 2.5, py: 1.75,
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{f.reference}</Typography>
              <Box>
                <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{f.trader}</Typography>
                {f.counterparty_bank !== '—' && (
                  <Typography sx={{ fontSize: 10, color: '#555' }}>via {f.counterparty_bank}</Typography>
                )}
              </Box>
              <Chip label={type.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: `${type.color}15`, color: type.color }} />
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{formatAmount(f.amount)}</Typography>
              <Typography sx={{ fontSize: 12, color: '#999' }}>{f.tenor_days}d</Typography>
              <Typography sx={{ fontSize: 12, color: f.interest_rate > 0 ? '#E6A817' : '#555' }}>
                {f.interest_rate > 0 ? `${f.interest_rate}%` : '—'}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#999' }}>{f.maturity_date}</Typography>
              <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: sts.bg, color: sts.color }} />
              <Tooltip title="View details" arrow>
                <IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#D4AF37' } }}>
                  <ViewIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {MOCK_FACILITIES.length} facilities
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
