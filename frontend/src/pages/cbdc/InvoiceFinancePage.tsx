import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  RequestQuote,
  AttachMoney,
  Security,
  CalendarMonth,
  LocalShipping,
  EventNote,
} from '@mui/icons-material';

// ── TypeScript Interfaces ────────────────────────────────────────────────────

interface FinanceKpi {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface FinancePipelineItem {
  id: string;
  supplier: string;
  buyer: string;
  amount: string;
  term: string;
  status: 'pending' | 'approved' | 'disbursed' | 'repaid';
  submittedAt: string;
}

interface SupplierProgram {
  name: string;
  anchor: string;
  country: string;
  flag: string;
  totalLimit: number;
  utilized: number;
  suppliers: number;
  avgRate: string;
  status: 'active' | 'onboarding';
}

interface RepaymentSchedule {
  id: string;
  borrower: string;
  amount: string;
  dueDate: string;
  daysUntilDue: number;
  status: 'upcoming' | 'due_soon' | 'overdue';
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const KPIS: FinanceKpi[] = [
  { label: 'Financed Invoices', value: '412', change: 19.2, icon: <RequestQuote sx={{ fontSize: 18 }} />, color: '#D4AF37' },
  { label: 'Total Financed Value', value: 'KES 3.41B', change: 27.8, icon: <AttachMoney sx={{ fontSize: 18 }} />, color: '#22C55E' },
  { label: 'Default Rate', value: '1.8%', change: -0.4, icon: <Security sx={{ fontSize: 18 }} />, color: '#3B82F6' },
  { label: 'Avg Financing Term', value: '67 days', change: 5.3, icon: <CalendarMonth sx={{ fontSize: 18 }} />, color: '#8B5CF6' },
];

const PIPELINE: FinancePipelineItem[] = [
  { id: 'SCF-2026-301', supplier: 'Thika Garments Ltd', buyer: 'Shoprite Holdings SA', amount: 'KES 42,800,000', term: '90 days', status: 'disbursed', submittedAt: '5 days ago' },
  { id: 'SCF-2026-302', supplier: 'Athi River Cement', buyer: 'National Construction Authority', amount: 'KES 28,500,000', term: '60 days', status: 'approved', submittedAt: '2 days ago' },
  { id: 'SCF-2026-303', supplier: 'Kisumu Sugar Mills', buyer: 'Nakumatt Holdings', amount: 'KES 15,200,000', term: '45 days', status: 'pending', submittedAt: '1 day ago' },
  { id: 'SCF-2026-304', supplier: 'Nanyuki Horticulture', buyer: 'Multiflora SA Auctions', amount: 'KES 67,300,000', term: '30 days', status: 'repaid', submittedAt: '38 days ago' },
  { id: 'SCF-2026-305', supplier: 'Meru Dairy Co-op', buyer: 'Brookside Distributors', amount: 'KES 8,900,000', term: '45 days', status: 'disbursed', submittedAt: '12 days ago' },
  { id: 'SCF-2026-306', supplier: 'Mombasa Steel Works', buyer: 'SGR Kenya Ltd', amount: 'KES 124,000,000', term: '120 days', status: 'approved', submittedAt: '3 days ago' },
  { id: 'SCF-2026-307', supplier: 'Machakos Textiles', buyer: 'PVH Africa', amount: 'KES 19,400,000', term: '60 days', status: 'pending', submittedAt: '6 hrs ago' },
];

const SUPPLIER_PROGRAMS: SupplierProgram[] = [
  { name: 'KenTrade SCF Program', anchor: 'Kenya Ports Authority', country: 'Kenya', flag: '\ud83c\uddf0\ud83c\uddea', totalLimit: 2_000_000_000, utilized: 1_420_000_000, suppliers: 87, avgRate: '5.8%', status: 'active' },
  { name: 'EAC Agri-Finance', anchor: 'East African Breweries', country: 'Kenya', flag: '\ud83c\uddf0\ud83c\uddea', totalLimit: 800_000_000, utilized: 612_000_000, suppliers: 134, avgRate: '6.2%', status: 'active' },
  { name: 'TZ Infrastructure SCF', anchor: 'TANROADS', country: 'Tanzania', flag: '\ud83c\uddf9\ud83c\uddff', totalLimit: 1_500_000_000, utilized: 890_000_000, suppliers: 56, avgRate: '7.1%', status: 'active' },
  { name: 'Uganda Coffee Chain', anchor: 'Uganda Coffee Dev Authority', country: 'Uganda', flag: '\ud83c\uddfa\ud83c\uddec', totalLimit: 500_000_000, utilized: 120_000_000, suppliers: 23, avgRate: '6.8%', status: 'onboarding' },
];

const REPAYMENT_SCHEDULE: RepaymentSchedule[] = [
  { id: 'RPY-001', borrower: 'Thika Garments Ltd', amount: 'KES 14,500,000', dueDate: '2026-02-25', daysUntilDue: 2, status: 'due_soon' },
  { id: 'RPY-002', borrower: 'Meru Dairy Co-op', amount: 'KES 4,600,000', dueDate: '2026-02-28', daysUntilDue: 5, status: 'upcoming' },
  { id: 'RPY-003', borrower: 'Nakuru Plastics', amount: 'KES 7,200,000', dueDate: '2026-02-22', daysUntilDue: -1, status: 'overdue' },
  { id: 'RPY-004', borrower: 'Lamu Marine Supplies', amount: 'KES 3,100,000', dueDate: '2026-03-05', daysUntilDue: 10, status: 'upcoming' },
  { id: 'RPY-005', borrower: 'Athi River Cement', amount: 'KES 28,500,000', dueDate: '2026-03-12', daysUntilDue: 17, status: 'upcoming' },
  { id: 'RPY-006', borrower: 'Mombasa Steel Works', amount: 'KES 42,000,000', dueDate: '2026-03-20', daysUntilDue: 25, status: 'upcoming' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatKES(v: number): string {
  if (v >= 1_000_000_000) return `KES ${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `KES ${(v / 1_000_000).toFixed(0)}M`;
  return `KES ${v.toLocaleString()}`;
}

const PIPELINE_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#888', bg: 'rgba(136,136,136,0.08)' },
  approved: { label: 'Approved', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  disbursed: { label: 'Disbursed', color: '#D4AF37', bg: 'rgba(212,175,55,0.08)' },
  repaid: { label: 'Repaid', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
};

const REPAY_STATUS: Record<string, { color: string; bg: string }> = {
  upcoming: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  due_soon: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
  overdue: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function InvoiceFinancePage() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <RequestQuote sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Invoice Finance</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Supply chain finance and invoice financing powered by CBDC rails for East African trade networks.
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
        {/* Financing Pipeline */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, mb: 2 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <LocalShipping sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Financing Pipeline
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {PIPELINE.map((p) => {
                const st = PIPELINE_STATUS[p.status];
                return (
                  <Box key={p.id} sx={{ p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.06)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{p.id}</Typography>
                        <Chip label={st.label} size="small" sx={{ fontSize: 9, height: 16, color: st.color, backgroundColor: st.bg }} />
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#D4AF37', fontFamily: "'Lora', serif" }}>{p.amount}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{p.supplier} &rarr; {p.buyer}</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>Term: {p.term}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>Submitted: {p.submittedAt}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Supplier Finance Programs */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Supplier Finance Programs</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {SUPPLIER_PROGRAMS.map((sp) => {
                  const utilPct = (sp.utilized / sp.totalLimit) * 100;
                  return (
                    <Box key={sp.name} sx={{ p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.06)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Typography sx={{ fontSize: 14 }}>{sp.flag}</Typography>
                          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{sp.name}</Typography>
                        </Box>
                        <Chip
                          label={sp.status === 'active' ? 'Active' : 'Onboarding'}
                          size="small"
                          sx={{
                            fontSize: 9, height: 16,
                            color: sp.status === 'active' ? '#22C55E' : '#E6A817',
                            backgroundColor: sp.status === 'active' ? 'rgba(34,197,94,0.08)' : 'rgba(230,168,23,0.08)',
                          }}
                        />
                      </Box>
                      <Typography sx={{ fontSize: 10, color: '#555', mb: 1 }}>Anchor: {sp.anchor}</Typography>
                      <Box sx={{ mb: 0.75 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                          <Typography sx={{ fontSize: 10, color: '#555' }}>Utilization ({utilPct.toFixed(0)}%)</Typography>
                          <Typography sx={{ fontSize: 10, color: '#b0b0b0' }}>{formatKES(sp.utilized)} / {formatKES(sp.totalLimit)}</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={utilPct}
                          sx={{
                            height: 4, borderRadius: 2,
                            backgroundColor: 'rgba(212,175,55,0.08)',
                            '& .MuiLinearProgress-bar': { backgroundColor: utilPct > 80 ? '#E6A817' : '#D4AF37', borderRadius: 2 },
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{sp.suppliers} suppliers</Typography>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>Avg rate: {sp.avgRate}</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Card>

            {/* Repayment Schedule */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <EventNote sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Upcoming Repayments
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {REPAYMENT_SCHEDULE.map((r) => {
                  const rs = REPAY_STATUS[r.status];
                  return (
                    <Box key={r.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: rs.color, flexShrink: 0 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 12, color: '#f0f0f0' }}>{r.borrower}</Typography>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{r.dueDate}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: "'Lora', serif" }}>{r.amount}</Typography>
                      <Chip
                        label={r.daysUntilDue < 0 ? `${Math.abs(r.daysUntilDue)}d overdue` : r.daysUntilDue <= 3 ? `${r.daysUntilDue}d left` : `${r.daysUntilDue}d`}
                        size="small"
                        sx={{ fontSize: 9, height: 16, color: rs.color, backgroundColor: rs.bg, minWidth: 50 }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
