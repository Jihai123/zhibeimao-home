export type FeaturedTopic = {
  title: string;
  summary: string;
  href: string;
  source: 'forum' | 'aijianghu';
  badge: '论坛热议' | 'AI江湖';
  thumbnail?: string;
  priority: number;
};

export const featuredTopics: FeaturedTopic[] = [
  {
    title: '如何快速搭建一个微信自动回复的GPT机器人',
    summary: '手动搭建基于大模型的智能对话机器人，支持微信公众号、企业微信应用、飞书、钉钉接入。',
    href: 'https://forum.chatgpt5x.com/d/62-ru-he-kuai-su-da-jian-yi-ge-wei-xin-zi-dong-hui-fu-de-gptji-qi-ren',
    source: 'forum',
    badge: '论坛热议',
    thumbnail: '/images/topics/forum/default-forum.jpg',
    priority: 100
  },
  {
    title: '字节跳动AI“最强大脑”一年走了70人，去向惊人',
    summary: '据了解，这个团队里差不多有70位技术大牛，就像是AI界的“种子选手”，在过去一年里纷纷选择离开。',
    href: 'https://forum.chatgpt5x.com/d/3504-zi-jie-tiao-dong-aizui-qiang-da-nao-yi-nian-zou-liao-70ren-qu-xiang-liang-ren',
    source: 'forum',
    badge: '论坛热议',
    thumbnail: '/images/topics/forum/perplexity.jpg',
    priority: 95
  },
  {
    title: '盗脸术覆灭记',
    summary: '短剧“AI 换脸”争议发酵，平台下架并追责，行业合规红线进一步收紧。',
    href: 'https://news.chatgpt5x.com/aijianghu/ai短剧偷脸翻车-红果平台下架-桃花簪-重罚出品方',
    source: 'aijianghu',
    badge: 'AI江湖',
    thumbnail: '/images/topics/aijianghu/jianghu-1.jpg',
    priority: 90
  },
  {
    title: 'AI京华令：十五剑破关',
    summary: '北京新增 15 款备案 AI 服务，应用场景持续扩容，竞争节奏显著加快。',
    href: 'https://news.chatgpt5x.com/aijianghu/北京ai服务大爆发-15款新应用通过备案即日起可用',
    source: 'aijianghu',
    badge: 'AI江湖',
    priority: 88
  },
  {
    title: 'Cursor 讨论帖：开发提效体验汇总',
    summary: '开发者分享真实编码场景中的补全质量、重构效率以及团队落地建议。',
    href: 'https://forum.chatgpt5x.com/d/401-378-cursortao-lun-tie',
    source: 'forum',
    badge: '论坛热议',
    priority: 80
  },
  {
    title: 'Cursor 多智能体协作与开发工作流',
    summary: '了解 Cursor 多智能体协作在开发流程中的应用。',
    href: 'https://forum.chatgpt5x.com/d/1860-ai-bian-cheng-jin-ru-xu-ni-tuan-dui-shi-dai-cursor-20yi-duo-zhi-neng-ti-zhong-su-kai-fa-zhe-gong-zuo-liu'.replace('ai-bian-cheng','aibian-cheng'),
    source: 'forum',
    badge: '论坛热议',
    priority: 79
  },
  {
    title: 'Cursor 智能体与 SQLite 重写实践',
    summary: '从社区案例了解 AI 编程智能体如何参与大型代码任务。',
    href: 'https://forum.chatgpt5x.com/d/4541-zhi-gei-wen-dang-bu-gei-yuan-ma-cursor-aizhi-neng-ti-ji-qun-yong-rustzhong-xie-sqlitece-shi-quan-tong-guan',
    source: 'forum',
    badge: '论坛热议',
    priority: 78
  },
  {
    title: 'Claude Code 的编程任务协作',
    summary: '了解 Claude Code 的任务规划与开发辅助思路。',
    href: 'https://forum.chatgpt5x.com/d/2653-aixie-dai-ma-xian-zai-lian-si-kao-du-sheng-liao-claude-codexin-zhao-rang-ni-gao-bie-ban-dui-ban-cuo-de-jiu-jie',
    source: 'forum',
    badge: '论坛热议',
    priority: 77
  },
  {
    title: 'Claude 与 Slack 团队协作',
    summary: '探索 AI 助手在团队沟通与工作流中的应用。',
    href: 'https://forum.chatgpt5x.com/d/1576-ai-zhu-shou-claude-deng-ru-slacktuan-dui-xie-zuo-xin-fan-shi-gong-zuo-liu-wu-feng-xian-jie',
    source: 'forum',
    badge: '论坛热议',
    priority: 76
  }
];
