# GoHere · website hero film

37 s, 1920×1080, 30 fps, with the ElevenLabs voice-over (34.8 s; word times force-aligned with
`library/scripts/vo_align.py`, so every caption word and key action lands on the spoken word). Built in
Remotion in the bright style of gohere.app: white with soft light-green glows, dark blue #141430 type,
light green #A3D2C2 accents, Nunito Sans 800, an iPhone mockup at the centre, calm moves and soft zooms.

The app and the portal are rebuilt as live components from the real software, so they can be animated:
the app's homepage of tiles, map, tip page and bucket list (from GoHere's app screens), and the portal's
Home page with its tile table, tile types and ↑ ↓ Edit Delete buttons (from app.gohere.app/dashboard,
viewed read-only). Sample destination: Rome, as in GoHere's own demo bucket list; "Your favourite
restaurant" is their demo placeholder tip.

| s | line | on screen |
|---|---|---|
| 0–3 | What if your visitors had your own app in their pocket? | a visitor with her phone; the camera pushes into it |
| 3–9 | Today, your best places are spread across websites, brochures and conversations. | loose photos, then a website, a brochure and chat messages, each on its word |
| 9–12 | GoHere brings them together in your own branded app. | the pieces are pulled into the phone: "Your brand" |
| 12–15 | Your name. Your logo. Your colors. | the app becomes four real GoHere apps, word by word: Terschelling Tips, Transavia Tips, Ciao Tutti, BarcelonaTips |
| 15–17 | You choose what appears on the homepage. | a tile type (the portal's own list) is picked; the grid makes room for the new tile |
| 17–25 | Visitors explore places on the map, open a location, and instantly see photos, opening hours and directions. | map tab, pins, the place card, the tip page: photos swipe, hours light up, Route draws a walk |
| 25–27 | They can save places in bucket lists and share them. | the heart, the bucket list with the new place, the share sheet |
| 27–31 | You manage the app yourself through the GoHere portal. | the portal's Home tile list; ↑ moves "Hidden gems" up and the phone updates live |
| 31–37 | Want to see your own app? Get a free preview at gohere.app. | the logo, "Get your free preview", gohere.app, and the four client apps |

Assets: GoHere's logo, client app icons and the Terschelling app screen from gohere.app; photos from
Pexels (free licence); map data © OpenStreetMap contributors (credited in the map view).

## Sound

One finished mix, `public/audio/mix-found.wav` (−15 LUFS, peaks under −1.5 dB, 48 kHz, 37.00 s), made by
`library/scripts/sound_mix.py` from `sound/cues.json`: the voice-over at −16 LUFS, the music bed 11 dB
under it and ducked 5 dB more while she speaks ("calm music low in the mix"), and 41 effects from
Karl's library, each on its picture frame (taps on the touches, pops on the landings, whooshes at the
middle of the moves, a success sound on "save", a run of pops climbing a scale on the four logos). The
mixer's level check: every effect clears the music by 3 dB or more, none crowds the voice.

Music, two versions over the same cues:
- **found** (default): "Piano Reflections" by Ahjay Stelino, Mixkit Stock Music Free License (commercial
  use, no credit needed), cut by `music_fit.py`: solo piano under the problem, the bass enters at 9.0 s
  on "GoHere brings them together", the song's final section from 25 s, its last chord on the end
  card at 33.0 s, ringing out to the end.
- **composed**: `sound/music-composed.flac`, scored for the film by `music_make.py` from
  `sound/music-brief.json` (108 BPM, D major, calm-optimistic; lifts at 8.9 and 15.6 s).
Render the other with `--props='{"blurSamples":8,"music":"composed"}'`.

`npx remotion studio` to edit; `node scripts/stills.mjs 40,400,700` for test frames;
`python3 scripts/motion_check.py out/draft.mp4` (draft: 98% of frames moving, median 3.0%, longest still 0.47 s).
