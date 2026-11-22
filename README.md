# 在 ChatGPT 和 Codex 中使用可灵 AI（中国区）

在对话里用可灵 AI 生成图片、编辑参考图、制作视频，并查询灵感值和生成进度。本分支 `cn` 使用中国区可灵账号。国际区账号请使用 [main 分支](https://github.com/klingai-dev/chatgpt-plugin/tree/main)。

## 选择接入方式

| 你使用的客户端 | 接入方式 |
| --- | --- |
| ChatGPT 桌面端的 Work 模式 / Codex 桌面端 | [安装桌面插件](#chatgpt--codex-桌面端) |
| Codex CLI | [用两条命令安装插件](#codex-cli) |
| ChatGPT 网页端 | [手动添加 MCP](#chatgpt-网页端) |

同一客户端选择一种接入方式即可。[可灵 MCP & CLI 官方指南（中国区）](https://klingai.com/app/mcp/guide)

### ChatGPT / Codex 桌面端

1. 在当前任务中发送下面的提示词，或自行克隆仓库的 `cn` 分支。

   > 请把 https://github.com/klingai-dev/chatgpt-plugin 的 cn 分支克隆到本地，打开仓库文件夹，并引导我从插件目录安装 Kling AI、连接中国区可灵账号。完成后帮我检查连接和灵感值，先不生成。

2. 在桌面端打开仓库文件夹，重启客户端以加载仓库内的插件市场。在 **插件目录** 中选择 **Kling AI** 市场，安装并启用 **Kling AI**。
3. 打开插件详情，按连接提示登录中国区可灵账号，在可灵页面完成 OAuth 授权。回到客户端，在新对话中选择 **Kling AI**。[OpenAI 桌面插件安装说明](https://developers.openai.com/plugins/build/plugins#build-your-own-curated-plugin-list)

### Codex CLI

```bash
codex plugin marketplace add https://github.com/klingai-dev/chatgpt-plugin.git --ref cn
codex plugin add kling-ai@kling-ai
```

安装后按 Codex 的连接提示完成可灵账号授权。遇到连接问题可查看 [Codex CLI 授权排查](<plugins/Kling AI/skills/kling-ai/references/troubleshooting.md#first-connection-or-expired-authorization>)。

### ChatGPT 网页端

1. 打开 [ChatGPT 插件页](https://chatgpt.com/plugins)，点击 **+ → 添加自定义 MCP 服务器**。是否能添加取决于账号和工作区设置。部分界面的入口为 **设置 → 插件 → 创建**。
2. 名称填 `Kling AI`，服务器 URL 填 `https://klingai.com/mcp/plugin`，认证方式选 **OAuth**。
3. 阅读页面提示并创建，使用中国区可灵账号完成授权。在新对话中通过 `@` 选择 **Kling AI**。[OpenAI 自定义 MCP 配置说明](https://developers.openai.com/plugins/deploy/connect-chatgpt#add-the-mcp-server)

## 检查连接并开始创作

1. 先发一条只读请求确认授权和余额。

   > 请用可灵 AI 检查我的账号连接和可用灵感值，先不生成。

2. 连接成功后，复制一条提示词开始创作。生成使用中国区可灵账号个人空间的付费灵感值。

   - **文生图**　用可灵 AI 生成一张雨后咖啡馆门口的照片，暖色灯光倒映在路面上，画幅 4:5。
   - **文生视频**　用可灵 AI 做一段 5 秒的视频。雨后的咖啡馆亮着暖灯，镜头沿着湿润的路面慢慢推向门口。
   - **图生视频**（先在对话里上传一张照片）　用可灵 AI 把我上传的照片作为首帧，生成 5 秒视频。镜头慢慢推近，保持主体和构图连贯。
   - **查询进度**　请查询可灵任务 `<任务 ID>` 的进度，完成后给我结果链接。

余额不足时，在同一可灵账号充值后回到原对话，说「继续刚才的任务」。如果已有任务 ID，可以先查询进度。[更多示例和模型能力](<plugins/Kling AI/README.md>)

如果插件已连接但对话里找不到工具，刷新客户端或新开对话后重试连接检查。[连接与任务排查](<plugins/Kling AI/skills/kling-ai/references/troubleshooting.md>)

## 开发

本仓库包含插件清单、MCP 配置、技能和图标。插件通过 `https://klingai.com/mcp/plugin` 连接远程服务，本地无需启动服务或构建。

修改后请检查 JSON/YAML 语法、插件清单、技能引用和资源路径，并在目标客户端用只读请求验证账号授权。[维护说明](<plugins/Kling AI/README.md#connection-details-for-maintainers>)
