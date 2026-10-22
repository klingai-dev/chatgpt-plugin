# Kling AI for Codex

Create images and videos with Kling AI through a remote, OAuth-protected MCP connection and three bundled Skills. This repository distributes the Global plugin using `https://kling.ai/mcp/plugin`.

## Install

```bash
codex plugin marketplace add https://github.com/klingai-dev/chatgpt-plugin.git --ref main
codex plugin add kling-ai@kling-ai
```

After installation, open a new Codex task and complete the Kling account authorization offered by Codex. Never paste credentials into chat. Installation alone does not confirm OAuth or generation access.

Ask: “Use Kling AI to check my account and available models. Do not generate anything.”

Every billable generation requires explicit confirmation and one submission per confirmed request.

See [plugin usage and capabilities](plugins/kling-ai/README.md).

## Local validation

```bash
node scripts/validate-plugin.mjs
```

This repository contains the plugin configuration, Skills, and assets. The remote Kling service provides tools and MCP App resources; no local server or build is required.
