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
  Warning,
  Shield,
  GppBad,
  GppGood,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface RiskIndicator {
  id: string;
  category: string;
  description: string;
  current_value: number;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'deteriorating';
}

const RISK_INDICATORS: RiskIndicator[] = [
  { id: 'ri-001', category: 'Credit Risk', description: 'Portfolio Non-Performing Loan Ratio', current_value: 2.3, threshold: 5.0, status: 'normal', trend: 'improving' },
  { id: 'ri-002', category: 'Credit Risk', description: 'Concentration Risk — Top 5 Borrowers', current_value: 42, threshold: 40, status: 'warning', trend: 'deteriorating' },
  { id: 'ri-003', category: 'Market Risk', description: 'FX Exposure (Open Position)', current_value: 8.5, threshold: 15, status: 'normal', trend: 'stable' },
  { id: 'ri-004', category: 'Market Risk', description: 'Interest Rate Sensitivity (DV01)', current_value: 120000, threshold: 200000, status: 'normal', trend: 'stable' },
  { id: 'ri-005', category: 'Operational Risk', description: 'Failed Settlements (Last 30d)', current_value: 3, threshold: 5, status: 'normal', trend: 'improving' },
  { id: 'ri-006', category: 'Operational Risk', description: 'Document Processing Backlog', current_value: 18, threshold: 10, status: 'critical', trend: 'deteriorating' },
  { id: 'ri-007', category: 'Compliance Risk', description: 'KYC/AML Alert Rate', current_value: 1.8, threshold: 3.0, status: 'normal', trend: 'stable' },
  { id: 'ri-008', category: 'Compliance Risk', description: 'Overdue Regulatory Reports', current_value: 0, threshold: 1, status: 'normal', trend: 'stable' },
  { id: 'ri-009', category: 'Country Risk', description: 'High-Risk Country Exposure', current_value: 15, threshold: 20, status: 'warning', trend: 'deteriorating' },
  { id: 'ri-010', category: 'Liquidity Risk', description: 'Trade Finance Liquidity Ratio', current_value: 125, threshold: 100, status: 'normal', trend: 'improving' },
];

interface RiskEvent {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  category: string;
  timestamp: string;
  resolved: boolean;
}

const RISK_EVENTS: RiskEvent[] = [
  { id: 're-001', severity: 'high', title: 'Document Processing Backlog Exceeded', description: '18 trade documents pending processing, exceeding threshold of 10', category: 'Operational', timestamp: '2026-02-22 14:00', resolved: false },
  { id: 're-002', severity: 'medium', title: 'Concentration Risk Alert', description: 'Top 5 borrower exposure at 42%, above 40% limit', category: 'Credit', timestamp: '2026-02-22 10:30', resolved: false },
  { id: 're-003', severity: 'medium', title: 'High-Risk Country Exposure Rising', description: 'Exposure to high-risk jurisdictions trending upward', category: 'Country', timestamp: '2026-02-21 16:00', resolved: false },
  { id: 're-004', severity: 'low', title: 'FX Settlement Failure', description: 'KES/ETB settlement failed due to counterparty timeout', category: 'Operational', timestamp: '2026-02-21 11:50', resolved: true },
  { id: 're-005', severity: 'low', title: 'New KYC Review Required', description: 'Annual KYC review due for Cairo Trade House', category: 'Compliance', timestamp: '2026-02-20 09:00', resolved: false },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  normal: { label: 'Normal', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  warning: { label: 'Warning', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  critical: { label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const TREND_CONFIG: Record<string, { label: string; color: string }> = {
  improving: { label: 'Improving', color: '#22C55E' },
  stable: { label: 'Stable', color: '#3B82F6' },
  deteriorating: { label: 'Worsening', color: '#EF4444' },
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Warning }> = {
  high: { label: 'High', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: GppBad },
  medium: { label: 'Medium', color: '#E6A817', bg: 'rgba(230,168,23,0.1)', icon: Warning },
  low: { label: 'Low', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', icon: Shield },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RiskAssessmentPage() {
  const normalCount = RISK_INDICATORS.filter((r) => r.status === 'normal').length;
  const warningCount = RISK_INDICATORS.filter((r) => r.status === 'warning').length;
  const criticalCount = RISK_INDICATORS.filter((r) => r.status === 'critical').length;
  const overallScore = ((normalCount / RISK_INDICATORS.length) * 100).toFixed(0);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(RISK_INDICATORS.map((r) => r.category)));
    return cats.map((cat) => ({
      category: cat,
      indicators: RISK_INDICATORS.filter((r) => r.category === cat),
    }));
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Security sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Risk Assessment</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Comprehensive trade and financial risk monitoring dashboard.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Risk Score', value: `${overallScore}%`, color: Number(overallScore) >= 80 ? '#22C55E' : '#E6A817' },
          { label: 'Normal', value: normalCount.toString(), color: '#22C55E', icon: <GppGood sx={{ fontSize: 18, color: '#22C55E' }} /> },
          { label: 'Warnings', value: warningCount.toString(), color: '#E6A817', icon: <Warning sx={{ fontSize: 18, color: '#E6A817' }} /> },
          { label: 'Critical', value: criticalCount.toString(), color: '#EF4444', icon: <GppBad sx={{ fontSize: 18, color: '#EF4444' }} /> },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {'icon' in s && s.icon}
                <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Risk Indicators by Category */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {categories.map(({ category, indicators }) => (
              <Card key={category} sx={{ p: 2.5 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>{category}</Typography>
                {indicators.map((ind, j) => {
                  const sts = STATUS_CONFIG[ind.status];
                  const trend = TREND_CONFIG[ind.trend];
                  const pctOfThreshold = Math.min((ind.current_value / ind.threshold) * 100, 100);
                  return (
                    <Box key={ind.id} sx={{ mb: j < indicators.length - 1 ? 2 : 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{ind.description}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={trend.label} size="small" variant="outlined" sx={{ fontSize: 9, height: 18, borderColor: `${trend.color}40`, color: trend.color }} />
                          <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: sts.bg, color: sts.color }} />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={pctOfThreshold}
                            sx={{
                              height: 6, borderRadius: 3,
                              backgroundColor: 'rgba(212,175,55,0.06)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: sts.color,
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: sts.color, minWidth: 80, textAlign: 'right' }}>
                          {typeof ind.current_value === 'number' && ind.current_value >= 1000
                            ? `${(ind.current_value / 1000).toFixed(0)}K`
                            : ind.current_value}
                          {ind.threshold < 1000 ? ` / ${ind.threshold}` : ` / ${(ind.threshold / 1000).toFixed(0)}K`}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Risk Events */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              Recent Risk Events
            </Typography>
            {RISK_EVENTS.map((e) => {
              const sev = SEVERITY_CONFIG[e.severity];
              const Icon = sev.icon;
              return (
                <Box key={e.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                    <Icon sx={{ fontSize: 18, color: sev.color, mt: 0.25 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{e.title}</Typography>
                        {e.resolved && <Chip label="Resolved" size="small" sx={{ fontSize: 9, height: 16, backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E' }} />}
                      </Box>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0', lineHeight: 1.5, mb: 0.5 }}>{e.description}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label={e.category} size="small" sx={{ fontSize: 9, height: 16, backgroundColor: 'rgba(212,175,55,0.06)', color: '#999' }} />
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{e.timestamp}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
