import type { ListedModel } from '@/lib/model-catalog';
import { modelFamilies } from '@/data/api-product';

// These IDs do not contain publication timestamps. Ordering reflects the
// numbered versions visible in the published catalog, not official release dates.
const familyOrder: string[] = modelFamilies.map((item) => item.name);
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

const versionPatterns: Record<string, RegExp> = {
  GPT: /^(?:gpt-|gpt-image-)(\d+)(?:\.(\d+))?/i,
  Claude: /^claude-[a-z]+-(\d+)(?:[.-](\d+))?/i,
  Gemini: /^gemini-(\d+)(?:\.(\d+))?/i,
  Grok: /^grok-(?:imagine-video-)?(\d+)(?:\.(\d+))?/i,
  DeepSeek: /^deepseek-v?(\d+)(?:\.(\d+))?/i,
  Qwen: /^qwen(\d+)(?:\.(\d+))?/i,
  Kimi: /^kimi-k(\d+)(?:\.(\d+))?/i,
  GLM: /^glm-(\d+)(?:\.(\d+))?/i
};

function versionOf(model: ListedModel): [number, number] {
  const bare = model.id.split('/').pop() || '';
  const match = bare.match(versionPatterns[model.family] ?? /$a/);
  return match ? [Number(match[1]), Number(match[2] || 0)] : [0, 0];
}

function tiePriority(model: ListedModel): number {
  const id = model.id.toLowerCase();
  let score = 0;
  if (/^claude-opus-/.test(id)) score += 5;
  if (/^claude-sonnet-/.test(id)) score += 3;
  if (/^claude-fable-/.test(id)) score += 2;
  if (/^claude-haiku-/.test(id)) score += 1;
  if (/-mini$|-nano$|-highspeed$|-preview$|-bs$/.test(id)) score -= 2;
  if (/\d{8}$/.test(id)) score -= 1;
  return score;
}

function compareWithinFamily(a: ListedModel, b: ListedModel): number {
  const [am, an] = versionOf(a);
  const [bm, bn] = versionOf(b);
  if (am !== bm) return bm - am;
  if (an !== bn) return bn - an;

  const variant = tiePriority(b) - tiePriority(a);
  if (variant !== 0) return variant;
  return collator.compare(b.id, a.id);
}

function interleaveFamilies(items: ListedModel[]): ListedModel[] {
  const groups = new Map<string, ListedModel[]>();
  for (const model of items) {
    const models = groups.get(model.family) ?? [];
    models.push(model);
    groups.set(model.family, models);
  }
  for (const models of groups.values()) models.sort(compareWithinFamily);

  const ordered = [...familyOrder, ...[...groups.keys()].filter((family) => !familyOrder.includes(family))];
  const result: ListedModel[] = [];
  let index = 0;
  while (result.length < items.length) {
    for (const family of ordered) {
      const next = groups.get(family)?.[index];
      if (next) result.push(next);
    }
    index++;
  }
  return result;
}

export function isFeaturedModel(model: ListedModel): boolean {
  return !model.id.includes('/');
}

export function orderCatalogModels(models: ListedModel[]): ListedModel[] {
  // Put first-party model IDs first. Keep every basic/standard variant in the
  // complete directory, but do not place these channel aliases above main IDs.
  const native = models.filter((model) => !model.id.includes('/'));
  const otherAliases = models.filter((model) =>
    model.id.includes('/') && !/^(?:basic|standard)\//i.test(model.id)
  );
  const channelAliases = models.filter((model) => /^(?:basic|standard)\//i.test(model.id));
  return [
    ...interleaveFamilies(native),
    ...interleaveFamilies(otherAliases),
    ...interleaveFamilies(channelAliases)
  ];
}
