import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  Schedule,
  Email,
  PlayArrow,
  CheckCircle,
  Add,
  History,
  Group,
  CalendarMonth,
} from '@mui/icons-material';

// --- Mock data ---------------------------------------------------------------

interface ScheduleItem {
  id: string;
  name: string;
  reportType: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  lastRun: string;
  nextRun: string;
  status: 'active' | 'paused' | 'failed';
  recipients: string[];
  format: string;
}

interface DeliveryLog {
  id: string;
  scheduleName: string;
  deliveredAt: string;
  recipients: number;
  status: 'delivered' | 'failed' | 'partial';
  size: string;
  format: string;
}

interface KPI {
  label: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}

const SCHEDULES: ScheduleItem[] = [
  { id: 's1', name: 'Daily Revenue Summary', reportType: 'Revenue Analytics', frequency: 'daily', lastRun: '23 Feb 2026, 06:00', nextRun: '24 Feb 2026, 06:00', status: 'active', recipients: ['treasury@kra.go.ke', 'cfo@kra.go.ke'], format: 'PDF' },
  { id: 's2', name: 'Weekly Trade Volume Report', reportType: 'Trade Flow Analysis', frequency: 'weekly', lastRun: '17 Feb 2026, 08:00', nextRun: '24 Feb 2026, 08:00', status: 'active', recipients: ['trade-desk@kra.go.ke', 'policy@mofa.go.ke', 'stats@knbs.or.ke'], format: 'Excel' },
  { id: 's3', name: 'Monthly Compliance Scorecard', reportType: 'Compliance Monitoring', frequency: 'monthly', lastRun: '01 Feb 2026, 07:00', nextRun: '01 Mar 2026, 07:00', status: 'active', recipients: ['compliance@kra.go.ke', 'enforcement@kra.go.ke'], format: 'PDF' },
  { id: 's4', name: 'Weekly AfCFTA Utilization', reportType: 'AfCFTA Progress', frequency: 'weekly', lastRun: '17 Feb 2026, 09:00', nextRun: '24 Feb 2026, 09:00', status: 'paused', recipients: ['afcfta-desk@mofa.go.ke'], format: 'PDF' },
  { id: 's5', name: 'Daily Customs Clearance Digest', reportType: 'Customs Operations', frequency: 'daily', lastRun: '23 Feb 2026, 05:30', nextRun: '24 Feb 2026, 05:30', status: 'active', recipients: ['ops@kpa.go.ke', 'clearance@kra.go.ke', 'logistics@kra.go.ke'], format: 'CSV' },
  { id: 's6', name: 'Monthly GDP Impact Brief', reportType: 'Economic Impact', frequency: 'monthly', lastRun: '01 Feb 2026, 10:00', nextRun: '01 Mar 2026, 10:00', status: 'failed', recipients: ['macro@treasury.go.ke', 'advisor@presidency.go.ke'], format: 'PDF' },
  { id: 's7', name: 'Weekly FX Settlement Summary', reportType: 'Payments & FX', frequency: 'weekly', lastRun: '17 Feb 2026, 07:30', nextRun: '24 Feb 2026, 07:30', status: 'active', recipients: ['fx-desk@cbk.go.ke', 'settlements@kcb.co.ke'], format: 'Excel' },
];

const DELIVERY_LOGS: DeliveryLog[] = [
  { id: 'd1', scheduleName: 'Daily Revenue Summary', deliveredAt: '23 Feb 2026, 06:02', recipients: 2, status: 'delivered', size: '1.2 MB', format: 'PDF' },
  { id: 'd2', scheduleName: 'Daily Customs Clearance Digest', deliveredAt: '23 Feb 2026, 05:33', recipients: 3, status: 'delivered', size: '340 KB', format: 'CSV' },
  { id: 'd3', scheduleName: 'Monthly GDP Impact Brief', deliveredAt: '01 Feb 2026, 10:05', recipients: 2, status: 'failed', size: '---', format: 'PDF' },
  { id: 'd4', scheduleName: 'Weekly Trade Volume Report', deliveredAt: '17 Feb 2026, 08:04', recipients: 3, status: 'delivered', size: '4.7 MB', format: 'Excel' },
  { id: 'd5', scheduleName: 'Weekly FX Settlement Summary', deliveredAt: '17 Feb 2026, 07:32', recipients: 2, status: 'delivered', size: '2.1 MB', format: 'Excel' },
  { id: 'd6', scheduleName: 'Monthly Compliance Scorecard', deliveredAt: '01 Feb 2026, 07:03', recipients: 2, status: 'partial', size: '890 KB', format: 'PDF' },
  { id: 'd7', scheduleName: 'Weekly AfCFTA Utilization', deliveredAt: '10 Feb 2026, 09:01', recipients: 1, status: 'delivered', size: '520 KB', format: 'PDF' },
  { id: 'd8', scheduleName: 'Daily Revenue Summary', deliveredAt: '22 Feb 2026, 06:01', recipients: 2, status: 'delivered', size: '1.1 MB', format: 'PDF' },
];

const FREQUENCY_COLORS: Record<string, string> = {
  daily: '#3B82F6',
  weekly: '#8B5CF6',
  monthly: '#22C55E',
};

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  active: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  paused: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
  failed: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  delivered: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  partial: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
};

// --- Page --------------------------------------------------------------------

