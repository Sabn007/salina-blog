import { Suspense } from 'react';
import { PostGrid } from '@/components/blog/PostGrid';
import { SearchForm } from '@/components/blog/SearchForm';
import { Pagination } from '@/components/ui/Pagination';
import { searchPosts } from '@/lib/strapi/queries';
import { settleCms } from '@/lib/strapi/client';
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
  let fetchFailed = false;

  const result = await settleCms(`search "${query}"`, searchPosts(query, page));
  if (result.ok) {
    posts = result.data.data;
    totalPages = result.data.meta?.pagination?.pageCount || 1;
  } else {
    fetchFailed = true;
  }

  return (
    <>
      <p className="mb-8 text-sm text-ink-muted dark:text-cream/50">
        {fetchFailed
          ? `We couldn't search for "${query}" right now.`
          : posts.length > 0
            ? `Found results for "${query}"`
            : `No results found for "${query}"`}
      </p>
      <PostGrid posts={posts} columns={2} error={fetchFailed} />
      {!fetchFailed && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/search"
          query={{ q: query }}
        />
      )}
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
