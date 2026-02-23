import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function defaultLandingPage(role: string): string {
  switch (role) {
    case 'super_admin':
    case 'govt_admin':
      return '/admin/dashboard';
    case 'govt_analyst':
      return '/analytics/dashboard';
    case 'bank_officer':
      return '/payments/dashboard';
    case 'customs_officer':
      return '/customs/dashboard';
    case 'logistics_officer':
      return '/supply-chain/dashboard';
    case 'insurance_agent':
      return '/insurance/dashboard';
    case 'auditor':
      return '/ledger/dashboard';
    case 'compliance_officer':
      return '/compliance/dashboard';
    case 'afcfta_admin':
      return '/afcfta/dashboard';
    case 'ps_trade':
      return '/executive/dashboard';
    default:
      return '/dashboard';
  }
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const user = useAuthStore((s) => s.user);

  if (isAuthLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} sx={{ color: '#D4AF37' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={defaultLandingPage(user.role)} replace />;
  }

  return <>{children}</>;
}
