import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ARRIVE, C, DEPART, FONT, LINEAR, MOVE, lerp, measure, tw, useFonts } from "../lib";

// Scenes 1–4 · 0:00–0:22 (global frames 0–660), one continuous object, the workspace card:
// 1 Scattered 0:00–0:05  code, data, apps and results in four places, the links broken
// 2 Unified   0:05–0:10  they fly into one Computational Workspace; the familiar tools above it
// 3 Anywhere  0:10–0:16  it sits on the Nuvolos layer and runs on any infrastructure, unchanged
// 4 Yours     0:16–0:21  snapshots make every result reproducible; copies go out, control stays
export const STORY_DURATION = 670;

// ---------- a headline in their voice: white Overpass, the second half in cyan ----------
export type Word = { w: string; hi?: boolean };
export const Headline: React.FC<{ lines: Word[][]; g: number; at: number; out: number; x?: number; y?: number; size?: number; align?: "left" | "center" }> = ({
  lines, g, at, out, x = 110, y = 430, size = 72, align = "left",
}) => {
  const leave = tw(g, out, out + 7, 0, 1, DEPART);
  if (g < at - 1 || leave >= 1) return null;
  let n = 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave, translate: `0px ${-leave * 26}px` }}>
      {lines.map((line, li) => {
        const ws = line.map((w) => ({ ...w, width: measure(w.w, size, "700", "-0.01em") }));
        const sp = measure(" ", size, "700", "-0.01em");
        const total = ws.reduce((a, w) => a + w.width, 0) + sp * (ws.length - 1);
        let cx = align === "center" ? x - total / 2 : x;
        return ws.map((w, wi) => {
          const t0 = at + 3 * n++;
          const left = cx;
          cx += w.width + sp;
          return (
            <span key={`${li}.${wi}`} style={{ position: "absolute", left, top: y + li * size * 1.12, fontFamily: FONT, fontWeight: 700, fontSize: size, lineHeight: 1,
              letterSpacing: "-0.01em", whiteSpace: "nowrap", color: w.hi ? C.cyan : C.ink, opacity: tw(g, t0, t0 + 6, 0, 1, LINEAR),
              translate: `0px ${tw(g, t0, t0 + 12, 28, 0, ARRIVE)}px`, filter: `blur(${tw(g, t0, t0 + 8, 8, 0, LINEAR)}px)` }}>{w.w}</span>
          );
        });
      })}
    </div>
  );
};

// ---------- the tiles: their workspace illustration's four parts ----------
const Icon: React.FC<{ kind: string }> = ({ kind }) => {
  const s = C.slate, b = C.blue;
  return (
    <svg width={86} height={70} viewBox="0 0 86 70">
      {kind === "Apps" && (<><rect x={4} y={4} width={78} height={62} rx={8} fill="none" stroke={s} strokeWidth={4} /><circle cx={58} cy={14} r={3} fill={b} /><circle cx={67} cy={14} r={3} fill={b} /><circle cx={24} cy={40} r={9} fill={s} /><path d="M46 30 l14 22 M60 30 l-14 22" stroke={b} strokeWidth={5} strokeLinecap="round" /></>)}
      {kind === "Data" && (<><rect x={4} y={4} width={78} height={62} rx={8} fill="none" stroke={s} strokeWidth={4} />{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={12 + c * 22} y={14 + r * 16} width={18} height={10} rx={3} fill={(r + c) % 2 ? b : s} />))}</>)}
      {kind === "Code" && (<><rect x={4} y={4} width={78} height={62} rx={8} fill="none" stroke={s} strokeWidth={4} strokeDasharray="10 6" /><rect x={14} y={16} width={30} height={7} rx={3.5} fill={s} /><circle cx={52} cy={19} r={4} fill={b} /><rect x={14} y={31} width={52} height={7} rx={3.5} fill={b} /><rect x={14} y={46} width={40} height={7} rx={3.5} fill={s} /></>)}
      {kind === "Results" && (<><circle cx={28} cy={40} r={15} fill="none" stroke={s} strokeWidth={5} strokeDasharray="6 4" /><circle cx={28} cy={40} r={6} fill={b} /><rect x={44} y={6} width={36} height={46} rx={5} fill="none" stroke={s} strokeWidth={4} />{[0, 1, 2].map((i) => <rect key={i} x={52} y={15 + i * 11} width={20} height={4} rx={2} fill={b} />)}</>)}
    </svg>
  );
};
const TILES = ["Apps", "Data", "Code", "Results"];
const TAGS = ["installed by hand", "in a cloud bucket", "on a laptop", "in an email"];
const SCATTER: [number, number][] = [[1190, 770], [1610, 250], [1120, 300], [1680, 700]];
const TW = 190, TH = 160;

