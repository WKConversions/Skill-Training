import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CITIES } from "./data";
import { C, SANS } from "./lib";

// The wall of destinations and people: five columns of landscape tiles on a plane rolled -8°, the
// columns scrolling in alternate directions. It opens the film (the hook photo is one of its tiles) and
// closes it (behind the end card).
export const TW = 520, TH = 340, PITCH = 368, ROLL = -8;
const COL_X = (c: number) => 960 + (c - 2) * 548;
const COLS: string[][] = [
  ["porto", "p:candidate", "benalmadena", "p:arrival"],
  ["lisbon", "p:agent", "stockholm", "p:keys"],
  ["p:traveler", "madrid", "sliema", "p:unpacking"],
  ["barcelona", "p:arrival", "athens", "p:candidate"],
  ["stockholm", "p:unpacking", "porto", "p:agent"],
];
const DIR = [-1, 1, -1, 1, -1];
const SPEED = 1.8;
// column 2 is phased so the hook tile (the traveller, j = 0) sits on the centre line at frame 60
const PHASE = [150, -90, 108, 40, -200];
export const off = (c: number, g: number) => PHASE[c] + DIR[c] * SPEED * g;
export const itemAt = (c: number, j: number) => COLS[c][((j % 4) + 4) % 4];

const rot = (x: number, y: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180, dx = x - 960, dy = y - 540;
  return [960 + dx * Math.cos(a) - dy * Math.sin(a), 540 + dx * Math.sin(a) + dy * Math.cos(a)];
};
/** World position of tile (c, j) for a wall offset by (tx, ty). */
export const tileWorld = (c: number, j: number, g: number, tx = 0, ty = 0): [number, number] => {
  const [x, y] = rot(COL_X(c), 540 + j * PITCH + off(c, g), ROLL);
  return [x + tx, y + ty];
};
/** Visible tiles at frame g: [c, j] pairs. */
const visible = (g: number, ty = 0) => {
  const out: [number, number][] = [];
  for (let c = 0; c < 5; c++) {
    const j0 = Math.floor((-1500 - ty - off(c, g)) / PITCH), j1 = Math.ceil((2600 - ty - off(c, g)) / PITCH);
    for (let j = j0; j <= j1; j++) out.push([c, j]);
  }
  return out;
};
/** The instance of a city nearest the right of the frame at frame g (for handing a tile over to the
 * map). `proj` maps world to screen. */
export const nearestTile = (id: string, g: number, tx: number, ty: number, proj: (p: [number, number]) => [number, number]) => {
  let best: [number, number] | null = null, bd = 1e9;
  for (const [c, j] of visible(g, ty)) {
    if (itemAt(c, j) !== id) continue;
    const [x, y] = proj(tileWorld(c, j, g, tx, ty));
    const d = Math.hypot(x - 1300, y - 540);
    if (x > 700 && x < 1860 && y > 90 && y < 990 && d < bd) { bd = d; best = [c, j]; }
  }
  return best;
};

export const Tile: React.FC<{ id: string; label?: number; flip?: boolean }> = ({ id, label = 1, flip }) => {
  const person = id.startsWith("p:");
  const city = CITIES.find((c) => c.id === id);
  return (
    <>
      <Img src={staticFile(person ? `people/${id.slice(2)}.jpg` : `photos/${id}.jpg`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        scale: flip || id === "p:traveler" ? "-1 1" : undefined }} />
      {city && label > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: label, background: "linear-gradient(180deg, rgba(0,17,53,0) 45%, rgba(0,17,53,.62) 100%)" }}>
          <div style={{ position: "absolute", left: 26, bottom: 22 }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 17, letterSpacing: "0.2em", textTransform: "uppercase", color: C.goldHi }}>{city.country}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, color: C.white, lineHeight: 1.1 }}>{city.name}</div>
            {city.tag && <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 21, color: "rgba(255,255,255,.88)" }}>{city.tag}</div>}
          </div>
        </div>
      )}
    </>
  );
};

/** The wall, in world space. `hide` lists "c:j" tiles that are being carried elsewhere. */
export const Wall: React.FC<{ g: number; tx?: number; ty?: number; hide?: string[]; fadeFrom?: number; drop?: (x: number, y: number, c: number, j: number) => [number, number] }> = ({
  g, tx = 0, ty = 0, hide = [], fadeFrom, drop,
}) => {
  const mask = fadeFrom !== undefined ? `linear-gradient(90deg, transparent ${fadeFrom}px, black ${fadeFrom + 320}px)` : undefined;
  return (
    <AbsoluteFill style={{ maskImage: mask, WebkitMaskImage: mask }}>
      {visible(g, ty).map(([c, j]) => {
        if (hide.includes(`${c}:${j}`)) return null;
        const [x, y0] = tileWorld(c, j, g, tx, ty);
        if (x < -1000 || x > 3000 || y0 < -900 || y0 > 2000) return null;
        // tiles fall one by one: only the ones in view take part, the wall above them is gone
        const [dy, dr] = drop ? drop(x, y0, c, j) : [0, 0];
        if (drop && (y0 < -760 || dy > 2400)) return null;
        const y = y0 + dy;
        return (
          <div key={`${c}:${j}`} style={{ position: "absolute", left: x - TW / 2, top: y - TH / 2, width: TW, height: TH, rotate: `${ROLL + dr}deg`, borderRadius: 20, overflow: "hidden",
            boxShadow: "0 30px 60px -30px rgba(0,17,53,.35)" }}>
            <Tile id={itemAt(c, j)} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
