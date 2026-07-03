'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function SearchForm({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('q', query.trim());
      params.delete('page');
    } else {
      params.delete('q');
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stories, destinations, ideas…"
        className="w-full rounded-sm border border-ink/10 bg-white py-4 pl-5 pr-14 text-lg text-ink placeholder:text-ink-muted focus:border-terracotta focus:outline-none dark:border-cream/20 dark:bg-charcoal-light dark:text-cream"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-2 text-ink-muted transition-colors hover:text-terracotta dark:text-cream/50"
        aria-label="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>
    </form>
  );
}
