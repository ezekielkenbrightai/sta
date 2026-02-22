import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Add as AddIcon,
  Description as DocIcon,
  FilterList as FilterIcon,
  OpenInNew as OpenIcon,
  Search as SearchIcon,
  TrendingUp,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import type { TradeDocument, TradeDocumentStatus, TradeDocumentType } from '../../types';

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_DOCUMENTS: TradeDocument[] = [
  {
    id: 'td-001', type: 'import', status: 'completed', reference_number: 'KE-2026-0042',
    trader_id: 'o-nex', trader_name: 'Nairobi Exports Ltd',
    origin_country: 'China', destination_country: 'Kenya',
    total_value: 245000, currency: 'USD', items_count: 12,
    created_at: '2026-02-20T10:30:00Z', updated_at: '2026-02-21T15:45:00Z',
  },
  {
    id: 'td-002', type: 'export', status: 'assessed', reference_number: 'KE-2026-0041',
    trader_id: 'o-nex', trader_name: 'Nairobi Exports Ltd',
    origin_country: 'Kenya', destination_country: 'Nigeria',
    total_value: 78500, currency: 'USD', items_count: 5,
    created_at: '2026-02-19T08:15:00Z', updated_at: '2026-02-20T12:30:00Z',
  },
  {
    id: 'td-003', type: 'import', status: 'under_review', reference_number: 'KE-2026-0040',
    trader_id: 'o-lag', trader_name: 'Lagos Trading Co',
    origin_country: 'Germany', destination_country: 'Kenya',
    total_value: 520000, currency: 'EUR', items_count: 24,
    created_at: '2026-02-18T14:00:00Z', updated_at: '2026-02-19T09:20:00Z',
  },
  {
    id: 'td-004', type: 'export', status: 'submitted', reference_number: 'KE-2026-0039',
    trader_id: 'o-nex', trader_name: 'Nairobi Exports Ltd',
    origin_country: 'Kenya', destination_country: 'Tanzania',
    total_value: 32000, currency: 'USD', items_count: 3,
    created_at: '2026-02-17T11:45:00Z', updated_at: '2026-02-17T11:45:00Z',
  },
  {
    id: 'td-005', type: 'import', status: 'paid', reference_number: 'KE-2026-0038',
    trader_id: 'o-nex', trader_name: 'Nairobi Exports Ltd',
    origin_country: 'India', destination_country: 'Kenya',
    total_value: 185000, currency: 'USD', items_count: 18,
    created_at: '2026-02-16T09:00:00Z', updated_at: '2026-02-20T16:00:00Z',
  },
  {
    id: 'td-006', type: 'transit', status: 'verified', reference_number: 'KE-2026-0037',
    trader_id: 'o-lag', trader_name: 'Lagos Trading Co',
    origin_country: 'South Africa', destination_country: 'Uganda',
    total_value: 95000, currency: 'ZAR', items_count: 8,
    created_at: '2026-02-15T07:30:00Z', updated_at: '2026-02-18T13:00:00Z',
  },
  {
    id: 'td-007', type: 'import', status: 'draft', reference_number: 'KE-2026-0036',
    trader_id: 'o-nex', trader_name: 'Nairobi Exports Ltd',
    origin_country: 'Japan', destination_country: 'Kenya',
    total_value: 410000, currency: 'USD', items_count: 6,
    created_at: '2026-02-14T16:15:00Z', updated_at: '2026-02-14T16:15:00Z',
  },
  {
    id: 'td-008', type: 'export', status: 'cleared', reference_number: 'KE-2026-0035',
    trader_id: 'o-nex', trader_name: 'Nairobi Exports Ltd',
    origin_country: 'Kenya', destination_country: 'Ethiopia',
    total_value: 56000, currency: 'USD', items_count: 4,
    created_at: '2026-02-13T12:00:00Z', updated_at: '2026-02-17T10:30:00Z',
  },
  {
    id: 'td-009', type: 'import', status: 'rejected', reference_number: 'KE-2026-0034',
    trader_id: 'o-lag', trader_name: 'Lagos Trading Co',
    origin_country: 'UAE', destination_country: 'Nigeria',
    total_value: 150000, currency: 'USD', items_count: 10,
    created_at: '2026-02-12T09:30:00Z', updated_at: '2026-02-15T14:00:00Z',
  },
  {
    id: 'td-010', type: 're_export', status: 'submitted', reference_number: 'KE-2026-0033',
    trader_id: 'o-nex', trader_name: 'Nairobi Exports Ltd',
    origin_country: 'China', destination_country: 'Rwanda',
    total_value: 120000, currency: 'USD', items_count: 15,
    created_at: '2026-02-11T08:00:00Z', updated_at: '2026-02-11T08:00:00Z',
  },
];

