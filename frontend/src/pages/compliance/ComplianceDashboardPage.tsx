import { useState } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  Warning,
  CheckCircle,
  Schedule,
  TrendingUp,
  Business,
  GppBad,
  Shield,
} from '@mui/icons-material';

// ─── Shared compliance mock data ─────────────────────────────────────────────

export interface ScreenedEntity {
  id: string;
  name: string;
  type: 'trader' | 'bank' | 'logistics' | 'insurance' | 'government';
  country: string;
  countryFlag: string;
  countryRisk: 'low' | 'medium' | 'high';
  riskScore: number;
  riskTier: 'low' | 'medium' | 'high' | 'critical';
  status: 'cleared' | 'flagged' | 'under_review' | 'blocked' | 'pending';
  lastScreened: string;
  nextReview: string;
  directorCount: number;
  pepMatches: number;
  sanctionHits: number;
  adverseMedia: number;
  industry: string;
}

export const SCREENED_ENTITIES: ScreenedEntity[] = [
  { id: 'ent-001', name: 'Nairobi Exports Ltd', type: 'trader', country: 'Kenya', countryFlag: '🇰🇪', countryRisk: 'low', riskScore: 22, riskTier: 'low', status: 'cleared', lastScreened: '2026-02-18', nextReview: '2026-08-18', directorCount: 3, pepMatches: 0, sanctionHits: 0, adverseMedia: 0, industry: 'Agricultural Exports' },
  { id: 'ent-002', name: 'Lagos Trading Co', type: 'trader', country: 'Nigeria', countryFlag: '🇳🇬', countryRisk: 'medium', riskScore: 45, riskTier: 'medium', status: 'flagged', lastScreened: '2026-02-15', nextReview: '2026-05-15', directorCount: 4, pepMatches: 1, sanctionHits: 0, adverseMedia: 2, industry: 'General Trading' },
  { id: 'ent-003', name: 'Cairo Trade House', type: 'trader', country: 'Egypt', countryFlag: '🇪🇬', countryRisk: 'medium', riskScore: 72, riskTier: 'high', status: 'under_review', lastScreened: '2026-02-10', nextReview: '2026-04-10', directorCount: 3, pepMatches: 2, sanctionHits: 1, adverseMedia: 4, industry: 'Import/Export' },
  { id: 'ent-004', name: 'Kampala Imports Inc', type: 'trader', country: 'Uganda', countryFlag: '🇺🇬', countryRisk: 'low', riskScore: 18, riskTier: 'low', status: 'cleared', lastScreened: '2026-02-20', nextReview: '2026-08-20', directorCount: 2, pepMatches: 0, sanctionHits: 0, adverseMedia: 0, industry: 'Consumer Goods' },
  { id: 'ent-005', name: 'Dar es Salaam Freight', type: 'logistics', country: 'Tanzania', countryFlag: '🇹🇿', countryRisk: 'low', riskScore: 38, riskTier: 'medium', status: 'cleared', lastScreened: '2026-01-28', nextReview: '2026-07-28', directorCount: 3, pepMatches: 0, sanctionHits: 0, adverseMedia: 1, industry: 'Freight & Logistics' },
  { id: 'ent-006', name: 'Accra Commodities Ltd', type: 'trader', country: 'Ghana', countryFlag: '🇬🇭', countryRisk: 'low', riskScore: 25, riskTier: 'low', status: 'cleared', lastScreened: '2026-02-12', nextReview: '2026-08-12', directorCount: 2, pepMatches: 0, sanctionHits: 0, adverseMedia: 0, industry: 'Commodities' },
  { id: 'ent-007', name: 'Auto Kenya Ltd', type: 'trader', country: 'Kenya', countryFlag: '🇰🇪', countryRisk: 'low', riskScore: 85, riskTier: 'critical', status: 'blocked', lastScreened: '2026-02-22', nextReview: '—', directorCount: 4, pepMatches: 1, sanctionHits: 2, adverseMedia: 6, industry: 'Automotive' },
  { id: 'ent-008', name: 'East Africa Cement Ltd', type: 'trader', country: 'Kenya', countryFlag: '🇰🇪', countryRisk: 'low', riskScore: 42, riskTier: 'medium', status: 'under_review', lastScreened: '2026-02-05', nextReview: '2026-05-05', directorCount: 5, pepMatches: 0, sanctionHits: 0, adverseMedia: 1, industry: 'Construction Materials' },
  { id: 'ent-009', name: 'KCB Bank', type: 'bank', country: 'Kenya', countryFlag: '🇰🇪', countryRisk: 'low', riskScore: 12, riskTier: 'low', status: 'cleared', lastScreened: '2026-02-01', nextReview: '2026-08-01', directorCount: 8, pepMatches: 0, sanctionHits: 0, adverseMedia: 0, industry: 'Banking' },
  { id: 'ent-010', name: 'APA Insurance', type: 'insurance', country: 'Kenya', countryFlag: '🇰🇪', countryRisk: 'low', riskScore: 15, riskTier: 'low', status: 'cleared', lastScreened: '2026-01-20', nextReview: '2026-07-20', directorCount: 6, pepMatches: 0, sanctionHits: 0, adverseMedia: 0, industry: 'Insurance' },
  { id: 'ent-011', name: 'Addis Pharmaceutical', type: 'trader', country: 'Ethiopia', countryFlag: '🇪🇹', countryRisk: 'medium', riskScore: 35, riskTier: 'medium', status: 'cleared', lastScreened: '2026-02-08', nextReview: '2026-08-08', directorCount: 3, pepMatches: 0, sanctionHits: 0, adverseMedia: 0, industry: 'Pharmaceuticals' },
  { id: 'ent-012', name: 'Bolloré Logistics Kenya', type: 'logistics', country: 'Kenya', countryFlag: '🇰🇪', countryRisk: 'low', riskScore: 10, riskTier: 'low', status: 'cleared', lastScreened: '2026-01-15', nextReview: '2026-07-15', directorCount: 4, pepMatches: 0, sanctionHits: 0, adverseMedia: 0, industry: 'Logistics' },
];

