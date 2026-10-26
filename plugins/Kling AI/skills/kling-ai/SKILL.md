---
name: kling-ai
description: Generate and edit images, create videos, and check generation progress with Kling AI in ChatGPT and Codex. Use for text-to-image, image-to-image, text-to-video, image-to-video, Omni-Ref video (全能参考), start and end frames, motion control, reference uploads, Elements, credit checks, account connection, and sign-in troubleshooting.
---

# Kling AI

Use the remote MCP server bundled with this plugin: `https://kling.ai/mcp/plugin`. This is the global endpoint. Keep the same endpoint for account switching; do not register a duplicate server or require a local MCP server.

## First step: connect and verify

Apply this check before selecting a generation mode, preparing uploads, or submitting any task. Installing the plugin or selecting a skill does not prove that the user's Kling AI account is connected.

1. Discover this plugin's tools using the host's available tool-discovery mechanism. A tool missing from the initial snapshot may still be discoverable; read all relevant pages before concluding it is absent. If `who_am_i` is available, call it as a read-only connection check. A successful authenticated response means reuse the existing connection without another sign-in.
2. If the host reports a disconnected account, an authorization requirement, or an authentication error, use its native connection flow for the existing Kling AI plugin when available. Tell the user to open the installed plugin's details and follow the account-connection prompt, sign in on the Kling AI page, review and approve the requested access, and return to this chat. Button labels vary by host and language; use observed labels rather than promising a specific Connect, Sign in, or Reconnect button. Never ask for credentials in chat or invent an authorization URL.
3. If tools are still absent, check the plugin's installed, enabled, and connected state through the host when available. Missing tools alone do not establish whether the account is authorized. Guide the user to enable the plugin if disabled and connect the account if disconnected. If the state cannot be inspected, say so and give those checks as troubleshooting steps. Do not end with only "refresh the plugin" or "try again."
4. Keep the user's original creative brief. While sign-in is pending, pause remote operations and clearly state that no new generation has been submitted. After the host reports authorization complete, rediscover tools and repeat only `who_am_i`. If the user also requested a credit check, call `query_membership_and_credits` after authorization succeeds. Claim that the connection works only after an authenticated response.
5. Once verified, continue the original request without requiring the user to repeat it. If the host requires a new chat to load tools, explain that limitation and provide a short copyable continuation of the original brief. If the plugin is enabled and connected but tools remain missing, follow [connection troubleshooting](references/troubleshooting.md); report the observed loading error without claiming that another sign-in will fix it.

Use the user's language. When the account is known to be disconnected, a suitable Chinese message is: “还需要连接你的 Kling AI 账号。请打开已安装的 Kling AI 插件详情，按页面提示连接账号，在可灵页面登录并确认授权后回到这里。我会先检查连接，再继续刚才的请求。目前尚未提交新的生成任务。” If connection status is unknown, say “当前还无法确认账号是否已连接” instead. Only say you opened an authorization flow when the host actually did so.

## Request routing

