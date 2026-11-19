import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Code2, CreditCard, Globe2, Layers3 } from 'lucide-react';

import { siteLinks } from '@/data/site-links';

export function ApiPromoStrip() {
  return (
    <section className="relative mt-5 overflow-hidden rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-[#18223c] via-[#151c34] to-[#0d2230] p-5 sm:p-6 md:mt-6 md:p-7" aria-label="AI API 开放平台推荐">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="min-w-0 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.13em] text-cyan-300"><Code2 className="h-4 w-4" /> 智享AI API 开放平台</span>
          <h2 className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl">
            GPT、Claude、Gemini 等热门模型，一个 API 就能接
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            统一模型接口，人民币购买 Key，国内接入更省事。小额度套餐参考价 ¥10 起，按实际使用量扣费。
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5"><Layers3 className="h-3.5 w-3.5 text-cyan-300" /> 多模型</span>
            <span className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-cyan-300" /> 人民币套餐</span>
            <span className="inline-flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5 text-cyan-300" /> 接入方便</span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <Link
            href="/api"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            了解 API 服务 <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={siteLinks.apiKey}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            购买 Key <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
