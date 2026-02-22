import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Business,
  Search as SearchIcon,
  TrendingUp,
  VerifiedUser,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

// ─── Mock traders ────────────────────────────────────────────────────────────

interface Trader {
  id: string;
  name: string;
  registration_number: string;
  type: 'importer' | 'exporter' | 'both';
  country: string;
  flag: string;
  status: 'active' | 'suspended' | 'pending';
  compliance_score: number;
  total_trade_value: number;
  active_documents: number;
  joined_at: string;
}

const MOCK_TRADERS: Trader[] = [
  {
    id: 'tr-001', name: 'Nairobi Exports Ltd', registration_number: 'KE-TRD-2024-001',
    type: 'both', country: 'Kenya', flag: '🇰🇪', status: 'active',
    compliance_score: 94, total_trade_value: 12500000, active_documents: 8, joined_at: '2024-01-15',
  },
  {
    id: 'tr-002', name: 'Lagos Trading Co', registration_number: 'NG-TRD-2024-042',
    type: 'importer', country: 'Nigeria', flag: '🇳🇬', status: 'active',
    compliance_score: 88, total_trade_value: 8200000, active_documents: 5, joined_at: '2024-03-22',
  },
  {
    id: 'tr-003', name: 'Dar Spice Merchants', registration_number: 'TZ-TRD-2024-015',
    type: 'exporter', country: 'Tanzania', flag: '🇹🇿', status: 'active',
    compliance_score: 92, total_trade_value: 4500000, active_documents: 3, joined_at: '2024-05-10',
  },
  {
    id: 'tr-004', name: 'Cape Trade Solutions', registration_number: 'ZA-TRD-2023-089',
    type: 'both', country: 'South Africa', flag: '🇿🇦', status: 'active',
    compliance_score: 96, total_trade_value: 21000000, active_documents: 12, joined_at: '2023-11-01',
  },
  {
    id: 'tr-005', name: 'Kigali Coffee Exports', registration_number: 'RW-TRD-2024-007',
    type: 'exporter', country: 'Rwanda', flag: '🇷🇼', status: 'active',
    compliance_score: 90, total_trade_value: 2800000, active_documents: 2, joined_at: '2024-06-20',
  },
  {
    id: 'tr-006', name: 'Accra Auto Parts', registration_number: 'GH-TRD-2024-023',
    type: 'importer', country: 'Ghana', flag: '🇬🇭', status: 'suspended',
    compliance_score: 62, total_trade_value: 1200000, active_documents: 0, joined_at: '2024-02-14',
  },
  {
    id: 'tr-007', name: 'Nile Valley Agri', registration_number: 'EG-TRD-2024-031',
    type: 'both', country: 'Egypt', flag: '🇪🇬', status: 'active',
    compliance_score: 85, total_trade_value: 6300000, active_documents: 4, joined_at: '2024-04-08',
  },
  {
    id: 'tr-008', name: 'Addis Textiles Plc', registration_number: 'ET-TRD-2025-002',
    type: 'exporter', country: 'Ethiopia', flag: '🇪🇹', status: 'pending',
    compliance_score: 0, total_trade_value: 0, active_documents: 0, joined_at: '2025-12-01',
  },
];

function complianceColor(score: number): string {
  if (score >= 90) return '#22C55E';
  if (score >= 70) return '#E6A817';
  if (score > 0) return '#EF4444';
  return '#555';
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  suspended: { label: 'Suspended', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TraderDirectoryPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return MOCK_TRADERS.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.registration_number.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: MOCK_TRADERS.length,
    active: MOCK_TRADERS.filter((t) => t.status === 'active').length,
    totalValue: MOCK_TRADERS.reduce((s, t) => s + t.total_trade_value, 0),
    avgCompliance: Math.round(
      MOCK_TRADERS.filter((t) => t.compliance_score > 0).reduce((s, t) => s + t.compliance_score, 0) /
      MOCK_TRADERS.filter((t) => t.compliance_score > 0).length,
    ),
  }), []);

  const canRegister = user?.role === 'trader' || user?.role === 'super_admin' || user?.role === 'govt_admin';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>Trader Directory</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Registered traders, importers, and exporters on the platform.
          </Typography>
        </Box>
        {canRegister && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/trade/traders/register')}>
            Register Trader
          </Button>
        )}
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Traders', value: stats.total, icon: <Business />, color: '#D4AF37' },
          { label: 'Active', value: stats.active, icon: <VerifiedUser />, color: '#22C55E' },
          { label: 'Total Trade Value', value: `$${(stats.totalValue / 1000000).toFixed(0)}M`, icon: <TrendingUp />, color: '#3B82F6' },
          { label: 'Avg Compliance', value: `${stats.avgCompliance}%`, icon: <VerifiedUser />, color: '#E6A817' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                {s.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
                <Typography sx={{ fontSize: 20, fontWeight: 700, fontFamily: "'Lora', serif" }}>{s.value}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              fullWidth size="small" placeholder="Search by name, registration, country..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3.5 }}>
            <TextField fullWidth size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 3.5 }}>
            <TextField fullWidth size="small" select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Type">
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="importer">Importer</MenuItem>
              <MenuItem value="exporter">Exporter</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Trader cards */}
      <Grid container spacing={2}>
        {filtered.map((trader) => {
          const sts = STATUS_CONFIG[trader.status];
          return (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={trader.id}>
              <Card
                sx={{ p: 3, cursor: 'pointer', '&:hover': { borderColor: 'rgba(212,175,55,0.3)' } }}
                onClick={() => navigate(`/trade/traders/${trader.id}`)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ width: 48, height: 48, fontSize: 24, backgroundColor: 'rgba(212,175,55,0.1)' }}>
                    {trader.flag}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#f0f0f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {trader.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#777', fontFamily: 'monospace' }}>
                      {trader.registration_number}
                    </Typography>
                  </Box>
                  <Chip
                    label={sts.label}
                    size="small"
                    sx={{ fontSize: 11, fontWeight: 600, backgroundColor: sts.bg, color: sts.color, height: 24 }}
                  />
                </Box>

                <Grid container spacing={1.5}>
                  <Grid size={4}>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>Trade Value</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>
                      ${(trader.total_trade_value / 1000000).toFixed(1)}M
                    </Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>Active Docs</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>
                      {trader.active_documents}
                    </Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>Compliance</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: complianceColor(trader.compliance_score) }}>
                      {trader.compliance_score > 0 ? `${trader.compliance_score}%` : '—'}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(212,175,55,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={trader.type === 'both' ? 'Import / Export' : trader.type.charAt(0).toUpperCase() + trader.type.slice(1)}
                    size="small"
                    sx={{ fontSize: 11, height: 22, backgroundColor: 'rgba(212,175,55,0.06)', color: '#b0b0b0' }}
                  />
                  <Typography sx={{ fontSize: 11, color: '#555' }}>
                    {trader.country}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filtered.length === 0 && (
        <Card sx={{ p: 4, textAlign: 'center', mt: 2 }}>
          <Typography sx={{ color: 'text.secondary' }}>No traders match your filters.</Typography>
        </Card>
      )}
    </Box>
  );
}
