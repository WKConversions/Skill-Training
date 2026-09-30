import { loadFont } from "@remotion/fonts";
import { measureText } from "@remotion/layout-utils";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile } from "remotion";

// WKConversions brand (library: brands/wkconversions-brand.md)
export const C = {
  page: "#F7F7F8",
  dot: "#D6D9DE",
  card: "#FFFFFF",
  surface: "#EFF0F2",
  border: "#E2E3E6",
  ink: "#050F19",
  muted: "#575E68",
  muted2: "#838A94",
  faint: "#C9CED4",
  blue: "#3F8CE8",
  blueText: "#1266C9",
  soft: "#E6F0FD",
};

export const DISPLAY = "Inter Tight";
export const BODY = "Inter";

export const fontsLoaded = Promise.all([
  loadFont({ family: DISPLAY, url: staticFile("fonts/InterTight-800.woff2"), weight: "800" }),
  loadFont({ family: BODY, url: staticFile("fonts/Inter-400.woff2"), weight: "400" }),
  loadFont({ family: BODY, url: staticFile("fonts/Inter-500.woff2"), weight: "500" }),
  loadFont({ family: BODY, url: staticFile("fonts/Inter-600.woff2"), weight: "600" }),
]);

// Named curves (library: motion/easing.md)
export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const DEPART = Easing.bezier(0.64, 0, 0.78, 0);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const LINEAR = (t: number) => t;

/** Clamped tween from `a` to `b` between frames f0 and f1. */
export const tw = (
  f: number,
  f0: number,
  f1: number,
  a: number,
  b: number,
  ease: (t: number) => number = ARRIVE,
) =>
  interpolate(f, [f0, f1], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

/** Multi-key tween: keys are [frame, value] pairs, each segment with the given ease. */
export const keys = (
  f: number,
  k: [number, number][],
  ease: (t: number) => number = MOVE,
) => {
  if (f <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    if (f <= k[i][0]) return tw(f, k[i - 1][0], k[i][0], k[i - 1][1], k[i][1], ease);
  }
  return k[k.length - 1][1];
};

/**
 * The camera: puts world point (fx, fy) at screen point (sx, sy) at scale s.
 * Every scene lives inside one Camera, so nothing is ever shot from a locked frame.
 */
export const Camera: React.FC<{
  fx: number;
  fy: number;
  sx?: number;
  sy?: number;
  s: number;
  rx?: number;
  ry?: number;
  children: React.ReactNode;
}> = ({ fx, fy, sx = 960, sy = 540, s, rx = 0, ry = 0, children }) => (
  <AbsoluteFill style={{ perspective: 2600, overflow: "hidden" }}>
    <AbsoluteFill
      style={{
        transformOrigin: "0 0",
        transform: `translate(${sx - fx * s}px, ${sy - fy * s}px) scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)`,
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

/** The page canvas: #F7F7F8 with the site's dot grid, offset by the film's scroll. */
export const DotGrid: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <AbsoluteFill
    style={{
      backgroundColor: C.page,
      backgroundImage: `radial-gradient(${C.dot} ${2.2 * scale}px, transparent ${2.8 * scale}px)`,
      backgroundSize: `${44 * scale}px ${44 * scale}px`,
      backgroundPosition: `${x}px ${y}px`,
    }}
  />
);

export const shadow = "0 60px 128px -60px rgba(5,15,25,.40)";
export const shadowSoft = "0 30px 70px -40px rgba(5,15,25,.35)";

/** Arrow cursor, tip at (0,0) of its box. */
export const CursorArrow: React.FC<{ size?: number; color?: string; press?: number }> = ({
  size = 56,
  color = C.ink,
  press = 0,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ position: "absolute", left: -size * 0.12, top: -size * 0.06, scale: String(1 - press * 0.14), transformOrigin: "12% 6%" }}
  >
    <path
      d="M3 2 L3 19.5 L7.6 15.4 L10.6 22 L13.6 20.7 L10.7 14.2 L17 14.2 Z"
      fill={color}
      stroke="#FFFFFF"
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);

/** Circular founder portrait with the brand's blue ring. */
export const Portrait: React.FC<{ src: string; size: number; ring?: number }> = ({ src, size, ring = 6 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      padding: ring,
      background: C.blue,
      boxShadow: shadowSoft,
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        overflow: "hidden",
        border: `${ring * 0.8}px solid #FFFFFF`,
        boxSizing: "border-box",
        background: "#FFFFFF",
      }}
    >
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  </div>
);

/** A white label pill with the brand border. */
export const Pill: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  bg?: string;
  border?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 40, color = C.ink, bg = C.card, border = C.border, weight = 600, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.4,
      fontFamily: BODY,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1,
      color,
      background: bg,
      border: `2px solid ${border}`,
      borderRadius: 999,
      padding: `${size * 0.42}px ${size * 0.7}px`,
      whiteSpace: "nowrap",
      boxShadow: shadowSoft,
      ...style,
    }}
  >
    {children}
  </div>
);

// Illustrative copy for "your product": the paragraph a visitor won't read.
export const PARAGRAPH =
  "Our platform brings together invoicing, payments, reconciliation and reporting in one unified workspace, so finance teams can automate recurring workflows, match transactions across accounts, chase late payments, approve spend, forecast cash flow and close the month faster, without switching between spreadsheets, inboxes, banking portals and the dozen other tools that slow modern teams down. With configurable rules, role-based permissions, audit trails and integrations for every major bank and accounting system, it adapts to the way your team already works while giving leadership real-time visibility into every account, every entity and every currency.";

/** Countdown readout: 3.0s → 0.0s, tabular figures. */
export const timerText = (secondsLeft: number) => `${Math.max(0, secondsLeft).toFixed(1)}s`;

/** Holds the render until the brand fonts are loaded, so text is measured in the right face. */
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

// The hook's "3" (scene 1) and the countdown's "3" (scene 2) are one object: scene 2's camera
// starts zoomed into the pill so its "3" sits exactly where scene 1's was.
export const HOOK_THREE = { left: 300, top: 60, size: 900 };
export const PILL_TEXT = { size: 52, letterSpacing: "-0.03em" };
