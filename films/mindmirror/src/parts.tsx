import React from "react";
import { Img, staticFile } from "remotion";
import { C, SHADOW, lerp } from "./lib";

// MindMirror's own visual language, rebuilt to animate: the mirrored contour figure of their hero (two lobes
// meeting on a centre line), the logo revealed out of that centre line, and the insight cards' small charts.

const TAU = Math.PI * 2;
const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/** The figure: n nested contours, mirrored about x = cx. `order` 0 is tangled signal, 1 their clean pattern; a scan line
 *  at `scanY` orders everything above it as it passes. Coordinates are frame pixels; `s` scales round (cx, cy). */
export const Figure: React.FC<{ g: number; cx: number; cy: number; s: number; order: number; scanY?: number; n?: number; opacity?: number; draw?: number; dots?: number }> = ({
  g, cx, cy, s, order, scanY = -1e9, n = 12, opacity = 1, draw = 1, dots = 1 }) => {
  if (opacity <= 0 || s <= 0) return null;
  const paths: React.ReactNode[] = [];
  const N = 84;
  for (let i = 0; i < n; i++) {
    const rx = 300 * (1 - i * 0.068), ry = 330 * (1 - i * 0.058);
    for (const side of [1, -1]) {
      let d = "";
      for (let j = 0; j <= N; j++) {
        const t = (j / N) * TAU;
        // a lobe that hugs the centre line, narrow at the waist like their drawing
        const c = Math.cos(t), sn = Math.sin(t);
        const bx = (14 + i * 4 + rx * (1 + c) * (1 + 0.06 * Math.sin(2 * t))) * 0.98;
        const by = ry * sn * (1 - 0.18 * Math.cos(t) - 0.1 * Math.cos(2 * t)) - 10 * Math.cos(t);
        // tangled signal: each side its own noise, so the mirror only appears as it orders
        const ph = side * 1.7 + i * 0.9;
        const nx = Math.sin(t * 5 + ph + g / 23) * 34 + Math.sin(t * 9 - i * 2.1 + g / 17) * 18 + Math.cos(t * 2 + i * 1.3) * (40 + i * 6);
        const ny = Math.cos(t * 4 - ph + g / 29) * 30 + Math.sin(t * 7 + i * 0.7 + g / 19) * 16 + Math.sin(t * 3 + side * i) * (34 + i * 5);
        const y0 = cy + by * s;
        const ord = Math.max(order, sm(y0 - 40 * s, y0 + 40 * s, scanY));   // ordered once the scan line has passed it
        const ch = 1 - ord;
        const x = cx + side * (bx + nx * ch * 1.15) * s;
        const y = cy + (by + ny * ch * 1.15) * s;
        d += `${j ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      }
      paths.push(<path key={`${i}${side}`} d={d} fill="none" stroke={C.lime} strokeWidth={2.3} strokeLinejoin="round" pathLength={1} strokeDasharray={draw < 1 ? `${draw} 1` : undefined}
        opacity={0.35 + 0.6 * (1 - i / n) * (0.55 + 0.45 * order)} />);
    }
  }
  const DOTS: [number, number][] = [[-0.62, -0.62], [0.55, -0.7], [0.92, -0.2], [-0.95, 0.35], [0.7, 0.75], [-0.45, 0.85]];
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity, overflow: "visible" }}>
      {paths}
      {dots > 0 && order > 0.5 && DOTS.map(([u, v], k) => <circle key={k} cx={cx + u * 560 * s} cy={cy + v * 330 * s} r={7 * s} fill={C.olive} opacity={(order - 0.5) * 2 * dots * (0.55 + 0.45 * Math.sin(g / 20 + k))} />)}
    </svg>
  );
};

/** The brain/M mark, revealed out of its own centre line: the two halves open outward together. */
export const Mark: React.FC<{ x: number; y: number; w: number; k: number; style?: React.CSSProperties }> = ({ x, y, w, k, style }) => {
  if (k <= 0) return null;
  const h = (w * 543) / 578;
  const half = (side: "l" | "r") => (
    <div style={{ position: "absolute", left: side === "l" ? 0 : w / 2, top: 0, width: w / 2, height: h, overflow: "hidden",
      clipPath: side === "l" ? `inset(0 0 0 ${(1 - k) * 100}%)` : `inset(0 ${(1 - k) * 100}% 0 0)` }}>
      <Img src={staticFile("img/mark.png")} style={{ position: "absolute", left: side === "l" ? 0 : -w / 2, top: 0, width: w, height: h }} />
    </div>
  );
  return <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, ...style }}>{half("l")}{half("r")}</div>;
};
export const Wordmark: React.FC<{ x: number; y: number; w: number; style?: React.CSSProperties }> = ({ x, y, w, style }) => (
  <Img src={staticFile("img/wordmark.png")} style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: (w * 120) / 830, ...style }} />
);

// ---------------------------------------------------------------- the insight cards' charts (from their site), drawn by k
const draw = (k: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - k });
export const FocusWave: React.FC<{ k: number; w?: number; h?: number; peak?: number }> = ({ k, w = 360, h = 140, peak = 0 }) => (
  <svg width={w} height={h} viewBox="0 0 360 140" style={{ overflow: "visible" }}>
    <line x1={0} y1={40} x2={360} y2={40} stroke={C.border} strokeWidth={2} /><line x1={0} y1={112} x2={360} y2={112} stroke={C.border} strokeWidth={2} />
    <path d="M0,128 C60,124 120,104 180,96 S300,80 360,70" fill="none" stroke="#B9C0B5" strokeWidth={2.5} strokeDasharray="5 7" opacity={k} />
    <path d="M0,118 C25,118 40,72 70,70 S105,118 135,112 S175,20 205,22 S235,78 260,80 S320,64 360,62" fill="none" stroke={C.lime} strokeWidth={5} strokeLinecap="round" {...draw(k)} />
    {peak > 0 && <><circle cx={205} cy={22} r={10 + 14 * (1 - peak)} fill="none" stroke={C.olive} strokeWidth={3} opacity={peak} /><circle cx={205} cy={22} r={8} fill={C.olive} opacity={peak} /></>}
  </svg>
);
export const PressureCurve: React.FC<{ k: number }> = ({ k }) => (
  <svg width={360} height={140} viewBox="0 0 360 140" style={{ overflow: "visible" }}>
    <line x1={0} y1={30} x2={360} y2={30} stroke={C.border} strokeWidth={2} /><line x1={0} y1={100} x2={360} y2={100} stroke={C.border} strokeWidth={2} />
    <path d="M0,112 C80,108 130,96 170,92 S240,20 300,24 S340,60 360,40" fill="none" stroke="#B9C0B5" strokeWidth={2.5} strokeDasharray="5 7" opacity={k} />
    <path d="M0,116 C70,110 120,104 160,100 S210,46 240,46 S300,86 360,92" fill="none" stroke={C.lime} strokeWidth={5} strokeLinecap="round" {...draw(k)} />
  </svg>
);
export const DriveBars: React.FC<{ k: number }> = ({ k }) => (
  <svg width={360} height={140} viewBox="0 0 360 140">
    {Array.from({ length: 15 }, (_, i) => {
      const hh = 26 + 104 * Math.exp(-((i - 8) ** 2) / 14);
      const kk = Math.min(1, Math.max(0, k * 1.8 - i * 0.05));
      return <rect key={i} x={i * 24 + 4} y={136 - hh * kk} width={12} height={hh * kk} rx={6} fill={Math.abs(i - 8) <= 3 ? C.lime : C.sage} />;
    })}
  </svg>
);
export const ProcessingLoops: React.FC<{ k: number }> = ({ k }) => (
  <svg width={360} height={140} viewBox="0 0 360 140" style={{ overflow: "visible" }}>
    {[0, 1, 2, 3, 4].map((i) => {
      const a = 46 - i * 7;
      return <React.Fragment key={i}>
        <path d={`M172,70 C120,${70 - a} 40,${70 - a * 1.2} 14,70 C40,${70 + a * 1.2} 120,${70 + a} 172,70`} fill="none" stroke={C.lime} strokeWidth={2.4} {...draw(k)} />
        <path d={`M188,70 C240,${70 - a} 320,${70 - a * 1.2} 346,70 C320,${70 + a * 1.2} 240,${70 + a} 188,70`} fill="none" stroke={C.lime} strokeWidth={2.4} {...draw(k)} />
      </React.Fragment>;
    })}
  </svg>
);

/** One of their insight cards: number, their tagline, the area, its chart. */
export const InsightCard: React.FC<{ num: string; tag: string; title: string; chart: React.ReactNode; style?: React.CSSProperties; tint?: boolean }> = ({ num, tag, title, chart, style, tint }) => (
  <div style={{ position: "absolute", width: 440, height: 330, borderRadius: 26, background: tint ? C.off : C.white, border: `1.5px solid ${C.border}`, boxShadow: SHADOW, padding: "26px 32px", ...style }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, fontWeight: 500, color: C.muted }}><span>{num}</span><span>{tag}</span></div>
    <div style={{ height: 150, marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>{chart}</div>
    <div style={{ fontSize: 50, fontWeight: 500, letterSpacing: "-0.035em", marginTop: 14 }}>{title}</div>
  </div>
);

export const Check: React.FC<{ k: number; size?: number }> = ({ k, size = 44 }) => (
  <span style={{ position: "relative", width: size, height: size, borderRadius: 99, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    border: `3px solid ${k > 0 ? C.lime : C.border}`, background: k > 0.4 ? C.lime : "transparent", transform: `scale(${1 + 0.18 * Math.sin(Math.min(1, k) * Math.PI)})` }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke={C.ink} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
      strokeDasharray={1} strokeDashoffset={1 - Math.min(1, Math.max(0, k * 1.5 - 0.3))} /></svg>
  </span>
);
export { lerp };
