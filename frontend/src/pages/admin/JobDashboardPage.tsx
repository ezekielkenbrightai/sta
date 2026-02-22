import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  WorkOutline,
  PlayArrow,
  Queue,
  Error as ErrorIcon,
  Timer,
  Replay,
  Schedule,
  CheckCircle,
  HourglassEmpty,
  Cancel,
} from '@mui/icons-material';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface JobKPI {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface QueuedJob {
  id: string;
  name: string;
  type: 'document-processing' | 'payment-settlement' | 'tax-calculation' | 'fx-sync' | 'report-generation' | 'email' | 'data-export' | 'audit-log';
  status: 'running' | 'queued' | 'completed' | 'failed' | 'retrying';
  started: string;
  duration: string;
  worker: string;
  progress: number;
}

interface FailedJob {
  id: string;
  name: string;
  type: string;
  error: string;
  failedAt: string;
  retries: number;
  maxRetries: number;
}

interface ScheduledJob {
  id: string;
  name: string;
  cron: string;
  description: string;
  nextRun: string;
  lastRun: string;
  lastStatus: 'success' | 'failed';
  avgDuration: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const KPIS: JobKPI[] = [
  { label: 'Running Jobs', value: '14', change: 0, icon: <PlayArrow sx={{ fontSize: 18 }} />, color: '#D4AF37' },
  { label: 'Queued', value: '87', change: 23.4, icon: <Queue sx={{ fontSize: 18 }} />, color: '#3B82F6' },
  { label: 'Failed (24h)', value: '23', change: -8.5, icon: <ErrorIcon sx={{ fontSize: 18 }} />, color: '#EF4444' },
  { label: 'Avg Processing', value: '4.2s', change: -12.3, icon: <Timer sx={{ fontSize: 18 }} />, color: '#22C55E' },
];

const QUEUED_JOBS: QueuedJob[] = [
  { id: 'j1', name: 'Process Trade Document #TD-2026-4821', type: 'document-processing', status: 'running', started: '12:34:01', duration: '2.3s', worker: 'worker-01', progress: 68 },
  { id: 'j2', name: 'Settle Payment #PAY-89234', type: 'payment-settlement', status: 'running', started: '12:34:05', duration: '1.8s', worker: 'worker-02', progress: 45 },
  { id: 'j3', name: 'Calculate Duty #TAX-56789', type: 'tax-calculation', status: 'running', started: '12:33:58', duration: '4.1s', worker: 'worker-03', progress: 82 },
  { id: 'j4', name: 'Sync FX Rates (CBK)', type: 'fx-sync', status: 'running', started: '12:34:00', duration: '2.0s', worker: 'worker-04', progress: 90 },
  { id: 'j5', name: 'Generate Revenue Report Q1', type: 'report-generation', status: 'running', started: '12:31:15', duration: '2m 48s', worker: 'worker-05', progress: 34 },
  { id: 'j6', name: 'Process Trade Document #TD-2026-4822', type: 'document-processing', status: 'queued', started: '-', duration: '-', worker: '-', progress: 0 },
  { id: 'j7', name: 'Send KRA Notification Batch', type: 'email', status: 'queued', started: '-', duration: '-', worker: '-', progress: 0 },
  { id: 'j8', name: 'Export Analytics Dataset', type: 'data-export', status: 'queued', started: '-', duration: '-', worker: '-', progress: 0 },
  { id: 'j9', name: 'Settle Payment #PAY-89235', type: 'payment-settlement', status: 'retrying', started: '12:33:45', duration: '18.2s', worker: 'worker-02', progress: 15 },
  { id: 'j10', name: 'Process Audit Log Batch', type: 'audit-log', status: 'completed', started: '12:32:10', duration: '1m 12s', worker: 'worker-01', progress: 100 },
  { id: 'j11', name: 'Calculate Duty #TAX-56790', type: 'tax-calculation', status: 'queued', started: '-', duration: '-', worker: '-', progress: 0 },
  { id: 'j12', name: 'Send Payment Confirmation #89230', type: 'email', status: 'completed', started: '12:33:00', duration: '0.8s', worker: 'worker-06', progress: 100 },
];

const FAILED_JOBS: FailedJob[] = [
  { id: 'fj1', name: 'Process Trade Document #TD-2026-4819', type: 'document-processing', error: 'PDF parsing failed: corrupt file header (offset 0x4F)', failedAt: '11:45:23', retries: 3, maxRetries: 3 },
  { id: 'fj2', name: 'Settle Payment #PAY-89228', type: 'payment-settlement', error: 'SWIFT timeout: no ACK received within 30s', failedAt: '10:12:05', retries: 2, maxRetries: 3 },
  { id: 'fj3', name: 'Generate Compliance Report', type: 'report-generation', error: 'OutOfMemoryError: Java heap space (dataset > 2GB)', failedAt: '09:30:12', retries: 1, maxRetries: 3 },
  { id: 'fj4', name: 'Sync URA FX Rates', type: 'fx-sync', error: 'ConnectionRefusedError: URA API endpoint unreachable', failedAt: '08:15:00', retries: 3, maxRetries: 3 },
  { id: 'fj5', name: 'Calculate Duty #TAX-56783', type: 'tax-calculation', error: 'HS Code 8471.30.00 not found in AfCFTA tariff schedule v2.3', failedAt: '07:22:45', retries: 0, maxRetries: 3 },
  { id: 'fj6', name: 'Send Trader Notification', type: 'email', error: 'SMTP auth failed: relay access denied', failedAt: '06:55:30', retries: 3, maxRetries: 3 },
];

const SCHEDULED_JOBS: ScheduledJob[] = [
  { id: 'sj1', name: 'FX Rate Sync (All CBs)', cron: '*/5 * * * *', description: 'Sync exchange rates from all central banks every 5 minutes', nextRun: '12:40:00', lastRun: '12:35:00', lastStatus: 'success', avgDuration: '2.1s' },
  { id: 'sj2', name: 'Daily Revenue Summary', cron: '0 23 * * *', description: 'Generate daily revenue summary for all countries', nextRun: '23:00:00', lastRun: 'Yesterday 23:00', lastStatus: 'success', avgDuration: '4m 23s' },
  { id: 'sj3', name: 'Database Backup', cron: '0 2 * * *', description: 'Full PostgreSQL backup to S3 with encryption', nextRun: 'Tomorrow 02:00', lastRun: 'Today 02:00', lastStatus: 'success', avgDuration: '18m 45s' },
  { id: 'sj4', name: 'Compliance Check', cron: '0 6 * * 1', description: 'Weekly compliance audit scan across all organizations', nextRun: 'Monday 06:00', lastRun: 'Last Monday 06:00', lastStatus: 'success', avgDuration: '12m 30s' },
  { id: 'sj5', name: 'Cache Warmup', cron: '0 5 * * *', description: 'Pre-warm Redis cache with frequently accessed HS codes and FX rates', nextRun: 'Tomorrow 05:00', lastRun: 'Today 05:00', lastStatus: 'success', avgDuration: '45s' },
  { id: 'sj6', name: 'Stale Session Cleanup', cron: '0 */4 * * *', description: 'Remove expired JWT sessions and refresh tokens', nextRun: '16:00:00', lastRun: '12:00:00', lastStatus: 'success', avgDuration: '3.2s' },
  { id: 'sj7', name: 'Monthly Audit Report', cron: '0 1 1 * *', description: 'Generate comprehensive monthly audit trail report', nextRun: 'Mar 1 01:00', lastRun: 'Feb 1 01:00', lastStatus: 'failed', avgDuration: '28m 15s' },
  { id: 'sj8', name: 'AfCFTA Tariff Sync', cron: '0 3 * * 0', description: 'Weekly sync of AfCFTA tariff schedule updates', nextRun: 'Sunday 03:00', lastRun: 'Last Sunday 03:00', lastStatus: 'success', avgDuration: '8m 12s' },
];

const JOB_STATUS_CONFIG = {
  running: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', icon: <PlayArrow sx={{ fontSize: 12 }} /> },
  queued: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)', icon: <HourglassEmpty sx={{ fontSize: 12 }} /> },
  completed: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)', icon: <CheckCircle sx={{ fontSize: 12 }} /> },
  failed: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', icon: <Cancel sx={{ fontSize: 12 }} /> },
  retrying: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', icon: <Replay sx={{ fontSize: 12 }} /> },
};

