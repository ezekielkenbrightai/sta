import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme/theme';
import { useAuthStore } from './stores/authStore';

// ─── Lazy-loaded pages ──────────────────────────────────────────────────────────

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Trade pages (Phase 2)
const TradeDocumentListPage = lazy(() => import('./pages/trade/TradeDocumentListPage'));
const TradeDocumentDetailPage = lazy(() => import('./pages/trade/TradeDocumentDetailPage'));
const NewTradeDocumentPage = lazy(() => import('./pages/trade/NewTradeDocumentPage'));
const DocumentVerificationPage = lazy(() => import('./pages/trade/DocumentVerificationPage'));
const HSCodeBrowserPage = lazy(() => import('./pages/trade/HSCodeBrowserPage'));
const HSCodeMappingPage = lazy(() => import('./pages/trade/HSCodeMappingPage'));
const TraderDirectoryPage = lazy(() => import('./pages/trade/TraderDirectoryPage'));
const TraderProfilePage = lazy(() => import('./pages/trade/TraderProfilePage'));
const TraderRegistrationPage = lazy(() => import('./pages/trade/TraderRegistrationPage'));

// Tax pages (Phase 3)
const TaxDashboardPage = lazy(() => import('./pages/tax/TaxDashboardPage'));
const TaxAssessmentPage = lazy(() => import('./pages/tax/TaxAssessmentPage'));
const TaxPaymentPage = lazy(() => import('./pages/tax/TaxPaymentPage'));
const TaxReportsPage = lazy(() => import('./pages/tax/TaxReportsPage'));
const DutyRateManagementPage = lazy(() => import('./pages/tax/DutyRateManagementPage'));
const TaxExemptionsPage = lazy(() => import('./pages/tax/TaxExemptionsPage'));
const AfCFTATariffPage = lazy(() => import('./pages/tax/AfCFTATariffPage'));

// Payment pages (Phase 4)
const PaymentDashboardPage = lazy(() => import('./pages/payments/PaymentDashboardPage'));
const MakePaymentPage = lazy(() => import('./pages/payments/MakePaymentPage'));
const PaymentHistoryPage = lazy(() => import('./pages/payments/PaymentHistoryPage'));
const PaymentReconciliationPage = lazy(() => import('./pages/payments/PaymentReconciliationPage'));
const FXDashboardPage = lazy(() => import('./pages/payments/FXDashboardPage'));
const FXSettlementPage = lazy(() => import('./pages/payments/FXSettlementPage'));
const CurrencyManagementPage = lazy(() => import('./pages/payments/CurrencyManagementPage'));
const BankDashboardPage = lazy(() => import('./pages/payments/BankDashboardPage'));
const TradeFinancePage = lazy(() => import('./pages/payments/TradeFinancePage'));
const CreditAppraisalPage = lazy(() => import('./pages/payments/CreditAppraisalPage'));
const RiskAssessmentPage = lazy(() => import('./pages/payments/RiskAssessmentPage'));

// Ledger pages (Phase 5)
const LedgerDashboardPage = lazy(() => import('./pages/ledger/LedgerDashboardPage'));
const JournalEntriesPage = lazy(() => import('./pages/ledger/JournalEntriesPage'));
const AccountsPage = lazy(() => import('./pages/ledger/AccountsPage'));
const TrialBalancePage = lazy(() => import('./pages/ledger/TrialBalancePage'));
const LedgerReconciliationPage = lazy(() => import('./pages/ledger/LedgerReconciliationPage'));
const AuditTrailPage = lazy(() => import('./pages/ledger/AuditTrailPage'));

// Supply Chain pages (Phase 6)
const SupplyChainDashboardPage = lazy(() => import('./pages/supply-chain/SupplyChainDashboardPage'));
const ShipmentTrackingPage = lazy(() => import('./pages/supply-chain/ShipmentTrackingPage'));
const WarehouseManagementPage = lazy(() => import('./pages/supply-chain/WarehouseManagementPage'));
const CargoManifestPage = lazy(() => import('./pages/supply-chain/CargoManifestPage'));
const LogisticsDashboardPage = lazy(() => import('./pages/supply-chain/LogisticsDashboardPage'));
const RouteManagementPage = lazy(() => import('./pages/supply-chain/RouteManagementPage'));
const FreightQuotesPage = lazy(() => import('./pages/supply-chain/FreightQuotesPage'));
const DeliveryTrackingPage = lazy(() => import('./pages/supply-chain/DeliveryTrackingPage'));

// Customs pages (Phase 6)
const CustomsDashboardPage = lazy(() => import('./pages/customs/CustomsDashboardPage'));
const ClearanceQueuePage = lazy(() => import('./pages/customs/ClearanceQueuePage'));
const InspectionPage = lazy(() => import('./pages/customs/InspectionPage'));
const PortActivityPage = lazy(() => import('./pages/customs/PortActivityPage'));

