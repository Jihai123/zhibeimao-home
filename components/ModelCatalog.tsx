'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers3, Search } from 'lucide-react';

import { modelFamilies } from '@/data/api-product';
import type { ListedModel } from '@/lib/model-catalog';
import type { BillingTier, ModelPricing, PriceTerms, TimePriceWindow } from '@/lib/model-catalog-pricing';

type Props = {
  models: ListedModel[];
  available: boolean;
  syncedAt?: string | null;
};

type ModelGroup = {
  canonicalId: string;
  family: string;
  variants: ListedModel[];
  primary: ListedModel;
};

const PAGE_SIZE = 10;
const choices = ['全部', ...modelFamilies.map((family) => family.name), '其他'];

// Route order is for comparing one canonical model, not for altering upstream
// prices, model ranking or availability. Some models have only one route.
const routePriority: Record<string, number> = {
  '基础线路': 0,
  '标准线路': 1,
  '默认线路': 2
};

function orderRoutes(variants: ListedModel[]): ListedModel[] {
  return [...variants].sort((a, b) =>
    (routePriority[a.variant] ?? 3) - (routePriority[b.variant] ?? 3)
  );
}

function formatPrice(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 4 }).format(value);
}

function RatePair({ terms }: { terms: PriceTerms }) {
  const hasInput = terms.input !== undefined;
  const hasOutput = terms.output !== undefined;
  if (!hasInput && !hasOutput) return <span className="text-xs text-slate-400">价格明细见下方</span>;
  return (
    <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-[11px] leading-5 text-slate-300 sm:text-xs">
      {hasInput && <span>输入 <strong className="font-semibold text-cyan-100">⚡{formatPrice(terms.input)}</strong></span>}
      {hasOutput && <span>输出 <strong className="font-semibold text-cyan-100">⚡{formatPrice(terms.output)}</strong></span>}
    </div>
  );
}

function formatHour(hour: number): string {
  return String(hour).padStart(2, '0') + ':00';
}

function timeWindowText(windows: TimePriceWindow[]): string {
  const grouped = new Map<number, string[]>();
  for (const window of windows) {
    const entries = grouped.get(window.multiplier) ?? [];
    entries.push(formatHour(window.startHour) + '–' + formatHour(window.endHour));
    grouped.set(window.multiplier, entries);
  }
  return Array.from(grouped.entries())
    .map(([multiplier, ranges]) => ranges.join('、') + '按 ' + formatPrice(multiplier) + ' 倍计费')
    .join('；');
}

