import Link from 'next/link';

import { toolAssets } from '@/data/home-data';
import { siteLinks } from '@/data/site-links';

export function ToolCards() {
  return (
    <section id="tools" className="mt-14 scroll-mt-24">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">决策工具</h2>
          <p className="mt-2 text-sm text-slate-300">直接可用的判断工具，优先给你高频、可执行的下一步。</p>
        </div>
        <Link
          href={siteLinks.tools}
          className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
        >
          查看全部 →
        </Link>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {toolAssets.map((tool, index) => {
          const Icon = tool.icon;
          const isLowerPriority = index > 2;

          return (
            <Link
              key={tool.title}
              href={tool.href}
              className={[
                'group rounded-2xl border p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300',
                tool.highlighted ? 'sm:col-span-2 lg:col-span-2' : '',
                tool.highlighted
                  ? 'border-amber-300/50 bg-gradient-to-br from-amber-400/10 via-slate-900/90 to-slate-950 shadow-lg shadow-amber-500/15 hover:shadow-xl hover:shadow-amber-400/20'
                  : 'border-white/10 bg-white/[0.03] shadow-sm hover:border-violet-200/30 hover:shadow-xl hover:shadow-violet-500/10',
                isLowerPriority ? 'opacity-90' : ''
              ].join(' ')}
            >
              <article>
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-violet-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className={[
                      'rounded-full px-2.5 py-1 text-[11px] font-medium',
                      tool.highlighted
                        ? 'border border-amber-300/50 bg-amber-300/20 text-amber-200'
                        : 'border border-white/10 bg-slate-800/80 text-slate-300'
                    ].join(' ')}
                  >
                    {tool.tag}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
                <p className="mt-2 min-h-20 text-sm leading-relaxed text-slate-300">{tool.description}</p>
                  <span className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:brightness-110">
                    {tool.cta}
                  </span>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
