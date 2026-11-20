import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  CreditCard,
  Globe2,
  KeyRound,
  Layers3,
  MessagesSquare,
  Sparkles,
  Terminal
} from 'lucide-react';

import { siteLinks } from '@/data/site-links';
import { ApiDirectUseSection } from '@/components/ApiDirectUseSection';
import {
  alternativeApiBaseUrl,
  apiBaseUrl,
  keyOffers,
  modelFamilies,
  priceCheckedOn
} from '@/data/api-product';

export const metadata: Metadata = {
  title: '智享AI API｜多模型在线使用与开发接入',
  description: '智享AI 提供主流 AI 模型的在线对话、图像视频创作入口与统一 API 接入服务。支持人民币购买、模型查询和开发者文档。',
  alternates: { canonical: 'https://www.zhibeimao.com/api' },
  openGraph: {
    title: '智享AI API｜多模型接入服务',
    description: '在线使用主流 AI 工具，或通过统一 API 接入自己的应用。提供人民币购买及快速接入指南。',
    url: 'https://www.zhibeimao.com/api',
    type: 'website'
  }
};

const modelTones = [
  'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  'border-orange-400/25 bg-orange-400/10 text-orange-200',
  'border-sky-400/25 bg-sky-400/10 text-sky-200',
  'border-violet-400/25 bg-violet-400/10 text-violet-200'
];

const advantages = [
  { icon: Layers3, title: '主流模型聚合', detail: '对话与创作场景，灵活选择 AI 能力' },
  { icon: CreditCard, title: '便捷购买', detail: '人民币结算，灵活选择使用额度' },
  { icon: Globe2, title: '统一 API 接入', detail: '一个地址连接应用及兼容客户端' }
];

const journeys = [
  { number: '01', title: '获取 API Key', desc: '在智享AI商城选择合适的额度。' },
  { number: '02', title: '配置接口地址', desc: '在应用或客户端中填写 API Base URL。' },
  { number: '03', title: '选择模型', desc: '查询当前 Key 可用模型，发起首次调用。' }
];

