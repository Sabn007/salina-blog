import { Suspense } from 'react';
import { PostGrid } from '@/components/blog/PostGrid';
import { SearchForm } from '@/components/blog/SearchForm';
import { Pagination } from '@/components/ui/Pagination';
import { searchPosts } from '@/lib/strapi/queries';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Search',
  description: 'Search stories on Salina Journal.',
  path: '/search',
});

async function SearchResults({ query, page }: { query: string; page: number }) {
  if (!query.trim()) {
    return (
      <p className="text-center text-ink-muted dark:text-cream/50">
        Enter a search term to find stories.
      </p>
    );
  }

  let posts: Awaited<ReturnType<typeof searchPosts>>['data'] = [];
  let totalPages = 1;

  try {
    const response = await searchPosts(query, page);
    posts = response.data;
    totalPages = response.meta?.pagination?.pageCount || 1;
  } catch {
    // empty
  }

  return (
    <>
      <p className="mb-8 text-sm text-ink-muted dark:text-cream/50">
        {posts.length > 0
          ? `Found results for "${query}"`
          : `No results found for "${query}"`}
      </p>
      <PostGrid posts={posts} columns={2} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/search"
        query={{ q: query }}
      />
    </>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = '', page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <p className="section-label">Discover</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-ink dark:text-cream">
          Search
        </h1>
      </header>

      <div className="mx-auto mb-12">
        <Suspense>
          <SearchForm defaultValue={q} />
        </Suspense>
      </div>

      <SearchResults query={q} page={page} />
    </div>
  );
}
