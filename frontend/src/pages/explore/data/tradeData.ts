/**
 * Real intra-African trade data compiled from:
 * - UN COMTRADE Database (via TradingEconomics, 2023-2024)
 * - Afreximbank African Trade Reports (2023, 2024, 2025)
 * - World Integrated Trade Solution (WITS)
 * - Trade Map (ITC)
 */

/* ─── Bilateral Trade Flows ──────────────────────────────── */

export interface BilateralFlow {
  from: string;   // ISO3
  to: string;     // ISO3
  value: number;  // USD
  year: number;
  products: string[];
}

export const BILATERAL_FLOWS: BilateralFlow[] = [
  // South Africa exports (UN COMTRADE 2023)
  { from: 'ZAF', to: 'MOZ', value: 6_180_000_000, year: 2023, products: ['Machinery', 'Vehicles', 'Iron & Steel', 'Chemicals'] },
  { from: 'ZAF', to: 'BWA', value: 4_190_000_000, year: 2023, products: ['Petroleum Products', 'Machinery', 'Vehicles', 'Food'] },
  { from: 'ZAF', to: 'ZWE', value: 3_390_000_000, year: 2023, products: ['Fuel', 'Machinery', 'Chemicals', 'Electrical Equipment'] },
  { from: 'ZAF', to: 'NAM', value: 3_370_000_000, year: 2023, products: ['Fuel', 'Vehicles', 'Machinery', 'Food Products'] },
  { from: 'ZAF', to: 'ZMB', value: 2_780_000_000, year: 2023, products: ['Machinery', 'Chemicals', 'Iron & Steel', 'Fuel'] },
  { from: 'ZAF', to: 'COD', value: 1_360_000_000, year: 2024, products: ['Mining Equipment', 'Vehicles', 'Fuel', 'Food'] },
  { from: 'ZAF', to: 'MWI', value: 780_000_000, year: 2023, products: ['Fuel', 'Machinery', 'Vehicles', 'Fertilizers'] },
  { from: 'ZAF', to: 'TZA', value: 950_000_000, year: 2023, products: ['Machinery', 'Chemicals', 'Iron & Steel'] },
  { from: 'ZAF', to: 'KEN', value: 680_000_000, year: 2023, products: ['Iron & Steel', 'Chemicals', 'Machinery'] },
  { from: 'ZAF', to: 'GHA', value: 520_000_000, year: 2023, products: ['Machinery', 'Vehicles', 'Iron & Steel'] },
  { from: 'ZAF', to: 'NGA', value: 480_000_000, year: 2023, products: ['Machinery', 'Vehicles', 'Chemicals'] },
  { from: 'ZAF', to: 'AGO', value: 440_000_000, year: 2023, products: ['Food Products', 'Machinery', 'Vehicles'] },
  { from: 'ZAF', to: 'UGA', value: 320_000_000, year: 2023, products: ['Iron & Steel', 'Machinery', 'Chemicals'] },
  { from: 'ZAF', to: 'SWZ', value: 1_800_000_000, year: 2023, products: ['Fuel', 'Machinery', 'Chemicals', 'Food'] },
  { from: 'ZAF', to: 'LSO', value: 1_200_000_000, year: 2023, products: ['Food', 'Fuel', 'Machinery', 'Textiles'] },

  // Reverse flows to South Africa
  { from: 'MOZ', to: 'ZAF', value: 1_160_000_000, year: 2023, products: ['Aluminum', 'Gas', 'Coal', 'Tobacco'] },
  { from: 'BWA', to: 'ZAF', value: 653_000_000, year: 2023, products: ['Diamonds', 'Meat', 'Soda Ash'] },
  { from: 'SWZ', to: 'ZAF', value: 1_400_000_000, year: 2023, products: ['Sugar', 'Textiles', 'Concentrates'] },
  { from: 'NAM', to: 'ZAF', value: 890_000_000, year: 2023, products: ['Diamonds', 'Fish', 'Uranium', 'Zinc'] },
  { from: 'ZWE', to: 'ZAF', value: 780_000_000, year: 2023, products: ['Tobacco', 'Nickel', 'Chrome', 'Gold'] },
  { from: 'ZMB', to: 'ZAF', value: 620_000_000, year: 2023, products: ['Copper', 'Cobalt', 'Tobacco'] },

  // Kenya exports (UN COMTRADE 2023)
  { from: 'KEN', to: 'UGA', value: 897_000_000, year: 2023, products: ['Petroleum Products', 'Cement', 'Iron & Steel', 'Tea'] },
  { from: 'KEN', to: 'TZA', value: 488_000_000, year: 2023, products: ['Petroleum Products', 'Cement', 'Pharmaceuticals'] },
  { from: 'KEN', to: 'RWA', value: 302_000_000, year: 2023, products: ['Petroleum Products', 'Iron & Steel', 'Cement', 'Plastics'] },
  { from: 'KEN', to: 'COD', value: 245_000_000, year: 2023, products: ['Tea', 'Vegetable Oil', 'Soap', 'Pharmaceuticals'] },
  { from: 'KEN', to: 'ETH', value: 180_000_000, year: 2023, products: ['Tea', 'Cement', 'Vegetable Oils'] },
  { from: 'KEN', to: 'SOM', value: 160_000_000, year: 2023, products: ['Food Products', 'Cement', 'Sugar'] },
  { from: 'KEN', to: 'SSD', value: 140_000_000, year: 2023, products: ['Food Products', 'Fuel', 'Construction Materials'] },

  // Reverse flows to Kenya
  { from: 'UGA', to: 'KEN', value: 420_000_000, year: 2023, products: ['Coffee', 'Fish', 'Cement', 'Tobacco'] },
  { from: 'TZA', to: 'KEN', value: 350_000_000, year: 2023, products: ['Tobacco', 'Minerals', 'Cashews', 'Sisal'] },
  { from: 'ETH', to: 'KEN', value: 210_000_000, year: 2023, products: ['Coffee', 'Khat', 'Sesame', 'Pulses'] },

  // Egypt exports (2023 estimates from official statistics)
  { from: 'EGY', to: 'LBY', value: 1_400_000_000, year: 2023, products: ['Cement', 'Food Products', 'Construction Materials', 'Plastics'] },
  { from: 'EGY', to: 'SDN', value: 900_000_000, year: 2023, products: ['Cement', 'Flour', 'Pharmaceuticals', 'Textiles'] },
  { from: 'EGY', to: 'DZA', value: 870_000_000, year: 2023, products: ['Ceramics', 'Plastics', 'Food Products'] },
  { from: 'EGY', to: 'MAR', value: 760_000_000, year: 2023, products: ['Fertilizers', 'Plastics', 'Iron & Steel'] },
  { from: 'EGY', to: 'KEN', value: 420_000_000, year: 2023, products: ['Cement', 'Ceramics', 'Pharmaceuticals'] },
  { from: 'EGY', to: 'ETH', value: 380_000_000, year: 2023, products: ['Phosphate Fertilizers', 'Cement', 'Textiles'] },
  { from: 'EGY', to: 'NGA', value: 350_000_000, year: 2023, products: ['Ceramics', 'Chemicals', 'Glass'] },

  // Nigeria exports (2023)
  { from: 'NGA', to: 'GHA', value: 118_000_000, year: 2023, products: ['Petroleum Products', 'Cement', 'Manufactured Goods'] },
  { from: 'NGA', to: 'CIV', value: 280_000_000, year: 2023, products: ['Petroleum Products', 'Manufactured Goods'] },
  { from: 'NGA', to: 'SEN', value: 190_000_000, year: 2023, products: ['Petroleum Products', 'Cement'] },
  { from: 'NGA', to: 'CMR', value: 165_000_000, year: 2023, products: ['Petroleum Products', 'Manufactured Goods'] },
  { from: 'NGA', to: 'TGO', value: 120_000_000, year: 2023, products: ['Petroleum Products', 'Food'] },

  // Reverse flows to Nigeria
  { from: 'GHA', to: 'NGA', value: 104_000_000, year: 2023, products: ['Cocoa Products', 'Aluminum', 'Wood'] },

  // Cote d'Ivoire exports (2023)
  { from: 'CIV', to: 'MLI', value: 1_500_000_000, year: 2023, products: ['Petroleum Products', 'Cocoa Derivatives', 'Cement'] },
  { from: 'CIV', to: 'BFA', value: 900_000_000, year: 2023, products: ['Petroleum Products', 'Cocoa Derivatives', 'Gold'] },
  { from: 'CIV', to: 'GHA', value: 420_000_000, year: 2023, products: ['Cocoa Butter', 'Rubber', 'Petroleum Products'] },
  { from: 'CIV', to: 'GIN', value: 280_000_000, year: 2023, products: ['Petroleum Products', 'Food Products', 'Cocoa'] },
  { from: 'CIV', to: 'NGA', value: 210_000_000, year: 2023, products: ['Cocoa Derivatives', 'Rubber', 'Gold'] },

  // Morocco exports (2023-2024)
  { from: 'MAR', to: 'SEN', value: 474_000_000, year: 2024, products: ['Fertilizers', 'Vehicles', 'Textiles', 'Food'] },
  { from: 'MAR', to: 'DZA', value: 340_000_000, year: 2023, products: ['Vehicles', 'Textiles', 'Machinery'] },
  { from: 'MAR', to: 'CIV', value: 290_000_000, year: 2023, products: ['Fertilizers', 'Vehicles', 'Electronics'] },
  { from: 'MAR', to: 'NGA', value: 250_000_000, year: 2023, products: ['Fertilizers', 'Manufactured Goods'] },
  { from: 'MAR', to: 'TUN', value: 220_000_000, year: 2023, products: ['Vehicles', 'Textiles', 'Food Products'] },

  // Tanzania exports (2023)
  { from: 'TZA', to: 'COD', value: 380_000_000, year: 2023, products: ['Manufactured Goods', 'Cement', 'Food'] },
  { from: 'TZA', to: 'RWA', value: 260_000_000, year: 2023, products: ['Cement', 'Food Products', 'Manufactured Goods'] },
  { from: 'TZA', to: 'BDI', value: 150_000_000, year: 2023, products: ['Food Products', 'Cement', 'Iron & Steel'] },

  // Ghana exports (2023)
  { from: 'GHA', to: 'BFA', value: 320_000_000, year: 2023, products: ['Petroleum Products', 'Cement', 'Cocoa Products'] },
  { from: 'GHA', to: 'TGO', value: 180_000_000, year: 2023, products: ['Petroleum Products', 'Cocoa', 'Aluminum'] },
  { from: 'GHA', to: 'CIV', value: 290_000_000, year: 2023, products: ['Petroleum Products', 'Cocoa Products'] },

  // Angola exports (2023)
  { from: 'AGO', to: 'ZAF', value: 380_000_000, year: 2023, products: ['Crude Oil', 'Diamonds', 'Refined Fuel'] },
  { from: 'AGO', to: 'COD', value: 320_000_000, year: 2023, products: ['Refined Fuel', 'Food Products'] },
  { from: 'AGO', to: 'NAM', value: 180_000_000, year: 2023, products: ['Crude Oil', 'Refined Fuel'] },
];

