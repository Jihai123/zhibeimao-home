const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
const { parseCatalog, parseModelNames, validateDownloadUrl, updateSnapshot } = require('./sync-model-catalog.cjs');

function loadTypeScript(file) {
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', js)(require, mod, mod.exports);
  return mod.exports;
}

const pricingParser = loadTypeScript('lib/model-catalog-pricing.ts');

function makeModels(count, decorate = () => ({})) {
  return Array.from({ length: count }, (_, index) => ({
    name: 'example-model-' + (index + 1),
    ...decorate(index)
  }));
}

function test() {
  const jsonRows = [
    { name: 'gpt-5.6-terra', vendor: 'OpenAI', inputPrice: 2, outputPrice: 10 },
    { name: 'claude-sonnet-4-6', vendor: 'Anthropic', inputPrice: 3, outputPrice: 15 },
    { name: 'gpt-5.6-terra', vendor: 'OpenAI', inputPrice: 2, outputPrice: 10 },
    { name: '<script>alert(1)</script>', vendor: 'OpenAI' },
    ...makeModels(26, () => ({ inputPrice: 1, outputPrice: 2 }))
  ];
  const json = JSON.stringify({ models: jsonRows });
  assert.deepEqual(parseModelNames(json).slice(0, 2), ['claude-sonnet-4-6', 'example-model-1']);
  assert.equal(parseCatalog(json).models.length, 28, 'duplicate and invalid model IDs should be rejected');

  const mediaRows = [
    { id: 499, name: 'gemini-2.5-flash-image-bs', vendor: 'Google', quotaType: 1, modelPrice: 0.05, requestPrice: 0.05 },
    { id: 498, name: 'grok-imagine-video-1.5', vendor: 'xAI', quotaType: 1, modelPrice: 0.1 },
    { id: 509, name: 'gpt-image-2.6-sunburst-c', vendor: 'OpenAI', quotaType: 1, modelPrice: 0.12 },
    ...makeModels(27, () => ({ quotaType: 1, requestPrice: 0.01 }))
  ];
  const mediaModels = JSON.stringify({ models: mediaRows });
  assert(parseModelNames(mediaModels).includes('gemini-2.5-flash-image-bs'));

  const csvRows = ['model_id,provider', ...makeModels(30).map((model) => model.name + ',OpenAI')];
  assert.equal(parseModelNames(csvRows.join('\r\n')).length, 30);
  const txtRows = ['# export', ...makeModels(30).map((model) => model.name)];
  assert.equal(parseModelNames(txtRows.join('\n')).length, 30);

  const expression = 'len <= 272000 ? tier("standard", p * 2 + c * 10 + cr * 0.1 + cc * 2.5) : tier("long_context", p * 4 + c * 15 + cr * 0.2 + cc * 5)';
  const parsed = parseCatalog(JSON.stringify({
    vendors: ['OpenAI'],
    groupRatio: { default: 1, vip: 1.5 },
    usableGroups: { default: '默认分组' },
    refreshedAt: '2026-11-20T11:59:23.838Z',
    source: 'database',
    models: [
      { name: 'gpt-6.2-sol', vendor: 'OpenAI', quotaType: 0, billingMode: 'tiered_expr', billingExpr: expression },
      { name: 'gpt-image-2-c', vendor: 'OpenAI', quotaType: 1, modelPrice: 0.06, requestPrice: 0.06 },
      ...makeModels(28, () => ({ inputPrice: 1, outputPrice: 2 }))
    ]
  }));
  assert.equal(parsed.version, 2);
  assert.equal(parsed.models.find((model) => model.name === 'gpt-6.2-sol').billingExpr, expression);
  assert.equal(parsed.models.find((model) => model.name === 'gpt-image-2-c').requestPrice, 0.06);
  assert.deepEqual(parsed.groupRatio, { default: 1, vip: 1.5 });

  const tiers = pricingParser.parseBillingExpression(expression);
  assert.equal(tiers.tiers.length, 2);
  assert.equal(tiers.tiers[0].terms.input, 2);
  assert.equal(tiers.tiers[0].terms.output, 10);
  assert.equal(tiers.tiers[1].terms.input, 4);
  assert.match(tiers.tiers[0].condition, /272,000/);
  assert.equal(tiers.timeVariable, false);

  const timed = pricingParser.parseBillingExpression(
    '(tier("base", p * 0.5 + c * 2 + cr * 0.01)) * (hour("Asia/Shanghai") >= 9 ? 2 : 1)'
  );
  assert.equal(timed.tiers.length, 1);
  assert.equal(timed.timeVariable, true);
  const video = pricingParser.parseBillingExpression('tier("base", u("input_images") * 0 + u("seconds") * 0.08)');
  assert.equal(video.tiers.length, 1);
  assert.equal(video.tiers[0].terms.seconds, 0.08);
  assert.equal(video.tiers[0].terms.inputImages, 0);

  const requestPrice = pricingParser.parseModelPricing({ quotaType: 1, requestPrice: 0.05, modelPrice: 0.05 });
  assert.deepEqual(requestPrice, { kind: 'request', perRequest: 0.05 });
  const tokenPrice = pricingParser.parseModelPricing({ quotaType: 0, inputPrice: 2, outputPrice: 10, cachePrice: 0.1 });
  assert.deepEqual(tokenPrice, { kind: 'token', input: 2, output: 10, cacheRead: 0.1, cacheWrite: undefined });
  const complexPrice = pricingParser.parseModelPricing({ billingMode: 'tiered_expr', billingExpr: 'not-a-supported-expression' });
  assert.deepEqual(complexPrice, { kind: 'complex' });

  // Every live expression in the checked-in catalog must be understood or explicitly surfaced as complex.
  const liveSnapshot = JSON.parse(fs.readFileSync('data/model-catalog.json', 'utf8'));
  const liveExpressions = liveSnapshot.models.filter((model) => typeof model.billingExpr === 'string');
  assert.equal(liveExpressions.length, 51, 'the live catalog should retain all tiered billing expressions');
  const unparsed = liveExpressions.filter((model) =>
    pricingParser.parseBillingExpression(model.billingExpr).tiers.length === 0
  ).map((model) => model.name);
  assert.deepEqual(unparsed, [], 'all tiered billing expressions should parse without evaluating source expressions');

  assert.throws(() => parseCatalog('<html>Login required</html>'), /HTML/);
  assert.throws(() => parseCatalog('{ invalid json }'), SyntaxError);
  assert.throws(() => parseCatalog(JSON.stringify({ models: makeModels(30, () => ({ inputPrice: -1 })) })), /Invalid non-negative/);
  assert.throws(() => validateDownloadUrl('http://www.juhenext.com/models.txt'), /HTTPS/);
  assert.throws(() => validateDownloadUrl('https://evil.example/models.txt'), /approved/);
  assert.equal(validateDownloadUrl('https://www.juhenext.com/export/models.csv').hostname, 'www.juhenext.com');

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'daily-model-sync-'));
  try {
    const file = path.join(dir, 'catalog.json');
    fs.writeFileSync(file, JSON.stringify({
      version: 1,
      source: 'website-file-export',
      syncedAt: null,
      models: []
    }));
    const ids = makeModels(60);
    const result = updateSnapshot(ids.map((model) => model.name).join('\n'), file);
    assert.equal(result.count, 60);
    const first = fs.readFileSync(file, 'utf8');
    const firstSnapshot = JSON.parse(first);
    assert.equal(firstSnapshot.models.length, 60);
    assert.equal(firstSnapshot.models[0].name, 'example-model-1');
    assert.match(firstSnapshot.syncedAt, /^\d{4}-\d\d-/);

    const unchanged = updateSnapshot(ids.map((model) => model.name).join('\n'), file);
    assert.equal(unchanged.changed, false, 'Same model list should not be rewritten');
    assert.equal(fs.readFileSync(file, 'utf8'), first, 'No-op must preserve previous snapshot');

    const priceChanged = updateSnapshot(JSON.stringify({
      refreshedAt: '2026-11-20T12:00:00.000Z',
      models: ids.map((model, index) => ({
        name: model.name,
        inputPrice: index === 0 ? 0.5 : 0.4,
        outputPrice: 2
      }))
    }), file);
    assert.equal(priceChanged.changed, true, 'Price changes must update the snapshot');
    assert.equal(JSON.parse(fs.readFileSync(file, 'utf8')).models[0].inputPrice, 0.5);

    const latest = fs.readFileSync(file, 'utf8');
    assert.throws(() => updateSnapshot(makeModels(15).map((model) => model.name).join('\n'), file), /too few/);
    assert.equal(fs.readFileSync(file, 'utf8'), latest, 'Invalid data must never overwrite the last good snapshot');
    assert.throws(() => updateSnapshot(makeModels(20).map((model) => model.name).join('\n'), file), /dropped sharply/);
    assert.equal(fs.readFileSync(file, 'utf8'), latest, 'A sharp drop must retain the last good snapshot');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  console.log('PASS: full pricing catalog normalization, tiered billing parser, media billing and last-good snapshot protection');
}

test();
