// The kinetic kit for Remotion films built phrase by phrase on one continuous stage (planning/phrase-by-phrase.md).
// Copy into src/ next to timeline.ts. It needs two project files:
//   src/clock.ts  export const T = timeline(30, { hook: 0, turn: 3.4, …, end: 30, ...WORDS });   // beats + aligned words
//   src/lib.tsx   export const KIT = { font: "DM Sans", serif: "Gelasio", ink: "#0D2139", word: "#2D5F95",
//                                      mark: "#C9D7E6", under: "#2D5F95", strike: "#2D5F95" };  // the brand's roles
// Built from Karl's October 2026 films (Bruno Morgante v3, MindMirror, Amargier Advisory).
import React from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";
import { T } from "./clock";
import { KIT } from "./lib";

export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const POP = Easing.bezier(0.3, 1.45, 0.6, 1);            // a small overshoot, for pops on landings only
export const LIN = (t: number) => t;
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** A label plus any number of offsets, in seconds: off("w:two", -0.05, 0.1). (A label string takes one offset.) */
export const off = (pos: string, ...d: number[]) => T.s(pos) + d.reduce((a, b) => a + b, 0);

let ctx: CanvasRenderingContext2D | null = null;
/** Width of a run of type (after fonts load), so a mark, a morph or a centred line starts from the word's exact box. */
export const measure = (t: string, size: number, weight = 500, ls = -0.045, serif = false) => {
  ctx = ctx ?? document.createElement("canvas").getContext("2d")!;
  ctx.font = serif ? `italic ${weight} ${size}px ${KIT.serif}` : `${weight} ${size}px ${KIT.font}`;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${ls * size}px`;
  return ctx.measureText(t).width;
};

/** A word of a Line: `at` is its spoken word ("w:idea"); `mark` sweeps a block behind it, `under` draws an
 *  underline, `strike` crosses it out; `serif` sets it in the brand's italic; `accent` colours it. */
export type W = { t: string; at: string; accent?: boolean; color?: string; serif?: boolean; mark?: string; under?: string; strike?: string };

/** Words that build on the voice: each rises 32% of its size out of a blur on its spoken word, and leaves
 *  (with `out`) upward into a blur, staggered. Words, not sentences: six or fewer to a line. */
export const Line: React.FC<{ g: number; words: W[]; x: number; y: number; size: number; weight?: number; color?: string; out?: string; outDur?: number;
  dy?: number; ls?: number; style?: React.CSSProperties }> = ({ g, words, x, y, size, weight = 500, color = KIT.ink, out, outDur = 0.3, dy = 0.32, ls = -0.045, style }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: size * 0.26, whiteSpace: "nowrap", fontFamily: KIT.font, fontWeight: weight, fontSize: size,
    lineHeight: 1, letterSpacing: `${ls}em`, ...style }}>
    {words.map((w, i) => {
      const k = T.k(g, w.at, 0.42);
      const o = out ? T.k(g, off(out, i * 0.035), outDur, DEPART) : 0;
      const m = w.mark ? T.k(g, w.mark, 0.32, MOVE) : 0;
      return (
        <span key={i} style={{ position: "relative", isolation: "isolate", display: "inline-block", opacity: Math.min(1, k * 1.7) * (1 - o),
          ...(w.serif ? { fontFamily: KIT.serif, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em" } : {}),
          transform: `translateY(${((1 - k) * dy - o * 0.3) * size}px)`, filter: k < 1 || o > 0 ? `blur(${(1 - k) * 9 + o * 9}px)` : undefined,
          color: w.color ?? (w.accent ? KIT.word : color) }}>
          {w.mark && <span style={{ position: "absolute", zIndex: -1, left: -size * 0.1, right: -size * 0.1, top: size * 0.06, bottom: -size * 0.1, borderRadius: size * 0.08,
            background: KIT.mark, transformOrigin: "0 50%", transform: `scaleX(${m})` }} />}
          {w.t}
          {w.under && <span style={{ position: "absolute", left: 0, right: 0, bottom: -size * 0.06, height: Math.max(4, size * 0.045), borderRadius: 9, background: KIT.under,
            transformOrigin: "0 50%", transform: `scaleX(${T.k(g, w.under, 0.45, MOVE)})` }} />}
          {w.strike && <span style={{ position: "absolute", left: -size * 0.04, right: -size * 0.04, top: "54%", height: Math.max(6, size * 0.075), borderRadius: 9,
            background: KIT.strike, transformOrigin: "0 50%", transform: `scaleX(${T.k(g, w.strike, 0.28, MOVE)}) rotate(-2deg)` }} />}
        </span>
      );
    })}
  </div>
);
/** The x that centres a Line on cx. */
export const centred = (words: W[], size: number, cx = 960, weight = 500) =>
  cx - (words.reduce((a, w) => a + measure(w.t, size, w.serif ? 400 : weight, w.serif ? -0.02 : -0.045, !!w.serif), 0) + 0.26 * size * (words.length - 1)) / 2;

/** One slot, two contents: the first rolls up out of a mask as the second rolls in ("hard lessons" into "stories",
 *  "Idea" into "Result"). Slots are position: relative, so a Line inside sits at its own x/y. */
export const Roll: React.FC<{ g: number; a: React.ReactNode; b: React.ReactNode; at: string; dur?: number; h: number; style?: React.CSSProperties }> = ({ g, a, b, at, dur = 0.45, h, style }) => {
  const k = T.k(g, at, dur, MOVE);
  return (
    <div style={{ position: "relative", height: h, overflow: "hidden", ...style }}>
      <div style={{ transform: `translateY(${-k * h}px)`, filter: k > 0 && k < 1 ? `blur(${Math.sin(k * Math.PI) * 5}px)` : undefined }}>
        <div style={{ position: "relative", height: h, display: "flex", alignItems: "center" }}>{a}</div>
        <div style={{ position: "relative", height: h, display: "flex", alignItems: "center" }}>{b}</div>
      </div>
    </div>
  );
};

/** An odometer digit: v counts continuously (0 → 2 rolls through 1); a soft mask at top and bottom. */
export const Digit: React.FC<{ v: number; size: number; width?: number }> = ({ v, size, width = 0.62 }) => (
  <div style={{ width: size * width, height: size, overflow: "hidden", position: "relative", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)" }}>
    <div style={{ position: "absolute", left: 0, top: -v * size }}>{Array.from({ length: 21 }, (_, i) => <div key={i} style={{ height: size, lineHeight: `${size}px`, textAlign: "center" }}>{i % 10}</div>)}</div>
  </div>
);

/** A photo in a circle, cropped by object-position and zoom. */
export const Disc: React.FC<{ src: string; x: number; y: number; r: number; pos?: string; zoom?: number; ring?: number; ringColor?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  src, x, y, r, pos = "50% 30%", zoom = 1, ring = 0, ringColor = "#fff", style, children }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden",
    boxShadow: ring ? `0 0 0 ${ring}px ${ringColor}, 0 40px 80px -30px rgba(0,0,0,.4)` : undefined, ...style }}>
    <Img src={staticFile(`img/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: pos }} />
    {children}
  </div>
);

