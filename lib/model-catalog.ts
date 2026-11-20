import { apiBaseUrl, modelFamilies } from '@/data/api-product';

export type ListedModel = {
  id: string;
  family: string;
};

export type ModelCatalog = {
  models: ListedModel[];
  total: number;
  available: boolean;
};

const refreshSeconds = 3600;
const maxPublishedModels = 3000;

const familyMatchers: Array<{ name: string; test: RegExp }> = [
  { name: 'GPT', test: /^(gpt[-_.]|chatgpt[-_.]|o[134][-_.]|codex[-_.])/i },
  { name: 'Claude', test: /claude/i },
  { name: 'Gemini', test: /gemini|nano[-_.]?banana/i },
  { name: 'Grok', test: /grok/i },
  { name: 'DeepSeek', test: /deepseek/i },
  { name: 'Qwen', test: /qwen|qwq/i },
  { name: 'Kimi', test: /kimi|moonshot/i },
  { name: 'GLM', test: /glm|chatglm/i }
];

function classify(id: string): string {
  return familyMatchers.find((family) => family.test.test(id))?.name ?? '其他';
}

function parseModels(payload: unknown): ListedModel[] {
  if (!payload || typeof payload !== 'object' || !('data' in payload)) return [];

  const data = (payload as { data: unknown }).data;
  if (!Array.isArray(data)) return [];

  const deduped = new Set<string>();
  const models: ListedModel[] = [];

  for (const item of data) {
    if (!item || typeof item !== 'object' || !('id' in item) || typeof item.id !== 'string') continue;
    const id = item.id.trim();
    // Publish only safe model IDs. Never pass through upstream metadata or secrets.
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._:/+\-]{0,127}$/.test(id) || deduped.has(id)) continue;
    deduped.add(id);
    models.push({ id, family: classify(id) });
    if (models.length >= maxPublishedModels) break;
  }

  const priority = modelFamilies.map((family) => family.name as string);
  const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
  return models.sort((a, b) => {
    const rankA = priority.indexOf(a.family);
    const rankB = priority.indexOf(b.family);
    const familyA = rankA < 0 ? priority.length : rankA;
    const familyB = rankB < 0 ? priority.length : rankB;
    if (familyA !== familyB) return familyA - familyB;
    return collator.compare(b.id, a.id);
  });
}

export async function getPublicModelCatalog(): Promise<ModelCatalog> {
  // This Key is server-only. Never prefix it with NEXT_PUBLIC_ or return it to a client.
  const key = process.env.ZHIXIANG_MODEL_CATALOG_KEY?.trim();
  if (!key) return { models: [], total: 0, available: false };

  try {
    const response = await fetch(`${apiBaseUrl}/models`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${key}`
      },
      next: { revalidate: refreshSeconds },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) return { models: [], total: 0, available: false };
    const models = parseModels(await response.json());
    return { models, total: models.length, available: true };
  } catch {
    // A catalog failure must not break the product page or reveal internal errors.
    return { models: [], total: 0, available: false };
  }
}
