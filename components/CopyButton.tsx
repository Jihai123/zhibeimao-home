'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

type Props = {
  text: string;
  label?: string;
  compact?: boolean;
};

/** Accessible, dependency-free copy control. Falls back to a manual hint when the
 *  Clipboard API is unavailable (http origins, older browsers, denied permission). */
export function CopyButton({ text, label = '复制', compact = false }: Props) {
  const [state, setState] = useState<'idle' | 'done' | 'fallback'>('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('done');
    } catch {
      setState('fallback');
    }
    window.setTimeout(() => setState('idle'), 2200);
  };

  const caption = state === 'done' ? '已复制' : state === 'fallback' ? '请手动选中' : label;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label + '：' + (text.length > 60 ? text.slice(0, 60) + '…' : text)}
      aria-live="polite"
      className={
        'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] font-medium text-slate-300 transition hover:border-cyan-300/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 ' +
        (compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs')
      }
    >
      {state === 'done' ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{caption}</span>
    </button>
  );
}
