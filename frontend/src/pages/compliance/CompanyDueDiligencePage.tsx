import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import {
  Verified,
  CheckCircle,
  Cancel,
  Warning,
  Business,
  Person,
  Description,
  Timeline,
} from '@mui/icons-material';
import {
  SCREENED_ENTITIES,
  RISK_TIER_CONFIG,
  STATUS_CONFIG,
} from './ComplianceDashboardPage';

// ─── Directors mock data ─────────────────────────────────────────────────────

export interface Director {
  id: string;
  entityId: string;
  name: string;
  nationality: string;
  nationalityFlag: string;
  idType: string;
  dob: string;
  role: string;
  pepStatus: 'none' | 'PEP-1' | 'PEP-2' | 'PEP-3';
  pepDetail: string;
  sanctionMatch: 'none' | 'exact' | 'fuzzy';
  sanctionDetail: string;
  adverseMediaHits: number;
  adverseMediaSummary: string;
  countryRisk: 'low' | 'medium' | 'high';
}

export const DIRECTORS: Director[] = [
  // Nairobi Exports Ltd
  { id: 'dir-001', entityId: 'ent-001', name: 'John Kipchoge', nationality: 'Kenya', nationalityFlag: '🇰🇪', idType: 'National ID', dob: '1978-03-15', role: 'Managing Director', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 0, adverseMediaSummary: '', countryRisk: 'low' },
  { id: 'dir-002', entityId: 'ent-001', name: 'Mary Wambui', nationality: 'Kenya', nationalityFlag: '🇰🇪', idType: 'National ID', dob: '1982-07-20', role: 'Finance Director', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 0, adverseMediaSummary: '', countryRisk: 'low' },
  { id: 'dir-003', entityId: 'ent-001', name: 'Peter Ochieng', nationality: 'Kenya', nationalityFlag: '🇰🇪', idType: 'Passport', dob: '1975-11-02', role: 'Operations Director', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 0, adverseMediaSummary: '', countryRisk: 'low' },

  // Lagos Trading Co
  { id: 'dir-004', entityId: 'ent-002', name: 'Chukwu Obasanjo', nationality: 'Nigeria', nationalityFlag: '🇳🇬', idType: 'Passport', dob: '1968-04-10', role: 'Chairman', pepStatus: 'PEP-2', pepDetail: 'Former senior advisor to Lagos State Governor', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 1, adverseMediaSummary: 'Named in corruption probe (2024, cleared)', countryRisk: 'medium' },
  { id: 'dir-005', entityId: 'ent-002', name: 'Amara Nwankwo', nationality: 'Nigeria', nationalityFlag: '🇳🇬', idType: 'National ID', dob: '1980-09-22', role: 'CEO', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 0, adverseMediaSummary: '', countryRisk: 'medium' },
  { id: 'dir-006', entityId: 'ent-002', name: 'Taiwo Ibrahim', nationality: 'Nigeria', nationalityFlag: '🇳🇬', idType: 'Passport', dob: '1985-01-15', role: 'COO', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 1, adverseMediaSummary: 'Minor tax dispute (2023, resolved)', countryRisk: 'medium' },
  { id: 'dir-007', entityId: 'ent-002', name: 'Fatima Bello', nationality: 'Nigeria', nationalityFlag: '🇳🇬', idType: 'National ID', dob: '1990-06-30', role: 'CFO', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 0, adverseMediaSummary: '', countryRisk: 'medium' },

  // Cairo Trade House
  { id: 'dir-008', entityId: 'ent-003', name: 'Ahmed Mahmoud', nationality: 'Egypt', nationalityFlag: '🇪🇬', idType: 'Passport', dob: '1965-12-05', role: 'Chairman & CEO', pepStatus: 'PEP-2', pepDetail: 'Brother of current Deputy Minister of Trade, Egypt', sanctionMatch: 'fuzzy', sanctionDetail: 'Fuzzy match (72%) on EU consolidated list — different DOB, same name pattern', adverseMediaHits: 3, adverseMediaSummary: 'Tax evasion allegations (2024), import overpricing claim (2025), political donation controversy', countryRisk: 'medium' },
  { id: 'dir-009', entityId: 'ent-003', name: 'Omar Khalil', nationality: 'Egypt', nationalityFlag: '🇪🇬', idType: 'National ID', dob: '1972-08-18', role: 'Managing Director', pepStatus: 'PEP-3', pepDetail: 'Business associate of PEP-2 (Ahmed Mahmoud)', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 1, adverseMediaSummary: 'Named as co-respondent in tax evasion case', countryRisk: 'medium' },
  { id: 'dir-010', entityId: 'ent-003', name: 'Layla Hassan', nationality: 'Egypt', nationalityFlag: '🇪🇬', idType: 'Passport', dob: '1988-03-25', role: 'Finance Director', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 0, adverseMediaSummary: '', countryRisk: 'medium' },

  // Auto Kenya Ltd — critical
  { id: 'dir-011', entityId: 'ent-007', name: 'James Muturi', nationality: 'Kenya', nationalityFlag: '🇰🇪', idType: 'Passport', dob: '1970-05-14', role: 'CEO', pepStatus: 'PEP-1', pepDetail: 'Former Member of Parliament, linked to sanctioned network', sanctionMatch: 'exact', sanctionDetail: 'EXACT match: OFAC SDN List — SDN ID: OFAC-KE-2026-041', adverseMediaHits: 4, adverseMediaSummary: 'Sanctions evasion (2025), money laundering investigation (2024), asset freeze (2026), fraud charges', countryRisk: 'low' },
  { id: 'dir-012', entityId: 'ent-007', name: 'Alice Wanjiru', nationality: 'Kenya', nationalityFlag: '🇰🇪', idType: 'National ID', dob: '1982-10-30', role: 'CFO', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 1, adverseMediaSummary: 'Named as associate in sanctions investigation', countryRisk: 'low' },
  { id: 'dir-013', entityId: 'ent-007', name: 'David Kamau', nationality: 'Kenya', nationalityFlag: '🇰🇪', idType: 'Passport', dob: '1975-02-08', role: 'Operations Director', pepStatus: 'none', pepDetail: '', sanctionMatch: 'fuzzy', sanctionDetail: 'Fuzzy match (61%) on UN consolidated list — under investigation', adverseMediaHits: 1, adverseMediaSummary: 'Connected to sanctioned entity via business dealings', countryRisk: 'low' },
  { id: 'dir-014', entityId: 'ent-007', name: 'Samuel Otieno', nationality: 'Kenya', nationalityFlag: '🇰🇪', idType: 'National ID', dob: '1990-07-19', role: 'Commercial Director', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 0, adverseMediaSummary: '', countryRisk: 'low' },

  // East Africa Cement Ltd
  { id: 'dir-015', entityId: 'ent-008', name: 'Hassan Ali', nationality: 'Kenya', nationalityFlag: '🇰🇪', idType: 'Passport', dob: '1960-01-12', role: 'Chairman', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 0, adverseMediaSummary: '', countryRisk: 'low' },
  { id: 'dir-016', entityId: 'ent-008', name: 'Grace Njeri', nationality: 'Kenya', nationalityFlag: '🇰🇪', idType: 'National ID', dob: '1978-04-25', role: 'Managing Director', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 1, adverseMediaSummary: 'Environmental compliance dispute (2025, resolved)', countryRisk: 'low' },
  { id: 'dir-017', entityId: 'ent-008', name: 'Thomas Kiptoo', nationality: 'Kenya', nationalityFlag: '🇰🇪', idType: 'National ID', dob: '1983-09-15', role: 'Finance Director', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 0, adverseMediaSummary: '', countryRisk: 'low' },
  { id: 'dir-018', entityId: 'ent-008', name: 'Rashid Omar', nationality: 'Tanzania', nationalityFlag: '🇹🇿', idType: 'Passport', dob: '1971-11-30', role: 'Non-Executive Director', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 0, adverseMediaSummary: '', countryRisk: 'low' },
  { id: 'dir-019', entityId: 'ent-008', name: 'Patrick Mwangi', nationality: 'Kenya', nationalityFlag: '🇰🇪', idType: 'National ID', dob: '1988-06-07', role: 'Company Secretary', pepStatus: 'none', pepDetail: '', sanctionMatch: 'none', sanctionDetail: '', adverseMediaHits: 0, adverseMediaSummary: '', countryRisk: 'low' },
];

