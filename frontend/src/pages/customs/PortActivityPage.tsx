import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  Anchor,
  DirectionsBoat,
  Flight,
  LocalShipping,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface VesselActivity {
  id: string;
  vessel_name: string;
  type: 'cargo_vessel' | 'container_ship' | 'tanker' | 'aircraft' | 'truck_convoy';
  flag: string;
  port: string;
  berth_terminal: string;
  status: 'approaching' | 'berthed' | 'loading' | 'unloading' | 'departed' | 'awaiting_berth';
  eta_etd: string;
  cargo_type: string;
  containers: number;
  tonnage: number;
  agent: string;
}

interface PortOverview {
  name: string;
  icon: typeof Anchor;
  total_movements: number;
  vessels_in_port: number;
  containers_today: number;
  avg_turnaround_hrs: number;
  berth_utilization: number;
  congestion_level: 'low' | 'moderate' | 'high';
}

const PORT_OVERVIEW: PortOverview[] = [
  { name: 'Mombasa Port (Kilindini)', icon: Anchor, total_movements: 18, vessels_in_port: 7, containers_today: 456, avg_turnaround_hrs: 18.5, berth_utilization: 78, congestion_level: 'moderate' },
  { name: 'JKIA Air Cargo Terminal', icon: Flight, total_movements: 34, vessels_in_port: 12, containers_today: 186, avg_turnaround_hrs: 3.2, berth_utilization: 62, congestion_level: 'low' },
  { name: 'Inland Container Depot (ICD)', icon: LocalShipping, total_movements: 22, vessels_in_port: 0, containers_today: 134, avg_turnaround_hrs: 8.0, berth_utilization: 85, congestion_level: 'high' },
  { name: 'Malaba Border Post', icon: LocalShipping, total_movements: 45, vessels_in_port: 0, containers_today: 89, avg_turnaround_hrs: 2.5, berth_utilization: 55, congestion_level: 'low' },
];

