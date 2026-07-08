import { buildPageMetadata } from '@/lib/seo';
import { AboutContent } from '@/components/about/AboutContent';

export const metadata = buildPageMetadata({
  title: 'About',
  description:
    'Meet Salina Maharjan — a tourism and hospitality professional, content writer, and lifelong learner sharing thoughtful articles on travel, health, lifestyle, and more.',
  path: '/about',
});

export default function AboutPage() {
  return <AboutContent />;
}
