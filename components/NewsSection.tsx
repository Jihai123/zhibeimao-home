'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { EditorialArt } from '@/components/EditorialArt';
import { siteLinks } from '@/data/site-links';

type NewsItem = {title?:string;slug?:string;date?:string;content?:string;status?:string;cover?:string};
type DisplayItem = {title:string;href:string;summary:string;time:string;cover:string|null};
const NEWS_HOME='https://news.chatgpt5x.com/zh/news';
const external={target:'_blank',rel:'noopener noreferrer'} as const;
// Reviewed covers are tied to the exact article and image URL. New or
// mismatched brand covers use topic-specific editorial illustrations instead.
const reviewedCovers:Record<string,string>={
  '2027年ai就可能自己踩油门-openai提议用-困惑度-提前画条红线':'https://chatgpt5x.com/serve-image/19f0549580a70fcc888f1aafbce49c54098de817c1a3380c4bf60bc08d7fea5b.webp',
  '1999年写一周代码-现在交个ppt就能拿奖-ai黑客松怎么成了社交场':'https://chatgpt5x.com/serve-image/fc95c3824287c800b4d90709edc34d0c42a208326c0fb62cbc49a25ae32d4e9e.webp',
  '1-5亿人把健康交给ai管-蚂蚁ceo却说重点不是治病':'https://chatgpt5x.com/serve-image/73e140d05c889234f9455c7ecd9cfd9695deb78db82caf52fc0a5dacb6aab847.webp'
};
function reviewedCover(x:NewsItem):string|null{
  const url=typeof x.cover==='string'?x.cover.replace(/^http:\/\//,'https://'):'';
  return x.slug && url && reviewedCovers[x.slug]===url?url:null;
}
function NewsCover({item}:{item:DisplayItem}){
  const [failed,setFailed]=useState(false);
  return <span className="zbm-news-cover">{item.cover&&!failed?<img src={item.cover} alt="" loading="lazy" decoding="async" onError={()=>setFailed(true)}/>:<EditorialArt title={item.title}/>}</span>;
}
function parseNews(raw:unknown):DisplayItem[]{
  const payload=raw as {data?:unknown;items?:unknown}|null;
  const rows=Array.isArray(raw)?raw:Array.isArray(payload?.data)?payload.data:Array.isArray(payload?.items)?payload.items:[];
  const seen=new Set<string>();
  return rows.filter((x):x is NewsItem=>!!x&&typeof x==='object'&&typeof x.title==='string'&&x.title.trim().length>0&&(!x.status||x.status==='Published')).filter(x=>{
    const key=x.slug?.trim()||x.title!.trim();if(seen.has(key))return false;seen.add(key);return true;
  }).slice(0,6).map(x=>({
    title:x.title!.trim(),href:typeof x.slug==='string'&&x.slug.trim()?NEWS_HOME+'/'+encodeURIComponent(x.slug.trim()):NEWS_HOME,
    summary:typeof x.content==='string'?x.content.replace(/\s+/g,' ').trim().slice(0,78):'',
    time:typeof x.date==='string'&&x.date.trim()?x.date.trim():'',cover:reviewedCover(x)
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
    {state==='ready'?<div className="zbm-news-grid zbm-news-illustrated" data-count={news.length}>{news.map(item=><a key={item.href+'-'+item.title} href={item.href} {...external} className="zbm-news-item">
      <NewsCover item={item}/>
      <div className="zbm-news-copy"><h3 className="line-clamp-2">{item.title}</h3>{item.summary&&<p className="line-clamp-1">{item.summary}</p>}{item.time&&<time>{item.time}</time>}</div><ArrowRight size={16} aria-hidden="true"/>
    </a>)}</div>:<p role="status" className="surface-panel rounded-xl p-4 text-sm text-secondary">{state==='loading'?'正在获取最新资讯…':'资讯暂未更新，请前往资讯站查看更多。'}</p>}
  </section>;
}
