import { BadgeDollarSign, BarChart3, Compass, PiggyBank } from 'lucide-react';

const tools = [
  {
    title: '港股打新工具',
    description: '一键计算盈亏比，快速评估融资倍数、申购成本与中签预期。',
    tag: 'Hot',
    cta: '立即计算',
    icon: BadgeDollarSign,
    highlighted: true
  },
  {
    title: '养老金计算器',
    description: '输入年龄与缴费参数，自动生成退休规划曲线与资金缺口分析。',
    tag: '退休规划',
    cta: '开始测算',
    icon: PiggyBank
  },
  {
    title: '宜居小城探索',
    description: '通过人口、就业、房价与医疗指标，发掘高潜力低压力城市。',
    tag: '生活数据挖掘',
    cta: '探索城市',
    icon: Compass
  },
  {
    title: 'AI 工具全景导航',
    description: '聚合检索全球 AI 产品，按场景、价格与口碑快速筛选。',
    tag: '聚合检索',
    cta: '开始检索',
    icon: BarChart3
  }
];

export function ToolCards() {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-white md:text-3xl">硬核决策工具</h2>
      <p className="mt-2 text-sm text-slate-400">围绕真实决策场景打造，帮助你把复杂问题拆解为可执行路径。</p>
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <article
              key={tool.title}
              className={[
                'group rounded-2xl border p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1',
                tool.highlighted
                  ? 'border-amber-300/50 bg-gradient-to-br from-amber-400/10 via-slate-900/90 to-slate-950 shadow-lg shadow-amber-500/15 hover:shadow-xl hover:shadow-amber-400/20'
                  : 'border-white/10 bg-white/[0.03] shadow-sm hover:border-violet-200/30 hover:shadow-xl hover:shadow-violet-500/10'
              ].join(' ')}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-violet-200">
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={[
                    'rounded-full px-2.5 py-1 text-[11px] font-medium',
                    tool.highlighted
                      ? 'border border-amber-300/50 bg-amber-300/20 text-amber-200'
                      : 'border border-white/10 bg-slate-800/80 text-slate-300'
                  ].join(' ')}
                >
                  {tool.tag}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
              <p className="mt-2 min-h-20 text-sm leading-relaxed text-slate-400">{tool.description}</p>
              <button
                className={[
                  'mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300',
                  tool.highlighted
                    ? 'bg-amber-300 text-slate-900 hover:-translate-y-1 hover:bg-amber-200'
                    : 'border border-white/15 bg-white/5 text-slate-100 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-violet-400/10'
                ].join(' ')}
              >
                {tool.cta}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
