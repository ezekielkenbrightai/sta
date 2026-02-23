import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  PersonSearch,
  Search as SearchIcon,
  CheckCircle,
  Warning,
  Cancel,
} from '@mui/icons-material';
import { DIRECTORS } from './CompanyDueDiligencePage';
import { SCREENED_ENTITIES } from './ComplianceDashboardPage';

// ─── Page ────────────────────────────────────────────────────────────────────

const PEP_CONFIG: Record<string, { label: string; color: string; bg: string; description: string }> = {
  none: { label: 'Clear', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', description: 'No PEP association' },
  'PEP-1': { label: 'PEP-1', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', description: 'Head of State / Senior Political Figure' },
  'PEP-2': { label: 'PEP-2', color: '#F97316', bg: 'rgba(249,115,22,0.1)', description: 'Senior Government Official' },
  'PEP-3': { label: 'PEP-3', color: '#E6A817', bg: 'rgba(230,168,23,0.1)', description: 'PEP Associate / Family Member' },
};

const SANCTION_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  none: { label: 'Clear', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  exact: { label: 'Exact Match', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  fuzzy: { label: 'Fuzzy Match', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
};

export default function DirectorScreeningPage() {
  const [search, setSearch] = useState('');
  const [pepFilter, setPepFilter] = useState('all');
  const [sanctionFilter, setSanctionFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  const countries = useMemo(() => {
    return Array.from(new Set(DIRECTORS.map((d) => d.nationality))).sort();
  }, []);

  const enrichedDirectors = useMemo(() => {
    return DIRECTORS.map((d) => {
      const entity = SCREENED_ENTITIES.find((e) => e.id === d.entityId);
      return { ...d, entityName: entity?.name || 'Unknown', entityCountry: entity?.country || '' };
    });
  }, []);

  // Cross-entity connections
  const directorNames = DIRECTORS.map((d) => d.name);
  const duplicateNames = directorNames.filter((name, idx) => directorNames.indexOf(name) !== idx);

  const filtered = useMemo(() => {
    return enrichedDirectors.filter((d) => {
      if (pepFilter !== 'all' && d.pepStatus !== pepFilter) return false;
      if (sanctionFilter !== 'all' && d.sanctionMatch !== sanctionFilter) return false;
      if (countryFilter !== 'all' && d.nationality !== countryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return d.name.toLowerCase().includes(q) || d.entityName.toLowerCase().includes(q) || d.role.toLowerCase().includes(q);
      }
      return true;
    });
  }, [enrichedDirectors, search, pepFilter, sanctionFilter, countryFilter]);

  const totalDirectors = DIRECTORS.length;
  const pepCount = DIRECTORS.filter((d) => d.pepStatus !== 'none').length;
  const sanctionCount = DIRECTORS.filter((d) => d.sanctionMatch !== 'none').length;
  const mediaCount = DIRECTORS.filter((d) => d.adverseMediaHits > 0).length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <PersonSearch sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Director Screening</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Cross-entity director and UBO screening — PEP status, sanctions, adverse media.
        </Typography>
      </Box>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Directors', value: totalDirectors, color: '#D4AF37' },
          { label: 'PEP Matches', value: pepCount, color: '#F97316' },
          { label: 'Sanction Matches', value: sanctionCount, color: '#EF4444' },
          { label: 'Adverse Media Hits', value: mediaCount, color: '#E6A817' },
          { label: 'Cross-Entity Links', value: duplicateNames.length, color: '#8B5CF6' },
          { label: 'Countries Represented', value: countries.length, color: '#3B82F6' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 2 }} key={s.label}>
            <Card sx={{ p: 2 }}>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── PEP Classification Guide ──────────────────────────────── */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#777', mb: 1 }}>PEP CLASSIFICATION LEVELS</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {Object.entries(PEP_CONFIG).filter(([k]) => k !== 'none').map(([k, v]) => (
            <Box key={k} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Chip label={v.label} size="small" sx={{ fontSize: 10, height: 20, color: v.color, backgroundColor: v.bg }} />
              <Typography sx={{ fontSize: 11, color: '#777' }}>{v.description}</Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth size="small"
              placeholder="Search name, company, role..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField fullWidth size="small" select value={pepFilter} onChange={(e) => setPepFilter(e.target.value)} label="PEP Status">
              <MenuItem value="all">All PEP Statuses</MenuItem>
              {Object.entries(PEP_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField fullWidth size="small" select value={sanctionFilter} onChange={(e) => setSanctionFilter(e.target.value)} label="Sanctions">
              <MenuItem value="all">All Sanction Statuses</MenuItem>
              {Object.entries(SANCTION_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField fullWidth size="small" select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} label="Nationality">
              <MenuItem value="all">All Countries</MenuItem>
              {countries.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* ── Director Cards ─────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.map((d) => {
          const pepCfg = PEP_CONFIG[d.pepStatus];
          const sanCfg = SANCTION_CONFIG[d.sanctionMatch];
          const hasIssues = d.pepStatus !== 'none' || d.sanctionMatch !== 'none' || d.adverseMediaHits > 0;
          return (
            <Card
              key={d.id}
              sx={{
                p: 2.5,
                borderLeft: `3px solid ${d.sanctionMatch === 'exact' ? '#EF4444' : d.pepStatus !== 'none' ? '#F97316' : d.adverseMediaHits > 0 ? '#E6A817' : '#22C55E'}`,
                opacity: !hasIssues ? 0.8 : 1,
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{d.name}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{d.role}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#777' }}>{d.nationalityFlag} {d.nationality} · {d.idType}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>DOB: {d.dob}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>Company</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37' }}>{d.entityName}</Typography>
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>PEP Status</Typography>
                  <Chip
                    label={pepCfg.label}
                    size="small"
                    icon={d.pepStatus === 'none' ? <CheckCircle sx={{ fontSize: 12 }} /> : <Warning sx={{ fontSize: 12 }} />}
                    sx={{ fontSize: 10, height: 22, color: pepCfg.color, backgroundColor: pepCfg.bg }}
                  />
                  {d.pepDetail && <Typography sx={{ fontSize: 10, color: '#777', mt: 0.5 }}>{d.pepDetail}</Typography>}
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>Sanctions</Typography>
                  <Chip
                    label={sanCfg.label}
                    size="small"
                    icon={d.sanctionMatch === 'none' ? <CheckCircle sx={{ fontSize: 12 }} /> : d.sanctionMatch === 'exact' ? <Cancel sx={{ fontSize: 12 }} /> : <Warning sx={{ fontSize: 12 }} />}
                    sx={{ fontSize: 10, height: 22, color: sanCfg.color, backgroundColor: sanCfg.bg }}
                  />
                  {d.sanctionDetail && <Typography sx={{ fontSize: 10, color: d.sanctionMatch === 'exact' ? '#EF4444' : '#777', mt: 0.5 }}>{d.sanctionDetail}</Typography>}
                </Grid>
                <Grid size={{ xs: 4, sm: 1.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>Media</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: d.adverseMediaHits > 0 ? '#F97316' : '#555' }}>
                    {d.adverseMediaHits > 0 ? d.adverseMediaHits : '—'}
                  </Typography>
                  {d.adverseMediaSummary && <Typography sx={{ fontSize: 10, color: '#777', mt: 0.25 }}>{d.adverseMediaSummary}</Typography>}
                </Grid>
                <Grid size={{ xs: 12, sm: 1.5 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>Country Risk</Typography>
                  <Chip
                    label={d.countryRisk.charAt(0).toUpperCase() + d.countryRisk.slice(1)}
                    size="small"
                    sx={{
                      fontSize: 10, height: 20,
                      color: d.countryRisk === 'high' ? '#EF4444' : d.countryRisk === 'medium' ? '#E6A817' : '#22C55E',
                      backgroundColor: d.countryRisk === 'high' ? 'rgba(239,68,68,0.1)' : d.countryRisk === 'medium' ? 'rgba(230,168,23,0.1)' : 'rgba(34,197,94,0.1)',
                    }}
                  />
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filtered.length} of {DIRECTORS.length} directors across {SCREENED_ENTITIES.length} entities
        </Typography>
      </Box>
    </Box>
  );
}
