# K.B · website film

A 37.5-second film for kruslockbosconsultancy.com, 1920×1080, 30 fps, in K.B's own look: their off-white page and
lavender-grey cards, navy #293A51 and cyan #38C8FF, Montserrat, and their logo badge exactly as on the site (never
redrawn; Karl). Written "K.B" everywhere, never "K.B Consultancy" (the form). Built phrase by phrase on one
continuous stage (`library/planning/phrase-by-phrase.md`), timed word by word to Karl's voice-over (`src/words.json`),
and the first film made to the 3% motion target, with techniques from Karl's reference films
(`library/references/technique-catalogue.md`): screens on slowly tilting 3D planes, chips orbiting the loop, a version
dial, typed messages, tool tiles orbiting the close. The site's hero video was not used (Karl).

Thesis and allowed patterns: `storyboard/thesis.md`. Facts: `harvest/facts.md`.

| Time | Voice-over | On screen |
|---|---|---|
| 0–4.2 | Technology should make your business move faster, not hold it back. | the work runs along a lane, speeds up, jams behind a manual step; "back." struck out |
| 4.2–6.7 | K.B helps companies build smarter systems | the badge lands and clears the jam, rides to the corner; the steps line up and tick |
| 6.7–9.6 | with software, automation and AI. | a dashboard, a Make/n8n workflow, an AI support agent |
| 9.6–11.7 | From strategy to implementation, | the plan rides an axis and becomes the live system |
| 11.7–16.7 | we turn complex ideas into practical solutions that work inside your business. | a tangle and sticky notes straighten into a flow inside the client's app |
| 16.7–19.9 | We connect workflows, automate repetitive processes | their tools linked round the app; copy-paste rows turn into one rule |
| 19.9–22.7 | and create technology that grows with you. | a dashboard, a mobile app and an AI agent join; the team grows |
| 22.7–28.1 | And we stay involved, continuously improving what we build as your needs evolve. | K.B in the client's channel; the Diagnose, Build, Run loop turns, v1.0 to v1.4 |
| 28.1–37.5 | K.B. Your technical partner for building, running and improving the systems behind your business. | the badge with orbiting tools; the systems light up; Book a free discovery call |

## Sound

`public/audio/mix.wav` (−15 LUFS, peaks under −1.5 dB, 48 kHz, 37.5 s) from `sound/cues.json`, written by
`scripts/cues.py` from the film's labels: 67 effects from Karl's library, including his second pack (gears, data,
cinematic whooshes) and Kenney's CC0 sounds; no Apple system sounds. Music: "Raising Me Higher" by Ahjay Stelino
(Mixkit Stock Music Free License: commercial use, no credit needed), cut by `music_fit.py --length 37.5 --lift 4.3`.

## Build

    ln -s ../gohere/node_modules node_modules
    python3 ../../library/scripts/music_fit.py sound/music/raising-me-higher.mp3 sound/music.wav --length 37.5 --lift 4.3 && ffmpeg -i sound/music.wav sound/music.flac
    python3 scripts/cues.py && python3 ../../library/scripts/sound_mix.py sound/cues.json public/audio/mix.wav --sheet out/mix.png
    bash ../../library/scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":8,"audio":"none"}' 0,320,530,705,870,1125 public/audio/mix.wav
    bash scripts/deliver.sh && python3 scripts/storyboard.py
