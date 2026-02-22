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
  People,
  Search,
  FilterList,
  PersonAdd,
  AdminPanelSettings,
  AccountBalance,
  LocalShipping,
  Gavel,
  HealthAndSafety,
  Assessment,
  Shield,
} from '@mui/icons-material';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  country: string;
  countryFlag: string;
  lastActive: string;
  status: 'active' | 'suspended' | 'pending';
}

interface RoleDistribution {
  role: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const USERS: User[] = [
  { id: 'u1', name: 'James Mwangi', email: 'admin@sta.africa', role: 'super_admin', organization: 'STA Platform', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', lastActive: '2m ago', status: 'active' },
  { id: 'u2', name: 'Sarah Odhiambo', email: 'govt@kra.go.ke', role: 'govt_admin', organization: 'Kenya Revenue Authority', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', lastActive: '15m ago', status: 'active' },
  { id: 'u3', name: 'Peter Kariuki', email: 'analyst@kra.go.ke', role: 'govt_analyst', organization: 'Kenya Revenue Authority', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', lastActive: '1h ago', status: 'active' },
  { id: 'u4', name: 'Grace Wanjiku', email: 'officer@kcb.co.ke', role: 'bank_officer', organization: 'KCB Group', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', lastActive: '3h ago', status: 'active' },
  { id: 'u5', name: 'David Ochieng', email: 'trader@nairobiexports.co.ke', role: 'trader', organization: 'Nairobi Exports Ltd', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', lastActive: '30m ago', status: 'active' },
  { id: 'u6', name: 'Abdul Mohamed', email: 'ops@kenyalogistics.co.ke', role: 'logistics_officer', organization: 'Mombasa Port Logistics', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', lastActive: '2h ago', status: 'active' },
  { id: 'u7', name: 'Elizabeth Akinyi', email: 'officer@kpa.go.ke', role: 'customs_officer', organization: 'Kenya Ports Authority', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', lastActive: '45m ago', status: 'active' },
  { id: 'u8', name: 'Martin Kiptoo', email: 'agent@jubilee.co.ke', role: 'insurance_agent', organization: 'Jubilee Insurance', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', lastActive: '5h ago', status: 'active' },
  { id: 'u9', name: 'Francis Mutua', email: 'auditor@kra.go.ke', role: 'auditor', organization: 'Kenya Revenue Authority', country: 'Kenya', countryFlag: '\u{1F1F0}\u{1F1EA}', lastActive: '1d ago', status: 'active' },
  { id: 'u10', name: 'Amina Nassir', email: 'amina@dartradecorp.co.tz', role: 'trader', organization: 'Dar Trade Corp', country: 'Tanzania', countryFlag: '\u{1F1F9}\u{1F1FF}', lastActive: '4h ago', status: 'active' },
  { id: 'u11', name: 'John Kagame', email: 'john@rwandacustoms.gov.rw', role: 'customs_officer', organization: 'Rwanda Customs Authority', country: 'Rwanda', countryFlag: '\u{1F1F7}\u{1F1FC}', lastActive: '6h ago', status: 'active' },
  { id: 'u12', name: 'Yusuf Nkurunziza', email: 'yusuf@bujumburatrade.bi', role: 'trader', organization: 'Bujumbura Trade Hub', country: 'Burundi', countryFlag: '\u{1F1E7}\u{1F1EE}', lastActive: '15d ago', status: 'suspended' },
  { id: 'u13', name: 'Tsegaye Bekele', email: 'tsegaye@eaccoffee.et', role: 'trader', organization: 'EAC Coffee Traders', country: 'Ethiopia', countryFlag: '\u{1F1EA}\u{1F1F9}', lastActive: 'Never', status: 'pending' },
  { id: 'u14', name: 'Rose Nakato', email: 'rose@equitybank.co.ug', role: 'bank_officer', organization: 'Equity Bank Uganda', country: 'Uganda', countryFlag: '\u{1F1FA}\u{1F1EC}', lastActive: '12h ago', status: 'active' },
];

const ROLE_DISTRIBUTION: RoleDistribution[] = [
  { role: 'super_admin', count: 3, color: '#EF4444', icon: <Shield sx={{ fontSize: 14 }} /> },
  { role: 'govt_admin', count: 18, color: '#D4AF37', icon: <AdminPanelSettings sx={{ fontSize: 14 }} /> },
  { role: 'govt_analyst', count: 42, color: '#22C55E', icon: <Assessment sx={{ fontSize: 14 }} /> },
  { role: 'bank_officer', count: 67, color: '#3B82F6', icon: <AccountBalance sx={{ fontSize: 14 }} /> },
  { role: 'trader', count: 1847, color: '#E6A817', icon: <LocalShipping sx={{ fontSize: 14 }} /> },
  { role: 'logistics_officer', count: 234, color: '#8B5CF6', icon: <LocalShipping sx={{ fontSize: 14 }} /> },
  { role: 'customs_officer', count: 312, color: '#EC4899', icon: <Gavel sx={{ fontSize: 14 }} /> },
  { role: 'insurance_agent', count: 189, color: '#06B6D4', icon: <HealthAndSafety sx={{ fontSize: 14 }} /> },
  { role: 'auditor', count: 135, color: '#777', icon: <Assessment sx={{ fontSize: 14 }} /> },
];

const STATUS_CONFIG = {
  active: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  suspended: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  pending: { color: '#E6A817', bg: 'rgba(230,168,23,0.08)' },
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: '#EF4444',
  govt_admin: '#D4AF37',
  govt_analyst: '#22C55E',
  bank_officer: '#3B82F6',
  trader: '#E6A817',
  logistics_officer: '#8B5CF6',
  customs_officer: '#EC4899',
  insurance_agent: '#06B6D4',
  auditor: '#777',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return USERS.filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.organization.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  const totalRoleUsers = ROLE_DISTRIBUTION.reduce((s, r) => s + r.count, 0);
  const maxRoleCount = Math.max(...ROLE_DISTRIBUTION.map((r) => r.count));

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">User Management</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            sx={{
              backgroundColor: '#D4AF37', color: '#0a0a0a', fontWeight: 600,
              textTransform: 'none', borderRadius: '50px', px: 3,
              '&:hover': { backgroundColor: '#F0D060' },
            }}
          >
            Create User
          </Button>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Manage platform users, roles, and access across all organizations and countries.
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* User Counts */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Search / Filters */}
          <Card sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search users by name, email, org..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{ input: { startAdornment: <Search sx={{ fontSize: 18, color: '#555', mr: 1 }} /> } }}
                sx={{ flex: 1, minWidth: 220, '& .MuiOutlinedInput-root': { fontSize: 13 } }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FilterList sx={{ fontSize: 16, color: '#555' }} />
                <Select size="small" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} sx={{ fontSize: 12, minWidth: 140 }}>
                  <MenuItem value="all">All Roles</MenuItem>
                  {ROLE_DISTRIBUTION.map((r) => (
                    <MenuItem key={r.role} value={r.role}>{r.role.replace('_', ' ')}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ fontSize: 12, minWidth: 120 }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </Box>
          </Card>

          {/* User Table */}
          <Card sx={{ p: 0 }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: '1.8fr 2fr 1.2fr 1.5fr 1.2fr 1fr 0.8fr',
              gap: 1, px: 2.5, py: 1.5,
              borderBottom: '1px solid rgba(212,175,55,0.1)',
              backgroundColor: 'rgba(212,175,55,0.03)',
            }}>
              {['Name', 'Email', 'Role', 'Organization', 'Country', 'Last Active', 'Status'].map((h) => (
                <Typography key={h} sx={{ fontSize: 10, fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {h}
                </Typography>
              ))}
            </Box>

            {filtered.map((u) => {
              const sc = STATUS_CONFIG[u.status];
              const rc = ROLE_COLORS[u.role] || '#777';
              return (
                <Box key={u.id} sx={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 2fr 1.2fr 1.5fr 1.2fr 1fr 0.8fr',
                  gap: 1, px: 2.5, py: 1.5, alignItems: 'center',
                  borderBottom: '1px solid rgba(212,175,55,0.05)',
                  '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                  cursor: 'pointer',
                }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{u.name}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#b0b0b0', fontFamily: 'monospace' }}>{u.email}</Typography>
                  <Chip
                    label={u.role.replace('_', ' ')}
                    size="small"
                    sx={{ fontSize: 9, height: 18, color: rc, backgroundColor: `${rc}15`, textTransform: 'capitalize' }}
                  />
                  <Typography sx={{ fontSize: 11, color: '#b0b0b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.organization}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontSize: 14 }}>{u.countryFlag}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#888' }}>{u.country}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: u.lastActive === 'Never' ? '#555' : '#888' }}>{u.lastActive}</Typography>
                  <Chip
                    label={u.status}
                    size="small"
                    sx={{ fontSize: 9, height: 18, color: sc.color, backgroundColor: sc.bg, textTransform: 'capitalize' }}
                  />
                </Box>
              );
            })}

            {filtered.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography sx={{ fontSize: 13, color: '#555' }}>No users match your filters.</Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Role Distribution */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 0.5 }}>Users by Role</Typography>
            <Typography sx={{ fontSize: 11, color: '#555', mb: 2 }}>Total: {totalRoleUsers.toLocaleString()} users</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {ROLE_DISTRIBUTION.map((r) => (
                <Box key={r.role}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box sx={{ color: r.color }}>{r.icon}</Box>
                      <Typography sx={{ fontSize: 11, color: '#e0e0e0', textTransform: 'capitalize' }}>
                        {r.role.replace('_', ' ')}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: r.color, fontFamily: "'Lora', serif" }}>
                      {r.count.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 4, borderRadius: 2, backgroundColor: 'rgba(212,175,55,0.08)' }}>
                    <Box sx={{
                      width: `${(r.count / maxRoleCount) * 100}%`,
                      height: '100%',
                      borderRadius: 2,
                      backgroundColor: r.color,
                      transition: 'width 0.3s ease',
                    }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
