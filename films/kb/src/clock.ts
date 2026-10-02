import { timeline } from "./timeline";
import WORDS from "./words.json";

// The film's clock: beats and every spoken word are labels, force-aligned to Karl's voice-over (harvest/vo.mp3,
// ElevenLabs "Christina"); each beat starts about 0.15 s before its first word.
export const T = timeline(30, {
  hook: 0, jam: 2.7, mark: 4.2, sys: 4.75, pillars: 6.7, axis: 9.65, complex: 11.75, practical: 13.25,
  connect: 16.7, auto: 17.95, grow: 19.9, stay: 22.7, improve: 24.45, sign: 28.15, cta: 34.3, end: 37.5,
  ...WORDS,
});
export const DUR = T.f("end");
