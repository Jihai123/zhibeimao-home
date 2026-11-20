# API 产品页模型目录

数据源：服务端使用自有地址 `GET https://api.zhibeimao.com/v1/models`，只提取并公开 `data[].id`。模型 ID 每小时缓存更新。

## 部署配置

在 Vercel 的 `zhibeimao-home` 项目中，为 Preview（验证后为 Production）增加服务端环境变量：

```text
ZHIXIANG_MODEL_CATALOG_KEY=<用于读取模型列表的专用 API Key>
```

不要使用 `NEXT_PUBLIC_` 前缀，不要把真实密钥提交到 GitHub 或展示给浏览器。建议使用单独的低额度查询 Key；页面显示的模型目录反映该查询 Key 的权限，不保证所有客户 Key 有相同权限。

变量配置后重新部署。服务端请求模型列表、校验并去重，只将模型 ID 和归类结果传给页面，提供精选型号、搜索和过滤。模型目录缓存一小时，上游不可用或密钥缺失时回退至原有模型系列卡片，绝不展示虚构的型号或更新信息。

此接口不包含可信的逐模型 Token 价格，不能据此推算或宣传官方价格折扣。对外页面只使用智享AI品牌，不出现上游名称。
