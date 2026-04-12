import { ArrowRight } from 'lucide-react';

import { toolAssets } from '@/data/home-data';
import { siteLinks } from '@/data/site-links';

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

export function ToolCards() {
  return (
    <section id="tools" className="mt-14 scroll-mt-24">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-primary text-2xl font-bold md:text-3xl">决策工具</h2>
        <a href={siteLinks.tools} {...externalLinkProps} className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200">
          查看全部 →
        </a>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {toolAssets.map((tool) => {
          const Icon = tool.icon;

          return (
            <a
              key={tool.title}
              href={tool.href}
              {...externalLinkProps}
              className="group surface-panel flex h-full min-h-[214px] flex-col rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/40 hover:shadow-[0_16px_32px_rgba(76,29,149,0.25)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#10192d] text-violet-200">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-secondary">{tool.tag}</span>
              </div>

              <h3 className="text-primary line-clamp-2 text-base font-semibold">{tool.title}</h3>
              <p className="text-secondary mt-2 line-clamp-3 text-sm leading-relaxed">{tool.description}</p>

              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="rounded-md border border-cyan-200/20 bg-cyan-400/5 px-2 py-1 text-[11px] text-cyan-200/90">高热度</span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-colors duration-300 group-hover:text-violet-300" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
