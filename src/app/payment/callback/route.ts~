import { NextRequest, NextResponse } from 'next/server';

const BACKEND_CALLBACK_URL = 'https://cps.zarvantrip.com/api/v1/payment/callback/';

async function forwardToBackend(req: NextRequest, method: 'GET' | 'POST') {
  try {
    const targetUrl = BACKEND_CALLBACK_URL + (req.nextUrl.search || '');
    const headers: Record<string, string> = {};

    const contentType = req.headers.get('content-type');
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    const body = method === 'POST' ? await req.text() : undefined;

    const backendRes = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: 'manual',
    });

    const location = backendRes.headers.get('location');
    if (location) {
      return NextResponse.redirect(location, { status: 303 });
    }

    const fallbackUrl = new URL('/payment/watcher-info', 'https://zarvantrip.com');
    req.nextUrl.searchParams.forEach((v, k) => {
      fallbackUrl.searchParams.set(k, v);
    });
    return NextResponse.redirect(fallbackUrl, { status: 303 });
  } catch (err) {
    return NextResponse.redirect(
      'https://zarvantrip.com/payment/watcher-info?Status=NOK',
      { status: 303 },
    );
  }
}

export async function POST(req: NextRequest) {
  return forwardToBackend(req, 'POST');
}

export async function GET(req: NextRequest) {
  return forwardToBackend(req, 'GET');
}
