import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Edit,
  Print,
  Share,
} from '@mui/icons-material';

// ─── Mock detail data ────────────────────────────────────────────────────────

const MOCK_DOC = {
  id: 'td-001',
  reference_number: 'KE-2026-0042',
  type: 'import' as const,
  status: 'assessed' as const,
  trader_name: 'Nairobi Exports Ltd',
  trader_id: 'o-nex',
  origin_country: 'China',
  destination_country: 'Kenya',
  total_value: 245000,
  currency: 'USD',
  incoterms: 'CIF',
  port_of_entry: 'Mombasa Port',
  shipping_method: 'Sea Freight',
  vessel_name: 'MV Pacific Star',
  bill_of_lading: 'BL-2026-88432',
  created_at: '2026-02-20T10:30:00Z',
  updated_at: '2026-02-21T15:45:00Z',
  items: [
    { id: 'ti-1', hs_code: '8471.30', description: 'Portable digital computers (laptops)', quantity: 500, unit: 'pcs', unit_value: 350, total_value: 175000, origin_country: 'China', duty_rate: 0 },
    { id: 'ti-2', hs_code: '6109.10', description: 'T-shirts, cotton', quantity: 2000, unit: 'pcs', unit_value: 15, total_value: 30000, origin_country: 'China', duty_rate: 35 },
    { id: 'ti-3', hs_code: '8703.23', description: 'Motor vehicle spare parts', quantity: 100, unit: 'pcs', unit_value: 400, total_value: 40000, origin_country: 'China', duty_rate: 25 },
  ],
  tax_assessment: {
    customs_duty: 27500,
    vat: 43520,
    excise_duty: 0,
    withholding_tax: 2450,
    total_tax: 73470,
    status: 'pending',
  },
};

const STATUSES_ORDER = ['draft', 'submitted', 'under_review', 'verified', 'assessed', 'paid', 'cleared', 'completed'];

const STATUS_COLORS: Record<string, string> = {
  draft: '#999',
  submitted: '#3B82F6',
  under_review: '#E6A817',
  verified: '#8B5CF6',
  assessed: '#F59E0B',
  paid: '#22C55E',
  cleared: '#06B6D4',
  completed: '#10B981',
  rejected: '#EF4444',
};

