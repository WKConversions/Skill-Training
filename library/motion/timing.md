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

## Distance and weight scale the duration

Take the base duration from the film's palette (`motion/motion-identity.md`), then scale it by how far
the element travels at 1080p:

| Travel | about 100 px | 200 px | 400 px | 800 px | across the frame |
|---|---|---|---|---|---|
| Multiplier | 1.0× | 1.3× | 1.6× | 1.8× | 2.0× |

Heavy elements (a full-frame card, a browser window) take the upper end; light ones (a pill, a
cursor, an icon) the lower. Exits run at 65–75% of the matching entrance.

## Stagger budget

Within a group, stagger 2–4 frames per element and keep the whole group's stagger under about 15
frames; a longer cascade reads as waiting. Stagger along the reading order or away from the cause;
every element in a group uses the same curve, and only the start time changes.

## The shape of one move

A move that matters has four parts; skip the first and third on small moves.

| Part | Share | What happens |
|---|---|---|
| Anticipation | 10–20% | a small counter-move or a hold before the release |
| Action | 30–50% | the primary move |
| Reaction | 10–20% | secondary elements respond, 2–4 frames behind |
| Resolution | 20–30% | the settle, then a working hold |

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
