import { loadFont } from "@remotion/fonts";
import { measureText } from "@remotion/layout-utils";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile } from "remotion";

// Top Jobs Abroad, the bright version, from the light side of topjobsabroad.com: the #F4F6FB page and
// white cards, navy #001135 type, the gold gradient #E8C96A → #C8A84B on buttons and highlights, gold
// eyebrows tracked 0.22em, Playfair Display 600 headlines with the key words in gold, Plus Jakarta Sans
// for everything else, bright city and people photography, white job cards with a photo header.
export const C = {
  navy: "#001135", ink: "#0D1B3E", page: "#F4F6FB", white: "#FFFFFF",
  gold: "#C8A84B", goldHi: "#E8C96A", goldInk: "#A8842A", goldPale: "#FBF3DC",
  muted: "#6B7896", faint: "#B7BFD3", line: "#E3E7F1", land: "#E6EBF4", landHi: "#D5DEEF",
  pillBlue: "#E8EEFB", pillBlueInk: "#3B5CB8", green: "#1FA36A",
};
export const GOLD = `linear-gradient(135deg, ${C.goldHi} 0%, ${C.gold} 100%)`;
export const SERIF = "Playfair Display";
export const SANS = "Plus Jakarta Sans";
export const SHADOW = "0 50px 100px -40px rgba(0,17,53,.28), 0 12px 30px -12px rgba(0,17,53,.12)";
export const fontsLoaded = Promise.all([
  loadFont({ family: SERIF, url: staticFile("fonts/Playfair-600.woff2"), weight: "600" }),
  loadFont({ family: SERIF, url: staticFile("fonts/Playfair-600i.woff2"), weight: "600", style: "italic" }),
  ...[400, 600, 700, 800].map((w) => loadFont({ family: SANS, url: staticFile(`fonts/Jakarta-${w}.woff2`), weight: String(w) })),
]);
export const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsLoaded.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  return ready;
};
export const measure = (t: string, size: number, family: string, weight: string, ls?: string) =>
  measureText({ text: t, fontFamily: family, fontSize: size, fontWeight: weight, letterSpacing: ls, validateFontIsLoaded: true }).width;

