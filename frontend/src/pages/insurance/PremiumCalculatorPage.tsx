import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  MenuItem,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import {
  Calculate,
  ArrowForward,
} from '@mui/icons-material';

// ─── Rate tables ─────────────────────────────────────────────────────────────

interface RateEntry {
  id: string;
  type: string;
  base_rate: number; // percentage
  description: string;
}

const BASE_RATES: RateEntry[] = [
  { id: 'marine_cargo', type: 'Marine Cargo', base_rate: 1.2, description: 'Ocean freight, containerized cargo' },
  { id: 'inland_transit', type: 'Inland Transit', base_rate: 0.8, description: 'Road/rail domestic transport' },
  { id: 'warehouse_stock', type: 'Warehouse Stock', base_rate: 0.5, description: 'Warehoused goods, fire & theft' },
  { id: 'trade_credit', type: 'Trade Credit', base_rate: 2.0, description: 'Buyer default / non-payment' },
  { id: 'political_risk', type: 'Political Risk', base_rate: 1.8, description: 'Expropriation, currency transfer' },
];

interface Modifier {
  label: string;
  key: string;
  options: { value: number; label: string }[];
  defaultIndex: number;
}

const MODIFIERS: Modifier[] = [
  {
    label: 'Cargo Fragility',
    key: 'fragility',
    options: [
      { value: -0.15, label: 'Robust (steel, cement)' },
      { value: 0, label: 'Standard' },
      { value: 0.2, label: 'Fragile (electronics)' },
      { value: 0.35, label: 'Very Fragile (pharma cold chain)' },
    ],
    defaultIndex: 1,
  },
  {
    label: 'Route Risk',
    key: 'route_risk',
    options: [
      { value: -0.1, label: 'Low (intra-EAC short haul)' },
      { value: 0, label: 'Standard' },
      { value: 0.25, label: 'Elevated (Gulf of Aden)' },
      { value: 0.5, label: 'High (conflict zone transit)' },
    ],
    defaultIndex: 1,
  },
  {
    label: 'Trader History',
    key: 'trader_history',
    options: [
      { value: -0.2, label: 'Gold (5+ yr, 0 claims)' },
      { value: -0.1, label: 'Silver (3+ yr, low claims)' },
      { value: 0, label: 'Standard' },
      { value: 0.15, label: 'New / Limited history' },
      { value: 0.3, label: 'Red-flagged' },
    ],
    defaultIndex: 2,
  },
  {
    label: 'Security Measures',
    key: 'security',
    options: [
      { value: -0.15, label: 'GPS + tamper-proof + escort' },
      { value: -0.08, label: 'GPS tracking only' },
      { value: 0, label: 'Standard container seal' },
      { value: 0.1, label: 'No tracking / open cargo' },
    ],
    defaultIndex: 2,
  },
];

interface SavedQuote {
  id: string;
  type: string;
  cargoValue: number;
  premium: number;
  rate: number;
  date: string;
}

const RECENT_QUOTES: SavedQuote[] = [
  { id: 'q-001', type: 'Marine Cargo', cargoValue: 250000, premium: 3750, rate: 1.5, date: '2026-02-22' },
  { id: 'q-002', type: 'Trade Credit', cargoValue: 500000, premium: 12500, rate: 2.5, date: '2026-02-21' },
  { id: 'q-003', type: 'Inland Transit', cargoValue: 80000, premium: 560, rate: 0.7, date: '2026-02-21' },
  { id: 'q-004', type: 'Marine Cargo', cargoValue: 1200000, premium: 26400, rate: 2.2, date: '2026-02-20' },
  { id: 'q-005', type: 'Warehouse Stock', cargoValue: 2000000, premium: 10000, rate: 0.5, date: '2026-02-20' },
];

