/**
 * TopNavBar — Context switcher in the header.
 *
 * Renders module selector + country badge for appropriate roles.
 * Admin users see their admin badge instead.
 */
import {
  Box,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  Check as CheckIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/appStore';
import { COLORS, MODULES, MODULE_MAP, ROLE_MODULES } from './layoutConstants';

const SELECT_SX = {
  '& .MuiSelect-select': {
    py: 0.75,
    px: 1.5,
    fontSize: { xs: 12, sm: 13 },
    fontWeight: 600,
    color: '#f0f0f0',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: '10px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: COLORS.accentGold,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: COLORS.accentGold,
    borderWidth: 2,
  },
  backgroundColor: 'rgba(212, 175, 55, 0.06)',
} as const;

function Separator() {
  return (
    <ChevronRightIcon
      sx={{ fontSize: 18, color: '#555', mx: { xs: 0.25, sm: 0.5 }, flexShrink: 0 }}
    />
  );
}

// ─── Module Selector ────────────────────────────────────────────────

function ModuleSelector() {
  const user = useAuthStore((s) => s.user);
  const selectedModule = useAppStore((s) => s.selectedModule);
  const setSelectedModule = useAppStore((s) => s.setSelectedModule);
  const navigate = useNavigate();

  if (!user) return null;

  const userModules = ROLE_MODULES[user.role] || [];
  const available = MODULES.filter((m) => userModules.includes(m.id));

  const handleChange = (e: SelectChangeEvent<string>) => {
    const newModule = e.target.value;
    if (newModule === selectedModule) return;
    setSelectedModule(newModule);
    const def = MODULE_MAP[newModule];
    if (def) navigate(def.defaultRoute);
  };

  if (available.length <= 1) {
    const current = MODULE_MAP[selectedModule] || MODULES[0];
    return (
      <Box
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: 0.75,
          borderRadius: '10px',
          backgroundColor: 'rgba(212, 175, 55, 0.06)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        <Typography noWrap sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 600, color: '#f0f0f0' }}>
          {current.label}
        </Typography>
      </Box>
    );
  }

  return (
    <Select
      value={selectedModule}
      onChange={handleChange}
      size="small"
      variant="outlined"
      sx={{ ...SELECT_SX, minWidth: { xs: 120, sm: 170 }, maxWidth: { xs: 180, sm: 260 } }}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(212, 175, 55, 0.15)',
          },
        },
      }}
      renderValue={(selected) => {
        const label = MODULE_MAP[selected]?.label ?? selected;
        return (
          <Typography noWrap sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>
            {label}
          </Typography>
        );
      }}
    >
      {available.map((m) => (
        <MenuItem
          key={m.id}
          value={m.id}
          sx={{
            fontSize: 13,
            fontWeight: m.id === selectedModule ? 700 : 400,
            color: m.id === selectedModule ? COLORS.accentGold : '#f0f0f0',
            backgroundColor: m.id === selectedModule ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.06)' },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: m.id === selectedModule ? 700 : 400 }}>
              {m.label}
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#777' }}>{m.description}</Typography>
          </Box>
          {m.id === selectedModule && (
            <CheckIcon sx={{ fontSize: 16, ml: 1, color: COLORS.accentGold }} />
          )}
        </MenuItem>
      ))}
    </Select>
  );
}

// ─── Country Badge ──────────────────────────────────────────────────

function CountryBadge() {
  const user = useAuthStore((s) => s.user);
  if (!user?.country_name) return null;

  return (
    <Box
      sx={{
        display: { xs: 'none', sm: 'flex' },
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 0.75,
        borderRadius: '10px',
        backgroundColor: 'rgba(212, 175, 55, 0.06)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}
    >
      {user.country_flag_emoji && (
        <Typography sx={{ fontSize: 20, lineHeight: 1 }}>{user.country_flag_emoji}</Typography>
      )}
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>
        {user.country_name}
      </Typography>
    </Box>
  );
}

// ─── Admin Badge ────────────────────────────────────────────────────

function AdminBadge() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  if (user.role === 'super_admin') {
    return (
      <Box
        sx={{
          px: 2,
          py: 0.75,
          borderRadius: '20px',
          fontSize: 13,
          fontWeight: 600,
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          color: COLORS.accentGold,
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        Platform Administration
      </Box>
    );
  }

  if (user.role === 'govt_admin' && user.country_name) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 0.75,
          borderRadius: '12px',
          background: 'rgba(212, 175, 55, 0.06)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        {user.country_flag_emoji && (
          <Typography sx={{ fontSize: 28, lineHeight: 1 }}>{user.country_flag_emoji}</Typography>
        )}
        <Box>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#f0f0f0', lineHeight: 1.2 }}>
            {user.country_name}
          </Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: COLORS.accentGold, letterSpacing: '0.03em' }}>
            Government Administration
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
}

// ─── Main Export ─────────────────────────────────────────────────────

export default function TopNavBar() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  const isAdmin = user.role === 'super_admin' || user.role === 'govt_admin';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 0.25, sm: 0.5 },
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {isAdmin ? <AdminBadge /> : <CountryBadge />}
      <Separator />
      <ModuleSelector />
    </Box>
  );
}
