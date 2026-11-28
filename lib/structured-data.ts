/** Search-engine structured data and on-page FAQ copy.
 *
 * Single source of truth: the FAQ text rendered on /api/docs is exactly the
 * text emitted in FAQPage JSON-LD. Only facts already documented on the site
 * are used - no ratings, reviews, prices, or fabricated user interactions.
 */

export const SITE_URL = 'https://www.zhibeimao.com';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '指北猫',
  url: SITE_URL,
  description:
    '指北猫是一站式 AI 发现、体验与应用服务平台，提供 AI 工具导航、在线 AI 对话与视觉创作，以及兼容 OpenAI 的多模型 API 接入服务。',
  inLanguage: 'zh-CN'
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '指北猫',
  url: SITE_URL,
  inLanguage: 'zh-CN',
  publisher: { '@type': 'Organization', name: '指北猫', url: SITE_URL }
};

/** Emitted on every page through the root layout. */
export const siteGraphSchema = [organizationSchema, websiteSchema];

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export const apiPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '智享AI API｜统一模型 API 接入服务',
  url: `${SITE_URL}/api`,
  description:
    'OpenAI 兼容接口和多模型统一接入，展示模型目录、输入输出计价方式及开发接入示例。',
  inLanguage: 'zh-CN',
  isPartOf: { '@type': 'WebSite', name: '指北猫', url: SITE_URL }
};

export const docsPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'API 接入文档与快速开始',
  name: 'API 接入文档与快速开始｜指北猫',
  url: `${SITE_URL}/api/docs`,
  description:
    '配置 API Base URL 与 Key，查询可用模型，使用 OpenAI SDK、curl、Python 示例发起首次调用，并了解接口格式与常见问题。',
  inLanguage: 'zh-CN',
  publisher: { '@type': 'Organization', name: '指北猫', url: SITE_URL },
  isPartOf: { '@type': 'WebSite', name: '指北猫', url: SITE_URL }
};

export const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: '智享AI工具导航 介绍 | 指北猫',
  url: `${SITE_URL}/about`,
  description:
    '了解指北猫与智享AI工具导航的产品定位、运营理念、服务边界和联系方式。',
  inLanguage: 'zh-CN',
  isPartOf: { '@type': 'WebSite', name: '指北猫', url: SITE_URL }
};

/** Every answer restates a fact already present on /api/docs. No invented data. */
export const apiFaq = [
  {
    question: '接入前需要准备哪些信息？',
    answer:
      '准备一个 API Key 和统一接口地址 https://api.zhibeimao.com/v1，按 OpenAI 兼容格式发起请求。Key 应保存在服务端环境变量中，不要写入公开代码仓库或浏览器前端。'
  },
  {
    question: '怎么确认当前 Key 可以用哪些模型？',
    answer:
      '携带 API Key 请求 GET /v1/models，使用返回结果里的完整模型 ID 调用。同名模型可能同时存在 basic/、standard/ 和无前缀线路，计费不同，建议先在模型价格目录对比后填写完整 ID。'
  },
  {
    question: '网页 AI 工具和 API 应该怎么选？',
    answer:
      '单次问答、写作、图片生成等由人直接操作的任务，用网页工具更省事；需要把模型能力接入应用、批量处理或做自动化时，才需要 API Key 和代码调用。'
  },
  {
    question: '余额和可用额度在哪里查询？',
    answer:
      '通过账户的余额查询页面查看 API Key 余额及可用额度。不同模型的接口格式、计费和可用能力，以对应模型说明与实际账单为准。'
  },
  {
    question: '提示鉴权错误或模型不可用怎么办？',
    answer:
      '先检查 API Key、Authorization 请求头和 Base URL 是否填写正确；若提示模型不可用，请求 GET /v1/models 核对完整的模型 ID，并确认该 ID 在当前 Key 的可用列表中。'
  }
];

export const apiFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: apiFaq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer }
  }))
};

export const apiBreadcrumbSchema = breadcrumbSchema([
  { name: '首页', url: SITE_URL },
  { name: 'API 服务', url: `${SITE_URL}/api` }
]);

export const docsBreadcrumbSchema = breadcrumbSchema([
  { name: '首页', url: SITE_URL },
  { name: 'API 服务', url: `${SITE_URL}/api` },
  { name: '接入文档', url: `${SITE_URL}/api/docs` }
]);

export const aboutBreadcrumbSchema = breadcrumbSchema([
  { name: '首页', url: SITE_URL },
  { name: '关于我们', url: `${SITE_URL}/about` }
]);