export const RISK_TIER_CONFIG: Record<string, { label: string; color: string; bg: string; range: string }> = {
  low: { label: 'Low', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', range: '0–25' },
  medium: { label: 'Medium', color: '#E6A817', bg: 'rgba(230,168,23,0.1)', range: '26–50' },
  high: { label: 'High', color: '#F97316', bg: 'rgba(249,115,22,0.1)', range: '51–75' },
  critical: { label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', range: '76–100' },
};

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  cleared: { label: 'Cleared', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  flagged: { label: 'Flagged', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  under_review: { label: 'Under Review', color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
  blocked: { label: 'Blocked', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  pending: { label: 'Pending', color: '#999', bg: 'rgba(153,153,153,0.1)' },
};

// ─── Recent screening activity ──────────────────────────────────────────────

interface RecentActivity {
  id: string;
  entity: string;
  action: string;
  result: 'clear' | 'flagged' | 'blocked' | 'info';
  date: string;
  officer: string;
}

const RECENT_ACTIVITY: RecentActivity[] = [
  { id: 'act-1', entity: 'Auto Kenya Ltd', action: 'OFAC match confirmed — entity blocked', result: 'blocked', date: '2026-02-22', officer: 'Wanjiku Karanja' },
  { id: 'act-2', entity: 'Cairo Trade House', action: 'Adverse media flagged — escalated to senior review', result: 'flagged', date: '2026-02-20', officer: 'Wanjiku Karanja' },
  { id: 'act-3', entity: 'Nairobi Exports Ltd', action: 'Periodic re-screening complete — all clear', result: 'clear', date: '2026-02-18', officer: 'Wanjiku Karanja' },
  { id: 'act-4', entity: 'Lagos Trading Co', action: 'Director PEP-2 match (Gov. Obasanjo) — under review', result: 'flagged', date: '2026-02-15', officer: 'Wanjiku Karanja' },
  { id: 'act-5', entity: 'Accra Commodities Ltd', action: 'Initial onboarding screening — cleared', result: 'clear', date: '2026-02-12', officer: 'Wanjiku Karanja' },
  { id: 'act-6', entity: 'East Africa Cement Ltd', action: 'Complex ownership structure flagged for review', result: 'flagged', date: '2026-02-05', officer: 'Wanjiku Karanja' },
  { id: 'act-7', entity: 'KCB Bank', action: 'Annual institutional re-screening — all clear', result: 'clear', date: '2026-02-01', officer: 'Wanjiku Karanja' },
];

const ACTIVITY_COLORS: Record<string, string> = {
  clear: '#22C55E',
  flagged: '#E6A817',
  blocked: '#EF4444',
  info: '#3B82F6',
};

// ─── Upcoming reviews ────────────────────────────────────────────────────────

interface UpcomingReview {
  entity: string;
  dueDate: string;
  daysLeft: number;
  riskTier: string;
}

const UPCOMING_REVIEWS: UpcomingReview[] = [
  { entity: 'Cairo Trade House', dueDate: '2026-04-10', daysLeft: 46, riskTier: 'high' },
  { entity: 'East Africa Cement Ltd', dueDate: '2026-05-05', daysLeft: 71, riskTier: 'medium' },
  { entity: 'Lagos Trading Co', dueDate: '2026-05-15', daysLeft: 81, riskTier: 'medium' },
  { entity: 'Dar es Salaam Freight', dueDate: '2026-07-28', daysLeft: 155, riskTier: 'medium' },
];

// ─── Global alerts ───────────────────────────────────────────────────────────

interface GlobalAlert {
  id: string;
  source: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  date: string;
}

const GLOBAL_ALERTS: GlobalAlert[] = [
  { id: 'ga-1', source: 'FATF', message: 'Myanmar added to FATF blacklist — all entities with Myanmar exposure require immediate re-screening', severity: 'critical', date: '2026-02-21' },
  { id: 'ga-2', source: 'UN Sanctions', message: 'New additions to UN Security Council consolidated list — 14 individuals, 3 entities', severity: 'warning', date: '2026-02-19' },
  { id: 'ga-3', source: 'OFAC', message: 'SDN list update — 8 new designations (Africa region)', severity: 'warning', date: '2026-02-17' },
  { id: 'ga-4', source: 'Kenya FRC', message: 'Updated ML/TF typologies for trade-based money laundering published', severity: 'info', date: '2026-02-14' },
];

const ALERT_CONFIG: Record<string, { color: string; bg: string }> = {
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  warning: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
  info: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ComplianceDashboardPage() {
  const [activityFilter, setActivityFilter] = useState('all');

  const totalEntities = SCREENED_ENTITIES.length;
  const clearedCount = SCREENED_ENTITIES.filter((e) => e.status === 'cleared').length;
  const flaggedCount = SCREENED_ENTITIES.filter((e) => ['flagged', 'under_review'].includes(e.status)).length;
  const blockedCount = SCREENED_ENTITIES.filter((e) => e.status === 'blocked').length;
  const avgRisk = Math.round(SCREENED_ENTITIES.reduce((s, e) => s + e.riskScore, 0) / totalEntities);

  const riskDistribution = {
    low: SCREENED_ENTITIES.filter((e) => e.riskTier === 'low').length,
    medium: SCREENED_ENTITIES.filter((e) => e.riskTier === 'medium').length,
    high: SCREENED_ENTITIES.filter((e) => e.riskTier === 'high').length,
    critical: SCREENED_ENTITIES.filter((e) => e.riskTier === 'critical').length,
  };

  const filteredActivity = activityFilter === 'all'
    ? RECENT_ACTIVITY
    : RECENT_ACTIVITY.filter((a) => a.result === activityFilter);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Dashboard sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Compliance Dashboard</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          KYC/AML screening overview — entity risk monitoring, watchlist alerts, and compliance activity.
        </Typography>
      </Box>

      {/* ── KPI Stats ──────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Screened', value: totalEntities.toString(), icon: Business, color: '#D4AF37' },
          { label: 'Cleared', value: clearedCount.toString(), icon: CheckCircle, color: '#22C55E' },
          { label: 'Flagged / Review', value: flaggedCount.toString(), icon: Warning, color: '#E6A817' },
          { label: 'Blocked', value: blockedCount.toString(), icon: GppBad, color: '#EF4444' },
          { label: 'Avg Risk Score', value: avgRisk.toString(), icon: Shield, color: avgRisk < 30 ? '#22C55E' : avgRisk < 50 ? '#E6A817' : '#F97316' },
          { label: 'PEP Matches', value: SCREENED_ENTITIES.reduce((s, e) => s + e.pepMatches, 0).toString(), icon: TrendingUp, color: '#8B5CF6' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Grid size={{ xs: 6, md: 2 }} key={s.label}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{s.label}</Typography>
                  <Icon sx={{ fontSize: 16, color: s.color, opacity: 0.7 }} />
                </Box>
                <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>
                  {s.value}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        {/* ── Risk Distribution ──────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Risk Distribution</Typography>
            {(['low', 'medium', 'high', 'critical'] as const).map((tier) => {
              const cfg = RISK_TIER_CONFIG[tier];
              const count = riskDistribution[tier];
              const pct = ((count / totalEntities) * 100).toFixed(0);
              return (
                <Box key={tier} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={cfg.label} size="small" sx={{ fontSize: 10, height: 20, color: cfg.color, backgroundColor: cfg.bg }} />
                      <Typography sx={{ fontSize: 11, color: '#777' }}>{cfg.range}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: cfg.color }}>{count}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Number(pct)}
                    sx={{
                      height: 6, borderRadius: 3,
                      backgroundColor: `${cfg.color}15`,
                      '& .MuiLinearProgress-bar': { backgroundColor: cfg.color, borderRadius: 3 },
                    }}
                  />
                </Box>
              );
            })}
            <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
              <Typography sx={{ fontSize: 11, color: '#555' }}>
                Portfolio avg. risk score: <span style={{ color: '#D4AF37', fontWeight: 700 }}>{avgRisk}/100</span>
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* ── Recent Activity ─────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Recent Screening Activity</Typography>
              <TextField
                select size="small" value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                sx={{ width: 140 }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="clear">Cleared</MenuItem>
                <MenuItem value="flagged">Flagged</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {filteredActivity.map((a) => (
                <Box
                  key={a.id}
                  sx={{
                    display: 'flex', alignItems: 'flex-start', gap: 1.5,
                    p: 1.5, borderRadius: 1,
                    backgroundColor: 'rgba(212,175,55,0.02)',
                    borderLeft: `3px solid ${ACTIVITY_COLORS[a.result]}`,
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: ACTIVITY_COLORS[a.result], mt: 0.75, flexShrink: 0 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{a.entity}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{a.action}</Typography>
                    <Typography sx={{ fontSize: 10, color: '#555', mt: 0.25 }}>{a.date} — {a.officer}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* ── Global Alerts ────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Global Watchlist Alerts</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {GLOBAL_ALERTS.map((a) => {
                const cfg = ALERT_CONFIG[a.severity];
                return (
                  <Box
                    key={a.id}
                    sx={{
                      p: 1.5, borderRadius: 1,
                      backgroundColor: cfg.bg,
                      border: `1px solid ${cfg.color}20`,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Chip label={a.source} size="small" sx={{ fontSize: 10, height: 18, color: cfg.color, backgroundColor: `${cfg.color}20` }} />
                      <Typography sx={{ fontSize: 10, color: '#555' }}>{a.date}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{a.message}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* ── Upcoming Reviews ──────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Upcoming Review Schedule</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {UPCOMING_REVIEWS.map((r) => {
                const tierCfg = RISK_TIER_CONFIG[r.riskTier];
                return (
                  <Box
                    key={r.entity}
                    sx={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      p: 1.5, borderRadius: 1,
                      backgroundColor: 'rgba(212,175,55,0.02)',
                      borderBottom: '1px solid rgba(212,175,55,0.05)',
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{r.entity}</Typography>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>Due: {r.dueDate}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={tierCfg.label} size="small" sx={{ fontSize: 9, height: 18, color: tierCfg.color, backgroundColor: tierCfg.bg }} />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: r.daysLeft < 60 ? '#E6A817' : '#777' }}>
                          {r.daysLeft}d
                        </Typography>
                        <Schedule sx={{ fontSize: 12, color: '#555' }} />
                      </Box>
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
