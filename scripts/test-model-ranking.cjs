const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const families = ['GPT', 'Claude', 'Gemini', 'Grok', 'DeepSeek', 'Qwen', 'Kimi', 'GLM'];
const sourceFamilies = families.map((name) => ({ name }));
const modules = {};
function loadTs(path) {
  const transpiled = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  }).outputText;
  const module = { exports: {} };
  const localRequire = (name) => {
    if (name === '@/data/api-product') return { modelFamilies: sourceFamilies };
    if (name === '@/data/model-catalog.json') return require('../data/model-catalog.json');
    if (name === '@/lib/model-ranking') return modules.ranking;
    throw new Error('Unexpected module dependency: ' + name);
  };
  new Function('require', 'module', 'exports', transpiled)(localRequire, module, module.exports);
  return module.exports;
}
modules.ranking = loadTs('lib/model-ranking.ts');
modules.catalog = loadTs('lib/model-catalog.ts');

const { orderCatalogModels, isFeaturedModel } = modules.ranking;
const { getPublicModelCatalog } = modules.catalog;

const fixture = [
  { id: 'basic/gpt-6.2-sol', family: 'GPT' },
  { id: 'standard/gpt-6.2-sol', family: 'GPT' },
  { id: 'gpt-5.6-terra', family: 'GPT' },
  { id: 'gpt-6.2-sol', family: 'GPT' },
  { id: 'gpt-6.2-astra', family: 'GPT' },
  { id: 'claude-sonnet-5-5', family: 'Claude' },
  { id: 'claude-opus-5-5', family: 'Claude' },
  { id: 'gemini-3.8-flash', family: 'Gemini' },
  { id: 'gemini-4-hydrogen', family: 'Gemini' },
  { id: 'kimi-k3.1-pro-highspeed', family: 'Kimi' },
  { id: 'kimi-k3.1-pro', family: 'Kimi' }
];
const ranked = orderCatalogModels(fixture);
assert.equal(ranked.length, fixture.length, 'Sorting must not lose model IDs');
assert.equal(new Set(ranked.map(m => m.id)).size, fixture.length, 'All model IDs must be retained');
assert.deepEqual(ranked.slice(0, 3).map(m => m.id), [
  'gpt-6.2-sol', 'claude-opus-5-5', 'gemini-4-hydrogen'
]);
assert(ranked.indexOf(ranked.find(m => m.id === 'gpt-6.2-astra')) <
  ranked.indexOf(ranked.find(m => m.id === 'gpt-5.6-terra')),
  'Newer GPT version should appear first');
assert(ranked.indexOf(ranked.find(m => m.id === 'kimi-k3.1-pro')) <
  ranked.indexOf(ranked.find(m => m.id === 'kimi-k3.1-pro-highspeed')),
  'Canonical model should lead same-version variants');
assert(ranked.slice(-2).every(m => m.id.startsWith('basic/') || m.id.startsWith('standard/')),
  'Channel aliases should stay below main model IDs');
assert.equal(isFeaturedModel(fixture[0]), false);
assert.equal(isFeaturedModel(fixture[3]), true);

const catalog = getPublicModelCatalog();
assert(catalog.available && catalog.total >= 117, 'Real website catalog must remain available');
assert.equal(catalog.models.length, catalog.total);
assert.equal(new Set(catalog.models.map(m => m.id)).size, catalog.total);
const featured = families.map(name => catalog.models.find(m => m.family === name && isFeaturedModel(m)));
assert(featured.every(Boolean), 'Each model-family card must have a real native model');
assert(featured.every(m => !m.id.includes('/')), 'Featured cards must not show basic/standard aliases');
assert.equal(featured.length, 8);
console.log('FEATURED_MODEL_IDS=' + featured.map((m) => m.id).join(','));

const firstBasic = catalog.models.findIndex(m => /^basic\//.test(m.id));
assert(firstBasic > 50, 'Basic variants must not dominate initial catalog page');
assert.equal(catalog.models[0].family, 'GPT');
assert.equal(catalog.models[1].family, 'Claude');
assert.equal(catalog.models[2].family, 'Gemini');
assert.equal(catalog.models[3].family, 'Grok');
console.log('PASS: latest-version model cards, all 117 preserved, native IDs first, channel aliases last');
