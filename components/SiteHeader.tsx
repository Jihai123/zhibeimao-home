import Link from 'next/link';
import { HomeThemeToggle } from '@/components/HomeMotion';
import { ArrowUpRight, Menu } from 'lucide-react';

const navItems = [
  { label: '首页', href: '/' },
  { label: 'API 服务', href: '/api' },
  { label: 'AI资讯', href: 'https://news.chatgpt5x.com/' },
  { label: 'AI排行榜', href: 'https://news.chatgpt5x.com/ai-rankings' },
  { label: 'AI论坛', href: 'https://forum.chatgpt5x.com/' },
  { label: 'AI工具', href: 'https://www.chatgpt5x.com/#/' }
] as const;

function NavLink({ label, href, mobile = false }: { label: string; href: string; mobile?: boolean }) {
  const classes = mobile
    ? 'flex min-h-11 items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium text-slate-100 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300'
    : 'shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300';

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={classes}>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      <span>{label}</span>
      {mobile && <ArrowUpRight className="h-4 w-4 text-slate-400" aria-hidden="true" />}
    </a>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090e1c]/95 backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:px-8">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-wide text-white transition-colors hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">
          指北猫
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-1 md:flex lg:gap-2">
          {navItems.map((item) => <NavLink key={item.href} {...item} />)}
        </nav>

        <HomeThemeToggle />
        <details className="group relative ml-auto md:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 text-sm font-medium text-slate-100 marker:hidden [&::-webkit-details-marker]:hidden">
            <Menu className="h-4 w-4" aria-hidden="true" />
            菜单
          </summary>
          <nav aria-label="移动端导航" className="absolute right-0 top-full z-50 mt-3 w-[min(82vw,310px)] rounded-2xl border border-white/15 bg-[#0f172a] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            {navItems.map((item) => <NavLink key={item.href} {...item} mobile />)}
          </nav>
        </details>
      </div>
    </header>
  );
}