// the workspace card: base 900 × 420, centered on (cx, cy) at scale s
const W = { w: 900, h: 420 };
const tileLocal = (i: number): [number, number] => [44 + i * (TW + 18), 56];

const Tile: React.FC<{ kind: string; x: number; y: number; s: number; label: number }> = ({ kind, x, y, s, label }) => (
  <div style={{ position: "absolute", left: x, top: y, width: TW, height: TH, transformOrigin: "0 0", scale: String(s), borderRadius: 16, background: C.card,
    border: `3px solid ${C.cardLine}`, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
    boxShadow: "0 30px 60px -30px rgba(2,20,80,.6)" }}>
    <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: C.slate, lineHeight: 1, opacity: label }}>{kind}</div>
    <Icon kind={kind} />
  </div>
);

const TOOLS = ["JupyterLab", "RStudio", "VS Code", "MATLAB", "Python", "Julia", "Stata"];
const INFRA = ["Public cloud", "Private cloud", "HPC", "On-prem", "Bare metal"];
const SHARE: [number, number][] = [[1720, 150], [1830, 880], [980, 150]];

const InfraIcon: React.FC<{ i: number; color: string }> = ({ i, color }) => (
  <svg width={60} height={44} viewBox="0 0 60 44">
    {i <= 1 && <path d="M16 38 h30 a10 10 0 0 0 0 -20 a14 14 0 0 0 -27 -2 a11 11 0 0 0 -3 22 z" fill="none" stroke={color} strokeWidth={4} strokeDasharray={i === 1 ? "6 4" : undefined} />}
    {i === 2 && (<><rect x={20} y={14} width={20} height={16} rx={3} fill="none" stroke={color} strokeWidth={4} />{[[6, 6], [54, 6], [6, 38], [54, 38]].map(([x, y], k) => <g key={k}><circle cx={x} cy={y} r={4} fill={color} /><line x1={x} y1={y} x2={30} y2={22} stroke={color} strokeWidth={3} /></g>)}</>)}
    {i === 3 && (<><rect x={8} y={4} width={44} height={15} rx={3} fill="none" stroke={color} strokeWidth={4} /><rect x={8} y={25} width={44} height={15} rx={3} fill="none" stroke={color} strokeWidth={4} /><circle cx={44} cy={11} r={2.5} fill={color} /><circle cx={44} cy={32} r={2.5} fill={color} /></>)}
    {i === 4 && (<><rect x={12} y={6} width={36} height={32} rx={4} fill="none" stroke={color} strokeWidth={4} />{[0, 1, 2, 3].map((k) => <line key={k} x1={20 + k * 7} y1={14} x2={20 + k * 7} y2={30} stroke={color} strokeWidth={3} />)}</>)}
  </svg>
);

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  const ready = useFonts();
  if (!ready) return null;

  // the card's center and scale through the four beats
  const up = tw(g, 300, 334, 0, 1, MOVE) * (1 - tw(g, 470, 502, 0, 1, MOVE));
  const away = tw(g, 640, 668, 0, 1, DEPART);
  const k4 = tw(g, 470, 502, 0, 1, MOVE);
  const cx = lerp(lerp(1400, 1360, up), 1190, k4) + tw(g, 558, 590, 0, 130, MOVE) + Math.sin(g / 37) * 6, cy = lerp(540, 330, up) + Math.cos(g / 31) * 7;
  const s = lerp(1, 0.72, up) * lerp(1, 0.84, k4) * (1 - away * 0.9);
  const cardOn = tw(g, 150, 184, 0, 1, ARRIVE);
  const card = { x: cx - (W.w / 2) * s, y: cy - (W.h / 2) * s };

  const float = (i: number) => [Math.sin(g / 23 + i * 1.7) * 8, Math.cos(g / 29 + i) * 6];
  const scatterOut = tw(g, 150, 166, 0, 1, LINEAR);
  const act = Math.floor((g - 344) / 30) % 5;

  return (
    <AbsoluteFill style={{ opacity: 1 - tw(g, 654, 668, 0, 1, LINEAR) }}>
      {/* 1: the broken links between the scattered parts */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: tw(g, 20, 40, 0, 1, LINEAR) * (1 - scatterOut) }}>
        {[[2, 1], [1, 3], [0, 2], [0, 3]].map(([a, b], k) => {
          const [ax, ay] = SCATTER[a], [bx, by] = SCATTER[b];
          const mx = (ax + bx) / 2, my = (ay + by) / 2;
          return (
            <g key={k}>
              <line x1={ax} y1={ay} x2={lerp(ax, mx, 0.8)} y2={lerp(ay, my, 0.8)} stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={3} strokeDasharray="10 10" />
              <line x1={bx} y1={by} x2={lerp(bx, mx, 0.8)} y2={lerp(by, my, 0.8)} stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={3} strokeDasharray="10 10" />
            </g>
          );
        })}
      </svg>

      {/* 4: copies go out to collaborators; the original stays under control */}
      {SHARE.map(([tx, ty], i) => {
        const t = tw(g, 570 + i * 5, 596 + i * 5, 0, 1, MOVE);
        if (t <= 0) return null;
        const fade = 1 - tw(g, 640, 660, 0, 1, LINEAR);
        const x = lerp(cx, tx, t), y = lerp(cy, ty, t), sc = lerp(s * 0.7, 0.22, t);
        return (
          <React.Fragment key={i}>
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: fade }}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={C.cyan} strokeWidth={3} strokeOpacity={0.7} />
            </svg>
            <div style={{ position: "absolute", left: x - (W.w / 2) * sc, top: y - (W.h / 2) * sc, width: W.w, height: W.h, transformOrigin: "0 0", scale: String(sc),
              borderRadius: 26, background: C.card, border: `6px solid ${C.cardLine}`, boxSizing: "border-box", opacity: fade }}>
              {TILES.map((kind, k) => <div key={kind} style={{ position: "absolute", left: tileLocal(k)[0], top: 56, width: TW, height: TH, borderRadius: 16, border: `5px solid ${C.cardLine}`, boxSizing: "border-box" }} />)}
            </div>
          </React.Fragment>
        );
      })}

      {/* 2: the workspace card forms around the tiles */}
      {cardOn > 0 && (
        <div style={{ position: "absolute", left: card.x, top: card.y, width: W.w, height: W.h, transformOrigin: "0 0", scale: String(s * lerp(0.94, 1, cardOn)),
          opacity: cardOn, borderRadius: 26, background: C.card, border: `4px solid ${C.cardLine}`, boxSizing: "border-box", boxShadow: "0 60px 120px -50px rgba(2,20,80,.8)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 40, color: C.slate }}>Computational Workspace</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 322, textAlign: "center", fontFamily: FONT, fontWeight: 400, fontSize: 28, color: C.grey,
            opacity: tw(g, 196, 206, 0, 1, LINEAR) }}>code · data · dependencies · results · compute</div>
          {/* 4: the sovereignty lock */}
          <div style={{ position: "absolute", right: -26, top: -26, width: 76, height: 76, borderRadius: 38, background: C.blue, border: "4px solid #fff",
            display: "flex", alignItems: "center", justifyContent: "center", scale: String(tw(g, 590, 604, 0, 1, ARRIVE)) }}>
            <svg width={34} height={38} viewBox="0 0 34 38"><rect x={3} y={16} width={28} height={20} rx={4} fill="#fff" /><path d="M9 16 v-5 a8 8 0 0 1 16 0 v5" fill="none" stroke="#fff" strokeWidth={4} /></svg>
          </div>
        </div>
      )}

      {/* 4: snapshots peel out behind the card */}
      {[3, 2, 1].map((k) => {
        const p = tw(g, 480 + (3 - k) * 6, 510 + (3 - k) * 6, 0, 1, ARRIVE) * (1 - tw(g, 556, 570, 0, 1, LINEAR));
        if (p <= 0) return null;
        return <div key={k} style={{ position: "absolute", left: card.x - 26 * k * p, top: card.y - 26 * k * p, width: W.w * s, height: W.h * s, borderRadius: 26,
          border: "3px solid rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.08)", opacity: p * (1 - k * 0.2), boxSizing: "border-box" }} />;
      })}

      {/* the four parts: scattered, then tiles in the card */}
      {TILES.map((kind, i) => {
        const t = tw(g, 150 + i * 4, 184 + i * 4, 0, 1, MOVE);
        const [lx, ly] = tileLocal(i);
        const [fx, fy] = float(i);
        const sx0 = SCATTER[i][0] - (TW * 1.15) / 2 + fx, sy0 = SCATTER[i][1] - (TH * 1.15) / 2 + fy;
        const tx = card.x + lx * s, ty = card.y + ly * s;
        const on = tw(g, 16 + i * 5, 32 + i * 5, 0, 1, ARRIVE);
        return (
          <React.Fragment key={kind}>
            <div style={{ opacity: on, translate: `0px ${(1 - on) * 40}px` }}>
              <Tile kind={kind} x={lerp(sx0, tx, t)} y={lerp(sy0, ty, t)} s={lerp(1.15, s, t)} label={1} />
            </div>
            <div style={{ position: "absolute", left: SCATTER[i][0] + fx, top: SCATTER[i][1] + (TH * 1.15) / 2 + 14 + fy, translate: "-50% 0", fontFamily: FONT, fontWeight: 600,
              fontSize: 28, color: C.soft, whiteSpace: "nowrap", opacity: tw(g, 30 + i * 5, 40 + i * 5, 0, 1, LINEAR) * (1 - scatterOut) }}>{TAGS[i]}</div>
          </React.Fragment>
        );
      })}

      {/* 2: the familiar tools above the card */}
      <div style={{ position: "absolute", left: cx, top: card.y - 88, translate: "-50% 0", display: "flex", gap: 12, opacity: 1 - tw(g, 296, 306, 0, 1, LINEAR) }}>
        {TOOLS.map((t, i) => (
          <div key={t} style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.blue, background: C.card, borderRadius: 12, padding: "12px 16px 8px",
            whiteSpace: "nowrap", opacity: tw(g, 198 + i * 3, 204 + i * 3, 0, 1, LINEAR), translate: `0px ${tw(g, 198 + i * 3, 210 + i * 3, 24, 0, ARRIVE)}px` }}>{t}</div>
        ))}
      </div>

      {/* 3: the Nuvolos layer and any infrastructure beneath it */}
      {(() => {
        const k = tw(g, 306, 336, 0, 1, ARRIVE) * (1 - tw(g, 468, 492, 0, 1, DEPART));
        if (k <= 0) return null;
        const sy = 520 + (1 - k) * 120;
        return (
          <div style={{ position: "absolute", inset: 0, opacity: k }}>
            <div style={{ position: "absolute", left: cx - 490, top: sy, width: 980, height: 104, borderRadius: 22, background: `linear-gradient(90deg, ${C.blue}, ${C.sky})`,
              border: "3px solid rgba(255,255,255,0.9)", boxShadow: "0 16px 0 #1E5FD0, 0 40px 80px -30px rgba(0,0,0,.5)", boxSizing: "border-box",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
              <Img src={staticFile("img/logo-white.svg")} style={{ height: 56, width: 56 * (65.29 / 65.29), objectFit: "cover", objectPosition: "left" }} />
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 34, color: "#fff" }}>Nuvolos Reproducibility & Sovereignty Layer</div>
            </div>
            {INFRA.map((name, i) => {
              const x = cx + (i - 2) * 195 - 90, y = sy + 170;
              const on = g >= 344 && act === i;
              const b = tw(g, 322 + i * 4, 336 + i * 4, 0, 1, ARRIVE);
              return (
                <div key={name} style={{ position: "absolute", left: x, top: y + (1 - b) * 30, width: 180, height: 150, borderRadius: 14, boxSizing: "border-box",
                  border: on ? `4px solid ${C.cyan}` : "3px dashed rgba(255,255,255,0.7)", background: on ? "rgba(61,242,255,0.14)" : "transparent", opacity: b,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <InfraIcon i={i} color={on ? C.cyan : "#fff"} />
                  <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 27, color: on ? C.cyan : "#fff", whiteSpace: "nowrap" }}>{name}</div>
                </div>
              );
            })}
            {g >= 344 && (() => {
              const x = cx + (act - 2) * 195;
              const p = ((g - 344) % 30) / 30;
              return (
                <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
                  <line x1={x} y1={sy + 110} x2={x} y2={sy + 170} stroke={C.cyan} strokeWidth={5} />
                  <circle cx={x} cy={sy + 110 + 60 * ARRIVE(Math.min(1, p * 2))} r={8} fill={C.cyan} />
                </svg>
              );
            })()}
          </div>
        );
      })()}

      {/* 4: the snapshot timeline beside the card */}
      {(() => {
        const k = tw(g, 488, 504, 0, 1, ARRIVE) * (1 - tw(g, 556, 568, 0, 1, LINEAR));
        if (k <= 0) return null;
        const x = card.x + W.w * s + 70, y0 = card.y + 10, h = W.h * s - 20;
        const ticks = Math.floor(tw(g, 492, 536, 0, 16, LINEAR));
        return (
          <div style={{ position: "absolute", left: x, top: y0, height: h, width: 260, opacity: k }}>
            {Array.from({ length: 16 }).map((_, i) => i < ticks && (
              <div key={i} style={{ position: "absolute", left: 0, top: (i / 15) * h, width: i === 0 || i === 7 || i === 15 ? 46 : 26, height: i === 15 ? 6 : 3,
                background: i === 15 ? C.cyan : "rgba(255,255,255,0.8)", borderRadius: 3 }} />
            ))}
            {[["Start", 0], ["Milestone", 7], ["Current State", 15]].map(([t, i]) => (
              <div key={t as string} style={{ position: "absolute", left: 62, top: ((i as number) / 15) * h - 14, fontFamily: FONT, fontWeight: 600, fontSize: 30,
                color: i === 15 ? C.cyan : "#fff", opacity: ticks > (i as number) ? 1 : 0, whiteSpace: "nowrap" }}>{t}</div>
            ))}
          </div>
        );
      })()}

      <Headline g={g} at={24} out={146} lines={[[{ w: "Research," }, { w: "scattered" }], [{ w: "across", hi: true }, { w: "tools", hi: true }, { w: "and", hi: true }, { w: "clouds.", hi: true }]]} />
      <Headline g={g} at={188} out={296} lines={[[{ w: "One" }, { w: "workspace" }, { w: "for" }], [{ w: "code,", hi: true }, { w: "data", hi: true }, { w: "and", hi: true }, { w: "compute.", hi: true }]]} />
      <Headline g={g} at={340} out={468} lines={[[{ w: "Runs" }, { w: "anywhere." }]]} y={250} />
      <div style={{ position: "absolute", left: 110, top: 350, width: 560, fontFamily: FONT, fontWeight: 400, fontSize: 36, lineHeight: 1.3, color: C.soft,
        opacity: tw(g, 352, 362, 0, 1, LINEAR) * (1 - tw(g, 468, 475, 0, 1, LINEAR)) }}>From bare metal to the public cloud. The workspace stays the same.</div>
      <Headline g={g} at={492} out={558} lines={[[{ w: "Every" }, { w: "result," }], [{ w: "reproducible.", hi: true }]]} />
      <Headline g={g} at={568} out={640} lines={[[{ w: "Collaborate" }, { w: "globally." }], [{ w: "Retain", hi: true }, { w: "control.", hi: true }]]} />
    </AbsoluteFill>
  );
};
