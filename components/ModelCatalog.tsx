'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers3, Search } from 'lucide-react';

import { modelFamilies } from '@/data/api-product';
import type { ListedModel } from '@/lib/model-catalog';
import type { BillingTier, ModelPricing, PriceTerms } from '@/lib/model-catalog-pricing';

type Props = {
  models: ListedModel[];
  available: boolean;
  total?: number;
  syncedAt?: string | null;
};

type ModelGroup = {
  canonicalId: string;
  family: string;
  variants: ListedModel[];
  primary: ListedModel;
};

const tones = [
  'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
  'border-orange-400/20 bg-orange-400/10 text-orange-200',
  'border-sky-400/20 bg-sky-400/10 text-sky-200',
  'border-violet-400/20 bg-violet-400/10 text-violet-200'
];

const PAGE_SIZE = 18;
const choices = ['全部', ...modelFamilies.map((family) => family.name), '其他'];

function formatPrice(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 4 }).format(value);
}

function PriceSummary({ pricing }: { pricing: ModelPricing }) {
  if (pricing.kind === 'token') {
    return (
      <div className="text-right text-[11px] leading-5 text-slate-300 sm:text-xs">
        <div>输入 <strong className="text-cyan-100">⚡{formatPrice(pricing.input)}</strong></div>
        <div>输出 <strong className="text-cyan-100">⚡{formatPrice(pricing.output)}</strong></div>
        <div className="text-[10px] text-slate-500">每百万 Token</div>
      </div>
    );
  }
  if (pricing.kind === 'tiered') {
    const isDuration = pricing.tiers.some((tier) => tier.terms.seconds !== undefined);
    return <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[11px] font-medium text-amber-100">{isDuration ? '按时长计费' : '分档计费'}</span>;
  }
  if (pricing.kind === 'request') {
    return <span className="text-right text-xs font-semibold text-cyan-100">按次 ⚡{formatPrice(pricing.perRequest)}</span>;
  }
  if (pricing.kind === 'complex') {
    return <span className="text-right text-xs text-amber-100">复杂计费</span>;
  }
  return <span className="text-right text-xs text-slate-500">价格待核实</span>;
}

function Metric({ label, value, unit = '⚡' }: { label: string; value: number | undefined; unit?: string }) {
  if (value === undefined) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{unit}{formatPrice(value)}</p>
    </div>
  );
}

function TermsGrid({ terms }: { terms: PriceTerms }) {
  const metrics: Array<[string, number | undefined, string?]> = [
    ['输入 / 百万 Token', terms.input],
    ['输出 / 百万 Token', terms.output],
    ['缓存读取 / 百万 Token', terms.cacheRead],
    ['缓存写入 / 百万 Token', terms.cacheWrite],
    ['1 小时缓存写入 / 百万 Token', terms.cacheWrite1h],
    ['12 小时缓存写入 / 百万 Token', terms.cacheWrite12h],
    ['视频生成 / 秒', terms.seconds],
    ['输入图片 / 张', terms.inputImages]
  ];
  const visible = metrics.filter(([, value]) => value !== undefined);
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {visible.map(([label, value]) => <Metric key={label} label={label} value={value} unit="⚡" />)}
    </div>
  );
}

