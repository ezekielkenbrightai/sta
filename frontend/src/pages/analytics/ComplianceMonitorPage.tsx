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
  VerifiedUser,
  Warning,
  Gavel,
  AssignmentLate,
  Shield,
  Flag,
  ErrorOutline,
} from '@mui/icons-material';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ComplianceKPI {
  label: string;
  value: string;
  change: number;
  color: string;
  icon: React.ReactNode;
}

interface ComplianceCategory {
  category: string;
  total_checks: number;
  passed: number;
  failed: number;
  rate: number;
  trend: number;
  color: string;
}

interface RedFlagAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  trader: string;
  country: string;
  flag: string;
  description: string;
  violation_type: string;
  detected: string;
  value_usd: number;
}

interface TraderTier {
  tier: string;
  label: string;
  count: number;
  pct: number;
  color: string;
  description: string;
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const COMPLIANCE_CATEGORIES: ComplianceCategory[] = [
  { category: 'Documentation Completeness', total_checks: 12_847, passed: 12_103, failed: 744, rate: 94.2, trend: 2.1, color: '#D4AF37' },
  { category: 'Tariff Classification', total_checks: 8_234, passed: 7_658, failed: 576, rate: 93.0, trend: -0.8, color: '#3B82F6' },
  { category: 'Rules of Origin', total_checks: 6_912, passed: 6_289, failed: 623, rate: 91.0, trend: 3.4, color: '#22C55E' },
  { category: 'Weight & Quantity', total_checks: 5_678, passed: 5_394, failed: 284, rate: 95.0, trend: 1.7, color: '#8B5CF6' },
  { category: 'Valuation Accuracy', total_checks: 4_523, passed: 4_115, failed: 408, rate: 91.0, trend: -1.2, color: '#E6A817' },
  { category: 'Licensing & Permits', total_checks: 3_187, passed: 3_028, failed: 159, rate: 95.0, trend: 4.6, color: '#14B8A6' },
];

const RED_FLAGS: RedFlagAlert[] = [
  { id: 'rf1', severity: 'critical', trader: 'Mombasa Freight Holdings', country: 'Kenya', flag: '🇰🇪', description: 'Systematic under-declaration of cargo weight on 14 consecutive shipments. Estimated duty gap of $340K.', violation_type: 'Weight Fraud', detected: '2h ago', value_usd: 340_000 },
  { id: 'rf2', severity: 'critical', trader: 'Lagos Steel Imports Ltd', country: 'Nigeria', flag: '🇳🇬', description: 'Misclassification of steel alloy products under lower-duty HS codes. Pattern detected across 23 declarations.', violation_type: 'HS Misclassification', detected: '4h ago', value_usd: 512_000 },
  { id: 'rf3', severity: 'high', trader: 'Kampala Auto Parts', country: 'Uganda', flag: '🇺🇬', description: 'Invalid certificate of origin submitted for AfCFTA preferential rate. Source country verification failed.', violation_type: 'Origin Fraud', detected: '6h ago', value_usd: 89_000 },
  { id: 'rf4', severity: 'high', trader: 'Dar Pharma Distributors', country: 'Tanzania', flag: '🇹🇿', description: 'Expired import licenses used for pharmaceutical shipments. 3 consignments flagged at port.', violation_type: 'Licensing', detected: '8h ago', value_usd: 156_000 },
  { id: 'rf5', severity: 'medium', trader: 'Addis Textile Corp', country: 'Ethiopia', flag: '🇪🇹', description: 'Valuation discrepancies: declared invoice values 40% below market reference prices for cotton imports.', violation_type: 'Under-valuation', detected: '12h ago', value_usd: 67_000 },
  { id: 'rf6', severity: 'low', trader: 'Kigali Electronics Hub', country: 'Rwanda', flag: '🇷🇼', description: 'Minor documentation gaps: missing packing list for 2 out of 15 container shipments.', violation_type: 'Documentation', detected: '1d ago', value_usd: 12_000 },
];

const TRADER_TIERS: TraderTier[] = [
  { tier: 'gold', label: 'Gold (AEO)', count: 342, pct: 14.2, color: '#D4AF37', description: 'Authorized Economic Operators with fast-track clearance' },
  { tier: 'silver', label: 'Silver', count: 891, pct: 37.0, color: '#C0C0C0', description: 'Consistently compliant traders with good track record' },
  { tier: 'bronze', label: 'Bronze', count: 823, pct: 34.2, color: '#CD7F32', description: 'Standard compliance level, minor infractions only' },
  { tier: 'flagged', label: 'Flagged', count: 352, pct: 14.6, color: '#EF4444', description: 'Under enhanced scrutiny for repeated violations' },
];

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', label: 'CRITICAL' },
  high: { color: '#F97316', bg: 'rgba(249,115,22,0.08)', label: 'HIGH' },
  medium: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)', label: 'MEDIUM' },
  low: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', label: 'LOW' },
};

