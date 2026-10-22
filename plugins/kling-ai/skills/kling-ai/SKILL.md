---
name: kling-ai
description: Create, query, and manage Kling AI image and video tasks through the OAuth-protected MCP in Codex. Use for text-to-image, image-to-image, text-to-video, image-to-video, omni reference video, keyframes, motion control, uploads, Elements, credit checks, task status, and account switching.
---

# Kling AI for Codex

Use only the remote Global MCP configured by this Codex plugin: `https://kling.ai/mcp/plugin`. Do not switch regions, register a second Kling MCP, or start or depend on a local MCP server.

## Request routing

- Route text-to-image, image-to-image, posters, covers, product stills, portraits, and image variants to `kling-ai-generate-image`.
- Route text-to-video, image-to-video, omni reference video (全能参考), keyframes, motion control, animation, camera movement, storyboards, and video concepts to `kling-ai-generate-video`. Read that Skill before selecting a video tool or model.
- Keep OAuth, sign-out or account switching, uploads, the motion library, Elements, credit checks, cross-media requests, and task-status requests in this Skill.
- Follow up on an existing task with `query_tasks`; do not create a replacement generation.

An attachment does not determine its role. When the user has not specified one, ask only which materially relevant role it serves: first frame, tail frame, identity or product reference, editable source, motion source, or style reference.

## Codex connection boundary

- Use OAuth managed by the Codex MCP connection. Never request an API key, token, cookie, authorization header, or credential file. Never log private account fields or signed URLs.
- OAuth dynamic client registration uses `client_name: "Plugin-Codex"`. This is OAuth metadata, not a tool argument, URL parameter, or secret. If the host cannot inject it, stop before authorization and report the limitation.
- The native `.mcp.json` and portable `mcp.json` must both retain the same single Global endpoint, `https://kling.ai/mcp/plugin`. Let Codex load the appropriate package entry; do not register a second standalone Kling server or add a regional-switching flow.
- Create one RFC 4122 UUIDv7 `taskTraceId` for each unrelated new objective. Reuse it across discovery, upload, generation, and querying for the same objective. Present `generationId` to the user as the task number; do not expose `taskTraceId` unless troubleshooting requires it.

## Model discovery

- Read all pages of the current tool list. Discover `omni_ref_video` explicitly for ordinary video requests, including text, images, keyframes, Elements, and audio references. Use `motion_control` for motion transfer or another entry point explicitly requested by the user.
- Call `who_am_i` with `tools: ["omni_ref_video"]` only when its live schema declares that filter; otherwise read the full response. Recommend a returned Kling 4.0 video model when it meets the request; use only canonical names or aliases actually returned for this account and tool.
- Tool presence, examples, or a default model name do not establish model access. If a requested model is absent from a filtered response, inspect the other discovered generation entry points before reporting it unavailable; preserve the requested output type.
- If discovery fails or the omni tool is missing, report the connection limitation. Do not silently fall back, change regions, or invent a local tool registration.

## Billing and single submission

- Image, video, and motion generation consume Kling credits. Call `who_am_i` before submission and use its live model and argument definitions. If the remote `mcpVersion` is newer than the current tool snapshot, ask the user to refresh the plugin and continue in a new task.
- A clear user request to generate an image or video authorizes that one billable generation. Check the live settings, briefly state the workflow, model, prompt summary, resolution or duration, aspect ratio, output count, and reference roles, then submit in the same turn without asking the user to confirm again. Use the declared defaults for unspecified optional settings. Ask only when generation intent or necessary inputs are unclear, or when the user explicitly requests a preview or approval step. A read-only query, account check, upload, or request for a draft is not generation authorization.
- Submit at most once per explicit generation request. Never retry automatically or silently change models after a failure, timeout, ambiguous response, or rendering problem.
- An accepted task is not a completed work. Claim completion only after a terminal-success result has at least one usable primary media URL; if work-level status exists it must be successful, and a video cover alone is not a completed video.
- After receiving a `generationId`, use only `query_tasks` for status. If the submission response is lost before a `generationId` is known, stop and report that creation state is unknown; the current MCP cannot list account history or recover a task by `taskTraceId`.

