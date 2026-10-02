# Zapify · website film

A 39.5-second film for zapify.pro (Instagram comment and DM automation), 1920×1080, 30 fps, in their own look:
white, black heavy Geist type, the gold-to-yellow gradient of their buttons, their full yellow section, pastel
fields and coloured chips, the black tilted word block of their hero, and their logo (split into the speech bubble
and the bolt so it can build). Bright throughout. Built phrase by phrase on one continuous stage
(`library/planning/phrase-by-phrase.md`) and timed word by word to Karl's voice-over (`src/words.json`).

The thread is their logo: the opening's interactions spiral into it; the bolt zaps across a post, the inbox and a
Story and makes each automated; one phone carries Zapify's own four example chats from their use-case pages,
each in a colour field that opens out of the phone; the bolt answers creators, brands and agencies; the
copy-paste stack is struck out and collapses into their yellow; at the close the opening's interactions circle
the logo, on autopilot. Thesis and allowed patterns: `storyboard/thesis.md`. Facts: `harvest/facts.md`.

| Time | Voice-over | On screen |
|---|---|---|
| 0–3.4 | Turn every Instagram interaction into momentum. | interactions pop in; "interaction" in a black block; they spiral into one point |
| 3.4–4.5 | With Zapify, | the bubble opens out of the spiral, the bolt drops in, "Zapify" |
| 4.5–9.8 | comments, DMs and story replies can instantly become automated conversations. | a post, the inbox, a Story; the bolt zaps across, Automated pills; they merge into the phone |
| 9.8–12.2 | Send links the moment someone asks. | lavender: Mike's camera link |
| 12.2–14.8 | Capture emails directly through Instagram. | peach: Jess types her email; it flies into Subscribers |
| 14.8–17.0 | Respond to comments automatically. | pink: comments ticked DM sent; Sarah's Shop the Look |
| 17.0–20.6 | And turn story reactions into real engagement. | mint: fire reactions; Alex's Bali guide |
| 20.6–27.5 | Whether you're a creator, brand or agency, Zapify helps you stay responsive and keep opportunities moving. | three cards answered by the bolt; opportunities stream along a gold track |
| 27.5–29.1 | Less manual messaging. | copy-paste bubbles struck out, collapsing into one |
| 29.1–32.2 | More conversations working for you every day. | their yellow; a week of conversations |
| 32.2–39.5 | Zapify. Automate your Instagram DMs and grow on autopilot. | the logo returns; the interactions circle it; Start free |

## Checks (draft)

`phrase_check.py`: 25 of 25 phrases bring a new visual, 0.0 s of voice without one. `qc.sh`: 98% of frames
moving, longest still 0.6 s; the shake found on the first draft (the bolt and the logo moved with left/top, a 200 px
camera pan, vertical glyph snapping under the slow zoom, fixed with a 0.02° camera rotation) is fixed. `film_tells.py`: 0
tells (two allowed: Zapify's own copy). Contrast: accent and muted text only at large sizes on the pastel fields.

## Sound

`public/audio/mix.wav` (−15 LUFS, peaks under −1.5 dB, 48 kHz, 39.5 s) from `sound/cues.json`, written by
`scripts/cues.py` from the film's labels: 72 effects from Karl's library (no Apple system sounds). Music: "Tech House
vibes" by Alejandro Magaña (Mixkit Stock Music Free License: commercial use, no credit needed), cut by
`music_fit.py --length 39.5 --lift 3.6`: it opens up on "With Zapify", its last hit lands on "autopilot".

## Build

    ln -s ../gohere/node_modules node_modules
    python3 ../../library/scripts/music_fit.py sound/music/tech-house-vibes.mp3 sound/music.wav --length 39.5 --lift 3.6 && ffmpeg -i sound/music.wav sound/music.flac
    python3 scripts/cues.py && python3 ../../library/scripts/sound_mix.py sound/cues.json public/audio/mix.wav --sheet out/mix.png
    bash ../../library/scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":8,"audio":"none"}' 0,316,464,640,892,1185 public/audio/mix.wav
    bash scripts/deliver.sh && python3 scripts/storyboard.py
