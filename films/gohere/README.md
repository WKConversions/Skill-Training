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
Pexels (free licence); map data © OpenStreetMap contributors (credited in the map view). No music yet:
the brief asks for calm, optimistic music low in the mix; add it under the voice-over at about −20 dB.

`npx remotion studio` to edit; `node scripts/stills.mjs 40,400,700` for test frames;
`python3 scripts/motion_check.py out/draft.mp4` (draft: 98% of frames moving, median 3.0%, longest still 0.47 s).
