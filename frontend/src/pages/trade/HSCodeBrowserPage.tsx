import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// ─── HS Code data (extended mock) ────────────────────────────────────────────

interface HSEntry {
  code: string;
  description: string;
  duty_rate: number;
  chapter: number;
  section: string;
  category: string;
}

const HS_CODES: HSEntry[] = [
  { code: '0901.11', description: 'Coffee, not roasted, not decaffeinated', duty_rate: 25, chapter: 9, section: 'II', category: 'Agricultural' },
  { code: '0902.10', description: 'Green tea (not fermented)', duty_rate: 25, chapter: 9, section: 'II', category: 'Agricultural' },
  { code: '1701.13', description: 'Raw cane sugar', duty_rate: 100, chapter: 17, section: 'IV', category: 'Agricultural' },
  { code: '2523.29', description: 'Portland cement', duty_rate: 35, chapter: 25, section: 'V', category: 'Construction' },
  { code: '2710.12', description: 'Light petroleum oils (petrol/gasoline)', duty_rate: 0, chapter: 27, section: 'V', category: 'Energy' },
  { code: '3004.90', description: 'Medicaments, packaged for retail', duty_rate: 0, chapter: 30, section: 'VI', category: 'Pharmaceuticals' },
  { code: '3926.90', description: 'Other articles of plastics', duty_rate: 25, chapter: 39, section: 'VII', category: 'Manufacturing' },
  { code: '4011.10', description: 'New pneumatic tyres, for motor cars', duty_rate: 25, chapter: 40, section: 'VII', category: 'Automotive' },
  { code: '4802.55', description: 'Uncoated paper, 40–150 g/m²', duty_rate: 10, chapter: 48, section: 'X', category: 'Manufacturing' },
  { code: '6109.10', description: 'T-shirts, cotton', duty_rate: 35, chapter: 61, section: 'XI', category: 'Textiles' },
  { code: '6203.42', description: 'Men\'s trousers, cotton', duty_rate: 35, chapter: 62, section: 'XI', category: 'Textiles' },
  { code: '7108.12', description: 'Gold, non-monetary, semi-manufactured', duty_rate: 0, chapter: 71, section: 'XIV', category: 'Precious Metals' },
  { code: '7210.49', description: 'Flat-rolled iron/steel, zinc coated', duty_rate: 25, chapter: 72, section: 'XV', category: 'Metals' },
  { code: '8471.30', description: 'Portable digital computers (laptops)', duty_rate: 0, chapter: 84, section: 'XVI', category: 'Electronics' },
  { code: '8517.12', description: 'Smartphones', duty_rate: 0, chapter: 85, section: 'XVI', category: 'Electronics' },
  { code: '8703.23', description: 'Motor vehicles, 1500–3000cc', duty_rate: 25, chapter: 87, section: 'XVII', category: 'Automotive' },
  { code: '8704.21', description: 'Motor vehicles for goods transport', duty_rate: 25, chapter: 87, section: 'XVII', category: 'Automotive' },
  { code: '9401.61', description: 'Seats with wooden frames, upholstered', duty_rate: 25, chapter: 94, section: 'XX', category: 'Furniture' },
  { code: '9403.30', description: 'Wooden furniture for offices', duty_rate: 25, chapter: 94, section: 'XX', category: 'Furniture' },
  { code: '0207.14', description: 'Frozen cuts of chicken', duty_rate: 35, chapter: 2, section: 'I', category: 'Agricultural' },
];

const CATEGORIES = [...new Set(HS_CODES.map((h) => h.category))].sort();

function dutyColor(rate: number): string {
  if (rate === 0) return '#22C55E';
  if (rate <= 10) return '#3B82F6';
  if (rate <= 25) return '#E6A817';
  return '#EF4444';
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HSCodeBrowserPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return HS_CODES.filter((hs) => {
      if (categoryFilter && hs.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          hs.code.includes(q) ||
          hs.description.toLowerCase().includes(q) ||
          hs.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, categoryFilter]);

  // Section summary stats
  const avgDuty = filtered.length > 0
    ? (filtered.reduce((s, h) => s + h.duty_rate, 0) / filtered.length).toFixed(1)
    : '0';

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>HS Code Browser</Typography>
      <Typography sx={{ color: 'text.secondary', mb: 3 }}>
        Search the Harmonized System commodity classification codes and their applicable duty rates.
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total HS Codes', value: HS_CODES.length, color: '#D4AF37' },
          { label: 'Categories', value: CATEGORIES.length, color: '#3B82F6' },
          { label: 'Avg Duty Rate', value: `${avgDuty}%`, color: '#E6A817' },
          { label: 'Duty-Free Items', value: HS_CODES.filter((h) => h.duty_rate === 0).length, color: '#22C55E' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>
                {s.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search + Category filter */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by HS code, description, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: '#777' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          <Chip
            label="All"
            size="small"
            onClick={() => setCategoryFilter(null)}
            sx={{
              fontSize: 12,
              backgroundColor: !categoryFilter ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.05)',
              color: !categoryFilter ? '#D4AF37' : '#999',
              fontWeight: !categoryFilter ? 600 : 400,
              cursor: 'pointer',
            }}
          />
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              size="small"
              onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
              sx={{
                fontSize: 12,
                backgroundColor: categoryFilter === cat ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.05)',
                color: categoryFilter === cat ? '#D4AF37' : '#999',
                fontWeight: categoryFilter === cat ? 600 : 400,
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      </Card>

      {/* Results */}
      <Card sx={{ overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 120px 80px 80px',
            gap: 1,
            px: 2.5,
            py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['HS Code', 'Description', 'Category', 'Section', 'Duty Rate'].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {h}
            </Typography>
          ))}
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>No HS codes match your search.</Typography>
          </Box>
        ) : (
          filtered.map((hs, i) => (
            <Box
              key={hs.code}
              sx={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 120px 80px 80px',
                gap: 1,
                px: 2.5,
                py: 1.75,
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                alignItems: 'center',
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>
                {hs.code}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>
                {hs.description}
              </Typography>
              <Chip
                label={hs.category}
                size="small"
                sx={{ fontSize: 11, height: 22, backgroundColor: 'rgba(212,175,55,0.06)', color: '#b0b0b0' }}
              />
              <Typography sx={{ fontSize: 12, color: '#999' }}>
                Ch. {hs.chapter}
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: dutyColor(hs.duty_rate) }}>
                {hs.duty_rate}%
              </Typography>
            </Box>
          ))
        )}

        {/* Footer */}
        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 12, color: '#777' }}>
            Showing {filtered.length} of {HS_CODES.length} HS codes
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
