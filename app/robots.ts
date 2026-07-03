import type { MetadataRoute } from 'next';
import { getSiteConfig } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const { url } = getSiteConfig();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/preview/'],
    },
    sitemap: `${url}/sitemap.xml`,
  };
}
