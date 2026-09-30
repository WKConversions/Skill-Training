import React from "react";
import { AbsoluteFill } from "remotion";
import { ARRIVE, C, LINEAR, MOVE, iso, pathUntil, pts, tw } from "../lib";
import { A, B, Cc, DIRECT, FLOOR, ITEMS, LOCATED, ORDER, PICK, PULSES, PULSE_LIFE, PULSE_R, SHELVES, TEE, TEE_FOUND, distOn, posOn } from "../store";

// The store in isometric view, drawn as a pure function of the global frame g.
// Used by the store scenes (search, scan, route) and, simplified, as one tile in the footprint scene.

const box = (s: (typeof SHELVES)[number]) => {
  const t = [iso(s.x0, s.y0, s.h), iso(s.x1, s.y0, s.h), iso(s.x1, s.y1, s.h), iso(s.x0, s.y1, s.h)];
  const right = [iso(s.x1, s.y0, s.h), iso(s.x1, s.y1, s.h), iso(s.x1, s.y1, 0), iso(s.x1, s.y0, 0)];
  const front = [iso(s.x0, s.y1, s.h), iso(s.x1, s.y1, s.h), iso(s.x1, s.y1, 0), iso(s.x0, s.y1, 0)];
  return { t, right, front };
};
const SORTED = [...SHELVES].sort((a, b) => a.x0 + a.y0 - (b.x0 + b.y0));

const Trail: React.FC<{ r: typeof A; g: number; from: number; to: number; color: string; width: number; opacity: number; dash?: string }> = ({
  r, g, from, to, color, width, opacity, dash,
}) => {
  const head = distOn(r, g);
  const p = pathUntil(r.path, Math.max(0, head - from), Math.min(head, to)).map(([x, y]) => iso(x, y, 1));
  if (p.length < 2 || opacity <= 0) return null;
  return <polyline points={pts(p)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} strokeDasharray={dash} />;
};

const Person: React.FC<{ x: number; y: number; color: string; opacity: number; g: number; scanning?: boolean }> = ({ x, y, color, opacity, g }) => {
  const [sx, sy] = iso(x, y, 0);
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity}>
      <ellipse cx={sx} cy={sy + 2} rx={20} ry={10} fill="#000" opacity={0.6} />
      <circle cx={sx} cy={sy - 12} r={22 + Math.sin(g / 6) * 1.5} fill="none" stroke={color} strokeOpacity={0.28} strokeWidth={2} />
      <circle cx={sx} cy={sy - 12} r={10} fill={color} />
    </g>
  );
};

/** A location pin: their site's olive pin on a stick, here in the CTA yellow-green when it marks an item. */
export const Pin: React.FC<{ x: number; y: number; z: number; rise: number; color?: string }> = ({ x, y, z, rise, color = C.pin }) => {
  if (rise <= 0) return null;
  const [bx, by] = iso(x, y, z);
  const top = by - 70 * rise;
  return (
    <g>
      <line x1={bx} y1={by} x2={bx} y2={top} stroke={color} strokeWidth={3} opacity={0.8} />
      <circle cx={bx} cy={top} r={15 * Math.min(1, rise * 1.3)} fill={color} />
      <circle cx={bx} cy={by} r={5} fill={color} />
      <circle cx={bx} cy={top} r={15 + 30 * rise} fill="none" stroke={color} strokeWidth={2} opacity={Math.max(0, 0.6 - rise * 0.6)} />
    </g>
  );
};

