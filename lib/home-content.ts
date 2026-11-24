import { unstable_cache } from 'next/cache';
import rankingSnapshot from '@/data/home-model-rankings.json';
import { getPublicModelCatalog } from '@/lib/model-catalog';
import { siteLinks } from '@/data/site-links';
import { featuredTopics } from '@/src/data/featuredTopics';

export type Pick = { title:string; subtitle:string; reason:string; href:string; cta:string };
export type ModelRow = { model:string; creator:string; intelligence:number; indexVersion:number };
export type ModelFeed = { rows:ModelRow[]; version:number; fetchedAt:string; snapshot:boolean };
type Tool = { name:string; rank:number };
type ToolFeed = { tools:Tool[]; lastUpdated:string|null };
const IQ_URL = 'https://news.chatgpt5x.com/api/ai-iq';
const TOOL_URL = 'https://news.chatgpt5x.com/zh/api/ai-rankings?type=all';
const record = (x:unknown):Record<string,unknown> => x && typeof x==='object' && !Array.isArray(x) ? x as Record<string,unknown> : {};
const string = (x:unknown) => typeof x==='string' ? x.trim() : '';
const number = (x:unknown):number|null => typeof x==='number' && Number.isFinite(x) ? x : null;
async function readJson(url:string):Promise<unknown> {
  const res=await fetch(url,{next:{revalidate:3600},headers:{Accept:'application/json'},signal:AbortSignal.timeout(9000)});
  if(!res.ok) throw new Error('Feed HTTP '+res.status);
  return res.json();
}
export function parseModelFeed(raw:unknown):ModelRow[] {
  if(!Array.isArray(raw)) throw new Error('Unexpected model feed');
  const valid=raw.map(item=>{
    const r=record(item), model=string(r.model), creator=string(r.creator), intelligence=number(r.intelligence), indexVersion=number(r.indexVersion);
    if(!model||!creator||intelligence===null||indexVersion===null||!Number.isInteger(indexVersion)||indexVersion<1) return null;
    return {model,creator,intelligence,indexVersion};
  }).filter((r):r is ModelRow=>r!==null);
  if(!valid.length) throw new Error('No scored models');
  const version=Math.max(...valid.map(r=>r.indexVersion));
  return valid.filter(r=>r.indexVersion===version).sort((a,b)=>b.intelligence-a.intelligence).slice(0,10);
}
export function parseToolFeed(raw:unknown):ToolFeed {
  let value=record(raw).value??raw;
  if(typeof value==='string') value=JSON.parse(value);
  const data=record(value), rankings=record(data.rankings);
  const items=rankings.popularTools??data.popularTools;
  if(!Array.isArray(items)) throw new Error('Unexpected tool feed');
  const tools=items.map(item=>{
    const r=record(item), name=string(r.name), rank=number(r.rank);
    return name&&rank!==null&&Number.isInteger(rank)&&rank>0 ? {name,rank}:null;
  }).filter((r):r is Tool=>r!==null).sort((a,b)=>a.rank-b.rank);
  if(!tools.length) throw new Error('Empty tool feed');
  return {tools,lastUpdated:string(record(data.metadata).lastUpdated)||null};
}
// Cache only successfully validated payloads. Failed revalidation does not replace
// an existing valid entry; cold-cache model failure uses the dated source snapshot below.
const readModels=unstable_cache(async ():Promise<ModelFeed>=>{
  let rows:ModelRow[];
  try { rows=parseModelFeed(await readJson(IQ_URL)); }
  catch (error) {
    console.warn('[home-models] primary source unavailable',error instanceof Error?error.message:String(error));
    rows=parseModelFeed(await readJson('https://news.chatgpt5x.com/zh/api/ai-iq'));
  }
  return {rows,version:rows[0].indexVersion,fetchedAt:new Date().toISOString(),snapshot:false};
},['zbm-home-model-intelligence-v31-cache-fix'],{revalidate:3600});
const readTools=unstable_cache(async()=>parseToolFeed(await readJson(TOOL_URL)),['zbm-home-tool-trend-v31-cache-fix'],{revalidate:3600});

