import { loadFont } from "@remotion/fonts";
import { measureText } from "@remotion/layout-utils";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate, staticFile } from "remotion";

// Cartesian Systems brand, from cartesian.systems (computed styles, 30 Sep 2026): the black hero
// panel, white Inter 600 headlines with the last phrase in light grey, Poppins for UI and numbers,
// slate-blue and grey route lines with rounded corners, olive location pins, the yellow-green CTA.
export const C = {
  bg: "#000000",
  panel: "#141414",
  card: "#1A1A1F",
  cardEdge: "#2C2C33",
  ink: "#FFFFFF",
  grey: "#CFCFCF",
  muted: "#8C8C8C",
  dim: "#555558",
  lineGrey: "#343434",
  slate: "#46536E",
  shelfTop: "#16161A",
  shelfSide: "#0E0E11",
  shelfEdge: "#3A3F4D",
  itemUnknown: "#2B2D33",
  blue: "#A1C9FD",
  mapBlue: "#5EA2FF",
  pin: "#DCDC83",
  pinDim: "#5C5C3C",
};

export const HEAD = "Inter";
export const UI = "Poppins";

export const fontsLoaded = Promise.all([
  loadFont({ family: HEAD, url: staticFile("fonts/Inter-500.woff2"), weight: "500" }),
  loadFont({ family: HEAD, url: staticFile("fonts/Inter-600.woff2"), weight: "600" }),
  loadFont({ family: UI, url: staticFile("fonts/Poppins-400.woff2"), weight: "400" }),
  loadFont({ family: UI, url: staticFile("fonts/Poppins-500.woff2"), weight: "500" }),
  loadFont({ family: UI, url: staticFile("fonts/Poppins-600.woff2"), weight: "600" }),
]);

export const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    fontsLoaded.then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, [handle]);
  return ready;
};

export const measure = (text: string, size: number, family: string, weight: string, letterSpacing?: string) =>
  measureText({ text, fontFamily: family, fontSize: size, fontWeight: weight, letterSpacing, validateFontIsLoaded: true }).width;

// Motion identity: precise premium. Signature curve = arrive; palette quick 8 / standard 14 / slow 30.
export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const DEPART = Easing.bezier(0.64, 0, 0.78, 0);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const LINEAR = (t: number) => t;

export const tw = (f: number, f0: number, f1: number, a: number, b: number, ease: (t: number) => number = ARRIVE) =>
  interpolate(f, [f0, f1], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

export const keys = (f: number, k: [number, number][], ease: (t: number) => number = MOVE) => {
  if (f <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (f <= k[i][0]) return tw(f, k[i - 1][0], k[i][0], k[i - 1][1], k[i][1], ease);
  return k[k.length - 1][1];
};

/** The camera: world point (fx, fy) at screen point (sx, sy), scale s. */
export const Camera: React.FC<{ fx: number; fy: number; sx?: number; sy?: number; s: number; children: React.ReactNode }> = ({
  fx, fy, sx = 960, sy = 540, s, children,
}) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${sx - fx * s}px, ${sy - fy * s}px) scale(${s})` }}>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

export * from "./geo";
