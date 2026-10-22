# Kling AI

Generate images, edit reference images, and create videos with Kling AI in ChatGPT and Codex. Describe what you want to make, add reference media when needed, and check your credit balance and generation progress from the same chat.

## Capabilities

- Generate and edit product photos, posters, portraits, cover images, and other visuals.
- Create videos from text, images, or mixed references with Omni-Ref (全能参考), and use start and end frames or motion control when supported by the selected model.
- Upload reference images, videos, and audio; save and reuse subjects as Elements; and browse saved motions.
- Check account credits and generation progress. When the app supports the interactive result view, it shows progress and completed media there; otherwise, the assistant provides a result link.

## Connect your account

1. Open the installed Kling AI plugin's details in ChatGPT or Codex and make sure it is enabled.
2. Follow the account-connection prompt. Sign in on the Kling AI page, review and approve the requested access, then return to the chat. The controls and their labels depend on the app and language.
3. Ask the assistant to check the connection and credit balance without generating anything. It should verify the connection before checking your credits.
4. After the check succeeds, continue your original request. If a new chat is required to load the tools, the assistant should explain why and provide the request to copy into it.

Installing the plugin or selecting a skill does not connect your Kling AI account. Keep passwords and other credentials on the sign-in page; do not paste them into chat. For missing tools, expired authorization, or failed sign-in, follow [connection troubleshooting](<skills/Kling AI/references/troubleshooting.md>).

## Skill

The single [Kling AI skill](<skills/Kling AI/SKILL.md>) handles image generation and editing, video generation and shot planning, account connection, credit checks, uploads, Elements, saved motions, and task status. Its folder and name are both `Kling AI`.

Select Kling AI from the plugin or skill controls available in your app, or ask to use Kling AI in your request.

## What to expect

Generation uses Kling AI credits. The assistant checks the account connection and available models, summarizes the planned result, and submits the generation when the request and required inputs are clear. A request for ideas, a credit check, or an upload alone does not start generation.

Each requested generation is submitted once. A failure, timeout, or uncertain response requires your approval before another submission. For a task already in progress, the assistant checks its status rather than creating a replacement.

## Examples

Read-only account check:

> Check my Kling AI connection and credit balance. Do not generate anything.

Image generation:

> Create a 4:5 poster of a glass perfume bottle against a dark red studio background, with soft rim lighting. Leave room for text in the upper-right corner.

Video generation:

> Create a continuous 5-second, 16:9 shot outside a convenience store on a rainy night. A vintage motorcycle comes to a stop as the camera slowly moves closer.

Task query:

> Check the status of task <task ID>. Do not start a new generation.

## Connection details for maintainers

The portable entry uses `plugin.json` and `mcp.json`; the Codex compatibility entry uses `.codex-plugin/plugin.json` and `.mcp.json`. Both use the same global endpoint, `https://kling.ai/mcp/plugin`, with the server key `kling-ai`. The current app manages OAuth. The native configuration requests these scopes:

```text
generation.create
generation.read
account.credit.read
```

The remote service supplies the tool list and model definitions. Use `who_am_i` to verify authorization and discover supported models and settings; use `query_membership_and_credits` for the credit balance. For video requests, discover `omni_ref_video` and select a compatible model returned for the account. A named model in an example is not proof of access.

For desktop compatibility, keep the portable server configuration limited to the existing transport fields. Some desktop versions reject server-level `extensions` in `mcp.json` with `unknown field extensions, expected url or headers`. OAuth remains managed by the host; native requested scopes remain in `.mcp.json`.

Missing tools require checking discovery, plugin enablement, and connection state. They are not proof that the account is connected or disconnected. Do not register a duplicate server to work around a connection error.

## Validation

Check JSON/YAML syntax, matching metadata in both manifests, the endpoint, local references, and skill declarations. No validation script or automated test suite is bundled. Static checks do not verify authorization or generation access; test the connection in the intended app with a read-only account check before any requested generation.

## License

The manifests declare MIT. This repository does not currently include a LICENSE file. Kling AI and related marks belong to their respective owners.
