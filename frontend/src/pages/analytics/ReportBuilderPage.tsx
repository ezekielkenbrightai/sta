import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  Description,
  Assessment,
  BarChart,
  Shield,
  Speed,
  LocalShipping,
  AccountBalance,
  Policy,
  Schedule,
  Download,
  CheckCircle,
  HourglassEmpty,
  Error,
  Build,
  CalendarMonth,
} from '@mui/icons-material';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ReportKPI {
  label: string;
  value: string;
  change: number;
  color: string;
  icon: React.ReactNode;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  format: string;
  avg_pages: number;
  color: string;
}

interface RecentReport {
  id: string;
  name: string;
  template: string;
  generated_by: string;
  date: string;
  status: 'completed' | 'generating' | 'failed' | 'scheduled';
  size_mb: number;
  pages: number;
}

interface ReportModule {
  id: string;
  label: string;
  checked: boolean;
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const REPORT_TEMPLATES: ReportTemplate[] = [
  { id: 'rt1', name: 'Trade Summary', description: 'Comprehensive overview of all trade activity including volumes, corridors, and commodity flows.', icon: <Assessment sx={{ fontSize: 28 }} />, category: 'Trade', format: 'PDF', avg_pages: 24, color: '#D4AF37' },
  { id: 'rt2', name: 'Revenue Analysis', description: 'Detailed tax and customs revenue collection breakdown by stream, region, and period.', icon: <AccountBalance sx={{ fontSize: 28 }} />, category: 'Tax', format: 'PDF/Excel', avg_pages: 18, color: '#22C55E' },
  { id: 'rt3', name: 'Compliance Audit', description: 'Compliance monitoring report with violation tracking, red flags, and trader tier analysis.', icon: <Shield sx={{ fontSize: 28 }} />, category: 'Compliance', format: 'PDF', avg_pages: 32, color: '#3B82F6' },
  { id: 'rt4', name: 'Customs Performance', description: 'Customs clearance times, throughput metrics, port activity, and bottleneck analysis.', icon: <Speed sx={{ fontSize: 28 }} />, category: 'Customs', format: 'PDF', avg_pages: 16, color: '#8B5CF6' },
  { id: 'rt5', name: 'Insurance Portfolio', description: 'Insurance policy coverage analysis, claims trends, risk scoring, and premium summaries.', icon: <Policy sx={{ fontSize: 28 }} />, category: 'Insurance', format: 'PDF/Excel', avg_pages: 20, color: '#E6A817' },
  { id: 'rt6', name: 'Supply Chain', description: 'End-to-end supply chain visibility: shipment tracking, warehouse utilization, and transit times.', icon: <LocalShipping sx={{ fontSize: 28 }} />, category: 'Logistics', format: 'PDF', avg_pages: 22, color: '#14B8A6' },
  { id: 'rt7', name: 'AfCFTA Progress', description: 'African Continental Free Trade Area implementation metrics, tariff reduction progress, and intra-Africa trade.', icon: <BarChart sx={{ fontSize: 28 }} />, category: 'Trade', format: 'PDF', avg_pages: 28, color: '#F97316' },
  { id: 'rt8', name: 'Informal Economy', description: 'Informal cross-border trade estimates, formalization pipeline, and border crossing analysis.', icon: <Description sx={{ fontSize: 28 }} />, category: 'Trade', format: 'PDF', avg_pages: 14, color: '#EC4899' },
];

const RECENT_REPORTS: RecentReport[] = [
  { id: 'rr1', name: 'Monthly Trade Summary - Feb 2026', template: 'Trade Summary', generated_by: 'analyst@kra.go.ke', date: '2026-02-23 09:15', status: 'completed', size_mb: 4.2, pages: 24 },
  { id: 'rr2', name: 'Q1 Revenue Analysis (Interim)', template: 'Revenue Analysis', generated_by: 'govt@kra.go.ke', date: '2026-02-22 14:30', status: 'completed', size_mb: 3.8, pages: 18 },
  { id: 'rr3', name: 'Compliance Audit - Mombasa Port Zone', template: 'Compliance Audit', generated_by: 'analyst@kra.go.ke', date: '2026-02-22 11:45', status: 'generating', size_mb: 0, pages: 0 },
  { id: 'rr4', name: 'Weekly Customs Performance', template: 'Customs Performance', generated_by: 'officer@kpa.go.ke', date: '2026-02-21 16:00', status: 'completed', size_mb: 2.1, pages: 16 },
  { id: 'rr5', name: 'Insurance Claims Q4 2025 Review', template: 'Insurance Portfolio', generated_by: 'agent@jubilee.co.ke', date: '2026-02-20 10:00', status: 'completed', size_mb: 5.7, pages: 34 },
  { id: 'rr6', name: 'Border Economy Snapshot - January', template: 'Informal Economy', generated_by: 'analyst@kra.go.ke', date: '2026-02-19 08:30', status: 'failed', size_mb: 0, pages: 0 },
  { id: 'rr7', name: 'Monthly Supply Chain Report', template: 'Supply Chain', generated_by: 'ops@kenyalogistics.co.ke', date: '2026-02-28 06:00', status: 'scheduled', size_mb: 0, pages: 0 },
];

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  completed: { color: '#22C55E', icon: <CheckCircle sx={{ fontSize: 14 }} />, label: 'Completed' },
  generating: { color: '#3B82F6', icon: <HourglassEmpty sx={{ fontSize: 14 }} />, label: 'Generating' },
  failed: { color: '#EF4444', icon: <Error sx={{ fontSize: 14 }} />, label: 'Failed' },
  scheduled: { color: '#8B5CF6', icon: <Schedule sx={{ fontSize: 14 }} />, label: 'Scheduled' },
};

