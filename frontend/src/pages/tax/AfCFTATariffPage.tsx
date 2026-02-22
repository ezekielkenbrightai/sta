import { useMemo, useState } from 'react';
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
  Public,
  Search as SearchIcon,
  TrendingDown,
} from '@mui/icons-material';

// ─── Types & Mock data ───────────────────────────────────────────────────────

interface TariffSchedule {
  id: string;
  hs_code: string;
  description: string;
  standard_rate: number;
  afcfta_rate: number;
  phase: 'immediate' | 'phase_1' | 'phase_2' | 'sensitive' | 'excluded';
  reduction_timeline: string;
  origin_countries: string[];
}

const MOCK_TARIFFS: TariffSchedule[] = [
  { id: 'ts-001', hs_code: '0901.11', description: 'Coffee, not roasted', standard_rate: 25, afcfta_rate: 0, phase: 'immediate', reduction_timeline: 'Immediate elimination', origin_countries: ['Ethiopia', 'Uganda', 'Tanzania'] },
  { id: 'ts-002', hs_code: '0902.10', description: 'Green tea', standard_rate: 25, afcfta_rate: 5, phase: 'phase_1', reduction_timeline: '5-year linear (2021-2026)', origin_countries: ['Kenya', 'Rwanda', 'Malawi'] },
  { id: 'ts-003', hs_code: '1701.13', description: 'Raw cane sugar', standard_rate: 100, afcfta_rate: 50, phase: 'sensitive', reduction_timeline: '10-year linear (2021-2031)', origin_countries: ['South Africa', 'Eswatini', 'Mozambique'] },
  { id: 'ts-004', hs_code: '2523.29', description: 'Portland cement', standard_rate: 35, afcfta_rate: 10, phase: 'phase_1', reduction_timeline: '5-year linear (2021-2026)', origin_countries: ['Nigeria', 'Tanzania', 'Ethiopia'] },
  { id: 'ts-005', hs_code: '3004.90', description: 'Medicaments, retail', standard_rate: 0, afcfta_rate: 0, phase: 'immediate', reduction_timeline: 'Already duty-free', origin_countries: ['All AU members'] },
  { id: 'ts-006', hs_code: '6109.10', description: 'T-shirts, cotton', standard_rate: 35, afcfta_rate: 10, phase: 'phase_2', reduction_timeline: '10-year linear (2026-2036)', origin_countries: ['Ghana', 'Nigeria', 'Ethiopia'] },
  { id: 'ts-007', hs_code: '7108.12', description: 'Gold, semi-manufactured', standard_rate: 0, afcfta_rate: 0, phase: 'immediate', reduction_timeline: 'Already duty-free', origin_countries: ['South Africa', 'Ghana', 'Tanzania'] },
  { id: 'ts-008', hs_code: '8471.30', description: 'Laptops', standard_rate: 0, afcfta_rate: 0, phase: 'immediate', reduction_timeline: 'Already duty-free', origin_countries: ['All AU members'] },
  { id: 'ts-009', hs_code: '8703.23', description: 'Motor vehicles 1500-3000cc', standard_rate: 25, afcfta_rate: 10, phase: 'phase_1', reduction_timeline: '5-year linear (2021-2026)', origin_countries: ['South Africa', 'Morocco', 'Egypt'] },
  { id: 'ts-010', hs_code: '2710.12', description: 'Petrol/gasoline', standard_rate: 0, afcfta_rate: 0, phase: 'excluded', reduction_timeline: 'Excluded from liberalization', origin_countries: ['N/A'] },
  { id: 'ts-011', hs_code: '1006.30', description: 'Semi-milled rice', standard_rate: 75, afcfta_rate: 40, phase: 'sensitive', reduction_timeline: '10-year linear (2021-2031)', origin_countries: ['Tanzania', 'Egypt', 'Nigeria'] },
  { id: 'ts-012', hs_code: '0207.14', description: 'Frozen chicken cuts', standard_rate: 25, afcfta_rate: 25, phase: 'excluded', reduction_timeline: 'Excluded (infant industry)', origin_countries: ['N/A'] },
];

