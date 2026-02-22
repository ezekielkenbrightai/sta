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
  MenuBook,
  Add as AddIcon,
  Search as SearchIcon,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface JournalLine {
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
}

interface JournalEntry {
  id: string;
  reference: string;
  date: string;
  description: string;
  source_type: 'trade_document' | 'tax_assessment' | 'payment' | 'fx_settlement' | 'manual';
  source_ref: string;
  lines: JournalLine[];
  status: 'posted' | 'pending' | 'reversed';
  created_by: string;
  approved_by: string | null;
}

const MOCK_JOURNALS: JournalEntry[] = [
  {
    id: 'jnl-001', reference: 'JNL-2026-04821', date: '2026-02-22', description: 'Import duty assessment — KE-2026-0042',
    source_type: 'tax_assessment', source_ref: 'ASM-2026-0415', status: 'posted', created_by: 'System', approved_by: 'Jane Mwangi',
    lines: [
      { account_code: '1100', account_name: 'Trade Receivables', debit: 485000, credit: 0 },
      { account_code: '4100', account_name: 'Customs Duty Revenue', debit: 0, credit: 350000 },
      { account_code: '4200', account_name: 'VAT Revenue', debit: 0, credit: 135000 },
    ],
  },
  {
    id: 'jnl-002', reference: 'JNL-2026-04820', date: '2026-02-22', description: 'Payment received — Nairobi Exports Ltd',
    source_type: 'payment', source_ref: 'PAY-2026-0188', status: 'posted', created_by: 'System', approved_by: null,
    lines: [
      { account_code: '1200', account_name: 'Cash & Bank', debit: 48500, credit: 0 },
      { account_code: '1100', account_name: 'Trade Receivables', debit: 0, credit: 48500 },
    ],
  },
  {
    id: 'jnl-003', reference: 'JNL-2026-04819', date: '2026-02-22', description: 'FX settlement KES to NGN via PAPSS',
    source_type: 'fx_settlement', source_ref: 'FX-2026-0892', status: 'posted', created_by: 'System', approved_by: 'David Otieno',
    lines: [
      { account_code: '1210', account_name: 'Bank — NGN Nostro', debit: 1250000, credit: 0 },
      { account_code: '1200', account_name: 'Cash & Bank (KES)', debit: 0, credit: 1247500 },
      { account_code: '5100', account_name: 'FX Settlement Costs', debit: 2500, credit: 0 },
      { account_code: '3100', account_name: 'FX Revaluation Reserve', debit: 0, credit: 5000 },
    ],
  },
  {
    id: 'jnl-004', reference: 'JNL-2026-04818', date: '2026-02-22', description: 'Export declaration — Tanzania bound cargo',
    source_type: 'trade_document', source_ref: 'TZ-2026-0018', status: 'pending', created_by: 'System', approved_by: null,
    lines: [
      { account_code: '1300', account_name: 'Export Receivables', debit: 320000, credit: 0 },
      { account_code: '4400', account_name: 'Export Processing Revenue', debit: 0, credit: 320000 },
    ],
  },
  {
    id: 'jnl-005', reference: 'JNL-2026-04817', date: '2026-02-21', description: 'Manual reclassification — Account 4200 correction',
    source_type: 'manual', source_ref: 'ADJ-2026-0041', status: 'posted', created_by: 'Jane Mwangi', approved_by: 'David Otieno',
    lines: [
      { account_code: '4200', account_name: 'VAT Revenue', debit: 150000, credit: 0 },
      { account_code: '4210', account_name: 'VAT Revenue — Corrected', debit: 0, credit: 150000 },
    ],
  },
  {
    id: 'jnl-006', reference: 'JNL-2026-04816', date: '2026-02-21', description: 'VAT reversal — Assessment ASM-2026-0412',
    source_type: 'tax_assessment', source_ref: 'ASM-2026-0412', status: 'reversed', created_by: 'System', approved_by: 'Jane Mwangi',
    lines: [
      { account_code: '4200', account_name: 'VAT Revenue', debit: 92000, credit: 0 },
      { account_code: '1100', account_name: 'Trade Receivables', debit: 0, credit: 92000 },
    ],
  },
  {
    id: 'jnl-007', reference: 'JNL-2026-04815', date: '2026-02-21', description: 'Excise duty — Fuel import consignment',
    source_type: 'tax_assessment', source_ref: 'ASM-2026-0410', status: 'posted', created_by: 'System', approved_by: null,
    lines: [
      { account_code: '1100', account_name: 'Trade Receivables', debit: 875000, credit: 0 },
      { account_code: '4100', account_name: 'Customs Duty Revenue', debit: 0, credit: 500000 },
      { account_code: '4300', account_name: 'Excise Revenue', debit: 0, credit: 250000 },
      { account_code: '4200', account_name: 'VAT Revenue', debit: 0, credit: 125000 },
    ],
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  posted: { label: 'Posted', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  reversed: { label: 'Reversed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const SOURCE_CONFIG: Record<string, { label: string; color: string }> = {
  trade_document: { label: 'Trade', color: '#3B82F6' },
  tax_assessment: { label: 'Tax', color: '#22C55E' },
  payment: { label: 'Payment', color: '#D4AF37' },
  fx_settlement: { label: 'FX', color: '#8B5CF6' },
  manual: { label: 'Manual', color: '#999' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function JournalEntriesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return MOCK_JOURNALS.filter((j) => {
      if (statusFilter !== 'all' && j.status !== statusFilter) return false;
      if (sourceFilter !== 'all' && j.source_type !== sourceFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return j.reference.toLowerCase().includes(q) || j.description.toLowerCase().includes(q) || j.source_ref.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, statusFilter, sourceFilter]);

  const totalDebits = useMemo(() => MOCK_JOURNALS.reduce((s, j) => s + j.lines.reduce((a, l) => a + l.debit, 0), 0), []);
  const postedCount = MOCK_JOURNALS.filter((j) => j.status === 'posted').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <MenuBook sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Journal Entries</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            Browse, search, and review all double-entry journal postings.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Manual Journal
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Journals', value: MOCK_JOURNALS.length.toString(), color: '#D4AF37' },
          { label: 'Posted', value: postedCount.toString(), color: '#22C55E' },
          { label: 'Pending Review', value: MOCK_JOURNALS.filter((j) => j.status === 'pending').length.toString(), color: '#E6A817' },
          { label: 'Total Debits', value: totalDebits >= 1_000_000 ? `KSh ${(totalDebits / 1_000_000).toFixed(1)}M` : `KSh ${(totalDebits / 1000).toFixed(0)}K`, color: '#3B82F6' },
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
              placeholder="Search reference, description, source..."
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
            <TextField fullWidth size="small" select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} label="Source">
              <MenuItem value="all">All Sources</MenuItem>
              {Object.entries(SOURCE_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Journal List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.map((j) => {
          const sts = STATUS_CONFIG[j.status];
          const src = SOURCE_CONFIG[j.source_type];
          const isOpen = expanded === j.id;
          const totalDebit = j.lines.reduce((s, l) => s + l.debit, 0);
          const totalCredit = j.lines.reduce((s, l) => s + l.credit, 0);

          return (
            <Card key={j.id} sx={{ overflow: 'hidden' }}>
              {/* Header row */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 70px 100px 100px 75px 40px',
                  gap: 1, px: 2.5, py: 2,
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                }}
                onClick={() => setExpanded(isOpen ? null : j.id)}
              >
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>{j.reference}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>{j.date}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{j.description}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    <Chip label={src.label} size="small" sx={{ fontSize: 9, height: 16, backgroundColor: `${src.color}15`, color: src.color }} />
                    <Typography sx={{ fontSize: 10, color: '#555' }}>Ref: {j.source_ref}</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 12, color: '#777' }}>{j.lines.length} lines</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', fontFamily: 'monospace', textAlign: 'right' }}>{totalDebit.toLocaleString()}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', fontFamily: 'monospace', textAlign: 'right' }}>{totalCredit.toLocaleString()}</Typography>
                <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: sts.bg, color: sts.color }} />
                {isOpen ? <ExpandLess sx={{ fontSize: 18, color: '#777' }} /> : <ExpandMore sx={{ fontSize: 18, color: '#777' }} />}
              </Box>

              {/* Expanded detail */}
              {isOpen && (
                <Box sx={{ px: 2.5, pb: 2, borderTop: '1px solid rgba(212,175,55,0.08)' }}>
                  {/* Column headers */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 120px', gap: 1, py: 1, mb: 0.5 }}>
                    {['Account', 'Name', 'Debit', 'Credit'].map((h) => (
                      <Typography key={h} sx={{ fontSize: 10, fontWeight: 600, color: '#555', textTransform: 'uppercase' }}>{h}</Typography>
                    ))}
                  </Box>
                  {j.lines.map((line, li) => (
                    <Box key={li} sx={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 120px', gap: 1, py: 0.75, borderBottom: li < j.lines.length - 1 ? '1px solid rgba(212,175,55,0.04)' : 'none' }}>
                      <Typography sx={{ fontSize: 12, fontFamily: 'monospace', color: '#D4AF37' }}>{line.account_code}</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{line.account_name}</Typography>
                      <Typography sx={{ fontSize: 12, fontFamily: 'monospace', color: line.debit > 0 ? '#f0f0f0' : '#333' }}>{line.debit > 0 ? line.debit.toLocaleString() : '—'}</Typography>
                      <Typography sx={{ fontSize: 12, fontFamily: 'monospace', color: line.credit > 0 ? '#f0f0f0' : '#333' }}>{line.credit > 0 ? line.credit.toLocaleString() : '—'}</Typography>
                    </Box>
                  ))}
                  {/* Totals */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 120px', gap: 1, py: 1, mt: 0.5, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
                    <Box />
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#999' }}>Totals</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#f0f0f0' }}>{totalDebit.toLocaleString()}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#f0f0f0' }}>{totalCredit.toLocaleString()}</Typography>
                  </Box>
                  {/* Meta */}
                  <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                    <Typography sx={{ fontSize: 11, color: '#555' }}>Created by: <Box component="span" sx={{ color: '#999' }}>{j.created_by}</Box></Typography>
                    {j.approved_by && <Typography sx={{ fontSize: 11, color: '#555' }}>Approved by: <Box component="span" sx={{ color: '#999' }}>{j.approved_by}</Box></Typography>}
                  </Box>
                </Box>
              )}
            </Card>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filtered.length} of {MOCK_JOURNALS.length} journal entries
        </Typography>
      </Box>
    </Box>
  );
}
