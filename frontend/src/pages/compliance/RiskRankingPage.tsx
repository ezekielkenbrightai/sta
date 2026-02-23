import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  FactCheck,
  Search as SearchIcon,
  Visibility as ViewIcon,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  SCREENED_ENTITIES,
  RISK_TIER_CONFIG,
  STATUS_CONFIG,
  type ScreenedEntity,
} from './ComplianceDashboardPage';

// ─── Page ────────────────────────────────────────────────────────────────────

type SortField = 'riskScore' | 'name' | 'lastScreened';
type SortDir = 'asc' | 'desc';

export default function RiskRankingPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filtered = useMemo(() => {
    let result = [...SCREENED_ENTITIES];

    if (tierFilter !== 'all') result = result.filter((e) => e.riskTier === tierFilter);
    if (statusFilter !== 'all') result = result.filter((e) => e.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) =>
        e.name.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q) ||
        e.industry.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'riskScore') cmp = a.riskScore - b.riskScore;
      else if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else cmp = a.lastScreened.localeCompare(b.lastScreened);
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [search, tierFilter, statusFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'desc'
      ? <ArrowDownward sx={{ fontSize: 12, color: '#D4AF37' }} />
      : <ArrowUpward sx={{ fontSize: 12, color: '#D4AF37' }} />;
  };

  // Risk distribution stats
  const tierStats = (['low', 'medium', 'high', 'critical'] as const).map((tier) => ({
    tier,
    count: SCREENED_ENTITIES.filter((e) => e.riskTier === tier).length,
    totalExposure: SCREENED_ENTITIES.filter((e) => e.riskTier === tier).reduce((s, e) => s + e.riskScore, 0),
  }));

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <FactCheck sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Risk Ranking</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Portfolio-wide entity risk scores — sortable, filterable view of all screened entities.
        </Typography>
      </Box>

      {/* ── Risk Tier Summary Cards ──────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {tierStats.map((t) => {
          const cfg = RISK_TIER_CONFIG[t.tier];
          const pct = ((t.count / SCREENED_ENTITIES.length) * 100).toFixed(0);
          return (
            <Grid size={{ xs: 6, md: 3 }} key={t.tier}>
              <Card
                sx={{
                  p: 2, cursor: 'pointer',
                  border: tierFilter === t.tier ? `1px solid ${cfg.color}` : '1px solid transparent',
                  '&:hover': { borderColor: `${cfg.color}60` },
                }}
                onClick={() => setTierFilter(tierFilter === t.tier ? 'all' : t.tier)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Chip label={cfg.label} size="small" sx={{ fontSize: 10, height: 20, color: cfg.color, backgroundColor: cfg.bg }} />
                  <Typography sx={{ fontSize: 10, color: '#555' }}>{cfg.range}</Typography>
                </Box>
                <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: "'Lora', serif", color: cfg.color }}>{t.count}</Typography>
                <LinearProgress
                  variant="determinate" value={Number(pct)}
                  sx={{
                    height: 4, borderRadius: 2, mt: 1,
                    backgroundColor: `${cfg.color}15`,
                    '& .MuiLinearProgress-bar': { backgroundColor: cfg.color, borderRadius: 2 },
                  }}
                />
                <Typography sx={{ fontSize: 10, color: '#555', mt: 0.5 }}>{pct}% of portfolio</Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              fullWidth size="small"
              placeholder="Search company, country, industry..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3.5 }}>
            <TextField fullWidth size="small" select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} label="Risk Tier">
              <MenuItem value="all">All Tiers</MenuItem>
              {Object.entries(RISK_TIER_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label} ({v.range})</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 3.5 }}>
            <TextField fullWidth size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 80px 100px 60px 50px 50px 50px 90px 80px 40px',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {[
            { label: 'Company', field: 'name' as SortField },
            { label: 'Country', field: null },
            { label: 'Industry', field: null },
            { label: 'Risk', field: 'riskScore' as SortField },
            { label: 'PEP', field: null },
            { label: 'Sanct.', field: null },
            { label: 'Media', field: null },
            { label: 'Screened', field: 'lastScreened' as SortField },
            { label: 'Status', field: null },
            { label: '', field: null },
          ].map((h, i) => (
            <Typography
              key={i}
              onClick={h.field ? () => toggleSort(h.field!) : undefined}
              sx={{
                fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase',
                cursor: h.field ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', gap: 0.25,
                '&:hover': h.field ? { color: '#D4AF37' } : {},
              }}
            >
              {h.label}
              {h.field && <SortIcon field={h.field} />}
            </Typography>
          ))}
        </Box>

        {filtered.map((e: ScreenedEntity, i: number) => {
          const tier = RISK_TIER_CONFIG[e.riskTier];
          const sts = STATUS_CONFIG[e.status];
          return (
            <Box
              key={e.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 100px 60px 50px 50px 50px 90px 80px 40px',
                gap: 1, px: 2.5, py: 1.75,
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                opacity: e.status === 'blocked' ? 0.6 : 1,
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{e.name}</Typography>
                <Typography sx={{ fontSize: 10, color: '#555' }}>{e.directorCount} directors</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{e.countryFlag} {e.country}</Typography>
              <Typography sx={{ fontSize: 11, color: '#777' }}>{e.industry}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 28, height: 28, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: tier.bg, border: `1.5px solid ${tier.color}`,
                  }}
                >
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: tier.color }}>{e.riskScore}</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 12, color: e.pepMatches > 0 ? '#E6A817' : '#555', fontWeight: e.pepMatches > 0 ? 600 : 400 }}>
                {e.pepMatches || '—'}
              </Typography>
              <Typography sx={{ fontSize: 12, color: e.sanctionHits > 0 ? '#EF4444' : '#555', fontWeight: e.sanctionHits > 0 ? 600 : 400 }}>
                {e.sanctionHits || '—'}
              </Typography>
              <Typography sx={{ fontSize: 12, color: e.adverseMedia > 0 ? '#F97316' : '#555', fontWeight: e.adverseMedia > 0 ? 600 : 400 }}>
                {e.adverseMedia || '—'}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#999' }}>{e.lastScreened}</Typography>
              <Chip label={sts.label} size="small" sx={{ fontSize: 9, height: 18, color: sts.color, backgroundColor: sts.bg }} />
              <Tooltip title="View due diligence" arrow>
                <IconButton size="small" onClick={() => navigate(`/compliance/due-diligence/${e.id}`)} sx={{ color: '#777', '&:hover': { color: '#D4AF37' } }}>
                  <ViewIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {SCREENED_ENTITIES.length} entities
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
