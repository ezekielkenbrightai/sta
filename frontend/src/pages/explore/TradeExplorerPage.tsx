import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Button, Grid, LinearProgress, Chip, useMediaQuery, useTheme,
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RouteIcon from '@mui/icons-material/Route';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';
import AfricaMap from './components/AfricaMap';
import CountryDetailPanel from './components/CountryDetailPanel';
import TradeGrowthChart from './components/TradeGrowthChart';
import TopExportersChart from './components/TopExportersChart';
import StatCard from './components/StatCard';
import { RECS, PRODUCT_CATEGORIES, TRADE_CORRIDORS } from './data/tradeData';
import { COUNTRIES } from './data/countryMetadata';

/* ─── Scroll-reveal hook ──────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealBox({ children, delay = 0, ...rest }: { children: React.ReactNode; delay?: number } & Record<string, unknown>) {
  const { ref, visible } = useReveal();
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ${delay}s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.6s ${delay}s cubic-bezier(0.25,0.46,0.45,0.94)`,
        ...((rest as { sx?: object }).sx || {}),
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function TradeExplorerPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSelectCountry = useCallback((iso3: string | null) => {
    setSelectedCountry(iso3);
  }, []);

  return (
    <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh', color: '#f0f0f0', overflow: 'hidden' }}>

      {/* ─── Fixed Nav ─────────────────────────────────────── */}
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          px: { xs: 2, md: 4 },
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
          borderBottom: scrolled ? '1px solid rgba(212,175,55,0.1)' : '1px solid transparent',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'linear-gradient(135deg, #D4AF37, #B8962E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PublicIcon sx={{ fontSize: 18, color: '#0a0a0a' }} />
          </Box>
          <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '1.1rem', color: '#f0f0f0' }}>
            Smart Trade Africa
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate('/login')}
          sx={{
            borderRadius: 50,
            px: 2.5,
            fontWeight: 600,
            textTransform: 'none',
            bgcolor: scrolled ? '#D4AF37' : 'rgba(212,175,55,0.15)',
            color: scrolled ? '#0a0a0a' : '#D4AF37',
            border: scrolled ? 'none' : '1px solid rgba(212,175,55,0.3)',
            '&:hover': { bgcolor: '#D4AF37', color: '#0a0a0a' },
          }}
        >
          Sign In
        </Button>
      </Box>

      {/* ─── Hero ──────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 14, md: 16 },
          pb: { xs: 4, md: 6 },
          px: { xs: 2, md: 6 },
          background: 'linear-gradient(170deg, #000000 0%, #0a0a0a 40%, #111111 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Floating orbs */}
        {[
          { top: '10%', left: '15%', size: 300, color: 'rgba(212,175,55,0.08)', dur: '20s' },
          { top: '60%', right: '10%', size: 200, color: 'rgba(184,150,46,0.06)', dur: '25s' },
          { top: '30%', right: '30%', size: 250, color: 'rgba(240,208,96,0.05)', dur: '22s' },
        ].map((orb, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              top: orb.top,
              left: orb.left,
              right: orb.right,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: orb.color,
              filter: 'blur(80px)',
              pointerEvents: 'none',
              animation: `float${i} ${orb.dur} ease-in-out infinite`,
              '@keyframes float0': { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(20px,-30px) scale(1.1)' } },
              '@keyframes float1': { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(-25px,20px) scale(0.95)' } },
              '@keyframes float2': { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(15px,25px) scale(1.05)' } },
            }}
          />
        ))}

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
          {/* Badge */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 50, px: 2, py: 0.5, mb: 3 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#22C55E', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
            <Typography sx={{ fontSize: 12, color: '#D4AF37', fontWeight: 500 }}>
              Live Data from UN COMTRADE, Trade Map &amp; WITS
            </Typography>
          </Box>

          <Typography
            component="h1"
            sx={{
              fontFamily: "'Lora', serif",
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            Explore{' '}
            <Box component="span" sx={{ color: '#D4AF37', fontStyle: 'italic' }}>
              Intra-African
            </Box>{' '}
            Trade
          </Typography>

          <Typography sx={{ fontSize: { xs: 14, md: 16 }, color: '#b0b0b0', maxWidth: 650, mx: 'auto', mb: 4, lineHeight: 1.6 }}>
            Interactive visualization of trade flows between African nations.
            Click any country to explore bilateral exports, imports, top products,
            and trade corridors — powered by real data.
          </Typography>

          {/* Stat cards */}
          <Grid container spacing={2} sx={{ maxWidth: 800, mx: 'auto' }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Total Intra-African Trade" value="$220.3B" sub="+14.6% YoY" icon={<PublicIcon />} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Year-over-Year Growth" value="+14.6%" sub="2024 vs 2023" icon={<TrendingUpIcon />} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Trade Corridors" value="50+" sub="Active pairs" icon={<RouteIcon />} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Regional Blocs" value="7 RECs" sub="Driving integration" icon={<GroupsIcon />} />
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* ─── Map + Detail Panel ────────────────────────────── */}
      <Box sx={{ px: { xs: 1, md: 4 }, py: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
        <RevealBox>
          <Typography
            sx={{
              fontFamily: "'Lora', serif",
              fontWeight: 700,
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              textAlign: 'center',
              mb: 1,
            }}
          >
            Click any country to explore its trade
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#b0b0b0', textAlign: 'center', mb: 3 }}>
            Select a nation to see bilateral trade flows, top partners, and key products
          </Typography>
        </RevealBox>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: selectedCountry ? 7 : 12 }}>
            <AfricaMap selectedCountry={selectedCountry} onSelectCountry={handleSelectCountry} />
          </Grid>
          {selectedCountry && (
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ height: isMobile ? 'auto' : '70vh' }}>
                <CountryDetailPanel iso3={selectedCountry} onClose={() => setSelectedCountry(null)} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* ─── Trade Growth Chart ────────────────────────────── */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 }, maxWidth: 1200, mx: 'auto' }}>
        <RevealBox>
          <TradeGrowthChart />
        </RevealBox>
      </Box>

      {/* ─── Top Exporters + REC Breakdown ─────────────────── */}
      <Box sx={{ px: { xs: 2, md: 4 }, pb: { xs: 3, md: 5 }, maxWidth: 1200, mx: 'auto' }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <RevealBox>
              <TopExportersChart />
            </RevealBox>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <RevealBox delay={0.1}>
              <Box
                sx={{
                  bgcolor: 'rgba(17, 17, 17, 0.75)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.12)',
                  borderRadius: 3,
                  p: { xs: 2, md: 3 },
                  height: '100%',
                }}
              >
                <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '1.15rem', color: '#f0f0f0', mb: 0.5 }}>
                  Regional Economic Communities
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#b0b0b0', mb: 2 }}>
                  Intra-REC trade volumes (2023, USD billions)
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {RECS.map(rec => (
                    <Box key={rec.name}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: rec.color }} />
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>
                            {rec.name}
                          </Typography>
                          <Typography sx={{ fontSize: 10, color: '#666' }}>
                            {rec.members} members
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: rec.color }}>
                          ${rec.tradeBillion}B
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(rec.tradeBillion / 55.6) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.04)',
                          '& .MuiLinearProgress-bar': { bgcolor: rec.color, borderRadius: 3 },
                        }}
                      />
                      <Typography sx={{ fontSize: 10, color: '#666', mt: 0.3 }}>
                        Top corridor: {rec.topCorridor}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </RevealBox>
          </Grid>
        </Grid>
      </Box>

      {/* ─── Product Categories + Corridors ────────────────── */}
      <Box sx={{ px: { xs: 2, md: 4 }, pb: { xs: 3, md: 5 }, maxWidth: 1200, mx: 'auto' }}>
        <Grid container spacing={3}>
          {/* Product Categories */}
          <Grid size={{ xs: 12, md: 5 }}>
            <RevealBox>
              <Box
                sx={{
                  bgcolor: 'rgba(17, 17, 17, 0.75)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.12)',
                  borderRadius: 3,
                  p: { xs: 2, md: 3 },
                  height: '100%',
                }}
              >
                <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '1.15rem', color: '#f0f0f0', mb: 0.5 }}>
                  What Africa Trades
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#b0b0b0', mb: 2 }}>
                  Intra-African trade by product category
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {PRODUCT_CATEGORIES.map(cat => (
                    <Box key={cat.name}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography sx={{ fontSize: 12, color: '#f0f0f0' }}>
                          {cat.icon} {cat.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: cat.color }}>
                          {cat.share}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={cat.share}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(255,255,255,0.04)',
                          '& .MuiLinearProgress-bar': { bgcolor: cat.color, borderRadius: 4 },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </RevealBox>
          </Grid>

          {/* Trade Corridors */}
          <Grid size={{ xs: 12, md: 7 }}>
            <RevealBox delay={0.1}>
              <Box
                sx={{
                  bgcolor: 'rgba(17, 17, 17, 0.75)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.12)',
                  borderRadius: 3,
                  p: { xs: 2, md: 3 },
                  height: '100%',
                }}
              >
                <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '1.15rem', color: '#f0f0f0', mb: 0.5 }}>
                  Major Trade Corridors
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#b0b0b0', mb: 2 }}>
                  Key transportation routes driving intra-African commerce
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {TRADE_CORRIDORS.map(c => (
                    <Box
                      key={c.name}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'rgba(212,175,55,0.04)',
                        border: '1px solid rgba(212,175,55,0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        '&:hover': {
                          bgcolor: 'rgba(212,175,55,0.08)',
                          borderColor: 'rgba(212,175,55,0.2)',
                        },
                      }}
                      onClick={() => {
                        setSelectedCountry(c.from);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>
                          {c.name}
                        </Typography>
                        <Chip
                          label={c.mode}
                          size="small"
                          sx={{ height: 18, fontSize: 9, bgcolor: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
                        />
                      </Box>
                      <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>
                        {COUNTRIES[c.from]?.flag} {COUNTRIES[c.from]?.name} {'\u2192'} {COUNTRIES[c.to]?.flag} {COUNTRIES[c.to]?.name}
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: '#666', mt: 0.3 }}>
                        {c.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </RevealBox>
          </Grid>
        </Grid>
      </Box>

      {/* ─── CTA / Footer ──────────────────────────────────── */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 5, md: 8 },
          px: 2,
          background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
          borderTop: '1px solid rgba(212,175,55,0.08)',
        }}
      >
        <RevealBox>
          <Typography
            sx={{
              fontFamily: "'Lora', serif",
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: 1.5,
            }}
          >
            Access the Full{' '}
            <Box component="span" sx={{ color: '#D4AF37' }}>
              Smart Trade Africa
            </Box>{' '}
            Platform
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#b0b0b0', maxWidth: 500, mx: 'auto', mb: 3 }}>
            Manage trade documents, tax assessments, payments, supply chain logistics,
            and customs clearance — all in one integrated platform.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: 50,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: 15,
              textTransform: 'none',
              bgcolor: '#D4AF37',
              color: '#0a0a0a',
              '&:hover': { bgcolor: '#F0D060' },
            }}
          >
            Get Started
          </Button>

          {/* AfCFTA badge */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, opacity: 0.5 }}>
            <PublicIcon sx={{ fontSize: 14, color: '#D4AF37' }} />
            <Typography sx={{ fontSize: 11, color: '#b0b0b0' }}>
              Aligned with the African Continental Free Trade Area (AfCFTA)
            </Typography>
          </Box>
        </RevealBox>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 3, px: 2, bgcolor: '#050505', textAlign: 'center', borderTop: '1px solid rgba(212,175,55,0.05)' }}>
        <Typography sx={{ fontSize: 11, color: '#555' }}>
          Data sources: UN COMTRADE Database, Trade Map (ITC), World Integrated Trade Solution (WITS), Afreximbank
        </Typography>
        <Typography sx={{ fontSize: 10, color: '#444', mt: 0.5 }}>
          {'\u00A9'} {new Date().getFullYear()} Smart Trade Africa. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
