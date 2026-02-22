import { useState } from 'react';
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
  AdminPanelSettings,
  People,
  Business,
  Public,
  Timer,
  PersonAdd,
  DomainAdd,
  ListAlt,
  Memory,
  Storage,
  Dns,
  Security,
  TrendingUp,
  Warning,
} from '@mui/icons-material';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface AdminKPI {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface AdminAction {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

interface SystemResource {
  name: string;
  usage: number;
  total: string;
  used: string;
  icon: React.ReactNode;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  color: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const KPIS: AdminKPI[] = [
  { label: 'Total Users', value: '2,847', change: 12.4, icon: <People sx={{ fontSize: 18 }} />, color: '#D4AF37' },
  { label: 'Active Organizations', value: '184', change: 8.2, icon: <Business sx={{ fontSize: 18 }} />, color: '#22C55E' },
  { label: 'Countries', value: '9', change: 0, icon: <Public sx={{ fontSize: 18 }} />, color: '#3B82F6' },
  { label: 'System Uptime', value: '99.97%', change: 0.02, icon: <Timer sx={{ fontSize: 18 }} />, color: '#8B5CF6' },
];

const RECENT_ACTIONS: AdminAction[] = [
  { id: 'a1', action: 'User suspended', actor: 'admin@sta.africa', target: 'john.doe@company.ke', timestamp: '3m ago', severity: 'warning' },
  { id: 'a2', action: 'Organization approved', actor: 'admin@sta.africa', target: 'Mombasa Exports Ltd', timestamp: '18m ago', severity: 'info' },
  { id: 'a3', action: 'Feature flag toggled', actor: 'admin@sta.africa', target: 'cbdc_payments_enabled', timestamp: '42m ago', severity: 'info' },
  { id: 'a4', action: 'Country added', actor: 'admin@sta.africa', target: 'South Sudan', timestamp: '1h ago', severity: 'info' },
  { id: 'a5', action: 'API key revoked', actor: 'admin@sta.africa', target: 'KRA Integration Key', timestamp: '2h ago', severity: 'critical' },
  { id: 'a6', action: 'User role changed', actor: 'govt@kra.go.ke', target: 'analyst@kra.go.ke (govt_analyst -> govt_admin)', timestamp: '3h ago', severity: 'warning' },
  { id: 'a7', action: 'Bulk import completed', actor: 'system', target: '347 HS codes updated', timestamp: '4h ago', severity: 'info' },
  { id: 'a8', action: 'Database backup', actor: 'system', target: 'PostgreSQL full backup (12.4GB)', timestamp: '6h ago', severity: 'info' },
];

const SYSTEM_RESOURCES: SystemResource[] = [
  { name: 'CPU Usage', usage: 34, total: '8 vCPUs', used: '2.72 vCPUs', icon: <Dns sx={{ fontSize: 16, color: '#D4AF37' }} /> },
  { name: 'Memory', usage: 62, total: '32 GB', used: '19.8 GB', icon: <Memory sx={{ fontSize: 16, color: '#3B82F6' }} /> },
  { name: 'Storage', usage: 47, total: '500 GB', used: '235 GB', icon: <Storage sx={{ fontSize: 16, color: '#22C55E' }} /> },
  { name: 'Redis Cache', usage: 28, total: '4 GB', used: '1.12 GB', icon: <Security sx={{ fontSize: 16, color: '#8B5CF6' }} /> },
];

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Create User', icon: <PersonAdd sx={{ fontSize: 16 }} />, color: '#D4AF37' },
  { label: 'Add Organization', icon: <DomainAdd sx={{ fontSize: 16 }} />, color: '#22C55E' },
  { label: 'View Logs', icon: <ListAlt sx={{ fontSize: 16 }} />, color: '#3B82F6' },
  { label: 'System Status', icon: <TrendingUp sx={{ fontSize: 16 }} />, color: '#8B5CF6' },
];

const SEVERITY_CONFIG = {
  info: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  warning: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [_refresh, setRefresh] = useState(0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <AdminPanelSettings sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Admin Overview</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Platform administration dashboard with system health, user activity, and quick actions.
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
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: kpi.color }}>
                {kpi.value}
              </Typography>
              {kpi.change !== 0 && (
                <Typography sx={{ fontSize: 11, color: kpi.change > 0 ? '#22C55E' : '#EF4444' }}>
                  {kpi.change > 0 ? '+' : ''}{kpi.change}% vs last month
                </Typography>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Recent Actions Log */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>
                <ListAlt sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Recent Admin Actions
              </Typography>
              <Button
                size="small"
                onClick={() => setRefresh((r) => r + 1)}
                sx={{ fontSize: 11, color: '#D4AF37', textTransform: 'none' }}
              >
                Refresh
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {RECENT_ACTIONS.map((a) => {
                const sc = SEVERITY_CONFIG[a.severity];
                return (
                  <Box key={a.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 1.5, borderRadius: 1, backgroundColor: sc.bg }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: sc.color, mt: 0.75, flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 12, color: '#e0e0e0', fontWeight: 600 }}>{a.action}</Typography>
                      <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{a.target}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Chip label={a.actor} size="small" sx={{ fontSize: 9, height: 14, color: '#888', backgroundColor: 'rgba(212,175,55,0.06)' }} />
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{a.timestamp}</Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Right Column: Resources + Quick Actions */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* System Resources */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <Memory sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                System Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {SYSTEM_RESOURCES.map((r) => (
                  <Box key={r.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {r.icon}
                        <Typography sx={{ fontSize: 12, color: '#e0e0e0' }}>{r.name}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 11, color: '#777', fontFamily: 'monospace' }}>
                        {r.used} / {r.total}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={r.usage}
                        sx={{
                          flex: 1, height: 6, borderRadius: 3,
                          backgroundColor: 'rgba(212,175,55,0.08)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: r.usage > 80 ? '#EF4444' : r.usage > 60 ? '#E6A817' : '#22C55E',
                            borderRadius: 3,
                          },
                        }}
                      />
                      <Typography sx={{ fontSize: 11, color: r.usage > 80 ? '#EF4444' : '#888', fontFamily: 'monospace', minWidth: 32, textAlign: 'right' }}>
                        {r.usage}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Quick Actions */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <Warning sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Quick Actions
              </Typography>
              <Grid container spacing={1.5}>
                {QUICK_ACTIONS.map((qa) => (
                  <Grid size={6} key={qa.label}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={qa.icon}
                      sx={{
                        py: 1.5,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: 'none',
                        color: qa.color,
                        borderColor: `${qa.color}33`,
                        backgroundColor: `${qa.color}08`,
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: `${qa.color}66`,
                          backgroundColor: `${qa.color}15`,
                        },
                      }}
                    >
                      {qa.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
