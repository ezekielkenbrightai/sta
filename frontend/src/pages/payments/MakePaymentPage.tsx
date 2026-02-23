import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import {
  Send,
  Receipt,
  CheckCircle,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface OutstandingAssessment {
  id: string;
  reference: string;
  document_type: string;
  total_tax: number;
  due_date: string;
  status: 'pending' | 'overdue';
}

const OUTSTANDING: OutstandingAssessment[] = [
  { id: 'ta-002', reference: 'KE-2026-0041', document_type: 'Import Declaration', total_tax: 12750, due_date: '2026-03-01', status: 'pending' },
  { id: 'ta-003', reference: 'KE-2026-0040', document_type: 'Import Declaration', total_tax: 156000, due_date: '2026-02-15', status: 'overdue' },
  { id: 'ta-006', reference: 'KE-2026-0033', document_type: 'Export Certificate', total_tax: 31200, due_date: '2026-03-05', status: 'pending' },
  { id: 'ta-007', reference: 'KE-2026-0029', document_type: 'Import Declaration', total_tax: 8450, due_date: '2026-03-10', status: 'pending' },
];

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer (RTGS/EFT)', description: '1-2 business days' },
  { value: 'mobile_money', label: 'Mobile Money (M-Pesa)', description: 'Instant settlement' },
  { value: 'card', label: 'Visa / Mastercard', description: 'Instant processing' },
  { value: 'stablecoins', label: 'Stable Coins (Digital KES)', description: 'Instant atomic settlement' },
];

