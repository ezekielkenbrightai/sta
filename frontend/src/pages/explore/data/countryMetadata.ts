/**
 * Country metadata for the Africa Trade Explorer.
 * Centroids are approximate SVG coordinates within the AFRICA_VIEWBOX ("340 425 220 210").
 */

export interface CountryMeta {
  iso3: string;
  iso2: string;
  name: string;
  flag: string;
  /** [x, y] centroid in SVG coordinate space (world-map projection) */
  centroid: [number, number];
  recs: string[];
}

export const COUNTRIES: Record<string, CountryMeta> = {
  DZA: { iso3: 'DZA', iso2: 'DZ', name: 'Algeria', flag: '\u{1F1E9}\u{1F1FF}', centroid: [420, 449], recs: ['AMU'] },
  AGO: { iso3: 'AGO', iso2: 'AO', name: 'Angola', flag: '\u{1F1E6}\u{1F1F4}', centroid: [443, 558], recs: ['SADC'] },
  BEN: { iso3: 'BEN', iso2: 'BJ', name: 'Benin', flag: '\u{1F1E7}\u{1F1EF}', centroid: [412, 510], recs: ['ECOWAS'] },
  BWA: { iso3: 'BWA', iso2: 'BW', name: 'Botswana', flag: '\u{1F1E7}\u{1F1FC}', centroid: [462, 592], recs: ['SADC'] },
  BFA: { iso3: 'BFA', iso2: 'BF', name: 'Burkina Faso', flag: '\u{1F1E7}\u{1F1EB}', centroid: [402, 497], recs: ['ECOWAS'] },
  BDI: { iso3: 'BDI', iso2: 'BI', name: 'Burundi', flag: '\u{1F1E7}\u{1F1EE}', centroid: [480, 540], recs: ['EAC', 'COMESA'] },
  CPV: { iso3: 'CPV', iso2: 'CV', name: 'Cabo Verde', flag: '\u{1F1E8}\u{1F1FB}', centroid: [352, 493], recs: ['ECOWAS'] },
  CMR: { iso3: 'CMR', iso2: 'CM', name: 'Cameroon', flag: '\u{1F1E8}\u{1F1F2}', centroid: [434, 516], recs: ['ECCAS'] },
  CAF: { iso3: 'CAF', iso2: 'CF', name: 'Central African Republic', flag: '\u{1F1E8}\u{1F1EB}', centroid: [457, 516], recs: ['ECCAS'] },
  TCD: { iso3: 'TCD', iso2: 'TD', name: 'Chad', flag: '\u{1F1F9}\u{1F1E9}', centroid: [448, 494], recs: ['ECCAS'] },
  COM: { iso3: 'COM', iso2: 'KM', name: 'Comoros', flag: '\u{1F1E8}\u{1F1F2}', centroid: [504, 563], recs: ['COMESA'] },
  COG: { iso3: 'COG', iso2: 'CG', name: 'Congo', flag: '\u{1F1E8}\u{1F1EC}', centroid: [448, 538], recs: ['ECCAS'] },
  COD: { iso3: 'COD', iso2: 'CD', name: 'DR Congo', flag: '\u{1F1E8}\u{1F1E9}', centroid: [464, 542], recs: ['SADC', 'EAC', 'COMESA'] },
  DJI: { iso3: 'DJI', iso2: 'DJ', name: 'Djibouti', flag: '\u{1F1E9}\u{1F1EF}', centroid: [516, 496], recs: ['IGAD', 'COMESA'] },
  EGY: { iso3: 'EGY', iso2: 'EG', name: 'Egypt', flag: '\u{1F1EA}\u{1F1EC}', centroid: [481, 453], recs: ['COMESA'] },
  GNQ: { iso3: 'GNQ', iso2: 'GQ', name: 'Equatorial Guinea', flag: '\u{1F1EC}\u{1F1F6}', centroid: [433, 530], recs: ['ECCAS'] },
  ERI: { iso3: 'ERI', iso2: 'ER', name: 'Eritrea', flag: '\u{1F1EA}\u{1F1F7}', centroid: [509, 484], recs: ['IGAD'] },
  SWZ: { iso3: 'SWZ', iso2: 'SZ', name: 'Eswatini', flag: '\u{1F1F8}\u{1F1FF}', centroid: [479, 600], recs: ['SADC', 'COMESA'] },
  ETH: { iso3: 'ETH', iso2: 'ET', name: 'Ethiopia', flag: '\u{1F1EA}\u{1F1F9}', centroid: [508, 502], recs: ['IGAD'] },
  GAB: { iso3: 'GAB', iso2: 'GA', name: 'Gabon', flag: '\u{1F1EC}\u{1F1E6}', centroid: [436, 536], recs: ['ECCAS'] },
  GMB: { iso3: 'GMB', iso2: 'GM', name: 'Gambia', flag: '\u{1F1EC}\u{1F1F2}', centroid: [372, 494], recs: ['ECOWAS'] },
  GHA: { iso3: 'GHA', iso2: 'GH', name: 'Ghana', flag: '\u{1F1EC}\u{1F1ED}', centroid: [404, 510], recs: ['ECOWAS'] },
  GIN: { iso3: 'GIN', iso2: 'GN', name: 'Guinea', flag: '\u{1F1EC}\u{1F1F3}', centroid: [380, 500], recs: ['ECOWAS'] },
  GNB: { iso3: 'GNB', iso2: 'GW', name: 'Guinea-Bissau', flag: '\u{1F1EC}\u{1F1FC}', centroid: [374, 498], recs: ['ECOWAS'] },
  CIV: { iso3: 'CIV', iso2: 'CI', name: "Cote d'Ivoire", flag: '\u{1F1E8}\u{1F1EE}', centroid: [392, 508], recs: ['ECOWAS'] },
  KEN: { iso3: 'KEN', iso2: 'KE', name: 'Kenya', flag: '\u{1F1F0}\u{1F1EA}', centroid: [504, 526], recs: ['EAC', 'COMESA'] },
  LSO: { iso3: 'LSO', iso2: 'LS', name: 'Lesotho', flag: '\u{1F1F1}\u{1F1F8}', centroid: [470, 607], recs: ['SADC'] },
  LBR: { iso3: 'LBR', iso2: 'LR', name: 'Liberia', flag: '\u{1F1F1}\u{1F1F7}', centroid: [383, 508], recs: ['ECOWAS'] },
  LBY: { iso3: 'LBY', iso2: 'LY', name: 'Libya', flag: '\u{1F1F1}\u{1F1FE}', centroid: [448, 450], recs: ['AMU', 'COMESA'] },
  MDG: { iso3: 'MDG', iso2: 'MG', name: 'Madagascar', flag: '\u{1F1F2}\u{1F1EC}', centroid: [520, 580], recs: ['SADC', 'COMESA'] },
  MWI: { iso3: 'MWI', iso2: 'MW', name: 'Malawi', flag: '\u{1F1F2}\u{1F1FC}', centroid: [490, 570], recs: ['SADC', 'COMESA'] },
  MLI: { iso3: 'MLI', iso2: 'ML', name: 'Mali', flag: '\u{1F1F2}\u{1F1F1}', centroid: [398, 483], recs: ['ECOWAS'] },
  MRT: { iso3: 'MRT', iso2: 'MR', name: 'Mauritania', flag: '\u{1F1F2}\u{1F1F7}', centroid: [378, 474], recs: ['AMU'] },
  MUS: { iso3: 'MUS', iso2: 'MU', name: 'Mauritius', flag: '\u{1F1F2}\u{1F1FA}', centroid: [545, 585], recs: ['SADC', 'COMESA'] },
  MAR: { iso3: 'MAR', iso2: 'MA', name: 'Morocco', flag: '\u{1F1F2}\u{1F1E6}', centroid: [401, 438], recs: ['AMU'] },
  MOZ: { iso3: 'MOZ', iso2: 'MZ', name: 'Mozambique', flag: '\u{1F1F2}\u{1F1FF}', centroid: [490, 584], recs: ['SADC'] },
  NAM: { iso3: 'NAM', iso2: 'NA', name: 'Namibia', flag: '\u{1F1F3}\u{1F1E6}', centroid: [446, 592], recs: ['SADC'] },
  NER: { iso3: 'NER', iso2: 'NE', name: 'Niger', flag: '\u{1F1F3}\u{1F1EA}', centroid: [422, 486], recs: ['ECOWAS'] },
  NGA: { iso3: 'NGA', iso2: 'NG', name: 'Nigeria', flag: '\u{1F1F3}\u{1F1EC}', centroid: [420, 510], recs: ['ECOWAS'] },
  RWA: { iso3: 'RWA', iso2: 'RW', name: 'Rwanda', flag: '\u{1F1F7}\u{1F1FC}', centroid: [480, 534], recs: ['EAC', 'COMESA'] },
  STP: { iso3: 'STP', iso2: 'ST', name: 'Sao Tome and Principe', flag: '\u{1F1F8}\u{1F1F9}', centroid: [424, 530], recs: ['ECCAS'] },
  SEN: { iso3: 'SEN', iso2: 'SN', name: 'Senegal', flag: '\u{1F1F8}\u{1F1F3}', centroid: [374, 492], recs: ['ECOWAS'] },
  SYC: { iso3: 'SYC', iso2: 'SC', name: 'Seychelles', flag: '\u{1F1F8}\u{1F1E8}', centroid: [540, 540], recs: ['SADC', 'COMESA'] },
  SLE: { iso3: 'SLE', iso2: 'SL', name: 'Sierra Leone', flag: '\u{1F1F8}\u{1F1F1}', centroid: [379, 505], recs: ['ECOWAS'] },
  SOM: { iso3: 'SOM', iso2: 'SO', name: 'Somalia', flag: '\u{1F1F8}\u{1F1F4}', centroid: [522, 508], recs: ['IGAD'] },
  ZAF: { iso3: 'ZAF', iso2: 'ZA', name: 'South Africa', flag: '\u{1F1FF}\u{1F1E6}', centroid: [463, 610], recs: ['SADC'] },
  SSD: { iso3: 'SSD', iso2: 'SS', name: 'South Sudan', flag: '\u{1F1F8}\u{1F1F8}', centroid: [480, 512], recs: ['IGAD', 'EAC'] },
  SDN: { iso3: 'SDN', iso2: 'SD', name: 'Sudan', flag: '\u{1F1F8}\u{1F1E9}', centroid: [484, 478], recs: ['IGAD', 'COMESA'] },
  TZA: { iso3: 'TZA', iso2: 'TZ', name: 'Tanzania', flag: '\u{1F1F9}\u{1F1FF}', centroid: [494, 546], recs: ['EAC', 'SADC'] },
  TGO: { iso3: 'TGO', iso2: 'TG', name: 'Togo', flag: '\u{1F1F9}\u{1F1EC}', centroid: [408, 510], recs: ['ECOWAS'] },
  TUN: { iso3: 'TUN', iso2: 'TN', name: 'Tunisia', flag: '\u{1F1F9}\u{1F1F3}', centroid: [432, 434], recs: ['AMU'] },
  UGA: { iso3: 'UGA', iso2: 'UG', name: 'Uganda', flag: '\u{1F1FA}\u{1F1EC}', centroid: [487, 526], recs: ['EAC', 'COMESA'] },
  ZMB: { iso3: 'ZMB', iso2: 'ZM', name: 'Zambia', flag: '\u{1F1FF}\u{1F1F2}', centroid: [470, 568], recs: ['SADC', 'COMESA'] },
  ZWE: { iso3: 'ZWE', iso2: 'ZW', name: 'Zimbabwe', flag: '\u{1F1FF}\u{1F1FC}', centroid: [475, 582], recs: ['SADC', 'COMESA'] },
  ESH: { iso3: 'ESH', iso2: 'EH', name: 'Western Sahara', flag: '\u{1F1EA}\u{1F1ED}', centroid: [382, 457], recs: [] },
};

export function getCountry(iso3: string): CountryMeta | undefined {
  return COUNTRIES[iso3];
}