function formatUSD(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
  return `$${v.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PremiumCalculatorPage() {
  const [selectedType, setSelectedType] = useState('marine_cargo');
  const [cargoValue, setCargoValue] = useState(250000);
  const [deductiblePct, setDeductiblePct] = useState(2);
  const [modifierSelections, setModifierSelections] = useState<Record<string, number>>(
    () => Object.fromEntries(MODIFIERS.map((m) => [m.key, m.defaultIndex])),
  );

  const baseRate = useMemo(() => BASE_RATES.find((r) => r.id === selectedType)?.base_rate ?? 1.0, [selectedType]);

  const totalModifier = useMemo(() => {
    return MODIFIERS.reduce((sum, mod) => {
      const idx = modifierSelections[mod.key] ?? mod.defaultIndex;
      return sum + mod.options[idx].value;
    }, 0);
  }, [modifierSelections]);

  const effectiveRate = useMemo(() => Math.max(0.1, baseRate + totalModifier), [baseRate, totalModifier]);
  const annualPremium = useMemo(() => cargoValue * effectiveRate / 100, [cargoValue, effectiveRate]);
  const deductibleAmount = useMemo(() => cargoValue * deductiblePct / 100, [cargoValue, deductiblePct]);
  const coverageAmount = useMemo(() => cargoValue - deductibleAmount, [cargoValue, deductibleAmount]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Calculate sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Premium Calculator</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Estimate insurance premiums based on cargo type, value, route risk, and trader history.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Calculator Panel */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Configure Quote</Typography>

            {/* Insurance Type */}
            <TextField
              fullWidth select size="small" label="Insurance Type"
              value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
              sx={{ mb: 2.5 }}
            >
              {BASE_RATES.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{r.type}</span>
                    <Typography component="span" sx={{ fontSize: 12, color: '#D4AF37', ml: 2 }}>Base: {r.base_rate}%</Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            {/* Cargo Value */}
            <Typography sx={{ fontSize: 12, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>Cargo Value (USD)</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Slider
                min={10000} max={5000000} step={10000}
                value={cargoValue} onChange={(_, v) => setCargoValue(v as number)}
                sx={{ flex: 1, color: '#D4AF37' }}
              />
              <TextField
                size="small" type="number" value={cargoValue}
                onChange={(e) => setCargoValue(Math.max(0, Number(e.target.value)))}
                sx={{ width: 140 }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
              {[50000, 250000, 500000, 1000000, 2500000].map((v) => (
                <Chip
                  key={v} label={formatUSD(v)} size="small"
                  onClick={() => setCargoValue(v)}
                  sx={{ fontSize: 10, cursor: 'pointer', color: cargoValue === v ? '#D4AF37' : '#777', backgroundColor: cargoValue === v ? 'rgba(212,175,55,0.12)' : 'rgba(212,175,55,0.04)' }}
                />
              ))}
            </Box>

            {/* Deductible */}
            <Typography sx={{ fontSize: 12, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>Deductible ({deductiblePct}%)</Typography>
            <Slider
              min={0} max={10} step={0.5}
              value={deductiblePct} onChange={(_, v) => setDeductiblePct(v as number)}
              marks={[{ value: 0, label: '0%' }, { value: 2, label: '2%' }, { value: 5, label: '5%' }, { value: 10, label: '10%' }]}
              sx={{ mb: 3, color: '#D4AF37', '& .MuiSlider-markLabel': { fontSize: 10, color: '#555' } }}
            />

            {/* Risk Modifiers */}
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Risk Modifiers</Typography>
            {MODIFIERS.map((mod) => {
              const idx = modifierSelections[mod.key] ?? mod.defaultIndex;
              const val = mod.options[idx].value;
              return (
                <Box key={mod.key} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{mod.label}</Typography>
                    <Typography sx={{ fontSize: 12, fontFamily: 'monospace', color: val > 0 ? '#EF4444' : val < 0 ? '#22C55E' : '#555' }}>
                      {val > 0 ? '+' : ''}{val.toFixed(2)}%
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth select size="small" value={idx}
                    onChange={(e) => setModifierSelections((s) => ({ ...s, [mod.key]: Number(e.target.value) }))}
                  >
                    {mod.options.map((opt, i) => (
                      <MenuItem key={i} value={i}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{opt.label}</span>
                          <Typography component="span" sx={{ fontSize: 11, color: opt.value > 0 ? '#EF4444' : opt.value < 0 ? '#22C55E' : '#555', ml: 2, fontFamily: 'monospace' }}>
                            {opt.value > 0 ? '+' : ''}{opt.value.toFixed(2)}%
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              );
            })}

            <Button variant="contained" fullWidth startIcon={<ArrowForward />} sx={{ mt: 1 }}>
              Generate Formal Quote
            </Button>
          </Card>
        </Grid>

        {/* Results Panel */}
        <Grid size={{ xs: 12, lg: 5 }}>
          {/* Premium Result */}
          <Card sx={{ p: 3, mb: 2, border: '1px solid rgba(212,175,55,0.15)' }}>
            <Typography sx={{ fontSize: 12, color: '#555', textTransform: 'uppercase', mb: 1 }}>Estimated Annual Premium</Typography>
            <Typography sx={{ fontSize: 36, fontWeight: 700, fontFamily: "'Lora', serif", color: '#D4AF37', lineHeight: 1, mb: 1 }}>
              {formatUSD(annualPremium)}
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#777', mb: 2 }}>
              {effectiveRate.toFixed(2)}% effective rate on {formatUSD(cargoValue)} cargo value
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { label: 'Base Rate', value: `${baseRate.toFixed(2)}%`, color: '#3B82F6' },
                { label: 'Total Modifiers', value: `${totalModifier > 0 ? '+' : ''}${totalModifier.toFixed(2)}%`, color: totalModifier > 0 ? '#EF4444' : totalModifier < 0 ? '#22C55E' : '#555' },
                { label: 'Effective Rate', value: `${effectiveRate.toFixed(2)}%`, color: '#D4AF37' },
              ].map((row) => (
                <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{row.label}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace', color: row.color }}>{row.value}</Typography>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Coverage Summary */}
          <Card sx={{ p: 2.5, mb: 2 }}>
            <Typography sx={{ fontSize: 12, color: '#555', textTransform: 'uppercase', mb: 1.5 }}>Coverage Summary</Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Cargo Value</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700, fontFamily: "'Lora', serif", color: '#f0f0f0' }}>{formatUSD(cargoValue)}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Net Coverage</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700, fontFamily: "'Lora', serif", color: '#22C55E' }}>{formatUSD(coverageAmount)}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Deductible</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700, fontFamily: "'Lora', serif", color: '#E6A817' }}>{formatUSD(deductibleAmount)}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Annual Premium</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700, fontFamily: "'Lora', serif", color: '#D4AF37' }}>{formatUSD(annualPremium)}</Typography>
              </Grid>
            </Grid>
          </Card>

          {/* Per-Month */}
          <Card sx={{ p: 2.5, mb: 2 }}>
            <Typography sx={{ fontSize: 12, color: '#555', textTransform: 'uppercase', mb: 1 }}>Payment Options</Typography>
            {[
              { label: 'Annual (1 payment)', amount: annualPremium, savings: null },
              { label: 'Semi-Annual (2 payments)', amount: annualPremium * 0.52, savings: null },
              { label: 'Quarterly (4 payments)', amount: annualPremium * 0.26, savings: null },
              { label: 'Monthly (12 payments)', amount: annualPremium / 11.5, savings: null },
            ].map((opt) => (
              <Box key={opt.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{opt.label}</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace', color: '#f0f0f0' }}>{formatUSD(opt.amount)}</Typography>
              </Box>
            ))}
          </Card>

          {/* Recent Quotes */}
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: '#555', textTransform: 'uppercase', mb: 1.5 }}>Recent Quotes</Typography>
            {RECENT_QUOTES.map((q) => (
              <Box key={q.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{q.type}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>{formatUSD(q.cargoValue)} @ {q.rate}%</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace', color: '#D4AF37' }}>{formatUSD(q.premium)}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>{q.date}</Typography>
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
