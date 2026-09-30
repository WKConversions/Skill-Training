# Camera and depth

## The camera never stops, and never wanders

The camera is never locked: a locked camera with a few elements moving inside it reads as a
slideshow, which is what separated the first intake videos from Karl's benchmark film. But every
camera move has a direction and a reason: to reveal information, follow action, transfer attention,
create scale, connect scenes or intensify a moment. Aimless drifting is as weak as a locked frame.

- **Holds:** a slow push or drift toward the focal point, about 3–6% of scale over a few seconds.
- **Push-ins:** establish the screen or scene, then push in until the part the line names fills the
  frame and reads (`design/visual-hierarchy.md`). Interfaces can sit on a slightly tilted plane that the
  camera pushes into.
- **Distances:** the camera moves the film between wide, medium and close framings (the framing budget
  is in `design/composition.md`).
- **Whip zooms and whip pans:** a transition family like any other (`motion/transitions.md`), used
  only when motivated, never as a random preset.

## Depth

Even in 2.5D:
- foreground objects move more than the background during parallax, and parallax is used only to
  express real depth between meaningful layers,
- focus can transfer attention between depth planes,
- perspective stays coherent across the film,
- a slight 3D tilt (about 5–15°) on cards and screens adds depth where the chosen style allows it,
- soft, wide shadows and layers at different depths moving at different speeds sell the space,
- depth supports hierarchy; it is never a feature checklist.

## Cuts

Not every change needs interpolation. A clean hard cut can be stronger than a forced transition when
the audio carries the connection, the compositions match, the action direction matches, or contrast
is the point. Most scene changes are still moves (`motion/transitions.md`).

## Atmosphere

Grain, glow, bloom, haze and lens effects must support the art direction and the style. Don't use
atmosphere to hide weak composition. "Cinematic" doesn't mean slow; it comes from intentional
framing, motivated camera, depth, light, pacing, anticipation, sound and a controlled reveal.

## In a coded render

Put the whole scene inside one camera element under a CSS `perspective` and set its transform every
frame (`production/coded-render.md`, `scripts/render.html`).
