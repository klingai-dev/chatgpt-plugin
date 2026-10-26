# Omni-Ref video

Use `omni_ref_video` as the default discovery entry point for ordinary video generation, including text-only, image, keyframe, Element, video, and audio reference requests. Discover the tool and call `who_am_i` as described in the [Kling AI skill](../SKILL.md#model-discovery). Prefer a returned Kling 4.0 video model compatible with the request; the live account response defines the canonical model name and all supported inputs and arguments.

## References and binding

- Identify each reference's intended role: start frame, end frame, identity, product, style, video, or audio. Use only the selected model's declared input names and types. Do not reuse a model name or argument from another tool unless the current tool also declares it.
- For a named Element, list and resolve its real ID, then call `element_get`. Follow [asset workflows](asset-workflows.md#using-elements-in-generation) for both the structured `elements` binding and prompt reference. Verify resource-type support; an Element does not replace a required image.
- Put audio in the model-declared audio input slot. Distinguish music, rhythm, or another supported reference purpose. An audio reference and generated-sound controls are separate settings; enabling sound does not supply audio or guarantee voice cloning or exact dialogue.
- Check required inputs, per-type limits, combined limits, durations, and mutually exclusive settings. Preserve every user-required reference; if the combination is unsupported, explain the restriction before submission.
- Reuse accepted attachment references or complete the live upload workflow. Never submit a local path or invent a media URL.

## Submission

Follow the core submission rules, including any requirement in the current tool description to explain reference-video charges. Do not invent prices. Retain `generationId` and follow the shared progress and result rules. When the host displays the MCP App, use it to show the result. Missing tools, failed discovery, or unsupported references do not authorize a different workflow or another submission.