function PricingDetails({ pricing }: { pricing: ModelPricing }) {
  if (pricing.kind === 'token') {
    return (
      <div className="mt-3">
        <TermsGrid terms={{ input: pricing.input, output: pricing.output, cacheRead: pricing.cacheRead, cacheWrite: pricing.cacheWrite }} />
        <p className="mt-2 text-[11px] text-slate-500">目录计价单位：⚡ / 百万 Token</p>
      </div>
    );
  }
  if (pricing.kind === 'tiered') {
    return (
      <div className="mt-3 space-y-3">
        {pricing.tiers.map((tier: BillingTier, index: number) => (
          <div key={tier.label + index} className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-white">{tier.label}</span>
              {tier.condition && <span className="text-[11px] text-slate-400">{tier.condition}</span>}
            </div>
            <TermsGrid terms={tier.terms} />
          </div>
        ))}
        {pricing.timeVariable && (
          <p className="rounded-lg border border-amber-300/15 bg-amber-300/[0.06] px-3 py-2 text-[11px] leading-5 text-amber-100/80">
            该模型还包含时段倍率，以上为表达式中的基础计价系数，实际费用会随计费时段变化。
          </p>
        )}
        <p className="text-[11px] text-slate-500">目录计价单位为 ⚡；Token 按百万计，视频按秒计。最终扣费以 Key 用量记录为准。</p>
      </div>
    );
  }
  if (pricing.kind === 'request') {
    return (
      <div className="mt-3">
        <Metric label="每次请求" value={pricing.perRequest} />
        <p className="mt-2 text-[11px] text-slate-500">目录计价单位：⚡ / 次</p>
      </div>
    );
  }
  if (pricing.kind === 'complex') {
    return <p className="mt-3 text-xs leading-5 text-amber-100/80">该模型使用复合计费规则，暂不展示估算单价，避免误导；实际扣费以 Key 用量记录为准。</p>;
  }
  return <p className="mt-3 text-xs text-slate-500">当前目录没有提供可确认的价格字段，请以实际用量记录为准。</p>;
}

function ModelRow({ group }: { group: ModelGroup }) {
  const hasMore = group.variants.length > 1;
  return (
    <article className="min-w-0 px-3 py-3.5 sm:px-5">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <code className="block break-all select-all text-xs font-semibold leading-6 text-slate-100 sm:text-sm">{group.primary.id}</code>
          <p className="mt-0.5 text-[11px] text-slate-500">{group.family}{group.primary.vendor ? ' · ' + group.primary.vendor : ''}</p>
        </div>
        <div className="shrink-0">
          <PriceSummary pricing={group.primary.pricing} />
        </div>
      </div>
      <details className="group/details mt-2 border-t border-white/[0.06] pt-2">
        <summary className="cursor-pointer list-none text-[11px] font-medium text-cyan-200 marker:hidden hover:text-white">
          {hasMore ? '查看价格详情及其他接入 ID' : '查看价格详情'}
          <span className="ml-1 inline-block transition group-open/details:rotate-90">›</span>
        </summary>
        <div className="mt-3 space-y-3">
          {group.variants.map((variant) => (
            <div key={variant.id} className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[11px] text-slate-300">{variant.variant}</span>
                <code className="max-w-full break-all select-all text-[11px] text-slate-400">{variant.id}</code>
              </div>
              <PricingDetails pricing={variant.pricing} />
            </div>
          ))}
        </div>
      </details>
    </article>
  );
}

