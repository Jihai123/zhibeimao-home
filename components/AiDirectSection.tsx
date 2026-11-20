import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CreditCard,
  Images,
  KeyRound,
  MessageSquareText,
  MessagesSquare,
  Wallet
} from 'lucide-react';

import { aiDirectEntries } from '@/data/home-data';
import { siteLinks } from '@/data/site-links';

const icons = [MessagesSquare, MessageSquareText, Images] as const;
const types = ['通用 AI 对话', '多模型对话', '图片与视频'] as const;

export function AiDirectSection() {
  return (
    <section
      id="ai-direct"
      aria-label="指北猫AI直通"
      className="relative mt-14 scroll-mt-24 overflow-hidden rounded-[28px] border border-cyan-300/20 bg-gradient-to-br from-[#15233c] via-[#111b30] to-[#0d2230] p-5 shadow-[0_18px_60px_rgba(8,47,73,0.12)] sm:p-7 lg:p-9"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative">
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
              <KeyRound className="h-3.5 w-3.5" /> 智享AI · AI直通与API接入
            </div>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
              一个 Key，买完就能直接使用 AI
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              已搭建好的三个 AI 工具站，无需写代码：购买 Key、打开工具站、输入 Key 即可使用。
              开发者也可以通过统一 API 地址，将模型接入自己的软件。
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-slate-200 sm:text-xs">
              {['多模型对话', '图片与视频创作', '人民币购买', 'API 开发接入'].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
            <a
              href={siteLinks.apiKey}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            >
              <CreditCard className="h-4 w-4" /> 获取 API Key <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              href="/api"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            >
              了解 API 服务 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-7 grid min-w-0 gap-3 md:grid-cols-3">
          {aiDirectEntries.map((entry, index) => {
            const Icon = icons[index] ?? MessagesSquare;
            return (
              <a
                key={entry.href}
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-w-0 flex-col rounded-2xl border border-white/10 bg-[#0b1528]/65 p-4 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-[#12243a] sm:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs text-slate-400">{types[index] ?? '在线工具'}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{entry.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-300">{entry.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {entry.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400">{tag}</span>
                  ))}
                </div>
                <span className="mt-5 inline-flex items-center gap-2 border-t border-white/10 pt-4 text-sm font-semibold text-cyan-200 group-hover:text-white">
                  打开网站，输入 Key <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:flex-row md:items-center md:justify-between md:gap-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs leading-6 text-slate-300">
            <span className="font-semibold text-white">已有 Key？</span>
            <a href={siteLinks.apiKeyBalance} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cyan-200 hover:text-white">
              <Wallet className="h-3.5 w-3.5" /> 查询余额
            </a>
            <a href={siteLinks.tutorial} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cyan-200 hover:text-white">
              <BookOpen className="h-3.5 w-3.5" /> 使用教程
            </a>
          </div>
          <Link href="/api/docs" className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start text-xs font-semibold text-cyan-200 hover:text-white md:self-auto">
            开发者 API 文档与代码示例 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
