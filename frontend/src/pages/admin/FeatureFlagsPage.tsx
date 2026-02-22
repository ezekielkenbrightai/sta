import { useState } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Switch,
  Typography,
} from '@mui/material';
import {
  Flag,
  ToggleOn,
  ToggleOff,
  Science,
  Cloud,
  RocketLaunch,
  Person,
} from '@mui/icons-material';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  environments: {
    dev: boolean;
    staging: boolean;
    prod: boolean;
  };
  rolloutPercentage: number;
  lastChanged: string;
  changedBy: string;
  category: 'core' | 'experimental' | 'beta' | 'deprecated';
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'ff1', name: 'cbdc_payments_enabled', description: 'Enable CBDC payment processing and digital currency settlement',
    enabled: false, environments: { dev: true, staging: true, prod: false }, rolloutPercentage: 0,
    lastChanged: '2026-02-18', changedBy: 'admin@sta.africa', category: 'experimental',
  },
  {
    id: 'ff2', name: 'afcfta_tariff_auto_calc', description: 'Automatic AfCFTA preferential tariff calculation on trade documents',
    enabled: true, environments: { dev: true, staging: true, prod: true }, rolloutPercentage: 100,
    lastChanged: '2026-01-15', changedBy: 'admin@sta.africa', category: 'core',
  },
  {
    id: 'ff3', name: 'ai_document_classification', description: 'ML-powered automatic trade document classification and HS code suggestion',
    enabled: true, environments: { dev: true, staging: true, prod: true }, rolloutPercentage: 75,
    lastChanged: '2026-02-10', changedBy: 'admin@sta.africa', category: 'beta',
  },
  {
    id: 'ff4', name: 'realtime_fx_streaming', description: 'WebSocket-based real-time FX rate streaming instead of polling',
    enabled: true, environments: { dev: true, staging: true, prod: true }, rolloutPercentage: 100,
    lastChanged: '2025-11-20', changedBy: 'admin@sta.africa', category: 'core',
  },
  {
    id: 'ff5', name: 'blockchain_verification', description: 'Blockchain-based document verification and immutable audit trail',
    enabled: false, environments: { dev: true, staging: false, prod: false }, rolloutPercentage: 0,
    lastChanged: '2026-02-20', changedBy: 'admin@sta.africa', category: 'experimental',
  },
  {
    id: 'ff6', name: 'multi_currency_ledger', description: 'Support for multi-currency double-entry ledger postings with auto-FX conversion',
    enabled: true, environments: { dev: true, staging: true, prod: true }, rolloutPercentage: 100,
    lastChanged: '2025-09-15', changedBy: 'admin@sta.africa', category: 'core',
  },
  {
    id: 'ff7', name: 'smart_risk_scoring', description: 'AI-powered trade risk scoring for insurance premium calculation',
    enabled: true, environments: { dev: true, staging: true, prod: false }, rolloutPercentage: 50,
    lastChanged: '2026-02-05', changedBy: 'admin@sta.africa', category: 'beta',
  },
  {
    id: 'ff8', name: 'bulk_customs_clearance', description: 'Bulk customs clearance processing for consolidated shipments',
    enabled: true, environments: { dev: true, staging: true, prod: true }, rolloutPercentage: 100,
    lastChanged: '2025-12-01', changedBy: 'govt@kra.go.ke', category: 'core',
  },
  {
    id: 'ff9', name: 'mobile_app_api_v2', description: 'New mobile API endpoints with optimized payload size and caching',
    enabled: false, environments: { dev: true, staging: true, prod: false }, rolloutPercentage: 0,
    lastChanged: '2026-02-22', changedBy: 'admin@sta.africa', category: 'beta',
  },
  {
    id: 'ff10', name: 'legacy_tax_import', description: 'Legacy CSV tax data import format support (deprecated)',
    enabled: true, environments: { dev: true, staging: true, prod: true }, rolloutPercentage: 100,
    lastChanged: '2024-06-15', changedBy: 'admin@sta.africa', category: 'deprecated',
  },
  {
    id: 'ff11', name: 'p2p_invoice_financing', description: 'Peer-to-peer invoice financing marketplace for SME traders',
    enabled: false, environments: { dev: true, staging: false, prod: false }, rolloutPercentage: 0,
    lastChanged: '2026-01-28', changedBy: 'admin@sta.africa', category: 'experimental',
  },
  {
    id: 'ff12', name: 'analytics_data_export_v2', description: 'New analytics data export with Parquet format support and scheduling',
    enabled: true, environments: { dev: true, staging: true, prod: true }, rolloutPercentage: 85,
    lastChanged: '2026-02-12', changedBy: 'admin@sta.africa', category: 'beta',
  },
];

