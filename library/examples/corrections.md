# Corrections

Karl's corrections, kept so the skill learns his recurring preferences. Read the lessons before
planning; read the entries of the categories you are working on when a decision is close.

## Recurring lessons (summary)

- Show what a line means so it reads in a second; vague metaphors get cut.
- Give every beat its own idea; one example can run through a film, one device can't answer every
  line.
- Constant, purposeful motion: nothing static, nothing useless; the camera never locks.
- References are examples of a look or a technique, never layouts to reproduce.
- The client's weak material (their own hero video, for K.B) is not a reference.
- Everything must read where the film plays: big subject, readable sizes, text never colliding.
- A chosen style must visibly set the look, even for WKConversions' own videos.
- Think like an art director, not a prompt generator: meaning, strongest idea, the film as a whole.

## Adding a correction

When Karl gives concrete feedback on a result:
1. identify the reusable principle behind it,
2. separate a project-specific preference from a general one,
3. add an entry below in the right category, and update the summary if it's a new recurring lesson,
4. fix the module the lesson belongs to, so the rule lives in one place (this file records the
   history; the modules hold the rules),
5. never generalize a one-off preference to all work.

Keep what worked too: when Karl approves a solution, add it to `examples/bad-vs-good.md`.

Don't change the library on your own during a video job: propose the entry and the module change to
Karl, and update the library when he agrees.

Template:
```
CATEGORY:
DATE / PROJECT:
ORIGINAL IDEA:
WHY IT WAS WEAK:
USER CORRECTION:
FINAL APPROACH:
GENERAL LESSON:
```

## Visual metaphor corrections

CATEGORY: Visual metaphor
DATE / PROJECT: September 2026, WKConversions 30-second ad
ORIGINAL IDEA: Abstract devices: a line snaking through a paragraph, a route drawn between two people,
a chart bar turning into a line.
WHY IT WAS WEAK: Viewers had to decode them in the one or two seconds each shot is seen.
USER CORRECTION: "No metaphors or vague visualizations which some don't understand."
FINAL APPROACH: Each shot showed what the voice-over meant: the highlight landing on the phrase, the
video splitting into formats, the founders in a chat.
GENERAL LESSON: Literal meaning first; metaphors only when grounded and readable in a second.

## Composition corrections

CATEGORY: Composition / visual strategy
DATE / PROJECT: September 2026, WKConversions ad, first cut
ORIGINAL IDEA: One invoice example and one line motif carried most of the film.
WHY IT WAS WEAK: One device answering every line made the film a single trick.
USER CORRECTION: Asked for other animation concepts besides the invoice.
FINAL APPROACH: A different device per beat, connected by the visual system and the transitions.
GENERAL LESSON: Give each beat its own idea.

CATEGORY: Composition
DATE / PROJECT: September 2026, first intake-form videos (WKConversions, K.B)
ORIGINAL IDEA: A centered headline over a centered object in every WKConversions scene; K.B's screens
shown whole, one wide card after another.
WHY IT WAS WEAK: One framing and one structure for the whole film; subjects too small to read.
USER CORRECTION: From the review against Karl's benchmark film: vary framing, push in on the subject.
FINAL APPROACH: The variety budget and readable sizes (`design/composition.md`,
`design/visual-hierarchy.md`).
GENERAL LESSON: Consistent language, varied structure; the subject is the largest thing on screen.

## Animation corrections

CATEGORY: Animation
DATE / PROJECT: September 2026, WKConversions ad
ORIGINAL IDEA: Scenes settled and held still between beats.
WHY IT WAS WEAK: A frozen frame reads as dead air in a short ad.
USER CORRECTION: More constant motion, "nothing static but no useless movement".
FINAL APPROACH: Working holds: the interface keeps working and the camera keeps moving.
GENERAL LESSON: Something purposeful always moves.

