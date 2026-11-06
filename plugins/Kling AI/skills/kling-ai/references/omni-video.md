# Video model fit and Omni-Ref

Compare compatible dedicated video and Omni-Ref tools using the [live discovery workflow](../SKILL.md#model-discovery). A text-only request can use an Omni-Ref model that accepts zero media inputs. A model's arguments and inputs apply only to its own tool/model pair.

## Sound and shot requirements

- Required silence needs a declared setting that disables sound or an explicit guarantee of silent output. Check both generated sound and retained source sound before ranking candidates. A text-to-video name, an absent audio field, or a prompt requesting silence does not establish this capability.
- Check the selected model's own `arguments` and `inputs` for audio references, generated sound, and original-sound retention. Apply declared dependencies and mutual exclusions such as `enable_audio` versus `keepOriginalSound`. Disable unrequested sound or other content-expanding defaults when a legal off value exists. Omitting `music_prompt` does not guarantee no music.
- For a continuous-shot request, describe the shot in the prompt. If a smart-shot control such as `prefer_multi_shots` only allows `true`, follow the live schema and explain the limit. A fixed true value does not establish that every result has cuts. A hard single-shot requirement needs a declared guarantee before submission.

## References and binding

- Identify each reference's intended role: start frame, end frame, identity, product, style, video, or audio. Use only the selected model's declared input names and types. Do not reuse a model name or argument from another tool unless the current tool also declares it.
- For a named Element, list and resolve its real ID, then call `element_get`. Follow [asset workflows](asset-workflows.md#using-elements-in-generation) for both the structured `elements` binding and prompt reference. Verify resource-type support; an Element does not replace a required image.
- Put audio in the model-declared audio input slot. Distinguish music, rhythm, or another supported reference purpose. An audio reference and generated-sound controls are separate settings; enabling sound does not supply audio or guarantee voice cloning or exact dialogue.
- Check required inputs, per-type limits, combined limits, durations, and mutually exclusive settings. Preserve every user-required reference; if the combination is unsupported, explain the restriction before submission.
- Reuse accepted attachment references or complete the live upload workflow. Never submit a local path or invent a media URL.

## Submission

Follow the core submission rules, including any requirement in the current tool description to explain reference-video charges. Do not invent prices. Retain `generationId` and follow the shared progress and result rules. When the host displays the MCP App, use it to show the result. Missing tools, failed discovery, or unsupported references do not authorize a different workflow or another submission.
