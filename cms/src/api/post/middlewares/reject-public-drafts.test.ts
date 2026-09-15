import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import createRejectPublicDrafts from './reject-public-drafts';

type TestContext = {
  query?: unknown;
  state?: { auth?: { strategy?: string | { name?: string } } };
  forbidden: (message?: string) => string;
};

function runMiddleware(ctx: TestContext) {
  const middleware = createRejectPublicDrafts({}, {});
  let nextCalled = false;
  const result = middleware(ctx, async () => {
    nextCalled = true;
  });

  return { result, get nextCalled() { return nextCalled; } };
}

describe('reject-public-drafts middleware', () => {
  it('lets anonymous published reads through', async () => {
    const ctx: TestContext = {
      query: { 'filters[publishedAt][$notNull]': 'true' },
      forbidden: () => 'forbidden',
    };

    const run = runMiddleware(ctx);
    await run.result;
    assert.equal(run.nextCalled, true);
  });

  it('forbids anonymous status=draft', async () => {
    let forbiddenMessage: string | undefined;
    const ctx: TestContext = {
      query: { status: 'draft' },
      state: { auth: { strategy: { name: 'users-permissions' } } },
      forbidden: (message) => {
        forbiddenMessage = message;
        return 'forbidden';
      },
    };

    const run = runMiddleware(ctx);
    await run.result;
    assert.equal(run.nextCalled, false);
    assert.match(forbiddenMessage ?? '', /Draft documents/);
  });

  it('allows API-token preview of drafts', async () => {
    const ctx: TestContext = {
      query: { status: 'draft' },
      state: { auth: { strategy: { name: 'content-api-token' } } },
      forbidden: () => 'forbidden',
    };

    const run = runMiddleware(ctx);
    await run.result;
    assert.equal(run.nextCalled, true);
  });
});
