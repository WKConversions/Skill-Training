import React from "react";
import { C } from "./lib";
import { COUNTRIES, CITY_XY } from "./europe";

export type MapPlace = { x: number; y: number; s: number };
/** A city's position on screen for a map placed at (x, y) with scale s. */
export const cityAt = (id: string, m: MapPlace): [number, number] => {
  const [cx, cy] = CITY_XY[id];
  return [m.x + cx * m.s, m.y + cy * m.s];
};

/** Europe in their light palette: pale land, white borders, the countries they recruit for a shade deeper.
 * `fadeLeft` (screen x range) fades the map out under the copy column. */
export const EuropeMap: React.FC<{ m: MapPlace; o?: number; hl?: number; fadeLeft?: [number, number] }> = ({ m, o = 1, hl = 1, fadeLeft }) => {
  const mask = fadeLeft
    ? `linear-gradient(90deg, transparent ${(fadeLeft[0] - m.x) / m.s}px, black ${(fadeLeft[1] - m.x) / m.s}px)`
    : undefined;
  return (
    <div style={{ position: "absolute", left: m.x, top: m.y, width: 1920, height: 1080, transformOrigin: "0 0", scale: String(m.s), opacity: o,
      maskImage: mask, WebkitMaskImage: mask }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ overflow: "visible" }}>
        {COUNTRIES.map((c) => (
          <path key={c.n} d={c.d} fill={c.hl ? (hl > 0.5 ? C.landHi : C.land) : C.land} stroke={C.white} strokeWidth={2.2 / m.s} strokeLinejoin="round" />
        ))}
      </svg>
    </div>
  );
};
