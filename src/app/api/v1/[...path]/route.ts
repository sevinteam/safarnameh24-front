import { NextRequest, NextResponse } from 'next/server';

const TARGET_BASE_URL = 'https://cps.zarvantrip.com/api/v1';

async function proxyHandler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  const path = resolvedParams.path ? resolvedParams.path.join('/') : '';
  const search = req.nextUrl.search;

  // Always ensure trailing slash for Django API endpoints unless it is a file with extension
  const isFile = /\.[a-zA-Z0-9]+$/.test(path);
  const targetPath =
    isFile || !path ? path : path.endsWith('/') ? path : `${path}/`;
  const targetUrl = `${TARGET_BASE_URL}/${targetPath}${search}`;

  const requestHeaders = new Headers();
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    // Exclude host/connection/origin headers that belong to the proxy host
    if (
      lower !== 'host' &&
      lower !== 'connection' &&
      lower !== 'content-length' &&
      lower !== 'origin' &&
      lower !== 'referer'
    ) {
      requestHeaders.set(key, value);
    }
  });

  const originHeader = req.headers.get('origin') || '';
  const refererHeader = req.headers.get('referer') || '';
  const hostHeader = req.headers.get('host') || '';
  const isHttps =
    req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() === 'https' ||
    req.nextUrl.protocol === 'https:' ||
    originHeader.startsWith('https://') ||
    refererHeader.startsWith('https://') ||
    hostHeader.endsWith('.run.app') ||
    hostHeader.endsWith('zarvantrip.com');

  let body: any = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      const buffer = await req.arrayBuffer();
      if (buffer && buffer.byteLength > 0) {
        body = buffer;
      }
    } catch {
      body = undefined;
    }
  }

  try {
    const res = await fetch(targetUrl, {
      method: req.method,
      headers: requestHeaders,
      body,
      cache: 'no-store',
    });

    const responseHeaders = new Headers();
    res.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        lower !== 'content-encoding' &&
        lower !== 'content-length' &&
        lower !== 'set-cookie'
      ) {
        responseHeaders.set(key, value);
      }
    });

    const extractedTokens: { access?: string; refresh?: string } = {};

    if (typeof (res.headers as any).getSetCookie === 'function') {
      const cookies = (res.headers as any).getSetCookie() as string[];
      for (const rawCookie of cookies) {
        // Extract cookie name/value for token endpoints so iframe environments
        // where third-party cookies are blocked can still authenticate via Bearer
        const firstPart = rawCookie.split(';')[0] || '';
        const eqIdx = firstPart.indexOf('=');
        if (eqIdx > 0) {
          const cookieName = firstPart.slice(0, eqIdx).trim().toLowerCase();
          const cookieVal = firstPart.slice(eqIdx + 1).trim();
          if (
            cookieVal &&
            (cookieName === 'access_token' || cookieName === 'access')
          ) {
            extractedTokens.access = cookieVal;
          } else if (
            cookieVal &&
            (cookieName === 'refresh_token' || cookieName === 'refresh')
          ) {
            extractedTokens.refresh = cookieVal;
          }
        }

        let rewritten = rawCookie
          .replace(/;\s*domain=[^;]*/gi, '')
          .replace(/;\s*path=[^;]*/gi, '');
        rewritten += '; Path=/';

        if (isHttps) {
          if (/;\s*samesite=/i.test(rewritten)) {
            rewritten = rewritten.replace(
              /;\s*samesite=(lax|strict|none)/gi,
              '; SameSite=None',
            );
          } else {
            rewritten += '; SameSite=None';
          }
          if (!/;\s*secure\b/i.test(rewritten)) {
            rewritten += '; Secure';
          }
        } else {
          rewritten = rewritten
            .replace(/;\s*secure\b/gi, '')
            .replace(/;\s*samesite=none/gi, '; SameSite=Lax');
        }
        responseHeaders.append('set-cookie', rewritten);
      }
    }

    const responseData = await res.arrayBuffer();

    const isTokenEndpoint =
      res.ok &&
      (targetPath === 'token/' || targetPath === 'token/refresh/');

    if (
      isTokenEndpoint &&
      (extractedTokens.access || extractedTokens.refresh)
    ) {
      const contentType = res.headers.get('content-type') || '';
      if (!contentType || contentType.includes('application/json')) {
        try {
          const text = new TextDecoder().decode(responseData);
          const parsed = text ? JSON.parse(text) : {};
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            if (extractedTokens.access && !parsed.access && !parsed.access_token) {
              parsed.access = extractedTokens.access;
            }
            if (extractedTokens.refresh && !parsed.refresh && !parsed.refresh_token) {
              parsed.refresh = extractedTokens.refresh;
            }
            if (!contentType) {
              responseHeaders.set('content-type', 'application/json; charset=utf-8');
            }
            return new NextResponse(JSON.stringify(parsed), {
              status: res.status,
              statusText: res.statusText,
              headers: responseHeaders,
            });
          }
        } catch {
          // Fall through and return raw responseData buffer
        }
      }
    }

    const bodyForResponse =
      res.status === 204 || res.status === 304 ? null : responseData;

    return new NextResponse(bodyForResponse, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error('API Proxy Error:', err);
    return NextResponse.json(
      {
        error: 'Backend proxy error',
        details: err?.message || 'Network error',
      },
      { status: 502 },
    );
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const DELETE = proxyHandler;
export const PATCH = proxyHandler;
export const OPTIONS = proxyHandler;
export const HEAD = proxyHandler;
