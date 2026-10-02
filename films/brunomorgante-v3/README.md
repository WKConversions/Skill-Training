# Bruno Morgante · film v3

45 s, 1920×1080, 30 fps, for LinkedIn and brunomorgante.com, on Karl's voice-over (ElevenLabs
"Christina", `sound/vo-christina.mp3`, every word force-aligned into `src/words.json`). Karl's brief for
v3: real motion design like the TopJobsAbroad film, not a presentation: a new visual on every phrase,
constant motion, more transitions, more colour, marking and creativity.

One continuous stage instead of pages. Type builds word by word on the spoken words; the tie red of his
logo marks, strikes and rings what matters; the colour field changes with the story (paper, his red, warm
sand, the stage at night); every transition grows out of something on screen.

| s | line | on screen |
|---|---|---|
| 0–3.5 | Every big project starts as one simple idea. | the words build; "idea." gets a red mark |
| 3.5–7.6 | Then come the deadlines, the dependencies, and the people. | the mark becomes the viewer's project card; dates struck out and "30 Sep?" ringed, dependency cards on threads, people with questions |
| 7.6–10 | That's where Bruno Morgante comes in. | his red grows out of the card; his name and photo; the red folds into his Consulting label |
| 10–17.7 | As a consultant… the portfolio, the plan, the PMO and the team. | the cards line up; Strategy → Execution; ranked portfolio, plan bars with Today, statuses roll to On track, owners dock, Delivered |
| 17.7–24.2 | As a coach and mentor… from executives to university students. | sand opens out of a person on the plan; Coach & mentor with a red ring; one to one, then a group; a knob travels Executives → University students |
| 24.2–29.1 | And on stage, his keynotes turn hard lessons into stories that stick. | a red line rises like a curtain onto his stage; "hard lessons" rolls into "stories"; "stick." marked |
| 29.1–33.9 | Twenty years… More than two hundred people mentored. | the mark floods red; 20+ rolls like a counter; a third zero: 200+, 200 dots; the Thinkers360 badges |
| 33.9–39.4 | In the words of one organiser: not just a keynote speaker, a keynote experience. | the dots gather into Grzegorz Ras; his quote in his words, "speaker" struck, "experience." marked |
| 39.4–45 | Got an idea that needs to become a result? Let's talk. | the card drops back; Idea → Result; his red closes: smile, BM logo, "Let's talk.", brunomorgante.com |

Code: `src/kit.tsx` (the clock, kinetic `Line`, `Roll`, `Iris` masks, `Disc` photos, the camera keys),
`src/Board.tsx` (0–18 s on one board), `src/Acts.tsx` (the rest), `src/Film.tsx` (camera and layers).
Facts and photos from brunomorgante.com (`harvest/facts.md`), nothing invented; the project is the
viewer's, hypothetical (`storyboard/thesis.md`).

## Sound

`public/audio/mix.wav` (−15 LUFS, peaks under −1.5 dB, 48 kHz, 45.0 s) from `sound/cues.json`, which
`scripts/cues.py` writes from the film's own labels (59 effects from Karl's library, each on its picture
event; all clear the music by 3 dB or more, none crowds the voice).
- **Voice:** Karl's recording, at −16 LUFS.
- **Music:** "Raising Me Higher" (Mixkit Stock Music Free License: commercial use, no credit needed),
  cut by `music_fit.py --length 45 --lift 7.6`: an entry at 7.6 s as Bruno comes in, the last hit at
  39.3 s on "experience", ringing out under the close.

## Build

    ln -s ../gohere/node_modules node_modules          # or npm i
    python3 scripts/cues.py && python3 ../../library/scripts/sound_mix.py sound/cues.json public/audio/mix.wav --sheet out/mix.png
    bash ../../library/scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":8,"audio":"none"}' 0,252,548,882,1278,1350 public/audio/mix.wav
    bash scripts/deliver.sh && python3 scripts/storyboard.py

A new read: force-align it (`library/scripts/vo_align.py align`), write the times into `src/words.json`,
move the beat labels in `src/kit.tsx` (0.25 s before each beat's first word), and re-run the lines above.
