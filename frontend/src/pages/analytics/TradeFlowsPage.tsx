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
  SwapHoriz,
  LocalShipping,
  AccessTime,
  Category,
  Public,
  CompareArrows,
} from '@mui/icons-material';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TradeCorridor {
  id: string;
  origin: string;
  origin_flag: string;
  destination: string;
  destination_flag: string;
  volume_usd: number;
  shipments: number;
  avg_transit_days: number;
  top_commodity: string;
  trend: number;
}

interface HSCategoryBreakdown {
  code: string;
  category: string;
  value_usd: number;
  share_pct: number;
  yoy_change: number;
  color: string;
}

interface TradeFlowKPI {
  label: string;
  value: string;
  change: number;
  color: string;
  icon: React.ReactNode;
}

interface TradeSplit {
  label: string;
  value_usd: number;
  pct: number;
  color: string;
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const TRADE_CORRIDORS: TradeCorridor[] = [
  { id: 'tc1', origin: 'Kenya', origin_flag: '🇰🇪', destination: 'Uganda', destination_flag: '🇺🇬', volume_usd: 287_000_000, shipments: 4_823, avg_transit_days: 3.2, top_commodity: 'Petroleum Products', trend: 14.3 },
  { id: 'tc2', origin: 'Tanzania', origin_flag: '🇹🇿', destination: 'DRC', destination_flag: '🇨🇩', volume_usd: 198_000_000, shipments: 2_912, avg_transit_days: 5.7, top_commodity: 'Manufactured Goods', trend: 9.1 },
  { id: 'tc3', origin: 'Ethiopia', origin_flag: '🇪🇹', destination: 'Kenya', destination_flag: '🇰🇪', volume_usd: 156_000_000, shipments: 1_847, avg_transit_days: 4.1, top_commodity: 'Coffee & Tea', trend: 22.8 },
  { id: 'tc4', origin: 'Rwanda', origin_flag: '🇷🇼', destination: 'Tanzania', destination_flag: '🇹🇿', volume_usd: 112_000_000, shipments: 1_234, avg_transit_days: 2.8, top_commodity: 'Minerals & Ores', trend: 18.5 },
  { id: 'tc5', origin: 'Uganda', origin_flag: '🇺🇬', destination: 'South Sudan', destination_flag: '🇸🇸', volume_usd: 89_000_000, shipments: 987, avg_transit_days: 6.4, top_commodity: 'Food Products', trend: -3.2 },
  { id: 'tc6', origin: 'Kenya', origin_flag: '🇰🇪', destination: 'Tanzania', destination_flag: '🇹🇿', volume_usd: 234_000_000, shipments: 3_678, avg_transit_days: 2.1, top_commodity: 'Chemicals', trend: 11.7 },
  { id: 'tc7', origin: 'DRC', origin_flag: '🇨🇩', destination: 'Rwanda', destination_flag: '🇷🇼', volume_usd: 145_000_000, shipments: 1_567, avg_transit_days: 3.9, top_commodity: 'Coltan & Minerals', trend: 27.4 },
  { id: 'tc8', origin: 'Ethiopia', origin_flag: '🇪🇹', destination: 'Djibouti', destination_flag: '🇩🇯', volume_usd: 178_000_000, shipments: 2_345, avg_transit_days: 1.5, top_commodity: 'Agricultural Products', trend: 6.9 },
];

const HS_CATEGORIES: HSCategoryBreakdown[] = [
  { code: '27', category: 'Mineral Fuels & Oils', value_usd: 412_000_000, share_pct: 22.4, yoy_change: 8.3, color: '#D4AF37' },
  { code: '09', category: 'Coffee, Tea, Spices', value_usd: 287_000_000, share_pct: 15.6, yoy_change: 14.7, color: '#22C55E' },
  { code: '72', category: 'Iron & Steel', value_usd: 198_000_000, share_pct: 10.8, yoy_change: -2.1, color: '#3B82F6' },
  { code: '84', category: 'Machinery & Equipment', value_usd: 176_000_000, share_pct: 9.6, yoy_change: 11.4, color: '#8B5CF6' },
  { code: '85', category: 'Electrical Equipment', value_usd: 145_000_000, share_pct: 7.9, yoy_change: 19.2, color: '#E6A817' },
  { code: '26', category: 'Ores, Slag & Ash', value_usd: 134_000_000, share_pct: 7.3, yoy_change: 27.8, color: '#EF4444' },
  { code: '10', category: 'Cereals', value_usd: 112_000_000, share_pct: 6.1, yoy_change: 5.6, color: '#14B8A6' },
  { code: '87', category: 'Motor Vehicles', value_usd: 98_000_000, share_pct: 5.3, yoy_change: -8.4, color: '#F97316' },
  { code: '30', category: 'Pharmaceutical Products', value_usd: 87_000_000, share_pct: 4.7, yoy_change: 12.3, color: '#EC4899' },
  { code: '15', category: 'Animal/Vegetable Fats', value_usd: 67_000_000, share_pct: 3.6, yoy_change: 3.9, color: '#6366F1' },
];

const TRADE_SPLIT: TradeSplit[] = [
  { label: 'Intra-Africa (AfCFTA)', value_usd: 987_000_000, pct: 42.3, color: '#D4AF37' },
  { label: 'Extra-Africa Imports', value_usd: 845_000_000, pct: 36.2, color: '#3B82F6' },
  { label: 'Extra-Africa Exports', value_usd: 502_000_000, pct: 21.5, color: '#22C55E' },
];

function formatUSD(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TradeFlowsPage() {
  const totalTradeValue = useMemo(() => TRADE_CORRIDORS.reduce((s, c) => s + c.volume_usd, 0), []);
  const activeCorridors = TRADE_CORRIDORS.length;
  const avgTransit = useMemo(() => (TRADE_CORRIDORS.reduce((s, c) => s + c.avg_transit_days, 0) / TRADE_CORRIDORS.length).toFixed(1), []);

  const kpis: TradeFlowKPI[] = [
    { label: 'Total Trade Value', value: formatUSD(totalTradeValue), change: 13.8, color: '#D4AF37', icon: <SwapHoriz sx={{ fontSize: 18 }} /> },
    { label: 'Active Corridors', value: `${activeCorridors}`, change: 4.2, color: '#3B82F6', icon: <CompareArrows sx={{ fontSize: 18 }} /> },
    { label: 'Avg Transit Time', value: `${avgTransit} days`, change: -12.5, color: '#22C55E', icon: <AccessTime sx={{ fontSize: 18 }} /> },
    { label: 'Top Commodity', value: 'Mineral Fuels', change: 8.3, color: '#8B5CF6', icon: <Category sx={{ fontSize: 18 }} /> },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <SwapHoriz sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Trade Flows</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Cross-border trade corridor analysis, commodity flows, and intra-Africa trade monitoring.
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
              <Typography sx={{ fontSize: 11, color: k.change > 0 ? '#22C55E' : '#EF4444' }}>
                {k.change > 0 ? '+' : ''}{k.change}% vs last month
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Trade Corridor Table */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>
                <LocalShipping sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Trade Corridors (MTD)
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#555' }}>{activeCorridors} corridors active</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {TRADE_CORRIDORS.map((c) => (
                <Box key={c.id} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography sx={{ fontSize: 14 }}>{c.origin_flag}</Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{c.origin}</Typography>
                      <CompareArrows sx={{ fontSize: 14, color: '#D4AF37' }} />
                      <Typography sx={{ fontSize: 14 }}>{c.destination_flag}</Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{c.destination}</Typography>
                      <Chip label={`${c.trend > 0 ? '+' : ''}${c.trend}%`} size="small" sx={{ fontSize: 9, height: 16, color: c.trend > 0 ? '#22C55E' : '#EF4444', backgroundColor: c.trend > 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)' }} />
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#D4AF37', fontFamily: "'Lora', serif" }}>{formatUSD(c.volume_usd)}</Typography>
                  </Box>
                  <Grid container spacing={1.5}>
                    <Grid size={3}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Shipments</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace' }}>{c.shipments.toLocaleString()}</Typography>
                    </Grid>
                    <Grid size={3}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Transit</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.avg_transit_days} days</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Top Commodity</Typography>
                      <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.top_commodity}</Typography>
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
            {/* HS Code Category Breakdown */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <Category sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                HS Code Category Breakdown (Top 10)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {HS_CATEGORIES.map((h) => (
                  <Box key={h.code} sx={{ pb: 1, borderBottom: '1px solid rgba(212,175,55,0.03)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: h.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>HS {h.code}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#e0e0e0', fontWeight: 500 }}>{h.category}</Typography>
                      </Box>
                      <Chip label={`${h.yoy_change > 0 ? '+' : ''}${h.yoy_change}%`} size="small" sx={{ fontSize: 9, height: 16, color: h.yoy_change > 0 ? '#22C55E' : '#EF4444', backgroundColor: h.yoy_change > 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={h.share_pct}
                        sx={{
                          flex: 1, height: 5, borderRadius: 3,
                          backgroundColor: 'rgba(212,175,55,0.08)',
                          '& .MuiLinearProgress-bar': { backgroundColor: h.color, borderRadius: 3 },
                        }}
                      />
                      <Typography sx={{ fontSize: 10, color: '#777', fontFamily: 'monospace', minWidth: 55, textAlign: 'right' }}>{formatUSD(h.value_usd)}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Intra vs Extra Africa */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <Public sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Intra-Africa vs Extra-Africa Trade
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {TRADE_SPLIT.map((t) => (
                  <Box key={t.label}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: t.color }} />
                        <Typography sx={{ fontSize: 12, color: '#e0e0e0' }}>{t.label}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: t.color, fontFamily: "'Lora', serif" }}>{formatUSD(t.value_usd)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={t.pct}
                        sx={{
                          flex: 1, height: 10, borderRadius: 5,
                          backgroundColor: 'rgba(212,175,55,0.08)',
                          '& .MuiLinearProgress-bar': { backgroundColor: t.color, borderRadius: 5 },
                        }}
                      />
                      <Typography sx={{ fontSize: 11, color: '#888', fontFamily: 'monospace', minWidth: 40, textAlign: 'right' }}>{t.pct}%</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 2, p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>
                  Intra-Africa trade accounts for <Box component="span" sx={{ color: '#D4AF37', fontWeight: 600 }}>42.3%</Box> of total trade volume, up from 38.1% last year. AfCFTA implementation is driving regional integration.
                </Typography>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
