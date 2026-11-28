# 长期自主增长运营机制（Round 2 起生效）

继承 GitHub 运营账本 [Issue #27](https://github.com/Jihai123/zhibeimao-home/issues/27)。本文件定义「每日运营 → 每周复盘 → 30 天评估」的可复跑机制、数据口径与安全边界。

## 1. 三个频率

| 频率 | 触发 | 实现 | 产出 |
|---|---|---|---|
| 每日运营 | 每天 09:00 CST（`cron: 0 1 * * *`） | `.github/workflows/daily-growth-audit.yml` | 两站 6 个核心页 + robots/sitemap 的公开 GET 快照；`verify-growth-snapshot.py` 阻断线上回归；快照存 Actions Artifact 45 天 |
| 每周复盘 | 每周一 10:00 CST（`cron: 0 2 * * MON`） | `.github/workflows/weekly-growth-review.yml` | 由真实快照生成复盘表，自动回写一条评论到 Issue #27 |
| 30 天评估 | 每月 1 日 11:00 CST（`cron: 0 3 1 * *`） | `.github/workflows/monthly-growth-evaluation.yml` | 新建「30 天增长评估 YYYY-MM」Issue，附 6 维评估框架与真实快照 |

三个工作流均可用 `workflow_dispatch` 手动补跑。每日快照不做任何生产写入、不需要凭据。

## 2. 本地 Agent 层（需要只读凭据时）

GitHub Actions 只跑**公开可复现**的审计。涉及百度统计 / GA4 / 百度资源平台 / Bing WMT / GSC 的数据获取，由本机 Agent 用 `scripts/growth-ops/` 下的适配器执行：

- 凭据只存于 `~/.workbuddy/growth-ops/credentials.json`（Windows ACL 仅当前用户，模板见 `ops/credentials.example.json`）。
- 统一入口 `python scripts/growth-ops/fetch_analytics.py verify|snapshot`；`verify` 做真实业务调用，`snapshot` 落盘。
- `verify-permissions.py` 生成权限验收清单，只输出脱敏证据。
- 任何缺失凭据一律 `BLOCKED`，**不填 0、不推断、不虚构**。数据链路接通前，周报/月报中相关指标保持 `UNKNOWN`。
- 快照落盘前有硬校验：任何凭据值若出现在输出文本中，立即 ABORT 且不写文件。

## 3. 每日自主运营闭环（标准动作）

1. 读 Issue #27 最新结论与上一轮遗留项。
2. 跑公开审计，与上一日快照 diff，定位回归与新增机会。
3. 若数据凭据已配置，拉取五平台真实指标；否则标注 `UNKNOWN` 并继续。
4. 按 **价值 / 成本 / 风险** 排序：优先「真实用户价值 + 可生产验证 + 低风险回滚」。
5. 本地实现 → 全部离线门禁 → 构建产物验证。
6. 走 PR → CI → 合并 → **正式域名（无 query 规范 URL）实测**；缓存未刷新或验收失败时不得宣称上线。
7. 失败自主修复并复验；把成果、证据、遗留项、下一轮计划回写账本。

## 4. 数据口径

| 类别 | 口径 |
|---|---|
| 页面结构 / SEO 元素 / 响应时间 | 真实公开 GET，逐页可复跑，属 `REAL` |
| 会话、来源、曝光、点击、收录 | 需平台后台只读授权；未授权为 `UNKNOWN` |
| 排名、流量增长、转化 | 只依据真实时间序列对比做出结论，不做宣称 |
| 外部渠道发布 | 遵守 D02–D04：不复制 AI 稿、无账号授权不伪称发布 |

## 5. 安全红线

- 密钥、密码、Token、Cookie、私钥**绝不**写入日志、GitHub、报告、PR 或快照。
- 服务器部署只同步白名单静态文件，禁止 `--delete`；生产写入必须经授权守卫。
- 保持原有核心功能、排行榜、公告、六个引流入口与归因逻辑不变。
- 禁止刷流量、垃圾外链、伪造用户互动与虚构 schema 字段（评分/评价/价格/评论数）。

## 6. 待一次性授权（当前状态见 `ops/permission-acceptance.md`）

1. 智享AI 服务器部署：SSH 公钥安装 + 4 个 GitHub Actions Secrets。
2. 五个数据平台的只读凭据。
3. 可选：把当前 `gist, repo, workflow` 的宽范围 PAT 换成仅授权两个仓库的 fine-grained PAT。

授权完成后必须**用真实业务调用复验**，不得仅凭配置成功判定。
