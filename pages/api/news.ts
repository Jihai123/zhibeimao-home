import type { NextApiRequest, NextApiResponse } from 'next';

type NewsApiItem = {
  title?: string;
  slug?: string;
  date?: string;
  content?: string;
  cover?: string;
};

type NewsApiResponse = NewsApiItem[] | { data?: NewsApiItem[]; items?: NewsApiItem[] };

const NEWS_API = 'https://news.chatgpt5x.com/zh/api/news';

function normalizeCover(cover?: string): string | undefined {
  if (!cover || typeof cover !== 'string') {
    return undefined;
  }

  return cover.startsWith('http://') ? cover.replace('http://', 'https://') : cover;
}

function mapNewsItem(item: NewsApiItem): NewsApiItem {
  return {
    ...item,
    cover: normalizeCover(item.cover)
  };
}

function mapNewsData(data: NewsApiResponse): NewsApiResponse {
  if (Array.isArray(data)) {
    return data.map(mapNewsItem);
  }

  if (Array.isArray(data.data)) {
    return {
      ...data,
      data: data.data.map(mapNewsItem)
    };
  }

  if (Array.isArray(data.items)) {
    return {
      ...data,
      items: data.items.map(mapNewsItem)
    };
  }

  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const response = await fetch(NEWS_API, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream request failed: ${response.status}` });
    }

    const data = (await response.json()) as NewsApiResponse;
    const mappedData = mapNewsData(data);

    return res.status(200).json(mappedData);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
}
