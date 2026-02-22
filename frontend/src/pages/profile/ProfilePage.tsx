import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Business,
  Public,
  CalendarMonth,
  Lock,
  Security,
  Visibility,
  VisibilityOff,
  Notifications,
  Api,
  ContentCopy,
  Refresh,
  History,
  Devices,
  DarkMode,
  LightMode,
  Logout,
  VpnKey,
  MarkEmailRead,
  Sms,
  Description,
  Campaign,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

// -- TypeScript Interfaces ────────────────────────────────────────────────────

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

interface LoginActivity {
  id: string;
  date: string;
  device: string;
  ip: string;
  location: string;
  status: 'success' | 'failed';
}

interface NotificationPreferences {
  emailNotifications: boolean;
  smsAlerts: boolean;
  reportDelivery: boolean;
  platformAnnouncements: boolean;
}

interface ApiAccessInfo {
  apiKey: string;
  requestsToday: number;
  requestsLimit: number;
  lastUsed: string;
}

// -- Mock Data ────────────────────────────────────────────────────────────────

const MOCK_SESSIONS: ActiveSession[] = [
  { id: 's1', device: 'MacBook Pro 16"', browser: 'Chrome 122', ip: '197.248.12.45', lastActive: 'Now', isCurrent: true },
  { id: 's2', device: 'iPhone 15 Pro', browser: 'Safari Mobile', ip: '197.248.12.45', lastActive: '2h ago', isCurrent: false },
  { id: 's3', device: 'Windows Desktop', browser: 'Firefox 124', ip: '41.90.177.21', lastActive: '1d ago', isCurrent: false },
];

const MOCK_LOGIN_ACTIVITY: LoginActivity[] = [
  { id: 'l1', date: '2026-02-23 09:15', device: 'MacBook Pro 16"', ip: '197.248.12.45', location: 'Nairobi, Kenya', status: 'success' },
  { id: 'l2', date: '2026-02-22 18:30', device: 'iPhone 15 Pro', ip: '197.248.12.45', location: 'Nairobi, Kenya', status: 'success' },
  { id: 'l3', date: '2026-02-22 08:00', device: 'MacBook Pro 16"', ip: '197.248.12.45', location: 'Nairobi, Kenya', status: 'success' },
  { id: 'l4', date: '2026-02-21 22:45', device: 'Unknown Device', ip: '102.68.45.210', location: 'Lagos, Nigeria', status: 'failed' },
  { id: 'l5', date: '2026-02-21 14:20', device: 'Windows Desktop', ip: '41.90.177.21', location: 'Mombasa, Kenya', status: 'success' },
  { id: 'l6', date: '2026-02-20 09:00', device: 'MacBook Pro 16"', ip: '197.248.12.45', location: 'Nairobi, Kenya', status: 'success' },
];

const MOCK_API_ACCESS: ApiAccessInfo = {
  apiKey: 'sta_live_7f3k9m2x8p1q4w6e0r5t',
  requestsToday: 1_247,
  requestsLimit: 10_000,
  lastUsed: '3 minutes ago',
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  govt_admin: 'Government Admin',
  govt_analyst: 'Government Analyst',
  bank_officer: 'Bank Officer',
  trader: 'Trader',
  logistics_officer: 'Logistics Officer',
  customs_officer: 'Customs Officer',
  insurance_agent: 'Insurance Agent',
  auditor: 'Auditor',
};

