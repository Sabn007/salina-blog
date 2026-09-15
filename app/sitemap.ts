import type { MetadataRoute } from 'next';
import { getAllPostSlugs, getCategories, getTags } from '@/lib/strapi/queries';
import { settleCms } from '@/lib/strapi/client';
import { getSiteConfig } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { url } = getSiteConfig();

  const staticPages: MetadataRoute.Sitemap = [
    { url, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${url}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${url}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${url}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${url}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const [slugsResult, categoriesResult, tagsResult] = await Promise.all([
    settleCms('sitemap slugs', getAllPostSlugs()),
    settleCms('sitemap categories', getCategories()),
    settleCms('sitemap tags', getTags()),
  ]);

  const postPages: MetadataRoute.Sitemap = slugsResult.ok
    ? slugsResult.data.map((slug) => ({
        url: `${url}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    : [];

  const categoryPages: MetadataRoute.Sitemap = categoriesResult.ok
    ? categoriesResult.data.data.map((cat) => ({
        url: `${url}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    : [];

  const tagPages: MetadataRoute.Sitemap = tagsResult.ok
    ? tagsResult.data.data.map((tag) => ({
        url: `${url}/tag/${tag.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    : [];

  return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
}
