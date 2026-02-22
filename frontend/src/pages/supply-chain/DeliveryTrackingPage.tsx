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
  DeliveryDining,
  Search as SearchIcon,
  CheckCircle,
  Schedule,
  Warning,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface Delivery {
  id: string;
  reference: string;
  shipment_ref: string;
  consignee: string;
  delivery_address: string;
  city: string;
  driver: string;
  vehicle: string;
  status: 'dispatched' | 'en_route' | 'at_destination' | 'delivered' | 'failed' | 'rescheduled';
  scheduled_date: string;
  scheduled_time: string;
  actual_time: string | null;
  items: number;
  weight_kg: number;
  signature_required: boolean;
}

const MOCK_DELIVERIES: Delivery[] = [
  { id: 'del-001', reference: 'DEL-2026-3421', shipment_ref: 'SH-2026-9842', consignee: 'Kenya Pharma Distributors', delivery_address: 'Industrial Area, Lunga Lunga Rd', city: 'Nairobi', driver: 'James Otieno', vehicle: 'KBZ 421M', status: 'delivered', scheduled_date: '2026-02-22', scheduled_time: '10:00', actual_time: '09:45', items: 50, weight_kg: 420, signature_required: true },
  { id: 'del-002', reference: 'DEL-2026-3420', shipment_ref: 'SH-2026-9841', consignee: 'East Africa Cement Ltd', delivery_address: 'Athi River, Namanga Rd', city: 'Machakos', driver: 'Peter Kamau', vehicle: 'KCA 183L', status: 'en_route', scheduled_date: '2026-02-22', scheduled_time: '14:00', actual_time: null, items: 120, weight_kg: 3600, signature_required: true },
  { id: 'del-003', reference: 'DEL-2026-3419', shipment_ref: 'SH-2026-9840', consignee: 'Nairobi Fashion House', delivery_address: 'Westlands, Waiyaki Way', city: 'Nairobi', driver: 'Mary Wanjiku', vehicle: 'KBR 770P', status: 'at_destination', scheduled_date: '2026-02-22', scheduled_time: '15:00', actual_time: null, items: 200, weight_kg: 500, signature_required: false },
  { id: 'del-004', reference: 'DEL-2026-3418', shipment_ref: 'SH-2026-9846', consignee: 'Mombasa Port Authority', delivery_address: 'Kilindini Harbour', city: 'Mombasa', driver: 'David Maina', vehicle: 'KDH 552S', status: 'dispatched', scheduled_date: '2026-02-23', scheduled_time: '08:00', actual_time: null, items: 80, weight_kg: 12000, signature_required: true },
  { id: 'del-005', reference: 'DEL-2026-3417', shipment_ref: 'SH-2026-9845', consignee: 'Addis Pharmaceutical', delivery_address: 'Bole Sub-City', city: 'Addis Ababa', driver: '—', vehicle: '—', status: 'rescheduled', scheduled_date: '2026-02-23', scheduled_time: '11:00', actual_time: null, items: 25, weight_kg: 180, signature_required: true },
  { id: 'del-006', reference: 'DEL-2026-3416', shipment_ref: 'SH-2026-9844', consignee: 'Auto Kenya Ltd', delivery_address: 'Mombasa Road, Next to SGR', city: 'Nairobi', driver: 'Grace Njeri', vehicle: 'KAZ 901K', status: 'failed', scheduled_date: '2026-02-21', scheduled_time: '14:00', actual_time: null, items: 8, weight_kg: 12000, signature_required: true },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  dispatched: { label: 'Dispatched', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', icon: Schedule },
  en_route: { label: 'En Route', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', icon: DeliveryDining },
  at_destination: { label: 'At Destination', color: '#E6A817', bg: 'rgba(230,168,23,0.1)', icon: Schedule },
  delivered: { label: 'Delivered', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', icon: CheckCircle },
  failed: { label: 'Failed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: Warning },
  rescheduled: { label: 'Rescheduled', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', icon: Schedule },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DeliveryTrackingPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_DELIVERIES.filter((d) => {
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return d.reference.toLowerCase().includes(q) || d.consignee.toLowerCase().includes(q) || d.city.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, statusFilter]);

  const deliveredToday = MOCK_DELIVERIES.filter((d) => d.status === 'delivered').length;
  const pendingToday = MOCK_DELIVERIES.filter((d) => ['dispatched', 'en_route', 'at_destination'].includes(d.status)).length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <DeliveryDining sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Delivery Tracking</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Last-mile delivery tracking and proof of delivery management.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Deliveries', value: MOCK_DELIVERIES.length.toString(), color: '#D4AF37' },
          { label: 'Delivered', value: deliveredToday.toString(), color: '#22C55E' },
          { label: 'Pending', value: pendingToday.toString(), color: '#3B82F6' },
          { label: 'Failed', value: MOCK_DELIVERIES.filter((d) => d.status === 'failed').length.toString(), color: '#EF4444' },
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
              placeholder="Search by reference, consignee, or city..."
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

      {/* Delivery Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.map((d) => {
          const sts = STATUS_CONFIG[d.status];
          const Icon = sts.icon;
          return (
            <Card key={d.id} sx={{ p: 2.5, opacity: d.status === 'failed' ? 0.7 : 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon sx={{ fontSize: 20, color: sts.color }} />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#D4AF37' }}>{d.reference}</Typography>
                      <Typography sx={{ fontSize: 11, color: '#555' }}>({d.shipment_ref})</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{d.consignee}</Typography>
                  </Box>
                </Box>
                <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 22, backgroundColor: sts.bg, color: sts.color }} />
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Delivery Address</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{d.delivery_address}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#777' }}>{d.city}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Scheduled</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{d.scheduled_date}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#777' }}>{d.scheduled_time}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Actual</Typography>
                  <Typography sx={{ fontSize: 12, color: d.actual_time ? '#22C55E' : '#555' }}>{d.actual_time || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 4, sm: 1.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Items</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{d.items}</Typography>
                </Grid>
                <Grid size={{ xs: 4, sm: 1.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Weight</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{d.weight_kg >= 1000 ? `${(d.weight_kg / 1000).toFixed(1)}T` : `${d.weight_kg}kg`}</Typography>
                </Grid>
                <Grid size={{ xs: 4, sm: 1 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Driver</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{d.driver}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>{d.vehicle}</Typography>
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filtered.length} of {MOCK_DELIVERIES.length} deliveries
        </Typography>
      </Box>
    </Box>
  );
}
