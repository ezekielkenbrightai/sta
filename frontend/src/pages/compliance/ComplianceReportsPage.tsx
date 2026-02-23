import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  Assessment,
  FileDownload,
  Description,
  Schedule,
  PictureAsPdf,
  TableChart,
} from '@mui/icons-material';
import { SCREENED_ENTITIES } from './ComplianceDashboardPage';

// ─── Report templates ────────────────────────────────────────────────────────

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'entity' | 'portfolio' | 'regulatory' | 'audit';
  icon: typeof Description;
  color: string;
  exportFormats: string[];
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  { id: 'rpt-01', name: 'Full Due Diligence Report', description: 'Complete KYC/KYB report for a single entity — directors, screening results, risk breakdown, document status.', category: 'entity', icon: Description, color: '#3B82F6', exportFormats: ['PDF', 'DOCX'] },
  { id: 'rpt-02', name: 'Portfolio Risk Summary', description: 'Aggregated risk overview of all screened entities — risk distribution, tier breakdown, trend analysis.', category: 'portfolio', icon: TableChart, color: '#D4AF37', exportFormats: ['PDF', 'XLSX', 'CSV'] },
  { id: 'rpt-03', name: 'PEP Exposure Report', description: 'All Politically Exposed Persons identified across the portfolio — PEP levels, associated entities, risk implications.', category: 'regulatory', icon: Description, color: '#F97316', exportFormats: ['PDF', 'CSV'] },
  { id: 'rpt-04', name: 'Sanctions Screening Certificate', description: 'Formal certificate confirming entity has been screened against all applicable sanctions lists.', category: 'entity', icon: PictureAsPdf, color: '#22C55E', exportFormats: ['PDF'] },
  { id: 'rpt-05', name: 'AML Audit Trail', description: 'Complete audit log of all compliance actions — screenings, decisions, escalations, officer notes.', category: 'audit', icon: Description, color: '#8B5CF6', exportFormats: ['PDF', 'XLSX'] },
  { id: 'rpt-06', name: 'Watchlist Monitoring Report', description: 'Summary of all watchlist matches, false positives, confirmed matches, and pending reviews.', category: 'regulatory', icon: TableChart, color: '#EF4444', exportFormats: ['PDF', 'CSV'] },
  { id: 'rpt-07', name: 'Director/UBO Screening Report', description: 'Cross-entity director analysis — PEP status, sanctions, adverse media, country risk overlay.', category: 'portfolio', icon: Description, color: '#E6A817', exportFormats: ['PDF', 'XLSX'] },
  { id: 'rpt-08', name: 'Compliance Statistics Dashboard', description: 'Monthly/quarterly compliance KPIs — entities screened, avg risk score, response times, escalation rates.', category: 'audit', icon: TableChart, color: '#3B82F6', exportFormats: ['PDF', 'XLSX'] },
];

// ─── Generated reports history ───────────────────────────────────────────────

interface GeneratedReport {
  id: string;
  templateId: string;
  name: string;
  entity?: string;
  generatedDate: string;
  generatedBy: string;
  format: string;
  status: 'ready' | 'generating' | 'scheduled';
  size: string;
}

const GENERATED_REPORTS: GeneratedReport[] = [
  { id: 'gen-01', templateId: 'rpt-01', name: 'Due Diligence — Auto Kenya Ltd', entity: 'Auto Kenya Ltd', generatedDate: '2026-02-22', generatedBy: 'Wanjiku Karanja', format: 'PDF', status: 'ready', size: '2.4 MB' },
  { id: 'gen-02', templateId: 'rpt-02', name: 'Q1 2026 Portfolio Risk Summary', generatedDate: '2026-02-20', generatedBy: 'Wanjiku Karanja', format: 'PDF', status: 'ready', size: '1.8 MB' },
  { id: 'gen-03', templateId: 'rpt-04', name: 'Sanctions Certificate — Nairobi Exports Ltd', entity: 'Nairobi Exports Ltd', generatedDate: '2026-02-18', generatedBy: 'Wanjiku Karanja', format: 'PDF', status: 'ready', size: '340 KB' },
  { id: 'gen-04', templateId: 'rpt-03', name: 'PEP Exposure Report — Feb 2026', generatedDate: '2026-02-15', generatedBy: 'Wanjiku Karanja', format: 'PDF', status: 'ready', size: '890 KB' },
  { id: 'gen-05', templateId: 'rpt-05', name: 'AML Audit Trail — Jan-Feb 2026', generatedDate: '2026-02-14', generatedBy: 'Wanjiku Karanja', format: 'XLSX', status: 'ready', size: '1.2 MB' },
  { id: 'gen-06', templateId: 'rpt-06', name: 'Weekly Watchlist Report', generatedDate: '2026-02-22', generatedBy: 'System (Scheduled)', format: 'PDF', status: 'ready', size: '560 KB' },
  { id: 'gen-07', templateId: 'rpt-08', name: 'Monthly Compliance Stats — Feb 2026', generatedDate: '2026-03-01', generatedBy: 'System (Scheduled)', format: 'PDF', status: 'scheduled', size: '—' },
];

// ─── Scheduled automations ───────────────────────────────────────────────────

interface ScheduledReport {
  id: string;
  templateName: string;
  frequency: string;
  nextRun: string;
  recipients: string;
  active: boolean;
}

