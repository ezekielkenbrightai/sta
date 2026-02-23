import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  RequestQuote,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface FreightQuote {
  id: string;
  reference: string;
  requestor: string;
  carrier: string;
  origin: string;
  destination: string;
  mode: 'sea' | 'air' | 'road';
  rate_per_teu: number;
  currency: string;
  transit_days: number;
  valid_until: string;
  includes_insurance: boolean;
  status: 'active' | 'expired' | 'pending';
  reliability_score: number;
}

const MOCK_QUOTES: FreightQuote[] = [
  { id: 'fq-001', reference: 'FQ-2026-0891', requestor: 'Nairobi Exports Ltd', carrier: 'Maersk Line', origin: 'Mombasa', destination: 'Lagos', mode: 'sea', rate_per_teu: 1850, currency: 'USD', transit_days: 14, valid_until: '2026-03-15', includes_insurance: true, status: 'active', reliability_score: 92 },
  { id: 'fq-002', reference: 'FQ-2026-0890', requestor: 'Nairobi Exports Ltd', carrier: 'MSC', origin: 'Mombasa', destination: 'Lagos', mode: 'sea', rate_per_teu: 1720, currency: 'USD', transit_days: 16, valid_until: '2026-03-10', includes_insurance: false, status: 'active', reliability_score: 88 },
  { id: 'fq-003', reference: 'FQ-2026-0889', requestor: 'Addis Pharmaceutical', carrier: 'Kenya Airways Cargo', origin: 'Nairobi (JKIA)', destination: 'Addis Ababa', mode: 'air', rate_per_teu: 4200, currency: 'USD', transit_days: 1, valid_until: '2026-02-28', includes_insurance: true, status: 'active', reliability_score: 97 },
  { id: 'fq-004', reference: 'FQ-2026-0888', requestor: 'Nairobi Exports Ltd', carrier: 'Bolloré Logistics Kenya', origin: 'Mombasa', destination: 'Kampala', mode: 'road', rate_per_teu: 980, currency: 'USD', transit_days: 4, valid_until: '2026-03-31', includes_insurance: true, status: 'active', reliability_score: 82 },
  { id: 'fq-005', reference: 'FQ-2026-0887', requestor: 'East Africa Cement Ltd', carrier: 'CMA CGM', origin: 'Mombasa', destination: 'Dar es Salaam', mode: 'sea', rate_per_teu: 650, currency: 'USD', transit_days: 3, valid_until: '2026-03-20', includes_insurance: false, status: 'active', reliability_score: 94 },
  { id: 'fq-006', reference: 'FQ-2026-0886', requestor: 'Auto Kenya Ltd', carrier: 'Bolloré Logistics Kenya', origin: 'Mombasa', destination: 'Kigali', mode: 'road', rate_per_teu: 1450, currency: 'USD', transit_days: 7, valid_until: '2026-02-15', includes_insurance: true, status: 'expired', reliability_score: 78 },
  { id: 'fq-007', reference: 'FQ-2026-0885', requestor: 'Lagos Electronics Ltd', carrier: 'Ethiopian Airlines', origin: 'Nairobi (JKIA)', destination: 'Accra', mode: 'air', rate_per_teu: 5100, currency: 'USD', transit_days: 1, valid_until: '2026-03-01', includes_insurance: false, status: 'pending', reliability_score: 95 },
  { id: 'fq-008', reference: 'FQ-2026-0884', requestor: 'Dar es Salaam Freight', carrier: 'PIL', origin: 'Mombasa', destination: 'Durban', mode: 'sea', rate_per_teu: 1200, currency: 'USD', transit_days: 8, valid_until: '2026-03-15', includes_insurance: true, status: 'active', reliability_score: 85 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  expired: { label: 'Expired', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
};

const MODE_CONFIG: Record<string, { label: string; color: string }> = {
  sea: { label: 'Sea', color: '#3B82F6' },
  air: { label: 'Air', color: '#8B5CF6' },
  road: { label: 'Road', color: '#E6A817' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FreightQuotesPage() {
  const { filterCustom, orgName, orgType } = useDataIsolation();
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('all');

  const orgFiltered = useMemo(
    () => filterCustom(MOCK_QUOTES, (q) => {
      if (orgType === 'logistics') return q.carrier === orgName;
      return q.requestor === orgName;
    }),
    [filterCustom, orgName, orgType],
  );

  const filtered = useMemo(() => {
    return orgFiltered.filter((q) => {
      if (modeFilter !== 'all' && q.mode !== modeFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return q.carrier.toLowerCase().includes(s) || q.destination.toLowerCase().includes(s) || q.reference.toLowerCase().includes(s);
      }
      return true;
    });
  }, [orgFiltered, search, modeFilter]);

  const activeQuotes = orgFiltered.filter((q) => q.status === 'active');
  const avgRate = activeQuotes.length > 0
    ? (activeQuotes.reduce((s, q) => s + q.rate_per_teu, 0) / activeQuotes.length).toFixed(0)
    : '0';

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <RequestQuote sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Freight Quotes</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Compare freight rates and transit times across carriers and routes.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Quotes', value: orgFiltered.length.toString(), color: '#D4AF37' },
          { label: 'Active', value: activeQuotes.length.toString(), color: '#22C55E' },
          { label: 'Avg Rate/TEU', value: `$${avgRate}`, color: '#3B82F6' },
          { label: 'Carriers', value: new Set(orgFiltered.map((q) => q.carrier)).size.toString(), color: '#8B5CF6' },
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
              placeholder="Search by carrier, destination, or reference..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField fullWidth size="small" select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} label="Mode">
              <MenuItem value="all">All Modes</MenuItem>
              {Object.entries(MODE_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 90px 90px 50px 80px 65px 65px 70px',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['Reference', 'Carrier / Route', 'Mode', 'Rate/TEU', 'Days', 'Valid Until', 'Insured', 'Score', 'Status'].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {filtered.map((q, i) => {
          const sts = STATUS_CONFIG[q.status];
          const mode = MODE_CONFIG[q.mode];
          const scoreColor = q.reliability_score >= 90 ? '#22C55E' : q.reliability_score >= 80 ? '#E6A817' : '#EF4444';
          return (
            <Box
              key={q.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 90px 90px 50px 80px 65px 65px 70px',
                gap: 1, px: 2.5, py: 1.75,
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                opacity: q.status === 'expired' ? 0.5 : 1,
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37' }}>{q.reference}</Typography>
              <Box>
                <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{q.carrier}</Typography>
                <Typography sx={{ fontSize: 10, color: '#777' }}>{q.origin} → {q.destination}</Typography>
              </Box>
              <Chip label={mode.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: `${mode.color}15`, color: mode.color }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#f0f0f0' }}>${q.rate_per_teu.toLocaleString()}</Typography>
              <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{q.transit_days}</Typography>
              <Typography sx={{ fontSize: 11, color: '#777' }}>{q.valid_until}</Typography>
              <Typography sx={{ fontSize: 11, color: q.includes_insurance ? '#22C55E' : '#555' }}>{q.includes_insurance ? 'Yes' : 'No'}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: scoreColor }}>{q.reliability_score}%</Typography>
              <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: sts.bg, color: sts.color }} />
            </Box>
          );
        })}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {orgFiltered.length} freight quotes
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
