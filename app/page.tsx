import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, Layers3, LayoutGrid, ChartNoAxesColumn, Newspaper, MessagesSquare, Clapperboard, Code2, Wallet, Globe } from 'lucide-react';
import { aiDirectEntries, toolAssets } from '@/data/home-data';
import { siteLinks } from '@/data/site-links';
import { StoreAttributionLink } from '@/components/StoreAttributionLink';
import { HomeMotion, CopyEndpoint } from '@/components/HomeMotion';
import { HomeInsights } from '@/components/HomeInsights';
import { getHomeContent } from '@/lib/home-content';
import { NewsSection } from '@/components/NewsSection';
import './home-theme.css';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
const quickIcons = [LayoutGrid, ChartNoAxesColumn, Newspaper, MessagesSquare];
const quickEntries = [
  { label: 'AI 工具导航', href: siteLinks.nav },
  { label: '全球 AI 模型总榜', href: 'https://news.chatgpt5x.com/ai-rankings/intelligence' },
  { label: 'AI 前沿资讯', href: siteLinks.news },
  { label: 'AI 交流社区', href: siteLinks.forum }
];
const productNames: Record<string, {title:string;description:string}> = {
  [siteLinks.hongKongIPO]: {title:'港股新股分析',description:'新股资料与研究参考'},
  [siteLinks.pensionCalculator]: {title:'养老金计算器',description:'退休时间与养老金测算'},
  [siteLinks.livableCity]: {title:'易居 · 中国宜居城市',description:'城市数据与生活条件对比'},
  [siteLinks.workValue]: {title:'这B班值不值',description:'薪酬、通勤与工作体验评估'},
  [siteLinks.xingmingtong]: {title:'星命通',description:'传统命理文化与娱乐体验'}
};
const relatedProducts = toolAssets.filter(item=>Boolean(productNames[item.href]));
const appIcons = [MessagesSquare, Layers3, Clapperboard];
const appTypes = ['专业 AI 工作台', '轻量 AI 对话', 'AI 视觉创作'];
const appActions = ['进入工作台', '开始 AI 对话', '开始视觉创作'];
const appDescriptions = ['深度问答、长文写作、知识整理与代码辅助。','简洁的多模型对话，适合日常问答与快速创作。','面向图像与视频内容的 AI 创作，探索更多视觉表达。'];

function SectionTitle({ title, description }: { title:string; description:string }) {
  return <div className="zbm-section-head"><h2>{title}</h2><p>{description}</p></div>;
}

function FeatureArt({ index }: {index:number}) {
  return <svg viewBox="0 0 240 90" aria-hidden="true">
    <path d="M0 20H240M0 45H240M0 70H240M40 0V90M80 0V90M120 0V90M160 0V90M200 0V90" opacity=".12" stroke="currentColor"/>
    {index === 0 ? <><path d="M15 69 L56 51 91 60 130 29 170 43 218 12 V87H15Z" fill="currentColor" opacity=".1"/><path d="M15 69 L56 51 91 60 130 29 170 43 218 12" fill="none" stroke="currentColor" strokeWidth="2.7"/><g fill="currentColor"><circle cx="56" cy="51" r="3"/><circle cx="130" cy="29" r="3"/><circle cx="218" cy="12" r="4"/></g></> : index === 1 ? <g fill="none" stroke="currentColor"><circle cx="120" cy="45" r="30" opacity=".55"/><circle cx="120" cy="45" r="36" strokeDasharray="2 7" opacity=".3"/><path d="M120 20v25l17 10" strokeWidth="2.5"/><path d="M45 45h35m80 0h35" opacity=".5"/></g> : <g fill="currentColor"><rect x="50" y="44" width="34" height="36" rx="5" opacity=".38"/><rect x="103" y="12" width="34" height="68" rx="5" opacity=".86"/><rect x="156" y="31" width="34" height="49" rx="5" opacity=".55"/></g>}
  </svg>;
}

export const metadata = {
  title: '指北猫 - AI 工具导航 · AI 在线体验 · AI API 模型服务',
  description: '指北猫是一站式 AI 发现、体验与应用服务平台，提供 AI 工具导航、全球 AI 模型能力总榜、行业资讯、在线 AI 对话与视觉创作，以及兼容 OpenAI 的 API 接入和模型价格查询。',
  alternates: { canonical: 'https://www.zhibeimao.com/' }
};

export const revalidate = 900;

