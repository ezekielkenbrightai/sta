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
  Shield,
  CheckCircle,
  Warning,
  TrendingUp,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface PolicySummary {
  type: string;
  active: number;
  total_coverage_usd: number;
  claims_mtd: number;
  loss_ratio: number;
  color: string;
}

interface RecentClaim {
  id: string;
  policy_ref: string;
  trader: string;
  type: string;
  amount_usd: number;
  status: 'submitted' | 'under_review' | 'approved' | 'denied' | 'paid';
  filed_date: string;
}

const POLICY_SUMMARY: PolicySummary[] = [
  { type: 'Marine Cargo', active: 142, total_coverage_usd: 28500000, claims_mtd: 8, loss_ratio: 12.4, color: '#3B82F6' },
  { type: 'Inland Transit', active: 87, total_coverage_usd: 12200000, claims_mtd: 3, loss_ratio: 8.1, color: '#22C55E' },
  { type: 'Warehouse Stock', active: 34, total_coverage_usd: 45000000, claims_mtd: 1, loss_ratio: 3.2, color: '#8B5CF6' },
  { type: 'Trade Credit', active: 56, total_coverage_usd: 18900000, claims_mtd: 5, loss_ratio: 18.7, color: '#E6A817' },
  { type: 'Political Risk', active: 12, total_coverage_usd: 8500000, claims_mtd: 0, loss_ratio: 0, color: '#EF4444' },
];

const RECENT_CLAIMS: RecentClaim[] = [
  { id: 'clm-001', policy_ref: 'POL-2026-MC-0421', trader: 'Kenya Pharma Distributors', type: 'Marine Cargo', amount_usd: 45000, status: 'under_review', filed_date: '2026-02-22' },
  { id: 'clm-002', policy_ref: 'POL-2026-TC-0189', trader: 'Cairo Trade House', type: 'Trade Credit', amount_usd: 120000, status: 'approved', filed_date: '2026-02-21' },
  { id: 'clm-003', policy_ref: 'POL-2026-MC-0398', trader: 'Lagos Electronics Ltd', type: 'Marine Cargo', amount_usd: 88000, status: 'submitted', filed_date: '2026-02-21' },
  { id: 'clm-004', policy_ref: 'POL-2026-IT-0067', trader: 'East Africa Cement Ltd', type: 'Inland Transit', amount_usd: 15000, status: 'paid', filed_date: '2026-02-20' },
  { id: 'clm-005', policy_ref: 'POL-2026-WS-0012', trader: 'Nairobi Exports Ltd', type: 'Warehouse Stock', amount_usd: 32000, status: 'denied', filed_date: '2026-02-19' },
  { id: 'clm-006', policy_ref: 'POL-2026-TC-0178', trader: 'Addis Pharmaceutical', type: 'Trade Credit', amount_usd: 67000, status: 'under_review', filed_date: '2026-02-18' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: '#999', bg: 'rgba(153,153,153,0.1)' },
  under_review: { label: 'Under Review', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  approved: { label: 'Approved', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  denied: { label: 'Denied', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  paid: { label: 'Paid', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

function formatUSD(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function InsuranceDashboardPage() {
  const totalPolicies = useMemo(() => POLICY_SUMMARY.reduce((s, p) => s + p.active, 0), []);
  const totalCoverage = useMemo(() => POLICY_SUMMARY.reduce((s, p) => s + p.total_coverage_usd, 0), []);
  const totalClaims = useMemo(() => POLICY_SUMMARY.reduce((s, p) => s + p.claims_mtd, 0), []);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Shield sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Insurance Dashboard</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Trade and cargo insurance portfolio overview and claims monitoring.
        </Typography>
      </Box>

      {/* Top Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Policies', value: totalPolicies.toString(), color: '#D4AF37', icon: <Shield sx={{ fontSize: 18, color: '#D4AF37' }} /> },
          { label: 'Total Coverage', value: formatUSD(totalCoverage), color: '#22C55E', icon: <CheckCircle sx={{ fontSize: 18, color: '#22C55E' }} /> },
          { label: 'Claims This Month', value: totalClaims.toString(), color: '#3B82F6', icon: <Warning sx={{ fontSize: 18, color: '#3B82F6' }} /> },
          { label: 'Avg Loss Ratio', value: `${(POLICY_SUMMARY.reduce((s, p) => s + p.loss_ratio, 0) / POLICY_SUMMARY.filter((p) => p.loss_ratio > 0).length).toFixed(1)}%`, color: '#E6A817', icon: <TrendingUp sx={{ fontSize: 18, color: '#E6A817' }} /> },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                {s.icon}
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Policy Breakdown */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Portfolio by Insurance Type</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {POLICY_SUMMARY.map((p) => (
                <Box key={p.type} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: p.color }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{p.type}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: p.color }}>{p.active} policies</Typography>
                  </Box>
                  <Grid container spacing={1.5}>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Coverage</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{formatUSD(p.total_coverage_usd)}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Claims (MTD)</Typography>
                      <Typography sx={{ fontSize: 12, color: p.claims_mtd > 0 ? '#E6A817' : '#555' }}>{p.claims_mtd}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Loss Ratio</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(p.loss_ratio, 100)}
                          sx={{
                            flex: 1, height: 5, borderRadius: 3,
                            backgroundColor: 'rgba(212,175,55,0.08)',
                            '& .MuiLinearProgress-bar': { backgroundColor: p.loss_ratio > 15 ? '#EF4444' : p.loss_ratio > 10 ? '#E6A817' : '#22C55E', borderRadius: 3 },
                          }}
                        />
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{p.loss_ratio}%</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Recent Claims */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Recent Claims</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {RECENT_CLAIMS.map((c) => {
                const sts = STATUS_CONFIG[c.status];
                return (
                  <Box key={c.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.25, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{c.policy_ref}</Typography>
                        <Chip label={c.type} size="small" sx={{ fontSize: 9, height: 16, backgroundColor: 'rgba(212,175,55,0.06)', color: '#777' }} />
                        <Chip label={sts.label} size="small" sx={{ fontSize: 9, height: 16, color: sts.color, backgroundColor: sts.bg }} />
                      </Box>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.trader}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', fontFamily: 'monospace' }}>{formatUSD(c.amount_usd)}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>{c.filed_date}</Typography>
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
