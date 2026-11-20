#!/usr/bin/env node
// Daily importer for the public JuheNext catalog. Preserve pricing metadata;
// never use /v1/models or publish API credentials.
const fs = require('node:fs');
const path = require('node:path');

const DESTINATION = path.join(__dirname, '..', 'data', 'model-catalog.json');
const DEFAULT_CATALOG_URL = 'https://www.juhenext.com/api/catalog';
const MAX_BYTES = 5 * 1024 * 1024;
const MIN_MODELS = 20;
const MAX_MODELS = 10000;
const VALID_ID = /^[A-Za-z0-9][A-Za-z0-9._:/+\-]{0,159}$/;
const PRICE_FIELDS = ['inputPrice', 'outputPrice', 'cachePrice', 'createCachePrice', 'modelPrice', 'requestPrice'];

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

function rowsFromText(source) {
  const lines = source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];
  const firstRow = parseCSVRow(lines[0]);
  const fieldNames = ['id', 'model_id', 'modelid', 'model', 'name', '模型', '模型名称', '模型名'];
  const nameIndex = firstRow.findIndex((field) => fieldNames.includes(field.toLowerCase()));
  if (firstRow.length > 1 || nameIndex !== -1) {
    const headers = nameIndex >= 0 ? firstRow : null;
    const dataLines = headers ? lines.slice(1) : lines;
    return dataLines.map((line) => {
      const values = parseCSVRow(line);
      if (!headers) return { name: values[0] };
      const row = {};
      headers.forEach((header, index) => {
        const value = values[index];
        if (value === undefined || value === '') return;
        const numeric = Number(value);
        row[header] = Number.isFinite(numeric) && value.trim() !== '' ? numeric : value;
      });
      return row;
    });
  }
  return lines.filter((line) => !line.startsWith('#')).map((name) => ({ name }));
}

function normalizeModelRows(rows) {
  const seen = new Set();
  const models = [];
  const rejected = [];
  for (const raw of rows) {
    const row = typeof raw === 'string' ? { name: raw } : raw;
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      rejected.push({ reason: 'invalid-row' });
      continue;
    }
    const value = row.name ?? row.model_id ?? row.modelId ?? row.model ?? (typeof row.id === 'string' ? row.id : undefined);
    if (typeof value !== 'string') {
      rejected.push({ reason: 'missing-model-name', id: row.id, name: row.name, vendor: row.vendor });
      continue;
    }
    const name = value.trim();
    if (!VALID_ID.test(name)) {
      rejected.push({ reason: 'invalid-model-name', name: name.slice(0, 120) });
      continue;
    }
    if (seen.has(name)) {
      rejected.push({ reason: 'duplicate', name });
      continue;
    }

    for (const field of PRICE_FIELDS) {
      if (row[field] !== undefined && row[field] !== null &&
          (typeof row[field] !== 'number' || !Number.isFinite(row[field]) || row[field] < 0)) {
        throw new Error('Invalid non-negative numeric price field "' + field + '" for ' + name);
      }
    }
    if (row.billingExpr !== undefined &&
        (typeof row.billingExpr !== 'string' || row.billingExpr.length > 4000)) {
      throw new Error('Invalid billingExpr for ' + name);
    }

    seen.add(name);
    models.push({ ...row, name });
    if (models.length > MAX_MODELS) throw new Error('Excessive number of model records');
  }

  if (process.env.CATALOG_AUDIT === '1') {
    console.log('CATALOG_PARSE_AUDIT=' + JSON.stringify({
      rawCount: rows.length,
      accepted: models.length,
      rejected,
      withPriceFields: models.filter((model) => PRICE_FIELDS.some((field) => typeof model[field] === 'number')).length,
      withBillingExpression: models.filter((model) => typeof model.billingExpr === 'string').length
    }));
  }
  return models.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
}

