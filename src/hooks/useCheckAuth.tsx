import { useEffect, useState } from 'react';
import {
  clearAuthCookies,
  clearAuthTokens,
  extractTokensFromResponse,
  getStoredAccessToken,
  getStoredRefreshToken,
  hasAuthHint,
  saveAuthTokens,
  setAuthCookies,
} from '@/utils/authCookies';

let inFlightVerifyPromise: Promise<boolean> | null = null;
let verifiedSessionResult: boolean | null = null;
let verifiedFingerprint: string | null = null;

function getAuthFingerprint(): string {
  const access = getStoredAccessToken() || '';
  const refresh = getStoredRefreshToken() || '';
  const hint = hasAuthHint() ? '1' : '0';
  return `${hint}|${access}|${refresh}`;
}

async function verifyProfileWithFetch(token?: string | null): Promise<Response> {
  const headers: Record<string, string> = {};
  const activeToken = token ?? getStoredAccessToken();
  if (activeToken) {
    headers.Authorization = `Bearer ${activeToken}`;
  }

  return fetch('/api/v1/natural-profiles/', {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers,
  });
}

async function runSessionVerification(): Promise<boolean> {
  if (!hasAuthHint()) {
    return false;
  }

  try {
    const profileRes = await verifyProfileWithFetch();
    if (profileRes.ok) {
      setAuthCookies();
      return true;
    }

    if (profileRes.status === 401) {
      const refreshToken = getStoredRefreshToken();
      const refreshRes = await fetch('/api/v1/token/refresh/', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refreshToken ? { refresh: refreshToken } : {}),
      });

      if (refreshRes.ok) {
        let refreshedAccess: string | undefined;
        try {
          const payload = await refreshRes.json();
          const { access, refresh } = extractTokensFromResponse(payload);
          refreshedAccess = access;
          if (access || refresh) {
            saveAuthTokens({ access, refresh });
          }
        } catch {
          // Response may rely solely on HttpOnly cookies
        }

        const retryProfileRes = await verifyProfileWithFetch(refreshedAccess);
        if (retryProfileRes.ok) {
          setAuthCookies();
          return true;
        }
      }
    }
  } catch {
    // Network failure or aborted check: fail closed without throwing AxiosError
  }

  clearAuthTokens();
  clearAuthCookies();
  return false;
}

function checkSessionShared(): Promise<boolean> {
  const currentFingerprint = getAuthFingerprint();

  if (
    verifiedSessionResult !== null &&
    verifiedFingerprint === currentFingerprint
  ) {
    return Promise.resolve(verifiedSessionResult);
  }

  if (!inFlightVerifyPromise) {
    inFlightVerifyPromise = runSessionVerification()
      .then((result) => {
        verifiedSessionResult = result;
        verifiedFingerprint = getAuthFingerprint();
        return result;
      })
      .finally(() => {
        inFlightVerifyPromise = null;
      });
  }

  return inFlightVerifyPromise;
}

export function useCheckAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    if (!hasAuthHint()) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    checkSessionShared()
      .then((authenticated) => {
        if (!active) return;
        setIsAuthenticated(authenticated);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { isAuthenticated, loading };
}
