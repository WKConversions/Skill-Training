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
