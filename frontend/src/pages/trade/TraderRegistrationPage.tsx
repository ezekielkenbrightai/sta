import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
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
  ArrowBack,
  NavigateBefore,
  NavigateNext,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

const COUNTRIES = [
  'Kenya', 'Nigeria', 'South Africa', 'Tanzania', 'Uganda', 'Rwanda',
  'Ghana', 'Egypt', 'Ethiopia',
];

const STEPS = ['Company Details', 'Contact Info', 'Trade Profile', 'Review'];

export default function TraderRegistrationPage() {
  const navigate = useNavigate();
  const { orgName, user } = useDataIsolation();
  const [activeStep, setActiveStep] = useState(0);

  // Step 1 — prefill from user context when available
  const [companyName, setCompanyName] = useState(orgName || '');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [country, setCountry] = useState('');
  const [taxPin, setTaxPin] = useState('');
  const [address, setAddress] = useState('');

  // Step 2 — prefill from user context
  const [contactName, setContactName] = useState(
    user ? `${user.first_name} ${user.last_name}`.trim() : '',
  );
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');

  // Step 3
  const [traderType, setTraderType] = useState('both');
  const [primaryGoods, setPrimaryGoods] = useState('');
  const [annualVolume, setAnnualVolume] = useState('');

  const handleSubmit = () => {
    navigate('/trade/traders');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <IconButton onClick={() => navigate('/trade/traders')} size="small" sx={{ color: '#b0b0b0' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">Register New Trader</Typography>
      </Box>
      <Typography sx={{ color: 'text.secondary', mb: 3, ml: 5.5 }}>
        Register a new importer/exporter on the platform.
      </Typography>

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

      <Card sx={{ p: 3, mb: 3 }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Company Details</Typography>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Registration Number" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth select label="Country" value={country} onChange={(e) => setCountry(e.target.value)}>
                  {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Tax PIN / TIN" value={taxPin} onChange={(e) => setTaxPin(e.target.value)} />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="Physical Address" value={address} onChange={(e) => setAddress(e.target.value)} multiline rows={2} />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Contact Information</Typography>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Contact Person" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Email Address" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Phone Number" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+254 7XX XXX XXX" />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Trade Profile</Typography>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth select label="Trader Type" value={traderType} onChange={(e) => setTraderType(e.target.value)}>
                  <MenuItem value="importer">Importer</MenuItem>
                  <MenuItem value="exporter">Exporter</MenuItem>
                  <MenuItem value="both">Both (Import & Export)</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Estimated Annual Volume (USD)" type="number" value={annualVolume} onChange={(e) => setAnnualVolume(e.target.value)} />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="Primary Goods / Services" value={primaryGoods} onChange={(e) => setPrimaryGoods(e.target.value)} multiline rows={2} placeholder="e.g. Agricultural products, electronics, textiles..." />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Review Registration</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#777', textTransform: 'uppercase', mb: 1 }}>Company</Typography>
                {[
                  ['Company Name', companyName || '—'],
                  ['Registration #', registrationNumber || '—'],
                  ['Country', country || '—'],
                  ['Tax PIN', taxPin || '—'],
                  ['Address', address || '—'],
                ].map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Typography sx={{ fontSize: 13, color: '#999' }}>{label}</Typography>
                    <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{value}</Typography>
                  </Box>
                ))}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#777', textTransform: 'uppercase', mb: 1 }}>Contact & Trade</Typography>
                {[
                  ['Contact', contactName || '—'],
                  ['Email', contactEmail || '—'],
                  ['Phone', contactPhone || '—'],
                  ['Type', traderType === 'both' ? 'Import & Export' : traderType],
                  ['Annual Volume', annualVolume ? `$${parseInt(annualVolume).toLocaleString()}` : '—'],
                ].map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Typography sx={{ fontSize: 13, color: '#999' }}>{label}</Typography>
                    <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{value}</Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>

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
        {activeStep < STEPS.length - 1 ? (
          <Button variant="contained" endIcon={<NavigateNext />} onClick={() => setActiveStep((s) => s + 1)}>
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={handleSubmit}>
            Submit Registration
          </Button>
        )}
      </Box>
    </Box>
  );
}
