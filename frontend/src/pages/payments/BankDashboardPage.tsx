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
  AccountBalance,
  TrendingUp,
  CreditScore,
  RequestQuote,
  Security,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface PortfolioMetric {
  label: string;
  value: string;
  change: string;
  color: string;
  icon: typeof AccountBalance;
}

const PORTFOLIO_METRICS: PortfolioMetric[] = [
  { label: 'Total Trade Finance', value: 'KSh 2.4B', change: '+8.2%', color: '#D4AF37', icon: RequestQuote },
  { label: 'Active LCs', value: '47', change: '+3', color: '#3B82F6', icon: AccountBalance },
  { label: 'Credit Exposure', value: 'KSh 890M', change: '+2.1%', color: '#E6A817', icon: CreditScore },
  { label: 'NPL Ratio', value: '2.3%', change: '-0.4%', color: '#22C55E', icon: Security },
];

interface ActiveFacility {
  id: string;
  trader: string;
  facility_type: string;
  amount: number;
  utilized: number;
  currency: string;
  maturity: string;
  risk_grade: 'A' | 'B' | 'C' | 'D';
  status: 'active' | 'under_review' | 'expired';
}

const ACTIVE_FACILITIES: ActiveFacility[] = [
  { id: 'fac-001', trader: 'Nairobi Exports Ltd', facility_type: 'Letter of Credit', amount: 50000000, utilized: 35000000, currency: 'KES', maturity: '2026-08-15', risk_grade: 'A', status: 'active' },
  { id: 'fac-002', trader: 'Lagos Trading Co', facility_type: 'Trade Loan', amount: 120000000, utilized: 95000000, currency: 'KES', maturity: '2026-06-30', risk_grade: 'B', status: 'active' },
  { id: 'fac-003', trader: 'Accra Commodities Ltd', facility_type: 'Bank Guarantee', amount: 25000000, utilized: 25000000, currency: 'KES', maturity: '2026-04-01', risk_grade: 'A', status: 'active' },
  { id: 'fac-004', trader: 'Cairo Trade House', facility_type: 'Documentary Collection', amount: 80000000, utilized: 42000000, currency: 'KES', maturity: '2026-09-30', risk_grade: 'C', status: 'under_review' },
  { id: 'fac-005', trader: 'Dar es Salaam Freight', facility_type: 'Pre-Export Finance', amount: 35000000, utilized: 28000000, currency: 'KES', maturity: '2026-05-15', risk_grade: 'B', status: 'active' },
  { id: 'fac-006', trader: 'Kampala Imports Inc', facility_type: 'Letter of Credit', amount: 15000000, utilized: 15000000, currency: 'KES', maturity: '2026-03-01', risk_grade: 'D', status: 'expired' },
];

