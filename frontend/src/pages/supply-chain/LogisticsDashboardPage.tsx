import { useMemo } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  Hub,
  LocalShipping,
  Speed,
  Timer,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface FleetVehicle {
  id: string;
  plate: string;
  operator: string;
  type: 'truck' | 'van' | 'container';
  driver: string;
  route: string;
  status: 'en_route' | 'loading' | 'idle' | 'maintenance';
  load_pct: number;
}

const FLEET: FleetVehicle[] = [
  { id: 'v-001', plate: 'KBZ 421M', operator: 'Bolloré Logistics Kenya', type: 'truck', driver: 'James Otieno', route: 'Mombasa → Nairobi', status: 'en_route', load_pct: 92 },
  { id: 'v-002', plate: 'KCA 183L', operator: 'Bolloré Logistics Kenya', type: 'container', driver: 'Peter Kamau', route: 'Nairobi → Namanga', status: 'en_route', load_pct: 100 },
  { id: 'v-003', plate: 'KBR 770P', operator: 'Bolloré Logistics Kenya', type: 'van', driver: 'Mary Wanjiku', route: 'Nairobi Local', status: 'loading', load_pct: 45 },
  { id: 'v-004', plate: 'KDH 552S', operator: 'SDV Transami', type: 'truck', driver: 'David Maina', route: 'Mombasa → Naivasha', status: 'en_route', load_pct: 78 },
  { id: 'v-005', plate: 'KAZ 901K', operator: 'SDV Transami', type: 'truck', driver: 'Grace Njeri', route: 'ICD Embakasi', status: 'idle', load_pct: 0 },
  { id: 'v-006', plate: 'KBC 342N', operator: 'Bolloré Logistics Kenya', type: 'container', driver: '—', route: '—', status: 'maintenance', load_pct: 0 },
];

interface KPI {
  label: string;
  value: string;
  target: string;
  pct: number;
  color: string;
}

const KPIS: KPI[] = [
  { label: 'On-Time Delivery Rate', value: '94.2%', target: '95%', pct: 94.2, color: '#22C55E' },
  { label: 'Avg Transit Time (Mombasa→NBI)', value: '8.2 hrs', target: '8 hrs', pct: 97.6, color: '#3B82F6' },
  { label: 'Fleet Utilization', value: '72%', target: '80%', pct: 72, color: '#E6A817' },
  { label: 'Cost per TEU-km', value: 'KSh 4.8', target: 'KSh 5.0', pct: 96, color: '#8B5CF6' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  en_route: { label: 'En Route', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  loading: { label: 'Loading', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  idle: { label: 'Idle', color: '#999', bg: 'rgba(153,153,153,0.1)' },
  maintenance: { label: 'Maintenance', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LogisticsDashboardPage() {
  const { filterByOrgName } = useDataIsolation();

  const fleet = useMemo(
    () => filterByOrgName(FLEET, 'operator'),
    [filterByOrgName],
  );

  const enRoute = fleet.filter((v) => v.status === 'en_route').length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Hub sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Logistics Dashboard</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Fleet management, KPIs, and logistics performance metrics.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Fleet Size', value: fleet.length.toString(), color: '#D4AF37', icon: <LocalShipping sx={{ fontSize: 18, color: '#D4AF37' }} /> },
          { label: 'En Route', value: enRoute.toString(), color: '#3B82F6', icon: <Speed sx={{ fontSize: 18, color: '#3B82F6' }} /> },
          { label: 'Avg Delivery Time', value: '8.2h', color: '#22C55E', icon: <Timer sx={{ fontSize: 18, color: '#22C55E' }} /> },
          { label: 'Today Deliveries', value: '14', color: '#8B5CF6' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {'icon' in s && s.icon}
                <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* KPIs */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Performance KPIs</Typography>
            {KPIS.map((k) => (
              <Box key={k.label} sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{k.label}</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: k.color }}>{k.value}</Typography>
                    <Typography sx={{ fontSize: 10, color: '#555' }}>Target: {k.target}</Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(k.pct, 100)}
                  sx={{ height: 6, borderRadius: 3, backgroundColor: `${k.color}15`, '& .MuiLinearProgress-bar': { backgroundColor: k.color, borderRadius: 3 } }}
                />
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Fleet Status */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Fleet Status</Typography>
            {fleet.map((v) => {
              const sts = STATUS_CONFIG[v.status];
              return (
                <Box key={v.id} sx={{ mb: 2, pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{v.plate}</Typography>
                      <Chip label={v.type} size="small" sx={{ fontSize: 9, height: 16, backgroundColor: 'rgba(212,175,55,0.06)', color: '#777' }} />
                      <Chip label={sts.label} size="small" sx={{ fontSize: 9, height: 16, backgroundColor: sts.bg, color: sts.color }} />
                    </Box>
                    {v.load_pct > 0 && <Typography sx={{ fontSize: 11, color: v.load_pct >= 90 ? '#22C55E' : '#E6A817' }}>{v.load_pct}% loaded</Typography>}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ fontSize: 12, color: '#999' }}>Driver: {v.driver}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>Route: {v.route}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
