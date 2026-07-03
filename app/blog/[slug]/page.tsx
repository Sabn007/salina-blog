import { notFound } from 'next/navigation';
import Script from 'next/script';
import DOMPurify from 'isomorphic-dompurify';
import { PostHero } from '@/components/blog/PostHero';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { RelatedPosts, PostGallery } from '@/components/blog/RelatedPosts';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { AdSense } from '@/components/ads/AdSense';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { getAllPostSlugs, getPostBySlug } from '@/lib/strapi/queries';
import { buildArticleJsonLd, buildPostMetadata } from '@/lib/seo';
import Link from 'next/link';

export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const post = await getPostBySlug(slug, preview === 'true').catch(() => null);
  if (!post) return {};
  return buildPostMetadata(post);
}

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  const post = await getPostBySlug(slug, isPreview).catch(() => null);
  if (!post) notFound();

  const sanitizedContent = DOMPurify.sanitize(post.content);
  const jsonLd = buildArticleJsonLd(post);

  return (
    <>
      <ReadingProgress />
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {isPreview && (
        <div className="bg-gold px-4 py-2 text-center text-sm font-medium text-charcoal">
          Preview mode — this post may not be published yet.
        </div>
      )}

      <PostHero post={post} />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <AdSense slot="article-top" className="mb-8" />

        <div
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {post.gallery && post.gallery.length > 0 && (
          <PostGallery images={post.gallery} />
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2 border-t border-ink/10 pt-8 dark:border-cream/10">
            {post.tags.map((tag) => (
              <Link
                key={tag.documentId}
                href={`/tag/${tag.slug}`}
                className="rounded-full border border-ink/10 px-4 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-terracotta hover:text-terracotta dark:border-cream/20 dark:text-cream/60"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8">
          <ShareButtons post={post} />
        </div>

        <AdSense slot="article-mid" className="my-12" />

        <div className="rounded-sm bg-cream-dark p-8 dark:bg-charcoal-light">
          <p className="section-label">Newsletter</p>
          <h3 className="mt-2 font-display text-2xl font-medium text-ink dark:text-cream">
            Never miss a story
          </h3>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <RelatedPosts posts={post.relatedPosts} />
        )}
      </article>
    </>
  );
}
