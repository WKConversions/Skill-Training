import { loadFont } from "@remotion/fonts";
import { measureText } from "@remotion/layout-utils";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate, staticFile } from "remotion";

// Nuvolos brand, from nuvolos.com (30 Sep 2026): the hero's deep blue with glowing cyan network nodes,
// the #3381FF of the logo, the blue-to-cyan section gradient, white illustration cards with blue
// outlines and dashed infrastructure boxes, Overpass type, slate text #434955.
export const C = {
  deep: "#0636A8",
  royal: "#0B55D6",
  blue: "#3381FF",
  cyan: "#3DF2FF",
  cyanSoft: "#8FF6FF",
  sky: "#3CCBFF",
  ink: "#FFFFFF",
  soft: "#CFE0FF",
  slate: "#434955",
  card: "#FFFFFF",
  cardLine: "#3381FF",
  tile: "#F3F6FC",
  grey: "#8A93A6",
};
export const FONT = "Overpass";
export const fontsLoaded = Promise.all([
  loadFont({ family: FONT, url: staticFile("fonts/Overpass-400.woff2"), weight: "400" }),
  loadFont({ family: FONT, url: staticFile("fonts/Overpass-600.woff2"), weight: "600" }),
  loadFont({ family: FONT, url: staticFile("fonts/Overpass-700.woff2"), weight: "700" }),
]);
export const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsLoaded.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  return ready;
};
export const measure = (text: string, size: number, weight: string, letterSpacing?: string) =>
  measureText({ text, fontFamily: FONT, fontSize: size, fontWeight: weight, letterSpacing, validateFontIsLoaded: true }).width;

// Motion identity: precise premium, calm. Signature = arrive; palette 8 / 16 / 32 frames.
export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const DEPART = Easing.bezier(0.64, 0, 0.78, 0);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const LINEAR = (t: number) => t;
export const tw = (f: number, f0: number, f1: number, a: number, b: number, ease: (t: number) => number = ARRIVE) =>
  interpolate(f, [f0, f1], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Camera: React.FC<{ fx: number; fy: number; sx?: number; sy?: number; s: number; children: React.ReactNode }> = ({ fx, fy, sx = 960, sy = 540, s, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${sx - fx * s}px, ${sy - fy * s}px) scale(${s})` }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);
export { rand } from "./geo";
