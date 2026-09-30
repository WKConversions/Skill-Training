// The store: plan geometry, items, associates' routes, RFID scan pulses and when each item is located.
// Everything is a pure function of the frame, so any frame renders on its own.
import { pointAt, rand, roundedPath } from "./geo";

export type Rect = { x0: number; y0: number; x1: number; y1: number; h: number };

export const FLOOR = { x0: 0, y0: 0, x1: 1000, y1: 700 };
const G = [200, 360, 520, 680];
export const SHELVES: Rect[] = [
  ...G.flatMap((x) => [
    { x0: x, y0: 130, x1: x + 70, y1: 320, h: 40 },
    { x0: x, y0: 390, x1: x + 70, y1: 580, h: 40 },
  ]),
  { x0: 140, y0: 22, x1: 860, y1: 66, h: 56 },
  { x0: 904, y0: 120, x1: 952, y1: 600, h: 56 },
  { x0: 40, y0: 150, x1: 100, y1: 300, h: 26 },
];

export type Item = { x: number; y: number; z: number; id: number };
export const ITEMS: Item[] = [];
{
  let id = 0;
  for (const s of SHELVES) {
    const long = s.y1 - s.y0 > s.x1 - s.x0;
    if (long) {
      for (const x of [s.x0 + 13, s.x1 - 13]) for (let y = s.y0 + 14; y <= s.y1 - 14; y += 21) ITEMS.push({ x, y, z: s.h + 1, id: id++ });
    } else {
      for (const y of [s.y0 + 12, s.y1 - 12]) for (let x = s.x0 + 16; x <= s.x1 - 16; x += 26) ITEMS.push({ x, y, z: s.h + 1, id: id++ });
    }
  }
}
// the item the story is about: Crew Long-Sleeve Tee, on the right face of the third aisle's lower gondola
export const TEE = ITEMS.reduce((best, it) => (Math.hypot(it.x - 577, it.y - 480) < Math.hypot(best.x - 577, best.y - 480) ? it : best), ITEMS[0]);
// two more items in a same-day order, for the pickpath
export const ORDER = [
  ITEMS.reduce((b, it) => (Math.hypot(it.x - 916, it.y - 260) < Math.hypot(b.x - 916, b.y - 260) ? it : b), ITEMS[0]),
  ITEMS.reduce((b, it) => (Math.hypot(it.x - 390, it.y - 54) < Math.hypot(b.x - 390, b.y - 54) ? it : b), ITEMS[0]),
];

// corridors: x = 160, 300, 450, 610, 790 ; y = 98, 355, 640
type Route = { path: ReturnType<typeof roundedPath>; start: number; end: number };
const route = (poly: [number, number][], start: number, end: number): Route => ({ path: roundedPath(poly, 44), start, end });

// A searches from the entrance and keeps missing it, then walks a normal scan round
export const A = route(
  [[160, 660], [160, 355], [300, 355], [300, 98], [450, 98], [450, 355], [300, 355], [300, 640], [450, 640], [450, 355],
   [610, 355], [610, 98], [790, 98], [790, 640], [610, 640], [610, 420], [450, 420]],
  30, 470,
);
export const B = route(
  [[790, 660], [790, 98], [610, 98], [450, 98], [300, 98], [300, 640], [160, 640], [160, 355], [300, 355], [450, 355]],
  150, 470,
);
export const Cc = route(
  [[450, 98], [300, 98], [300, 355], [160, 355], [160, 98], [300, 98], [300, 640], [160, 640], [160, 660]],
  150, 480,
);
// C goes straight to the tee once it is located
export const DIRECT = route([[160, 660], [160, 640], [610, 640], [610, TEE.y]], 486, 540);
// the same-day order pickpath: tee → right wall → top wall
export const PICK = route([[610, TEE.y], [610, 355], [790, 355], [790, 260], [880, 260], [790, 260], [790, 98], [ORDER[1].x, 98]], 558, 628);

export const posOn = (r: Route, f: number) => pointAt(r.path, ((f - r.start) / (r.end - r.start)) * r.path.length);
export const distOn = (r: Route, f: number) => Math.max(0, Math.min(1, (f - r.start) / (r.end - r.start))) * r.path.length;

// RFID scans: while associates do their normal rounds (from frame 300) each handheld reads every 14 frames
export const PULSE_R = 150;
export const PULSE_LIFE = 26;
export const PULSES: { f: number; x: number; y: number }[] = [];
for (const [r, off] of [[A, 0], [B, 5], [Cc, 9]] as [Route, number][]) {
  for (let f = 300 + off; f <= 470; f += 14) {
    const [x, y] = posOn(r, f);
    PULSES.push({ f, x, y });
  }
}
// when each item is first read: the pulse front reaches it
export const LOCATED: number[] = ITEMS.map((it) => {
  let best = Infinity;
  for (const p of PULSES) {
    const d = Math.hypot(it.x - p.x, it.y - p.y);
    if (d <= PULSE_R) best = Math.min(best, p.f + (d / PULSE_R) * PULSE_LIFE);
  }
  // anything no pulse reached is read at the end of the rounds
  return best === Infinity ? 470 + rand(it.id) * 10 : best;
});
export const TEE_FOUND = LOCATED[TEE.id];
