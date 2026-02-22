import { Box, Card, Grid, Typography } from '@mui/material';
import {
  Description as DescriptionIcon,
  LocalShipping as ShippingIcon,
  TrendingUp as TrendingIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
}

function StatCard({ label, value, subtitle, icon, color = '#D4AF37' }: StatCardProps) {
  return (
    <Card sx={{ p: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          backgroundColor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: "'Lora', serif", lineHeight: 1.2 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: 12, color: '#22C55E', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Card>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Dashboard
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 3 }}>
        Welcome back, {user?.first_name || 'User'}. Here's your trade overview.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Active Documents"
            value="1,247"
            subtitle="+12% this month"
            icon={<DescriptionIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Tax Collected"
            value="KES 2.4B"
            subtitle="+8% vs last quarter"
            icon={<MoneyIcon />}
            color="#22C55E"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Active Shipments"
            value="342"
            subtitle="18 at port"
            icon={<ShippingIcon />}
            color="#3B82F6"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="FX Settlements"
            value="$12.8M"
            subtitle="Avg 3s settlement"
            icon={<TrendingIcon />}
            color="#E6A817"
          />
        </Grid>
      </Grid>

      {/* Placeholder sections */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 3, minHeight: 300 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Trade Volume Trend</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 220, color: 'text.secondary' }}>
              <Typography>Chart will be rendered here with Recharts</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 3, minHeight: 300 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
            {[
              { text: 'Import doc #KE-2026-0042 submitted', time: '2m ago' },
              { text: 'Tax assessment approved for TZ-2026-0018', time: '15m ago' },
              { text: 'FX settlement completed: KES → NGN', time: '1h ago' },
              { text: 'Shipment #SH-9847 cleared customs', time: '2h ago' },
              { text: 'New trader registered: Nairobi Exports Ltd', time: '3h ago' },
            ].map((item, i) => (
              <Box key={i} sx={{ py: 1.5, borderBottom: i < 4 ? '1px solid rgba(212,175,55,0.08)' : 'none' }}>
                <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{item.text}</Typography>
                <Typography sx={{ fontSize: 11, color: '#555' }}>{item.time}</Typography>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