/** A colour field (or a whole scene) growing as a circle out of an object at (x, y): the transition is itself a move.
 *  It bleeds 300 px past the frame so the camera can breathe out without an edge; children use frame coordinates.
 *  Use a flat colour: a large gradient bands into rings under a camera push. */
export const Iris: React.FC<{ x: number; y: number; r: number; bg?: string; children?: React.ReactNode }> = ({ x, y, r, bg, children }) =>
  r <= 0 ? null : (
    <div style={{ position: "absolute", left: -300, top: -300, width: 2520, height: 1680, background: bg, clipPath: r > 2200 ? undefined : `circle(${r}px at ${x + 300}px ${y + 300}px)` }}>
      <div style={{ position: "absolute", left: 300, top: 300, width: 1920, height: 1080 }}>{children}</div>
    </div>
  );

/** Values keyed on labels, for an object that persists across beats: track(g, [["hook", x, y, s, o], ["turn+0.6", x2, y2, s2, o2, MOVE], …]).
 *  A trailing function eases the segment arriving at that key; without one it is linear (a drift). */
export type Track = [string, ...(number | ((t: number) => number))[]];
export const track = (g: number, keys: Track[]) => {
  let i = 0;
  while (i < keys.length - 1 && g >= T.f(keys[i + 1][0])) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const fa = T.f(a[0]), fb = T.f(b[0]);
  const ease = (typeof b[b.length - 1] === "function" ? b[b.length - 1] : LIN) as (t: number) => number;
  const t = fb > fa ? ease(Math.min(1, Math.max(0, (g - fa) / (fb - fa)))) : 1;
  const va = a.slice(1).filter((v) => typeof v === "number") as number[], vb = b.slice(1).filter((v) => typeof v === "number") as number[];
  return va.map((v, j) => lerp(v, vb[j], t));
};

/** The camera breathes: a slow linear push through each beat, released with MOVE on each transition.
 *  Keys are [label, scale, x, y, ease?]; at(px, py, s) aims the push at a point of the frame. Apply to one
 *  AbsoluteFill: transform `translate(${x}px, ${y}px) scale(${s})`, transformOrigin 50% 50%, willChange transform. */
export type Key = [string, number, number, number, ((t: number) => number)?];
export const at = (px: number, py: number, s: number): [number, number, number] => [s, (960 - px) * s, (540 - py) * s];
export const camera = (g: number, keys: Key[]) => {
  const [s, x, y] = track(g, keys as unknown as Track[]);
  return { s, x, y };
};

/** Clamped interpolation on frames, for anything not keyed on a label. */
export const tw = (g: number, a: number, b: number, from = 0, to = 1, ease = ARRIVE) =>
  interpolate(g, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
