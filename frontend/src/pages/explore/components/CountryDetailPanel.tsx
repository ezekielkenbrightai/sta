import { useMemo } from 'react';
import { Box, Typography, Chip, IconButton, LinearProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { COUNTRIES } from '../data/countryMetadata';
import { getTopPartners, getFlowsForCountry, fmtB } from '../data/tradeData';

interface Props {
  iso3: string;
  onClose: () => void;
}

export default function CountryDetailPanel({ iso3, onClose }: Props) {
  const country = COUNTRIES[iso3];

  const { exports, imports } = useMemo(() => getFlowsForCountry(iso3), [iso3]);
  const totalExports = useMemo(() => exports.reduce((s, f) => s + f.value, 0), [exports]);
  const totalImports = useMemo(() => imports.reduce((s, f) => s + f.value, 0), [imports]);
  const partners = useMemo(() => getTopPartners(iso3, 8), [iso3]);
  const maxPartnerVol = useMemo(() => Math.max(1, ...partners.map(p => p.total)), [partners]);

  // Collect unique products from top flows
  const topProducts = useMemo(() => {
    const allProducts = [...exports, ...imports]
      .sort((a, b) => b.value - a.value)
      .flatMap(f => f.products);
    return [...new Set(allProducts)].slice(0, 10);
  }, [exports, imports]);

  if (!country) return null;

  const balance = totalExports - totalImports;

  return (
    <Box
      sx={{
        bgcolor: 'rgba(17, 17, 17, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        borderRadius: 3,
        p: 2.5,
        height: '100%',
        overflowY: 'auto',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(212,175,55,0.2)', borderRadius: 2 },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: 32 }}>{country.flag}</Typography>
          <Box>
            <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '1.25rem', color: '#f0f0f0' }}>
              {country.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.3 }}>
              {country.recs.map(rec => (
                <Chip
                  key={rec}
                  label={rec}
                  size="small"
                  sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(212,175,55,0.12)', color: '#D4AF37', borderRadius: 1 }}
                />
              ))}
            </Box>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#b0b0b0' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Aggregate Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2.5 }}>
        <Box sx={{ bgcolor: 'rgba(212,175,55,0.06)', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 10, color: '#b0b0b0', textTransform: 'uppercase', letterSpacing: 1, mb: 0.3 }}>
            Exports to Africa
          </Typography>
          <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '1.3rem', color: '#D4AF37' }}>
            {fmtB(totalExports)}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: 'rgba(212,175,55,0.06)', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 10, color: '#b0b0b0', textTransform: 'uppercase', letterSpacing: 1, mb: 0.3 }}>
            Imports from Africa
          </Typography>
          <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '1.3rem', color: '#F0D060' }}>
            {fmtB(totalImports)}
          </Typography>
        </Box>
      </Box>

      {/* Trade Balance */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2.5, px: 1 }}>
        {balance >= 0 ? (
          <TrendingUpIcon sx={{ fontSize: 16, color: '#22C55E' }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 16, color: '#EF4444' }} />
        )}
        <Typography sx={{ fontSize: 12, color: balance >= 0 ? '#22C55E' : '#EF4444' }}>
          Trade {balance >= 0 ? 'surplus' : 'deficit'}: {fmtB(Math.abs(balance))}
        </Typography>
      </Box>

      {/* Top Trading Partners */}
      {partners.length > 0 && (
        <>
          <Typography sx={{ fontSize: 11, color: '#b0b0b0', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
            Top Trading Partners
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
            {partners.map((p) => {
              const meta = COUNTRIES[p.iso3];
              if (!meta) return null;
              return (
                <Box key={p.iso3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                    <Typography sx={{ fontSize: 12, color: '#f0f0f0' }}>
                      {meta.flag} {meta.name}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: '#D4AF37', fontWeight: 600 }}>
                      {fmtB(p.total)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, height: 4 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(p.exports / maxPartnerVol) * 100}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(212,175,55,0.08)',
                        '& .MuiLinearProgress-bar': { bgcolor: '#D4AF37', borderRadius: 2 },
                      }}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={(p.imports / maxPartnerVol) * 100}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(240,208,96,0.08)',
                        '& .MuiLinearProgress-bar': { bgcolor: '#F0D060', borderRadius: 2 },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.2 }}>
                    <Typography sx={{ fontSize: 9, color: '#b0b0b0' }}>Export {fmtB(p.exports)}</Typography>
                    <Typography sx={{ fontSize: 9, color: '#b0b0b0' }}>Import {fmtB(p.imports)}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Legend for bars */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 4, borderRadius: 2, bgcolor: '#D4AF37' }} />
              <Typography sx={{ fontSize: 9, color: '#b0b0b0' }}>Exports</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 4, borderRadius: 2, bgcolor: '#F0D060' }} />
              <Typography sx={{ fontSize: 9, color: '#b0b0b0' }}>Imports</Typography>
            </Box>
          </Box>
        </>
      )}

      {/* Top Products */}
      {topProducts.length > 0 && (
        <>
          <Typography sx={{ fontSize: 11, color: '#b0b0b0', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
            Key Trade Products
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {topProducts.map(p => (
              <Chip
                key={p}
                label={p}
                size="small"
                sx={{
                  height: 22,
                  fontSize: 10,
                  bgcolor: 'rgba(212,175,55,0.08)',
                  color: '#f0f0f0',
                  border: '1px solid rgba(212,175,55,0.12)',
                }}
              />
            ))}
          </Box>
        </>
      )}

      {/* No data state */}
      {partners.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ fontSize: 13, color: '#b0b0b0' }}>
            No bilateral trade data available for {country.name}.
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#666', mt: 0.5 }}>
            Data covers major trading pairs only.
          </Typography>
        </Box>
      )}

      {/* Data source attribution */}
      <Typography sx={{ fontSize: 9, color: '#555', mt: 2, textAlign: 'center' }}>
        Source: UN COMTRADE / Afreximbank (2023-2024)
      </Typography>
    </Box>
  );
}
