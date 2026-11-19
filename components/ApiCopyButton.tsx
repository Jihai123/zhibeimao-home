'use client';

import { useState } from 'react';
import { AlertCircle, Check, Copy } from 'lucide-react';

type ApiCopyButtonProps = {
  value: string;
  label?: string;
};

function legacyCopy(value: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';

  document.body.appendChild(textarea);
  try {
    textarea.select();
    return document.execCommand('copy');
  } finally {
    textarea.remove();
  }
}

export function ApiCopyButton({ value, label = '复制' }: ApiCopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function handleCopy() {
    let success = false;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        success = true;
      }
    } catch {
      // Clipboard API can be blocked by permissions or browser context.
    }

    if (!success) {
      try {
        success = legacyCopy(value);
      } catch {
        success = false;
      }
    }

    setStatus(success ? 'copied' : 'failed');
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={status === 'copied' ? '已复制到剪贴板' : status === 'failed' ? '复制失败，请手动选择文字' : label}
      aria-live="polite"
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-100"
    >
      {status === 'copied' ? <Check className="h-3.5 w-3.5" /> : status === 'failed' ? <AlertCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {status === 'copied' ? '已复制' : status === 'failed' ? '复制失败，请手动复制' : label}
    </button>
  );
}
