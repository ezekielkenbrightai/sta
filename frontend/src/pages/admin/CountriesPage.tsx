import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  Public,
  Add,
  Search,
  FilterList,
  Flag,
} from '@mui/icons-material';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface Country {
  id: string;
  flag: string;
  name: string;
  code: string;
  currency: string;
  currencyCode: string;
  region: 'East Africa' | 'Central Africa' | 'Southern Africa';
  status: 'active' | 'pending' | 'suspended';
  organizations: number;
  users: number;
  dateAdded: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const COUNTRIES: Country[] = [
  { id: 'c1', flag: '\u{1F1F0}\u{1F1EA}', name: 'Kenya', code: 'KE', currency: 'Kenyan Shilling', currencyCode: 'KES', region: 'East Africa', status: 'active', organizations: 47, users: 892, dateAdded: '2024-01-15' },
  { id: 'c2', flag: '\u{1F1F9}\u{1F1FF}', name: 'Tanzania', code: 'TZ', currency: 'Tanzanian Shilling', currencyCode: 'TZS', region: 'East Africa', status: 'active', organizations: 31, users: 534, dateAdded: '2024-01-15' },
  { id: 'c3', flag: '\u{1F1FA}\u{1F1EC}', name: 'Uganda', code: 'UG', currency: 'Ugandan Shilling', currencyCode: 'UGX', region: 'East Africa', status: 'active', organizations: 28, users: 412, dateAdded: '2024-02-01' },
  { id: 'c4', flag: '\u{1F1F7}\u{1F1FC}', name: 'Rwanda', code: 'RW', currency: 'Rwandan Franc', currencyCode: 'RWF', region: 'East Africa', status: 'active', organizations: 19, users: 287, dateAdded: '2024-02-01' },
  { id: 'c5', flag: '\u{1F1E7}\u{1F1EE}', name: 'Burundi', code: 'BI', currency: 'Burundian Franc', currencyCode: 'BIF', region: 'East Africa', status: 'active', organizations: 8, users: 94, dateAdded: '2024-03-10' },
  { id: 'c6', flag: '\u{1F1E8}\u{1F1E9}', name: 'DR Congo', code: 'CD', currency: 'Congolese Franc', currencyCode: 'CDF', region: 'Central Africa', status: 'active', organizations: 22, users: 341, dateAdded: '2024-04-01' },
  { id: 'c7', flag: '\u{1F1EA}\u{1F1F9}', name: 'Ethiopia', code: 'ET', currency: 'Ethiopian Birr', currencyCode: 'ETB', region: 'East Africa', status: 'active', organizations: 15, users: 198, dateAdded: '2024-05-15' },
  { id: 'c8', flag: '\u{1F1F8}\u{1F1F8}', name: 'South Sudan', code: 'SS', currency: 'South Sudanese Pound', currencyCode: 'SSP', region: 'East Africa', status: 'pending', organizations: 3, users: 27, dateAdded: '2025-11-20' },
  { id: 'c9', flag: '\u{1F1F8}\u{1F1E9}', name: 'Sudan', code: 'SD', currency: 'Sudanese Pound', currencyCode: 'SDG', region: 'East Africa', status: 'pending', organizations: 0, users: 0, dateAdded: '2026-01-08' },
];

const STATUS_CONFIG = {
  active: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)', label: 'Active' },
  pending: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)', label: 'Pending' },
  suspended: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', label: 'Suspended' },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CountriesPage() {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return COUNTRIES.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = regionFilter === 'all' || c.region === regionFilter;
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [search, regionFilter, statusFilter]);

  const totalOrgs = COUNTRIES.reduce((s, c) => s + c.organizations, 0);
  const totalUsers = COUNTRIES.reduce((s, c) => s + c.users, 0);
  const activeCount = COUNTRIES.filter((c) => c.status === 'active').length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Public sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Country Management</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: '#D4AF37', color: '#0a0a0a', fontWeight: 600,
              textTransform: 'none', borderRadius: '50px', px: 3,
              '&:hover': { backgroundColor: '#F0D060' },
            }}
          >
            Add Country
          </Button>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Manage participating East African countries, their currencies, and operational status.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>Total Countries</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#D4AF37' }}>{COUNTRIES.length}</Typography>
            <Typography sx={{ fontSize: 11, color: '#22C55E' }}>{activeCount} active</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>Organizations</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#22C55E' }}>{totalOrgs}</Typography>
            <Typography sx={{ fontSize: 11, color: '#888' }}>across all countries</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>Registered Users</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: '#3B82F6' }}>{totalUsers.toLocaleString()}</Typography>
            <Typography sx={{ fontSize: 11, color: '#888' }}>platform-wide</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <Search sx={{ fontSize: 18, color: '#555', mr: 1 }} /> } }}
            sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { fontSize: 13 } }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FilterList sx={{ fontSize: 16, color: '#555' }} />
            <Select
              size="small"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              sx={{ fontSize: 12, minWidth: 140 }}
            >
              <MenuItem value="all">All Regions</MenuItem>
              <MenuItem value="East Africa">East Africa</MenuItem>
              <MenuItem value="Central Africa">Central Africa</MenuItem>
              <MenuItem value="Southern Africa">Southern Africa</MenuItem>
            </Select>
          </Box>
          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ fontSize: 12, minWidth: 120 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </Select>
        </Box>
      </Card>

      {/* Country Table */}
      <Card sx={{ p: 0 }}>
        {/* Table Header */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr 1fr 1.2fr',
          gap: 1, px: 2.5, py: 1.5,
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          backgroundColor: 'rgba(212,175,55,0.03)',
        }}>
          {['Country', 'Code', 'Currency', 'Status', 'Organizations', 'Users', 'Date Added'].map((h) => (
            <Typography key={h} sx={{ fontSize: 10, fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {h}
            </Typography>
          ))}
        </Box>

        {/* Rows */}
        {filtered.map((c) => {
          const sc = STATUS_CONFIG[c.status];
          return (
            <Box key={c.id} sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr 1fr 1.2fr',
              gap: 1, px: 2.5, py: 1.5, alignItems: 'center',
              borderBottom: '1px solid rgba(212,175,55,0.05)',
              '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              cursor: 'pointer',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: 18 }}>{c.flag}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{c.name}</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace' }}>{c.code}</Typography>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#e0e0e0' }}>{c.currency}</Typography>
                <Typography sx={{ fontSize: 10, color: '#555' }}>{c.currencyCode}</Typography>
              </Box>
              <Chip
                icon={<Flag sx={{ fontSize: 10 }} />}
                label={sc.label}
                size="small"
                sx={{ fontSize: 10, height: 20, color: sc.color, backgroundColor: sc.bg, '& .MuiChip-icon': { color: sc.color } }}
              />
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', fontFamily: "'Lora', serif" }}>{c.organizations}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#b0b0b0', fontFamily: "'Lora', serif" }}>{c.users.toLocaleString()}</Typography>
              <Typography sx={{ fontSize: 11, color: '#555' }}>{new Date(c.dateAdded).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Typography>
            </Box>
          );
        })}

        {filtered.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 13, color: '#555' }}>No countries match your filters.</Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
}
