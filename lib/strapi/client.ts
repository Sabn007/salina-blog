const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const IS_DEV = process.env.NODE_ENV === 'development';

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
  next?: { revalidate?: number | false; tags?: string[] };
};

export function getStrapiURL(path = '') {
  return `${STRAPI_URL}${path}`;
}

export function getStrapiMedia(url?: string | null) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return getStrapiURL(url);
}

export async function strapiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, next, ...rest } = options;
  const url = new URL(getStrapiURL(path));

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      ...headers,
    },
    // Always fetch fresh data in dev so CMS changes appear immediately
    ...(IS_DEV ? { cache: 'no-store' as const } : { next: next ?? { revalidate: 60 } }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Strapi request failed (${response.status}): ${error}`);
  }

  return response.json() as Promise<T>;
}

export async function strapiPost<T>(path: string, data: unknown): Promise<T> {
  return strapiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify({ data }),
    cache: 'no-store',
  });
}