function formatCurrency(val: number, cur: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, minimumFractionDigits: 0 }).format(val);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TradeDocumentDetailPage() {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const doc = MOCK_DOC; // In production, fetch by id

  const activeStep = useMemo(() => {
    const idx = STATUSES_ORDER.indexOf(doc.status);
    return idx >= 0 ? idx : 0;
  }, [doc.status]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <IconButton onClick={() => navigate('/trade/documents')} size="small" sx={{ color: '#b0b0b0' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">{doc.reference_number}</Typography>
        <Chip
          label={doc.status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          size="small"
          sx={{
            ml: 1,
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: `${STATUS_COLORS[doc.status]}15`,
            color: STATUS_COLORS[doc.status],
          }}
        />
      </Box>
      <Typography sx={{ color: 'text.secondary', mb: 3, ml: 5.5 }}>
        {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} document &middot; Created {formatDate(doc.created_at)}
      </Typography>

      {/* Progress stepper */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STATUSES_ORDER.map((s) => (
            <Step key={s} completed={STATUSES_ORDER.indexOf(s) < activeStep}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': { fontSize: 11, color: '#999' },
                  '& .Mui-active .MuiStepLabel-label': { color: '#D4AF37', fontWeight: 600 },
                  '& .Mui-completed .MuiStepLabel-label': { color: '#22C55E' },
                }}
              >
                {s.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

      <Grid container spacing={3}>
        {/* Left: Details */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Document Info */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Document Information</Typography>
            <Grid container spacing={2}>
              {[
                ['Reference', doc.reference_number],
                ['Type', doc.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())],
                ['Trader', doc.trader_name],
                ['Incoterms', doc.incoterms],
                ['Origin', doc.origin_country],
                ['Destination', doc.destination_country],
                ['Port of Entry', doc.port_of_entry],
                ['Shipping Method', doc.shipping_method],
                ['Vessel', doc.vessel_name],
                ['Bill of Lading', doc.bill_of_lading],
                ['Total Value', formatCurrency(doc.total_value, doc.currency)],
                ['Currency', doc.currency],
              ].map(([label, value]) => (
                <Grid size={{ xs: 6, md: 4 }} key={label}>
                  <Typography sx={{ fontSize: 11, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>
                    {label}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#f0f0f0' }}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Card>

          {/* Line Items */}
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ p: 3, pb: 2 }}>
              <Typography variant="h6">Line Items ({doc.items.length})</Typography>
            </Box>

            {/* Table header */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 80px 80px 100px 100px 70px',
                gap: 1,
                px: 3,
                py: 1,
                borderBottom: '1px solid rgba(212,175,55,0.1)',
                backgroundColor: 'rgba(212,175,55,0.03)',
              }}
            >
              {['HS Code', 'Description', 'Qty', 'Unit', 'Unit Value', 'Total', 'Duty %'].map((h) => (
                <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>
                  {h}
                </Typography>
              ))}
            </Box>

            {doc.items.map((item, i) => (
              <Box
                key={item.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr 80px 80px 100px 100px 70px',
                  gap: 1,
                  px: 3,
                  py: 1.5,
                  borderBottom: i < doc.items.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ fontSize: 13, color: '#D4AF37', fontFamily: 'monospace' }}>
                  {item.hs_code}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{item.description}</Typography>
                <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{item.quantity.toLocaleString()}</Typography>
                <Typography sx={{ fontSize: 13, color: '#999' }}>{item.unit}</Typography>
                <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>${item.unit_value.toLocaleString()}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>${item.total_value.toLocaleString()}</Typography>
                <Typography sx={{ fontSize: 13, color: item.duty_rate > 0 ? '#E6A817' : '#22C55E' }}>
                  {item.duty_rate}%
                </Typography>
              </Box>
            ))}

            {/* Total row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 80px 80px 100px 100px 70px',
                gap: 1,
                px: 3,
                py: 2,
                borderTop: '1px solid rgba(212,175,55,0.15)',
                backgroundColor: 'rgba(212,175,55,0.03)',
              }}
            >
              <Typography />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#f0f0f0' }}>TOTAL</Typography>
              <Typography />
              <Typography />
              <Typography />
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#D4AF37' }}>
                {formatCurrency(doc.total_value, doc.currency)}
              </Typography>
              <Typography />
            </Box>
          </Card>
        </Grid>

        {/* Right: Tax + Actions */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Tax Assessment */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Tax Assessment</Typography>
            {[
              ['Customs Duty', doc.tax_assessment.customs_duty],
              ['VAT (16%)', doc.tax_assessment.vat],
              ['Excise Duty', doc.tax_assessment.excise_duty],
              ['Withholding Tax', doc.tax_assessment.withholding_tax],
            ].map(([label, value]) => (
              <Box key={label as string} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.25, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                <Typography sx={{ fontSize: 13, color: '#b0b0b0' }}>{label}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0' }}>
                  {formatCurrency(value as number, 'KES')}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1.5, borderColor: 'rgba(212,175,55,0.15)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#f0f0f0' }}>Total Tax</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#D4AF37', fontFamily: "'Lora', serif" }}>
                {formatCurrency(doc.tax_assessment.total_tax, 'KES')}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2.5 }}
              onClick={() => navigate('/tax/payments')}
            >
              Pay Tax Assessment
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Actions</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="outlined" startIcon={<Edit />} fullWidth sx={{ justifyContent: 'flex-start', color: '#b0b0b0', borderColor: 'rgba(212,175,55,0.2)' }}>
                Edit Document
              </Button>
              <Button variant="outlined" startIcon={<Download />} fullWidth sx={{ justifyContent: 'flex-start', color: '#b0b0b0', borderColor: 'rgba(212,175,55,0.2)' }}>
                Export PDF
              </Button>
              <Button variant="outlined" startIcon={<Print />} fullWidth sx={{ justifyContent: 'flex-start', color: '#b0b0b0', borderColor: 'rgba(212,175,55,0.2)' }}>
                Print
              </Button>
              <Button variant="outlined" startIcon={<Share />} fullWidth sx={{ justifyContent: 'flex-start', color: '#b0b0b0', borderColor: 'rgba(212,175,55,0.2)' }}>
                Share
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
