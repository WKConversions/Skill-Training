import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate, staticFile } from "remotion";

// Bruno Morgante, from brunomorgante.com (2 Oct 2026): black and white with a warm stone grey
// (--accent-hsl 43,4%,65%), Poppins, a line-drawn BM logo whose one colour is the red of the tie
// (#BD1717). The film keeps his palette but lives on a light, warm canvas (Karl: "not too dark and
// depressing"); the tie red is his mark and appears only where he makes something happen.
export const C = {
  canvas: "#F6F4F1", paper: "#FFFFFF", ink: "#121212", ink2: "#4A4844", stone: "#A8A69F", stonePale: "#E9E6E1",
  line: "#E4E0DA", red: "#BD1717", redPale: "#F6E3E1", green: "#2F8A57", greenPale: "#E2F1E8", amber: "#B7801E", amberPale: "#F6ECD9",
};
export const FONT = "Poppins";
export const SHADOW = "0 30px 60px -28px rgba(18,18,18,.28), 0 10px 22px -12px rgba(18,18,18,.12)";

const faces = [400, 500, 600, 700, 800].map((w) => loadFont({ family: FONT, url: staticFile(`fonts/poppins-latin-${w}-normal.woff2`), weight: String(w) }));
export const fontsLoaded = Promise.all(faces);
export const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsLoaded.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  return ready;
};

// the film's one curve for arrivals, a softer one for moves, and a departure
export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const tw = (g: number, a: number, b: number, from = 0, to = 1, ease = ARRIVE) =>
  interpolate(g, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const Canvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.canvas, fontFamily: FONT, color: C.ink }}>
    {/* a warm wash, like light on paper */}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 70% at 85% 10%, rgba(255,255,255,.95), rgba(255,255,255,0) 70%), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(233,230,225,.9), rgba(233,230,225,0) 70%)" }} />
    {children}
  </AbsoluteFill>
);

export const Card: React.FC<{ x: number; y: number; w: number; h?: number; r?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, r = 22, style, children }) => (
  // placed by x/y; a style transform (an entrance) is applied after the placement, never instead of it
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: r, background: C.paper, boxShadow: SHADOW, border: `1px solid ${C.line}`, ...style,
    transform: `translate(${x}px, ${y}px) ${style?.transform ?? ""}` }}>{children}</div>
);

export const Pill: React.FC<{ tone: "green" | "amber" | "stone" | "red" | "ink"; children: React.ReactNode; size?: number }> = ({ tone, children, size = 17 }) => {
  const t = { green: [C.greenPale, C.green], amber: [C.amberPale, C.amber], stone: [C.stonePale, C.ink2], red: [C.redPale, C.red], ink: [C.ink, "#fff"] }[tone];
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: size, padding: `${size * 0.35}px ${size * 0.8}px`, borderRadius: 999, background: t[0], color: t[1], whiteSpace: "nowrap" }}>
    <span style={{ width: size * 0.45, height: size * 0.45, borderRadius: 99, background: t[1] }} />{children}</span>;
};

export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontWeight: 600, fontSize: 20, letterSpacing: "0.16em", textTransform: "uppercase", color: C.ink2, ...style }}>{children}</div>
);

/** The tie: a short red stroke under the word he acts on (his logo's only colour). */
export const Tie: React.FC<{ w: number; k?: number; style?: React.CSSProperties }> = ({ w, k = 1, style }) => (
  <div style={{ height: 8, width: w, borderRadius: 8, background: C.red, transformOrigin: "0 50%", transform: `scaleX(${k})`, ...style }} />
);

export const Cursor: React.FC<{ x: number; y: number; press?: number }> = ({ x, y, press = 0 }) => (
  <svg width={46} height={46} viewBox="0 0 24 24" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) scale(${1 - 0.12 * press})`, filter: "drop-shadow(0 6px 8px rgba(18,18,18,.3))" }}>
    <path d="M4 2l15 9-6.5 1.6L16 20l-2.8 1.3-3.4-7.3L4 18z" fill={C.ink} stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

export const Avatar: React.FC<{ initials: string; size?: number; tone?: string }> = ({ initials, size = 56, tone = C.stonePale }) => (
  <span style={{ width: size, height: size, borderRadius: 99, background: tone, color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.36, flexShrink: 0 }}>{initials}</span>
);
