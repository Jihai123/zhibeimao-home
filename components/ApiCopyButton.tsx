'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

type ApiCopyButtonProps = {
  value: string;
  label?: string;
};

export function ApiCopyButton({ value, label = '复制' }: ApiCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? '已复制到剪贴板' : label}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-100"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? '已复制' : label}
    </button>
  );
}
