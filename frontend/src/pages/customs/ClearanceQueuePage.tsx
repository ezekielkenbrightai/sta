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
  Assignment,
  Search as SearchIcon,
  CheckCircle,
  Schedule,
  Warning,
  Visibility,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface ClearanceItem {
  id: string;
  reference: string;
  trade_doc_ref: string;
  trader: string;
  type: 'import' | 'export' | 'transit';
  origin_country: string;
  dest_country: string;
  hs_codes: string[];
  declared_value_kes: number;
  duty_assessed_kes: number;
  status: 'submitted' | 'document_check' | 'risk_assessed' | 'pending_inspection' | 'inspection_complete' | 'payment_pending' | 'cleared' | 'rejected';
  risk_level: 'green' | 'yellow' | 'red';
  assigned_officer: string | null;
  submitted_at: string;
  port_of_entry: string;
  items_count: number;
  containers: number;
}

const MOCK_QUEUE: ClearanceItem[] = [
  { id: 'cq-001', reference: 'CUS-2026-5421', trade_doc_ref: 'TD-2026-1842', trader: 'Kenya Pharma Distributors', type: 'import', origin_country: 'India', dest_country: 'Kenya', hs_codes: ['3004.90', '3003.20'], declared_value_kes: 4850000, duty_assessed_kes: 485000, status: 'cleared', risk_level: 'green', assigned_officer: 'Jane Mwangi', submitted_at: '2026-02-22 09:15', port_of_entry: 'JKIA Air Cargo', items_count: 50, containers: 2 },
  { id: 'cq-002', reference: 'CUS-2026-5420', trade_doc_ref: 'TD-2026-1841', trader: 'Nairobi Exports Ltd', type: 'export', origin_country: 'Kenya', dest_country: 'Tanzania', hs_codes: ['0902.10'], declared_value_kes: 12400000, duty_assessed_kes: 0, status: 'cleared', risk_level: 'green', assigned_officer: 'James Otieno', submitted_at: '2026-02-22 08:45', port_of_entry: 'Mombasa Port', items_count: 200, containers: 4 },
  { id: 'cq-003', reference: 'CUS-2026-5419', trade_doc_ref: 'TD-2026-1840', trader: 'East Africa Cement Ltd', type: 'import', origin_country: 'China', dest_country: 'Kenya', hs_codes: ['2523.29', '7213.10'], declared_value_kes: 36000000, duty_assessed_kes: 9000000, status: 'pending_inspection', risk_level: 'yellow', assigned_officer: null, submitted_at: '2026-02-22 07:30', port_of_entry: 'Mombasa Port', items_count: 120, containers: 8 },
  { id: 'cq-004', reference: 'CUS-2026-5418', trade_doc_ref: 'TD-2026-1839', trader: 'Cairo Trade House', type: 'transit', origin_country: 'Egypt', dest_country: 'Uganda', hs_codes: ['8471.30', '8528.72'], declared_value_kes: 8900000, duty_assessed_kes: 0, status: 'document_check', risk_level: 'green', assigned_officer: 'Grace Njeri', submitted_at: '2026-02-22 06:00', port_of_entry: 'Malaba Border', items_count: 45, containers: 1 },
  { id: 'cq-005', reference: 'CUS-2026-5417', trade_doc_ref: 'TD-2026-1838', trader: 'Lagos Electronics Ltd', type: 'import', origin_country: 'Japan', dest_country: 'Kenya', hs_codes: ['8517.12', '8471.49'], declared_value_kes: 22000000, duty_assessed_kes: 5500000, status: 'risk_assessed', risk_level: 'red', assigned_officer: 'David Maina', submitted_at: '2026-02-21 16:00', port_of_entry: 'JKIA Air Cargo', items_count: 80, containers: 3 },
  { id: 'cq-006', reference: 'CUS-2026-5416', trade_doc_ref: 'TD-2026-1837', trader: 'Addis Pharmaceutical', type: 'import', origin_country: 'Germany', dest_country: 'Ethiopia', hs_codes: ['3004.50'], declared_value_kes: 7200000, duty_assessed_kes: 360000, status: 'payment_pending', risk_level: 'green', assigned_officer: 'Jane Mwangi', submitted_at: '2026-02-21 14:30', port_of_entry: 'Mombasa Port', items_count: 25, containers: 1 },
  { id: 'cq-007', reference: 'CUS-2026-5415', trade_doc_ref: 'TD-2026-1836', trader: 'Nairobi Fashion House', type: 'import', origin_country: 'Turkey', dest_country: 'Kenya', hs_codes: ['6204.23', '6109.10'], declared_value_kes: 3200000, duty_assessed_kes: 800000, status: 'inspection_complete', risk_level: 'yellow', assigned_officer: 'Grace Njeri', submitted_at: '2026-02-21 11:00', port_of_entry: 'JKIA Air Cargo', items_count: 300, containers: 2 },
  { id: 'cq-008', reference: 'CUS-2026-5414', trade_doc_ref: 'TD-2026-1835', trader: 'Auto Kenya Ltd', type: 'import', origin_country: 'South Africa', dest_country: 'Kenya', hs_codes: ['8703.23', '8708.29'], declared_value_kes: 45000000, duty_assessed_kes: 11250000, status: 'submitted', risk_level: 'red', assigned_officer: null, submitted_at: '2026-02-21 09:00', port_of_entry: 'Mombasa Port', items_count: 8, containers: 4 },
  { id: 'cq-009', reference: 'CUS-2026-5413', trade_doc_ref: 'TD-2026-1834', trader: 'Dar es Salaam Freight', type: 'transit', origin_country: 'UAE', dest_country: 'DRC', hs_codes: ['7304.11'], declared_value_kes: 18000000, duty_assessed_kes: 0, status: 'rejected', risk_level: 'red', assigned_officer: 'David Maina', submitted_at: '2026-02-20 15:00', port_of_entry: 'Mombasa Port', items_count: 60, containers: 6 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; order: number }> = {
  submitted: { label: 'Submitted', color: '#999', bg: 'rgba(153,153,153,0.1)', order: 0 },
  document_check: { label: 'Doc Check', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', order: 1 },
  risk_assessed: { label: 'Risk Assessed', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', order: 2 },
  pending_inspection: { label: 'Pending Inspection', color: '#E6A817', bg: 'rgba(230,168,23,0.1)', order: 3 },
  inspection_complete: { label: 'Inspected', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)', order: 4 },
  payment_pending: { label: 'Awaiting Payment', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', order: 5 },
  cleared: { label: 'Cleared', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', order: 6 },
  rejected: { label: 'Rejected', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', order: 7 },
};

const RISK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  green: { label: 'Low Risk', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  yellow: { label: 'Medium Risk', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  red: { label: 'High Risk', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const TYPE_COLORS: Record<string, string> = {
  import: '#3B82F6',
  export: '#22C55E',
  transit: '#8B5CF6',
};

function formatValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString();
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ClearanceQueuePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_QUEUE.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (riskFilter !== 'all' && c.risk_level !== riskFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.reference.toLowerCase().includes(q) || c.trader.toLowerCase().includes(q) || c.port_of_entry.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, statusFilter, riskFilter]);

  const pendingCount = MOCK_QUEUE.filter((c) => !['cleared', 'rejected'].includes(c.status)).length;
  const clearedToday = MOCK_QUEUE.filter((c) => c.status === 'cleared' && c.submitted_at.startsWith('2026-02-22')).length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Assignment sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Clearance Queue</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Customs declarations awaiting processing, inspection, and clearance.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Declarations', value: MOCK_QUEUE.length.toString(), color: '#D4AF37', icon: <Assignment sx={{ fontSize: 18, color: '#D4AF37' }} /> },
          { label: 'Pending Clearance', value: pendingCount.toString(), color: '#E6A817', icon: <Schedule sx={{ fontSize: 18, color: '#E6A817' }} /> },
          { label: 'Cleared Today', value: clearedToday.toString(), color: '#22C55E', icon: <CheckCircle sx={{ fontSize: 18, color: '#22C55E' }} /> },
          { label: 'Flagged / Held', value: MOCK_QUEUE.filter((c) => c.risk_level === 'red').length.toString(), color: '#EF4444', icon: <Warning sx={{ fontSize: 18, color: '#EF4444' }} /> },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                {s.icon}
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
              </Box>
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
              placeholder="Search reference, trader, or port..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField fullWidth size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField fullWidth size="small" select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} label="Risk Level">
              <MenuItem value="all">All Risks</MenuItem>
              {Object.entries(RISK_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Queue Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.map((c) => {
          const sts = STATUS_CONFIG[c.status];
          const risk = RISK_CONFIG[c.risk_level];
          return (
            <Card key={c.id} sx={{ p: 2.5, borderLeft: `3px solid ${risk.color}`, opacity: c.status === 'rejected' ? 0.6 : 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{c.reference}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#555' }}>({c.trade_doc_ref})</Typography>
                    <Chip label={c.type} size="small" sx={{ fontSize: 9, height: 16, color: TYPE_COLORS[c.type], backgroundColor: `${TYPE_COLORS[c.type]}15` }} />
                  </Box>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{c.trader}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  <Chip label={risk.label} size="small" sx={{ fontSize: 9, height: 20, color: risk.color, backgroundColor: risk.bg }} />
                  <Chip label={sts.label} size="small" sx={{ fontSize: 9, height: 20, color: sts.color, backgroundColor: sts.bg }} />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Route</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.origin_country} → {c.dest_country}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>{c.port_of_entry}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>HS Codes</Typography>
                  <Typography sx={{ fontSize: 11, color: '#b0b0b0', fontFamily: 'monospace' }}>{c.hs_codes.join(', ')}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Declared Value</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>KSh {formatValue(c.declared_value_kes)}</Typography>
                  {c.duty_assessed_kes > 0 && <Typography sx={{ fontSize: 10, color: '#E6A817' }}>Duty: KSh {formatValue(c.duty_assessed_kes)}</Typography>}
                </Grid>
                <Grid size={{ xs: 4, sm: 1.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Items</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.items_count} ({c.containers} TEU)</Typography>
                </Grid>
                <Grid size={{ xs: 4, sm: 1.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Officer</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.assigned_officer || 'Unassigned'}</Typography>
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Submitted</Typography>
                  <Typography sx={{ fontSize: 11, color: '#777' }}>{c.submitted_at}</Typography>
                </Grid>
              </Grid>

              {!['cleared', 'rejected'].includes(c.status) && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, justifyContent: 'flex-end' }}>
                  <Button size="small" startIcon={<Visibility sx={{ fontSize: 14 }} />} sx={{ fontSize: 11, color: '#777' }}>Review</Button>
                  <Button size="small" variant="outlined" sx={{ fontSize: 11, borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>Process</Button>
                </Box>
              )}
            </Card>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filtered.length} of {MOCK_QUEUE.length} declarations
        </Typography>
      </Box>
    </Box>
  );
}
