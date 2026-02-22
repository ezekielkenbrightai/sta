import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  LocalShipping,
  Inventory,
  FlightTakeoff,
  FlightLand,
  DirectionsBoat,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface ShipmentSummary {
  id: string;
  reference: string;
  origin: string;
  destination: string;
  carrier: string;
  mode: 'sea' | 'air' | 'road' | 'rail';
  status: 'in_transit' | 'at_port' | 'customs_hold' | 'delivered' | 'loading';
  progress: number;
  eta: string;
}

const ACTIVE_SHIPMENTS: ShipmentSummary[] = [
  { id: 'sh-001', reference: 'SH-2026-9847', origin: 'Nairobi, KE', destination: 'Lagos, NG', carrier: 'Maersk Line', mode: 'sea', status: 'in_transit', progress: 65, eta: 'Feb 28' },
  { id: 'sh-002', reference: 'SH-2026-9846', origin: 'Mombasa, KE', destination: 'Dar es Salaam, TZ', carrier: 'MSC', mode: 'sea', status: 'at_port', progress: 90, eta: 'Feb 23' },
  { id: 'sh-003', reference: 'SH-2026-9845', origin: 'Nairobi, KE', destination: 'Addis Ababa, ET', carrier: 'Kenya Airways Cargo', mode: 'air', status: 'in_transit', progress: 40, eta: 'Feb 23' },
  { id: 'sh-004', reference: 'SH-2026-9844', origin: 'Johannesburg, ZA', destination: 'Nairobi, KE', carrier: 'Bollore Logistics', mode: 'road', status: 'customs_hold', progress: 85, eta: 'Feb 24' },
  { id: 'sh-005', reference: 'SH-2026-9843', origin: 'Cairo, EG', destination: 'Mombasa, KE', carrier: 'CMA CGM', mode: 'sea', status: 'loading', progress: 15, eta: 'Mar 05' },
  { id: 'sh-006', reference: 'SH-2026-9842', origin: 'Accra, GH', destination: 'Nairobi, KE', carrier: 'Ethiopian Airlines Cargo', mode: 'air', status: 'delivered', progress: 100, eta: 'Feb 22' },
];

interface RouteVolume {
  route: string;
  shipments: number;
  volume: number;
  color: string;
}

const ROUTE_VOLUMES: RouteVolume[] = [
  { route: 'Kenya → Nigeria', shipments: 42, volume: 12500, color: '#D4AF37' },
  { route: 'Kenya → Tanzania', shipments: 38, volume: 9800, color: '#22C55E' },
  { route: 'South Africa → Kenya', shipments: 28, volume: 8200, color: '#3B82F6' },
  { route: 'Kenya → Ethiopia', shipments: 24, volume: 6500, color: '#8B5CF6' },
  { route: 'Egypt → Kenya', shipments: 18, volume: 5100, color: '#E6A817' },
  { route: 'Ghana → Kenya', shipments: 15, volume: 3800, color: '#06B6D4' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  in_transit: { label: 'In Transit', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  at_port: { label: 'At Port', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  customs_hold: { label: 'Customs Hold', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  delivered: { label: 'Delivered', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  loading: { label: 'Loading', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

const MODE_ICONS: Record<string, typeof DirectionsBoat> = {
  sea: DirectionsBoat,
  air: FlightTakeoff,
  road: LocalShipping,
  rail: LocalShipping,
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SupplyChainDashboardPage() {
  const inTransit = ACTIVE_SHIPMENTS.filter((s) => s.status === 'in_transit').length;
  const atPort = ACTIVE_SHIPMENTS.filter((s) => s.status === 'at_port' || s.status === 'customs_hold').length;
  // maxVolume removed — now handled by Recharts axis auto-scaling

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <LocalShipping sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Supply Chain Dashboard</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          End-to-end supply chain visibility across African trade corridors.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Shipments', value: ACTIVE_SHIPMENTS.length.toString(), color: '#D4AF37', icon: <LocalShipping sx={{ fontSize: 18, color: '#D4AF37' }} /> },
          { label: 'In Transit', value: inTransit.toString(), color: '#3B82F6', icon: <FlightTakeoff sx={{ fontSize: 18, color: '#3B82F6' }} /> },
          { label: 'At Port / Customs', value: atPort.toString(), color: '#E6A817', icon: <FlightLand sx={{ fontSize: 18, color: '#E6A817' }} /> },
          { label: 'Cargo Volume (TEU)', value: '2,450', color: '#22C55E', icon: <Inventory sx={{ fontSize: 18, color: '#22C55E' }} /> },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {s.icon}
                <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Active Shipments */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Active Shipments</Typography>
            {ACTIVE_SHIPMENTS.map((s, i) => {
              const sts = STATUS_CONFIG[s.status];
              const ModeIcon = MODE_ICONS[s.mode];
              return (
                <Box key={s.id} sx={{ mb: i < ACTIVE_SHIPMENTS.length - 1 ? 2.5 : 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ModeIcon sx={{ fontSize: 16, color: '#D4AF37' }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>{s.reference}</Typography>
                      <Typography sx={{ fontSize: 12, color: '#999' }}>{s.carrier}</Typography>
                    </Box>
                    <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: sts.bg, color: sts.color }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{s.origin} → {s.destination}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>ETA: {s.eta}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={s.progress}
                    sx={{
                      height: 6, borderRadius: 3,
                      backgroundColor: 'rgba(212,175,55,0.06)',
                      '& .MuiLinearProgress-bar': { backgroundColor: sts.color, borderRadius: 3 },
                    }}
                  />
                </Box>
              );
            })}
          </Card>
        </Grid>

        {/* Trade Route Volumes */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Top Trade Routes (MTD)</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ROUTE_VOLUMES} layout="vertical" margin={{ top: 4, right: 12, bottom: 0, left: 80 }}>
                <CartesianGrid stroke="rgba(212,175,55,0.06)" strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: '#555', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                />
                <YAxis
                  type="category"
                  dataKey="route"
                  tick={{ fill: '#555', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8 }}
                  labelStyle={{ color: '#D4AF37' }}
                  itemStyle={{ color: '#b0b0b0' }}
                  formatter={(value) => [`${Number(value).toLocaleString()} TEU`, 'Volume']}
                />
                <Bar dataKey="volume" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
