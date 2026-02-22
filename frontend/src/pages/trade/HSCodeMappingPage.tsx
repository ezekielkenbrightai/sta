import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  SwapHoriz,
} from '@mui/icons-material';

interface Mapping {
  id: number;
  product_name: string;
  hs_code: string;
  hs_description: string;
  duty_rate: number;
  status: 'confirmed' | 'suggested' | 'pending';
}

const MOCK_MAPPINGS: Mapping[] = [
  { id: 1, product_name: 'Dell Latitude 7430 Laptop', hs_code: '8471.30', hs_description: 'Portable digital computers (laptops)', duty_rate: 0, status: 'confirmed' },
  { id: 2, product_name: 'Premium Arabica Coffee Beans', hs_code: '0901.11', hs_description: 'Coffee, not roasted, not decaffeinated', duty_rate: 25, status: 'confirmed' },
  { id: 3, product_name: 'Organic Cotton T-Shirts (Bulk)', hs_code: '6109.10', hs_description: 'T-shirts, cotton', duty_rate: 35, status: 'confirmed' },
  { id: 4, product_name: 'Toyota Hilux Spare Parts Kit', hs_code: '8703.23', hs_description: 'Motor vehicles, 1500–3000cc', duty_rate: 25, status: 'suggested' },
  { id: 5, product_name: 'Amoxicillin 500mg (100 boxes)', hs_code: '3004.90', hs_description: 'Medicaments, packaged for retail', duty_rate: 0, status: 'pending' },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  confirmed: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  suggested: { color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  pending: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
};

export default function HSCodeMappingPage() {
  const [mappings] = useState<Mapping[]>(MOCK_MAPPINGS);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>Product HS Mapping</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Map your products to HS codes for automatic duty rate calculation.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Mapping
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Mappings', value: mappings.length, color: '#D4AF37' },
          { label: 'Confirmed', value: mappings.filter((m) => m.status === 'confirmed').length, color: '#22C55E' },
          { label: 'Needs Review', value: mappings.filter((m) => m.status !== 'confirmed').length, color: '#E6A817' },
        ].map((s) => (
          <Grid size={{ xs: 12, sm: 4 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Mappings */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 30px 1fr 80px 80px 50px',
            gap: 1,
            px: 2.5,
            py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            backgroundColor: 'rgba(212,175,55,0.03)',
            alignItems: 'center',
          }}
        >
          {['Product', '', 'HS Code / Description', 'Duty', 'Status', ''].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {mappings.map((m, i) => {
          const sts = STATUS_CONFIG[m.status];
          return (
            <Box
              key={m.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 30px 1fr 80px 80px 50px',
                gap: 1,
                px: 2.5,
                py: 2,
                alignItems: 'center',
                borderBottom: i < mappings.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
              }}
            >
              <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{m.product_name}</Typography>
              <SwapHoriz sx={{ fontSize: 16, color: '#555' }} />
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{m.hs_code}</Typography>
                <Typography sx={{ fontSize: 11, color: '#777' }}>{m.hs_description}</Typography>
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: m.duty_rate > 0 ? '#E6A817' : '#22C55E' }}>
                {m.duty_rate}%
              </Typography>
              <Chip
                label={m.status}
                size="small"
                sx={{ fontSize: 11, height: 22, backgroundColor: sts.bg, color: sts.color, textTransform: 'capitalize' }}
              />
              <IconButton size="small" sx={{ color: '#555', '&:hover': { color: '#EF4444' } }}>
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          );
        })}
      </Card>
    </Box>
  );
}
