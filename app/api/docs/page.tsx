import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, KeyRound, ShieldAlert, Terminal } from 'lucide-react';

import { siteLinks } from '@/data/site-links';
import { aiDirectEntries } from '@/data/home-data';
import { alternativeApiBaseUrl, apiBaseUrl } from '@/data/api-product';

export const metadata: Metadata = {
  title: 'API 接入文档与快速开始｜指北猫',
  description: '配置智享AI API Base URL、API Key 和 OpenAI 兼容接口，了解模型列表、调用示例及 AI 客户端设置。',
  alternates: { canonical: 'https://www.zhibeimao.com/api/docs' }
};

const baseUrl = apiBaseUrl;

const curlExample = [
  "curl -X POST 'https://api.zhibeimao.com/v1/chat/completions' \\",
  "  -H 'Authorization: Bearer YOUR_API_KEY' \\",
  "  -H 'Content-Type: application/json' \\",
  "  -d '{\"model\":\"gpt-5.6-terra\",\"messages\":[{\"role\":\"user\",\"content\":\"你好，请只回复 OK\"}]}'"
].join('\n');

const pythonExample = [
  'from openai import OpenAI',
  'import os',
  '',
  'client = OpenAI(',
  '    api_key=os.environ["AI_API_KEY"],',
  '    base_url="https://api.zhibeimao.com/v1"',
  ')',
  'response = client.chat.completions.create(',
  '    model="gpt-5.6-terra",',
  '    messages=[{"role": "user", "content": "你好，请只回复 OK"}]',
  ')',
  'print(response.choices[0].message.content)'
].join('\n');

const endpoints = [
  { method: 'GET', path: '/v1/models', detail: '获取当前 API Key 可用的模型列表' },
  { method: 'POST', path: '/v1/chat/completions', detail: '按 OpenAI 兼容格式发起模型对话' }
];

