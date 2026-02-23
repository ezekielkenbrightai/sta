import { useState } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  Typography,
  alpha,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  CheckCircle,
  Public,
  LocalShipping,
  AccountBalance,
  Gavel,
  Shield,
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

interface Alert {
  id: string;
  title: string;
  detail: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  source: string;
  time: string;
  icon: React.ReactNode;
  actionRequired: boolean;
  resolved: boolean;
}

const ALL_ALERTS: Alert[] = [
  {
    id: 'sa1', title: 'Horticulture Export Decline — EU Phytosanitary Alert',
    detail: 'Rose and vegetable exports to EU dropped 18% due to new MRL requirements effective Feb 2026. 12 Kenyan exporters received interception notices. KFC and KEPHIS coordinating rapid response.',
    severity: 'critical', category: 'Trade', source: 'KFC / KEPHIS', time: '2h ago',
    icon: <TrendingUp sx={{ fontSize: 16 }} />, actionRequired: true, resolved: false,
  },
  {
    id: 'sa2', title: 'AfCFTA Tariff Non-Compliance — 3 Product Categories',
    detail: 'Kenya is behind schedule on tariff reductions for dairy (HS 04), processed foods (HS 21), and automotive parts (HS 87). AfCFTA Secretariat has issued a formal notification. CS briefing required.',
    severity: 'critical', category: 'Treaty', source: 'AfCFTA Secretariat', time: '4h ago',
    icon: <Gavel sx={{ fontSize: 16 }} />, actionRequired: true, resolved: false,
  },
  {
    id: 'sa3', title: 'Customs Revenue Surplus — Q2 2026',
    detail: 'KES 62.8B collected vs KES 58.1B target (+8.1%). Surplus driven by increased intra-African imports and improved electronic declaration compliance. Minister may wish to note in budget statement.',
    severity: 'medium', category: 'Revenue', source: 'KRA', time: '6h ago',
    icon: <AccountBalance sx={{ fontSize: 16 }} />, actionRequired: false, resolved: false,
  },
  {
    id: 'sa4', title: 'Port of Mombasa — Container Dwell Time Alert',
    detail: 'Average dwell time increased to 5.2 days from 4.1 days (SLA: 4.0). 2,300 containers pending clearance >7 days. Primary cause: delayed KRA assessments for transit cargo to Uganda.',
    severity: 'high', category: 'Logistics', source: 'Kenya Ports Authority', time: '8h ago',
    icon: <LocalShipping sx={{ fontSize: 16 }} />, actionRequired: true, resolved: false,
  },
  {
    id: 'sa5', title: 'WTO Trade Policy Review — Response Deadline',
    detail: 'Draft Kenya trade policy review report submitted by WTO Secretariat. Kenya must submit written response by 15 March 2026. Review covers trade facilitation, agricultural subsidies, and services commitments.',
    severity: 'high', category: 'Treaty', source: 'WTO Secretariat', time: '1d ago',
    icon: <Public sx={{ fontSize: 16 }} />, actionRequired: true, resolved: false,
  },
  {
    id: 'sa6', title: 'DRC Border Trade Surge — +22% MoM',
    detail: 'Kenya-DRC border trade through Busia and Malaba increased 22% month-on-month. Key commodities: construction materials, consumer electronics, textiles. Customs processing capacity adequate.',
    severity: 'low', category: 'Trade', source: 'Trade Intelligence Unit', time: '1d ago',
    icon: <TrendingUp sx={{ fontSize: 16 }} />, actionRequired: false, resolved: false,
  },
  {
    id: 'sa7', title: 'Anti-Counterfeit Seizure — Nairobi Industrial Area',
    detail: 'ACA Kenya seized $2.4M of counterfeit electronics and pharmaceuticals from 3 warehouses. 8 suspects arrested. 70% of goods had fraudulent AfCFTA certificates of origin.',
    severity: 'high', category: 'Compliance', source: 'ACA Kenya', time: '2d ago',
    icon: <Shield sx={{ fontSize: 16 }} />, actionRequired: false, resolved: false,
  },
  {
    id: 'sa8', title: 'Kenya-UK EPA Market Access Review — On Track',
    detail: 'Technical committee completed Phase 1 review of tariff schedules. 14 new product categories proposed for improved market access. Next meeting scheduled for March 2026 in London.',
    severity: 'low', category: 'Treaty', source: 'Commercial Diplomacy', time: '3d ago',
    icon: <CheckCircle sx={{ fontSize: 16 }} />, actionRequired: false, resolved: true,
  },
];

const SEVERITY_CONFIG = {
  critical: { color: EX.red, bg: alpha(EX.red, 0.06), border: alpha(EX.red, 0.15), label: 'CRITICAL' },
  high: { color: EX.amber, bg: alpha(EX.amber, 0.06), border: alpha(EX.amber, 0.15), label: 'HIGH' },
  medium: { color: EX.emerald, bg: alpha(EX.emerald, 0.06), border: alpha(EX.emerald, 0.15), label: 'MEDIUM' },
  low: { color: EX.blue, bg: alpha(EX.blue, 0.06), border: alpha(EX.blue, 0.15), label: 'LOW' },
};

