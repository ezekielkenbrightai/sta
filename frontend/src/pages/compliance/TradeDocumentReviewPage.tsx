import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  Chip,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  Description,
  Search as SearchIcon,
  ExpandMore,
  ExpandLess,
  Warning,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Types & Mock data ───────────────────────────────────────────────────────

interface TradeDocReview {
  id: string;
  ref: string;
  trader: string;
  org_name: string;
  doc_type: string;
  origin: string;
  destination: string;
  value_usd: number;
  risk_score: number;
  aml_flag: 'clear' | 'flagged' | 'under_review';
  sanctions_check: 'passed' | 'failed' | 'pending';
  kyc_status: 'verified' | 'expired' | 'pending';
  compliance_notes: string;
}

const MOCK_DOCS: TradeDocReview[] = [
  { id: 'td-001', ref: 'TD-2025-001234', trader: 'Nairobi Exports Ltd', org_name: 'Nairobi Exports Ltd', doc_type: 'Commercial Invoice', origin: '🇰🇪 Kenya', destination: '🇹🇿 Tanzania', value_usd: 48500, risk_score: 22, aml_flag: 'clear', sanctions_check: 'passed', kyc_status: 'verified', compliance_notes: 'Regular exporter with clean history. Trade route well established. No anomalies detected in pricing or volume patterns.' },
  { id: 'td-002', ref: 'TD-2025-001235', trader: 'Lagos Atlantic Trading', org_name: 'Lagos Atlantic Trading', doc_type: 'Bill of Lading', origin: '🇳🇬 Nigeria', destination: '🇬🇭 Ghana', value_usd: 127000, risk_score: 78, aml_flag: 'flagged', sanctions_check: 'passed', kyc_status: 'verified', compliance_notes: 'Unusual value spike — 3x typical transaction size. Flagged for enhanced due diligence. Trader has been active for 2 years but volume patterns changed significantly in Q4.' },
  { id: 'td-003', ref: 'TD-2025-001236', trader: 'Addis Commodities PLC', org_name: 'Addis Commodities PLC', doc_type: 'Certificate of Origin', origin: '🇪🇹 Ethiopia', destination: '🇩🇯 Djibouti', value_usd: 35200, risk_score: 15, aml_flag: 'clear', sanctions_check: 'passed', kyc_status: 'verified', compliance_notes: 'Coffee export along established corridor. All documentation consistent. Certificate of Origin verified against AfCFTA requirements.' },
  { id: 'td-004', ref: 'TD-2025-001237', trader: 'Cape Mining Solutions', org_name: 'Cape Mining Solutions', doc_type: 'Commercial Invoice', origin: '🇿🇦 South Africa', destination: '🇲🇿 Mozambique', value_usd: 289000, risk_score: 45, aml_flag: 'under_review', sanctions_check: 'pending', kyc_status: 'verified', compliance_notes: 'Mining equipment export. Value within expected range but destination company is newly registered (< 6 months). Enhanced screening requested for beneficial ownership verification.' },
  { id: 'td-005', ref: 'TD-2025-001238', trader: 'Nairobi Exports Ltd', org_name: 'Nairobi Exports Ltd', doc_type: 'Packing List', origin: '🇰🇪 Kenya', destination: '🇷🇼 Rwanda', value_usd: 18900, risk_score: 12, aml_flag: 'clear', sanctions_check: 'passed', kyc_status: 'verified', compliance_notes: 'Low-value textile shipment. Standard EAC trade route. No concerns identified.' },
  { id: 'td-006', ref: 'TD-2025-001239', trader: 'Cairo Pharma International', org_name: 'Cairo Pharma International', doc_type: 'Commercial Invoice', origin: '🇪🇬 Egypt', destination: '🇰🇪 Kenya', value_usd: 156000, risk_score: 82, aml_flag: 'flagged', sanctions_check: 'failed', kyc_status: 'expired', compliance_notes: 'CRITICAL: Sanctions screening flagged a partial match on restricted entities list. KYC documentation expired 45 days ago. Trade halted pending full review. Escalated to senior compliance officer.' },
  { id: 'td-007', ref: 'TD-2025-001240', trader: 'Accra Gold Exports', org_name: 'Accra Gold Exports', doc_type: 'Certificate of Origin', origin: '🇬🇭 Ghana', destination: '🇿🇦 South Africa', value_usd: 412000, risk_score: 65, aml_flag: 'under_review', sanctions_check: 'passed', kyc_status: 'verified', compliance_notes: 'Precious metals shipment — automatically flagged for enhanced monitoring per policy. Value within expected range for gold exports. Source mine documentation verified.' },
  { id: 'td-008', ref: 'TD-2025-001241', trader: 'Nairobi Exports Ltd', org_name: 'Nairobi Exports Ltd', doc_type: 'Bill of Lading', origin: '🇰🇪 Kenya', destination: '🇺🇬 Uganda', value_usd: 72500, risk_score: 28, aml_flag: 'clear', sanctions_check: 'passed', kyc_status: 'verified', compliance_notes: 'Regular exporter with 5+ year history. Agricultural product shipment via Northern Corridor. All documentation in order.' },
  { id: 'td-009', ref: 'TD-2025-001242', trader: 'Abidjan Cocoa Corp', org_name: 'Abidjan Cocoa Corp', doc_type: 'Commercial Invoice', origin: '🇨🇮 Côte d\'Ivoire', destination: '🇳🇬 Nigeria', value_usd: 93000, risk_score: 38, aml_flag: 'clear', sanctions_check: 'passed', kyc_status: 'pending', compliance_notes: 'Cocoa beans export. KYC renewal submitted, pending verification (expected within 5 business days). Trade approved conditionally.' },
];

