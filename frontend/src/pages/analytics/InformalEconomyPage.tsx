import { useMemo } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  Storefront,
  TrendingUp,
  People,
  MoneyOff,
  LocationOn,
  ArrowForward,
  EmojiEvents,
  CardGiftcard,
} from '@mui/icons-material';

// ─── Types ───────────────────────────────────────────────────────────────────

interface InformalKPI {
  label: string;
  value: string;
  change: number;
  color: string;
  icon: React.ReactNode;
}

interface BorderCrossing {
  id: string;
  name: string;
  country_a: string;
  flag_a: string;
  country_b: string;
  flag_b: string;
  official_volume_usd: number;
  estimated_informal_usd: number;
  informal_pct: number;
  daily_crossings: number;
  monitored: boolean;
}

interface PipelineStage {
  stage: string;
  count: number;
  pct: number;
  color: string;
  description: string;
}

interface IncentiveProgram {
  id: string;
  name: string;
  target: string;
  enrolled: number;
  converted: number;
  conversion_rate: number;
  benefit: string;
  status: 'active' | 'planned' | 'completed';
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const BORDER_CROSSINGS: BorderCrossing[] = [
  { id: 'bc1', name: 'Busia', country_a: 'Kenya', flag_a: '🇰🇪', country_b: 'Uganda', flag_b: '🇺🇬', official_volume_usd: 145_000_000, estimated_informal_usd: 89_000_000, informal_pct: 38.0, daily_crossings: 2_340, monitored: true },
  { id: 'bc2', name: 'Malaba', country_a: 'Kenya', flag_a: '🇰🇪', country_b: 'Uganda', flag_b: '🇺🇬', official_volume_usd: 112_000_000, estimated_informal_usd: 67_000_000, informal_pct: 37.4, daily_crossings: 1_870, monitored: true },
  { id: 'bc3', name: 'Namanga', country_a: 'Kenya', flag_a: '🇰🇪', country_b: 'Tanzania', flag_b: '🇹🇿', official_volume_usd: 98_000_000, estimated_informal_usd: 78_000_000, informal_pct: 44.3, daily_crossings: 1_560, monitored: true },
  { id: 'bc4', name: 'Gatuna/Katuna', country_a: 'Rwanda', flag_a: '🇷🇼', country_b: 'Uganda', flag_b: '🇺🇬', official_volume_usd: 67_000_000, estimated_informal_usd: 45_000_000, informal_pct: 40.2, daily_crossings: 890, monitored: false },
  { id: 'bc5', name: 'Rusumo', country_a: 'Rwanda', flag_a: '🇷🇼', country_b: 'Tanzania', flag_b: '🇹🇿', official_volume_usd: 34_000_000, estimated_informal_usd: 56_000_000, informal_pct: 62.2, daily_crossings: 1_240, monitored: false },
  { id: 'bc6', name: 'Moyale', country_a: 'Kenya', flag_a: '🇰🇪', country_b: 'Ethiopia', flag_b: '🇪🇹', official_volume_usd: 52_000_000, estimated_informal_usd: 87_000_000, informal_pct: 62.6, daily_crossings: 1_890, monitored: false },
  { id: 'bc7', name: 'Taveta/Holili', country_a: 'Kenya', flag_a: '🇰🇪', country_b: 'Tanzania', flag_b: '🇹🇿', official_volume_usd: 28_000_000, estimated_informal_usd: 41_000_000, informal_pct: 59.4, daily_crossings: 720, monitored: false },
  { id: 'bc8', name: 'Kasumbalesa', country_a: 'DRC', flag_a: '🇨🇩', country_b: 'Zambia', flag_b: '🇿🇲', official_volume_usd: 89_000_000, estimated_informal_usd: 123_000_000, informal_pct: 58.0, daily_crossings: 3_450, monitored: true },
];

const PIPELINE_STAGES: PipelineStage[] = [
  { stage: 'Identified', count: 12_847, pct: 100, color: '#555', description: 'Informal traders detected via border monitoring and market surveys' },
  { stage: 'Contacted', count: 7_234, pct: 56.3, color: '#E6A817', description: 'Outreach conducted via mobile SMS, community leaders, and field agents' },
  { stage: 'Onboarding', count: 3_891, pct: 30.3, color: '#3B82F6', description: 'Currently completing simplified registration and KYC process' },
  { stage: 'Registered', count: 2_156, pct: 16.8, color: '#22C55E', description: 'Successfully formalized with ICBT simplified trade regime clearance' },
];

const INCENTIVE_PROGRAMS: IncentiveProgram[] = [
  { id: 'ip1', name: 'Simplified Trade Regime (STR)', target: 'Small-scale cross-border traders', enrolled: 4_567, converted: 1_823, conversion_rate: 39.9, benefit: 'Reduced documentation, duty-free threshold up to $2,000', status: 'active' },
  { id: 'ip2', name: 'Mobile Money Integration', target: 'Market women and informal traders', enrolled: 3_289, converted: 1_456, conversion_rate: 44.3, benefit: 'Pay duties via M-Pesa/MTN MoMo, instant receipts', status: 'active' },
  { id: 'ip3', name: 'AfCFTA ICBT Protocol', target: 'Informal cross-border traders under AfCFTA', enrolled: 2_134, converted: 678, conversion_rate: 31.8, benefit: 'Preferential tariff access and trade facilitation', status: 'active' },
  { id: 'ip4', name: 'Border Market Cooperatives', target: 'Trader groups at major border crossings', enrolled: 1_567, converted: 912, conversion_rate: 58.2, benefit: 'Group registration, shared logistics, access to trade finance', status: 'active' },
  { id: 'ip5', name: 'Digital Trade Certificate Pilot', target: 'Technology-literate informal traders', enrolled: 890, converted: 234, conversion_rate: 26.3, benefit: 'QR-code based trade certificates via smartphone app', status: 'planned' },
];

function formatUSD(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function InformalEconomyPage() {
  const totalInformal = useMemo(() => BORDER_CROSSINGS.reduce((s, c) => s + c.estimated_informal_usd, 0), []);
  const totalOfficial = useMemo(() => BORDER_CROSSINGS.reduce((s, c) => s + c.official_volume_usd, 0), []);
  const registrationRate = ((PIPELINE_STAGES[3].count / PIPELINE_STAGES[0].count) * 100).toFixed(1);
  const conversionRate = ((PIPELINE_STAGES[3].count / PIPELINE_STAGES[1].count) * 100).toFixed(1);
  const revenueGap = useMemo(() => totalInformal * 0.12, []); // ~12% average duty rate

  const kpis: InformalKPI[] = [
    { label: 'Est. Informal Trade', value: formatUSD(totalInformal), change: -4.2, color: '#D4AF37', icon: <Storefront sx={{ fontSize: 18 }} /> },
    { label: 'Registration Rate', value: `${registrationRate}%`, change: 3.8, color: '#22C55E', icon: <People sx={{ fontSize: 18 }} /> },
    { label: 'Conversion Rate', value: `${conversionRate}%`, change: 7.1, color: '#3B82F6', icon: <TrendingUp sx={{ fontSize: 18 }} /> },
    { label: 'Revenue Gap', value: formatUSD(revenueGap), change: -6.3, color: '#EF4444', icon: <MoneyOff sx={{ fontSize: 18 }} /> },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Storefront sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Informal Economy Tracker</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Monitoring informal cross-border trade, formalization pipelines, and incentive programs across East Africa.
        </Typography>
      </Box>

      {/* Top KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((k) => (
          <Grid size={{ xs: 6, md: 3 }} key={k.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <Box sx={{ color: k.color }}>{k.icon}</Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{k.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: k.color }}>{k.value}</Typography>
              <Typography sx={{ fontSize: 11, color: k.label === 'Est. Informal Trade' || k.label === 'Revenue Gap' ? (k.change < 0 ? '#22C55E' : '#EF4444') : (k.change > 0 ? '#22C55E' : '#EF4444') }}>
                {k.change > 0 ? '+' : ''}{k.change}% vs last month
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Border Crossing Analysis */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>
                <LocationOn sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Border Crossing Analysis
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography sx={{ fontSize: 11, color: '#555' }}>Official: {formatUSD(totalOfficial)}</Typography>
                <Typography sx={{ fontSize: 11, color: '#E6A817' }}>Informal: {formatUSD(totalInformal)}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {BORDER_CROSSINGS.map((bc) => (
                <Box key={bc.id} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography sx={{ fontSize: 14 }}>{bc.flag_a}</Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{bc.name}</Typography>
                      <Typography sx={{ fontSize: 14 }}>{bc.flag_b}</Typography>
                      {bc.monitored && <Chip label="Monitored" size="small" sx={{ fontSize: 8, height: 14, color: '#22C55E', backgroundColor: 'rgba(34,197,94,0.08)' }} />}
                      {!bc.monitored && <Chip label="Unmonitored" size="small" sx={{ fontSize: 8, height: 14, color: '#E6A817', backgroundColor: 'rgba(230,168,23,0.08)' }} />}
                    </Box>
                    <Typography sx={{ fontSize: 11, color: bc.informal_pct >= 50 ? '#EF4444' : '#E6A817', fontWeight: 600 }}>{bc.informal_pct}% informal</Typography>
                  </Box>
                  <Grid container spacing={1.5}>
                    <Grid size={3}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Official</Typography>
                      <Typography sx={{ fontSize: 12, color: '#22C55E', fontFamily: 'monospace' }}>{formatUSD(bc.official_volume_usd)}</Typography>
                    </Grid>
                    <Grid size={3}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Informal</Typography>
                      <Typography sx={{ fontSize: 12, color: '#E6A817', fontFamily: 'monospace' }}>{formatUSD(bc.estimated_informal_usd)}</Typography>
                    </Grid>
                    <Grid size={3}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Daily Crossings</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{bc.daily_crossings.toLocaleString()}</Typography>
                    </Grid>
                    <Grid size={3}>
                      <Box sx={{ mt: 0.5 }}>
                        <LinearProgress
                          variant="determinate"
                          value={100 - bc.informal_pct}
                          sx={{
                            height: 6, borderRadius: 3,
                            backgroundColor: 'rgba(230,168,23,0.2)',
                            '& .MuiLinearProgress-bar': { backgroundColor: '#22C55E', borderRadius: 3 },
                          }}
                        />
                        <Typography sx={{ fontSize: 9, color: '#555', mt: 0.25 }}>formalized</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Formalization Pipeline */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <ArrowForward sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Formalization Pipeline
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {PIPELINE_STAGES.map((ps, idx) => (
                  <Box key={ps.stage}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: ps.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{idx + 1}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>{ps.stage}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, fontFamily: "'Lora', serif", color: ps.color === '#555' ? '#b0b0b0' : ps.color }}>{ps.count.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={ps.pct}
                        sx={{
                          flex: 1, height: 8, borderRadius: 4,
                          backgroundColor: 'rgba(212,175,55,0.08)',
                          '& .MuiLinearProgress-bar': { backgroundColor: ps.color, borderRadius: 4 },
                        }}
                      />
                      <Typography sx={{ fontSize: 10, color: '#777', fontFamily: 'monospace', minWidth: 40, textAlign: 'right' }}>{ps.pct}%</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 11, color: '#555' }}>{ps.description}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Incentive Programs */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <CardGiftcard sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Incentive Programs
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {INCENTIVE_PROGRAMS.map((ip) => (
                  <Box key={ip.id} sx={{ p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.06)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                          <EmojiEvents sx={{ fontSize: 14, color: '#D4AF37' }} />
                          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{ip.name}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{ip.target}</Typography>
                      </Box>
                      <Chip
                        label={ip.status}
                        size="small"
                        sx={{
                          fontSize: 8, height: 16, textTransform: 'uppercase',
                          color: ip.status === 'active' ? '#22C55E' : ip.status === 'planned' ? '#3B82F6' : '#888',
                          backgroundColor: ip.status === 'active' ? 'rgba(34,197,94,0.08)' : ip.status === 'planned' ? 'rgba(59,130,246,0.08)' : 'rgba(136,136,136,0.08)',
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 0.5 }}>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>Enrolled: <Box component="span" sx={{ color: '#b0b0b0' }}>{ip.enrolled.toLocaleString()}</Box></Typography>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>Converted: <Box component="span" sx={{ color: '#22C55E' }}>{ip.converted.toLocaleString()}</Box></Typography>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>Rate: <Box component="span" sx={{ color: '#D4AF37', fontWeight: 600 }}>{ip.conversion_rate}%</Box></Typography>
                    </Box>
                    <Typography sx={{ fontSize: 10, color: '#666', fontStyle: 'italic' }}>{ip.benefit}</Typography>
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
