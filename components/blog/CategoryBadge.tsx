import Link from 'next/link';
import type { Category } from '@/types/strapi';
import { cn } from '@/lib/utils';

export function CategoryBadge({
  category,
  className,
}: {
  category: Pick<Category, 'name' | 'slug'>;
  className?: string;
}) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        'inline-block text-xs font-semibold uppercase tracking-[0.15em] text-terracotta transition-colors hover:text-terracotta-dark',
        className
      )}
    >
      {category.name}
    </Link>
  );
}
