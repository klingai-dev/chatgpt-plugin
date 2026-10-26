# Remote tool workflows

## Generation

1. Follow the core skill's [connect and verify](../SKILL.md#first-step-connect-and-verify) flow. Use the current host's existing Kling AI connection at `https://kling.ai/mcp/plugin`, then read the current `tools/list`.
2. For video requests, first read [video generation](../SKILL.md#video-generation) and the [Omni-Ref guide](omni-video.md); discover `omni_ref_video` and use only compatible models returned for the account. Create a UUIDv7 `taskTraceId`, call `who_am_i`, and use only the models, arguments, enums, defaults, and inputs declared for the selected tool.
3. When local media is present, upload it with `file_upload` and pass the returned URL under the live input name. Never pass a local path directly to the remote generation tool.
4. Prepare the final settings and briefly describe the planned result. Proceed when the request and required inputs are ready; clarify gaps and respect requests to preview or pause.
5. Call the selected generation tool exactly once with `{model, arguments[], inputs[], rationale, taskTraceId}`, and preserve its `generationId`.
6. When the host displays an MCP App for the generation, let it refresh progress; do not query the same task from the model.
7. Otherwise, use `query_tasks` at the provider-permitted interval until the task finishes, fails, is cancelled, or the turn cannot continue. Stop polling if a response displays the App. Without an App, report the current status and task ID; for successful outputs, provide one primary media link per requested output.

## Read-only operations

- Account and credits: call `query_membership_and_credits` once.
- Task status: call `query_tasks` once; a direct status request does not start long-running polling.
- Model capabilities: call `who_am_i` without creating a task.

## State changes

- Call `element_delete` only after the user explicitly confirms the deletion target.
- Call `logout` only when the user explicitly requests sign-out or account switching. For sign-out alone, remain signed out. For account switching, start the current host's native OAuth flow after successful logout and pause other Kling AI calls until authorization completes.

Never retry a generation automatically.
