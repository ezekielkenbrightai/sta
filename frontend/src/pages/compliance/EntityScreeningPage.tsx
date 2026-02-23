import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import {
  ManageSearch,
  Search as SearchIcon,
  PlayArrow,
  CheckCircle,
  Cancel,
  HourglassTop,
  Warning,
} from '@mui/icons-material';
import {
  SCREENED_ENTITIES,
  RISK_TIER_CONFIG,
  STATUS_CONFIG,
} from './ComplianceDashboardPage';

// ─── Check sources ───────────────────────────────────────────────────────────

interface CheckSource {
  id: string;
  name: string;
  category: 'identity' | 'regulatory' | 'financial' | 'reputational';
  description: string;
  color: string;
}

const CHECK_SOURCES: CheckSource[] = [
  { id: 'cs-01', name: 'Company Registry', category: 'identity', description: 'Registration validity, incorporation date, registered directors', color: '#3B82F6' },
  { id: 'cs-02', name: 'Director/UBO Screening', category: 'identity', description: 'Directors checked against PEP/sanctions/adverse media', color: '#8B5CF6' },
  { id: 'cs-03', name: 'AML Watchlists', category: 'regulatory', description: 'FATF, UN, EU, OFAC, local FRC watchlists', color: '#EF4444' },
  { id: 'cs-04', name: 'Sanctions Lists', category: 'regulatory', description: '3,000+ lists across 220+ countries', color: '#F97316' },
  { id: 'cs-05', name: 'PEP Database', category: 'regulatory', description: 'Politically exposed persons + associates', color: '#E6A817' },
  { id: 'cs-06', name: 'Adverse Media', category: 'reputational', description: 'Negative news screening across global media', color: '#EC4899' },
  { id: 'cs-07', name: 'Financial Health', category: 'financial', description: 'Credit rating, payment history, litigation', color: '#22C55E' },
  { id: 'cs-08', name: 'Tax Compliance', category: 'financial', description: 'Tax clearance certificate status', color: '#D4AF37' },
];

// ─── Screening results per entity ───────────────────────────────────────────

interface ScreeningResult {
  entityId: string;
  sourceId: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  details: string;
  lastChecked: string;
}

