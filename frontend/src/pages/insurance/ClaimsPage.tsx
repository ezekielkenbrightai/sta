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
  ReportProblem,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface Claim {
  id: string;
  reference: string;
  policy_ref: string;
  trader: string;
  provider: string;
  type: string;
  claim_type: 'damage' | 'loss' | 'delay' | 'non_payment' | 'theft' | 'natural_disaster';
  amount_usd: number;
  settled_usd: number | null;
  status: 'submitted' | 'under_review' | 'investigation' | 'approved' | 'denied' | 'paid' | 'appealed';
  filed_date: string;
  incident_date: string;
  description: string;
  assessor: string | null;
  documents_count: number;
}

const MOCK_CLAIMS: Claim[] = [
  { id: 'clm-001', reference: 'CLM-2026-0089', policy_ref: 'POL-2026-MC-0421', trader: 'Kenya Pharma Distributors', provider: 'APA Insurance', type: 'Marine Cargo', claim_type: 'damage', amount_usd: 45000, settled_usd: null, status: 'under_review', filed_date: '2026-02-22', incident_date: '2026-02-18', description: 'Water damage to pharmaceutical shipment in container MSKU4821033. Estimated 15% of cargo affected during storm.', assessor: 'James Kimani', documents_count: 8 },
  { id: 'clm-002', reference: 'CLM-2026-0088', policy_ref: 'POL-2026-TC-0189', trader: 'Cairo Trade House', provider: 'Jubilee Insurance', type: 'Trade Credit', claim_type: 'non_payment', amount_usd: 120000, settled_usd: 108000, status: 'approved', filed_date: '2026-02-21', incident_date: '2026-01-30', description: 'Buyer default on electronics import payment. 90-day overdue. Buyer declared insolvency.', assessor: 'Grace Oduya', documents_count: 12 },
  { id: 'clm-003', reference: 'CLM-2026-0087', policy_ref: 'POL-2026-MC-0398', trader: 'Lagos Electronics Ltd', provider: 'Britam Insurance', type: 'Marine Cargo', claim_type: 'theft', amount_usd: 88000, settled_usd: null, status: 'investigation', filed_date: '2026-02-21', incident_date: '2026-02-15', description: 'Pilferage detected at Mombasa port. 12 cartons of smartphones missing from container. Police report filed.', assessor: 'James Kimani', documents_count: 15 },
  { id: 'clm-004', reference: 'CLM-2026-0086', policy_ref: 'POL-2026-IT-0067', trader: 'East Africa Cement Ltd', provider: 'CIC Insurance', type: 'Inland Transit', claim_type: 'damage', amount_usd: 15000, settled_usd: 13500, status: 'paid', filed_date: '2026-02-20', incident_date: '2026-02-17', description: 'Truck rollover on Mombasa-Nairobi highway. 8 tonnes of cement damaged due to rain exposure.', assessor: 'Peter Mutua', documents_count: 6 },
  { id: 'clm-005', reference: 'CLM-2026-0085', policy_ref: 'POL-2026-WS-0012', trader: 'Nairobi Exports Ltd', provider: 'APA Insurance', type: 'Warehouse Stock', claim_type: 'natural_disaster', amount_usd: 32000, settled_usd: null, status: 'denied', filed_date: '2026-02-19', incident_date: '2026-02-12', description: 'Flooding at ICD warehouse. Claim denied — force majeure exclusion clause applies per policy Section 4.2.', assessor: 'Grace Oduya', documents_count: 10 },
  { id: 'clm-006', reference: 'CLM-2026-0084', policy_ref: 'POL-2026-TC-0178', trader: 'Addis Pharmaceutical', provider: 'Jubilee Insurance', type: 'Trade Credit', claim_type: 'non_payment', amount_usd: 67000, settled_usd: null, status: 'under_review', filed_date: '2026-02-18', incident_date: '2026-02-01', description: 'Partial payment default from Ethiopian buyer. KSh 67,000 equivalent outstanding beyond 60-day terms.', assessor: null, documents_count: 5 },
  { id: 'clm-007', reference: 'CLM-2026-0083', policy_ref: 'POL-2026-MC-0398', trader: 'Lagos Electronics Ltd', provider: 'Britam Insurance', type: 'Marine Cargo', claim_type: 'delay', amount_usd: 22000, settled_usd: null, status: 'appealed', filed_date: '2026-02-15', incident_date: '2026-02-10', description: 'Perishable electronics accessories expired due to 14-day port delay. Initially denied — trader appealing.', assessor: 'James Kimani', documents_count: 9 },
  { id: 'clm-008', reference: 'CLM-2026-0082', policy_ref: 'POL-2026-IT-0067', trader: 'East Africa Cement Ltd', provider: 'APA Insurance', type: 'Inland Transit', claim_type: 'loss', amount_usd: 8000, settled_usd: 8000, status: 'paid', filed_date: '2026-02-10', incident_date: '2026-02-08', description: 'Complete loss of 3 pallets during rail transfer. SGR confirmed mishandling. Full settlement.', assessor: 'Peter Mutua', documents_count: 4 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: '#999', bg: 'rgba(153,153,153,0.1)' },
  under_review: { label: 'Under Review', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  investigation: { label: 'Investigation', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  approved: { label: 'Approved', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  denied: { label: 'Denied', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  paid: { label: 'Paid', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  appealed: { label: 'Appealed', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
};

const CLAIM_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  damage: { label: 'Damage', color: '#E6A817' },
  loss: { label: 'Total Loss', color: '#EF4444' },
  delay: { label: 'Delay', color: '#F59E0B' },
  non_payment: { label: 'Non-Payment', color: '#3B82F6' },
  theft: { label: 'Theft', color: '#8B5CF6' },
  natural_disaster: { label: 'Natural Disaster', color: '#06B6D4' },
};

function formatUSD(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ClaimsPage() {
  const { filterCustom, orgName, orgType } = useDataIsolation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orgFiltered = useMemo(
    () => filterCustom(MOCK_CLAIMS, (c) => {
      if (orgType === 'insurance') return c.provider === orgName;
      return c.trader === orgName;
    }),
    [filterCustom, orgName, orgType],
  );

  const filtered = useMemo(() => {
    return orgFiltered.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.reference.toLowerCase().includes(q) || c.trader.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [orgFiltered, search, statusFilter]);

  const totalClaimValue = orgFiltered.reduce((s, c) => s + c.amount_usd, 0);
  const totalSettled = orgFiltered.reduce((s, c) => s + (c.settled_usd || 0), 0);
  const openClaims = orgFiltered.filter((c) => ['submitted', 'under_review', 'investigation', 'appealed'].includes(c.status)).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <ReportProblem sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Claims Processing</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            File, track, and manage insurance claims across all policy types.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          File Claim
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Claims', value: orgFiltered.length.toString(), color: '#D4AF37' },
          { label: 'Open Claims', value: openClaims.toString(), color: '#3B82F6' },
          { label: 'Total Claimed', value: formatUSD(totalClaimValue), color: '#EF4444' },
          { label: 'Total Settled', value: formatUSD(totalSettled), color: '#22C55E' },
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
              placeholder="Search reference, trader, or description..."
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

      {/* Claim Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.map((c) => {
          const sts = STATUS_CONFIG[c.status];
          const ct = CLAIM_TYPE_CONFIG[c.claim_type];
          return (
            <Card key={c.id} sx={{ p: 2.5, opacity: c.status === 'denied' ? 0.65 : 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{c.reference}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#555' }}>({c.policy_ref})</Typography>
                    <Chip label={ct.label} size="small" sx={{ fontSize: 9, height: 18, color: ct.color, backgroundColor: `${ct.color}15` }} />
                    <Chip label={sts.label} size="small" sx={{ fontSize: 9, height: 18, color: sts.color, backgroundColor: sts.bg }} />
                  </Box>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{c.trader}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#555' }}>{c.type}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 700, fontFamily: "'Lora', serif", color: '#EF4444' }}>{formatUSD(c.amount_usd)}</Typography>
                  {c.settled_usd && <Typography sx={{ fontSize: 12, color: '#22C55E' }}>Settled: {formatUSD(c.settled_usd)}</Typography>}
                </Box>
              </Box>

              <Box sx={{ mb: 1.5, p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.06)' }}>
                <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.description}</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 2.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Incident Date</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.incident_date}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Filed Date</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.filed_date}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Assessor</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.assessor || 'Unassigned'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Documents</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.documents_count} files</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 2.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Settlement</Typography>
                  <Typography sx={{ fontSize: 12, color: c.settled_usd ? '#22C55E' : '#555' }}>
                    {c.settled_usd ? `${formatUSD(c.settled_usd)} (${Math.round(c.settled_usd / c.amount_usd * 100)}%)` : 'Pending'}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filtered.length} of {orgFiltered.length} claims
        </Typography>
      </Box>
    </Box>
  );
}
