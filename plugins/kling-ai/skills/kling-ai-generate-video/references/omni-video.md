# Omni reference video

Use `omni_ref_video` as the default discovery entry point for ordinary video generation, including text-only, image, keyframe, Element, video, and audio reference requests. Discover the tool and call `who_am_i` as described in the [core Skill](../../kling-ai/SKILL.md#model-discovery). Prefer a returned Kling 4.0 video model compatible with the request; the live account response defines the canonical model name and all supported inputs and arguments.

## References and binding

- Assign each supplied asset its intended role: first frame, tail frame, identity, product, style, video reference, or audio reference. Use only the selected model's declared input names and types. Do not move arguments or models between video tools.
- For a named Element, list and resolve its real ID, then call `element_get`. Follow [asset workflows](../../kling-ai/references/asset-workflows.md#using-elements-in-generation) for both the structured `elements` binding and prompt reference. Verify resource-type support; an Element does not replace a required image.
- Put audio in the model-declared audio input slot. Distinguish music, rhythm, or another supported reference purpose. An audio reference and generated-sound controls are separate settings; enabling sound does not supply audio or guarantee voice cloning or exact dialogue.
- Check required inputs, per-type limits, combined limits, durations, and mutually exclusive settings. Preserve every user-required reference; if the combination is unsupported, explain the restriction before submission.
- Reuse accepted attachment references or complete the live upload workflow. Never submit a local path or invent a media URL.

## Submission

Follow the core generation authorization and single-submission rules, including any live tool requirement to explain reference-video billing. Do not invent prices. Preserve `generationId`, use the shared status workflow, and let the MCP App own result rendering when mounted. Missing tools, failed discovery, or unsupported references do not authorize automatic fallback or another generation.
