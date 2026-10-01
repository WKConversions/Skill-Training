import { loadFont } from "@remotion/fonts";
import { measureText } from "@remotion/layout-utils";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate, staticFile } from "remotion";

// GoHere, from gohere.app (1 Oct 2026) and the owner's brief: white pages with soft mint glows, dark blue
// #141430 type, light green #A3D2C2 buttons and pills, Nunito Sans 800 headlines, rounded cards with a
// hairline, an iPhone mockup at the centre. Tone: warm, human, calm. No hype montage.
export const C = {
  navy: "#141430", mint: "#A3D2C2", mintPale: "#E4F2ED", mintDeep: "#5E9F8A", white: "#FFFFFF", page: "#F7F9FB",
  slate: "#4B5372", faint: "#A7ADC0", line: "#E6E8EF", appNavy: "#1E2756", appBlue: "#2B3A78", star: "#F5B83D", green: "#2FA36B",
};
export const FONT = "Nunito Sans";
export const SHADOW = "0 40px 90px -40px rgba(20,20,48,.35), 0 12px 30px -14px rgba(20,20,48,.16)";
export const fontsLoaded = loadFont({ family: FONT, url: staticFile("fonts/NunitoSans-var.woff2"), weight: "200 1000" });
export const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsLoaded.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  return ready;
};
export const measure = (t: string, size: number, weight = "800", ls = "-0.02em") =>
  measureText({ text: t, fontFamily: FONT, fontSize: size, fontWeight: weight, letterSpacing: ls, validateFontIsLoaded: true }).width;

// Motion identity: calm and confident. Signature = a long soft settle; moves are slower than in a
// product ad (palette 14 / 24 / 40 frames) and the camera only ever eases.
export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.75, 0);
export const MOVE = Easing.bezier(0.6, 0, 0.3, 1);
export const POP = Easing.bezier(0.3, 1.25, 0.6, 1);
export const LINEAR = (t: number) => t;
export const tw = (f: number, f0: number, f1: number, a: number, b: number, ease: (t: number) => number = ARRIVE) =>
  interpolate(f, [f0, f1], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
/** Keyframed value, eased between keys with MOVE so the camera never jumps. */
export const keys = (g: number, k: [number, number][], ease = MOVE) => {
  if (g <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) if (g < k[i + 1][0]) return lerp(k[i][1], k[i + 1][1], ease((g - k[i][0]) / (k[i + 1][0] - k[i][0])));
  return k[k.length - 1][1];
};

/** The camera: (x, y) is the world point at the centre of the frame; s the zoom. */
export const Cam: React.FC<{ x?: number; y?: number; s?: number; children: React.ReactNode }> = ({ x = 960, y = 540, s = 1, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(960px, 540px) scale(${s}) translate(${-x}px, ${-y}px)` }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

export type Word = { w: string; hl?: boolean; t?: number }; // t: the frame the word is spoken, if it should land exactly
/** A script line as GoHere sets type: Nunito Sans 800, dark blue, key words on a light green marker that
 * sweeps in behind them. Words rise out of a soft blur, a few frames apart; the line leaves upward. */
export const Caption: React.FC<{ lines: Word[][]; g: number; at: number; out: number; x?: number; y?: number; size?: number; align?: "left" | "center"; gap?: number; color?: string }> = ({
  lines, g, at, out, x = 140, y = 400, size = 76, align = "left", gap = 3, color = C.navy,
}) => {
  const leave = tw(g, out, out + 14, 0, 1, DEPART);
  if (g < at - 1 || leave >= 1) return null;
  let n = 0;
  const lh = size * 1.14;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave, translate: `0px ${-leave * 36}px`, filter: leave > 0 ? `blur(${leave * 6}px)` : undefined }}>
      {lines.map((line, li) => {
        const ws = line.map((w) => ({ ...w, width: measure(w.w, size) }));
        const sp = measure(" ", size);
        const total = ws.reduce((a, w) => a + w.width, 0) + sp * (ws.length - 1);
        let cx = align === "center" ? x - total / 2 : x;
        return ws.map((w, wi) => {
          const t0 = w.t ?? at + gap * n;
          n++;
          const left = cx;
          cx += w.width + sp;
          const mark = w.hl ? tw(g, t0 + 8, t0 + 26, 0, 1, MOVE) : 0;
          return (
            // placed with a transform: fractional left/top snap to whole pixels under the push and the words shake
            <span key={`${li}.${wi}`} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${left}px, ${y + li * lh}px)`, height: size, whiteSpace: "nowrap" }}>
              {w.hl && <span style={{ position: "absolute", left: -size * 0.1, right: -size * 0.1, top: size * 0.52, height: size * 0.42, borderRadius: size * 0.12,
                background: C.mint, transformOrigin: "0 50%", scale: `${mark} 1`, opacity: 0.85 }} />}
              <span style={{ position: "relative", fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: `${size}px`, letterSpacing: "-0.02em", color,
                // its own layer, so the slow rise glides instead of stepping a whole pixel at a time
                // its own layer: slow moves glide instead of stepping a whole pixel (render it in contiguous
                // chunks, one tab each: library/scripts/render_chunks.sh)
                display: "inline-block", willChange: "transform", opacity: tw(g, t0, t0 + 9, 0, 1, LINEAR), translate: `0px ${tw(g, t0, t0 + 22, size * 0.38, 0)}px`,
                filter: `blur(${tw(g, t0, t0 + 12, 8, 0, LINEAR)}px)` }}>{w.w}</span>
            </span>
          );
        });
      })}
    </div>
  );
};

/** The calm background: white with two soft light-green glows that drift very slowly, as on their hero. */
export const Glow: React.FC<{ g: number; o?: number }> = ({ g, o = 1 }) => (
  <AbsoluteFill style={{ background: C.white, opacity: o }}>
    {/* drifted with transforms: left/top snap to whole pixels and a slow drift would step */}
    <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", left: 0, top: 0, transform: `translate(${-420 + Math.sin(g / 160) * 60}px, ${-560 + Math.cos(g / 190) * 40}px)`,
      background: "radial-gradient(circle, rgba(163,210,194,.55) 0%, rgba(163,210,194,0) 62%)" }} />
    <div style={{ position: "absolute", width: 1500, height: 1500, borderRadius: "50%", left: 0, top: 0, transform: `translate(${1020 + Math.cos(g / 170) * 70}px, ${180 + Math.sin(g / 210) * 50}px)`,
      background: "radial-gradient(circle, rgba(163,210,194,.42) 0%, rgba(163,210,194,0) 60%)" }} />
  </AbsoluteFill>
);

export const Pill: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", textTransform: "uppercase", color: C.navy, background: C.mintPale,
    borderRadius: 999, padding: "10px 20px", whiteSpace: "nowrap", ...style }}>{children}</span>
);
