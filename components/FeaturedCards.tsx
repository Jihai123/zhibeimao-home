import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { featuredAssets } from '@/data/home-data';

export function FeaturedCards() {
  return (
    <section className="mt-12" aria-label="今日推荐">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">今日推荐</h2>
          <p className="mt-2 text-sm text-slate-300">给你今天就能点的结论型入口，减少反复比较成本。</p>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featuredAssets.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={[
                'group rounded-2xl border p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300',
                item.highlighted
                  ? 'border-amber-300/40 bg-gradient-to-br from-amber-400/10 via-slate-900/85 to-slate-950 hover:shadow-xl hover:shadow-amber-500/15'
                  : 'border-white/10 bg-white/[0.03] hover:border-cyan-200/30 hover:shadow-xl hover:shadow-cyan-500/10'
              ].join(' ')}
            >
              <article>
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-white/10 bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-xs font-medium tracking-wide text-slate-400 uppercase">{item.subtitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-cyan-300 transition-all duration-300 group-hover:gap-2">
                  {item.cta} <ArrowUpRight className="h-4 w-4" />
                </span>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
