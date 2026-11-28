const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// 1. Required schema types must exist in the single source of truth.
const sd = read('lib/structured-data.ts');
const requiredTypes = [
  'Organization', 'WebSite', 'BreadcrumbList', 'WebPage',
  'TechArticle', 'AboutPage', 'FAQPage'
];
for (const type of requiredTypes) {
  assert(sd.includes(`'@type': '${type}'`), `missing schema type: ${type}`);
}

// 2. Never fabricate trust, review, or pricing signals.
const forbidden = [
  /['"]aggregateRating['"]\s*:/,
  /['"]ratingValue['"]\s*:/,
  /['"]reviewCount['"]\s*:/,
  /['"]@type['"]\s*:\s*['"]Review['"]/,
  /['"]offers['"]\s*:/,
  /['"]price['"]\s*:/
];
for (const pattern of forbidden) {
  assert(!pattern.test(sd), `fabricated schema field present: ${pattern}`);
}
for (const m of sd.matchAll(/https?:\/\/[^\s'"`]+/g)) {
  assert(
    m[0].startsWith('https://www.zhibeimao.com') ||
    m[0].startsWith('https://api.zhibeimao.com') ||
    m[0] === 'https://schema.org',
    `unexpected absolute URL in schema data: ${m[0]}`
  );
}

// 3. FAQ copy and FAQPage JSON-LD must share one source, and the copy must be visible.
const faqBlock = sd.slice(sd.indexOf('export const apiFaq'), sd.indexOf('export const apiFaqSchema'));
const questionCount = (faqBlock.match(/question:/g) || []).length;
const answerCount = (faqBlock.match(/answer:/g) || []).length;
assert.equal(questionCount, 5, 'expected 5 FAQ questions');
assert.equal(answerCount, questionCount, 'each FAQ question needs exactly one answer');
assert(sd.includes('acceptedAnswer'), 'FAQPage must include acceptedAnswer');

const docs = read('app/api/docs/page.tsx');
assert(docs.includes('apiFaq.map'), 'FAQ must render from the shared data, not duplicated copy');
assert(docs.includes('apiFaqSchema'), 'FAQPage schema must be emitted on the docs page');
assert(docs.includes('docsBreadcrumbSchema'), 'docs page must emit breadcrumbs');
assert(docs.includes('item.question'), 'FAQ question text must come from shared data');
assert(docs.includes('item.answer'), 'FAQ answer text must come from shared data');

// 4. Every canonical page keeps its canonical URL and gains social metadata.
const pages = [
  'app/page.tsx',
  'app/api/page.tsx',
  'app/api/docs/page.tsx',
  'app/about/page.tsx'
];
for (const page of pages) {
  const source = read(page);
  assert(/alternates:\s*\{\s*canonical:/.test(source), `${page}: missing canonical`);
  assert(source.includes('openGraph:'), `${page}: missing openGraph`);
  assert(source.includes('twitter:'), `${page}: missing twitter`);
}
for (const page of pages.slice(1)) {
  assert(read(page).includes('StructuredData'), `${page}: missing StructuredData render`);
}
assert(read('app/layout.tsx').includes('siteGraphSchema'), 'root layout must emit the site graph');

console.log('PASS structured-data: 7 schema types, 5 synced FAQ entries, 4 canonical pages, no fabricated fields');
