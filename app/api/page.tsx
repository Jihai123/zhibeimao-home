import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CreditCard,
  Globe2,
  KeyRound,
  Layers3,
  Sparkles,
  Terminal
} from 'lucide-react';

import { siteLinks } from '@/data/site-links';
import { ModelCatalog } from '@/components/ModelCatalog';
import { CreditPricingSection } from '@/components/CreditPricingSection';
import { getPublicModelCatalog } from '@/lib/model-catalog';
import { apiBaseUrl } from '@/data/api-product';

export const metadata: Metadata = {
  title: '智享AI API｜统一模型 API 接入服务',
  description: '通过一个 OpenAI 兼容 API 地址调用多种 AI 模型。支持人民币购买、模型列表查询、客户端配置和开发者接入。',
  alternates: { canonical: 'https://www.zhibeimao.com/api' },
  openGraph: {
    title: '智享AI API｜多模型接入服务',
    description: '统一 API 地址，连接主流 AI 模型。提供模型选择、按需购买与开发接入指南。',
    url: 'https://www.zhibeimao.com/api',
    type: 'website'
  }
};

const advantages = [
  { icon: Layers3, title: '统一模型接口', detail: '多个模型系列，共用一个 API 地址' },
  { icon: CreditCard, title: '美元额度，人民币优惠购买', detail: '多档美元额度，人民币优惠入手' },
  { icon: Globe2, title: '便捷开发', detail: '兼容 OpenAI SDK 与自定义 API 客户端' }
];

const journeys = [
  { number: '01', title: '获取 API Key', desc: '在智享AI商城选择合适的额度。' },
  { number: '02', title: '配置接口地址', desc: '在应用或客户端中填写 API Base URL。' },
  { number: '03', title: '选择模型', desc: '查询当前 Key 可用模型，发起首次调用。' }
];

export const revalidate = 3600;

export default async function ApiProductPage() {
  const catalog = await getPublicModelCatalog();

  return (
    <main className="mx-auto w-full min-w-0 max-w-7xl px-4 pb-16 pt-5 sm:px-6 md:px-8 md:pt-9">
      <section className="relative isolate overflow-hidden rounded-[26px] border border-white/10 bg-[#10172b] px-5 py-9 shadow-[0_20px_80px_rgba(0,0,0,0.18)] sm:px-8 md:rounded-[32px] md:px-10 md:py-14 lg:px-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-32 -z-10 h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 left-0 -z-10 h-[350px] w-[350px] rounded-full bg-violet-600/15 blur-[110px]" />
        <div className="grid min-w-0 gap-9 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-center lg:gap-8">
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3.5 py-2 text-xs font-medium text-cyan-100">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              智享AI · 模型接入服务
            </div>
            <h1 className="mt-6 text-4xl font-black leading-[1.18] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              一个 Key，
              <span className="mt-1 block bg-gradient-to-r from-violet-300 via-cyan-200 to-sky-300 bg-clip-text text-transparent">
                连接主流 AI 模型
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-300 sm:text-base">
              通过统一 API 地址连接多个主流 AI 模型系列，简化应用、智能体及开发工具的接入。美元计价的 API 额度也能直接用人民币优惠购买，明码标价，按需选择。
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['OpenAI 兼容接口', '多模型接入', '美元额度折扣购买'].map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-[11px] font-medium text-slate-200 sm:text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={siteLinks.apiKey}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-[0_8px_30px_rgba(6,182,212,0.18)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                获取 API Key <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                href="#models"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                <Layers3 className="h-4 w-4" /> 查看模型目录
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
              <span>支持多种使用额度及模型系列</span>
              <a href={siteLinks.apiKeyBalance} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-200 hover:text-white">查询 Key 余额 <ArrowUpRight className="inline h-3 w-3" /></a>
            </div>
          </div>

          <aside className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1425]/85 p-5 sm:p-6" aria-label="API 接入概览">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">API 接入概览</p>
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-2.5 py-1 text-xs text-cyan-200">OpenAI 兼容</span>
            </div>
            <div className="mt-6">
              <p className="text-xs font-medium text-slate-400">Base URL</p>
              <code className="mt-2 block break-all select-all rounded-xl border border-white/10 bg-[#090f1d] px-4 py-3 text-sm leading-6 text-cyan-200">{apiBaseUrl}</code>
            </div>
            <div className="mt-5 grid gap-3">
              <Link
                href="#models"
                aria-label="跳转到模型列表和价格"
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3.5 transition hover:border-cyan-300/35 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200"><Layers3 className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white">模型列表</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-400">查看模型、输入价格和输出价格</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-cyan-200" />
              </Link>
              <Link
                href="/api/docs#first-call"
                aria-label="打开快速调用示例"
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3.5 transition hover:border-violet-300/35 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-200"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-300/10 text-violet-200"><Terminal className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white">快速调用</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-400">查看 cURL 和 Python 调用示例</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-violet-200" />
              </Link>
            </div>
            <Link href="/api/docs#first-call" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-200 hover:text-white">
              查看调用示例 <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
        <div className="mt-9 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
          {advantages.map(({ icon: Icon, title, detail }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-200"><Icon className="h-4 w-4" /></span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CreditPricingSection />

      <ModelCatalog models={catalog.models} available={catalog.available} syncedAt={catalog.syncedAt} />

      <section className="mt-16 scroll-mt-24" id="quickstart" aria-labelledby="start-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">GET STARTED</p>
            <h2 id="start-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              三步完成 API 接入
            </h2>
          </div>
          <Link href="/api/docs" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition hover:text-white">
            查看完整接入说明 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {journeys.map((step) => (
            <article key={step.number} className="surface-panel rounded-2xl p-5 sm:p-6">
              <span className="font-mono text-3xl font-bold text-cyan-300/80">{step.number}</span>
              <h3 className="mt-3 text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-violet-950/70 via-slate-900/70 to-cyan-950/55 px-5 py-9 text-center sm:px-10">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200"><KeyRound className="h-5 w-5" /></div>
        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">将 AI 模型接入你的产品</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
          使用统一 API 和开发文档，将模型能力集成到应用与开发工作流中。
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={siteLinks.apiKey} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300">
            查看套餐并购买 <ArrowUpRight className="h-4 w-4" />
          </a>
          <Link href="/api/docs" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
            <BookOpen className="h-4 w-4" /> 查看接入文档
          </Link>
        </div>
      </section>
    </main>
  );
}
