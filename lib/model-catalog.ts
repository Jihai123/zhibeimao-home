import snapshot from '@/data/model-catalog.json';
import { orderCatalogModels } from '@/lib/model-ranking';
import { parseModelPricing, type ModelPricing } from '@/lib/model-catalog-pricing';

export type ListedModel = {
  id: string;
  canonicalId: string;
  family: string;
  vendor: string;
  variant: string;
  pricing: ModelPricing;
};

export type ModelCatalog = {
  models: ListedModel[];
  total: number;
  uniqueTotal: number;
  available: boolean;
  syncedAt: string | null;
};

const familyMatchers: Array<{ name: string; test: RegExp }> = [
  { name: 'GPT', test: /(?:^|\/)(?:gpt[-_.]|chatgpt[-_.]|o[134][-_.]|codex[-_.])/i },
  { name: 'Claude', test: /claude/i },
  { name: 'Gemini', test: /gemini|nano[-_.]?banana/i },
  { name: 'Grok', test: /grok/i },
  { name: 'DeepSeek', test: /deepseek/i },
  { name: 'Qwen', test: /qwen|qwq/i },
  { name: 'Kimi', test: /kimi|moonshot/i },
  { name: 'GLM', test: /glm|chatglm/i }
];

function classify(id: string): string {
  return familyMatchers.find(({ test }) => test.test(id))?.name ?? '其他';
}

function modelIdentity(raw: unknown): { id: string; canonicalId: string; variant: string; vendor: string; pricing: ModelPricing } | null {
  const row = typeof raw === 'string' ? { name: raw } : raw;
  if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
  const record = row as Record<string, unknown>;
  const rawId = record.name ?? record.model_id ?? record.modelId ?? record.model;
  if (typeof rawId !== 'string') return null;
  const id = rawId.trim();
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._:/+\-]{0,159}$/.test(id)) return null;

  const slash = id.indexOf('/');
  const prefix = slash > 0 ? id.slice(0, slash).toLowerCase() : '';
  const hasChannelPrefix = ['basic', 'standard', 'codex', 'openclaw'].includes(prefix);
  const canonicalId = hasChannelPrefix ? id.slice(slash + 1) : id;
  const variantLabels: Record<string, string> = {
    basic: '基础线路',
    standard: '标准线路',
    codex: 'Codex 专用',
    openclaw: 'OpenClaw 专用'
  };
  const variant = hasChannelPrefix ? variantLabels[prefix] : '默认线路';

  return {
    id,
    canonicalId,
    variant,
    vendor: typeof record.vendor === 'string' ? record.vendor : '',
    pricing: parseModelPricing(record)
  };
}

export function getPublicModelCatalog(): ModelCatalog {
  const data = snapshot as unknown as Record<string, unknown>;
  const rawModels: unknown[] = Array.isArray(data.models) ? data.models : [];
  const unique = new Set<string>();
  const models: ListedModel[] = [];

  for (const raw of rawModels) {
    const parsed = modelIdentity(raw);
    if (!parsed || unique.has(parsed.id)) continue;
    unique.add(parsed.id);
    models.push({
      ...parsed,
      family: classify(parsed.canonicalId)
    });
  }

  const rankedModels = orderCatalogModels(models);
  const uniqueTotal = new Set(rankedModels.map((model) => model.canonicalId)).size;
  const syncedAt = typeof data.syncedAt === 'string' ? data.syncedAt : null;

  return {
    models: rankedModels,
    total: rankedModels.length,
    uniqueTotal,
    available: rankedModels.length > 0,
    syncedAt
  };
}
