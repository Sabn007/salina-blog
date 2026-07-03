import Image from 'next/image';
import type { PostListItem, StrapiImage } from '@/types/strapi';
import { getStrapiMedia } from '@/lib/strapi/client';
import { PostCard } from './PostCard';

export function RelatedPosts({ posts }: { posts: PostListItem[] }) {
  if (!posts?.length) return null;

  return (
    <section className="mt-16 border-t border-ink/10 pt-16 dark:border-cream/10">
      <h2 className="section-label mb-8">You May Also Enjoy</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <PostCard key={post.documentId} post={post} />
        ))}
      </div>
    </section>
  );
}

export function PostGallery({ images }: { images: StrapiImage[] }) {
  if (!images?.length) return null;

  return (
    <div className="my-12 grid gap-4 sm:grid-cols-2">
      {images.map((image) => (
        <figure key={image.documentId} className="overflow-hidden rounded-sm">
          <Image
            src={getStrapiMedia(image.url)}
            alt={image.alternativeText || ''}
            width={image.width}
            height={image.height}
            className="h-full w-full object-cover"
          />
        </figure>
      ))}
    </div>
  );
}
