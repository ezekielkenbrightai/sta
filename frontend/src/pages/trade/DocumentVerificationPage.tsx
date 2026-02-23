import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  CheckCircle,
  HourglassEmpty,
  Warning,
} from '@mui/icons-material';

const MOCK_QUEUE = [
  {
    id: 'td-003', reference: 'KE-2026-0040', trader: 'Lagos Trading Co',
    origin: 'South Africa', destination: 'Kenya', value: 'ZAR 520,000',
    items: 24, priority: 'high', submitted: '2026-02-18', type: 'import',
  },
  {
    id: 'td-004', reference: 'KE-2026-0039', trader: 'Nairobi Exports Ltd',
    origin: 'Kenya', destination: 'Tanzania', value: '$32,000',
    items: 3, priority: 'normal', submitted: '2026-02-17', type: 'export',
  },
  {
    id: 'td-010', reference: 'KE-2026-0033', trader: 'Nairobi Exports Ltd',
    origin: 'Ethiopia', destination: 'Rwanda', value: '$120,000',
    items: 15, priority: 'normal', submitted: '2026-02-11', type: 're_export',
  },
];

const VERIFIED = [
  {
    id: 'td-006', reference: 'KE-2026-0037', trader: 'Lagos Trading Co',
    origin: 'South Africa', destination: 'Uganda', value: 'ZAR 95,000',
    items: 8, verified_at: '2026-02-18', officer: 'Peter Njoroge',
  },
];

export default function DocumentVerificationPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Document Verification</Typography>
      <Typography sx={{ color: 'text.secondary', mb: 3 }}>
        Review and verify submitted trade documents for customs clearance.
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Pending Review', value: MOCK_QUEUE.length, icon: <HourglassEmpty />, color: '#E6A817' },
          { label: 'High Priority', value: MOCK_QUEUE.filter((d) => d.priority === 'high').length, icon: <Warning />, color: '#EF4444' },
          { label: 'Verified Today', value: VERIFIED.length, icon: <CheckCircle />, color: '#22C55E' },
        ].map((s) => (
          <Grid size={{ xs: 12, sm: 4 }} key={s.label}>
            <Card sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                {s.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif" }}>{s.value}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Card sx={{ overflow: 'hidden' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 2,
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            '& .MuiTab-root': { color: '#999', fontSize: 13, textTransform: 'none' },
            '& .Mui-selected': { color: '#D4AF37' },
            '& .MuiTabs-indicator': { backgroundColor: '#D4AF37' },
          }}
        >
          <Tab label={`Pending Review (${MOCK_QUEUE.length})`} />
          <Tab label={`Verified (${VERIFIED.length})`} />
        </Tabs>

        {tab === 0 && (
          <Box>
            {MOCK_QUEUE.map((doc, i) => (
              <Box
                key={doc.id}
                sx={{
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: i < MOCK_QUEUE.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(212,175,55,0.04)' },
                  flexWrap: 'wrap',
                  gap: 1,
                }}
                onClick={() => navigate(`/trade/documents/${doc.id}`)}
              >
                <Box sx={{ minWidth: 200 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#D4AF37' }}>{doc.reference}</Typography>
                    {doc.priority === 'high' && (
                      <Chip label="HIGH" size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444' }} />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: 12, color: '#999' }}>
                    {doc.trader} &middot; {doc.origin} → {doc.destination}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{doc.value}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#777' }}>{doc.items} items</Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: '#D4AF37', borderColor: 'rgba(212,175,55,0.3)', fontSize: 12, minWidth: 100 }}
                  >
                    Review
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {tab === 1 && (
          <Box>
            {VERIFIED.map((doc) => (
              <Box key={doc.id} sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#22C55E' }}>{doc.reference}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#999' }}>
                    {doc.trader} &middot; Verified by {doc.officer} on {doc.verified_at}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{doc.value}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Card>
    </Box>
  );
}
