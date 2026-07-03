import type { MetadataRoute } from 'next';
import { getAllPostSlugs, getCategories, getTags } from '@/lib/strapi/queries';
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

  let postPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];
  let tagPages: MetadataRoute.Sitemap = [];

  try {
    const [slugs, categoriesRes, tagsRes] = await Promise.all([
      getAllPostSlugs(),
      getCategories(),
      getTags(),
    ]);

    postPages = slugs.map((slug) => ({
      url: `${url}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    categoryPages = categoriesRes.data.map((cat) => ({
      url: `${url}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    tagPages = tagsRes.data.map((tag) => ({
      url: `${url}/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {
    // Strapi unavailable during build
  }

  return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
}
