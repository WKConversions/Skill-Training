import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ARRIVE, C, Camera, DEPART, LINEAR, MOVE, UI, iso, tw, useFonts } from "../lib";
import { StoreWorld } from "./StoreWorld";

// Scene 5 · Proof · 0:22.7–0:27.9 (global frames 680–836)
// The store becomes one tile among many lighting up; 750+ stores in 15 countries, then the three
// numbers from cartesian.systems as their outlined stat cards, counting up like their site's rollers.
export const FOOT_START = 680;
export const FOOT_DURATION = 156;

const CENTER = iso(500, 350);
// tiles on the store's own isometric lattice (plan offsets of one store plus an aisle)
const TILES: [number, number][] = [];
for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if (Math.abs(i) + Math.abs(j) <= 4) TILES.push([i, j]);

const Stat: React.FC<{ g: number; at: number; value: (k: number) => string; label: string; x: number }> = ({ g, at, value, label, x }) => {
  const k = tw(g, at, at + 26, 0, 1, ARRIVE);
  const out = tw(g, 826, 834, 0, 1, DEPART);
  return (
    <div style={{ position: "absolute", left: x, top: 800, width: 560, height: 190, borderRadius: 18, border: "1.5px solid rgba(255,255,255,0.55)",
      background: "rgba(20,20,20,0.82)", padding: "26px 30px", boxSizing: "border-box", display: "grid", alignContent: "center", gap: 6,
      opacity: tw(g, at, at + 6, 0, 1, LINEAR) * (1 - out), translate: `0px ${tw(g, at, at + 14, 50, 0, ARRIVE) + out * 30}px` }}>
      <div style={{ fontFamily: UI, fontWeight: 500, fontSize: 64, lineHeight: 1, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{value(k)}</div>
      <div style={{ fontFamily: UI, fontWeight: 400, fontSize: 31, lineHeight: 1.2, color: C.grey }}>{label}</div>
    </div>
  );
};

export const Footprint: React.FC = () => {
  const w = useCurrentFrame();
  const g = FOOT_START + w;
  const ready = useFonts();
  if (!ready) return null;
  const s = tw(g, 680, 836, 0.34, 0.27, LINEAR);
  const lift = tw(g, 740, 790, 0, -120, MOVE);
  const count = Math.round(750 * tw(g, 692, 730, 0, 1, ARRIVE));
  const fade = 1 - tw(g, 822, 836, 0, 1, LINEAR);
  return (
    <AbsoluteFill>
      <Camera fx={CENTER[0]} fy={CENTER[1]} sx={tw(g, 684, 730, 960, 1180, MOVE)} sy={540 + lift} s={s}>
        {TILES.map(([i, j]) => {
          const d = Math.hypot(i, j);
          const on = i === 0 && j === 0 ? 1 : tw(g, 684 + d * 9, 700 + d * 9, 0, 1, ARRIVE);
          const lit = i === 0 && j === 0 ? 1 : tw(g, 696 + d * 10, 712 + d * 10, 0.15, 1, LINEAR);
          const [ox, oy] = [(i - j) * 0.866 * 0.95 * 1260, (i + j) * 0.5 * 0.95 * 1260];
          return (
            <div key={`${i},${j}`} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, translate: `${ox}px ${oy + (1 - on) * 200}px`, opacity: on * lit * fade }}>
              <StoreWorld g={g} simple />
            </div>
          );
        })}
      </Camera>
      <div style={{ position: "absolute", left: 80, top: 110, opacity: tw(g, 690, 698, 0, 1, LINEAR) * fade, translate: `${tw(g, 690, 704, -40, 0, ARRIVE)}px 0px` }}>
        <div style={{ fontFamily: UI, fontWeight: 500, fontSize: 150, lineHeight: 1, color: C.ink, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{count}+</div>
        <div style={{ fontFamily: UI, fontWeight: 400, fontSize: 44, lineHeight: 1.2, color: C.grey, marginTop: 14 }}>stores in 15 countries</div>
      </div>
      <Stat g={g} at={734} x={80} value={(k) => `$${Math.round(200 * k)}k`} label="labor savings per store, per year" />
      <Stat g={g} at={740} x={680} value={(k) => `+${(3.5 * k).toFixed(1)}%`} label="sales lift from better item availability" />
      <Stat g={g} at={746} x={1280} value={(k) => `${Math.round(30 * k)} seconds`} label="to roll out to a new store" />
    </AbsoluteFill>
  );
};
