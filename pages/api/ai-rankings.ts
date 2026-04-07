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

    let parsedBody: unknown = {};

    try {
      parsedBody = JSON.parse(body);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown parse error';
      return res.status(502).json({ error: `Invalid JSON from upstream: ${message}` });
    }

    let payload = parsedBody;

    if (payload && typeof payload === 'object' && 'value' in (payload as Record<string, unknown>)) {
      payload = (payload as { value?: unknown }).value;
    }

    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown parse error';
        return res.status(502).json({ error: `Invalid JSON string payload from upstream: ${message}` });
      }
    }

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return res.status(502).json({ error: 'Unexpected ai-rankings payload shape' });
    }

    return res.status(200).json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