// Insurance pages (Phase 7)
const InsuranceDashboardPage = lazy(() => import('./pages/insurance/InsuranceDashboardPage'));
const PolicyManagementPage = lazy(() => import('./pages/insurance/PolicyManagementPage'));
const ClaimsPage = lazy(() => import('./pages/insurance/ClaimsPage'));
const RiskScoringPage = lazy(() => import('./pages/insurance/RiskScoringPage'));
const PremiumCalculatorPage = lazy(() => import('./pages/insurance/PremiumCalculatorPage'));

// Profile page
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));

// CBDC & Future Finance pages (Phase 9)
const CBDCDashboardPage = lazy(() => import('./pages/cbdc/CBDCDashboardPage'));
const DiscountingPage = lazy(() => import('./pages/cbdc/DiscountingPage'));
const InvoiceFinancePage = lazy(() => import('./pages/cbdc/InvoiceFinancePage'));
const TokenizationPage = lazy(() => import('./pages/cbdc/TokenizationPage'));
const P2PLendingPage = lazy(() => import('./pages/cbdc/P2PLendingPage'));

// Analytics pages (Phase 8)
const AnalyticsDashboardPage = lazy(() => import('./pages/analytics/AnalyticsDashboardPage'));
const RevenueAnalyticsPage = lazy(() => import('./pages/analytics/RevenueAnalyticsPage'));
const TradeFlowsPage = lazy(() => import('./pages/analytics/TradeFlowsPage'));
const ComplianceMonitorPage = lazy(() => import('./pages/analytics/ComplianceMonitorPage'));
const InformalEconomyPage = lazy(() => import('./pages/analytics/InformalEconomyPage'));
const ReportBuilderPage = lazy(() => import('./pages/analytics/ReportBuilderPage'));
const ScheduledReportsPage = lazy(() => import('./pages/analytics/ScheduledReportsPage'));
const DataExportPage = lazy(() => import('./pages/analytics/DataExportPage'));
const EconomicImpactPage = lazy(() => import('./pages/analytics/EconomicImpactPage'));
const AfCFTAProgressPage = lazy(() => import('./pages/analytics/AfCFTAProgressPage'));

// Admin pages (Phase 9)
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const CountriesPage = lazy(() => import('./pages/admin/CountriesPage'));
const OrganizationsPage = lazy(() => import('./pages/admin/OrganizationsPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const SystemMetricsPage = lazy(() => import('./pages/admin/SystemMetricsPage'));
const FeatureFlagsPage = lazy(() => import('./pages/admin/FeatureFlagsPage'));
const IntegrationSettingsPage = lazy(() => import('./pages/admin/IntegrationSettingsPage'));
const JobDashboardPage = lazy(() => import('./pages/admin/JobDashboardPage'));

// Layout
const AppLayout = lazy(() => import('./components/layout/AppLayout'));
const ProtectedRoute = lazy(() => import('./components/layout/ProtectedRoute'));

// ─── React Query client ─────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ─── Loading fallback ───────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress size={40} sx={{ color: '#D4AF37' }} />
    </Box>
  );
}

// ─── Helper: Protected route wrapper ────────────────────────────────────────────

function P({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProtectedRoute allowedRoles={roles}>
        {children}
      </ProtectedRoute>
    </Suspense>
  );
}

// ─── All roles shorthand ────────────────────────────────────────────────────────

const ADMIN = ['super_admin', 'govt_admin'];
const SUPER = ['super_admin'];
const GOVT = ['super_admin', 'govt_admin', 'govt_analyst'];
const BANK = ['super_admin', 'bank_officer'];
const TRADER_ROLES = ['super_admin', 'trader', 'customs_officer', 'govt_admin'];
const CUSTOMS = ['super_admin', 'customs_officer', 'govt_admin', 'auditor'];
const LOGISTICS = ['super_admin', 'logistics_officer', 'trader'];
const INSURANCE = ['super_admin', 'insurance_agent', 'trader'];
const AUDITOR_ROLES = ['super_admin', 'auditor', 'govt_admin', 'govt_analyst'];
// Tax: govt + trader (view their own) + auditor (read-only)
const TAX_VIEW = ['super_admin', 'govt_admin', 'govt_analyst', 'trader', 'auditor'];
// Analytics: govt + auditor (read-only access per ROLE_MODULES)
const ANALYTICS_VIEW = ['super_admin', 'govt_admin', 'govt_analyst', 'auditor'];

