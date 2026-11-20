export type PriceTerms = {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  cacheWrite1h?: number;
  cacheWrite12h?: number;
  seconds?: number;
  inputImages?: number;
};

export type BillingTier = {
  label: string;
  condition?: string;
  terms: PriceTerms;
};

export type ModelPricing =
  | { kind: 'token'; input?: number; output?: number; cacheRead?: number; cacheWrite?: number }
  | { kind: 'tiered'; tiers: BillingTier[]; timeVariable: boolean }
  | { kind: 'request'; perRequest?: number }
  | { kind: 'complex' }
  | { kind: 'unavailable' };

const variableMap: Record<string, keyof PriceTerms> = {
  p: 'input',
  c: 'output',
  cr: 'cacheRead',
  cc: 'cacheWrite',
  cc1h: 'cacheWrite1h',
  cc12h: 'cacheWrite12h'
};

function safeNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function parseTerms(expression: string): PriceTerms {
  const terms: PriceTerms = {};
  const tokenPattern = /\b(cc12h|cc1h|cr|cc|p|c)\s*\*\s*(\d+(?:\.\d+)?)/g;
  for (const match of expression.matchAll(tokenPattern)) {
    const key = variableMap[match[1]];
    const value = Number(match[2]);
    if (!key || !Number.isFinite(value) || value < 0) continue;
    terms[key] = (terms[key] ?? 0) + value;
  }

  const usagePattern = /u\(\s*["'](input_images|seconds)["']\s*\)\s*\*\s*(\d+(?:\.\d+)?)/g;
  for (const match of expression.matchAll(usagePattern)) {
    const key = match[1] === 'seconds' ? 'seconds' : 'inputImages';
    const value = Number(match[2]);
    if (Number.isFinite(value) && value >= 0) terms[key] = (terms[key] ?? 0) + value;
  }
  return terms;
}

function extractTierCalls(expression: string): Array<{ label: string; formula: string }> {
  const tiers: Array<{ label: string; formula: string }> = [];
  const marker = /tier\s*\(/g;
  let match: RegExpExecArray | null;

  while ((match = marker.exec(expression)) !== null) {
    const openParen = expression.indexOf('(', match.index);
    let cursor = openParen + 1;
    while (/\s/.test(expression[cursor] ?? '')) cursor++;
    const quote = expression[cursor];
    if (quote !== '"' && quote !== "'") continue;
    cursor++;
    let label = '';
    let escaped = false;
    while (cursor < expression.length) {
      const char = expression[cursor++];
      if (escaped) {
        label += char;
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        break;
      } else {
        label += char;
      }
    }
    while (/\s/.test(expression[cursor] ?? '')) cursor++;
    if (expression[cursor] !== ',') continue;
    const formulaStart = cursor + 1;
    let depth = 1;
    let stringQuote: string | null = null;
    let stringEscape = false;
    let end = -1;
    for (let index = openParen + 1; index < expression.length; index++) {
      const char = expression[index];
      if (stringQuote) {
        if (stringEscape) stringEscape = false;
        else if (char === '\\') stringEscape = true;
        else if (char === stringQuote) stringQuote = null;
        continue;
      }
      if (char === '"' || char === "'") stringQuote = char;
      else if (char === '(') depth++;
      else if (char === ')') {
        depth--;
        if (depth === 0) {
          end = index;
          break;
        }
      }
    }
    if (end < 0) continue;
    tiers.push({ label, formula: expression.slice(formulaStart, end).trim() });
    marker.lastIndex = end + 1;
  }
  return tiers;
}

function tierLabel(raw: string): string {
  const normalized = raw.toLowerCase();
  if (normalized === 'base') return '基础计价';
  if (normalized === 'standard' || normalized === 'l1') return '标准上下文';
  if (normalized === 'long_context' || normalized === 'l2') return '长上下文';
  return raw.replace(/[_-]+/g, ' ');
}

export function parseBillingExpression(expression: string): {
  tiers: BillingTier[];
  timeVariable: boolean;
} {
  const rawTiers = extractTierCalls(expression);
  const tiers: BillingTier[] = [];
  const threshold = expression.match(/\blen\s*(<=|<|>=|>)\s*(\d+)/i);
  const thresholdLabel = threshold
    ? '上下文长度 ' + threshold[1] + ' ' + Number(threshold[2]).toLocaleString('en-US') + ' Token'
    : undefined;

  for (let index = 0; index < rawTiers.length; index++) {
    const raw = rawTiers[index];
    const terms = parseTerms(raw.formula);
    if (Object.keys(terms).length === 0) continue;
    let condition: string | undefined;
    if (rawTiers.length > 1 && thresholdLabel) {
      condition = index === 0 ? thresholdLabel : '超过上述长度';
    } else if (rawTiers.length === 1) {
      condition = thresholdLabel;
    }
    tiers.push({ label: tierLabel(raw.label), condition, terms });
  }

  return { tiers, timeVariable: /\bhour\s*\(/i.test(expression) };
}

export function parseModelPricing(model: Record<string, unknown>): ModelPricing {
  const quotaType = model.quotaType;
  const expression = typeof model.billingExpr === 'string' ? model.billingExpr : '';

  if (quotaType === 1) {
    const perRequest = safeNumber(model.requestPrice) ?? safeNumber(model.modelPrice);
    return { kind: 'request', perRequest };
  }

  if (expression || model.billingMode === 'tiered_expr') {
    if (!expression) return { kind: 'complex' };
    const parsed = parseBillingExpression(expression);
    return parsed.tiers.length
      ? { kind: 'tiered', tiers: parsed.tiers, timeVariable: parsed.timeVariable }
      : { kind: 'complex' };
  }

  const input = safeNumber(model.inputPrice);
  const output = safeNumber(model.outputPrice);
  const cacheRead = safeNumber(model.cachePrice);
  const cacheWrite = safeNumber(model.createCachePrice);
  if (input !== undefined || output !== undefined) {
    return { kind: 'token', input, output, cacheRead, cacheWrite };
  }

  const perRequest = safeNumber(model.requestPrice) ?? safeNumber(model.modelPrice);
  if (perRequest !== undefined) return { kind: 'request', perRequest };
  return { kind: 'unavailable' };
}
