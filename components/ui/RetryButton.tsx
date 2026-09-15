'use client';

import { useRouter } from 'next/navigation';

export function RetryButton({ label = 'Try again' }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="mt-6 rounded-sm bg-terracotta px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-terracotta-dark"
    >
      {label}
    </button>
  );
}
