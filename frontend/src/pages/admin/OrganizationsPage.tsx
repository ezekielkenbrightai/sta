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
  Business,
  Add,
  Search,
  FilterList,
  People,
  Public,
  Verified,
  AccountBalance,
  LocalShipping,
  HealthAndSafety,
  Gavel,
} from '@mui/icons-material';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface Organization {
  id: string;
  name: string;
  type: 'trader' | 'bank' | 'insurance' | 'government' | 'logistics' | 'customs';
  country: string;
  countryFlag: string;
  users: number;
  status: 'active' | 'suspended' | 'pending' | 'rejected';
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  createdDate: string;
}

interface OrgStat {
  label: string;
  value: string;
  change: number;
  color: string;
  icon: React.ReactNode;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const ORGANIZATIONS: Organization[] = [
  { id: 'o1', name: 'Nairobi Exports Ltd', type: 'trader', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', users: 34, status: 'active', plan: 'enterprise', createdDate: '2024-01-20' },
  { id: 'o2', name: 'KCB Group', type: 'bank', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', users: 18, status: 'active', plan: 'enterprise', createdDate: '2024-01-22' },
  { id: 'o3', name: 'Jubilee Insurance', type: 'insurance', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', users: 12, status: 'active', plan: 'professional', createdDate: '2024-02-05' },
  { id: 'o4', name: 'Kenya Revenue Authority', type: 'government', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', users: 56, status: 'active', plan: 'enterprise', createdDate: '2024-01-15' },
  { id: 'o5', name: 'Dar Trade Corp', type: 'trader', country: 'Tanzania', countryFlag: '\u{1F1F9}\u{1F1FF}', users: 22, status: 'active', plan: 'professional', createdDate: '2024-03-10' },
  { id: 'o6', name: 'CRDB Bank', type: 'bank', country: 'Tanzania', countryFlag: '\u{1F1F9}\u{1F1FF}', users: 14, status: 'active', plan: 'enterprise', createdDate: '2024-03-15' },
  { id: 'o7', name: 'Kampala Freight Services', type: 'logistics', country: 'Uganda', countryFlag: '\u{1F1FA}\u{1F1EC}', users: 9, status: 'active', plan: 'starter', createdDate: '2024-04-20' },
  { id: 'o8', name: 'Rwanda Customs Authority', type: 'customs', country: 'Rwanda', countryFlag: '\u{1F1F7}\u{1F1FC}', users: 28, status: 'active', plan: 'enterprise', createdDate: '2024-02-01' },
  { id: 'o9', name: 'Mombasa Port Logistics', type: 'logistics', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', users: 16, status: 'active', plan: 'professional', createdDate: '2024-05-11' },
  { id: 'o10', name: 'EAC Coffee Traders', type: 'trader', country: 'Ethiopia', countryFlag: '\u{1F1EA}\u{1F1F9}', users: 7, status: 'pending', plan: 'starter', createdDate: '2026-01-15' },
  { id: 'o11', name: 'Congo Mining Exports', type: 'trader', country: 'DR Congo', countryFlag: '\u{1F1E8}\u{1F1E9}', users: 11, status: 'active', plan: 'professional', createdDate: '2024-08-22' },
  { id: 'o12', name: 'Bujumbura Trade Hub', type: 'trader', country: 'Burundi', countryFlag: '\u{1F1E7}\u{1F1EE}', users: 4, status: 'suspended', plan: 'free', createdDate: '2025-06-01' },
  { id: 'o13', name: 'Equity Bank Uganda', type: 'bank', country: 'Uganda', countryFlag: '\u{1F1FA}\u{1F1EC}', users: 10, status: 'active', plan: 'enterprise', createdDate: '2024-06-15' },
  { id: 'o14', name: 'Addis Marine Insurance', type: 'insurance', country: 'Ethiopia', countryFlag: '\u{1F1EA}\u{1F1F9}', users: 5, status: 'pending', plan: 'starter', createdDate: '2026-02-01' },
];

const ORG_STATS: OrgStat[] = [
  { label: 'Total Organizations', value: '184', change: 8.2, color: '#D4AF37', icon: <Business sx={{ fontSize: 18 }} /> },
  { label: 'Active', value: '162', change: 6.1, color: '#22C55E', icon: <Verified sx={{ fontSize: 18 }} /> },
  { label: 'Countries Represented', value: '9', change: 12.5, color: '#3B82F6', icon: <Public sx={{ fontSize: 18 }} /> },
  { label: 'Total Users', value: '2,847', change: 14.3, color: '#8B5CF6', icon: <People sx={{ fontSize: 18 }} /> },
];

const TYPE_CONFIG: Record<string, { color: string; icon: React.ReactElement; label: string }> = {
  trader: { color: '#D4AF37', icon: <LocalShipping sx={{ fontSize: 12 }} />, label: 'Trader' },
  bank: { color: '#3B82F6', icon: <AccountBalance sx={{ fontSize: 12 }} />, label: 'Bank' },
  insurance: { color: '#8B5CF6', icon: <HealthAndSafety sx={{ fontSize: 12 }} />, label: 'Insurance' },
  government: { color: '#22C55E', icon: <Gavel sx={{ fontSize: 12 }} />, label: 'Government' },
  logistics: { color: '#E6A817', icon: <LocalShipping sx={{ fontSize: 12 }} />, label: 'Logistics' },
  customs: { color: '#EF4444', icon: <Gavel sx={{ fontSize: 12 }} />, label: 'Customs' },
};

const STATUS_CONFIG = {
  active: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  suspended: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  pending: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
  rejected: { color: '#777', bg: 'rgba(119,119,119,0.08)' },
};

const PLAN_CONFIG = {
  free: { color: '#777' },
  starter: { color: '#3B82F6' },
  professional: { color: '#8B5CF6' },
  enterprise: { color: '#D4AF37' },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrganizationsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return ORGANIZATIONS.filter((o) => {
      const matchesSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.country.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || o.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, typeFilter, statusFilter]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Organization Management</Typography>
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
            Add Organization
          </Button>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Manage registered organizations, their types, plans, and user counts across the platform.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {ORG_STATS.map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <Box sx={{ color: s.color }}>{s.icon}</Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
              <Typography sx={{ fontSize: 11, color: '#22C55E' }}>+{s.change}% vs last month</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search / Filters */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <Search sx={{ fontSize: 18, color: '#555', mr: 1 }} /> } }}
            sx={{ flex: 1, minWidth: 220, '& .MuiOutlinedInput-root': { fontSize: 13 } }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FilterList sx={{ fontSize: 16, color: '#555' }} />
            <Select size="small" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} sx={{ fontSize: 12, minWidth: 130 }}>
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="trader">Trader</MenuItem>
              <MenuItem value="bank">Bank</MenuItem>
              <MenuItem value="insurance">Insurance</MenuItem>
              <MenuItem value="government">Government</MenuItem>
              <MenuItem value="logistics">Logistics</MenuItem>
              <MenuItem value="customs">Customs</MenuItem>
            </Select>
          </Box>
          <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ fontSize: 12, minWidth: 120 }}>
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </Select>
        </Box>
      </Card>

      {/* Organizations Table */}
      <Card sx={{ p: 0 }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1fr 1.2fr 0.8fr 0.8fr 1fr 1.2fr',
          gap: 1, px: 2.5, py: 1.5,
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          backgroundColor: 'rgba(212,175,55,0.03)',
        }}>
          {['Organization', 'Type', 'Country', 'Users', 'Status', 'Plan', 'Created'].map((h) => (
            <Typography key={h} sx={{ fontSize: 10, fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {h}
            </Typography>
          ))}
        </Box>

        {filtered.map((o) => {
          const tc = TYPE_CONFIG[o.type];
          const sc = STATUS_CONFIG[o.status];
          const pc = PLAN_CONFIG[o.plan];
          return (
            <Box key={o.id} sx={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 1fr 1.2fr 0.8fr 0.8fr 1fr 1.2fr',
              gap: 1, px: 2.5, py: 1.5, alignItems: 'center',
              borderBottom: '1px solid rgba(212,175,55,0.05)',
              '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              cursor: 'pointer',
            }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{o.name}</Typography>
              <Chip
                icon={tc.icon}
                label={tc.label}
                size="small"
                sx={{ fontSize: 10, height: 20, color: tc.color, backgroundColor: `${tc.color}15`, '& .MuiChip-icon': { color: tc.color } }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 14 }}>{o.countryFlag}</Typography>
                <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{o.country}</Typography>
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', fontFamily: "'Lora', serif" }}>{o.users}</Typography>
              <Chip
                label={o.status}
                size="small"
                sx={{ fontSize: 10, height: 18, color: sc.color, backgroundColor: sc.bg, textTransform: 'capitalize' }}
              />
              <Chip
                label={o.plan}
                size="small"
                sx={{ fontSize: 10, height: 18, color: pc.color, backgroundColor: `${pc.color}15`, textTransform: 'capitalize' }}
              />
              <Typography sx={{ fontSize: 11, color: '#555' }}>
                {new Date(o.createdDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </Typography>
            </Box>
          );
        })}

        {filtered.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 13, color: '#555' }}>No organizations match your filters.</Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
}
