import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Clapperboard, Layers3, MessagesSquare, Wallet } from 'lucide-react';

import { aiDirectEntries } from '@/data/home-data';
import { siteLinks } from '@/data/site-links';

const cardIcons = [MessagesSquare, Layers3, Clapperboard] as const;
const cardTypes = ['智能对话', '多模型对话', '视觉创作'] as const;

export function AiDirectSection() {
  return (
    <section id="ai-direct" aria-label="指北猫AI直通" className="mt-12 scroll-mt-24">
      <div className="surface-panel overflow-hidden rounded-[26px]">
        <div className="flex flex-col gap-5 px-5 pb-6 pt-7 sm:px-8 sm:pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300">智享AI · 模型服务</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              在线体验与 API 接入
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              一个 API Key，使用多种 AI 对话与创作工具，也可将模型能力接入自己的应用。
            </p>
          </div>
          <Link
            href="/api"
            className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start rounded-lg border border-white/15 bg-white/[0.035] px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-300/35 hover:bg-white/[0.07] lg:self-end"
          >
            了解 API 服务 <ArrowRight className="h-4 w-4 text-cyan-300" />
          </Link>
        </div>

        <div className="grid min-w-0 gap-3 px-5 pb-6 sm:px-8 sm:pb-8 md:grid-cols-3">
          {aiDirectEntries.map((entry, index) => {
            const Icon = cardIcons[index] ?? MessagesSquare;
            return (
              <a
                key={entry.href}
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-w-0 flex-col rounded-xl border border-white/10 bg-[#121b2e]/85 p-5 transition-colors hover:border-cyan-300/35 hover:bg-[#17243a]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs text-slate-400">{cardTypes[index] ?? 'AI 工具'}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{entry.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{entry.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-200 group-hover:text-white">
                  立即使用 <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <span className="text-xs leading-6 text-slate-400">使用指南与账户服务</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <a href={siteLinks.apiKey} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-cyan-200 hover:text-white">
              购买 API Key <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a href={siteLinks.apiKeyBalance} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white">
              <Wallet className="h-4 w-4" /> 查询余额
            </a>
            <a href={siteLinks.tutorial} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white">
              使用教程
            </a>
            <Link href="/api/docs" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white">
              <BookOpen className="h-4 w-4" /> API 文档
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
