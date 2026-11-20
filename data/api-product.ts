// Content reflects public upstream model families and the existing Key store as of 2026-11-19.
// Product/stock data must be rechecked in the store before publishing promotional prices.
export const apiBaseUrl = 'https://api.zhibeimao.com/v1';
export const alternativeApiBaseUrl = 'https://api.chatgpt5x.com/v1';
export const priceCheckedOn = '2026-11-20';

// Dated reference FX rate (not a guaranteed exchange or settlement rate).
// Used ONLY to compare the RMB purchase price with the USD credit face value.
export const usdCnyReference = { rate: 6.67, asOf: '2026-11-20' } as const;

export const modelFamilies = [
  { name: 'GPT', provider: 'OpenAI', initials: 'G', description: '对话 · 推理 · 开发' },
  { name: 'Claude', provider: 'Anthropic', initials: 'C', description: '写作 · 编程 · 分析' },
  { name: 'Gemini', provider: 'Google', initials: 'Ge', description: '多模态 · 推理' },
  { name: 'Grok', provider: 'xAI', initials: 'Gr', description: '对话 · 多模态' },
  { name: 'DeepSeek', provider: 'DeepSeek', initials: 'D', description: '推理 · 编程' },
  { name: 'Qwen', provider: '通义千问', initials: 'Q', description: '通用 · 多模态' },
  { name: 'Kimi', provider: '月之暗面', initials: 'K', description: '长文本 · 分析' },
  { name: 'GLM', provider: '智谱', initials: 'Z', description: '通用 · 编程' }
] as const;

export const keyOffers = [
  { amount: '3', price: '10', label: '轻量体验' },
  { amount: '10', price: '30', label: '灵活使用' },
  { amount: '20', price: '55', label: '更多额度' }
] as const;
