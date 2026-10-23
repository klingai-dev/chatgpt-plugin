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

## Upload failure

- Refresh the live schema and verify the upload tool and response fields.
- Reuse the upload result exactly in generation inputs and keep the same `taskTraceId`.
- Do not pass local paths, expired signed URLs, or undeclared input names to a remote generation tool.

## Task is still running

When the host displays an MCP App for the generation, let it refresh progress and do not poll the same task from the model. Otherwise, use `query_tasks` at the provider-permitted interval. Stop polling if the task finishes or fails, an App is displayed, the user cancels, or the turn cannot continue. Report the current status and task ID. A later explicit status request can call `query_tasks` once.

## Submission timeout or lost response

Do not call the generation tool again. If a `generationId` is known, query it once. Otherwise report that creation state is unknown; the current MCP cannot list account history or recover a task by `taskTraceId`. Stop and wait for a new explicit user request to retry before any new submission. Do not treat the original request as authorization to retry.

## Result URL expired

Query the original task ID for a fresh URL. An expired URL does not mean the generated image or video was deleted.
