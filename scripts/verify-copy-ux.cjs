/** CI guard for the developer-experience improvement on /api/docs.
 *  Offline only. Never touches the network or credentials. */
const assert = require('node:assert/strict');
const fs = require('node:fs');

const docs = fs.readFileSync('app/api/docs/page.tsx', 'utf8');
const button = fs.readFileSync('components/CopyButton.tsx', 'utf8');
const layout = fs.readFileSync('app/layout.tsx', 'utf8');

// --- the copy control must be accessible and degrade gracefully.
assert(button.startsWith("'use client';"), 'CopyButton must be a client component');
assert(button.includes('navigator.clipboard.writeText(text)'), 'copy must use the Clipboard API');
assert(button.includes('aria-live="polite"'), 'copy result must be announced');
assert(button.includes('请手动选中'), 'clipboard-denied fallback must be visible');
assert(button.includes('已复制'), 'success state must be visible');

// --- real coverage, not a single decorative button.
const usages = [...docs.matchAll(/<CopyButton\b/g)].length;
assert(usages >= 6, 'expected copy controls on base URL, alt URL, auth header, curl, python and models command; found ' + usages);
for (const label of ['复制地址', '复制备选', '复制请求头', '复制 cURL', '复制 Python', '复制命令']) {
  assert(docs.includes('label="' + label + '"'), 'missing copy control: ' + label);
}
const copyTargets = ['text={baseUrl}', 'text={alternativeApiBaseUrl}', 'text={curlExample}',
  'text={pythonExample}', 'text={modelsExample}', 'text="Authorization: Bearer YOUR_API_KEY"'];
for (const target of copyTargets) {
  assert(docs.includes(target), 'copy control must copy the real value: ' + target);
}

// --- new troubleshooting content is visible and factual.
assert(docs.includes('id="troubleshooting"'), 'troubleshooting section missing');
assert(docs.includes('报错自检'), 'navigation entry missing');
assert(docs.includes('const apiTroubleshooting'), 'checklist must be data-driven');
assert(docs.includes('具体错误码与返回内容以接口实际结果为准'), 'no invented error-code promises');
const symptoms = ['鉴权失败 / 提示 Key 无效', '提示模型不存在或不可用', '请求长时间无响应', '接入成功但结果不符合预期'];
for (const symptom of symptoms) {
  assert(docs.includes(symptom), 'missing troubleshooting symptom: ' + symptom);
}
assert(docs.includes('/v1/models'), 'checklist must point at the documented model query endpoint');

// --- no regression on prior SEO/structured data/acquisition surface.
assert(docs.includes('<StructuredData data={[docsPageSchema, docsBreadcrumbSchema, apiFaqSchema]} />'), 'structured data must stay');
assert(docs.includes("canonical: 'https://www.zhibeimao.com/api/docs'"), 'canonical must stay');
assert(docs.includes('id="faq"') && docs.includes('apiFaq.map'), 'visible FAQ must stay');
assert(docs.includes('StoreAttributionLink placement="api_docs"'), 'acquisition link must stay');
assert(docs.includes('www.chatgpt5x.com/guides/ai-tools-or-api/'), 'cross-site guide link must stay');
assert(docs.includes('curlExample') && docs.includes('pythonExample') && docs.includes('modelsExample'), 'original code samples must stay');
assert(docs.includes("'https://api.zhibeimao.com/v1/chat/completions'"), 'curl sample content must stay unchanged');
assert(layout.includes('StructuredData'), 'site-level structured data must stay');

console.log('PASS: %d accessible copy controls, 4 evidence-based troubleshooting cases, zero regressions', usages);
