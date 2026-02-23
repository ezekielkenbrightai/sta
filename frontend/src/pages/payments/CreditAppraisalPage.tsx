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
  CreditScore,
  Search as SearchIcon,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface CreditProfile {
  id: string;
  trader: string;
  registration_number: string;
  credit_score: number;
  credit_grade: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC';
  total_exposure: number;
  approved_limit: number;
  utilization: number;
  payment_history: 'excellent' | 'good' | 'fair' | 'poor';
  years_trading: number;
  trade_volume_ytd: number;
  last_assessed: string;
  score_change: number;
}

const MOCK_PROFILES: CreditProfile[] = [
  { id: 'cp-001', trader: 'Nairobi Exports Ltd', registration_number: 'KE-TR-00142', credit_score: 845, credit_grade: 'AAA', total_exposure: 95000000, approved_limit: 150000000, utilization: 63.3, payment_history: 'excellent', years_trading: 12, trade_volume_ytd: 480000000, last_assessed: '2026-02-15', score_change: 12 },
  { id: 'cp-002', trader: 'Lagos Trading Co', registration_number: 'NG-TR-00087', credit_score: 720, credit_grade: 'A', total_exposure: 215000000, approved_limit: 250000000, utilization: 86.0, payment_history: 'good', years_trading: 8, trade_volume_ytd: 620000000, last_assessed: '2026-02-10', score_change: -5 },
  { id: 'cp-003', trader: 'Accra Commodities Ltd', registration_number: 'GH-TR-00213', credit_score: 780, credit_grade: 'AA', total_exposure: 50000000, approved_limit: 100000000, utilization: 50.0, payment_history: 'excellent', years_trading: 15, trade_volume_ytd: 320000000, last_assessed: '2026-02-18', score_change: 8 },
  { id: 'cp-004', trader: 'Cairo Trade House', registration_number: 'EG-TR-00056', credit_score: 620, credit_grade: 'BBB', total_exposure: 122000000, approved_limit: 150000000, utilization: 81.3, payment_history: 'fair', years_trading: 5, trade_volume_ytd: 280000000, last_assessed: '2026-02-12', score_change: -15 },
  { id: 'cp-005', trader: 'Dar es Salaam Freight', registration_number: 'TZ-TR-00178', credit_score: 695, credit_grade: 'A', total_exposure: 63000000, approved_limit: 80000000, utilization: 78.8, payment_history: 'good', years_trading: 6, trade_volume_ytd: 190000000, last_assessed: '2026-02-20', score_change: 3 },
  { id: 'cp-006', trader: 'Kampala Imports Inc', registration_number: 'UG-TR-00094', credit_score: 520, credit_grade: 'BB', total_exposure: 30000000, approved_limit: 40000000, utilization: 75.0, payment_history: 'fair', years_trading: 3, trade_volume_ytd: 95000000, last_assessed: '2026-02-08', score_change: -22 },
  { id: 'cp-007', trader: 'Kigali Fresh Exports', registration_number: 'RW-TR-00045', credit_score: 410, credit_grade: 'B', total_exposure: 8000000, approved_limit: 15000000, utilization: 53.3, payment_history: 'poor', years_trading: 2, trade_volume_ytd: 42000000, last_assessed: '2026-01-30', score_change: -30 },
];