const RISK_CONFIG: Record<string, { color: string; bg: string }> = {
  A: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  B: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  C: { color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  D: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  under_review: { label: 'Under Review', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  expired: { label: 'Expired', color: '#999', bg: 'rgba(153,153,153,0.1)' },
};

function formatAmount(value: number): string {
  if (value >= 1000000) return `KSh ${(value / 1000000).toFixed(0)}M`;
  if (value >= 1000) return `KSh ${(value / 1000).toFixed(0)}K`;
  return `KSh ${value.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BankDashboardPage() {
  const { isOversight, filterByOrgName, orgName } = useDataIsolation();

  const baseFacilities = useMemo(
    () => filterByOrgName(ACTIVE_FACILITIES, 'trader'),
    [filterByOrgName],
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <AccountBalance sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">{isOversight ? 'Bank Dashboard' : 'My Trade Finance'}</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          {isOversight ? 'Trade finance portfolio overview and facility management.' : `Trade finance facilities for ${orgName}.`}
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {PORTFOLIO_METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <Grid size={{ xs: 6, md: 3 }} key={m.label}>
              <Card sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{m.label}</Typography>
                  <Icon sx={{ fontSize: 18, color: m.color, opacity: 0.7 }} />
                </Box>
                <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: m.color }}>{m.value}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <TrendingUp sx={{ fontSize: 12, color: m.change.startsWith('-') ? '#22C55E' : '#E6A817' }} />
                  <Typography sx={{ fontSize: 11, color: '#777' }}>{m.change} this quarter</Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        {/* Active Facilities */}
        <Grid size={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Active Trade Finance Facilities</Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 130px 100px 100px 1fr 50px 90px 90px',
                gap: 1, px: 2.5, py: 1.5,
                borderBottom: '1px solid rgba(212,175,55,0.08)',
                backgroundColor: 'rgba(212,175,55,0.03)',
              }}
            >
              {['Trader', 'Facility', 'Limit', 'Utilized', 'Utilization', 'Risk', 'Maturity', 'Status'].map((h) => (
                <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
              ))}
            </Box>
            {baseFacilities.map((f, i) => {
              const utilPct = (f.utilized / f.amount * 100);
              const risk = RISK_CONFIG[f.risk_grade];
              const sts = STATUS_CONFIG[f.status];
              return (
                <Box
                  key={f.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 130px 100px 100px 1fr 50px 90px 90px',
                    gap: 1, px: 2.5, py: 1.75,
                    alignItems: 'center',
                    borderBottom: i < baseFacilities.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                    '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                    cursor: 'pointer',
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{f.trader}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{f.facility_type}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#999' }}>{formatAmount(f.amount)}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{formatAmount(f.utilized)}</Typography>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                      <Typography sx={{ fontSize: 10, color: '#777' }}>{utilPct.toFixed(0)}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={utilPct}
                      sx={{
                        height: 4, borderRadius: 2,
                        backgroundColor: 'rgba(212,175,55,0.08)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: utilPct > 90 ? '#EF4444' : utilPct > 70 ? '#E6A817' : '#22C55E',
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                  <Chip label={f.risk_grade} size="small" sx={{ fontSize: 11, height: 22, fontWeight: 700, backgroundColor: risk.bg, color: risk.color }} />
                  <Typography sx={{ fontSize: 11, color: '#999' }}>{f.maturity}</Typography>
                  <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: sts.bg, color: sts.color }} />
                </Box>
              );
            })}
          </Card>
        </Grid>

        {/* Risk Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Risk Grade Distribution</Typography>
            {(['A', 'B', 'C', 'D'] as const).map((grade) => {
              const count = baseFacilities.filter((f) => f.risk_grade === grade).length;
              const pct = (count / baseFacilities.length * 100).toFixed(0);
              const exposure = baseFacilities.filter((f) => f.risk_grade === grade).reduce((s, f) => s + f.utilized, 0);
              const cfg = RISK_CONFIG[grade];
              return (
                <Box key={grade} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={grade} size="small" sx={{ fontSize: 11, height: 22, fontWeight: 700, backgroundColor: cfg.bg, color: cfg.color }} />
                      <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{count} facilities</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12, color: cfg.color }}>{formatAmount(exposure)}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Number(pct)}
                    sx={{ height: 6, borderRadius: 3, backgroundColor: `${cfg.color}15`, '& .MuiLinearProgress-bar': { backgroundColor: cfg.color, borderRadius: 3 } }}
                  />
                </Box>
              );
            })}
          </Card>
        </Grid>

        {/* Facility Type Breakdown */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Facility Type Breakdown</Typography>
            {Array.from(new Set(baseFacilities.map((f) => f.facility_type))).map((type) => {
              const facilities = baseFacilities.filter((f) => f.facility_type === type);
              const total = facilities.reduce((s, f) => s + f.amount, 0);
              const colors = ['#D4AF37', '#3B82F6', '#22C55E', '#E6A817', '#8B5CF6'];
              const idx = Array.from(new Set(baseFacilities.map((f) => f.facility_type))).indexOf(type);
              const color = colors[idx % colors.length];
              return (
                <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.25, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
                    <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{type}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color }}>{formatAmount(total)}</Typography>
                    <Typography sx={{ fontSize: 10, color: '#777' }}>{facilities.length} facilities</Typography>
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