/* ─── Annual Intra-African Trade Trend ────────────────────── */

export interface AnnualTrade {
  year: number;
  totalBillion: number;
  shareOfTotal: number;   // percent of total African trade
}

export const ANNUAL_TREND: AnnualTrade[] = [
  { year: 2016, totalBillion: 130, shareOfTotal: 15.2 },
  { year: 2017, totalBillion: 135, shareOfTotal: 15.2 },
  { year: 2018, totalBillion: 140, shareOfTotal: 14.8 },
  { year: 2019, totalBillion: 150, shareOfTotal: 14.5 },
  { year: 2020, totalBillion: 131, shareOfTotal: 13.0 },
  { year: 2021, totalBillion: 160, shareOfTotal: 13.5 },
  { year: 2022, totalBillion: 186, shareOfTotal: 13.6 },
  { year: 2023, totalBillion: 192.2, shareOfTotal: 14.9 },
  { year: 2024, totalBillion: 220.3, shareOfTotal: 14.4 },
];

/* ─── Top Intra-African Exporters (2024) ──────────────────── */

export interface TopExporter {
  iso3: string;
  name: string;
  flag: string;
  exportsBillion: number;
  share: number; // percent of intra-African total
}

export const TOP_EXPORTERS: TopExporter[] = [
  { iso3: 'ZAF', name: 'South Africa', flag: '\u{1F1FF}\u{1F1E6}', exportsBillion: 31.12, share: 26.8 },
  { iso3: 'AGO', name: 'Angola', flag: '\u{1F1E6}\u{1F1F4}', exportsBillion: 7.29, share: 6.6 },
  { iso3: 'GHA', name: 'Ghana', flag: '\u{1F1EC}\u{1F1ED}', exportsBillion: 6.02, share: 5.5 },
  { iso3: 'NGA', name: 'Nigeria', flag: '\u{1F1F3}\u{1F1EC}', exportsBillion: 5.63, share: 5.1 },
  { iso3: 'CIV', name: "Cote d'Ivoire", flag: '\u{1F1E8}\u{1F1EE}', exportsBillion: 5.30, share: 4.8 },
  { iso3: 'KEN', name: 'Kenya', flag: '\u{1F1F0}\u{1F1EA}', exportsBillion: 3.90, share: 3.5 },
  { iso3: 'MAR', name: 'Morocco', flag: '\u{1F1F2}\u{1F1E6}', exportsBillion: 3.78, share: 3.4 },
  { iso3: 'COD', name: 'DR Congo', flag: '\u{1F1E8}\u{1F1E9}', exportsBillion: 3.34, share: 3.0 },
  { iso3: 'TZA', name: 'Tanzania', flag: '\u{1F1F9}\u{1F1FF}', exportsBillion: 3.13, share: 2.8 },
  { iso3: 'UGA', name: 'Uganda', flag: '\u{1F1FA}\u{1F1EC}', exportsBillion: 2.50, share: 2.3 },
];

