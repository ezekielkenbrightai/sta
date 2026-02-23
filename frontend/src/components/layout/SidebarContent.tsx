import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
  // Navigation icons — all used by name in layoutConstants
  Dashboard,
  Description,
  NoteAdd,
  VerifiedUser,
  Category,
  SwapHoriz,
  People,
  PersonAdd,
  Assignment,
  Payment,
  BarChart,
  Percent,
  RemoveCircle,
  Public,
  Send,
  History,
  CompareArrows,
  CurrencyExchange,
  AttachMoney,
  AccountBalance,
  RequestQuote,
  CreditScore,
  Security,
  MenuBook,
  AccountTree,
  Balance,
  Fingerprint,
  LocalShipping,
  Warehouse,
  Inventory,
  Hub,
  Route,
  DeliveryDining,
  Queue,
  Search,
  Anchor,
  Policy,
  ReportProblem,
  Calculate,
  TrendingUp,
  MultipleStop,
  Gavel,
  PersonSearch,
  Assessment,
  Schedule,
  FileDownload,
  ShowChart,
  Flag,
  Business,
  Group,
  Speed,
  ToggleOn,
  Extension,
  WorkHistory,
  Discount,
  Receipt,
  Token,
  Handshake,
  ManageSearch,
  GppBad,
  FactCheck,
  Verified,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/appStore';
import {
  COLORS,
  SIDEBAR_WIDTH,
  MODULE_NAV,
  ROLE_MODULES,
  type NavSection,
} from './layoutConstants';

// Map icon names to components
const ICON_MAP: Record<string, React.ElementType> = {
  Dashboard, Description, NoteAdd, VerifiedUser, Category, SwapHoriz,
  People, PersonAdd, Assignment, Payment, BarChart, Percent, RemoveCircle,
  Public, Send, History, CompareArrows, CurrencyExchange, AttachMoney,
  AccountBalance, RequestQuote, CreditScore, Security, MenuBook, AccountTree,
  Balance, Fingerprint, LocalShipping, Warehouse, Inventory, Hub, Route,
  DeliveryDining, Queue, Search, Anchor, Policy, ReportProblem, Calculate,
  TrendingUp, MultipleStop, Gavel, PersonSearch, Assessment, Schedule,
  FileDownload, ShowChart, Flag, Business, Group, Speed, ToggleOn,
  Extension, WorkHistory, Discount, Receipt, Token, Handshake,
  ManageSearch, GppBad, FactCheck, Verified,
};

interface SidebarContentProps {
  sidebarExpanded: boolean;
  isMobile: boolean;
  currentWidth: number;
  onDrawerToggle: () => void;
  onMobileNavClick: () => void;
}