const STEPS = ['Select Assessment', 'Payment Details', 'Confirm & Pay'];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  overdue: { label: 'Overdue', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MakePaymentPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  const selected = OUTSTANDING.find((a) => a.id === selectedAssessment);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Send sx={{ color: '#D4AF37' }} />
        <Typography variant="h4">Make Payment</Typography>
      </Box>
      <Typography sx={{ color: 'text.secondary', mb: 3 }}>
        Pay outstanding tax assessments and trade-related fees.
      </Typography>

      {/* Stepper */}
      <Card sx={{ p: 2.5, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': { fontSize: 13, color: '#b0b0b0' },
                  '& .MuiStepLabel-label.Mui-active': { color: '#D4AF37' },
                  '& .MuiStepLabel-label.Mui-completed': { color: '#22C55E' },
                  '& .MuiStepIcon-root.Mui-active': { color: '#D4AF37' },
                  '& .MuiStepIcon-root.Mui-completed': { color: '#22C55E' },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

      <Grid container spacing={3}>
        {/* Main content */}
        <Grid size={{ xs: 12, md: 8 }}>
          {activeStep === 0 && (
            <Card sx={{ overflow: 'hidden' }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Outstanding Assessments</Typography>
                <Typography sx={{ fontSize: 12, color: '#777' }}>Select an assessment to pay</Typography>
              </Box>
              {OUTSTANDING.map((a) => {
                const sts = STATUS_CONFIG[a.status];
                const isSelected = selectedAssessment === a.id;
                return (
                  <Box
                    key={a.id}
                    onClick={() => setSelectedAssessment(a.id)}
                    sx={{
                      px: 2.5, py: 2,
                      borderBottom: '1px solid rgba(212,175,55,0.05)',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(212,175,55,0.08)' : 'transparent',
                      borderLeft: isSelected ? '3px solid #D4AF37' : '3px solid transparent',
                      '&:hover': { backgroundColor: 'rgba(212,175,55,0.05)' },
                      transition: 'all 0.15s',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Receipt sx={{ fontSize: 16, color: '#D4AF37' }} />
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#D4AF37' }}>{a.reference}</Typography>
                        <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: sts.bg, color: sts.color }} />
                      </Box>
                      <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#f0f0f0' }}>KSh {a.total_tax.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, pl: 3.5 }}>
                      <Typography sx={{ fontSize: 12, color: '#777' }}>{a.document_type}</Typography>
                      <Typography sx={{ fontSize: 12, color: a.status === 'overdue' ? '#EF4444' : '#999' }}>Due: {a.due_date}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Card>
          )}

          {activeStep === 1 && (
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Payment Method</Typography>
              <TextField
                fullWidth select size="small"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label="Select payment method"
                sx={{ mb: 3 }}
              >
                {PAYMENT_METHODS.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    <Box>
                      <Typography sx={{ fontSize: 13 }}>{m.label}</Typography>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>{m.description}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              {paymentMethod === 'bank_transfer' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField fullWidth size="small" label="Bank Name" defaultValue="Kenya Commercial Bank" />
                  <TextField fullWidth size="small" label="Account Number" placeholder="Enter bank account number" />
                  <TextField fullWidth size="small" label="Branch Code" placeholder="Enter branch code" />
                </Box>
              )}
              {paymentMethod === 'mobile_money' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField fullWidth size="small" label="M-Pesa Phone Number" placeholder="+254 7XX XXX XXX" />
                </Box>
              )}
              {paymentMethod === 'card' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField fullWidth size="small" label="Cardholder Name" placeholder="Name on card" />
                  <TextField fullWidth size="small" label="Card Number" placeholder="XXXX XXXX XXXX XXXX" />
                  <Grid container spacing={2}>
                    <Grid size={6}><TextField fullWidth size="small" label="Expiry" placeholder="MM/YY" /></Grid>
                    <Grid size={6}><TextField fullWidth size="small" label="CVV" placeholder="XXX" /></Grid>
                  </Grid>
                </Box>
              )}
              {paymentMethod === 'stablecoins' && (
                <Box sx={{ p: 2, borderRadius: 1, backgroundColor: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <Typography sx={{ fontSize: 13, color: '#8B5CF6', fontWeight: 600, mb: 0.5 }}>Stable Coins Payment</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>
                    Payment will be settled atomically via the Stable Coins network.
                    Funds will be deducted from your Digital KES wallet instantly.
                  </Typography>
                </Box>
              )}
            </Card>
          )}

          {activeStep === 2 && selected && (
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <CheckCircle sx={{ fontSize: 48, color: '#22C55E', mb: 1 }} />
                <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#f0f0f0' }}>Confirm Payment</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                {[
                  { label: 'Assessment', value: selected.reference },
                  { label: 'Document', value: selected.document_type },
                  { label: 'Amount', value: `KSh ${selected.total_tax.toLocaleString()}`, bold: true },
                  { label: 'Method', value: PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label || '' },
                ].map((row) => (
                  <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Typography sx={{ fontSize: 13, color: '#777' }}>{row.label}</Typography>
                    <Typography sx={{ fontSize: 13, color: '#f0f0f0', fontWeight: row.bold ? 700 : 400 }}>{row.value}</Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ borderColor: 'rgba(212,175,55,0.1)', mb: 2 }} />
              <Typography sx={{ fontSize: 11, color: '#555', textAlign: 'center' }}>
                By confirming, you authorize the Kenya Revenue Authority to debit the amount above.
              </Typography>
            </Card>
          )}
        </Grid>

        {/* Summary sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2.5, position: 'sticky', top: 80 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Payment Summary</Typography>
            {selected ? (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Assessment</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>{selected.reference}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Type</Typography>
                    <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{selected.document_type}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Due Date</Typography>
                    <Typography sx={{ fontSize: 13, color: selected.status === 'overdue' ? '#EF4444' : '#f0f0f0' }}>{selected.due_date}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ borderColor: 'rgba(212,175,55,0.1)', mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontSize: 14, color: '#f0f0f0' }}>Total Due</Typography>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, fontFamily: "'Lora', serif", color: '#D4AF37' }}>
                    KSh {selected.total_tax.toLocaleString()}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography sx={{ fontSize: 13, color: '#777', textAlign: 'center', py: 3 }}>
                Select an assessment to continue
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
              {activeStep > 0 && (
                <Button
                  variant="outlined" fullWidth
                  onClick={() => setActiveStep((s) => s - 1)}
                  sx={{ borderColor: 'rgba(212,175,55,0.3)', color: '#b0b0b0' }}
                >
                  Back
                </Button>
              )}
              <Button
                variant="contained" fullWidth
                disabled={!selected || (activeStep === 2)}
                onClick={() => setActiveStep((s) => s + 1)}
                startIcon={activeStep === 2 ? <Send /> : undefined}
              >
                {activeStep === 2 ? 'Pay Now' : 'Continue'}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
