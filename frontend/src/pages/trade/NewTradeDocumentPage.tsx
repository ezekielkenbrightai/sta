import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack,
  Delete as DeleteIcon,
  NavigateBefore,
  NavigateNext,
  Save,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Constants ───────────────────────────────────────────────────────────────

const COUNTRIES = [
  'Kenya', 'Nigeria', 'South Africa', 'Tanzania', 'Uganda', 'Rwanda',
  'Ghana', 'Egypt', 'Ethiopia', 'Morocco', 'Algeria', 'Tunisia',
  'Senegal', "Cote d'Ivoire", 'Cameroon', 'DRC', 'Angola',
  'Mozambique', 'Zimbabwe', 'Zambia', 'Malawi', 'Botswana',
  'Namibia', 'Mauritius', 'Djibouti', 'Burundi', 'South Sudan', 'Madagascar',
];

const INCOTERMS = ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR', 'TZS', 'UGX', 'RWF', 'GHS', 'EGP', 'ETB'];
const SHIPPING_METHODS = ['Sea Freight', 'Air Freight', 'Road Transport', 'Rail Transport', 'Multi-modal'];

const STEPS = ['Document Details', 'Line Items', 'Shipping Info', 'Review & Submit'];

interface LineItem {
  id: number;
  hs_code: string;
  description: string;
  quantity: string;
  unit: string;
  unit_value: string;
  origin_country: string;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function NewTradeDocumentPage() {
  const navigate = useNavigate();
  const { orgName } = useDataIsolation();
  const [activeStep, setActiveStep] = useState(0);

  // Form state — Step 1: Document Details
  const [docType, setDocType] = useState('import');
  const [originCountry, setOriginCountry] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('Kenya');
  const [currency, setCurrency] = useState('USD');
  const [incoterms, setIncoterms] = useState('CIF');

  // Step 2: Line Items
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, hs_code: '', description: '', quantity: '', unit: 'pcs', unit_value: '', origin_country: '' },
  ]);

  // Step 3: Shipping Info
  const [shippingMethod, setShippingMethod] = useState('Sea Freight');
  const [portOfEntry, setPortOfEntry] = useState('');
  const [vesselName, setVesselName] = useState('');
  const [billOfLading, setBillOfLading] = useState('');
  const [estimatedArrival, setEstimatedArrival] = useState('');

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { id: Date.now(), hs_code: '', description: '', quantity: '', unit: 'pcs', unit_value: '', origin_country: '' },
    ]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: number, field: keyof LineItem, value: string) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const totalValue = lineItems.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const val = parseFloat(item.unit_value) || 0;
    return sum + qty * val;
  }, 0);

  const handleSubmit = () => {
    // Mock submit — in production would POST to API
    navigate('/trade/documents');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <IconButton onClick={() => navigate('/trade/documents')} size="small" sx={{ color: '#b0b0b0' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">New Trade Document</Typography>
      </Box>
      <Typography sx={{ color: 'text.secondary', mb: 3, ml: 5.5 }}>
        Create a new import/export trade document.
      </Typography>

      {/* Stepper */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel sx={{
                '& .MuiStepLabel-label': { fontSize: 12, color: '#999' },
                '& .Mui-active .MuiStepLabel-label': { color: '#D4AF37', fontWeight: 600 },
                '& .Mui-completed .MuiStepLabel-label': { color: '#22C55E' },
              }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

      {/* Step Content */}
      <Card sx={{ p: 3, mb: 3 }}>
        {/* Step 1: Document Details */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Document Details</Typography>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth select label="Document Type" value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <MenuItem value="import">Import</MenuItem>
                  <MenuItem value="export">Export</MenuItem>
                  <MenuItem value="transit">Transit</MenuItem>
                  <MenuItem value="re_export">Re-export</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth select label="Incoterms" value={incoterms}
                  onChange={(e) => setIncoterms(e.target.value)}
                >
                  {INCOTERMS.map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth select label="Origin Country" value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                >
                  {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth select label="Destination Country" value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                >
                  {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth select label="Currency" value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {CURRENCIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 2: Line Items */}
        {activeStep === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Line Items</Typography>
              <Button startIcon={<AddIcon />} onClick={addLineItem} size="small">
                Add Item
              </Button>
            </Box>

            {lineItems.map((item, idx) => (
              <Box key={item.id}>
                {idx > 0 && <Divider sx={{ my: 2, borderColor: 'rgba(212,175,55,0.1)' }} />}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Chip label={`Item ${idx + 1}`} size="small" sx={{ mr: 1, backgroundColor: 'rgba(212,175,55,0.1)', color: '#D4AF37', fontSize: 11 }} />
                  {lineItems.length > 1 && (
                    <IconButton size="small" onClick={() => removeLineItem(item.id)} sx={{ color: '#EF4444' }}>
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth size="small" label="HS Code" placeholder="e.g. 8471.30"
                      value={item.hs_code}
                      onChange={(e) => updateLineItem(item.id, 'hs_code', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <TextField
                      fullWidth size="small" label="Description"
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      fullWidth size="small" label="Quantity" type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                      fullWidth size="small" select label="Unit" value={item.unit}
                      onChange={(e) => updateLineItem(item.id, 'unit', e.target.value)}
                    >
                      {['pcs', 'kg', 'tonnes', 'litres', 'm3', 'sqm'].map((u) => (
                        <MenuItem key={u} value={u}>{u}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      fullWidth size="small" label={`Unit Value (${currency})`} type="number"
                      value={item.unit_value}
                      onChange={(e) => updateLineItem(item.id, 'unit_value', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <TextField
                      fullWidth size="small" select label="Country of Origin"
                      value={item.origin_country}
                      onChange={(e) => updateLineItem(item.id, 'origin_country', e.target.value)}
                    >
                      {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            ))}

            {/* Total */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(212,175,55,0.15)', display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, color: '#999' }}>Estimated Total:</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#D4AF37', fontFamily: "'Lora', serif" }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(totalValue)}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Step 3: Shipping Info */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Shipping Information</Typography>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth select label="Shipping Method" value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                >
                  {SHIPPING_METHODS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Port of Entry" value={portOfEntry}
                  onChange={(e) => setPortOfEntry(e.target.value)}
                  placeholder="e.g. Mombasa Port"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Vessel / Vehicle Name" value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Bill of Lading / AWB" value={billOfLading}
                  onChange={(e) => setBillOfLading(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Estimated Arrival" type="date" value={estimatedArrival}
                  onChange={(e) => setEstimatedArrival(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 4: Review */}
        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Review & Submit</Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#777', textTransform: 'uppercase', mb: 1 }}>
                  Document Summary
                </Typography>
                {[
                  ['Trader', orgName || '—'],
                  ['Type', docType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())],
                  ['Route', `${originCountry || '—'} → ${destinationCountry || '—'}`],
                  ['Currency', currency],
                  ['Incoterms', incoterms],
                  ['Items', lineItems.length.toString()],
                  ['Total Value', new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(totalValue)],
                ].map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Typography sx={{ fontSize: 13, color: '#999' }}>{label}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0' }}>{value}</Typography>
                  </Box>
                ))}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#777', textTransform: 'uppercase', mb: 1 }}>
                  Shipping Details
                </Typography>
                {[
                  ['Method', shippingMethod],
                  ['Port of Entry', portOfEntry || '—'],
                  ['Vessel', vesselName || '—'],
                  ['B/L Number', billOfLading || '—'],
                  ['Est. Arrival', estimatedArrival || '—'],
                ].map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Typography sx={{ fontSize: 13, color: '#999' }}>{label}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0' }}>{value}</Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>

      {/* Navigation buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          disabled={activeStep === 0}
          onClick={() => setActiveStep((s) => s - 1)}
          sx={{ color: '#b0b0b0', borderColor: 'rgba(212,175,55,0.2)' }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<Save />}
            sx={{ color: '#b0b0b0', borderColor: 'rgba(212,175,55,0.2)' }}
          >
            Save Draft
          </Button>
          {activeStep < STEPS.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<NavigateNext />}
              onClick={() => setActiveStep((s) => s + 1)}
            >
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit}>
              Submit Document
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
