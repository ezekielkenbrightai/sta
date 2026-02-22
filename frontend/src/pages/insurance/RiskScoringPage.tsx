import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  InputAdornment,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  Security,
  Search as SearchIcon,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface RiskAssessment {
  id: string;
  trader: string;
  trade_doc_ref: string;
  route: string;
  cargo_type: string;
  cargo_value_usd: number;
  transport_mode: 'sea' | 'air' | 'road' | 'rail';
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'very_high';
  factors: { name: string; score: number; max: number; impact: 'positive' | 'neutral' | 'negative' }[];
  recommended_premium_rate: number;
  last_assessed: string;
}

const MOCK_ASSESSMENTS: RiskAssessment[] = [
  {
    id: 'ra-001', trader: 'Kenya Pharma Distributors', trade_doc_ref: 'TD-2026-1842', route: 'Mumbai → Mombasa', cargo_type: 'Pharmaceuticals (cold chain)', cargo_value_usd: 250000, transport_mode: 'sea', risk_score: 62, risk_level: 'medium',
    factors: [
      { name: 'Route Piracy Risk', score: 4, max: 10, impact: 'negative' },
      { name: 'Cargo Perishability', score: 7, max: 10, impact: 'negative' },
      { name: 'Trader History', score: 2, max: 10, impact: 'positive' },
      { name: 'Carrier Rating', score: 3, max: 10, impact: 'positive' },
      { name: 'Port Congestion', score: 5, max: 10, impact: 'neutral' },
    ],
    recommended_premium_rate: 1.5, last_assessed: '2026-02-22',
  },
  {
    id: 'ra-002', trader: 'Lagos Electronics Ltd', trade_doc_ref: 'TD-2026-1838', route: 'Tokyo → Mombasa', cargo_type: 'Consumer Electronics', cargo_value_usd: 800000, transport_mode: 'sea', risk_score: 78, risk_level: 'high',
    factors: [
      { name: 'High-Value Target', score: 8, max: 10, impact: 'negative' },
      { name: 'Theft History (Port)', score: 7, max: 10, impact: 'negative' },
      { name: 'Trader History', score: 4, max: 10, impact: 'neutral' },
      { name: 'Long Transit Time', score: 6, max: 10, impact: 'negative' },
      { name: 'Container Security', score: 3, max: 10, impact: 'positive' },
    ],
    recommended_premium_rate: 2.0, last_assessed: '2026-02-22',
  },
  {
    id: 'ra-003', trader: 'Nairobi Exports Ltd', trade_doc_ref: 'TD-2026-1841', route: 'Mombasa → Dar es Salaam', cargo_type: 'Tea & Coffee', cargo_value_usd: 120000, transport_mode: 'sea', risk_score: 28, risk_level: 'low',
    factors: [
      { name: 'Short Route', score: 2, max: 10, impact: 'positive' },
      { name: 'Non-Perishable', score: 1, max: 10, impact: 'positive' },
      { name: 'Trusted Trader (Gold)', score: 1, max: 10, impact: 'positive' },
      { name: 'Low Theft Risk', score: 2, max: 10, impact: 'positive' },
      { name: 'Seasonal Weather', score: 3, max: 10, impact: 'neutral' },
    ],
    recommended_premium_rate: 0.8, last_assessed: '2026-02-21',
  },
  {
    id: 'ra-004', trader: 'Auto Kenya Ltd', trade_doc_ref: 'TD-2026-1835', route: 'Durban → Mombasa', cargo_type: 'Used Motor Vehicles', cargo_value_usd: 450000, transport_mode: 'sea', risk_score: 55, risk_level: 'medium',
    factors: [
      { name: 'Depreciation Risk', score: 5, max: 10, impact: 'negative' },
      { name: 'Damage in Transit', score: 4, max: 10, impact: 'neutral' },
      { name: 'Customs Delay Risk', score: 6, max: 10, impact: 'negative' },
      { name: 'Carrier Rating', score: 3, max: 10, impact: 'positive' },
      { name: 'Market Volatility', score: 4, max: 10, impact: 'neutral' },
    ],
    recommended_premium_rate: 1.2, last_assessed: '2026-02-21',
  },
  {
    id: 'ra-005', trader: 'Dar es Salaam Freight', trade_doc_ref: 'TD-2026-1834', route: 'Dubai → Mombasa → Dar', cargo_type: 'Steel Pipes', cargo_value_usd: 600000, transport_mode: 'sea', risk_score: 85, risk_level: 'very_high',
    factors: [
      { name: 'Weight Discrepancy', score: 9, max: 10, impact: 'negative' },
      { name: 'Origin Risk (Re-export)', score: 8, max: 10, impact: 'negative' },
      { name: 'Trader Red Flags', score: 7, max: 10, impact: 'negative' },
      { name: 'Documentation Issues', score: 8, max: 10, impact: 'negative' },
      { name: 'Sanctions Screening', score: 6, max: 10, impact: 'negative' },
    ],
    recommended_premium_rate: 3.5, last_assessed: '2026-02-20',
  },
  {
    id: 'ra-006', trader: 'East Africa Cement Ltd', trade_doc_ref: 'TD-2026-1840', route: 'Mombasa → Nairobi (SGR)', cargo_type: 'Cement & Steel', cargo_value_usd: 150000, transport_mode: 'rail', risk_score: 35, risk_level: 'low',
    factors: [
      { name: 'Rail Safety', score: 2, max: 10, impact: 'positive' },
      { name: 'Non-Fragile Cargo', score: 1, max: 10, impact: 'positive' },
      { name: 'Short Distance', score: 2, max: 10, impact: 'positive' },
      { name: 'Weather Exposure', score: 4, max: 10, impact: 'neutral' },
      { name: 'Handling Risk', score: 3, max: 10, impact: 'neutral' },
    ],
    recommended_premium_rate: 0.9, last_assessed: '2026-02-20',
  },
];