// Motion identity: warm, confident, premium. Signature = arrive (about 80% of moves); move for reframes
// and camera; depart for exits. Duration palette 8 / 18 / 32 frames. No bounce except the stamp.
export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const DEPART = Easing.bezier(0.64, 0, 0.78, 0);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const POP = Easing.bezier(0.34, 1.3, 0.64, 1);
export const LINEAR = (t: number) => t;
export const tw = (f: number, f0: number, f1: number, a: number, b: number, ease: (t: number) => number = ARRIVE) =>
  interpolate(f, [f0, f1], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

/** Keyframed value: [frame, value] pairs, eased between with MOVE, so the camera never jumps. */
export const keys = (g: number, k: [number, number][], ease = MOVE) => {
  if (g <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) if (g < k[i + 1][0]) return lerp(k[i][1], k[i + 1][1], ease((g - k[i][0]) / (k[i + 1][0] - k[i][0])));
  return k[k.length - 1][1];
};

/** The camera: (x, y) is the world point at the centre of the frame, s the zoom, r a roll in degrees. */
export const Cam: React.FC<{ x?: number; y?: number; s?: number; r?: number; children: React.ReactNode }> = ({ x = 960, y = 540, s = 1, r = 0, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(960px, 540px) rotate(${r}deg) scale(${s}) translate(${-x}px, ${-y}px)` }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

// cubic Bézier helpers for routes and arcs
export type P = [number, number];
export const bez = (p0: P, p1: P, p2: P, p3: P, t: number): P => {
  const u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
};
export const bezAngle = (p0: P, p1: P, p2: P, p3: P, t: number) => {
  const a = bez(p0, p1, p2, p3, Math.max(0, t - 0.01)), b = bez(p0, p1, p2, p3, Math.min(1, t + 0.01));
  return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
};

export type Word = { w: string; gold?: boolean };
/** Their headline: Playfair Display 600, key words in gold. Words rise in one by one out of a soft blur,
 * and the whole line leaves upward, blurring, so no headline just fades where it stands. */
export const Headline: React.FC<{ lines: Word[][]; g: number; at: number; out: number; x?: number; y?: number; size?: number; align?: "left" | "center"; color?: string; gap?: number; lh?: number }> = ({
  lines, g, at, out, x = 120, y = 120, size = 88, align = "left", color = C.navy, gap = 3, lh = 1.12,
}) => {
  const leave = tw(g, out, out + 9, 0, 1, DEPART);
  if (g < at - 1 || leave >= 1) return null;
  let n = 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave, translate: `0px ${-leave * 40}px`, filter: leave > 0 ? `blur(${leave * 8}px)` : undefined }}>
      {lines.map((line, li) => {
        const ws = line.map((w) => ({ ...w, width: measure(w.w, size, SERIF, "600", "-0.01em") }));
        const sp = measure(" ", size, SERIF, "600", "-0.01em");
        const total = ws.reduce((a, w) => a + w.width, 0) + sp * (ws.length - 1);
        let cx = align === "center" ? x - total / 2 : x;
        return ws.map((w, wi) => {
          const t0 = at + gap * n++;
          const left = cx;
          cx += w.width + sp;
          return (
            <span key={`${li}.${wi}`} style={{ position: "absolute", left, top: y + li * size * lh, fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1,
              letterSpacing: "-0.01em", whiteSpace: "nowrap", color: w.gold ? C.goldInk : color, opacity: tw(g, t0, t0 + 7, 0, 1, LINEAR),
              translate: `0px ${tw(g, t0, t0 + 16, size * 0.42, 0, ARRIVE)}px`, filter: `blur(${tw(g, t0, t0 + 10, 10, 0, LINEAR)}px)` }}>{w.w}</span>
          );
        });
      })}
    </div>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.22em", color: C.goldInk, textTransform: "uppercase", whiteSpace: "nowrap", ...style }}>{children}</div>
);

export const Pill: React.FC<{ children: React.ReactNode; kind?: "blue" | "gold"; size?: number }> = ({ children, kind = "blue", size = 22 }) => (
  <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: size, borderRadius: 999, padding: `${size * 0.3}px ${size * 0.7}px`, whiteSpace: "nowrap",
    background: kind === "blue" ? C.pillBlue : C.goldPale, color: kind === "blue" ? C.pillBlueInk : C.goldInk }}>{children}</span>
);

/** A bright photograph. `push` (0→1 over the scene) drives a slow, directional push-in, never a wobble. */
export const Pic: React.FC<{ src: string; style?: React.CSSProperties; push?: number; pos?: string; zoom?: number; flip?: boolean }> = ({ src, style, push = 0, pos = "center", zoom = 1.04, flip }) => (
  <div style={{ position: "absolute", overflow: "hidden", ...style }}>
    <Img src={staticFile(`${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, scale: `${flip ? -1 : 1} 1`,
      transform: `scale(${zoom + 0.08 * push})` }} />
  </div>
);

export const Check: React.FC<{ k: number; size?: number; fill?: string; ink?: string }> = ({ k, size = 34, fill = C.gold, ink = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ scale: String(Math.max(0, k)), flexShrink: 0 }}>
    <circle cx={12} cy={12} r={11} fill={fill} />
    <path d="M6.5 12.5 L10.5 16 L17.5 8.5" fill="none" stroke={ink} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={20} strokeDashoffset={20 * (1 - clamp01(k * 1.4 - 0.3))} />
  </svg>
);

/** A white card in their style: 24 px radius, a hairline, a soft wide shadow. */
export const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  position: "absolute", background: C.white, borderRadius: 24, border: `1.5px solid ${C.line}`, boxShadow: SHADOW, boxSizing: "border-box", ...extra,
});
