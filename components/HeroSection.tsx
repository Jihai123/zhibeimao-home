import { ArrowRight, Search } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] px-5 py-16 shadow-xl backdrop-blur-xl md:px-10 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-violet-200 uppercase">
          AI Decision Hub
        </p>
        <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
          发现与连接全球前沿
          <span className="block bg-gradient-to-r from-cyan-300 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            AI 工具
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-lg">
          打破信息壁垒，聚合实用榜单与硬核数据工具，让每一次决策都有据可依。
        </p>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/15 bg-slate-900/65 p-2 shadow-lg backdrop-blur">
          <label className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 ring-1 ring-white/10 transition-all duration-300 focus-within:border-cyan-300/30 focus-within:ring-cyan-300/30">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
              placeholder="搜索 AI 模型、打新工具或提效神器..."
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow sm:w-auto">
            立即探索
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button className="w-full rounded-xl border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-400/10 sm:w-auto">
            查看最新榜单
          </button>
        </div>
      </div>
    </section>
  );
}
