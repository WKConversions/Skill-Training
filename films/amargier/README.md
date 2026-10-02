# Amargier Advisory · website film

30 s, 1920×1080, 30 fps, for Amargier Advisory's website (intake form, 2 Oct 2026), on Karl's voice-over (ElevenLabs
"Christina", `harvest/vo.mp3`, the form's script, every word force-aligned into `src/words.json`). In their own
look from the site: white, warm white #FAF9F6 and a pale blue field, navy #0D2139, DM Sans with a serif italic
second line (Georgia on their site; Gelasio here, drawn to Georgia's metrics), and the A mark of two leaning bars,
traced from their logo into vectors so it can move. Bright throughout; calm pacing, readable captions, restrained
navy and blue, as the form asks.

| s | line | on screen |
|---|---|---|
| 0–3.2 | Great partnerships start with a clear purpose. | the mark's two bars meet; "a clear purpose." in italic, underlined |
| 3.2–4.7 | At Amargier Advisory, | the mark centres; the name builds |
| 4.7–7.6 | we help technology businesses across EMEA | the mark lands on Málaga; EMEA spreads out as dots; businesses light up |
| 7.6–11.1 | turn partnership potential into commercial opportunities. | dashed links turn solid with an opportunity on each; "potential" rolls into "Commercial" |
| 11.1–17.9 | From go-to-market strategy and ISV ecosystems to partner recruitment, co-selling and hands-on leadership, | the businesses become an ISV ring round a client's business; each service builds on its word; Cédric at the centre |
| 17.9–20.5 | we connect the thinking with the doing. | the mark's bars return as "the thinking" and "the doing" and connect |
| 20.5–22.9 | Backed by over twelve years of experience, | Cédric's photo opens out of the apex; 12+ rolls up, a tick per year |
| 22.9–25.3 | we help you build what comes next. | the ticks lay the mark brick by brick |
| 25.3–30 | Let's talk about growth. | the mark on its own; "Let's talk about your next move."; Let's talk button |

Facts from their site (`harvest/facts.md`); the form's show and avoid lists in `storyboard/thesis.md`. Map: Natural
Earth land 1:50m via the world-atlas package (public domain), turned into dots by `scripts/emea.py`.

## Sound

`public/audio/mix.wav` (−15 LUFS, peaks under −1.5 dB, 48 kHz, 30.0 s) from `sound/cues.json`, written by
`scripts/cues.py` from the film's labels: 49 effects from Karl's library, all clear of the music, none crowding
the voice. Music: "Valley Sunset" by Alejandro Magaña (Mixkit Stock Music Free License: commercial use, no credit
needed), cut by `music_fit.py --length 30 --lift 3.4`.

## Build

    ln -s ../gohere/node_modules node_modules
    python3 scripts/cues.py && python3 ../../library/scripts/sound_mix.py sound/cues.json public/audio/mix.wav --sheet out/mix.png
    bash ../../library/scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":8,"audio":"none"}' 0,160,353,552,776,900 public/audio/mix.wav
    bash scripts/deliver.sh && python3 scripts/storyboard.py
