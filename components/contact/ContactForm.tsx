'use client';

import { useState } from 'react';
import { submitContactMessage } from '@/lib/strapi/queries';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitContactMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink dark:text-cream">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-sm border border-ink/10 bg-white px-4 py-3 text-ink focus:border-terracotta focus:outline-none dark:border-cream/20 dark:bg-charcoal-light dark:text-cream"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink dark:text-cream">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-sm border border-ink/10 bg-white px-4 py-3 text-ink focus:border-terracotta focus:outline-none dark:border-cream/20 dark:bg-charcoal-light dark:text-cream"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-2 block text-sm font-medium text-ink dark:text-cream">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full rounded-sm border border-ink/10 bg-white px-4 py-3 text-ink focus:border-terracotta focus:outline-none dark:border-cream/20 dark:bg-charcoal-light dark:text-cream"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink dark:text-cream">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full resize-y rounded-sm border border-ink/10 bg-white px-4 py-3 text-ink focus:border-terracotta focus:outline-none dark:border-cream/20 dark:bg-charcoal-light dark:text-cream"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-sm bg-terracotta py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-terracotta-dark disabled:opacity-50 sm:w-auto sm:px-12"
      >
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
      {status === 'success' && (
        <p className="text-sm text-sage">Message sent! We&apos;ll be in touch soon.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to send. Please try again or email us directly.
        </p>
      )}
    </form>
  );
}
