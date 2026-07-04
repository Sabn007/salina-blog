import { buildPageMetadata } from '@/lib/seo';
import { AboutContent } from '@/components/about/AboutContent';

export const metadata = buildPageMetadata({
  title: 'About',
  description:
    'Meet Salina Maharjan — a tourism and hospitality professional sharing authentic travel guides, cultural stories, and hidden gems of Nepal.',
  path: '/about',
});

export default function AboutPage() {
  return <AboutContent />;
}