function parseCatalog(content) {
  const source = content.replace(/^\uFEFF/, '').trim();
  if (!source || /^\s*<(?:!doctype|html)/i.test(source)) {
    throw new Error('Downloaded file is empty or an HTML page');
  }

  let parsed = null;
  let rows;
  if (source.startsWith('[') || source.startsWith('{')) {
    parsed = JSON.parse(source);
    rows = extractJsonRows(parsed);
  } else {
    rows = rowsFromText(source);
  }

  const models = normalizeModelRows(rows);
  if (models.length < MIN_MODELS) {
    throw new Error('File has too few valid model records: ' + models.length);
  }

  const hasPricingSchema = models.some((model) =>
    typeof model.billingExpr === 'string' || PRICE_FIELDS.some((field) => typeof model[field] === 'number')
  );
  if (hasPricingSchema) {
    const pricedCount = models.filter((model) =>
      typeof model.billingExpr === 'string' || PRICE_FIELDS.some((field) => typeof model[field] === 'number')
    ).length;
    if (pricedCount < Math.ceil(models.length * 0.7)) {
      throw new Error('Pricing coverage dropped unexpectedly (' + pricedCount + '/' + models.length + ')');
    }
  }

  const groupRatio = parsed && parsed.groupRatio && typeof parsed.groupRatio === 'object'
    ? parsed.groupRatio
    : {};
  for (const [group, ratio] of Object.entries(groupRatio)) {
    if (typeof ratio !== 'number' || !Number.isFinite(ratio) || ratio <= 0) {
      throw new Error('Invalid group ratio for ' + group);
    }
  }

  return {
    version: 2,
    source: 'website-file-export',
    upstreamSource: typeof parsed?.source === 'string' ? parsed.source : null,
    syncedAt: new Date().toISOString(),
    refreshedAt: typeof parsed?.refreshedAt === 'string' ? parsed.refreshedAt : null,
    vendors: Array.isArray(parsed?.vendors) ? parsed.vendors.filter((vendor) => typeof vendor === 'string') : [],
    groupRatio,
    usableGroups: parsed?.usableGroups && typeof parsed.usableGroups === 'object' ? parsed.usableGroups : {},
    models
  };
}

function parseModelNames(content) {
  return parseCatalog(content).models.map((model) => model.name);
}

function validateDownloadUrl(raw) {
  if (!raw) throw new Error('MODEL_CATALOG_DOWNLOAD_URL is not configured');
  const url = new URL(raw);
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('Source URL must be an HTTPS URL without embedded credentials');
  }
  const allowed = (process.env.MODEL_CATALOG_ALLOWED_HOSTS || 'juhenext.com,juhenextvip.com')
    .split(',').map((host) => host.trim().toLowerCase()).filter(Boolean);
  const hostname = url.hostname.toLowerCase();
  if (!allowed.some((host) => hostname === host || hostname.endsWith('.' + host))) {
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

function payloadForCompare(snapshot) {
  return JSON.stringify({
    version: snapshot.version,
    source: snapshot.source,
    upstreamSource: snapshot.upstreamSource,
    refreshedAt: snapshot.refreshedAt,
    vendors: snapshot.vendors,
    groupRatio: snapshot.groupRatio,
    usableGroups: snapshot.usableGroups,
    models: snapshot.models
  });
}

function updateSnapshot(content, filePath = DESTINATION) {
  const snapshot = parseCatalog(content);
  const previous = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const previousCount = Array.isArray(previous.models) ? previous.models.length : 0;
  if (previousCount && snapshot.models.length < Math.ceil(previousCount * 0.5)) {
    throw new Error('Model count dropped sharply (' + previousCount + ' -> ' + snapshot.models.length + '), preserving last good snapshot');
  }
  if (payloadForCompare(previous) === payloadForCompare(snapshot)) {
    return { count: snapshot.models.length, previousCount, changed: false, snapshot: previous };
  }

  const tmpPath = filePath + '.tmp';
  fs.writeFileSync(tmpPath, JSON.stringify(snapshot, null, 2) + '\n', { encoding: 'utf8' });
  fs.renameSync(tmpPath, filePath);
  const pricedCount = snapshot.models.filter((model) =>
    typeof model.billingExpr === 'string' || PRICE_FIELDS.some((field) => typeof model[field] === 'number')
  ).length;
  return { count: snapshot.models.length, pricedCount, previousCount, changed: true, snapshot };
}

async function main() {
  const url = validateDownloadUrl(process.env.MODEL_CATALOG_DOWNLOAD_URL || DEFAULT_CATALOG_URL);
  const content = await downloadText(url);
  const result = updateSnapshot(content);
  console.log('Model catalog checked; models=' + result.count +
    ', priced=' + (result.pricedCount ?? result.snapshot.models.length) +
    ', previous=' + result.previousCount + ', changed=' + result.changed +
    ', refreshedAt=' + result.snapshot.refreshedAt);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Model catalog import FAILED; last good snapshot retained:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { parseCatalog, parseModelNames, validateDownloadUrl, updateSnapshot };
