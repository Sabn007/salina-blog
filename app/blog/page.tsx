import { PostGrid } from '@/components/blog/PostGrid';
import { Pagination } from '@/components/ui/Pagination';
import { AdSense } from '@/components/ads/AdSense';
import { getPosts } from '@/lib/strapi/queries';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Journal',
  description: 'Browse all stories from Salina Journal — travel, lifestyle, and inspiration.',
  path: '/blog',
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  let posts: Awaited<ReturnType<typeof getPosts>>['data'] = [];
  let totalPages = 1;

  try {
    const response = await getPosts(page, 12);
    posts = response.data;
    totalPages = response.meta?.pagination?.pageCount || 1;
  } catch {
    // empty state
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <p className="section-label">The Journal</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-ink md:text-5xl dark:text-cream">
          All Stories
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-muted dark:text-cream/60">
          Travel guides, hotel reviews, and lifestyle inspiration from around the world.
        </p>
      </header>

      <AdSense slot="blog-top" className="mb-8" />

      <PostGrid posts={posts} />

      <Pagination currentPage={page} totalPages={totalPages} basePath="/blog" />

      <AdSense slot="blog-bottom" className="mt-8" />
    </div>
  );
}
