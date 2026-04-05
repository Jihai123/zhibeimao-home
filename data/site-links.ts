export const siteLinks = {
  discover: 'https://www.chatgpt5x.com/#/',
  tools: 'https://www.chatgpt5x.com/#/',
  rankings: 'https://news.chatgpt5x.com/ai-rankings',
  topics: 'https://forum.chatgpt5x.com/',
  news: 'https://news.chatgpt5x.com/',
  nav: 'https://www.chatgpt5x.com/#/',
  forum: 'https://forum.chatgpt5x.com/',
  hongKongIPO: 'https://zhibeimao.com/hk/',
  pensionCalculator: 'https://yanglao.zhibeimao.com/',
  livableCity: 'https://zhibeimao.com/yiju/',
  workValue: 'https://jobtest.chatgpt5x.com/',
  xingmingtong: 'https://astrologer.chatgpt5x.com/',
  aiLeaderboard: 'https://news.chatgpt5x.com/ai-rankings'
} as const;

export type SiteLinkKey = keyof typeof siteLinks;
