import { loadFont } from "@remotion/fonts";
import { measureText } from "@remotion/layout-utils";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";

// Top Jobs Abroad brand, from topjobsabroad.com (30 Sep 2026): deep navy #001135 sections, ink #0D1B3E,
// the light page #F4F6FB, the gold gradient #E8C96A → #C8A84B on pill buttons, gold eyebrows tracked 0.22em,
// Playfair Display 600 headlines (second line in gold), Plus Jakarta Sans for everything else, city
// photography under a navy gradient, white job cards with a photo header, flags and pills.
export const C = {
  navy: "#001135", navy2: "#0B1A45", ink: "#0D1B3E", page: "#F4F6FB", white: "#FFFFFF",
  gold: "#C8A84B", goldHi: "#E8C96A", muted: "#6B7896", faint: "#B7BFD3", line: "#E3E7F1",
  pillBlue: "#E8EEFB", pillBlueInk: "#3B5CB8", pillGold: "#FBF3DC", pillGoldInk: "#9A7A22", green: "#1FA36A",
};
export const GOLD = `linear-gradient(135deg, ${C.goldHi} 0%, ${C.gold} 100%)`;
export const SERIF = "Playfair Display";
export const SANS = "Plus Jakarta Sans";
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

// Motion identity: warm, confident, premium. Signature = arrive; palette 8 / 16 / 30.
export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const DEPART = Easing.bezier(0.64, 0, 0.78, 0);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const POP = Easing.bezier(0.34, 1.35, 0.64, 1);
export const LINEAR = (t: number) => t;
export const tw = (f: number, f0: number, f1: number, a: number, b: number, ease: (t: number) => number = ARRIVE) =>
  interpolate(f, [f0, f1], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Camera: React.FC<{ fx?: number; fy?: number; sx?: number; sy?: number; s: number; children: React.ReactNode }> = ({ fx = 960, fy = 540, sx = 960, sy = 540, s, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${sx - fx * s}px, ${sy - fy * s}px) scale(${s})` }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

export type Word = { w: string; gold?: boolean };
/** Their headline: Playfair Display 600, the second line gold; words arrive one by one. */
export const Headline: React.FC<{ lines: Word[][]; g: number; at: number; out: number; x?: number; y?: number; size?: number; align?: "left" | "center"; color?: string; gap?: number }> = ({
  lines, g, at, out, x = 140, y = 120, size = 88, align = "left", color = C.white, gap = 3,
}) => {
  const leave = tw(g, out, out + 8, 0, 1, DEPART);
  if (g < at - 1 || leave >= 1) return null;
  let n = 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave, translate: `0px ${-leave * 26}px` }}>
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
            <span key={`${li}.${wi}`} style={{ position: "absolute", left, top: y + li * size * 1.12, fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1,
              letterSpacing: "-0.01em", whiteSpace: "nowrap", color: w.gold ? C.goldHi : color, opacity: tw(g, t0, t0 + 6, 0, 1, LINEAR),
              translate: `0px ${tw(g, t0, t0 + 12, 30, 0, ARRIVE)}px`, filter: `blur(${tw(g, t0, t0 + 8, 8, 0, LINEAR)}px)` }}>{w.w}</span>
          );
        });
      })}
    </div>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.22em", color: C.gold, textTransform: "uppercase", whiteSpace: "nowrap", ...style }}>{children}</div>
);

export const Pill: React.FC<{ children: React.ReactNode; kind?: "blue" | "gold"; size?: number }> = ({ children, kind = "blue", size = 22 }) => (
  <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: size, borderRadius: 999, padding: `${size * 0.3}px ${size * 0.7}px`, whiteSpace: "nowrap",
    background: kind === "blue" ? C.pillBlue : C.pillGold, color: kind === "blue" ? C.pillBlueInk : C.pillGoldInk }}>{children}</span>
);

/** A city photograph under their navy gradient. */
/** The photo is never still: a slow Ken Burns drift, phased per city. */
export const Photo: React.FC<{ src: string; style?: React.CSSProperties; shade?: number; pos?: string }> = ({ src, style, shade = 1, pos = "center" }) => {
  const g = useCurrentFrame() + src.length * 37;
  return (
  <div style={{ position: "absolute", overflow: "hidden", ...style }}>
    <Img src={staticFile(`photos/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos,
      scale: String(1.1 + 0.04 * Math.sin(g / 70)), translate: `${Math.sin(g / 53) * 2.5}% ${Math.cos(g / 61) * 1.5}%` }} />
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,17,53,${0.25 * shade}) 0%, rgba(0,17,53,${0.55 * shade}) 55%, rgba(0,17,53,${0.92 * shade}) 100%)` }} />
  </div>
  );
};

export const Check: React.FC<{ k: number; size?: number }> = ({ k, size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ scale: String(k), flexShrink: 0 }}>
    <circle cx={12} cy={12} r={11} fill={C.gold} />
    <path d="M6.5 12.5 L10.5 16 L17.5 8.5" fill="none" stroke={C.navy} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
