import Link from 'next/link';
import { Search } from 'lucide-react';

import { quickEntries } from '@/data/home-data';
import { siteLinks } from '@/data/site-links';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-7 shadow-xl backdrop-blur-xl md:px-9 md:py-9">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-violet-200 uppercase">
          AI Decision Hub
        </p>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          发现好用的 AI 工具，也找到真正能帮你做决策的工具
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
          AI 工具导航、实时推荐、决策工具，一站式入口
        </p>

        <form
          action={siteLinks.discover}
          className="mx-auto mt-6 flex max-w-2xl items-center gap-2 rounded-2xl border border-white/15 bg-slate-900/65 p-2 shadow-lg backdrop-blur"
        >
          <label className="flex flex-1 items-center gap-3 rounded-xl border border-transparent px-3 py-3 ring-1 ring-white/10 transition-all duration-300 focus-within:border-cyan-300/30 focus-within:ring-cyan-300/30">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              name="q"
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
              placeholder="搜索 AI 模型、打新工具或提效神器..."
            />
          </label>
          <button className="rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow">
            搜索
          </button>
        </form>

        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/45 p-4 text-left">
          <p className="text-sm font-medium text-slate-200">你可以先做这3件事：</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Link
              href={siteLinks.hongKongIPO}
              className="rounded-xl bg-gradient-to-r from-amber-300 to-orange-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:brightness-105"
            >
              查新股值不值
            </Link>
            <Link
              href={siteLinks.pensionCalculator}
              className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-violet-400"
            >
              算养老金
            </Link>
            <Link
              href={siteLinks.nav}
              className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-cyan-400"
            >
              找AI工具
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={siteLinks.discover}
            className="w-full rounded-xl bg-indigo-500 px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:w-auto"
          >
            浏览全部入口
          </Link>
          <Link
            href="#tools"
            className="w-full rounded-xl bg-violet-500 px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:w-auto"
          >
            进入决策工具
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-1">
        <div className="flex min-w-max items-center gap-3">
          {quickEntries.map((entry) => (
            <Link
              key={entry.label}
              href={entry.href}
              className="rounded-xl border border-white/10 bg-slate-900/45 px-3 py-2 text-xs font-medium text-slate-300 transition-all duration-300 hover:border-cyan-300/30 hover:bg-cyan-400/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              {entry.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
