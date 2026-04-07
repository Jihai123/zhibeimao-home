import { BadgeDollarSign, Bot, Compass, PiggyBank, Sparkles, Star } from 'lucide-react';

import { siteLinks } from '@/data/site-links';

export const quickEntries = [
  { label: 'AI 工具导航', href: siteLinks.nav },
  { label: '实时 AI 榜单', href: siteLinks.aiLeaderboard },
  { label: '宜居城市', href: siteLinks.livableCity },
  { label: '论坛讨论', href: siteLinks.forum }
];

export const featuredAssets = [
  {
    title: '今日新股：建议参与',
    subtitle: '结论推荐',
    reason: '认购热度与基石质量同步走强，当前窗口更适合参与决策。',
    badge: '🔥',
    useCount: '已有 2.3w 人使用',
    cta: '立即判断',
    href: siteLinks.hongKongIPO,
    icon: BadgeDollarSign,
    highlighted: true
  },
  {
    title: '养老金：可考虑立即测算',
    subtitle: '规划建议',
    reason: '尽早算清退休缺口，可提前调整储蓄与投资节奏，降低后续压力。',
    badge: 'NEW',
    useCount: '已有 1.8w 人使用',
    cta: '开始测算',
    href: siteLinks.pensionCalculator,
    icon: PiggyBank
  },
  {
    title: 'AI工具：建议入场看上升榜',
    subtitle: '趋势观察',
    reason: '本周新增工具明显增多，优先跟进上升项更容易拿到确定性收益。',
    badge: 'NEW',
    useCount: '已有 2.1w 人使用',
    cta: '去体验',
    href: siteLinks.aiLeaderboard,
    icon: Bot
  }
];

export const toolAssets = [
  {
    title: '新股值不值得参与？',
    description: '输入股票代码，快速判断是否值得申购',
    tag: '🔥爆款',
    cta: '立即判断',
    href: siteLinks.hongKongIPO,
    icon: BadgeDollarSign,
    highlighted: true
  },
  {
    title: '养老金计算器',
    description: '估算退休时间、养老金区间与资金缺口，提前规划未来现金流。',
    tag: '退休规划',
    cta: '开始测算',
    href: siteLinks.pensionCalculator,
    icon: PiggyBank
  },
  {
    title: '中国宜居城市排行',
    description: '按就业、生活成本、医疗与教育等维度，快速筛选更适合长期发展的城市。',
    tag: '城市决策',
    cta: '去体验',
    href: siteLinks.livableCity,
    icon: Compass
  },
  {
    title: '这B班值不值',
    description: '从通勤、薪酬、成长与压力四维度评估当前工作质量。',
    tag: '职业决策',
    cta: '立即判断',
    href: siteLinks.workValue,
    icon: Sparkles
  },
  {
    title: '星命通',
    description: '多维命理信息查询与运势建议，做长期规划辅助参考。',
    tag: '生活决策',
    cta: '去体验',
    href: siteLinks.xingmingtong,
    icon: Star
  },
  {
    title: 'AI 工具导航',
    description: '按场景筛选写作、设计、开发与运营工具，快速直达。',
    tag: '效率工具',
    cta: '去体验',
    href: siteLinks.nav,
    icon: Bot
  }
];

export const rankingGroups = [
  {
    title: '今日热门 AI 工具',
    items: [
      {
        name: 'Claude',
        description: '长文本和复杂推理能力稳定，适合知识整理与写作场景。',
        status: '↑ 上升',
        cta: '去体验',
        href: 'https://claude.ai/'
      },
      {
        name: 'Cursor',
        description: '编辑器内协作式编程体验成熟，开发提效明显。',
        status: 'NEW',
        cta: '去体验',
        href: 'https://cursor.com/'
      },
      {
        name: 'Midjourney',
        description: '在创意图像生成场景中持续保持高质量输出。',
        status: '↑ 上升',
        cta: '去体验',
        href: 'https://www.midjourney.com/'
      }
    ]
  },
  {
    title: '周增长最快',
    items: [
      {
        name: 'Perplexity',
        description: '检索增强问答体验持续优化，知识获取效率高。',
        status: '↑ 上升',
        cta: '去体验',
        href: 'https://www.perplexity.ai/'
      },
      {
        name: 'HeyGen',
        description: 'AI 视频与数字人创作能力较强，适合营销场景。',
        status: 'NEW',
        cta: '去体验',
        href: 'https://www.heygen.com/'
      },
      {
        name: 'Runway',
        description: '视频生成和剪辑工作流较完整，适合内容团队。',
        status: '↑ 上升',
        cta: '去体验',
        href: 'https://runwayml.com/'
      }
    ]
  }
];

