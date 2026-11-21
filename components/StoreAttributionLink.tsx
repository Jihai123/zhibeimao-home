'use client';

import { useEffect, useState } from 'react';
import type { AnchorHTMLAttributes } from 'react';

import { siteLinks } from '@/data/site-links';

// This is a link-only first-touch marker, not completed-order attribution.
// Store checkout must persist and report these parameters against paid orders.
const KEY = 'zhibeimao_api_first_touch_v1';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
type Source = 'chatgpt5x' | 'zhibeimao';
type Touch = { source: Source; content: string; recordedAt: number };
const clean = (value: string | null) => (value || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 64);
const validSource = (value: string | null): value is Source => value === 'chatgpt5x' || value === 'zhibeimao';

function touchFromPage(): Touch {
  const params = new URLSearchParams(window.location.search);
  const value = params.get('utm_source');
  return {
    source: validSource(value) ? value : 'zhibeimao',
    content: clean(params.get('utm_content')) || 'direct',
    recordedAt: Date.now()
  };
}

function readTouch(): Touch {
  const incoming = new URLSearchParams(window.location.search);
  const incomingSource = incoming.get('utm_source');
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Touch;
      if (validSource(parsed.source) && Number.isFinite(parsed.recordedAt) &&
          Date.now() - parsed.recordedAt >= 0 && Date.now() - parsed.recordedAt <= TTL_MS) {
        // A user revisiting with explicit source tagging creates a new campaign touch.
        if (!validSource(incomingSource) || incomingSource === parsed.source) return parsed;
      }
    }
  } catch { /* Storage may be restricted. Navigation remains functional. */ }
  const next = touchFromPage();
  try { window.sessionStorage.setItem(KEY, JSON.stringify(next)); } catch { /* optional */ }
  return next;
}

function storeHref(placement: string): string {
  if (typeof window === 'undefined') return siteLinks.apiKey;
  const touch = readTouch();
  const url = new URL(siteLinks.apiKey);
  url.searchParams.set('utm_source', touch.source);
  url.searchParams.set('utm_medium', touch.source === 'chatgpt5x' ? 'referral' : 'owned_site');
  url.searchParams.set('utm_campaign', 'api_key_sales');
  url.searchParams.set('utm_content', touch.content);
  url.searchParams.set('zbm_placement', clean(placement));
  return url.toString();
}

export function AttributionCapture() {
  useEffect(() => { readTouch(); }, []);
  return null;
}

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { placement: string };
export function StoreAttributionLink({ placement, children, onClick, ...props }: Props) {
  const [href, setHref] = useState<string>(siteLinks.apiKey);
  useEffect(() => { setHref(storeHref(placement)); }, [placement]);
  return (
    <a {...props} href={href} target="_blank" rel="noopener noreferrer"
      onClick={(event) => {
        // Update synchronously so even an immediate click carries attribution.
        event.currentTarget.href = storeHref(placement);
        onClick?.(event);
      }}>
      {children}
    </a>
  );
}
