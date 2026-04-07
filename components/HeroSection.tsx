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
  { keywords: ['股票代码', 'ipo', '新股'], url: siteLinks.hongKongIPO },
  { keywords: ['养老金', '退休'], url: siteLinks.pensionCalculator },
  { keywords: ['城市', '宜居'], url: siteLinks.livableCity },
  { keywords: ['工作', '值不值'], url: siteLinks.workValue },
  { keywords: ['命理', '算命'], url: siteLinks.xingmingtong },
  { keywords: ['新闻', '资讯'], url: siteLinks.news }
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
  const placeholder = useMemo(() => '输入关键词，例如：新股 / 养老金 / 宜居城市 / AI 资讯', []);

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
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-7 shadow-xl backdrop-blur-xl md:px-9 md:py-9">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-violet-200 uppercase">
          AI Decision Hub
        </p>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">用 AI，帮你更快做决定</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
          输入关键词，快速找到工具或判断结果
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-2xl items-center gap-2 rounded-2xl border border-white/15 bg-slate-900/65 p-2 shadow-lg backdrop-blur"
        >
          <label className="flex flex-1 items-center gap-3 rounded-xl border border-transparent px-3 py-3 ring-1 ring-white/10 transition-all duration-300 focus-within:border-cyan-300/30 focus-within:ring-cyan-300/30">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              name="q"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
              placeholder={placeholder}
            />
          </label>
          <button
            type="button"
            onClick={triggerSearch}
            className="rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
          >
            去体验
          </button>
        </form>

        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/45 p-4 text-left">
          <p className="text-sm font-medium text-slate-200">你可以先做这3件事：</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <a
              href={siteLinks.hongKongIPO}
              {...externalLinkProps}
              className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:brightness-105"
            >
              🔥 查新股值不值
            </a>
            <a
              href={siteLinks.pensionCalculator}
              {...externalLinkProps}
              className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-violet-400"
            >
              算养老金
            </a>
            <a
              href={siteLinks.nav}
              {...externalLinkProps}
              className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-cyan-400"
            >
              找AI工具
            </a>
          </div>
        </div>

      </div>

      <div className="mt-6 overflow-x-auto pb-1">
        <div className="flex min-w-max items-center gap-3">
          {quickEntries.map((entry) => (
            <a
              key={entry.label}
              href={entry.href}
              {...externalLinkProps}
              className="rounded-xl border border-white/10 bg-slate-900/45 px-3 py-2 text-xs font-medium text-slate-300 transition-all duration-300 hover:border-cyan-300/30 hover:bg-cyan-400/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              {entry.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
