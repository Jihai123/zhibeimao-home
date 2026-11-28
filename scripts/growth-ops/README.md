# growth-ops 本地数据管道

这些脚本本身**不含任何凭据**。凭据只放在本机：

```
~/.workbuddy/growth-ops/credentials.json     # Windows ACL: 仅当前用户可读写
```

模板见同目录 `credentials.example.json`（全部为空值）。严禁把填好的文件提交到 Git、粘贴到对话、写入日志或报告。

## 用法

```bash
# 1) 实证验证五平台授权（真实 API 调用，只输出脱敏证据）
python scripts/growth-ops/verify_permissions.py

# 2) 只读数据快照（缺失凭据 -> BLOCKED，绝不填 0）
python scripts/growth-ops/fetch_analytics.py verify
python scripts/growth-ops/fetch_analytics.py snapshot

# 3) 授权后，一次性把智享AI 指南页提交给百度普通收录（写入操作，需显式调用）
python scripts/growth-ops/fetch_analytics.py submit-guide
```

`fetch_analytics.py snapshot` 会在写盘前扫描所有输出文本；若任何凭据值出现，立即 ABORT 且不落盘。

## 覆盖的平台

| 平台 | 认证方式 | 读取内容 | 写入 |
|---|---|---|---|
| 百度统计 | access_token（OAuth / 数据导出服务） | 7 日 PV/UV/新访客趋势 | 无 |
| GA4 | GCP 服务账号（Viewer） | 7 日 activeUsers / sessions / pageviews | 无 |
| GSC | 同一服务账号（Restricted User） | 站点权限级别 + 7 日查询数据 | 无 |
| Bing WMT | API Key（用户级只读） | 已验证站点 + 每日点击/曝光 | 无 |
| 百度搜索资源平台 | API 提交 token | **无公开读取 API**；流量/索引量仍 `UNKNOWN` | 仅 `submit-guide` 主动推送 URL |

能用 `GROWTH_OPS_CREDENTIALS` 环境变量覆盖凭据文件路径（例如 CI 中指向由 Secret 生成的临时文件）。

## 依赖

仅 Python 标准库 + 本机 `curl`、`date`、`openssl`（用于服务账号 JWT 的 RS256 签名）。不需要 `pip install`。
