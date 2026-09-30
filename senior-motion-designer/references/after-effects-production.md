# After Effects Production

## Project organization

Use clear naming.

Suggested categories:
- CTRL_
- TXT_
- UI_
- ICON_
- IMG_
- BG_
- FX_
- MATTE_
- SFX reference markers where useful.

Avoid dozens of `Shape Layer 1` / `Null 7` names in production work.

## Editable construction

Prefer:
- editable text,
- shape layers,
- controllable effects,
- reusable precomps,
- master controls,
- expressions for repeated logic.

Rasterize only when necessary.

## Anchor points

Set anchor points intentionally before animating scale/rotation.

Bad anchor points create amateur motion even with good easing.

## Motion blur

Use where it improves perception of speed.

Avoid:
- destroying text readability,
- applying excessive blur to tiny UI,
- using blur as a substitute for transition design.

## Graph editor

Treat interpolation as authored motion.

Inspect velocity/graph behavior rather than trusting default Easy Ease.

## Precomps

Precompose when:
- elements behave as one unit,
- hierarchy becomes clearer,
- effects need grouped treatment,
- a component is reusable.

Do not precompose blindly; preserve access to frequently adjusted properties.

## Expressions

Use expressions for:
- reusable controls,
- procedural counters,
- responsive layout,
- linked styling,
- repeated stagger logic,
- deterministic behavior.

Do not use expressions when two clean keyframes are clearer.

## Preview loop

After each meaningful section:
1. RAM preview,
2. inspect at full speed,
3. inspect key transitions frame-by-frame,
4. inspect typography holds,
5. inspect motion hierarchy,
6. fix the weakest issue before adding polish.

## Delivery

Before final:
- check frame rate,
- resolution,
- aspect ratio,
- safe areas,
- missing fonts/assets,
- broken expressions,
- color management,
- audio peaks,
- final hold,
- spelling,
- logo usage.
