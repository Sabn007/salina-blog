import type { PostListItem } from '@/types/strapi';
import { PostCard } from './PostCard';

export function PostGrid({
  posts,
  columns = 3,
}: {
  posts: PostListItem[];
  columns?: 2 | 3;
}) {
  if (!posts.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-2xl text-ink-muted dark:text-cream/50">
          No stories found yet.
        </p>
        <p className="mt-2 text-sm text-ink-muted dark:text-cream/40">
          Check back soon for new content.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        columns === 2
          ? 'grid gap-8 md:grid-cols-2'
          : 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3'
      }
    >
      {posts.map((post, index) => (
        <PostCard key={post.documentId} post={post} priority={index < 3} />
      ))}
    </div>
  );
}
