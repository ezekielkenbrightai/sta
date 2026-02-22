/** Core user type */
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  organization_id: string | null;
  organization_name: string | null;
  organization_type: string | null;
  country_id: string | null;
  country_name: string | null;
  country_code: string | null;
  country_flag_emoji: string | null;
  is_active: boolean;
  modules: string[];
}

/** Auth login response */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

/** Paginated API response wrapper */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

/** Trade document statuses */
export type TradeDocumentStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'assessed'
  | 'paid'
  | 'cleared'
  | 'completed'
  | 'rejected';

/** Trade document types */
export type TradeDocumentType = 'import' | 'export' | 'transit' | 're_export';

/** Trade document */
export interface TradeDocument {
  id: string;
  type: TradeDocumentType;
  status: TradeDocumentStatus;
  reference_number: string;
  trader_id: string;
  trader_name: string;
  origin_country: string;
  destination_country: string;
  total_value: number;
  currency: string;
  items_count: number;
  created_at: string;
  updated_at: string;
}

/** Trade item (line item in a trade document) */
export interface TradeItem {
  id: string;
  document_id: string;
  hs_code: string;
  description: string;
  quantity: number;
  unit_value: number;
  total_value: number;
  origin_country: string;
  unit: string;
}

/** HS Code */
export interface HSCode {
  id: string;
  code: string;
  description: string;
  duty_rate: number;
  chapter: number;
  section: string;
}

/** Tax assessment */
export interface TaxAssessment {
  id: string;
  document_id: string;
  customs_duty: number;
  vat: number;
  excise_duty: number;
  withholding_tax: number;
  total_tax: number;
  status: 'pending' | 'approved' | 'paid' | 'overdue';
  assessed_at: string;
}

/** Payment */
export interface Payment {
  id: string;
  from_org_id: string;
  to_org_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: 'tax' | 'trade' | 'settlement';
  reference: string;
  created_at: string;
}

/** FX Settlement */
export interface FXSettlement {
  id: string;
  payment_id: string;
  source_currency: string;
  target_currency: string;
  exchange_rate: number;
  source_amount: number;
  settled_amount: number;
  status: 'pending' | 'processing' | 'settled' | 'failed';
  settled_at: string | null;
}

/** Ledger entry */
export interface LedgerEntry {
  id: string;
  journal_id: string;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  description: string;
  date: string;
}

/** Shipment */
export interface Shipment {
  id: string;
  document_id: string;
  origin: string;
  destination: string;
  carrier: string;
  status: 'pending' | 'in_transit' | 'at_port' | 'customs' | 'cleared' | 'delivered';
  tracking_number: string;
  estimated_arrival: string;
}

/** Country */
export interface Country {
  id: string;
  name: string;
  code: string;
  currency_code: string;
  currency_symbol: string;
  flag_emoji: string;
}

/** Organization */
export interface Organization {
  id: string;
  name: string;
  type: 'government' | 'bank' | 'trader' | 'logistics' | 'insurance' | 'customs';
  country_id: string;
  country_name: string;
  is_active: boolean;
}

/** Dashboard stat card data */
export interface StatCardData {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  color?: string;
}

/** Audit log entry */
export interface AuditLogEntry {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  timestamp: string;
}
