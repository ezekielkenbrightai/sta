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
  Token,
  Inventory,
  People,
  Water,
  Storefront,
  Code,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ── TypeScript Interfaces ────────────────────────────────────────────────────

interface TokenKpi {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface TokenizedAsset {
  symbol: string;
  name: string;
  org_name: string;
  commodity: string;
  totalTokens: number;
  pricePerToken: string;
  marketCap: number;
  change24h: number;
  holders: number;
  status: 'trading' | 'minting' | 'paused';
}

interface RecentTrade {
  id: string;
  asset: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: string;
  total: string;
  trader: string;
  org_name: string;
  timestamp: string;
}

interface SmartContract {
  name: string;
  address: string;
  network: string;
  status: 'deployed' | 'auditing' | 'pending';
  version: string;
  lastUpdated: string;
  gasUsed: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const KPIS: TokenKpi[] = [
  { label: 'Tokenized Assets', value: '24', change: 33.3, icon: <Token sx={{ fontSize: 18 }} />, color: '#D4AF37' },
  { label: 'Total Token Value', value: '$187M', change: 42.1, icon: <Inventory sx={{ fontSize: 18 }} />, color: '#22C55E' },
  { label: 'Token Holders', value: '8,421', change: 28.9, icon: <People sx={{ fontSize: 18 }} />, color: '#3B82F6' },
  { label: 'Liquidity Pool Depth', value: '$12.4M', change: 18.7, icon: <Water sx={{ fontSize: 18 }} />, color: '#8B5CF6' },
];

const ASSET_REGISTRY: TokenizedAsset[] = [
  { symbol: 'tCOF', name: 'Kenya AA Coffee', org_name: 'Nairobi Exports Ltd', commodity: 'Coffee', totalTokens: 5_000_000, pricePerToken: '$4.82', marketCap: 24_100_000, change24h: 2.3, holders: 1847, status: 'trading' },
  { symbol: 'tTEA', name: 'Kenya Purple Tea', org_name: 'Nairobi Exports Ltd', commodity: 'Tea', totalTokens: 8_000_000, pricePerToken: '$2.15', marketCap: 17_200_000, change24h: -0.8, holders: 1234, status: 'trading' },
  { symbol: 'tGLD', name: 'East Africa Gold', org_name: 'EAC Digital Assets', commodity: 'Gold', totalTokens: 1_000_000, pricePerToken: '$68.40', marketCap: 68_400_000, change24h: 1.1, holders: 2341, status: 'trading' },
  { symbol: 'tCSH', name: 'Kilifi Cashews', org_name: 'Kilifi Cashew Ltd', commodity: 'Cashew Nuts', totalTokens: 3_000_000, pricePerToken: '$3.20', marketCap: 9_600_000, change24h: 4.7, holders: 567, status: 'trading' },
  { symbol: 'tSIS', name: 'Tanzania Sisal', org_name: 'Dar Capital Ventures', commodity: 'Sisal', totalTokens: 6_000_000, pricePerToken: '$1.45', marketCap: 8_700_000, change24h: -1.2, holders: 423, status: 'trading' },
  { symbol: 'tCOL', name: 'DRC Coltan', org_name: 'EAC Digital Assets', commodity: 'Coltan', totalTokens: 500_000, pricePerToken: '$112.00', marketCap: 56_000_000, change24h: 3.8, holders: 1892, status: 'minting' },
  { symbol: 'tVAN', name: 'Uganda Vanilla', org_name: 'Kampala Investment Fund', commodity: 'Vanilla', totalTokens: 2_000_000, pricePerToken: '$5.60', marketCap: 11_200_000, change24h: 0.5, holders: 312, status: 'minting' },
  { symbol: 'tPYR', name: 'Rwanda Pyrethrum', org_name: 'Nairobi Exports Ltd', commodity: 'Pyrethrum', totalTokens: 4_000_000, pricePerToken: '$0.00', marketCap: 0, change24h: 0, holders: 0, status: 'paused' },
];

const RECENT_TRADES: RecentTrade[] = [
  { id: 'TRD-001', asset: 'Kenya AA Coffee', symbol: 'tCOF', type: 'buy', quantity: 12500, price: '$4.82', total: '$60,250', trader: 'Nairobi Exports Ltd', org_name: 'Nairobi Exports Ltd', timestamp: '3 min ago' },
  { id: 'TRD-002', asset: 'East Africa Gold', symbol: 'tGLD', type: 'sell', quantity: 800, price: '$68.40', total: '$54,720', trader: 'Kampala Investment Fund', org_name: 'Kampala Investment Fund', timestamp: '8 min ago' },
  { id: 'TRD-003', asset: 'DRC Coltan', symbol: 'tCOL', type: 'buy', quantity: 250, price: '$112.00', total: '$28,000', trader: 'EAC Digital Assets', org_name: 'EAC Digital Assets', timestamp: '15 min ago' },
  { id: 'TRD-004', asset: 'Kenya Purple Tea', symbol: 'tTEA', type: 'buy', quantity: 45000, price: '$2.15', total: '$96,750', trader: 'Nairobi Exports Ltd', org_name: 'Nairobi Exports Ltd', timestamp: '22 min ago' },
  { id: 'TRD-005', asset: 'Kilifi Cashews', symbol: 'tCSH', type: 'sell', quantity: 8000, price: '$3.20', total: '$25,600', trader: 'Coast Finance Ltd', org_name: 'Coast Finance Ltd', timestamp: '31 min ago' },
  { id: 'TRD-006', asset: 'Tanzania Sisal', symbol: 'tSIS', type: 'buy', quantity: 20000, price: '$1.45', total: '$29,000', trader: 'Dar Capital Ventures', org_name: 'Dar Capital Ventures', timestamp: '45 min ago' },
];

const SMART_CONTRACTS: SmartContract[] = [
  { name: 'STA Token Factory', address: '0x7A3f...E821', network: 'Ethereum L2', status: 'deployed', version: 'v2.1.0', lastUpdated: '2026-01-15', gasUsed: '2.4M' },
  { name: 'Commodity Oracle', address: '0x9B2C...D445', network: 'Ethereum L2', status: 'deployed', version: 'v1.3.2', lastUpdated: '2026-02-01', gasUsed: '890K' },
  { name: 'Liquidity Pool Router', address: '0x4D1E...F932', network: 'Ethereum L2', status: 'deployed', version: 'v1.0.1', lastUpdated: '2026-02-10', gasUsed: '1.2M' },
  { name: 'Cross-Chain Bridge (BSC)', address: '0x6C8A...B017', network: 'BSC', status: 'auditing', version: 'v0.9.0', lastUpdated: '2026-02-18', gasUsed: '—' },
  { name: 'KYC Registry', address: '0x2E5F...A773', network: 'Ethereum L2', status: 'deployed', version: 'v1.1.0', lastUpdated: '2026-01-28', gasUsed: '560K' },
  { name: 'Governance Module', address: '0x1F3D...C289', network: 'Ethereum L2', status: 'pending', version: 'v0.5.0', lastUpdated: '—', gasUsed: '—' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatUSD(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

const ASSET_STATUS: Record<string, { color: string; bg: string }> = {
  trading: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  minting: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  paused: { color: '#888', bg: 'rgba(136,136,136,0.08)' },
};

const CONTRACT_STATUS: Record<string, { color: string; bg: string }> = {
  deployed: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  auditing: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
  pending: { color: '#888', bg: 'rgba(136,136,136,0.08)' },
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TokenizationPage() {
  const { filterByOrgName } = useDataIsolation();

  const visibleAssets = useMemo(
    () => filterByOrgName(ASSET_REGISTRY, 'org_name'),
    [filterByOrgName],
  );

  const visibleTrades = useMemo(
    () => filterByOrgName(RECENT_TRADES, 'org_name'),
    [filterByOrgName],
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Token sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Asset Tokenization</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Tokenize African commodities and trade assets on distributed ledger infrastructure with real-time marketplace analytics.
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
        {/* Asset Registry */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, mb: 2 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <Inventory sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Commodity Token Registry
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {visibleAssets.map((a) => {
                const as = ASSET_STATUS[a.status];
                const maxMktCap = 68_400_000;
                return (
                  <Box key={a.symbol} sx={{ p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.06)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={a.symbol} size="small" sx={{ fontSize: 10, height: 18, fontWeight: 700, color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)', fontFamily: 'monospace' }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{a.name}</Typography>
                        <Chip label={a.status} size="small" sx={{ fontSize: 9, height: 16, color: as.color, backgroundColor: as.bg }} />
                      </Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#D4AF37', fontFamily: "'Lora', serif" }}>{a.pricePerToken}</Typography>
                    </Box>
                    <Grid container spacing={1} sx={{ mt: 0.25 }}>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Market Cap</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{formatUSD(a.marketCap)}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>24h Change</Typography>
                        <Typography sx={{ fontSize: 11, color: a.change24h >= 0 ? '#22C55E' : '#EF4444', fontFamily: 'monospace' }}>
                          {a.change24h >= 0 ? '+' : ''}{a.change24h}%
                        </Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Holders</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{a.holders.toLocaleString()}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Supply</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{(a.totalTokens / 1_000_000).toFixed(1)}M</Typography>
                      </Grid>
                    </Grid>
                    {a.marketCap > 0 && (
                      <LinearProgress
                        variant="determinate"
                        value={(a.marketCap / maxMktCap) * 100}
                        sx={{
                          mt: 1, height: 3, borderRadius: 2,
                          backgroundColor: 'rgba(212,175,55,0.06)',
                          '& .MuiLinearProgress-bar': { backgroundColor: '#D4AF37', borderRadius: 2 },
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Token Marketplace / Recent Trades */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <Storefront sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Recent Token Trades
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {visibleTrades.map((t) => (
                  <Box key={t.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Box sx={{
                      width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      backgroundColor: t.type === 'buy' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    }}>
                      <Typography sx={{ fontSize: 10, fontWeight: 700, color: t.type === 'buy' ? '#22C55E' : '#EF4444' }}>
                        {t.type === 'buy' ? 'B' : 'S'}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{t.symbol}</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>{t.quantity.toLocaleString()} @ {t.price}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>{t.trader}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0', fontFamily: "'Lora', serif" }}>{t.total}</Typography>
                      <Typography sx={{ fontSize: 9, color: '#555' }}>{t.timestamp}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Smart Contract Deployment Status */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
                <Code sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Smart Contract Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {SMART_CONTRACTS.map((sc) => {
                  const cs = CONTRACT_STATUS[sc.status];
                  return (
                    <Box key={sc.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cs.color, flexShrink: 0 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 12, color: '#f0f0f0' }}>{sc.name}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.25 }}>
                          <Typography sx={{ fontSize: 10, color: '#D4AF37', fontFamily: 'monospace' }}>{sc.address}</Typography>
                          <Typography sx={{ fontSize: 10, color: '#555' }}>{sc.network}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <Chip label={sc.status} size="small" sx={{ fontSize: 9, height: 16, color: cs.color, backgroundColor: cs.bg }} />
                        <Typography sx={{ fontSize: 9, color: '#555', mt: 0.25 }}>{sc.version}</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
