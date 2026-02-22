import apiClient from './client';
import type {
  LoginResponse,
  User,
  TradeDocument,
  TaxAssessment,
  Payment,
  PaginatedResponse,
  Country,
  Organization,
} from '../types';

// ─── Auth ────────────────────────────────────────────────────────────────────────

export const auth = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data),
  getMe: () =>
    apiClient.get<User>('/auth/me').then((r) => r.data),
  refreshToken: () =>
    apiClient.post<{ access_token: string }>('/auth/refresh').then((r) => r.data),
};

// ─── Dashboard ──────────────────────────────────────────────────────────────────

export const dashboard = {
  getSummary: (params?: Record<string, unknown>) =>
    apiClient.get('/dashboard/summary', { params }).then((r) => r.data),
  getStats: (params?: Record<string, unknown>) =>
    apiClient.get('/dashboard/stats', { params }).then((r) => r.data),
};

// ─── Trade Documents ────────────────────────────────────────────────────────────

export const tradeDocuments = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<TradeDocument>>('/trade-documents', { params }).then((r) => r.data),
  get: (id: string) =>
    apiClient.get<TradeDocument>(`/trade-documents/${id}`).then((r) => r.data),
  create: (data: Partial<TradeDocument>) =>
    apiClient.post<TradeDocument>('/trade-documents', data).then((r) => r.data),
  update: (id: string, data: Partial<TradeDocument>) =>
    apiClient.patch<TradeDocument>(`/trade-documents/${id}`, data).then((r) => r.data),
  submit: (id: string) =>
    apiClient.post<TradeDocument>(`/trade-documents/${id}/submit`).then((r) => r.data),
};

// ─── Tax ─────────────────────────────────────────────────────────────────────────

export const tax = {
  getAssessments: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<TaxAssessment>>('/tax/assessments', { params }).then((r) => r.data),
  getAssessment: (id: string) =>
    apiClient.get<TaxAssessment>(`/tax/assessments/${id}`).then((r) => r.data),
  calculateTax: (documentId: string) =>
    apiClient.post<TaxAssessment>(`/tax/calculate/${documentId}`).then((r) => r.data),
  getDashboard: (params?: Record<string, unknown>) =>
    apiClient.get('/tax/dashboard', { params }).then((r) => r.data),
};

// ─── Payments ───────────────────────────────────────────────────────────────────

export const payments = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<Payment>>('/payments', { params }).then((r) => r.data),
  get: (id: string) =>
    apiClient.get<Payment>(`/payments/${id}`).then((r) => r.data),
  create: (data: Partial<Payment>) =>
    apiClient.post<Payment>('/payments', data).then((r) => r.data),
  getDashboard: (params?: Record<string, unknown>) =>
    apiClient.get('/payments/dashboard', { params }).then((r) => r.data),
};

// ─── FX ─────────────────────────────────────────────────────────────────────────

export const fx = {
  getRates: (params?: Record<string, unknown>) =>
    apiClient.get('/fx/rates', { params }).then((r) => r.data),
  settle: (data: Record<string, unknown>) =>
    apiClient.post('/fx/settle', data).then((r) => r.data),
  getDashboard: () =>
    apiClient.get('/fx/dashboard').then((r) => r.data),
};

// ─── Ledger ─────────────────────────────────────────────────────────────────────

export const ledger = {
  getJournals: (params?: Record<string, unknown>) =>
    apiClient.get('/ledger/journals', { params }).then((r) => r.data),
  getAccounts: () =>
    apiClient.get('/ledger/accounts').then((r) => r.data),
  getTrialBalance: (params?: Record<string, unknown>) =>
    apiClient.get('/ledger/trial-balance', { params }).then((r) => r.data),
  getDashboard: () =>
    apiClient.get('/ledger/dashboard').then((r) => r.data),
};

// ─── Supply Chain ───────────────────────────────────────────────────────────────

export const supplyChain = {
  getShipments: (params?: Record<string, unknown>) =>
    apiClient.get('/supply-chain/shipments', { params }).then((r) => r.data),
  getShipment: (id: string) =>
    apiClient.get(`/supply-chain/shipments/${id}`).then((r) => r.data),
  getDashboard: () =>
    apiClient.get('/supply-chain/dashboard').then((r) => r.data),
};

// ─── Admin ──────────────────────────────────────────────────────────────────────

export const admin = {
  getCountries: () =>
    apiClient.get<Country[]>('/admin/countries').then((r) => r.data),
  getOrganizations: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<Organization>>('/admin/organizations', { params }).then((r) => r.data),
  getUsers: (params?: Record<string, unknown>) =>
    apiClient.get('/admin/users', { params }).then((r) => r.data),
  getDashboard: () =>
    apiClient.get('/admin/dashboard').then((r) => r.data),
};