/* ─── Regional Economic Communities (2023) ────────────────── */

export interface RECInfo {
  name: string;
  fullName: string;
  tradeBillion: number;
  members: number;
  topCorridor: string;
  color: string;
}

export const RECS: RECInfo[] = [
  { name: 'SADC', fullName: 'Southern African Development Community', tradeBillion: 55.6, members: 16, topCorridor: 'South Africa \u2192 Mozambique', color: '#D4AF37' },
  { name: 'COMESA', fullName: 'Common Market for Eastern and Southern Africa', tradeBillion: 35.4, members: 21, topCorridor: 'Egypt \u2192 Libya', color: '#3B82F6' },
  { name: 'ECOWAS', fullName: 'Economic Community of West African States', tradeBillion: 21.0, members: 15, topCorridor: "Cote d'Ivoire \u2192 Mali", color: '#22C55E' },
  { name: 'EAC', fullName: 'East African Community', tradeBillion: 14.5, members: 8, topCorridor: 'Kenya \u2192 Uganda', color: '#E6A817' },
  { name: 'ECCAS', fullName: 'Economic Community of Central African States', tradeBillion: 8.2, members: 11, topCorridor: 'Cameroon \u2192 Chad', color: '#EF4444' },
  { name: 'IGAD', fullName: 'Intergovernmental Authority on Development', tradeBillion: 10.5, members: 8, topCorridor: 'Ethiopia \u2192 Kenya', color: '#8B5CF6' },
  { name: 'AMU', fullName: 'Arab Maghreb Union', tradeBillion: 4.2, members: 5, topCorridor: 'Morocco \u2192 Algeria', color: '#EC4899' },
];

