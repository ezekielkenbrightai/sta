import { create } from 'zustand';
import { DEFAULT_MODULE, ROLE_MODULES } from '../components/layout/layoutConstants';

/** Maps URL path prefix → module id. */
const PATH_TO_MODULE: Record<string, string> = {
  '/trade': 'trade',
  '/tax': 'tax',
  '/payments': 'payments',
  '/ledger': 'ledger',
  '/supply-chain': 'supply_chain',
  '/customs': 'customs',
  '/insurance': 'insurance',
  '/analytics': 'analytics',
  '/cbdc': 'cbdc',
  '/admin': 'admin',
};

/** Detect module from a pathname. */
export function moduleFromPath(pathname: string): string | null {
  for (const [prefix, mod] of Object.entries(PATH_TO_MODULE)) {
    if (pathname.startsWith(prefix)) return mod;
  }
  return null;
}

interface AppState {
  /** Currently selected trade module */
  selectedModule: string;
  /** Selected country context */
  selectedCountry: string | null;
  /** Language code for i18n */
  languageCode: string;
  setSelectedModule: (module: string) => void;
  setSelectedCountry: (country: string | null) => void;
  setLanguage: (code: string) => void;
  /** Initialize module based on user role */
  initForRole: (role: string) => void;
  /** Sync module selection from current URL path */
  syncFromPath: (pathname: string, role?: string) => void;
}

const STORED_MODULE_KEY = 'sta_selectedModule';

export const useAppStore = create<AppState>((set, get) => ({
  selectedModule: localStorage.getItem(STORED_MODULE_KEY) || 'trade',
  selectedCountry: null,
  languageCode: 'en',

  setSelectedModule: (module: string) => {
    localStorage.setItem(STORED_MODULE_KEY, module);
    set({ selectedModule: module });
  },

  setSelectedCountry: (country: string | null) => {
    set({ selectedCountry: country });
  },

  setLanguage: (code: string) => {
    set({ languageCode: code });
  },

  initForRole: (role: string) => {
    const stored = localStorage.getItem(STORED_MODULE_KEY);
    if (!stored) {
      const defaultMod = DEFAULT_MODULE[role] || 'trade';
      localStorage.setItem(STORED_MODULE_KEY, defaultMod);
      set({ selectedModule: defaultMod });
    }
  },

  syncFromPath: (pathname: string, role?: string) => {
    const detected = moduleFromPath(pathname);
    if (detected && detected !== get().selectedModule) {
      const allowed = role ? (ROLE_MODULES[role] || []) : [];
      if (!role || allowed.includes(detected)) {
        localStorage.setItem(STORED_MODULE_KEY, detected);
        set({ selectedModule: detected });
      }
    }
  },
}));
