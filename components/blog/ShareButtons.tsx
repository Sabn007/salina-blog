'use client';

import type { Post } from '@/types/strapi';
import { getSiteConfig } from '@/lib/seo';

export function ShareButtons({ post }: { post: Post }) {
  const { url: siteUrl } = getSiteConfig();
  const url = `${siteUrl}/blog/${post.slug}`;
  const text = encodeURIComponent(post.title);

  const links = [
    {
      label: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${text}`,
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-cream/50">
        Share
      </span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ink/10 px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta dark:border-cream/20 dark:text-cream"
        >
          {link.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="rounded-full border border-ink/10 px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta dark:border-cream/20 dark:text-cream"
      >
        Copy Link
      </button>
    </div>
  );
}
