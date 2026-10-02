import React from "react";
import { Easing, Img, staticFile } from "remotion";
import { C, FONT, MOVE, SERIF, lerp } from "./lib";
import { timeline } from "./timeline";
import WORDS from "./words.json";

// The film's clock: beats and every spoken word are labels, force-aligned to Karl's voice-over (harvest/vo.mp3,
// ElevenLabs "Christina"); each beat starts about 0.2 s before its first word.
export const T = timeline(30, {
  hook: 0, brand: 3.15, emea: 4.65, opp: 7.55, eco: 11.1, connect: 17.85, exp: 20.45, build: 22.9, cta: 25.3, end: 30.0,
  ...WORDS,
});
export const POP = Easing.bezier(0.3, 1.45, 0.6, 1);
export const LIN = (t: number) => t;
export const DUR = T.f("end");
/** A label plus any number of offsets, in seconds: off("w:two", -0.05, 0.1). */
export const off = (pos: string, ...d: number[]) => T.s(pos) + d.reduce((a, b) => a + b, 0);

let ctx: CanvasRenderingContext2D | null = null;
/** Width of a run of type, so a mark or a morph can start from the word's exact box. */
export const measure = (t: string, size: number, weight = 500, ls = -0.045, serif = false) => {
  ctx = ctx ?? document.createElement("canvas").getContext("2d")!;
  ctx.font = serif ? `italic ${weight} ${size}px ${SERIF}` : `${weight} ${size}px ${FONT}`;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${ls * size}px`;
  return ctx.measureText(t).width;
};

export type W = { t: string; at: string; red?: boolean; mark?: string; strike?: string; color?: string; serif?: boolean; under?: string };

/** A line of type that builds word by word on the spoken words: each word rises 30% of its size out of a blur;
 *  `mark` sweeps the tie red behind a word (the word turns white), `strike` crosses it out in red. */
export const Line: React.FC<{ g: number; words: W[]; x: number; y: number; size: number; weight?: number; color?: string; out?: string; outDur?: number;
  dy?: number; ls?: number; style?: React.CSSProperties }> = ({ g, words, x, y, size, weight = 500, color = C.ink, out, outDur = 0.3, dy = 0.32, ls = -0.045, style }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: size * 0.26, whiteSpace: "nowrap", fontWeight: weight, fontSize: size, lineHeight: 1,
    letterSpacing: `${ls}em`, ...style }}>
    {words.map((w, i) => {
      const k = T.k(g, w.at, 0.42);
      const o = out ? T.k(g, off(out, i * 0.035), outDur, Easing.bezier(0.55, 0, 0.9, 0.4)) : 0;
      const m = w.mark ? T.k(g, w.mark, 0.32, MOVE) : 0;
      const s = w.strike ? T.k(g, w.strike, 0.28, MOVE) : 0;
      const base = w.color ?? (w.red ? C.red : color);
      return (
        <span key={i} style={{ position: "relative", isolation: "isolate", display: "inline-block", opacity: Math.min(1, k * 1.7) * (1 - o),
          ...(w.serif ? { fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em" } : {}),
          transform: `translateY(${((1 - k) * dy - o * 0.3) * size}px)`, filter: k < 1 || o > 0 ? `blur(${(1 - k) * 9 + o * 9}px)` : undefined,
          color: base }}>
          {w.mark && <span style={{ position: "absolute", zIndex: -1, left: -size * 0.1, right: -size * 0.1, top: size * 0.06, bottom: -size * 0.1, borderRadius: size * 0.08,
            background: C.lime, transformOrigin: "0 50%", transform: `scaleX(${m})` }} />}
          {w.t}
          {w.under && <span style={{ position: "absolute", left: 0, right: 0, bottom: -size * 0.06, height: Math.max(4, size * 0.045), borderRadius: 9, background: C.blue,
            transformOrigin: "0 50%", transform: `scaleX(${T.k(g, w.under, 0.45, MOVE)})` }} />}
          {w.strike && <span style={{ position: "absolute", left: -size * 0.04, right: -size * 0.04, top: "54%", height: Math.max(6, size * 0.075), borderRadius: 9,
            background: C.red, transformOrigin: "0 50%", transform: `scaleX(${s}) rotate(-2deg)` }} />}
        </span>
      );
    })}
  </div>
);

/** One slot, two words: the first rolls up out of a mask as the second rolls in (a word that turns into another). */
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

/** A photo in a circle (his photos, cropped to the face): centre, radius, the crop. */
export const Disc: React.FC<{ src: string; x: number; y: number; r: number; pos?: string; zoom?: number; ring?: number; ringColor?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  src, x, y, r, pos = "50% 30%", zoom = 1, ring = 0, ringColor = "#fff", style, children }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden", boxShadow: ring ? `0 0 0 ${ring}px ${ringColor}, 0 40px 80px -30px rgba(0,0,0,.45)` : undefined, ...style }}>
    <Img src={staticFile(`img/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: pos }} />
    {children}
  </div>
);

/** A full-frame colour (or scene) revealed through a circle that grows out of an object. It bleeds 300 px past the
 *  frame so the camera can breathe out without showing an edge; children are laid out in frame coordinates. */
export const Iris: React.FC<{ x: number; y: number; r: number; bg?: string; children?: React.ReactNode }> = ({ x, y, r, bg, children }) =>
  r <= 0 ? null : (
    <div style={{ position: "absolute", left: -300, top: -300, width: 2520, height: 1680, background: bg, clipPath: r > 2200 ? undefined : `circle(${r}px at ${x + 300}px ${y + 300}px)` }}>
      <div style={{ position: "absolute", left: 300, top: 300, width: 1920, height: 1080 }}>{children}</div>
    </div>
  );

/** Camera keys: [label, scale, x, y]; each segment eases into the next (linear for drifts, MOVE for the moves). */
export type Key = [string, number, number, number, ((t: number) => number)?];
export const camera = (g: number, keys: Key[]) => {
  let i = 0;
  while (i < keys.length - 1 && g >= T.f(keys[i + 1][0])) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const fa = T.f(a[0]), fb = T.f(b[0]);
  const k = fb > fa ? (b[4] ?? LIN)(Math.min(1, Math.max(0, (g - fa) / (fb - fa)))) : 1;
  return { s: lerp(a[1], b[1], k), x: lerp(a[2], b[2], k), y: lerp(a[3], b[3], k) };
};
