import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (REVALIDATION_SECRET) {
    const secret = request.headers.get('x-revalidation-secret') || body?.secret;
    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }
  }

  const tags = ['posts', 'categories', 'tags', 'authors', 'featured', 'feed'];
  tags.forEach((tag) => {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch {
      // tag might not exist yet
    }
  });

  return NextResponse.json({ revalidated: true, tags, timestamp: Date.now() });
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (REVALIDATION_SECRET && secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const tags = ['posts', 'categories', 'tags', 'authors', 'featured', 'feed'];
  tags.forEach((tag) => {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch {
      // tag might not exist yet
    }
  });

  return NextResponse.json({ revalidated: true, tags, timestamp: Date.now() });
}
