import { RetryButton } from './RetryButton';

export function CmsEmptyState({
  error = false,
  title,
  description,
  resource = 'stories',
}: {
  error?: boolean;
  title?: string;
  description?: string;
  resource?: string;
}) {
  const heading = error
    ? title || `We couldn't load ${resource}`
    : title || `No ${resource} found yet.`;
  const body = error
    ? description ||
      'The journal CMS may be waking up from sleep on the free tier — this can take up to a minute. Please try again.'
    : description || 'Check back soon for new content.';

  return (
    <div className="py-16 text-center">
      <p className="font-display text-2xl text-ink-muted dark:text-cream/50">{heading}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted dark:text-cream/40">{body}</p>
      {error && <RetryButton />}
    </div>
  );
}
