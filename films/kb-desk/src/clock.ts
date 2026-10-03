import { timeline } from "./timeline";
import WORDS from "./words.json";

// The desk film's clock: beats and every spoken word are labels, force-aligned to Karl's voice-over (the same
// recording as the first K.B film).
export const T = timeline(30, {
  hook: 0, hold: 2.75, mark: 4.2, sys: 5.4, soft: 6.85, auto: 7.65, ai: 8.7, plan: 9.7, impl: 10.5,
  ideas: 11.8, practical: 13.4, inside: 14.7, connect: 16.75, repeat: 18.0, grow: 19.95, stay: 22.75,
  improve: 24.45, sign: 28.15, partner: 29.1, systems: 32.2, cta: 34.3, end: 37.5,
  ...WORDS,
});
export const DUR = T.f("end");
