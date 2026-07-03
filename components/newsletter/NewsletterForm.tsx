'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/lib/strapi/queries';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
  variant?: 'default' | 'footer' | 'inline';
  className?: string;
}

export function NewsletterForm({ variant = 'default', className }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await subscribeNewsletter(email, name || undefined);
      setStatus('success');
      setMessage('Welcome aboard! Check your inbox soon.');
      setEmail('');
      setName('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const isInline = variant === 'inline';

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-3', className)}>
      {variant === 'default' && (
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-sm border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-terracotta focus:outline-none dark:border-cream/20 dark:bg-charcoal dark:text-cream"
        />
      )}
      <div className={cn('flex gap-2', isInline ? 'flex-col sm:flex-row' : 'flex-col')}>
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-sm border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-terracotta focus:outline-none dark:border-cream/20 dark:bg-charcoal dark:text-cream"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-sm bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-terracotta-dark disabled:opacity-50"
        >
          {status === 'loading' ? 'Joining…' : 'Subscribe'}
        </button>
      </div>
      {message && (
        <p
          className={cn(
            'text-sm',
            status === 'success' ? 'text-sage' : 'text-red-600 dark:text-red-400'
          )}
        >
          {message}
        </p>
      )}
    </form>
  );
}