export default function ScheduledReportsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ name: '', reportType: '', frequency: 'weekly', recipients: '', format: 'PDF' });

  const totalRecipients = SCHEDULES.reduce((s, sch) => s + sch.recipients.length, 0);
  const activeCount = SCHEDULES.filter((s) => s.status === 'active').length;
  const deliveredCount = DELIVERY_LOGS.filter((d) => d.status === 'delivered').length;
  const successRate = ((deliveredCount / DELIVERY_LOGS.length) * 100).toFixed(1);

  const kpis: KPI[] = [
    { label: 'Active Schedules', value: String(activeCount), color: '#D4AF37', icon: <Schedule sx={{ fontSize: 18, color: '#D4AF37' }} /> },
    { label: 'Total Recipients', value: String(totalRecipients), color: '#3B82F6', icon: <Group sx={{ fontSize: 18, color: '#3B82F6' }} /> },
    { label: 'Next Run', value: '24 Feb 05:30', color: '#8B5CF6', icon: <PlayArrow sx={{ fontSize: 18, color: '#8B5CF6' }} /> },
    { label: 'Delivery Success', value: `${successRate}%`, color: '#22C55E', icon: <CheckCircle sx={{ fontSize: 18, color: '#22C55E' }} /> },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <CalendarMonth sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Scheduled Reports</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            Automated report delivery schedules, recipient management, and delivery history tracking.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{ borderRadius: '50px', fontWeight: 600, textTransform: 'none', backgroundColor: '#D4AF37', '&:hover': { backgroundColor: '#B8962E' } }}
        >
          Add Schedule
        </Button>
      </Box>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((k) => (
          <Grid size={{ xs: 6, md: 3 }} key={k.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                {k.icon}
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{k.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: k.color }}>{k.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Schedule Table */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <Schedule sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Report Schedules
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {SCHEDULES.map((s) => {
                const sc = STATUS_CONFIG[s.status];
                return (
                  <Box key={s.id} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{s.name}</Typography>
                        <Chip
                          label={s.frequency}
                          size="small"
                          sx={{ fontSize: 9, height: 16, color: FREQUENCY_COLORS[s.frequency], backgroundColor: `${FREQUENCY_COLORS[s.frequency]}14` }}
                        />
                      </Box>
                      <Chip
                        label={s.status}
                        size="small"
                        sx={{ fontSize: 9, height: 16, color: sc.color, backgroundColor: sc.bg, textTransform: 'capitalize' }}
                      />
                    </Box>
                    <Grid container spacing={1.5}>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Type</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{s.reportType}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Last Run</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{s.lastRun}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Next Run</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{s.nextRun}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Recipients</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Email sx={{ fontSize: 12, color: '#777' }} />
                          <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{s.recipients.length}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Delivery History */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <History sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Delivery History
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {DELIVERY_LOGS.map((d) => {
                const dc = STATUS_CONFIG[d.status];
                return (
                  <Box key={d.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.03)' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: dc.color, flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 12, color: '#e0e0e0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {d.scheduleName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{d.deliveredAt}</Typography>
                        <Chip label={d.format} size="small" sx={{ fontSize: 8, height: 14, color: '#888', backgroundColor: 'rgba(212,175,55,0.06)' }} />
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: 11, color: '#b0b0b0', fontFamily: 'monospace' }}>{d.size}</Typography>
                      <Typography sx={{ fontSize: 9, color: dc.color }}>
                        {d.recipients} recipient{d.recipients > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Delivery Success Rate */}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(212,175,55,0.08)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography sx={{ fontSize: 12, color: '#888' }}>Overall Delivery Success</Typography>
                <Typography sx={{ fontSize: 12, color: '#22C55E', fontFamily: 'monospace' }}>{successRate}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={parseFloat(successRate)}
                sx={{
                  height: 6, borderRadius: 3,
                  backgroundColor: 'rgba(212,175,55,0.08)',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#22C55E', borderRadius: 3 },
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Add Schedule Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { backgroundColor: '#111111', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ color: '#f0f0f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add sx={{ color: '#D4AF37' }} />
            New Report Schedule
          </Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Schedule Name"
            fullWidth size="small"
            value={newSchedule.name}
            onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
          />
          <TextField
            select label="Report Type"
            fullWidth size="small"
            value={newSchedule.reportType}
            onChange={(e) => setNewSchedule({ ...newSchedule, reportType: e.target.value })}
          >
            <MenuItem value="revenue">Revenue Analytics</MenuItem>
            <MenuItem value="trade-flow">Trade Flow Analysis</MenuItem>
            <MenuItem value="compliance">Compliance Monitoring</MenuItem>
            <MenuItem value="afcfta">AfCFTA Progress</MenuItem>
            <MenuItem value="economic-impact">Economic Impact</MenuItem>
            <MenuItem value="customs">Customs Operations</MenuItem>
            <MenuItem value="payments">Payments & FX</MenuItem>
          </TextField>
          <TextField
            select label="Frequency"
            fullWidth size="small"
            value={newSchedule.frequency}
            onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value })}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </TextField>
          <TextField
            label="Recipients (comma-separated emails)"
            fullWidth size="small"
            value={newSchedule.recipients}
            onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
            placeholder="user@example.go.ke, analyst@kra.go.ke"
          />
          <TextField
            select label="Output Format"
            fullWidth size="small"
            value={newSchedule.format}
            onChange={(e) => setNewSchedule({ ...newSchedule, format: e.target.value })}
          >
            <MenuItem value="PDF">PDF</MenuItem>
            <MenuItem value="Excel">Excel (XLSX)</MenuItem>
            <MenuItem value="CSV">CSV</MenuItem>
            <MenuItem value="JSON">JSON</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#888', textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => setDialogOpen(false)}
            sx={{ borderRadius: '50px', fontWeight: 600, textTransform: 'none', backgroundColor: '#D4AF37', '&:hover': { backgroundColor: '#B8962E' } }}
          >
            Create Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
