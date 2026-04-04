import { BadgeDollarSign, Bot, Compass, Newspaper, PiggyBank, Sparkles, Star, Workflow } from 'lucide-react';

import { siteLinks } from '@/data/site-links';

export const quickEntries = [
  { label: '港股打新', href: siteLinks.hongKongIPO },
  { label: '养老金计算器', href: siteLinks.pensionCalculator },
  { label: '宜居城市', href: siteLinks.livableCity },
  { label: 'AI 榜单', href: siteLinks.aiLeaderboard },
  { label: 'AI 资讯', href: siteLinks.news },
  { label: '工具导航', href: siteLinks.nav }
];

export const featuredAssets = [
  {
    title: '港股打新助手',
    description: '覆盖融资倍数、预期中签率与盈亏平衡点，帮助你做更稳健的新股决策。',
    tag: '决策工具',
    cta: '立即评估',
    href: siteLinks.hongKongIPO,
    icon: BadgeDollarSign
  },
  {
    title: '养老金计算器',
    description: '输入地区、缴费基数与预期退休年龄，快速预估退休现金流。',
    tag: '实用工具',
    cta: '开始测算',
    href: siteLinks.pensionCalculator,
    icon: PiggyBank
  },
  {
    title: '今日 AI 快讯',
    description: '聚合模型发布、产品更新与行业动向，3 分钟看完今日重点。',
    tag: '每日更新',
    cta: '阅读快讯',
    href: siteLinks.news,
    icon: Newspaper
  }
];

export const toolAssets = [
  {
    title: '港股打新助手',
    description: '主打新股估值与申购策略，支持风险偏好分层建议。',
    tag: '主推工具',
    cta: '进入工具',
    href: siteLinks.hongKongIPO,
    icon: BadgeDollarSign,
    highlighted: true
  },
  {
    title: '养老金计算器',
    description: '估算个人账户与统筹账户收益，直观看到退休资金缺口。',
    tag: '退休规划',
    cta: '开始计算',
    href: siteLinks.pensionCalculator,
    icon: PiggyBank
  },
  {
    title: '中国宜居城市排行',
    description: '按就业、生活成本、医疗与教育综合评分选城。',
    tag: '城市决策',
    cta: '查看排行',
    href: siteLinks.livableCity,
    icon: Compass
  },
  {
    title: '这B班值不值',
    description: '从通勤、薪酬、成长与压力四维度评估当前工作质量。',
    tag: '职业决策',
    cta: '立即评估',
    href: siteLinks.workValue,
    icon: Sparkles
  },
  {
    title: '星命通',
    description: '多维命理信息查询与运势建议，做长期规划辅助参考。',
    tag: '生活决策',
    cta: '开始查询',
    href: siteLinks.xingmingtong,
    icon: Star
  },
  {
    title: 'AI 工具导航',
    description: '按场景筛选写作、设计、开发与运营工具，快速直达。',
    tag: '效率工具',
    cta: '立即浏览',
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
        href: siteLinks.aiLeaderboard
      },
      {
        name: 'Cursor',
        description: '开发者人均提效显著，代码生成与审阅闭环成熟。',
        href: siteLinks.aiLeaderboard
      },
      {
        name: 'Midjourney',
        description: '创意素材产能稳定，视觉质量和风格控制能力强。',
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
        href: siteLinks.aiLeaderboard
      },
      {
        name: 'HeyGen',
        description: '视频出海和营销自动化需求持续拉升。',
        href: siteLinks.aiLeaderboard
      },
      {
        name: 'Manus',
        description: 'Agent 自动化流程的使用率持续走高。',
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
        href: siteLinks.aiLeaderboard
      },
      {
        name: 'Runway',
        description: '视频生成与后期编辑能力适合内容团队快速起量。',
        href: siteLinks.aiLeaderboard
      },
      {
        name: 'Gamma',
        description: '演示内容快速生成，适合产品与运营汇报场景。',
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
