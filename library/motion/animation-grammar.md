# Animation grammar

Motion communicates relationships. Don't apply position, opacity and scale as presets; design what
causes each movement and what it changes.

## Cause, motion, consequence

Every meaningful movement has a cause and a consequence:
- button click → compression and pulse → the interface expands,
- number increases → the graph responds,
- object moves right → the next scene continues the movement from the right,
- camera moves into a UI element → the element becomes the next environment,
- line connects nodes → the nodes activate,
- object splits → new options appear,
- shape expands → it becomes the background of the next scene,
- a message arrives → the list makes room and the badge counts up,
- a process step completes → the next step lights up in the order of the flow.

When you plan a scene, write its motion as these chains. If a movement has no cause or changes nothing,
cut it.

## Character

Define the film's motion personality before animating: precise, energetic, elegant, playful,
technical, cinematic, mechanical, organic, aggressive or calm. Not every move uses the same curve,
but every move belongs to the same world. The brand or style usually decides it; the personality
table and the film's three constants (signature curve, duration palette, entrance pattern) are in
`motion/motion-identity.md`.

## Hierarchy and choreography

- **One dominant movement at a time.** Primary motion changes attention or meaning; secondary motion
  explains, supports or adds physical response (a card moves into focus; its icon settles three
  frames later). Secondary never outshines primary.
- **Sequence attention:** primary action → secondary response → settle → next action. The settle is a
  working hold, not a freeze.
- **Overlap everything in time.** Builds come in staggered waves, a new element every 2–4 frames, and
  the next move starts before the last one has settled. One element at a time with gaps in between
  makes a film feel stiff; scene A disappearing, an empty frame, then scene B appearing is weaker than
  the outgoing content shifting while the next scene forms around a shared object.
- **Stagger by meaningful groups** to communicate order, hierarchy, sequence or causality. Don't
  automatically stagger every letter, word, icon and card; random stagger is noise. Avoid
  simultaneous entrances unless you want an impact.

## Layers, paths and reactions

- **Three layers, three amplitudes.** The primary move carries the meaning at full amplitude. The
  secondary layer reacts at 30–50% of it, 2–4 frames later, on a different curve (a shadow spreading
  as a card lands, siblings making room, an icon settling). The ambient layer (the camera drift, the
  canvas, a video playing inside a frame) runs at 10–20% and never competes. A scene with only the
  primary layer moving reads as flat.
- **Paths arc.** Travel of more than a few hundred pixels curves slightly (a perpendicular offset of
  about 5% of the distance at the midpoint for precise films, more for playful ones). Straight lines
  are for mechanical motion, UI that slides on its rail, and the camera.
- **The third rule.** A single move that crosses more than a third of the frame gets help: motion
  blur, a camera move sharing the distance, or a change of speed on the way. With three or more
  elements, no more than a third of them are in their main move at the same moment.
- **Counter-motion.** When the hero moves one way, the layer behind can shift slightly the other way
  (20–30% of the speed), or its shadow can spread as it lifts. Use it to give a move weight, not on
  every move.
- **One trigger, one origin.** Elements reacting to the same cause start within 2 frames of each
  other and move away from the cause; they can land at different times.
- **Carry, don't duplicate.** An object visible before and after a change is the same object moving
  from its old state to its new one, never a hidden copy swapped for a shown one.

## Entrances and exits

- An element enters from where it comes from in the story: from the thing that caused it, from
  outside the frame in the direction of travel, or out of depth (from about 70% scale, or from behind
  another element). Arrivals from outside the frame are fast (6–12 frames) on a strong ease-out, and
  they settle.
- Nothing appears from nothing: arrivals out of depth start from about 70% scale, UI pops from
  85–95%, never from zero.
- Exits are quicker (3–6 frames, or 65–75% of the matching entrance) and subtler (a shorter
  distance), and they blur away or become the next scene. The viewer's attention has already moved
  on.
- Don't fade a layout in where it stands, and don't crossfade one layout into the next.
- Vary entrances across the film; the same entrance type no more than twice in a row (tracked in
  `motion/continuity.md`). Repeated scale-ins and fade-ups are an AI fingerprint.

## Anticipation, follow-through, overshoot

- **Anticipation** when it improves understanding or physical credibility: an object compresses before
  launch, the camera eases before a large push, a mask edge appears before the reveal. Not on tiny UI
  changes, where it only adds latency.
- **Follow-through:** elements finish at slightly different moments to avoid robotic motion; use it
  on connected cards, type groups, soft objects and linked UI.
- **Overshoot** is a tool, not a default; premium SaaS motion uses a small controlled overshoot or
  none.

## Motion blur

Fast moves carry motion blur, the way a camera sees them; it is most of what reads as smooth, and
without it the same move looks like a jump. Use shutter blur (a 180° shutter: `production/coded-render.md`,
`production/after-effects.md`) so blur appears only while things move fast; held elements stay sharp.
Text the viewer must read settles and sharpens before it matters, tiny UI never gets heavy blur, and
blur never replaces transition design.

## Keep the frame alive

In a short film a frozen frame reads as dead air. The request from the September test was constant
motion with "nothing static but no useless movement". Both halves matter.

- Something purposeful moves at every moment. A hold is a working hold: the interface keeps doing its
  job (a status changes, a counter ticks, a cursor travels, a video inside a frame keeps playing, a
  playhead runs) while the camera keeps pushing or drifting (`motion/camera.md`).
- Constant motion is a relay of dominant actions, not everything moving at once, and it doesn't mean
  more elements.
- Every movement carries information or continuity. Idle bobbing, looping sparkles, drifting particles
  and wiggle are noise, and objects don't float for no reason.
- Text stays still long enough to be read; the frame around it keeps working.
- Each scene's last movement leads into the next: start the outgoing change before the incoming layout
  settles.
- **The end card is part of the film.** End within about 2 seconds of the last word, and keep the end
  card working to the last frame: a slow push, the logo settling, the call-to-action click.
