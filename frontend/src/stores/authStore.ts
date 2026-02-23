import { create } from 'zustand';
import type { User } from '../types';
import { auth } from '../api/endpoints';

// ─── Dev-mode mock users (when VITE_MOCK_AUTH=true) ─────────────────────────

const DEV_USERS: Record<string, User> = {
  'trader@nairobiexports.co.ke': {
    id: 'u-trader', email: 'trader@nairobiexports.co.ke',
    first_name: 'John', last_name: 'Kipchoge', role: 'trader',
    organization_id: 'o-nex', organization_name: 'Nairobi Exports Ltd',
    organization_type: 'trader', country_id: 'c-ken', country_name: 'Kenya',
    country_code: 'KEN', country_flag_emoji: '🇰🇪', is_active: true,
    modules: ['trade', 'tax', 'payments', 'ledger', 'supply_chain', 'insurance', 'cbdc'],
  },
  'admin@sta.africa': {
    id: 'u-super', email: 'admin@sta.africa',
    first_name: 'Platform', last_name: 'Admin', role: 'super_admin',
    organization_id: null, organization_name: null,
    organization_type: null, country_id: null, country_name: null,
    country_code: null, country_flag_emoji: null, is_active: true,
    modules: ['trade', 'tax', 'payments', 'ledger', 'supply_chain', 'customs', 'insurance', 'analytics', 'cbdc', 'admin', 'compliance'],
  },
  'govt@kra.go.ke': {
    id: 'u-govt', email: 'govt@kra.go.ke',
    first_name: 'Jane', last_name: 'Mwangi', role: 'govt_admin',
    organization_id: 'o-kra', organization_name: 'Kenya Revenue Authority',
    organization_type: 'government', country_id: 'c-ken', country_name: 'Kenya',
    country_code: 'KEN', country_flag_emoji: '🇰🇪', is_active: true,
    modules: ['trade', 'tax', 'payments', 'ledger', 'supply_chain', 'customs', 'insurance', 'analytics', 'cbdc', 'compliance'],
  },
  'officer@kcb.co.ke': {
    id: 'u-bank', email: 'officer@kcb.co.ke',
    first_name: 'Sarah', last_name: 'Kamau', role: 'bank_officer',
    organization_id: 'o-kcb', organization_name: 'KCB Bank',
    organization_type: 'bank', country_id: 'c-ken', country_name: 'Kenya',
    country_code: 'KEN', country_flag_emoji: '🇰🇪', is_active: true,
    modules: ['payments', 'ledger'],
  },
  'agent@apa.co.ke': {
    id: 'u-insurance', email: 'agent@apa.co.ke',
    first_name: 'Grace', last_name: 'Oduya', role: 'insurance_agent',
    organization_id: 'o-apa', organization_name: 'APA Insurance',
    organization_type: 'insurance', country_id: 'c-ken', country_name: 'Kenya',
    country_code: 'KEN', country_flag_emoji: '🇰🇪', is_active: true,
    modules: ['insurance'],
  },
  'analyst@kra.go.ke': {
    id: 'u-analyst', email: 'analyst@kra.go.ke',
    first_name: 'David', last_name: 'Ochieng', role: 'govt_analyst',
    organization_id: 'o-kra', organization_name: 'Kenya Revenue Authority',
    organization_type: 'government', country_id: 'c-ken', country_name: 'Kenya',
    country_code: 'KEN', country_flag_emoji: '🇰🇪', is_active: true,
    modules: ['trade', 'tax', 'analytics'],
  },
  'customs@kpa.go.ke': {
    id: 'u-customs', email: 'customs@kpa.go.ke',
    first_name: 'Peter', last_name: 'Njoroge', role: 'customs_officer',
    organization_id: 'o-kpa', organization_name: 'Kenya Ports Authority',
    organization_type: 'government', country_id: 'c-ken', country_name: 'Kenya',
    country_code: 'KEN', country_flag_emoji: '🇰🇪', is_active: true,
    modules: ['trade', 'customs'],
  },
  'logistics@bollore.co.ke': {
    id: 'u-logistics', email: 'logistics@bollore.co.ke',
    first_name: 'Amina', last_name: 'Hassan', role: 'logistics_officer',
    organization_id: 'o-bol', organization_name: 'Bolloré Logistics Kenya',
    organization_type: 'logistics', country_id: 'c-ken', country_name: 'Kenya',
    country_code: 'KEN', country_flag_emoji: '🇰🇪', is_active: true,
    modules: ['supply_chain'],
  },
  'auditor@oag.go.ke': {
    id: 'u-auditor', email: 'auditor@oag.go.ke',
    first_name: 'Michael', last_name: 'Wekesa', role: 'auditor',
    organization_id: 'o-oag', organization_name: 'Office of the Auditor General',
    organization_type: 'government', country_id: 'c-ken', country_name: 'Kenya',
    country_code: 'KEN', country_flag_emoji: '🇰🇪', is_active: true,
    modules: ['trade', 'tax', 'payments', 'ledger', 'supply_chain', 'customs', 'insurance', 'analytics', 'compliance'],
  },
  'compliance@frc.go.ke': {
    id: 'u-compliance', email: 'compliance@frc.go.ke',
    first_name: 'Wanjiku', last_name: 'Karanja', role: 'compliance_officer',
    organization_id: 'o-frc', organization_name: 'Financial Reporting Centre',
    organization_type: 'government', country_id: 'c-ken', country_name: 'Kenya',
    country_code: 'KEN', country_flag_emoji: '🇰🇪', is_active: true,
    modules: ['compliance'],
  },
  'afcfta@au.int': {
    id: 'u-afcfta', email: 'afcfta@au.int',
    first_name: 'Wamkele', last_name: 'Mene', role: 'afcfta_admin',
    organization_id: 'o-afcfta', organization_name: 'AfCFTA Secretariat',
    organization_type: 'government', country_id: 'c-gha', country_name: 'Ghana',
    country_code: 'GHA', country_flag_emoji: '🇬🇭', is_active: true,
    modules: ['afcfta'],
  },
  'ps@trade.go.ke': {
    id: 'u-ps-trade', email: 'ps@trade.go.ke',
    first_name: 'PS', last_name: 'Trade', role: 'ps_trade',
    organization_id: 'o-mot', organization_name: 'Ministry of Trade',
    organization_type: 'government', country_id: 'c-ken', country_name: 'Kenya',
    country_code: 'KEN', country_flag_emoji: '🇰🇪', is_active: true,
    modules: ['executive', 'trade', 'tax', 'payments', 'analytics', 'customs', 'supply_chain', 'compliance', 'cbdc'],
  },
};

