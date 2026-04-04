import { ArrowUpRight, Bot, Sparkles, WandSparkles } from 'lucide-react';

const featuredItems = [
  {
    title: '高效生产力',
    description: '集成自动化流程、日报生成与任务分发，帮助团队提升 3 倍执行效率。',
    tag: '热门',
    icon: Sparkles
  },
  {
    title: '智能问答',
    description: '企业级知识问答助手，多模型切换与上下文记忆，低成本快速部署。',
    tag: '免配置',
    icon: Bot
  },
  {
    title: '图像生成',
    description: '覆盖文生图、品牌海报与社媒创意，支持即刻出图与风格一致性控制。',
    tag: '创作者首选',
    icon: WandSparkles
  }
];

export function FeaturedCards() {
  return (
    <section className="mt-14">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white md:text-3xl">热门推荐</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featuredItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200/30 hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full border border-white/10 bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
              <button className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-cyan-300 transition-all duration-300 group-hover:gap-2">
                开始使用 <ArrowUpRight className="h-4 w-4" />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
