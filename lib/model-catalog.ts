import snapshot from '@/data/model-catalog.json';
import { modelFamilies } from '@/data/api-product';

export type ListedModel = {
  id: string;
  family: string;
};

export type ModelCatalog = {
  models: ListedModel[];
  total: number;
  available: boolean;
};

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
  return familyMatchers.find(({ test }) => test.test(id))?.name ?? '其他';
}

export function getPublicModelCatalog(): ModelCatalog {
  // Static, validated snapshot produced by the scheduled website-file download.
  // No customer or server API Key is needed to render the model catalog.
  const ids = Array.isArray(snapshot.models) ? snapshot.models : [];
  const unique = new Set<string>();
  const models: ListedModel[] = [];

  for (const rawId of ids) {
    if (typeof rawId !== 'string') continue;
    const id = rawId.trim();
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._:/+\-]{0,159}$/.test(id) || unique.has(id)) continue;
    unique.add(id);
    models.push({ id, family: classify(id) });
  }

  const priorities = modelFamilies.map(({ name }) => name as string);
  const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
  models.sort((a, b) => {
    const rankA = priorities.indexOf(a.family);
    const rankB = priorities.indexOf(b.family);
    const left = rankA < 0 ? priorities.length : rankA;
    const right = rankB < 0 ? priorities.length : rankB;
    return left !== right ? left - right : collator.compare(a.id, b.id);
  });

  return { models, total: models.length, available: models.length > 0 };
}