// ─── Document checklist ──────────────────────────────────────────────────────

interface DocItem {
  label: string;
  status: 'submitted' | 'missing' | 'expired' | 'verified';
}

const DOC_CHECKLIST: Record<string, DocItem[]> = {
  'ent-001': [
    { label: 'Certificate of Incorporation', status: 'verified' },
    { label: 'Tax Clearance Certificate', status: 'verified' },
    { label: 'Director ID Documents', status: 'verified' },
    { label: 'UBO Declaration', status: 'verified' },
    { label: 'Audited Financial Statements', status: 'verified' },
    { label: 'AML Policy Declaration', status: 'verified' },
  ],
  'ent-003': [
    { label: 'Certificate of Incorporation', status: 'verified' },
    { label: 'Tax Clearance Certificate', status: 'submitted' },
    { label: 'Director ID Documents', status: 'submitted' },
    { label: 'UBO Declaration', status: 'missing' },
    { label: 'Audited Financial Statements', status: 'expired' },
    { label: 'AML Policy Declaration', status: 'missing' },
  ],
  'ent-007': [
    { label: 'Certificate of Incorporation', status: 'verified' },
    { label: 'Tax Clearance Certificate', status: 'expired' },
    { label: 'Director ID Documents', status: 'submitted' },
    { label: 'UBO Declaration', status: 'missing' },
    { label: 'Audited Financial Statements', status: 'missing' },
    { label: 'AML Policy Declaration', status: 'missing' },
  ],
};

