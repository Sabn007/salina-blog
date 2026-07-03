import Image from 'next/image';
import Link from 'next/link';
import type { PostListItem } from '@/types/strapi';
import { getStrapiMedia } from '@/lib/strapi/client';
import { cn, formatDate } from '@/lib/utils';
import { CategoryBadge } from './CategoryBadge';

interface PostCardProps {
  post: PostListItem;
  variant?: 'default' | 'featured' | 'horizontal';
  priority?: boolean;
}

export function PostCard({ post, variant = 'default', priority = false }: PostCardProps) {
  const imageUrl = post.coverImage?.formats?.medium?.url || post.coverImage?.url;
  const isFeatured = variant === 'featured';
  const isHorizontal = variant === 'horizontal';

  return (
    <article
      className={cn(
        'group card-hover overflow-hidden rounded-sm bg-white dark:bg-charcoal-light',
        isFeatured && 'md:col-span-2 md:row-span-2',
        isHorizontal && 'flex flex-col sm:flex-row'
      )}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={cn('relative block overflow-hidden', isHorizontal ? 'sm:w-2/5' : 'aspect-[4/3]')}
      >
        {imageUrl ? (
          <Image
            src={getStrapiMedia(imageUrl)}
            alt={post.coverImage?.alternativeText || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={
              isFeatured
                ? '(max-width: 768px) 100vw, 66vw'
                : isHorizontal
                  ? '(max-width: 640px) 100vw, 40vw'
                  : '(max-width: 768px) 100vw, 33vw'
            }
            priority={priority}
          />
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center bg-cream-dark dark:bg-charcoal">
            <span className="font-display text-4xl text-terracotta/30">S</span>
          </div>
        )}
      </Link>

      <div className={cn('flex flex-col justify-center p-6', isHorizontal && 'sm:w-3/5 sm:p-8')}>
        {post.category && <CategoryBadge category={post.category} className="mb-3" />}
        <Link href={`/blog/${post.slug}`}>
          <h2
            className={cn(
              'font-display font-medium leading-tight text-ink transition-colors group-hover:text-terracotta dark:text-cream',
              isFeatured ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
            )}
          >
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted dark:text-cream/60">
            {post.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center gap-3 text-xs text-ink-muted dark:text-cream/50">
          {post.author && <span>{post.author.name}</span>}
          {post.publishedAt && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </>
          )}
          {post.readingTime && (
            <>
              <span aria-hidden>·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
