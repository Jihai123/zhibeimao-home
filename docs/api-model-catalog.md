# 模型目录：聚合网页导出文件每日同步

本功能**不使用** `/v1/models` 做目录来源，不依赖 `ZHIXIANG_MODEL_CATALOG_KEY`。

## 数据链路

1. GitHub Actions 每天北京时间 **02:15** 运行 `.github/workflows/daily-model-catalog.yml`（仅合入 main 后生效）。
2. 从聚合网页实际提供的**文件下载 URL**获取模型名单。URL 保存在仓库 Actions Variables：`MODEL_CATALOG_DOWNLOAD_URL`。
3. `scripts/sync-model-catalog.cjs` 读取 JSON、CSV 或单列 TXT，校验并去重模型 ID。
4. 仅在新文件有效、包含至少 20 个模型且未比上次骤降超过 50% 时更新 `data/model-catalog.json`，否则任务失败、旧目录保留。
5. 有效数据提交至 main，由既有 Vercel 自动部署机制发布。API 产品页的 `ModelCatalog` 展示精选型号和搜索/筛选目录。

## 当前阻断

**尚未定位聚合网页实际可下载的模型名单文件 URL。** 在公开 JuheNext 模型页面没有找到直接下载按钮，因此不能捏造 URL。只有获取真实文件 URL，完成一次成功下载、解析与页面验收后，才能标记自动同步为 PASS。

变量配置方法：GitHub 仓库 Settings → Secrets and variables → Actions → Variables，新建 `MODEL_CATALOG_DOWNLOAD_URL`，填入实际 HTTPS 文件地址。支持 `juhenext.com` 与 `juhenextvip.com` 域内地址；若实际文件托管在另一 CDN，先核实并通过 `MODEL_CATALOG_ALLOWED_HOSTS` 显式加入对应域名。

## 安全与正确性边界

- 下载源无 API Key 时不配置任何密钥；URL 不含登录凭据。
- 不把代理来源、测试日志或下载路径展示给网站客户。
- 默认快照空，仅回退显示 8 个模型系列，绝不编造型号。
- 文件中不包含可靠的模型发布日期或计费信息，不据此声称“最新模型排行”或显示逐型号价格。
- 业务接口、商城、三个在线使用网站保持不变。
