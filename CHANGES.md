# Reference films, 2 October 2026: 25 films Karl selected, read frame by frame

- **New module `references/technique-catalogue.md`:** what the 25 films have in common, measured (they move
  3.5% of the frame in a typical frame against 1.8–2.3% for our October films; one hard cut in 23 seconds;
  a line of type alone, then its picture, alternating; bright, with soft blooms; one diagram that carries
  many phrases), and twenty techniques with their timing: blur-rise word builds, typed prompts with
  products inside the sentence, the word that is a button, highlight blocks, a dial selector, a split exit,
  a mark inside a word, a shape-morph chain, an object that becomes the logo, flips, a dot iris, puzzle
  assembly, a mind map the camera travels, a lens reveal, multiplication, rings with a changing label,
  3D-tilted UI, footage with floating UI, soft blooms. A table of all 25 with their measurements.
- **Kinetic kit (`scripts/kinetic.tsx`):** `Typed`, `Selector`, `Stroke` (solid or dotted, drawing on),
  `Bloom`, `Flip`, and a `split` exit for `Line`, tested in a render.
- **New script `scripts/ref_sheet.py`:** timecoded contact sheets of a reference video, an overview or a
  transition frame by frame (this ffmpeg has no drawtext).
- **Linked from** the workflow (steps 6 and 9), `planning/phrase-by-phrase.md` (idea 10),
  `motion/transitions.md`, `references/benchmarks.md` and `references/reading-references.md`.

# Sound library, 2 October 2026: Karl's second pack and Kenney's CC0 interface sounds

- **Karl's second pack (70 sounds, licence `karl`):** cinematic whooshes and risers, gears, money, data and
  glitch sounds, camera shutters, more taps and pops. Measured from their waveforms and filed by role;
  files holding several takes were cut to one take, and two (a 29-second mouse-click recording, a 9-second
  all-in-one reel) were left out.
- **Kenney's Interface Sounds (32 sounds, licence `cc0`, public domain):** clean, short UI sounds, and the
  library's only `error` sounds.
- **New roles:** gear, money, data, glitch, error, and Karl's sounds join the generated whooshes and risers.
  Each has a row in `motion/sound.md` (when to use it), a level in `sound_mix.py`, and its sync point (the
  loudest moment for whooshes and risers).
- **Tools:** `sfx_build.py` takes several source folders; `sfx_index.py` reads .wma. The library now has 195
  sounds: 70 `karl`, 61 `pixabay`, 32 `cc0`, 11 generated, and 21 `apple` (reference only, never in a
  client mix).

# Skill improvements, 2 October 2026: phrase by phrase

Karl's standing direction, given on every film this month, is now a rule of the skill: the visuals show
what is being said as it is said, more frames and more animation, never a presentation, and always think
outside the box for the ideas and the transitions.

- **New module `planning/phrase-by-phrase.md`:** what makes a film a presentation; the rule (one
  continuous stage, the phrase as the unit, a thread object, show it then name it, no more than 2.5 s
  of voice without a new visual, calm is not static); an idea list for thinking outside the box; the
  object-born transitions that worked in Karl's films; bright colour fields; a frame per phrase in the
  storyboard; the measurement, calibrated on four films.
- **New script `scripts/phrase_check.py`:** lists the voice-over's phrases (the shot list) and measures a
  render for a new visual on every phrase (tone change or new structure, with camera moves aligned out).
  Calibrated: Bruno Morgante v2, the film Karl called a presentation, 21 of 29 phrases and 3.4 s of held
  voice; v3 30 of 31 and 1.0 s; MindMirror 21 of 21; Amargier Advisory 19 of 20 and 0.9 s.
- **New script `scripts/kinetic.tsx`:** the kinetic kit the October films were built with (words on the
  voice with marks, underlines and strikes, rolls, masks out of objects, odometer digits, camera keys,
  keyed tracks); `scripts/timeline.ts` now also takes plain seconds.
- **Updated:** `SKILL.md` (two core laws: every phrase gets its own visual; bright by default; workflow
  steps 6, 11 and 15 and the checklist), `planning/visual-strategy.md`, `motion/transitions.md` (name the
  object), `evaluation/art-director.md` (the presentation question, the idea list, a visual-density row
  in the scorecard), `evaluation/quality-check.md` (the check, and a held page is now critical),
  `production/output-format.md` (PHRASES in the scene spec, a frame per phrase), `production/remotion.md`
  (one stage and the kit), `examples/corrections.md` (two entries and a recurring lesson),
  `examples/bad-vs-good.md` (seven phrase-by-phrase examples from Bruno v3, MindMirror and Amargier).