- For text-to-image, image-to-image, posters, covers, product stills, portraits, and image variants, follow [image generation](#image-generation).
- For text-to-video, image-to-video, Omni-Ref video (全能参考), start and end frames, motion control, animation, camera movement, storyboards, and video concepts, follow [video generation](#video-generation). Read [Omni-Ref video](references/omni-video.md) before selecting a video tool or model.
- For OAuth, sign-out or account switching, uploads, the motion library, Elements, credit checks, cross-media requests, and task-status requests, use the shared workflow below.
- Follow up on an existing task with `query_tasks`; do not create a replacement generation.

Identify each attachment's role from the request: start frame, end frame, identity or product reference, image to edit, motion source, or style reference. Ask only when the role is ambiguous and would change the result.

## Connection boundaries

- Use OAuth managed by the current host's plugin connection. Never request an API key, token, cookie, authorization header, or credential file. Never log private account fields or signed URLs.
- The host manages OAuth client registration and its metadata. Do not require the model or user to inject `client_name`, edit OAuth requests, or supply a client secret before starting the native sign-in flow. Report an actual registration failure through [troubleshooting](references/troubleshooting.md).
- The native `.mcp.json` and portable `mcp.json` must both retain the same single global endpoint, `https://kling.ai/mcp/plugin`. Let the host load the appropriate package entry; do not register a second standalone Kling AI server or add a region-switching flow.
- Create one UUIDv7 `taskTraceId` for each unrelated new objective. Reuse it across discovery, upload, generation, and querying for the same objective. Present `generationId` to the user as the task ID; do not expose `taskTraceId` unless troubleshooting requires it.

## Model discovery

- Read all pages of the current tool list. Discover `omni_ref_video` explicitly for ordinary video requests, including text, images, keyframes, Elements, and audio references. Use `motion_control` for motion transfer or another entry point explicitly requested by the user.
- Call `who_am_i` with `tools: ["omni_ref_video"]` only when its live schema declares that filter; otherwise read the full response. Recommend a returned Kling 4.0 video model when it meets the request; use only canonical names or aliases actually returned for this account and tool.
- Tool presence, examples, or a default model name do not establish model access. If a requested model is absent from a filtered response, inspect the other discovered generation entry points before reporting it unavailable; preserve the requested output type.
- If discovery fails or the omni tool is missing, report the connection limitation. Do not silently fall back, change regions, or invent a local tool registration.

## Billing and single submission

- Image and video generation, including motion control, use Kling AI credits. Call `who_am_i` before submission and use its live model and argument definitions. If both version values are available and the returned `mcpVersion` is newer than the cached tool version, explain that the tool list needs refreshing and guide the user through the host's supported refresh flow. Do not infer a version mismatch when no cached version is available.
- For a generation request with sufficient information, prepare the live settings, briefly describe the planned result, and proceed with generation. Use the declared defaults for optional settings. Clarify missing intent or necessary inputs, and respect requests to preview or pause. Keep read-only checks, uploads, and draft preparation within their requested scope.
- Submit at most once per explicit generation request. Never retry automatically or silently change models after a failure, timeout, ambiguous response, or rendering problem.
- A submitted task is still in progress. Report completion only when the task has succeeded and returned a usable image or video URL. If individual outputs have statuses, check that the output succeeded too. A video thumbnail does not count as a completed video.
- After receiving a `generationId`, use only `query_tasks` for status. If the submission response is lost before a `generationId` is known, stop and report that creation state is unknown; the current MCP cannot list account history or recover a task by `taskTraceId`.

Read [tool workflows](references/tool-workflows.md), the [MCP contract](references/mcp-contract.md), and [asset workflows](references/asset-workflows.md) before generation, Element management, motion-library use, or local media preparation. Read [troubleshooting](references/troubleshooting.md) only after an authorization, schema, upload, or provider failure.

## Workflow

1. Classify the request as generation, motion control, Element management, account mutation, or read-only query.
2. Read the current remote tool definitions. Before generation or motion control, call `who_am_i` and use only the canonical model name, arguments, defaults, enums, and media inputs declared for the selected model.
3. For Element, motion-library, or upload requests, follow [asset workflows](references/asset-workflows.md); these operations do not implicitly create a generation task.
4. Infer reasonable creative details from the brief; ask only about missing requirements that would materially change the result. Take models, fields, and supported values from the live schema.
5. When local media is required, upload it first and reuse the returned provider reference exactly as the live schema requires. Upload completion does not itself authorize generation.
6. Once the request and required inputs are resolved, call the selected generation tool exactly once and preserve both `generationId` and `taskTraceId`.
7. If the host displays an MCP App for the generation, let it refresh progress; do not poll the same task from the model. Otherwise, use `query_tasks` at the provider-permitted interval until the task finishes, fails, is cancelled, or the turn cannot continue. If a later response displays the App, stop polling from the model.
8. For a direct request about an existing task, call `query_tasks` once and report the current state. Do not start a new generation or long-running polling loop.
9. When the host displays the Kling AI MCP App, use it as the media preview and avoid duplicate media or download links outside it. When no App is displayed, use the tool's text response and provide one primary media link for each requested output.
10. Call `element_delete` or `logout` only when the user explicitly requests deletion, sign-out, or account switching. Account switching stays on the same global endpoint. When switching accounts, start the current host's native OAuth flow after successful logout. For sign-out alone, remain signed out.

## Quality defaults

Apply these defaults only when the user did not specify another choice and the live schema supports them:

- Model: prefer a full-quality model compatible with the requested mode and references. Prefer Turbo, fast, or low-cost models only when the user explicitly prioritizes drafts, speed, or credit savings.
- Image resolution: prefer `2k` for normal delivery, `4k` for commercial work, advertising, fine materials, or crop-heavy post-production, and `1k` only for drafts or speed. Never lower a higher live default.
- Video resolution: prefer `1080p` for normal delivery and `4k` for supported commercial, large-screen, or post-production work. Use `720p` for drafts, speed, cost, or model limitations. Never lower a higher live default.
- Output count: generate one result unless the user requests more.
- Duration: use about 5 seconds for one action or shot, about 10 seconds for dialogue, a complete product action, or two connected beats, and longer only when supported and narratively necessary.
- Aspect ratio: use `9:16` for vertical shorts, `1:1` for square feeds, and `16:9` for landscape ads or web. For image-to-video, preserve the first frame unless the live tool requires an explicit ratio.

## Image generation

Read [prompt construction](references/prompt-construction.md) for reference images, exact copy, branded assets, or controlled variants. Read [image scene patterns](references/image-scene-patterns.md) for product, advertising, portrait, poster, or cover work.

- Use `text_to_image` for a new image. Use `image_to_image` when source media controls identity, product structure, composition, editable content, or style. An attachment alone does not determine the mode.
- Resolve missing requirements that materially affect the result: subject, destination and aspect ratio, required copy, reference roles, protected facts, or output count.
- Upload local images first and use the selected model's declared input names. If an upload fails, explain the problem; do not switch to text-to-image without the user's agreement.
- Build one prompt covering subject, action, environment, composition, lighting, color, materials, camera language, protected facts, and necessary exclusions.
- Text-to-image does not use Elements. Before using an Element with image-to-image, follow [asset workflows](references/asset-workflows.md#using-elements-in-generation), call `element_get`, and choose a model whose live schema supports `elements`. Bind the exact ID in both the prompt and structured `elements` argument.
- State every reference image's role. For edits and variations, apply the requested changes and preserve other details; for a comparison that varies one feature, keep the rest consistent.
- Use `4:5` for portrait feeds when appropriate; otherwise follow the shared resolution, ratio, and output-count defaults. Unless the user requests generated text, prefer a clean image with intentional copy-safe space.
- Treat brand names, logos, faces, product structure, and user-provided copy as protected facts. Never invent performance, price, certification, ingredients, awards, effects, or statistics.

Before the shared single-submission workflow, prepare the mode, model, prompt summary, resolution, ratio, output count, and reference roles. Check focal subject, visual hierarchy, safe area, lighting, and conflicting instructions. Claim visual QA only when the result was actually inspected.

## Video generation

Read [Omni-Ref video](references/omni-video.md) before selecting a tool or model for a new video request. Read [motion and shots](references/motion-and-shots.md) for camera direction, continuity, multi-beat timing, or reference media, and [video scene patterns](references/video-scene-patterns.md) for product, advertising, social, or cinematic work.

- Default to discovering `omni_ref_video` for text, image, keyframe, Element, video, or audio reference requests. Prefer a returned compatible Kling 4.0 video model. Use `motion_control` for motion transfer; use `text_to_video` or `image_to_video` when explicitly requested and supported.
- Resolve missing requirements that materially affect the result: destination and aspect ratio, duration, required references, protected facts, narration or copy, or shot structure.
- Upload local media first and identify each file's role: start frame, end frame, identity or product reference, style reference, or motion source. If an upload fails, explain the problem; do not change generation modes without the user's agreement.
- Build a motion-first prompt covering opening composition, subject action, camera movement, environmental motion, timing, continuity, protected facts, light, materials, and necessary exclusions.
- For `omni_ref_video`, validate reference types, required inputs, per-type and combined limits, and audio or Element support against the selected model. Never infer capabilities from the tool name. The dedicated `text_to_video` tool does not use Elements.
- Pass only reference roles supported by the selected model's live schema. For Elements, the motion library, or motion control, follow [asset workflows](references/asset-workflows.md). Motion control requires a subject image and exactly one motion source: a motion-library ID or a source video. Validate motion direction and duration.
- Follow the shared duration, resolution, ratio, and output-count defaults. For image-to-video, preserve the first-frame composition unless the tool requires an explicit ratio.
- Use one primary camera movement in a five-second shot. Use multiple shots only when location, time, scale, or information state changes. A multi-shot plan is one video task; do not submit one generation per shot without explicit approval for separate tasks.
- Do not add unrequested narration, readable text, extra characters, product claims, prices, endorsements, or certifications.

Before the shared single-submission workflow, prepare the mode, model, prompt summary, duration, resolution, ratio, output count, shot structure, and reference roles. Check that the action fits the duration, camera instructions agree, subjects remain consistent across shots, and shot durations add up to the total. Claim a visual review only when the result was actually inspected.

## Failure behavior

- Unauthorized: follow the first-step connection flow and [host-specific troubleshooting](references/troubleshooting.md). Never submit a generation to test authorization, attach an unrelated app, add another server, or copy credentials.
- Unsupported argument: refresh the live tool definitions and change only the rejected field. Report the revised settings and stop. Submit again only after a new explicit user request to retry; do not retry automatically.
- Insufficient credits or provider failure: report the provider message and task ID when available, then stop. Do not retry automatically.
- Expired result URL: query the original task ID for a fresh URL; do not create a new task.
- Opaque error, unexpected empty result, or billing anomaly: submit one feedback report as directed by the tool description. Feedback is not a retry, refund, or fix.
