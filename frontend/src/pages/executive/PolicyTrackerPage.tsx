import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
  alpha,
} from '@mui/material';
import {
  Gavel,
  Schedule,
  CheckCircle,
  Warning,
  Public,
  Handshake,
} from '@mui/icons-material';

// ─── Executive palette ─────────────────────────────────────────────────────

const EX = {
  navy: '#0B1426',
  navyLight: '#0F1D35',
  navyMid: '#132240',
  gold: '#C9A84C',
  goldBorder: 'rgba(201, 168, 76, 0.18)',
  white: '#F8F6F0',
  silver: '#A0A8B8',
  green: '#34D399',
  red: '#F87171',
  amber: '#FBBF24',
  blue: '#60A5FA',
  emerald: '#10B981',
  gradientCard: 'linear-gradient(145deg, rgba(15,29,53,0.95) 0%, rgba(11,20,38,0.98) 100%)',
  gradientGold: 'linear-gradient(135deg, #C9A84C 0%, #E8D48B 50%, #C9A84C 100%)',
};

// ─── Data ─────────────────────────────────────────────────────────────────

const TREATIES = [
  {
    id: 't1',
    name: 'African Continental Free Trade Area (AfCFTA)',
    type: 'Continental FTA',
    status: 'active',
    ratificationDate: 'May 2018',
    tariffReduction: 90,
    keyMilestones: [
      { name: 'Tariff Phase I (90% lines)', progress: 85, deadline: 'Dec 2026' },
      { name: 'Services Protocol', progress: 45, deadline: 'Jun 2027' },
      { name: 'Investment Protocol', progress: 20, deadline: 'Dec 2028' },
    ],
    impact: '+$450M projected trade increase',
  },
  {
    id: 't2',
    name: 'East African Community (EAC) Customs Union',
    type: 'Regional CU',
    status: 'active',
    ratificationDate: 'Jan 2005',
    tariffReduction: 100,
    keyMilestones: [
      { name: 'CET Revision 2026', progress: 78, deadline: 'Mar 2026' },
      { name: 'Single Customs Territory', progress: 62, deadline: 'Dec 2027' },
    ],
    impact: 'Zero intra-EAC tariffs on originating goods',
  },
  {
    id: 't3',
    name: 'COMESA Free Trade Area',
    type: 'Regional FTA',
    status: 'active',
    ratificationDate: 'Oct 2000',
    tariffReduction: 100,
    keyMilestones: [
      { name: 'Digital Trade Protocol', progress: 35, deadline: 'Jun 2026' },
      { name: 'Competition Policy', progress: 55, deadline: 'Dec 2026' },
    ],
    impact: '$3.2B bilateral trade with COMESA members',
  },
  {
    id: 't4',
    name: 'Kenya–UK Economic Partnership Agreement',
    type: 'Bilateral EPA',
    status: 'active',
    ratificationDate: 'Mar 2021',
    tariffReduction: 82,
    keyMilestones: [
      { name: 'Market Access Review', progress: 60, deadline: 'Sep 2026' },
      { name: 'Rules of Origin Update', progress: 40, deadline: 'Dec 2026' },
    ],
    impact: '$1.8B annual Kenya-UK trade',
  },
  {
    id: 't5',
    name: 'Kenya–EU EPA',
    type: 'Regional EPA',
    status: 'negotiation',
    ratificationDate: 'Pending',
    tariffReduction: 0,
    keyMilestones: [
      { name: 'Round 4 Negotiations', progress: 30, deadline: 'Jun 2026' },
      { name: 'Impact Assessment', progress: 70, deadline: 'Mar 2026' },
    ],
    impact: 'Potential $2.4B market access improvement',
  },
];

