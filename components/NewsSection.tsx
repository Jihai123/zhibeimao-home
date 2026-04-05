import { aiNews } from '@/data/home-data';
import { siteLinks } from '@/data/site-links';

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

export function NewsSection() {
  return (
    <section className="mt-16 pb-16" aria-label="今日 AI 资讯">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">今日 AI 资讯</h2>
          <p className="mt-2 text-sm text-slate-300">基于 mock 数据渲染，结构已预留可直接替换 API 数据源。</p>
        </div>
        <a href={siteLinks.news} {...externalLinkProps} className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200">
          查看结果 →
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {aiNews.map((news) => (
          <a
            key={news.title}
            href={news.href}
            {...externalLinkProps}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-xl hover:shadow-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <article>
              <p className="text-xs text-slate-400">{news.time}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{news.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{news.summary}</p>
              <span className="mt-5 inline-flex text-sm font-medium text-cyan-300">跳转阅读 →</span>
            </article>
          </a>
        ))}
      </div>
    </section>
  );
}
