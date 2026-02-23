import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Search as SearchIcon,
  OpenInNew as OpenIcon,
  CheckCircle,
  HourglassEmpty,
  Warning,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

const GOVT_ROLES = ['super_admin', 'govt_admin', 'govt_analyst', 'auditor'];

// ─── Types & Mock data ───────────────────────────────────────────────────────

interface TaxAssessment {
  id: string;
  document_ref: string;
  trader_name: string;
  document_type: 'import' | 'export';
  total_value: number;
  currency: string;
  customs_duty: number;
  vat: number;
  excise: number;
  withholding_tax: number;
  total_tax: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'paid' | 'overdue' | 'disputed' | 'waived';
  assessed_at: string;
  due_date: string;
}

const MOCK_ASSESSMENTS: TaxAssessment[] = [
  {
    id: 'ta-001', document_ref: 'KE-2026-0042', trader_name: 'Nairobi Exports Ltd',
    document_type: 'import', total_value: 245000, currency: 'USD',
    customs_duty: 24500, vat: 16800, excise: 4900, withholding_tax: 2300,
    total_tax: 48500, status: 'paid', assessed_at: '2026-02-20', due_date: '2026-02-25',
  },
  {
    id: 'ta-002', document_ref: 'KE-2026-0041', trader_name: 'Nairobi Exports Ltd',
    document_type: 'export', total_value: 78500, currency: 'USD',
    customs_duty: 0, vat: 12560, excise: 0, withholding_tax: 190,
    total_tax: 12750, status: 'pending_approval', assessed_at: '2026-02-19', due_date: '2026-03-01',
  },
  {
    id: 'ta-003', document_ref: 'KE-2026-0040', trader_name: 'Lagos Trading Co',
    document_type: 'import', total_value: 520000, currency: 'EUR',
    customs_duty: 91000, vat: 44200, excise: 15600, withholding_tax: 5200,
    total_tax: 156000, status: 'overdue', assessed_at: '2026-02-10', due_date: '2026-02-15',
  },
  {
    id: 'ta-004', document_ref: 'KE-2026-0038', trader_name: 'Nairobi Exports Ltd',
    document_type: 'import', total_value: 185000, currency: 'USD',
    customs_duty: 18500, vat: 12950, excise: 3700, withholding_tax: 1850,
    total_tax: 37000, status: 'paid', assessed_at: '2026-02-16', due_date: '2026-02-20',
  },
  {
    id: 'ta-005', document_ref: 'KE-2026-0037', trader_name: 'Lagos Trading Co',
    document_type: 'import', total_value: 95000, currency: 'ZAR',
    customs_duty: 14250, vat: 9500, excise: 0, withholding_tax: 950,
    total_tax: 24700, status: 'approved', assessed_at: '2026-02-15', due_date: '2026-02-22',
  },
  {
    id: 'ta-006', document_ref: 'KE-2026-0034', trader_name: 'Lagos Trading Co',
    document_type: 'import', total_value: 150000, currency: 'USD',
    customs_duty: 15000, vat: 5250, excise: 1500, withholding_tax: 750,
    total_tax: 22500, status: 'disputed', assessed_at: '2026-02-12', due_date: '2026-02-18',
  },
  {
    id: 'ta-007', document_ref: 'KE-2026-0033', trader_name: 'Nairobi Exports Ltd',
    document_type: 'import', total_value: 120000, currency: 'USD',
    customs_duty: 18000, vat: 9600, excise: 2400, withholding_tax: 1200,
    total_tax: 31200, status: 'draft', assessed_at: '2026-02-11', due_date: '2026-03-05',
  },
  {
    id: 'ta-008', document_ref: 'KE-2026-0035', trader_name: 'Nairobi Exports Ltd',
    document_type: 'export', total_value: 56000, currency: 'USD',
    customs_duty: 0, vat: 8960, excise: 0, withholding_tax: 560,
    total_tax: 9520, status: 'waived', assessed_at: '2026-02-13', due_date: '2026-02-17',
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#999', bg: 'rgba(153,153,153,0.1)' },
  pending_approval: { label: 'Pending Approval', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  approved: { label: 'Approved', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  paid: { label: 'Paid', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  overdue: { label: 'Overdue', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  disputed: { label: 'Disputed', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  waived: { label: 'Waived', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
};

function formatCurrency(value: number): string {
  return `KSh ${value.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TaxAssessmentPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isGovt = GOVT_ROLES.includes(user?.role || 'trader');
  const traderOrg = user?.organization_name || 'Nairobi Exports Ltd';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Traders only see their own assessments; govt sees all
  const baseAssessments = useMemo(() => {
    if (isGovt) return MOCK_ASSESSMENTS;
    return MOCK_ASSESSMENTS.filter((a) => a.trader_name === traderOrg);
  }, [isGovt, traderOrg]);

  const filtered = useMemo(() => {
    return baseAssessments.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.document_ref.toLowerCase().includes(q) || a.trader_name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [baseAssessments, search, statusFilter]);

  const stats = useMemo(() => ({
    total: baseAssessments.length,
    totalTax: baseAssessments.reduce((sum, a) => sum + a.total_tax, 0),
    paid: baseAssessments.filter((a) => a.status === 'paid').length,
    overdue: baseAssessments.filter((a) => a.status === 'overdue').length,
  }), [baseAssessments]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>{isGovt ? 'Tax Assessments' : 'My Tax Assessments'}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {isGovt
              ? 'Review and manage tax assessments for trade documents.'
              : `Tax assessments for ${traderOrg}.`}
          </Typography>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Assessments', value: stats.total.toString(), color: '#D4AF37', icon: <HourglassEmpty sx={{ fontSize: 16 }} /> },
          { label: 'Total Tax Assessed', value: formatCurrency(stats.totalTax), color: '#22C55E', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
          { label: 'Paid', value: stats.paid.toString(), color: '#3B82F6', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
          { label: 'Overdue', value: stats.overdue.toString(), color: '#EF4444', icon: <Warning sx={{ fontSize: 16 }} /> },
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
              placeholder="Search by document reference or trader..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 20, color: '#777' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              fullWidth
              size="small"
              select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
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
            gridTemplateColumns: '120px 1fr 90px 100px 90px 80px 80px 110px 100px 40px',
            gap: 1,
            px: 2.5,
            py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['Reference', 'Trader', 'Type', 'Customs', 'VAT', 'Excise', 'WHT', 'Total Tax', 'Status', ''].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>No assessments match your filters.</Typography>
          </Box>
        ) : (
          filtered.map((a, i) => {
            const sts = STATUS_CONFIG[a.status];
            return (
              <Box
                key={a.id}
                onClick={() => navigate(`/trade/documents/${a.id}`)}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 90px 100px 90px 80px 80px 110px 100px 40px',
                  gap: 1,
                  px: 2.5,
                  py: 1.75,
                  alignItems: 'center',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                  '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                  cursor: 'pointer',
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>{a.document_ref}</Typography>
                <Typography sx={{ fontSize: 13, color: '#f0f0f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.trader_name}</Typography>
                <Chip
                  label={a.document_type === 'import' ? 'Import' : 'Export'}
                  size="small"
                  sx={{
                    fontSize: 11, height: 22,
                    backgroundColor: a.document_type === 'import' ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)',
                    color: a.document_type === 'import' ? '#3B82F6' : '#22C55E',
                  }}
                />
                <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace' }}>{formatCurrency(a.customs_duty)}</Typography>
                <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace' }}>{formatCurrency(a.vat)}</Typography>
                <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace' }}>{formatCurrency(a.excise)}</Typography>
                <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace' }}>{formatCurrency(a.withholding_tax)}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#f0f0f0' }}>{formatCurrency(a.total_tax)}</Typography>
                <Chip label={sts.label} size="small" sx={{ fontSize: 11, height: 22, backgroundColor: sts.bg, color: sts.color }} />
                <Tooltip title="View document" arrow>
                  <IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#D4AF37' } }}>
                    <OpenIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            );
          })
        )}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {baseAssessments.length} assessments
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37' }}>
            Total: {formatCurrency(filtered.reduce((s, a) => s + a.total_tax, 0))}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
