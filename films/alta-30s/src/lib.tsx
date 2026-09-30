import { loadFont } from "@remotion/fonts";
import { measureText } from "@remotion/layout-utils";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate, staticFile } from "remotion";

// Alta brand, from altahq.com (30 Sep 2026): the lavender page #EEF2FF and white hero panel with a faint
// dot grid, violet #7C3AED and indigo #6366F1, lilac agent tiles #C8B0F2 with the 3D agents Katie, Alex
// and Luna, 3D pastel smiley balls, near-black #1A1B1F type in Poppins (light words, a heavier key phrase),
// white rounded UI cards and black #222 buttons.
export const C = {
  page: "#EEF2FF", panel: "#FFFFFF", ink: "#1A1B1F", muted: "#6B6F7B", faint: "#B9BCC8", line: "#E6E8F2",
  violet: "#7C3AED", indigo: "#6366F1", lilac: "#C8B0F2", lilacSoft: "#EFE7FD", deep: "#45256E", btn: "#222222",
  green: "#16A34A", greenSoft: "#E7F7EC", yellow: "#F6C343", pink: "#F4A7C8",
};
export const FONT = "Poppins";
export const fontsLoaded = Promise.all([300, 400, 500, 600].map((w) => loadFont({ family: FONT, url: staticFile(`fonts/Poppins-${w}.woff2`), weight: String(w) })));
export const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsLoaded.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  return ready;
};
export const measure = (t: string, size: number, weight: string, ls?: string) =>
  measureText({ text: t, fontFamily: FONT, fontSize: size, fontWeight: weight, letterSpacing: ls, validateFontIsLoaded: true }).width;

// Motion identity: friendly but precise; small overshoot only on pops. Signature = arrive.
export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const DEPART = Easing.bezier(0.64, 0, 0.78, 0);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const POP = Easing.bezier(0.34, 1.4, 0.64, 1);
export const LINEAR = (t: number) => t;
export const tw = (f: number, f0: number, f1: number, a: number, b: number, ease: (t: number) => number = ARRIVE) =>
  interpolate(f, [f0, f1], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Camera: React.FC<{ fx: number; fy: number; sx?: number; sy?: number; s: number; children: React.ReactNode }> = ({ fx, fy, sx = 960, sy = 540, s, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${sx - fx * s}px, ${sy - fy * s}px) scale(${s})` }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

export type Word = { w: string; b?: boolean };
/** Their headline voice: Poppins light, the key phrase heavier; words arrive one by one. */
export const Headline: React.FC<{ lines: Word[][]; g: number; at: number; out: number; x?: number; y?: number; size?: number; align?: "left" | "center" }> = ({
  lines, g, at, out, x = 180, y = 120, size = 70, align = "left",
}) => {
  const leave = tw(g, out, out + 7, 0, 1, DEPART);
  if (g < at - 1 || leave >= 1) return null;
  let n = 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave, translate: `0px ${-leave * 24}px` }}>
      {lines.map((line, li) => {
        const ws = line.map((w) => ({ ...w, width: measure(w.w, size, w.b ? "600" : "300", "-0.01em") }));
        const sp = measure(" ", size, "300", "-0.01em");
        const total = ws.reduce((a, w) => a + w.width, 0) + sp * (ws.length - 1);
        let cx = align === "center" ? x - total / 2 : x;
        return ws.map((w, wi) => {
          const t0 = at + 3 * n++;
          const left = cx;
          cx += w.width + sp;
          return (
            <span key={`${li}.${wi}`} style={{ position: "absolute", left, top: y + li * size * 1.15, fontFamily: FONT, fontWeight: w.b ? 600 : 300, fontSize: size,
              lineHeight: 1, letterSpacing: "-0.01em", whiteSpace: "nowrap", color: C.ink, opacity: tw(g, t0, t0 + 6, 0, 1, LINEAR),
              translate: `0px ${tw(g, t0, t0 + 12, 28, 0, ARRIVE)}px`, filter: `blur(${tw(g, t0, t0 + 8, 8, 0, LINEAR)}px)` }}>{w.w}</span>
          );
        });
      })}
    </div>
  );
};

export const Card: React.FC<{ x: number; y: number; w: number; h?: number; k: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, k, children, style }) =>
  k <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, background: C.panel, border: `1.5px solid ${C.line}`, boxSizing: "border-box",
      boxShadow: "0 30px 70px -34px rgba(69,37,110,.35)", opacity: Math.min(1, k * 1.4), translate: `0px ${(1 - k) * 40}px`, scale: String(0.96 + 0.04 * k), ...style }}>
      {children}
    </div>
  );

export const Chip: React.FC<{ children: React.ReactNode; on?: number; color?: string; bg?: string; size?: number; style?: React.CSSProperties }> = ({ children, on = 1, color = C.deep, bg = C.lilacSoft, size = 28, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 500, fontSize: size, lineHeight: 1, color, background: bg,
    borderRadius: 10, padding: `${size * 0.42}px ${size * 0.55}px`, whiteSpace: "nowrap", opacity: on, ...style }}>{children}</div>
);