/* ─── Product Categories in Intra-African Trade ───────────── */

export interface ProductCategory {
  name: string;
  share: number;    // percent
  color: string;
  icon: string;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { name: 'Manufactured Goods', share: 45, color: '#D4AF37', icon: '\u{1F3ED}' },
  { name: 'Mineral Fuels & Oils', share: 22, color: '#EF4444', icon: '\u{26FD}' },
  { name: 'Agriculture & Food', share: 18, color: '#22C55E', icon: '\u{1F33E}' },
  { name: 'Machinery & Transport', share: 10, color: '#3B82F6', icon: '\u{2699}\u{FE0F}' },
  { name: 'Other', share: 5, color: '#8B5CF6', icon: '\u{1F4E6}' },
];

/* ─── Major Trade Corridors ───────────────────────────────── */

export interface TradeCorridor {
  name: string;
  from: string;   // ISO3
  to: string;     // ISO3
  mode: string;
  description: string;
}

export const TRADE_CORRIDORS: TradeCorridor[] = [
  { name: 'North-South Corridor', from: 'ZAF', to: 'ZMB', mode: 'Road/Rail', description: 'Durban to Lusaka via Johannesburg — SADC backbone' },
  { name: 'Northern Corridor', from: 'KEN', to: 'UGA', mode: 'Road/Rail', description: 'Mombasa to Kampala via Nairobi — EAC primary artery' },
  { name: 'Central Corridor', from: 'TZA', to: 'RWA', mode: 'Road/Rail', description: 'Dar es Salaam to Kigali — alternative EAC route' },
  { name: 'Abidjan-Lagos Corridor', from: 'CIV', to: 'NGA', mode: 'Road', description: 'Abidjan to Lagos via Accra, Lome, Cotonou — ECOWAS flagship' },
  { name: 'Trans-Saharan Highway', from: 'DZA', to: 'NGA', mode: 'Road', description: 'Algiers to Lagos — Trans-African Highway network' },
  { name: 'Walvis Bay Corridor', from: 'NAM', to: 'MOZ', mode: 'Road/Rail', description: 'Atlantic to Indian Ocean via Botswana — inter-oceanic link' },
];

/* ─── Helpers ─────────────────────────────────────────────── */

export function getFlowsForCountry(iso3: string): { exports: BilateralFlow[]; imports: BilateralFlow[] } {
  return {
    exports: BILATERAL_FLOWS.filter(f => f.from === iso3),
    imports: BILATERAL_FLOWS.filter(f => f.to === iso3),
  };
}

export function getTopPartners(iso3: string, limit = 8): Array<{ iso3: string; exports: number; imports: number; total: number }> {
  const partnerMap: Record<string, { exports: number; imports: number }> = {};
  for (const f of BILATERAL_FLOWS) {
    if (f.from === iso3) {
      if (!partnerMap[f.to]) partnerMap[f.to] = { exports: 0, imports: 0 };
      partnerMap[f.to].exports += f.value;
    }
    if (f.to === iso3) {
      if (!partnerMap[f.from]) partnerMap[f.from] = { exports: 0, imports: 0 };
      partnerMap[f.from].imports += f.value;
    }
  }
  return Object.entries(partnerMap)
    .map(([partner, data]) => ({ iso3: partner, ...data, total: data.exports + data.imports }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export function fmtB(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`;
  return `$${(v / 1_000).toFixed(0)}K`;
}
