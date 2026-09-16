import { getStrapiBaseUrl } from '@/lib/site';
import { raceWithTimeout, shouldRetryNetworkError, timeoutSignal } from './timeout';

export { CMS_SITEMAP_TIMEOUT_MS } from './timeout';

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const IS_DEV = process.env.NODE_ENV === 'development';

const RETRYABLE_STATUS = new Set([429, 502, 503, 504]);
const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1500;

export class StrapiRequestError extends Error {
  status?: number;
  path: string;

  constructor(message: string, path: string, status?: number) {
    super(message);
    this.name = 'StrapiRequestError';
    this.path = path;
    this.status = status;
  }
}

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
  next?: { revalidate?: number | false; tags?: string[] };
  /** Attach STRAPI_API_TOKEN. Public list/detail reads must leave this false. */
  auth?: boolean;
  /** Abort hanging CMS requests (e.g. Render free-tier cold start). Not retried. */
  timeoutMs?: number;
};

export type CmsResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: unknown };

export function getStrapiURL(path = '') {
  return `${getStrapiBaseUrl()}${path}`;
}

export function getStrapiMedia(url?: string | null) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return getStrapiURL(url);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logStrapiFailure(status: number | undefined, requestUrl: string, detail: string) {
  const snippet = detail.replace(/\s+/g, ' ').slice(0, 300);
  console.error(`[strapi] ${status ?? 'network'} ${requestUrl} ${snippet}`);
}

export async function strapiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, next, auth = false, timeoutMs, signal: userSignal, ...rest } = options;
  const url = new URL(getStrapiURL(path));

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (headers) {
    const incoming = new Headers(headers);
    incoming.forEach((value, key) => {
      requestHeaders[key] = value;
    });
  }

  if (auth) {
    if (STRAPI_TOKEN) {
      requestHeaders.Authorization = `Bearer ${STRAPI_TOKEN}`;
    } else {
      console.error(
        `[strapi] Draft/preview request to ${url.pathname} requires STRAPI_API_TOKEN, but none is set.`
      );
    }
  }

  const requestUrl = url.toString();
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const skipCache = IS_DEV || rest.cache === 'no-store' || next?.revalidate === 0;
      const response = await fetch(requestUrl, {
        ...rest,
        signal: timeoutSignal(timeoutMs) ?? userSignal,
        headers: requestHeaders,
        ...(skipCache
          ? { cache: 'no-store' as const }
          : { next: next ?? { revalidate: 30 } }),
      });

      if (response.ok) {
        return response.json() as Promise<T>;
      }

      const errorBody = await response.text();
      logStrapiFailure(response.status, requestUrl, errorBody);

      if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_ATTEMPTS) {
        await delay(RETRY_DELAY_MS * attempt);
        continue;
      }

      throw new StrapiRequestError(
        `Strapi request failed (${response.status}): ${errorBody}`,
        path,
        response.status
      );
    } catch (error) {
      lastError = error;
      if (error instanceof StrapiRequestError) {
        throw error;
      }
      logStrapiFailure(undefined, requestUrl, error instanceof Error ? error.message : String(error));
      if (shouldRetryNetworkError(error, attempt, MAX_ATTEMPTS)) {
        await delay(RETRY_DELAY_MS * attempt);
        continue;
      }
      break;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new StrapiRequestError(`Strapi request failed: ${String(lastError)}`, path);
}

/** Isolate a CMS call so a sibling Promise.all entry can still succeed. */
export async function settleCms<T>(
  label: string,
  promise: Promise<T>,
  timeoutMs?: number
): Promise<CmsResult<T>> {
  try {
    const data = timeoutMs ? await raceWithTimeout(promise, timeoutMs, label) : await promise;
    return { ok: true, data };
  } catch (error) {
    const status = error instanceof StrapiRequestError ? error.status : undefined;
    console.error(
      `[strapi] ${label} failed${status ? ` (${status})` : ''}:`,
      error instanceof Error ? error.message : error
    );
    return { ok: false, error };
  }
}

export async function strapiPost<T>(path: string, data: unknown): Promise<T> {
  return strapiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify({ data }),
    cache: 'no-store',
  });
}
