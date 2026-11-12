# Connection and task troubleshooting

## First connection or expired authorization

Installing Kling AI and selecting a skill are separate from connecting a Kling AI account. Do not send the user back to repeat their creative request without explaining the connection step.

1. In the current host, open the installed Kling AI plugin's details and check that it is enabled. Follow its account-connection or reauthorization prompt. Use the native connection action directly when the host exposes one; otherwise guide the user through it. Button labels vary by host and language: name a specific control only when observed or documented for that interface.
2. Sign in to the intended Kling AI account on the provider page, approve the requested access, and return to the chat. The assistant must not collect credentials or complete consent on the user's behalf.
3. Discover tools again and call only `who_am_i` to verify authorization. If the user asked for the credit balance, then call `query_membership_and_credits`. Do not use a generation task as a connection test.
4. Resume the original request after verification. If the host needs a new chat to refresh its tool catalog, explain why and provide the original brief for continuation. Do not claim authorization succeeded based only on installation, an enabled toggle, or the user returning to chat.

In ChatGPT, use the plugin's native connection controls. Do not give terminal commands as ChatGPT sign-in instructions.

In Codex, prefer the plugin's native connection controls. For a CLI user, `codex mcp list` can identify a loaded server. Only when the existing plugin server is listed, use its exact listed name:

```bash
codex mcp login <server-name> \
  --scopes generation.create,generation.read,account.credit.read
```

`<server-name>` is a placeholder for the exact name discovered on that host. If the CLI does not expose the plugin server or says it is unknown, return to the plugin's connection controls. Do not register a second standalone MCP server to make the command work.

Do not substitute an API key, manually pasted token, custom callback, or an unrelated Kling AI connection. Account switching uses the same China endpoint: after successful logout, connect the intended account through the current host's native OAuth flow. If the user asked only to sign out, remain signed out. The host manages OAuth client metadata; do not ask the user to inject `client_name`. If registration or consent fails, report the error without credentials or signed URLs and explain the next supported connection step.

## MCP tools are missing

- Use the host's tool-discovery mechanism before concluding that a tool is absent. Skills can be loaded before their connection's tools are available.
- Check whether Kling AI is installed, enabled, and connected. If it is disconnected or authorization is pending, follow the connection steps above. Do not infer authorization state from an empty tool list.
- If the plugin is enabled and connected, refresh or reopen the current host and start a new chat only if needed to reload its tools. Reopen Codex for a Codex issue; reopen ChatGPT for a ChatGPT issue.
- If tools remain missing, report a plugin loading or connection problem and the observed non-sensitive error. Keep the same China endpoint, `https://klingai.com/mcp/plugin`; do not switch regions, attach an unrelated app, edit credentials, or register another server.
- A CLI server list is a diagnostic aid, not proof that a plugin connection works. A successful authenticated `who_am_i` response is the connection check.

## Parameter or specification validation

- Refresh `tools/list` and `who_am_i` on the same connection. Check the actual request for a nonblank top-level `model`, required `arguments[]` entries such as `prompt`, and required `inputs[]` slots. `image_1` and `first_image` are distinct slots. Use the exact field names and enum values for the selected tool and model.
- If a resolution such as `1080p` is rejected, compare the actual value with the selected model's live enum and applicability conditions. If the requested specification is unavailable, ask the user to choose a supported setting. If the service rejects a value that meets the live constraints, report the mismatch with the trace ID and redacted field details. For host-side diagnosis, compare the model tool call with the actual MCP request and the live schema's `required` fields when available.

## Upload or reference failure

- Refresh the live schema and verify the upload tool and response fields.
- Reuse the upload result exactly in generation inputs and keep the same `taskTraceId`.
- Do not pass local paths, expired signed URLs, or undeclared input names to a remote generation tool.
- If a resource error points to the input, verify the exact slot and compare the outbound `inputs[].url` with the full successful upload response. Recover a valid reference from the original media when available. A fix before any generation call can continue the authorized first submission.
- If the service says to retry using the same generation ID, query only the ID confirmed for this submission. A source task or upload ID cannot identify the new task. If the generation call was sent and its outcome remains unclear, report the unknown creation and billing state and preserve the trace ID. For diagnosis, compare redacted URL summaries across upload, host tool binding, and the outbound MCP request where available. Keep signed URLs and credentials out of logs.

## Task is still running

Follow [task status and results](tool-workflows.md#task-status-and-results). If a refresh fails, report the task ID and latest confirmed state.

## Submission timeout or lost response

When a `generationId` is known, follow the progress rules above. If the submission leaves no known ID, report the actual error and any unknown creation or billing state, then stop. `query_tasks` requires that ID and cannot list account history or recover a task by `taskTraceId`. An unchanged balance or missing history entry does not resolve the state. A new submission requires fresh authorization.

Treat a generic service-unavailable message as a service error even when the outer code is `InvalidParameter`. Use the parameter checks when the response identifies an actual field.

## Queue full or rate limited

Distinguish a full generation queue from a rate-limited status query. Preserve the original settings and any task ID. Report queue or task state only as confirmed by the provider. Stop a rate-limited status check and return the latest confirmed state. If the user later asks to continue, check any existing task first and apply the single-submission rules.

## Insufficient credits

Use the current balance from `query_membership_and_credits` and any explicit service rejection. Plan entitlements cannot stand in for the available balance. Follow [resuming after a top-up](tool-workflows.md#resuming-after-a-top-up) and wait for the user to request continuation.

## Result URL expired

Query the original task ID for a fresh URL. An expired URL does not mean the generated image or video was deleted.
