export type FeaturedTopic = {
  title: string;
  summary: string;
  href: string;
  source: 'forum' | 'aijianghu';
  badge: '论坛热议' | 'AI江湖';
  thumbnail: string;
  priority: number;
};

export const featuredTopics: FeaturedTopic[] = [
  {
    title: 'Claude 讨论帖：日常使用与能力反馈',
    summary: '围绕复杂任务与多轮问答，社区用户汇总了真实使用体验和稳定性反馈。',
    href: 'https://forum.chatgpt5x.com/d/261-236-claudetao-lun-tie',
    source: 'forum',
    badge: '论坛热议',
    thumbnail: '/images/topics/forum/default-forum.jpg',
    priority: 100
  },
  {
    title: 'Perplexity 讨论帖：搜索问答效果实测',
    summary: '从检索准确度、引用质量到响应速度，集中对比近期真实实测结论。',
    href: 'https://forum.chatgpt5x.com/d/290-267-perplexity-aitao-lun-tie',
    source: 'forum',
    badge: '论坛热议',
    thumbnail: '/images/topics/forum/perplexity.jpg',
    priority: 90
  },
  {
    title: '盗脸术覆灭记',
    summary: '短剧“AI 换脸”争议发酵，平台下架并追责，行业合规红线进一步收紧。',
    href: 'https://news.chatgpt5x.com/aijianghu/ai短剧偷脸翻车-红果平台下架-桃花簪-重罚出品方',
    source: 'aijianghu',
    badge: 'AI江湖',
    thumbnail: '/images/topics/aijianghu/jianghu-1.jpg',
    priority: 80
  },
  {
    title: 'AI京华令：十五剑破关',
    summary: '北京新增 15 款备案 AI 服务，应用场景持续扩容，竞争节奏显著加快。',
    href: 'https://news.chatgpt5x.com/aijianghu/北京ai服务大爆发-15款新应用通过备案即日起可用',
    source: 'aijianghu',
    badge: 'AI江湖',
    thumbnail: '/images/topics/aijianghu/default-aijianghu.jpg',
    priority: 70
  }
];
