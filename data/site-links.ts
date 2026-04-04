export const siteLinks = {
  discover: '/discover',
  tools: '/tools',
  rankings: '/rankings',
  topics: '/topics',
  news: '/news',
  nav: '/nav',
  forum: '/forum',
  hongKongIPO: '/tools/hong-kong-ipo',
  pensionCalculator: '/tools/pension-calculator',
  livableCity: '/tools/livable-city',
  workValue: '/tools/work-value',
  xingmingtong: '/tools/xingmingtong',
  aiLeaderboard: '/rankings/ai-tools'
} as const;

export type SiteLinkKey = keyof typeof siteLinks;
