export type FeaturedTopic = {
  title: string;
  summary: string;
  href: string;
  source: 'forum' | 'aijianghu' | string;
  thumbnail?: string;
  updatedAt: string;
  priority: number;
};

export const featuredTopics: FeaturedTopic[] = [
  {
    title: 'AI工具吐槽榜',
    summary: '看看大家最近都在吐槽哪些AI工具',
    href: 'https://forum.chatgpt5x.com/',
    source: 'forum',
    thumbnail: '/images/topics/forum/default-forum.jpg',
    updatedAt: '2026-04-05',
    priority: 10
  },
  {
    title: 'AI江湖：本周大事件',
    summary: '用故事方式快速了解AI圈最新动态',
    href: 'https://news.chatgpt5x.com/aijianghu',
    source: 'aijianghu',
    thumbnail: '/images/topics/aijianghu/default-aijianghu.jpg',
    updatedAt: '2026-04-05',
    priority: 8
  }
];
