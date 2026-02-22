import { useState } from 'react';
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
  Edit as EditIcon,
  Search as SearchIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface DutyRate {
  id: string;
  hs_code: string;
  hs_description: string;
  standard_rate: number;
  eac_rate: number;
  afcfta_rate: number;
  effective_date: string;
  last_updated: string;
  status: 'active' | 'pending' | 'expired';
}

const MOCK_RATES: DutyRate[] = [
  { id: 'dr-001', hs_code: '0901.11', hs_description: 'Coffee, not roasted, not decaffeinated', standard_rate: 25, eac_rate: 0, afcfta_rate: 10, effective_date: '2025-07-01', last_updated: '2025-06-15', status: 'active' },
  { id: 'dr-002', hs_code: '0902.10', hs_description: 'Green tea (not fermented)', standard_rate: 25, eac_rate: 0, afcfta_rate: 12, effective_date: '2025-07-01', last_updated: '2025-06-15', status: 'active' },
  { id: 'dr-003', hs_code: '1701.13', hs_description: 'Raw cane sugar', standard_rate: 100, eac_rate: 35, afcfta_rate: 50, effective_date: '2025-07-01', last_updated: '2025-06-15', status: 'active' },
  { id: 'dr-004', hs_code: '2523.29', hs_description: 'Portland cement', standard_rate: 35, eac_rate: 25, afcfta_rate: 20, effective_date: '2025-07-01', last_updated: '2025-06-15', status: 'active' },
  { id: 'dr-005', hs_code: '3004.90', hs_description: 'Medicaments, packaged for retail', standard_rate: 0, eac_rate: 0, afcfta_rate: 0, effective_date: '2025-01-01', last_updated: '2024-12-01', status: 'active' },
  { id: 'dr-006', hs_code: '6109.10', hs_description: 'T-shirts, cotton', standard_rate: 35, eac_rate: 25, afcfta_rate: 15, effective_date: '2025-07-01', last_updated: '2025-06-15', status: 'active' },
  { id: 'dr-007', hs_code: '7108.12', hs_description: 'Gold, non-monetary, semi-manufactured', standard_rate: 0, eac_rate: 0, afcfta_rate: 0, effective_date: '2025-01-01', last_updated: '2024-12-01', status: 'active' },
  { id: 'dr-008', hs_code: '8471.30', hs_description: 'Portable digital computers (laptops)', standard_rate: 0, eac_rate: 0, afcfta_rate: 0, effective_date: '2025-01-01', last_updated: '2024-12-01', status: 'active' },
  { id: 'dr-009', hs_code: '8703.23', hs_description: 'Motor vehicles, 1500-3000cc', standard_rate: 25, eac_rate: 25, afcfta_rate: 15, effective_date: '2025-07-01', last_updated: '2025-06-15', status: 'active' },
  { id: 'dr-010', hs_code: '2710.12', hs_description: 'Light petroleum oils (petrol)', standard_rate: 0, eac_rate: 0, afcfta_rate: 0, effective_date: '2025-01-01', last_updated: '2024-12-01', status: 'active' },
  { id: 'dr-011', hs_code: '2402.20', hs_description: 'Cigarettes containing tobacco', standard_rate: 35, eac_rate: 35, afcfta_rate: 25, effective_date: '2026-01-01', last_updated: '2025-12-01', status: 'pending' },
  { id: 'dr-012', hs_code: '2203.00', hs_description: 'Beer made from malt', standard_rate: 25, eac_rate: 25, afcfta_rate: 15, effective_date: '2024-07-01', last_updated: '2024-06-15', status: 'expired' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  expired: { label: 'Expired', color: '#999', bg: 'rgba(153,153,153,0.1)' },
};

function rateColor(rate: number): string {
  if (rate === 0) return '#22C55E';
  if (rate <= 10) return '#3B82F6';
  if (rate <= 25) return '#E6A817';
  return '#EF4444';
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DutyRateManagementPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = MOCK_RATES.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.hs_code.includes(q) || r.hs_description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>Duty Rate Management</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Manage customs duty rates across trade agreements and HS codes.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Rate
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Rates', value: MOCK_RATES.length, color: '#D4AF37' },
          { label: 'Active', value: MOCK_RATES.filter((r) => r.status === 'active').length, color: '#22C55E' },
          { label: 'Duty-Free (0%)', value: MOCK_RATES.filter((r) => r.standard_rate === 0).length, color: '#3B82F6' },
          { label: 'Pending Updates', value: MOCK_RATES.filter((r) => r.status === 'pending').length, color: '#E6A817' },
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
              placeholder="Search by HS code or description..."
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

      {/* Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 90px 80px 90px 90px 80px 70px',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['HS Code', 'Description', 'Standard', 'EAC', 'AfCFTA', 'Effective', 'Status', ''].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {filtered.map((r, i) => {
          const sts = STATUS_CONFIG[r.status];
          return (
            <Box
              key={r.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 90px 80px 90px 90px 80px 70px',
                gap: 1, px: 2.5, py: 1.75,
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{r.hs_code}</Typography>
              <Typography sx={{ fontSize: 13, color: '#f0f0f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.hs_description}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: rateColor(r.standard_rate) }}>{r.standard_rate}%</Typography>
              <Typography sx={{ fontSize: 13, color: rateColor(r.eac_rate) }}>{r.eac_rate}%</Typography>
              <Typography sx={{ fontSize: 13, color: rateColor(r.afcfta_rate) }}>{r.afcfta_rate}%</Typography>
              <Typography sx={{ fontSize: 11, color: '#999' }}>{r.effective_date}</Typography>
              <Chip label={sts.label} size="small" sx={{ fontSize: 11, height: 22, backgroundColor: sts.bg, color: sts.color }} />
              <Box sx={{ display: 'flex', gap: 0.25 }}>
                <Tooltip title="Edit rate" arrow>
                  <IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#D4AF37' } }}>
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View history" arrow>
                  <IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#3B82F6' } }}>
                    <HistoryIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          );
        })}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {MOCK_RATES.length} duty rates
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
