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
  Warehouse as WarehouseIcon,
  Inventory,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface Warehouse {
  id: string;
  name: string;
  location: string;
  operator: string;
  tenants: string[];
  type: 'bonded' | 'general' | 'cold_storage' | 'hazmat';
  capacity_teu: number;
  utilized_teu: number;
  status: 'operational' | 'maintenance' | 'full';
  inbound_today: number;
  outbound_today: number;
  pending_clearance: number;
}

const MOCK_WAREHOUSES: Warehouse[] = [
  { id: 'wh-001', name: 'Mombasa Port Warehouse A', location: 'Mombasa, Kenya', operator: 'Bolloré Logistics Kenya', tenants: ['Nairobi Exports Ltd', 'Cairo Trade House'], type: 'bonded', capacity_teu: 500, utilized_teu: 385, status: 'operational', inbound_today: 12, outbound_today: 8, pending_clearance: 15 },
  { id: 'wh-002', name: 'ICD Nairobi — Embakasi', location: 'Nairobi, Kenya', operator: 'Bolloré Logistics Kenya', tenants: ['Nairobi Exports Ltd', 'Auto Kenya Ltd', 'Kenya Pharma Distributors'], type: 'general', capacity_teu: 800, utilized_teu: 520, status: 'operational', inbound_today: 18, outbound_today: 22, pending_clearance: 7 },
  { id: 'wh-003', name: 'JKIA Air Cargo Terminal', location: 'Nairobi, Kenya', operator: 'Kenya Airways Cargo', tenants: ['Addis Pharmaceutical', 'Nairobi Exports Ltd'], type: 'general', capacity_teu: 200, utilized_teu: 145, status: 'operational', inbound_today: 8, outbound_today: 11, pending_clearance: 3 },
  { id: 'wh-004', name: 'Mombasa Cold Storage Facility', location: 'Mombasa, Kenya', operator: 'Maersk Line', tenants: ['Kenya Pharma Distributors'], type: 'cold_storage', capacity_teu: 150, utilized_teu: 142, status: 'full', inbound_today: 2, outbound_today: 4, pending_clearance: 6 },
  { id: 'wh-005', name: 'Naivasha SGR ICD', location: 'Naivasha, Kenya', operator: 'Bolloré Logistics Kenya', tenants: ['East Africa Cement Ltd', 'Lagos Electronics Ltd'], type: 'general', capacity_teu: 600, utilized_teu: 280, status: 'operational', inbound_today: 15, outbound_today: 12, pending_clearance: 4 },
  { id: 'wh-006', name: 'Mombasa Hazmat Zone', location: 'Mombasa, Kenya', operator: 'SDV Transami', tenants: [], type: 'hazmat', capacity_teu: 100, utilized_teu: 35, status: 'maintenance', inbound_today: 0, outbound_today: 0, pending_clearance: 2 },
];

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  bonded: { label: 'Bonded', color: '#D4AF37' },
  general: { label: 'General', color: '#3B82F6' },
  cold_storage: { label: 'Cold Storage', color: '#06B6D4' },
  hazmat: { label: 'Hazmat', color: '#EF4444' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  operational: { label: 'Operational', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  maintenance: { label: 'Maintenance', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  full: { label: 'Full', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function WarehouseManagementPage() {
  const { filterCustom, orgName, orgType } = useDataIsolation();

  const warehouses = useMemo(
    () => filterCustom(MOCK_WAREHOUSES, (w) => {
      if (orgType === 'logistics') return w.operator === orgName;
      return w.tenants.includes(orgName ?? '');
    }),
    [filterCustom, orgName, orgType],
  );

  const totalCapacity = warehouses.reduce((s, w) => s + w.capacity_teu, 0);
  const totalUtilized = warehouses.reduce((s, w) => s + w.utilized_teu, 0);
  const utilRate = ((totalUtilized / totalCapacity) * 100).toFixed(0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <WarehouseIcon sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Warehouse Management</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Warehouse capacity, utilization, and cargo movement tracking.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Facilities', value: warehouses.length.toString(), color: '#D4AF37' },
          { label: 'Total Capacity', value: `${totalCapacity.toLocaleString()} TEU`, color: '#3B82F6' },
          { label: 'Utilization Rate', value: `${utilRate}%`, color: Number(utilRate) > 80 ? '#E6A817' : '#22C55E' },
          { label: 'Pending Clearance', value: warehouses.reduce((s, w) => s + w.pending_clearance, 0).toString(), color: '#E6A817' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Warehouse Cards */}
      <Grid container spacing={2}>
        {warehouses.map((w) => {
          const tp = TYPE_CONFIG[w.type];
          const sts = STATUS_CONFIG[w.status];
          const utilPct = (w.utilized_teu / w.capacity_teu) * 100;
          const utilColor = utilPct >= 90 ? '#EF4444' : utilPct >= 70 ? '#E6A817' : '#22C55E';

          return (
            <Grid size={{ xs: 12, md: 6 }} key={w.id}>
              <Card sx={{ p: 2.5, opacity: w.status === 'maintenance' ? 0.7 : 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Inventory sx={{ fontSize: 18, color: '#D4AF37' }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{w.name}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>{w.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Chip label={tp.label} size="small" sx={{ fontSize: 9, height: 18, backgroundColor: `${tp.color}15`, color: tp.color }} />
                    <Chip label={sts.label} size="small" sx={{ fontSize: 9, height: 18, backgroundColor: sts.bg, color: sts.color }} />
                  </Box>
                </Box>

                {/* Capacity bar */}
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>Capacity Utilization</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: utilColor }}>{utilPct.toFixed(0)}% ({w.utilized_teu}/{w.capacity_teu} TEU)</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={utilPct}
                    sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(212,175,55,0.06)', '& .MuiLinearProgress-bar': { backgroundColor: utilColor, borderRadius: 4 } }}
                  />
                </Box>

                {/* Activity */}
                <Grid container spacing={2}>
                  <Grid size={4}>
                    <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.25 }}>Inbound</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#3B82F6' }}>{w.inbound_today}</Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.25 }}>Outbound</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#22C55E' }}>{w.outbound_today}</Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.25 }}>Pending</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: w.pending_clearance > 5 ? '#E6A817' : '#999' }}>{w.pending_clearance}</Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
