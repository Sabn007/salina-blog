import { NextResponse } from 'next/server';
import { getStrapiURL } from '@/lib/strapi/client';
import { getSiteUrl, getStrapiBaseUrl } from '@/lib/site';

export async function GET() {
  const strapiUrl = getStrapiURL('/api/posts?pagination[pageSize]=1');
  const token = process.env.STRAPI_API_TOKEN;

  try {
    const response = await fetch(strapiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const text = await response.text();

    return NextResponse.json({
      siteUrl: getSiteUrl(),
      siteUrlRaw: process.env.NEXT_PUBLIC_SITE_URL || null,
      strapiUrl: getStrapiBaseUrl(),
      strapiUrlRaw: process.env.NEXT_PUBLIC_STRAPI_URL || null,
      endpoint: strapiUrl,
      status: response.status,
      ok: response.ok,
      bodyPreview: text.slice(0, 500),
      hasToken: !!token,
      publicReadsAttachBearer: false,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      siteUrl: getSiteUrl(),
      siteUrlRaw: process.env.NEXT_PUBLIC_SITE_URL || null,
      strapiUrl: getStrapiBaseUrl(),
      strapiUrlRaw: process.env.NEXT_PUBLIC_STRAPI_URL || null,
      endpoint: strapiUrl,
      error: error instanceof Error ? error.message : String(error),
      hasToken: !!token,
      publicReadsAttachBearer: false,
    }, { status: 500 });
  }
}
