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
  ContentPasteSearch,
  Search as SearchIcon,
  CheckCircle,
  Schedule,
  Warning,
  CameraAlt,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface Inspection {
  id: string;
  reference: string;
  clearance_ref: string;
  trader: string;
  cargo_description: string;
  inspection_type: 'physical' | 'scanner' | 'documentary' | 'sampling';
  priority: 'routine' | 'priority' | 'urgent';
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'waived';
  assigned_officer: string;
  scheduled_date: string;
  scheduled_time: string;
  location: string;
  findings: string | null;
  containers_inspected: number;
  containers_total: number;
  discrepancies: number;
  photos_taken: number;
}

const MOCK_INSPECTIONS: Inspection[] = [
  { id: 'ins-001', reference: 'INS-2026-0892', clearance_ref: 'CUS-2026-5419', trader: 'East Africa Cement Ltd', cargo_description: 'Portland cement bags & steel rebar', inspection_type: 'physical', priority: 'priority', status: 'scheduled', assigned_officer: 'Peter Kamau', scheduled_date: '2026-02-22', scheduled_time: '14:00', location: 'Mombasa Port — Berth 4', findings: null, containers_inspected: 0, containers_total: 8, discrepancies: 0, photos_taken: 0 },
  { id: 'ins-002', reference: 'INS-2026-0891', clearance_ref: 'CUS-2026-5417', trader: 'Lagos Electronics Ltd', cargo_description: 'Consumer electronics — smartphones, laptops, tablets', inspection_type: 'scanner', priority: 'urgent', status: 'in_progress', assigned_officer: 'David Maina', scheduled_date: '2026-02-22', scheduled_time: '10:00', location: 'JKIA Air Cargo — Inspection Bay 2', findings: null, containers_inspected: 1, containers_total: 3, discrepancies: 0, photos_taken: 8 },
  { id: 'ins-003', reference: 'INS-2026-0890', clearance_ref: 'CUS-2026-5415', trader: 'Nairobi Fashion House', cargo_description: 'Textile garments — cotton blouses, woven dresses', inspection_type: 'sampling', priority: 'routine', status: 'completed', assigned_officer: 'Grace Njeri', scheduled_date: '2026-02-22', scheduled_time: '09:00', location: 'JKIA Air Cargo — Inspection Bay 1', findings: 'All samples match declaration. Quality labels verified. No counterfeit indicators.', containers_inspected: 2, containers_total: 2, discrepancies: 0, photos_taken: 12 },
  { id: 'ins-004', reference: 'INS-2026-0889', clearance_ref: 'CUS-2026-5414', trader: 'Auto Kenya Ltd', cargo_description: 'Used motor vehicles — Toyota Hilux, Nissan NP300', inspection_type: 'physical', priority: 'urgent', status: 'scheduled', assigned_officer: 'Peter Kamau', scheduled_date: '2026-02-23', scheduled_time: '08:00', location: 'Mombasa Port — Vehicle Yard', findings: null, containers_inspected: 0, containers_total: 4, discrepancies: 0, photos_taken: 0 },
  { id: 'ins-005', reference: 'INS-2026-0888', clearance_ref: 'CUS-2026-5413', trader: 'Dar es Salaam Freight', cargo_description: 'Steel pipes — seamless carbon steel', inspection_type: 'documentary', priority: 'routine', status: 'failed', assigned_officer: 'David Maina', scheduled_date: '2026-02-21', scheduled_time: '15:00', location: 'Mombasa Port — Berth 7', findings: 'Certificate of origin missing. Weight discrepancy: declared 18T, measured 22.4T. Recommend hold for further investigation.', containers_inspected: 6, containers_total: 6, discrepancies: 2, photos_taken: 15 },
  { id: 'ins-006', reference: 'INS-2026-0887', clearance_ref: 'CUS-2026-5416', trader: 'Addis Pharmaceutical', cargo_description: 'Pharmaceutical products — antibiotics, vaccines (cold chain)', inspection_type: 'physical', priority: 'priority', status: 'completed', assigned_officer: 'Jane Mwangi', scheduled_date: '2026-02-21', scheduled_time: '11:00', location: 'JKIA Air Cargo — Cold Storage', findings: 'Cold chain integrity verified. Temperature log: 2-8°C throughout transit. All batch numbers match.', containers_inspected: 1, containers_total: 1, discrepancies: 0, photos_taken: 6 },
  { id: 'ins-007', reference: 'INS-2026-0886', clearance_ref: 'CUS-2026-5410', trader: 'Kampala Trading Co', cargo_description: 'Agricultural machinery — tractors, ploughs', inspection_type: 'scanner', priority: 'routine', status: 'waived', assigned_officer: '—', scheduled_date: '2026-02-21', scheduled_time: '—', location: 'Malaba Border Post', findings: 'Inspection waived — trusted trader program (Gold tier). Auto-cleared.', containers_inspected: 0, containers_total: 2, discrepancies: 0, photos_taken: 0 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  scheduled: { label: 'Scheduled', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', icon: Schedule },
  in_progress: { label: 'In Progress', color: '#E6A817', bg: 'rgba(230,168,23,0.1)', icon: Schedule },
  completed: { label: 'Completed', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', icon: CheckCircle },
  failed: { label: 'Failed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: Warning },
  waived: { label: 'Waived', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', icon: CheckCircle },
};

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  physical: { label: 'Physical', color: '#3B82F6' },
  scanner: { label: 'X-Ray / Scanner', color: '#8B5CF6' },
  documentary: { label: 'Documentary', color: '#E6A817' },
  sampling: { label: 'Sampling', color: '#06B6D4' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  routine: { label: 'Routine', color: '#999', bg: 'rgba(153,153,153,0.1)' },
  priority: { label: 'Priority', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  urgent: { label: 'Urgent', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function InspectionPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_INSPECTIONS.filter((ins) => {
      if (statusFilter !== 'all' && ins.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return ins.reference.toLowerCase().includes(q) || ins.trader.toLowerCase().includes(q) || ins.cargo_description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, statusFilter]);

  const scheduledCount = MOCK_INSPECTIONS.filter((i) => ['scheduled', 'in_progress'].includes(i.status)).length;
  const completedCount = MOCK_INSPECTIONS.filter((i) => i.status === 'completed').length;
  const failedCount = MOCK_INSPECTIONS.filter((i) => i.status === 'failed').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <ContentPasteSearch sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Inspections</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            Schedule, manage, and record cargo inspections with findings and evidence.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Schedule />}>
          Schedule Inspection
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Inspections', value: MOCK_INSPECTIONS.length.toString(), color: '#D4AF37' },
          { label: 'Pending / Active', value: scheduledCount.toString(), color: '#3B82F6' },
          { label: 'Completed', value: completedCount.toString(), color: '#22C55E' },
          { label: 'Failed / Flagged', value: failedCount.toString(), color: '#EF4444' },
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
              placeholder="Search by reference, trader, or cargo description..."
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

      {/* Inspection Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.map((ins) => {
          const sts = STATUS_CONFIG[ins.status];
          const tp = TYPE_CONFIG[ins.inspection_type];
          const pri = PRIORITY_CONFIG[ins.priority];
          const Icon = sts.icon;
          const progress = ins.containers_total > 0 ? Math.round((ins.containers_inspected / ins.containers_total) * 100) : 0;

          return (
            <Card key={ins.id} sx={{ p: 2.5, opacity: ins.status === 'waived' ? 0.7 : 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Icon sx={{ fontSize: 18, color: sts.color }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{ins.reference}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#555' }}>({ins.clearance_ref})</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{ins.trader}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0', mt: 0.25 }}>{ins.cargo_description}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0 }}>
                  <Chip label={pri.label} size="small" sx={{ fontSize: 9, height: 20, color: pri.color, backgroundColor: pri.bg }} />
                  <Chip label={tp.label} size="small" sx={{ fontSize: 9, height: 20, color: tp.color, backgroundColor: `${tp.color}15` }} />
                  <Chip label={sts.label} size="small" sx={{ fontSize: 9, height: 20, color: sts.color, backgroundColor: sts.bg }} />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Location</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{ins.location}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Scheduled</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{ins.scheduled_date}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#777' }}>{ins.scheduled_time}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Officer</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{ins.assigned_officer}</Typography>
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Progress</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>
                    {ins.containers_inspected}/{ins.containers_total} containers
                    {progress > 0 && progress < 100 && <Box component="span" sx={{ color: '#E6A817', ml: 0.5 }}>({progress}%)</Box>}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4, sm: 1.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Issues</Typography>
                  <Typography sx={{ fontSize: 12, color: ins.discrepancies > 0 ? '#EF4444' : '#22C55E' }}>
                    {ins.discrepancies > 0 ? `${ins.discrepancies} found` : 'None'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4, sm: 1.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Evidence</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CameraAlt sx={{ fontSize: 12, color: '#555' }} />
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{ins.photos_taken}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {ins.findings && (
                <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1, backgroundColor: ins.discrepancies > 0 ? 'rgba(239,68,68,0.05)' : 'rgba(34,197,94,0.05)', border: `1px solid ${ins.discrepancies > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}` }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>Findings</Typography>
                  <Typography sx={{ fontSize: 12, color: ins.discrepancies > 0 ? '#EF4444' : '#b0b0b0' }}>{ins.findings}</Typography>
                </Box>
              )}
            </Card>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filtered.length} of {MOCK_INSPECTIONS.length} inspections
        </Typography>
      </Box>
    </Box>
  );
}
