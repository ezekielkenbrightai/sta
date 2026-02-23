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
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  RemoveCircle,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Types & Mock data ───────────────────────────────────────────────────────

interface TaxExemption {
  id: string;
  trader_name: string;
  exemption_type: 'full' | 'partial' | 'temporary' | 'sector';
  category: string;
  rate_reduction: number;
  reason: string;
  approved_by: string;
  effective_date: string;
  expiry_date: string;
  status: 'active' | 'expired' | 'pending' | 'revoked';
  documents_used: number;
  savings: number;
}

const MOCK_EXEMPTIONS: TaxExemption[] = [
  {
    id: 'ex-001', trader_name: 'Nairobi Exports Ltd', exemption_type: 'partial', category: 'Medical Supplies',
    rate_reduction: 100, reason: 'Essential medical imports under COVID-19 relief program',
    approved_by: 'Jane Mwangi', effective_date: '2025-06-01', expiry_date: '2026-06-01',
    status: 'active', documents_used: 12, savings: 245000,
  },
  {
    id: 'ex-002', trader_name: 'Lagos Trading Co', exemption_type: 'sector', category: 'Agricultural Equipment',
    rate_reduction: 50, reason: 'Agricultural mechanization initiative — duty reduction on tractors and implements',
    approved_by: 'Jane Mwangi', effective_date: '2025-01-01', expiry_date: '2027-12-31',
    status: 'active', documents_used: 8, savings: 178000,
  },
  {
    id: 'ex-003', trader_name: 'Kampala Imports Inc', exemption_type: 'temporary', category: 'Educational Materials',
    rate_reduction: 100, reason: 'Textbook and educational material imports for national literacy program',
    approved_by: 'David Ochieng', effective_date: '2025-09-01', expiry_date: '2026-03-01',
    status: 'active', documents_used: 5, savings: 92000,
  },
  {
    id: 'ex-004', trader_name: 'Dar es Salaam Freight', exemption_type: 'full', category: 'Humanitarian Aid',
    rate_reduction: 100, reason: 'UN World Food Programme relief shipments',
    approved_by: 'Jane Mwangi', effective_date: '2025-03-01', expiry_date: '2025-12-31',
    status: 'expired', documents_used: 22, savings: 560000,
  },
  {
    id: 'ex-005', trader_name: 'Accra Commodities Ltd', exemption_type: 'partial', category: 'Industrial Inputs',
    rate_reduction: 75, reason: 'Manufacturing inputs for export processing zone (EPZ) facility',
    approved_by: 'Jane Mwangi', effective_date: '2025-07-01', expiry_date: '2027-06-30',
    status: 'active', documents_used: 15, savings: 312000,
  },
  {
    id: 'ex-006', trader_name: 'Cairo Trade House', exemption_type: 'sector', category: 'Renewable Energy',
    rate_reduction: 100, reason: 'Solar panels and wind turbine components — green energy initiative',
    approved_by: 'David Ochieng', effective_date: '2026-01-01', expiry_date: '2028-12-31',
    status: 'pending', documents_used: 0, savings: 0,
  },
  {
    id: 'ex-007', trader_name: 'Nairobi Exports Ltd', exemption_type: 'temporary', category: 'Construction Materials',
    rate_reduction: 25, reason: 'Government infrastructure project — cement and steel imports',
    approved_by: 'Jane Mwangi', effective_date: '2024-06-01', expiry_date: '2025-06-01',
    status: 'revoked', documents_used: 3, savings: 45000,
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  expired: { label: 'Expired', color: '#999', bg: 'rgba(153,153,153,0.1)' },
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  revoked: { label: 'Revoked', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  full: { label: 'Full Exemption', color: '#22C55E' },
  partial: { label: 'Partial', color: '#3B82F6' },
  temporary: { label: 'Temporary', color: '#E6A817' },
  sector: { label: 'Sector-Wide', color: '#8B5CF6' },
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `KSh ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `KSh ${(value / 1000).toFixed(0)}K`;
  return `KSh ${value.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TaxExemptionsPage() {
  const { filterByOrgName } = useDataIsolation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const baseExemptions = useMemo(() => filterByOrgName(MOCK_EXEMPTIONS, 'trader_name'), [filterByOrgName]);

  const filtered = useMemo(() => {
    return baseExemptions.filter((e) => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return e.trader_name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [baseExemptions, search, statusFilter]);

  const totalSavings = useMemo(() => baseExemptions.filter((e) => e.status === 'active').reduce((s, e) => s + e.savings, 0), [baseExemptions]);
  const activeCount = useMemo(() => baseExemptions.filter((e) => e.status === 'active').length, [baseExemptions]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>Tax Exemptions</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Manage tax exemptions, waivers, and preferential duty programs.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          New Exemption
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Exemptions', value: baseExemptions.length.toString(), color: '#D4AF37' },
          { label: 'Active', value: activeCount.toString(), color: '#22C55E' },
          { label: 'Total Duty Savings', value: formatCurrency(totalSavings), color: '#3B82F6' },
          { label: 'Pending Approval', value: baseExemptions.filter((e) => e.status === 'pending').length.toString(), color: '#E6A817' },
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
              placeholder="Search by trader or category..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField fullWidth size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Cards list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map((e) => {
          const sts = STATUS_CONFIG[e.status];
          const type = TYPE_LABELS[e.exemption_type];
          return (
            <Card key={e.id} sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <RemoveCircle sx={{ fontSize: 18, color: type.color }} />
                    <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#f0f0f0' }}>{e.trader_name}</Typography>
                    <Chip label={type.label} size="small" sx={{ fontSize: 11, height: 22, backgroundColor: `${type.color}15`, color: type.color }} />
                    <Chip label={sts.label} size="small" sx={{ fontSize: 11, height: 22, backgroundColor: sts.bg, color: sts.color }} />
                  </Box>
                  <Typography sx={{ fontSize: 13, color: '#D4AF37', fontWeight: 600 }}>{e.category}</Typography>
                </Box>
                <Tooltip title="View details" arrow>
                  <IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#D4AF37' } }}>
                    <ViewIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography sx={{ fontSize: 13, color: '#b0b0b0', mb: 1.5, lineHeight: 1.5 }}>
                {e.reason}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Reduction</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#22C55E' }}>{e.rate_reduction}%</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Effective</Typography>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{e.effective_date}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Expires</Typography>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{e.expiry_date}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Docs Used</Typography>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{e.documents_used}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Duty Saved</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>{formatCurrency(e.savings)}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Approved By</Typography>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{e.approved_by}</Typography>
                </Box>
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
