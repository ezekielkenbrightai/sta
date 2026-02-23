import { useState } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  GppBad,
  CheckCircle,
  Warning,
  Cancel,
  Refresh,
  Shield,
} from '@mui/icons-material';

// ─── Watchlist sources ───────────────────────────────────────────────────────

interface WatchlistSource {
  id: string;
  name: string;
  shortName: string;
  description: string;
  region: string;
  totalEntries: number;
  lastUpdated: string;
  status: 'active' | 'syncing' | 'error';
  color: string;
}

const WATCHLIST_SOURCES: WatchlistSource[] = [
  { id: 'wl-01', name: 'UN Security Council Consolidated List', shortName: 'UN Sanctions', description: 'Global sanctions list maintained by the United Nations', region: 'Global', totalEntries: 892, lastUpdated: '2026-02-21', status: 'active', color: '#3B82F6' },
  { id: 'wl-02', name: 'OFAC Specially Designated Nationals (SDN)', shortName: 'OFAC SDN', description: 'US Treasury maintained sanctions list', region: 'Global', totalEntries: 12453, lastUpdated: '2026-02-19', status: 'active', color: '#EF4444' },
  { id: 'wl-03', name: 'EU Consolidated Sanctions List', shortName: 'EU Sanctions', description: 'European Union consolidated list of designated persons', region: 'Europe/Global', totalEntries: 5621, lastUpdated: '2026-02-20', status: 'active', color: '#8B5CF6' },
  { id: 'wl-04', name: 'FATF Blacklist / Greylist', shortName: 'FATF', description: 'Countries with strategic AML/CFT deficiencies', region: 'Global', totalEntries: 44, lastUpdated: '2026-02-15', status: 'active', color: '#F97316' },
  { id: 'wl-05', name: 'Kenya Financial Reporting Centre', shortName: 'Kenya FRC', description: 'Kenyan AML/CFT designated persons and entities', region: 'Kenya', totalEntries: 187, lastUpdated: '2026-02-18', status: 'active', color: '#D4AF37' },
  { id: 'wl-06', name: 'Interpol Red Notices', shortName: 'Interpol', description: 'International wanted persons database', region: 'Global', totalEntries: 7891, lastUpdated: '2026-02-22', status: 'active', color: '#EC4899' },
  { id: 'wl-07', name: 'World Bank Debarment List', shortName: 'World Bank', description: 'Entities debarred from World Bank-financed contracts', region: 'Global', totalEntries: 1234, lastUpdated: '2026-02-17', status: 'active', color: '#22C55E' },
  { id: 'wl-08', name: 'African Development Bank Sanctions', shortName: 'AfDB', description: 'AfDB debarred entities and individuals', region: 'Africa', totalEntries: 456, lastUpdated: '2026-02-14', status: 'active', color: '#E6A817' },
];

// ─── Watchlist matches / alerts ──────────────────────────────────────────────

interface WatchlistMatch {
  id: string;
  entityName: string;
  entityId: string;
  matchedName: string;
  source: string;
  sourceId: string;
  matchQuality: 'exact' | 'fuzzy' | 'potential';
  confidence: number;
  matchDate: string;
  status: 'confirmed' | 'cleared' | 'pending_review';
  clearedReason?: string;
  details: string;
}

