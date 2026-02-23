import { useState } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  Typography,
  alpha,
  IconButton,
} from '@mui/material';
import {
  Schedule,
  Person,
  ArrowForward,
  Bookmark,
  BookmarkBorder,
} from '@mui/icons-material';

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

interface Briefing {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  author: string;
  department: string;
  priority: 'urgent' | 'high' | 'routine';
  status: 'new' | 'read' | 'action_required';
  tags: string[];
}

const BRIEFINGS: Briefing[] = [
  {
    id: 'b1',
    title: 'Weekly Trade Intelligence Brief — Week 8, 2026',
    summary: 'Highlights: Rose export volumes recovering after EU phytosanitary resolution. DRC border trade up 22%. AfCFTA Phase II services negotiations advancing ahead of schedule. Mombasa port throughput stable at 1.4M TEUs annualized.',
    category: 'Weekly Brief',
    date: '23 Feb 2026',
    author: 'Trade Intelligence Unit',
    department: 'State Department for Trade',
    priority: 'high',
    status: 'new',
    tags: ['AfCFTA', 'Horticulture', 'Ports'],
  },
  {
    id: 'b2',
    title: 'Impact Assessment: EU Carbon Border Adjustment Mechanism (CBAM)',
    summary: 'CBAM Phase 2 begins October 2026. Estimated impact on Kenya exports: $120M annually across cement, steel, and fertilizer sectors. Recommendation: establish carbon accounting framework for affected exporters by Q3 2026.',
    category: 'Policy Analysis',
    date: '21 Feb 2026',
    author: 'Dr. Amina Hassan',
    department: 'Trade Policy Division',
    priority: 'urgent',
    status: 'action_required',
    tags: ['EU', 'Carbon', 'Manufacturing'],
  },
  {
    id: 'b3',
    title: 'AfCFTA Implementation Progress Report — February 2026',
    summary: 'Kenya has achieved 85% tariff liberalisation under Phase I. Remaining 5% of sensitive products require Cabinet-level decision. Services protocol negotiations: Kenya leading in transport and financial services.',
    category: 'Treaty Report',
    date: '20 Feb 2026',
    author: 'AfCFTA Unit',
    department: 'State Department for Trade',
    priority: 'high',
    status: 'new',
    tags: ['AfCFTA', 'Tariffs', 'Services'],
  },
  {
    id: 'b4',
    title: 'Bilateral Trade Mission Report — DRC & South Sudan',
    summary: 'Trade mission to Kinshasa and Juba completed 12–16 Feb. 47 MoUs signed between Kenyan and DRC/South Sudan firms. Key sectors: construction materials, consumer goods, financial services. Follow-up required on export credit guarantees.',
    category: 'Mission Report',
    date: '18 Feb 2026',
    author: 'Ambassador J. Karanja',
    department: 'Commercial Diplomacy',
    priority: 'routine',
    status: 'read',
    tags: ['DRC', 'South Sudan', 'Trade Mission'],
  },
  {
    id: 'b5',
    title: 'SME Export Readiness Programme — Q1 2026 Results',
    summary: '1,240 SMEs completed the export readiness training programme. 340 are now certified for AfCFTA preferential access. 12 cooperative societies gained collective export licences. Budget utilization: 78% of allocated funds.',
    category: 'Programme Report',
    date: '15 Feb 2026',
    author: 'SME Development Unit',
    department: 'State Department for Trade',
    priority: 'routine',
    status: 'read',
    tags: ['SME', 'Capacity Building', 'AfCFTA'],
  },
  {
    id: 'b6',
    title: 'Economic Intelligence: Global Commodity Price Forecast Q2 2026',
    summary: 'Tea prices expected +4% (favorable). Coffee stable. Cut flowers facing pressure from Ethiopian competition (-3%). Petroleum imports: potential savings of $180M if renegotiated under new Gulf framework. Fertiliser prices declining 8%.',
    category: 'Market Intelligence',
    date: '12 Feb 2026',
    author: 'Economic Research Division',
    department: 'State Department for Trade',
    priority: 'high',
    status: 'new',
    tags: ['Commodities', 'Forecast', 'Markets'],
  },
];

const PRIORITY_CONFIG = {
  urgent: { color: EX.red, label: 'URGENT' },
  high: { color: EX.amber, label: 'HIGH' },
  routine: { color: EX.blue, label: 'ROUTINE' },
};