export default function ApiProductPage() {
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
              在线对话、图像与视频创作，以及面向应用和智能体的 API 接入。统一服务入口，灵活选择所需模型与使用方式。
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['在线使用', 'API 开发', '人民币购买'].map((tag) => (
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
                href="#direct-use"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                <MessagesSquare className="h-4 w-4" /> 在线使用
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
              <span>多种额度可选，支持不同 AI 应用场景</span>
              <Link href="/api/docs" className="font-semibold text-cyan-200 hover:text-white">开发者接入文档 <ArrowRight className="inline h-3 w-3" /></Link>
            </div>
          </div>

          <aside className="min-w-0 rounded-2xl border border-white/10 bg-[#0d1425]/85 p-5 sm:p-6" aria-label="服务使用方式">
            <p className="text-xs font-semibold tracking-[0.15em] text-slate-400">使用方式</p>
            <div className="mt-4 space-y-3">
              <Link href="#direct-use" className="group block rounded-xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyan-300/35 hover:bg-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200"><MessagesSquare className="h-5 w-5" /></span>
                  <h3 className="text-base font-semibold text-white">在线使用</h3>
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-400 group-hover:text-cyan-200" />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">通过 LibreChat、ArtChat 和 AIView 使用 AI 对话及创作工具。</p>
              </Link>
              <Link href="/api/docs" className="group block rounded-xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyan-300/35 hover:bg-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-300/10 text-violet-200"><Terminal className="h-5 w-5" /></span>
                  <h3 className="text-base font-semibold text-white">开发者 API</h3>
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-400 group-hover:text-cyan-200" />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">兼容主流接口格式，快速集成至应用与开发工具。</p>
              </Link>
            </div>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-xs text-slate-500">API Base URL</p>
              <code className="mt-2 block break-all select-all text-xs leading-6 text-cyan-200">{apiBaseUrl}</code>
            </div>
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

      <ApiDirectUseSection />

      <section className="mt-14 scroll-mt-24" id="models" aria-labelledby="model-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">MODEL ECOSYSTEM</p>
            <h2 id="model-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              主流模型系列，集中接入
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              不必分别维护多个厂商的接入地址。新型号以模型目录和当前 Key 权限为准。
            </p>
          </div>
          <Link href="/api/docs#models" className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-200 transition hover:text-white">
            查询准确模型 ID <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {modelFamilies.map((model, index) => (
            <article key={model.name} className="group surface-panel min-w-0 rounded-2xl p-4 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/35 sm:p-5">
              <div className={'flex h-11 w-11 items-center justify-center rounded-xl border text-base font-black ' + modelTones[index % modelTones.length]}>
                {model.initials}
              </div>
              <h3 className="mt-4 break-words text-base font-bold text-white sm:text-lg">{model.name}</h3>
              <p className="mt-1 text-xs text-slate-400">{model.provider}</p>
              <p className="mt-3 text-xs leading-5 text-slate-300">{model.description}</p>
            </article>
          ))}
        </div>
        <p className="mt-3 text-xs leading-6 text-slate-500">
          具体模型版本和调用权限以您的 API Key 可查询到的模型列表为准。
        </p>
      </section>

      <section className="mt-16 scroll-mt-24" id="pricing" aria-labelledby="pricing-title">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">ACCESSIBLE PRICING</p>
            <h2 id="pricing-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              小额度起步，按需购买
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate-300">
              人民币购买，无需海外银行卡。提供多种额度选择，可根据实际使用需求灵活购买。
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              不同模型采用不同计费规则。具体价格、可用额度与商品信息，请以购买页面为准。
            </p>
            <a href={siteLinks.apiKey} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15">
              查看商城实时价格 <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {keyOffers.map((offer, index) => (
              <a
                key={offer.amount}
                href={siteLinks.apiKey}
                target="_blank"
                rel="noopener noreferrer"
                className={'surface-panel group relative flex min-w-0 flex-col rounded-2xl p-5 transition hover:border-cyan-300/40 ' + (index === 1 ? 'ring-1 ring-cyan-300/30' : '')}
              >
                <span className="text-xs font-semibold text-slate-400">{offer.label}</span>
                <div className="mt-3 flex items-end gap-1 text-white">
                  <span className="pb-1 text-lg font-bold">¥</span>
                  <span className="text-4xl font-black tracking-tight">{offer.price}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-200">{offer.amount} 美元额度通用 Key</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-cyan-200 group-hover:text-white">
                  查看库存并购买 <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
        <p className="mt-4 text-xs leading-6 text-slate-500">
          套餐展示为 {priceCheckedOn} 价格参考。美元额度为商城商品标称额度，模型实际使用费用及最新价格以购买页面为准。
        </p>
      </section>

      <section className="mt-16 scroll-mt-24" id="quickstart" aria-labelledby="start-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">GET STARTED</p>
            <h2 id="start-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              三步完成首次调用
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

      <section className="mt-16 grid gap-4 md:grid-cols-2">
        <div className="surface-panel min-w-0 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <Terminal className="h-5 w-5 text-cyan-200" /> 自有 API 地址
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">在支持 OpenAI 兼容接口的客户端或代码中，填写以下 Base URL 与您的 API Key。</p>
          <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-xs text-slate-400">主 Base URL</p>
            <code className="mt-2 block break-all select-all text-sm font-semibold text-cyan-200">{apiBaseUrl}</code>
            <p className="mt-3 text-xs text-slate-400">备用地址</p>
            <code className="mt-1 block break-all select-all text-xs text-slate-200">{alternativeApiBaseUrl}</code>
          </div>
          <Link href="/api/docs" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
            <Code2 className="h-4 w-4" /> cURL / Python / 客户端示例 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="surface-panel min-w-0 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <Layers3 className="h-5 w-5 text-cyan-200" /> 开发者资源
          </div>
          <div className="mt-4 space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-sm font-semibold text-white">模型列表</h3>
              <p className="mt-1 text-sm text-slate-400">根据 API Key 权限查询可用的模型与版本。</p>
            </div>
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-sm font-semibold text-white">接入示例</h3>
              <p className="mt-1 text-sm text-slate-400">提供 cURL、Python 与常用 AI 客户端配置说明。</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">账户余额</h3>
              <p className="mt-1 text-sm text-slate-400">查看可用额度，合理管理模型使用成本。</p>
            </div>
          </div>
          <a href={siteLinks.apiKeyBalance} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
            查询 Key 余额 <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-violet-950/70 via-slate-900/70 to-cyan-950/55 px-5 py-9 text-center sm:px-10">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200"><KeyRound className="h-5 w-5" /></div>
        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">直接使用，或把 API 接入自己的产品</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
          选择在线工具使用 AI 服务，或通过统一 API 连接自己的应用。
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
