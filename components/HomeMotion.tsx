'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';

type Theme = 'dark' | 'light';
const KEY = 'zbm-home-theme-v1';

export function HomeThemeToggle() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>('dark');
  useEffect(() => {
    if (pathname !== '/') {
      delete document.documentElement.dataset.zbmTheme;
      return;
    }
    let value: Theme = 'dark';
    try { if (localStorage.getItem(KEY) === 'light') value = 'light'; } catch {}
    document.documentElement.dataset.zbmTheme = value;
    setTheme(value);
    return () => { delete document.documentElement.dataset.zbmTheme; };
  }, [pathname]);
  if (pathname !== '/') return null;
  function select(value: Theme) {
    setTheme(value);
    document.documentElement.dataset.zbmTheme = value;
    try { localStorage.setItem(KEY, value); } catch {}
  }
  return <div className="zbm-theme-switch" role="group" aria-label="首页主题">
    <button type="button" aria-label="深空主题" aria-pressed={theme === 'dark'} onClick={() => select('dark')}><Moon size={15} aria-hidden="true"/><span>深空</span></button>
    <button type="button" aria-label="明亮主题" aria-pressed={theme === 'light'} onClick={() => select('light')}><Sun size={15} aria-hidden="true"/><span>明亮</span></button>
  </div>;
}

export function CopyEndpoint() {
  const [status, setStatus] = useState('复制地址');
  return <button type="button" className="zbm-copy" aria-live="polite" onClick={async () => {
    try { await navigator.clipboard.writeText('https://api.zhibeimao.com/v1'); setStatus('已复制'); }
    catch { setStatus('请手动选中复制'); }
  }}>{status}</button>;
}

