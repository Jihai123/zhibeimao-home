import { ArrowRight } from 'lucide-react';

import { featuredAssets } from '@/data/home-data';

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

export function FeaturedCards() {
  return (
    <section className="mt-10" aria-label="今日推荐">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-primary text-2xl font-bold md:text-3xl">今日推荐</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featuredAssets.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.title}
              href={item.href}
              {...externalLinkProps}
              className="group surface-panel flex min-h-[214px] flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-[0_20px_40px_rgba(8,145,178,0.18)]"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#10192d] text-cyan-200">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-secondary">
                  {item.badge}
                </span>
              </div>

              <h3 className="text-primary line-clamp-2 text-base font-semibold">{item.title}</h3>
              <p className="mt-1 text-xs tracking-wide text-secondary uppercase">{item.subtitle}</p>
              <p className="text-secondary mt-2 line-clamp-2 text-sm">{item.reason}</p>
              <p className="text-secondary/90 mt-3 text-xs">{item.useCount}</p>
              <p className="mt-2 text-xs text-secondary/80">{item.status}</p>

              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-secondary">编辑精选</span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-colors duration-300 group-hover:text-cyan-300" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