const SCREENING_RESULTS: ScreeningResult[] = [
  // Nairobi Exports Ltd — all clear
  { entityId: 'ent-001', sourceId: 'cs-01', status: 'pass', details: 'Registered since 2008. Active status. 3 directors confirmed.', lastChecked: '2026-02-18' },
  { entityId: 'ent-001', sourceId: 'cs-02', status: 'pass', details: 'All 3 directors screened — no matches found.', lastChecked: '2026-02-18' },
  { entityId: 'ent-001', sourceId: 'cs-03', status: 'pass', details: 'No AML watchlist matches.', lastChecked: '2026-02-18' },
  { entityId: 'ent-001', sourceId: 'cs-04', status: 'pass', details: 'No sanctions matches across 3,200+ lists.', lastChecked: '2026-02-18' },
  { entityId: 'ent-001', sourceId: 'cs-05', status: 'pass', details: 'No PEP associations detected.', lastChecked: '2026-02-18' },
  { entityId: 'ent-001', sourceId: 'cs-06', status: 'pass', details: 'No adverse media found.', lastChecked: '2026-02-18' },
  { entityId: 'ent-001', sourceId: 'cs-07', status: 'pass', details: 'Credit rating: A. No litigation.', lastChecked: '2026-02-18' },
  { entityId: 'ent-001', sourceId: 'cs-08', status: 'pass', details: 'Valid tax clearance certificate through 2026-12-31.', lastChecked: '2026-02-18' },

  // Cairo Trade House — high risk
  { entityId: 'ent-003', sourceId: 'cs-01', status: 'pass', details: 'Registered since 2015. Active. 3 directors.', lastChecked: '2026-02-10' },
  { entityId: 'ent-003', sourceId: 'cs-02', status: 'fail', details: '2 directors flagged: Ahmed M. (PEP-2), Omar K. (sanctions adjacent).', lastChecked: '2026-02-10' },
  { entityId: 'ent-003', sourceId: 'cs-03', status: 'warning', details: 'Entity flagged on Egypt FRC monitoring list.', lastChecked: '2026-02-10' },
  { entityId: 'ent-003', sourceId: 'cs-04', status: 'warning', details: 'Fuzzy match on EU consolidated list (75% confidence).', lastChecked: '2026-02-10' },
  { entityId: 'ent-003', sourceId: 'cs-05', status: 'fail', details: 'PEP-2 match: director linked to Egyptian Ministry of Trade.', lastChecked: '2026-02-10' },
  { entityId: 'ent-003', sourceId: 'cs-06', status: 'fail', details: '4 adverse media hits: tax evasion allegations, import fraud claims.', lastChecked: '2026-02-10' },
  { entityId: 'ent-003', sourceId: 'cs-07', status: 'warning', details: 'Credit rating: C+. 2 pending litigations.', lastChecked: '2026-02-10' },
  { entityId: 'ent-003', sourceId: 'cs-08', status: 'pass', details: 'Tax clearance valid through 2026-06-30.', lastChecked: '2026-02-10' },

  // Auto Kenya Ltd — critical / blocked
  { entityId: 'ent-007', sourceId: 'cs-01', status: 'pass', details: 'Registered since 2019. Active. 4 directors.', lastChecked: '2026-02-22' },
  { entityId: 'ent-007', sourceId: 'cs-02', status: 'fail', details: 'Director James M. on OFAC SDN list. Director linked to sanctioned network.', lastChecked: '2026-02-22' },
  { entityId: 'ent-007', sourceId: 'cs-03', status: 'fail', details: 'Entity on multiple AML watchlists (FATF, Kenya FRC).', lastChecked: '2026-02-22' },
  { entityId: 'ent-007', sourceId: 'cs-04', status: 'fail', details: 'EXACT match on OFAC SDN list. Entity ID: OFAC-KE-2026-041.', lastChecked: '2026-02-22' },
  { entityId: 'ent-007', sourceId: 'cs-05', status: 'fail', details: 'Director PEP-1 match: linked to sanctioned political figure.', lastChecked: '2026-02-22' },
  { entityId: 'ent-007', sourceId: 'cs-06', status: 'fail', details: '6 adverse media hits: sanctions evasion, money laundering allegations.', lastChecked: '2026-02-22' },
  { entityId: 'ent-007', sourceId: 'cs-07', status: 'fail', details: 'Credit rating: D. Multiple frozen accounts.', lastChecked: '2026-02-22' },
  { entityId: 'ent-007', sourceId: 'cs-08', status: 'fail', details: 'Tax clearance revoked. Under KRA investigation.', lastChecked: '2026-02-22' },
];