const STATUS_CONFIG = {
  new: { color: EX.gold, label: 'New' },
  read: { color: alpha(EX.silver, 0.5), label: 'Read' },
  action_required: { color: EX.red, label: 'Action Required' },
};

export default function ExecutiveBriefingsPage() {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
          Reports & Briefings
        </Typography>
        <Typography variant="h4" sx={{ fontFamily: "'Lora', serif", fontWeight: 700, color: EX.white, fontSize: { xs: 22, md: 28 } }}>
          Executive Briefings
        </Typography>
        <Typography sx={{ fontSize: 12, color: EX.silver, mt: 0.5 }}>
          Intelligence reports, policy analyses, and strategic updates prepared for the Permanent Secretary.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Unread Briefings', value: BRIEFINGS.filter((b) => b.status === 'new').length, color: EX.gold },
          { label: 'Action Required', value: BRIEFINGS.filter((b) => b.status === 'action_required').length, color: EX.red },
          { label: 'This Week', value: BRIEFINGS.filter((b) => b.date.includes('Feb 2026')).length, color: EX.emerald },
          { label: 'Bookmarked', value: bookmarked.size, color: EX.amber },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ background: EX.gradientCard, border: `1px solid ${EX.goldBorder}`, borderRadius: '14px', p: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 28, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
              <Typography sx={{ fontSize: 10, color: EX.silver }}>{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Briefing List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {BRIEFINGS.map((b) => {
          const pri = PRIORITY_CONFIG[b.priority];
          const st = STATUS_CONFIG[b.status];
          return (
            <Card
              key={b.id}
              sx={{
                background: EX.gradientCard,
                border: `1px solid ${b.status === 'action_required' ? alpha(EX.red, 0.25) : EX.goldBorder}`,
                borderRadius: '14px',
                p: 2.5,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  border: `1px solid ${alpha(EX.gold, 0.35)}`,
                  transform: 'translateY(-1px)',
                },
                ...(b.status === 'action_required' && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, height: '2px',
                    background: `linear-gradient(90deg, ${EX.red}, ${alpha(EX.red, 0.3)})`,
                  },
                }),
                ...(b.status === 'new' && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, height: '2px',
                    background: EX.gradientGold,
                  },
                }),
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                    <Chip label={b.category} size="small" sx={{ fontSize: 8, height: 18, fontWeight: 700, color: EX.gold, backgroundColor: alpha(EX.gold, 0.08), border: 'none' }} />
                    <Chip label={pri.label} size="small" sx={{ fontSize: 8, height: 18, fontWeight: 700, letterSpacing: '0.05em', color: pri.color, backgroundColor: alpha(pri.color, 0.1), border: 'none' }} />
                    <Chip label={st.label} size="small" sx={{ fontSize: 8, height: 18, fontWeight: 600, color: st.color, backgroundColor: alpha(typeof st.color === 'string' ? st.color : EX.silver, 0.1), border: 'none' }} />
                  </Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: EX.white, lineHeight: 1.3, mb: 0.5 }}>
                    {b.title}
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: alpha(EX.silver, 0.75), lineHeight: 1.5, mb: 1 }}>
                    {b.summary}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Person sx={{ fontSize: 12, color: alpha(EX.silver, 0.4) }} />
                      <Typography sx={{ fontSize: 10, color: alpha(EX.silver, 0.5) }}>{b.author}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Schedule sx={{ fontSize: 12, color: alpha(EX.silver, 0.4) }} />
                      <Typography sx={{ fontSize: 10, color: alpha(EX.silver, 0.5) }}>{b.date}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {b.tags.map((t) => (
                        <Chip key={t} label={t} size="small" sx={{ fontSize: 8, height: 15, color: alpha(EX.silver, 0.6), backgroundColor: alpha(EX.silver, 0.06), border: 'none' }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, ml: 1.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(b.id); }}
                    sx={{ color: bookmarked.has(b.id) ? EX.gold : alpha(EX.silver, 0.3) }}
                  >
                    {bookmarked.has(b.id) ? <Bookmark sx={{ fontSize: 18 }} /> : <BookmarkBorder sx={{ fontSize: 18 }} />}
                  </IconButton>
                  <ArrowForward sx={{ fontSize: 14, color: alpha(EX.silver, 0.2) }} />
                </Box>
              </Box>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: `1px solid ${EX.goldBorder}` }}>
        <Typography sx={{ fontSize: 8, color: alpha(EX.silver, 0.25) }}>
          Classified — For Official Use Only — Powered by Smart Trade Africa
        </Typography>
      </Box>
    </Box>
  );
}