const SCHEDULED_REPORTS: ScheduledReport[] = [
  { id: 'sch-01', templateName: 'Portfolio Risk Summary', frequency: 'Monthly', nextRun: '2026-03-01', recipients: 'compliance@frc.go.ke', active: true },
  { id: 'sch-02', templateName: 'Watchlist Monitoring Report', frequency: 'Weekly', nextRun: '2026-02-28', recipients: 'compliance@frc.go.ke', active: true },
  { id: 'sch-03', templateName: 'Compliance Statistics', frequency: 'Quarterly', nextRun: '2026-04-01', recipients: 'compliance@frc.go.ke, admin@sta.africa', active: true },
];

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  entity: { label: 'Entity', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  portfolio: { label: 'Portfolio', color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
  regulatory: { label: 'Regulatory', color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
  audit: { label: 'Audit', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ready: { label: 'Ready', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  generating: { label: 'Generating', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  scheduled: { label: 'Scheduled', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ComplianceReportsPage() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEntity, setSelectedEntity] = useState('all');

  const filteredTemplates = REPORT_TEMPLATES.filter((t) => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Assessment sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Compliance Reports</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Generate, schedule, and export compliance reports — due diligence, risk summaries, audit trails.
        </Typography>
      </Box>

      {/* ── Report Templates ───────────────────────────────────────── */}
      <Card sx={{ p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Report Templates</Typography>
          <TextField
            select size="small" value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
          </TextField>
        </Box>

        <Grid container spacing={2}>
          {filteredTemplates.map((t) => {
            const catCfg = CATEGORY_CONFIG[t.category];
            const Icon = t.icon;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={t.id}>
                <Card
                  sx={{
                    p: 2, height: '100%',
                    border: '1px solid rgba(212,175,55,0.08)',
                    '&:hover': { borderColor: `${t.color}40`, backgroundColor: 'rgba(212,175,55,0.02)' },
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Icon sx={{ fontSize: 20, color: t.color }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', flex: 1 }}>{t.name}</Typography>
                  </Box>
                  <Chip label={catCfg.label} size="small" sx={{ fontSize: 9, height: 16, color: catCfg.color, backgroundColor: catCfg.bg, alignSelf: 'flex-start', mb: 1 }} />
                  <Typography sx={{ fontSize: 11, color: '#777', flex: 1, mb: 1.5 }}>{t.description}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {t.exportFormats.map((f) => (
                        <Chip key={f} label={f} size="small" sx={{ fontSize: 9, height: 16, color: '#555', backgroundColor: 'rgba(85,85,85,0.1)' }} />
                      ))}
                    </Box>
                    {t.category === 'entity' ? (
                      <TextField
                        select size="small" value={selectedEntity}
                        onChange={(e) => setSelectedEntity(e.target.value)}
                        sx={{ width: 100, '& .MuiInputBase-input': { fontSize: 10 } }}
                      >
                        <MenuItem value="all" sx={{ fontSize: 11 }}>Select...</MenuItem>
                        {SCREENED_ENTITIES.map((e) => (
                          <MenuItem key={e.id} value={e.id} sx={{ fontSize: 11 }}>{e.name}</MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <Button variant="outlined" size="small" startIcon={<FileDownload sx={{ fontSize: 14 }} />} sx={{ textTransform: 'none', fontSize: 11 }}>
                        Generate
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Card>

      <Grid container spacing={3}>
        {/* ── Generated Reports ──────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Generated Reports</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {GENERATED_REPORTS.map((r) => {
                const sts = STATUS_CONFIG[r.status];
                const template = REPORT_TEMPLATES.find((t) => t.id === r.templateId);
                return (
                  <Box
                    key={r.id}
                    sx={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      p: 1.5, borderRadius: 1,
                      backgroundColor: 'rgba(212,175,55,0.02)',
                      borderBottom: '1px solid rgba(212,175,55,0.05)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PictureAsPdf sx={{ fontSize: 20, color: template?.color || '#777' }} />
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{r.name}</Typography>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>
                          {r.generatedDate} · {r.generatedBy} · {r.format} · {r.size}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={sts.label} size="small" sx={{ fontSize: 9, height: 18, color: sts.color, backgroundColor: sts.bg }} />
                      {r.status === 'ready' && (
                        <Button variant="text" size="small" startIcon={<FileDownload sx={{ fontSize: 14 }} />} sx={{ textTransform: 'none', fontSize: 11, color: '#D4AF37' }}>
                          Download
                        </Button>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* ── Scheduled Reports ──────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Schedule sx={{ color: '#D4AF37', fontSize: 20 }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Scheduled Automations</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {SCHEDULED_REPORTS.map((s) => (
                <Box
                  key={s.id}
                  sx={{
                    p: 1.5, borderRadius: 1,
                    backgroundColor: 'rgba(212,175,55,0.02)',
                    border: '1px solid rgba(212,175,55,0.05)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{s.templateName}</Typography>
                    <Chip
                      label={s.active ? 'Active' : 'Paused'}
                      size="small"
                      sx={{
                        fontSize: 9, height: 16,
                        color: s.active ? '#22C55E' : '#999',
                        backgroundColor: s.active ? 'rgba(34,197,94,0.1)' : 'rgba(153,153,153,0.1)',
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 11, color: '#777' }}>
                    {s.frequency} · Next: {s.nextRun}
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>{s.recipients}</Typography>
                </Box>
              ))}
            </Box>

            {/* Compliance stats summary */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#777', mb: 1.5, textTransform: 'uppercase' }}>This Quarter</Typography>
              {[
                { label: 'Reports Generated', value: '24', color: '#D4AF37' },
                { label: 'Entities Screened', value: SCREENED_ENTITIES.length.toString(), color: '#3B82F6' },
                { label: 'Avg Response Time', value: '2.3 days', color: '#22C55E' },
                { label: 'Escalation Rate', value: '8.3%', color: '#E6A817' },
              ].map((s) => (
                <Box key={s.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                  <Typography sx={{ fontSize: 12, color: '#777' }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.value}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
