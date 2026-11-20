'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers3, Search } from 'lucide-react';

import { modelFamilies } from '@/data/api-product';
import type { ListedModel } from '@/lib/model-catalog';
import { isFeaturedModel } from '@/lib/model-ranking';

type Props = {
  models: ListedModel[];
  available: boolean;
};

const tones = [
  'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
  'border-orange-400/20 bg-orange-400/10 text-orange-200',
  'border-sky-400/20 bg-sky-400/10 text-sky-200',
  'border-violet-400/20 bg-violet-400/10 text-violet-200'
];

const PAGE_SIZE = 18;
const choices = ['全部', ...modelFamilies.map((family) => family.name), '其他'];

export function ModelCatalog({ models, available }: Props) {
  const [keyword, setKeyword] = useState('');
  const [family, setFamily] = useState('全部');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const featured = useMemo(() =>
    modelFamilies
      .map((group) => ({ group, model: models.find((item) => item.family === group.name && isFeaturedModel(item)) }))
      .filter((entry) => entry.model !== undefined),
    [models]
  );

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return models.filter((model) =>
      (family === '全部' || model.family === family) &&
      (!q || model.id.toLowerCase().includes(q) || model.family.toLowerCase().includes(q))
    );
  }, [models, keyword, family]);

  const hasCatalog = available && models.length > 0;

  return (
    <section className="mt-14 scroll-mt-24" id="models" aria-labelledby="model-catalog-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300">MODEL CATALOG</p>
          <h2 id="model-catalog-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            发现主流 AI 模型
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {hasCatalog
              ? '浏览当前目录中的较新版本及全部模型 ID。数据每日同步更新。'
              : '通过统一 API 连接 GPT、Claude、Gemini、Grok 等模型系列。'}
          </p>
        </div>
        <Link href="/api/docs#models" className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-200 transition hover:text-white">
          模型查询与接入说明 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {hasCatalog ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
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
                  {model?.id}
                </h3>
              </article>
            ))}
          </div>

          <div className="surface-panel mt-6 min-w-0 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-white">完整模型目录</h3>
              <span className="text-xs text-slate-400">{models.length} 个型号 · 较新版本优先</span>
            </div>

            <div className="relative mt-4 min-w-0">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={keyword}
                onChange={(event) => { setKeyword(event.target.value); setVisible(PAGE_SIZE); }}
                placeholder="搜索模型名称或 ID"
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
                  {filtered.slice(0, visible).map((model) => (
                    <div key={model.id} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-3.5 sm:px-5">
                      <code className="min-w-0 break-all select-all text-xs font-medium leading-6 text-slate-100 sm:text-sm">{model.id}</code>
                      <span className="shrink-0 text-xs text-slate-400">{model.family}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-8 text-center text-sm text-slate-400">没有找到符合条件的模型</p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-400">显示 {Math.min(visible, filtered.length)} / {filtered.length} 个型号</p>
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
            型号根据模型目录同步更新，优先展示较新版本；该顺序不代表官方发布日期。实际可调用范围及计费以购买的 API Key 权限和套餐为准。
          </p>
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
