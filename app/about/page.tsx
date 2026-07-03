import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'About',
  description: 'About Salina Journal — a premium lifestyle and travel blog.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <p className="section-label">Our Story</p>
        <h1 className="mt-2 font-display text-5xl font-medium text-ink dark:text-cream">
          About Salina
        </h1>
      </header>

      <div className="prose-blog space-y-6">
        <p>
          Salina Journal is a curated space for travellers who appreciate the finer details —
          boutique hotels tucked into cobblestone streets, sunrise markets in far-flung cities,
          and the quiet rituals that make a journey unforgettable.
        </p>
        <p>
          Founded on the belief that travel is as much about how you experience a place as where
          you go, we publish thoughtful guides, honest reviews, and lifestyle inspiration for the
          modern wanderer.
        </p>
        <h2>What We Cover</h2>
        <ul>
          <li>Destination guides and itineraries</li>
          <li>Luxury and boutique hotel reviews</li>
          <li>Travel style and packing essentials</li>
          <li>Slow living and mindful exploration</li>
        </ul>
        <p>
          Every story is crafted with care — because the best journeys deserve to be told
          beautifully.
        </p>
      </div>
    </div>
  );
}
