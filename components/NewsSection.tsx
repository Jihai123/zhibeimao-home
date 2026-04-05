'use client';

import { useEffect, useState } from 'react';

import { siteLinks } from '@/data/site-links';

type NewsApiItem = {
  title?: string;
  slug?: string;
  date?: string;
  content?: string;
  cover?: string;
};

type NewsApiResponse = NewsApiItem[] | { data?: NewsApiItem[]; items?: NewsApiItem[] };

type DisplayNewsItem = {
  title: string;
  href: string;
  summary: string;
  time: string;
  cover: string | null;
};

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

const NEWS_API = '/api/news';
const NEWS_HOME = 'https://news.chatgpt5x.com/zh/news';

const fallbackNews: DisplayNewsItem[] = [
  {
    title: '查看更多 AI 资讯',
    href: NEWS_HOME,
    summary: '新闻接口加载失败时，仍可直接访问新闻站查看最新内容。',
    time: '刚刚',
    cover: null
  }
];

function normalizeCover(cover?: string): string | null {
  if (!cover || typeof cover !== 'string') {
    return null;
  }

  return cover.startsWith('http://') ? cover.replace('http://', 'https://') : cover;
}

function truncateSummary(content?: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  const cleanContent = content.replace(/\s+/g, ' ').trim();
  if (cleanContent.length <= 78) {
    return cleanContent;
  }

  return `${cleanContent.slice(0, 76)}...`;
}

function getNewsList(data: NewsApiResponse): NewsApiItem[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  return [];
}

function toDisplayNews(items: NewsApiItem[]): DisplayNewsItem[] {
  return items.slice(0, 3).map((item) => {
    const hasSlug = typeof item.slug === 'string' && item.slug.trim().length > 0;

    return {
      title: item.title?.trim() || '未命名资讯',
      href: hasSlug ? `${NEWS_HOME}/${encodeURIComponent(item.slug!.trim())}` : NEWS_HOME,
      summary: truncateSummary(item.content),
      time: item.date?.trim() || '时间待更新',
      cover: normalizeCover(item.cover)
    };
  });
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

        const data = (await response.json()) as NewsApiResponse;
        const list = getNewsList(data);

        const validItems = list.filter((item) => typeof item?.title === 'string' && item.title.trim().length > 0);
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
          <p className="mt-2 text-sm text-slate-300">实时读取新闻接口前 3 条，支持缩略图、摘要与详情跳转。</p>
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
            key={`${item.href}-${item.title}`}
            href={item.href}
            {...externalLinkProps}
            className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-xl hover:shadow-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <article className="flex h-full flex-col">
              {item.cover ? (
                <div
                  role="img"
                  aria-label={item.title}
                  className="h-40 w-full rounded-xl border border-white/10 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.cover})` }}
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-slate-900/60 text-xs text-slate-400">
                  暂无封面图
                </div>
              )}
              <p className="mt-3 text-xs text-slate-400">{item.time}</p>
              <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-white">{item.title}</h3>
              {item.summary ? <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-300">{item.summary}</p> : null}
              <span className="mt-auto pt-4 text-sm font-medium text-cyan-300">阅读更多 →</span>
            </article>
          </a>
        ))}
      </div>
    </section>
  );
}