function formatUSD(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ComplianceMonitorPage() {
  const overallRate = useMemo(() => {
    const totalChecks = COMPLIANCE_CATEGORIES.reduce((s, c) => s + c.total_checks, 0);
    const totalPassed = COMPLIANCE_CATEGORIES.reduce((s, c) => s + c.passed, 0);
    return ((totalPassed / totalChecks) * 100).toFixed(1);
  }, []);

  const totalViolations = useMemo(() => COMPLIANCE_CATEGORIES.reduce((s, c) => s + c.failed, 0), []);
  const totalPenalties = useMemo(() => RED_FLAGS.reduce((s, f) => s + f.value_usd, 0), []);

  const kpis: ComplianceKPI[] = [
    { label: 'Overall Compliance', value: `${overallRate}%`, change: 1.8, color: '#D4AF37', icon: <VerifiedUser sx={{ fontSize: 18 }} /> },
    { label: 'Violations MTD', value: totalViolations.toLocaleString(), change: -5.3, color: '#EF4444', icon: <Warning sx={{ fontSize: 18 }} /> },
    { label: 'Penalties Collected', value: formatUSD(totalPenalties), change: 12.7, color: '#22C55E', icon: <Gavel sx={{ fontSize: 18 }} /> },
    { label: 'Audit Queue', value: '47', change: 8.2, color: '#8B5CF6', icon: <AssignmentLate sx={{ fontSize: 18 }} /> },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Shield sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Compliance Monitor</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Trade compliance tracking, violation detection, and trader tier monitoring for East African customs.
        </Typography>
      </Box>

      {/* Top KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((k) => (
          <Grid size={{ xs: 6, md: 3 }} key={k.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <Box sx={{ color: k.color }}>{k.icon}</Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{k.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: k.color }}>{k.value}</Typography>
              <Typography sx={{ fontSize: 11, color: k.label === 'Violations MTD' ? (k.change < 0 ? '#22C55E' : '#EF4444') : (k.change > 0 ? '#22C55E' : '#EF4444') }}>
                {k.change > 0 ? '+' : ''}{k.change}% vs last month
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Compliance Breakdown by Category */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <VerifiedUser sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Compliance by Category
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {COMPLIANCE_CATEGORIES.map((c) => (
                  <Box key={c.category} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c.color }} />
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{c.category}</Typography>
                      </Box>
                      <Chip label={`${c.trend > 0 ? '+' : ''}${c.trend}%`} size="small" sx={{ fontSize: 9, height: 16, color: c.trend > 0 ? '#22C55E' : '#EF4444', backgroundColor: c.trend > 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={c.rate}
                        sx={{
                          flex: 1, height: 8, borderRadius: 4,
                          backgroundColor: 'rgba(212,175,55,0.08)',
                          '& .MuiLinearProgress-bar': { backgroundColor: c.rate >= 94 ? '#22C55E' : c.rate >= 90 ? '#E6A817' : '#EF4444', borderRadius: 4 },
                        }}
                      />
                      <Typography sx={{ fontSize: 12, color: '#888', fontFamily: 'monospace', minWidth: 45, textAlign: 'right', fontWeight: 600 }}>{c.rate}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>Checks: <Box component="span" sx={{ color: '#b0b0b0' }}>{c.total_checks.toLocaleString()}</Box></Typography>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>Passed: <Box component="span" sx={{ color: '#22C55E' }}>{c.passed.toLocaleString()}</Box></Typography>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>Failed: <Box component="span" sx={{ color: '#EF4444' }}>{c.failed.toLocaleString()}</Box></Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Trader Compliance Distribution */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Trader Compliance Tiers</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {TRADER_TIERS.map((t) => (
                  <Box key={t.tier} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.03)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: t.color }} />
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: t.color }}>{t.label}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, fontFamily: "'Lora', serif", color: '#f0f0f0' }}>{t.count}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={t.pct}
                        sx={{
                          flex: 1, height: 6, borderRadius: 3,
                          backgroundColor: 'rgba(212,175,55,0.08)',
                          '& .MuiLinearProgress-bar': { backgroundColor: t.color, borderRadius: 3 },
                        }}
                      />
                      <Typography sx={{ fontSize: 10, color: '#777', fontFamily: 'monospace', minWidth: 40, textAlign: 'right' }}>{t.pct}%</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 11, color: '#555' }}>{t.description}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* Red Flag Alerts */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>
                <Flag sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#EF4444' }} />
                Red Flag Alerts
              </Typography>
              <Chip label={`${RED_FLAGS.length} active`} size="small" sx={{ fontSize: 9, height: 18, color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)' }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {RED_FLAGS.map((rf) => {
                const sc = SEVERITY_CONFIG[rf.severity];
                return (
                  <Box key={rf.id} sx={{ p: 1.5, borderRadius: 1, backgroundColor: sc.bg, border: `1px solid ${sc.color}15` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <ErrorOutline sx={{ fontSize: 14, color: sc.color }} />
                        <Chip label={sc.label} size="small" sx={{ fontSize: 8, height: 14, fontWeight: 700, color: sc.color, backgroundColor: 'transparent', border: `1px solid ${sc.color}40` }} />
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{rf.detected}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#EF4444', fontFamily: 'monospace' }}>{formatUSD(rf.value_usd)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                      <Typography sx={{ fontSize: 13 }}>{rf.flag}</Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{rf.trader}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 11, color: '#999', lineHeight: 1.5, mb: 0.5 }}>{rf.description}</Typography>
                    <Chip label={rf.violation_type} size="small" sx={{ fontSize: 9, height: 16, color: '#888', backgroundColor: 'rgba(212,175,55,0.06)' }} />
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
