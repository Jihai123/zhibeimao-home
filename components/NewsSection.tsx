'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Newspaper } from 'lucide-react';
import { siteLinks } from '@/data/site-links';

type NewsItem = {title?:string;slug?:string;date?:string;content?:string;status?:string};
type DisplayItem = {title:string;href:string;summary:string;time:string};
const NEWS_HOME='https://news.chatgpt5x.com/zh/news';
const external={target:'_blank',rel:'noopener noreferrer'} as const;
function parseNews(raw:unknown):DisplayItem[]{
  const payload=raw as {data?:unknown;items?:unknown}|null;
  const rows=Array.isArray(raw)?raw:Array.isArray(payload?.data)?payload.data:Array.isArray(payload?.items)?payload.items:[];
  const seen=new Set<string>();
  return rows.filter((x):x is NewsItem=>!!x&&typeof x==='object'&&typeof x.title==='string'&&x.title.trim().length>0&&(!x.status||x.status==='Published')).filter(x=>{
    const key=x.slug?.trim()||x.title!.trim();if(seen.has(key))return false;seen.add(key);return true;
  }).slice(0,6).map(x=>({
    title:x.title!.trim(),href:typeof x.slug==='string'&&x.slug.trim()?NEWS_HOME+'/'+encodeURIComponent(x.slug.trim()):NEWS_HOME,
    summary:typeof x.content==='string'?x.content.replace(/\s+/g,' ').trim().slice(0,78):'',
    time:typeof x.date==='string'&&x.date.trim()?x.date.trim():''
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
  return <section aria-label="最新 AI 资讯">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-primary text-2xl font-bold md:text-3xl">最新 AI 资讯</h2>
      <a href={siteLinks.news} {...external} className="zbm-more">查看更多 <ArrowRight size={16}/></a>
    </div>
    {state==='ready'?<div className="zbm-news-grid">{news.map(item=><a key={item.href+'-'+item.title} href={item.href} {...external} className="zbm-news-item">
      <span className="zbm-news-icon"><Newspaper size={24} aria-hidden="true"/></span>
      <div className="zbm-news-copy"><h3 className="line-clamp-2">{item.title}</h3>{item.summary&&<p className="line-clamp-1">{item.summary}</p>}{item.time&&<time>{item.time}</time>}</div><ArrowRight size={16} aria-hidden="true"/>
    </a>)}</div>:<p role="status" className="surface-panel rounded-xl p-4 text-sm text-secondary">{state==='loading'?'正在获取最新资讯…':'资讯暂未更新，请前往资讯站查看更多。'}</p>}
  </section>;
}
