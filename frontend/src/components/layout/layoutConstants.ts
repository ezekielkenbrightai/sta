/**
 * Layout constants shared across AppLayout components.
 * STA Design System — Black & Gold dark theme.
 */

export const SIDEBAR_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 80;
export const HEADER_HEIGHT = 64;
export const FOOTER_HEIGHT = 48;

/** STA dark theme color palette. */
export const COLORS = {
  // Sidebar
  sidebarBg: '#050505',
  sidebarBorder: 'rgba(212, 175, 55, 0.1)',
  sidebarHoverBg: 'rgba(212, 175, 55, 0.08)',
  navText: '#b0b0b0',
  navTextHover: '#f0f0f0',
  navTextActive: '#D4AF37',
  sectionHeader: '#777777',
  // Accent
  accentGold: '#D4AF37',
  accentGoldLight: '#F0D060',
  accentGoldDark: '#B8962E',
  // Header (dark)
  headerBg: 'rgba(10, 10, 10, 0.92)',
  headerBorder: 'rgba(212, 175, 55, 0.1)',
  // Content
  contentBg: '#0a0a0a',
  // Chips / badges
  chipInactive: 'rgba(212, 175, 55, 0.08)',
  chipInactiveText: '#b0b0b0',
  chipActive: 'rgba(212, 175, 55, 0.15)',
  chipActiveText: '#D4AF37',
};

/** Trade module definitions — STA equivalent of ifrs17engine "functionalities". */
export interface ModuleDef {
  id: string;
  label: string;
  description: string;
  defaultRoute: string;
}

export const MODULES: ModuleDef[] = [
  {
    id: 'trade',
    label: 'Trade Documents',
    description: 'Import/Export Document Management',
    defaultRoute: '/dashboard',
  },
  {
    id: 'tax',
    label: 'Tax Engine',
    description: 'Automated Tax Calculation & Collection',
    defaultRoute: '/tax/dashboard',
  },
  {
    id: 'payments',
    label: 'Payments & FX',
    description: 'Payment Processing & Cross-FX Settlement',
    defaultRoute: '/payments/dashboard',
  },
  {
    id: 'ledger',
    label: 'Ledger',
    description: 'Automated Double-Entry Ledger',
    defaultRoute: '/ledger/dashboard',
  },
  {
    id: 'supply_chain',
    label: 'Supply Chain',
    description: 'Logistics & Shipment Tracking',
    defaultRoute: '/supply-chain/dashboard',
  },
  {
    id: 'customs',
    label: 'Customs',
    description: 'Customs Clearance & Port Management',
    defaultRoute: '/customs/dashboard',
  },
  {
    id: 'insurance',
    label: 'Insurance',
    description: 'Trade & Cargo Insurance',
    defaultRoute: '/insurance/dashboard',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Government Analytics & Reports',
    defaultRoute: '/analytics/dashboard',
  },
  {
    id: 'cbdc',
    label: 'CBDC & Finance',
    description: 'Digital Currency & Trade Finance',
    defaultRoute: '/cbdc/dashboard',
  },
  {
    id: 'admin',
    label: 'Administration',
    description: 'Platform Administration',
    defaultRoute: '/admin/dashboard',
  },
];

export const MODULE_MAP = Object.fromEntries(
  MODULES.map((m) => [m.id, m]),
);

// ─── Module-specific sidebar navigation ─────────────────────────────

export interface NavItem {
  to: string;
  label: string;
  icon: string;
  /** If set, only users with one of these roles see this item. */
  roles?: string[];
}

export interface NavSection {
  label: string;
  collapsible?: boolean;
  items: NavItem[];
}

/**
 * Maps each module to its sidebar nav sections.
 * Role filtering is applied at render time.
 */
