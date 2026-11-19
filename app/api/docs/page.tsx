import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Info, KeyRound, ShieldAlert, Terminal } from 'lucide-react';

import { siteLinks } from '@/data/site-links';
import { ApiCopyButton } from '@/components/ApiCopyButton';

export const metadata: Metadata = {
  title: 'API 接入文档与快速开始｜指北猫',
  description: '使用指北猫 API Base URL、Key 鉴权和 OpenAI 兼容接口完成首次模型调用；查看常见接口路径与验收范围。',
  alternates: { canonical: 'https://www.zhibeimao.com/api/docs' }
};

const baseUrl = 'https://api.zhibeimao.com/v1';

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
  { group: '已验证', state: '已实测', routes: [
    { method: 'GET', path: '/v1/models', detail: '查询 Key 可访问的模型列表' },
    { method: 'POST', path: '/v1/chat/completions', detail: '对话补全；流式调用在项目临时域名实测通过' }
  ]},
  { group: '其他兼容接口', state: '待逐项验证', routes: [
    { method: 'POST', path: '/v1/responses', detail: 'Responses 格式' },
    { method: 'POST', path: '/v1/messages', detail: 'Anthropic Messages 兼容格式' },
    { method: 'POST', path: '/v1beta/models/{model}:generateContent', detail: 'Gemini 格式，另有 streamGenerateContent' },
    { method: 'POST', path: '/v1/embeddings', detail: '向量生成' },
    { method: 'POST', path: '/v1/images/generations', detail: '图片生成' },
    { method: 'POST', path: '/v1/images/edits', detail: '图片编辑' },
    { method: 'POST', path: '/v1/videos', detail: '部分视频模型异步创建任务' },
    { method: 'GET', path: '/v1/videos/{task_id}', detail: '部分视频模型查询任务' },
    { method: 'POST', path: '/v1/video/generations', detail: '其他视频生成任务格式' }
  ]}
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
          不用分别注册多家模型平台。现有 Key 配合统一 API 地址，即可按 OpenAI 兼容格式开始调用；未标注实测的接口需按具体模型单独验证。
        </p>
      </header>

      <section className="surface-panel mt-9 rounded-2xl p-5 md:p-7" aria-labelledby="setup">
        <h2 id="setup" className="flex items-center gap-2 text-xl font-bold text-white"><KeyRound className="h-5 w-5 text-cyan-200" /> 01 / 基础配置</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">API Base URL</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <code className="block break-all text-sm font-semibold text-cyan-200">{baseUrl}</code>
              <ApiCopyButton value={baseUrl} label="复制地址" />
            </div>
            <p className="mt-2 text-xs text-slate-400">备选：https://api.chatgpt5x.com/v1</p>
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
          <a href={siteLinks.tutorial} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm text-slate-200 hover:bg-white/5">
            旧版站内使用教程
          </a>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="first-call">
        <h2 id="first-call" className="flex items-center gap-2 text-xl font-bold text-white md:text-2xl"><Terminal className="h-5 w-5 text-cyan-200" /> 02 / 发送第一条请求</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">以下示例使用本次已验证的 <code className="text-cyan-200">gpt-5.6-terra</code>。模型会调整，正式使用前建议先通过模型列表接口检查可用 ID。</p>
        <div className="mt-5 grid gap-4">
          <div className="surface-panel overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-3 text-sm font-semibold text-slate-200"><span>cURL · OpenAI 兼容对话</span><ApiCopyButton value={curlExample} label="复制命令" /></div>
            <pre className="overflow-x-auto p-5 text-xs leading-7 text-cyan-100 md:text-sm"><code>{curlExample}</code></pre>
          </div>
          <div className="surface-panel overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-3 text-sm font-semibold text-slate-200"><span>Python · OpenAI SDK</span><ApiCopyButton value={pythonExample} label="复制代码" /></div>
            <pre className="overflow-x-auto p-5 text-xs leading-7 text-cyan-100 md:text-sm"><code>{pythonExample}</code></pre>
            <p className="px-5 pb-5 text-xs leading-6 text-slate-400">先安装 openai SDK，并通过服务器环境变量 AI_API_KEY 保存 Key。</p>
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="client-setup">
        <h2 id="client-setup" className="text-xl font-bold text-white md:text-2xl">03 / AI 客户端快速配置</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">支持自定义 OpenAI 兼容服务的工具（例如 Chatbox、Cherry Studio）通常可按下列字段配置。不同版本的菜单名称可能不同，客户端兼容性尚未逐项验收。</p>
        <div className="surface-panel mt-4 overflow-hidden rounded-2xl">
          {[
            { name: '服务商类型', value: 'OpenAI Compatible / 自定义 OpenAI' },
            { name: 'Base URL', value: baseUrl },
            { name: 'API Key', value: '从现有商城购买的 Key' },
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
        <div className="surface-panel mt-4 rounded-2xl p-5">
          <p className="text-sm leading-7 text-slate-300">请求 <code className="text-cyan-200">GET /v1/models</code> 并携带 Bearer Key，可获得当前 Key 的模型列表。不要将任何示例中的模型名称视为永久免费或永久可用。</p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950/80 p-4 text-xs leading-7 text-cyan-100 md:text-sm"><code>{"curl 'https://api.zhibeimao.com/v1/models' -H 'Authorization: Bearer YOUR_API_KEY'"}</code></pre>
        </div>
      </section>

      <section id="endpoints" className="mt-10 scroll-mt-24" aria-labelledby="all-endpoints">
        <h2 id="all-endpoints" className="text-xl font-bold text-white md:text-2xl">05 / 接口目录</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">以下为已对照技术文档整理的接口路径。反代配置覆盖 /v1 与 /v1beta，但配置覆盖不等于每个接口都已经完成实际调用验证。</p>
        {endpoints.map((group) => (
          <div key={group.group} className="surface-panel mt-5 overflow-hidden rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
              <h3 className="text-base font-semibold text-white">{group.group}</h3>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                {group.state === '已实测' ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Info className="h-4 w-4 text-amber-300" />}
                {group.state}
              </span>
            </div>
            <div className="divide-y divide-white/10">
              {group.routes.map((route) => (
                <div key={route.path} className="grid gap-2 px-5 py-3 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
                  <span className="text-xs font-bold text-cyan-300">{route.method}</span>
                  <code className="break-all text-xs text-white md:text-sm">{route.path}</code>
                  <span className="text-xs leading-6 text-slate-400 md:text-sm">{route.detail}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="surface-panel mt-10 rounded-2xl p-5 md:p-7" aria-label="接入注意事项">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white"><ShieldAlert className="h-5 w-5 text-amber-300" /> 接入注意事项</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">当前反代没有公开映射上游的 <code className="text-amber-200">/api/usage/token</code> 用量查询路由，因此这里不承诺它在自有域名下可调用。余额查询和购买请继续使用原 Key 商城；图片、视频和 Gemini 等能力待实测后再补充详细参数与示例。</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">如遇鉴权错误，先检查 Key、请求头和地址中的 /v1；如遇模型不存在，请用 /v1/models 确认该 Key 的模型 ID。</p>
      </section>
    </main>
  );
}
