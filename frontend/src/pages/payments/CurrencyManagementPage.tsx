import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AttachMoney,
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  country: string;
  is_african: boolean;
  is_active: boolean;
  decimal_places: number;
  exchange_rate_to_usd: number;
  last_updated: string;
  papss_enabled: boolean;
  cbdc_ready: boolean;
}

const MOCK_CURRENCIES: Currency[] = [
  { id: 'cur-001', code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', country: 'Kenya', is_african: true, is_active: true, decimal_places: 2, exchange_rate_to_usd: 0.00775, last_updated: '2026-02-22', papss_enabled: true, cbdc_ready: true },
  { id: 'cur-002', code: 'NGN', name: 'Nigerian Naira', symbol: '₦', country: 'Nigeria', is_african: true, is_active: true, decimal_places: 2, exchange_rate_to_usd: 0.000627, last_updated: '2026-02-22', papss_enabled: true, cbdc_ready: true },
  { id: 'cur-003', code: 'ZAR', name: 'South African Rand', symbol: 'R', country: 'South Africa', is_african: true, is_active: true, decimal_places: 2, exchange_rate_to_usd: 0.0541, last_updated: '2026-02-22', papss_enabled: true, cbdc_ready: false },
  { id: 'cur-004', code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', country: 'Egypt', is_african: true, is_active: true, decimal_places: 2, exchange_rate_to_usd: 0.0203, last_updated: '2026-02-22', papss_enabled: true, cbdc_ready: false },
  { id: 'cur-005', code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', country: 'Ghana', is_african: true, is_active: true, decimal_places: 2, exchange_rate_to_usd: 0.0787, last_updated: '2026-02-22', papss_enabled: true, cbdc_ready: true },
  { id: 'cur-006', code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', country: 'Tanzania', is_african: true, is_active: true, decimal_places: 2, exchange_rate_to_usd: 0.000390, last_updated: '2026-02-22', papss_enabled: true, cbdc_ready: false },
  { id: 'cur-007', code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', country: 'Uganda', is_african: true, is_active: true, decimal_places: 0, exchange_rate_to_usd: 0.000268, last_updated: '2026-02-22', papss_enabled: true, cbdc_ready: false },
  { id: 'cur-008', code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', country: 'Rwanda', is_african: true, is_active: true, decimal_places: 0, exchange_rate_to_usd: 0.000742, last_updated: '2026-02-22', papss_enabled: true, cbdc_ready: false },
  { id: 'cur-009', code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', country: 'Ethiopia', is_african: true, is_active: true, decimal_places: 2, exchange_rate_to_usd: 0.00868, last_updated: '2026-02-22', papss_enabled: true, cbdc_ready: false },
  { id: 'cur-010', code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', country: 'WAEMU', is_african: true, is_active: true, decimal_places: 0, exchange_rate_to_usd: 0.00166, last_updated: '2026-02-22', papss_enabled: true, cbdc_ready: true },
  { id: 'cur-011', code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', country: 'CEMAC', is_african: true, is_active: true, decimal_places: 0, exchange_rate_to_usd: 0.00166, last_updated: '2026-02-22', papss_enabled: false, cbdc_ready: false },
  { id: 'cur-012', code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States', is_african: false, is_active: true, decimal_places: 2, exchange_rate_to_usd: 1.0, last_updated: '2026-02-22', papss_enabled: false, cbdc_ready: false },
  { id: 'cur-013', code: 'EUR', name: 'Euro', symbol: '€', country: 'Eurozone', is_african: false, is_active: true, decimal_places: 2, exchange_rate_to_usd: 1.088, last_updated: '2026-02-22', papss_enabled: false, cbdc_ready: false },
  { id: 'cur-014', code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', country: 'Morocco', is_african: true, is_active: false, decimal_places: 2, exchange_rate_to_usd: 0.0989, last_updated: '2026-01-15', papss_enabled: false, cbdc_ready: false },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CurrencyManagementPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return MOCK_CURRENCIES.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        return c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search]);

  const africanCount = MOCK_CURRENCIES.filter((c) => c.is_african).length;
  const papssCount = MOCK_CURRENCIES.filter((c) => c.papss_enabled).length;
  const cbdcCount = MOCK_CURRENCIES.filter((c) => c.cbdc_ready).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <AttachMoney sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Currency Management</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            Manage supported currencies, PAPSS integration, and CBDC readiness.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Currency
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Currencies', value: MOCK_CURRENCIES.length.toString(), color: '#D4AF37' },
          { label: 'African Currencies', value: africanCount.toString(), color: '#22C55E' },
          { label: 'PAPSS Enabled', value: papssCount.toString(), color: '#3B82F6' },
          { label: 'CBDC Ready', value: cbdcCount.toString(), color: '#8B5CF6' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search */}
      <Card sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth size="small"
          placeholder="Search by code, name, or country..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
        />
      </Card>

      {/* Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '55px 60px 1fr 90px 80px 70px 70px 70px 50px',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['Code', 'Symbol', 'Currency', 'Country', 'USD Rate', 'Status', 'PAPSS', 'CBDC', ''].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {filtered.map((c, i) => (
          <Box
            key={c.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '55px 60px 1fr 90px 80px 70px 70px 70px 50px',
              gap: 1, px: 2.5, py: 1.75,
              alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
              '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              opacity: c.is_active ? 1 : 0.5,
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: c.is_african ? '#D4AF37' : '#999', fontFamily: 'monospace' }}>{c.code}</Typography>
            <Typography sx={{ fontSize: 14, color: '#f0f0f0' }}>{c.symbol}</Typography>
            <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{c.name}</Typography>
            <Typography sx={{ fontSize: 12, color: '#999' }}>{c.country}</Typography>
            <Typography sx={{ fontSize: 12, fontFamily: 'monospace', color: '#b0b0b0' }}>
              {c.exchange_rate_to_usd === 1 ? '1.0000' : c.exchange_rate_to_usd < 0.01 ? c.exchange_rate_to_usd.toFixed(6) : c.exchange_rate_to_usd.toFixed(4)}
            </Typography>
            <Chip
              label={c.is_active ? 'Active' : 'Inactive'}
              size="small"
              sx={{
                fontSize: 10, height: 20,
                backgroundColor: c.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(153,153,153,0.1)',
                color: c.is_active ? '#22C55E' : '#999',
              }}
            />
            {c.papss_enabled ? (
              <CheckCircle sx={{ fontSize: 16, color: '#3B82F6' }} />
            ) : (
              <Cancel sx={{ fontSize: 16, color: '#333' }} />
            )}
            {c.cbdc_ready ? (
              <Chip label="Ready" size="small" sx={{ fontSize: 9, height: 18, backgroundColor: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }} />
            ) : (
              <Typography sx={{ fontSize: 10, color: '#333' }}>—</Typography>
            )}
            <Tooltip title="Edit currency" arrow>
              <IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#D4AF37' } }}>
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        ))}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {MOCK_CURRENCIES.length} currencies
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
