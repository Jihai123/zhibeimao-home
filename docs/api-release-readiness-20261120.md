# 指北猫 / 智享AI API 上线交接单（2026-11-20）

## 发布范围

PR: https://github.com/Jihai123/zhibeimao-home/pull/19

- 首页：合并「AI 直通与 API 服务」模块；保留原有 LibreChat、ArtChat、AIView 三个独立工具网站，移除重复 API 宣传横幅。
- `/api`：仅展示 API 产品价值、统一 Base URL、模型支持、参考 Key 套餐、购买与接入文档，不再放在线工具卡片。
- `/api/docs`：客户可用的鉴权、模型查询、cURL/Python 代码示例与兼容客户端接入信息，不出现工程验收话术。
- 模型目录：2026-11-20 从聚合官网 `GET https://www.juhenext.com/api/catalog` 实际导入 **117 个模型 ID**（包括图像/视频）；八张卡片突出原生且较新版本，无 `basic/`、`standard/`；完整目录保持 117 条，搜索、分类、加载更多。
- 模型数据：每日北京时间 02:15 的 GitHub Actions `daily-model-catalog.yml`。数据未变不提交；文件损坏、异常减少、网络失败保留已验证数据。
- 未改动 API 反代、现有 Key 购买/余额网站、在线工具登录及计费。

## 已通过门禁（PR head a6a7ed764cc74669b9af8d2bd4b1cfd5c9d377d8）

- GitHub Actions workflow 44704209772：completed / success。
- Node 单元测试：模型格式、数字 ID / name、下载异常、回退保护、最新型号排序与完整数据不丢失。
- Next.js 构建及 TypeScript 检查。
- Chromium 320px / 390px / 1280px：首页、API 页、文档页、移动菜单、外链、117 模型展示、筛选与折叠区域。
- Vercel Preview：该 SHA 的部署状态 success。
- PR #19 mergeable；main 基线 SHA `1745fd3fa9b741e6c91b81bfc6d178358192b5ef`。

## 尚未通过的生产门禁

1. **未合并/未部署生产。** 上述证据均为 PR / Preview 级别，生产验证尚未运行。
2. **每日任务尚未在 main 触发。** GitHub scheduled workflows 仅在默认分支运行。合并后在 Actions 手动触发一次，并核对来源下载、数据数目、提交与 Vercel 是否正常响应；第二天观察定时执行。
3. **历史安全债务：** `package.json` 为 Next.js `14.2.32`，已不在官方支持的 LTS 范围。最近安装日志中 npm audit 报告 18 条依赖告警（其中 1 critical）；升级与验证应独立跟踪。此项在原生产基线也存在，不属于 API 功能本身的新改动，不得宣称已消除。

## 生产发布步骤

1. 以当前 PR head SHA 进行 squash merge 到 main（若 head 变化，重新核对 CI）。
2. 核实 Vercel 生产自动部署成功，记录生产 SHA、部署时间及域名响应。
3. 浏览器真实验收 `https://www.zhibeimao.com/`、`/api`、`/api/docs`：检查桌面/手机导航、文本无截断、无临时工程措辞。
4. API 页检查：117 个目录 ID、八个较新型号卡片、卡片无 `basic/`、`standard/`、搜索/筛选/加载更多。
5. 检查外链：API Key 商城、余额查询、LibreChat/ArtChat/AIView、文档页。只读访问，不执行付费或任何真实 API 扣费。
6. GitHub Actions 手动运行 `Daily model catalog file sync`，核实任务返回 PASS；数据没有变化时应不产生新提交，数据变更时记录提交与自动部署结果。
7. 通过上述验收才把生产 GO 标记完成；发现跳转、数据显示、构建异常，暂停自动更新/回滚页面发布。

## 回滚

- 合并前 main 基线 SHA：`1745fd3fa9b741e6c91b81bfc6d178358192b5ef`。
- 如发生生产故障，通过 GitHub Revert 本次合并提交恢复原页面，禁止强制重置 main。将每日同步 workflow 随回滚提交一并移除或暂停。
- 回滚后复验首页、导航、AI 直通原三站链接、原榜单和资讯，不触碰反代、商城及在线工具数据。

## 约束

- 本文档是内部上线交接资料，不向客户页面展示测试、反代、上游数据来源等内容。
- 「较新版本」按目录中的型号版本规则排序，不声称是厂商官方发布日期排行。
