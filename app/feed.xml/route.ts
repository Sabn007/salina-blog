import { Feed } from 'feed';
import { getRecentPostsForFeed } from '@/lib/strapi/queries';
import { getSiteConfig } from '@/lib/seo';
import { getStrapiMedia } from '@/lib/strapi/client';
import { stripHtml } from '@/lib/utils';

export async function GET() {
  const { name, url, description } = getSiteConfig();

  const feed = new Feed({
    title: name,
    description,
    id: url,
    link: url,
    language: 'en',
    favicon: `${url}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${name}`,
    feedLinks: {
      rss2: `${url}/feed.xml`,
    },
  });

  try {
    const { data: posts } = await getRecentPostsForFeed(30);

    posts.forEach((post) => {
      feed.addItem({
        title: post.title,
        id: `${url}/blog/${post.slug}`,
        link: `${url}/blog/${post.slug}`,
        description: post.excerpt || stripHtml(post.content || '').slice(0, 300),
        content: post.content,
        author: post.author ? [{ name: post.author.name }] : [],
        date: new Date(post.publishedAt || post.createdAt),
        image: post.coverImage?.url
          ? getStrapiMedia(post.coverImage.url)
          : undefined,
        category: post.category ? [{ name: post.category.name }] : [],
      });
    });
  } catch {
    // Return empty feed if Strapi unavailable
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