const RISK_COLOR = (score: number) => score > 70 ? '#EF4444' : score > 40 ? '#E6A817' : '#22C55E';
const RISK_LABEL = (score: number) => score > 70 ? 'High' : score > 40 ? 'Medium' : 'Low';

const AML_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  clear: { label: 'Clear', color: '#22C55E', icon: CheckCircle },
  flagged: { label: 'Flagged', color: '#EF4444', icon: ErrorIcon },
  under_review: { label: 'Under Review', color: '#E6A817', icon: Warning },
};

const SANCTIONS_CONFIG: Record<string, { label: string; color: string }> = {
  passed: { label: 'Passed', color: '#22C55E' },
  failed: { label: 'Failed', color: '#EF4444' },
  pending: { label: 'Pending', color: '#E6A817' },
};

const KYC_CONFIG: Record<string, { label: string; color: string }> = {
  verified: { label: 'Verified', color: '#22C55E' },
  expired: { label: 'Expired', color: '#EF4444' },
  pending: { label: 'Pending', color: '#E6A817' },
};

// ─── Component ──────────────────────────────────────────────────────────────────

export default function TradeDocumentReviewPage() {
  const { filterByOrgName } = useDataIsolation();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const orgDocs = useMemo(
    () => filterByOrgName(MOCK_DOCS, 'org_name'),
    [filterByOrgName],
  );

  const filtered = useMemo(() => {
    return orgDocs.filter((d) => {
      if (riskFilter !== 'all') {
        const lvl = RISK_LABEL(d.risk_score).toLowerCase();
        if (lvl !== riskFilter) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return d.ref.toLowerCase().includes(q) || d.trader.toLowerCase().includes(q) || d.doc_type.toLowerCase().includes(q);
      }
      return true;
    });
  }, [orgDocs, search, riskFilter]);

  const stats = useMemo(() => {
    const high = orgDocs.filter((d) => d.risk_score > 70).length;
    const flagged = orgDocs.filter((d) => d.aml_flag === 'flagged' || d.aml_flag === 'under_review').length;
    const cleared = orgDocs.filter((d) => d.aml_flag === 'clear' && d.sanctions_check === 'passed').length;
    return { total: orgDocs.length, high, flagged, cleared };
  }, [orgDocs]);

  const fmtUSD = (v: number) => `$${v.toLocaleString()}`;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Description sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Trade Document Review</Typography>
            <Chip label="READ-ONLY" size="small" sx={{ fontSize: 10, height: 22, backgroundColor: 'rgba(239,68,68,0.12)', color: '#EF4444', fontWeight: 700 }} />
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            Compliance review of trade documents — risk assessment, AML flags, and sanctions checks.
          </Typography>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Documents', value: stats.total.toString(), color: '#D4AF37' },
          { label: 'High Risk', value: stats.high.toString(), color: '#EF4444' },
          { label: 'Flagged for Review', value: stats.flagged.toString(), color: '#E6A817' },
          { label: 'Cleared', value: stats.cleared.toString(), color: '#22C55E' },
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
              placeholder="Search by reference, trader, or doc type..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField fullWidth size="small" select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} label="Risk Level">
              <MenuItem value="all">All Risk Levels</MenuItem>
              <MenuItem value="high">High Risk</MenuItem>
              <MenuItem value="medium">Medium Risk</MenuItem>
              <MenuItem value="low">Low Risk</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Document list */}
      <Card sx={{ overflow: 'hidden' }}>
        {filtered.map((d, i) => {
          const riskColor = RISK_COLOR(d.risk_score);
          const riskLabel = RISK_LABEL(d.risk_score);
          const aml = AML_CONFIG[d.aml_flag];
          const sanctions = SANCTIONS_CONFIG[d.sanctions_check];
          const kyc = KYC_CONFIG[d.kyc_status];
          const isExpanded = expanded === d.id;
          const AmlIcon = aml.icon;

          return (
            <Box key={d.id} sx={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none' }}>
              {/* Row */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '130px 1fr 110px 100px 90px 44px',
                  gap: 1, px: 2.5, py: 1.75,
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                }}
                onClick={() => setExpanded(isExpanded ? null : d.id)}
              >
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{d.ref}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#777' }}>{d.doc_type}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{d.trader}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#777' }}>{d.origin} → {d.destination}</Typography>
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, fontFamily: "'Lora', serif", color: '#f0f0f0' }}>{fmtUSD(d.value_usd)}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: riskColor }} />
                  <Typography sx={{ fontSize: 12, color: riskColor, fontWeight: 600 }}>{d.risk_score}</Typography>
                  <Typography sx={{ fontSize: 10, color: '#777' }}>({riskLabel})</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  <Chip icon={<AmlIcon sx={{ fontSize: 12 }} />} label={aml.label} size="small" sx={{ fontSize: 9, height: 20, backgroundColor: `${aml.color}15`, color: aml.color, '& .MuiChip-icon': { color: aml.color } }} />
                </Box>
                <IconButton size="small" sx={{ color: '#777' }}>
                  {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              {/* Expanded notes */}
              <Collapse in={isExpanded}>
                <Box sx={{ px: 2.5, pb: 2, pt: 0 }}>
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.08)' }}>
                    <Grid container spacing={2} sx={{ mb: 1.5 }}>
                      <Grid size={{ xs: 4 }}>
                        <Typography sx={{ fontSize: 10, color: '#777', mb: 0.25 }}>AML STATUS</Typography>
                        <Chip label={aml.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: `${aml.color}15`, color: aml.color }} />
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography sx={{ fontSize: 10, color: '#777', mb: 0.25 }}>SANCTIONS CHECK</Typography>
                        <Chip label={sanctions.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: `${sanctions.color}15`, color: sanctions.color }} />
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography sx={{ fontSize: 10, color: '#777', mb: 0.25 }}>KYC STATUS</Typography>
                        <Chip label={kyc.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: `${kyc.color}15`, color: kyc.color }} />
                      </Grid>
                    </Grid>
                    <Typography sx={{ fontSize: 11, color: '#777', mb: 0.25 }}>COMPLIANCE NOTES</Typography>
                    <Typography sx={{ fontSize: 12, color: '#b0b0b0', lineHeight: 1.6 }}>{d.compliance_notes}</Typography>
                  </Box>
                </Box>
              </Collapse>
            </Box>
          );
        })}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {orgDocs.length} documents
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
