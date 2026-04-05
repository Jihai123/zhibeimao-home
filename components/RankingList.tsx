import { rankingGroups } from '@/data/home-data';
import { featuredTopics, type FeaturedTopic } from '@/src/data/featuredTopics';
import { siteLinks } from '@/data/site-links';
import Image from 'next/image';

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

function getTopicThumbnail(item: FeaturedTopic, index: number) {
  if (item.thumbnail) return item.thumbnail;

  if (item.source === 'forum') {
    return '/images/topics/forum/default-forum.jpg';
  }

  if (item.source === 'aijianghu') {
    return '/images/topics/aijianghu/default-aijianghu.jpg';
  }

  return index >= 0 ? '/images/topics/common/default-topic.jpg' : '/images/topics/common/default-topic.jpg';
}

function getTopicSourceLabel(source: FeaturedTopic['source']) {
  if (source === 'forum') return '论坛热议';
  if (source === 'aijianghu') return 'AI江湖';
  return '专题推荐';
}

export function RankingList() {
  let rank = 1;
  const topicPicks = [...featuredTopics].sort((a, b) => b.priority - a.priority);

  return (
    <section className="mt-16" aria-label="AI 榜单与专题精选">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">AI 榜单与精选</h2>
          <p className="mt-2 text-sm text-slate-400">作为浏览层，帮你继续筛选值得深入了解的 AI 工具与方向。</p>
        </div>
        <a
          href={siteLinks.rankings}
          {...externalLinkProps}
          className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
        >
          查看结果 →
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur">
          <h3 className="text-base font-semibold text-white">实时榜单</h3>
          <div className="mt-4 space-y-4">
            {rankingGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-xs font-medium tracking-wide text-slate-400 uppercase">{group.title}</p>
                <ol className="space-y-2">
                  {group.items.map((item) => {
                    const currentRank = rank++;
                    return (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          {...externalLinkProps}
                          className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-900/40 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300/30 hover:bg-slate-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                        >
                          <div className="flex items-start gap-3">
                            <span className="pt-0.5 text-base font-black text-amber-300">
                              {String(currentRank).padStart(2, '0')}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-white">{item.name}</h4>
                                <span className="rounded-md bg-cyan-400/20 px-1.5 py-0.5 text-[11px] font-semibold text-cyan-200">
                                  {item.status}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-slate-300">{item.description}</p>
                            </div>
                          </div>
                          <span className="shrink-0 rounded-lg bg-violet-500 px-3 py-2 text-xs font-semibold text-white">
                            {item.cta}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-white">专题精选</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {topicPicks.map((pick, index) => (
              <a
                href={pick.href}
                key={`${pick.source}-${pick.title}`}
                {...externalLinkProps}
                className="group h-full min-h-[252px] rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-300/30 hover:shadow-xl hover:shadow-fuchsia-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <article className="flex h-full flex-col">
                  <span className="inline-flex w-fit rounded-full border border-white/10 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200">
                    {getTopicSourceLabel(pick.source)}
                  </span>
                  <Image
                    src={getTopicThumbnail(pick, index)}
                    alt={pick.title}
                    width={480}
                    height={160}
                    className="mt-3 h-20 w-full rounded-xl object-cover"
                  />
                  <h4 className="mt-3 text-base font-semibold leading-6 text-white [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                    {pick.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-300 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                    {pick.summary}
                  </p>
                  <span className="mt-auto pt-4 text-sm font-medium text-fuchsia-300 transition-all duration-300 group-hover:tracking-wide">
                    去阅读 →
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