const DOC_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  verified: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  submitted: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  missing: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  expired: { color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
};

// ─── Screening timeline ──────────────────────────────────────────────────────

interface TimelineEvent {
  date: string;
  action: string;
  officer: string;
  outcome: 'cleared' | 'flagged' | 'blocked' | 'info';
}

const TIMELINE: Record<string, TimelineEvent[]> = {
  'ent-001': [
    { date: '2026-02-18', action: 'Periodic re-screening complete', officer: 'Wanjiku Karanja', outcome: 'cleared' },
    { date: '2025-08-20', action: 'Periodic re-screening complete', officer: 'Wanjiku Karanja', outcome: 'cleared' },
    { date: '2025-02-15', action: 'Initial onboarding screening', officer: 'Wanjiku Karanja', outcome: 'cleared' },
  ],
  'ent-003': [
    { date: '2026-02-10', action: 'Enhanced due diligence triggered — PEP-2 match', officer: 'Wanjiku Karanja', outcome: 'flagged' },
    { date: '2025-12-01', action: 'Adverse media flag raised', officer: 'Wanjiku Karanja', outcome: 'flagged' },
    { date: '2025-08-15', action: 'Periodic re-screening — PEP association noted', officer: 'Wanjiku Karanja', outcome: 'flagged' },
    { date: '2025-03-10', action: 'Initial onboarding screening', officer: 'Wanjiku Karanja', outcome: 'cleared' },
  ],
  'ent-007': [
    { date: '2026-02-22', action: 'OFAC match confirmed — ENTITY BLOCKED', officer: 'Wanjiku Karanja', outcome: 'blocked' },
    { date: '2026-02-20', action: 'OFAC SDN match detected — escalated', officer: 'Wanjiku Karanja', outcome: 'flagged' },
    { date: '2026-01-15', action: 'Enhanced due diligence triggered', officer: 'Wanjiku Karanja', outcome: 'flagged' },
    { date: '2025-11-01', action: 'Periodic re-screening — adverse media found', officer: 'Wanjiku Karanja', outcome: 'flagged' },
    { date: '2025-06-01', action: 'Initial onboarding screening', officer: 'Wanjiku Karanja', outcome: 'cleared' },
  ],
};

const TIMELINE_COLORS: Record<string, string> = {
  cleared: '#22C55E',
  flagged: '#E6A817',
  blocked: '#EF4444',
  info: '#3B82F6',
};

