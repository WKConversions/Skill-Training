# MindMirror · website film

35 s, 1920×1080, 30 fps, for MindMirror's website (intake form, 2 Oct 2026), on Karl's voice-over (ElevenLabs
"Christina", `harvest/vo.mp3`, the form's script, every word force-aligned into `src/words.json`). Built in
MindMirror's own bright look from their site: white and off-white #F7F8F3, ink #111713, lime #ABCB52 with olive
#708932 for words, soft lime and sage fields, Inter 400–600 with tight headlines, the brain/M mark and their
mirrored contour lines. Karl's brief: their style, bright, a new visual on every phrase, constant motion.

| s | line | on screen |
|---|---|---|
| 0–3.6 | You know what you're good at. But not always why. | the words build; a check beside "good at."; "why." marked lime, tangled signal beside it |
| 3.6–7.3 | MindMirror turns patterns from your assessment into a clearer picture | the tangle moves to the centre; a centre line; the mark opens out of it; a scan line sweeps the signal into their mirrored pattern |
| 7.3–12.4 | of how you focus, respond to pressure, stay driven and process information. | their insight cards fly out of the figure on their words: Focus, Pressure, Drive, Processing, each chart drawing |
| 12.4–15.7 | One guided assessment. One visual profile. | the cards gather into the guided assessment; the areas tick; Assess → Analyze (a scan) → Understand; the card opens on its centre line |
| 15.7–22 | Your natural strengths, your higher-effort areas, and the conditions… at your best. | their example profile (marked illustrative); the camera moves to each part as it is named; the peak is marked on "best" |
| 22–25.6 | Not another label. More context about the way you work. | lime floods out of the person; labels struck out and fall; the figure grows back round them with the six areas |
| 25.6–29.8 | So you can understand yourself better and make decisions with more perspective. | the words build; "perspective." marked; the camera pulls back |
| 29.8–35 | MindMirror. See how your mind works. | white opens; the mark from its centre line, the wordmark, the line, "Book your MindMirror Scan" |

Facts and copy from their site (`harvest/facts.md`); the form's show and avoid lists are in
`storyboard/thesis.md`. The profile is their own illustrative example; no scores or percentages.

## Sound

`public/audio/mix.wav` (−15 LUFS, peaks under −1.5 dB, 48 kHz, 35.0 s) from `sound/cues.json`, written by
`scripts/cues.py` from the film's labels: 50 effects from Karl's library, each on its picture event, all
clear of the music, none crowding the voice. Music: "Close Up" by Michael Ramir C. (Mixkit Stock Music Free
License: commercial use, no credit needed), cut by `music_fit.py --length 35 --lift 3.85`: it opens up on
"MindMirror" and its last hit lands on "works".

## Build

    ln -s ../gohere/node_modules node_modules
    python3 scripts/cues.py && python3 ../../library/scripts/sound_mix.py sound/cues.json public/audio/mix.wav --sheet out/mix.png
    bash ../../library/scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":8,"audio":"none"}' 0,200,389,677,915,1050 public/audio/mix.wav
    bash scripts/deliver.sh && python3 scripts/storyboard.py
