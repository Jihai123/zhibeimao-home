const ranking = [
  {
    name: 'DeepSeek Analyst',
    description: '多模态商业分析与行业洞察引擎。'
  },
  {
    name: 'Notion AI Workspace',
    description: '知识管理 + 协作写作一体化。'
  },
  {
    name: 'Midjourney Studio',
    description: '创意视觉素材生成与版本管理。'
  },
  {
    name: 'Perplexity Pro',
    description: '高可信检索问答与来源追踪。'
  },
  {
    name: 'Runway GenLab',
    description: '视频内容快速生成与编辑自动化。'
  }
];

const picks = [
  '企业 Agent 自动化方案库',
  'A/B 测试实验仪表盘',
  'Prompt 模板市场（高转化）',
  '行业报告生成器',
  '营销漏斗智能诊断',
  '全球 SaaS 定价雷达'
];

export function RankingList() {
  return (
    <section className="mt-16 pb-16">
      <h2 className="text-2xl font-bold text-white md:text-3xl">AI 榜单与精选</h2>
      <div className="mt-7 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
          <ol className="space-y-3">
            {ranking.map((item, index) => {
              const rank = index + 1;
              const rankClass =
                rank === 1
                  ? 'text-amber-300'
                  : rank === 2
                    ? 'text-slate-200'
                    : rank === 3
                      ? 'text-orange-300'
                      : 'text-slate-500';

              return (
                <li
                  key={item.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-900/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/30 hover:bg-slate-900/70"
                >
                  <div className="flex items-start gap-3">
                    <span className={`pt-0.5 text-xl font-black ${rankClass}`}>{String(rank).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                    </div>
                  </div>
                  <button className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-400/10">
                    使用
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {picks.map((pick) => (
            <article
              key={pick}
              className="group rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-300/30 hover:shadow-xl hover:shadow-fuchsia-500/10"
            >
              <p className="text-sm text-slate-400">精选主题</p>
              <h3 className="mt-2 text-base font-semibold leading-relaxed text-white">{pick}</h3>
              <button className="mt-5 text-sm font-medium text-fuchsia-300 transition-all duration-300 group-hover:tracking-wide">
                查看详情 →
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