export function ModelCatalog({ models, available, total, syncedAt }: Props) {
  const [keyword, setKeyword] = useState('');
  const [family, setFamily] = useState('全部');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const groups = useMemo(() => {
    const byName = new Map<string, ListedModel[]>();
    for (const model of models) {
      const variants = byName.get(model.canonicalId) ?? [];
      variants.push(model);
      byName.set(model.canonicalId, variants);
    }
    return Array.from(byName.entries()).map(([canonicalId, variants]) => {
      const primary = variants.find((item) => item.variant === '默认线路') ?? variants[0];
      return { canonicalId, family: primary.family, variants, primary };
    });
  }, [models]);

  const featured = useMemo(() =>
    modelFamilies
      .map((group) => ({
        group,
        model: groups.find((item) => item.family === group.name && !item.primary.id.includes('/'))
      }))
      .filter((entry) => entry.model !== undefined),
    [groups]
  );

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return groups.filter((group) =>
      (family === '全部' || group.family === family) &&
      (!q || group.canonicalId.toLowerCase().includes(q) ||
        group.family.toLowerCase().includes(q) ||
        group.variants.some((variant) => variant.id.toLowerCase().includes(q)))
    );
  }, [groups, keyword, family]);

  const hasCatalog = available && groups.length > 0;
  const idCount = total ?? models.length;

  return (
    <section className="mt-14 scroll-mt-24" id="models" aria-labelledby="model-catalog-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300">MODEL CATALOG</p>
          <h2 id="model-catalog-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            模型目录与调用价格
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {hasCatalog
              ? '先看输入、输出价格；缓存、分档和不同线路的详细规则按需展开。'
              : '通过统一 API 连接 GPT、Claude、Gemini、Grok 等模型系列。'}
          </p>
        </div>
        <Link href="/api/docs#models" className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-200 transition hover:text-white">
          模型查询与接入说明 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {hasCatalog ? (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">{groups.length} 个模型</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">{idCount} 个 API ID（含不同线路）</span>
            <span>价格按上游目录同步</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {featured.map(({ group, model }, index) => (
              <article key={group.name} className="surface-panel min-w-0 rounded-2xl p-4 transition hover:border-cyan-300/35 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className={'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ' + tones[index % tones.length]}>
                    {group.initials}
                  </span>
                  <span className="text-[11px] text-slate-400">{group.provider}</span>
                </div>
                <p className="mt-4 text-xs font-medium text-slate-400">{group.name} · 较新版本</p>
                <h3 className="mt-2 min-h-12 break-all select-all text-base font-bold leading-6 text-white sm:text-lg">
                  {model?.primary.canonicalId}
                </h3>
                <div className="mt-2 border-t border-white/10 pt-2">
                  <PriceSummary pricing={model!.primary.pricing} />
                </div>
              </article>
            ))}
          </div>

          <div className="surface-panel mt-6 min-w-0 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-white">全部模型</h3>
              <span className="text-xs text-slate-400">较新版本优先 · 同名线路合并展示</span>
            </div>

            <div className="relative mt-4 min-w-0">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={keyword}
                onChange={(event) => { setKeyword(event.target.value); setVisible(PAGE_SIZE); }}
                placeholder="搜索模型名称或完整 API ID"
                aria-label="搜索模型"
                className="w-full min-w-0 rounded-xl border border-white/15 bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="按模型系列筛选">
              {choices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => { setFamily(choice); setVisible(PAGE_SIZE); }}
                  aria-pressed={family === choice}
                  className={'rounded-full border px-3 py-1.5 text-xs transition ' +
                    (family === choice
                      ? 'border-cyan-300/60 bg-cyan-300/15 font-semibold text-cyan-100'
                      : 'border-white/10 bg-white/[0.025] text-slate-400 hover:border-white/25 hover:text-white')}
                >
                  {choice}
                </button>
              ))}
            </div>

            <div className="mt-5 min-w-0 overflow-hidden rounded-xl border border-white/10">
              {filtered.length ? (
                <div className="divide-y divide-white/10">
                  {filtered.slice(0, visible).map((group) => <ModelRow key={group.canonicalId} group={group} />)}
                </div>
              ) : (
                <p className="px-4 py-8 text-center text-sm text-slate-400">没有找到符合条件的模型</p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-400">显示 {Math.min(visible, filtered.length)} / {filtered.length} 个模型</p>
              {filtered.length > visible && (
                <button
                  type="button"
                  onClick={() => setVisible((count) => count + PAGE_SIZE)}
                  className="rounded-lg border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300/40"
                >
                  显示更多
                </button>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs leading-6 text-slate-500">
            价格单位为上游用量计价单位 ⚡，Token 价格按百万 Token 展示，图片等按次模型单独标注。基础、标准等同名线路已合并，展开后可查看准确 API ID 与各线路价格。不同 Key 分组、缓存及特殊计费条件可能影响最终扣费，请以实际用量记录为准。
          </p>
          {syncedAt && <p className="mt-1 text-[11px] text-slate-600">目录更新时间：{new Date(syncedAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>}
        </>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {modelFamilies.map((model, index) => (
              <article key={model.name} className="surface-panel min-w-0 rounded-2xl p-4 transition hover:border-cyan-300/35 sm:p-5">
                <span className={'flex h-11 w-11 items-center justify-center rounded-xl border text-base font-bold ' + tones[index % tones.length]}>
                  {model.initials}
                </span>
                <h3 className="mt-4 break-words text-base font-bold text-white sm:text-lg">{model.name}</h3>
                <p className="mt-1 text-xs text-slate-400">{model.provider}</p>
                <p className="mt-3 text-xs leading-5 text-slate-300">{model.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs leading-6 text-slate-400">
            <Layers3 className="h-4 w-4 shrink-0" />
            具体可用模型 ID 请在接入时通过 /v1/models 查询。
          </div>
        </>
      )}
    </section>
  );
}
