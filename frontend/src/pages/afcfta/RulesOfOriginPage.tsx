import { useMemo, useState } from 'react';
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
  VerifiedUser,
  Search as SearchIcon,
} from '@mui/icons-material';

// ─── Types & Mock data ───────────────────────────────────────────────────────

interface ProductRule {
  id: string;
  hs_code: string;
  description: string;
  rule_type: 'WO' | 'CTH' | 'CC' | 'VA';
  min_value_addition: number;
  status: 'compliant' | 'non_compliant' | 'under_review' | 'exempt';
  compliant_countries: string[];
}

const MOCK_RULES: ProductRule[] = [
  { id: 'pr-001', hs_code: '0901.11', description: 'Coffee, not roasted', rule_type: 'WO', min_value_addition: 0, status: 'compliant', compliant_countries: ['🇪🇹 Ethiopia', '🇺🇬 Uganda', '🇹🇿 Tanzania', '🇰🇪 Kenya'] },
  { id: 'pr-002', hs_code: '0902.10', description: 'Green tea', rule_type: 'WO', min_value_addition: 0, status: 'compliant', compliant_countries: ['🇰🇪 Kenya', '🇷🇼 Rwanda', '🇲🇼 Malawi'] },
  { id: 'pr-003', hs_code: '1701.13', description: 'Raw cane sugar', rule_type: 'VA', min_value_addition: 40, status: 'under_review', compliant_countries: ['🇿🇦 South Africa', '🇲🇿 Mozambique'] },
  { id: 'pr-004', hs_code: '2523.29', description: 'Portland cement', rule_type: 'CTH', min_value_addition: 30, status: 'compliant', compliant_countries: ['🇳🇬 Nigeria', '🇹🇿 Tanzania', '🇪🇹 Ethiopia', '🇬🇭 Ghana'] },
  { id: 'pr-005', hs_code: '3004.90', description: 'Medicaments, retail', rule_type: 'CC', min_value_addition: 45, status: 'compliant', compliant_countries: ['🇿🇦 South Africa', '🇪🇬 Egypt', '🇰🇪 Kenya'] },
  { id: 'pr-006', hs_code: '6109.10', description: 'T-shirts, cotton', rule_type: 'VA', min_value_addition: 35, status: 'non_compliant', compliant_countries: ['🇬🇭 Ghana'] },
  { id: 'pr-007', hs_code: '7108.12', description: 'Gold, semi-manufactured', rule_type: 'WO', min_value_addition: 0, status: 'exempt', compliant_countries: ['🇿🇦 South Africa', '🇬🇭 Ghana', '🇹🇿 Tanzania', '🇲🇱 Mali'] },
  { id: 'pr-008', hs_code: '8703.23', description: 'Motor vehicles 1500-3000cc', rule_type: 'VA', min_value_addition: 55, status: 'under_review', compliant_countries: ['🇿🇦 South Africa', '🇲🇦 Morocco'] },
  { id: 'pr-009', hs_code: '1006.30', description: 'Semi-milled rice', rule_type: 'CTH', min_value_addition: 25, status: 'non_compliant', compliant_countries: ['🇹🇿 Tanzania'] },
  { id: 'pr-010', hs_code: '1801.00', description: 'Cocoa beans, whole', rule_type: 'WO', min_value_addition: 0, status: 'compliant', compliant_countries: ['🇬🇭 Ghana', '🇨🇮 Côte d\'Ivoire', '🇳🇬 Nigeria', '🇨🇲 Cameroon'] },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  compliant: { label: 'Compliant', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  non_compliant: { label: 'Non-Compliant', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  under_review: { label: 'Under Review', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  exempt: { label: 'Exempt', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
};

const RULE_TYPE_LABELS: Record<string, { full: string; color: string }> = {
  WO: { full: 'Wholly Obtained', color: '#22C55E' },
  CTH: { full: 'Change in Tariff Heading', color: '#3B82F6' },
  CC: { full: 'Change in Chapter', color: '#8B5CF6' },
  VA: { full: 'Value Addition', color: '#D4AF37' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RulesOfOriginPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_RULES.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return r.hs_code.includes(q) || r.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_RULES.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });
    return counts;
  }, []);

  const complianceRate = useMemo(() => {
    const relevant = MOCK_RULES.filter((r) => r.status !== 'exempt');
    if (!relevant.length) return 0;
    const compliant = relevant.filter((r) => r.status === 'compliant').length;
    return Math.round((compliant / relevant.length) * 100);
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <VerifiedUser sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Rules of Origin</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            AfCFTA product-specific rules of origin, compliance status, and eligible countries.
          </Typography>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Product Rules', value: MOCK_RULES.length.toString(), color: '#D4AF37' },
          { label: 'Compliance Rate', value: `${complianceRate}%`, color: '#22C55E' },
          { label: 'Under Review', value: (statusCounts['under_review'] || 0).toString(), color: '#E6A817' },
          { label: 'Non-Compliant', value: (statusCounts['non_compliant'] || 0).toString(), color: '#EF4444' },
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
              placeholder="Search by HS code or product..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField fullWidth size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card sx={{ overflow: 'hidden', mb: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 60px 70px 90px 1fr',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['HS Code', 'Product', 'Rule', 'Min VA', 'Status', 'Compliant Countries'].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {filtered.map((r, i) => {
          const status = STATUS_CONFIG[r.status];
          const ruleType = RULE_TYPE_LABELS[r.rule_type];
          return (
            <Box
              key={r.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 60px 70px 90px 1fr',
                gap: 1, px: 2.5, py: 1.75,
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{r.hs_code}</Typography>
              <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{r.description}</Typography>
              <Chip label={r.rule_type} size="small" sx={{ fontSize: 11, height: 22, backgroundColor: `${ruleType.color}18`, color: ruleType.color, fontWeight: 600 }} />
              <Typography sx={{ fontSize: 13, color: r.min_value_addition > 0 ? '#D4AF37' : '#555' }}>
                {r.min_value_addition > 0 ? `${r.min_value_addition}%` : 'N/A'}
              </Typography>
              <Chip label={status.label} size="small" sx={{ fontSize: 10, height: 22, backgroundColor: status.bg, color: status.color }} />
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {r.compliant_countries.map((c) => (
                  <Chip key={c} label={c} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: 'rgba(212,175,55,0.06)', color: '#999' }} />
                ))}
              </Box>
            </Box>
          );
        })}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {MOCK_RULES.length} product rules
          </Typography>
        </Box>
      </Card>

      {/* Legend */}
      <Card sx={{ p: 2.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 1.5 }}>Origin Rule Reference</Typography>
        <Grid container spacing={2}>
          {Object.entries(RULE_TYPE_LABELS).map(([code, cfg]) => (
            <Grid size={{ xs: 6, sm: 3 }} key={code}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label={code} size="small" sx={{ fontSize: 11, height: 22, backgroundColor: `${cfg.color}18`, color: cfg.color, fontWeight: 600 }} />
                <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{cfg.full}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );
}
