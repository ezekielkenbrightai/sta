import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {
  Inventory,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface CargoItem {
  id: string;
  manifest_ref: string;
  shipment_ref: string;
  shipper: string;
  carrier: string;
  hs_code: string;
  description: string;
  quantity: number;
  unit: string;
  weight_kg: number;
  declared_value: number;
  currency: string;
  origin_country: string;
  hazard_class: string | null;
  status: 'manifested' | 'loaded' | 'in_transit' | 'discharged' | 'cleared';
}

const MOCK_CARGO: CargoItem[] = [
  { id: 'cg-001', manifest_ref: 'MAN-2026-4521', shipment_ref: 'SH-2026-9847', shipper: 'Nairobi Exports Ltd', carrier: 'Maersk Line', hs_code: '0901.11', description: 'Coffee, not roasted, not decaffeinated', quantity: 500, unit: 'bags', weight_kg: 15000, declared_value: 2250000, currency: 'KES', origin_country: 'Kenya', hazard_class: null, status: 'in_transit' },
  { id: 'cg-002', manifest_ref: 'MAN-2026-4520', shipment_ref: 'SH-2026-9847', shipper: 'Nairobi Exports Ltd', carrier: 'Maersk Line', hs_code: '0902.10', description: 'Green tea in packaging > 3kg', quantity: 200, unit: 'crates', weight_kg: 4800, declared_value: 960000, currency: 'KES', origin_country: 'Kenya', hazard_class: null, status: 'in_transit' },
  { id: 'cg-003', manifest_ref: 'MAN-2026-4519', shipment_ref: 'SH-2026-9846', shipper: 'Nairobi Exports Ltd', carrier: 'Bolloré Logistics Kenya', hs_code: '2523.29', description: 'Portland cement (grey)', quantity: 1200, unit: 'bags', weight_kg: 18000, declared_value: 1440000, currency: 'KES', origin_country: 'Kenya', hazard_class: null, status: 'discharged' },
  { id: 'cg-004', manifest_ref: 'MAN-2026-4518', shipment_ref: 'SH-2026-9844', shipper: 'Auto Kenya Ltd', carrier: 'Bolloré Logistics Kenya', hs_code: '8703.23', description: 'Motor vehicles, 1500-3000cc', quantity: 8, unit: 'units', weight_kg: 12000, declared_value: 9600000, currency: 'ZAR', origin_country: 'South Africa', hazard_class: null, status: 'loaded' },
  { id: 'cg-005', manifest_ref: 'MAN-2026-4517', shipment_ref: 'SH-2026-9843', shipper: 'Cairo Trade House', carrier: 'CMA CGM', hs_code: '2710.12', description: 'Light petroleum oils', quantity: 45000, unit: 'litres', weight_kg: 38250, declared_value: 5400000, currency: 'EGP', origin_country: 'Egypt', hazard_class: 'Class 3', status: 'manifested' },
  { id: 'cg-006', manifest_ref: 'MAN-2026-4516', shipment_ref: 'SH-2026-9842', shipper: 'Kenya Pharma Distributors', carrier: 'Ethiopian Airlines Cargo', hs_code: '3004.90', description: 'Medicaments, retail packaging', quantity: 5000, unit: 'boxes', weight_kg: 420, declared_value: 3750000, currency: 'GHS', origin_country: 'Ghana', hazard_class: null, status: 'cleared' },
  { id: 'cg-007', manifest_ref: 'MAN-2026-4515', shipment_ref: 'SH-2026-9844', shipper: 'Auto Kenya Ltd', carrier: 'Bolloré Logistics Kenya', hs_code: '7108.12', description: 'Gold, semi-manufactured forms', quantity: 50, unit: 'kg', weight_kg: 50, declared_value: 125000000, currency: 'ZAR', origin_country: 'South Africa', hazard_class: null, status: 'loaded' },
  { id: 'cg-008', manifest_ref: 'MAN-2026-4514', shipment_ref: 'SH-2026-9840', shipper: 'Lagos Electronics Ltd', carrier: 'PIL', hs_code: '6109.10', description: 'T-shirts, singlets — cotton', quantity: 10000, unit: 'pcs', weight_kg: 2500, declared_value: 4500000, currency: 'NGN', origin_country: 'Nigeria', hazard_class: null, status: 'in_transit' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  manifested: { label: 'Manifested', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  loaded: { label: 'Loaded', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  in_transit: { label: 'In Transit', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  discharged: { label: 'Discharged', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  cleared: { label: 'Cleared', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
};

function formatValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString();
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CargoManifestPage() {
  const { filterCustom, orgName, orgType } = useDataIsolation();
  const [search, setSearch] = useState('');

  const orgFiltered = useMemo(
    () => filterCustom(MOCK_CARGO, (c) => {
      if (orgType === 'logistics') return c.carrier === orgName;
      return c.shipper === orgName;
    }),
    [filterCustom, orgName, orgType],
  );

  const filtered = useMemo(() => {
    if (!search) return orgFiltered;
    const q = search.toLowerCase();
    return orgFiltered.filter((c) =>
      c.manifest_ref.toLowerCase().includes(q) || c.hs_code.includes(q) || c.description.toLowerCase().includes(q) || c.origin_country.toLowerCase().includes(q)
    );
  }, [orgFiltered, search]);

  const totalWeight = orgFiltered.reduce((s, c) => s + c.weight_kg, 0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Inventory sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Cargo Manifest</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Detailed cargo inventory across all active shipments.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Cargo Items', value: orgFiltered.length.toString(), color: '#D4AF37' },
          { label: 'Total Weight', value: `${(totalWeight / 1000).toFixed(1)}T`, color: '#3B82F6' },
          { label: 'Hazardous', value: orgFiltered.filter((c) => c.hazard_class).length.toString(), color: '#EF4444' },
          { label: 'Cleared', value: orgFiltered.filter((c) => c.status === 'cleared').length.toString(), color: '#22C55E' },
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
          placeholder="Search by manifest ref, HS code, description, or origin..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
        />
      </Card>

      {/* Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '110px 65px 1fr 80px 70px 90px 70px 75px',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['Manifest', 'HS Code', 'Description', 'Qty', 'Weight', 'Value', 'Origin', 'Status'].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {filtered.map((c, i) => {
          const sts = STATUS_CONFIG[c.status];
          return (
            <Box
              key={c.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '110px 65px 1fr 80px 70px 90px 70px 75px',
                gap: 1, px: 2.5, py: 1.75,
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#D4AF37' }}>{c.manifest_ref}</Typography>
                <Typography sx={{ fontSize: 10, color: '#555' }}>{c.shipment_ref}</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, fontFamily: 'monospace', color: '#D4AF37' }}>{c.hs_code}</Typography>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#f0f0f0' }}>{c.description}</Typography>
                {c.hazard_class && <Chip label={c.hazard_class} size="small" sx={{ fontSize: 9, height: 16, mt: 0.25, backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444' }} />}
              </Box>
              <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{c.quantity.toLocaleString()} {c.unit}</Typography>
              <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>{(c.weight_kg / 1000).toFixed(1)}T</Typography>
              <Typography sx={{ fontSize: 12, fontFamily: 'monospace', color: '#f0f0f0' }}>{formatValue(c.declared_value)} {c.currency}</Typography>
              <Typography sx={{ fontSize: 11, color: '#999' }}>{c.origin_country}</Typography>
              <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: sts.bg, color: sts.color }} />
            </Box>
          );
        })}

        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {orgFiltered.length} cargo items
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
