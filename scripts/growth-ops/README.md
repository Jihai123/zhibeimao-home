# growth-ops 本地数据管道

这些脚本本身**不含任何凭据**。凭据只放在本机：

```
~/.workbuddy/growth-ops/credentials.json     # 0600 + Windows ACL: 仅当前用户
~/.workbuddy/growth-ops/keys/                 # 服务账号 JSON / 部署私钥
```

模板见同目录 `credentials.example.json`（全部为空值）。严禁把填好的文件提交到 Git、粘贴到对话、写入日志或报告。
**GitHub Actions 不持有任何数据平台凭据**；边界见 [`docs/growth/DATA-ACCESS-BOUNDARY.md`](../../docs/growth/DATA-ACCESS-BOUNDARY.md)。

## 主程序 `data_platform.py`

```bash
# 五平台真实端点可达性探测（无需凭据，记录真实 HTTP 响应）
python data_platform.py probe

# 百度统计 OAuth：在默认浏览器打开同意页（API Key 不会打印到聊天/日志）
python data_platform.py auth-url baidu
# 用户在页面点「授权」拿到 code 后：
python data_platform.py exchange baidu <code>

# 验证长期认证 / Token 自动续期（真实 token 端点调用，只输出指纹）
python data_platform.py refresh

# 逐平台真实业务调用 + 抓取两站 7 天 / 30 天数据 + 生成日报与验收清单
python data_platform.py snapshot
```

`snapshot` 同时产出：

| 产物 | 内容 |
|---|---|
| `snapshots/YYYY-MM-DD-platforms.json` | 脱敏的真实 API 原始返回（含 7d / 30d 两个窗口） |
| `两站真实运营数据日报.md` | 两站 × 五平台 × 7/30 天总表，缺失一律 `UNKNOWN` |
| `授权验收清单.md` | 逐平台授权状态、最小权限矩阵、续期机制验收 |

兼容入口：`fetch_analytics.py verify|snapshot`、`verify_permissions.py` 仍可复跑。

## 授权后的自动化顺序

1. 把凭据写入本机 `credentials.json`（**不要发到对话里**）。
2. `python data_platform.py verify` —— 逐平台真实调用，确认不是"配置成功"而是"接口真的返回数据"。
3. `python data_platform.py snapshot` —— 拉取 7/30 天真实数据。
4. 每日运营由本机 WorkBuddy 定时任务复跑；`expires_at` 到期前自动用 refresh_token 换新 token。

## 覆盖的平台与最小权限

| 平台 | 认证方式 | 7/30 天读取内容 | 写入 |
|---|---|---|---|
| 百度统计 | OAuth `scope=basic`；access_token + refresh_token 自动续期 | PV / UV / 新访客 / IP / 平均停留（trend/time/a） | 无 |
| GA4 | GCP 服务账号，`analytics.readonly` + 属性查看者 | activeUsers / sessions / pageviews / newUsers / bounceRate | 无 |
| GSC | 同一服务账号，`webmasters.readonly` + 受限用户 | 按日 clicks / impressions / ctr / position | 无 |
| Bing WMT | 静态只读 API Key | GetUserSites + GetRankAndTrafficStats 日序列 | 无 |
| 百度搜索资源平台 | 推送 token | **无公开读取 API**；流量/索引量保持 `UNKNOWN` | 仅显式 opt-in 的 URL 推送，本轮不执行 |

已知事实（实测生产 HTML）：`chatgpt5x.com` 有 GA4 `G-H41YCVV2ZX`；`zhibeimao.com` **没有 GA4 埋点**，其 GA4 数据天然应为 `UNKNOWN`，不得填 0 或虚构属性。

## 网络与依赖

- `growthops.curl` 采用「直连优先、连接级失败自动回退本机代理」：百度统计 / Bing 直连可达，Google 系 API 需代理。stdout 使用 `errors="replace"` 解码，避免非 UTF-8 字节被误报为网络故障。
- 仅依赖 Python 标准库 + 本机 `curl`、`date`、`openssl`（服务账号 JWT 的 RS256 签名）。不需要 `pip install`。
- 所有写盘产物在落盘前执行 `assert_no_secrets`：若任何凭据值出现，立即 ABORT 且不写文件。

`GROWTH_OPS_CREDENTIALS` 环境变量可覆盖凭据文件路径（仅限本机使用；不要指向仓库内文件）。
