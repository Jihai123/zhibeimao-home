import Link from 'next/link';

const navItems = [
  { label: '首页', href: '/' },
  { label: 'API 接入', href: '/api' },
  { label: 'AI资讯', href: 'https://news.chatgpt5x.com/' },
  { label: 'AI排行榜', href: 'https://news.chatgpt5x.com/ai-rankings' },
  { label: 'AI论坛', href: 'https://forum.chatgpt5x.com/' },
  { label: 'AI工具', href: 'https://www.chatgpt5x.com/#/' }
] as const;

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 md:px-8">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-wide text-white transition-colors hover:text-cyan-200">
          指北猫
        </Link>
        <nav className="ml-auto flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap md:gap-2">
          {navItems.map((item) => {
            const isInternal = item.href.startsWith('/');

            return isInternal ? (
              <Link
                key={item.label}
                href={item.href}
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-all hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                {...externalLinkProps}
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-all hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
