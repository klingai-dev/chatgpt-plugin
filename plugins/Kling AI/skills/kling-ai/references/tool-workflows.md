# Remote tool workflows

## Generation

1. Follow the core skill's [connect and verify](../SKILL.md#first-step-connect-and-verify) flow. Use the current host's existing Kling AI connection at `https://klingai.com/mcp/plugin`, then read the current `tools/list`.
2. Create or reuse the objective's UUIDv7 `taskTraceId`. Select a compatible pair through [model discovery](../SKILL.md#model-discovery). For video, apply the [video fit rules](omni-video.md).
3. After selecting a pair, prepare reference roles. For generation or requested media preparation, upload required local media with `file_upload` and bind the returned URL under the live input name. Before submission, check the actual arguments and inputs using the [MCP contract](mcp-contract.md).
4. Describe the final settings and apply the core [billing and authorization rules](../SKILL.md#billing-and-single-submission). End at the proposal when the user requested review.
5. Immediately before an authorized submission, call `query_membership_and_credits` on the same connection. Pause when the current balance cannot be verified or is nonpositive, or when the live estimate for the same settings exceeds it. If the balance check allows submission, submit once. If the outcome is unclear, follow [submission troubleshooting](troubleshooting.md#submission-timeout-or-lost-response).
6. When the service returns a task ID, follow the status rules below. For dependent generation steps, wait for the previous task and required output to succeed before submitting the next step.

## Resuming after a top-up

1. Keep the original intent, tool, model ID, prompt, output settings, reference slots and usable references, `taskTraceId`, submission state, and any confirmed `generationId` in the current chat. If credits are insufficient, report whether the request was paused before submission, rejected by the service, or has an uncertain outcome. Quote a shortfall only when the live service returns an estimate for those same settings.
2. Give the provider's official top-up entry for the current account region if the connection returns it. Otherwise, direct the user to [Kling AI](https://klingai.com/) to sign in to the same account and open its credit purchase controls. The user completes the purchase. Ask them to return to the same chat and say “Continue the previous task.”
3. If the user only says they topped up, check the balance once. If they explicitly ask to continue, identify the original request, asking which one only if several fit. Query any confirmed `generationId` for that submission first and deliver its status or result. A new submission can proceed only if the original call was never sent or the service confirms that it created no task and charged no credits. For an uncertain submission, follow [submission troubleshooting](troubleshooting.md#submission-timeout-or-lost-response).
4. Use the same account, settings, reference roles, and `taskTraceId`. Revalidate the original model and reference slots against the live schema. Reuse still-valid original references and recover expired references from the original sources. Ask for missing media only if recovery fails. If resuming requires a model or paid setting change, let the user choose before submitting. Apply the current balance check and single-submission rule again.

## Task status and results

- For an explicit status request or a report that a known task produced no visible result, call `query_tasks` once with its `generationId`. Report the snapshot or deliver the completed result. To refresh a result URL, query its original task.
- After submission, let the displayed MCP App refresh progress. If the App is absent, use `query_tasks` at the provider-permitted interval with the same `generationId` until the task succeeds or fails. Stop polling when the App appears, the user cancels, the turn cannot continue, or the service rate limits or fails a query. During ongoing polling, if a resource error explicitly asks to query the same ID later, allow one further status query at the permitted interval and stop if the error repeats.
- If a refresh fails or tracking ends before completion, return the task ID and the latest confirmed state. Say when the refresh failed. Report the state as unconfirmed only when no state has ever been confirmed. A query failure leaves the original submission in place.
- Report full completion only when the task succeeds and usable outputs meet the requested type and count. Count a work only if it has usable primary media and its status, when supplied, is successful. If a successful task returns fewer usable outputs than requested, report the actual count, such as 2 of 3 images, and deliver the available works. If it returns none, report the missing result and keep the task ID.
- Use the displayed MCP App to preview results. Without it, return one usable primary media link per successful output.

## Read-only operations

- Account and credits: call `query_membership_and_credits` once.
- Task status: follow [task status and results](#task-status-and-results).
- Model capabilities: call `who_am_i` without creating a task.

## State changes

- Call `element_delete` only after the user explicitly confirms the deletion target.
- Call `logout` only when the user explicitly requests sign-out or account switching. For sign-out alone, remain signed out. For account switching, start the current host's native OAuth flow after successful logout and pause other Kling AI calls until authorization completes.

Never retry a generation automatically.
