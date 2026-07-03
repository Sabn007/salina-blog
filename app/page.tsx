import Link from 'next/link';
import { PostCard } from '@/components/blog/PostCard';
import { PostGrid } from '@/components/blog/PostGrid';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { AdSense } from '@/components/ads/AdSense';
import { getFeaturedPosts, getPosts, getCategories } from '@/lib/strapi/queries';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Home',
  description:
    'A premium lifestyle and travel journal — curated stories, destinations, and inspiration for the modern wanderer.',
});

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof getFeaturedPosts>>['data'] = [];
  let recent: Awaited<ReturnType<typeof getPosts>>['data'] = [];
  let categories: Awaited<ReturnType<typeof getCategories>>['data'] = [];

  try {
    const [featuredRes, recentRes, categoriesRes] = await Promise.all([
      getFeaturedPosts(1),
      getPosts(1, 6),
      getCategories(),
    ]);
    featured = featuredRes.data;
    recent = recentRes.data;
    categories = categoriesRes.data;
  } catch {
    // Strapi may not be running during build — show empty state
  }

  const heroPost = featured[0] || recent[0];
  const gridPosts = recent.filter((p) => p.documentId !== heroPost?.documentId);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-sage px-4 py-24 text-cream sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gold blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-terracotta blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="section-label text-gold">Lifestyle & Travel Journal</p>
          <h1 className="mt-4 font-display text-5xl font-medium leading-tight tracking-tight md:text-7xl">
            Stories for the
            <br />
            <em className="text-gold">Curious Wanderer</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/80">
            Discover curated travel guides, hotel reviews, and lifestyle inspiration from
            destinations around the world.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/blog"
              className="rounded-sm bg-terracotta px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-terracotta-dark"
            >
              Read the Journal
            </Link>
            <Link
              href="/about"
              className="rounded-sm border border-cream/30 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-cream transition-colors hover:border-cream hover:bg-cream/10"
            >
              About Salina
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {heroPost && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="section-label">Featured Story</p>
              <h2 className="mt-2 font-display text-3xl font-medium text-ink dark:text-cream">
                Editor&apos;s Pick
              </h2>
            </div>
          </div>
          <PostCard post={heroPost} variant="featured" priority />
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSense slot="home-mid" className="my-4" />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="section-label">Browse</p>
              <h2 className="mt-2 font-display text-3xl font-medium text-ink dark:text-cream">
                Categories
              </h2>
            </div>
            <Link
              href="/categories"
              className="text-sm font-medium text-terracotta transition-colors hover:text-terracotta-dark"
            >
              View All →
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.documentId}
                href={`/category/${category.slug}`}
                className="rounded-full border border-ink/10 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta dark:border-cream/20 dark:text-cream"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="section-label">Latest</p>
            <h2 className="mt-2 font-display text-3xl font-medium text-ink dark:text-cream">
              Recent Stories
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-terracotta transition-colors hover:text-terracotta-dark"
          >
            View All →
          </Link>
        </div>
        <PostGrid posts={gridPosts} />
      </section>

      {/* Newsletter CTA */}
      <section className="bg-cream-dark px-4 py-20 dark:bg-charcoal-light sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Stay Inspired</p>
          <h2 className="mt-4 font-display text-4xl font-medium text-ink dark:text-cream">
            Join the Salina Circle
          </h2>
          <p className="mt-4 text-ink-muted dark:text-cream/60">
            Weekly dispatches on travel, style, and slow living — no spam, ever.
          </p>
          <div className="mt-8">
            <NewsletterForm variant="inline" />
          </div>
        </div>
      </section>
    </>
  );
}
