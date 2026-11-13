---
name: kling-ai
description: Write Kling AI (可灵) prompts and storyboards, prepare generation settings, or generate and edit images and videos in ChatGPT and Codex. Use for Omni-Ref (全能参考), keyframes, motion control, required reference media, Elements, uploads, task status, credits, and account connection.
---

# Kling AI

Use the remote MCP server bundled with this plugin: `https://klingai.com/mcp/plugin`. This is the China endpoint. Keep the same endpoint for account switching; do not register a duplicate server or require a local MCP server.

## Request routing

Choose the deliverable for this turn before connecting or discovering models.

- **Prompt or storyboard only.** Use [prompt construction](references/prompt-construction.md) for image prompts or [motion and shots](references/motion-and-shots.md) for video prompts and storyboards. Review any supplied prompt before editing it. Preserve requirements such as copy space, reference roles, and shot timing. Return the requested creative work and skip account checks, uploads, model selection, unsolicited generation settings, and invitations to generate.
- **Required asset missing.** Ask for the missing asset and explain its intended role, such as a product image for the first frame. End there. Skip unrelated questions, discovery, and uploads.
- **Final settings for review.** Discover live capabilities and use the relevant prompt guide when preparing a prompt. Show the compatible settings, reference roles, and any required billing disclosure. Defer uploads unless the user also requests media preparation. Wait for authorization to submit.
- **Generate now.** Follow the [shared workflow](#workflow) and the relevant [image](#image-generation) or [video](#video-generation) guidance. Honor authorization already given for the same unsubmitted request and unchanged final settings.
- **Top-up or resume.** Follow [resuming after a top-up](references/tool-workflows.md#resuming-after-a-top-up). A top-up update alone calls for a balance check. An explicit continuation request checks any existing task before preparing a new submission.
- **Existing task status or missing result.** With a known `generationId`, follow the [status rules](references/tool-workflows.md#task-status-and-results). If the ID is unknown, ask for it. Skip model discovery and generation.
- **Account, uploads, motion library, or Elements.** Use the shared connection and asset workflows. Requests to create or update a reusable subject belong to the Element workflow.

Identify each attachment's role from the request. Ask only when the role is ambiguous and would change the result.

## First step: connect and verify

Use this flow when generation preparation or an account operation requires verification, or when the requested remote tool reports an authentication problem. Installing the plugin or selecting a skill does not prove that the user's Kling AI account is connected.

1. Discover this plugin's tools using the host's available tool-discovery mechanism. A tool missing from the initial snapshot may still be discoverable; read all relevant pages before concluding it is absent. If `who_am_i` is available, call it as a read-only connection check. A successful authenticated response means reuse the existing connection without another sign-in.
2. If the host reports a disconnected account, an authorization requirement, or an authentication error, use its native connection flow for the existing Kling AI plugin when available. Tell the user to open the installed plugin's details and follow the account-connection prompt, sign in on the Kling AI page, review and approve the requested access, and return to this chat. Button labels vary by host and language; use observed labels rather than promising a specific Connect, Sign in, or Reconnect button. Never ask for credentials in chat or invent an authorization URL.
3. If tools are still absent, check the plugin's installed, enabled, and connected state through the host when available. Missing tools alone do not establish whether the account is authorized. Guide the user to enable the plugin if disabled and connect the account if disconnected. If the state cannot be inspected, say so and give those checks as troubleshooting steps. Do not end with only "refresh the plugin" or "try again."
4. Keep the user's original creative brief. While sign-in is pending, pause remote operations and clearly state that no new generation has been submitted. After the host reports authorization complete, rediscover tools and repeat only `who_am_i`. If the user also requested a credit check, call `query_membership_and_credits` after authorization succeeds. Claim that the connection works only after an authenticated response.
5. Once verified, continue the original request without requiring the user to repeat it. If the host requires a new chat to load tools, explain that limitation and provide a short copyable continuation of the original brief. If the plugin is enabled and connected but tools remain missing, follow [connection troubleshooting](references/troubleshooting.md); report the observed loading error without claiming that another sign-in will fix it.

Use the user's language. When the account is known to be disconnected, a suitable Chinese message is: “还需要连接你的 Kling AI 账号。请打开已安装的 Kling AI 插件详情，按页面提示连接账号，在可灵页面登录并确认授权后回到这里。我会先检查连接，再继续刚才的请求。目前尚未提交新的生成任务。” If connection status is unknown, say “当前还无法确认账号是否已连接” instead. Only say you opened an authorization flow when the host actually did so.

## Connection boundaries

- Use OAuth managed by the current host's plugin connection. Never request an API key, token, cookie, authorization header, or credential file. Never log private account fields or signed URLs.
- The host manages OAuth client registration and its metadata. Do not require the model or user to inject `client_name`, edit OAuth requests, or supply a client secret before starting the native sign-in flow. Report an actual registration failure through [troubleshooting](references/troubleshooting.md).
- The native `.mcp.json` and portable `mcp.json` must both retain the same single China endpoint, `https://klingai.com/mcp/plugin`. Let the host load the appropriate package entry; do not register a second standalone Kling AI server or add a region-switching flow.
- Create one UUIDv7 `taskTraceId` for each unrelated new objective. Reuse it across discovery, upload, generation, and querying for the same objective. Present `generationId` to the user as the task ID; do not expose `taskTraceId` unless troubleshooting requires it.

## Model discovery

- Discover the full tool schemas through the host. Read all relevant pages before concluding a tool is absent. Compare `text_to_video` and `omni_ref_video` for text-driven video, and `image_to_video` and `omni_ref_video` for image-driven video, when present. Consider the tool named by the user and use `motion_control` for motion transfer.
- Query `who_am_i` for all relevant candidates. Use the `tools` filter only when declared by its live schema. Use only model names or aliases returned for the chosen tool and account. If the connection check already returned the relevant definitions, reuse them while current.
- Match the user's model restriction, output settings, sound, shot requirements, and reference roles to the same tool/model pair before ranking candidates or uploading media. Match Kling 4.0 and Kling 4.0 Flash by their full model names or declared aliases. When no pair fits, report the unmet requirement and stop. If discovery fails, resolve the actual connection or tool-loading issue first.

## Billing and single submission

- Image and video generation, including motion control, use Kling AI credits. Call `who_am_i` before submission and use its live model and argument definitions. If both version values are available and the returned `mcpVersion` is newer than the cached tool version, explain that the tool list needs refreshing and guide the user through the host's supported refresh flow. Do not infer a version mismatch when no cached version is available.
- Show the final mode, model, prompt summary, output settings, and reference roles. Include any billing disclosure required by the live tool, such as when input video duration counts toward Omni-Ref billing. An explicit generation request can proceed when the settings and inputs are ready. A preview, an upload, or a credit check by itself does not authorize submission.
- Immediately before each paid generation call, including `text_to_image` and `image_to_image`, use `query_membership_and_credits` on the same connection. Pause if the current balance is unavailable, nonpositive, or insufficient for a live estimate of the same settings. Keep the request in the current chat and follow the [top-up workflow](references/tool-workflows.md#resuming-after-a-top-up) for insufficient credits. A positive balance alone cannot establish affordability when the service returns no estimate.
- Submit at most once per explicit generation request, including a rejected attempt. Any retry requires fresh authorization.
- With a known `generationId`, use only `query_tasks` for status. If a submission leaves no known ID, report the returned error and any unknown creation or billing state, then stop. Do not call or offer `query_tasks` without an ID. It cannot list task history or recover a task by `taskTraceId`. A balance check or missing history entry cannot establish whether the submission succeeded or consumed credits.
- Report the returned status, known task ID, and effective submitted settings when known. Follow [task status and results](references/tool-workflows.md#task-status-and-results) to confirm the type and count of usable outputs before reporting completion. Keep submission count separate from charged credits. Report an actual charge only from a returned charged amount such as `creditsConsumed`. Describe output quality and sound only if inspected.

Read [tool workflows](references/tool-workflows.md), the [MCP contract](references/mcp-contract.md), and [asset workflows](references/asset-workflows.md) before generation, Element management, motion-library use, or local media preparation. Read [troubleshooting](references/troubleshooting.md) after an authorization, schema, upload, or provider failure.

## Workflow

1. Follow [request routing](#request-routing) and stop at the requested deliverable.
2. For generation preparation, verify the connection and select a compatible pair through [model discovery](#model-discovery).
3. For Element, motion-library, or upload requests, follow [asset workflows](references/asset-workflows.md); these operations do not implicitly create a generation task.
4. Follow the relevant prompt guide to review or write the prompt. Reuse a suitable user prompt verbatim and make only the edits needed for the request. Infer reasonable creative details from the brief and ask only about missing requirements that would materially change the result. Take models, fields, and supported values from the live schema.
5. Once the pair is selected, upload required local media and bind the returned references as the live schema requires. Compare the actual request fields with the user's explicit requirements before submission.
6. Follow [billing and single submission](#billing-and-single-submission) and preserve any returned `generationId` with the objective's `taskTraceId`.
7. Follow [task status and results](references/tool-workflows.md#task-status-and-results). Let a displayed MCP App refresh progress. Without the App, track the same `generationId` at the provider-permitted interval.
8. For a direct request about an existing task, call `query_tasks` once and report the current state or the latest confirmed state if the refresh fails.
9. When the host displays the Kling AI MCP App, use it as the media preview and avoid duplicate media or download links outside it. When no App is displayed, use the tool's text response and provide one primary media link for each requested output.
10. Call `element_delete` or `logout` only when the user explicitly requests deletion, sign-out, or account switching. Account switching stays on the same China endpoint. When switching accounts, start the current host's native OAuth flow after successful logout. For sign-out alone, remain signed out.

## Quality defaults

Apply these defaults only during generation preparation, when the user did not specify another choice and the live schema supports them.

- Image model: prefer the selected tool's live `defaultModel` when it supports the request. If the user explicitly requests the default, validate the request against that model's live capabilities and explain any unsupported settings. Otherwise, choose another compatible model when the default does not fit.
- Video model: prefer a compatible Kling 4.0 model on `omni_ref_video` when the user leaves the model open. If it does not fit, use a compatible live default or another compatible full-quality model. Prefer Flash or another speed-focused or low-cost model when the user prioritizes drafts, speed, or credit savings and the model fits the request.
- Image resolution: prefer `2k` for normal delivery, `4k` for commercial work, advertising, fine materials, or crop-heavy post-production, and `1k` only for drafts or speed. Never lower a higher live default.
- Video resolution: prefer `1080p` for normal delivery and `4k` for supported commercial, large-screen, or post-production work. Use `720p` for drafts, speed, cost, or model limitations. Never lower a higher live default.
- Output count: generate one result unless the user requests more.
- Duration: use about 5 seconds for one action or shot, about 10 seconds for dialogue, a complete product action, or two connected beats, and longer only when supported and narratively necessary.
- Aspect ratio: use `9:16` for vertical shorts, `1:1` for square feeds, and `16:9` for landscape ads or web. For image-to-video without a requested ratio, preserve the first-frame composition unless the live tool requires a ratio. Pass an explicitly requested ratio when supported, including with a first frame.

## Image generation

Read [prompt construction](references/prompt-construction.md) to review or write the prompt for each new image generation, edit, or variation. Read [image scene patterns](references/image-scene-patterns.md) for product, advertising, portrait, poster, or cover work.

- Use `text_to_image` for a new image. Use `image_to_image` when source media controls identity, product structure, composition, editable content, or style. An attachment alone does not determine the mode.
- Resolve missing requirements that materially affect the result: subject, destination and aspect ratio, required copy, reference roles, protected facts, or output count.
- For a connected image series, require explicit series support and the requested count in one task, even when a model can return multiple outputs. Set the declared count and series controls when available. Explain the limitation if no eligible model supports it.
- Upload local images when needed and bind them to the selected model's declared slots, including `image_1` when required. Use the schema's exact `inputType` value, including uppercase `URL` when declared. If an upload fails, explain the problem; do not switch to text-to-image without the user's agreement.
- Text-to-image does not use Elements. Before using an Element with image-to-image, follow [asset workflows](references/asset-workflows.md#using-elements-in-generation), call `element_get`, and choose a model whose live schema supports `elements`. Bind the exact ID in both the prompt and structured `elements` argument.
- State every reference image's role. For edits and variations, apply the requested changes and preserve other details; for a comparison that varies one feature, keep the rest consistent.
- Use `4:5` for portrait feeds when appropriate; otherwise follow the shared resolution, ratio, and output-count defaults. When writing a new prompt for an image without text, prefer intentional copy-safe space.
- Treat brand names, logos, faces, product structure, and user-provided copy as protected facts. Never invent performance, price, certification, ingredients, awards, effects, or statistics.

Before the shared single-submission workflow, prepare the mode, model, prompt summary, resolution, ratio, output count, and reference roles. Check focal subject, visual hierarchy, safe area, lighting, and conflicting instructions. Claim visual QA only when the result was actually inspected.

## Video generation

Read [video model fit and Omni-Ref](references/omni-video.md) before selecting a video pair, especially for sound, shot control, and references. Read [motion and shots](references/motion-and-shots.md) to review or write the prompt for each new video generation, edit, or variation. Read [video scene patterns](references/video-scene-patterns.md) for product, advertising, social, or cinematic work.

- Resolve missing requirements that materially affect the result: destination and aspect ratio, duration, required references, protected facts, narration or copy, or shot structure.
- Preserve each reference role when selecting and binding inputs. A required first frame needs a first-frame input. If an upload fails, explain the problem and stop before submission.
- Validate explicit specifications such as `1080p` against the selected tool and model's live resolution enum and conditions before submission.
- Pass only reference roles supported by the selected model's live schema. For Elements, the motion library, or motion control, follow [asset workflows](references/asset-workflows.md). Motion control requires a subject image and exactly one motion source: a motion-library ID or a source video. Validate motion direction and duration.
- When planning shots, default to one primary camera movement in a five-second shot. Use multiple shots when requested or when location, time, scale, or information state changes. A multi-shot plan is one video task; do not submit one generation per shot without explicit approval for separate tasks.
- Do not add unrequested narration, readable text, extra characters, product claims, prices, endorsements, or certifications.

Before the shared single-submission workflow, prepare the mode, model, prompt summary, duration, resolution, ratio, output count, shot structure, and reference roles. Check that the action fits the duration, camera instructions agree, subjects remain consistent across shots, and shot durations add up to the total. Claim a visual review only when the result was actually inspected.

## Failure behavior

- Unauthorized: follow the first-step connection flow and [host-specific troubleshooting](references/troubleshooting.md). Never submit a generation to test authorization, attach an unrelated app, add another server, or copy credentials.
- Unsupported argument or resource error: follow [parameter validation](references/troubleshooting.md#parameter-or-specification-validation) or [upload and reference troubleshooting](references/troubleshooting.md#upload-or-reference-failure). Preserve the original prompt, mode, and reference roles when correcting a rejected field.
- Insufficient credits: preserve the original request and follow [resuming after a top-up](references/tool-workflows.md#resuming-after-a-top-up).
- Provider failure: report the redacted provider message and any confirmed task ID. If the submission outcome is unclear, follow [submission troubleshooting](references/troubleshooting.md#submission-timeout-or-lost-response).
- Expired result URL: query the original task ID for a fresh URL; do not create a new task.
- Opaque error or unexpected empty result: report the known error and unresolved state. For a separate billing anomaly, follow the live tool's feedback instructions.
