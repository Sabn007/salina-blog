import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  PRODUCTION_SITE_URL,
  PRODUCTION_STRAPI_URL,
  LOCAL_SITE_URL,
  LOCAL_STRAPI_URL,
  isCmsHost,
  resolveSiteUrl,
  resolveStrapiUrl,
} from './site.ts';

test('production SITE_URL equal to STRAPI_URL is rejected', () => {
  const result = resolveSiteUrl({
    siteUrl: PRODUCTION_STRAPI_URL,
    strapiUrl: PRODUCTION_STRAPI_URL,
    nodeEnv: 'production',
  });
  assert.equal(result.url, PRODUCTION_SITE_URL);
  assert.ok(result.warnings.some((warning) => warning.includes('CMS host')));
});

test('explicit Vercel SITE_URL is kept', () => {
  const result = resolveSiteUrl({
    siteUrl: PRODUCTION_SITE_URL,
    strapiUrl: PRODUCTION_STRAPI_URL,
    nodeEnv: 'production',
  });
  assert.equal(result.url, PRODUCTION_SITE_URL);
  assert.equal(result.warnings.length, 0);
});

test('unset SITE_URL in production defaults to the frontend', () => {
  const result = resolveSiteUrl({
    strapiUrl: PRODUCTION_STRAPI_URL,
    nodeEnv: 'production',
  });
  assert.equal(result.url, PRODUCTION_SITE_URL);
});

test('unset STRAPI_URL in production does not fall back to localhost', () => {
  const result = resolveStrapiUrl({ nodeEnv: 'production' });
  assert.equal(result.url, PRODUCTION_STRAPI_URL);
  assert.notEqual(result.url, LOCAL_STRAPI_URL);
});

test('localhost STRAPI_URL in production is replaced', () => {
  const result = resolveStrapiUrl({
    strapiUrl: LOCAL_STRAPI_URL,
    nodeEnv: 'production',
  });
  assert.equal(result.url, PRODUCTION_STRAPI_URL);
});

test('local defaults stay local', () => {
  assert.equal(resolveSiteUrl({ nodeEnv: 'development' }).url, LOCAL_SITE_URL);
  assert.equal(resolveStrapiUrl({ nodeEnv: 'development' }).url, LOCAL_STRAPI_URL);
});

test('isCmsHost detects the Render CMS host', () => {
  assert.equal(isCmsHost(PRODUCTION_STRAPI_URL), true);
  assert.equal(isCmsHost(PRODUCTION_SITE_URL, PRODUCTION_STRAPI_URL), false);
  assert.equal(isCmsHost(LOCAL_STRAPI_URL), true);
});
