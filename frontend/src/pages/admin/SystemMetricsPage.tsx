import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  Speed,
  Error as ErrorIcon,
  Timer,
  People,
  Api,
  Storage,
  WorkOutline,
  TrendingUp,
} from '@mui/icons-material';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface MetricKPI {
  label: string;
  value: string;
  unit: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface EndpointMetric {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  errorRate: number;
  throughput: number;
}

interface DatabaseQuery {
  id: string;
  query: string;
  table: string;
  avgTime: number;
  calls: number;
  cacheHitRate: number;
}

interface BackgroundJob {
  id: string;
  queue: string;
  pending: number;
  processing: number;
  failed: number;
  throughput: number;
  health: 'healthy' | 'degraded' | 'critical';
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const KPIS: MetricKPI[] = [
  { label: 'Requests/sec', value: '1,247', unit: 'req/s', change: 8.3, icon: <Speed sx={{ fontSize: 18 }} />, color: '#D4AF37' },
  { label: 'Error Rate', value: '0.12', unit: '%', change: -32.1, icon: <ErrorIcon sx={{ fontSize: 18 }} />, color: '#22C55E' },
  { label: 'P95 Latency', value: '142', unit: 'ms', change: -8.5, icon: <Timer sx={{ fontSize: 18 }} />, color: '#3B82F6' },
  { label: 'Active Sessions', value: '487', unit: 'sessions', change: 15.2, icon: <People sx={{ fontSize: 18 }} />, color: '#8B5CF6' },
];

const ENDPOINTS: EndpointMetric[] = [
  { id: 'e1', endpoint: '/api/v1/auth/login', method: 'POST', p50Latency: 45, p95Latency: 120, p99Latency: 340, errorRate: 0.8, throughput: 342 },
  { id: 'e2', endpoint: '/api/v1/auth/me', method: 'GET', p50Latency: 12, p95Latency: 28, p99Latency: 55, errorRate: 0.01, throughput: 1247 },
  { id: 'e3', endpoint: '/api/v1/dashboard/summary', method: 'GET', p50Latency: 89, p95Latency: 245, p99Latency: 520, errorRate: 0.05, throughput: 487 },
  { id: 'e4', endpoint: '/api/v1/trade/documents', method: 'GET', p50Latency: 67, p95Latency: 180, p99Latency: 410, errorRate: 0.12, throughput: 634 },
  { id: 'e5', endpoint: '/api/v1/trade/documents', method: 'POST', p50Latency: 112, p95Latency: 340, p99Latency: 780, errorRate: 0.34, throughput: 89 },
  { id: 'e6', endpoint: '/api/v1/tax/assessments', method: 'GET', p50Latency: 78, p95Latency: 210, p99Latency: 450, errorRate: 0.08, throughput: 412 },
  { id: 'e7', endpoint: '/api/v1/payments/process', method: 'POST', p50Latency: 234, p95Latency: 560, p99Latency: 1200, errorRate: 0.45, throughput: 156 },
  { id: 'e8', endpoint: '/api/v1/payments/history', method: 'GET', p50Latency: 56, p95Latency: 145, p99Latency: 310, errorRate: 0.02, throughput: 523 },
  { id: 'e9', endpoint: '/api/v1/fx/rates', method: 'GET', p50Latency: 23, p95Latency: 48, p99Latency: 89, errorRate: 0.01, throughput: 2100 },
  { id: 'e10', endpoint: '/api/v1/supply-chain/shipments', method: 'GET', p50Latency: 98, p95Latency: 270, p99Latency: 580, errorRate: 0.15, throughput: 345 },
  { id: 'e11', endpoint: '/api/v1/customs/clearance', method: 'POST', p50Latency: 156, p95Latency: 420, p99Latency: 890, errorRate: 0.28, throughput: 78 },
  { id: 'e12', endpoint: '/api/v1/insurance/policies', method: 'GET', p50Latency: 45, p95Latency: 112, p99Latency: 230, errorRate: 0.03, throughput: 234 },
  { id: 'e13', endpoint: '/api/v1/ledger/journals', method: 'GET', p50Latency: 134, p95Latency: 380, p99Latency: 720, errorRate: 0.09, throughput: 189 },
  { id: 'e14', endpoint: '/api/v1/analytics/revenue', method: 'GET', p50Latency: 456, p95Latency: 1200, p99Latency: 2400, errorRate: 0.22, throughput: 67 },
  { id: 'e15', endpoint: '/api/v1/hs-codes/search', method: 'GET', p50Latency: 34, p95Latency: 78, p99Latency: 150, errorRate: 0.01, throughput: 890 },
];

const DB_QUERIES: DatabaseQuery[] = [
  { id: 'dq1', query: 'SELECT trade_documents', table: 'trade_documents', avgTime: 12.4, calls: 45_200, cacheHitRate: 87.3 },
  { id: 'dq2', query: 'SELECT tax_assessments', table: 'tax_assessments', avgTime: 8.7, calls: 23_100, cacheHitRate: 92.1 },
  { id: 'dq3', query: 'INSERT payments', table: 'payments', avgTime: 24.5, calls: 8_400, cacheHitRate: 0 },
  { id: 'dq4', query: 'SELECT users JOIN orgs', table: 'users', avgTime: 18.9, calls: 67_800, cacheHitRate: 94.5 },
  { id: 'dq5', query: 'SELECT fx_rates', table: 'exchange_rates', avgTime: 3.2, calls: 120_400, cacheHitRate: 99.1 },
  { id: 'dq6', query: 'SELECT shipments', table: 'shipments', avgTime: 15.6, calls: 34_500, cacheHitRate: 78.9 },
  { id: 'dq7', query: 'INSERT ledger_entries', table: 'ledger_entries', avgTime: 32.1, calls: 12_300, cacheHitRate: 0 },
  { id: 'dq8', query: 'SELECT audit_log', table: 'audit_log', avgTime: 45.2, calls: 5_600, cacheHitRate: 34.5 },
];

const JOB_QUEUES: BackgroundJob[] = [
  { id: 'jq1', queue: 'document-processing', pending: 12, processing: 3, failed: 1, throughput: 234, health: 'healthy' },
  { id: 'jq2', queue: 'payment-settlement', pending: 5, processing: 2, failed: 0, throughput: 89, health: 'healthy' },
  { id: 'jq3', queue: 'tax-calculation', pending: 28, processing: 8, failed: 4, throughput: 156, health: 'degraded' },
  { id: 'jq4', queue: 'fx-rate-sync', pending: 0, processing: 1, failed: 0, throughput: 1440, health: 'healthy' },
  { id: 'jq5', queue: 'report-generation', pending: 45, processing: 5, failed: 12, throughput: 34, health: 'critical' },
  { id: 'jq6', queue: 'email-notifications', pending: 8, processing: 2, failed: 0, throughput: 567, health: 'healthy' },
];

const METHOD_COLORS: Record<string, string> = {
  GET: '#22C55E',
  POST: '#3B82F6',
  PUT: '#E6A817',
  DELETE: '#EF4444',
};

const HEALTH_CONFIG = {
  healthy: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  degraded: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SystemMetricsPage() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Speed sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">System Metrics</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Real-time platform performance monitoring: API latency, database queries, and background job health.
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
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: kpi.color }}>{kpi.value}</Typography>
                <Typography sx={{ fontSize: 11, color: '#555' }}>{kpi.unit}</Typography>
              </Box>
              <Typography sx={{ fontSize: 11, color: kpi.change < 0 ? '#22C55E' : kpi.change > 0 ? '#E6A817' : '#888' }}>
                {kpi.change > 0 ? '+' : ''}{kpi.change}% vs yesterday
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Endpoint Performance */}
      <Card sx={{ p: 2.5, mb: 3 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
          <Api sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
          Endpoint Performance (Top 15)
        </Typography>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '0.5fr 3fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr',
          gap: 1, px: 2, py: 1,
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          backgroundColor: 'rgba(212,175,55,0.03)',
        }}>
          {['Method', 'Endpoint', 'P50 (ms)', 'P95 (ms)', 'P99 (ms)', 'Error %', 'Throughput/h'].map((h) => (
            <Typography key={h} sx={{ fontSize: 10, fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {h}
            </Typography>
          ))}
        </Box>

        {ENDPOINTS.map((ep) => (
          <Box key={ep.id} sx={{
            display: 'grid',
            gridTemplateColumns: '0.5fr 3fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr',
            gap: 1, px: 2, py: 1.25, alignItems: 'center',
            borderBottom: '1px solid rgba(212,175,55,0.05)',
            '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
          }}>
            <Chip
              label={ep.method}
              size="small"
              sx={{ fontSize: 9, height: 18, fontWeight: 700, color: METHOD_COLORS[ep.method], backgroundColor: `${METHOD_COLORS[ep.method]}15` }}
            />
            <Typography sx={{ fontSize: 11, color: '#e0e0e0', fontFamily: 'monospace' }}>{ep.endpoint}</Typography>
            <Typography sx={{ fontSize: 11, color: '#b0b0b0', fontFamily: 'monospace' }}>{ep.p50Latency}</Typography>
            <Typography sx={{ fontSize: 11, color: ep.p95Latency > 500 ? '#E6A817' : '#b0b0b0', fontFamily: 'monospace' }}>{ep.p95Latency}</Typography>
            <Typography sx={{ fontSize: 11, color: ep.p99Latency > 1000 ? '#EF4444' : '#b0b0b0', fontFamily: 'monospace' }}>{ep.p99Latency}</Typography>
            <Typography sx={{ fontSize: 11, color: ep.errorRate > 0.3 ? '#EF4444' : ep.errorRate > 0.1 ? '#E6A817' : '#22C55E', fontFamily: 'monospace' }}>
              {ep.errorRate}%
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#b0b0b0', fontFamily: 'monospace' }}>{ep.throughput.toLocaleString()}</Typography>
          </Box>
        ))}
      </Card>

      <Grid container spacing={2}>
        {/* Database Queries */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <Storage sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Database Query Performance
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {DB_QUERIES.map((q) => (
                <Box key={q.id} sx={{ p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.05)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                    <Typography sx={{ fontSize: 12, color: '#e0e0e0', fontFamily: 'monospace' }}>{q.query}</Typography>
                    <Chip label={q.table} size="small" sx={{ fontSize: 9, height: 16, color: '#888', backgroundColor: 'rgba(212,175,55,0.06)' }} />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Avg Time</Typography>
                      <Typography sx={{ fontSize: 12, color: q.avgTime > 30 ? '#EF4444' : q.avgTime > 15 ? '#E6A817' : '#22C55E', fontFamily: 'monospace' }}>
                        {q.avgTime}ms
                      </Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Calls (24h)</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace' }}>{q.calls.toLocaleString()}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Cache Hit</Typography>
                      <Typography sx={{ fontSize: 12, color: q.cacheHitRate > 80 ? '#22C55E' : q.cacheHitRate > 0 ? '#E6A817' : '#555', fontFamily: 'monospace' }}>
                        {q.cacheHitRate > 0 ? `${q.cacheHitRate}%` : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Background Job Queues */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <WorkOutline sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Background Job Queues
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {JOB_QUEUES.map((jq) => {
                const hc = HEALTH_CONFIG[jq.health];
                return (
                  <Box key={jq.id} sx={{ p: 1.5, borderRadius: 1, backgroundColor: hc.bg }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: hc.color }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{jq.queue}</Typography>
                      </Box>
                      <Chip
                        label={jq.health}
                        size="small"
                        sx={{ fontSize: 9, height: 16, color: hc.color, backgroundColor: 'transparent', border: `1px solid ${hc.color}33` }}
                      />
                    </Box>
                    <Grid container spacing={1}>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>Pending</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', fontFamily: "'Lora', serif" }}>{jq.pending}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>Active</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#3B82F6', fontFamily: "'Lora', serif" }}>{jq.processing}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>Failed</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: jq.failed > 0 ? '#EF4444' : '#555', fontFamily: "'Lora', serif" }}>{jq.failed}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                          <TrendingUp sx={{ fontSize: 10, color: '#22C55E' }} />
                          <Typography sx={{ fontSize: 10, color: '#555' }}>/h</Typography>
                        </Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#22C55E', fontFamily: "'Lora', serif" }}>{jq.throughput}</Typography>
                      </Grid>
                    </Grid>
                    <LinearProgress
                      variant="determinate"
                      value={jq.processing > 0 ? Math.min((jq.processing / (jq.pending + jq.processing)) * 100, 100) : 0}
                      sx={{
                        mt: 1, height: 3, borderRadius: 2,
                        backgroundColor: 'rgba(212,175,55,0.08)',
                        '& .MuiLinearProgress-bar': { backgroundColor: hc.color, borderRadius: 2 },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
