const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const source = fs.readFileSync('lib/model-catalog.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
}).outputText;

function loadCatalog(fetchMock, key) {
  const module = { exports: {} };
  const dependencies = {
    '@/data/api-product': {
      apiBaseUrl: 'https://api.zhibeimao.com/v1',
      modelFamilies: ['GPT', 'Claude', 'Gemini', 'Grok', 'DeepSeek', 'Qwen', 'Kimi', 'GLM'].map((name) => ({ name }))
    }
  };
  const localRequire = (name) => {
    if (!dependencies[name]) throw new Error('Unexpected dependency: ' + name);
    return dependencies[name];
  };
  const mockProcess = { env: key ? { ZHIXIANG_MODEL_CATALOG_KEY: key } : {} };
  const run = new Function('require', 'module', 'exports', 'process', 'fetch', 'AbortSignal', compiled);
  run(localRequire, module, module.exports, mockProcess, fetchMock, AbortSignal);
  return module.exports.getPublicModelCatalog;
}

async function main() {
  const secret = 'server-only-fixture-key';
  let calls = 0;

  const getModels = loadCatalog(async (url, options) => {
    calls++;
    assert.equal(url, 'https://api.zhibeimao.com/v1/models');
    assert.equal(options.headers.Authorization, 'Bearer ' + secret);
    assert.equal(options.next.revalidate, 3600);
    return {
      ok: true,
      json: async () => ({
        object: 'list',
        data: [
          { id: 'gpt-5.6-terra' },
          { id: 'claude-sonnet-4-6' },
          { id: 'gemini-3.5-flash' },
          { id: 'deepseek-v4-flash' },
          { id: 'gpt-5.6-terra' },
          { id: '<script>alert(1)</script>' },
          { id: 'not a valid id' },
          { object: 'model' }
        ]
      })
    };
  }, secret);

  const catalog = await getModels();
  assert.equal(calls, 1);
  assert.equal(catalog.available, true);
  assert.equal(catalog.total, 4);
  assert.deepEqual(catalog.models.map((model) => model.family),
    ['GPT', 'Claude', 'Gemini', 'DeepSeek']);
  assert(catalog.models.some((model) => model.id === 'gpt-5.6-terra'));
  assert.equal(JSON.stringify(catalog).includes(secret), false);

  const withoutKey = loadCatalog(async () => {
    throw new Error('No request expected when key is absent');
  }, '');
  assert.deepEqual(await withoutKey(), { models: [], total: 0, available: false });

  const unauthorized = loadCatalog(async () => ({ ok: false }), secret);
  assert.deepEqual(await unauthorized(), { models: [], total: 0, available: false });

  console.log('PASS: model catalog authorization, normalization, deduplication, filtering and fallback');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