// -- Component ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  // Local state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailNotifications: true,
    smsAlerts: false,
    reportDelivery: true,
    platformAnnouncements: true,
  });

  const fullName = user ? `${user.first_name} ${user.last_name}` : 'User';
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}` : 'U';
  const roleLabel = user ? (ROLE_LABELS[user.role] || user.role) : '';
  const maskedKey = MOCK_API_ACCESS.apiKey.slice(0, 8) + '****' + MOCK_API_ACCESS.apiKey.slice(-4);
  const apiUsagePercent = (MOCK_API_ACCESS.requestsToday / MOCK_API_ACCESS.requestsLimit) * 100;

  const handleNotificationToggle = (key: keyof NotificationPreferences) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // -- Section Header helper
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Box sx={{ color: '#D4AF37' }}>{icon}</Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{title}</Typography>
    </Box>
  );

  return (
    <Box>
      {/* Page Title */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Person sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Profile & Settings</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Manage your account, security settings, notification preferences, and API access.
        </Typography>
      </Box>

      {/* Profile Header Card */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: 28,
              fontWeight: 700,
              backgroundColor: 'rgba(212,175,55,0.15)',
              color: '#D4AF37',
              border: '2px solid rgba(212,175,55,0.3)',
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#f0f0f0', fontFamily: "'Lora', serif" }}>
              {fullName}
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#b0b0b0', mb: 0.5 }}>{user?.email}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={roleLabel}
                size="small"
                sx={{ fontSize: 11, height: 22, color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
              />
              {user?.organization_name && (
                <Chip
                  icon={<Business sx={{ fontSize: 12 }} />}
                  label={user.organization_name}
                  size="small"
                  sx={{ fontSize: 11, height: 22, color: '#b0b0b0', backgroundColor: 'rgba(255,255,255,0.04)' }}
                />
              )}
              {user?.country_flag_emoji && user?.country_name && (
                <Chip
                  label={`${user.country_flag_emoji} ${user.country_name}`}
                  size="small"
                  sx={{ fontSize: 11, height: 22, color: '#b0b0b0', backgroundColor: 'rgba(255,255,255,0.04)' }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Card>

      <Grid container spacing={2}>
        {/* ── Left Column ────────────────────────────────────── */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Account Information */}
            <Card sx={{ p: 2.5 }}>
              <SectionHeader icon={<Person sx={{ fontSize: 18 }} />} title="Account Information" />
              <Grid container spacing={2}>
                {[
                  { icon: <Person sx={{ fontSize: 14, color: '#777' }} />, label: 'Full Name', value: fullName },
                  { icon: <Email sx={{ fontSize: 14, color: '#777' }} />, label: 'Email', value: user?.email || '-' },
                  { icon: <Phone sx={{ fontSize: 14, color: '#777' }} />, label: 'Phone', value: '+254 712 345 678' },
                  { icon: <VpnKey sx={{ fontSize: 14, color: '#777' }} />, label: 'Role', value: roleLabel },
                  { icon: <Business sx={{ fontSize: 14, color: '#777' }} />, label: 'Organization', value: user?.organization_name || 'N/A' },
                  { icon: <Public sx={{ fontSize: 14, color: '#777' }} />, label: 'Country', value: user?.country_flag_emoji && user?.country_name ? `${user.country_flag_emoji} ${user.country_name}` : 'N/A' },
                  { icon: <CalendarMonth sx={{ fontSize: 14, color: '#777' }} />, label: 'Member Since', value: 'January 15, 2025' },
                ].map((item) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      {item.icon}
                      <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 13, color: '#e0e0e0', pl: 2.75 }}>{item.value}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Card>

            {/* Security Settings */}
            <Card sx={{ p: 2.5 }}>
              <SectionHeader icon={<Lock sx={{ fontSize: 18 }} />} title="Security Settings" />

              {/* Change Password */}
              <Typography sx={{ fontSize: 12, color: '#b0b0b0', mb: 1.5, fontWeight: 600 }}>Change Password</Typography>
              <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type={showCurrentPassword ? 'text' : 'password'}
                    label="Current Password"
                    placeholder="Enter current"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                              {showCurrentPassword ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type={showNewPassword ? 'text' : 'password'}
                    label="New Password"
                    placeholder="Enter new"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setShowNewPassword(!showNewPassword)}>
                              {showNewPassword ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth size="small" type="password" label="Confirm Password" placeholder="Re-enter new" />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                size="small"
                sx={{
                  mb: 2.5,
                  backgroundColor: '#D4AF37',
                  color: '#0a0a0a',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '50px',
                  '&:hover': { backgroundColor: '#F0D060' },
                }}
              >
                Update Password
              </Button>

              <Divider sx={{ borderColor: 'rgba(212,175,55,0.08)', mb: 2 }} />

              {/* 2FA Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security sx={{ fontSize: 16, color: '#777' }} />
                  <Box>
                    <Typography sx={{ fontSize: 13, color: '#e0e0e0' }}>Two-Factor Authentication</Typography>
                    <Typography sx={{ fontSize: 10, color: '#555' }}>Add an extra layer of security to your account</Typography>
                  </Box>
                </Box>
                <Switch
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' },
                  }}
                />
              </Box>

              <Divider sx={{ borderColor: 'rgba(212,175,55,0.08)', mb: 2 }} />

              {/* Active Sessions */}
              <Typography sx={{ fontSize: 12, color: '#b0b0b0', mb: 1.5, fontWeight: 600 }}>Active Sessions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {MOCK_SESSIONS.map((session) => (
                  <Box
                    key={session.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: session.isCurrent ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.02)',
                      border: session.isCurrent ? '1px solid rgba(212,175,55,0.15)' : '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Devices sx={{ fontSize: 16, color: session.isCurrent ? '#D4AF37' : '#555' }} />
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Typography sx={{ fontSize: 12, color: '#e0e0e0' }}>{session.device}</Typography>
                          {session.isCurrent && (
                            <Chip label="Current" size="small" sx={{ fontSize: 9, height: 14, color: '#22C55E', backgroundColor: 'rgba(34,197,94,0.08)' }} />
                          )}
                        </Box>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>
                          {session.browser} &middot; {session.ip} &middot; {session.lastActive}
                        </Typography>
                      </Box>
                    </Box>
                    {!session.isCurrent && (
                      <Tooltip title="Revoke session">
                        <IconButton size="small" sx={{ color: '#555', '&:hover': { color: '#EF4444' } }}>
                          <Logout sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Activity Log */}
            <Card sx={{ p: 2.5 }}>
              <SectionHeader icon={<History sx={{ fontSize: 18 }} />} title="Recent Login Activity" />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {MOCK_LOGIN_ACTIVITY.map((entry) => (
                  <Box
                    key={entry.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.25,
                      borderRadius: 1,
                      backgroundColor: entry.status === 'failed' ? 'rgba(239,68,68,0.04)' : 'transparent',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: entry.status === 'success' ? '#22C55E' : '#EF4444',
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography sx={{ fontSize: 12, color: '#e0e0e0' }}>{entry.device}</Typography>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>
                          {entry.ip} &middot; {entry.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: 11, color: '#b0b0b0', fontFamily: 'monospace' }}>{entry.date}</Typography>
                      <Typography sx={{ fontSize: 9, color: entry.status === 'success' ? '#22C55E' : '#EF4444', textTransform: 'uppercase' }}>
                        {entry.status}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* ── Right Column ───────────────────────────────────── */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Notification Preferences */}
            <Card sx={{ p: 2.5 }}>
              <SectionHeader icon={<Notifications sx={{ fontSize: 18 }} />} title="Notification Preferences" />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {([
                  { key: 'emailNotifications' as const, icon: <MarkEmailRead sx={{ fontSize: 16 }} />, label: 'Email Notifications', desc: 'Trade updates, system alerts, and reports via email' },
                  { key: 'smsAlerts' as const, icon: <Sms sx={{ fontSize: 16 }} />, label: 'SMS Alerts', desc: 'Critical notifications and OTP via SMS' },
                  { key: 'reportDelivery' as const, icon: <Description sx={{ fontSize: 16 }} />, label: 'Report Delivery', desc: 'Scheduled reports delivered to your inbox' },
                  { key: 'platformAnnouncements' as const, icon: <Campaign sx={{ fontSize: 16 }} />, label: 'Platform Announcements', desc: 'New features, maintenance, and platform updates' },
                ]).map((item) => (
                  <Box
                    key={item.key}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid rgba(212,175,55,0.05)' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: '#555' }}>{item.icon}</Box>
                      <Box>
                        <Typography sx={{ fontSize: 12, color: '#e0e0e0' }}>{item.label}</Typography>
                        <Typography sx={{ fontSize: 10, color: '#555' }}>{item.desc}</Typography>
                      </Box>
                    </Box>
                    <Switch
                      size="small"
                      checked={notifications[item.key]}
                      onChange={() => handleNotificationToggle(item.key)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Card>

            {/* API Access */}
            <Card sx={{ p: 2.5 }}>
              <SectionHeader icon={<Api sx={{ fontSize: 18 }} />} title="API Access" />

              {/* API Key */}
              <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.5 }}>Personal API Key</Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.25,
                  borderRadius: 1,
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(212,175,55,0.1)',
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: 12, color: '#b0b0b0', fontFamily: 'monospace', flex: 1 }}>
                  {showApiKey ? MOCK_API_ACCESS.apiKey : maskedKey}
                </Typography>
                <Tooltip title={showApiKey ? 'Hide key' : 'Show key'}>
                  <IconButton size="small" onClick={() => setShowApiKey(!showApiKey)} sx={{ color: '#555' }}>
                    {showApiKey ? <VisibilityOff sx={{ fontSize: 14 }} /> : <Visibility sx={{ fontSize: 14 }} />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy to clipboard">
                  <IconButton size="small" sx={{ color: '#555' }}>
                    <ContentCopy sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Usage Stats */}
              <Typography sx={{ fontSize: 10, color: '#555', textTransform: 'uppercase', mb: 0.75 }}>Usage Today</Typography>
              <Box sx={{ mb: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0' }}>
                    <Box component="span" sx={{ fontFamily: "'Lora', serif", fontWeight: 700, color: '#D4AF37', fontSize: 16 }}>
                      {MOCK_API_ACCESS.requestsToday.toLocaleString()}
                    </Box>
                    {' '}/ {MOCK_API_ACCESS.requestsLimit.toLocaleString()} requests
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: '#555' }}>{apiUsagePercent.toFixed(1)}%</Typography>
                </Box>
                <Box
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: 'rgba(212,175,55,0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${apiUsagePercent}%`,
                      borderRadius: 2,
                      backgroundColor: apiUsagePercent > 80 ? '#EF4444' : '#D4AF37',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 10, color: '#555', mb: 2 }}>Last used: {MOCK_API_ACCESS.lastUsed}</Typography>

              {/* Regenerate Button */}
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh sx={{ fontSize: 14 }} />}
                sx={{
                  color: '#D4AF37',
                  borderColor: 'rgba(212,175,55,0.3)',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '50px',
                  fontSize: 12,
                  '&:hover': { borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.05)' },
                }}
              >
                Regenerate API Key
              </Button>
            </Card>

            {/* Theme Preference */}
            <Card sx={{ p: 2.5 }}>
              <SectionHeader icon={darkMode ? <DarkMode sx={{ fontSize: 18 }} /> : <LightMode sx={{ fontSize: 18 }} />} title="Theme Preference" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {darkMode ? <DarkMode sx={{ fontSize: 16, color: '#777' }} /> : <LightMode sx={{ fontSize: 16, color: '#E6A817' }} />}
                  <Box>
                    <Typography sx={{ fontSize: 12, color: '#e0e0e0' }}>{darkMode ? 'Dark Mode' : 'Light Mode'}</Typography>
                    <Typography sx={{ fontSize: 10, color: '#555' }}>
                      {darkMode ? 'Optimized for low-light environments' : 'Standard brightness theme'}
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' },
                  }}
                />
              </Box>
            </Card>

            {/* Modules Access */}
            <Card sx={{ p: 2.5 }}>
              <SectionHeader icon={<Security sx={{ fontSize: 18 }} />} title="Module Access" />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {(user?.modules || []).map((mod) => (
                  <Chip
                    key={mod}
                    label={mod.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    size="small"
                    sx={{
                      fontSize: 10,
                      height: 22,
                      color: '#D4AF37',
                      backgroundColor: 'rgba(212,175,55,0.06)',
                      border: '1px solid rgba(212,175,55,0.12)',
                    }}
                  />
                ))}
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
