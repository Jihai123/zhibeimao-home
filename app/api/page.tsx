import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Code2,
  KeyRound,
  Layers3,
  Terminal,
  Wallet
} from 'lucide-react';

import { siteLinks } from '@/data/site-links';
import { ApiCopyButton } from '@/components/ApiCopyButton';

export const metadata: Metadata = {
  title: '多模型 API 接入｜智享AI · 指北猫',
  description: '热门 AI 模型统一 API 接入，免去多平台申请与海外支付的麻烦。购买 Key、查看价格与接入指南一站完成。',
  alternates: { canonical: 'https://www.zhibeimao.com/api' }
};

const features = [
  {
    icon: Terminal,
    title: '几分钟完成接入',
    text: '复制 API 地址，填入现有 Key，使用熟悉的对话调用格式。',
    href: '/api/docs',
    cta: '查看快速开始'
  },
  {
    icon: Layers3,
    title: '模型列表随 Key 查询',
    text: '通过 /v1/models 查询当前 Key 可用的模型 ID，避免使用失效名称。',
    href: '/api/docs#models',
    cta: '查看接口'
  },
  {
    icon: BookOpen,
    title: '统一文档入口',
    text: '对话、Responses、Messages、Gemini 等常见接口路径统一整理。',
    href: '/api/docs#endpoints',
    cta: '查看接入文档'
  }
];

const steps = [
  { index: '01', title: '获取 API Key', text: '继续使用现有商城购买的 Key，不需要新账户或额外换 Key。' },
  { index: '02', title: '配置自有 API 地址', text: '主地址 api.zhibeimao.com，兼容地址 api.chatgpt5x.com。' },
  { index: '03', title: '发送首次请求', text: '先使用已实测的聊天接口，再根据需要选择其他模型能力。' }
];

const endpoint = 'https://api.zhibeimao.com/v1';

export default function ApiProductPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-7 md:px-8 md:py-11">
      <section className="surface-panel relative overflow-hidden rounded-[30px] px-6 py-10 md:px-12 md:py-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-[90px]" />
        <div className="relative max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-200">
            <Code2 className="h-4 w-4" /> 智享AI API · 指北猫开放平台
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            热门 AI 模型，<span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">一个 API 就能接</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            不必为不同模型反复申请平台账号。一个入口接入 GPT、Claude、Gemini、Grok 等模型系列，使用现有 Key，在程序、AI 客户端和 Agent 中灵活调用。实际可用模型以当前 Key 的列表为准。
          </p>
          <div className="mt-7 flex flex-wrap gap-2 text-xs text-slate-200">
            {['热门模型统一接入', '国内购买更方便', '按使用量扣费'].map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              { title: '一个 Key，切换多种模型', description: '省去逐家注册和反复适配的麻烦' },
              { title: '更有竞争力的价格', description: '按模型和使用量计费，具体售价见商城' },
              { title: '国内接入更省事', description: '无需海外银行卡，已验证的接口可直接调用' }
            ].map((benefit) => (
              <div key={benefit.title} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-sm font-semibold text-white">{benefit.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">{benefit.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={siteLinks.apiKey}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white transition hover:brightness-110"
            >
              立即购买 API Key <ArrowRight className="h-4 w-4" />
            </a>
            <Link href="/api/docs" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/5">
              3 分钟快速接入 <BookOpen className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="relative mt-10 max-w-4xl rounded-2xl border border-white/10 bg-slate-950/80 p-4 md:p-5">
          <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> API Base URL
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <code className="block break-all text-sm font-semibold text-cyan-200 md:text-base">{endpoint}</code>
            <ApiCopyButton value={endpoint} label="复制地址" />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-400">备选域名：https://api.chatgpt5x.com/v1。对话与模型列表已完成实际调用验证；不同网络与模型可用性请以实测为准。</p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="model-family">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">MULTI-MODEL ACCESS</p>
            <h2 id="model-family" className="mt-2 text-2xl font-bold text-white">从热门模型到新版本，统一入口查找</h2>
          </div>
          <Link href="/api/docs#models" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">
            如何查询可用模型 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="surface-panel rounded-2xl p-5 md:p-6">
          <div className="flex flex-wrap gap-2.5">
            {['GPT', 'Claude', 'Gemini', 'Grok', 'DeepSeek', 'Qwen', 'Kimi', 'GLM'].map((family) => (
              <span key={family} className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-slate-100">
                {family}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-400">以上为上游模型系列示例，并不代表每个 Key 已开通所有型号。实际支持的模型名称和权限请通过 /v1/models 查询。</p>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="how-to-start">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">GET STARTED</p>
            <h2 id="how-to-start" className="mt-2 text-2xl font-bold text-white md:text-3xl">三步完成第一次调用</h2>
          </div>
          <Link href="/api/docs" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">
            开始接入 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.index} className="surface-panel rounded-2xl p-6">
              <span className="text-3xl font-black text-cyan-300/70">{step.index}</span>
              <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="features">
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">BUILD WITH API</p>
          <h2 id="features" className="mt-2 text-2xl font-bold text-white md:text-3xl">选模型、查价格、接入程序</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} href={feature.href} className="group surface-panel flex flex-col rounded-2xl p-6 transition hover:border-cyan-300/50">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Icon className="h-5 w-5 text-cyan-200" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-7 text-slate-300">{feature.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-cyan-200 group-hover:text-white">
                  {feature.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-14 grid gap-4 lg:grid-cols-2" aria-label="接入及消费说明">
        <div className="surface-panel rounded-2xl p-6 md:p-7">
          <div className="flex items-center gap-2 text-lg font-semibold text-white"><BadgeCheck className="h-5 w-5 text-emerald-300" /> 当前已验证</div>
          <p className="mt-4 text-sm leading-7 text-slate-300">自有 API 域名的模型对话、Key 鉴权、模型列表和消费扣费已完成实际测试；流式响应已在同一反代项目的临时域名验证。</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['/v1/chat/completions', '/v1/models'].map((path) => (
              <code key={path} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-cyan-100">{path}</code>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-400">图片、视频、Gemini 等接口已有技术路径，但尚未全部完成自有域名实测，不能视为已通过验收。</p>
        </div>
        <div className="surface-panel rounded-2xl p-6 md:p-7">
          <div className="flex items-center gap-2 text-lg font-semibold text-white"><Wallet className="h-5 w-5 text-cyan-300" /> 购买与用量</div>
          <p className="mt-4 text-sm leading-7 text-slate-300">原有商城直接购买和查询余额，无需海外银行卡。你看到的价格取决于模型和套餐；我们将逐步补充可核实的官方价格对照，不使用未经验证的全站折扣宣传。</p>
          <a href={siteLinks.apiKey} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
            前往现有 Key 商城 <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="mt-14 rounded-[28px] border border-cyan-300/20 bg-gradient-to-r from-violet-950/60 to-cyan-950/40 px-6 py-9 text-center md:px-10">
        <h2 className="text-2xl font-bold text-white">从第一次请求开始</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300">已有 Key？直接查看示例代码。还没有 Key？从原商城购买即可，无需重复注册开发者平台。</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/api/docs" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
            <Terminal className="h-4 w-4" /> 查看示例
          </Link>
          <a href={siteLinks.apiKey} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300">
            <KeyRound className="h-4 w-4" /> 获取 API Key
          </a>
        </div>
      </section>
    </main>
  );
}