const practicalPicks:Pick[]=[
  {title:'AI 自动回复机器人教程',subtitle:'AI 实战精选',reason:'了解大模型消息自动回复与应用接入的实现思路。',href:featuredTopics[0].href,cta:'阅读教程'},
  {title:'AI 工作场景分析',subtitle:'AI 实战精选',reason:'从具体工作任务出发，了解 AI 可以辅助哪些环节。',href:siteLinks.aiWorkAnalyst,cta:'查看应用'},
  {title:'AI API 接入指南',subtitle:'AI 实战精选',reason:'了解兼容接口、模型 ID 与常见开发接入方式。',href:'/api/docs',cta:'阅读指南'},
  {title:'Cursor 使用经验',subtitle:'AI 实战精选',reason:'阅读社区关于 AI 编程与开发提效的经验讨论。',href:featuredTopics[4].href,cta:'查看经验'}
];
// Optional editorial overrides. Leave empty for automatic rotation.
// Each slot has an independent cadence and an approved fallback destination.
const pinned:Partial<Record<'model'|'tool'|'practical',Pick>>={};
export async function getHomeContent(now=Date.now()) {
  const [models,tools]=await Promise.allSettled([readModels(),readTools()]);
  const modelFeed:ModelFeed=models.status==='fulfilled'?models.value:{rows:parseModelFeed(rankingSnapshot.rows),version:rankingSnapshot.version,fetchedAt:rankingSnapshot.fetchedAt,snapshot:true};
  if(models.status==='rejected') console.warn('[home-models] serving dated snapshot',String(models.reason));
  const toolFeed=tools.status==='fulfilled'?tools.value:null;
  const day=Math.floor((now+8*3600000)/86400000);
  const week=Math.floor(day/7);
  const catalog=getPublicModelCatalog();
  const families=new Set<string>();
  const candidates=catalog.models.filter(m=>{
    if(m.id.includes('/')||m.family==='其他'||families.has(m.family))return false;
    families.add(m.family);return true;
  });
  const candidate=candidates.length?candidates[day%candidates.length]:null;
  // Only use verified catalog IDs; ordering by version is not a release-date claim.
  const modelPick:Pick=candidate?{title:candidate.canonicalId,subtitle:'前沿模型 · 目录精选',reason:'模型目录已收录该 ID。查看可用线路、实际价格和接入说明。',href:'/api#models',cta:'查看模型与价格'}:{title:'探索主流 AI 模型',subtitle:'前沿模型',reason:'浏览模型目录、接入方式和最新同步的价格信息。',href:'/api#models',cta:'查看目录'};
  const allowedTools=new Set(['chatgpt','gemini','claude','canva','google translate','deepseek','perplexity','notion','copilot','github copilot','cursor','qwen','kimi']);
  const hot=(toolFeed?.tools??[]).filter(t=>t.rank<=15&&allowedTools.has(t.name.toLowerCase())).slice(0,6);
  const tool=hot.length?hot[day%hot.length]:null;
  const toolPick:Pick=tool?{title:tool.name,subtitle:'热门 AI 工具',reason:'当前工具热度榜第 '+tool.rank+' 名。排名反映使用热度，不代表模型能力。',href:siteLinks.aiLeaderboard,cta:'查看热度榜'}:{title:'全球 AI 工具热度',subtitle:'热门 AI 工具',reason:'浏览现有工具热度榜，了解受关注的 AI 应用。',href:siteLinks.aiLeaderboard,cta:'查看榜单'};
  const practical=pinned.practical??practicalPicks[week%practicalPicks.length];
  const remaining=featuredTopics.filter(t=>t.href!==practical.href && !/字节跳动AI|盗脸术|AI京华令/.test(t.title));
  const rotated=remaining.slice(week%Math.max(1,remaining.length)).concat(remaining.slice(0,week%Math.max(1,remaining.length)));
  return {picks:[pinned.model??modelPick,pinned.tool??toolPick,practical],modelFeed,toolFeed,topics:rotated.slice(0,5)};
}
