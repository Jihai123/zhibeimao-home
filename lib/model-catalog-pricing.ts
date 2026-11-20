export type PriceTerms = {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  cacheWrite1h?: number;
  cacheWrite12h?: number;
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
  const pattern = /\b(cc12h|cc1h|cr|cc|p|c)\s*\*\s*(\d+(?:\.\d+)?)/g;
  for (const match of expression.matchAll(pattern)) {
    const key = variableMap[match[1]];
    const value = Number(match[2]);
    if (!key || !Number.isFinite(value) || value < 0) continue;
    terms[key] = (terms[key] ?? 0) + value;
  }
  return terms;
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
  const tiers: BillingTier[] = [];
  const pattern = /tier\(\s*["']([^"']+)["']\s*,\s*([^()]*)\)/g;
  const matches = Array.from(expression.matchAll(pattern));
  const threshold = expression.match(/\blen\s*(<=|<|>=|>)\s*(\d+)/i);
  const thresholdLabel = threshold
    ? '上下文长度 ' + threshold[1] + ' ' + Number(threshold[2]).toLocaleString('en-US') + ' Token'
    : undefined;

  for (let index = 0; index < matches.length; index++) {
    const match = matches[index];
    const terms = parseTerms(match[2]);
    if (Object.keys(terms).length === 0) continue;
    let condition: string | undefined;
    if (matches.length > 1 && thresholdLabel) {
      condition = index === 0 ? thresholdLabel : '超过上述长度';
    } else if (matches.length === 1) {
      condition = thresholdLabel;
    }
    tiers.push({ label: tierLabel(match[1]), condition, terms });
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