export function HomeMotion({ onlineCount, toolCount }: { onlineCount: number; toolCount: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onlineRef = useRef<HTMLElement>(null);
  const toolsRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const root = canvas?.closest<HTMLElement>('.zbm-home');
    const hero = canvas?.closest<HTMLElement>('.zbm-art');
    if (!canvas || !root || !hero) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0, scrollFrame = 0, w = 0, h = 0, visible = true, last = 0, start = 0, progress = 0;
    let tone = document.documentElement.dataset.zbmTheme === 'light' ? 0 : 1;
    let mouse: {x:number;y:number} | null = null;
    let points: {x:number;y:number;vx:number;vy:number}[] = [];
    function resize() {
      if (!canvas || !hero || !ctx) return;
      w = hero.clientWidth; h = hero.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      points = Array.from({length: w < 500 ? 23 : 46}, () => ({
        x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35
      }));
    }
    function tick(now: number) {
      frame = 0;
      if (reduced.matches || document.hidden || !visible || !ctx) return;
      if (!start) start = now;
      const dt = Math.min(2, (now-(last||now))/16.67); last = now;
      tone += ((document.documentElement.dataset.zbmTheme === 'light' ? 0 : 1)-tone)*.045;
      ctx.clearRect(0,0,w,h);
      const hue = 218 + progress*50 - tone*29;
      for (const p of points) {
        p.x += p.vx*dt; p.y += p.vy*dt;
        if (mouse) {
          const dx=p.x-mouse.x, dy=p.y-mouse.y, d=Math.hypot(dx,dy);
          if (d>0 && d<90) {p.x+=dx/d*(1-d/90)*dt; p.y+=dy/d*(1-d/90)*dt;}
        }
        if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0;
      }
      for(let i=0;i<points.length;i++){
        const p=points[i];
        ctx.fillStyle='hsla('+hue+',80%,'+(46+tone*28)+'%,'+(.38+tone*.35)+')';
        ctx.beginPath();ctx.arc(p.x,p.y,1.6,0,Math.PI*2);ctx.fill();
        for(let j=i+1;j<points.length;j++){
          const q=points[j],d=Math.hypot(p.x-q.x,p.y-q.y);
          if(d<96){ctx.strokeStyle='hsla('+hue+',72%,'+(48+tone*22)+'%,'+((1-d/96)*(.19+tone*.16))+')';
            ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
        }
      }
      const countProgress = Math.min(1,(now-start)/900);
      if (onlineRef.current) onlineRef.current.textContent=String(Math.round(onlineCount*countProgress));
      if (toolsRef.current) toolsRef.current.textContent=String(Math.round(toolCount*countProgress));
      frame=requestAnimationFrame(tick);
    }
    function sync() {
      if (frame) cancelAnimationFrame(frame);
      frame=0;last=0;
      if(reduced.matches || document.hidden || !visible){
        if (onlineRef.current) onlineRef.current.textContent=String(onlineCount);
        if (toolsRef.current) toolsRef.current.textContent=String(toolCount);
        if (reduced.matches) ctx?.clearRect(0,0,w,h);
      } else if(ctx) frame=requestAnimationFrame(tick);
    }
    function scroll() {
      if(scrollFrame)return;
      scrollFrame=requestAnimationFrame(()=>{
        scrollFrame=0;
        progress=Math.max(0,Math.min(1,window.scrollY/Math.max(1,document.documentElement.scrollHeight-window.innerHeight)));
        root?.style.setProperty('--zbm-progress', (progress*100)+'%');
      });
    }
    const move=(e:PointerEvent)=>{const r=hero.getBoundingClientRect();mouse={x:e.clientX-r.left,y:e.clientY-r.top};};
    const leave=()=>{mouse=null;};
    const cards=Array.from(root.querySelectorAll<HTMLElement>('.zbm-card'));
    function tilt(e:PointerEvent) {
      if (!pointer.matches || reduced.matches) return;
      const card=e.currentTarget as HTMLElement,r=card.getBoundingClientRect();
      const x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
      card.style.setProperty('--rx',((.5-y)*8)+'deg');card.style.setProperty('--ry',((x-.5)*8)+'deg');
      card.style.setProperty('--mx',(x*100)+'%');card.style.setProperty('--my',(y*100)+'%');card.style.setProperty('--gl','1');
    }
    function reset(e:PointerEvent){const card=e.currentTarget as HTMLElement;card.style.removeProperty('--rx');card.style.removeProperty('--ry');card.style.removeProperty('--gl');}
    cards.forEach(c=>{c.addEventListener('pointermove',tilt);c.addEventListener('pointerleave',reset);});
    const ro=typeof ResizeObserver!=='undefined' ? new ResizeObserver(resize):null;
    ro?.observe(hero);resize();
    const io=typeof IntersectionObserver!=='undefined' ? new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();}):null;
    io?.observe(hero);
    const reveal=typeof IntersectionObserver!=='undefined' ? new IntersectionObserver(entries=>{
      for(const entry of entries) if(entry.isIntersecting){entry.target.classList.add('zbm-enter');reveal?.unobserve(entry.target);}
    },{threshold:.12}):null;
    root.querySelectorAll('.zbm-section').forEach(el=>reveal?.observe(el));
    hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',leave);
    window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',resize);
    document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
    scroll();sync();
    return ()=>{cancelAnimationFrame(frame);cancelAnimationFrame(scrollFrame);ro?.disconnect();io?.disconnect();reveal?.disconnect();
      hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);
      window.removeEventListener('scroll',scroll);window.removeEventListener('resize',resize);
      document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);
      cards.forEach(c=>{c.removeEventListener('pointermove',tilt);c.removeEventListener('pointerleave',reset);});
    };
  },[onlineCount,toolCount]);
  return <><canvas ref={canvasRef} aria-hidden="true"/><div className="zbm-ringstats">
    <div className="zbm-ringstat"><svg viewBox="0 0 60 60" aria-hidden="true"><circle className="track" cx="30" cy="30" r="22"/><circle className="meter" cx="30" cy="30" r="22"/></svg><b ref={onlineRef} aria-label={String(onlineCount)}>{onlineCount}</b>在线 AI 工具</div>
    <div className="zbm-ringstat"><svg viewBox="0 0 60 60" aria-hidden="true"><circle className="track" cx="30" cy="30" r="22"/><circle className="meter" cx="30" cy="30" r="22"/></svg><b ref={toolsRef} aria-label={String(toolCount)}>{toolCount}</b>决策工具</div>
  </div></>;
}