const GRADE_CONFIG: Record<string, { color: string; bg: string }> = {
  AAA: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  AA: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  A: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  BBB: { color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  BB: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  B: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  CCC: { color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
};

const HISTORY_CONFIG: Record<string, { label: string; color: string }> = {
  excellent: { label: 'Excellent', color: '#22C55E' },
  good: { label: 'Good', color: '#3B82F6' },
  fair: { label: 'Fair', color: '#E6A817' },
  poor: { label: 'Poor', color: '#EF4444' },
};

function formatAmount(value: number): string {
  if (value >= 1000000000) return `KSh ${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `KSh ${(value / 1000000).toFixed(0)}M`;
  if (value >= 1000) return `KSh ${(value / 1000).toFixed(0)}K`;
  return `KSh ${value.toLocaleString()}`;
}

function scoreColor(score: number): string {
  if (score >= 800) return '#22C55E';
  if (score >= 700) return '#3B82F6';
  if (score >= 600) return '#E6A817';
  if (score >= 500) return '#F59E0B';
  return '#EF4444';
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CreditAppraisalPage() {
  const { isOversight, filterByOrgName, orgName } = useDataIsolation();

  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');

  const baseProfiles = useMemo(
    () => filterByOrgName(MOCK_PROFILES, 'trader'),
    [filterByOrgName],
  );

  const filtered = useMemo(() => {
    return baseProfiles.filter((p) => {
      if (gradeFilter !== 'all' && p.credit_grade !== gradeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.trader.toLowerCase().includes(q) || p.registration_number.toLowerCase().includes(q);
      }
      return true;
    });
  }, [baseProfiles, search, gradeFilter]);

  const avgScore = baseProfiles.length > 0 ? Math.round(baseProfiles.reduce((s, p) => s + p.credit_score, 0) / baseProfiles.length) : 0;
  const totalExposure = baseProfiles.reduce((s, p) => s + p.total_exposure, 0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <CreditScore sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">{isOversight ? 'Credit Appraisal' : 'My Credit Profile'}</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          {isOversight ? 'Centralized credit scoring and risk assessment for trade counterparties.' : `Credit profile for ${orgName}.`}
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Traders Assessed', value: baseProfiles.length.toString(), color: '#D4AF37' },
          { label: 'Avg Credit Score', value: avgScore.toString(), color: scoreColor(avgScore) },
          { label: 'Total Exposure', value: formatAmount(totalExposure), color: '#3B82F6' },
          { label: 'High Risk (B-)', value: baseProfiles.filter((p) => p.credit_score < 500).length.toString(), color: '#EF4444' },
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
              placeholder="Search by trader name or registration..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField fullWidth size="small" select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} label="Grade">
              <MenuItem value="all">All Grades</MenuItem>
              {Object.keys(GRADE_CONFIG).map((k) => <MenuItem key={k} value={k}>{k}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Credit cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map((p) => {
          const grade = GRADE_CONFIG[p.credit_grade];
          const history = HISTORY_CONFIG[p.payment_history];
          return (
            <Card key={p.id} sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#f0f0f0' }}>{p.trader}</Typography>
                    <Chip label={p.credit_grade} size="small" sx={{ fontSize: 12, height: 24, fontWeight: 700, backgroundColor: grade.bg, color: grade.color }} />
                  </Box>
                  <Typography sx={{ fontSize: 12, color: '#777', fontFamily: 'monospace' }}>{p.registration_number}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 28, fontWeight: 700, fontFamily: "'Lora', serif", color: scoreColor(p.credit_score) }}>
                    {p.credit_score}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, justifyContent: 'flex-end' }}>
                    {p.score_change >= 0 ? (
                      <TrendingUp sx={{ fontSize: 12, color: '#22C55E' }} />
                    ) : (
                      <TrendingDown sx={{ fontSize: 12, color: '#EF4444' }} />
                    )}
                    <Typography sx={{ fontSize: 11, color: p.score_change >= 0 ? '#22C55E' : '#EF4444' }}>
                      {p.score_change >= 0 ? '+' : ''}{p.score_change} pts
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Utilization bar */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 11, color: '#777' }}>Credit Utilization</Typography>
                  <Typography sx={{ fontSize: 11, color: p.utilization > 85 ? '#EF4444' : p.utilization > 70 ? '#E6A817' : '#22C55E' }}>
                    {p.utilization.toFixed(0)}% ({formatAmount(p.total_exposure)} / {formatAmount(p.approved_limit)})
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={p.utilization}
                  sx={{
                    height: 6, borderRadius: 3,
                    backgroundColor: 'rgba(212,175,55,0.08)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: p.utilization > 85 ? '#EF4444' : p.utilization > 70 ? '#E6A817' : '#22C55E',
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Payment History</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: history.color }}>{history.label}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Years Trading</Typography>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{p.years_trading}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>YTD Volume</Typography>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{formatAmount(p.trade_volume_ytd)}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: '#777', textTransform: 'uppercase' }}>Last Assessed</Typography>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{p.last_assessed}</Typography>
                </Box>
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
