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
  Dashboard,
  LocalShipping,
  AccountBalance,
  Public,
  Assessment,
  Speed,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface ModuleMetric {
  module: string;
  metric: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface CountryTradeVolume {
  country: string;
  flag: string;
  imports_usd: number;
  exports_usd: number;
  balance_usd: number;
  yoy_change: number;
}

interface AlertItem {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  module: string;
  time: string;
}

const TOP_METRICS: ModuleMetric[] = [
  { module: 'Trade Volume', metric: 'Monthly Total', value: '$1.24B', change: 12.3, icon: <LocalShipping sx={{ fontSize: 18 }} />, color: '#D4AF37' },
  { module: 'Tax Revenue', metric: 'Collected MTD', value: 'KES 8.7B', change: 8.1, icon: <AccountBalance sx={{ fontSize: 18 }} />, color: '#22C55E' },
  { module: 'Compliance', metric: 'Filing Rate', value: '94.2%', change: 2.4, icon: <Assessment sx={{ fontSize: 18 }} />, color: '#3B82F6' },
  { module: 'Processing', metric: 'Avg Clearance', value: '2.3 days', change: -15.2, icon: <Speed sx={{ fontSize: 18 }} />, color: '#8B5CF6' },
];

const COUNTRY_VOLUMES: CountryTradeVolume[] = [
  { country: 'Kenya', flag: '🇰🇪', imports_usd: 412_000_000, exports_usd: 289_000_000, balance_usd: -123_000_000, yoy_change: 14.2 },
  { country: 'Tanzania', flag: '🇹🇿', imports_usd: 287_000_000, exports_usd: 198_000_000, balance_usd: -89_000_000, yoy_change: 9.8 },
  { country: 'Uganda', flag: '🇺🇬', imports_usd: 156_000_000, exports_usd: 112_000_000, balance_usd: -44_000_000, yoy_change: 7.3 },
  { country: 'Ethiopia', flag: '🇪🇹', imports_usd: 198_000_000, exports_usd: 156_000_000, balance_usd: -42_000_000, yoy_change: 18.9 },
  { country: 'Rwanda', flag: '🇷🇼', imports_usd: 89_000_000, exports_usd: 67_000_000, balance_usd: -22_000_000, yoy_change: 22.1 },
  { country: 'DRC', flag: '🇨🇩', imports_usd: 145_000_000, exports_usd: 234_000_000, balance_usd: 89_000_000, yoy_change: 11.5 },
];

const ALERTS: AlertItem[] = [
  { id: 'a1', severity: 'critical', message: 'Tax collection 12% below target for Mombasa port zone', module: 'Tax', time: '15m ago' },
  { id: 'a2', severity: 'warning', message: 'Customs clearance backlog: 47 containers pending > 5 days', module: 'Customs', time: '1h ago' },
  { id: 'a3', severity: 'info', message: 'New AfCFTA tariff schedule effective March 1, 2026', module: 'Trade', time: '2h ago' },
  { id: 'a4', severity: 'warning', message: 'FX settlement delays detected: KES/USD pair avg 8h vs 3h SLA', module: 'Payments', time: '3h ago' },
  { id: 'a5', severity: 'info', message: 'Insurance claims surge: 23% increase in marine cargo claims', module: 'Insurance', time: '4h ago' },
];

const MODULE_HEALTH = [
  { name: 'Trade Documents', uptime: 99.8, txns: '12,847', status: 'healthy' },
  { name: 'Tax & Duties', uptime: 99.5, txns: '3,421', status: 'healthy' },
  { name: 'Payments', uptime: 98.9, txns: '8,234', status: 'degraded' },
  { name: 'Supply Chain', uptime: 99.7, txns: '5,612', status: 'healthy' },
  { name: 'Customs', uptime: 99.2, txns: '2,187', status: 'healthy' },
  { name: 'Insurance', uptime: 99.9, txns: '1,342', status: 'healthy' },
  { name: 'Ledger', uptime: 99.6, txns: '18,923', status: 'healthy' },
];

function formatUSD(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(0)}M`;
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(0)}K`;
  return `${sign}$${abs.toLocaleString()}`;
}