export const MODULE_NAV: Record<string, NavSection[]> = {
  trade: [
    {
      label: 'Overview',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
      ],
    },
    {
      label: 'Trade Documents',
      collapsible: true,
      items: [
        { to: '/trade/documents', label: 'All Documents', icon: 'Description' },
        { to: '/trade/documents/new', label: 'New Document', icon: 'NoteAdd', roles: ['trader', 'customs_officer'] },
        { to: '/trade/verification', label: 'Verification', icon: 'VerifiedUser', roles: ['customs_officer', 'govt_admin'] },
      ],
    },
    {
      label: 'HS Codes',
      collapsible: true,
      items: [
        { to: '/trade/hs-codes', label: 'HS Code Browser', icon: 'Category' },
        { to: '/trade/hs-mapping', label: 'Product Mapping', icon: 'SwapHoriz', roles: ['trader', 'govt_admin'] },
      ],
    },
    {
      label: 'Traders',
      collapsible: true,
      items: [
        { to: '/trade/traders', label: 'Trader Directory', icon: 'People' },
        { to: '/trade/traders/register', label: 'Registration', icon: 'PersonAdd', roles: ['trader', 'govt_admin'] },
      ],
    },
  ],
  tax: [
    {
      label: 'Tax Overview',
      items: [
        { to: '/tax/dashboard', label: 'Tax Dashboard', icon: 'Dashboard' },
      ],
    },
    {
      label: 'Tax Operations',
      collapsible: true,
      items: [
        { to: '/tax/assessments', label: 'Assessments', icon: 'Assignment' },
        { to: '/tax/payments', label: 'Payments', icon: 'Payment', roles: ['trader', 'govt_admin'] },
        { to: '/tax/reports', label: 'Revenue Reports', icon: 'BarChart', roles: ['govt_admin', 'govt_analyst'] },
      ],
    },
    {
      label: 'Administration',
      collapsible: true,
      items: [
        { to: '/tax/duty-rates', label: 'Duty Rates', icon: 'Percent', roles: ['govt_admin'] },
        { to: '/tax/exemptions', label: 'Exemptions', icon: 'RemoveCircle', roles: ['govt_admin'] },
        { to: '/tax/afcfta-tariffs', label: 'AfCFTA Tariffs', icon: 'Public', roles: ['govt_admin', 'govt_analyst'] },
      ],
    },
  ],
  payments: [
    {
      label: 'Payments Overview',
      items: [
        { to: '/payments/dashboard', label: 'Payment Dashboard', icon: 'Dashboard' },
      ],
    },
    {
      label: 'Transactions',
      collapsible: true,
      items: [
        { to: '/payments/make', label: 'Make Payment', icon: 'Send', roles: ['trader'] },
        { to: '/payments/history', label: 'Payment History', icon: 'History' },
        { to: '/payments/reconciliation', label: 'Reconciliation', icon: 'CompareArrows', roles: ['govt_admin', 'bank_officer'] },
      ],
    },
    {
      label: 'Foreign Exchange',
      collapsible: true,
      items: [
        { to: '/payments/fx', label: 'FX Dashboard', icon: 'CurrencyExchange' },
        { to: '/payments/fx/settlement', label: 'FX Settlement', icon: 'SwapHoriz', roles: ['bank_officer'] },
        { to: '/payments/currencies', label: 'Currencies', icon: 'AttachMoney', roles: ['govt_admin'] },
      ],
    },
    {
      label: 'Bank Portal',
      collapsible: true,
      items: [
        { to: '/payments/bank', label: 'Bank Dashboard', icon: 'AccountBalance', roles: ['bank_officer'] },
        { to: '/payments/trade-finance', label: 'Trade Finance', icon: 'RequestQuote', roles: ['bank_officer'] },
        { to: '/payments/credit', label: 'Credit Appraisal', icon: 'CreditScore', roles: ['bank_officer'] },
        { to: '/payments/risk', label: 'Risk Assessment', icon: 'Security', roles: ['bank_officer'] },
      ],
    },
  ],
  ledger: [
    {
      label: 'Ledger Overview',
      items: [
        { to: '/ledger/dashboard', label: 'Ledger Dashboard', icon: 'Dashboard' },
      ],
    },
    {
      label: 'Ledger Operations',
      collapsible: true,
      items: [
        { to: '/ledger/journals', label: 'Journal Entries', icon: 'MenuBook' },
        { to: '/ledger/accounts', label: 'Chart of Accounts', icon: 'AccountTree' },
        { to: '/ledger/trial-balance', label: 'Trial Balance', icon: 'Balance' },
        { to: '/ledger/reconciliation', label: 'Reconciliation', icon: 'CompareArrows' },
        { to: '/ledger/audit-trail', label: 'Audit Trail', icon: 'Fingerprint' },
      ],
    },
  ],
  supply_chain: [
    {
      label: 'Supply Chain Overview',
      items: [
        { to: '/supply-chain/dashboard', label: 'Dashboard', icon: 'Dashboard' },
      ],
    },
    {
      label: 'Tracking',
      collapsible: true,
      items: [
        { to: '/supply-chain/shipments', label: 'Shipment Tracking', icon: 'LocalShipping' },
        { to: '/supply-chain/warehouse', label: 'Warehouse Mgmt', icon: 'Warehouse' },
        { to: '/supply-chain/cargo', label: 'Cargo Manifest', icon: 'Inventory' },
      ],
    },
    {
      label: 'Logistics',
      collapsible: true,
      items: [
        { to: '/supply-chain/logistics', label: 'Logistics Dashboard', icon: 'Hub', roles: ['logistics_officer'] },
        { to: '/supply-chain/routes', label: 'Trade Routes', icon: 'Route', roles: ['logistics_officer'] },
        { to: '/supply-chain/freight', label: 'Freight Quotes', icon: 'RequestQuote', roles: ['logistics_officer', 'trader'] },
        { to: '/supply-chain/delivery', label: 'Delivery Tracking', icon: 'DeliveryDining', roles: ['logistics_officer', 'trader'] },
      ],
    },
  ],
  customs: [
    {
      label: 'Customs Overview',
      items: [
        { to: '/customs/dashboard', label: 'Dashboard', icon: 'Dashboard' },
      ],
    },
    {
      label: 'Operations',
      collapsible: true,
      items: [
        { to: '/customs/clearance', label: 'Clearance Queue', icon: 'Queue', roles: ['customs_officer', 'govt_admin'] },
        { to: '/customs/inspections', label: 'Inspections', icon: 'Search', roles: ['customs_officer', 'govt_admin'] },
        { to: '/customs/port-activity', label: 'Port Activity', icon: 'Anchor', roles: ['customs_officer', 'govt_admin'] },
      ],
    },
  ],
  insurance: [
    {
      label: 'Insurance Overview',
      items: [
        { to: '/insurance/dashboard', label: 'Dashboard', icon: 'Dashboard' },
      ],
    },
    {
      label: 'Operations',
      collapsible: true,
      items: [
        { to: '/insurance/policies', label: 'Policies', icon: 'Policy', roles: ['insurance_agent', 'trader'] },
        { to: '/insurance/claims', label: 'Claims', icon: 'ReportProblem', roles: ['insurance_agent'] },
        { to: '/insurance/risk', label: 'Risk Scoring', icon: 'Security', roles: ['insurance_agent'] },
        { to: '/insurance/calculator', label: 'Premium Calculator', icon: 'Calculate', roles: ['insurance_agent', 'trader'] },
      ],
    },
  ],
  analytics: [
    {
      label: 'Analytics Overview',
      items: [
        { to: '/analytics/dashboard', label: 'Gov Dashboard', icon: 'Dashboard' },
      ],
    },
    {
      label: 'Analysis',
      collapsible: true,
      items: [
        { to: '/analytics/revenue', label: 'Revenue Analytics', icon: 'TrendingUp', roles: ['govt_admin', 'govt_analyst'] },
        { to: '/analytics/trade-flows', label: 'Trade Flows', icon: 'MultipleStop', roles: ['govt_admin', 'govt_analyst'] },
        { to: '/analytics/compliance', label: 'Compliance Monitor', icon: 'Gavel', roles: ['govt_admin', 'govt_analyst'] },
        { to: '/analytics/unregistered', label: 'Informal Economy', icon: 'PersonSearch', roles: ['govt_admin', 'govt_analyst'] },
      ],
    },
    {
      label: 'Reports',
      collapsible: true,
      items: [
        { to: '/analytics/reports', label: 'Report Builder', icon: 'Assessment', roles: ['govt_admin', 'govt_analyst'] },
        { to: '/analytics/scheduled', label: 'Scheduled Reports', icon: 'Schedule', roles: ['govt_admin'] },
        { to: '/analytics/export', label: 'Data Export', icon: 'FileDownload', roles: ['govt_admin', 'govt_analyst'] },
      ],
    },
    {
      label: 'Economic Impact',
      collapsible: true,
      items: [
        { to: '/analytics/economic-impact', label: 'GDP Impact', icon: 'ShowChart', roles: ['govt_admin', 'govt_analyst'] },
        { to: '/analytics/afcfta-progress', label: 'AfCFTA Progress', icon: 'Flag', roles: ['govt_admin', 'govt_analyst'] },
      ],
    },
  ],
  cbdc: [
    {
      label: 'CBDC Overview',
      items: [
        { to: '/cbdc/dashboard', label: 'CBDC Dashboard', icon: 'Dashboard' },
      ],
    },
    {
      label: 'Digital Finance',
      collapsible: true,
      items: [
        { to: '/cbdc/discounting', label: 'Dynamic Discounting', icon: 'Discount' },
        { to: '/cbdc/invoice-finance', label: 'Invoice Financing', icon: 'Receipt' },
        { to: '/cbdc/tokenization', label: 'Tokenization', icon: 'Token' },
        { to: '/cbdc/p2p-lending', label: 'P2P Lending', icon: 'Handshake' },
      ],
    },
  ],
  admin: [
    {
      label: 'Admin Overview',
      items: [
        { to: '/admin/dashboard', label: 'Admin Dashboard', icon: 'Dashboard' },
      ],
    },
    {
      label: 'Management',
      collapsible: true,
      items: [
        { to: '/admin/countries', label: 'Countries', icon: 'Flag', roles: ['super_admin'] },
        { to: '/admin/organizations', label: 'Organizations', icon: 'Business', roles: ['super_admin', 'govt_admin'] },
        { to: '/admin/users', label: 'Users', icon: 'Group', roles: ['super_admin', 'govt_admin'] },
      ],
    },
    {
      label: 'System',
      collapsible: true,
      items: [
        { to: '/admin/metrics', label: 'System Metrics', icon: 'Speed', roles: ['super_admin'] },
        { to: '/admin/features', label: 'Feature Flags', icon: 'ToggleOn', roles: ['super_admin'] },
        { to: '/admin/integrations', label: 'Integrations', icon: 'Extension', roles: ['super_admin'] },
        { to: '/admin/jobs', label: 'Job Dashboard', icon: 'WorkHistory', roles: ['super_admin'] },
      ],
    },
  ],
};

