// ─── Data Isolation Constants ─────────────────────────────────────────────────
// Single source of truth for role-based data visibility across all pages.

/** Roles that see cross-organization data (government oversight, platform admin). */
export const OVERSIGHT_ROLES = [
  'super_admin',
  'govt_admin',
  'govt_analyst',
  'auditor',
  'customs_officer',
  'compliance_officer',
  'afcfta_admin',
  'ps_trade',
] as const;

/** Roles that see only their own organization's data. */
export const ORG_SCOPED_ROLES = [
  'trader',
  'bank_officer',
  'insurance_agent',
  'logistics_officer',
] as const;

/** Mock organization registry — maps org IDs to display names. */
export const MOCK_ORGS: Record<string, string> = {
  'o-nex': 'Nairobi Exports Ltd',
  'o-kcb': 'KCB Bank',
  'o-apa': 'APA Insurance',
  'o-bol': 'Bolloré Logistics Kenya',
  'o-kra': 'Kenya Revenue Authority',
  'o-kpa': 'Kenya Ports Authority',
  'o-oag': 'Office of the Auditor General',
  'o-frc': 'Financial Reporting Centre',
  'o-au': 'AfCFTA Secretariat',
  'o-mot': 'Ministry of Trade',
};
