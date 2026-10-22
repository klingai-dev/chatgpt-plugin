# ChatGPT troubleshooting

## MCP tools are missing

Run `codex mcp list` and verify that exactly one `kling-ai` points to `https://kling.ai/mcp/plugin`. After adding or updating a Skill or MCP configuration, fully quit and reopen ChatGPT, then start a new task to obtain the latest tool snapshot.

## Not authorized

Use native ChatGPT OAuth:

```bash
codex mcp login kling-ai \
  --scopes generation.create,generation.read,account.credit.read
```

Do not substitute an API key, manually pasted token, or custom callback. Account switching remains on the same Global endpoint; after logout, authorize again through native ChatGPT OAuth.

## Upload failure

- Refresh the live schema and verify the upload tool and response fields.
- Reuse the upload result exactly in generation inputs and keep the same `taskTraceId`.
- Do not pass local paths, expired signed URLs, or undeclared input names to a remote generation tool.

## Task is still running

When the generation MCP App is mounted, let that App refresh the task internally and do not call `query_tasks` for the same submission from the model. If no App mounts, use headless `query_tasks` at the provider-permitted interval; if the user cancels or the turn cannot continue, return the current state and task number. A later explicit status request can call `query_tasks` once.

## Submission timeout or lost response

Do not call the generation tool again. If a `generationId` is known, query it once. Otherwise report that creation state is unknown; the current MCP cannot list account history or recover a task by `taskTraceId`. Obtain fresh confirmation before any new submission.

## Result URL expired

Query the preserved task number for a fresh URL. An expired URL does not mean that the generated work was deleted.