const TYPE_COLORS: Record<string, string> = {
  'document-processing': '#D4AF37',
  'payment-settlement': '#3B82F6',
  'tax-calculation': '#22C55E',
  'fx-sync': '#8B5CF6',
  'report-generation': '#EC4899',
  'email': '#E6A817',
  'data-export': '#06B6D4',
  'audit-log': '#777',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function JobDashboardPage() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <WorkOutline sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Background Jobs</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Monitor job queues, processing status, failures, and scheduled tasks across the platform.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {KPIS.map((kpi) => (
          <Grid size={{ xs: 6, md: 3 }} key={kpi.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <Box sx={{ color: kpi.color }}>{kpi.icon}</Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{kpi.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: kpi.color }}>{kpi.value}</Typography>
              {kpi.change !== 0 && (
                <Typography sx={{ fontSize: 11, color: kpi.change < 0 ? '#22C55E' : '#E6A817' }}>
                  {kpi.change > 0 ? '+' : ''}{kpi.change}% vs yesterday
                </Typography>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Job Queue Table */}
      <Card sx={{ p: 2.5, mb: 3 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
          <Queue sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
          Job Queue
        </Typography>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '3fr 1.2fr 0.8fr 0.8fr 1fr 0.8fr 1.5fr',
          gap: 1, px: 2, py: 1,
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          backgroundColor: 'rgba(212,175,55,0.03)',
        }}>
          {['Job Name', 'Type', 'Status', 'Started', 'Duration', 'Worker', 'Progress'].map((h) => (
            <Typography key={h} sx={{ fontSize: 10, fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {h}
            </Typography>
          ))}
        </Box>

        {QUEUED_JOBS.map((job) => {
          const jsc = JOB_STATUS_CONFIG[job.status];
          const tc = TYPE_COLORS[job.type] || '#777';
          return (
            <Box key={job.id} sx={{
              display: 'grid',
              gridTemplateColumns: '3fr 1.2fr 0.8fr 0.8fr 1fr 0.8fr 1.5fr',
              gap: 1, px: 2, py: 1.25, alignItems: 'center',
              borderBottom: '1px solid rgba(212,175,55,0.05)',
              '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
            }}>
              <Typography sx={{ fontSize: 11, color: '#e0e0e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.name}</Typography>
              <Chip
                label={job.type}
                size="small"
                sx={{ fontSize: 8, height: 16, color: tc, backgroundColor: `${tc}12`, maxWidth: 120, overflow: 'hidden' }}
              />
              <Chip
                icon={jsc.icon}
                label={job.status}
                size="small"
                sx={{ fontSize: 9, height: 18, color: jsc.color, backgroundColor: jsc.bg, textTransform: 'capitalize', '& .MuiChip-icon': { color: jsc.color } }}
              />
              <Typography sx={{ fontSize: 10, color: '#888', fontFamily: 'monospace' }}>{job.started}</Typography>
              <Typography sx={{ fontSize: 10, color: '#888', fontFamily: 'monospace' }}>{job.duration}</Typography>
              <Typography sx={{ fontSize: 10, color: '#555', fontFamily: 'monospace' }}>{job.worker}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={job.progress}
                  sx={{
                    flex: 1, height: 4, borderRadius: 2,
                    backgroundColor: 'rgba(212,175,55,0.08)',
                    '& .MuiLinearProgress-bar': { backgroundColor: jsc.color, borderRadius: 2 },
                  }}
                />
                <Typography sx={{ fontSize: 10, color: '#777', fontFamily: 'monospace', minWidth: 28 }}>{job.progress}%</Typography>
              </Box>
            </Box>
          );
        })}
      </Card>

      <Grid container spacing={2}>
        {/* Failed Jobs */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <ErrorIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#EF4444' }} />
              Failed Jobs (Last 24h)
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {FAILED_JOBS.map((fj) => (
                <Box key={fj.id} sx={{
                  p: 1.5, borderRadius: 1,
                  backgroundColor: 'rgba(239,68,68,0.04)',
                  border: '1px solid rgba(239,68,68,0.1)',
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{fj.name}</Typography>
                    <Button
                      size="small"
                      startIcon={<Replay sx={{ fontSize: 12 }} />}
                      disabled={fj.retries >= fj.maxRetries}
                      sx={{
                        fontSize: 10, color: '#D4AF37', textTransform: 'none', minWidth: 'auto', py: 0,
                        '&.Mui-disabled': { color: '#444' },
                      }}
                    >
                      Retry
                    </Button>
                  </Box>
                  <Typography sx={{ fontSize: 10, color: '#EF4444', fontFamily: 'monospace', mb: 0.5 }}>{fj.error}</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ fontSize: 10, color: '#555' }}>Failed: {fj.failedAt}</Typography>
                    <Typography sx={{ fontSize: 10, color: fj.retries >= fj.maxRetries ? '#EF4444' : '#E6A817' }}>
                      Retries: {fj.retries}/{fj.maxRetries}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Scheduled Jobs */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <Schedule sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Scheduled Jobs
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {SCHEDULED_JOBS.map((sj) => (
                <Box key={sj.id} sx={{
                  p: 1.5, borderRadius: 1,
                  backgroundColor: 'rgba(212,175,55,0.03)',
                  border: '1px solid rgba(212,175,55,0.05)',
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{sj.name}</Typography>
                    <Chip
                      label={sj.cron}
                      size="small"
                      sx={{ fontSize: 9, height: 16, color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.08)', fontFamily: 'monospace' }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 10, color: '#b0b0b0', mb: 0.75 }}>{sj.description}</Typography>
                  <Grid container spacing={1}>
                    <Grid size={3}>
                      <Typography sx={{ fontSize: 9, color: '#555', textTransform: 'uppercase' }}>Next Run</Typography>
                      <Typography sx={{ fontSize: 10, color: '#D4AF37', fontFamily: 'monospace' }}>{sj.nextRun}</Typography>
                    </Grid>
                    <Grid size={3}>
                      <Typography sx={{ fontSize: 9, color: '#555', textTransform: 'uppercase' }}>Last Run</Typography>
                      <Typography sx={{ fontSize: 10, color: '#888', fontFamily: 'monospace' }}>{sj.lastRun}</Typography>
                    </Grid>
                    <Grid size={3}>
                      <Typography sx={{ fontSize: 9, color: '#555', textTransform: 'uppercase' }}>Status</Typography>
                      <Chip
                        label={sj.lastStatus}
                        size="small"
                        sx={{
                          fontSize: 8, height: 14,
                          color: sj.lastStatus === 'success' ? '#22C55E' : '#EF4444',
                          backgroundColor: sj.lastStatus === 'success' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                        }}
                      />
                    </Grid>
                    <Grid size={3}>
                      <Typography sx={{ fontSize: 9, color: '#555', textTransform: 'uppercase' }}>Avg Time</Typography>
                      <Typography sx={{ fontSize: 10, color: '#888', fontFamily: 'monospace' }}>{sj.avgDuration}</Typography>
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
