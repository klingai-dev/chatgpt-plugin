# Kling AI for ChatGPT and Codex

Generate images, edit reference images, create videos, and check credits and task progress from your chat. This branch (`main`) uses Kling AI Global accounts. For a China-region account, use the [`cn` branch](https://github.com/klingai-dev/chatgpt-plugin/tree/cn).

## Choose how to connect

| Client | Setup |
| --- | --- |
| ChatGPT desktop in Work mode or Codex desktop | [Install the desktop plugin](#chatgpt-and-codex-desktop) |
| Codex CLI | [Install the plugin from the terminal](#codex-cli) |
| ChatGPT on the web | [Add a custom MCP server](#chatgpt-on-the-web) |
| VS Code with GitHub Copilot | [Install the regional MCP server](#vs-code-and-github-copilot) |

Choose one setup method per client. [Official Kling MCP & CLI guide](https://kling.ai/app/mcp/guide)

### ChatGPT and Codex desktop

1. Send the following prompt in your current task or clone the repository's `main` branch yourself.

   > Clone the main branch of https://github.com/klingai-dev/chatgpt-plugin, open the repository folder, and guide me through installing Kling AI from the Plugins Directory and connecting my Kling AI Global account. Then check the connection and credit balance without generating anything.

2. Open the repository folder in the desktop app and restart the app to load the repository's marketplace. In the **Plugins Directory**, choose the **Kling AI** marketplace, then install and enable **Kling AI**.
3. Open the plugin details and follow the connection prompt. Sign in to Kling AI Global and approve access on the Kling AI page. Return to the app and select **Kling AI** in a new chat. [OpenAI desktop plugin setup](https://developers.openai.com/plugins/build/plugins#build-your-own-curated-plugin-list)

### Codex CLI

```bash
codex plugin marketplace add https://github.com/klingai-dev/chatgpt-plugin.git --ref main
codex plugin add kling-ai@kling-ai
```

After installation, follow Codex's connection prompt to authorize your Kling AI Global account. [CLI connection troubleshooting](<plugins/Kling AI/skills/kling-ai/references/troubleshooting.md#first-connection-or-expired-authorization>)

### ChatGPT on the web

1. Open [ChatGPT Plugins](https://chatgpt.com/plugins), select **+**, then **Add custom MCP server**. Availability depends on your account and workspace settings. In some versions, the entry is under **Settings → Plugins → Create**.
2. Name it `Kling AI`, enter `https://kling.ai/mcp` as the server URL, and select **OAuth**.
3. Review the prompt, create the plugin, and authorize your Kling AI Global account. In a new chat, use `@` to select **Kling AI**. [OpenAI custom MCP setup](https://developers.openai.com/plugins/deploy/connect-chatgpt#add-the-mcp-server)

### VS Code and GitHub Copilot

Use the VS Code MCP gallery links to open the official regional entry, review its tools and permissions, and install it. Complete OAuth with the Kling account for the selected region. Generation uses credits from that account.

- [Kling AI Global MCP](https://vscode.dev/redirect?url=vscode%3Amcp%2Fby-name%2Fio.github.klingai-dev%2Fkling-ai) — `https://kling.ai/mcp/plugin`
- [可灵 AI 中国区 MCP](https://vscode.dev/redirect?url=vscode%3Amcp%2Fby-name%2Fio.github.klingai-dev%2Fkling-ai-cn) — `https://klingai.com/mcp/plugin`

If the link does not open a gallery entry in your VS Code setup, run **Chat: Open Customizations**, choose **MCP Servers**, and add the matching HTTP endpoint directly. See Microsoft's [VS Code MCP setup guide](https://code.visualstudio.com/docs/agent-customization/mcp-servers).

## Check the connection and start creating

1. Start with a read-only check.

   > Check my Kling AI connection and credit balance. Do not generate anything.

2. Once the check succeeds, try one of these prompts. Generation uses paid credits from your Kling AI Global account's Personal workspace.

   - **Text to image** — Use Kling AI to generate a 4:5 photo of a café entrance after the rain, with warm lights reflected on the pavement.
   - **Text to video** — Use Kling AI to create a 5-second video of a warmly lit café after the rain. The camera slowly moves along the wet pavement toward the door.
   - **Image to video** (upload a photo first) — Use my uploaded photo as the first frame of a 5-second Kling AI video. Slowly move the camera closer while keeping the subject and composition consistent.
   - **Task status** — Check the status of Kling AI task `<task ID>` and share the result link when it completes.

If you run out of credits, top up the same Kling AI account and return to the original chat. Say “Continue the previous task.” The assistant checks any existing task before considering a new submission. [More examples and model capabilities](<plugins/Kling AI/README.md>)

If the plugin is connected but its tools are missing, refresh the app or open a new chat and repeat the connection check. [Connection and task troubleshooting](<plugins/Kling AI/skills/kling-ai/references/troubleshooting.md>)

## Development

This repository contains plugin manifests, MCP connection settings, skills, and icons. The plugin connects to the remote service at `https://kling.ai/mcp/plugin` and runs without a local server or build step.

After editing, check JSON and YAML syntax, matching manifest metadata, skill references, and asset paths. Verify account authorization in the intended client with a read-only connection check. [Maintainer notes](<plugins/Kling AI/README.md#connection-details-for-maintainers>)
