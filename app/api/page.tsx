import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Code2,
  CreditCard,
  Globe2,
  KeyRound,
  Layers3,
  Sparkles,
  Terminal
} from 'lucide-react';

import { siteLinks } from '@/data/site-links';
import {
  alternativeApiBaseUrl,
  apiBaseUrl,
  keyOffers,
  modelFamilies,
  priceCheckedOn
} from '@/data/api-product';

export const metadata: Metadata = {
  title: 'AI API 接入｜热门模型统一调用 · 人民币购买｜智享AI',
  description: '一个 API 地址接入 GPT、Claude、Gemini、Grok、DeepSeek 等模型系列。人民币购买 API Key，提供接入示例和模型查询方式，快速接入 AI 工具与应用。',
  alternates: { canonical: 'https://www.zhibeimao.com/api' },
  openGraph: {
    title: '智享AI API｜热门模型，一个 API 就能接',
    description: '统一 API 地址、人民币购买、快速接入文档。查看支持的模型系列与当前 Key 商品参考价。',
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
  { icon: Layers3, title: '一个 Key，切换主流模型', detail: '不用逐个平台注册、申请不同 API Key' },
  { icon: CreditCard, title: '人民币购买，门槛更低', detail: '商城有小额度套餐，不用海外银行卡' },
  { icon: Globe2, title: '国内网络接入更简单', detail: '已实测接口可直连，无须自行配置海外代理' }
];

const journeys = [
  { number: '01', title: '购买现有 Key', desc: '从智享AI商城获取 Key，原来的 Key 也能继续用。' },
  { number: '02', title: '配置 API 地址', desc: '使用自有 Base URL，无须逐一接入模型厂商。' },
  { number: '03', title: '选择模型发起调用', desc: '先查询当前 Key 的模型 ID，再调用兼容接口。' }
];

const requestPreview = JSON.stringify({
  model: 'gpt-5.6-terra',
  messages: [{ role: 'user', content: '只回复 OK' }]
}, null, 2);

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
              智享AI API · 指北猫开放平台
            </div>
            <h1 className="mt-6 text-4xl font-black leading-[1.18] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              热门与新模型，
              <span className="mt-1 block bg-gradient-to-r from-violet-300 via-cyan-200 to-sky-300 bg-clip-text text-transparent">
                一个 API 就能接
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-300 sm:text-base">
              GPT、Claude、Gemini、Grok、DeepSeek 等模型系列，通过统一接口按需调用。
              人民币购买 Key，国内接入更省事；不用为不同厂商反复注册、配置支付或单独适配。
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['多模型统一入口', '人民币购买', 'OpenAI 兼容接口'].map((tag) => (
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
                查看套餐 · 购买 Key <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                href="/api/docs"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                <BookOpen className="h-4 w-4" /> 查看快速接入
              </Link>
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-400">
              小额度套餐当前参考价 ¥10 起。模型、价格与各接口可用性以实时查询和实际套餐为准。
            </p>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#080e1d]/95 shadow-[0_25px_70px_rgba(0,0,0,.3)]">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.025] px-4 py-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <span className="text-[11px] font-medium tracking-[0.14em] text-slate-400">LIVE API EXAMPLE</span>
            </div>
            <div className="space-y-5 p-4 sm:p-5">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                  <span className="rounded bg-emerald-400/15 px-2 py-1 font-bold text-emerald-300">POST</span>
                  <span>统一接口</span>
                </div>
                <code className="block break-all rounded-lg border border-white/10 bg-slate-900/80 px-3 py-3 text-[13px] leading-6 text-cyan-200">{apiBaseUrl}/chat/completions</code>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Request</p>
                <pre className="max-w-full overflow-x-auto rounded-lg border border-white/10 bg-slate-900/80 p-3 text-xs leading-6 text-slate-200"><code>{requestPreview}</code></pre>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Response</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" /> HTTP 200 已实测</span>
                </div>
                <div className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.04] px-3 py-3 text-sm">
                  <span className="font-mono text-emerald-200">{'"content": "OK"'}</span>
                </div>
              </div>
              <p className="text-[11px] leading-5 text-slate-500">
                对话接口示例来自已完成的调用验证；其他模型系列的具体型号、权限及价格以实时列表为准。
              </p>
            </div>
          </div>
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
          以上展示的是上游提供的模型系列，不代表所有型号或所有 Key 权限均已验收。请先使用 /v1/models 查询当前可用的模型 ID。
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
              不用申请海外银行卡，也不必一次投入很高的预算。先从小额度 Key 开始测试，确认模型满足需求再按需增加使用额度。
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              与官方价格相比是否更划算，需要按相同模型、Token 计价和实际扣费口径比较；不会用未经核对的折扣百分比误导购买。
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
          参考价格采集于 {priceCheckedOn}。商品名中的“美元额度”是商城标称额度，不等于模型官方同额 API 费用；库存、最终售价和实际使用扣费均以商城及用量记录为准。
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
          <p className="mt-3 text-sm leading-7 text-slate-300">已经买过 Key？不必更换。按以下 Base URL 在兼容客户端或代码中配置即可。</p>
          <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-xs text-slate-400">主 Base URL · 选中地址复制</p>
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
            <BadgeCheck className="h-5 w-5 text-emerald-300" /> 已完成的实际验证
          </div>
          <div className="mt-4 space-y-3">
            {[
              '两个正式 API 域名的对话调用均返回 HTTP 200',
              'Key 鉴权、模型列表及上游扣费记录正常',
              '流式对话已在同一反代项目临时域名通过'
            ].map((item) => (
              <p key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-300">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
                {item}
              </p>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-400">
            图片、视频及部分其他协议接口仍需分别验证；不同地区的网络连通性也以实际测试为准。
          </p>
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-violet-950/70 via-slate-900/70 to-cyan-950/55 px-5 py-9 text-center sm:px-10">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200"><KeyRound className="h-5 w-5" /></div>
        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">需要的模型，用一个入口开始</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
          先选一个适合的 Key 套餐，再使用我们的 API 文档完成接入。无需重新开发计费或账户系统。
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