const WATCHLIST_MATCHES: WatchlistMatch[] = [
  { id: 'wm-01', entityName: 'Auto Kenya Ltd', entityId: 'ent-007', matchedName: 'Auto Kenya Limited / James Muturi', source: 'OFAC SDN', sourceId: 'wl-02', matchQuality: 'exact', confidence: 99, matchDate: '2026-02-22', status: 'confirmed', details: 'Director James Muturi confirmed as OFAC SDN listed individual. Entity blocked.' },
  { id: 'wm-02', entityName: 'Auto Kenya Ltd', entityId: 'ent-007', matchedName: 'David Kamau / Kamau David', source: 'UN Sanctions', sourceId: 'wl-01', matchQuality: 'fuzzy', confidence: 61, matchDate: '2026-02-22', status: 'pending_review', details: 'Fuzzy name match — different DOB. Under investigation.' },
  { id: 'wm-03', entityName: 'Cairo Trade House', entityId: 'ent-003', matchedName: 'Ahmed Mahmoud / محمود أحمد', source: 'EU Sanctions', sourceId: 'wl-03', matchQuality: 'fuzzy', confidence: 72, matchDate: '2026-02-10', status: 'pending_review', details: 'Name pattern match with EU consolidated list. Arabic name variant. Different DOB — may be false positive.' },
  { id: 'wm-04', entityName: 'Cairo Trade House', entityId: 'ent-003', matchedName: 'Cairo Trade House', source: 'Kenya FRC', sourceId: 'wl-05', matchQuality: 'potential', confidence: 45, matchDate: '2026-02-10', status: 'pending_review', details: 'Entity appears on FRC monitoring list — not designated, under enhanced monitoring.' },
  { id: 'wm-05', entityName: 'Lagos Trading Co', entityId: 'ent-002', matchedName: 'Chukwu Obasanjo', source: 'FATF', sourceId: 'wl-04', matchQuality: 'potential', confidence: 38, matchDate: '2026-02-15', status: 'cleared', clearedReason: 'Different individual — name similarity only. FATF flag is country-level (Nigeria grey list) not individual.', details: 'Director shares name pattern with flagged PEP. Cleared after enhanced review.' },
  { id: 'wm-06', entityName: 'Nairobi Exports Ltd', entityId: 'ent-001', matchedName: 'Nairobi Export Co', source: 'World Bank', sourceId: 'wl-07', matchQuality: 'potential', confidence: 42, matchDate: '2026-01-10', status: 'cleared', clearedReason: 'Different entity — "Nairobi Export Co" is an unrelated company in different industry. Registration numbers do not match.', details: 'Name similarity flagged during initial screening. Confirmed false positive.' },
  { id: 'wm-07', entityName: 'Auto Kenya Ltd', entityId: 'ent-007', matchedName: 'Auto Kenya Ltd', source: 'Kenya FRC', sourceId: 'wl-05', matchQuality: 'exact', confidence: 100, matchDate: '2026-02-22', status: 'confirmed', details: 'Entity designated by Kenya FRC following OFAC listing confirmation.' },
];

