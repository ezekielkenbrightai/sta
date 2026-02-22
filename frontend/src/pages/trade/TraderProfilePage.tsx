import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  Description,
  LocalShipping,
  TrendingUp,
  VerifiedUser,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

const TRADER = {
  id: 'tr-001',
  name: 'Nairobi Exports Ltd',
  registration_number: 'KE-TRD-2024-001',
  type: 'both',
  country: 'Kenya',
  flag: '🇰🇪',
  status: 'active',
  compliance_score: 94,
  address: '123 Uhuru Highway, Nairobi, Kenya',
  phone: '+254 712 345 678',
  email: 'trade@nairobiexports.co.ke',
  contact_person: 'John Kipchoge',
  tax_pin: 'P051234567A',
  joined_at: '2024-01-15',
  total_trade_value: 12500000,
  active_documents: 8,
  total_documents: 42,
  trade_history: [
    { month: 'Jan 2026', imports: 450000, exports: 320000 },
    { month: 'Feb 2026', imports: 520000, exports: 280000 },
    { month: 'Dec 2025', imports: 380000, exports: 420000 },
    { month: 'Nov 2025', imports: 290000, exports: 510000 },
    { month: 'Oct 2025', imports: 600000, exports: 350000 },
    { month: 'Sep 2025', imports: 410000, exports: 300000 },
  ],
  recent_documents: [
    { id: 'td-001', ref: 'KE-2026-0042', type: 'import', status: 'assessed', value: '$245,000', date: '20 Feb 2026' },
    { id: 'td-002', ref: 'KE-2026-0041', type: 'export', status: 'assessed', value: '$78,500', date: '19 Feb 2026' },
    { id: 'td-004', ref: 'KE-2026-0039', type: 'export', status: 'submitted', value: '$32,000', date: '17 Feb 2026' },
    { id: 'td-005', ref: 'KE-2026-0038', type: 'import', status: 'paid', value: '$185,000', date: '16 Feb 2026' },
  ],
  compliance_breakdown: [
    { label: 'Document Accuracy', score: 96 },
    { label: 'Payment Timeliness', score: 92 },
    { label: 'HS Code Compliance', score: 98 },
    { label: 'Customs Clearance', score: 90 },
  ],
};

function complianceColor(score: number): string {
  if (score >= 90) return '#22C55E';
  if (score >= 70) return '#E6A817';
  return '#EF4444';
}

const STATUS_COLORS: Record<string, string> = {
  submitted: '#3B82F6',
  assessed: '#F59E0B',
  paid: '#22C55E',
  completed: '#10B981',
};

export default function TraderProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const trader = TRADER; // In production, fetch by id

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <IconButton onClick={() => navigate('/trade/traders')} size="small" sx={{ color: '#b0b0b0' }}>
          <ArrowBack />
        </IconButton>
        <Avatar sx={{ width: 48, height: 48, fontSize: 28, backgroundColor: 'rgba(212,175,55,0.1)' }}>
          {trader.flag}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ lineHeight: 1.2 }}>{trader.name}</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
            {trader.registration_number} &middot; {trader.country}
          </Typography>
        </Box>
        <Chip
          label="Active"
          size="small"
          sx={{ ml: 1, backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', fontWeight: 600 }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Left column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Trade Value', value: `$${(trader.total_trade_value / 1000000).toFixed(1)}M`, icon: <TrendingUp />, color: '#D4AF37' },
              { label: 'Active Documents', value: trader.active_documents, icon: <Description />, color: '#3B82F6' },
              { label: 'Total Documents', value: trader.total_documents, icon: <LocalShipping />, color: '#8B5CF6' },
              { label: 'Compliance Score', value: `${trader.compliance_score}%`, icon: <VerifiedUser />, color: complianceColor(trader.compliance_score) },
            ].map((s) => (
              <Grid size={{ xs: 6, md: 3 }} key={s.label}>
                <Card sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ color: s.color }}>{s.icon}</Box>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>{s.label}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'Lora', serif" }}>
                    {s.value}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Trade History */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Monthly Trade Summary</Typography>
            {trader.trade_history.map((m, i) => (
              <Box key={m.month} sx={{ py: 1.5, borderBottom: i < trader.trade_history.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0' }}>{m.month}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#999' }}>
                    Total: ${((m.imports + m.exports) / 1000).toFixed(0)}K
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Box sx={{ flex: m.imports, height: 6, borderRadius: 3, backgroundColor: 'rgba(59,130,246,0.6)' }} />
                  <Box sx={{ flex: m.exports, height: 6, borderRadius: 3, backgroundColor: 'rgba(34,197,94,0.6)' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography sx={{ fontSize: 11, color: '#3B82F6' }}>Import: ${(m.imports / 1000).toFixed(0)}K</Typography>
                  <Typography sx={{ fontSize: 11, color: '#22C55E' }}>Export: ${(m.exports / 1000).toFixed(0)}K</Typography>
                </Box>
              </Box>
            ))}
          </Card>

          {/* Recent Documents */}
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Recent Documents</Typography>
              <Button size="small" onClick={() => navigate('/trade/documents')} sx={{ fontSize: 12 }}>
                View All
              </Button>
            </Box>
            {trader.recent_documents.map((doc, i) => (
              <Box
                key={doc.id}
                onClick={() => navigate(`/trade/documents/${doc.id}`)}
                sx={{
                  px: 3,
                  py: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: i < trader.recent_documents.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(212,175,55,0.04)' },
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>{doc.ref}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#777' }}>{doc.type} &middot; {doc.date}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{doc.value}</Typography>
                  <Chip
                    label={doc.status.replace(/_/g, ' ')}
                    size="small"
                    sx={{
                      fontSize: 11, height: 22,
                      backgroundColor: `${STATUS_COLORS[doc.status] || '#999'}15`,
                      color: STATUS_COLORS[doc.status] || '#999',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Right column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Contact Info */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Contact Information</Typography>
            {[
              ['Contact Person', trader.contact_person],
              ['Email', trader.email],
              ['Phone', trader.phone],
              ['Address', trader.address],
              ['Tax PIN', trader.tax_pin],
              ['Joined', trader.joined_at],
            ].map(([label, value]) => (
              <Box key={label} sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: 11, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.25 }}>
                  {label}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{value}</Typography>
              </Box>
            ))}
          </Card>

          {/* Compliance Breakdown */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Compliance Breakdown</Typography>
            {trader.compliance_breakdown.map((item) => (
              <Box key={item.label} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: complianceColor(item.score) }}>
                    {item.score}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.score}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: complianceColor(item.score),
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            ))}

            <Divider sx={{ my: 2, borderColor: 'rgba(212,175,55,0.1)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Overall Score</Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 700, color: complianceColor(trader.compliance_score), fontFamily: "'Lora', serif" }}>
                {trader.compliance_score}%
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
