/**
 * SEO metadata for every indexable route. Shared by the useSEO hook (wired in
 * App) and scripts/prerender-routes.mjs (static HTML, sitemap, serve.json),
 * so keep it plain JS with no JSX or browser-only imports.
 */

import { ARTICLES, ARTICLE_CONTENT } from './data/blog.js'

export const SITE = {
  name: 'SalaryDecode',
  baseUrl: 'https://salary.doaide.com',
  ogImage: 'https://salary.doaide.com/og-salary.png',
}

const ORG = { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' }

// Fit "<title> | SalaryDecode" into ~70 chars; long titles go without it.
const withSuffix = (title) => (`${title} | SalaryDecode`.length <= 70 ? `${title} | SalaryDecode` : title)

const tool = (path, h1, title, description) => ({ path, h1, title: withSuffix(title), description, kind: 'tool' })

export const routes = [
  {
    path: '/',
    kind: 'home',
    h1: 'Calculate Your In-Hand Salary from CTC in Seconds',
    title: 'SalaryDecode — CTC to In-Hand Salary Calculator India FY 2026-27',
    description:
      'Free CTC to take-home salary calculator for Indian professionals. Compare old vs new tax regime FY 2026-27, salary hike impact, and job offers.',
  },
  tool(
    '/calculator',
    'CTC to In-Hand Salary Calculator',
    'CTC to In-Hand Salary Calculator FY 2026-27',
    'Calculate take-home salary from CTC for FY 2026-27: basic, HRA, PF, gratuity and income tax with surcharge under old and new regimes.'
  ),
  tool(
    '/compare',
    'Offer Letter Comparator',
    'Job Offer Comparator — Compare In-Hand Salary',
    'Compare 2-3 job offers side by side and see which one actually pays the most in hand after tax, PF and deductions. Free, no signup.'
  ),
  tool(
    '/hike',
    'Salary Hike Calculator',
    'Salary Hike Calculator — Real In-Hand Increase',
    'See how much of your CTC hike actually reaches your bank account after tax, PF and deductions. Free salary hike calculator for India.'
  ),
  {
    path: '/blog',
    kind: 'blog',
    h1: 'Salary & Tax Blog',
    title: withSuffix('Salary & Tax Blog — Guides for Indian Professionals'),
    description:
      'Guides on salary negotiation, tax planning for FY 2026-27, HRA exemption and reading your payslip, for Indian professionals.',
  },
  ...ARTICLES.map((a) => ({
    path: `/blog/${a.slug}`,
    kind: 'post',
    h1: ARTICLE_CONTENT[a.slug].title,
    title: withSuffix(ARTICLE_CONTENT[a.slug].title),
    description: a.excerpt,
    published: a.published,
    faqs: ARTICLE_CONTENT[a.slug].faqs,
  })),
]

export const canonicalFor = (path) => `${SITE.baseUrl}${path}`

export const metaForPath = (path) => routes.find((r) => r.path === path)

export function jsonLdFor(route) {
  const url = canonicalFor(route.path)
  let main
  switch (route.kind) {
    case 'home':
    case 'tool':
      main = {
        '@type': 'WebApplication',
        name: route.kind === 'home' ? SITE.name : route.h1,
        url,
        description: route.description,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        author: ORG,
      }
      break
    case 'post':
      main = {
        '@type': 'BlogPosting',
        headline: route.h1,
        description: route.description,
        url,
        mainEntityOfPage: url,
        datePublished: route.published,
        author: ORG,
        publisher: ORG,
      }
      break
    default:
      main = { '@type': 'Blog', name: route.h1, url, description: route.description, publisher: ORG }
  }
  const graph = [main]
  if (route.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: route.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}
