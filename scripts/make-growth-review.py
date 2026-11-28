"""Build a weekly/30-day ledger comment from a real audit snapshot.

Only public, reproducible observations go into the comment. Anything that
requires an analytics backend is explicitly UNKNOWN - never a zero.
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

snapshot = Path(sys.argv[1] if len(sys.argv) > 1 else "growth-snapshot.json")
kind = sys.argv[2] if len(sys.argv) > 2 else "weekly"
out = Path(sys.argv[3] if len(sys.argv) > 3 else "growth-review.md")
report = json.loads(snapshot.read_text(encoding="utf-8"))
pages = report.get("pages") or []

lines = [
    "## 自主增长运营 · %s（%s）" % ("每周复盘" if kind == "weekly" else "30 天增长评估",
                                datetime.now(timezone.utc).strftime("%Y-%m-%d")),
    "",
    "自动生成：GitHub Actions 定时快照，只使用公开 GET 可复现数据；无后台权限的指标一律标注 `UNKNOWN`。",
    "",
    "### 生产页面快照",
    "",
    "| 页面 | HTTP | JSON-LD | canonical | 完整抓取 | 体积(B) | 耗时(s) |",
    "|---|---|---:|---|---|---:|---:|",
]
for p in pages:
    lines.append("| `%s` | %s | %s | %s | %s | %s | %s |" % (
        p["url"].replace("https://www.", ""),
        ",".join(p.get("http_status_chain") or []) or "-",
        p.get("jsonld_blocks", 0),
        "Y" if p.get("canonical") else "**N**",
        "Y" if (p.get("fetch") or {}).get("fetch_complete") else "**N**",
        p.get("bytes", 0),
        round((p.get("fetch") or {}).get("fetch_seconds", 0), 2),
    ))

lines += [
    "",
    "### 数据口径",
    "",
    "| 指标 | 状态 | 说明 |",
    "|---|---|---|",
    "| 线上页面结构 / SEO 元素 | **REAL** | 本快照为真实公开 GET，逐页可复跑 |",
    "| 百度统计 / GA4 会话与来源 | `UNKNOWN` | 需只读 API 凭据，未配置时绝不填 0 |",
    "| 百度资源平台 / Bing WMT / GSC 曝光点击 | `UNKNOWN` | 需只读 API 或服务账号授权 |",
    "| 收录、排名、流量增长 | **不做宣称** | 本机制只记录可验证事实，不推断增长 |",
    "",
]

if kind == "weekly":
    lines += [
        "### 本周需人工确认的偏差",
        "",
        "- 上述表格任一 `HTTP≠200`、`完整抓取=N`、`canonical=N`、`JSON-LD=0` 即为回归，已在每日门禁中阻断。",
        "- 智享AI 指南页若仍显示 `JSON-LD=0`，代表一次性部署授权尚未完成，属于已知待办而非新缺陷。",
        "- 外部渠道与内容发布遵守 D02–D04 结论：不复制 AI 稿、无账号授权不伪称发布。",
    ]
else:
    lines += [
        "### 30 天评估框架（按真实数据填写，未取得数据前保持 UNKNOWN）",
        "",
        "1. **流量**：两站自然搜索会话、引荐会话、新访客占比（来源：百度统计 / GA4）。",
        "2. **可发现性**：GSC / Bing WMT / 百度资源平台的曝光、点击、已收录 URL 数变化。",
        "3. **内容**：新增可索引页面数、指南页进入主 sitemap 后的抓取/索引状态。",
        "4. **产品体验**：指南页与接入文档的可见深度、复制控件使用（需前端事件埋点后方可评估）。",
        "5. **商业引流**：带 UTM 的 API 产品页到达与转化（需 GA4/百度统计来源报表）。",
        "6. **结论**：只依据上述真实指标给出 GO / PARTIAL / BLOCKED，附证据链接。",
    ]

lines += [
    "",
    "快照采集时间(UTC)：`%s`；方法：`%s`。" % (report.get("captured_at_utc"), report.get("method")),
    "",
    "> 本评论由定时任务自动生成，不含任何密钥、Cookie 或凭据值。",
]
out.write_text("\n".join(lines), encoding="utf-8")
print("wrote", out, "pages", len(pages), "kind", kind)