// ─── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Public routes ──────────────────────────────────────── */}
              <Route path="/login" element={<LoginPage />} />

              {/* ── Protected app shell ────────────────────────────────── */}
              <Route element={<P><AppLayout /></P>}>

                {/* ── Dashboard ──────────────────────────────────────── */}
                <Route path="/dashboard" element={<P><DashboardPage /></P>} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* ── Trade Documents ────────────────────────────────── */}
                <Route path="/trade/documents" element={<P roles={TRADER_ROLES}><TradeDocumentListPage /></P>} />
                <Route path="/trade/documents/new" element={<P roles={TRADER_ROLES}><NewTradeDocumentPage /></P>} />
                <Route path="/trade/documents/:id" element={<P roles={TRADER_ROLES}><TradeDocumentDetailPage /></P>} />
                <Route path="/trade/verification" element={<P roles={CUSTOMS}><DocumentVerificationPage /></P>} />

                {/* ── HS Codes ───────────────────────────────────────── */}
                <Route path="/trade/hs-codes" element={<P><HSCodeBrowserPage /></P>} />
                <Route path="/trade/hs-mapping" element={<P roles={TRADER_ROLES}><HSCodeMappingPage /></P>} />

                {/* ── Traders ────────────────────────────────────────── */}
                <Route path="/trade/traders" element={<P><TraderDirectoryPage /></P>} />
                <Route path="/trade/traders/register" element={<P roles={TRADER_ROLES}><TraderRegistrationPage /></P>} />
                <Route path="/trade/traders/:id" element={<P><TraderProfilePage /></P>} />

                {/* ── Tax ────────────────────────────────────────────── */}
                <Route path="/tax/dashboard" element={<P roles={TAX_VIEW}><TaxDashboardPage /></P>} />
                <Route path="/tax/assessments" element={<P roles={TAX_VIEW}><TaxAssessmentPage /></P>} />
                <Route path="/tax/payments" element={<P roles={TAX_VIEW}><TaxPaymentPage /></P>} />
                <Route path="/tax/reports" element={<P roles={TAX_VIEW}><TaxReportsPage /></P>} />
                <Route path="/tax/duty-rates" element={<P roles={ADMIN}><DutyRateManagementPage /></P>} />
                <Route path="/tax/exemptions" element={<P roles={ADMIN}><TaxExemptionsPage /></P>} />
                <Route path="/tax/afcfta-tariffs" element={<P roles={TAX_VIEW}><AfCFTATariffPage /></P>} />

                {/* ── Payments ───────────────────────────────────────── */}
                <Route path="/payments/dashboard" element={<P><PaymentDashboardPage /></P>} />
                <Route path="/payments/make" element={<P roles={['super_admin', 'trader']}><MakePaymentPage /></P>} />
                <Route path="/payments/history" element={<P><PaymentHistoryPage /></P>} />
                <Route path="/payments/reconciliation" element={<P roles={[...ADMIN, 'bank_officer']}><PaymentReconciliationPage /></P>} />

                {/* ── FX ─────────────────────────────────────────────── */}
                <Route path="/payments/fx" element={<P><FXDashboardPage /></P>} />
                <Route path="/payments/fx/settlement" element={<P roles={BANK}><FXSettlementPage /></P>} />
                <Route path="/payments/currencies" element={<P roles={ADMIN}><CurrencyManagementPage /></P>} />

                {/* ── Bank Portal ────────────────────────────────────── */}
                <Route path="/payments/bank" element={<P roles={BANK}><BankDashboardPage /></P>} />
                <Route path="/payments/trade-finance" element={<P roles={BANK}><TradeFinancePage /></P>} />
                <Route path="/payments/credit" element={<P roles={BANK}><CreditAppraisalPage /></P>} />
                <Route path="/payments/risk" element={<P roles={BANK}><RiskAssessmentPage /></P>} />

                {/* ── Ledger ─────────────────────────────────────────── */}
                <Route path="/ledger/dashboard" element={<P><LedgerDashboardPage /></P>} />
                <Route path="/ledger/journals" element={<P><JournalEntriesPage /></P>} />
                <Route path="/ledger/accounts" element={<P><AccountsPage /></P>} />
                <Route path="/ledger/trial-balance" element={<P><TrialBalancePage /></P>} />
                <Route path="/ledger/reconciliation" element={<P><LedgerReconciliationPage /></P>} />
                <Route path="/ledger/audit-trail" element={<P roles={AUDITOR_ROLES}><AuditTrailPage /></P>} />

                {/* ── Supply Chain ────────────────────────────────────── */}
                <Route path="/supply-chain/dashboard" element={<P><SupplyChainDashboardPage /></P>} />
                <Route path="/supply-chain/shipments" element={<P><ShipmentTrackingPage /></P>} />
                <Route path="/supply-chain/shipments/:id" element={<P><ShipmentTrackingPage /></P>} />
                <Route path="/supply-chain/warehouse" element={<P><WarehouseManagementPage /></P>} />
                <Route path="/supply-chain/cargo" element={<P><CargoManifestPage /></P>} />
                <Route path="/supply-chain/logistics" element={<P roles={LOGISTICS}><LogisticsDashboardPage /></P>} />
                <Route path="/supply-chain/routes" element={<P roles={LOGISTICS}><RouteManagementPage /></P>} />
                <Route path="/supply-chain/freight" element={<P roles={LOGISTICS}><FreightQuotesPage /></P>} />
                <Route path="/supply-chain/delivery" element={<P roles={LOGISTICS}><DeliveryTrackingPage /></P>} />

                {/* ── Customs ────────────────────────────────────────── */}
                <Route path="/customs/dashboard" element={<P roles={CUSTOMS}><CustomsDashboardPage /></P>} />
                <Route path="/customs/clearance" element={<P roles={CUSTOMS}><ClearanceQueuePage /></P>} />
                <Route path="/customs/inspections" element={<P roles={CUSTOMS}><InspectionPage /></P>} />
                <Route path="/customs/port-activity" element={<P roles={CUSTOMS}><PortActivityPage /></P>} />

                {/* ── Insurance ──────────────────────────────────────── */}
                <Route path="/insurance/dashboard" element={<P roles={INSURANCE}><InsuranceDashboardPage /></P>} />
                <Route path="/insurance/policies" element={<P roles={INSURANCE}><PolicyManagementPage /></P>} />
                <Route path="/insurance/claims" element={<P roles={['super_admin', 'insurance_agent']}><ClaimsPage /></P>} />
                <Route path="/insurance/risk" element={<P roles={['super_admin', 'insurance_agent']}><RiskScoringPage /></P>} />
                <Route path="/insurance/calculator" element={<P roles={INSURANCE}><PremiumCalculatorPage /></P>} />

                {/* ── Analytics (Government + Auditor) ─────────────────── */}
                <Route path="/analytics/dashboard" element={<P roles={ANALYTICS_VIEW}><AnalyticsDashboardPage /></P>} />
                <Route path="/analytics/revenue" element={<P roles={ANALYTICS_VIEW}><RevenueAnalyticsPage /></P>} />
                <Route path="/analytics/trade-flows" element={<P roles={ANALYTICS_VIEW}><TradeFlowsPage /></P>} />
                <Route path="/analytics/compliance" element={<P roles={ANALYTICS_VIEW}><ComplianceMonitorPage /></P>} />
                <Route path="/analytics/unregistered" element={<P roles={ANALYTICS_VIEW}><InformalEconomyPage /></P>} />
                <Route path="/analytics/reports" element={<P roles={ANALYTICS_VIEW}><ReportBuilderPage /></P>} />
                <Route path="/analytics/scheduled" element={<P roles={ADMIN}><ScheduledReportsPage /></P>} />
                <Route path="/analytics/export" element={<P roles={ANALYTICS_VIEW}><DataExportPage /></P>} />
                <Route path="/analytics/economic-impact" element={<P roles={ANALYTICS_VIEW}><EconomicImpactPage /></P>} />
                <Route path="/analytics/afcfta-progress" element={<P roles={ANALYTICS_VIEW}><AfCFTAProgressPage /></P>} />

                {/* ── CBDC & Future Finance ──────────────────────────── */}
                <Route path="/cbdc/dashboard" element={<P><CBDCDashboardPage /></P>} />
                <Route path="/cbdc/discounting" element={<P><DiscountingPage /></P>} />
                <Route path="/cbdc/invoice-finance" element={<P><InvoiceFinancePage /></P>} />
                <Route path="/cbdc/tokenization" element={<P><TokenizationPage /></P>} />
                <Route path="/cbdc/p2p-lending" element={<P><P2PLendingPage /></P>} />

                {/* ── Admin ──────────────────────────────────────────── */}
                <Route path="/admin/dashboard" element={<P roles={ADMIN}><AdminDashboardPage /></P>} />
                <Route path="/admin/countries" element={<P roles={SUPER}><CountriesPage /></P>} />
                <Route path="/admin/organizations" element={<P roles={ADMIN}><OrganizationsPage /></P>} />
                <Route path="/admin/users" element={<P roles={ADMIN}><UsersPage /></P>} />
                <Route path="/admin/metrics" element={<P roles={SUPER}><SystemMetricsPage /></P>} />
                <Route path="/admin/features" element={<P roles={SUPER}><FeatureFlagsPage /></P>} />
                <Route path="/admin/integrations" element={<P roles={SUPER}><IntegrationSettingsPage /></P>} />
                <Route path="/admin/jobs" element={<P roles={SUPER}><JobDashboardPage /></P>} />

                {/* ── Profile ────────────────────────────────────────── */}
                <Route path="/profile" element={<P><ProfilePage /></P>} />

                {/* ── Catch-all ──────────────────────────────────────── */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