const RESULT_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  pass: { label: 'Pass', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', icon: CheckCircle },
  fail: { label: 'Fail', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: Cancel },
  warning: { label: 'Warning', color: '#E6A817', bg: 'rgba(230,168,23,0.1)', icon: Warning },
  pending: { label: 'Pending', color: '#999', bg: 'rgba(153,153,153,0.1)', icon: HourglassTop },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EntityScreeningPage() {
  const [search, setSearch] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [screeningActive, setScreeningActive] = useState(false);
  const [screeningProgress, setScreeningProgress] = useState(0);

  const filteredEntities = useMemo(() => {
    if (!search) return SCREENED_ENTITIES;
    const q = search.toLowerCase();
    return SCREENED_ENTITIES.filter((e) =>
      e.name.toLowerCase().includes(q) || e.country.toLowerCase().includes(q),
    );
  }, [search]);

  const entityResults = useMemo(() => {
    if (!selectedEntity) return [];
    return SCREENING_RESULTS.filter((r) => r.entityId === selectedEntity);
  }, [selectedEntity]);

  const selectedEntityData = SCREENED_ENTITIES.find((e) => e.id === selectedEntity);

  const handleStartScreening = () => {
    setScreeningActive(true);
    setScreeningProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setScreeningActive(false), 500);
      }
      setScreeningProgress(progress);
    }, 400);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <ManageSearch sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Entity Screening</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Initiate and view multi-source background checks across KYC/AML databases.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* ── Entity Selection Panel ────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 1.5 }}>Select Entity</Typography>
            <TextField
              fullWidth size="small" sx={{ mb: 2 }}
              placeholder="Search entity..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#777' }} /></InputAdornment> } }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, maxHeight: 480, overflowY: 'auto' }}>
              {filteredEntities.map((e) => {
                const tier = RISK_TIER_CONFIG[e.riskTier];
                const sts = STATUS_CONFIG[e.status];
                const isSelected = selectedEntity === e.id;
                return (
                  <Box
                    key={e.id}
                    onClick={() => setSelectedEntity(e.id)}
                    sx={{
                      p: 1.5, borderRadius: 1, cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(212,175,55,0.08)' : 'transparent',
                      border: isSelected ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                      '&:hover': { backgroundColor: 'rgba(212,175,55,0.05)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{e.name}</Typography>
                        <Typography sx={{ fontSize: 11, color: '#777' }}>{e.countryFlag} {e.country} · {e.industry}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box
                          sx={{
                            width: 24, height: 24, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: tier.bg, border: `1px solid ${tier.color}`,
                          }}
                        >
                          <Typography sx={{ fontSize: 9, fontWeight: 700, color: tier.color }}>{e.riskScore}</Typography>
                        </Box>
                        <Chip label={sts.label} size="small" sx={{ fontSize: 8, height: 16, color: sts.color, backgroundColor: sts.bg }} />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* ── Screening Results ──────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 8 }}>
          {!selectedEntity ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <ManageSearch sx={{ fontSize: 48, color: '#333', mb: 1 }} />
              <Typography sx={{ fontSize: 16, color: '#777' }}>Select an entity to view screening results</Typography>
              <Typography sx={{ fontSize: 12, color: '#555', mt: 0.5 }}>
                Choose from the entity list or search for a specific company.
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Entity Header */}
              <Card sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0', fontFamily: "'Lora', serif" }}>
                      {selectedEntityData?.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#777' }}>
                      {selectedEntityData?.countryFlag} {selectedEntityData?.country} · {selectedEntityData?.industry} · {selectedEntityData?.directorCount} directors
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      {selectedEntityData && (
                        <>
                          <Chip label={RISK_TIER_CONFIG[selectedEntityData.riskTier].label + ' Risk'} size="small"
                            sx={{ fontSize: 10, height: 20, color: RISK_TIER_CONFIG[selectedEntityData.riskTier].color, backgroundColor: RISK_TIER_CONFIG[selectedEntityData.riskTier].bg }} />
                          <Chip label={STATUS_CONFIG[selectedEntityData.status].label} size="small"
                            sx={{ fontSize: 10, height: 20, color: STATUS_CONFIG[selectedEntityData.status].color, backgroundColor: STATUS_CONFIG[selectedEntityData.status].bg }} />
                        </>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: 36, fontWeight: 700, fontFamily: "'Lora', serif", color: selectedEntityData ? RISK_TIER_CONFIG[selectedEntityData.riskTier].color : '#777' }}>
                      {selectedEntityData?.riskScore}
                    </Typography>
                    <Typography sx={{ fontSize: 10, color: '#555' }}>RISK SCORE</Typography>
                  </Box>
                </Box>

                {/* Screening action */}
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="contained" startIcon={<PlayArrow />}
                    onClick={handleStartScreening}
                    disabled={screeningActive}
                    sx={{ textTransform: 'none' }}
                  >
                    {screeningActive ? 'Screening in Progress...' : 'Re-screen Entity'}
                  </Button>
                  {screeningActive && (
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate" value={screeningProgress}
                        sx={{
                          height: 6, borderRadius: 3,
                          backgroundColor: 'rgba(212,175,55,0.1)',
                          '& .MuiLinearProgress-bar': { backgroundColor: '#D4AF37', borderRadius: 3 },
                        }}
                      />
                      <Typography sx={{ fontSize: 10, color: '#777', mt: 0.25 }}>
                        Checking {Math.min(Math.floor(screeningProgress / 12.5) + 1, 8)} of 8 sources...
                      </Typography>
                    </Box>
                  )}
                  <Typography sx={{ fontSize: 11, color: '#555' }}>
                    Last screened: {selectedEntityData?.lastScreened}
                  </Typography>
                </Box>
              </Card>

              {/* Check Sources & Results */}
              <Card sx={{ p: 2.5 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Multi-Source Check Results</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {CHECK_SOURCES.map((src) => {
                    const result = entityResults.find((r) => r.sourceId === src.id);
                    const cfg = result ? RESULT_CONFIG[result.status] : RESULT_CONFIG.pending;
                    const ResultIcon = cfg.icon;
                    return (
                      <Box
                        key={src.id}
                        sx={{
                          p: 1.5, borderRadius: 1,
                          backgroundColor: result ? cfg.bg : 'rgba(153,153,153,0.03)',
                          border: `1px solid ${result ? cfg.color : '#333'}20`,
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <ResultIcon sx={{ fontSize: 16, color: cfg.color }} />
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{src.name}</Typography>
                            <Chip label={src.category} size="small" sx={{ fontSize: 8, height: 16, color: src.color, backgroundColor: `${src.color}15` }} />
                          </Box>
                          <Chip label={cfg.label} size="small" sx={{ fontSize: 9, height: 18, color: cfg.color, backgroundColor: `${cfg.color}20` }} />
                        </Box>
                        <Typography sx={{ fontSize: 11, color: '#777', mb: 0.5 }}>{src.description}</Typography>
                        {result && (
                          <Typography sx={{ fontSize: 12, color: result.status === 'pass' ? '#b0b0b0' : cfg.color }}>
                            {result.details}
                          </Typography>
                        )}
                        {!result && (
                          <Typography sx={{ fontSize: 11, color: '#555', fontStyle: 'italic' }}>
                            No screening data available — initiate screening to check.
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Card>

              {/* Category Summary */}
              <Card sx={{ p: 2.5 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Risk Score Breakdown</Typography>
                <Grid container spacing={2}>
                  {(['identity', 'regulatory', 'financial', 'reputational'] as const).map((cat) => {
                    const sources = CHECK_SOURCES.filter((s) => s.category === cat);
                    const results = entityResults.filter((r) => sources.some((s) => s.id === r.sourceId));
                    const failCount = results.filter((r) => r.status === 'fail').length;
                    const warnCount = results.filter((r) => r.status === 'warning').length;
                    const passCount = results.filter((r) => r.status === 'pass').length;
                    const catScore = failCount * 30 + warnCount * 15;
                    const maxScore = sources.length * 30;
                    const pct = maxScore > 0 ? (catScore / maxScore) * 100 : 0;
                    const catColor = pct > 60 ? '#EF4444' : pct > 30 ? '#E6A817' : '#22C55E';
                    return (
                      <Grid size={{ xs: 6, md: 3 }} key={cat}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ fontSize: 11, color: '#777', textTransform: 'uppercase', mb: 0.5 }}>{cat}</Typography>
                          <Typography sx={{ fontSize: 20, fontWeight: 700, color: catColor }}>{Math.round(pct)}%</Typography>
                          <Typography sx={{ fontSize: 10, color: '#555' }}>
                            {passCount}✓ {warnCount}⚠ {failCount}✗
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Card>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
