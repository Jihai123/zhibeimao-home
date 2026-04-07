import Image from 'next/image';

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

function getTopicThumbnail(source: 'forum' | 'aijianghu', thumbnail?: string) {
  return thumbnail || defaultTopicThumbnails[source];
}

export function RankingList() {
  const topicPicks = [...featuredTopics].sort((a, b) => b.priority - a.priority).slice(0, 4);

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
          <article className="flex h-full min-h-[252px] flex-col rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/70 to-slate-950 p-5">
            <div className="mb-3 flex items-center gap-2 text-xs text-cyan-200">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-500/10 px-2 py-1">↑ 上升</span>
              <span className="rounded-full border border-amber-300/40 bg-amber-500/10 px-2 py-1">🔥 爆款</span>
            </div>
            <h3 className="text-xl font-bold text-white">真实 AI 排行榜</h3>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-300">基于真实数据的AI工具与模型趋势</p>
            <p className="mt-3 text-xs text-slate-400">2.3w 人正在查看本周趋势</p>
            <a
              href={siteLinks.aiLeaderboard}
              {...externalLinkProps}
              className="mt-auto inline-flex w-fit items-center rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              查看完整榜单
            </a>
          </article>
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
