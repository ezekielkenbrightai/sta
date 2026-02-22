import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/appStore';
import {
  COLORS,
  FOOTER_HEIGHT,
  HEADER_HEIGHT,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_WIDTH,
} from './layoutConstants';
import TopNavBar from './TopNavBar';
import SidebarContent from './SidebarContent';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const syncFromPath = useAppStore((s) => s.syncFromPath);

  // Auto-sync sidebar module when URL changes
  useEffect(() => {
    syncFromPath(location.pathname, user?.role);
  }, [location.pathname, user?.role, syncFromPath]);

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const userMenuOpen = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileDrawerOpen((prev) => !prev);
    } else {
      setDrawerOpen((prev) => !prev);
    }
  };

  const handleMobileNavClick = () => {
    if (isMobile) setMobileDrawerOpen(false);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate('/login');
  };

  const currentWidth = drawerOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH;
  const sidebarExpanded = isMobile ? true : drawerOpen;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.contentBg }}>
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              border: 'none',
              backgroundColor: COLORS.sidebarBg,
            },
          }}
        >
          <SidebarContent
            sidebarExpanded={sidebarExpanded}
            isMobile={isMobile}
            currentWidth={currentWidth}
            onDrawerToggle={handleDrawerToggle}
            onMobileNavClick={handleMobileNavClick}
          />
        </Drawer>
      ) : (
        <Box
          component="nav"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: currentWidth,
            zIndex: 1200,
            transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
          }}
        >
          <SidebarContent
            sidebarExpanded={sidebarExpanded}
            isMobile={isMobile}
            currentWidth={currentWidth}
            onDrawerToggle={handleDrawerToggle}
            onMobileNavClick={handleMobileNavClick}
          />
        </Box>
      )}

      {/* ── Header ──────────────────────────────────────────────────── */}
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: { xs: 0, md: currentWidth },
          right: 0,
          height: HEADER_HEIGHT,
          backgroundColor: COLORS.headerBg,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${COLORS.headerBorder}`,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 1.5, sm: 2, md: 3 },
          transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Left: Hamburger (mobile) + TopNavBar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 0.75 }, minWidth: 0, overflow: 'hidden' }}>
          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ color: '#f0f0f0', mr: 0.5 }}
              aria-label="open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          )}
          <TopNavBar />
        </Box>

        {/* Right: User */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexShrink: 0 }}>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ my: 1.5, borderColor: COLORS.headerBorder, display: { xs: 'none', sm: 'block' } }}
          />

          <Tooltip title={user?.email ?? 'User'} arrow>
            <Box
              onClick={handleUserMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                p: 0.5,
                borderRadius: '8px',
                '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.06)' },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: COLORS.accentGold,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#050505',
                }}
              >
                {(user?.first_name ?? user?.email ?? 'U').charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', lineHeight: 1.3 }}>
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.email}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#777', lineHeight: 1.2 }}>
                  {user?.role?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </Typography>
              </Box>
            </Box>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={userMenuOpen}
            onClose={handleUserMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: '8px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#f0f0f0' }}>
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.email}
              </Typography>
              <Typography variant="caption" sx={{ color: '#777', display: 'block' }}>
                {user?.email}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(212, 175, 55, 0.1)' }} />
            <MenuItem
              onClick={() => { handleUserMenuClose(); navigate('/profile'); }}
              sx={{ py: 1.25, px: 2, fontSize: 14, color: '#f0f0f0' }}
            >
              <ListItemIcon><PersonIcon sx={{ fontSize: 18, color: '#b0b0b0' }} /></ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(212, 175, 55, 0.1)' }} />
            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.25,
                px: 2,
                fontSize: 14,
                color: '#EF4444',
                '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' },
              }}
            >
              <LogoutIcon sx={{ fontSize: 18, mr: 1.5 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* ── Main Content + Footer ─────────────────────────────────────── */}
      <Box
        sx={{
          marginLeft: { xs: 0, md: `${currentWidth}px` },
          marginTop: `${HEADER_HEIGHT}px`,
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          backgroundColor: COLORS.contentBg,
          transition: 'margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          width: { xs: '100%', md: `calc(100% - ${currentWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 1.5, sm: 2, md: 3 },
            maxWidth: 1536,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Outlet />
        </Box>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <Box
          component="footer"
          sx={{
            minHeight: FOOTER_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: `1px solid ${COLORS.headerBorder}`,
            backgroundColor: COLORS.headerBg,
            px: { xs: 1.5, sm: 3 },
            py: 1,
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: { xs: 10, sm: 12 }, color: '#555', textAlign: 'center' }}>
            Smart Trade Africa — Digital trade across Africa, securely automated. Aligned with AfCFTA.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
