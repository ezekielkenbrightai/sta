import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  InputAdornment,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  LocalShipping,
  Search as SearchIcon,
  DirectionsBoat,
  FlightTakeoff,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface Shipment {
  id: string;
  reference: string;
  trade_doc_ref: string;
  origin: string;
  destination: string;
  carrier: string;
  mode: 'sea' | 'air' | 'road' | 'rail';
  status: 'in_transit' | 'at_port' | 'customs_hold' | 'delivered' | 'loading' | 'cleared';
  progress: number;
  departure: string;
  eta: string;
  weight_kg: number;
  containers: number;
  last_location: string;
  last_update: string;
}

const MOCK_SHIPMENTS: Shipment[] = [
  { id: 'sh-001', reference: 'SH-2026-9847', trade_doc_ref: 'KE-2026-0042', origin: 'Nairobi, KE', destination: 'Lagos, NG', carrier: 'Maersk Line', mode: 'sea', status: 'in_transit', progress: 65, departure: 'Feb 15', eta: 'Feb 28', weight_kg: 24500, containers: 2, last_location: 'Gulf of Aden', last_update: '2026-02-22 08:00' },
  { id: 'sh-002', reference: 'SH-2026-9846', trade_doc_ref: 'KE-2026-0041', origin: 'Mombasa, KE', destination: 'Dar es Salaam, TZ', carrier: 'MSC', mode: 'sea', status: 'at_port', progress: 90, departure: 'Feb 18', eta: 'Feb 23', weight_kg: 18200, containers: 1, last_location: 'Port of Dar es Salaam', last_update: '2026-02-22 14:15' },
  { id: 'sh-003', reference: 'SH-2026-9845', trade_doc_ref: 'TZ-2026-0018', origin: 'Nairobi, KE', destination: 'Addis Ababa, ET', carrier: 'Kenya Airways Cargo', mode: 'air', status: 'in_transit', progress: 40, departure: 'Feb 22', eta: 'Feb 23', weight_kg: 850, containers: 0, last_location: 'JKIA — Departed', last_update: '2026-02-22 11:00' },
  { id: 'sh-004', reference: 'SH-2026-9844', trade_doc_ref: 'ZA-2026-0105', origin: 'Johannesburg, ZA', destination: 'Nairobi, KE', carrier: 'Bollore Logistics', mode: 'road', status: 'customs_hold', progress: 85, departure: 'Feb 12', eta: 'Feb 24', weight_kg: 32000, containers: 3, last_location: 'Namanga Border', last_update: '2026-02-22 09:30' },
  { id: 'sh-005', reference: 'SH-2026-9843', trade_doc_ref: 'EG-2026-0078', origin: 'Cairo, EG', destination: 'Mombasa, KE', carrier: 'CMA CGM', mode: 'sea', status: 'loading', progress: 15, departure: 'Feb 23', eta: 'Mar 05', weight_kg: 45000, containers: 4, last_location: 'Port Said', last_update: '2026-02-22 06:00' },
  { id: 'sh-006', reference: 'SH-2026-9842', trade_doc_ref: 'GH-2026-0034', origin: 'Accra, GH', destination: 'Nairobi, KE', carrier: 'Ethiopian Airlines Cargo', mode: 'air', status: 'delivered', progress: 100, departure: 'Feb 20', eta: 'Feb 22', weight_kg: 420, containers: 0, last_location: 'JKIA — Received', last_update: '2026-02-22 13:45' },
  { id: 'sh-007', reference: 'SH-2026-9841', trade_doc_ref: 'KE-2026-0039', origin: 'Mombasa, KE', destination: 'Kigali, RW', carrier: 'SDV Transami', mode: 'road', status: 'cleared', progress: 95, departure: 'Feb 16', eta: 'Feb 23', weight_kg: 15000, containers: 1, last_location: 'Gatuna Border — Cleared', last_update: '2026-02-22 10:15' },
  { id: 'sh-008', reference: 'SH-2026-9840', trade_doc_ref: 'NG-2026-0092', origin: 'Lagos, NG', destination: 'Mombasa, KE', carrier: 'PIL', mode: 'sea', status: 'in_transit', progress: 50, departure: 'Feb 10', eta: 'Mar 01', weight_kg: 56000, containers: 5, last_location: 'Indian Ocean', last_update: '2026-02-22 07:00' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  in_transit: { label: 'In Transit', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  at_port: { label: 'At Port', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  customs_hold: { label: 'Customs Hold', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  delivered: { label: 'Delivered', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  loading: { label: 'Loading', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  cleared: { label: 'Cleared', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
};

const MODE_ICONS: Record<string, typeof DirectionsBoat> = {
  sea: DirectionsBoat,
  air: FlightTakeoff,
  road: LocalShipping,
  rail: LocalShipping,
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ShipmentTrackingPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_SHIPMENTS.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.reference.toLowerCase().includes(q) || s.carrier.toLowerCase().includes(q) || s.origin.toLowerCase().includes(q) || s.destination.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, statusFilter]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <LocalShipping sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Shipment Tracking</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Track shipments in real-time across all African trade corridors.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Shipments', value: MOCK_SHIPMENTS.length.toString(), color: '#D4AF37' },
          { label: 'In Transit', value: MOCK_SHIPMENTS.filter((s) => s.status === 'in_transit').length.toString(), color: '#3B82F6' },
          { label: 'At Port', value: MOCK_SHIPMENTS.filter((s) => ['at_port', 'customs_hold'].includes(s.status)).length.toString(), color: '#E6A817' },
          { label: 'Delivered', value: MOCK_SHIPMENTS.filter((s) => s.status === 'delivered').length.toString(), color: '#22C55E' },
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
              placeholder="Search by reference, carrier, origin, destination..."
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

      {/* Shipment Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.map((s) => {
          const sts = STATUS_CONFIG[s.status];
          const ModeIcon = MODE_ICONS[s.mode];
          return (
            <Card key={s.id} sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ModeIcon sx={{ fontSize: 20, color: '#D4AF37' }} />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#D4AF37' }}>{s.reference}</Typography>
                      <Chip label={s.mode.toUpperCase()} size="small" sx={{ fontSize: 9, height: 16, backgroundColor: 'rgba(212,175,55,0.06)', color: '#999' }} />
                    </Box>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>Doc: {s.trade_doc_ref} | {s.carrier}</Typography>
                  </Box>
                </Box>
                <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 22, backgroundColor: sts.bg, color: sts.color }} />
              </Box>

              {/* Route */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{s.origin}</Typography>
                <Box sx={{ flex: 1, height: 1, backgroundColor: 'rgba(212,175,55,0.15)', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', left: `${s.progress}%`, top: -4, width: 8, height: 8, borderRadius: '50%', backgroundColor: sts.color, transform: 'translateX(-50%)' }} />
                </Box>
                <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{s.destination}</Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={s.progress}
                sx={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(212,175,55,0.06)', mb: 1.5, '& .MuiLinearProgress-bar': { backgroundColor: sts.color, borderRadius: 2 } }}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Departed</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{s.departure}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>ETA</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{s.eta}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Weight</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{(s.weight_kg / 1000).toFixed(1)}T</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Containers</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{s.containers > 0 ? `${s.containers} TEU` : 'Loose'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Last Location</Typography>
                  <Typography sx={{ fontSize: 12, color: '#f0f0f0' }}>{s.last_location}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>{s.last_update}</Typography>
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filtered.length} of {MOCK_SHIPMENTS.length} shipments
        </Typography>
      </Box>
    </Box>
  );
}
