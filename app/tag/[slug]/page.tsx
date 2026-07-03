import { notFound } from 'next/navigation';
import { PostGrid } from '@/components/blog/PostGrid';
import { Pagination } from '@/components/ui/Pagination';
import { getPostsByTag, getTagBySlug } from '@/lib/strapi/queries';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug).catch(() => null);
  if (!tag) return {};
  return buildPageMetadata({
    title: `#${tag.name}`,
    description: `Stories tagged with ${tag.name}`,
    path: `/tag/${slug}`,
  });
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const tag = await getTagBySlug(slug).catch(() => null);
  if (!tag) notFound();

  let posts: Awaited<ReturnType<typeof getPostsByTag>>['data'] = [];
  let totalPages = 1;

  try {
    const response = await getPostsByTag(slug, page);
    posts = response.data;
    totalPages = response.meta?.pagination?.pageCount || 1;
  } catch {
    // empty
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <p className="section-label">Tag</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-ink dark:text-cream">
          #{tag.name}
        </h1>
      </header>

      <PostGrid posts={posts} />
      <Pagination currentPage={page} totalPages={totalPages} basePath={`/tag/${slug}`} />
    </div>
  );
}
