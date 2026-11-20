import { ArrowRight, ArrowUpRight, BookOpen, Clapperboard, Layers3, MessagesSquare } from 'lucide-react';

import { aiDirectEntries } from '@/data/home-data';
import { siteLinks } from '@/data/site-links';

const icons = [MessagesSquare, Layers3, Clapperboard] as const;
const categories = ['AI 对话', '多模型对话', '视觉创作'] as const;

export function ApiDirectUseSection() {
  return (
    <section id="direct-use" className="mt-14 scroll-mt-24" aria-labelledby="direct-use-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300">ONLINE TOOLS</p>
          <h2 id="direct-use-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            在线使用 AI 工具
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            通过智享AI在线工具访问模型服务。选择适合的应用场景，使用 API Key 即可开始。
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {aiDirectEntries.map((entry, index) => {
          const Icon = icons[index] ?? MessagesSquare;
          return (
            <a
              key={entry.href}
              href={entry.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group surface-panel flex min-w-0 flex-col rounded-2xl p-5 transition-colors hover:border-cyan-300/40 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-200">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs text-slate-400">{categories[index] ?? '在线工具'}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{entry.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-slate-400">{entry.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 border-t border-white/10 pt-4 text-sm font-semibold text-cyan-200 group-hover:text-white">
                进入应用 <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-5 py-4">
        <span className="text-sm text-slate-300">已持有 API Key？可直接进入上述工具使用。</span>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a href={siteLinks.apiKeyBalance} target="_blank" rel="noopener noreferrer" className="text-cyan-200 hover:text-white">查询余额</a>
          <a href={siteLinks.tutorial} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cyan-200 hover:text-white">
            <BookOpen className="h-4 w-4" /> 使用教程 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