export default function ApiDocsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <Link href="/api" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> 返回 API 产品首页
      </Link>
      <header className="mt-7 max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-cyan-300">
          <BookOpen className="h-4 w-4" /> API DOCUMENTATION
        </div>
        <h1 className="text-3xl font-bold text-white md:text-5xl">快速接入与接口参考</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
          配置您的 API Key 和统一接口地址，即可通过 OpenAI 兼容格式访问模型服务。以下提供基本接入步骤、客户端配置和接口参考。
        </p>
      </header>

      <nav aria-label="文档章节导航" className="mt-6 flex max-w-full flex-wrap gap-2 text-xs sm:text-sm">
        {[
          { href: '#setup', label: '接入配置' },
          { href: '#first-call', label: '调用示例' },
          { href: '#client-setup', label: '客户端配置' },
          { href: '#models', label: '模型列表' },
          { href: '#endpoints', label: '接口参考' }
        ].map((item) => (
          <a key={item.href} href={item.href} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-2 text-slate-200 transition hover:border-cyan-300/40 hover:text-white">
            {item.label}
          </a>
        ))}
      </nav>

      <section className="surface-panel mt-8 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.035] p-5 md:p-6" aria-labelledby="no-code-title">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="no-code-title" className="text-lg font-bold text-white">AI 工具在线使用</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">使用智享AI Key，访问在线对话及创作工具。</p>
          </div>
          <a href={siteLinks.apiKeyBalance} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-cyan-200 hover:text-white">查询 Key 余额 ↗</a>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {aiDirectEntries.map((entry) => (
            <a key={entry.title} href={entry.href} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:text-cyan-100">
              <span className="min-w-0">{entry.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-cyan-300" />
            </a>
          ))}
        </div>
      </section>

      <section id="setup" className="surface-panel mt-8 scroll-mt-24 rounded-2xl p-5 md:p-7" aria-labelledby="setup-title">
        <h2 id="setup-title" className="flex items-center gap-2 text-xl font-bold text-white"><KeyRound className="h-5 w-5 text-cyan-200" /> 01 / 接入配置</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">API Base URL</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <code className="block min-w-0 break-all select-all text-sm font-semibold text-cyan-200">{baseUrl}</code>
              <span className="text-xs text-slate-400">选择并复制接口地址</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">备选：{alternativeApiBaseUrl}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">Authentication</p>
            <code className="mt-3 block break-all text-sm text-cyan-200">Authorization: Bearer YOUR_API_KEY</code>
            <p className="mt-2 text-xs text-slate-400">不要将真实 Key 提交到公开代码仓库或浏览器前端。</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={siteLinks.apiKey} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300">
            获取 API Key <ArrowRight className="h-4 w-4" />
          </a>
          <a href={siteLinks.apiKeyBalance} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm text-slate-200 hover:bg-white/5">
            查询 Key 余额
          </a>
        </div>
      </section>

      <section id="first-call" className="mt-10 scroll-mt-24" aria-labelledby="first-call-title">
        <h2 id="first-call-title" className="flex items-center gap-2 text-xl font-bold text-white md:text-2xl"><Terminal className="h-5 w-5 text-cyan-200" /> 02 / 对话接口示例</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">以下示例采用 <code className="text-cyan-200">gpt-5.6-terra</code>。调用前请通过模型列表接口确认当前 Key 可用的模型 ID。</p>
        <div className="mt-5 grid min-w-0 gap-4">
          <div className="surface-panel min-w-0 overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-3 text-sm font-semibold text-slate-200"><span>cURL · OpenAI 兼容对话</span><span className="text-xs font-normal text-slate-400">代码示例</span></div>
            <pre className="max-w-full overflow-x-auto p-4 text-xs leading-7 text-cyan-100 sm:p-5 md:text-sm"><code>{curlExample}</code></pre>
          </div>
          <div className="surface-panel overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-3 text-sm font-semibold text-slate-200"><span>Python · OpenAI SDK</span><span className="text-xs font-normal text-slate-400">代码示例</span></div>
            <pre className="max-w-full overflow-x-auto p-4 text-xs leading-7 text-cyan-100 sm:p-5 md:text-sm"><code>{pythonExample}</code></pre>
            <p className="px-5 pb-5 text-xs leading-6 text-slate-400">先安装 openai SDK，并通过服务器环境变量 AI_API_KEY 保存 Key。</p>
          </div>
        </div>
      </section>

      <section id="client-setup" className="mt-10 scroll-mt-24" aria-labelledby="client-setup-title">
        <h2 id="client-setup-title" className="text-xl font-bold text-white md:text-2xl">03 / AI 客户端快速配置</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">Chatbox、Cherry Studio 等支持自定义 OpenAI 兼容服务的客户端，可参考以下字段配置。不同版本的菜单名称可能略有差异。</p>
        <div className="surface-panel mt-4 overflow-hidden rounded-2xl">
          {[
            { name: '服务商类型', value: 'OpenAI Compatible / 自定义 OpenAI' },
            { name: 'Base URL', value: baseUrl },
            { name: 'API Key', value: '您的 API Key' },
            { name: '模型 ID', value: '从 /v1/models 查询后填写' }
          ].map((item) => (
            <div key={item.name} className="grid gap-1 border-b border-white/10 px-5 py-3 last:border-b-0 sm:grid-cols-[150px_1fr]">
              <span className="text-xs text-slate-400">{item.name}</span>
              <span className="break-all text-sm text-slate-100">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="models" className="mt-10 scroll-mt-24" aria-labelledby="model-list">
        <h2 id="model-list" className="text-xl font-bold text-white md:text-2xl">04 / 查询模型</h2>
        <div className="surface-panel mt-4 min-w-0 rounded-2xl p-5">
          <p className="text-sm leading-7 text-slate-300">请求 <code className="text-cyan-200">GET /v1/models</code> 并携带 API Key，可获得当前可用的模型 ID。请使用返回的模型 ID 进行调用。</p>
          <pre className="mt-4 max-w-full overflow-x-auto rounded-xl bg-slate-950/80 p-4 text-xs leading-7 text-cyan-100 md:text-sm"><code>{"curl 'https://api.zhibeimao.com/v1/models' -H 'Authorization: Bearer YOUR_API_KEY'"}</code></pre>
        </div>
      </section>

      <section id="endpoints" className="mt-10 scroll-mt-24" aria-labelledby="all-endpoints">
        <h2 id="all-endpoints" className="text-xl font-bold text-white md:text-2xl">05 / 接口目录</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">以下列出基础接口，使用时需提供 API Key。其他协议和多模态能力因模型而异。</p>
        <div className="surface-panel mt-5 overflow-hidden rounded-2xl">
          <div className="divide-y divide-white/10">
            {endpoints.map((route) => (
              <div key={route.path} className="grid gap-2 px-5 py-4 md:grid-cols-[70px_minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
                <span className="text-xs font-bold text-cyan-300">{route.method}</span>
                <code className="break-all text-xs text-white md:text-sm">{route.path}</code>
                <span className="text-xs leading-6 text-slate-400 md:text-sm">{route.detail}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs leading-6 text-slate-400">更多协议及模型能力请根据所选模型的接入说明配置，具体可用范围以账户权限为准。</p>
      </section>

      <section className="surface-panel mt-10 rounded-2xl p-5 md:p-7" aria-label="接入注意事项">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white"><ShieldAlert className="h-5 w-5 text-amber-300" /> 接入注意事项</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">API Key 余额及可用额度可通过 <Link href={siteLinks.apiKeyBalance} className="text-cyan-200 hover:underline">余额查询页面</Link> 查看。不同模型的接口格式及可用能力，请以对应模型说明为准。</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">如遇鉴权错误，请检查 API Key、请求头及 Base URL；如提示模型不可用，请查询 /v1/models 确认正确的模型 ID。</p>
      </section>
    </main>
  );
}