/** Default module per role */
export const DEFAULT_MODULE: Record<string, string> = {
  super_admin: 'admin',
  govt_admin: 'analytics',
  govt_analyst: 'analytics',
  bank_officer: 'payments',
  trader: 'trade',
  logistics_officer: 'supply_chain',
  customs_officer: 'customs',
  insurance_agent: 'insurance',
  auditor: 'ledger',
};

/** Which modules each role can access */
export const ROLE_MODULES: Record<string, string[]> = {
  super_admin: ['trade', 'tax', 'payments', 'ledger', 'supply_chain', 'customs', 'insurance', 'analytics', 'cbdc', 'admin'],
  govt_admin: ['trade', 'tax', 'payments', 'ledger', 'supply_chain', 'customs', 'insurance', 'analytics', 'cbdc'],
  govt_analyst: ['trade', 'tax', 'analytics'],
  bank_officer: ['payments', 'ledger'],
  trader: ['trade', 'tax', 'payments', 'ledger', 'supply_chain', 'insurance', 'cbdc'],
  logistics_officer: ['supply_chain'],
  customs_officer: ['trade', 'customs'],
  insurance_agent: ['insurance'],
  auditor: ['trade', 'tax', 'payments', 'ledger', 'supply_chain', 'customs', 'insurance', 'analytics'],
};
