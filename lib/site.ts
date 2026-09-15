/**
 * Frontend vs CMS URL resolution.
 *
 * NEXT_PUBLIC_SITE_URL  → public frontend (canonical, OG, JSON-LD, sitemap)
 * NEXT_PUBLIC_STRAPI_URL → Strapi CMS API host (never a stand-in for the site URL)
 */

export const PRODUCTION_SITE_URL = 'https://salina-blog-mu.vercel.app';
export const PRODUCTION_STRAPI_URL = 'https://salina-cms.onrender.com';
export const LOCAL_SITE_URL = 'http://localhost:3000';
export const LOCAL_STRAPI_URL = 'http://localhost:1337';

export type UrlEnv = {
  siteUrl?: string;
  strapiUrl?: string;
  nodeEnv?: string;
};

export function stripTrailingSlash(url: string) {
  return url.replace(/\/+$/, '');
}

export function tryParseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function originsMatch(a: string, b: string) {
  const ua = tryParseUrl(a);
  const ub = tryParseUrl(b);
  if (ua && ub) {
    return ua.origin.toLowerCase() === ub.origin.toLowerCase();
  }
  return stripTrailingSlash(a).toLowerCase() === stripTrailingSlash(b).toLowerCase();
}

export function isLocalhostUrl(url: string) {
  const parsed = tryParseUrl(url);
  if (!parsed) return false;
  return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
}

/** True when `url` is the CMS host (or equal to the configured Strapi origin). */
export function isCmsHost(url: string, strapiUrl?: string) {
  const parsed = tryParseUrl(url);
  if (!parsed) return false;

  const hostname = parsed.hostname.toLowerCase();
  if (hostname === 'salina-cms.onrender.com') return true;
  if (hostname.endsWith('.onrender.com') && hostname.includes('cms')) return true;
  if (isLocalhostUrl(url) && parsed.port === '1337') return true;
  if (strapiUrl && originsMatch(url, strapiUrl)) return true;

  return false;
}

function readEnv(): UrlEnv {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL,
    nodeEnv: process.env.NODE_ENV,
  };
}

export function resolveStrapiUrl(env: UrlEnv = readEnv()): { url: string; warnings: string[] } {
  const nodeEnv = env.nodeEnv || 'development';
  const warnings: string[] = [];
  const configured = env.strapiUrl?.trim();

  if (configured) {
    const url = stripTrailingSlash(configured);
    if (!tryParseUrl(url)) {
      const fallback = nodeEnv === 'production' ? PRODUCTION_STRAPI_URL : LOCAL_STRAPI_URL;
      warnings.push(
        `[strapi] NEXT_PUBLIC_STRAPI_URL is not a valid URL (${configured}). Falling back to ${fallback}.`
      );
      return { url: fallback, warnings };
    }

    if (nodeEnv === 'production' && isLocalhostUrl(url)) {
      warnings.push(
        `[strapi] NEXT_PUBLIC_STRAPI_URL is localhost in production (${url}). Using ${PRODUCTION_STRAPI_URL} so public reads do not hit 127.0.0.1 on Vercel.`
      );
      return { url: PRODUCTION_STRAPI_URL, warnings };
    }

    return { url, warnings };
  }

  if (nodeEnv === 'production') {
    warnings.push(
      `[strapi] NEXT_PUBLIC_STRAPI_URL is unset in production. Using ${PRODUCTION_STRAPI_URL}. Set it explicitly to the CMS host — never copy this into NEXT_PUBLIC_SITE_URL.`
    );
    return { url: PRODUCTION_STRAPI_URL, warnings };
  }

  return { url: LOCAL_STRAPI_URL, warnings };
}

export function resolveSiteUrl(env: UrlEnv = readEnv()): { url: string; warnings: string[] } {
  const nodeEnv = env.nodeEnv || 'development';
  const { url: strapiUrl, warnings } = resolveStrapiUrl(env);
  const fallback = nodeEnv === 'production' ? PRODUCTION_SITE_URL : LOCAL_SITE_URL;
  const configured = env.siteUrl?.trim();

  if (configured) {
    const url = stripTrailingSlash(configured);
    if (!tryParseUrl(url)) {
      warnings.push(
        `[seo] NEXT_PUBLIC_SITE_URL is not a valid URL (${configured}). Using ${fallback}.`
      );
      return { url: fallback, warnings };
    }

    if (isCmsHost(url, strapiUrl)) {
      warnings.push(
        `[seo] NEXT_PUBLIC_SITE_URL (${url}) points at the CMS host. Canonical/OG/JSON-LD must use the frontend. Using ${fallback}. Set NEXT_PUBLIC_SITE_URL to ${PRODUCTION_SITE_URL} in production — never ${PRODUCTION_STRAPI_URL}.`
      );
      return { url: fallback, warnings };
    }

    if (nodeEnv === 'production' && isLocalhostUrl(url)) {
      warnings.push(
        `[seo] NEXT_PUBLIC_SITE_URL is localhost in production (${url}). Using ${PRODUCTION_SITE_URL}.`
      );
      return { url: PRODUCTION_SITE_URL, warnings };
    }

    return { url, warnings };
  }

  if (nodeEnv === 'production') {
    warnings.push(
      `[seo] NEXT_PUBLIC_SITE_URL is unset. Defaulting to ${PRODUCTION_SITE_URL} so canonical/OG/JSON-LD do not inherit the CMS host.`
    );
  }

  return { url: fallback, warnings };
}

let loggedSiteKey: string | undefined;
let loggedStrapiKey: string | undefined;

function logWarningsOnce(key: string, warnings: string[], kind: 'site' | 'strapi') {
  if (warnings.length === 0) return;
  const cacheKey = `${kind}:${key}:${warnings.join('|')}`;
  if (kind === 'site' && loggedSiteKey === cacheKey) return;
  if (kind === 'strapi' && loggedStrapiKey === cacheKey) return;
  if (kind === 'site') loggedSiteKey = cacheKey;
  else loggedStrapiKey = cacheKey;
  for (const warning of warnings) {
    console.error(warning);
  }
}

export function getStrapiBaseUrl() {
  const resolved = resolveStrapiUrl();
  logWarningsOnce(resolved.url, resolved.warnings, 'strapi');
  return resolved.url;
}

export function getSiteUrl() {
  const resolved = resolveSiteUrl();
  logWarningsOnce(resolved.url, resolved.warnings, 'site');
  return resolved.url;
}

/** Rewrite CMS media URLs onto the frontend origin (served via the `/uploads` rewrite). */
export function toSiteAssetUrl(url?: string | null) {
  if (!url) return '';
  const strapiUrl = getStrapiBaseUrl();
  const siteUrl = getSiteUrl();
  const absolute = url.startsWith('http')
    ? url
    : `${strapiUrl}${url.startsWith('/') ? url : `/${url}`}`;

  const parsed = tryParseUrl(absolute);
  const cms = tryParseUrl(strapiUrl);
  if (parsed && cms && parsed.origin === cms.origin) {
    return `${siteUrl}${parsed.pathname}${parsed.search}`;
  }

  return absolute;
}