const MATCH_QUALITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  exact: { label: 'Exact Match', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  fuzzy: { label: 'Fuzzy Match', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  potential: { label: 'Potential', color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
};

const MATCH_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  confirmed: { label: 'Confirmed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: Cancel },
  cleared: { label: 'Cleared', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', icon: CheckCircle },
  pending_review: { label: 'Pending Review', color: '#E6A817', bg: 'rgba(230,168,23,0.1)', icon: Warning },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function WatchlistMonitorPage() {
  const [matchFilter, setMatchFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');

  const filteredMatches = WATCHLIST_MATCHES.filter((m) => {
    if (matchFilter !== 'all' && m.status !== matchFilter) return false;
    if (qualityFilter !== 'all' && m.matchQuality !== qualityFilter) return false;
    return true;
  });

  const confirmedCount = WATCHLIST_MATCHES.filter((m) => m.status === 'confirmed').length;
  const pendingCount = WATCHLIST_MATCHES.filter((m) => m.status === 'pending_review').length;
  const clearedCount = WATCHLIST_MATCHES.filter((m) => m.status === 'cleared').length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <GppBad sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Watchlist Monitor</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Real-time monitoring against global sanctions, PEP, and AML databases.
        </Typography>
      </Box>

      {/* ── Source Status Grid ──────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {WATCHLIST_SOURCES.map((src) => (
          <Grid size={{ xs: 6, md: 3 }} key={src.id}>
            <Card sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: src.color }}>{src.shortName}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>{src.region}</Typography>
                </Box>
                <Tooltip title="Sync database" arrow>
                  <IconButton size="small" sx={{ color: '#555', '&:hover': { color: '#D4AF37' } }}>
                    <Refresh sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0', fontFamily: "'Lora', serif" }}>
                {src.totalEntries.toLocaleString()}
              </Typography>
              <Typography sx={{ fontSize: 10, color: '#555' }}>entries</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography sx={{ fontSize: 10, color: '#777' }}>Updated: {src.lastUpdated}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: src.status === 'active' ? '#22C55E' : src.status === 'syncing' ? '#E6A817' : '#EF4444' }} />
                  <Typography sx={{ fontSize: 9, color: '#555', textTransform: 'capitalize' }}>{src.status}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Match Summary ──────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Matches', value: WATCHLIST_MATCHES.length, color: '#D4AF37', icon: Shield },
          { label: 'Confirmed', value: confirmedCount, color: '#EF4444', icon: Cancel },
          { label: 'Pending Review', value: pendingCount, color: '#E6A817', icon: Warning },
          { label: 'Cleared (False Pos.)', value: clearedCount, color: '#22C55E', icon: CheckCircle },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Grid size={{ xs: 6, md: 3 }} key={s.label}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{s.label}</Typography>
                  <Icon sx={{ fontSize: 16, color: s.color, opacity: 0.7 }} />
                </Box>
                <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ── Match Filters ──────────────────────────────────────────── */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 6, sm: 6 }}>
            <TextField fullWidth size="small" select value={matchFilter} onChange={(e) => setMatchFilter(e.target.value)} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              {Object.entries(MATCH_STATUS_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 6 }}>
            <TextField fullWidth size="small" select value={qualityFilter} onChange={(e) => setQualityFilter(e.target.value)} label="Match Quality">
              <MenuItem value="all">All Qualities</MenuItem>
              {Object.entries(MATCH_QUALITY_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* ── Match List ─────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filteredMatches.map((m) => {
          const quality = MATCH_QUALITY_CONFIG[m.matchQuality];
          const msts = MATCH_STATUS_CONFIG[m.status];
          const StatusIcon = msts.icon;
          const srcData = WATCHLIST_SOURCES.find((s) => s.id === m.sourceId);
          return (
            <Card key={m.id} sx={{ p: 2.5, opacity: m.status === 'cleared' ? 0.6 : 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <StatusIcon sx={{ fontSize: 16, color: msts.color }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{m.entityName}</Typography>
                    <Chip label={quality.label} size="small" sx={{ fontSize: 9, height: 18, color: quality.color, backgroundColor: quality.bg }} />
                    <Chip label={msts.label} size="small" sx={{ fontSize: 9, height: 18, color: msts.color, backgroundColor: msts.bg }} />
                  </Box>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>
                    Matched: <strong style={{ color: '#f0f0f0' }}>{m.matchedName}</strong>
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: m.confidence > 80 ? '#EF4444' : m.confidence > 50 ? '#E6A817' : '#F97316' }}>
                    {m.confidence}%
                  </Typography>
                  <Typography sx={{ fontSize: 9, color: '#555' }}>confidence</Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Source</Typography>
                  <Chip
                    label={srcData?.shortName || m.source}
                    size="small"
                    sx={{ fontSize: 10, height: 20, color: srcData?.color || '#777', backgroundColor: `${srcData?.color || '#777'}15`, mt: 0.25 }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Match Date</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{m.matchDate}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 7 }}>
                  <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Details</Typography>
                  <Typography sx={{ fontSize: 12, color: m.status === 'confirmed' ? '#EF4444' : '#b0b0b0' }}>{m.details}</Typography>
                  {m.clearedReason && (
                    <Typography sx={{ fontSize: 11, color: '#22C55E', mt: 0.5, fontStyle: 'italic' }}>
                      Cleared: {m.clearedReason}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filteredMatches.length} of {WATCHLIST_MATCHES.length} matches
        </Typography>
      </Box>
    </Box>
  );
}
