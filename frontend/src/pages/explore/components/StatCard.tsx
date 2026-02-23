import { Box, Typography } from '@mui/material';

interface Props {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, sub, icon }: Props) {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(17, 17, 17, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 175, 55, 0.12)',
        borderRadius: 3,
        p: 2,
        textAlign: 'center',
        transition: 'border-color 0.3s',
        '&:hover': { borderColor: 'rgba(212, 175, 55, 0.3)' },
      }}
    >
      {icon && (
        <Box sx={{ mb: 0.5, color: '#D4AF37', display: 'flex', justifyContent: 'center' }}>
          {icon}
        </Box>
      )}
      <Typography
        sx={{
          fontFamily: "'Lora', serif",
          fontWeight: 700,
          fontSize: { xs: '1.4rem', md: '1.7rem' },
          color: '#D4AF37',
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ fontSize: 11, color: '#b0b0b0', textTransform: 'uppercase', letterSpacing: 1, mt: 0.5 }}>
        {label}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: 10, color: '#22C55E', mt: 0.3 }}>{sub}</Typography>
      )}
    </Box>
  );
}
