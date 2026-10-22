---
name: kling-ai-generate-video
description: Generate videos through the Kling AI MCP in ChatGPT. Use for text-to-video, image-to-video, omni reference video (全能参考), keyframes, motion control, product showcases, advertising clips, social videos, cinematic shots, and storyboard planning.
---

# Kling AI video generation

Turn the request into one coherent motion plan and one remote video generation authorized by the user's explicit request. Follow the Codex OAuth, generation authorization, single-submission, status, and result rules in the [core Kling Skill](../kling-ai/SKILL.md).

Read [motion and shots](references/motion-and-shots.md) for camera direction, continuity, multi-beat timing, or reference media. Read [scene patterns](references/scene-patterns.md) for product, advertising, social, or cinematic work. For Elements, the motion library, or local media, also read the core [asset workflows](../kling-ai/references/asset-workflows.md).

Read [omni reference video](references/omni-video.md) before selecting a tool or model for a new video request. Existing-task queries use only the core status workflow.

## Workflow

1. Default to discovering `omni_ref_video` for text, image, keyframe, Element, video, or audio reference requests. Prefer a returned compatible Kling 4.0 video model. Use `motion_control` for motion transfer; use `text_to_video` or `image_to_video` when explicitly requested and supported.
2. Ask only for missing information that materially changes the result: destination and aspect ratio, duration, required references, protected facts, narration or copy, or shot structure.
3. Create or reuse the UUIDv7 `taskTraceId` for this objective, call `who_am_i`, and select a compatible model, duration, resolution, and live arguments.
4. Upload local media first. Distinguish first frame, tail frame, identity or product reference, style reference, and motion source. Never silently degrade modes after an upload failure.
5. Build a motion-first prompt covering opening composition, subject action, camera movement, environmental motion, timing, continuity, protected facts, light, materials, and necessary exclusions.
6. Briefly state the final mode, model, prompt summary, duration, resolution, aspect ratio, output count, shot structure, and reference roles. If the user explicitly requested generation and necessary inputs are available, submit in this turn without asking for another confirmation. Ask only about unclear intent or missing necessary inputs, or honor an explicit user request to preview or wait.
7. Call the selected video or motion tool exactly once and preserve the task number. If its MCP App mounts, let that one App self-refresh and do not call `query_tasks` from the model. If no App mounts, follow the core Skill's headless polling fallback; never resubmit.
8. When ChatGPT renders the MCP App, do not add Markdown media or duplicate links. When no App is rendered, provide one primary video link.

## Mode rules

- For `omni_ref_video`, validate each reference type, required input, per-type and combined limits, and audio or Element support against the selected model. Never infer capabilities from the tool name.
- The dedicated `text_to_video` tool does not use Elements.
- Image-to-video distinguishes first frame, tail frame, identity or product reference, and style reference. Pass only input roles supported by the live schema.
- Motion control requires a subject image. Choose exactly one motion source - a motion-library ID or a source video - as directed by the live tool. Use the core asset workflow to resolve library IDs and validate motion direction and duration.
- A multi-shot plan is one explicitly requested video task. Do not submit one generation per shot unless the user explicitly approves separate tasks.
- A status request uses only `query_tasks`; it does not create a video.

## Quality defaults

- Prefer `1080p` for normal delivery and supported `4k` for commercial, large-screen, or post-production work. Use `720p` for drafts, speed, credit savings, or model limitations. Never lower a higher live default.
- Use about 5 seconds for one action or shot, about 10 seconds for dialogue, a complete product action, or two connected beats, and longer only when supported and narratively necessary.
- For text-to-video, infer `9:16`, `1:1`, or `16:9` from the destination. For image-to-video, preserve the first-frame composition unless the tool requires an explicit ratio.
- Use one primary camera movement in a five-second shot. Use multiple shots only when location, time, scale, or information state changes.
- Do not add unrequested narration, readable text, extra characters, product claims, prices, endorsements, or certifications.

Before submission, internally check whether the action fits the duration, camera instructions conflict, first and tail frame intent is clear, references remain continuous, and multi-shot durations sum correctly. Claim visual QA only when the result was actually inspected.
