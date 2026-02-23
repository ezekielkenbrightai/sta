import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useAuthStore } from '../stores/authStore';
import { useAppStore } from '../stores/appStore';

const IS_MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

const DEMO_ACCOUNTS = [
  { email: 'trader@nairobiexports.co.ke', label: 'Trader', color: '#D4AF37' },
  { email: 'govt@kra.go.ke', label: 'Govt Admin', color: '#22C55E' },
  { email: 'analyst@kra.go.ke', label: 'Analyst', color: '#3B82F6' },
  { email: 'officer@kcb.co.ke', label: 'Bank Officer', color: '#8B5CF6' },
  { email: 'customs@kpa.go.ke', label: 'Customs', color: '#F59E0B' },
  { email: 'logistics@bollore.co.ke', label: 'Logistics', color: '#06B6D4' },
  { email: 'agent@apa.co.ke', label: 'Insurance', color: '#EC4899' },
  { email: 'auditor@oag.go.ke', label: 'Auditor', color: '#EF4444' },
  { email: 'compliance@frc.go.ke', label: 'Compliance', color: '#14B8A6' },
  { email: 'afcfta@au.int', label: 'AfCFTA', color: '#10B981' },
  { email: 'admin@sta.africa', label: 'Super Admin', color: '#D4AF37' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const initForRole = useAppStore((s) => s.initForRole);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const user = useAuthStore.getState().user;
      if (user) initForRole(user.role);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #D4AF37, #B8962E)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#050505', fontFamily: "'Lora', serif" }}>
            ST
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ fontFamily: "'Lora', serif", mb: 0.5 }}>
          Smart Trade Africa
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 3, fontSize: 14 }}>
          Sign in to the digital trade platform
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#050505' }} /> : 'Sign In'}
          </Button>
        </Box>

        {IS_MOCK && (
          <>
            <Divider sx={{ my: 2.5, borderColor: 'rgba(212,175,55,0.1)' }}>
              <Typography sx={{ fontSize: 11, color: '#555', px: 1 }}>Demo Accounts</Typography>
            </Divider>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'center' }}>
              {DEMO_ACCOUNTS.map((acct) => (
                <Chip
                  key={acct.email}
                  label={acct.label}
                  size="small"
                  onClick={() => { setEmail(acct.email); setPassword('password123'); }}
                  sx={{
                    fontSize: 11,
                    height: 26,
                    cursor: 'pointer',
                    backgroundColor: `${acct.color}15`,
                    color: acct.color,
                    border: `1px solid ${acct.color}30`,
                    '&:hover': { backgroundColor: `${acct.color}25` },
                  }}
                />
              ))}
            </Box>
          </>
        )}

        <Typography sx={{ mt: 2.5, fontSize: 12, color: '#555' }}>
          Aligned with AfCFTA. Powered by Smart Trade Africa.
        </Typography>
      </Card>
    </Box>
  );
}
