import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  extractTokensFromResponse,
  getStoredAccessToken,
  getStoredRefreshToken,
  saveAuthTokens,
} from './authCookies';

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:8000/api/v1'
      : 'https://cps.zarvantrip.com/api/v1')
  );
};

export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

// یک Promise مشترک برای جلوگیری از Refresh هم‌زمان
let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = (): Promise<void> => {
  if (!refreshPromise) {
    const refreshToken = getStoredRefreshToken();
    refreshPromise = axios
      .post(
        `${getBaseUrl()}/token/refresh/`,
        refreshToken ? { refresh: refreshToken } : {},
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        const { access, refresh } = extractTokensFromResponse(res.data);
        if (access || refresh) {
          saveAuthTokens({ access, refresh });
        }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// ارسال درخواست‌ها همراه با توکن Bearer در صورت وجود و کوکی‌های HttpOnly
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | RetryableRequest
      | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // جلوگیری از حلقه بی‌نهایت
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';

    // خود درخواست Refresh نباید دوباره Refresh شود.
    if (requestUrl.includes('/token/refresh/')) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();

      // مرورگر کوکی جدید را ارسال می‌کند.
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // درخواست اصلی را به حالت مهمان تبدیل نمی‌کنیم.
      // مخصوصاً درخواست رزرو نباید بدون احراز هویت تکرار شود.
      return Promise.reject(refreshError);
    }
  },
);