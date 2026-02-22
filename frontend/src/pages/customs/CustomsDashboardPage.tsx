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
  Security,
  CheckCircle,
  Schedule,
  Warning,
  LocalShipping,
  Inventory,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface QueueSummary {
  status: string;
  count: number;
  color: string;
  icon: typeof CheckCircle;
}

interface RecentClearance {
  id: string;
  reference: string;
  trader: string;
  type: 'import' | 'export' | 'transit';
  origin: string;
  destination: string;
  value_kes: number;
  status: 'cleared' | 'pending_inspection' | 'under_review' | 'held' | 'released';
  officer: string;
  submitted: string;
}

interface PortStat {
  port: string;
  vessels_today: number;
  containers_processed: number;
  avg_clearance_hrs: number;
  compliance_rate: number;
}

const QUEUE_SUMMARY: QueueSummary[] = [
  { status: 'Pending Review', count: 23, color: '#E6A817', icon: Schedule },
  { status: 'Under Inspection', count: 8, color: '#3B82F6', icon: Inventory },
  { status: 'Awaiting Payment', count: 12, color: '#F59E0B', icon: Warning },
  { status: 'Cleared Today', count: 47, color: '#22C55E', icon: CheckCircle },
  { status: 'Held / Flagged', count: 3, color: '#EF4444', icon: Warning },
  { status: 'In Transit', count: 31, color: '#8B5CF6', icon: LocalShipping },
];

const RECENT_CLEARANCES: RecentClearance[] = [
  { id: 'clr-001', reference: 'CUS-2026-5421', trader: 'Kenya Pharma Distributors', type: 'import', origin: 'India', destination: 'Kenya', value_kes: 4850000, status: 'cleared', officer: 'Jane Mwangi', submitted: '2026-02-22 09:15' },
  { id: 'clr-002', reference: 'CUS-2026-5420', trader: 'Nairobi Exports Ltd', type: 'export', origin: 'Kenya', destination: 'Tanzania', value_kes: 12400000, status: 'released', officer: 'James Otieno', submitted: '2026-02-22 08:45' },
  { id: 'clr-003', reference: 'CUS-2026-5419', trader: 'East Africa Cement Ltd', type: 'import', origin: 'China', destination: 'Kenya', value_kes: 36000000, status: 'pending_inspection', officer: '—', submitted: '2026-02-22 07:30' },
  { id: 'clr-004', reference: 'CUS-2026-5418', trader: 'Cairo Trade House', type: 'transit', origin: 'Egypt', destination: 'Uganda', value_kes: 8900000, status: 'under_review', officer: 'Grace Njeri', submitted: '2026-02-22 06:00' },
  { id: 'clr-005', reference: 'CUS-2026-5417', trader: 'Lagos Electronics Ltd', type: 'import', origin: 'Japan', destination: 'Kenya', value_kes: 22000000, status: 'held', officer: 'David Maina', submitted: '2026-02-21 16:00' },
  { id: 'clr-006', reference: 'CUS-2026-5416', trader: 'Addis Pharmaceutical', type: 'import', origin: 'Germany', destination: 'Ethiopia', value_kes: 7200000, status: 'cleared', officer: 'Jane Mwangi', submitted: '2026-02-21 14:30' },
];

const PORT_STATS: PortStat[] = [
  { port: 'Mombasa Port (Kilindini)', vessels_today: 12, containers_processed: 342, avg_clearance_hrs: 4.2, compliance_rate: 94 },
  { port: 'JKIA Air Cargo', vessels_today: 28, containers_processed: 186, avg_clearance_hrs: 2.8, compliance_rate: 97 },
  { port: 'Inland Container Depot', vessels_today: 0, containers_processed: 124, avg_clearance_hrs: 6.1, compliance_rate: 91 },
  { port: 'Malaba Border Post', vessels_today: 0, containers_processed: 89, avg_clearance_hrs: 3.5, compliance_rate: 88 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  cleared: { label: 'Cleared', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  released: { label: 'Released', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  pending_inspection: { label: 'Pending Inspection', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  under_review: { label: 'Under Review', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  held: { label: 'Held', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
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

export default function CustomsDashboardPage() {
  const totalQueue = useMemo(() => QUEUE_SUMMARY.reduce((s, q) => s + q.count, 0), []);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Security sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Customs Dashboard</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Real-time customs clearance monitoring and port activity overview.
        </Typography>
      </Box>

      {/* Queue summary cards */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        {QUEUE_SUMMARY.map((q) => {
          const Icon = q.icon;
          return (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={q.status}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                  <Icon sx={{ fontSize: 16, color: q.color }} />
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>{q.status}</Typography>
                </Box>
                <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: "'Lora', serif", color: q.color }}>{q.count}</Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2}>
        {/* Recent Clearances */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Recent Clearance Activity</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {RECENT_CLEARANCES.map((c) => {
                const sts = STATUS_CONFIG[c.status];
                return (
                  <Box key={c.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.25, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{c.reference}</Typography>
                        <Chip label={c.type} size="small" sx={{ fontSize: 9, height: 16, color: TYPE_COLORS[c.type], backgroundColor: `${TYPE_COLORS[c.type]}15` }} />
                        <Chip label={sts.label} size="small" sx={{ fontSize: 9, height: 16, color: sts.color, backgroundColor: sts.bg }} />
                      </Box>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.trader}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{c.origin} → {c.destination}</Typography>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>KSh {formatValue(c.value_kes)}</Typography>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>Officer: {c.officer}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: 10, color: '#555', whiteSpace: 'nowrap' }}>{c.submitted}</Typography>
                  </Box>
                );
              })}
            </Box>
            <Typography sx={{ fontSize: 11, color: '#555', mt: 1.5 }}>
              Total in queue: {totalQueue} declarations
            </Typography>
          </Card>
        </Grid>

        {/* Port Stats */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Port & Entry Point Performance</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {PORT_STATS.map((p) => (
                <Box key={p.port} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', mb: 1 }}>{p.port}</Typography>
                  <Grid container spacing={1.5}>
                    <Grid size={6}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Vessels/Flights</Typography>
                      <Typography sx={{ fontSize: 13, color: '#b0b0b0' }}>{p.vessels_today}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Containers</Typography>
                      <Typography sx={{ fontSize: 13, color: '#b0b0b0' }}>{p.containers_processed}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Avg Clearance</Typography>
                      <Typography sx={{ fontSize: 13, color: p.avg_clearance_hrs <= 4 ? '#22C55E' : '#E6A817' }}>{p.avg_clearance_hrs}h</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Compliance</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={p.compliance_rate}
                          sx={{
                            flex: 1, height: 6, borderRadius: 3,
                            backgroundColor: 'rgba(212,175,55,0.08)',
                            '& .MuiLinearProgress-bar': { backgroundColor: p.compliance_rate >= 95 ? '#22C55E' : p.compliance_rate >= 90 ? '#E6A817' : '#EF4444', borderRadius: 3 },
                          }}
                        />
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{p.compliance_rate}%</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
