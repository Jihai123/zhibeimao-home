import Link from 'next/link';

import { siteLinks } from '@/data/site-links';

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 md:px-8">
        <p className="text-xs text-secondary/90">© 2022 - 2026 指北猫 · 智享AI工具导航</p>
        <div className="flex items-center gap-4 text-xs text-secondary">
          <Link href={siteLinks.about} className="transition-colors hover:text-cyan-200">
            关于我们
          </Link>
          <Link href={siteLinks.contact} className="transition-colors hover:text-cyan-200">
            联系我们
          </Link>
          <a href={siteLinks.forum} {...externalLinkProps} className="transition-colors hover:text-cyan-200">
            AI论坛
          </a>
        </div>
      </div>
    </footer>
  );
}