const DEFAULT_MODULES: ReportModule[] = [
  { id: 'trade', label: 'Trade Volumes', checked: true },
  { id: 'tax', label: 'Tax & Revenue', checked: true },
  { id: 'compliance', label: 'Compliance', checked: false },
  { id: 'customs', label: 'Customs Clearance', checked: false },
  { id: 'supply_chain', label: 'Supply Chain', checked: false },
  { id: 'insurance', label: 'Insurance', checked: false },
  { id: 'fx', label: 'FX & Payments', checked: false },
  { id: 'informal', label: 'Informal Economy', checked: false },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ReportBuilderPage() {
  const [dateRange, setDateRange] = useState('feb_2026');
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [modules, setModules] = useState<ReportModule[]>(DEFAULT_MODULES);

  const handleModuleToggle = (id: string) => {
    setModules((prev) => prev.map((m) => m.id === id ? { ...m, checked: !m.checked } : m));
  };

  const selectedCount = modules.filter((m) => m.checked).length;

  const kpis: ReportKPI[] = [
    { label: 'Reports Generated', value: '247', change: 18.4, color: '#D4AF37', icon: <Description sx={{ fontSize: 18 }} /> },
    { label: 'Templates Available', value: `${REPORT_TEMPLATES.length}`, change: 2.0, color: '#3B82F6', icon: <Assessment sx={{ fontSize: 18 }} /> },
    { label: 'Scheduled Reports', value: '12', change: 5.0, color: '#8B5CF6', icon: <Schedule sx={{ fontSize: 18 }} /> },
    { label: 'Avg Generation Time', value: '45s', change: -22.1, color: '#22C55E', icon: <Speed sx={{ fontSize: 18 }} /> },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Description sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Report Builder</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Generate, schedule, and manage analytical reports across all trade, tax, and compliance modules.
        </Typography>
      </Box>

      {/* Top KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((k) => (
          <Grid size={{ xs: 6, md: 3 }} key={k.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <Box sx={{ color: k.color }}>{k.icon}</Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{k.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: k.color }}>{k.value}</Typography>
              <Typography sx={{ fontSize: 11, color: k.label === 'Avg Generation Time' ? (k.change < 0 ? '#22C55E' : '#EF4444') : (k.change > 0 ? '#22C55E' : '#EF4444') }}>
                {k.change > 0 ? '+' : ''}{k.change}% vs last month
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Report Template Grid */}
      <Card sx={{ p: 2.5, mb: 3 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Report Templates</Typography>
        <Grid container spacing={2}>
          {REPORT_TEMPLATES.map((t) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={t.id}>
              <Box sx={{
                p: 2, borderRadius: 2, border: '1px solid rgba(212,175,55,0.08)',
                backgroundColor: 'rgba(212,175,55,0.02)', cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.06)', borderColor: 'rgba(212,175,55,0.2)', transform: 'translateY(-2px)' },
              }}>
                <Box sx={{ color: t.color, mb: 1.5 }}>{t.icon}</Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', mb: 0.5 }}>{t.name}</Typography>
                <Typography sx={{ fontSize: 11, color: '#777', mb: 1, lineHeight: 1.5, minHeight: 48 }}>{t.description}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={t.category} size="small" sx={{ fontSize: 9, height: 16, color: '#888', backgroundColor: 'rgba(212,175,55,0.06)' }} />
                  <Box sx={{ display: 'flex', gap: 0.75 }}>
                    <Typography sx={{ fontSize: 9, color: '#555' }}>{t.format}</Typography>
                    <Typography sx={{ fontSize: 9, color: '#555' }}>~{t.avg_pages}p</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      <Grid container spacing={2}>
        {/* Recent Reports */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>
                <CalendarMonth sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                Recent Reports
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#555' }}>{RECENT_REPORTS.filter((r) => r.status === 'completed').length} ready for download</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {RECENT_REPORTS.map((r) => {
                const sc = STATUS_CONFIG[r.status];
                return (
                  <Box key={r.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, px: 1.5, borderRadius: 1, borderBottom: '1px solid rgba(212,175,55,0.03)', '&:hover': { backgroundColor: 'rgba(212,175,55,0.02)' } }}>
                    <Box sx={{ color: sc.color, flexShrink: 0 }}>{sc.icon}</Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.25 }}>
                        <Chip label={r.template} size="small" sx={{ fontSize: 8, height: 14, color: '#888', backgroundColor: 'rgba(212,175,55,0.06)' }} />
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{r.generated_by}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Chip label={sc.label} size="small" sx={{ fontSize: 8, height: 16, color: sc.color, backgroundColor: `${sc.color}15` }} />
                      <Typography sx={{ fontSize: 10, color: '#555', mt: 0.25 }}>{r.date}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', minWidth: 50, flexShrink: 0 }}>
                      {r.status === 'completed' && (
                        <>
                          <Typography sx={{ fontSize: 10, color: '#888', fontFamily: 'monospace' }}>{r.size_mb} MB</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, justifyContent: 'flex-end' }}>
                            <Download sx={{ fontSize: 12, color: '#D4AF37' }} />
                            <Typography sx={{ fontSize: 9, color: '#D4AF37', cursor: 'pointer' }}>PDF</Typography>
                          </Box>
                        </>
                      )}
                      {r.status === 'scheduled' && (
                        <Typography sx={{ fontSize: 10, color: '#8B5CF6' }}>Auto</Typography>
                      )}
                      {r.status === 'failed' && (
                        <Typography sx={{ fontSize: 10, color: '#EF4444', cursor: 'pointer' }}>Retry</Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Custom Report Builder Form */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <Build sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Custom Report Builder
            </Typography>

            {/* Date Range */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 12, color: '#888', mb: 0.75 }}>Date Range</Typography>
              <TextField
                select fullWidth size="small" value={dateRange} onChange={(e) => setDateRange(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(212,175,55,0.04)' } }}
              >
                <MenuItem value="feb_2026">February 2026</MenuItem>
                <MenuItem value="jan_2026">January 2026</MenuItem>
                <MenuItem value="q1_2026">Q1 2026 (to date)</MenuItem>
                <MenuItem value="q4_2025">Q4 2025</MenuItem>
                <MenuItem value="fy_2025">FY 2025</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </TextField>
            </Box>

            {/* Module Selection */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                <Typography sx={{ fontSize: 12, color: '#888' }}>Modules to Include</Typography>
                <Typography sx={{ fontSize: 10, color: '#D4AF37' }}>{selectedCount} selected</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {modules.map((m) => (
                  <FormControlLabel
                    key={m.id}
                    control={
                      <Checkbox
                        checked={m.checked}
                        onChange={() => handleModuleToggle(m.id)}
                        size="small"
                        sx={{ color: '#555', '&.Mui-checked': { color: '#D4AF37' }, p: 0.5 }}
                      />
                    }
                    label={<Typography sx={{ fontSize: 12, color: m.checked ? '#e0e0e0' : '#777' }}>{m.label}</Typography>}
                    sx={{ ml: 0, height: 32 }}
                  />
                ))}
              </Box>
            </Box>

            {/* Output Format */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: '#888', mb: 0.75 }}>Output Format</Typography>
              <TextField
                select fullWidth size="small" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(212,175,55,0.04)' } }}
              >
                <MenuItem value="pdf">PDF Report</MenuItem>
                <MenuItem value="excel">Excel Workbook</MenuItem>
                <MenuItem value="csv">CSV Data Export</MenuItem>
                <MenuItem value="pptx">PowerPoint Presentation</MenuItem>
              </TextField>
            </Box>

            {/* Generate Button */}
            <Button
              fullWidth
              variant="contained"
              disabled={selectedCount === 0}
              sx={{
                backgroundColor: '#D4AF37', color: '#000', fontWeight: 600, borderRadius: '50px',
                textTransform: 'none', py: 1.25,
                '&:hover': { backgroundColor: '#F0D060' },
                '&.Mui-disabled': { backgroundColor: 'rgba(212,175,55,0.15)', color: '#555' },
              }}
            >
              Generate Report ({selectedCount} modules)
            </Button>

            {/* Estimate */}
            <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>
                Estimated: <Box component="span" sx={{ color: '#D4AF37', fontWeight: 600 }}>{selectedCount * 8}-{selectedCount * 12} pages</Box>
                {' | '}Generation time: <Box component="span" sx={{ color: '#D4AF37', fontWeight: 600 }}>~{Math.max(15, selectedCount * 12)}s</Box>
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
