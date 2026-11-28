# 2026-11-28｜首轮自主增长运营：可复跑基线与线上审计

> 本文件只记录**可复现的公网观测事实和可复跑的方法**，不记录推测的流量、收录或排名结论。
> 跨天执行总账仍是 [Issue #27](https://github.com/Jihai123/zhibeimao-home/issues/27)。

## 1. 审计口径

- 工具：`scripts/growth-seo-audit.py`，仅对线上公开 URL 发 GET，不登录任何后台、不上报数据、不产生付费调用。
- 复跑：`python scripts/growth-seo-audit.py baseline-YYYYMMDD.json`，输出 JSON 供逐日 diff。
- **完整性保护**：首版脚本在 curl 超时时把截断 HTML 当成完整页面（智享AI 首页曾只收到 442,064 / 732,727 字节），已修复为记录 `fetch_complete`、`fetch_seconds`、`curl_returncode`，只有 `fetch_complete=true` 的观测才可进入基线。
- 统计口径：所有数字来自公网 HTTP 响应头与 HTML；百度/Bing/Google 官方后台曝光、点击、索引若无只读权限一律记 `UNKNOWN`，不用 `site:` 探测结果冒充官方索引数据。

## 2. BEFORE 基线（2026-11-28，公网只读）

| 页面 | HTTP | 完整 | 字节 | 耗时(s) | title / desc 长度 | canonical | JSON-LD | OG / Twitter | 埋点 |
|---|---|---|---:|---:|---|---|---|---:|---|
| `www.zhibeimao.com/` | 200 | 是 | 120,856 | 1.12 | 37 / 95 | 有 | **0** | 无 / 无 | 百度统计 |
| `www.zhibeimao.com/api` | 200 | 是 | 203,254 | 0.77 | 22 / 99 | 有 | **0** | 有 / 有 | 百度统计 |
| `www.zhibeimao.com/api/docs` | 200 | 是 | 60,798 | 0.70 | 17 / 99 | 有 | **0** | 无 / 无 | 百度统计 |
| `www.zhibeimao.com/about` | 200 | 是 | 34,599 | 0.62 | 17 / 74 | **无** | **0** | 无 / 无 | 百度统计 |
| `www.chatgpt5x.com/` | 200 | 是 | 732,727 | **54.27** | 23 / 79 | 有 | **0** | 有 / 无 | 百度统计 + GA4 + Ahrefs |
| `www.chatgpt5x.com/guides/ai-tools-or-api/` | 200 | 是 | 10,306 | 0.95 | 26 / 70 | 有 | **0** | 有 / 无 | **无任何埋点** |

资源：`zhibeimao.com/robots.txt` 200 并声明 `sitemap.xml`（4 个规范 URL：首页、`/api`、`/api/docs`、`/about`）；`chatgpt5x.com/robots.txt` 200 并声明 `sitemap.xml` 与 `sitemap-guides.xml`（含选型指南 URL）。两站核心页均 HTTP 200、单 H1、图片 ALT 无缺失。

## 3. 三引擎现状（与 D04 结论合并）

| 站点 | 百度 | Bing | Google |
|---|---|---|---|
| 智享AI | 官方后台验证/索引/曝光/点击/自然会话 `UNKNOWN` | `UNKNOWN`（历史导出 326 点击属上一统计口径，不计入本期） | 域属性可读；D04 URL Inspection：首页 PASS 已索引，**选型指南 NEUTRAL「Google 无法识别此网址」** |
| 指北猫 | `UNKNOWN` | `UNKNOWN` | OpenSEO 项目 `not_connected`，其余 `UNKNOWN` |

公开可见性探测（非官方索引证据）：`site:www.zhibeimao.com` 可返回首页；`site:www.chatgpt5x.com/guides/ai-tools-or-api/` 未返回该指南页，与 D04 的 GSC NEUTRAL 方向一致。两站 GA4 `source/medium` 仍 `ga4_not_connected`，**真实有效外部会话 `UNKNOWN`**。

## 4. 自主发现的问题与优先级

| 优先级 | 问题 | 价值 | 成本 / 风险 | 本轮处理 |
|---|---|---|---|---|
| P0 | 两站 6 个核心页 JSON-LD 全为 0 | 三引擎共同支持的标准实体/层级/FAQ 语义，影响富结果呈现与页面理解 | 纯增量 `<script>`，不改视觉与交互 | **已实施（指北猫）** |
| P0 | 智享AI 选型指南**无任何统计埋点** | 即使有真实引荐到站也不可测量，直接破坏数据基线与归因 | 需服务器静态文件权限 | **阻断，待授权** |
| P1 | `/about` 缺 canonical | 规范 URL 信号缺失 | 一行 metadata | **已修复** |
| P1 | 首页 / 文档页 / about 缺社交卡片 | 分享触达与点击 | metadata 增量 | **已修复** |
| P1 | 智享AI 首页 54s / 732KB，sitemap >1MB 且多次传输中断（curl 56） | 抓取预算、Core Web Vitals、跳出率 | 需 nginx/静态资源权限 | **阻断，待授权** |
| P2 | 选型指南缺少从已抓取页面的发现路径 | 解决 D04 的 GSC NEUTRAL 可发现性 | 一条真实延伸阅读链接 | **已实施** |
| P2 | 开发者高意图 FAQ 内容缺失 | 回答账本 D0 已列真实问题，支撑长尾搜索与落地页转化 | 内容增量，需与页面事实一致 | **已实施** |

决策：只在**具备完整 Git→CI→Vercel 自动部署链路**的指北猫做可验证改动；智享AI 的服务器侧改动不伪称上线。所有内容为纯增量，不触碰原有模型排行榜、公告、六个引流入口与商城归因。

## 5. 本轮改动清单

- `lib/structured-data.ts`：schema 单一数据源；仅使用站点已有事实，**不含评分、评价、价格、任何虚构用户互动**。
- `components/StructuredData.tsx`：安全渲染 JSON-LD（转义 `<`）。
- `app/layout.tsx`：全站 `Organization` + `WebSite` 图谱（4 页生效）。
- `app/api/page.tsx`：`WebPage` + `BreadcrumbList`；补 `twitter`。
- `app/api/docs/page.tsx`：`TechArticle` + `BreadcrumbList` + `FAQPage`；新增 5 条可见 FAQ（与 JSON-LD 共用同一份文案）；补 canonical 外的社交元数据；新增指向智享AI选型指南的延伸阅读入口。
- `app/about/page.tsx`：补 canonical、`AboutPage` + `BreadcrumbList`、社交元数据。
- `app/page.tsx`：补社交元数据。
- `scripts/verify-structured-data.cjs` + `verify-site.yml`：CI 门禁，防止 schema 与页面文案脱节或混入虚构字段。
- `scripts/growth-seo-audit.py`：每日可复跑的线上只读基线工具。

## 6. 验证方法（不宣称流量增长）

1. 本地：`node scripts/verify-structured-data.cjs`；`npm run build`。
2. CI：PR 触发 `Verify site build and responsive UI`（含既有响应式/埋点隔离回归）。
3. 生产：合并到 main 后 Vercel 部署，重跑 `python scripts/growth-seo-audit.py baseline-after.json`，逐页对比 `jsonld_blocks` / `jsonld_types` / `canonical` / `has_og_title` / `has_twitter_card` / FAQ 可见文本。
4. 收录、曝光、点击、有效会话必须等官方后台可读后才填数；提交或抓取不等于收录，站内互链不计外部新增访客。

## 7. 遗留与下一轮

- **智享AI 服务器侧**：源码仓库无可用写权限、无 SSH 部署通道；指南页埋点、首页体积/响应速度、sitemap 体积与稳定性均需一次授权后处理。
- **站长后台**：百度搜索资源平台、Bing Webmaster Tools、指北猫 GSC 的只读权限/所有权验证仍缺；不自行修改 DNS、不创建账号、不索取密钥。
- **统计口径**：百度统计按正式 hostname 过滤的来源/入口报表、两站 GA4 仍待接入。
- **不重复 D01–D04 的分析型工作**：下一轮优先把可发现性与可测量性缺口补上，再评估真实会话变化。