export type TopicPick = {
  title: string;
  href: string;
  source: '论坛热议' | 'AI江湖';
  summary: string;
  cover?: string;
};

const topicPool: TopicPick[] = [
  {
    title: 'Claude 讨论帖：日常使用与能力反馈',
    href: 'https://forum.chatgpt5x.com/d/261-236-claudetao-lun-tie',
    source: '论坛热议',
    summary: '社区用户集中讨论 Claude 在复杂任务、多轮问答和写作场景中的真实稳定性。'
  },
  {
    title: 'Perplexity 讨论帖：搜索问答效果实测',
    href: 'https://forum.chatgpt5x.com/d/290-267-perplexity-aitao-lun-tie',
    source: '论坛热议',
    summary: '围绕检索准确度、引用质量和回答速度，整理多位用户近期体验与对比结论。'
  },
  {
    title: 'Midjourney 讨论帖：出图质量和风格控制',
    href: 'https://forum.chatgpt5x.com/d/297-274-midjourneytao-lun-tie',
    source: '论坛热议',
    summary: '从提示词结构、风格一致性和商业可用性角度总结图像生成实践心得。'
  },
  {
    title: 'Cursor 讨论帖：开发提效体验汇总',
    href: 'https://forum.chatgpt5x.com/d/401-378-cursortao-lun-tie',
    source: '论坛热议',
    summary: '开发者分享真实编码场景中的补全质量、重构效率以及团队落地建议。'
  },
  {
    title: '盗脸术覆灭记',
    href: 'https://news.chatgpt5x.com/aijianghu/ai短剧偷脸翻车-红果平台下架-桃花簪-重罚出品方',
    source: 'AI江湖',
    summary: '短剧“AI 换脸”争议发酵，平台下架并追责，折射内容合规与版权红线。'
  },
  {
    title: 'AI京华令：十五剑破关',
    href: 'https://news.chatgpt5x.com/aijianghu/北京ai服务大爆发-15款新应用通过备案即日起可用',
    source: 'AI江湖',
    summary: '北京新增 15 款备案 AI 服务，应用场景继续扩大，行业竞争进入快节奏阶段。'
  },
  {
    title: '暗资盟',
    href: 'https://news.chatgpt5x.com/aijianghu/openai偷偷砸钱搞儿童ai安全联盟-多家组织发现后集体退群',
    source: 'AI江湖',
    summary: '围绕儿童 AI 安全联盟的争议升级，多方组织态度分化，治理路径再被审视。'
  },
  {
    title: '算力围城：谷歌百亿铸剑',
    href: 'https://news.chatgpt5x.com/aijianghu/谷歌砸百亿-给ai独角兽建-专属机房-算力大战进入白热化',
    source: 'AI江湖',
    summary: '超大规模算力投入持续加码，云厂商与独角兽绑定更深，基础设施竞争升温。'
  },
  {
    title: '多模态工作流：谁能接住企业需求',
    href: 'https://forum.chatgpt5x.com',
    source: '论坛热议',
    summary: '聚焦企业在文本、图片、视频协同生产中的痛点，讨论可落地的多模态方案。'
  },
  {
    title: '模型价格战之后，应用层如何活下来',
    href: 'https://news.chatgpt5x.com/zh/',
    source: 'AI江湖',
    summary: '模型能力趋同后，应用层开始拼场景深耕与交付效率，商业化逻辑加速重塑。'
  }
];

export function getDailyTopicPicks(): TopicPick[] {
  const forumItems = topicPool.filter((item) => item.source === '论坛热议');
  const jianghuItems = topicPool.filter((item) => item.source === 'AI江湖');

  const now = new Date();
  const dateKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  const seed = [...dateKey].reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const forumOffset = seed % forumItems.length;
  const jianghuOffset = seed % jianghuItems.length;

  return [
    forumItems[forumOffset],
    forumItems[(forumOffset + 1) % forumItems.length],
    forumItems[(forumOffset + 2) % forumItems.length],
    jianghuItems[jianghuOffset],
    jianghuItems[(jianghuOffset + 1) % jianghuItems.length],
    jianghuItems[(jianghuOffset + 2) % jianghuItems.length]
  ];
}
