import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  assembleSitemap,
  buildStaticSitemap,
  resetLastGoodSitemapDynamic,
  STATIC_SITEMAP_PAGES,
} from './sitemap.ts';

const SITE = 'https://salina-blog-mu.vercel.app';

const NEPAL_SLUGS = [
  'kathmandu-durbar-square',
  'kathmandu-thamel',
  'kathmandu-boudhanath',
  'kathmandu-pashupatinath',
  'kathmandu-swayambhunath',
];

function urls(entries: Array<{ url: string }>) {
  return entries.map((entry) => entry.url);
}

function hangingLoad() {
  return new Promise<{ slugs: string[] }>(() => {});
}

test('static sitemap always includes the shell pages', () => {
  const entries = buildStaticSitemap(SITE, new Date('2026-09-16T00:00:00.000Z'));
  assert.equal(entries.length, STATIC_SITEMAP_PAGES.length);
  assert.deepEqual(
    urls(entries),
    [
      SITE,
      `${SITE}/blog`,
      `${SITE}/categories`,
      `${SITE}/search`,
      `${SITE}/about`,
      `${SITE}/contact`,
    ]
  );
});

test('healthy CMS data is merged into the sitemap including Nepal slugs', async () => {
  resetLastGoodSitemapDynamic();
  const entries = await assembleSitemap({
    siteUrl: SITE,
    timeoutMs: 200,
    load: async () => ({
      slugs: NEPAL_SLUGS,
      categories: [{ slug: 'travel' }],
      tags: [{ slug: 'nepal' }],
    }),
  });

  const loc = urls(entries);
  for (const slug of NEPAL_SLUGS) {
    assert.ok(loc.includes(`${SITE}/blog/${slug}`), `missing ${slug}`);
  }
  assert.ok(loc.includes(`${SITE}/category/travel`));
  assert.ok(loc.includes(`${SITE}/tag/nepal`));
  assert.ok(loc.includes(`${SITE}/blog`));
});

test('CMS timeout still returns 200-equivalent static URLs', async () => {
  resetLastGoodSitemapDynamic();
  const started = Date.now();
  const entries = await assembleSitemap({
    siteUrl: SITE,
    timeoutMs: 40,
    load: hangingLoad,
  });
  assert.ok(Date.now() - started < 500);
  const loc = urls(entries);
  assert.ok(loc.includes(SITE));
  assert.ok(loc.includes(`${SITE}/blog`));
  assert.ok(loc.includes(`${SITE}/about`));
  assert.equal(loc.some((url) => url.includes('/blog/kathmandu-')), false);
});

test('CMS throw still returns the static shell', async () => {
  resetLastGoodSitemapDynamic();
  const entries = await assembleSitemap({
    siteUrl: SITE,
    timeoutMs: 200,
    load: async () => {
      throw new Error('Strapi request failed (503)');
    },
  });
  assert.deepEqual(urls(entries), urls(buildStaticSitemap(SITE, new Date(entries[0].lastModified as Date))));
});

test('last-known-good dynamic URLs are reused after a later CMS timeout', async () => {
  resetLastGoodSitemapDynamic();
  await assembleSitemap({
    siteUrl: SITE,
    timeoutMs: 200,
    load: async () => ({ slugs: NEPAL_SLUGS, categories: [], tags: [] }),
  });

  const entries = await assembleSitemap({
    siteUrl: SITE,
    timeoutMs: 40,
    load: hangingLoad,
  });

  const loc = urls(entries);
  assert.ok(loc.includes(`${SITE}/blog`));
  for (const slug of NEPAL_SLUGS) {
    assert.ok(loc.includes(`${SITE}/blog/${slug}`), `last-good missing ${slug}`);
  }
});

test('malformed CMS payloads do not throw and keep the static shell', async () => {
  resetLastGoodSitemapDynamic();
  const entries = await assembleSitemap({
    siteUrl: SITE,
    timeoutMs: 200,
    load: async () =>
      ({
        slugs: [null, '', 'kathmandu-thamel'],
        categories: { data: [{ slug: 'bad' }] },
        tags: undefined,
      }) as never,
  });
  const loc = urls(entries);
  assert.ok(loc.includes(`${SITE}/blog/kathmandu-thamel`));
  assert.equal(loc.includes(`${SITE}/category/bad`), false);
  assert.ok(loc.includes(`${SITE}/contact`));
});