- Published as library v9: https://claude.ai/artifact/UeFiNvnC9tHrN97jpEyr5X

# Skill improvements, 30 September 2026

The `senior-motion-designer` skill (`senior-motion-designer/SKILL.md`) and its library
(`library/`, published at https://claude.ai/artifact/UeFiNvnC9tHrN97jpEyr5X) were improved using
seven open-source motion skills as references, plus the lessons from building the 30-second
WKConversions film (`films/wkconversions-30s/`). The baseline versions are the first commits on this
branch, so every change can be diffed.

## Sources

| Reference | What it's for | Taken |
|---|---|---|
| LottieFiles, `motion-design` | UI motion principles, Disney principles, choreography | motion personalities and brand motion identity, emotion-to-motion map, three motion layers, arcs, 1/3 rules, counter-motion, distance-duration scaling, stagger budget, four-part move structure, springs and material easing, troubleshooting table, severity tiers |
| kylezantos, `design-motion-principles` | create and audit modes, three designer lenses | task routing up front, three critique lenses (restraint, polish, invention), countable "AI-slop" motion patterns with thresholds, motion-gap check, creation gotchas as a self-check |
| mblode, `ui-animation` | UI animation review | Before / After / Why review rows, "continuity over teleportation" (carry, don't duplicate), nothing from scale 0, exits faster and subtler, slow-motion and fresh-eyes review, a copyable progress checklist, trigger phrases in the description |
| freshtechbro, `motion-framer` | Motion / Framer Motion API | variants as shared motion tokens (translated to one Remotion tokens file), layout/shared-element continuity (translated to measured scene hand-offs), spring presets |
| wshobson, `interaction-design` | microinteraction patterns | purposes of motion (feedback, orientation, focus, continuity) confirmed the existing rules; no new rule |
| daffy0208, `animation-designer` | Framer Motion snippets | nothing: code recipes for web UI, already covered |
| github/awesome-copilot, `premium-frontend-ui` | immersive landing pages | nothing new: its grain, glass and scroll advice is either covered by the styles or web-only |

Not taken on purpose: web-performance rules (`will-change`, layout properties), `prefers-reduced-motion`,
hover and gesture handling, keyboard and frequency rules. They matter for interactive UI; a rendered
film has none of them.

## From building the WKConversions film

New module `production/build-gotchas.md` and new module `planning/voice-over.md`: pixel-checked
scene hand-offs, log-scale zooms, fonts before measuring, audio outside the blur wrapper, full-range
video re-encoded to BT.709, a `pgrep` that matched itself, identifying voice-over takes before timing,
force-aligned word timings, loudness at encode, and measured render times.

## Changes, file by file

| File | Change |
|---|---|
| `senior-motion-designer/SKILL.md` | description with trigger phrases and Remotion/voice-over scope; "Which task is this?" routing; three new core laws (countable fingerprints, one motion identity, carry don't duplicate); workflow steps 5, 12, 14, 15 read the new modules; a copyable progress checklist; critiques reported by severity as Before / After / Why |
| `motion/motion-identity.md` | **new**: personality table, the three constants, emotion to motion, weight |
| `evaluation/troubleshooting.md` | **new**: symptom → cause → fix, and the Before / After / Why row |
| `production/build-gotchas.md` | **new**: mechanical failures from real builds, time budget |
| `planning/voice-over.md` | **new**: identify takes, align, place, retime, deliver |
| `motion/animation-grammar.md` | layers, arcs, third rule, counter-motion, one trigger one origin, carry don't duplicate; nothing from nothing; subtler exits |
| `motion/timing.md` | distance and weight scaling, stagger budget, the four-part move |
| `motion/easing.md` | signature-curve share, springs for Remotion, material |
| `design/anti-ai-design.md` | countable fingerprints with thresholds |
| `evaluation/quality-check.md` | motion gaps, hand-off check, blur quality, slow and fresh review, severity tiers |
| `evaluation/art-director.md` | three lenses; revision log as Before / After / Why |
| `production/remotion.md` | motion tokens file, carried objects across scenes, stills script, draft first, delivery re-encode, audio placement |
| `production/output-format.md` | the storyboard page embeds the film and is rebuilt by a script |
| `motion/sound.md`, `planning/script-analysis.md` | links to the voice-over and motion-identity modules |
| `scripts/stills.mjs`, `scripts/cut_match.py`, `scripts/vo_align.py` | **new** scripts, tested on the WKConversions film |
| `scripts/index.md`, `index.html` | the new modules and scripts listed; workflow steps read them |
