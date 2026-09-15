import type { PostListItem } from '@/types/strapi';
import { PostCard } from './PostCard';
import { CmsEmptyState } from '@/components/ui/CmsEmptyState';

export function PostGrid({
  posts,
  columns = 3,
  error = false,
}: {
  posts: PostListItem[];
  columns?: 2 | 3;
  error?: boolean;
}) {
  if (error && !posts.length) {
    return <CmsEmptyState error resource="stories" />;
  }

  if (!posts.length) {
    return <CmsEmptyState resource="stories" />;
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
