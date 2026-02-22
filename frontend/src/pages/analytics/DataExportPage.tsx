import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  CloudDownload,
  Storage,
  Timer,
  Api,
  FileDownload,
  Description,
  ContentCopy,
  DataObject,
} from '@mui/icons-material';

// --- Mock data ---------------------------------------------------------------

interface ExportHistoryItem {
  id: string;
  date: string;
  modules: string[];
  dateRange: string;
  format: string;
  size: string;
  status: 'completed' | 'processing' | 'failed';
  duration: string;
}

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  rateLimit: string;
}

interface KPI {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: React.ReactNode;
}

interface ExportModule {
  id: string;
  label: string;
  records: string;
}

const EXPORT_MODULES: ExportModule[] = [
  { id: 'trade', label: 'Trade Documents', records: '12,847' },
  { id: 'tax', label: 'Tax & Duties', records: '3,421' },
  { id: 'payments', label: 'Payments & FX', records: '8,234' },
  { id: 'supply_chain', label: 'Supply Chain', records: '5,612' },
  { id: 'customs', label: 'Customs Clearance', records: '2,187' },
  { id: 'insurance', label: 'Insurance', records: '1,342' },
  { id: 'ledger', label: 'Ledger Entries', records: '18,923' },
  { id: 'compliance', label: 'Compliance Records', records: '4,890' },
];

const EXPORT_HISTORY: ExportHistoryItem[] = [
  { id: 'e1', date: '23 Feb 2026, 14:22', modules: ['Trade', 'Tax'], dateRange: 'Jan 2026', format: 'Excel', size: '12.4 MB', status: 'completed', duration: '2m 18s' },
  { id: 'e2', date: '22 Feb 2026, 09:15', modules: ['Payments', 'FX'], dateRange: 'Q4 2025', format: 'CSV', size: '8.7 MB', status: 'completed', duration: '1m 45s' },
  { id: 'e3', date: '21 Feb 2026, 16:30', modules: ['All Modules'], dateRange: 'FY 2025', format: 'JSON', size: '142.3 MB', status: 'completed', duration: '8m 12s' },
  { id: 'e4', date: '20 Feb 2026, 11:00', modules: ['Customs'], dateRange: 'Feb 1-20 2026', format: 'PDF', size: '3.2 MB', status: 'completed', duration: '45s' },
  { id: 'e5', date: '19 Feb 2026, 08:45', modules: ['Supply Chain', 'Insurance'], dateRange: 'Jan 2026', format: 'Excel', size: '6.8 MB', status: 'completed', duration: '1m 32s' },
  { id: 'e6', date: '18 Feb 2026, 13:20', modules: ['Ledger'], dateRange: 'Jan 2026', format: 'CSV', size: '24.1 MB', status: 'completed', duration: '3m 05s' },
  { id: 'e7', date: '17 Feb 2026, 10:10', modules: ['Trade', 'Compliance'], dateRange: 'Dec 2025', format: 'JSON', size: '---', status: 'failed', duration: '---' },
  { id: 'e8', date: '23 Feb 2026, 15:01', modules: ['Tax'], dateRange: 'Feb 2026', format: 'Excel', size: '---', status: 'processing', duration: '---' },
];

const API_ENDPOINTS: ApiEndpoint[] = [
  { method: 'GET', path: '/api/v1/export/trade-documents', description: 'Export trade documents with filters', rateLimit: '100/hour' },
  { method: 'GET', path: '/api/v1/export/tax-assessments', description: 'Export tax assessment records', rateLimit: '100/hour' },
  { method: 'GET', path: '/api/v1/export/payments', description: 'Export payment transactions', rateLimit: '50/hour' },
  { method: 'GET', path: '/api/v1/export/ledger-entries', description: 'Export double-entry ledger data', rateLimit: '50/hour' },
  { method: 'POST', path: '/api/v1/export/bulk', description: 'Bulk export across modules', rateLimit: '10/hour' },
  { method: 'GET', path: '/api/v1/export/status/{job_id}', description: 'Check export job status', rateLimit: '500/hour' },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  completed: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  processing: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  failed: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
};

const METHOD_COLORS: Record<string, string> = {
  GET: '#22C55E',
  POST: '#3B82F6',
};

// --- Page --------------------------------------------------------------------

