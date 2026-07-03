import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AffiliateLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  rel?: string;
}

export function AffiliateLink({ href, children, className, rel }: AffiliateLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel={rel || 'noopener noreferrer sponsored'}
      className={cn(
        'inline-flex items-center gap-1 font-medium text-terracotta underline decoration-terracotta/30 underline-offset-4 transition-colors hover:text-terracotta-dark',
        className
      )}
    >
      {children}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
      </svg>
    </Link>
  );
}

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  price?: string;
  href: string;
  brand?: string;
}

export function ProductCard({ title, description, image, price, href, brand }: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-sm border border-ink/10 bg-white dark:border-cream/10 dark:bg-charcoal-light">
      <div className="relative aspect-square">
        <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 300px" />
      </div>
      <div className="p-5">
        {brand && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-terracotta">
            {brand}
          </p>
        )}
        <h3 className="mt-1 font-display text-lg font-medium text-ink dark:text-cream">{title}</h3>
        <p className="mt-2 text-sm text-ink-muted dark:text-cream/60">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          {price && <span className="text-sm font-semibold text-ink dark:text-cream">{price}</span>}
          <AffiliateLink href={href} className="text-sm no-underline">
            Shop Now
          </AffiliateLink>
        </div>
        <p className="mt-3 text-[10px] text-ink-muted/60 dark:text-cream/30">
          Affiliate link — we may earn a commission.
        </p>
      </div>
    </div>
  );
}
