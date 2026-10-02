import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate, staticFile } from "remotion";

// MindMirror, from their site (2 Oct 2026): white and off-white, ink #111713, lime #ABCB52 with an olive
// #708932 for words on white, soft lime and sage fields, hairline borders, Inter 400–600 with tight headlines,
// the brain/M mark in lime, mirrored contour lines, white chips, uppercase labels led by a lime square.
export const C = {
  white: "#FFFFFF", off: "#F7F8F3", ink: "#111713", muted: "#66706A", lime: "#ABCB52", olive: "#708932",
  soft: "#EDF4D7", sage: "#DDE8B5", border: "#E8ECE6", line: "#C9D6A0",
  // legacy names used by the shared kit
  red: "#708932", canvas: "#FFFFFF",
};
export const FONT = "Inter";
export const SHADOW = "0 30px 60px -30px rgba(17,23,19,.22), 0 10px 24px -14px rgba(17,23,19,.10)";

const faces = [400, 500, 600].map((w) => loadFont({ family: FONT, url: staticFile(`fonts/inter-latin-${w}.woff2`), weight: String(w) }));
export const fontsLoaded = Promise.all(faces);
export const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsLoaded.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  return ready;
};

export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const tw = (g: number, a: number, b: number, from = 0, to = 1, ease = ARRIVE) =>
  interpolate(g, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const Canvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.white, fontFamily: FONT, color: C.ink }}>{children}</AbsoluteFill>
);

/** Their section label: a small lime square, then uppercase, widely spaced. */
export const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; color?: string }> = ({ children, style, color = C.ink }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 600, fontSize: 24, letterSpacing: "0.16em", textTransform: "uppercase", color, ...style }}>
    <span style={{ width: 12, height: 12, background: C.lime }} />{children}
  </div>
);

/** Their chip: white, hairline border, a small lime ring before the word. */
export const Chip: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties; on?: number }> = ({ children, size = 30, style, on = 0 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.45, padding: `${size * 0.5}px ${size * 0.8}px`, borderRadius: size * 0.35, background: C.white,
    border: `1.5px solid ${C.border}`, boxShadow: SHADOW, fontWeight: 500, fontSize: size, color: C.ink, whiteSpace: "nowrap", ...style }}>
    <span style={{ width: size * 0.32, height: size * 0.32, borderRadius: 99, border: `${Math.max(2, size * 0.07)}px solid ${C.lime}`, background: on > 0.5 ? C.lime : "transparent" }} />
    {children}
  </span>
);
