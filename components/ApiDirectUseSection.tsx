import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  CreditCard,
  Image as ImageIcon,
  MessagesSquare,
  Sparkles,
  Wallet
} from 'lucide-react';

import { aiDirectEntries } from '@/data/home-data';
import { apiBaseUrl } from '@/data/api-product';
import { siteLinks } from '@/data/site-links';

const entryIcons = [MessagesSquare, Sparkles, ImageIcon] as const;
const entryTypes = ['通用 AI 对话', '多模型对话', '图片与视频创作'] as const;

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

export function ApiDirectUseSection() {
  return (
    <section id="direct-use" className="mt-12 scroll-mt-24" aria-labelledby="direct-use-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">USE IT RIGHT AWAY</p>
          <h2 id="direct-use-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            买完 Key，不写代码也能直接用
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            打开现有的智享AI工具站，按站内提示输入已购买的 API Key，即可开始使用。三个入口各有侧重，按你的使用场景选择。
          </p>
        </div>
        <a
          href={siteLinks.apiKey}
          {...externalLinkProps}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          <CreditCard className="h-4 w-4" /> 购买 API Key <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {aiDirectEntries.map((entry, index) => {
          const Icon = entryIcons[index] ?? Sparkles;
          return (
            <a
              key={entry.title}
              href={entry.href}
              {...externalLinkProps}
              className="group surface-panel flex min-w-0 flex-col rounded-2xl p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_18px_36px_rgba(14,116,144,0.18)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-300">
                  {entryTypes[index] ?? '在线工具'}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{entry.title}</h3>
              <p className="mt-2 min-h-[3.5rem] text-sm leading-6 text-slate-300">{entry.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[11px] text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-2 border-t border-white/10 pt-4 text-sm font-semibold text-cyan-200 transition group-hover:text-white">
                打开工具站 <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-violet-200">
            <Wallet className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-white">已经有 Key？</h3>
            <p className="mt-1 text-xs leading-5 text-slate-400">直接打开上面的工具站使用；需要查看余额时，进入原有查询页面即可。</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">
              <a href={siteLinks.apiKeyBalance} {...externalLinkProps} className="text-cyan-200 hover:text-white">查询 Key 余额 <ArrowUpRight className="inline h-3 w-3" /></a>
              <a href={siteLinks.tutorial} {...externalLinkProps} className="text-cyan-200 hover:text-white">查看使用教程 <ArrowUpRight className="inline h-3 w-3" /></a>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-4 sm:p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-200">
            <Code2 className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-white">开发者：接入自己的应用</h3>
            <p className="mt-1 break-all text-xs leading-5 text-slate-400">统一 API 地址：<code className="text-cyan-200">{apiBaseUrl}</code></p>
            <Link href="/api/docs" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-200 hover:text-white">
              <BookOpen className="h-3.5 w-3.5" /> 查看 API 文档与代码示例 <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
