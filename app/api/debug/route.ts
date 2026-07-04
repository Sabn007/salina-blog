import { NextResponse } from 'next/server';
import { getStrapiURL } from '@/lib/strapi/client';

export async function GET() {
  const strapiUrl = getStrapiURL('/api/posts?pagination[pageSize]=1');
  const token = process.env.STRAPI_API_TOKEN;

  try {
    const response = await fetch(strapiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    const text = await response.text();

    return NextResponse.json({
      strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL,
      endpoint: strapiUrl,
      status: response.status,
      ok: response.ok,
      bodyPreview: text.slice(0, 500),
      hasToken: !!token,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL,
      endpoint: strapiUrl,
      error: error instanceof Error ? error.message : String(error),
      hasToken: !!token,
    }, { status: 500 });
  }
}