const IS_MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

// ─── Store ──────────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => Promise<void>;
}

// Guard against stored "undefined" strings from earlier bugs
function getValidToken(): string | null {
  const t = localStorage.getItem('auth_token');
  if (!t || t === 'undefined' || t === 'null') return null;
  return t;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getValidToken(),
  isAuthenticated: !!getValidToken(),
  isAuthLoading: !!getValidToken(),

  login: async (email: string, password: string) => {
    if (IS_MOCK) {
      // Dev-mode: accept any password, look up mock user by email
      const mockUser = DEV_USERS[email] || DEV_USERS['trader@nairobiexports.co.ke'];
      const token = 'mock-dev-token';
      localStorage.setItem('auth_token', token);
      localStorage.setItem('mock_user_email', mockUser.email);
      set({ token, isAuthenticated: true, isAuthLoading: false, user: mockUser });
      return;
    }
    const response = await auth.login(email, password);
    const token = response?.access_token;
    if (!token) throw new Error('No access token in login response');
    localStorage.setItem('auth_token', token);
    set({ token, isAuthenticated: true, isAuthLoading: false, user: response.user });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('mock_user_email');
    set({ user: null, token: null, isAuthenticated: false, isAuthLoading: false });
  },

  loadFromStorage: async () => {
    const token = getValidToken();
    if (!token) {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, isAuthenticated: false, isAuthLoading: false });
      return;
    }
    if (IS_MOCK) {
      // Dev-mode: restore the mock user that was logged in
      const savedEmail = localStorage.getItem('mock_user_email') || 'trader@nairobiexports.co.ke';
      const mockUser = DEV_USERS[savedEmail] || DEV_USERS['trader@nairobiexports.co.ke'];
      set({ user: mockUser, token, isAuthenticated: true, isAuthLoading: false });
      return;
    }
    set({ isAuthLoading: true });
    try {
      const user = await auth.getMe();
      set({ user, token, isAuthenticated: true, isAuthLoading: false });
    } catch {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, isAuthenticated: false, isAuthLoading: false });
    }
  },
}));