const PHASE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  immediate: { label: 'Immediate', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  phase_1: { label: 'Phase 1 (5yr)', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  phase_2: { label: 'Phase 2 (10yr)', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  sensitive: { label: 'Sensitive', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  excluded: { label: 'Excluded', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AfCFTATariffPage() {
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_TARIFFS.filter((t) => {
      if (phaseFilter !== 'all' && t.phase !== phaseFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return t.hs_code.includes(q) || t.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, phaseFilter]);

  const phaseCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_TARIFFS.forEach((t) => { counts[t.phase] = (counts[t.phase] || 0) + 1; });
    return counts;
  }, []);

  const avgReduction = useMemo(() => {
    const reducible = MOCK_TARIFFS.filter((t) => t.standard_rate > 0 && t.phase !== 'excluded');
    if (!reducible.length) return 0;
    const totalReduction = reducible.reduce((s, t) => s + ((t.standard_rate - t.afcfta_rate) / t.standard_rate * 100), 0);
    return (totalReduction / reducible.length).toFixed(0);
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Public sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">AfCFTA Tariff Schedules</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            African Continental Free Trade Area preferential tariff schedules and reduction timelines.
          </Typography>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Products', value: MOCK_TARIFFS.length.toString(), color: '#D4AF37' },
          { label: 'Avg Tariff Reduction', value: `${avgReduction}%`, color: '#22C55E' },
          { label: 'Immediate Elimination', value: (phaseCounts['immediate'] || 0).toString(), color: '#3B82F6' },
          { label: 'Excluded Products', value: (phaseCounts['excluded'] || 0).toString(), color: '#EF4444' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Phase breakdown */}
      <Card sx={{ p: 2.5, mb: 3 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Liberalization Phase Breakdown</Typography>
        <Grid container spacing={2}>
          {Object.entries(PHASE_CONFIG).map(([key, cfg]) => {
            const count = phaseCounts[key] || 0;
            const pct = (count / MOCK_TARIFFS.length * 100).toFixed(0);
            return (
              <Grid size={{ xs: 6, sm: 2.4 }} key={key}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: cfg.color }}>{count}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#777', mb: 0.5 }}>{cfg.label}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Number(pct)}
                    sx={{ height: 4, borderRadius: 2, backgroundColor: `${cfg.color}15`, '& .MuiLinearProgress-bar': { backgroundColor: cfg.color } }}
                  />
                  <Typography sx={{ fontSize: 10, color: '#555', mt: 0.25 }}>{pct}%</Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Card>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 7 }}>
            <TextField
              fullWidth size="small"
              placeholder="Search by HS code or product..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField fullWidth size="small" select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)} label="Phase">
              <MenuItem value="all">All Phases</MenuItem>
              {Object.entries(PHASE_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 80px 80px 70px 100px 1fr',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['HS Code', 'Description', 'Standard', 'AfCFTA', 'Saving', 'Phase', 'Eligible Origins'].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {filtered.map((t, i) => {
          const phase = PHASE_CONFIG[t.phase];
          const saving = t.standard_rate > 0 ? t.standard_rate - t.afcfta_rate : 0;
          return (
            <Box
              key={t.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 80px 80px 70px 100px 1fr',
                gap: 1, px: 2.5, py: 1.75,
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{t.hs_code}</Typography>
              <Box>
                <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{t.description}</Typography>
                <Typography sx={{ fontSize: 10, color: '#555' }}>{t.reduction_timeline}</Typography>
              </Box>
              <Typography sx={{ fontSize: 13, color: '#b0b0b0' }}>{t.standard_rate}%</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: t.afcfta_rate < t.standard_rate ? '#22C55E' : '#b0b0b0' }}>
                {t.afcfta_rate}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                {saving > 0 && <TrendingDown sx={{ fontSize: 14, color: '#22C55E' }} />}
                <Typography sx={{ fontSize: 12, color: saving > 0 ? '#22C55E' : '#555' }}>
                  {saving > 0 ? `-${saving}%` : '--'}
                </Typography>
              </Box>
              <Chip label={phase.label} size="small" sx={{ fontSize: 11, height: 22, backgroundColor: phase.bg, color: phase.color }} />
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {t.origin_countries.map((c) => (
                  <Chip key={c} label={c} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: 'rgba(212,175,55,0.06)', color: '#999' }} />
                ))}
              </Box>
            </Box>
          );
        })}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {MOCK_TARIFFS.length} tariff schedules
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
