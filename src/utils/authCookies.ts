import Cookies from 'js-cookie';

function getAuthCookieAttributes(): Cookies.CookieAttributes {
  const isHttps =
    typeof window !== 'undefined' && window.location.protocol === 'https:';

  if (isHttps) {
    return {
      expires: 30,
      path: '/',
      sameSite: 'none',
      secure: true,
    };
  }

  return {
    expires: 30,
    path: '/',
    sameSite: 'lax',
  };
}

export function setAuthCookies(): void {
  const attrs = getAuthCookieAttributes();
  Cookies.set('auth', 'true', attrs);
  Cookies.set('AUTH', 'true', attrs);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('auth_hint', 'true');
    } catch {
      // Ignore storage errors
    }
  }
}

export function clearAuthCookies(): void {
  const attrs = getAuthCookieAttributes();
  Cookies.remove('auth', { path: '/', sameSite: attrs.sameSite, secure: attrs.secure });
  Cookies.remove('AUTH', { path: '/', sameSite: attrs.sameSite, secure: attrs.secure });
  Cookies.remove('auth', { path: '/' });
  Cookies.remove('AUTH', { path: '/' });
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('auth_hint');
    } catch {
      // Ignore storage errors
    }
  }
}

export function hasAuthHint(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(
      getStoredAccessToken() ||
        getStoredRefreshToken() ||
        Cookies.get('auth') === 'true' ||
        Cookies.get('AUTH') === 'true' ||
        localStorage.getItem('auth_hint') === 'true',
    );
  } catch {
    return Boolean(
      Cookies.get('auth') === 'true' || Cookies.get('AUTH') === 'true',
    );
  }
}

export function extractTokensFromResponse(payload: any): {
  access?: string;
  refresh?: string;
} {
  if (!payload || typeof payload !== 'object') return {};
  const access =
    payload.access ||
    payload.access_token ||
    payload.token ||
    payload.data?.access ||
    payload.data?.access_token ||
    payload.data?.token ||
    payload.tokens?.access ||
    undefined;
  const refresh =
    payload.refresh ||
    payload.refresh_token ||
    payload.data?.refresh ||
    payload.data?.refresh_token ||
    payload.tokens?.refresh ||
    undefined;
  return { access, refresh };
}

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return (
      localStorage.getItem('access_token') ||
      localStorage.getItem('token') ||
      null
    );
  } catch {
    return null;
  }
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('refresh_token') || null;
  } catch {
    return null;
  }
}

export function saveAuthTokens(tokens: {
  access?: string | null;
  refresh?: string | null;
}): void {
  if (typeof window === 'undefined') return;
  try {
    if (tokens.access) {
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('token', tokens.access);
    }
    if (tokens.refresh) {
      localStorage.setItem('refresh_token', tokens.refresh);
    }
  } catch {
    // Ignore storage quota/privacy errors
  }
}

export function clearAuthTokens(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  } catch {
    // Ignore storage errors
  }
}