CATEGORY: Animation
DATE / PROJECT: September 2026, intake videos vs the "sends" benchmark
ORIGINAL IDEA: A locked camera, fades and short slides in place, one element at a time, no motion
blur.
WHY IT WAS WEAK: Measured against the benchmark, only 65–87% of frames moved and a typical frame had
0.2–0.4% of its area in motion (benchmark: 97% and 3.2%); it felt stiff.
USER CORRECTION: Karl likes "how smooth it is and constant good motion"; "if you look frame by frame
you don't see the animations".
FINAL APPROACH: The motion craft: moving camera, motion blur, arrivals from outside the frame,
overlapping waves (`references/benchmarks.md`).
GENERAL LESSON: Smoothness comes from craft, not frame rate; measure motion, not just stills.

## Style corrections

CATEGORY: Style
DATE / PROJECT: September 2026, intake-form styles
ORIGINAL IDEA: Using the style reference images as templates.
WHY IT WAS WEAK: Every film would share the references' alignments and visuals.
USER CORRECTION: "Don't literally take over the reference images, it's a reference, an example. I
don't want to see the exact same alignments and visuals. It has to suit the case and script."
FINAL APPROACH: Styles define the look only; the case decides layouts; a copy check before the
storyboard goes out.
GENERAL LESSON: References are for principles and language, never for layouts.

CATEGORY: Style
DATE / PROJECT: September 2026, WKConversions intake video (Minimal Single Visual Style chosen)
ORIGINAL IDEA: The WKConversions site look (dot grid, white cards) instead of the chosen style.
WHY IT WAS WEAK: The client's chosen style didn't show.
USER CORRECTION: From the review: the style must set the look.
FINAL APPROACH: The style outranks any brand's site look; the brand supplies color, fonts, logo,
wording (`styles/README.md`).
GENERAL LESSON: The chosen style wins on the look, for WKConversions too.

## Asset-selection corrections

CATEGORY: Asset selection
DATE / PROJECT: September 2026, K.B intake video
ORIGINAL IDEA: Looking at the client's hero video for direction.
WHY IT WAS WEAK: Karl judged that video weak.
USER CORRECTION: "Don't take an example of the website his video. That video is not so good."
FINAL APPROACH: Only the brand basics (colors, Montserrat, the K.B logotype) came from the site.
GENERAL LESSON: Harvest a client's brand, not their existing motion work, unless Karl says it's good.

## Typography corrections

CATEGORY: Typography
DATE / PROJECT: September 2026, WKConversions intake video
ORIGINAL IDEA: Headline words swapping in one slot without a shared mask.
WHY IT WAS WEAK: "strategy." and "creative." overlapped for five frames; "We bring it" ran into "the
idea."
USER CORRECTION: From the review.
FINAL APPROACH: Two lines of type never overlap; every text change checked frame by frame.
GENERAL LESSON: Check text transitions at 2-frame steps before the full render.

## UI corrections

CATEGORY: UI
DATE / PROJECT: September 2026, K.B intake video
ORIGINAL IDEA: Whole interfaces at real size, 16–22 px text on a 1080p frame.
WHY IT WAS WEAK: Unreadable in a website section or on a phone.
USER CORRECTION: From the review; confirmed by the benchmark, which shows UI at about twice real size.
FINAL APPROACH: Readable sizes and push-ins (`design/visual-hierarchy.md`).
GENERAL LESSON: Show the part the line names, big.

## Transition corrections

(none yet)

## AI-looking design corrections

CATEGORY: AI-looking design
DATE / PROJECT: September 2026, skill rebuild
ORIGINAL IDEA: The skill acting as a prompt generator: an animation per sentence.
WHY IT WAS WEAK: Template-driven films: centered text, cards, pills, repeated entrances.
USER CORRECTION: Karl's brief: understand the meaning, choose the strongest visual idea, fit it into
the whole film, critique and revise before production.
FINAL APPROACH: The planning workflow, the visual-strategy catalog, the art-director pass.
GENERAL LESSON: Ask what the viewer needs to understand before asking what should move.