export default async function HomePage() {
  const {picks,modelFeed,topics}=await getHomeContent();
  return <main className="zbm-home">
    <div className="zbm-progress" aria-hidden="true"/>
    <section className="zbm-hero" aria-label="指北猫 AI 服务平台">
      <div className="zbm-wrap">
        <div className="zbm-hero-inner">
          <div className="zbm-hero-copy">
            <div className="zbm-kicker">一站式 AI 服务平台</div>
            <h1><span>发现 AI，</span><span className="zbm-gradient">让 AI 为你所用。</span></h1>
            <p>发现好用的 AI 工具，体验海外主流大模型，获取前沿资讯。<br/>从在线对话到 API 接入，让 AI 更容易融入工作与创作。</p>
            <div className="zbm-actions"><a href="#ai-direct" className="zbm-button zbm-primary">在线使用 AI <ArrowRight size={17}/></a><a href="#api-access" className="zbm-button zbm-secondary">了解 API 服务 <ArrowRight size={17}/></a></div>
          </div>
          <div className="zbm-art">
            <HomeMotion/>
            <div className="zbm-orbit" aria-hidden="true"/>
            <div className="zbm-orb" aria-hidden="true"><Compass strokeWidth={1.15}/></div>
            <div className="zbm-chips"><span><Globe size={19}/> 海外主流模型 · 国内便捷访问</span><span><Layers3 size={19}/> 一个 Key · 多模型统一接入</span></div>
            
          </div>
        </div>
        <nav className="zbm-quick" aria-label="快捷入口">{quickEntries.map((item,index)=>{const Icon=quickIcons[index]??Compass;return <a key={item.href} href={item.href} {...external}><Icon size={21} aria-hidden="true"/><span>{item.label}</span><ArrowUpRight size={15} aria-hidden="true"/></a>;})}</nav>
      </div>
    </section>
    <div className="zbm-content">
      <div className="zbm-energy" aria-hidden="true"><i/></div>
      <section className="zbm-section" id="recommend" aria-label="精选推荐"><div className="zbm-wrap">
        <SectionTitle title="精选推荐" description="前沿模型、热门工具与 AI 实战精选，随数据和内容定期更新。"/>
        <div className="zbm-cards zbm-three">{picks.map((item,index)=><a key={index+'-'+item.href} href={item.href} {...(item.href.startsWith('/')?{}:external)} className="zbm-card zbm-feature">
          <div className="zbm-topline"><span>{item.subtitle}</span></div><div className="zbm-feature-art"><FeatureArt index={index===0?2:index===1?0:1}/></div>
          <h3>{item.title}</h3><p>{item.reason}</p><div className="zbm-cardfoot">{item.cta}<ArrowRight size={17}/></div>
        </a>)}</div>
      </div></section>
      <section className="zbm-section" id="ai-direct" aria-label="指北猫AI直通"><div className="zbm-wrap">
        <SectionTitle title="指北猫 AI 直通" description="一个 API Key，体验三款在线 AI 工具；按使用场景选择适合的应用。"/>
        <div className="zbm-cards zbm-three">{aiDirectEntries.map((item,index)=>{const Icon=appIcons[index]??MessagesSquare;return <a className="zbm-card zbm-app" key={item.href} href={item.href} {...external}><div className="zbm-topline"><span className="zbm-glyph"><Icon size={24}/></span><span>{appTypes[index]}</span></div><h3>{item.title}</h3><p>{appDescriptions[index]??item.description}</p><div className="zbm-cardfoot">{appActions[index]??"立即体验"}<ArrowRight size={17}/></div></a>;})}</div>
        <div className="zbm-services"><strong>首次使用？</strong><StoreAttributionLink placement="home_ai_direct">获取通用 API Key <ArrowUpRight size={15}/></StoreAttributionLink><a href={siteLinks.tutorial} {...external}>查看使用教程</a><a href={siteLinks.apiKeyBalance} {...external}>查询余额</a></div>
      </div></section>
      <section className="zbm-section" id="api-access" aria-label="统一 API 接入"><div className="zbm-wrap">
        <SectionTitle title="指北猫 API" description="面向开发者与 AI 应用的统一模型服务。"/>
        <div className="zbm-api-panel">
          <div><div className="zbm-kicker">OPENAI COMPATIBLE</div><h3>一个 Key，<br/>连接主流 AI 模型。</h3><p>连接 GPT、Claude、Gemini 等主流模型系列，支持国内网络便捷接入。美元额度可用人民币购买，按需选择模型线路与调用成本。</p><div className="zbm-actions"><Link href="/api" className="zbm-button zbm-primary">查看模型与价格 <ArrowRight size={17}/></Link><Link href="/api/docs" className="zbm-button zbm-secondary">查看接入文档</Link></div></div>
          <div className="zbm-code"><div className="zbm-code-head"><i/><i/><i/><span>API / ENDPOINT</span></div><p>Base URL</p><code>https://api.zhibeimao.com/v1</code><CopyEndpoint/><div className="zbm-route-row"><span><Globe size={13}/> 国内便捷接入</span><span><Layers3 size={13}/> 海外主流模型</span><span><Wallet size={13}/> 优惠额度</span><span><Code2 size={13}/> OpenAI 兼容</span></div></div>
        </div>
        <div className="zbm-services"><strong>使用与账户服务</strong><StoreAttributionLink placement="homepage_key">购买 API Key <ArrowUpRight size={15}/></StoreAttributionLink><a href={siteLinks.apiKeyBalance} {...external}>查询余额与消费明细</a><a href={siteLinks.tutorial} {...external}>使用教程</a></div>
      </div></section>
      <div className="zbm-section zbm-wrap zbm-live" id="insights"><HomeInsights modelFeed={modelFeed} topics={topics}/></div>
      <div className="zbm-section zbm-wrap zbm-live" id="today"><NewsSection/></div>
      <section className="zbm-section zbm-portfolio" id="tools"><div className="zbm-wrap">
        <SectionTitle title="旗下产品" description="探索指北猫旗下独立应用，覆盖生活、工作与个人规划。" />
        <div className="zbm-product-grid">{relatedProducts.map(item=>{const Icon=item.icon;const product=productNames[item.href];return <a key={item.href} href={item.href} {...external} className="zbm-product"><span className="zbm-glyph"><Icon size={20} aria-hidden="true"/></span><span className="zbm-product-copy"><strong>{product.title}</strong><small>{product.description}</small></span><ArrowUpRight size={15} aria-hidden="true"/></a>;})}</div>
      </div></section>
    </div>
  </main>;
}
