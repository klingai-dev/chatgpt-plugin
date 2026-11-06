# Kling AI for ChatGPT and Codex

Generate images, edit reference images, and create videos with Kling AI. Connect your Kling AI account to use the models and credits available to you.

## Install in Codex

```bash
codex plugin marketplace add https://github.com/klingai-dev/chatgpt-plugin.git --ref main
codex plugin add kling-ai@kling-ai
```

## Connect your Kling AI account

1. Open the installed Kling AI plugin's details in ChatGPT or Codex and make sure it is enabled.
2. Follow the account-connection prompt. Sign in on the Kling AI page, review and approve the requested access, then return to the chat. The controls and their labels depend on the app and language.
3. Ask: “Check my Kling AI connection and credit balance. Do not generate anything.” The assistant will verify the connection before checking your credits.

Installing the plugin or selecting a skill does not connect your Kling AI account. If the tools are unavailable, the assistant should help you check whether the plugin is enabled and the account is connected. Refreshing the app or starting a new chat may be necessary after a connection or plugin update. See [connection troubleshooting](<plugins/Kling AI/skills/Kling AI/references/troubleshooting.md>).

Keep passwords and other credentials on the sign-in page; do not paste them into chat.

## Try it

Ask: “Create a 5-second video of a giant robot landing in a ruined city as the camera moves closer.”

Generation uses Kling AI credits. The assistant submits each requested generation once and asks before retrying a failed or uncertain submission.

See [plugin usage and capabilities](<plugins/Kling AI/README.md>).

## Development

This repository contains plugin manifests, MCP connection settings, skills, and icons. The remote service at `https://kling.ai/mcp/plugin` provides the generation tools; no local server or build is required.

After editing, check JSON/YAML syntax, matching metadata in both manifests, skill references, and asset paths. No validation script or automated test suite is bundled. Test account authorization in the app where the plugin will be used; static checks cannot verify it.
