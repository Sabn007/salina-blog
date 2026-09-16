import type { MetadataRoute } from 'next';
import { unstable_rethrow } from 'next/navigation';
import { getAllPostSlugs, getCategories, getTags } from '@/lib/strapi/queries';
import { CMS_SITEMAP_TIMEOUT_MS, settleCms } from '@/lib/strapi/client';
import { assembleSitemap, buildStaticSitemap } from '@/lib/sitemap';
import { getSiteConfig } from '@/lib/seo';

/** Do not cache a degraded (CMS-down) sitemap as a static metadata route. */
export const dynamic = 'force-dynamic';

async function loadSitemapDynamic() {
  const [slugsResult, categoriesResult, tagsResult] = await Promise.all([
    settleCms('sitemap slugs', getAllPostSlugs({ timeoutMs: CMS_SITEMAP_TIMEOUT_MS }), CMS_SITEMAP_TIMEOUT_MS),
    settleCms(
      'sitemap categories',
      getCategories({ timeoutMs: CMS_SITEMAP_TIMEOUT_MS }),
      CMS_SITEMAP_TIMEOUT_MS
    ),
    settleCms('sitemap tags', getTags({ timeoutMs: CMS_SITEMAP_TIMEOUT_MS }), CMS_SITEMAP_TIMEOUT_MS),
  ]);

  return {
    slugs: slugsResult.ok && Array.isArray(slugsResult.data) ? slugsResult.data : undefined,
    categories:
      categoriesResult.ok && Array.isArray(categoriesResult.data?.data)
        ? categoriesResult.data.data
        : undefined,
    tags: tagsResult.ok && Array.isArray(tagsResult.data?.data) ? tagsResult.data.data : undefined,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { url } = getSiteConfig();

  try {
    return await assembleSitemap({
      siteUrl: url,
      timeoutMs: CMS_SITEMAP_TIMEOUT_MS,
      load: loadSitemapDynamic,
    });
  } catch (error) {
    unstable_rethrow(error);
    console.error(
      '[sitemap] unexpected failure; returning static URLs:',
      error instanceof Error ? error.message : error
    );
    return buildStaticSitemap(url);
  }
}
