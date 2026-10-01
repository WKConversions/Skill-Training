# Remotion

Remotion builds the film as a React project rendered frame by frame. It is the default route for a
coded build: Karl gets an MP4 plus a project he can open in Remotion Studio and adjust himself
(keyframes, easing, timing, text), the closest a code build gets to an editable After Effects file.
Use the plain page renderer (`production/coded-render.md`) only when Remotion can't be installed or
rendered in the session. Remotion is free for teams of up to three people.

The rules here translate this skill's motion system into Remotion; they don't replace it. For API
details, read Remotion's own current rules rather than memory:
`git clone --depth 1 https://github.com/remotion-dev/skills`, then the topic file in
`skills/remotion-markup/` (timing, transitions, motion-blur, measuring-text, local-fonts, 3d,
text-highlights, audio, voiceover, parameters, multi-scene-video, connected-compositions) or
`skills/remotion-render/SKILL.md`. Any docs page also reads as Markdown with `.md` appended
(`https://www.remotion.dev/docs/sequence.md`).

## Setup

- Scaffold: `npx create-video@latest --yes --blank --no-tailwind my-film`, then `npm i`. Add packages
  with `npx remotion add <package>` so versions match (`@remotion/transitions`, `@remotion/motion-blur`,
  `@remotion/fonts`, `@remotion/media`, `@remotion/layout-utils`).
- **In a sandbox** Remotion's browser download is usually blocked. Render with the pre-installed
  Chromium: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell`
  (check the exact path with `ls`). Keep `--concurrency` at or below the CPU count, or leave it out.
- Fonts: put the brand's .woff2 files in `public/` and load each weight with `loadFont()` from
  `@remotion/fonts` (or `@remotion/google-fonts`) before anything is measured.
- Assets go in `public/` and are referenced with `staticFile()`.

## Structure the project so Karl can edit it

- One component and file per scene, each registered as its own composition (a connected
  composition) so it has its own timeline in Studio, and the film as a `<TransitionSeries>` or
  `<Series>` of named sequences with `durationInFrames` written inline.
- Every element Karl may want to adjust is its own JSX node: `<Interactive.Div name="Headline">` with
  a descriptive, hardcoded `name`. Loops (`.map()`) only for repeated items that behave as one
  template, such as chart bars.
- Styles inline, animation inline: `interpolate(frame, [start, end], [from, to], {...})` directly in
  the `style` prop, with hardcoded values, both extrapolations clamped, and the `scale`, `translate`
  and `rotate` properties rather than a `transform` string. Use `output: 'perceptual-scale'` on
  scale animations. Keep fixed copy inline in the element.
- Everything moves from `useCurrentFrame()`; CSS transitions, CSS animations and timers don't render.
- Parameters: when a film is a template (intake-form films share a structure), expose brand color,
  logo, copy and product screens as a Zod schema so a new client is a props change, not a rebuild.
- Don't overwrite changes Karl made in Studio; treat surprising edits as intentional.

## Motion tokens

Put the film's motion identity (`motion/motion-identity.md`) in one file, for example `src/lib.tsx`,
and build every scene from it: the brand colors, the three named curves, the duration palette, a
tween helper `tw(frame, from, to, a, b, ease)` with clamping, the camera component, and the recurring
pieces (cursor, pill, portrait). Scenes then share one language the way component variants do in UI
motion libraries, and a new client changes the tokens, not the scenes.

## The motion system in Remotion

- **Curves** (`motion/easing.md`): arrive `Easing.bezier(0.22, 1, 0.36, 1)`, depart
  `Easing.bezier(0.64, 0, 0.78, 0)`, move `Easing.bezier(0.65, 0, 0.35, 1)`.
  `Easing.spring({damping: 200})` is a push without bounce and fits the same world; lower damping
  bounces and stays off by default.
- **Camera** (`motion/camera.md`): wrap each scene's content in one `AbsoluteFill` named "Camera"
  whose `scale` and `translate` are interpolated, inside a parent with CSS `perspective` for tilted
  planes. Holds keep their slow push.
- **Motion blur** (`motion/animation-grammar.md`): wrap the scene in `<CameraMotionBlur samples={8}
  shutterAngle={180}>` from `@remotion/motion-blur`; it works in any Chromium. `<HtmlInCanvasMotionBlur>`
  is sharper but needs Chrome 149 or later (the sandbox's Chromium is older) and a flag for live
  preview. Never nest two blur wrappers. Test with 1–2 samples, render with 8.
- **Transitions** (`motion/transitions.md`): `<TransitionSeries>` organizes scenes and timing, but its
  preset presentations are not the transition system. `fade()` never crossfades one layout into
  another; `slide()` and `wipe()` only where the movement is a real directional continuation. Most
  scene changes are built inside the scenes: the outgoing scene's element becomes the incoming one,
  with overlapping `<Sequence>`s or a shared element carried across. Transitions shorten the total:
  two 60-frame scenes with a 15-frame transition last 105 frames.
- **Text** (`design/typography.md`): measure with `measureText()` and `fitText()` from
  `@remotion/layout-utils` after fonts load (pass `validateFontIsLoaded: true`). Word-by-word builds
  are one `Interactive.Span` per word, each with its own offset. Hand-drawn highlights from
  `@remotion/rough-notation` only where the style is hand-drawn; the three intake styles are not.
- **Audio** (`motion/sound.md`, `planning/voice-over.md`): `<Audio>` from `@remotion/media`, one per
  voice-over line, each in a `<Sequence from={frame} layout="none">` on the line's frame, and always
  outside the motion-blur wrapper (`production/build-gotchas.md`). A composition can size itself to the recording with
  `calculateMetadata`. Captions (`@remotion/captions`) only when Karl asks for burned-in subtitles;
  they never replace the visual strategy.
- **3D and maps:** `@remotion/three` inside `<ThreeCanvas width height>`, animated only from
  `useCurrentFrame()` (never `useFrame()`); maps through Remotion's map techniques for the Map strategy.

## Frames, render, delivery

- **Carried objects across scenes:** end one scene and start the next in exactly the same state,
  computed from the first scene's constants (export them), and verify the cut with
  `scripts/cut_match.py`. A hard cut between identical frames is invisible.
- Storyboard and test frames: `node stills.mjs 0,45,120` (`scripts/stills.mjs`, one bundle for all
  frames), then tile them as in `production/coded-render.md`. The frames Karl approves come from the
  project itself.
- Final render only after approval: `npx remotion render <Comp> out/film.mp4`. A 60-frame 720p test
  with 8-sample blur took 16 seconds in the sandbox. When the film has slowly moving layered text, render
  it with `scripts/render_chunks.sh` instead, boundaries where no layered text moves
  (`production/build-gotchas.md`).
- Render a draft without blur first (`--props='{"blurSamples":1}'`), check timing and sync on it,
  then spend the blurred render once (times in `production/build-gotchas.md`).
- Re-encode the delivery: TV-range BT.709 `yuv420p`, loudness-normalized audio at 48 kHz, cut to the
  exact length (`production/build-gotchas.md`).
- Check the MP4 exactly like any other build (`evaluation/quality-check.md`), including the motion
  check and `ffprobe` for frame rate, size and a 48 kHz audio track.
- Deliver the MP4 and the project folder (zipped, without `node_modules`). Karl opens it with
  `npm i` and `npx remotion studio`. Studio can't be shown from a cloud session; say so.