// ─── Status helpers ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TradeDocumentStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#999', bg: 'rgba(153,153,153,0.1)' },
  submitted: { label: 'Submitted', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  under_review: { label: 'Under Review', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  verified: { label: 'Verified', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  assessed: { label: 'Assessed', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  paid: { label: 'Paid', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  cleared: { label: 'Cleared', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  completed: { label: 'Completed', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  rejected: { label: 'Rejected', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const TYPE_LABELS: Record<TradeDocumentType, string> = {
  import: 'Import',
  export: 'Export',
  transit: 'Transit',
  re_export: 'Re-export',
};

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TradeDocumentListPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredDocs = useMemo(() => {
    return MOCK_DOCUMENTS.filter((doc) => {
      if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
      if (typeFilter !== 'all' && doc.type !== typeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          doc.reference_number.toLowerCase().includes(q) ||
          doc.trader_name.toLowerCase().includes(q) ||
          doc.origin_country.toLowerCase().includes(q) ||
          doc.destination_country.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  // Summary stats
  const stats = useMemo(() => {
    const total = MOCK_DOCUMENTS.length;
    const active = MOCK_DOCUMENTS.filter((d) => !['completed', 'rejected', 'draft'].includes(d.status)).length;
    const totalValue = MOCK_DOCUMENTS.reduce((sum, d) => sum + d.total_value, 0);
    const imports = MOCK_DOCUMENTS.filter((d) => d.type === 'import').length;
    return { total, active, totalValue, imports };
  }, []);

  const canCreate = user?.role === 'trader' || user?.role === 'customs_officer' || user?.role === 'super_admin';

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>Trade Documents</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Manage import/export documents across your trade operations.
          </Typography>
        </Box>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/trade/documents/new')}
            sx={{ flexShrink: 0 }}
          >
            New Document
          </Button>
        )}
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Documents', value: stats.total.toString(), color: '#D4AF37' },
          { label: 'Active', value: stats.active.toString(), color: '#3B82F6' },
          { label: 'Total Value', value: `$${(stats.totalValue / 1000000).toFixed(1)}M`, color: '#22C55E' },
          { label: 'Imports', value: stats.imports.toString(), color: '#E6A817' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
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
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by reference, trader, country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <Grid size={{ xs: 6, sm: 3.5 }}>
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
          <Grid size={{ xs: 6, sm: 3.5 }}>
            <TextField
              fullWidth
              size="small"
              select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card sx={{ overflow: 'hidden' }}>
        {/* Table header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr 1fr', md: '140px 90px 1fr 120px 120px 120px 100px 50px' },
            gap: 1,
            px: 2.5,
            py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['Reference', 'Type', 'Trader / Route', 'Value', 'Status', 'Date', 'Items', ''].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em', display: { xs: h === 'Reference' || h === 'Status' || h === 'Value' ? 'block' : 'none', md: 'block' } }}>
              {h}
            </Typography>
          ))}
        </Box>

        {/* Rows */}
        {filteredDocs.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>No documents match your filters.</Typography>
          </Box>
        ) : (
          filteredDocs.map((doc) => {
            const statusCfg = STATUS_CONFIG[doc.status];
            return (
              <Box
                key={doc.id}
                onClick={() => navigate(`/trade/documents/${doc.id}`)}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr 1fr', md: '140px 90px 1fr 120px 120px 120px 100px 50px' },
                  gap: 1,
                  px: 2.5,
                  py: 2,
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(212,175,55,0.05)',
                  '&:hover': { backgroundColor: 'rgba(212,175,55,0.04)' },
                  alignItems: 'center',
                }}
              >
                {/* Reference */}
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>
                  {doc.reference_number}
                </Typography>

                {/* Type */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Chip
                    label={TYPE_LABELS[doc.type]}
                    size="small"
                    sx={{
                      fontSize: 11,
                      height: 24,
                      backgroundColor: doc.type === 'import' ? 'rgba(59,130,246,0.1)' : doc.type === 'export' ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.1)',
                      color: doc.type === 'import' ? '#3B82F6' : doc.type === 'export' ? '#22C55E' : '#8B5CF6',
                    }}
                  />
                </Box>

                {/* Trader / Route */}
                <Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.trader_name}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: '#777' }}>
                    {doc.origin_country} → {doc.destination_country}
                  </Typography>
                </Box>

                {/* Value */}
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>
                  {formatCurrency(doc.total_value, doc.currency)}
                </Typography>

                {/* Status */}
                <Box>
                  <Chip
                    label={statusCfg.label}
                    size="small"
                    sx={{
                      fontSize: 11,
                      height: 24,
                      backgroundColor: statusCfg.bg,
                      color: statusCfg.color,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Date */}
                <Typography sx={{ fontSize: 12, color: '#999', display: { xs: 'none', md: 'block' } }}>
                  {formatDate(doc.created_at)}
                </Typography>

                {/* Items count */}
                <Typography sx={{ fontSize: 12, color: '#999', display: { xs: 'none', md: 'block' } }}>
                  {doc.items_count} items
                </Typography>

                {/* Action */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
                  <Tooltip title="Open document" arrow>
                    <IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#D4AF37' } }}>
                      <OpenIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            );
          })
        )}

        {/* Footer */}
        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filteredDocs.length} of {MOCK_DOCUMENTS.length} documents
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
