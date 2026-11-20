#!/usr/bin/env node
// Daily website-export importer. Never use /v1/models or publish secrets.
const fs = require('node:fs');
const path = require('node:path');

const DESTINATION = path.join(__dirname, '..', 'data', 'model-catalog.json');
const DEFAULT_CATALOG_URL = 'https://www.juhenext.com/api/catalog';
const MAX_BYTES = 5 * 1024 * 1024;
const MIN_MODELS = 20;
const MAX_MODELS = 10000;
const VALID_ID = /^[A-Za-z0-9][A-Za-z0-9._:/+\-]{0,159}$/;

function parseCSVRow(line) {
  const row = [];
  let part = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && quoted && line[i + 1] === '"') {
      part += '"'; i++;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === ',' && !quoted) {
      row.push(part.trim()); part = '';
    } else {
      part += ch;
    }
  }
  row.push(part.trim());
  return row;
}

function extractJsonRows(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') {
    for (const key of ['models', 'data', 'items', 'list', 'results']) {
      if (Array.isArray(value[key])) return value[key];
    }
  }
  throw new Error('JSON does not contain a recognizable model list');
}

function parseModelNames(content) {
  const source = content.replace(/^\uFEFF/, '').trim();
  if (!source || /^\s*<(?:!doctype|html)/i.test(source)) {
    throw new Error('Downloaded file is empty or an HTML page');
  }

  let rows;
  if (source.startsWith('[') || source.startsWith('{')) {
    rows = extractJsonRows(JSON.parse(source));
  } else {
    const lines = source.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    const firstRow = parseCSVRow(lines[0]);
    const fieldNames = ['id', 'model_id', 'modelid', 'model', 'name', '模型', '模型名称', '模型名'];
    const nameIndex = firstRow.findIndex(x => fieldNames.includes(x.toLowerCase()));
    if (firstRow.length > 1 || nameIndex !== -1) {
      const column = nameIndex >= 0 ? nameIndex : 0;
      rows = lines.slice(nameIndex >= 0 ? 1 : 0).map(line => parseCSVRow(line)[column]);
    } else {
      rows = lines.filter(line => !line.startsWith('#'));
    }
  }

  const seen = new Set();
  const ids = [];
  const rejected = [];
  for (const row of rows) {
    let value = row;
    if (value && typeof value === 'object') {
      value = value.id ?? value.model_id ?? value.modelId ?? value.model ?? value.name;
    }
    if (typeof value !== 'string') {
      rejected.push({ reason: 'missing-id', id: row?.id, name: row?.name, displayName: row?.displayName, vendor: row?.vendor });
      continue;
    }
    const id = value.trim();
    if (!VALID_ID.test(id)) {
      rejected.push({ reason: 'invalid-id', id: id.slice(0,120) });
      continue;
    }
    if (seen.has(id)) {
      rejected.push({ reason: 'duplicate', id: id.slice(0,120) });
      continue;
    }
    seen.add(id);
    ids.push(id);
    if (ids.length > MAX_MODELS) throw new Error('Excessive number of model IDs');
  }
  if (process.env.CATALOG_AUDIT === '1') {
    console.log('CATALOG_PARSE_AUDIT=' + JSON.stringify({
      rawCount: rows.length, accepted: ids.length, rejected
    }));
  }
  return ids.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

function validateDownloadUrl(raw) {
  if (!raw) throw new Error('MODEL_CATALOG_DOWNLOAD_URL is not configured');
  const url = new URL(raw);
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('Source URL must be an HTTPS URL without embedded credentials');
  }
  const allowed = (process.env.MODEL_CATALOG_ALLOWED_HOSTS || 'juhenext.com,juhenextvip.com')
    .split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  const hostname = url.hostname.toLowerCase();
  if (!allowed.some(host => hostname === host || hostname.endsWith('.' + host))) {
    throw new Error('Download host is not in the approved source domain list');
  }
  return url;
}

async function downloadText(sourceUrl) {
  const response = await fetch(sourceUrl, {
    headers: { Accept: 'application/json,text/csv,text/plain,application/octet-stream;q=0.8' },
    signal: AbortSignal.timeout(20000),
    redirect: 'follow',
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Download returned HTTP ' + response.status);
  validateDownloadUrl(response.url);
  const statedSize = Number(response.headers.get('content-length') || 0);
  if (statedSize > MAX_BYTES) throw new Error('Downloaded file exceeds 5 MB');
  const data = await response.arrayBuffer();
  if (data.byteLength > MAX_BYTES) throw new Error('Downloaded file exceeds 5 MB');
  return new TextDecoder('utf-8', { fatal: true }).decode(data);
}

function updateSnapshot(content, filePath = DESTINATION) {
  const ids = parseModelNames(content);
  if (ids.length < MIN_MODELS) {
    throw new Error('File has too few valid model IDs: ' + ids.length);
  }
  const previous = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const previousCount = Array.isArray(previous.models) ? previous.models.length : 0;
  if (previousCount && ids.length < Math.ceil(previousCount * 0.5)) {
    throw new Error('Model count dropped sharply (' + previousCount + ' -> ' + ids.length + '), preserving last good snapshot');
  }
  const snapshot = {
    version: 1,
    source: 'website-file-export',
    syncedAt: new Date().toISOString(),
    models: ids
  };
  const tmpPath = filePath + '.tmp';
  fs.writeFileSync(tmpPath, JSON.stringify(snapshot, null, 2) + '\n', { encoding: 'utf8' });
  fs.renameSync(tmpPath, filePath);
  return { count: ids.length, previousCount, snapshot };
}

async function main() {
  const url = validateDownloadUrl(process.env.MODEL_CATALOG_DOWNLOAD_URL || DEFAULT_CATALOG_URL);
  const content = await downloadText(url);
  const result = updateSnapshot(content);
  console.log('Model file imported successfully; models=' + result.count +
    ', previous=' + result.previousCount + ', updated=' + result.snapshot.syncedAt);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Model file import FAILED; last good snapshot retained:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { parseModelNames, validateDownloadUrl, updateSnapshot };
