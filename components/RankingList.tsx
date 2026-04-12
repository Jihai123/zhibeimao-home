'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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
  value?: unknown;
  popularTools?: RankingItem[];
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

function formatCompactNumber(value: unknown): string {
  const num = toNumber(value);
  if (num === null) return '--';

  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (num >= 10_000) return `${(num / 10_000).toFixed(1).replace(/\.0$/, '')}万`;
  return new Intl.NumberFormat('zh-CN').format(num);
}

function formatGrowthRate(raw: unknown) {
  const num = toNumber(raw);

  if (num === null) {
    return {
      text: '--',
      className: 'text-slate-400'
    };
  }

  if (num > 0) {
    return {
      text: `+${num.toFixed(2)}%`,
      className: 'text-emerald-300'
    };
  }

  if (num < 0) {
    return {
      text: `${num.toFixed(2)}%`,
      className: 'text-rose-300'
    };
  }

  return {
    text: '+0.00%',
    className: 'text-slate-300'
  };
}

export function RankingList() {
  const topicPicks = [...featuredTopics].sort((a, b) => b.priority - a.priority).slice(0, 5);
  const [popularTools, setPopularTools] = useState<RankingItem[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchRankings = async () => {
      try {
        const response = await fetch('/api/ai-rankings');
        const raw: RankingsApiResponse = await response.json();

        if (!response.ok || raw?.error) {
          throw new Error(raw?.error || 'Failed to fetch rankings');
        }

        let payload: unknown = raw;

        if (raw && typeof raw === 'object' && 'value' in raw) {
          payload = raw.value;
        }

        if (typeof payload === 'string') {
          payload = JSON.parse(payload);
        }

        const parsedPayload = payload as RankingsApiResponse;
        const candidateTools = parsedPayload?.rankings?.popularTools || parsedPayload?.popularTools || [];
        const toolsSource = Array.isArray(candidateTools) ? candidateTools : [];
        const tools = toolsSource.slice(0, 9);

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
        <h2 className="text-primary text-2xl font-bold md:text-3xl">热门工具榜单与资讯</h2>
        <a href={siteLinks.rankings} {...externalLinkProps} className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200">
          阅读更多 →
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="surface-panel rounded-2xl p-5">
          <article className="flex h-full min-h-[380px] flex-col rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/70 to-slate-950 p-5">
            <h3 className="text-primary text-xl font-bold">热门 AI 工具</h3>
            <p className="text-secondary mt-2 text-sm">全球范围内热度和增长率最高的工具。</p>

            <div className="mt-4 grid grid-cols-[30px_minmax(0,1fr)_88px_86px] gap-3 px-3 text-[11px] text-secondary/90">
              <span>排名</span>
              <span>工具</span>
              <span className="text-right">热度值</span>
              <span className="text-right">增长率</span>
            </div>

            <div className="mt-2.5 space-y-2.5">
              {(hasData ? popularTools : Array.from({ length: 6 })).map((tool, index) => {
                const rank = hasData ? toNumber((tool as RankingItem).rank) ?? index + 1 : index + 1;
                const growth = hasData
                  ? formatGrowthRate((tool as RankingItem).growth_rate ?? (tool as RankingItem).growthRate)
                  : { text: '--', className: 'text-slate-400' };

                return (
                  <div
                    key={`${(tool as RankingItem)?.name || 'fallback'}-${rank}`}
                    className="grid grid-cols-[30px_minmax(0,1fr)_88px_86px] items-center gap-3 rounded-lg border border-white/10 bg-slate-900/55 px-3 py-2"
                  >
                    <span className="text-sm font-semibold text-cyan-300">#{rank}</span>
                    <span className="truncate text-sm font-medium text-primary">{hasData ? (tool as RankingItem).name || '未知工具' : '数据加载中'}</span>
                    <span className="text-right text-xs text-secondary">{hasData ? formatCompactNumber((tool as RankingItem).change) : '--'}</span>
                    <span className={`text-right text-xs font-semibold ${growth.className}`}>{growth.text}</span>
                  </div>
                );
              })}
            </div>

            <a
              href={siteLinks.aiLeaderboard}
              {...externalLinkProps}
              className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
            >
              查看完整榜单 <ArrowRight className="h-4 w-4" />
            </a>
          </article>
        </div>

        <div className="surface-panel rounded-2xl p-5">
          <h3 className="text-primary mb-4 text-base font-semibold">图文资讯精选</h3>
          <div className="space-y-3">
            {topicPicks.map((pick) => (
              <a
                href={pick.href}
                key={`${pick.source}-${pick.title}`}
                {...externalLinkProps}
                className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-all duration-300 hover:border-fuchsia-300/35 hover:bg-fuchsia-500/[0.06]"
              >
                <Image
                  src={getTopicThumbnail(pick.source, pick.thumbnail)}
                  alt={pick.title}
                  width={84}
                  height={60}
                  className="h-[60px] w-[84px] flex-none rounded-lg border border-white/10 object-cover"
                />
                <article className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-secondary">{pick.badge}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300 group-hover:text-fuchsia-300" />
                  </div>
                  <h4 className="text-primary line-clamp-1 text-sm font-semibold">{pick.title}</h4>
                  <p className="text-secondary mt-1 line-clamp-2 text-xs leading-relaxed">{pick.summary}</p>
                </article>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
