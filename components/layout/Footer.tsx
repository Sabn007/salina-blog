import Link from 'next/link';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-ink/5 bg-cream-dark dark:border-cream/10 dark:bg-charcoal-light">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div>
            <Link href="/" className="font-display text-3xl font-medium text-ink dark:text-cream">
              Salina
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted dark:text-cream/60">
              Curated stories on travel, lifestyle, and the art of slow living — written for
              wanderers with impeccable taste.
            </p>
          </div>

          <div>
            <h3 className="section-label mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/blog', label: 'All Stories' },
                { href: '/categories', label: 'Categories' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink/70 transition-colors hover:text-terracotta dark:text-cream/70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-label mb-4">Newsletter</h3>
            <p className="mb-4 text-sm text-ink-muted dark:text-cream/60">
              Weekly inspiration delivered to your inbox.
            </p>
            <NewsletterForm variant="footer" />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink/5 pt-8 text-xs text-ink-muted sm:flex-row dark:border-cream/10 dark:text-cream/50">
          <p>&copy; {year} Salina Journal. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/feed.xml" className="hover:text-terracotta">
              RSS Feed
            </Link>
            <Link href="/privacy" className="hover:text-terracotta">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
