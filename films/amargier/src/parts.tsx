import React from "react";
import { C, lerp } from "./lib";
import MAP from "./emea.json";

// The "A" mark, traced from their logo (200 × 200): two leaning bars that meet at the top. Each bar slides in along
// its own axis (`long`, `short`: 0 → 1), or is laid brick by brick (`bricks`: 0 → 1, bottom to top, short bar first).
type P = [number, number];
const LONG: P[] = [[88, 58], [109, 28], [173, 145], [144, 156]];      // top-left, top-right, bottom-right, bottom-left
const SHORT: P[] = [[82, 61], [100, 87], [59, 156], [23, 156]];
const AX = (q: P[]) => { const top = [(q[0][0] + q[1][0]) / 2, (q[0][1] + q[1][1]) / 2], bot = [(q[2][0] + q[3][0]) / 2, (q[2][1] + q[3][1]) / 2]; return [top[0] - bot[0], top[1] - bot[1]]; };
const L = (a: P, b: P, t: number): P => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const poly = (q: P[]) => q.map((p) => p.join(",")).join(" ");
export const APEX: P = [104, 40];                                      // where the bars meet, in mark units

export const AMark: React.FC<{ x: number; y: number; size: number; long?: number; short?: number; bricks?: number; color?: string; style?: React.CSSProperties; n?: number }> = ({
  x, y, size, long = 1, short = 1, bricks, color = C.navy, style, n = 6 }) => {
  const bar = (q: P[], k: number, key: string) => {
    if (k <= 0) return null;
    const [ax, ay] = AX(q);
    const d = (1 - k) * 1.25;
    return <polygon key={key} points={poly(q)} fill={color} stroke={color} strokeWidth={4} strokeLinejoin="round" opacity={Math.min(1, k * 1.8)}
      transform={`translate(${-ax * d} ${-ay * d})`} />;
  };
  const laid = (q: P[], k: number, key: string) => {
    // bricks from the bottom edge to the top edge; each lands from below
    const out: React.ReactNode[] = [];
    for (let i = 0; i < n; i++) {
      const kk = Math.min(1, Math.max(0, k * n - i));
      if (kk <= 0) continue;
      const t0 = i / n + 0.012, t1 = (i + 1) / n - 0.012;
      const s: P[] = [L(q[3], q[0], t1), L(q[2], q[1], t1), L(q[2], q[1], t0), L(q[3], q[0], t0)];
      out.push(<polygon key={key + i} points={poly(s)} fill={color} stroke={color} strokeWidth={2} strokeLinejoin="round" opacity={Math.min(1, kk * 2)}
        transform={`translate(0 ${(1 - kk) * 26})`} />);
    }
    return out;
  };
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ position: "absolute", left: x - size / 2, top: y - size / 2, overflow: "visible", ...style }}>
      {bricks === undefined ? <>{bar(SHORT, short, "s")}{bar(LONG, long, "l")}</> : <>{laid(SHORT, Math.min(1, bricks * 2), "s")}{laid(LONG, Math.max(0, bricks * 2 - 1), "l")}</>}
    </svg>
  );
};
/** A point of the mark (in mark units) in frame pixels. */
export const markAt = (x: number, y: number, size: number, p: P = APEX): P => [x - size / 2 + (p[0] / 200) * size, y - size / 2 + (p[1] / 200) * size];
export const BAR_MID = { short: [60, 115] as P, long: [130, 95] as P };

// ---------------------------------------------------------------- EMEA as dots (Natural Earth land, scripts/emea.py)
export const DX = 90;                                                  // the map sits a little right of the json's centre
export const CITY = (name: keyof typeof MAP.cities): P => [MAP.cities[name][0] + DX, MAP.cities[name][1]];
export const HOME = CITY("Málaga");
export const EmeaDots: React.FC<{ reveal: number; out?: number; fade?: number }> = ({ reveal, out = 0, fade = 1 }) => {
  if (reveal <= 0 || fade <= 0) return null;
  const R = reveal * 1500, W = 160;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: fade }}>
      {MAP.dots.map(([x, y, f], i) => {
        const d = Math.hypot(x + DX - HOME[0], y - HOME[1]);
        const k = Math.min(1, Math.max(0, (R - d) / W));
        const o = Math.min(1, Math.max(0, (out * 1700 - (1700 - d)) / W));     // they clear from the far edge back toward home
        if (k <= 0 || o >= 1) return null;
        return <circle key={i} cx={x + DX} cy={y} r={3.6 * (0.6 + 0.4 * k)} fill={C.dot} opacity={f * k * (1 - o)} />;
      })}
    </svg>
  );
};

/** A technology business on the map: a small navy tile with a glyph. */
export const GLYPHS = ["cloud", "code", "chip", "stack"] as const;
export const Glyph: React.FC<{ kind: (typeof GLYPHS)[number]; size: number; color?: string }> = ({ kind, size, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    {kind === "cloud" && <path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.5 4.3 4.3 0 0 0 7 18z" />}
    {kind === "code" && <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />}
    {kind === "chip" && <><rect x={7} y={7} width={10} height={10} rx={2} /><path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" /></>}
    {kind === "stack" && <path d="M12 4l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4" />}
  </svg>
);
export const Tile: React.FC<{ x: number; y: number; s: number; kind: (typeof GLYPHS)[number]; color?: string; style?: React.CSSProperties }> = ({ x, y, s, kind, color = C.navy, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 46, height: 46, borderRadius: 12, background: color, display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 10px 20px -10px rgba(13,33,57,.5)", transform: `translate(${x - 23}px, ${y - 23}px) scale(${s})`, willChange: "transform", ...style }}>
    <Glyph kind={kind} size={26} />
  </div>
);
