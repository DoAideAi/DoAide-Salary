import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ARTICLES, ARTICLE_CONTENT } from '../data/blog';
import { jsonLdFor, metaForPath, routes } from '../routeMeta';

const appSrc = readFileSync(resolve(process.cwd(), 'src/App.jsx'), 'utf-8');

describe('routeMeta', () => {
  it('has unique paths, titles and descriptions', () => {
    for (const key of ['path', 'title', 'description']) {
      const values = routes.map((r) => r[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it('only lists routes the router serves', () => {
    const served = new Set([...appSrc.matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]));
    for (const r of routes) expect(served.has(r.path) || r.path.startsWith('/blog/'), r.path).toBe(true);
  });

  it('covers every article with an ISO-dated BlogPosting and complete FAQs', () => {
    expect(Object.keys(ARTICLE_CONTENT).sort()).toEqual(ARTICLES.map((a) => a.slug).sort());
    for (const a of ARTICLES) {
      const graph = jsonLdFor(metaForPath(`/blog/${a.slug}`))['@graph'];
      expect(graph[0].datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const q of graph.find((n) => n['@type'] === 'FAQPage')?.mainEntity ?? []) {
        expect(q.name && q.acceptedAnswer.text).toBeTruthy();
      }
    }
  });

  it('keeps titles within 70 chars', () => {
    for (const r of routes) expect(r.title.length, r.path).toBeLessThanOrEqual(70);
  });
});
