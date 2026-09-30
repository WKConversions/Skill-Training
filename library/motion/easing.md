# Easing

## Choose easing by intent

- **Decisive arrival:** strong, controlled ease-out; a confident, readable finish, good for type and UI.
- **Launch or departure:** ease-in, building momentum.
- **Neutral repositioning, moves and reframes:** a symmetric ease-in-out.
- **Mechanical or system motion:** cleaner and more uniform.
- **Organic physical response:** a subtle overshoot only where justified.
- **Premium UI:** restrained, precise easing with limited rebound.
- **Spring:** only when a physical or playful character warrants it.

Linear motion only where the visual logic calls for constant velocity: time itself as the subject
(countdowns, playheads). Never elastic or bounce as decoration.

## Default curves

These worked in the WKConversions builds and suit most films; styles and brands can override them:
- arrive: `cubic-bezier(.22,1,.36,1)`, a fast start and a long, soft settle,
- depart: `cubic-bezier(.64,0,.78,0)`,
- move / reframe: `cubic-bezier(.65,0,.35,1)`.

## Treat curves as authored motion

Inspect velocity rather than trusting a default ease. Anchor points matter as much as the curve: set
them before animating scale or rotation.

## Velocity continuity

When one object becomes another or crosses a cut, match its perceived velocity. Abrupt velocity
changes make a transition feel assembled instead of continuous.
