import { COUNTRIES } from '../data/countryMetadata';
import type { BilateralFlow } from '../data/tradeData';

interface Props {
  selectedIso3: string;
  flows: BilateralFlow[];
}

export default function TradeFlowArcs({ selectedIso3, flows }: Props) {
  const origin = COUNTRIES[selectedIso3]?.centroid;
  if (!origin) return null;

  return (
    <g>
      {flows.map((flow, i) => {
        const partnerIso3 = flow.from === selectedIso3 ? flow.to : flow.from;
        const dest = COUNTRIES[partnerIso3]?.centroid;
        if (!dest) return null;

        const dx = dest[0] - origin[0];
        const dy = dest[1] - origin[1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) return null;

        // Control point perpendicular to midpoint for a nice arc
        const midX = (origin[0] + dest[0]) / 2;
        const midY = (origin[1] + dest[1]) / 2;
        const offset = Math.min(dist * 0.25, 30);
        const cpX = midX - (dy / dist) * offset;
        const cpY = midY + (dx / dist) * offset;

        const pathD = `M${origin[0]},${origin[1]} Q${cpX},${cpY} ${dest[0]},${dest[1]}`;
        const sw = Math.max(0.4, Math.min(2.5, flow.value / 2_000_000_000));
        const isExport = flow.from === selectedIso3;

        return (
          <path
            key={`${flow.from}-${flow.to}-${i}`}
            d={pathD}
            fill="none"
            stroke={isExport ? '#D4AF37' : '#F0D060'}
            strokeWidth={sw}
            strokeOpacity={0.7}
            strokeDasharray="4 2"
            strokeLinecap="round"
          >
            <animate
              attributeName="stroke-dashoffset"
              from={isExport ? '12' : '0'}
              to={isExport ? '0' : '12'}
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        );
      })}

      {/* Dot at each partner centroid */}
      {flows.map((flow, i) => {
        const partnerIso3 = flow.from === selectedIso3 ? flow.to : flow.from;
        const dest = COUNTRIES[partnerIso3]?.centroid;
        if (!dest) return null;
        return (
          <circle
            key={`dot-${partnerIso3}-${i}`}
            cx={dest[0]}
            cy={dest[1]}
            r={1.8}
            fill="#D4AF37"
            fillOpacity={0.9}
          >
            <animate attributeName="r" values="1.2;2.2;1.2" dur="2s" repeatCount="indefinite" />
          </circle>
        );
      })}

      {/* Origin pulsing dot */}
      <circle cx={origin[0]} cy={origin[1]} r={2.5} fill="#D4AF37">
        <animate attributeName="r" values="2;3.5;2" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="fillOpacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}
