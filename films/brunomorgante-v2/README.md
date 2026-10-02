# Bruno Morgante · film v2

46 s, 1920×1080, 30 fps, for LinkedIn and brunomorgante.com. In the direction of the Emma/bfound film Bruno
liked (one idea carried through the film, calm camera, clean type), rebuilt in his own look: warm
off-white canvas #F6F4F1, ink #121212, his red #BD1717, Poppins, his own photos, and light, never dark.

Thesis: the viewer's own next project runs through the film, and Bruno leads every beat. A card,
"Your next project · Launch the new platform", is typed in the first beat, gets tangled in deadlines,
dependencies and people, and is carried under his consulting work until it turns "Delivered". His
smiling photo is the first and the last frame.

| s | line | on screen |
|---|---|---|
| 0–3.7 | Every big project starts as one simple idea. | Bruno smiling; the project card is typed |
| 3.7–7.2 | Then come the deadlines, the dependencies, and the people. | cards land around it on their words: a moved deadline, a blocked migration, five teams |
| 7.2–9.9 | That's where Bruno Morgante comes in. | the tangle clears; his portrait, his name, "I solve problems and deliver results." |
| 9.9–18.0 | As a consultant, … the portfolio, the plan, the PMO and the team. | Strategy, Portfolio, Plan, PMO & team light up on their words; the card travels under them and turns "Delivered" |
| 18.0–25.1 | As a coach and mentor, … from executives to university students. | Bruno speaking; one to one and in groups; four topics |
| 25.1–29.7 | And on stage, his keynotes turn hard lessons into stories that stick. | his stage photo, graded to his palette; "Stories that stick"; his keynote title |
| 29.7–33.8 | Twenty years of leading projects. More than two hundred people mentored. | 20+ and 200+ count up; the two Thinkers360 badges |
| 33.8–40.0 | In the words of one organiser: not just a keynote speaker, a keynote experience. | the quote, large, "keynote experience" underlined; Grzegorz Ras |
| 40.0–45.8 | Got an idea that needs to become a result? Let's talk. | Bruno smiling again; BM logo; "Turn your ideas into results."; Let's talk · brunomorgante.com |

Facts and photos are all from brunomorgante.com (`harvest/facts.md`); nothing is invented. Brand
values measured with `library/scripts/brand_measure.py` (`brand.json`); the decisions from the
art-director passes are in `storyboard/thesis.md` (not committed, kept with the storyboard page).

## Sound

`public/audio/mix.wav` (−15 LUFS, peaks under −1.5 dB, 48 kHz, 45.8 s), made by
`library/scripts/sound_mix.py` from `sound/cues.json`: voice on top, the music ducked under it, and 36
effects from Karl's library, each on its picture frame: pops as the card is typed, pops falling in pitch
as the problems pile up, a swell of relief as Bruno arrives, selects rising in pitch as each consulting
step lights up, a success bloom on "Delivered", whooshes on the pushes, soft impacts on the badges.
Every effect clears the music by 3 dB or more.

- **Music:** "Piano Reflections" by Ahjay Stelino, Mixkit Stock Music Free License (commercial use, no
  credit needed), fitted by `music_fit.py`: solo piano under the problem, the lift at 7.23 s on "That's
  where Bruno Morgante comes in", the last chord back-timed to land at 41.2 s under "Let's talk".
- **Voice-over: a placeholder.** Synthetic voice, Piper TTS "en_US-ryan-high" (MIT-licensed model), at
  length scale 1.12. Replace it with a recorded read of the same script: record, force-align with
  `library/scripts/vo_align.py`, write the word times into `src/words.json` and `sound/vo_timing.json`,
  re-run the mix. Every animation is keyed to the word labels, so the picture follows the new read.

## Build

    npm i   # or symlink node_modules from ../gohere
    bash ../../library/scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":8,"audio":"none"}' 0,296,538,889,1375 public/audio/mix.wav
    bash scripts/deliver.sh   # out/BrunoMorgante-1080p.mp4, -web.mp4, -web-muted.mp4
