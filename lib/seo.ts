import type { Metadata } from 'next';
import type { Post, StrapiImage } from '@/types/strapi';
import { getStrapiMedia } from '@/lib/strapi/client';
import { stripHtml } from '@/lib/utils';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Salina Journal';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  'A premium lifestyle and travel journal — curated stories, destinations, and inspiration for the modern wanderer.';

export function getSiteConfig() {
  return { name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION };
}

export function buildPageMetadata({
  title,
  description,
  path = '',
  image,
  type = 'website',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const pageDescription = description || SITE_DESCRIPTION;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/og-default.jpg`;

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title || SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
    },
  };
}

export function buildPostMetadata(post: Post): Metadata {
  const image = post.seoImage?.url || post.coverImage?.url;
  return buildPageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || stripHtml(post.content).slice(0, 160),
    path: `/blog/${post.slug}`,
    image: image ? getStrapiMedia(image) : undefined,
    type: 'article',
  });
}

export function buildArticleJsonLd(post: Post) {
  const image = post.seoImage || post.coverImage;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt || stripHtml(post.content).slice(0, 160),
    image: image ? getStrapiMedia(image.url) : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
          url: post.author.website || undefined,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getPostOgImage(post: Post): StrapiImage | null {
  return post.seoImage || post.coverImage || null;
}
