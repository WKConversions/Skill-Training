# WKConversions · 30-second brand film

Remotion project for a 30 s, 1920×1080, 30 fps film: Hook → Problem → Solution → Showing something → Outro.
Built with the `senior-motion-designer` skill.

- `src/Film.tsx`: the film timeline, with the voice-over timing in its header comment.
- `src/scenes/`: one file per scene; each is also its own composition in Studio.
- `src/lib.tsx`: brand tokens, named easing curves, the camera, cursors, pills and portraits.
- `public/`: fonts, founder photos, the wkc mark, and the ClearScaler case excerpt (all from wkconversions.com).
- `storyboard/`: the storyboard page source and its build script.

```
npm i
npx remotion studio                  # edit in Studio
node scripts/stills.mjs 80,190,318   # test frames → out/test/
python3 scripts/sheet.py             # contact sheet of the test frames
npx remotion render Film out/wkconversions-30s.mp4 --props='{"blurSamples":8}'
python3 scripts/motion_check.py out/wkconversions-30s.mp4 --profile
```

In a sandbox without Remotion's own browser, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell`.
