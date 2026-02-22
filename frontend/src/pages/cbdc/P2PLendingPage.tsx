import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  Handshake,
  AttachMoney,
  Percent,
  Warning,
  Storefront,
  CreditScore,
  PieChart,
} from '@mui/icons-material';

// ── TypeScript Interfaces ────────────────────────────────────────────────────

interface LendingKpi {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface LoanRequest {
  id: string;
  borrower: string;
  country: string;
  flag: string;
  amount: string;
  term: string;
  apr: string;
  purpose: string;
  riskRating: 'A' | 'B' | 'C' | 'D';
  funded: number;
  status: 'open' | 'funding' | 'funded' | 'active';
}

interface CreditScoreBreakdown {
  category: string;
  score: number;
  maxScore: number;
  weight: string;
  color: string;
}

interface PortfolioAllocation {
  riskTier: string;
  label: string;
  amount: number;
  percentage: number;
  loans: number;
  avgApr: string;
  defaultRate: string;
  color: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const KPIS: LendingKpi[] = [
  { label: 'Active Loans', value: '1,847', change: 24.3, icon: <Handshake sx={{ fontSize: 18 }} />, color: '#D4AF37' },
  { label: 'Total Lent', value: 'KES 4.23B', change: 31.7, icon: <AttachMoney sx={{ fontSize: 18 }} />, color: '#22C55E' },
  { label: 'Average APR', value: '14.2%', change: -2.1, icon: <Percent sx={{ fontSize: 18 }} />, color: '#3B82F6' },
  { label: 'Default Rate', value: '3.4%', change: -0.8, icon: <Warning sx={{ fontSize: 18 }} />, color: '#8B5CF6' },
];

const LOAN_REQUESTS: LoanRequest[] = [
  { id: 'LN-2026-4201', borrower: 'Machakos Poultry Farm', country: 'Kenya', flag: '\ud83c\uddf0\ud83c\uddea', amount: 'KES 2,500,000', term: '12 months', apr: '12.5%', purpose: 'Equipment Purchase', riskRating: 'A', funded: 85, status: 'funding' },
  { id: 'LN-2026-4202', borrower: 'Kampala Auto Spares', country: 'Uganda', flag: '\ud83c\uddfa\ud83c\uddec', amount: 'UGX 45,000,000', term: '6 months', apr: '16.0%', purpose: 'Inventory Financing', riskRating: 'B', funded: 62, status: 'funding' },
  { id: 'LN-2026-4203', borrower: 'Arusha Coffee Collective', country: 'Tanzania', flag: '\ud83c\uddf9\ud83c\uddff', amount: 'TZS 18,000,000', term: '9 months', apr: '14.0%', purpose: 'Harvest Pre-finance', riskRating: 'A', funded: 100, status: 'funded' },
  { id: 'LN-2026-4204', borrower: 'Kigali Tech Hub', country: 'Rwanda', flag: '\ud83c\uddf7\ud83c\uddfc', amount: 'RWF 8,500,000', term: '18 months', apr: '13.5%', purpose: 'Workspace Expansion', riskRating: 'B', funded: 41, status: 'funding' },
  { id: 'LN-2026-4205', borrower: 'Mombasa Fish Traders Co-op', country: 'Kenya', flag: '\ud83c\uddf0\ud83c\uddea', amount: 'KES 4,200,000', term: '6 months', apr: '11.0%', purpose: 'Working Capital', riskRating: 'A', funded: 0, status: 'open' },
  { id: 'LN-2026-4206', borrower: 'Juba Construction Ltd', country: 'South Sudan', flag: '\ud83c\uddf8\ud83c\uddf8', amount: 'SSP 12,000,000', term: '24 months', apr: '22.5%', purpose: 'Project Finance', riskRating: 'D', funded: 18, status: 'funding' },
  { id: 'LN-2026-4207', borrower: 'Nairobi Ride-Share Co', country: 'Kenya', flag: '\ud83c\uddf0\ud83c\uddea', amount: 'KES 8,000,000', term: '12 months', apr: '15.0%', purpose: 'Fleet Expansion', riskRating: 'B', funded: 0, status: 'open' },
  { id: 'LN-2026-4208', borrower: 'Dodoma Solar Installers', country: 'Tanzania', flag: '\ud83c\uddf9\ud83c\uddff', amount: 'TZS 25,000,000', term: '18 months', apr: '13.0%', purpose: 'Green Energy', riskRating: 'A', funded: 100, status: 'active' },
];

const CREDIT_BREAKDOWN: CreditScoreBreakdown[] = [
  { category: 'Trade History', score: 87, maxScore: 100, weight: '25%', color: '#22C55E' },
  { category: 'Payment Behavior', score: 92, maxScore: 100, weight: '30%', color: '#D4AF37' },
  { category: 'Business Tenure', score: 74, maxScore: 100, weight: '15%', color: '#3B82F6' },
  { category: 'Revenue Consistency', score: 81, maxScore: 100, weight: '15%', color: '#8B5CF6' },
  { category: 'Collateral Value', score: 68, maxScore: 100, weight: '10%', color: '#E6A817' },
  { category: 'Network Trust Score', score: 79, maxScore: 100, weight: '5%', color: '#EC4899' },
];

const PORTFOLIO_ALLOCATION: PortfolioAllocation[] = [
  { riskTier: 'A', label: 'Low Risk', amount: 1_890_000_000, percentage: 44.7, loans: 824, avgApr: '11.8%', defaultRate: '0.9%', color: '#22C55E' },
  { riskTier: 'B', label: 'Medium Risk', amount: 1_340_000_000, percentage: 31.7, loans: 612, avgApr: '15.2%', defaultRate: '3.1%', color: '#D4AF37' },
  { riskTier: 'C', label: 'Higher Risk', amount: 720_000_000, percentage: 17.0, loans: 298, avgApr: '19.8%', defaultRate: '6.4%', color: '#E6A817' },
  { riskTier: 'D', label: 'High Risk', amount: 280_000_000, percentage: 6.6, loans: 113, avgApr: '24.5%', defaultRate: '12.1%', color: '#EF4444' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatKES(v: number): string {
  if (v >= 1_000_000_000) return `KES ${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `KES ${(v / 1_000_000).toFixed(0)}M`;
  return `KES ${v.toLocaleString()}`;
}

const RISK_COLORS: Record<string, { color: string; bg: string }> = {
  A: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  B: { color: '#D4AF37', bg: 'rgba(212,175,55,0.08)' },
  C: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
  D: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
};

const LOAN_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: '#888', bg: 'rgba(136,136,136,0.08)' },
  funding: { label: 'Funding', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  funded: { label: 'Funded', color: '#D4AF37', bg: 'rgba(212,175,55,0.08)' },
  active: { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function P2PLendingPage() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Handshake sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Peer-to-Peer Lending</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Decentralized lending marketplace connecting African SME borrowers with institutional and retail lenders via CBDC settlement.
        </Typography>
      </Box>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {KPIS.map((k) => (
          <Grid size={{ xs: 6, md: 3 }} key={k.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <Box sx={{ color: k.color }}>{k.icon}</Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{k.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: k.color }}>{k.value}</Typography>
              <Typography sx={{ fontSize: 11, color: k.change > 0 ? '#22C55E' : '#EF4444' }}>
                {k.change > 0 ? '+' : ''}{k.change}% vs last month
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Lending Marketplace */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <Storefront sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Lending Marketplace
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {LOAN_REQUESTS.map((ln) => {
                const rc = RISK_COLORS[ln.riskRating];
                const ls = LOAN_STATUS[ln.status];
                return (
                  <Box key={ln.id} sx={{ p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.06)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{ln.id}</Typography>
                        <Chip label={`Risk ${ln.riskRating}`} size="small" sx={{ fontSize: 9, height: 16, fontWeight: 700, color: rc.color, backgroundColor: rc.bg }} />
                        <Chip label={ls.label} size="small" sx={{ fontSize: 9, height: 16, color: ls.color, backgroundColor: ls.bg }} />
                      </Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#D4AF37', fontFamily: "'Lora', serif" }}>{ln.amount}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                      <Typography sx={{ fontSize: 14 }}>{ln.flag}</Typography>
                      <Typography sx={{ fontSize: 12, color: '#f0f0f0' }}>{ln.borrower}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>({ln.country})</Typography>
                    </Box>
                    <Grid container spacing={1} sx={{ mb: 0.75 }}>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Term</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{ln.term}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>APR</Typography>
                        <Typography sx={{ fontSize: 11, color: '#22C55E', fontFamily: 'monospace' }}>{ln.apr}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Purpose</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{ln.purpose}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Funded</Typography>
                        <Typography sx={{ fontSize: 11, color: ln.funded >= 100 ? '#22C55E' : '#b0b0b0', fontFamily: 'monospace' }}>{ln.funded}%</Typography>
                      </Grid>
                    </Grid>
                    {ln.funded > 0 && (
                      <LinearProgress
                        variant="determinate"
                        value={ln.funded}
                        sx={{
                          height: 4, borderRadius: 2,
                          backgroundColor: 'rgba(212,175,55,0.06)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: ln.funded >= 100 ? '#22C55E' : '#D4AF37',
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Borrower Credit Scoring */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 0.5 }}>
                <CreditScore sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Borrower Credit Score Model
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#555', mb: 2 }}>Weighted scoring breakdown for SME credit assessment</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {CREDIT_BREAKDOWN.map((cb) => (
                  <Box key={cb.category}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 12, color: '#f0f0f0' }}>{cb.category}</Typography>
                        <Typography sx={{ fontSize: 9, color: '#555' }}>({cb.weight})</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: cb.color, fontFamily: "'Lora', serif" }}>{cb.score}/{cb.maxScore}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={cb.score}
                      sx={{
                        height: 6, borderRadius: 3,
                        backgroundColor: 'rgba(212,175,55,0.06)',
                        '& .MuiLinearProgress-bar': { backgroundColor: cb.color, borderRadius: 3 },
                      }}
                    />
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 2, p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>Composite Score</Typography>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#D4AF37', fontFamily: "'Lora', serif" }}>83.4</Typography>
                </Box>
                <Typography sx={{ fontSize: 10, color: '#555' }}>Rating: A (Low Risk) &mdash; Eligible for preferential APR</Typography>
              </Box>
            </Card>

            {/* Lender Portfolio Allocation */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <PieChart sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Lender Portfolio Allocation
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {PORTFOLIO_ALLOCATION.map((pa) => (
                  <Box key={pa.riskTier} sx={{ p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.06)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: pa.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>Tier {pa.riskTier}: {pa.label}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: pa.color, fontFamily: "'Lora', serif" }}>{pa.percentage}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={pa.percentage}
                      sx={{
                        height: 4, borderRadius: 2, mb: 0.75,
                        backgroundColor: 'rgba(212,175,55,0.06)',
                        '& .MuiLinearProgress-bar': { backgroundColor: pa.color, borderRadius: 2 },
                      }}
                    />
                    <Grid container spacing={1}>
                      <Grid size={4}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Amount</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{formatKES(pa.amount)}</Typography>
                      </Grid>
                      <Grid size={4}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Avg APR</Typography>
                        <Typography sx={{ fontSize: 11, color: '#22C55E', fontFamily: 'monospace' }}>{pa.avgApr}</Typography>
                      </Grid>
                      <Grid size={4}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Default</Typography>
                        <Typography sx={{ fontSize: 11, color: parseFloat(pa.defaultRate) > 5 ? '#EF4444' : '#b0b0b0', fontFamily: 'monospace' }}>{pa.defaultRate}</Typography>
                      </Grid>
                    </Grid>
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
