import { useState, useMemo, useCallback } from 'react';
import { Box, Typography, Paper, useMediaQuery, useTheme } from '@mui/material';
import { AFRICA_PATHS, AFRICA_VIEWBOX } from '../../../constants/africaMapPaths';
import { COUNTRIES } from '../data/countryMetadata';
import { BILATERAL_FLOWS, fmtB, getFlowsForCountry } from '../data/tradeData';
import TradeFlowArcs from './TradeFlowArcs';

interface Props {
  selectedCountry: string | null;
  onSelectCountry: (iso3: string | null) => void;
}

function getPartnerVolumes(iso3: string): Record<string, number> {
  const vols: Record<string, number> = {};
  for (const f of BILATERAL_FLOWS) {
    if (f.from === iso3) vols[f.to] = (vols[f.to] || 0) + f.value;
    if (f.to === iso3) vols[f.from] = (vols[f.from] || 0) + f.value;
  }
  return vols;
}

function getTotalExportsForCountry(iso3: string): number {
  return BILATERAL_FLOWS.filter(f => f.from === iso3).reduce((s, f) => s + f.value, 0);
}

export default function AfricaMap({ selectedCountry, onSelectCountry }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const partnerVols = useMemo(
    () => (selectedCountry ? getPartnerVolumes(selectedCountry) : {}),
    [selectedCountry],
  );
  const maxVol = useMemo(
    () => Math.max(1, ...Object.values(partnerVols)),
    [partnerVols],
  );

  const allFlows = useMemo(() => {
    if (!selectedCountry) return [];
    const { exports, imports } = getFlowsForCountry(selectedCountry);
    return [...exports, ...imports];
  }, [selectedCountry]);

  const getFill = useCallback(
    (iso3: string) => {
      if (iso3 === selectedCountry) return '#D4AF37';
      if (iso3 === hovered) return 'rgba(212, 175, 55, 0.30)';
      if (selectedCountry && partnerVols[iso3]) {
        const intensity = 0.12 + (partnerVols[iso3] / maxVol) * 0.38;
        return `rgba(212, 175, 55, ${intensity.toFixed(2)})`;
      }
      return 'rgba(212, 175, 55, 0.06)';
    },
    [selectedCountry, hovered, partnerVols, maxVol],
  );

  const handleClick = useCallback(
    (iso3: string) => {
      onSelectCountry(iso3 === selectedCountry ? null : iso3);
    },
    [selectedCountry, onSelectCountry],
  );

  const hoveredMeta = hovered ? COUNTRIES[hovered] : null;
  const hoveredExports = hovered ? getTotalExportsForCountry(hovered) : 0;

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={AFRICA_VIEWBOX}
        style={{ width: '100%', height: isMobile ? '55vh' : '70vh', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background glow for selected country */}
        {selectedCountry && COUNTRIES[selectedCountry] && (
          <circle
            cx={COUNTRIES[selectedCountry].centroid[0]}
            cy={COUNTRIES[selectedCountry].centroid[1]}
            r={20}
            fill="rgba(212, 175, 55, 0.08)"
          >
            <animate attributeName="r" values="15;25;15" dur="3s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Country paths */}
        {Object.entries(AFRICA_PATHS).map(([iso3, country]) => (
          <path
            key={iso3}
            d={country.path}
            fill={getFill(iso3)}
            stroke="rgba(212, 175, 55, 0.18)"
            strokeWidth={iso3 === selectedCountry ? 0.8 : 0.3}
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
            onClick={() => handleClick(iso3)}
            onMouseEnter={(e) => {
              setHovered(iso3);
              const svg = (e.target as SVGPathElement).ownerSVGElement;
              if (svg) {
                const pt = svg.createSVGPoint();
                pt.x = e.clientX;
                pt.y = e.clientY;
                const svgPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
                setTooltipPos({ x: svgPt.x, y: svgPt.y - 6 });
              }
            }}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* Trade flow arcs */}
        {selectedCountry && allFlows.length > 0 && (
          <TradeFlowArcs selectedIso3={selectedCountry} flows={allFlows} />
        )}

        {/* Hover tooltip (SVG foreignObject) */}
        {hoveredMeta && !isMobile && (
          <foreignObject
            x={tooltipPos.x - 40}
            y={tooltipPos.y - 22}
            width={100}
            height={38}
            style={{ pointerEvents: 'none', overflow: 'visible' }}
          >
            <Paper
              elevation={8}
              sx={{
                px: 1,
                py: 0.3,
                bgcolor: 'rgba(17,17,17,0.95)',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: 1,
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                backdropFilter: 'blur(12px)',
                whiteSpace: 'nowrap',
              }}
            >
              <Typography sx={{ fontSize: 9, fontWeight: 600, color: '#f0f0f0', lineHeight: 1.3 }}>
                {hoveredMeta.flag} {hoveredMeta.name}
              </Typography>
              {hoveredExports > 0 && (
                <Typography sx={{ fontSize: 8, color: '#D4AF37', lineHeight: 1.2 }}>
                  Exports: {fmtB(hoveredExports)}
                </Typography>
              )}
            </Paper>
          </foreignObject>
        )}
      </svg>

      {/* Legend */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          display: 'flex',
          gap: 1.5,
          flexWrap: 'wrap',
          opacity: 0.7,
        }}
      >
        {[
          { color: '#D4AF37', label: 'Selected' },
          { color: 'rgba(212,175,55,0.35)', label: 'Trade Partner' },
          { color: 'rgba(212,175,55,0.06)', label: 'No Data' },
        ].map((item) => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: item.color, border: '1px solid rgba(212,175,55,0.3)' }} />
            <Typography sx={{ fontSize: 10, color: '#b0b0b0' }}>{item.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
