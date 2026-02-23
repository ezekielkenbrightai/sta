# STA Project Memory — Learnings & Decisions

> Living document tracking project decisions, patterns discovered, and technical learnings.
> Referenced from [`CLAUDE.md`](CLAUDE.md) for persistent context across sessions.

---

## Session: Feb 2026 — Intra-African Trade Explorer (`/explore`)

### What Was Built
Interactive public-facing page at `/explore` showcasing real intra-African trade data. Users click any of 54 African countries on an SVG map to see bilateral trade flows (exports, imports, top partners, products, corridors). Built entirely with existing dependencies (React, MUI, Recharts) — zero new npm packages added.

### Data Research
- **Research document**: [`docs/intra-african-trade-data.md`](docs/intra-african-trade-data.md)
- **Primary sources**: UN COMTRADE Database, Afreximbank African Trade Reports (2024 & 2025), Trade Map (ITC), WITS
- **Key findings**:
  - Intra-African trade reached $220.3B in 2024 (14.4% of total African trade)
  - South Africa dominates with $31.1B in intra-African exports (26.8% share)
  - SADC is the largest REC by trade volume ($55.6B)
  - Manufactured goods are 45% of intra-African trade (higher than global African export mix)
  - AfCFTA expected to boost intra-African trade by $450B
  - Trade finance gap of ~$100B annually remains a bottleneck

### Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Inline SVG map (no Leaflet/Mapbox/D3) | Zero new deps, native React state integration, small bundle (~17 kB gzipped) |
| SVG paths from flekschas/simple-world-map | MIT licensed, Natural Earth 110m simplified — good balance of detail vs file size |
| Quadratic bezier arcs for trade flows | Aesthetically pleasing curves, perpendicular control point offset prevents overlap |
| SVG `<animate>` for flowing effect | No JS animation library needed — pure SVG + CSS, 60fps on all browsers |
| Recharts (already installed) for charts | Consistent with rest of app, no new dependency |
| Public route outside AppLayout | No auth required, no sidebar/header — standalone landing experience |
| Data embedded in TypeScript files | Avoids API calls for static data, enables tree-shaking, instant load |
| IntersectionObserver for scroll-reveal | Native browser API, no animation library needed |

### Bugs Found & Fixed

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Recharts tooltip text invisible on dark bg | Default Tooltip text color is black; `contentStyle` only styles the container, not text | Add `itemStyle={{ color: '#f0f0f0' }}` and `labelStyle={{ color: '#D4AF37' }}` |
| Demo account chips missing in local dev | Worktree lacked `.env` file; Vite reads `.env` for dev, `.env.production` for build | Created `frontend/.env` with `VITE_MOCK_AUTH=true` |

### Patterns Established

1. **SVG Map Component Pattern**
   - Store path data in `constants/` (separate from component logic)
   - Store metadata (names, centroids, flags) in `data/` layer
   - Component handles click/hover/tooltip state
   - Color intensity proportional to trade volume for partner highlighting

2. **Scroll-Reveal Pattern**
   ```tsx
   function useReveal() {
     const ref = useRef<HTMLDivElement>(null);
     const [visible, setVisible] = useState(false);
     useEffect(() => {
       const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
       if (ref.current) obs.observe(ref.current);
       return () => obs.disconnect();
     }, []);
     return { ref, visible };
   }
   ```

3. **Glassmorphic Card Pattern** (consistent across explore page)
   ```tsx
   sx={{
     bgcolor: 'rgba(17, 17, 17, 0.75)',
     backdropFilter: 'blur(20px)',
     border: '1px solid rgba(212, 175, 55, 0.12)',
     borderRadius: 3,
     p: { xs: 2, md: 3 },
   }}
   ```

### File Inventory (Explore Feature)

```
frontend/src/
├── constants/
│   └── africaMapPaths.ts            # 54 SVG country paths (405 lines)
├── pages/explore/
│   ├── TradeExplorerPage.tsx         # Main page assembly (~500 lines)
│   ├── components/
│   │   ├── AfricaMap.tsx             # Interactive SVG map
│   │   ├── TradeFlowArcs.tsx         # Animated bezier trade arcs
│   │   ├── CountryDetailPanel.tsx    # Selected country detail panel
│   │   ├── TradeGrowthChart.tsx      # Area chart (2016-2024 trend)
│   │   ├── TopExportersChart.tsx     # Horizontal bar chart (top 10)
│   │   └── StatCard.tsx              # Reusable KPI card
│   └── data/
│       ├── countryMetadata.ts        # 54 countries: ISO codes, flags, centroids, RECs
│       └── tradeData.ts             # Bilateral flows, trends, exporters, RECs, products
docs/
└── intra-african-trade-data.md      # Research: all sources, URLs, raw data tables
```

### Performance Notes
- Lazy-loaded chunk: 53.93 kB / 17.30 kB gzipped (map paths + data + components)
- SVG animations run at 60fps (no requestAnimationFrame needed)
- IntersectionObserver triggers once per element (no re-render on scroll)
- No API calls — all data statically embedded

---

## General Project Learnings

### Recharts Tips
- Never add explicit type annotations to formatter callbacks — Recharts types include `undefined` in the union
- Always style Tooltip text for dark themes: `itemStyle`, `labelStyle`, and `contentStyle` are all separate
- Use `layout="vertical"` for horizontal bar charts with long category labels

### MUI / Styling Tips
- Use `sx` prop exclusively (no Tailwind) — project convention
- Glassmorphic effect: `backdropFilter: 'blur(20px)'` + semi-transparent bg + gold border
- Responsive breakpoints: `{ xs: value, md: value }` for mobile-first

### TypeScript Strict Mode (`tsc -b`)
- Catches unused variables that `tsc --noEmit` misses
- Prefix intentionally unused params with `_` (e.g., `_entry`, `_name`)
- Always run `npm run build` locally before pushing

### Git Workflow (with worktrees)
- Worktrees need their own `.env` files (gitignored files aren't shared between worktrees)
- Always verify `.env` exists in worktree for local dev features to work
