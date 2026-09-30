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

**Requirements.** Node with `playwright` and `sharp` in the build folder (tested with Playwright 1.56.0
against a pre-installed Chromium, and sharp 0.34.5); Python with Pillow, numpy and
opencv-python-headless.

**Usage.**
- `node render.mjs test 0,45,120` renders those frames to `test/` as PNG; `node render.mjs full 0 899 4 8`
  renders every frame to `frames/` as JPEG, with 4 parallel pages and 8 motion-blur samples (1 turns
  blur off). `PAGE` sets the page (default `render.html`), `SIZE` the frame (default `1080x1920`).
- `python3 contact_sheet.py` reads `test/f*.png` and writes `test/sheet.png`, 8 columns 216 px wide.
- `python3 motion_check.py out.mp4 --profile` prints the three motion numbers (the last 2 seconds are
  ignored on films longer than 4 seconds) and, with `--profile`, one line per second.
- `reference_frames.js`: run it in the video's page, then `await sheet([0.5, 2, 3.5])` and screenshot the
  canvas.
- `site_extract.js`: run it in the client's page after scrolling once; it returns one object.
- `grab.js`: define it once in the page, then `await grab(url)` returns a data URL; the part after the
  comma is the file in base64.

Good candidates for future scripts: validating brief fields, converting timecodes between frame
rates, building a scene timing sheet from word timings, exporting reference thumbnails.
