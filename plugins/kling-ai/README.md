# kling-ai

Kling AI for ChatGPT creates and queries image, video, and motion tasks through an OAuth-protected remote MCP server. The plugin contains the ChatGPT manifest, remote MCP configuration, and three Skills. Generation runs on the remote Kling service.

## Capabilities

- Text-to-image, image-to-image, posters, product visuals, portraits, covers, and controlled variations
- Text-to-video, image-to-video, omni reference video (`omni_ref_video` / 全能参考), keyframes, motion control, product shorts, and storyboard planning
- Asset uploads, Element management, motion library access, credit balance checks, and task status queries
- Explicit generation requests authorize one submission without a redundant confirmation
- Remote MCP App resource rendering in ChatGPT when available, with standard MCP content as the fallback

## MCP and Authorization

ChatGPT always uses the global MCP endpoint: `.mcp.json` → `https://kling.ai/mcp/plugin`. The plugin does not provide a region-switching template or register a second Kling MCP server.

The configuration uses the exact server key `kling-ai` and the minimum required scopes:

```text
generation.create
generation.read
account.credit.read
```

The remote service supplies tools dynamically; neither MCP configuration maintains a static tool list. Video Skills discover `omni_ref_video` and recommend a compatible Kling 4.0 model only when returned for the current account. A missing remote tool must be reported as a connection limitation, not simulated by editing the manifest.

## Connect

The plugin is named `kling-ai`. Its bundled `.mcp.json` registers one remote HTTP server named `kling-ai` and uses ChatGPT-managed OAuth.

Complete OAuth through the connection offered by ChatGPT. Do not paste API keys, tokens, cookies, or authorization headers into chat.

## Skills

| Skill | Purpose |
| --- | --- |
| `$kling-ai` | OAuth, accounts, assets, Elements, status queries, cross-media routing, and safety contracts |
| `$kling-ai-generate-image` | Text-to-image, image-to-image, composition, prompting, and image quality gates |
| `$kling-ai-generate-video` | Text-to-video, image-to-video, omni reference video, keyframes, motion control, duration, and shot planning |

## Generation Contract

1. Call `who_am_i` before generation and use only the canonical models, parameters, enums, and inputs returned at runtime.
2. Process local assets with the remote upload tool first. Reuse the same UUIDv7 `taskTraceId` for uploads, generation, and queries that serve the same goal.
3. For a clear generation request, check and briefly state the final workflow, model, prompt summary, resolution or duration, aspect ratio, output count, and reference roles, then submit in the same turn without another confirmation. Ask only if intent or necessary inputs are unclear, or honor an explicit preview/wait request.
4. Call a generation tool at most once for each explicit generation request. Do not retry automatically after a failure, timeout, or ambiguous result.
5. After receiving a `generationId`, use only `query_tasks` to check it and present the ID to the user as the task number.
6. When ChatGPT renders the MCP App, do not duplicate media or download links outside the App. When the App is not rendered, provide only the text fallback from the same call and one primary result link.

## Examples

Read-only account check:

> `$kling-ai` Check the current authorization and credit balance. Do not create a generation task.

Image generation:

> `$kling-ai-generate-image` Create a 4:5 product poster featuring a glass perfume bottle in a deep-red studio with soft rim lighting and copy-safe space in the upper-right corner.

Video generation:

> `$kling-ai-generate-video` Create a continuous 5-second, 16:9 shot: outside a convenience store on a rainy night, a vintage motorcycle slowly stops as the camera smoothly pushes in.

Task query:

> `$kling-ai` Check the current status of this task number exactly once. Do not create a new task.

## Validation

From the repository root, run `node scripts/validate-plugin.mjs`.
This checks package structure, manifests, the single Global endpoint, local references, and Skill declarations. It does not submit billable tasks or verify OAuth.

## License

MIT. Kling AI and related marks are the property of their respective owners.

## Native MCP compatibility and authorization

The portable entry uses `plugin.json` and `mcp.json`; the native compatibility entry uses `.codex-plugin/plugin.json` and `.mcp.json`. Both select the same Global server. No ChatGPT QA App binding is required.

The current desktop transport parser rejects server-level `extensions` in `mcp.json` with `unknown field extensions, expected url or headers`. Keep this portable server configuration limited to the supported transport fields. OAuth remains managed by Codex; native requested scopes remain in `.mcp.json`.

Before generation, the Skill checks `who_am_i`. An authenticated response reuses the current authorization. An authorization error calls for the native OAuth connection flow, followed by another read-only check. Missing tools require checking plugin loading before asking the user to log in.

Run the regression checks from the repository root:

```bash
python3 -m unittest discover -s tests -p test_codex_mcp_compatibility.py
```