const RISK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Low Risk', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  medium: { label: 'Medium Risk', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  high: { label: 'High Risk', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  very_high: { label: 'Very High', color: '#DC2626', bg: 'rgba(220,38,38,0.15)' },
};

const IMPACT_COLORS: Record<string, string> = {
  positive: '#22C55E',
  neutral: '#E6A817',
  negative: '#EF4444',
};

function formatUSD(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

function scoreColor(score: number): string {
  if (score <= 35) return '#22C55E';
  if (score <= 60) return '#E6A817';
  if (score <= 80) return '#EF4444';
  return '#DC2626';
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RiskScoringPage() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_ASSESSMENTS.filter((a) => {
      if (riskFilter !== 'all' && a.risk_level !== riskFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.trader.toLowerCase().includes(q) || a.cargo_type.toLowerCase().includes(q) || a.route.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, riskFilter]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Security sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Risk Scoring</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          AI-powered cargo and trade risk assessment for underwriting decisions.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Assessed', value: MOCK_ASSESSMENTS.length.toString(), color: '#D4AF37' },
          { label: 'Low Risk', value: MOCK_ASSESSMENTS.filter((a) => a.risk_level === 'low').length.toString(), color: '#22C55E' },
          { label: 'Medium Risk', value: MOCK_ASSESSMENTS.filter((a) => a.risk_level === 'medium').length.toString(), color: '#E6A817' },
          { label: 'High / Very High', value: MOCK_ASSESSMENTS.filter((a) => ['high', 'very_high'].includes(a.risk_level)).length.toString(), color: '#EF4444' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 7 }}>
            <TextField
              fullWidth size="small"
              placeholder="Search trader, cargo type, or route..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField fullWidth size="small" select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} label="Risk Level">
              <MenuItem value="all">All Levels</MenuItem>
              {Object.entries(RISK_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Assessment Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map((a) => {
          const risk = RISK_CONFIG[a.risk_level];
          return (
            <Card key={a.id} sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{a.trader}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#555' }}>({a.trade_doc_ref})</Typography>
                    <Chip label={risk.label} size="small" sx={{ fontSize: 9, height: 20, color: risk.color, backgroundColor: risk.bg, fontWeight: 600 }} />
                  </Box>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{a.cargo_type} — {a.route}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#555' }}>Value: {formatUSD(a.cargo_value_usd)} | Mode: {a.transport_mode} | Assessed: {a.last_assessed}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                  <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: "'Lora', serif", color: scoreColor(a.risk_score), lineHeight: 1 }}>{a.risk_score}</Typography>
                  <Typography sx={{ fontSize: 9, color: '#555', textTransform: 'uppercase' }}>Risk Score</Typography>
                </Box>
              </Box>

              {/* Risk Factors */}
              <Typography sx={{ fontSize: 11, color: '#555', textTransform: 'uppercase', mb: 1 }}>Risk Factors</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {a.factors.map((f) => (
                  <Box key={f.name} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0', width: 160, flexShrink: 0 }}>{f.name}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(f.score / f.max) * 100}
                      sx={{
                        flex: 1, height: 6, borderRadius: 3, maxWidth: 200,
                        backgroundColor: 'rgba(212,175,55,0.08)',
                        '& .MuiLinearProgress-bar': { backgroundColor: IMPACT_COLORS[f.impact], borderRadius: 3 },
                      }}
                    />
                    <Typography sx={{ fontSize: 11, color: IMPACT_COLORS[f.impact], width: 40, fontFamily: 'monospace' }}>{f.score}/{f.max}</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(212,175,55,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, color: '#555' }}>
                  Recommended premium rate: <Box component="span" sx={{ color: '#D4AF37', fontWeight: 600 }}>{a.recommended_premium_rate}%</Box>
                  <Box component="span" sx={{ color: '#777', ml: 1 }}>({formatUSD(a.cargo_value_usd * a.recommended_premium_rate / 100)} annual premium)</Box>
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filtered.length} of {MOCK_ASSESSMENTS.length} risk assessments
        </Typography>
      </Box>
    </Box>
  );
}
