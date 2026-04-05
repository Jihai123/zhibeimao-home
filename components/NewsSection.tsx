'use client';

import { useEffect, useState } from 'react';

import { siteLinks } from '@/data/site-links';

type LegacyNewsItem = {
  title: string;
  slug: string;
  date?: string;
  content?: string;
};

type DisplayNewsItem = {
  title: string;
  href: string;
  summary: string;
  time: string;
};

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

const NEWS_API = 'https://news.chatgpt5x.com/zh/api/news?page=1&pageSize=5';

const fallbackNews: DisplayNewsItem[] = [
  {
    title: '查看更多 AI 资讯',
    href: 'https://news.chatgpt5x.com/zh/',
    summary: '新闻接口加载失败时，仍可直接访问新闻站查看最新内容。',
    time: '刚刚'
  }
];

function toDisplayNews(items: LegacyNewsItem[]): DisplayNewsItem[] {
  return items.slice(0, 3).map((item) => ({
    title: item.title,
    href: `https://news.chatgpt5x.com/zh/news/${encodeURIComponent(item.slug)}`,
    summary: (item.content ?? '点击查看完整资讯内容。').slice(0, 90),
    time: item.date ?? ''
  }));
}

export function NewsSection() {
  const [news, setNews] = useState<DisplayNewsItem[]>(fallbackNews);

  useEffect(() => {
    let isActive = true;

    const loadNews = async () => {
      try {
        const response = await fetch(NEWS_API, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = (await response.json()) as LegacyNewsItem[];
        if (!Array.isArray(data)) {
          throw new Error('invalid response');
        }

        const validItems = data.filter((item) => typeof item?.title === 'string' && typeof item?.slug === 'string');
        if (!validItems.length) {
          throw new Error('empty response');
        }

        if (isActive) {
          setNews(toDisplayNews(validItems));
        }
      } catch {
        if (isActive) {
          setNews(fallbackNews);
        }
      }
    };

    loadNews();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="mt-16 pb-16" aria-label="今日 AI 资讯">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">今日 AI 资讯</h2>
          <p className="mt-2 text-sm text-slate-300">复用旧站新闻接口：news.chatgpt5x.com/zh/api/news，展示最新 3 条。</p>
        </div>
        <a
          href={siteLinks.news}
          {...externalLinkProps}
          className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
        >
          查看结果 →
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {news.map((item) => (
          <a
            key={item.href}
            href={item.href}
            {...externalLinkProps}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-xl hover:shadow-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <article>
              <p className="text-xs text-slate-400">{item.time}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.summary}</p>
              <span className="mt-5 inline-flex text-sm font-medium text-cyan-300">跳转阅读 →</span>
            </article>
          </a>
        ))}
      </div>
    </section>
  );
}
