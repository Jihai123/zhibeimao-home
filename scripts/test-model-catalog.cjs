const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { parseModelNames, validateDownloadUrl, updateSnapshot } = require('./sync-model-catalog.cjs');

function makeModels(count) {
  return Array.from({ length: count }, (_, i) => 'example-model-' + (i + 1));
}

function test() {
  const json = JSON.stringify({ models: [
    { id: 'gpt-5.6-terra' },
    { id: 'claude-sonnet-4-6' },
    { id: 'gpt-5.6-terra' },
    { id: '<script>alert(1)</script>' }
  ] });
  assert.deepEqual(parseModelNames(json), ['claude-sonnet-4-6', 'gpt-5.6-terra']);

  const mediaModels = JSON.stringify({ models: [
    { id: 499, name: 'gemini-2.5-flash-image-bs', vendor: 'Google' },
    { id: 498, name: 'grok-imagine-video-1.5', vendor: 'xAI' },
    { id: 509, name: 'gpt-image-2.6-sunburst-c', vendor: 'OpenAI' }
  ] });
  assert.deepEqual(parseModelNames(mediaModels), [
    'gemini-2.5-flash-image-bs',
    'gpt-image-2.6-sunburst-c',
    'grok-imagine-video-1.5'
  ]);

  const csv = 'model_id,provider\r\ngpt-5.6-terra,OpenAI\r\nclaude-sonnet-4-6,Anthropic\r\n';
  assert.deepEqual(parseModelNames(csv), ['claude-sonnet-4-6', 'gpt-5.6-terra']);

  const txt = '# export\ngpt-5.6-terra\nclaude-sonnet-4-6\ngpt-5.6-terra\n';
  assert.deepEqual(parseModelNames(txt), ['claude-sonnet-4-6', 'gpt-5.6-terra']);

  assert.throws(() => parseModelNames('<html>Login required</html>'), /HTML/);
  assert.throws(() => parseModelNames('{ invalid json }'), SyntaxError);
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
    const result = updateSnapshot(ids.join('\n'), file);
    assert.equal(result.count, 60);
    const first = fs.readFileSync(file, 'utf8');
    assert.equal(JSON.parse(first).models.length, 60);
    assert.match(JSON.parse(first).syncedAt, /^\d{4}-\d\d-/);
    assert.throws(() => updateSnapshot(makeModels(15).join('\n'), file), /too few/);
    assert.equal(fs.readFileSync(file, 'utf8'), first, 'Invalid data must never overwrite the last good snapshot');
    assert.throws(() => updateSnapshot(makeModels(20).join('\n'), file), /dropped sharply/);
    assert.equal(fs.readFileSync(file, 'utf8'), first, 'A sharp drop must retain the last good snapshot');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  console.log('PASS: daily file formats, ID validation, source allowlist and last-good snapshot protection');
}

test();