const CATEGORY_CONFIG = {
  core: { color: '#22C55E', icon: <RocketLaunch sx={{ fontSize: 12 }} />, label: 'Core' },
  experimental: { color: '#E6A817', icon: <Science sx={{ fontSize: 12 }} />, label: 'Experimental' },
  beta: { color: '#3B82F6', icon: <Cloud sx={{ fontSize: 12 }} />, label: 'Beta' },
  deprecated: { color: '#777', icon: <ToggleOff sx={{ fontSize: 12 }} />, label: 'Deprecated' },
};

const ENV_CONFIG = {
  dev: { color: '#8B5CF6', label: 'DEV' },
  staging: { color: '#E6A817', label: 'STG' },
  prod: { color: '#22C55E', label: 'PROD' },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState(FEATURE_FLAGS);

  const handleToggle = (flagId: string) => {
    setFlags((prev) => prev.map((f) => f.id === flagId ? { ...f, enabled: !f.enabled } : f));
  };

  const enabledCount = flags.filter((f) => f.enabled).length;
  const experimentalCount = flags.filter((f) => f.category === 'experimental').length;
  const betaCount = flags.filter((f) => f.category === 'beta').length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Flag sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Feature Flags</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Manage feature toggles, rollout percentages, and environment-specific feature availability.
        </Typography>
      </Box>

      {/* Summary KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>Total Flags</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#D4AF37' }}>{flags.length}</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>Enabled</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#22C55E' }}>{enabledCount}</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>Experimental</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#E6A817' }}>{experimentalCount}</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>Beta</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#3B82F6' }}>{betaCount}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Feature Flag Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {flags.map((f) => {
          const cat = CATEGORY_CONFIG[f.category];
          return (
            <Card key={f.id} sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Box sx={{ color: f.enabled ? '#22C55E' : '#555' }}>
                      {f.enabled ? <ToggleOn sx={{ fontSize: 18 }} /> : <ToggleOff sx={{ fontSize: 18 }} />}
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', fontFamily: 'monospace' }}>{f.name}</Typography>
                    <Chip
                      icon={cat.icon}
                      label={cat.label}
                      size="small"
                      sx={{ fontSize: 9, height: 18, color: cat.color, backgroundColor: `${cat.color}15`, '& .MuiChip-icon': { color: cat.color } }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0', mb: 1.5 }}>{f.description}</Typography>

                  <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                    {/* Environments */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>Environments</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {(Object.keys(f.environments) as Array<keyof typeof f.environments>).map((env) => {
                          const ec = ENV_CONFIG[env];
                          const isOn = f.environments[env];
                          return (
                            <Chip
                              key={env}
                              label={ec.label}
                              size="small"
                              sx={{
                                fontSize: 9, height: 18, fontWeight: 700,
                                color: isOn ? ec.color : '#444',
                                backgroundColor: isOn ? `${ec.color}15` : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${isOn ? `${ec.color}33` : 'rgba(255,255,255,0.05)'}`,
                              }}
                            />
                          );
                        })}
                      </Box>
                    </Grid>

                    {/* Rollout */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>Rollout</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={f.rolloutPercentage}
                          sx={{
                            flex: 1, height: 6, borderRadius: 3,
                            backgroundColor: 'rgba(212,175,55,0.08)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: f.rolloutPercentage === 100 ? '#22C55E' : f.rolloutPercentage > 0 ? '#3B82F6' : '#555',
                              borderRadius: 3,
                            },
                          }}
                        />
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: f.rolloutPercentage > 0 ? '#D4AF37' : '#555', fontFamily: "'Lora', serif", minWidth: 32 }}>
                          {f.rolloutPercentage}%
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Last Changed */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>Last Changed</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Person sx={{ fontSize: 12, color: '#555' }} />
                        <Typography sx={{ fontSize: 11, color: '#888' }}>{f.changedBy}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>
                        {new Date(f.lastChanged).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Toggle */}
                <Switch
                  checked={f.enabled}
                  onChange={() => handleToggle(f.id)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' },
                  }}
                />
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
