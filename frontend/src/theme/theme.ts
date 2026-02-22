import { createTheme } from '@mui/material/styles';

// STA Design System — Black & Gold dark theme
// Matches the landing page aesthetic at landing/index.html

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D4AF37',      // Gold
      light: '#F0D060',     // Gold light
      dark: '#B8962E',      // Gold dark
      contrastText: '#050505',
    },
    secondary: {
      main: '#A8882A',      // Gold muted
      light: '#D4AF37',
      dark: '#6B5A1E',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0a0a0a',   // Near-black
      paper: '#111111',     // Slightly lighter
    },
    text: {
      primary: '#f0f0f0',
      secondary: '#b0b0b0',
      disabled: '#555555',
    },
    divider: 'rgba(212, 175, 55, 0.12)',
    error: {
      main: '#EF4444',
    },
    warning: {
      main: '#E6A817',
    },
    success: {
      main: '#22C55E',
    },
    info: {
      main: '#3B82F6',
    },
  },
  typography: {
    fontFamily: "'Outfit', 'Helvetica', 'Arial', sans-serif",
    h1: { fontFamily: "'Lora', serif", fontWeight: 700 },
    h2: { fontFamily: "'Lora', serif", fontWeight: 700 },
    h3: { fontFamily: "'Lora', serif", fontWeight: 600 },
    h4: { fontFamily: "'Lora', serif", fontWeight: 600 },
    h5: { fontFamily: "'Lora', serif", fontWeight: 600 },
    h6: { fontFamily: "'Lora', serif", fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#3a3a3a transparent',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': {
            background: '#3a3a3a',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555555',
          },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '::selection': { background: 'rgba(212, 175, 55, 0.2)' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '8px 24px',
          transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
        containedPrimary: {
          background: '#D4AF37',
          color: '#050505',
          '&:hover': {
            background: '#B8962E',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(20, 20, 20, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          borderRadius: 16,
          transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            borderColor: 'rgba(212, 175, 55, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#050505',
          borderRight: '1px solid rgba(212, 175, 55, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 10, 10, 0.92)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 1px 0 rgba(212, 175, 55, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 50,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#1a1a1a',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default theme;
