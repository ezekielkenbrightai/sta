import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import {
  IntegrationInstructions,
  CheckCircle,
  Cancel,
  Sync,
  Settings,
  VpnKey,
  Webhook,
  AccountBalance,
  Public,
  LocalShipping,
  Payments,
  PhoneAndroid,
  Security,
  ContentCopy,
  Visibility,
  VisibilityOff,
  Add,
} from '@mui/icons-material';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  healthScore: number;
  category: 'government' | 'financial' | 'logistics' | 'trade';
  version: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  environment: 'production' | 'staging' | 'development';
  createdDate: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

interface WebhookConfig {
  id: string;
  event: string;
  url: string;
  status: 'active' | 'inactive' | 'failing';
  successRate: number;
  lastTriggered: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const INTEGRATIONS: Integration[] = [
  { id: 'i1', name: 'Kenya Revenue Authority (KRA)', description: 'Tax assessment, duty calculation, and compliance reporting', icon: <AccountBalance sx={{ fontSize: 20 }} />, status: 'connected', lastSync: '2m ago', healthScore: 99.2, category: 'government', version: 'v3.1' },
  { id: 'i2', name: 'Central Bank of Kenya', description: 'FX rates, monetary policy data, and RTGS settlement', icon: <AccountBalance sx={{ fontSize: 20 }} />, status: 'connected', lastSync: '5m ago', healthScore: 99.8, category: 'financial', version: 'v2.4' },
  { id: 'i3', name: 'Kenya Ports Authority', description: 'Port activity, cargo manifests, and vessel tracking', icon: <LocalShipping sx={{ fontSize: 20 }} />, status: 'connected', lastSync: '12m ago', healthScore: 97.5, category: 'logistics', version: 'v1.8' },
  { id: 'i4', name: 'AfCFTA Hub', description: 'Continental free trade area tariff schedules and rules of origin', icon: <Public sx={{ fontSize: 20 }} />, status: 'connected', lastSync: '1h ago', healthScore: 95.3, category: 'trade', version: 'v1.2' },
  { id: 'i5', name: 'SWIFT Network', description: 'International payment messaging and bank-to-bank settlement', icon: <Payments sx={{ fontSize: 20 }} />, status: 'connected', lastSync: '30s ago', healthScore: 99.9, category: 'financial', version: 'v4.0' },
  { id: 'i6', name: 'M-Pesa (Safaricom)', description: 'Mobile money payments, collections, and disbursements', icon: <PhoneAndroid sx={{ fontSize: 20 }} />, status: 'connected', lastSync: '1m ago', healthScore: 98.7, category: 'financial', version: 'v2.0' },
  { id: 'i7', name: 'Tanzania Revenue Authority', description: 'Cross-border tax data exchange and harmonized clearance', icon: <AccountBalance sx={{ fontSize: 20 }} />, status: 'connected', lastSync: '15m ago', healthScore: 94.1, category: 'government', version: 'v2.1' },
  { id: 'i8', name: 'Uganda Revenue Authority', description: 'EAC single customs territory integration', icon: <AccountBalance sx={{ fontSize: 20 }} />, status: 'error', lastSync: '4h ago', healthScore: 67.2, category: 'government', version: 'v1.5' },
  { id: 'i9', name: 'Rwanda Revenue Authority', description: 'Electronic single window trade facilitation', icon: <AccountBalance sx={{ fontSize: 20 }} />, status: 'connected', lastSync: '25m ago', healthScore: 96.8, category: 'government', version: 'v2.0' },
  { id: 'i10', name: 'COMESA Trade Portal', description: 'Regional trade statistics and market intelligence', icon: <Public sx={{ fontSize: 20 }} />, status: 'disconnected', lastSync: 'Never', healthScore: 0, category: 'trade', version: 'v1.0' },
];

const API_KEYS: ApiKey[] = [
  { id: 'ak1', name: 'KRA Production Key', key: 'sta_prod_kra_8f7e...d4a1', environment: 'production', createdDate: '2024-01-15', lastUsed: '2m ago', status: 'active' },
  { id: 'ak2', name: 'SWIFT Gateway Key', key: 'sta_prod_swift_2c9b...f8e3', environment: 'production', createdDate: '2024-02-01', lastUsed: '30s ago', status: 'active' },
  { id: 'ak3', name: 'M-Pesa API Key', key: 'sta_prod_mpesa_a1d3...7b2c', environment: 'production', createdDate: '2024-03-10', lastUsed: '1m ago', status: 'active' },
  { id: 'ak4', name: 'Staging All-Purpose Key', key: 'sta_stg_all_e4f2...9c8d', environment: 'staging', createdDate: '2024-01-15', lastUsed: '3h ago', status: 'active' },
  { id: 'ak5', name: 'Legacy KRA Import Key', key: 'sta_prod_kra_old_7b1a...3e4f', environment: 'production', createdDate: '2023-06-01', lastUsed: '30d ago', status: 'revoked' },
];

const WEBHOOKS: WebhookConfig[] = [
  { id: 'wh1', event: 'trade.document.created', url: 'https://kra.go.ke/api/hooks/sta-trade', status: 'active', successRate: 99.8, lastTriggered: '5m ago' },
  { id: 'wh2', event: 'payment.completed', url: 'https://payments.kcb.co.ke/webhooks/sta', status: 'active', successRate: 99.2, lastTriggered: '12m ago' },
  { id: 'wh3', event: 'customs.clearance.approved', url: 'https://kpa.go.ke/api/notifications', status: 'active', successRate: 97.5, lastTriggered: '1h ago' },
  { id: 'wh4', event: 'tax.assessment.completed', url: 'https://kra.go.ke/api/hooks/sta-tax', status: 'active', successRate: 98.9, lastTriggered: '30m ago' },
  { id: 'wh5', event: 'fx.rate.updated', url: 'https://analytics.sta.africa/webhooks/fx', status: 'failing', successRate: 45.3, lastTriggered: '2h ago' },
];

const STATUS_CONFIG = {
  connected: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
  disconnected: { color: '#777', bg: 'rgba(119,119,119,0.08)', icon: <Cancel sx={{ fontSize: 14 }} /> },
  error: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', icon: <Cancel sx={{ fontSize: 14 }} /> },
};

const ENV_COLORS = {
  production: '#22C55E',
  staging: '#E6A817',
  development: '#3B82F6',
};

const WEBHOOK_STATUS_CONFIG = {
  active: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  inactive: { color: '#777', bg: 'rgba(119,119,119,0.08)' },
  failing: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IntegrationSettingsPage() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const connectedCount = INTEGRATIONS.filter((i) => i.status === 'connected').length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <IntegrationInstructions sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Integration Settings</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Manage external system integrations, API keys, and webhook configurations for the platform.
        </Typography>
      </Box>

      {/* Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>Total Integrations</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#D4AF37' }}>{INTEGRATIONS.length}</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>Connected</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#22C55E' }}>{connectedCount}</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>Active Webhooks</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#3B82F6' }}>{WEBHOOKS.filter((w) => w.status === 'active').length}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Integration Cards */}
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
        <Security sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
        External Integrations
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {INTEGRATIONS.map((intg) => {
          const sc = STATUS_CONFIG[intg.status];
          return (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={intg.id}>
              <Card sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: intg.status === 'connected' ? '#D4AF37' : '#555' }}>{intg.icon}</Box>
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', lineHeight: 1.2 }}>{intg.name}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>{intg.version}</Typography>
                    </Box>
                  </Box>
                  <Chip
                    icon={sc.icon}
                    label={intg.status}
                    size="small"
                    sx={{ fontSize: 9, height: 20, color: sc.color, backgroundColor: sc.bg, textTransform: 'capitalize', '& .MuiChip-icon': { color: sc.color } }}
                  />
                </Box>

                <Typography sx={{ fontSize: 11, color: '#b0b0b0', mb: 2, flex: 1 }}>{intg.description}</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: 10, color: '#555' }}>Last Sync: {intg.lastSync}</Typography>
                    {intg.healthScore > 0 && (
                      <Typography sx={{ fontSize: 10, color: intg.healthScore > 95 ? '#22C55E' : intg.healthScore > 80 ? '#E6A817' : '#EF4444' }}>
                        Health: {intg.healthScore}%
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" sx={{ color: '#555', '&:hover': { color: '#D4AF37' } }}>
                      <Sync sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#555', '&:hover': { color: '#D4AF37' } }}>
                      <Settings sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2}>
        {/* API Key Management */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>
                <VpnKey sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                API Keys
              </Typography>
              <Button
                size="small"
                startIcon={<Add />}
                sx={{ fontSize: 11, color: '#D4AF37', textTransform: 'none' }}
              >
                Generate Key
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {API_KEYS.map((ak) => {
                const ec = ENV_COLORS[ak.environment];
                return (
                  <Box key={ak.id} sx={{
                    p: 1.5, borderRadius: 1,
                    backgroundColor: ak.status === 'revoked' ? 'rgba(239,68,68,0.03)' : 'rgba(212,175,55,0.03)',
                    border: `1px solid ${ak.status === 'revoked' ? 'rgba(239,68,68,0.1)' : 'rgba(212,175,55,0.05)'}`,
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: ak.status === 'revoked' ? '#777' : '#e0e0e0' }}>{ak.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        <Chip
                          label={ak.environment}
                          size="small"
                          sx={{ fontSize: 9, height: 16, color: ec, backgroundColor: `${ec}15`, textTransform: 'capitalize' }}
                        />
                        {ak.status === 'revoked' && (
                          <Chip label="Revoked" size="small" sx={{ fontSize: 9, height: 16, color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)' }} />
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography sx={{ fontSize: 11, color: '#555', fontFamily: 'monospace', flex: 1 }}>
                        {showKeys[ak.id] ? ak.key : '\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}'}
                      </Typography>
                      <IconButton size="small" onClick={() => toggleKey(ak.id)} sx={{ color: '#555', p: 0.25 }}>
                        {showKeys[ak.id] ? <VisibilityOff sx={{ fontSize: 14 }} /> : <Visibility sx={{ fontSize: 14 }} />}
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#555', p: 0.25 }}>
                        <ContentCopy sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                    <Typography sx={{ fontSize: 10, color: '#555' }}>
                      Created: {new Date(ak.createdDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} | Last used: {ak.lastUsed}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Webhook Configuration */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>
                <Webhook sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Webhook Configuration
              </Typography>
              <Button
                size="small"
                startIcon={<Add />}
                sx={{ fontSize: 11, color: '#D4AF37', textTransform: 'none' }}
              >
                Add Webhook
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {WEBHOOKS.map((wh) => {
                const wsc = WEBHOOK_STATUS_CONFIG[wh.status];
                return (
                  <Box key={wh.id} sx={{
                    p: 1.5, borderRadius: 1,
                    backgroundColor: wsc.bg,
                    border: `1px solid ${wsc.color}15`,
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0', fontFamily: 'monospace' }}>{wh.event}</Typography>
                      <Chip
                        label={wh.status}
                        size="small"
                        sx={{ fontSize: 9, height: 16, color: wsc.color, backgroundColor: 'transparent', border: `1px solid ${wsc.color}33`, textTransform: 'capitalize' }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: 10, color: '#555', fontFamily: 'monospace', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {wh.url}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: 10, color: wh.successRate > 90 ? '#22C55E' : '#EF4444' }}>
                        Success: {wh.successRate}%
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>Last triggered: {wh.lastTriggered}</Typography>
                    </Box>
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
