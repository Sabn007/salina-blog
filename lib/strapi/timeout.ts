/** Short budget so a sleeping Render CMS cannot stall metadata routes. */
export const CMS_SITEMAP_TIMEOUT_MS = 8_000;

export class CmsTimeoutError extends Error {
  label: string;
  timeoutMs: number;

  constructor(label: string, timeoutMs: number) {
    super(`${label} timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
    this.label = label;
    this.timeoutMs = timeoutMs;
  }
}

export function isAbortLikeError(error: unknown): boolean {
  if (error == null || typeof error !== 'object') return false;
  const name = 'name' in error ? String((error as { name?: unknown }).name) : '';
  const message = 'message' in error ? String((error as { message?: unknown }).message) : '';
  return (
    name === 'AbortError' ||
    name === 'TimeoutError' ||
    /aborted/i.test(message) ||
    /timed out after/i.test(message)
  );
}

export function timeoutSignal(timeoutMs?: number): AbortSignal | undefined {
  if (!timeoutMs || timeoutMs <= 0) return undefined;
  return AbortSignal.timeout(timeoutMs);
}

/** Network/timeout errors that should not consume another CMS attempt. */
export function shouldRetryNetworkError(error: unknown, attempt: number, maxAttempts: number): boolean {
  if (attempt >= maxAttempts) return false;
  if (isAbortLikeError(error)) return false;
  return true;
}

export function raceWithTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  if (!timeoutMs || timeoutMs <= 0) return promise;

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new CmsTimeoutError(label, timeoutMs)), timeoutMs);
  });

  // If the timeout wins, a later rejection from `promise` must not be unhandled.
  void promise.catch(() => undefined);

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}