function PriceSummary({ pricing }: { pricing: ModelPricing }) {
  if (pricing.kind === 'token') {
    return (
      <div className="text-right">
        <RatePair terms={{ input: pricing.input, output: pricing.output }} />
        <p className="mt-0.5 text-[10px] text-slate-500">每百万 Token</p>
      </div>
    );
  }

  if (pricing.kind === 'tiered') {
    const durationRate = pricing.tiers.find((tier) => tier.terms.seconds !== undefined)?.terms.seconds;
    if (durationRate !== undefined) {
      return (
        <div className="text-right">
          <p className="text-xs font-semibold text-cyan-100">⚡{formatPrice(durationRate)} / 秒</p>
          <p className="mt-0.5 text-[10px] text-slate-500">按视频时长计费</p>
        </div>
      );
    }

    if (pricing.tiers.length === 1) {
      const tier = pricing.tiers[0];
      return (
        <div className="text-right">
          <RatePair terms={tier.terms} />
          <p className="mt-0.5 text-[10px] text-slate-500">每百万 Token</p>
          {pricing.timeVariable && (
            <p className="mt-1 max-w-[280px] text-[10px] leading-4 text-amber-200/90">
              {pricing.timeWindows.length
                ? '北京时间 ' + timeWindowText(pricing.timeWindows)
                : '部分时段价格会浮动'}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2 text-right">
        {pricing.tiers.map((tier: BillingTier, index: number) => (
          <div key={tier.label + index}>
            <p className="mb-0.5 text-[10px] font-medium text-slate-400">{tier.condition ?? tier.label}</p>
            <RatePair terms={tier.terms} />
          </div>
        ))}
        <p className="text-[10px] text-slate-500">每百万 Token</p>
      </div>
    );
  }

  if (pricing.kind === 'request') {
    return (
      <div className="text-right">
        <p className="text-xs font-semibold text-cyan-100">⚡{formatPrice(pricing.perRequest)} / 次</p>
        <p className="mt-0.5 text-[10px] text-slate-500">按请求次数计费</p>
      </div>
    );
  }

  if (pricing.kind === 'complex') {
    return <span className="text-xs text-amber-100">计费规则请展开查看</span>;
  }

  return <span className="text-xs text-slate-500">价格信息暂未提供</span>;
}

function Metric({ label, value }: { label: string; value: number | undefined }) {
  if (value === undefined || (label === '输入图片 / 张' && value === 0)) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">⚡{formatPrice(value)}</p>
    </div>
  );
}

function TermsGrid({ terms }: { terms: PriceTerms }) {
  const metrics: Array<[string, number | undefined]> = [
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
      {visible.map(([label, value]) => <Metric key={label} label={label} value={value} />)}
    </div>
  );
}

function PricingDetails({ pricing }: { pricing: ModelPricing }) {
  if (pricing.kind === 'token') {
    return (
      <div className="mt-3">
        <TermsGrid terms={{ input: pricing.input, output: pricing.output, cacheRead: pricing.cacheRead, cacheWrite: pricing.cacheWrite }} />
        <p className="mt-2 text-[11px] leading-5 text-slate-500">⚡表示模型调用时消耗的额度单位，不是人民币价格；Token 价格按百万 Token 计算，实际扣费以 Key 用量记录为准。</p>
      </div>
    );
  }

  if (pricing.kind === 'tiered') {
    return (
      <div className="mt-3 space-y-3">
        {pricing.tiers.map((tier: BillingTier, index: number) => (
          <div key={tier.label + index} className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-white">{tier.condition ?? tier.label}</span>
            </div>
            <TermsGrid terms={tier.terms} />
          </div>
        ))}
        {pricing.timeVariable && (
          <p className="rounded-lg border border-amber-300/15 bg-amber-300/[0.06] px-3 py-2 text-[11px] leading-5 text-amber-100/80">
            {pricing.timeWindows.length
              ? '北京时间 ' + timeWindowText(pricing.timeWindows)
              : '该模型会按不同时段的倍率计费。'}
          </p>
        )}
        <p className="text-[11px] leading-5 text-slate-500">⚡表示模型调用时消耗的额度单位，不是人民币价格；Token 价格按百万 Token 计算，视频按秒计算。实际扣费以 Key 用量记录为准。</p>
      </div>
    );
  }

  if (pricing.kind === 'request') {
    return (
      <div className="mt-3">
        <Metric label="每次请求" value={pricing.perRequest} />
        <p className="mt-2 text-[11px] leading-5 text-slate-500">⚡表示模型调用时消耗的额度单位，不是人民币价格；每次请求按对应单价扣除额度。</p>
      </div>
    );
  }

  if (pricing.kind === 'complex') {
    return <p className="mt-3 text-xs leading-5 text-amber-100/80">该模型采用特殊计费规则，暂不展示估算单价；实际扣费以 Key 用量记录为准。</p>;
  }

  return <p className="mt-3 text-xs text-slate-500">当前没有可确认的价格信息，请以 Key 用量记录为准。</p>;
}

function ModelRow({ group }: { group: ModelGroup }) {
  const hasMore = group.variants.length > 1;
  return (
    <article className="min-w-0 px-3 py-4 sm:px-5">
      <div className="grid min-w-0 grid-cols-1 items-start gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.9fr)] sm:items-center sm:gap-5">
        <div className="min-w-0">
          <code className="block break-all select-all text-xs font-semibold leading-6 text-slate-100 sm:text-sm">{group.primary.id}</code>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {group.family}{group.primary.vendor ? ' · ' + group.primary.vendor : ''}
            {hasMore ? ' · 先展示' + group.primary.variant + '价格' : ''}
          </p>
        </div>
        <div className="min-w-0 rounded-lg border border-white/[0.06] bg-slate-950/25 px-3 py-2 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
          <PriceSummary pricing={group.primary.pricing} />
        </div>
      </div>
      <details className="group/details mt-3 border-t border-white/[0.06] pt-2">
        <summary className="cursor-pointer list-none text-[11px] font-medium text-cyan-200 marker:hidden hover:text-white">
          {hasMore ? '对比 ' + group.variants.length + ' 种线路的价格与完整模型 ID' : '查看缓存等价格明细'}
          <span className="ml-1 inline-block transition group-open/details:rotate-90">›</span>
        </summary>
        <div className="mt-3">
          <p className="mb-3 text-[11px] leading-5 text-slate-400">
            价格和使用体验可能因线路不同而变化，以下展示各线路的真实目录价格。调用时请复制完整模型 ID（包含 basic/ 或 standard/ 前缀）。
          </p>
          <div className="grid gap-3 lg:grid-cols-3">
            {group.variants.map((variant) => (
              <div key={variant.id} className={'min-w-0 rounded-xl border p-3 ' +
                (variant.variant === '基础线路'
                  ? 'border-cyan-300/20 bg-cyan-300/[0.04]'
                  : 'border-white/10 bg-white/[0.025]')}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-xs font-semibold text-slate-100">{variant.variant}</span>
                  {variant.variant === '基础线路' && <span className="text-[10px] text-cyan-200">省额度选择</span>}
                  {variant.variant === '标准线路' && <span className="text-[10px] text-slate-400">常用对比选项</span>}
                  {variant.variant === '默认线路' && <span className="text-[10px] text-slate-400">请留意扣费</span>}
                </div>
                <code className="mt-2 block break-all select-all text-[11px] leading-5 text-slate-300">{variant.id}</code>
                <div className="mt-3 border-t border-white/10 pt-3">
                  <PriceSummary pricing={variant.pricing} />
                </div>
                {variant.variant === '基础线路' && (
                  <p className="mt-3 text-[11px] leading-5 text-slate-400">
                    适合日常使用，偶尔可能出现响应波动；遇到问题可对比其他线路。
                  </p>
                )}
                <details className="mt-3 border-t border-white/10 pt-2">
                  <summary className="cursor-pointer text-[11px] text-cyan-200">查看完整计费明细</summary>
                  <PricingDetails pricing={variant.pricing} />
                </details>
              </div>
            ))}
          </div>
        </div>
      </details>
    </article>
  );
}

export function ModelCatalog({ models, available, syncedAt }: Props) {
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
      const ordered = orderRoutes(variants);
      // Standard is the balanced default for display when available; this
      // does not claim a universal stability or quality guarantee.
      const primary = ordered.find((item) => item.variant === '标准线路')
        ?? ordered.find((item) => item.variant === '基础线路')
        ?? ordered[0];
      return { canonicalId, family: primary.family, variants: ordered, primary };
    });
  }, [models]);

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

  return (
    <section className="mt-14 scroll-mt-24" id="models" aria-labelledby="model-catalog-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300">MODEL PRICING</p>
          <h2 id="model-catalog-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            模型目录与调用价格
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            输入、输出价格直接列出；长上下文、缓存和特殊计费规则也会明确说明。
          </p>
        </div>
        <Link href="/api/docs#models" className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-200 transition hover:text-white">
          模型查询与接入说明 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {hasCatalog ? (
        <>
          <div className="mt-4 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-3 text-xs leading-6 text-slate-300">
            <strong className="font-semibold text-cyan-100">价格单位说明：</strong>
            ⚡表示模型调用时消耗的额度单位，不是人民币价格；Token 按每百万 Token 展示，图片按次、视频按秒计费。人民币购买上方的美元额度，调用时按对应模型的额度费率扣除。
          </div>

          <div className="surface-panel mt-5 min-w-0 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-white">选择模型</h3>
              <span className="text-xs text-slate-400">搜索名称或 API ID，按模型系列筛选</span>
            </div>

            <div className="relative mt-4 min-w-0">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={keyword}
                onChange={(event) => { setKeyword(event.target.value); setVisible(PAGE_SIZE); }}
                placeholder="搜索模型名称或 API ID"
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

            {filtered.length > visible && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((count) => count + PAGE_SIZE)}
                  className="rounded-lg border border-white/15 bg-white/[0.05] px-5 py-2.5 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-white/[0.08]"
                >
                  显示更多模型
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] leading-5 text-slate-500">
            <p>同一模型可能有不同接入 ID，展开后可查看各线路 ID 和完整计费规则。</p>
            {syncedAt && <p>价格数据更新于 {new Date(syncedAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>}
          </div>
        </>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-2 text-xs leading-6 text-slate-400">
            <Layers3 className="h-4 w-4 shrink-0" />
            具体可用模型 ID 请在接入时通过 /v1/models 查询。
          </div>
        </>
      )}
    </section>
  );
}
