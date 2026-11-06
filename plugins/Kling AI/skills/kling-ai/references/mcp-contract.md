# Kling AI MCP input and output contract

This reference records only stable tool-level constraints. Always take models, defaults, enums, required fields, item limits, and media inputs from the current `tools/list` and `who_am_i` response.

## Tool groups

- Discovery and account: `who_am_i`, `query_membership_and_credits`, `logout`
- Generation and status: `text_to_image`, `image_to_image`, `text_to_video`, `image_to_video`, `omni_ref_video`, `motion_control`, `query_tasks`
- Media and reuse: `file_upload`, `motion_library_list`, `element_create`, `element_list`, `element_get`, `element_update`, `element_delete`

Call only tools that exist in the current tool list.

## Generation request

- Generation tools use `model`, `arguments[]`, `inputs[]`, `rationale`, and `taskTraceId`.
- `model` must be a canonical model name returned by `who_am_i` for the selected tool.
- Each `arguments[]` item is `{name, value}`. Pass `value` as a string when required by the tool description, and pass only arguments declared for the selected model.
- Each `inputs[]` item is `{name, inputType, url}`. Obtain names and `inputType` values from the live schema; upload local media before using it.
- `rationale` explains the user's objective and parameter choices. It does not replace the generation prompt.
- `taskTraceId` is a UUIDv7. Reuse it for one objective and create a fresh value for an unrelated objective.

Use current `who_am_i` definitions for the selected pair. Refresh stale definitions before submission. When a tool description conflicts with a model declaration, apply the stricter constraint and stop an unsafe submission.

Bind each requested setting to its own argument when the selected model supports it. For example, if the live schema declares these names and values, a seven-second vertical clip uses:

```json
{
  "arguments": [
    {"name": "prompt", "value": "The creative description..."},
    {"name": "duration", "value": "7"},
    {"name": "aspect_ratio", "value": "9:16"}
  ]
}
```

Apply the same binding to requested resolution, count, and sound controls. Use the live input slots for reference media. A duration mentioned in the prompt alone leaves the actual duration setting unchanged. An equivalent fixed model setting needs no additional argument. Before submission, verify the serialized arguments and inputs against the brief, then use those effective settings in the result summary.

## Stable gates

- `text_to_image` and `text_to_video` do not use Elements. Never pass `elements` or an `<<<id>>>` binding to them.
- Call `element_get` before using an Element. Use an image Element only with a model whose live schema explicitly supports its resource type, including compatible `omni_ref_video` models. Use a video Element only with a video model whose live schema explicitly supports it.
- `motion_control` requires a subject image. Follow the tool description when choosing exactly one motion source: a library `motionId` or a source video.
- When a model requires media from `file_upload`, do not pass a local path or arbitrary external URL directly.
- Never pass an undeclared argument, input name, or enum value.

## Elements

- An image Element uses a cover and the provider-allowed number of secondary images. Do not combine it with a video resource.
- A video Element uses a video resource and may include voice only when the tool allows it. Do not combine it with cover or secondary images.
- Use only tags declared by the tool description.
- Call `element_get` before `element_update`, then update the complete object so omitted fields are not cleared accidentally.
- Obtain explicit user confirmation before deletion or a delete-and-recreate workflow.

## Known results

- A generation submission normally returns `generationId` and `status`, and may return `creditsConsumed`.
- `query_tasks` requires a known `generationId`. It normally returns status, timestamps, and `works[]`. Keep using the known ID when the query response omits it. A work may include primary media, unwatermarked media, and cover URLs. Determine terminal state and media semantics from the live response.
- Signed URLs may expire. Never log them or treat them as permanent asset identifiers.
- For a tool without a public output schema, use the real response as returned. Do not invent fields or success states.
