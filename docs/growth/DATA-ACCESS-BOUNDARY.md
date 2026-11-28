# 数据访问边界：WorkBuddy（本机） vs GitHub Actions（云端）

版本：2026-11-28 · 适用对象：智享AI `www.chatgpt5x.com`、指北猫 `www.zhibeimao.com`

## 0. 原则

1. **凭据只在本地**：五平台凭据唯一存放于本机 `C:\Users\李孝花\.workbuddy\growth-ops\credentials.json`（权限 0600 + Windows ACL 仅当前用户）。服务账号 JSON 存于同目录 `keys/`。
2. **云端零凭据**：GitHub Actions 不配置任何统计/搜索平台 Secret，因此即使仓库、日志、Actions 输出全部公开，也不会泄漏数据平台凭据。
3. **最小权限**：每个平台只申请只读范围；不做写操作（百度资源平台 URL 推送属显式 opt-in，本轮不执行）。
4. **不虚构**：无授权或无读取 API 一律 `UNKNOWN`，不以 0 代替。

## 1. 能力矩阵

| 能力 | WorkBuddy（本机） | GitHub Actions（云端） |
|---|---|---|
| 持有百度统计 access/refresh token | ✅ 唯一 | ❌ 禁止 |
| 持有 GCP 服务账号私钥 | ✅ 唯一 | ❌ 禁止 |
| 持有 Bing WMT API Key | ✅ 唯一 | ❌ 禁止 |
| 持有百度资源平台推送 token | ✅ 唯一 | ❌ 禁止 |
| 调用百度统计 / GA4 / GSC / Bing 数据 API | ✅ 可以 | ❌ 禁止 |
| 拉取两站 7 天 / 30 天真实数据 | ✅ 可以 | ❌ 禁止 |
| 公开 GET 生产页面 SEO 审计 | ✅ 可以 | ✅ 可以（无需凭据） |
| 离线门禁、类型检查、构建 | ✅ 可以 | ✅ 可以 |
| 合并 main 触发 Vercel 部署 | ✅ 通过 GitHub API | ✅ 可以 |
| 智享AI 静态文件部署 | ✅ 可触发（需经授权守卫） | ✅ 需要 4 个部署 Secret（`mydaohang` 仓库 Actions Secrets，与数据平台凭据完全隔离） |
| 回写 GitHub 运营账本 | ✅ 可以 | ✅ 每周一自动回写（仅聚合结果与证据链接） |
| 写凭据到仓库 / 日志 / 报告 / 快照 | ❌ 禁止 | ❌ 禁止 |

## 2. 数据流向

```
[五平台 API]  --(本机凭据，HTTPS)-->  [WorkBuddy 本机]
                                        |
                                        +--> ~/.workbuddy/growth-ops/credentials.json  (仅本机，0600)
                                        +--> ops/snapshots/YYYY-MM-DD-platforms.json  (脱敏聚合数据)
                                        +--> ops/两站真实运营数据日报.md            (脱敏)
                                        +--> ops/授权验收清单.md                    (脱敏)
                                        +--> GitHub Issue #27 评论                  (仅结论 + 证据链接)

[公开生产页面] --(GET)-->  [GitHub Actions 每日审计] --> 公开 SEO 快照 (无需凭据)
[main 分支]   --(push)-->  [Vercel / 静态部署] --> 生产环境
```

**关键隔离**：部署 Secret（`DEPLOY_HOST` / `DEPLOY_USER` / `DEPLOY_WEBROOT` / `DEPLOY_SSH_KEY`）属于**发布通道**，与数据平台凭据分属不同 Secret、不同用途、不同权限域；数据平台凭据永远不进入 GitHub。

## 3. 凭据生命周期与自动续期

| 平台 | 凭据类型 | 有效期 | 自动续期实现 | 人工介入点 |
|---|---|---|---|---|
| 百度统计 | OAuth `access_token` + `refresh_token` | access_token 约 1 天~30 天（以 `expires_in` 为准）；refresh_token 约 10 年 | `data_platform.py refresh` 用 `grant_type=refresh_token` 换新 token；`expires_at` 提前 300 秒触发；每次 `snapshot` 前自动检查并轮换，用指纹比对验证确实更新 | 首次 OAuth 授权需本人登录一次；refresh_token 失效或账号改密时重新授权 |
| GA4 | GCP 服务账号 RS256 私钥（JSON） | 私钥长期有效；换取的 access_token 1 小时 | 每次调用现签 JWT → `oauth2.googleapis.com/token` 换 token，无状态、无需存储 token、天然自动续期 | 私钥轮换时替换 JSON |
| GSC | 同一服务账号，`webmasters.readonly` scope | 同上 | 同上 | 需把服务账号 `client_email` 加为两站 GSC「受限用户」一次 |
| Bing WMT | 静态只读 API Key | 无过期 | 无需续期 | 后台重新生成 Key 时更新一次 |
| 百度资源平台 | 静态推送 token | 无过期 | 无需续期 | 后台重置 token 时更新一次 |

续期验证方式：`python ops/data_platform.py refresh` 会真实调用 token 端点，输出**仅 token 指纹（SHA-256 前 10 位）**与 `rotated` 布尔值，绝不输出 token 本身。Google 侧会对 GA4 / GSC 两个 scope 各签一次 JWT 并分别给出指纹。

## 4. 网络边界（本轮实测）

| 端点 | 直连 | 走本机代理 | 结论 |
|---|---|---|---|
| `openapi.baidu.com`（百度统计） | ✅ HTTP 200 业务错误码 | — | 可达，缺 token |
| `ssl.bing.com`（Bing WMT） | ✅ HTTP 400 `InvalidApiKey` | — | 可达，缺 Key |
| `analyticsdata.googleapis.com`（GA4） | ❌ 连接超时 | ✅ 真实响应 | 需代理回退 |
| `www.googleapis.com/webmasters/v3`（GSC） | ❌ 连接超时 | ✅ HTTP 401 | 需代理回退 |
| `oauth2.googleapis.com/token` | ❌ 连接超时 | ✅ 可达 | 需代理回退 |
| `data.zz.baidu.com`（资源平台推送） | ❌ 不可达 | ❌ 不可达 | 网络层阻断，本轮不做写操作 |

`growthops.curl` 已实现「直连优先、连接级失败自动回退本机代理」，并用 `errors="replace"` 解码，避免非 UTF-8 上游字节被误报为网络故障。

## 5. 明确禁止

- ❌ 把任何 token / key / 私钥 / Cookie / 密码写入 GitHub 仓库、Issue、PR、Actions 日志、报告或快照。
- ❌ 用浏览器 Cookie 作为长期数据通道（不满足长期认证与可审计要求）。
- ❌ 在未获授权时调用写接口（含 URL 主动推送、sitemap 提交、用户管理）。
- ❌ 把 `UNKNOWN` 写成 0，或用估算值补齐缺失数据。
- ❌ 在 GitHub Actions 中配置数据平台凭据。