export default function StrategicAlertsPage() {
  const [tab, setTab] = useState(0);

  const filtered = tab === 0
    ? ALL_ALERTS
    : tab === 1
      ? ALL_ALERTS.filter((a) => a.actionRequired && !a.resolved)
      : tab === 2
        ? ALL_ALERTS.filter((a) => a.severity === 'critical' || a.severity === 'high')
        : ALL_ALERTS.filter((a) => a.resolved);

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
          Strategic Alerts
        </Typography>
        <Typography sx={{ fontSize: 12, color: EX.silver, mt: 0.5 }}>
          Real-time trade intelligence alerts, compliance notifications, and escalations requiring PS-level attention.
        </Typography>
      </Box>

      {/* Summary chips */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Critical', count: ALL_ALERTS.filter((a) => a.severity === 'critical').length, color: EX.red },
          { label: 'High Priority', count: ALL_ALERTS.filter((a) => a.severity === 'high').length, color: EX.amber },
          { label: 'Action Required', count: ALL_ALERTS.filter((a) => a.actionRequired && !a.resolved).length, color: EX.gold },
          { label: 'Resolved', count: ALL_ALERTS.filter((a) => a.resolved).length, color: EX.emerald },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ background: EX.gradientCard, border: `1px solid ${EX.goldBorder}`, borderRadius: '14px', p: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 28, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.count}</Typography>
              <Typography sx={{ fontSize: 10, color: EX.silver }}>{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 2,
          '& .MuiTab-root': { color: EX.silver, fontSize: 12, fontWeight: 600, textTransform: 'none', minHeight: 36 },
          '& .Mui-selected': { color: EX.gold },
          '& .MuiTabs-indicator': { backgroundColor: EX.gold, height: 2 },
        }}
      >
        <Tab label={`All (${ALL_ALERTS.length})`} />
        <Tab label={`Action Required (${ALL_ALERTS.filter((a) => a.actionRequired && !a.resolved).length})`} />
        <Tab label={`Critical/High (${ALL_ALERTS.filter((a) => a.severity === 'critical' || a.severity === 'high').length})`} />
        <Tab label={`Resolved (${ALL_ALERTS.filter((a) => a.resolved).length})`} />
      </Tabs>

      {/* Alert List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.map((a) => {
          const sc = SEVERITY_CONFIG[a.severity];
          return (
            <Card
              key={a.id}
              sx={{
                background: EX.gradientCard,
                border: `1px solid ${a.resolved ? alpha(EX.silver, 0.08) : sc.border}`,
                borderRadius: '14px',
                p: 2,
                position: 'relative',
                overflow: 'hidden',
                opacity: a.resolved ? 0.6 : 1,
                '&::before': !a.resolved ? {
                  content: '""', position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px',
                  background: sc.color,
                } : {},
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: sc.bg, color: sc.color, flexShrink: 0, mt: 0.25 }}>
                  {a.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                    <Chip label={sc.label} size="small" sx={{ fontSize: 8, height: 18, fontWeight: 700, letterSpacing: '0.05em', color: sc.color, backgroundColor: alpha(sc.color, 0.12), border: 'none' }} />
                    <Chip label={a.category} size="small" sx={{ fontSize: 8, height: 18, color: EX.gold, backgroundColor: alpha(EX.gold, 0.08), border: 'none' }} />
                    {a.actionRequired && !a.resolved && (
                      <Chip
                        icon={<Warning sx={{ fontSize: 10, color: `${EX.red} !important` }} />}
                        label="Action Required"
                        size="small"
                        sx={{ fontSize: 8, height: 18, fontWeight: 600, color: EX.red, backgroundColor: alpha(EX.red, 0.08), border: 'none' }}
                      />
                    )}
                    {a.resolved && (
                      <Chip
                        icon={<CheckCircle sx={{ fontSize: 10, color: `${EX.emerald} !important` }} />}
                        label="Resolved"
                        size="small"
                        sx={{ fontSize: 8, height: 18, color: EX.emerald, backgroundColor: alpha(EX.emerald, 0.08), border: 'none' }}
                      />
                    )}
                    <Typography sx={{ fontSize: 10, color: alpha(EX.silver, 0.4), ml: 'auto' }}>{a.time}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: EX.white, lineHeight: 1.3, mb: 0.5 }}>
                    {a.title}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: alpha(EX.silver, 0.7), lineHeight: 1.5 }}>
                    {a.detail}
                  </Typography>
                  <Typography sx={{ fontSize: 9, color: alpha(EX.gold, 0.4), mt: 0.75 }}>
                    Source: {a.source}
                  </Typography>
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