export default function SidebarContent({
  sidebarExpanded,
  isMobile,
  currentWidth,
  onDrawerToggle,
  onMobileNavClick,
}: SidebarContentProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const selectedModule = useAppStore((s) => s.selectedModule);

  // Track collapsed/expanded sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const userRole = user?.role || 'trader';
  void ROLE_MODULES[userRole];
  const navSections: NavSection[] = MODULE_NAV[selectedModule] || [];

  // Filter nav items by role
  const filteredSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.roles || item.roles.includes(userRole),
      ),
    }))
    .filter((section) => section.items.length > 0);

  const handleNavClick = (to: string) => {
    navigate(to);
    onMobileNavClick();
  };

  return (
    <Box
      sx={{
        width: isMobile ? SIDEBAR_WIDTH : currentWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.sidebarBg,
        borderRight: `1px solid ${COLORS.sidebarBorder}`,
        overflow: 'hidden',
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* ── Logo / Brand ────────────────────────────────────────────── */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarExpanded ? 'space-between' : 'center',
          px: sidebarExpanded ? 2.5 : 0,
          borderBottom: `1px solid ${COLORS.sidebarBorder}`,
          flexShrink: 0,
        }}
      >
        {sidebarExpanded && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #D4AF37, #B8962E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 800,
                color: '#050505',
                fontFamily: "'Lora', serif",
              }}
            >
              ST
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#f0f0f0',
                  lineHeight: 1.2,
                  fontFamily: "'Lora', serif",
                }}
              >
                Smart Trade Africa
              </Typography>
              <Typography
                sx={{ fontSize: 10, color: COLORS.accentGold, letterSpacing: '0.05em' }}
              >
                Digital Trade Platform
              </Typography>
            </Box>
          </Box>
        )}

        {!isMobile && (
          <IconButton
            onClick={onDrawerToggle}
            size="small"
            sx={{ color: COLORS.navText, '&:hover': { color: COLORS.navTextHover } }}
          >
            {sidebarExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </Box>

      {/* ── Module indicator ────────────────────────────────────────── */}
      {sidebarExpanded && (
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${COLORS.sidebarBorder}` }}>
          <Typography sx={{ fontSize: 10, fontWeight: 600, color: COLORS.sectionHeader, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Module
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.accentGold, mt: 0.25 }}>
            {(selectedModule || 'trade').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </Typography>
        </Box>
      )}

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
        {filteredSections.map((section) => {
          const isOpen = openSections[section.label] !== false; // default open

          return (
            <Box key={section.label} sx={{ mb: 0.5 }}>
              {/* Section header */}
              {sidebarExpanded && section.collapsible ? (
                <ListItemButton
                  onClick={() => toggleSection(section.label)}
                  sx={{
                    py: 0.5,
                    px: 2.5,
                    minHeight: 32,
                    '&:hover': { backgroundColor: 'transparent' },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: COLORS.sectionHeader,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      flex: 1,
                    }}
                  >
                    {section.label}
                  </Typography>
                  {isOpen ? (
                    <ExpandLess sx={{ fontSize: 16, color: COLORS.sectionHeader }} />
                  ) : (
                    <ExpandMore sx={{ fontSize: 16, color: COLORS.sectionHeader }} />
                  )}
                </ListItemButton>
              ) : sidebarExpanded ? (
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: COLORS.sectionHeader,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    px: 2.5,
                    py: 0.5,
                  }}
                >
                  {section.label}
                </Typography>
              ) : null}

              {/* Nav items */}
              <Collapse in={!section.collapsible || isOpen} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.to;
                    const IconComponent = ICON_MAP[item.icon] || Dashboard;

                    const button = (
                      <ListItemButton
                        key={item.to}
                        onClick={() => handleNavClick(item.to)}
                        sx={{
                          py: 0.75,
                          px: sidebarExpanded ? 2.5 : 0,
                          mx: sidebarExpanded ? 1 : 0.5,
                          borderRadius: sidebarExpanded ? '8px' : '8px',
                          justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                          backgroundColor: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                          '&:hover': {
                            backgroundColor: isActive
                              ? 'rgba(212, 175, 55, 0.15)'
                              : COLORS.sidebarHoverBg,
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: sidebarExpanded ? 36 : 'auto',
                            color: isActive ? COLORS.navTextActive : COLORS.navText,
                          }}
                        >
                          <IconComponent sx={{ fontSize: 20 }} />
                        </ListItemIcon>
                        {sidebarExpanded && (
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                              fontSize: 13,
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? COLORS.navTextActive : COLORS.navText,
                            }}
                          />
                        )}
                      </ListItemButton>
                    );

                    if (!sidebarExpanded) {
                      return (
                        <Tooltip key={item.to} title={item.label} placement="right" arrow>
                          {button}
                        </Tooltip>
                      );
                    }

                    return button;
                  })}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </Box>

      {/* ── User role indicator (bottom) ────────────────────────────── */}
      {sidebarExpanded && user && (
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderTop: `1px solid ${COLORS.sidebarBorder}`,
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: 11, color: COLORS.sectionHeader }}>
            {user.organization_name || 'Smart Trade Africa'}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.accentGold }}>
            {(user.role || 'trader').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