const VESSEL_ACTIVITY: VesselActivity[] = [
  { id: 'va-001', vessel_name: 'MV African Star', type: 'container_ship', flag: 'Liberia', port: 'Mombasa Port', berth_terminal: 'Berth 11', status: 'unloading', eta_etd: 'ETD 2026-02-23 06:00', cargo_type: 'Mixed containers — electronics, textiles', containers: 342, tonnage: 45000, agent: 'Kenya Shipping Agents Ltd' },
  { id: 'va-002', vessel_name: 'MV Mombasa Express', type: 'cargo_vessel', flag: 'Kenya', port: 'Mombasa Port', berth_terminal: 'Berth 4', status: 'berthed', eta_etd: 'ETD 2026-02-22 22:00', cargo_type: 'Cement, steel, construction materials', containers: 120, tonnage: 28000, agent: 'East Africa Logistics' },
  { id: 'va-003', vessel_name: 'MT Kilimanjaro', type: 'tanker', flag: 'Tanzania', port: 'Mombasa Port', berth_terminal: 'Oil Terminal', status: 'loading', eta_etd: 'ETD 2026-02-23 12:00', cargo_type: 'Refined petroleum products', containers: 0, tonnage: 35000, agent: 'Petroleum Logistics EA' },
  { id: 'va-004', vessel_name: 'KQ 4821', type: 'aircraft', flag: 'Kenya', port: 'JKIA Air Cargo', berth_terminal: 'Gate 3A', status: 'unloading', eta_etd: 'ETD 2026-02-22 16:30', cargo_type: 'Pharmaceuticals (cold chain), electronics', containers: 8, tonnage: 42, agent: 'KQ Cargo' },
  { id: 'va-005', vessel_name: 'ET 721', type: 'aircraft', flag: 'Ethiopia', port: 'JKIA Air Cargo', berth_terminal: 'Gate 5B', status: 'departed', eta_etd: 'Departed 2026-02-22 11:45', cargo_type: 'Cut flowers — export to Netherlands', containers: 12, tonnage: 38, agent: 'Ethiopian Cargo Services' },
  { id: 'va-006', vessel_name: 'MV Zanzibar Pearl', type: 'container_ship', flag: 'Singapore', port: 'Mombasa Port', berth_terminal: '—', status: 'approaching', eta_etd: 'ETA 2026-02-22 18:00', cargo_type: 'Automobiles, machinery', containers: 180, tonnage: 32000, agent: 'Maersk Kenya' },
  { id: 'va-007', vessel_name: 'MV Lake Victoria', type: 'cargo_vessel', flag: 'Uganda', port: 'Mombasa Port', berth_terminal: '—', status: 'awaiting_berth', eta_etd: 'ETA 2026-02-22 14:00', cargo_type: 'Agricultural machinery, fertilizer', containers: 65, tonnage: 18000, agent: 'Uganda Shipping Corp' },
  { id: 'va-008', vessel_name: 'Convoy TR-445', type: 'truck_convoy', flag: 'Kenya', port: 'Malaba Border', berth_terminal: 'Lane 3', status: 'loading', eta_etd: 'ETD 2026-02-22 17:00', cargo_type: 'Tea, coffee — export to Uganda', containers: 24, tonnage: 480, agent: 'Cross-Border Logistics' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  approaching: { label: 'Approaching', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  awaiting_berth: { label: 'Awaiting Berth', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  berthed: { label: 'Berthed', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  loading: { label: 'Loading', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  unloading: { label: 'Unloading', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  departed: { label: 'Departed', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
};

const TYPE_ICONS: Record<string, typeof DirectionsBoat> = {
  cargo_vessel: DirectionsBoat,
  container_ship: DirectionsBoat,
  tanker: DirectionsBoat,
  aircraft: Flight,
  truck_convoy: LocalShipping,
};

const CONGESTION_CONFIG: Record<string, { color: string; bg: string }> = {
  low: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  moderate: { color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  high: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PortActivityPage() {
  const [portFilter, setPortFilter] = useState('all');

  const filteredVessels = useMemo(() => {
    if (portFilter === 'all') return VESSEL_ACTIVITY;
    return VESSEL_ACTIVITY.filter((v) => v.port === portFilter);
  }, [portFilter]);

  const totalContainers = PORT_OVERVIEW.reduce((s, p) => s + p.containers_today, 0);
  const totalMovements = PORT_OVERVIEW.reduce((s, p) => s + p.total_movements, 0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Anchor sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Port Activity</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Real-time vessel movements, berth utilization, and port congestion across all entry points.
        </Typography>
      </Box>

      {/* Aggregate stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Entry Points', value: PORT_OVERVIEW.length.toString(), color: '#D4AF37' },
          { label: 'Total Movements', value: totalMovements.toString(), color: '#3B82F6' },
          { label: 'Containers Today', value: totalContainers.toString(), color: '#22C55E' },
          { label: 'Vessels Tracked', value: VESSEL_ACTIVITY.length.toString(), color: '#8B5CF6' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Port Overview Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {PORT_OVERVIEW.map((p) => {
          const Icon = p.icon;
          const cong = CONGESTION_CONFIG[p.congestion_level];
          return (
            <Grid size={{ xs: 12, sm: 6 }} key={p.name}>
              <Card sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon sx={{ fontSize: 20, color: '#D4AF37' }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{p.name}</Typography>
                  </Box>
                  <Chip label={p.congestion_level} size="small" sx={{ fontSize: 9, height: 18, textTransform: 'capitalize', color: cong.color, backgroundColor: cong.bg }} />
                </Box>
                <Grid container spacing={1.5}>
                  <Grid size={6}>
                    <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Movements</Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#3B82F6' }}>{p.total_movements}</Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Containers</Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#22C55E' }}>{p.containers_today}</Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Avg Turnaround</Typography>
                    <Typography sx={{ fontSize: 13, color: p.avg_turnaround_hrs <= 6 ? '#22C55E' : '#E6A817' }}>{p.avg_turnaround_hrs}h</Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Berth Utilization</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={p.berth_utilization}
                        sx={{
                          flex: 1, height: 6, borderRadius: 3,
                          backgroundColor: 'rgba(212,175,55,0.08)',
                          '& .MuiLinearProgress-bar': { backgroundColor: p.berth_utilization >= 85 ? '#EF4444' : p.berth_utilization >= 70 ? '#E6A817' : '#22C55E', borderRadius: 3 },
                        }}
                      />
                      <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{p.berth_utilization}%</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Filter */}
      <Card sx={{ p: 2, mb: 3 }}>
        <TextField
          size="small" select
          value={portFilter} onChange={(e) => setPortFilter(e.target.value)}
          label="Port / Entry Point"
          sx={{ minWidth: 280 }}
        >
          <MenuItem value="all">All Ports & Entry Points</MenuItem>
          {[...new Set(VESSEL_ACTIVITY.map((v) => v.port))].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>
      </Card>

      {/* Vessel Activity */}
      <Card sx={{ p: 2.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Vessel & Cargo Movements</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filteredVessels.map((v) => {
            const sts = STATUS_CONFIG[v.status];
            const ModeIcon = TYPE_ICONS[v.type] || DirectionsBoat;
            return (
              <Box key={v.id} sx={{ py: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)', opacity: v.status === 'departed' ? 0.6 : 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ModeIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{v.vessel_name}</Typography>
                    <Chip label={v.flag} size="small" sx={{ fontSize: 9, height: 16, backgroundColor: 'rgba(212,175,55,0.06)', color: '#777' }} />
                    <Chip label={sts.label} size="small" sx={{ fontSize: 9, height: 18, color: sts.color, backgroundColor: sts.bg }} />
                  </Box>
                  <Typography sx={{ fontSize: 11, color: '#555' }}>{v.eta_etd}</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Port / Terminal</Typography>
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{v.port}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>{v.berth_terminal}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Cargo</Typography>
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{v.cargo_type}</Typography>
                  </Grid>
                  <Grid size={{ xs: 4, sm: 2 }}>
                    <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Containers</Typography>
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{v.containers > 0 ? `${v.containers} TEU` : '—'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 4, sm: 2 }}>
                    <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Tonnage</Typography>
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{v.tonnage >= 1000 ? `${(v.tonnage / 1000).toFixed(1)}K` : v.tonnage} MT</Typography>
                  </Grid>
                  <Grid size={{ xs: 4, sm: 2 }}>
                    <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Agent</Typography>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>{v.agent}</Typography>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Box>
      </Card>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filteredVessels.length} of {VESSEL_ACTIVITY.length} vessel movements
        </Typography>
      </Box>
    </Box>
  );
}