const SEVERITY_CONFIG = {
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  warning: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
  info: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AnalyticsDashboardPage() {
  const totalTrade = useMemo(() => COUNTRY_VOLUMES.reduce((s, c) => s + c.imports_usd + c.exports_usd, 0), []);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Dashboard sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Government Analytics</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Real-time trade intelligence, revenue monitoring, and cross-border analytics for East Africa.
        </Typography>
      </Box>

      {/* Top KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {TOP_METRICS.map((m) => (
          <Grid size={{ xs: 6, md: 3 }} key={m.module}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <Box sx={{ color: m.color }}>{m.icon}</Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{m.module}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: m.color }}>{m.value}</Typography>
              <Typography sx={{ fontSize: 11, color: m.change > 0 ? '#22C55E' : '#EF4444' }}>
                {m.change > 0 ? '+' : ''}{m.change}% vs last month
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Country Trade Volumes */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>
                <Public sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Country Trade Volumes (MTD)
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#555' }}>Total: {formatUSD(totalTrade)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {COUNTRY_VOLUMES.map((c) => (
                <Box key={c.country} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: 16 }}>{c.flag}</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{c.country}</Typography>
                      <Chip label={`+${c.yoy_change}% YoY`} size="small" sx={{ fontSize: 9, height: 16, color: '#22C55E', backgroundColor: 'rgba(34,197,94,0.08)' }} />
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: c.balance_usd >= 0 ? '#22C55E' : '#EF4444', fontFamily: 'monospace' }}>
                      {c.balance_usd >= 0 ? '+' : ''}{formatUSD(c.balance_usd)}
                    </Typography>
                  </Box>
                  <Grid container spacing={1.5}>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Imports</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{formatUSD(c.imports_usd)}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Exports</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{formatUSD(c.exports_usd)}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Balance</Typography>
                      <Typography sx={{ fontSize: 12, color: c.balance_usd >= 0 ? '#22C55E' : '#EF4444', fontFamily: 'monospace' }}>
                        {c.balance_usd >= 0 ? '+' : ''}{formatUSD(c.balance_usd)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Alerts + Module Health */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Alerts */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Active Alerts</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {ALERTS.map((a) => {
                  const sc = SEVERITY_CONFIG[a.severity];
                  return (
                    <Box key={a.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 1.5, borderRadius: 1, backgroundColor: sc.bg }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: sc.color, mt: 0.75, flexShrink: 0 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 12, color: '#e0e0e0', lineHeight: 1.4 }}>{a.message}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip label={a.module} size="small" sx={{ fontSize: 9, height: 14, color: '#888', backgroundColor: 'rgba(212,175,55,0.06)' }} />
                          <Typography sx={{ fontSize: 10, color: '#555' }}>{a.time}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Card>

            {/* Module Health */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Module Health</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {MODULE_HEALTH.map((m) => (
                  <Box key={m.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: m.status === 'healthy' ? '#22C55E' : '#E6A817', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 12, color: '#e0e0e0', flex: 1 }}>{m.name}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#777', fontFamily: 'monospace', width: 50, textAlign: 'right' }}>{m.uptime}%</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={m.uptime}
                      sx={{
                        width: 60, height: 4, borderRadius: 2,
                        backgroundColor: 'rgba(212,175,55,0.08)',
                        '& .MuiLinearProgress-bar': { backgroundColor: m.uptime >= 99.5 ? '#22C55E' : '#E6A817', borderRadius: 2 },
                      }}
                    />
                    <Typography sx={{ fontSize: 10, color: '#555', width: 50, textAlign: 'right' }}>{m.txns} txns</Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
