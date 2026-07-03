import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/lib/strapi/queries';
import { getStrapiMedia } from '@/lib/strapi/client';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Categories',
  description: 'Browse stories by category on Salina Journal.',
  path: '/categories',
});

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof getCategories>>['data'] = [];

  try {
    const response = await getCategories();
    categories = response.data;
  } catch {
    // empty
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <p className="section-label">Browse</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-ink dark:text-cream">
          Categories
        </h1>
      </header>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const imageUrl =
            category.coverImage?.formats?.medium?.url || category.coverImage?.url;

          return (
            <Link
              key={category.documentId}
              href={`/category/${category.slug}`}
              className="group card-hover overflow-hidden rounded-sm bg-white dark:bg-charcoal-light"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={getStrapiMedia(imageUrl)}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-sage/10">
                    <span className="font-display text-5xl text-sage/30">{category.name[0]}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="font-display text-2xl font-medium text-cream">{category.name}</h2>
                  {category.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-cream/70">{category.description}</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {categories.length === 0 && (
        <p className="py-16 text-center text-ink-muted dark:text-cream/50">
          No categories yet. Create them in the Strapi admin.
        </p>
      )}
    </div>
  );
}
