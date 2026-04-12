import { ArrowRight } from 'lucide-react';

import { aiDirectEntries } from '@/data/home-data';
import { siteLinks } from '@/data/site-links';

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

export function AiDirectSection() {
  return (
    <section className="mt-14" aria-label="指北猫AI直通">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-primary text-2xl font-bold md:text-3xl">指北猫AI直通</h2>
          <p className="text-secondary mt-2 text-sm">无需复杂翻墙，直接体验国际主流 AI 能力</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={siteLinks.apiKey}
            {...externalLinkProps}
            className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-secondary transition-colors hover:border-cyan-300/30 hover:text-cyan-200"
          >
            获取 API 密钥
          </a>
          <a
            href={siteLinks.tutorial}
            {...externalLinkProps}
            className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-secondary transition-colors hover:border-cyan-300/30 hover:text-cyan-200"
          >
            使用教程
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {aiDirectEntries.map((entry) => (
          <a
            key={entry.title}
            href={entry.href}
            {...externalLinkProps}
            className="group surface-panel relative flex min-h-[196px] flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_20px_38px_rgba(14,116,144,0.26)]"
          >
            <h3 className="text-primary pr-7 text-lg font-semibold">{entry.title}</h3>
            <p className="text-secondary mt-2 text-sm leading-relaxed">{entry.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-secondary">
                  {tag}
                </span>
              ))}
            </div>

            <ArrowRight className="absolute right-4 top-4 h-4 w-4 text-slate-400 transition-colors duration-300 group-hover:text-cyan-300" />
          </a>
        ))}
      </div>
    </section>
  );
}
