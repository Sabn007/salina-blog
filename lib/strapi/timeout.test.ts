import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CmsTimeoutError,
  isAbortLikeError,
  raceWithTimeout,
  shouldRetryNetworkError,
  timeoutSignal,
} from './timeout.ts';

test('isAbortLikeError detects abort and timeout errors', () => {
  const abort = new Error('This operation was aborted');
  abort.name = 'AbortError';
  const timeout = new CmsTimeoutError('sitemap slugs', 50);
  assert.equal(isAbortLikeError(abort), true);
  assert.equal(isAbortLikeError(timeout), true);
  assert.equal(isAbortLikeError(new Error('ECONNREFUSED')), false);
});

test('timeouts and aborts are not retried', () => {
  const abort = new Error('aborted');
  abort.name = 'AbortError';
  assert.equal(shouldRetryNetworkError(abort, 1, 2), false);
  assert.equal(shouldRetryNetworkError(new CmsTimeoutError('cms', 8_000), 1, 2), false);
  assert.equal(shouldRetryNetworkError(new Error('fetch failed'), 1, 2), true);
  assert.equal(shouldRetryNetworkError(new Error('fetch failed'), 2, 2), false);
});

test('raceWithTimeout resolves when the work finishes in budget', async () => {
  const value = await raceWithTimeout(Promise.resolve('ok'), 200, 'fast');
  assert.equal(value, 'ok');
});

test('raceWithTimeout rejects hanging work instead of waiting forever', async () => {
  const hanging = new Promise<string>(() => {});
  const started = Date.now();
  await assert.rejects(() => raceWithTimeout(hanging, 40, 'sitemap cms'), (error: unknown) => {
    assert.ok(error instanceof CmsTimeoutError);
    assert.match(error.message, /timed out after 40ms/);
    return true;
  });
  assert.ok(Date.now() - started < 500);
});

test('timeoutSignal fires AbortError within the budget', async () => {
  const signal = timeoutSignal(40);
  assert.ok(signal);
  const started = Date.now();
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('signal did not abort')), 500);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve();
    });
  });
  assert.ok(isAbortLikeError(signal.reason) || signal.aborted);
  assert.ok(Date.now() - started < 500);
});
