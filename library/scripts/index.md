# Scripts

Deterministic helpers for repeatable mechanical tasks; taste and art direction stay in the modules.
Fetch a script with the Artifact tool (`read`, the library URL, `path: "scripts/<name>"`) and copy the
saved file into the build folder.

| Script | What it does | Used in |
|---|---|---|
| `render.html` | render-page skeleton: stage, camera, easing helpers, font loading | `production/coded-render.md` |
| `render.mjs` | renders test frames, or every frame with motion blur | `production/coded-render.md` |
| `contact_sheet.py` | tiles test frames into one labelled sheet | `production/coded-render.md` |
| `motion_check.py` | measures how constantly and how much a video moves | `evaluation/quality-check.md`, `references/reading-references.md` |
| `reference_frames.js` | captures frames of an online video inside its page | `references/reading-references.md` |
| `site_extract.js` | extracts brand values, logo, images and text from a client's site | `design/asset-strategy.md` |
| `grab.js` | downloads a file from inside a page as base64 | `design/asset-strategy.md` |
| `stills.mjs` | renders a list of test frames from a Remotion project, bundled once | `production/remotion.md` |
| `render_chunks.sh` | renders a Remotion film in contiguous chunks, one tab each, in parallel, and lays the mix under it | `production/remotion.md`, `production/build-gotchas.md` |
| `cut_match.py` | compares the carried object's box across a cut | `production/build-gotchas.md` |
| `vo_align.py` | transcribes voice-over files and force-aligns the script for word timings | `planning/voice-over.md` |
| `qc.sh` | runs the four automatic checks below on an encode, results in one folder | `evaluation/quality-check.md` |
| `jitter_check.py` | finds shake: motion that moves in steps instead of gliding | `evaluation/quality-check.md` |
| `handoff_check.py` | finds pops: a place that changes in one frame (a blink, a jump in size, a layer appearing) | `evaluation/quality-check.md` |
| `strips.py` | strips of frames around every transition, or around given frames | `evaluation/quality-check.md` |
| `sfx_index.py` | measures sound effects from their waveforms (sync point, hits, decay, loudness, pitch) and draws them | `motion/sound.md` |
| `sfx_build.py` | trims and files Karl's sounds by role into `sound/sfx/`, writes the index and catalogue | `motion/sound.md` |
| `sfx_synth.py` | generates whooshes, risers, impacts, a stamp, a shimmer and a swell with exact sync points | `motion/sound.md` |
| `sound_mix.py` | mixes voice-over, music and effects from a cue sheet, each effect on its frame, to −15 LUFS | `motion/sound.md` |
| `music_find.py` | finds royalty-free tracks by mood and tempo and measures them | `motion/sound.md` |
| `music_fit.py` | cuts a found track to the film: a lift on the turn, its real ending on the end card | `motion/sound.md` |
| `music_make.py` | composes a bed to a brief: tempo, key, vibe and sections by bar | `motion/sound.md` |
| `stock.py` | searches royalty-free footage (Mixkit) and photos (Openverse, Pexels by ID), measures them, keeps credits | `design/asset-strategy.md` |
| `audio_look.py` | a sound file as a spectrogram over its loudness curve, with marks | `motion/sound.md` |

**Requirements.** Node with `playwright` and `sharp` in the build folder (tested with Playwright 1.56.0
against a pre-installed Chromium, and sharp 0.34.5); Python with Pillow, numpy and
opencv-python-headless.

**Also:** `stills.mjs` needs the Remotion project's own packages (run it from the project folder);
`vo_align.py` needs `pip install pocketsphinx` and ffmpeg; the sound scripts need ffmpeg, numpy, Pillow
and `pip install pyloudnorm`, and `sound_mix.py` reads the library's `sound/` folder.

**Usage.**
- `node render.mjs test 0,45,120` renders those frames to `test/` as PNG; `node render.mjs full 0 899 4 8`
  renders every frame to `frames/` as JPEG, with 4 parallel pages and 8 motion-blur samples (1 turns
  blur off). `PAGE` sets the page (default `render.html`), `SIZE` the frame (default `1080x1920`).
- `python3 contact_sheet.py` reads `test/f*.png` and writes `test/sheet.png`, 8 columns 216 px wide.
- `bash qc.sh film.mp4 qc/` runs motion, shake, pop and strip checks; read `qc/shake.txt`,
  `qc/pops.txt` and look at `qc/pops/*.png` and `qc/strips/sheet_*.png`. About 4 minutes for 45 seconds.
- `python3 jitter_check.py film.mp4 --png worst.png`: `SHAKE` lines are errors (regular steps, or many
  places at once); `look` lines are small irregular jumps to check in a strip. Exit code 1 on a shake.
- `python3 handoff_check.py film.mp4 --strips pops/ [--cuts 120,452]`: every `POP` comes with a strip,
  cropped to where it happened; designed hard cuts go in `--cuts`. Exit code 1 on a pop.
- `python3 strips.py film.mp4 strips/ [--at 140,146]`: without `--at` it finds the transitions itself.
- `python3 motion_check.py out.mp4 --profile` prints the three motion numbers (the last 2 seconds are
  ignored on films longer than 4 seconds) and, with `--profile`, one line per second.
- `bash render_chunks.sh Film out/final.mp4 '{"blurSamples":8}' 0,252,600,870,1110 public/audio/mix.wav`
  from the project folder: the boundaries are each chunk's first frame, then the total.
- `python3 sound_mix.py sound/cues.json public/audio/mix.wav --sheet mix.png [--music other.wav]`: cue
  format in the script's header; prints the level report (effects masked by the bed, effects crowding
  the voice) and the final loudness. About 10 seconds.
- `python3 music_find.py --mood calm,hopeful --feel calming,bright --bpm 85-115 --min 40 --out music/`
  downloads and measures candidates; read `music/candidates.png`.
- `python3 music_fit.py track.mp3 bed.wav --length 37 --lift 9.0 --sheet fit.png` prints the plan (the
  tempo, the start, the join, where each entry and the last chord land in the film).
- `python3 music_make.py brief.json bed.wav`: the brief format is in the script's header.
- `python3 audio_look.py mix.wav look.png --marks 9.0,25.0`.
- `python3 sfx_index.py <folder> waves/` measures every sound and draws the waveform sheets; then
  `sfx_build.py <folder> <library/sound>` and `sfx_synth.py <library/sound>`.
- `python3 stock.py search "tourist phone street" --kind video --out stock/`, then
  `python3 stock.py get stock/candidates.json 3,7 --to public/footage`; read `stock/candidates.png`.
- `reference_frames.js`: run it in the video's page, then `await sheet([0.5, 2, 3.5])` and screenshot the
  canvas.
- `site_extract.js`: run it in the client's page after scrolling once; it returns one object.
- `grab.js`: define it once in the page, then `await grab(url)` returns a data URL; the part after the
  comma is the file in base64.

Good candidates for future scripts: validating brief fields, converting timecodes between frame
rates, building a scene timing sheet from word timings, exporting reference thumbnails.