Read [tool workflows](references/tool-workflows.md), the [MCP contract](references/mcp-contract.md), and [asset workflows](references/asset-workflows.md) before generation, Element management, motion-library use, or local media preparation. Read [troubleshooting](references/troubleshooting.md) only after an authorization, schema, upload, or provider failure.

## Workflow

1. Classify the request as generation, motion control, Element management, account mutation, or read-only query.
2. Read the current remote tool definitions. Before generation or motion control, call `who_am_i` and use only the canonical model name, arguments, defaults, enums, and media inputs declared for the selected model.
3. For Element, motion-library, or upload requests, follow [asset workflows](references/asset-workflows.md); these operations do not implicitly create a generation task.
4. Fill only creative details that materially affect the result. Do not invent models, fields, or values from memory.
5. When local media is required, upload it first and reuse the returned provider reference exactly as the live schema requires. Upload completion does not itself authorize generation.
6. For an explicit generation request, call the selected generation tool exactly once without a second confirmation and preserve both `generationId` and `taskTraceId`.
7. If ChatGPT mounts the generation MCP App, that App is the sole refresh owner and calls headless `query_tasks` internally; do not poll the same task from the model. If no App mounts, poll with headless `query_tasks` at the provider-permitted interval until terminal, cancelled, or the turn cannot continue.
8. For a direct request about an existing task, call `query_tasks` once and report the current state. Do not start a new generation or long-running polling loop.
9. When ChatGPT renders an MCP App resource returned by Kling, treat the App as the only media preview. Do not add Markdown image/video syntax, a separate media attachment, a thumbnail, or a duplicate download link outside the App. Only when no App is rendered may you return the same call's text fallback and one primary result link.
10. Call `element_delete`, `logout`, or account switching only when the user explicitly requests the state change. Account switching stays on the same Global endpoint. When logout requires sign-in again, immediately use the native Codex OAuth flow and call no other Kling tool until authorization completes.

## Quality defaults

Apply these defaults only when the user did not specify another choice and the live schema supports them:

- Model: prefer a full-quality model compatible with the requested mode and references. Prefer Turbo, fast, or low-cost models only when the user explicitly prioritizes drafts, speed, or credit savings.
- Image resolution: prefer `2k` for normal delivery, `4k` for commercial work, advertising, fine materials, or crop-heavy post-production, and `1k` only for drafts or speed. Never lower a higher live default.
- Video resolution: prefer `1080p` for normal delivery and `4k` for supported commercial, large-screen, or post-production work. Use `720p` for drafts, speed, cost, or model limitations.
- Output count: generate one result unless the user requests more.
- Duration: use about 5 seconds for one action or shot, about 10 seconds for dialogue, a complete product action, or two connected beats, and longer only when supported and narratively necessary.
- Aspect ratio: use `9:16` for vertical shorts, `1:1` for square feeds, and `16:9` for landscape ads or web. For image-to-video, preserve the first frame unless the live tool requires an explicit ratio.

## Native connection and authorization

- Discover the plugin's `who_am_i` before creation and use it for a read-only connection check. If it succeeds, continue with the existing authorization; do not ask the user to sign in again.
- If the native MCP reports an authorization error, guide the user through the Codex-managed OAuth connection for `kling-ai`, then repeat only `who_am_i`. Never submit a generation to test authorization.
- If Kling tools are absent, report a plugin loading problem. Signing in cannot repair a configuration that Codex did not load. Do not bind a QA App, add another server, copy credentials, or claim that an unrelated connection validates this plugin.

## Failure behavior

- Unauthorized: use the native Codex MCP connection or `codex mcp login kling-ai --scopes generation.create,generation.read,account.credit.read`, then continue only after authorization succeeds.
- Unsupported argument: refresh the live tool definitions and change only the rejected field. Report the revised settings and stop. Submit again only after a new explicit user request to retry; do not retry automatically.
- Insufficient credits or provider failure: report the provider message and task number, then stop. Do not retry automatically.
- Expired result URL: query the original task number for a fresh URL; do not create a new task.
- Opaque error, unexpected empty result, or billing anomaly: submit one feedback report as directed by the tool description. Feedback is not a retry, refund, or fix.
