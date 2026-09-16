import { CMS_SITEMAP_TIMEOUT_MS, raceWithTimeout } from './strapi/timeout.ts';

export type SitemapChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export type SitemapEntry = {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: SitemapChangeFrequency;
  priority?: number;
};

export type SitemapSlug = { slug: string };

export type DynamicSitemapData = {
  slugs: string[];
  categories: SitemapSlug[];
  tags: SitemapSlug[];
};

export type SitemapLiveData = {
  slugs?: string[] | null;
  categories?: SitemapSlug[] | null;
  tags?: SitemapSlug[] | null;
};

export const STATIC_SITEMAP_PAGES: Array<{
  path: string;
  changeFrequency: SitemapChangeFrequency;
  priority: number;
}> = [
  { path: '', changeFrequency: 'daily', priority: 1 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.9 },
  { path: '/categories', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/search', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
];

/**
 * Best-effort last-known-good dynamic URLs for this process.
 * Complements the existing Strapi fetch cache/tags; not a durable store.
 */
let lastGoodDynamic: DynamicSitemapData | null = null;

function isNonEmptySlug(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function slugItems(value: unknown): SitemapSlug[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === 'string' && isNonEmptySlug(item)) return [{ slug: item }];
    if (item && typeof item === 'object' && isNonEmptySlug((item as SitemapSlug).slug)) {
      return [{ slug: (item as SitemapSlug).slug }];
    }
    return [];
  });
}

export function resetLastGoodSitemapDynamic() {
  lastGoodDynamic = null;
}

export function readLastGoodSitemapDynamic(): DynamicSitemapData | null {
  return lastGoodDynamic;
}

export function rememberSitemapDynamic(partial: SitemapLiveData) {
  const next: DynamicSitemapData = {
    slugs: Array.isArray(partial.slugs)
      ? partial.slugs.filter(isNonEmptySlug)
      : (lastGoodDynamic?.slugs ?? []),
    categories: Array.isArray(partial.categories)
      ? slugItems(partial.categories)
      : (lastGoodDynamic?.categories ?? []),
    tags: Array.isArray(partial.tags) ? slugItems(partial.tags) : (lastGoodDynamic?.tags ?? []),
  };

  lastGoodDynamic = next;
}

export function resolveSitemapDynamic(live: SitemapLiveData | null | undefined): DynamicSitemapData {
  const resolved: DynamicSitemapData = {
    slugs: Array.isArray(live?.slugs) ? live.slugs.filter(isNonEmptySlug) : (lastGoodDynamic?.slugs ?? []),
    categories: Array.isArray(live?.categories)
      ? slugItems(live.categories)
      : (lastGoodDynamic?.categories ?? []),
    tags: Array.isArray(live?.tags) ? slugItems(live.tags) : (lastGoodDynamic?.tags ?? []),
  };

  if (Array.isArray(live?.slugs) || Array.isArray(live?.categories) || Array.isArray(live?.tags)) {
    rememberSitemapDynamic(live ?? {});
  }

  return resolved;
}

export function buildStaticSitemap(siteUrl: string, lastModified: Date = new Date()): SitemapEntry[] {
  const origin = siteUrl.replace(/\/+$/, '');
  return STATIC_SITEMAP_PAGES.map((page) => ({
    url: `${origin}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}

export function buildDynamicSitemap(
  siteUrl: string,
  data: DynamicSitemapData,
  lastModified: Date = new Date()
): SitemapEntry[] {
  const origin = siteUrl.replace(/\/+$/, '');

  const postPages = data.slugs.filter(isNonEmptySlug).map((slug) => ({
    url: `${origin}/blog/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryPages = slugItems(data.categories).map((cat) => ({
    url: `${origin}/category/${cat.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const tagPages = slugItems(data.tags).map((tag) => ({
    url: `${origin}/tag/${tag.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...postPages, ...categoryPages, ...tagPages];
}

export async function assembleSitemap(options: {
  siteUrl: string;
  timeoutMs?: number;
  load: () => Promise<SitemapLiveData>;
}): Promise<SitemapEntry[]> {
  const lastModified = new Date();
  const staticPages = buildStaticSitemap(options.siteUrl, lastModified);
  const timeoutMs = options.timeoutMs ?? CMS_SITEMAP_TIMEOUT_MS;

  try {
    const live = await raceWithTimeout(options.load(), timeoutMs, 'sitemap cms');
    const dynamic = resolveSitemapDynamic(live);
    return [...staticPages, ...buildDynamicSitemap(options.siteUrl, dynamic, lastModified)];
  } catch (error) {
    console.error(
      '[sitemap] CMS unavailable; serving static/last-good URLs:',
      error instanceof Error ? error.message : error
    );
    const dynamic = lastGoodDynamic ?? { slugs: [], categories: [], tags: [] };
    return [...staticPages, ...buildDynamicSitemap(options.siteUrl, dynamic, lastModified)];
  }
}
