import React from "react";
import { AbsoluteFill } from "remotion";
import { ARRIVE, C, DEPART, HEAD, LINEAR, UI, measure, tw } from "../lib";

// Screen-space pieces in Cartesian's page style: the headline (white Inter 600, last phrase light grey)
// built word by word, the item card, pills and the route-line background of their hero.

export type Word = { w: string; grey?: boolean };

/** A headline whose words arrive one by one from frame `at`, `gap` frames apart; left-aligned. */
export const Headline: React.FC<{
  lines: Word[][]; g: number; at: number; out: number; x: number; y: number; size?: number; gap?: number; align?: "left" | "center";
}> = ({ lines, g, at, out, x, y, size = 76, gap = 4, align = "left" }) => {
  let n = 0;
  const leave = tw(g, out, out + 6, 0, 1, DEPART);
  if (g < at - 1 || leave >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, opacity: 1 - leave, translate: `0px ${-leave * 24}px` }}>
      {lines.map((line, li) => {
        const words = line.map((w) => ({ ...w, width: measure(w.w, size, HEAD, "600", "-0.025em") }));
        const space = measure(" ", size, HEAD, "600", "-0.025em");
        const total = words.reduce((a, w) => a + w.width, 0) + space * (words.length - 1);
        let cx = align === "center" ? x - total / 2 : x;
        return words.map((w, wi) => {
          const t0 = at + gap * n++;
          const left = cx;
          cx += w.width + space;
          return (
            <span key={`${li}-${wi}`} style={{
              position: "absolute", left, top: y + li * size * 1.1, fontFamily: HEAD, fontWeight: 600, fontSize: size, lineHeight: 1,
              letterSpacing: "-0.025em", whiteSpace: "nowrap", color: w.grey ? C.grey : C.ink,
              opacity: tw(g, t0, t0 + 6, 0, 1, LINEAR), translate: `0px ${tw(g, t0, t0 + 12, 30, 0, ARRIVE)}px`,
              filter: `blur(${tw(g, t0, t0 + 8, 8, 0, LINEAR)}px)`,
            }}>{w.w}</span>
          );
        });
      })}
    </div>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; color?: string; bg?: string; size?: number; style?: React.CSSProperties }> = ({
  children, color = C.panel, bg = C.pin, size = 32, style,
}) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, fontFamily: UI, fontWeight: 500, fontSize: size, lineHeight: 1,
    color, background: bg, borderRadius: size * 0.36, padding: `${size * 0.42}px ${size * 0.62}px`, whiteSpace: "nowrap", ...style }}>
    {children}
  </div>
);

const Tee: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M22 8 L10 14 L4 30 L12 33 L14 26 L14 58 L50 58 L50 26 L52 33 L60 30 L54 14 L42 8 C40 13 36 15 32 15 C28 15 24 13 22 8 Z" fill="#9CC3EE" />
    <path d="M22 8 C24 13 28 15 32 15 C36 15 40 13 42 8" fill="none" stroke="#7FA9D8" strokeWidth={2} />
  </svg>
);

/** The item card: the product the associate is looking for, and its status. */
export const ItemCard: React.FC<{ g: number; status: React.ReactNode; enter: number; exit: number }> = ({ g, status, enter, exit }) => {
  const k = tw(g, enter, enter + 14, 0, 1, ARRIVE);
  const out = tw(g, exit, exit + 8, 0, 1, DEPART);
  if (k <= 0 || out >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 80, top: 80, width: 600, borderRadius: 22, background: "rgba(26,26,31,0.92)", border: `1.5px solid ${C.cardEdge}`,
      padding: "22px 26px", display: "flex", gap: 22, alignItems: "center", boxShadow: "0 40px 80px -40px rgba(0,0,0,.9)",
      opacity: k * (1 - out), translate: `${(1 - k) * -60 - out * 60}px 0px` }}>
      <div style={{ width: 112, height: 112, borderRadius: 16, background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Tee size={88} />
      </div>
      <div style={{ display: "grid", gap: 8, minWidth: 0 }}>
        <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 36, color: C.ink, lineHeight: 1.1 }}>Crew Long-Sleeve Tee</div>
        <div style={{ fontFamily: UI, fontWeight: 400, fontSize: 28, color: C.muted, lineHeight: 1.1 }}>Sky Blue · Size M</div>
        <div style={{ fontFamily: UI, fontWeight: 500, fontSize: 32, lineHeight: 1.1, display: "flex", alignItems: "center", gap: 12 }}>{status}</div>
      </div>
    </div>
  );
};

/** Cartesian's hero motif: long isometric route lines with rounded corners, slate and grey, with pins. */
const ROUTES: { d: string; c: string }[] = [
  { d: "M-200 820 L260 555 Q300 532 340 555 L640 728 Q680 751 720 728 L1100 509 Q1140 486 1180 509 L1480 682 Q1520 705 1560 682 L2150 342", c: C.slate },
  { d: "M-200 900 L300 611 Q340 588 380 611 L680 784 Q720 807 760 784 L1140 565 Q1180 542 1220 565 L1520 738 Q1560 761 1600 738 L2150 420", c: C.lineGrey },
  { d: "M-150 150 L180 340 Q220 363 260 340 L620 132 Q660 109 700 132 L1000 305 Q1040 328 1080 305 L1400 120 L1500 62", c: C.lineGrey },
  { d: "M-150 90 L220 303 Q260 326 300 303 L660 95 Q700 72 740 95 L1040 268 Q1080 291 1120 268 L1480 60", c: C.slate },
  { d: "M1250 1180 L1600 978 Q1640 955 1680 978 L2100 1220", c: C.slate },
];
export const RouteLines: React.FC<{ progress: number; opacity: number; shift?: number }> = ({ progress, opacity, shift = 0 }) => (
  <AbsoluteFill style={{ opacity, translate: `${shift}px ${shift * -0.5}px` }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {ROUTES.map((r, i) => (
        <path key={i} d={r.d} fill="none" stroke={r.c} strokeWidth={3} strokeLinecap="round" pathLength={1}
          strokeDasharray={`${Math.max(0, Math.min(1, progress * 1.25 - i * 0.06))} 1`} />
      ))}
      <g opacity={tw(progress, 0.7, 1, 0, 1, LINEAR)}>
        <line x1={1560} y1={200} x2={1560} y2={290} stroke={C.pinDim} strokeWidth={3} />
        <circle cx={1560} cy={200} r={16} fill={C.pinDim} />
        <line x1={640} y1={930} x2={640} y2={1010} stroke={C.pinDim} strokeWidth={3} />
        <circle cx={640} cy={930} r={16} fill={C.pinDim} />
      </g>
    </svg>
  </AbsoluteFill>
);
