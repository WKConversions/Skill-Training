# Timing and rhythm

## Timing is meaning

Duration communicates weight, importance, confidence and energy. A 6-frame move and a 24-frame move on
the same path have different characters. Vary timing by importance, distance, mass, rhythm and
emotion; don't make every animation 0.3–0.6 seconds.

Starting ranges at 30 fps (adapt to distance, scale, audio, readability and tone):
- micro response: ~3–8 frames,
- small UI transition: ~6–14 frames,
- arrival from outside the frame (with motion blur): ~6–12 frames,
- in-frame entrance or reveal: ~10–20 frames,
- exit: ~3–6 frames,
- major scene transformation: ~16–36 frames,
- deliberate cinematic reveal: often 24+ frames.

## Settle and holds

After important information arrives, give the viewer time to understand it; don't start the next
transition the instant a title lands. Use pauses deliberately, as working holds: the layout settles
but the frame keeps doing something useful (`motion/animation-grammar.md`). A pause is a change of
tempo, not a frozen frame.

## Rhythm

Alternate intensity. A strong sequence often runs fast → hold → medium → impact → calm →
acceleration → resolve. Constant speed becomes monotonous even when every animation is polished.
Don't confuse speed with energy: energy comes from contrast in timing, choreography, sound, framing
and visual change.

## Sync to the voice

Sync to the word, not just the sentence. With a recording, get word timings by force-aligning the
known script (for example pocketsphinx `set_align_text`) and land key hits on the spoken word itself:
the click on "click", the number on the number. Use exact sync for key impacts and near-sync with
layered timing for secondary movement; one-to-one sync for everything feels mechanical. Without a
recording, time the script at about 2.5 words per second (`planning/intake.md`).
