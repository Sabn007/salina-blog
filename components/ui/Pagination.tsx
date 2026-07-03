import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, basePath, query }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(query);
    if (page > 1) params.set('page', String(page));
    else params.delete('page');
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="rounded-sm border border-ink/10 px-4 py-2 text-sm transition-colors hover:border-terracotta hover:text-terracotta dark:border-cream/20"
        >
          Previous
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={buildUrl(page)}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-sm text-sm transition-colors',
            page === currentPage
              ? 'bg-terracotta text-white'
              : 'border border-ink/10 hover:border-terracotta hover:text-terracotta dark:border-cream/20'
          )}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="rounded-sm border border-ink/10 px-4 py-2 text-sm transition-colors hover:border-terracotta hover:text-terracotta dark:border-cream/20"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
