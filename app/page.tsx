import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, Layers3, Sparkles, LayoutGrid, ChartNoAxesColumn, Building2, MessagesSquare, Clapperboard } from 'lucide-react';
import { aiDirectEntries, featuredAssets, toolAssets, quickEntries } from '@/data/home-data';
import { siteLinks } from '@/data/site-links';
import { StoreAttributionLink } from '@/components/StoreAttributionLink';
import { HomeMotion, CopyEndpoint } from '@/components/HomeMotion';
import { RankingList } from '@/components/RankingList';
import { NewsSection } from '@/components/NewsSection';
import './home-theme.css';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
const quickIcons = [LayoutGrid, ChartNoAxesColumn, Building2, MessagesSquare];
const appIcons = [MessagesSquare, Layers3, Clapperboard];
const appTypes = ['智能对话', '多模型对话', '视觉创作'];

function SectionTitle({ number, english, title, description }: { number:string; english:string; title:string; description:string }) {
  return <div className="zbm-section-head"><div className="zbm-kicker">{number} / {english}</div><h2>{title}</h2><p>{description}</p></div>;
}

function FeatureArt({ index }: {index:number}) {
  return <svg viewBox="0 0 240 90" aria-hidden="true">
    <path d="M0 20H240M0 45H240M0 70H240M40 0V90M80 0V90M120 0V90M160 0V90M200 0V90" opacity=".12" stroke="currentColor"/>
    {index === 0 ? <><path d="M15 69 L56 51 91 60 130 29 170 43 218 12 V87H15Z" fill="currentColor" opacity=".1"/><path d="M15 69 L56 51 91 60 130 29 170 43 218 12" fill="none" stroke="currentColor" strokeWidth="2.7"/><g fill="currentColor"><circle cx="56" cy="51" r="3"/><circle cx="130" cy="29" r="3"/><circle cx="218" cy="12" r="4"/></g></> : index === 1 ? <g fill="none" stroke="currentColor"><circle cx="120" cy="45" r="30" opacity=".55"/><circle cx="120" cy="45" r="36" strokeDasharray="2 7" opacity=".3"/><path d="M120 20v25l17 10" strokeWidth="2.5"/><path d="M45 45h35m80 0h35" opacity=".5"/></g> : <g fill="currentColor"><rect x="50" y="44" width="34" height="36" rx="5" opacity=".38"/><rect x="103" y="12" width="34" height="68" rx="5" opacity=".86"/><rect x="156" y="31" width="34" height="49" rx="5" opacity=".55"/></g>}
  </svg>;
}

