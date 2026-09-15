import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  canAccessDrafts,
  getAuthStrategyName,
  queryRequestsDrafts,
} from './draft-access';

describe('queryRequestsDrafts', () => {
  it('returns false when status is omitted or published', () => {
    assert.equal(queryRequestsDrafts(undefined), false);
    assert.equal(queryRequestsDrafts({}), false);
    assert.equal(queryRequestsDrafts({ status: 'published' }), false);
    assert.equal(queryRequestsDrafts({ filters: { slug: { $eq: 'te' } } }), false);
  });

  it('detects status=draft in common query shapes', () => {
    assert.equal(queryRequestsDrafts({ status: 'draft' }), true);
    assert.equal(queryRequestsDrafts({ status: 'DRAFT' }), true);
    assert.equal(queryRequestsDrafts({ status: ' draft ' }), true);
    assert.equal(queryRequestsDrafts({ status: ['draft'] }), true);
    assert.equal(queryRequestsDrafts({ status: ['published', 'draft'] }), true);
  });

  it('detects Strapi 4 publicationState=preview', () => {
    assert.equal(queryRequestsDrafts({ publicationState: 'preview' }), true);
    assert.equal(queryRequestsDrafts({ publicationState: 'live' }), false);
  });
});

describe('canAccessDrafts', () => {
  it('denies public and users-permissions callers', () => {
    assert.equal(canAccessDrafts(undefined), false);
    assert.equal(canAccessDrafts(null), false);
    assert.equal(canAccessDrafts({}), false);
    assert.equal(canAccessDrafts({ strategy: { name: 'users-permissions' } }), false);
  });

  it('allows content API tokens and admin strategies', () => {
    assert.equal(canAccessDrafts({ strategy: { name: 'content-api-token' } }), true);
    assert.equal(canAccessDrafts({ strategy: { name: 'api-token' } }), true);
    assert.equal(canAccessDrafts({ strategy: { name: 'admin-token' } }), true);
    assert.equal(canAccessDrafts({ strategy: { name: 'admin' } }), true);
    assert.equal(canAccessDrafts({ strategy: 'content-api-token' }), true);
  });
});

describe('getAuthStrategyName', () => {
  it('reads string or object strategy shapes', () => {
    assert.equal(getAuthStrategyName({ strategy: 'admin' }), 'admin');
    assert.equal(getAuthStrategyName({ strategy: { name: 'content-api-token' } }), 'content-api-token');
    assert.equal(getAuthStrategyName({}), undefined);
  });
});