const NATIONAL_POLICIES = [
  { name: 'National Export Development Strategy 2026–2030', status: 'drafting', lead: 'State Dept for Trade', progress: 45, priority: 'high' },
  { name: 'Buy Kenya Build Kenya (BKBK) Act Implementation', status: 'active', lead: 'Ministry of Trade', progress: 72, priority: 'high' },
  { name: 'Special Economic Zones (SEZ) Expansion Phase II', status: 'active', lead: 'SEZA', progress: 58, priority: 'medium' },
  { name: 'Digital Trade Facilitation — Single Window v2', status: 'active', lead: 'KenTrade', progress: 82, priority: 'high' },
  { name: 'Anti-Counterfeit Strategy 2025–2028', status: 'active', lead: 'ACA Kenya', progress: 61, priority: 'medium' },
  { name: 'Industrial Transformation Programme', status: 'review', lead: 'State Dept for Industry', progress: 35, priority: 'medium' },
];

const WTO_OBLIGATIONS = [
  { name: 'Trade Facilitation Agreement (TFA)', compliance: 91, category: 'A', deadline: 'Implemented' },
  { name: 'Agreement on Agriculture', compliance: 78, category: 'A', deadline: 'Ongoing' },
  { name: 'TRIPS Amendment (Access to Medicines)', compliance: 100, category: 'A', deadline: 'Ratified' },
  { name: 'Fisheries Subsidies Agreement', compliance: 45, category: 'B', deadline: 'Jun 2027' },
  { name: 'E-Commerce Moratorium Compliance', compliance: 88, category: 'A', deadline: 'Ongoing' },
];

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  active: { color: EX.emerald, label: 'Active' },
  negotiation: { color: EX.amber, label: 'Negotiation' },
  drafting: { color: EX.blue, label: 'Drafting' },
  review: { color: '#A78BFA', label: 'Under Review' },
};

const PRIORITY_MAP: Record<string, { color: string }> = {
  high: { color: EX.red },
  medium: { color: EX.amber },
  low: { color: EX.blue },
};

// ─── Page ──────────────────────────────────────────────────────────────────

