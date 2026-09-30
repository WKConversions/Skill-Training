# Quality check

Verify what was built against the plan and the targets. The art-director pass judges the ideas; this
module checks the execution. You can't watch video, so check through stills, frame strips, contact
sheets and measurements (how to render them: `production/coded-render.md`).

## When

1. **Test frames, before the full render:** each beat's settled frame, mid-transition moments, the
   first and last frame, and every text change.
2. **The finished encode, before anything is sent:** contact sheets of the MP4, the motion check, the
   delivery checks. Check the encode, not just the code.

Work through the passes in order: if a still is weak, fix the design before polishing motion.

## Pass 1: Communication

- Does each settled frame show what its line means, to someone seeing it for the first time?
- Does each beat's point read with the sound off?
- Is any scene too abstract, or merely illustrating nouns?

## Pass 2: Static design

Look at the settled frames as stills: hierarchy, alignment, spacing, typography, color, negative
space, focal point, crop, accidental tangencies, and consistency with the style and brand.

## Pass 3: Motion

- Dominant motion, overlap, stagger logic, velocity, easing, anticipation, settle, motion blur on
  fast moves, unnecessary movement.
- The camera never locks and never wanders.
- Run `scripts/motion_check.py` on the encode. Targets: something moves in at least 95% of the frames,
  nothing holds still for more than 0.8 seconds before the end card, and a typical frame has at least
  1.5% of its area in motion. Karl's benchmark measures 97%, 0.8 s and 3% (`references/benchmarks.md`).
  A result below target points at the working holds and the camera, not at adding elements.

- **Motion gaps.** List every change of state in the film (a text swap, a color change, an element
  appearing or leaving, a value updating) and check that each one moves. A change that snaps from one
  frame to the next, with nothing carrying it, is a gap; it reads as a glitch more than as a cut.
- **Hand-offs.** For every scene change that carries an object across, compare the two frames around
  the cut (`scripts/cut_match.py`); the object's box must match within 2 px.
- **Blur quality.** Step through the fastest moves frame by frame; separate copies instead of a smear
  mean the move needs more frames or more samples.
- **Review slowly, then fresh.** Step key transitions at 2-frame intervals, then look at the whole
  contact sheet again after other work; problems invisible at full speed show up both ways.

## Pass 4: Rhythm

Read the film through: the 2-frames-per-second contact sheet top to bottom, and the per-second
profile from `motion_check.py --profile`. Look for monotony, rushed sections, dead sections,
over-dense sections, missing contrast in tempo and density, and important ideas without room to
breathe.

## Pass 5: Continuity

Against the continuity table (`motion/continuity.md`): the scenes connect visually, transitions stay
within the film's family, direction carries across, recurring motifs work, and the film reads as one
authored system. Sample every scene change every 2–3 frames.

## Pass 6: Typography

- Readability, line breaks, hold duration, over-animation, hierarchy, and spelling against the script
  and the client's own names.
- **Overlap:** render every text change every 2 frames across its transition and inspect the strip;
  two lines of type must never overlap.
- **Size where it plays:** scale the settled frames to 900 px wide (a website section) and 400 px (a
  phone). Everything the viewer must read survives 900 px; each line's key word or number survives
  400 px (sizes in `design/visual-hierarchy.md`).
- **Fonts:** the glyphs are the brand font, not a fallback.

## Pass 7: Polish

Only now: micro timing, subtle shadows, blur, textures, secondary animation, tiny alignment issues,
edge cases.

## Delivery checks

- Frame rate, resolution and aspect ratio as planned:
  `ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,sample_rate -of compact out.mp4`
- Safe areas: key text at least 80 px from the sides and 100 px from the top and bottom (at 1080 px
  wide; scale for other sizes). In 9:16 social video, also keep headlines and key UI clear of the bottom fifth, the top
  eighth and the right edge, where platform captions and buttons sit.
- The end card follows its rule in `motion/animation-grammar.md`.
- Audio at 48 kHz, loudness-normalized, without clipping, and exactly as long as the video.
- The logo: the right version, undistorted, with clear space.
- Nothing missing: fonts, assets, and in After Effects, broken expressions, missing footage and color
  management.
- Every claim on screen matches the client's own material; nothing invented.

## Severity

Rank every finding before fixing, and fix from the top:
- **Critical, never ships:** a line whose meaning doesn't read; invented facts; unreadable text where
  it plays; overlapping type; a frozen frame; a visible jump at a cut; audio out of sync or clipping;
  a wrong logo or brand color.
- **High:** a locked camera; one framing distance; a crossfade between layouts; motion gaps; the same
  entrance three times in a row; missing secondary motion; the motion check below target.
- **Medium:** missing arcs or counter-motion; blur stepping on one move; a settle a few frames short;
  small alignment or spacing issues.

Report findings as Before / After / Why rows (`evaluation/troubleshooting.md`).

## Red flags

Any fingerprint in `design/anti-ai-design.md`, and:
- the tempo never changes (a working hold is a change of tempo; a frozen frame is not),
- a frozen frame anywhere, end card included,
- UI at an unreadable scale,
- scenes that look like unrelated templates.

## Finish

Score the render with the scorecard in `evaluation/art-director.md`, make the three changes that would
most improve perceived professional quality, and only then polish low-impact details and deliver.
