import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate, staticFile } from "remotion";

// Amargier Advisory, from their site (2 Oct 2026): navy #0D2139 and ink #12263B on white and a warm white
// #FAF9F6, hairlines #DCE1E6, DM Sans with a serif italic second line (Georgia; here Gelasio, drawn to Georgia's
// metrics), the "A" mark of two leaning bars. The form asks for restrained navy and blue, white space, calm pacing,
// readable captions; the film stays bright: white, warm white and a pale blue field, navy used for type and shapes.
export const C = {
  white: "#FFFFFF", warm: "#FAF9F6", mist: "#EEF3F8", navy: "#0D2139", ink: "#12263B", muted: "#586574", line: "#DCE1E6",
  blue: "#2D5F95", sky: "#C9D7E6", dot: "#C3CEDA",
  // names the shared kit uses
  red: "#2D5F95", lime: "#C9D7E6", olive: "#2D5F95", canvas: "#FFFFFF",
};
export const FONT = "DM Sans";
export const SERIF = "Gelasio";
export const SHADOW = "0 30px 60px -32px rgba(13,33,57,.28), 0 10px 24px -14px rgba(13,33,57,.12)";

const faces = [
  loadFont({ family: FONT, url: staticFile("fonts/dmsans.woff2"), weight: "400 700" }),
  loadFont({ family: SERIF, url: staticFile("fonts/gelasio-italic.woff2"), weight: "400 700", style: "italic" }),
];
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
  <AbsoluteFill style={{ background: C.white, fontFamily: FONT, color: C.navy }}>{children}</AbsoluteFill>
);
/** Their small label: uppercase, widely spaced. */
export const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontWeight: 600, fontSize: 24, letterSpacing: "0.18em", textTransform: "uppercase", color: C.navy, ...style }}>{children}</div>
);
/** Their chip: white, hairline border, navy text. */
export const Chip: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties; on?: number }> = ({ children, size = 30, style, on = 0 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: `${size * 0.45}px ${size * 0.75}px`, borderRadius: 12, background: on > 0.5 ? C.navy : C.white,
    color: on > 0.5 ? "#fff" : C.navy, border: `1.5px solid ${on > 0.5 ? C.navy : C.line}`, boxShadow: SHADOW, fontWeight: 500, fontSize: size, whiteSpace: "nowrap", ...style }}>{children}</span>
);
