'use client';

import { useEffect, useState } from 'react';
import { siteLinks } from '@/data/site-links';

type NewsItem = {title?:string;slug?:string;date?:string;content?:string;status?:string;cover?:string};
type DisplayItem = {title:string;href:string;summary:string;time:string;cover:string|null};
const NEWS_HOME='https://news.chatgpt5x.com/zh/news';
const external={target:'_blank',rel:'noopener noreferrer'} as const;
function parseNews(raw:unknown):DisplayItem[]{
  const payload=raw as {data?:unknown;items?:unknown}|null;
  const rows=Array.isArray(raw)?raw:Array.isArray(payload?.data)?payload.data:Array.isArray(payload?.items)?payload.items:[];
  const seen=new Set<string>();
  return rows.filter((x):x is NewsItem=>!!x&&typeof x==='object'&&typeof x.title==='string'&&x.title.trim().length>0&&(!x.status||x.status==='Published')).filter(x=>{
    const key=x.slug?.trim()||x.title!.trim();if(seen.has(key))return false;seen.add(key);return true;
  }).slice(0,3).map(x=>({
    title:x.title!.trim(),href:typeof x.slug==='string'&&x.slug.trim()?NEWS_HOME+'/'+encodeURIComponent(x.slug.trim()):NEWS_HOME,
    summary:typeof x.content==='string'?x.content.replace(/\s+/g,' ').trim().slice(0,78):'',
    time:typeof x.date==='string'&&x.date.trim()?x.date.trim():'',cover:typeof x.cover==='string'&&x.cover.trim()?x.cover.trim():null
  }));
}

export function NewsSection(){
  const [news,setNews]=useState<DisplayItem[]>([]);
  const [state,setState]=useState<'loading'|'ready'|'unavailable'>('loading');
  useEffect(()=>{
    const ctrl=new AbortController();
    let active=true;
    fetch('/api/news',{signal:ctrl.signal}).then(async res=>{
      if(!res.ok)throw Error('News HTTP '+res.status);
      const items=parseNews(await res.json());
      if(active){setNews(items);setState(items.length?'ready':'unavailable');}
    }).catch(()=>{if(active)setState('unavailable');});
    return()=>{active=false;ctrl.abort();};
  },[]);
  return (
    <section aria-label="最新 AI 资讯">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">最新 AI 资讯</h2>
        </div>
        <a
          href={siteLinks.news}
          {...external}
          className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
        >
          阅读更多 →
        </a>
      </div>

      {state==='ready'?(
      <div className="grid gap-4 md:grid-cols-3">
        {news.map((item) => (
          <a
            key={`${item.href}-${item.title}`}
            href={item.href}
            {...external}
            className="group h-full min-h-[320px] rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-xl hover:shadow-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <article className="flex h-full flex-col">
              {item.cover ? (
                <div
                  role="img"
                  aria-label={item.title}
                  className="h-40 w-full rounded-xl border border-white/10 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.cover})` }}
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-slate-900/60 text-xs text-slate-400">
                  暂无封面图
                </div>
              )}
              <p className="mt-3 text-xs text-slate-400">{item.time}</p>
              <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-white">{item.title}</h3>
              {item.summary ? <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-300">{item.summary}</p> : null}
              <span className="mt-auto pt-4 text-sm font-medium text-cyan-300">阅读更多 →</span>
            </article>
          </a>
        ))}
      </div>
      ):<p role="status" className="surface-panel rounded-xl p-4 text-sm text-secondary">{state==='loading'?'正在获取最新资讯…':'资讯暂未更新，请前往资讯站查看更多。'}</p>}
    </section>
  );
}
