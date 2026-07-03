import Image from 'next/image';
import type { Post } from '@/types/strapi';
import { getStrapiMedia } from '@/lib/strapi/client';
import { formatDate } from '@/lib/utils';
import { CategoryBadge } from './CategoryBadge';

export function PostHero({ post }: { post: Post }) {
  const imageUrl = post.coverImage?.formats?.large?.url || post.coverImage?.url;

  return (
    <header className="relative">
      {imageUrl && (
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <Image
            src={getStrapiMedia(imageUrl)}
            alt={post.coverImage?.alternativeText || post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        </div>
      )}

      <div
        className={
          imageUrl
            ? 'absolute bottom-0 left-0 right-0 px-4 pb-12 sm:px-6 lg:px-8'
            : 'px-4 pt-12 sm:px-6 lg:px-8'
        }
      >
        <div className="mx-auto max-w-4xl">
          {post.category && (
            <CategoryBadge
              category={post.category}
              className={imageUrl ? 'text-cream/90 hover:text-cream' : undefined}
            />
          )}
          <h1
            className={`mt-4 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl lg:text-6xl ${
              imageUrl ? 'text-cream' : 'text-ink dark:text-cream'
            }`}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p
              className={`mt-4 max-w-2xl text-lg leading-relaxed ${
                imageUrl ? 'text-cream/80' : 'text-ink-muted dark:text-cream/70'
              }`}
            >
              {post.excerpt}
            </p>
          )}
          <div
            className={`mt-6 flex flex-wrap items-center gap-4 text-sm ${
              imageUrl ? 'text-cream/70' : 'text-ink-muted dark:text-cream/50'
            }`}
          >
            {post.author && (
              <div className="flex items-center gap-3">
                {post.author.avatar?.url && (
                  <Image
                    src={getStrapiMedia(post.author.avatar.url)}
                    alt={post.author.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            )}
            {post.readingTime && <span>{post.readingTime} min read</span>}
          </div>
        </div>
      </div>
    </header>
  );
}