export default function PolicyTrackerPage() {
  return (
    <Box
      sx={{
        background: `linear-gradient(180deg, ${EX.navy} 0%, ${EX.navyLight} 100%)`,
        minHeight: '100vh',
        mx: -3, mt: -3, mb: -3,
        px: { xs: 2, md: 4 }, py: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: `1px solid ${EX.goldBorder}` }}>
        <Typography sx={{ fontSize: 10, fontWeight: 600, color: EX.gold, letterSpacing: '0.2em', textTransform: 'uppercase', mb: 0.25 }}>
          Strategic Intelligence
        </Typography>
        <Typography variant="h4" sx={{ fontFamily: "'Lora', serif", fontWeight: 700, color: EX.white, fontSize: { xs: 22, md: 28 } }}>
          Policy & Treaty Tracker
        </Typography>
        <Typography sx={{ fontSize: 12, color: EX.silver, mt: 0.5 }}>
          Monitoring trade agreements, national policy implementation, and WTO compliance obligations.
        </Typography>
      </Box>

      {/* Treaty Overview */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Handshake sx={{ fontSize: 18, color: EX.gold }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}>
            Trade Agreements & Treaties
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {TREATIES.map((t) => {
            const st = STATUS_MAP[t.status] || STATUS_MAP.active;
            return (
              <Card key={t.id} sx={{ background: EX.gradientCard, border: `1px solid ${EX.goldBorder}`, borderRadius: '14px', p: 2.5, position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: EX.gradientGold } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Chip label={t.type} size="small" sx={{ fontSize: 8, height: 18, fontWeight: 700, color: EX.gold, backgroundColor: alpha(EX.gold, 0.08), border: 'none' }} />
                      <Chip label={st.label} size="small" sx={{ fontSize: 8, height: 18, fontWeight: 600, color: st.color, backgroundColor: alpha(st.color, 0.1), border: 'none' }} />
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: EX.white }}>{t.name}</Typography>
                    <Typography sx={{ fontSize: 10, color: alpha(EX.silver, 0.6), mt: 0.25 }}>
                      Ratified: {t.ratificationDate} · {t.impact}
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={1.5}>
                  {t.keyMilestones.map((m) => (
                    <Grid size={{ xs: 12, md: 4 }} key={m.name}>
                      <Box sx={{ p: 1.25, borderRadius: '8px', border: `1px solid ${alpha(EX.silver, 0.06)}`, background: alpha(EX.navyMid, 0.5) }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 600, color: EX.white }}>{m.name}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Schedule sx={{ fontSize: 10, color: alpha(EX.silver, 0.4) }} />
                            <Typography sx={{ fontSize: 9, color: EX.silver }}>{m.deadline}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress variant="determinate" value={m.progress} sx={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: alpha(EX.gold, 0.08), '& .MuiLinearProgress-bar': { borderRadius: 2, background: m.progress >= 70 ? EX.emerald : m.progress >= 40 ? EX.amber : EX.blue } }} />
                          <Typography sx={{ fontSize: 9, fontWeight: 600, color: EX.silver, minWidth: 24 }}>{m.progress}%</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            );
          })}
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* National Policy */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ background: EX.gradientCard, border: `1px solid ${EX.goldBorder}`, borderRadius: '14px', p: 2.5, height: '100%', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: EX.gradientGold } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Gavel sx={{ fontSize: 18, color: EX.gold }} />
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}>
                National Trade Policy Initiatives
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {NATIONAL_POLICIES.map((p) => {
                const st = STATUS_MAP[p.status] || STATUS_MAP.active;
                const pri = PRIORITY_MAP[p.priority] || PRIORITY_MAP.medium;
                return (
                  <Box key={p.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: '10px', border: `1px solid ${alpha(EX.silver, 0.06)}`, background: alpha(EX.navyMid, 0.5), '&:hover': { border: `1px solid ${EX.goldBorder}` }, transition: 'border-color 0.2s ease' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: pri.color, flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: EX.white }}>{p.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.25 }}>
                        <Chip label={st.label} size="small" sx={{ fontSize: 8, height: 15, color: st.color, backgroundColor: alpha(st.color, 0.1), border: 'none' }} />
                        <Typography sx={{ fontSize: 9, color: alpha(EX.silver, 0.5) }}>{p.lead}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ minWidth: 100, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress variant="determinate" value={p.progress} sx={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: alpha(EX.gold, 0.08), '& .MuiLinearProgress-bar': { borderRadius: 2, background: p.progress >= 70 ? EX.emerald : p.progress >= 40 ? EX.amber : EX.blue } }} />
                      <Typography sx={{ fontSize: 9, fontWeight: 600, color: EX.silver }}>{p.progress}%</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* WTO Obligations */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ background: EX.gradientCard, border: `1px solid ${EX.goldBorder}`, borderRadius: '14px', p: 2.5, height: '100%', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: EX.gradientGold } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Public sx={{ fontSize: 18, color: EX.gold }} />
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: EX.white, fontFamily: "'Lora', serif" }}>
                WTO Compliance Status
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {WTO_OBLIGATIONS.map((w) => (
                <Box key={w.name} sx={{ p: 1.25, borderRadius: '8px', border: `1px solid ${alpha(EX.silver, 0.06)}`, background: alpha(EX.navyMid, 0.5) }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: EX.white }}>{w.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {w.compliance >= 90 ? <CheckCircle sx={{ fontSize: 12, color: EX.emerald }} /> : <Warning sx={{ fontSize: 12, color: EX.amber }} />}
                      <Typography sx={{ fontSize: 10, fontWeight: 600, color: w.compliance >= 90 ? EX.emerald : EX.amber }}>{w.compliance}%</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip label={`Cat ${w.category}`} size="small" sx={{ fontSize: 8, height: 15, color: EX.gold, backgroundColor: alpha(EX.gold, 0.08), border: 'none' }} />
                    <Typography sx={{ fontSize: 9, color: alpha(EX.silver, 0.5) }}>{w.deadline}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={w.compliance} sx={{ mt: 0.75, height: 4, borderRadius: 2, backgroundColor: alpha(EX.gold, 0.08), '& .MuiLinearProgress-bar': { borderRadius: 2, background: w.compliance >= 90 ? EX.emerald : w.compliance >= 60 ? EX.amber : EX.red } }} />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: `1px solid ${EX.goldBorder}` }}>
        <Typography sx={{ fontSize: 8, color: alpha(EX.silver, 0.25) }}>
          Classified — For Official Use Only — Powered by Smart Trade Africa
        </Typography>
      </Box>
    </Box>
  );
}
