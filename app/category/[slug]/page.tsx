import { notFound } from 'next/navigation';
import { PostGrid } from '@/components/blog/PostGrid';
import { Pagination } from '@/components/ui/Pagination';
import { getCategoryBySlug, getPostsByCategory } from '@/lib/strapi/queries';
import { buildPageMetadata } from '@/lib/seo';

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) return {};
  return buildPageMetadata({
    title: category.name,
    description: category.description || `Stories in ${category.name}`,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) notFound();

  let posts: Awaited<ReturnType<typeof getPostsByCategory>>['data'] = [];
  let totalPages = 1;

  try {
    const response = await getPostsByCategory(slug, page);
    posts = response.data;
    totalPages = response.meta?.pagination?.pageCount || 1;
  } catch {
    // empty
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <p className="section-label">Category</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-ink dark:text-cream">
          {category.name}
        </h1>
        {category.description && (
          <p className="mx-auto mt-4 max-w-xl text-ink-muted dark:text-cream/60">
            {category.description}
          </p>
        )}
      </header>

      <PostGrid posts={posts} />
      <Pagination currentPage={page} totalPages={totalPages} basePath={`/category/${slug}`} />
    </div>
  );
}
