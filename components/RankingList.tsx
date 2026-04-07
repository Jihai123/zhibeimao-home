'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { featuredTopics } from '@/src/data/featuredTopics';
import { siteLinks } from '@/data/site-links';

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

const defaultTopicThumbnails = {
  forum: '/images/topics/forum/default-forum.jpg',
  aijianghu: '/images/topics/aijianghu/default-aijianghu.jpg'
} as const;

type RankingItem = {
  rank?: number;
  name?: string;
  users?: number | string;
  monthly_visits?: number | string;
  monthlyVisits?: number | string;
  visits?: number | string;
  change?: number | string;
  growth_rate?: number | string;
  growthRate?: number | string;
};

type RankingsApiResponse = {
  rankings?: {
    popularTools?: RankingItem[];
  };
  error?: string;
};

function getTopicThumbnail(source: 'forum' | 'aijianghu', thumbnail?: string) {
  return thumbnail || defaultTopicThumbnails[source];
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function formatCount(value: unknown): string {
  const num = toNumber(value);
  if (num === null) return '--';

  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (num >= 10_000) return `${(num / 10_000).toFixed(1).replace(/\.0$/, '')}万`;
  return new Intl.NumberFormat('zh-CN').format(num);
}

function formatGrowth(raw: unknown) {
  const num = toNumber(raw);

  if (num === null) {
    return {
      text: '--',
      className: 'text-slate-400'
    };
  }

  if (num > 0) {
    return {
      text: `+${formatCount(num)}`,
      className: 'text-emerald-300'
    };
  }

  if (num < 0) {
    return {
      text: `-${formatCount(Math.abs(num))}`,
      className: 'text-rose-300'
    };
  }

  return {
    text: '0',
    className: 'text-slate-300'
  };
}

export function RankingList() {
  const topicPicks = [...featuredTopics].sort((a, b) => b.priority - a.priority).slice(0, 4);
  const [popularTools, setPopularTools] = useState<RankingItem[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchRankings = async () => {
      try {
        const response = await fetch('/api/ai-rankings');
        const data: RankingsApiResponse = await response.json();

        if (!response.ok || data?.error) {
          throw new Error(data?.error || 'Failed to fetch rankings');
        }

        const tools = Array.isArray(data?.rankings?.popularTools) ? data.rankings.popularTools.slice(0, 5) : [];

        if (active) {
          if (tools.length === 0) {
            setLoadFailed(true);
            setPopularTools([]);
            return;
          }

          setPopularTools(tools);
          setLoadFailed(false);
        }
      } catch {
        if (active) {
          setLoadFailed(true);
          setPopularTools([]);
        }
      }
    };

    fetchRankings();

    return () => {
      active = false;
    };
  }, []);

  const hasData = useMemo(() => !loadFailed && popularTools.length > 0, [loadFailed, popularTools.length]);

  return (
    <section className="mt-16" aria-label="AI 榜单与专题精选">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">AI 榜单与精选</h2>
          <p className="mt-2 text-sm text-slate-400">真实榜单入口 + 社区热点专题，所有点击直达真实内容。</p>
        </div>
        <a
          href={siteLinks.rankings}
          {...externalLinkProps}
          className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
        >
          阅读更多 →
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur">
          {hasData ? (
            <article className="flex h-full min-h-[252px] flex-col rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/70 to-slate-950 p-5">
              <h3 className="text-xl font-bold text-white">热门 AI 工具</h3>
              <p className="mt-2 text-sm text-slate-300">基于真实数据的工具热度预览</p>

              <div className="mt-4 space-y-2.5">
                {popularTools.map((tool, index) => {
                  const rank = toNumber(tool.rank) ?? index + 1;
                  const usersValue = tool.users ?? tool.monthly_visits ?? tool.monthlyVisits ?? tool.visits;
                  const growthValue = tool.change ?? tool.growth_rate ?? tool.growthRate;
                  const growth = formatGrowth(growthValue);

                  return (
                    <div
                      key={`${tool.name || 'tool'}-${rank}`}
                      className="grid grid-cols-[30px_minmax(0,1fr)_88px_86px] items-center gap-3 rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2"
                    >
                      <span className="text-sm font-semibold text-cyan-300">#{rank}</span>
                      <span className="truncate text-sm font-medium text-white">{tool.name || '未知工具'}</span>
                      <span className="text-right text-xs text-slate-300">{formatCount(usersValue)}</span>
                      <span className={`text-right text-xs font-semibold ${growth.className}`}>{growth.text}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-[30px_minmax(0,1fr)_88px_86px] gap-3 px-3 text-[11px] text-slate-400">
                <span>排名</span>
                <span>工具</span>
                <span className="text-right">用户数/访问量</span>
                <span className="text-right">增长/热度</span>
              </div>

              <a
                href={siteLinks.aiLeaderboard}
                {...externalLinkProps}
                className="mt-auto inline-flex w-fit items-center rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                查看完整榜单
              </a>
            </article>
          ) : (
            <article className="flex h-full min-h-[252px] flex-col rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/70 to-slate-950 p-5">
              <h3 className="text-xl font-bold text-white">真实 AI 排行榜</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">查看热门 AI 工具、模型趋势与最新变化</p>
              <a
                href={siteLinks.aiLeaderboard}
                {...externalLinkProps}
                className="mt-auto inline-flex w-fit items-center rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                查看完整榜单
              </a>
            </article>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-white">专题推荐</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {topicPicks.map((pick) => (
              <a
                href={pick.href}
                key={`${pick.source}-${pick.title}`}
                {...externalLinkProps}
                className="group h-full min-h-[252px] rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-300/30 hover:shadow-xl hover:shadow-fuchsia-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <article className="flex h-full flex-col">
                  <Image
                    src={getTopicThumbnail(pick.source, pick.thumbnail)}
                    alt={pick.title}
                    width={480}
                    height={160}
                    className="h-24 w-full rounded-xl object-cover"
                  />
                  <span className="mt-3 inline-flex w-fit rounded-full border border-white/10 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200">
                    {pick.badge}
                  </span>
                  <h4 className="mt-3 text-base font-semibold leading-6 text-white [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                    {pick.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-300 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                    {pick.summary}
                  </p>
                  <span className="mt-auto pt-4 text-sm font-medium text-fuchsia-300 transition-all duration-300 group-hover:tracking-wide">
                    阅读更多 →
                  </span>
                </article>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
