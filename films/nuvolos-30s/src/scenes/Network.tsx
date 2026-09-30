import React from "react";
import { AbsoluteFill } from "remotion";
import { C, rand } from "../lib";

// Their hero: glowing cyan nodes joined by thin lines on deep blue, in three depth layers with
// depth-of-field blur. It drifts on a 30-second cycle, so the first and last frames match (the loop).
export type Node = { x: number; y: number; r: number; layer: number; id: number };
const LAYERS = [
  { n: 26, r: [10, 16], blur: 5, speed: 0.35, op: 0.55, link: 330 },
  { n: 18, r: [20, 30], blur: 0.6, speed: 0.7, op: 1, link: 420 },
  { n: 6, r: [46, 70], blur: 14, speed: 1.4, op: 0.8, link: 0 },
];
export const NODES: Node[] = [];
LAYERS.forEach((L, li) => {
  for (let i = 0; i < L.n; i++) {
    const id = li * 100 + i;
    NODES.push({ x: -240 + rand(id * 3.1) * 2400, y: -200 + rand(id * 7.7 + 1) * 1480, r: L.r[0] + rand(id + 9) * (L.r[1] - L.r[0]), layer: li, id });
  }
});
export const drift = (g: number, layer: number) => {
  // two cycles per film (period 450 frames), so frame 900 equals frame 0
  const a = (2 * Math.PI * g) / 450;
  const s = LAYERS[layer].speed;
  return [Math.sin(a) * 150 * s, Math.cos(a) * 60 * s];
};
/** Screen position of a node at global frame g. */
export const nodeAt = (n: Node, g: number): [number, number] => {
  const [dx, dy] = drift(g, n.layer);
  return [n.x + dx, n.y + dy];
};

export const Network: React.FC<{ g: number; lit?: (n: Node) => number; dim?: number }> = ({ g, lit, dim = 1 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 70% 30%, ${C.royal} 0%, ${C.deep} 55%, #042A86 100%)` }}>
    {LAYERS.map((L, li) => {
      const nodes = NODES.filter((n) => n.layer === li);
      return (
        <svg key={li} width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: `blur(${L.blur}px)`, opacity: L.op * (li === 1 ? 1 : dim) }}>
          {L.link > 0 &&
            nodes.flatMap((a, i) =>
              nodes.slice(i + 1).filter((b) => Math.hypot(a.x - b.x, a.y - b.y) < L.link).map((b) => {
                const [ax, ay] = nodeAt(a, g), [bx, by] = nodeAt(b, g);
                return <line key={`${a.id}-${b.id}`} x1={ax} y1={ay} x2={bx} y2={by} stroke={C.cyan} strokeOpacity={0.35 * dim} strokeWidth={li === 1 ? 3 : 2} />;
              }),
            )}
          {nodes.map((n) => {
            const [x, y] = nodeAt(n, g);
            const k = lit ? lit(n) : 1;
            return (
              <g key={n.id}>
                <circle cx={x} cy={y} r={n.r * 1.9} fill={C.cyan} opacity={0.12 * k * dim} />
                <circle cx={x} cy={y} r={n.r} fill={k > 0.5 ? C.cyan : "#1E7FE0"} opacity={(0.55 + 0.45 * k) * (li === 1 ? 1 : dim)} />
              </g>
            );
          })}
        </svg>
      );
    })}
  </AbsoluteFill>
);