const PEP_COLORS: Record<string, { color: string; bg: string }> = {
  none: { color: '#555', bg: 'rgba(85,85,85,0.1)' },
  'PEP-1': { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  'PEP-2': { color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
  'PEP-3': { color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CompanyDueDiligencePage() {
  const { id } = useParams<{ id: string }>();
  const [notes, setNotes] = useState('');

  // Default to first entity with good data if no ID or invalid
  const entityId = id && SCREENED_ENTITIES.find((e) => e.id === id) ? id : 'ent-001';
  const entity = SCREENED_ENTITIES.find((e) => e.id === entityId)!;
  const directors = DIRECTORS.filter((d) => d.entityId === entityId);
  const docs = DOC_CHECKLIST[entityId] || [];
  const timeline = TIMELINE[entityId] || [];
  const tier = RISK_TIER_CONFIG[entity.riskTier];
  const sts = STATUS_CONFIG[entity.status];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Verified sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Company Due Diligence</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Comprehensive compliance profile for {entity.name}.
        </Typography>
      </Box>

      {/* ── Entity Header ──────────────────────────────────────────── */}
      <Card sx={{ p: 2.5, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Business sx={{ color: '#D4AF37', fontSize: 28 }} />
              <Box>
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#f0f0f0', fontFamily: "'Lora', serif" }}>{entity.name}</Typography>
                <Typography sx={{ fontSize: 12, color: '#777' }}>
                  {entity.countryFlag} {entity.country} · {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)} · {entity.industry}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`${tier.label} Risk`} size="small" sx={{ fontSize: 10, height: 22, color: tier.color, backgroundColor: tier.bg }} />
              <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 22, color: sts.color, backgroundColor: sts.bg }} />
              <Chip label={`${entity.directorCount} Directors`} size="small" sx={{ fontSize: 10, height: 22, color: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.1)' }} />
              {entity.pepMatches > 0 && <Chip label={`${entity.pepMatches} PEP Match${entity.pepMatches > 1 ? 'es' : ''}`} size="small" sx={{ fontSize: 10, height: 22, color: '#F97316', backgroundColor: 'rgba(249,115,22,0.1)' }} />}
              {entity.sanctionHits > 0 && <Chip label={`${entity.sanctionHits} Sanction Hit${entity.sanctionHits > 1 ? 's' : ''}`} size="small" sx={{ fontSize: 10, height: 22, color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.1)' }} />}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: { md: 'flex-end' } }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: 36, fontWeight: 700, fontFamily: "'Lora', serif", color: tier.color }}>{entity.riskScore}</Typography>
                <Typography sx={{ fontSize: 10, color: '#555' }}>RISK SCORE</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Button variant="contained" size="small" sx={{ textTransform: 'none', fontSize: 12 }}>
                  {entity.status === 'blocked' ? 'Unblock' : 'Approve'}
                </Button>
                <Button variant="outlined" size="small" color="warning" sx={{ textTransform: 'none', fontSize: 12 }}>
                  {entity.status === 'blocked' ? 'Maintain Block' : 'Flag'}
                </Button>
                <Button variant="outlined" size="small" color="error" sx={{ textTransform: 'none', fontSize: 12 }}>
                  {entity.status === 'blocked' ? 'Escalate' : 'Block'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3}>
        {/* ── Directors / UBO Section ────────────────────────────────── */}
        <Grid size={12}>
          <Card sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Person sx={{ color: '#D4AF37', fontSize: 20 }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Directors & Beneficial Owners</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {directors.map((d) => {
                const pepCfg = PEP_COLORS[d.pepStatus];
                return (
                  <Box
                    key={d.id}
                    sx={{
                      p: 2, borderRadius: 1,
                      backgroundColor: d.sanctionMatch === 'exact' ? 'rgba(239,68,68,0.05)' : d.pepStatus !== 'none' ? 'rgba(249,115,22,0.03)' : 'rgba(212,175,55,0.02)',
                      border: d.sanctionMatch === 'exact' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(212,175,55,0.05)',
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{d.name}</Typography>
                        <Typography sx={{ fontSize: 11, color: '#777' }}>{d.role}</Typography>
                        <Typography sx={{ fontSize: 11, color: '#555' }}>{d.nationalityFlag} {d.nationality} · {d.idType}</Typography>
                      </Grid>
                      <Grid size={{ xs: 4, sm: 2 }}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>PEP Status</Typography>
                        <Chip label={d.pepStatus === 'none' ? 'Clear' : d.pepStatus} size="small" sx={{ fontSize: 10, height: 20, color: pepCfg.color, backgroundColor: pepCfg.bg, mt: 0.5 }} />
                        {d.pepDetail && <Typography sx={{ fontSize: 10, color: '#777', mt: 0.5 }}>{d.pepDetail}</Typography>}
                      </Grid>
                      <Grid size={{ xs: 4, sm: 2 }}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Sanctions</Typography>
                        <Chip
                          label={d.sanctionMatch === 'none' ? 'Clear' : d.sanctionMatch === 'exact' ? 'EXACT MATCH' : 'Fuzzy Match'}
                          size="small"
                          icon={d.sanctionMatch === 'exact' ? <Cancel sx={{ fontSize: 12 }} /> : d.sanctionMatch === 'fuzzy' ? <Warning sx={{ fontSize: 12 }} /> : <CheckCircle sx={{ fontSize: 12 }} />}
                          sx={{
                            fontSize: 10, height: 20, mt: 0.5,
                            color: d.sanctionMatch === 'exact' ? '#EF4444' : d.sanctionMatch === 'fuzzy' ? '#E6A817' : '#22C55E',
                            backgroundColor: d.sanctionMatch === 'exact' ? 'rgba(239,68,68,0.1)' : d.sanctionMatch === 'fuzzy' ? 'rgba(230,168,23,0.1)' : 'rgba(34,197,94,0.1)',
                          }}
                        />
                        {d.sanctionDetail && <Typography sx={{ fontSize: 10, color: d.sanctionMatch === 'exact' ? '#EF4444' : '#777', mt: 0.5 }}>{d.sanctionDetail}</Typography>}
                      </Grid>
                      <Grid size={{ xs: 4, sm: 2 }}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Adverse Media</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: d.adverseMediaHits > 0 ? '#F97316' : '#555', mt: 0.5 }}>
                          {d.adverseMediaHits > 0 ? `${d.adverseMediaHits} hit${d.adverseMediaHits > 1 ? 's' : ''}` : 'None'}
                        </Typography>
                        {d.adverseMediaSummary && <Typography sx={{ fontSize: 10, color: '#777', mt: 0.5 }}>{d.adverseMediaSummary}</Typography>}
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>Country Risk</Typography>
                        <Chip
                          label={d.countryRisk.charAt(0).toUpperCase() + d.countryRisk.slice(1)}
                          size="small"
                          sx={{
                            fontSize: 10, height: 20, mt: 0.5,
                            color: d.countryRisk === 'high' ? '#EF4444' : d.countryRisk === 'medium' ? '#E6A817' : '#22C55E',
                            backgroundColor: d.countryRisk === 'high' ? 'rgba(239,68,68,0.1)' : d.countryRisk === 'medium' ? 'rgba(230,168,23,0.1)' : 'rgba(34,197,94,0.1)',
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* ── Document Checklist ──────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Description sx={{ color: '#D4AF37', fontSize: 20 }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Document Checklist</Typography>
            </Box>
            {docs.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {docs.map((d) => {
                  const dcfg = DOC_STATUS_COLORS[d.status];
                  return (
                    <Box key={d.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                      <Typography sx={{ fontSize: 13, color: '#b0b0b0' }}>{d.label}</Typography>
                      <Chip label={d.status.charAt(0).toUpperCase() + d.status.slice(1)} size="small" sx={{ fontSize: 10, height: 20, color: dcfg.color, backgroundColor: dcfg.bg }} />
                    </Box>
                  );
                })}
                <Box sx={{ mt: 1 }}>
                  <Typography sx={{ fontSize: 11, color: '#555' }}>
                    Completion: {docs.filter((d) => d.status === 'verified').length}/{docs.length}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(docs.filter((d) => d.status === 'verified').length / docs.length) * 100}
                    sx={{
                      height: 4, borderRadius: 2, mt: 0.5,
                      backgroundColor: 'rgba(212,175,55,0.1)',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#22C55E', borderRadius: 2 },
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12, color: '#555', fontStyle: 'italic' }}>No document records available for this entity.</Typography>
            )}
          </Card>
        </Grid>

        {/* ── Screening Timeline ──────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Timeline sx={{ color: '#D4AF37', fontSize: 20 }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Screening History</Typography>
            </Box>
            {timeline.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {timeline.map((t, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, pl: 1, borderLeft: `2px solid ${TIMELINE_COLORS[t.outcome]}` }}>
                    <Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{t.action}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>{t.date} — {t.officer}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12, color: '#555', fontStyle: 'italic' }}>No screening history available.</Typography>
            )}
          </Card>
        </Grid>

        {/* ── Compliance Officer Notes ─────────────────────────────────── */}
        <Grid size={12}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 1.5 }}>Compliance Officer Notes</Typography>
            <TextField
              fullWidth multiline rows={3}
              placeholder="Add notes about this entity's compliance status..."
              value={notes} onChange={(e) => setNotes(e.target.value)}
              size="small"
            />
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" size="small" sx={{ textTransform: 'none' }}>Save Note</Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
