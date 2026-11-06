# Remote tool workflows

## Generation

1. Follow the core skill's [connect and verify](../SKILL.md#first-step-connect-and-verify) flow. Use the current host's existing Kling AI connection at `https://klingai.com/mcp/plugin`, then read the current `tools/list`.
2. Create or reuse the objective's UUIDv7 `taskTraceId`. Select a compatible pair through [model discovery](../SKILL.md#model-discovery). For video, apply the [video fit rules](omni-video.md).
3. After selecting a pair, prepare reference roles. For generation or requested media preparation, upload required local media with `file_upload` and bind the returned URL under the live input name. Before submission, check the actual arguments and inputs using the [MCP contract](mcp-contract.md).
4. Describe the final settings and apply the core [billing and authorization rules](../SKILL.md#billing-and-single-submission). End at the proposal when the user requested review.
5. When authorized, call the selected generation tool once. If the submission leaves no known `generationId`, follow [submission troubleshooting](troubleshooting.md#submission-timeout-or-lost-response) and stop.
6. When the host displays an MCP App for the generation, let it refresh progress; do not query the same task from the model.
7. Otherwise, use `query_tasks` at the provider-permitted interval until the task finishes, fails, is cancelled, or the turn cannot continue. Stop polling if a response displays the App. Without an App, report the current status and task ID; for successful outputs, provide one primary media link per requested output.

## Read-only operations

- Account and credits: call `query_membership_and_credits` once.
- Task status: call `query_tasks` once with the known `generationId`. A direct status request does not start long-running polling.
- Model capabilities: call `who_am_i` without creating a task.

## State changes

- Call `element_delete` only after the user explicitly confirms the deletion target.
- Call `logout` only when the user explicitly requests sign-out or account switching. For sign-out alone, remain signed out. For account switching, start the current host's native OAuth flow after successful logout and pause other Kling AI calls until authorization completes.

Never retry a generation automatically.
