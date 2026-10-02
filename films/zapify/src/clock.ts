import { timeline } from "./timeline";
import WORDS from "./words.json";

// The film's clock: beats and every spoken word are labels, force-aligned to Karl's voice-over (harvest/vo.mp3,
// ElevenLabs "Christina"); each beat starts about 0.2 s before its first word.
export const T = timeline(30, {
  hook: 0, zap: 3.4, sources: 4.5, auto: 6.9, links: 9.85, emails: 12.25, comments: 14.8, story: 17.0,
  who: 20.65, resp: 23.6, less: 27.55, more: 29.1, sign: 32.25, end: 39.5,
  ...WORDS,
});
export const DUR = T.f("end");
