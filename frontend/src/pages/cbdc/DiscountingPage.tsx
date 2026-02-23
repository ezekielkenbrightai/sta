import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  Receipt,
  TrendingDown,
  AccessTime,
  Business,
  CompareArrows,
} from '@mui/icons-material';

// ── TypeScript Interfaces ────────────────────────────────────────────────────

interface DiscountingKpi {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface InvoiceQueueItem {
  id: string;
  seller: string;
  buyer: string;
  invoiceAmount: string;
  discountedAmount: string;
  discountRate: string;
  status: 'submitted' | 'under_review' | 'approved' | 'funded';
  dueDate: string;
  submittedAt: string;
}

interface RateComparison {
  term: string;
  cbdcRate: number;
  traditionalRate: number;
  saving: number;
}

interface Counterparty {
  name: string;
  country: string;
  flag: string;
  totalDiscounted: number;
  invoicesProcessed: number;
  avgTurnaround: string;
  rating: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const KPIS: DiscountingKpi[] = [
  { label: 'Active Invoices', value: '247', change: 14.8, icon: <Receipt sx={{ fontSize: 18 }} />, color: '#D4AF37' },
  { label: 'Total Discount Value', value: 'KES 1.82B', change: 22.3, icon: <TrendingDown sx={{ fontSize: 18 }} />, color: '#22C55E' },
  { label: 'Avg Discount Rate', value: '6.4%', change: -1.2, icon: <CompareArrows sx={{ fontSize: 18 }} />, color: '#3B82F6' },
  { label: 'Turnaround Time', value: '18 hrs', change: -28.5, icon: <AccessTime sx={{ fontSize: 18 }} />, color: '#8B5CF6' },
];

const INVOICE_QUEUE: InvoiceQueueItem[] = [
  { id: 'INV-2026-0841', seller: 'Mombasa Tea Exports', buyer: 'Johannesburg Commodities Ltd', invoiceAmount: 'KES 24,500,000', discountedAmount: 'KES 23,187,000', discountRate: '5.4%', status: 'funded', dueDate: '2026-04-15', submittedAt: '2 days ago' },
  { id: 'INV-2026-0842', seller: 'Nairobi Coffee Co-op', buyer: 'Casablanca Trading SA', invoiceAmount: 'KES 18,200,000', discountedAmount: 'KES 17,018,000', discountRate: '6.5%', status: 'approved', dueDate: '2026-04-22', submittedAt: '1 day ago' },
  { id: 'INV-2026-0843', seller: 'Kilifi Cashew Ltd', buyer: 'Dar es Salaam Nuts Co', invoiceAmount: 'KES 8,700,000', discountedAmount: 'KES 8,135,400', discountRate: '6.5%', status: 'under_review', dueDate: '2026-05-01', submittedAt: '5 hrs ago' },
  { id: 'INV-2026-0844', seller: 'Kisumu Fish Traders', buyer: 'Kampala Fresh Foods', invoiceAmount: 'KES 3,400,000', discountedAmount: '—', discountRate: '—', status: 'submitted', dueDate: '2026-05-10', submittedAt: '1 hr ago' },
  { id: 'INV-2026-0845', seller: 'Eldoret Grain Millers', buyer: 'Juba Foodstuffs Co', invoiceAmount: 'KES 12,100,000', discountedAmount: 'KES 11,374,000', discountRate: '6.0%', status: 'approved', dueDate: '2026-04-28', submittedAt: '18 hrs ago' },
  { id: 'INV-2026-0846', seller: 'Dar Sisal Exporters', buyer: 'Lagos Import Corp', invoiceAmount: 'KES 31,500,000', discountedAmount: 'KES 29,295,000', discountRate: '7.0%', status: 'under_review', dueDate: '2026-05-15', submittedAt: '4 hrs ago' },
];

const RATE_COMPARISONS: RateComparison[] = [
  { term: '30 days', cbdcRate: 4.2, traditionalRate: 8.5, saving: 4.3 },
  { term: '60 days', cbdcRate: 5.8, traditionalRate: 11.2, saving: 5.4 },
  { term: '90 days', cbdcRate: 6.5, traditionalRate: 13.8, saving: 7.3 },
  { term: '120 days', cbdcRate: 7.4, traditionalRate: 15.5, saving: 8.1 },
  { term: '180 days', cbdcRate: 8.9, traditionalRate: 18.0, saving: 9.1 },
];

const TOP_COUNTERPARTIES: Counterparty[] = [
  { name: 'KCB Trade Finance', country: 'Kenya', flag: '\ud83c\uddf0\ud83c\uddea', totalDiscounted: 480_000_000, invoicesProcessed: 67, avgTurnaround: '12 hrs', rating: 'AA+' },
  { name: 'Equity Bank Digital', country: 'Kenya', flag: '\ud83c\uddf0\ud83c\uddea', totalDiscounted: 342_000_000, invoicesProcessed: 48, avgTurnaround: '16 hrs', rating: 'AA' },
  { name: 'CRDB Bank Tanzania', country: 'Tanzania', flag: '\ud83c\uddf9\ud83c\uddff', totalDiscounted: 218_000_000, invoicesProcessed: 31, avgTurnaround: '22 hrs', rating: 'A+' },
  { name: 'Stanbic Uganda', country: 'Uganda', flag: '\ud83c\uddfa\ud83c\uddec', totalDiscounted: 156_000_000, invoicesProcessed: 22, avgTurnaround: '24 hrs', rating: 'A' },
  { name: 'Bank of Kigali', country: 'Rwanda', flag: '\ud83c\uddf7\ud83c\uddfc', totalDiscounted: 98_000_000, invoicesProcessed: 14, avgTurnaround: '20 hrs', rating: 'A+' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatKES(v: number): string {
  if (v >= 1_000_000_000) return `KES ${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `KES ${(v / 1_000_000).toFixed(0)}M`;
  return `KES ${v.toLocaleString()}`;
}

const QUEUE_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: '#888', bg: 'rgba(136,136,136,0.08)' },
  under_review: { label: 'Under Review', color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
  approved: { label: 'Approved', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  funded: { label: 'Funded', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DiscountingPage() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Receipt sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Invoice Discounting</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          CBDC-powered invoice discounting with instant settlement and lower rates across East African trade corridors.
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
        {/* Invoice Queue */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <Receipt sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Invoice Discounting Queue
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {INVOICE_QUEUE.map((inv) => {
                const st = QUEUE_STATUS[inv.status];
                return (
                  <Box key={inv.id} sx={{ p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.06)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{inv.id}</Typography>
                        <Chip label={st.label} size="small" sx={{ fontSize: 9, height: 16, color: st.color, backgroundColor: st.bg }} />
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#D4AF37', fontFamily: "'Lora', serif" }}>{inv.invoiceAmount}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{inv.seller} &rarr; {inv.buyer}</Typography>
                    <Grid container spacing={1} sx={{ mt: 0.5 }}>
                      <Grid size={4}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Discounted</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{inv.discountedAmount}</Typography>
                      </Grid>
                      <Grid size={4}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Rate</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{inv.discountRate}</Typography>
                      </Grid>
                      <Grid size={4}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Due</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{inv.dueDate}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Rate Comparison */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <CompareArrows sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                CBDC vs Traditional Factoring Rates
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', pb: 1, borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                  <Typography sx={{ fontSize: 10, color: '#555', width: 60, textTransform: 'uppercase' }}>Term</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555', flex: 1, textAlign: 'center', textTransform: 'uppercase' }}>CBDC Rate</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555', flex: 1, textAlign: 'center', textTransform: 'uppercase' }}>Traditional</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555', width: 60, textAlign: 'right', textTransform: 'uppercase' }}>Saving</Typography>
                </Box>
                {RATE_COMPARISONS.map((r) => (
                  <Box key={r.term} sx={{ display: 'flex', alignItems: 'center', py: 0.75 }}>
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0', width: 60 }}>{r.term}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#22C55E', flex: 1, textAlign: 'center', fontWeight: 600, fontFamily: 'monospace' }}>{r.cbdcRate}%</Typography>
                    <Typography sx={{ fontSize: 12, color: '#EF4444', flex: 1, textAlign: 'center', fontFamily: 'monospace' }}>{r.traditionalRate}%</Typography>
                    <Typography sx={{ fontSize: 12, color: '#D4AF37', width: 60, textAlign: 'right', fontWeight: 600, fontFamily: 'monospace' }}>-{r.saving}%</Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Top Counterparties */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <Business sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Top Discounting Counterparties
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {TOP_COUNTERPARTIES.map((cp) => (
                  <Box key={cp.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Typography sx={{ fontSize: 16 }}>{cp.flag}</Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{cp.name}</Typography>
                        <Chip label={cp.rating} size="small" sx={{ fontSize: 9, height: 16, color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.08)' }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{formatKES(cp.totalDiscounted)}</Typography>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{cp.invoicesProcessed} invoices</Typography>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{cp.avgTurnaround} avg</Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(cp.totalDiscounted / 480_000_000) * 100}
                      sx={{
                        width: 50, height: 4, borderRadius: 2,
                        backgroundColor: 'rgba(212,175,55,0.08)',
                        '& .MuiLinearProgress-bar': { backgroundColor: '#D4AF37', borderRadius: 2 },
                      }}
                    />
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
