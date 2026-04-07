import type { NextApiRequest, NextApiResponse } from 'next';

const AI_RANKINGS_API = 'https://news.chatgpt5x.com/zh/api/ai-rankings?type=all';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const response = await fetch(AI_RANKINGS_API, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    const body = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: `Request failed with status ${response.status}` });
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).send(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
