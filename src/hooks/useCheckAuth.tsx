import { useEffect, useState } from 'react';
import { axiosInstance } from '@/utils/axios';
import {
  clearAuthCookies,
  clearAuthTokens,
  extractTokensFromResponse,
  getStoredRefreshToken,
  hasAuthHint,
  saveAuthTokens,
  setAuthCookies,
} from '@/utils/authCookies';

export function useCheckAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasHint = hasAuthHint();

    if (!hasHint) {
      // Even without client cookie/localStorage (e.g., HttpOnly cookie only), verify session quietly
      axiosInstance
        .get('/natural-profiles/')
        .then(() => {
          setAuthCookies();
          setIsAuthenticated(true);
        })
        .catch(() => {
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    setIsAuthenticated(true);

    axiosInstance
      .get('/natural-profiles/')
      .then(() => {
        setAuthCookies();
        setIsAuthenticated(true);
      })
      .catch(async (err) => {
        if (err.response?.status === 401) {
          try {
            const refreshToken = getStoredRefreshToken();
            const refreshResponse = await axiosInstance.post(
              '/token/refresh/',
              refreshToken ? { refresh: refreshToken } : {},
              { withCredentials: true },
            );

            const { access, refresh } = extractTokensFromResponse(
              refreshResponse.data,
            );

            if (access || refresh) {
              saveAuthTokens({ access, refresh });
            }

            // Verify profile is reachable after refresh (supports both cookie & Bearer auth)
            await axiosInstance.get('/natural-profiles/');
            setAuthCookies();
            setIsAuthenticated(true);
          } catch {
            clearAuthTokens();
            clearAuthCookies();
            setIsAuthenticated(false);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { isAuthenticated, loading };
}

