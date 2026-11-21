import { NextRequest, NextResponse } from 'next/server';

const BACKEND_WALLET_CALLBACK = 'https://cps.safarnameh24.com/api/v1/finance/wallet/payment-callback/';

async function forwardWalletCallback(req: NextRequest, method: 'GET' | 'POST') {
  try {
    const targetUrl = BACKEND_WALLET_CALLBACK + (req.nextUrl.search || '');
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

    return NextResponse.redirect(
      'https://safarnameh24.com/dashboard/financial/wallet?payment_status=unsuccessfull&amount=0',
      { status: 303 },
    );
  } catch (err) {
    return NextResponse.redirect(
      'https://safarnameh24.com/dashboard/financial/wallet?payment_status=unsuccessfull&amount=0',
      { status: 303 },
    );
  }
}

export async function POST(req: NextRequest) {
  return forwardWalletCallback(req, 'POST');
}

export async function GET(req: NextRequest) {
  return forwardWalletCallback(req, 'GET');
}