export const StoreWorld: React.FC<{ g: number; simple?: boolean; draw?: number }> = ({ g, simple = false, draw = 1 }) => {
  const searchTrails = tw(g, 300, 340, 1, 0, LINEAR);
  const others = tw(g, 480, 510, 1, 0.25, LINEAR);
  const teeRise = tw(g, TEE_FOUND, TEE_FOUND + 14, 0, 1, ARRIVE);
  const floor = [iso(FLOOR.x0, FLOOR.y0), iso(FLOOR.x1, FLOOR.y0), iso(FLOOR.x1, FLOOR.y1), iso(FLOOR.x0, FLOOR.y1)];
  const perim = 2 * (1000 * 0.95 + 700 * 0.95);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* floor: the outline draws in, like the route lines on their site */}
        <polygon points={pts(floor)} fill="#08080A" fillOpacity={tw(draw, 0.4, 1, 0, 1, LINEAR)} stroke={C.lineGrey} strokeWidth={3}
          strokeDasharray={`${perim * draw} ${perim}`} strokeLinejoin="round" />
        {/* entrance gap */}
        {!simple && <line x1={iso(120, 700)[0]} y1={iso(120, 700)[1]} x2={iso(200, 700)[0]} y2={iso(200, 700)[1]} stroke={C.slate} strokeWidth={5} strokeLinecap="round" opacity={draw} />}

        {/* the routes */}
        {!simple && (
          <>
            <Trail r={A} g={g} from={900} to={99999} color="#6E6E72" width={4} opacity={0.9 * searchTrails} />
            <Trail r={B} g={g} from={700} to={99999} color="#6E6E72" width={4} opacity={0.7 * searchTrails} />
            <Trail r={Cc} g={g} from={700} to={99999} color="#6E6E72" width={4} opacity={0.7 * searchTrails} />
            {/* the direct route: the whole way lights up first, then C walks it */}
            {g >= 480 && (
              <polyline points={pts(pathUntil(DIRECT.path, 0, DIRECT.path.length * tw(g, 480, 494, 0, 1, MOVE)).map(([x, y]) => iso(x, y, 1)))}
                fill="none" stroke={C.pin} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={tw(g, 600, 640, 1, 0.35, LINEAR)} />
            )}
            {g >= 554 && (
              <polyline points={pts(pathUntil(PICK.path, 0, distOn(PICK, g) + 60).map(([x, y]) => iso(x, y, 1)))}
                fill="none" stroke={C.mapBlue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            )}
          </>
        )}

        {/* shelves, back to front */}
        {SORTED.map((s, i) => {
          const b = box(s);
          const on = tw(draw, 0.15 + i * 0.05, 0.45 + i * 0.05, 0, 1, ARRIVE);
          if (on <= 0) return null;
          const lift = (1 - on) * 30;
          return (
            <g key={i} opacity={on} transform={`translate(0 ${lift})`}>
              <polygon points={pts(b.front)} fill={C.shelfSide} stroke={C.shelfEdge} strokeWidth={1.5} strokeLinejoin="round" />
              <polygon points={pts(b.right)} fill="#121216" stroke={C.shelfEdge} strokeWidth={1.5} strokeLinejoin="round" />
              <polygon points={pts(b.t)} fill={C.shelfTop} stroke={C.shelfEdge} strokeWidth={2} strokeLinejoin="round" />
            </g>
          );
        })}

        {/* items: unknown until an RFID read locates them */}
        {ITEMS.map((it) => {
          const [x, y] = iso(it.x, it.y, it.z);
          const t = LOCATED[it.id];
          const k = simple ? 1 : tw(g, t, t + 8, 0, 1, ARRIVE);
          const ring = simple ? 0 : tw(g, t, t + 16, 0, 1, LINEAR);
          const show = tw(draw, 0.55, 0.9, 0, 1, LINEAR);
          const isTee = it.id === TEE.id;
          return (
            <g key={it.id} opacity={show}>
              {ring > 0 && ring < 1 && <circle cx={x} cy={y} r={4 + ring * 14} fill="none" stroke={C.blue} strokeWidth={1.5} opacity={1 - ring} />}
              <circle cx={x} cy={y} r={3.2 + k * 1.6} fill={k > 0.02 ? (isTee && !simple && g >= TEE_FOUND ? C.pin : C.blue) : "#3A3C44"} opacity={0.5 + 0.5 * k} />
            </g>
          );
        })}

        {/* RFID reads spreading from each handheld */}
        {!simple &&
          PULSES.map((p, i) => {
            const t = (g - p.f) / PULSE_LIFE;
            if (t < 0 || t > 1) return null;
            const r = PULSE_R * ARRIVE(t);
            const [cx, cy] = iso(p.x, p.y, 2);
            return <ellipse key={i} cx={cx} cy={cy} rx={r * 0.866 * 0.95 * 1.414} ry={r * 0.5 * 0.95 * 1.414} fill={C.mapBlue} fillOpacity={0.05 * (1 - t)}
              stroke={C.mapBlue} strokeWidth={2} strokeOpacity={0.7 * (1 - t)} />;
          })}

        {/* pins */}
        {!simple && <Pin x={TEE.x} y={TEE.y} z={TEE.z} rise={teeRise} />}
        {!simple && ORDER.map((o, i) => <Pin key={i} x={o.x} y={o.y} z={o.z} rise={tw(g, 558 + i * 16, 572 + i * 16, 0, 1, ARRIVE)} color={C.mapBlue} />)}

        {/* associates */}
        {!simple && (
          <>
            <Person {...xy(posOn(A, g))} color={C.ink} opacity={tw(g, 30, 40, 0, 1, LINEAR) * others} g={g} />
            <Person {...xy(posOn(B, g))} color="#BDBDBD" opacity={tw(g, 150, 165, 0, 1, LINEAR) * others} g={g + 20} />
            <Person {...xy(g < 486 ? posOn(Cc, g) : g < 558 ? posOn(DIRECT, g) : posOn(PICK, g))} color={g >= 486 ? C.pin : "#BDBDBD"}
              opacity={tw(g, 150, 165, 0, 1, LINEAR)} g={g + 40} />
          </>
        )}
      </svg>
    </AbsoluteFill>
  );
};
const xy = ([x, y]: [number, number]) => ({ x, y });


