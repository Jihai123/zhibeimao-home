import { BadgeDollarSign, Bot, Compass, Newspaper, PiggyBank, Sparkles, Star, Workflow } from 'lucide-react';

import { siteLinks } from '@/data/site-links';

export const quickEntries = [
  { label: 'AI 工具导航', href: siteLinks.nav },
  { label: '实时 AI 榜单', href: siteLinks.aiLeaderboard },
  { label: '热门分类', href: siteLinks.discover },
  { label: '专题精选', href: siteLinks.topics }
];

export const featuredAssets = [
  {
    title: '今日新股：建议关注',
    subtitle: '结论推荐',
    reason: '认购热度上升 + 基石较强',
    badge: '🔥',
    useCount: '已有 2.3w 人使用',
    cta: '立即判断',
    href: siteLinks.hongKongIPO,
    icon: BadgeDollarSign,
    highlighted: true
  },
  {
    title: '养老金：建议先算缺口',
    subtitle: '规划建议',
    reason: '越早测算，越容易补齐退休资金缺口',
    badge: 'NEW',
    useCount: '已有 1.8w 人使用',
    cta: '去测算',
    href: siteLinks.pensionCalculator,
    icon: PiggyBank
  },
  {
    title: 'AI工具：优先看上升榜',
    subtitle: '趋势观察',
    reason: '本周新增工具增多，先看上升项更省时间',
    badge: 'NEW',
    useCount: '已有 2.1w 人使用',
    cta: '立即查看',
    href: siteLinks.aiLeaderboard,
    icon: Newspaper
  }
];

export const toolAssets = [
  {
    title: '港股打新评分',
    description: '基于申购热度、估值区间和风险偏好，给出是否参与的快速判断。',
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
    cta: '立即使用',
    href: siteLinks.pensionCalculator,
    icon: PiggyBank
  },
  {
    title: '中国宜居城市排行',
    description: '按就业、生活成本、医疗与教育等维度，快速筛选更适合长期发展的城市。',
    tag: '城市决策',
    cta: '立即使用',
    href: siteLinks.livableCity,
    icon: Compass
  },
  {
    title: '这B班值不值',
    description: '从通勤、薪酬、成长与压力四维度评估当前工作质量。',
    tag: '职业决策',
    cta: '立即使用',
    href: siteLinks.workValue,
    icon: Sparkles
  },
  {
    title: '星命通',
    description: '多维命理信息查询与运势建议，做长期规划辅助参考。',
    tag: '生活决策',
    cta: '立即使用',
    href: siteLinks.xingmingtong,
    icon: Star
  },
  {
    title: 'AI 工具导航',
    description: '按场景筛选写作、设计、开发与运营工具，快速直达。',
    tag: '效率工具',
    cta: '立即使用',
    href: siteLinks.nav,
    icon: Bot
  }
];

export const rankingGroups = [
  {
    title: '今日热门 AI 工具',
    items: [
      {
        name: 'Claude Workspace',
        description: '长文分析与团队知识整理效率持续领先。',
        status: '↑ 上升',
        cta: '去体验',
        href: siteLinks.aiLeaderboard
      },
      {
        name: 'Cursor',
        description: '开发者人均提效显著，代码生成与审阅闭环成熟。',
        status: 'NEW',
        cta: '立即使用',
        href: siteLinks.aiLeaderboard
      },
      {
        name: 'Midjourney',
        description: '创意素材产能稳定，视觉质量和风格控制能力强。',
        status: '↑ 上升',
        cta: '去体验',
        href: siteLinks.aiLeaderboard
      }
    ]
  },
  {
    title: '周增长最快',
    items: [
      {
        name: 'Perplexity',
        description: '搜索问答渗透率提升，知识工作场景增长迅速。',
        status: '↑ 上升',
        cta: '去体验',
        href: siteLinks.aiLeaderboard
      },
      {
        name: 'HeyGen',
        description: '视频出海和营销自动化需求持续拉升。',
        status: 'NEW',
        cta: '立即使用',
        href: siteLinks.aiLeaderboard
      },
      {
        name: 'Manus',
        description: 'Agent 自动化流程的使用率持续走高。',
        status: '↑ 上升',
        cta: '去体验',
        href: siteLinks.aiLeaderboard
      }
    ]
  },
  {
    title: '编辑精选',
    items: [
      {
        name: 'Notion AI',
        description: '从知识库到协作任务，适合中小团队一体化部署。',
        status: 'NEW',
        cta: '立即使用',
        href: siteLinks.aiLeaderboard
      },
      {
        name: 'Runway',
        description: '视频生成与后期编辑能力适合内容团队快速起量。',
        status: '↑ 上升',
        cta: '去体验',
        href: siteLinks.aiLeaderboard
      },
      {
        name: 'Gamma',
        description: '演示内容快速生成，适合产品与运营汇报场景。',
        status: 'NEW',
        cta: '立即使用',
        href: siteLinks.aiLeaderboard
      }
    ]
  }
];

export const topicPicks = [
  { title: '金工 Agent 自动化方案', href: siteLinks.topics, icon: Workflow },
  { title: 'A/B 测试实验流', href: siteLinks.topics, icon: Workflow },
  { title: '内容创作工具流', href: siteLinks.topics, icon: Workflow },
  { title: '开发者 AI 工具流', href: siteLinks.topics, icon: Workflow }
];

export const aiNews = [
  {
    title: '多家 AI 厂商发布企业版 API 更新',
    summary: '计费策略与推理性能同步调整，企业集成门槛进一步下降。',
    time: '10:20',
    href: siteLinks.news
  },
  {
    title: '开源 Agent 框架进入稳定迭代期',
    summary: '社区发布标准化工作流模板，Agent 落地速度明显提升。',
    time: '09:10',
    href: siteLinks.news
  },
  {
    title: '内容团队加速接入 AI 工作台',
    summary: '从选题到分发逐步自动化，单人内容产能持续增长。',
    time: '08:30',
    href: siteLinks.news
  }
];