export default function DataExportPage() {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('jan_2026');
  const [format, setFormat] = useState('excel');

  const toggleModule = (id: string) => {
    setSelectedModules((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };

  const completedExports = EXPORT_HISTORY.filter((e) => e.status === 'completed');
  const totalSizeMB = completedExports.reduce((s, e) => s + parseFloat(e.size) || 0, 0);

  const kpis: KPI[] = [
    { label: 'Exports This Month', value: '23', sub: '+8 vs last month', color: '#D4AF37', icon: <CloudDownload sx={{ fontSize: 18, color: '#D4AF37' }} /> },
    { label: 'Total Data Volume', value: `${totalSizeMB.toFixed(0)} MB`, sub: 'February 2026', color: '#3B82F6', icon: <Storage sx={{ fontSize: 18, color: '#3B82F6' }} /> },
    { label: 'Avg Export Time', value: '2m 24s', sub: '-18% vs last month', color: '#8B5CF6', icon: <Timer sx={{ fontSize: 18, color: '#8B5CF6' }} /> },
    { label: 'API Calls (MTD)', value: '1,847', sub: '72% of quota', color: '#22C55E', icon: <Api sx={{ fontSize: 18, color: '#22C55E' }} /> },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <DataObject sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Data Export</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Export trade data across modules, download historical records, and access the data API.
        </Typography>
      </Box>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((k) => (
          <Grid size={{ xs: 6, md: 3 }} key={k.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                {k.icon}
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{k.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: k.color }}>{k.value}</Typography>
              <Typography sx={{ fontSize: 11, color: '#777' }}>{k.sub}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Export Form */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <FileDownload sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              New Export
            </Typography>

            {/* Module Selection */}
            <Typography sx={{ fontSize: 12, color: '#888', mb: 1 }}>Select Modules</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {EXPORT_MODULES.map((m) => (
                <FormControlLabel
                  key={m.id}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedModules.includes(m.id)}
                      onChange={() => toggleModule(m.id)}
                      sx={{ color: '#555', '&.Mui-checked': { color: '#D4AF37' }, p: 0.5 }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography sx={{ fontSize: 12, color: '#e0e0e0' }}>{m.label}</Typography>
                      <Typography sx={{ fontSize: 9, color: '#555' }}>({m.records})</Typography>
                    </Box>
                  }
                  sx={{ mr: 2, mb: 0.5 }}
                />
              ))}
            </Box>

            {/* Date Range & Format */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={6}>
                <TextField
                  select label="Date Range" fullWidth size="small"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(212,175,55,0.04)' } }}
                >
                  <MenuItem value="feb_2026">February 2026</MenuItem>
                  <MenuItem value="jan_2026">January 2026</MenuItem>
                  <MenuItem value="q4_2025">Q4 2025</MenuItem>
                  <MenuItem value="h2_2025">H2 2025</MenuItem>
                  <MenuItem value="fy_2025">FY 2025</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  select label="Format" fullWidth size="small"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(212,175,55,0.04)' } }}
                >
                  <MenuItem value="excel">Excel (XLSX)</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                  <MenuItem value="json">JSON</MenuItem>
                  <MenuItem value="pdf">PDF Report</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Button
              variant="contained" fullWidth
              startIcon={<CloudDownload />}
              disabled={selectedModules.length === 0}
              sx={{ borderRadius: '50px', fontWeight: 600, textTransform: 'none', backgroundColor: '#D4AF37', '&:hover': { backgroundColor: '#B8962E' }, '&.Mui-disabled': { backgroundColor: 'rgba(212,175,55,0.15)', color: '#555' } }}
            >
              Export {selectedModules.length > 0 ? `${selectedModules.length} Module${selectedModules.length > 1 ? 's' : ''}` : 'Data'}
            </Button>

            {/* API Access */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(212,175,55,0.08)' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 1.5 }}>
                <Api sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
                API Access
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {API_ENDPOINTS.map((ep) => (
                  <Box key={ep.path} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.75, borderBottom: '1px solid rgba(212,175,55,0.03)' }}>
                    <Chip
                      label={ep.method}
                      size="small"
                      sx={{ fontSize: 9, height: 16, fontWeight: 700, fontFamily: 'monospace', color: METHOD_COLORS[ep.method], backgroundColor: `${METHOD_COLORS[ep.method]}14`, minWidth: 36 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 11, color: '#e0e0e0', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ep.path}
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>{ep.description}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography sx={{ fontSize: 9, color: '#777' }}>{ep.rateLimit}</Typography>
                      <ContentCopy sx={{ fontSize: 12, color: '#555', cursor: 'pointer', '&:hover': { color: '#D4AF37' } }} />
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.04)' }}>
                <Typography sx={{ fontSize: 10, color: '#888' }}>
                  API Base URL: <Box component="span" sx={{ fontFamily: 'monospace', color: '#D4AF37' }}>https://api.smarttradeafrica.com/v1</Box>
                </Typography>
                <Typography sx={{ fontSize: 10, color: '#888', mt: 0.25 }}>
                  Rate Limit: <Box component="span" sx={{ color: '#b0b0b0' }}>2,500 requests/day per API key</Box>
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Export History */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              <Description sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#D4AF37' }} />
              Export History
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {EXPORT_HISTORY.map((e) => {
                const sc = STATUS_CONFIG[e.status];
                return (
                  <Box key={e.id} sx={{ pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 12, color: '#e0e0e0', fontWeight: 500 }}>
                          {e.modules.join(' + ')}
                        </Typography>
                        <Chip label={e.format} size="small" sx={{ fontSize: 9, height: 16, color: '#888', backgroundColor: 'rgba(212,175,55,0.06)' }} />
                      </Box>
                      <Chip
                        label={e.status}
                        size="small"
                        sx={{ fontSize: 9, height: 16, color: sc.color, backgroundColor: sc.bg, textTransform: 'capitalize' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>{e.date}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#555' }}>{e.dateRange}</Typography>
                      <Typography sx={{ fontSize: 10, color: '#888', fontFamily: 'monospace' }}>{e.size}</Typography>
                      {e.status === 'completed' && (
                        <Typography sx={{ fontSize: 10, color: '#777' }}>{e.duration}</Typography>
                      )}
                    </Box>
                    {e.status === 'processing' && (
                      <LinearProgress
                        sx={{
                          mt: 0.75, height: 3, borderRadius: 2,
                          backgroundColor: 'rgba(59,130,246,0.08)',
                          '& .MuiLinearProgress-bar': { backgroundColor: '#3B82F6', borderRadius: 2 },
                        }}
                      />
                    )}
                    {e.status === 'completed' && (
                      <Button
                        size="small" startIcon={<CloudDownload sx={{ fontSize: 12 }} />}
                        sx={{ mt: 0.5, fontSize: 10, textTransform: 'none', color: '#D4AF37', p: 0, minWidth: 0, '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}
                      >
                        Download
                      </Button>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
