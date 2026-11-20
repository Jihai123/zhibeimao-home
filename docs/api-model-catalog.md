# 模型目录：聚合官网 catalog 每日同步

## 已验证数据源

- 网页：`https://www.juhenext.com/models/`
- 刷新时自动请求：`GET https://www.juhenext.com/api/catalog`
- 真实 Chrome 网络采样：HTTP 200、`application/json`、响应 57,795 字节、`models` 数组 117 条（2026-11-20）
- JSON 顶层键：`vendors`、`models`、`groupRatio`、`usableGroups`、`refreshedAt`、`source`
- 每个 `models[]` 含 `name`（真实模型 ID）、`displayName`、`vendor`、`tags`、部分计费字段。
- 此资源是网页自动加载的模型目录 JSON，**不是**需要 API Key 的 `/v1/models`。

## 运行方式

GitHub Actions `.github/workflows/daily-model-catalog.yml` 每天北京时间 02:15 从已确认 URL 下载 JSON，无需手工配置密钥或下载 URL。 `scripts/sync-model-catalog.cjs` 解析 `models[].name`，去重、校验并更新 `data/model-catalog.json`，有效变化提交到 main 并由既有站点部署链路发布。

若数据源返回 HTML、请求失败、模型数不足 20 个或相对上次有效模型数减少超过一半，任务失败且旧目录保留；不把错误数据投放给客户。

## 页面

`app/api/page.tsx` 读取本地已验证快照，`components/ModelCatalog.tsx` 展示精选型号、完整目录、搜索、系列筛选。客户无需提供 Key。模型 ID 列表不等同于客户购买的 Key 都拥有相同权限；也不能将字母/版本排序说成正式发布时间排序。

## 验收边界

- 在 PR 分支取得一次真实 catalog 快照，完成页面交互和构建验证后，才能说预览有完整数据。
- GitHub 定时工作流只有合并到默认分支 main 后才生效；合并前不能宣称生产已经每日运行。
- 不修改现有商城、API 反代和三个工具站。
