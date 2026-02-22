import { Box, Card, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

/**
 * Generic placeholder page used for routes that haven't been fully implemented yet.
 * Shows the route path and a "coming soon" message.
 */
export default function PlaceholderPage() {
  const location = useLocation();

  // Derive a title from the path
  const title = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment) =>
      segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()),
    )
    .join(' > ');

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {title || 'Page'}
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 3 }}>
        This page is under development.
      </Typography>
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: 'rgba(212, 175, 55, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            fontSize: 28,
          }}
        >
          🚧
        </Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Coming Soon
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 14, maxWidth: 400, mx: 'auto' }}>
          This module is part of the Smart Trade Africa platform and will be implemented
          in an upcoming development phase.
        </Typography>
      </Card>
    </Box>
  );
}
