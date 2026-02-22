import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// ─── Retry Configuration ────────────────────────────────────────────────────────
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

interface RetryConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
}

function isRetryable(error: AxiosError): boolean {
  if (!error.response) return true;
  return [502, 503, 504].includes(error.response.status);
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: Attach Auth Token ────────────────────────────────────

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor: Retry + Handle Errors ────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;

    // Retry transient failures
    if (config && isRetryable(error)) {
      const retryCount = config._retryCount ?? 0;
      if (retryCount < MAX_RETRIES) {
        config._retryCount = retryCount + 1;
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (retryCount + 1)));
        return apiClient(config);
      }
    }

    // 401 handling: auto-logout for expired sessions (not login failures)
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.endsWith('/auth/login');
      if (!isLoginRequest) {
        import('../stores/authStore').then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
        });
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
