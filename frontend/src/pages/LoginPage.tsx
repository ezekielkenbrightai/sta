import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useAuthStore } from '../stores/authStore';
import { useAppStore } from '../stores/appStore';

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

        <Typography sx={{ mt: 3, fontSize: 12, color: '#555' }}>
          Aligned with AfCFTA. Powered by Smart Trade Africa.
        </Typography>
      </Card>
    </Box>
  );
}
