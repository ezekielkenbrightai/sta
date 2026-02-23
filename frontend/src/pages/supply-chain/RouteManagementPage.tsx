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
  Route as RouteIcon,
  DirectionsBoat,
  FlightTakeoff,
  LocalShipping,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface TradeRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  mode: 'sea' | 'air' | 'road' | 'multimodal';
  distance_km: number;
  avg_transit_days: number;
  monthly_volume_teu: number;
  reliability_pct: number;
  active_shipments: number;
  carriers: string[];
  shippers: string[];
  bottlenecks: string[];
}

const MOCK_ROUTES: TradeRoute[] = [
  { id: 'rt-001', name: 'Mombasa → Lagos (West Africa)', origin: 'Mombasa, KE', destination: 'Lagos, NG', mode: 'sea', distance_km: 6200, avg_transit_days: 14, monthly_volume_teu: 1250, reliability_pct: 88, active_shipments: 12, carriers: ['Maersk', 'MSC', 'CMA CGM'], shippers: ['Nairobi Exports Ltd', 'Lagos Electronics Ltd'], bottlenecks: ['Suez Canal congestion', 'Lagos port delays'] },
  { id: 'rt-002', name: 'Mombasa → Dar es Salaam', origin: 'Mombasa, KE', destination: 'Dar es Salaam, TZ', mode: 'sea', distance_km: 800, avg_transit_days: 3, monthly_volume_teu: 980, reliability_pct: 95, active_shipments: 8, carriers: ['MSC', 'PIL', 'Evergreen'], shippers: ['Nairobi Exports Ltd', 'East Africa Cement Ltd'], bottlenecks: [] },
  { id: 'rt-003', name: 'JKIA → Addis Ababa (Air)', origin: 'Nairobi, KE', destination: 'Addis Ababa, ET', mode: 'air', distance_km: 1150, avg_transit_days: 1, monthly_volume_teu: 65, reliability_pct: 97, active_shipments: 4, carriers: ['Kenya Airways', 'Ethiopian Airlines'], shippers: ['Addis Pharmaceutical', 'Kenya Pharma Distributors'], bottlenecks: [] },
  { id: 'rt-004', name: 'Northern Corridor Road', origin: 'Mombasa, KE', destination: 'Kampala, UG', mode: 'road', distance_km: 1200, avg_transit_days: 4, monthly_volume_teu: 820, reliability_pct: 82, active_shipments: 18, carriers: ['Bolloré Logistics Kenya', 'SDV Transami', 'Siginon'], shippers: ['Nairobi Exports Ltd', 'Auto Kenya Ltd'], bottlenecks: ['Weighbridge delays', 'Busia border congestion'] },
  { id: 'rt-005', name: 'Central Corridor (to Rwanda)', origin: 'Mombasa, KE', destination: 'Kigali, RW', mode: 'multimodal', distance_km: 1900, avg_transit_days: 7, monthly_volume_teu: 450, reliability_pct: 79, active_shipments: 6, carriers: ['Bolloré Logistics Kenya', 'SDV Transami', 'K&K Logistics'], shippers: ['East Africa Cement Ltd'], bottlenecks: ['Gatuna border processing', 'Road conditions Isaka-Kigali'] },
  { id: 'rt-006', name: 'SA → East Africa', origin: 'Johannesburg, ZA', destination: 'Nairobi, KE', mode: 'road', distance_km: 4800, avg_transit_days: 12, monthly_volume_teu: 280, reliability_pct: 75, active_shipments: 5, carriers: ['Bolloré Logistics Kenya', 'Imperial Logistics'], shippers: ['Auto Kenya Ltd', 'Dar es Salaam Freight'], bottlenecks: ['Multiple border crossings', 'Road quality DRC section'] },
];

const MODE_CONFIG: Record<string, { icon: typeof DirectionsBoat; color: string }> = {
  sea: { icon: DirectionsBoat, color: '#3B82F6' },
  air: { icon: FlightTakeoff, color: '#8B5CF6' },
  road: { icon: LocalShipping, color: '#E6A817' },
  multimodal: { icon: RouteIcon, color: '#06B6D4' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RouteManagementPage() {
  const { filterCustom, orgName, orgType } = useDataIsolation();

  const routes = useMemo(
    () => filterCustom(MOCK_ROUTES, (r) => {
      if (orgType === 'logistics') return r.carriers.includes(orgName ?? '');
      return r.shippers.includes(orgName ?? '');
    }),
    [filterCustom, orgName, orgType],
  );

  const totalVolume = routes.reduce((s, r) => s + r.monthly_volume_teu, 0);
  const avgReliability = routes.length > 0
    ? (routes.reduce((s, r) => s + r.reliability_pct, 0) / routes.length).toFixed(0)
    : '0';
  const maxVolume = routes.length > 0
    ? Math.max(...routes.map((r) => r.monthly_volume_teu))
    : 1;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <RouteIcon sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Trade Routes</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          African trade corridor performance, reliability, and bottleneck analysis.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Routes', value: routes.length.toString(), color: '#D4AF37' },
          { label: 'Monthly Volume', value: `${(totalVolume / 1000).toFixed(1)}K TEU`, color: '#3B82F6' },
          { label: 'Avg Reliability', value: `${avgReliability}%`, color: '#22C55E' },
          { label: 'Active Shipments', value: routes.reduce((s, r) => s + r.active_shipments, 0).toString(), color: '#8B5CF6' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Route Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {routes.map((r) => {
          const mode = MODE_CONFIG[r.mode];
          const ModeIcon = mode.icon;
          const reliColor = r.reliability_pct >= 90 ? '#22C55E' : r.reliability_pct >= 80 ? '#E6A817' : '#EF4444';
          const volPct = (r.monthly_volume_teu / maxVolume) * 100;

          return (
            <Card key={r.id} sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ModeIcon sx={{ fontSize: 20, color: mode.color }} />
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{r.name}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>{r.origin} → {r.destination}</Typography>
                  </Box>
                </Box>
                <Chip label={r.mode.replace('_', ' ')} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: `${mode.color}15`, color: mode.color, textTransform: 'capitalize' }} />
              </Box>

              <Grid container spacing={2} sx={{ mb: 1.5 }}>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Distance</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{r.distance_km.toLocaleString()} km</Typography>
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Transit Time</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{r.avg_transit_days} days</Typography>
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Reliability</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: reliColor }}>{r.reliability_pct}%</Typography>
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Active</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#3B82F6' }}>{r.active_shipments} shipments</Typography>
                </Grid>
                <Grid size={{ xs: 8, sm: 4 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>Monthly Volume</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={volPct}
                      sx={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(212,175,55,0.06)', '& .MuiLinearProgress-bar': { backgroundColor: '#D4AF37', borderRadius: 3 } }}
                    />
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', minWidth: 70 }}>{r.monthly_volume_teu} TEU</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Carriers & Bottlenecks */}
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#555', mb: 0.5 }}>CARRIERS</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {r.carriers.map((c) => <Chip key={c} label={c} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: 'rgba(212,175,55,0.06)', color: '#999' }} />)}
                  </Box>
                </Box>
                {r.bottlenecks.length > 0 && (
                  <Box>
                    <Typography sx={{ fontSize: 10, color: '#555', mb: 0.5 }}>BOTTLENECKS</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {r.bottlenecks.map((b) => <Chip key={b} label={b} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444' }} />)}
                    </Box>
                  </Box>
                )}
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
