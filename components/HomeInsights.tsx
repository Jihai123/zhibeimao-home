import { ArrowRight, BookOpen, Trophy } from 'lucide-react';
import Link from 'next/link';
import { siteLinks } from '@/data/site-links';
import type { ModelFeed } from '@/lib/home-content';
import type { FeaturedTopic } from '@/src/data/featuredTopics';

const modelBoard='https://news.chatgpt5x.com/ai-rankings/intelligence';
const external={target:'_blank',rel:'noopener noreferrer'} as const;
type Props={modelFeed:ModelFeed|null;topics:FeaturedTopic[]};
const dateLabel=(iso:string)=>new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso));

export function HomeInsights({modelFeed,topics}:Props) {
  return <section aria-label="全球 AI 模型能力总榜与专题精选">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-primary text-2xl font-bold md:text-3xl">全球 AI 模型能力总榜</h2>
      <a href={modelBoard} {...external} className="zbm-more">完整模型榜 <ArrowRight size={16}/></a>
    </div>
    <div className="grid items-start min-w-0 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <article className="surface-panel min-w-0 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2"><Trophy size={20} className="text-cyan-300" aria-hidden="true"/><h3 className="text-primary text-lg font-semibold">综合智能 · TOP 10</h3></div>
        <p className="text-secondary mt-2 text-xs">按综合智能评分排序，包含不同推理配置。</p>
        {modelFeed ? <>
          <div className="zbm-rank-table" role="table" aria-label="全球 AI 模型综合智能排名">
            <div className="zbm-rank-row zbm-rank-heading" role="row"><span role="columnheader">排名</span><span role="columnheader">模型 / 厂商</span><span role="columnheader">综合评分</span></div>
            {modelFeed.rows.map((row,index)=><div className="zbm-rank-row" role="row" key={row.model+'-'+index}><span role="cell" className={'zbm-rank-number '+(index<3?'zbm-medal-'+index:'')}>{String(index+1).padStart(2,'0')}</span><span role="cell" className="zbm-rank-model"><strong>{row.model}</strong><small>{row.creator}</small></span><span role="cell" className="zbm-rank-score">{row.intelligence.toFixed(1)}</span></div>)}
          </div>
          <p className="text-secondary mt-3 text-xs leading-relaxed">来源：Artificial Analysis · 综合智能指数 v{modelFeed.version}<br/>{modelFeed.snapshot ? "最近核实数据：" : "数据读取时间："}{dateLabel(modelFeed.fetchedAt)}（北京时间）{modelFeed.snapshot && " · 暂未取得更新"}</p>
        </>:<p role="status" className="text-secondary rounded-lg border border-white/10 p-4 mt-4 text-sm">榜单暂未更新，请查看完整模型榜。</p>}
        <div className="mt-4 flex flex-wrap gap-4">
          <a href={modelBoard} {...external} className="zbm-more">查看完整榜单 <ArrowRight size={15}/></a>
          <Link href="/api#models" className="zbm-more">查询模型接入价格 <ArrowRight size={15}/></Link>
        </div>
      </article>
      <article className="surface-panel min-w-0 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2"><BookOpen size={20} className="text-cyan-300" aria-hidden="true"/><h3 className="text-primary text-lg font-semibold">AI 专题精选</h3></div>
        <p className="text-secondary mt-2 text-xs">实战教程与应用经验。</p>
        <div className="mt-4 space-y-3">
          {topics.map(pick=><a href={pick.href} key={pick.href} {...external} className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-colors hover:border-cyan-300/35">
            <span className="zbm-topic-icon"><BookOpen size={22} aria-hidden="true"/></span>
            <div className="min-w-0 flex-1"><span className="text-secondary text-[10px]">{pick.badge}</span><h4 className="text-primary text-sm font-semibold leading-relaxed">{pick.title}</h4><p className="text-secondary mt-1 line-clamp-2 text-xs leading-relaxed">{pick.summary}</p></div>
            <ArrowRight size={14} className="text-cyan-300 shrink-0" aria-hidden="true"/>
          </a>)}
        </div>
        <a href={siteLinks.forum} {...external} className="zbm-more mt-4">更多社区经验 <ArrowRight size={15}/></a>
      </article>
    </div>
  </section>;
}
