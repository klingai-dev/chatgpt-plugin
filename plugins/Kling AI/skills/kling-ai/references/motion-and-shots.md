# Motion and shot planning

## Review a supplied prompt

- Honor requests to use the prompt verbatim. Otherwise, check the subject, action, camera, pacing, continuity, and constraints that matter for this clip. Details the user leaves to the model can stay open.
- If the prompt is clear, consistent, and sufficient for the requested result, return or submit it verbatim. Apply the same check to a general request to optimize the prompt.
- Resolve material gaps, ambiguity, or conflicts from the brief and references first. Ask only when the user's intent is still unclear and would materially affect the result.
- Edit only the words needed to resolve the issue, apply the requested change, or satisfy required reference syntax. When the user supplies a line that fits as written, append it verbatim and preserve the rest. For an ending beat, use the requested action, timing, and final position or state. Leave the intervening motion to the model unless the user specifies it.

## Motion-first prompt order

For a new prompt or a targeted addition, prioritize action and continuity. Use visible details such as lighting, material, depth of field, and composition to express abstract quality requests when they matter to the shot.

1. Format and duration intent.
2. Opening frame and subject position.
3. Beginning, development, and completion of the subject action.
4. One primary camera movement and its speed.
5. Environmental movement and physical effects.
6. Lighting, color, lens character, and time-of-day mood.
7. Continuity anchors such as identity, wardrobe, product structure, logo, architecture, and screen direction.
8. Necessary constraints, such as avoiding extra subjects, distorted shapes, or unwanted text.

## Camera choices

- Locked-off: observation, product detail, or graphic composition.
- Slow push-in: emphasis, intimacy, or detail reveal.
- Pull-back reveal: expanded environment or scale.
- Lateral tracking: follow motion while preserving side relationships.
- Controlled orbit: dimensional display of a product or character.
- Crane rise or drop: establish or resolve spatial scale.
- Handheld follow: urgency or UGC realism; specify the intended stability.
- Whip pan: use only for a deliberate transition and name the final landing subject.

When planning a five-second shot, default to one primary camera movement.

For continuous hand-object interaction, frame the action path so the hands and object stay visible through the final handoff or placement.

## Duration and multiple shots

- 5 seconds: one action and one camera movement.
- 10 seconds: one action with setup and result, or two simple connected beats.
- 15 seconds or longer: plan a compact multi-beat sequence only when the live model supports it.

For multiple shots, give each shot a duration, framing, one narrative task, subject action, camera movement, and continuity anchor. Shot durations must sum to the total duration. The full plan is still one generation submission.

When a hand-object interaction crosses a cut, match the grip, object position, and support contact at both sides of the cut. Continue the action from that state at the requested pace.

## Reference media

- A start frame supplies the opening image for the video.
- An end frame guides the ending when the selected model supports it.
- For ordered keyframes, describe the transition between successive supplied states. Settle into the final frame without overshooting or snapping back unless requested.
- Use an identity reference to preserve facial features, apparent age, hair, wardrobe, proportions, and distinguishing features.
- Use a product reference to preserve dimensions, materials, labels, logo placement, and moving parts.
- A motion-reference video should preferably show one subject clearly in a single shot. Follow the tool's current duration and resolution limits.

For advertising or explainer video, assign one communication task to each beat: hook, context, evidence, or close. Never invent performance claims, testimonials, statistics, prices, awards, or certifications.