export default function HomePage() {
  return <main className="zbm-home">
    <div className="zbm-progress" aria-hidden="true"/>
    <section className="zbm-hero" aria-label="指北猫智能决策平台">
      <div className="zbm-wrap">
        <div className="zbm-hero-inner">
          <div className="zbm-hero-copy">
            <div className="zbm-kicker">AI DECISION HUB / 智能决策平台</div>
            <h1><span>发现 AI，</span><span className="zbm-gradient">让选择更清晰。</span><span className="sr-only">AI 工具导航与评测中心</span></h1>
            <p>探索实用 AI 工具，了解前沿模型与行业动态。<br/>从工作效率到生活决策，找到适合自己的答案。</p>
            <div className="zbm-actions"><a href="#ai-direct" className="zbm-button zbm-primary">探索 AI 体验 <ArrowRight size={17}/></a><a href="#tools" className="zbm-button zbm-secondary">查看决策工具 <ArrowRight size={17}/></a></div>
          </div>
          <div className="zbm-art">
            <HomeMotion onlineCount={aiDirectEntries.length} toolCount={toolAssets.length}/>
            <div className="zbm-orbit" aria-hidden="true"/>
            <div className="zbm-orb" aria-hidden="true"><Compass strokeWidth={1.15}/></div>
            <div className="zbm-chips"><span><Layers3 size={19}/> 主流模型 · 统一接入</span><span><Sparkles size={19}/> 探索 · 体验 · 决策</span></div>
            <div className="zbm-art-label" aria-hidden="true"><span className="zbm-dark-label">QUANTUM FIELD / 01</span><span className="zbm-light-label">DESIGNED FOR CLARITY / 01</span></div>
          </div>
        </div>
        <nav className="zbm-quick" aria-label="快捷入口">{quickEntries.map((item,index)=>{const Icon=quickIcons[index]??Compass;return <a key={item.href} href={item.href} {...external}><Icon size={21} aria-hidden="true"/><span>{item.label}</span><ArrowUpRight size={15} aria-hidden="true"/></a>;})}</nav>
      </div>
    </section>
    <div className="zbm-content">
      <div className="zbm-energy" aria-hidden="true"><i/></div>
      <section className="zbm-section" id="recommend" aria-label="精选推荐"><div className="zbm-wrap">
        <SectionTitle number="01" english="CURATED PICKS" title="精选推荐" description="从真实需求出发，发现值得关注的工具与信息。"/>
        <div className="zbm-cards zbm-three">{featuredAssets.map((item,index)=><a key={item.href} href={item.href} {...external} className="zbm-card zbm-feature">
          <div className="zbm-topline"><span>{item.subtitle}</span><span>0{index+1}</span></div><div className="zbm-feature-art"><FeatureArt index={index}/></div>
          <h3>{item.title}</h3><p>{item.reason}</p><div className="zbm-cardfoot">查看详情<ArrowRight size={17}/></div>
        </a>)}</div>
      </div></section>
      <section className="zbm-section" id="ai-direct" aria-label="指北猫AI直通"><div className="zbm-wrap">
        <SectionTitle number="02" english="AI EXPERIENCE" title="指北猫 AI 直通" description="三种在线 AI 工具，覆盖对话、内容创作与视觉创作。"/>
        <div className="zbm-cards zbm-three">{aiDirectEntries.map((item,index)=>{const Icon=appIcons[index]??MessagesSquare;return <a className="zbm-card zbm-app" key={item.href} href={item.href} {...external}><div className="zbm-topline"><span className="zbm-glyph"><Icon size={24}/></span><span>{appTypes[index]}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="zbm-cardfoot">立即体验<ArrowRight size={17}/></div></a>;})}</div>
      </div></section>
      <section className="zbm-section" id="api-access" aria-label="统一 API 接入"><div className="zbm-wrap">
        <SectionTitle number="03" english="DEVELOPER ACCESS" title="统一 API 接入" description="面向开发者与应用场景的模型服务。"/>
        <div className="zbm-api-panel">
          <div><div className="zbm-kicker">OPENAI COMPATIBLE</div><h3>一个 Key，<br/>连接主流 AI 模型。</h3><p>主流模型统一接入 · 优惠额度 · 多线路按需选择。对比不同线路的实际调用价格与使用体验。</p><div className="zbm-actions"><Link href="/api" className="zbm-button zbm-primary">了解 API 服务 <ArrowRight size={17}/></Link><Link href="/api/docs" className="zbm-button zbm-secondary">查看接入文档</Link></div></div>
          <div className="zbm-code"><div className="zbm-code-head"><i/><i/><i/><span>API / ENDPOINT</span></div><p>Base URL</p><code>https://api.zhibeimao.com/v1</code><CopyEndpoint/><div className="zbm-route-row"><span>Basic</span><span>Standard</span><span>默认线路</span></div></div>
        </div>
        <div className="zbm-services"><strong>使用与账户服务</strong><StoreAttributionLink placement="homepage_key">购买 API Key <ArrowUpRight size={15}/></StoreAttributionLink><a href={siteLinks.apiKeyBalance} {...external}>查询余额</a><a href={siteLinks.tutorial} {...external}>使用教程</a><Link href="/api/docs">API 文档</Link></div>
      </div></section>
      <section className="zbm-section" id="tools"><div className="zbm-wrap">
        <div className="zbm-heading-row"><SectionTitle number="04" english="DECISION TOOLS" title="决策工具" description="工作、生活与效率场景中的实用工具。"/><a href={siteLinks.tools} {...external} className="zbm-more">查看全部 <ArrowRight size={16}/></a></div>
        <div className="zbm-cards zbm-toolgrid">{toolAssets.map(item=>{const Icon=item.icon;return <a key={item.title} href={item.href} {...external} className="zbm-card zbm-tool"><div className="zbm-topline"><span className="zbm-glyph"><Icon size={23}/></span><span>{item.tag}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="zbm-cardfoot">{item.cta}<ArrowRight size={17}/></div></a>;})}</div>
      </div></section>
      <div className="zbm-section zbm-wrap zbm-live" id="insights"><div className="zbm-kicker">05 / LIVE INSIGHTS</div><RankingList/></div>
      <div className="zbm-section zbm-wrap zbm-live" id="today"><div className="zbm-kicker">06 / TODAY IN AI</div><NewsSection/></div>
    </div>
  </main>;
}
