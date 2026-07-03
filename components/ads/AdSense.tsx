import { cn } from '@/lib/utils';

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}

/**
 * Google AdSense placeholder component.
 * Replace NEXT_PUBLIC_ADSENSE_CLIENT_ID in .env.local with your publisher ID.
 * Uncomment the Script in app/layout.tsx when ready to go live.
 */
export function AdSense({
  slot,
  format = 'auto',
  className,
  label = 'Advertisement',
}: AdSenseProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId) {
    return (
      <div
        className={cn(
          'flex min-h-[90px] items-center justify-center rounded-sm border border-dashed border-ink/10 bg-ink/[0.02] dark:border-cream/10 dark:bg-cream/[0.02]',
          className
        )}
      >
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-ink-muted dark:text-cream/40">
            {label}
          </p>
          <p className="mt-1 text-xs text-ink-muted/60 dark:text-cream/30">
            Ad slot: {slot}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
