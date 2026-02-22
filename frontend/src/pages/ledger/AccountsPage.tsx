import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {
  AccountTree,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parent_code: string | null;
  balance: number;
  currency: string;
  is_active: boolean;
  journal_count: number;
  last_activity: string;
}

const MOCK_ACCOUNTS: LedgerAccount[] = [
  { id: 'acc-001', code: '1000', name: 'Current Assets', type: 'asset', parent_code: null, balance: 1135000000, currency: 'KES', is_active: true, journal_count: 0, last_activity: '—' },
  { id: 'acc-002', code: '1100', name: 'Trade Receivables', type: 'asset', parent_code: '1000', balance: 245000000, currency: 'KES', is_active: true, journal_count: 1842, last_activity: '2026-02-22' },
  { id: 'acc-003', code: '1200', name: 'Cash & Bank (KES)', type: 'asset', parent_code: '1000', balance: 890000000, currency: 'KES', is_active: true, journal_count: 2156, last_activity: '2026-02-22' },
  { id: 'acc-004', code: '1210', name: 'Bank — NGN Nostro', type: 'asset', parent_code: '1000', balance: 42000000, currency: 'KES', is_active: true, journal_count: 341, last_activity: '2026-02-22' },
  { id: 'acc-005', code: '1220', name: 'Bank — ZAR Nostro', type: 'asset', parent_code: '1000', balance: 28000000, currency: 'KES', is_active: true, journal_count: 189, last_activity: '2026-02-21' },
  { id: 'acc-006', code: '1300', name: 'Export Receivables', type: 'asset', parent_code: '1000', balance: 67000000, currency: 'KES', is_active: true, journal_count: 456, last_activity: '2026-02-22' },
  { id: 'acc-007', code: '2000', name: 'Current Liabilities', type: 'liability', parent_code: null, balance: 520000000, currency: 'KES', is_active: true, journal_count: 0, last_activity: '—' },
  { id: 'acc-008', code: '2100', name: 'Trade Payables', type: 'liability', parent_code: '2000', balance: 178000000, currency: 'KES', is_active: true, journal_count: 987, last_activity: '2026-02-22' },
  { id: 'acc-009', code: '2200', name: 'Tax Liabilities', type: 'liability', parent_code: '2000', balance: 342000000, currency: 'KES', is_active: true, journal_count: 1523, last_activity: '2026-02-22' },
  { id: 'acc-010', code: '3000', name: 'Equity & Reserves', type: 'equity', parent_code: null, balance: 250000000, currency: 'KES', is_active: true, journal_count: 0, last_activity: '—' },
  { id: 'acc-011', code: '3100', name: 'FX Revaluation Reserve', type: 'equity', parent_code: '3000', balance: 15000000, currency: 'KES', is_active: true, journal_count: 234, last_activity: '2026-02-22' },
  { id: 'acc-012', code: '3200', name: 'Retained Earnings', type: 'equity', parent_code: '3000', balance: 235000000, currency: 'KES', is_active: true, journal_count: 12, last_activity: '2026-01-31' },
  { id: 'acc-013', code: '4000', name: 'Revenue', type: 'revenue', parent_code: null, balance: 2045000000, currency: 'KES', is_active: true, journal_count: 0, last_activity: '—' },
  { id: 'acc-014', code: '4100', name: 'Customs Duty Revenue', type: 'revenue', parent_code: '4000', balance: 1240000000, currency: 'KES', is_active: true, journal_count: 3421, last_activity: '2026-02-22' },
  { id: 'acc-015', code: '4200', name: 'VAT Revenue', type: 'revenue', parent_code: '4000', balance: 680000000, currency: 'KES', is_active: true, journal_count: 2876, last_activity: '2026-02-22' },
  { id: 'acc-016', code: '4210', name: 'VAT Revenue — Corrected', type: 'revenue', parent_code: '4000', balance: 150000, currency: 'KES', is_active: true, journal_count: 1, last_activity: '2026-02-21' },
  { id: 'acc-017', code: '4300', name: 'Excise Revenue', type: 'revenue', parent_code: '4000', balance: 125000000, currency: 'KES', is_active: true, journal_count: 567, last_activity: '2026-02-21' },
  { id: 'acc-018', code: '4400', name: 'Export Processing Revenue', type: 'revenue', parent_code: '4000', balance: 42000000, currency: 'KES', is_active: true, journal_count: 312, last_activity: '2026-02-22' },
  { id: 'acc-019', code: '5000', name: 'Expenses', type: 'expense', parent_code: null, balance: 85000000, currency: 'KES', is_active: true, journal_count: 0, last_activity: '—' },
  { id: 'acc-020', code: '5100', name: 'FX Settlement Costs', type: 'expense', parent_code: '5000', balance: 45000000, currency: 'KES', is_active: true, journal_count: 892, last_activity: '2026-02-22' },
  { id: 'acc-021', code: '5200', name: 'Bank Charges', type: 'expense', parent_code: '5000', balance: 18000000, currency: 'KES', is_active: true, journal_count: 456, last_activity: '2026-02-21' },
  { id: 'acc-022', code: '5300', name: 'Processing Fees', type: 'expense', parent_code: '5000', balance: 22000000, currency: 'KES', is_active: true, journal_count: 678, last_activity: '2026-02-22' },
];

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  asset: { label: 'Asset', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  liability: { label: 'Liability', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  equity: { label: 'Equity', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  revenue: { label: 'Revenue', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  expense: { label: 'Expense', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
};

function formatBalance(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString();
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AccountsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_ACCOUNTS.filter((a) => {
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.code.includes(q) || a.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, typeFilter]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_ACCOUNTS.forEach((a) => { counts[a.type] = (counts[a.type] || 0) + 1; });
    return counts;
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <AccountTree sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Chart of Accounts</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            Complete chart of accounts for the automated trade ledger.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Account
        </Button>
      </Box>

      {/* Type breakdown */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
          <Grid size={{ xs: 6, sm: 2.4 }} key={key}>
            <Card
              sx={{ p: 2, cursor: 'pointer', border: typeFilter === key ? `1px solid ${cfg.color}` : '1px solid transparent', '&:hover': { borderColor: `${cfg.color}40` } }}
              onClick={() => setTypeFilter(typeFilter === key ? 'all' : key)}
            >
              <Typography sx={{ fontSize: 20, fontWeight: 700, fontFamily: "'Lora', serif", color: cfg.color }}>{typeCounts[key] || 0}</Typography>
              <Typography sx={{ fontSize: 11, color: '#777' }}>{cfg.label} Accounts</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search */}
      <Card sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth size="small"
          placeholder="Search by account code or name..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
        />
      </Card>

      {/* Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '70px 1fr 80px 110px 80px 90px',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['Code', 'Account Name', 'Type', 'Balance (KES)', 'Journals', 'Last Activity'].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {filtered.map((a, i) => {
          const tp = TYPE_CONFIG[a.type];
          const isParent = a.parent_code === null;
          return (
            <Box
              key={a.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '70px 1fr 80px 110px 80px 90px',
                gap: 1, px: 2.5, py: 1.75,
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                backgroundColor: isParent ? 'rgba(212,175,55,0.02)' : 'transparent',
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: isParent ? 700 : 500, color: '#D4AF37', fontFamily: 'monospace' }}>{a.code}</Typography>
              <Typography sx={{ fontSize: 13, color: '#f0f0f0', fontWeight: isParent ? 600 : 400, pl: isParent ? 0 : 2 }}>
                {!isParent && <Box component="span" sx={{ color: '#333', mr: 0.5 }}>└</Box>}
                {a.name}
              </Typography>
              <Chip label={tp.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: tp.bg, color: tp.color }} />
              <Typography sx={{ fontSize: 13, fontWeight: isParent ? 700 : 500, fontFamily: 'monospace', color: tp.color }}>
                {formatBalance(a.balance)}
              </Typography>
              <Typography sx={{ fontSize: 12, color: a.journal_count > 0 ? '#b0b0b0' : '#333' }}>{a.journal_count > 0 ? a.journal_count.toLocaleString() : '—'}</Typography>
              <Typography sx={{ fontSize: 11, color: '#777' }}>{a.last_activity}</Typography>
            </Box>
          );
        })}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {MOCK_ACCOUNTS.length} accounts
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
