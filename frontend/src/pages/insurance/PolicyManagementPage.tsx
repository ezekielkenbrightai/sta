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
  Policy,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

const GOVT_ROLES = ['super_admin', 'govt_admin', 'govt_analyst', 'auditor', 'insurance_agent'];

// ─── Mock data ───────────────────────────────────────────────────────────────

interface InsurancePolicy {
  id: string;
  reference: string;
  trader: string;
  type: 'marine_cargo' | 'inland_transit' | 'warehouse_stock' | 'trade_credit' | 'political_risk';
  provider: string;
  coverage_usd: number;
  premium_usd: number;
  deductible_usd: number;
  status: 'active' | 'pending' | 'expired' | 'cancelled' | 'claim_active';
  start_date: string;
  end_date: string;
  trade_doc_ref: string;
  route: string;
  claims_count: number;
}

const MOCK_POLICIES: InsurancePolicy[] = [
  { id: 'pol-001', reference: 'POL-2026-MC-0421', trader: 'Kenya Pharma Distributors', type: 'marine_cargo', provider: 'APA Insurance', coverage_usd: 250000, premium_usd: 3750, deductible_usd: 5000, status: 'claim_active', start_date: '2026-01-15', end_date: '2026-07-15', trade_doc_ref: 'TD-2026-1842', route: 'Mumbai → Mombasa', claims_count: 1 },
  { id: 'pol-002', reference: 'POL-2026-TC-0189', trader: 'Cairo Trade House', type: 'trade_credit', provider: 'Jubilee Insurance', coverage_usd: 500000, premium_usd: 12500, deductible_usd: 10000, status: 'active', start_date: '2026-01-01', end_date: '2026-12-31', trade_doc_ref: 'TD-2026-1839', route: 'Cairo → Nairobi', claims_count: 1 },
  { id: 'pol-003', reference: 'POL-2026-MC-0398', trader: 'Lagos Electronics Ltd', type: 'marine_cargo', provider: 'Britam Insurance', coverage_usd: 800000, premium_usd: 16000, deductible_usd: 15000, status: 'active', start_date: '2026-02-01', end_date: '2026-08-01', trade_doc_ref: 'TD-2026-1838', route: 'Tokyo → Mombasa', claims_count: 1 },
  { id: 'pol-004', reference: 'POL-2026-IT-0067', trader: 'East Africa Cement Ltd', type: 'inland_transit', provider: 'CIC Insurance', coverage_usd: 150000, premium_usd: 1800, deductible_usd: 3000, status: 'active', start_date: '2026-02-10', end_date: '2026-05-10', trade_doc_ref: 'TD-2026-1840', route: 'Mombasa → Nairobi (SGR)', claims_count: 1 },
  { id: 'pol-005', reference: 'POL-2026-WS-0012', trader: 'Nairobi Exports Ltd', type: 'warehouse_stock', provider: 'UAP Old Mutual', coverage_usd: 2000000, premium_usd: 18000, deductible_usd: 25000, status: 'active', start_date: '2026-01-01', end_date: '2026-12-31', trade_doc_ref: '—', route: 'Nairobi ICD Warehouse', claims_count: 1 },
  { id: 'pol-006', reference: 'POL-2026-TC-0178', trader: 'Addis Pharmaceutical', type: 'trade_credit', provider: 'Jubilee Insurance', coverage_usd: 300000, premium_usd: 7500, deductible_usd: 6000, status: 'active', start_date: '2026-01-15', end_date: '2026-07-15', trade_doc_ref: 'TD-2026-1837', route: 'Hamburg → Mombasa → Addis', claims_count: 1 },
  { id: 'pol-007', reference: 'POL-2026-PR-0003', trader: 'Nairobi Exports Ltd', type: 'political_risk', provider: 'MIGA (World Bank)', coverage_usd: 1500000, premium_usd: 22500, deductible_usd: 50000, status: 'active', start_date: '2026-01-01', end_date: '2027-01-01', trade_doc_ref: '—', route: 'DRC, South Sudan, Somalia routes', claims_count: 0 },
  { id: 'pol-008', reference: 'POL-2025-MC-0312', trader: 'Auto Kenya Ltd', type: 'marine_cargo', provider: 'APA Insurance', coverage_usd: 450000, premium_usd: 9000, deductible_usd: 10000, status: 'expired', start_date: '2025-06-01', end_date: '2026-01-31', trade_doc_ref: 'TD-2025-4521', route: 'Durban → Mombasa', claims_count: 0 },
  { id: 'pol-009', reference: 'POL-2026-MC-0430', trader: 'Dar es Salaam Freight', type: 'marine_cargo', provider: 'Britam Insurance', coverage_usd: 600000, premium_usd: 12000, deductible_usd: 12000, status: 'pending', start_date: '2026-02-25', end_date: '2026-08-25', trade_doc_ref: 'TD-2026-1850', route: 'Dubai → Mombasa → Dar', claims_count: 0 },
];

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  marine_cargo: { label: 'Marine Cargo', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  inland_transit: { label: 'Inland Transit', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  warehouse_stock: { label: 'Warehouse Stock', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  trade_credit: { label: 'Trade Credit', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  political_risk: { label: 'Political Risk', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  expired: { label: 'Expired', color: '#999', bg: 'rgba(153,153,153,0.1)' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  claim_active: { label: 'Claim Active', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
};

function formatUSD(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PolicyManagementPage() {
  const user = useAuthStore((s) => s.user);
  const isInsurer = GOVT_ROLES.includes(user?.role || 'trader');
  const traderOrg = user?.organization_name || 'Nairobi Exports Ltd';

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const basePolicies = useMemo(() => {
    if (isInsurer) return MOCK_POLICIES;
    return MOCK_POLICIES.filter((p) => p.trader === traderOrg);
  }, [isInsurer, traderOrg]);

  const filtered = useMemo(() => {
    return basePolicies.filter((p) => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.reference.toLowerCase().includes(q) || p.trader.toLowerCase().includes(q) || p.provider.toLowerCase().includes(q);
      }
      return true;
    });
  }, [basePolicies, search, typeFilter, statusFilter]);

  const activeCount = basePolicies.filter((p) => ['active', 'claim_active'].includes(p.status)).length;
  const totalCoverage = basePolicies.filter((p) => ['active', 'claim_active'].includes(p.status)).reduce((s, p) => s + p.coverage_usd, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Policy sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">{isInsurer ? 'Policy Management' : 'My Insurance Policies'}</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            {isInsurer ? 'Manage trade insurance policies — marine cargo, transit, warehouse, credit, and political risk.' : `Insurance policies for ${traderOrg}.`}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          New Policy
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Policies', value: basePolicies.length.toString(), color: '#D4AF37' },
          { label: 'Active', value: activeCount.toString(), color: '#22C55E' },
          { label: 'Total Coverage', value: formatUSD(totalCoverage), color: '#3B82F6' },
          { label: 'Pending Approval', value: basePolicies.filter((p) => p.status === 'pending').length.toString(), color: '#E6A817' },
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
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth size="small"
              placeholder="Search reference, trader, or provider..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField fullWidth size="small" select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Type">
              <MenuItem value="all">All Types</MenuItem>
              {Object.entries(TYPE_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField fullWidth size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Policy Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.map((p) => {
          const tp = TYPE_CONFIG[p.type];
          const sts = STATUS_CONFIG[p.status];
          return (
            <Card key={p.id} sx={{ p: 2.5, opacity: p.status === 'expired' ? 0.6 : 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{p.reference}</Typography>
                    <Chip label={tp.label} size="small" sx={{ fontSize: 9, height: 18, color: tp.color, backgroundColor: tp.bg }} />
                    <Chip label={sts.label} size="small" sx={{ fontSize: 9, height: 18, color: sts.color, backgroundColor: sts.bg }} />
                  </Box>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{p.trader}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#555' }}>Provider: {p.provider}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 700, fontFamily: "'Lora', serif", color: tp.color }}>{formatUSD(p.coverage_usd)}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>coverage</Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Route / Scope</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{p.route}</Typography>
                  {p.trade_doc_ref !== '—' && <Typography sx={{ fontSize: 10, color: '#555' }}>Doc: {p.trade_doc_ref}</Typography>}
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Premium</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{formatUSD(p.premium_usd)}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>{(p.premium_usd / p.coverage_usd * 100).toFixed(1)}% rate</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Deductible</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{formatUSD(p.deductible_usd)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Period</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{p.start_date}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>to {p.end_date}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Claims</Typography>
                  <Typography sx={{ fontSize: 12, color: p.claims_count > 0 ? '#E6A817' : '#555' }}>{p.claims_count > 0 ? p.claims_count : 'None'}</Typography>
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filtered.length} of {basePolicies.length} policies
        </Typography>
      </Box>
    </Box>
  );
}
