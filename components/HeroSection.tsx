'use client';

import { FormEvent, KeyboardEvent, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { quickEntries } from '@/data/home-data';
import { siteLinks } from '@/data/site-links';

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

const searchRules: Array<{ keywords: string[]; url: string }> = [
  { keywords: ['新股', '港股'], url: siteLinks.hongKongIPO },
  { keywords: ['养老金'], url: siteLinks.pensionCalculator },
  { keywords: ['城市'], url: siteLinks.livableCity },
  { keywords: ['ai', 'gpt'], url: siteLinks.nav },
  { keywords: ['新闻'], url: siteLinks.news }
];

function resolveSearchUrl(rawKeyword: string) {
  const keyword = rawKeyword.trim().toLowerCase();

  if (!keyword) {
    return siteLinks.nav;
  }

  const matchedRule = searchRules.find((rule) => rule.keywords.some((item) => keyword.includes(item.toLowerCase())));
  return matchedRule?.url ?? siteLinks.nav;
}

export function HeroSection() {
  const [keyword, setKeyword] = useState('');
  const placeholder = useMemo(() => '输入关键词，例如：新股、养老金、AI工具、资讯', []);

  const triggerSearch = () => {
    const url = resolveSearchUrl(keyword);
    window.open(url, '_blank');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    triggerSearch();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      triggerSearch();
    }
  };

  return (
    <section className="surface-panel relative overflow-hidden rounded-[28px] px-6 py-10 md:px-10 md:py-12">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs tracking-[0.2em] text-secondary uppercase">
          AI Decision Hub
        </p>
        <h1 className="text-primary text-3xl font-black tracking-tight md:text-5xl">AI 工具导航与评测中心</h1>
        <p className="text-secondary mx-auto mt-4 max-w-2xl text-sm leading-relaxed md:text-base">
          高信息密度聚合：发现工具、比较能力、跟踪榜单，一次完成高质量决策。
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-3xl items-center gap-2 rounded-2xl border border-white/15 bg-[#0f1628]/95 p-2 shadow-[0_0_0_1px_rgba(124,58,237,0.35),0_20px_45px_rgba(6,182,212,0.2)] backdrop-blur">
          <label className="flex flex-1 items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 ring-1 ring-white/10 transition-all duration-300 focus-within:border-cyan-300/40 focus-within:ring-cyan-300/40">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              name="q"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-primary placeholder:text-secondary/80 focus:outline-none"
              placeholder={placeholder}
            />
          </label>
          <button
            type="button"
            onClick={triggerSearch}
            className="rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{ backgroundImage: 'var(--primary-gradient)' }}
          >
            搜索
          </button>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {quickEntries.map((entry) => (
            <a
              key={entry.label}
              href={entry.href}
              {...externalLinkProps}
              className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-secondary transition-all duration-300 hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-cyan-100"
            >
              {entry.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
