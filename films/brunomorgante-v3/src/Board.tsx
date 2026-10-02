import React from "react";
import { interpolateColors } from "remotion";
import { C, MOVE, Pill, SHADOW, lerp } from "./lib";
import { Line, LIN, POP, Roll, T, measure } from "./kit";

// 0–18 s on one board: the hook's word "idea." becomes the viewer's project card; deadlines, dependencies and
// people tangle around it; (Bruno's red takes the frame;) then, as a consultant, he untangles it: the cards
// line up as a ranked portfolio, the plan's bars draw, the PMO turns every status green, the team docks on.

const IDEA_SIZE = 230, IDEA_X = 140, IDEA_Y = 430;
const CARD = { x: 580, y: 380, w: 760, h: 310 };
const ROW = (slot: number) => ({ x: 140, y: 440 + slot * 138, w: 600, h: 112 });
const DEPS = [
  { t: "Vendor contract", s: "No owner", tone: "stone" as const },
  { t: "Data migration", s: "Blocked", tone: "amber" as const },
  { t: "Legal sign-off", s: "Waiting", tone: "stone" as const },
];
const DEP_AT = ["w:dependencies-0.05", "w:dependencies+0.12", "w:dependencies+0.29"];
const DEP_TANGLE = (i: number) => ({ x: 1330, y: 210 + i * 126, w: 520, h: 100 });
const DATES = ["14 Mar", "2 Jun", "30 Sep?"];
const PEOPLE = ["PM", "IT", "FI", "LG", "OP", "HR", "QA"];
const BAR = [[0, 430], [170, 520], [330, 430], [560, 390]];      // the plan: start and length of each item's bar (x from 800)
const AXIS = { x0: 140, x1: 1780, y: 318 };
const STOPS = [["Portfolio", "w:portfolio"], ["Plan", "w:plan"], ["PMO", "w:p"], ["Team", "w:team"]] as const;
const STOP_X = (i: number) => lerp(AXIS.x0 + 330, AXIS.x1 - 120, i / 3);

const rect = (a: { x: number; y: number; w: number; h: number }, b: typeof a, k: number) =>
  ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k) });

export const Board: React.FC<{ g: number }> = ({ g }) => {
  // ---------- the idea: the red mark on "idea." becomes the card, the card becomes the portfolio's first row
  const ideaW = measure("idea.", IDEA_SIZE);
  const mark = T.k(g, "w:idea+0.12", 0.32, MOVE);
  const toCard = T.k(g, "tangle", 0.62, MOVE);
  const untangle = T.k(g, "w:takes", 0.85, MOVE);
  const rank = T.k(g, "w:portfolio+0.3", 0.55, MOVE);                // the project moves up to number one
  const slotIdea = lerp(1, 0, rank), slotDep0 = lerp(0, 1, rank);
  const markRect = { x: IDEA_X - IDEA_SIZE * 0.1, y: IDEA_Y + IDEA_SIZE * 0.06, w: ideaW + IDEA_SIZE * 0.2, h: IDEA_SIZE * 1.04 };
  const tension = T.k(g, "w:deadlines", 2.6, LIN) * (1 - untangle);
  const drift = (i: number, a = 6) => [Math.sin(g / 37 + i * 1.7) * a * (0.4 + tension), Math.cos(g / 31 + i * 2.3) * a * (0.4 + tension)];
  const [cdx, cdy] = drift(9, 5);
  const box = g < T.f("tangle") ? { ...markRect, w: markRect.w * mark } : untangle > 0 ? rect(CARD, ROW(slotIdea), untangle) : rect(markRect, CARD, toCard);
  const bx = box.x + cdx * (1 - untangle) + Math.sin(rank * Math.PI) * 70, by = box.y + cdy * (1 - untangle);
  const rot = (-1.2 - 2.2 * tension) * toCard * (1 - untangle);
  const typed = T.k(g, "tangle+0.3", 1.05, LIN);
  const title = "Launch the new platform";
  const cardLayout = toCard * (1 - untangle), rowLayout = untangle;
  const extrasOut = T.k(g, "w:he", 0.4);                            // deadlines and people clear as he takes over
  const delivered = T.k(g, "w:team+0.4", 0.4, MOVE);

  // ---------- the consultant's axis: strategy → execution, the four stops lit as they are named
  const axisK = T.k(g, "w:strategy", 1.1, MOVE);
  const reach = (() => {
    let p = 0;
    STOPS.forEach(([, at], i) => { p = Math.max(p, lerp(i === 0 ? 0 : (STOP_X(i - 1) - AXIS.x0) / (AXIS.x1 - AXIS.x0), (STOP_X(i) - AXIS.x0) / (AXIS.x1 - AXIS.x0), T.k(g, `${at}-0.25`, 0.5, MOVE))); });
    return lerp(p, 1, T.k(g, "w:team+0.5", 0.7, MOVE));
  })();
  const execX = AXIS.x1 - measure("Execution", 72);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* 1 hook */}
      <Line g={g} x={140} y={170} size={112} out="tangle-0.05" words={[{ t: "Every", at: "w:every" }, { t: "big", at: "w:big", red: true }, { t: "project", at: "w:project" }]} />
      <Line g={g} x={140} y={300} size={112} out="tangle" words={[{ t: "starts", at: "w:starts" }, { t: "as", at: "w:as" }, { t: "one", at: "w:one" }, { t: "simple", at: "w:simple" }]} />

      {/* 2 the tangle: dashed threads from the card to everything that pulls on it */}
      {g >= T.f("w:deadlines-0.1") && extrasOut < 1 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - Math.max(extrasOut, untangle) }}>
          {DATES.map((_, i) => {
            const k = T.k(g, `w:deadlines+${(0.25 * i).toFixed(2)}`, 0.4);
            const [dx, dy] = drift(i);
            return <path key={`d${i}`} d={`M${bx + 120 + i * 90},${by + 10} C${bx + 40},${by - 150} ${330 + i * 150},${360} ${225 + i * 230 + dx},${276 + dy}`} fill="none" stroke={C.stone} strokeWidth={3} strokeDasharray="9 9" pathLength={1} opacity={k} />;
          })}
          {DEPS.map((_, i) => {
            const k = T.k(g, DEP_AT[i], 0.45);
            const r = DEP_TANGLE(i); const [dx, dy] = drift(i + 3);
            const sy = by + 60 + ((i + 1) % 3) * 90;
            return <path key={`p${i}`} d={`M${bx + CARD.w},${sy} C${1380},${sy + (i - 1) * -160} ${1250},${r.y + 50 + (1 - i) * 120} ${lerp(bx + CARD.w, r.x + dx, k)},${lerp(sy, r.y + r.h / 2 + dy, k)}`} fill="none" stroke={C.stone} strokeWidth={3} strokeDasharray="9 9" opacity={k} />;
          })}
          {PEOPLE.map((_, i) => {
            const k = T.k(g, `w:people+${(0.06 * i).toFixed(2)}`, 0.4);
            const [dx, dy] = drift(i + 6);
            const px = 470 + i * 170 + dx, py = 880 + (i % 2) * 50 + dy;
            return <path key={`h${i}`} d={`M${px},${py - 46} Q${lerp(px, bx + 380, 0.5) + (i % 2 ? 90 : -90)},${(py + by + CARD.h) / 2} ${lerp(px, bx + 200 + i * 60, k)},${lerp(py - 46, by + CARD.h, k)}`} fill="none" stroke={C.stone} strokeWidth={3} strokeDasharray="9 9" opacity={k} />;
          })}
        </svg>
      )}
      {extrasOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - extrasOut, transform: `scale(${1 + extrasOut * 0.06})`, filter: extrasOut > 0 ? `blur(${extrasOut * 6}px)` : undefined }}>
          <Line g={g} x={120} y={96} size={64} words={[{ t: "Deadlines", at: "w:deadlines-0.05" }]} />
          {DATES.map((d, i) => {
            const at = `w:deadlines+${(0.25 * i).toFixed(2)}`;
            const k = T.k(g, at, 0.4, POP);
            const strike = i < 2 ? T.k(g, `w:deadlines+${(0.25 * i + 0.22).toFixed(2)}`, 0.22, MOVE) : 0;
            const ring = i === 2 ? T.k(g, "w:deadlines+0.78", 0.45, MOVE) : 0;
            const [dx, dy] = drift(i);
            if (k <= 0) return null;
            return (
              <div key={d} style={{ position: "absolute", left: 120 + i * 230, top: 190, width: 210, height: 84, borderRadius: 18, background: C.paper, boxShadow: SHADOW,
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 38, color: i < 2 ? interpolateColors(strike, [0, 1], [C.ink, C.stone]) : C.ink,
                transform: `translate(${dx}px, ${dy}px) scale(${k})`, opacity: Math.min(1, k * 2), willChange: "transform" }}>
                {d}
                {i < 2 && <div style={{ position: "absolute", left: 26, right: 26, top: 40, height: 6, borderRadius: 6, background: C.red, transformOrigin: "0 50%", transform: `scaleX(${strike})` }} />}
                {i === 2 && <svg width={280} height={140} style={{ position: "absolute", left: -35, top: -28, overflow: "visible" }}>
                  <path d="M40,74 C30,18 230,8 252,58 C272,108 120,132 52,104 C20,90 22,52 70,30" fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} />
                </svg>}
              </div>
            );
          })}
          <Line g={g} x={1330} y={100} size={64} words={[{ t: "Dependencies", at: "w:dependencies-0.1" }]} />
          <Line g={g} x={140} y={760} size={64} words={[{ t: "People", at: "w:people-0.1" }]} />
          {PEOPLE.map((p, i) => {
            const k = T.k(g, `w:people+${(0.06 * i).toFixed(2)}`, 0.45, POP);
            const q = [1, 4, 6].includes(i) ? T.k(g, `w:people+${(0.35 + 0.08 * i).toFixed(2)}`, 0.35, POP) : 0;
            const [dx, dy] = drift(i + 6);
            if (k <= 0) return null;
            return (
              <div key={p} style={{ position: "absolute", left: 470 + i * 170 - 46, top: 880 + (i % 2) * 50 - 46, width: 92, height: 92, borderRadius: 99, transform: `translate(${dx}px, ${dy}px) scale(${k})`, willChange: "transform",
                background: [C.stonePale, "#E8DCCF", C.redPale][i % 3], border: "4px solid #fff", boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 32 }}>
                {p}
                {q > 0 && <div style={{ position: "absolute", right: -18, top: -22, width: 46, height: 46, borderRadius: 99, background: C.ink, color: "#fff", fontSize: 30, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${q})` }}>?</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* the dependencies: cards in the tangle, rows of the portfolio */}
      {DEPS.map((d, i) => {
        const k = T.k(g, DEP_AT[i], 0.5);
        if (k <= 0) return null;
        const [dx, dy] = drift(i + 3);
        const slot = i === 0 ? slotDep0 : i + 1;
        const r = rect({ ...DEP_TANGLE(i), x: DEP_TANGLE(i).x + dx + (1 - k) * 260, y: DEP_TANGLE(i).y + dy }, ROW(slot), untangle);
        return <Item key={d.t} g={g} r={r} k={k} rot={(i - 1) * 1.6 * tension} num={slot + 1} numOn={T.k(g, "w:portfolio-0.1", 0.4)} title={d.t}
          pill={<Roll g={g} at={`w:p+${(0.12 * (i + 1)).toFixed(2)}`} h={52} a={<Pill tone={d.tone} size={26}>{d.s}</Pill>} b={<Pill tone="green" size={26}>On track</Pill>} />} />;
      })}

      {/* the idea itself */}
      {(mark > 0 || g >= T.f("tangle")) && (
        <div style={{ position: "absolute", left: 0, top: 0, width: box.w, height: box.h, borderRadius: lerp(IDEA_SIZE * 0.08, 26, Math.max(toCard, 0)) * (1 - untangle) + 20 * untangle,
          background: interpolateColors(toCard, [0.25, 0.85], [C.red, C.paper]), boxShadow: toCard > 0.3 ? SHADOW : undefined, transform: `translate(${bx}px, ${by}px) rotate(${rot}deg)`, willChange: "transform",
          border: toCard > 0.5 ? `1px solid ${C.line}` : undefined, overflow: "hidden" }}>
          {cardLayout > 0.01 && (
            <div style={{ position: "absolute", left: 44, top: 38, right: 44, opacity: T.k(g, "tangle+0.42", 0.3) * Math.max(0, 1 - rowLayout * 1.7) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 600, fontSize: 30, color: C.ink2 }}>Your next project</div>
                <Pill tone="stone" size={26}>Idea</Pill>
              </div>
              <div style={{ fontWeight: 700, fontSize: 64, lineHeight: 1.12, letterSpacing: "-0.03em", marginTop: 22 }}>
                {title.slice(0, Math.round(title.length * typed))}<span style={{ opacity: 0 }}>{title.slice(Math.round(title.length * typed))}</span>
              </div>
            </div>
          )}
          {rowLayout > 0.01 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px 0 26px", opacity: Math.min(1, Math.max(0, (rowLayout - 0.3) / 0.4)) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ fontWeight: 800, fontSize: 34, color: C.red, width: 30, opacity: T.k(g, "w:portfolio-0.1", 0.4) }}>{Math.round(slotIdea) + 1}</span>
                <span style={{ fontWeight: 700, fontSize: 34 }}>New platform</span>
              </div>
              <Roll g={g} at="w:team+0.4" h={52} a={<Roll g={g} at="w:p" h={52} a={<Pill tone="stone" size={26}>Idea</Pill>} b={<Pill tone="green" size={26}>On track</Pill>} />}
                b={<span style={{ transform: `scale(${1 + 0.12 * Math.sin(delivered * Math.PI)})`, display: "inline-block" }}><Pill tone="green" size={26}>Delivered ✓</Pill></span>} />
            </div>
          )}
        </div>
      )}
      {/* the word "idea." on its mark (white on red), until the mark becomes the card */}
      {toCard < 1 && <Line g={g} x={IDEA_X} y={IDEA_Y} size={IDEA_SIZE} style={{ opacity: 1 - toCard * 2.2 }}
        words={[{ t: "idea.", at: "w:idea-0.06", color: interpolateColors(mark, [0, 0.5], [C.ink, "#FFFFFF"]) }]} />}

      {/* 4 consulting: strategy → execution, and the stops along it */}
      {g >= T.f("w:strategy-0.1") && (
        <>
          <Line g={g} x={AXIS.x0} y={200} size={72} words={[{ t: "Strategy", at: "w:strategy-0.05" }]} />
          <Line g={g} x={execX} y={200} size={72} words={[{ t: "Execution", at: "w:execution-0.05", red: true }]} />
          <div style={{ position: "absolute", left: AXIS.x0, top: AXIS.y, width: AXIS.x1 - AXIS.x0, height: 6, borderRadius: 6, background: C.line, transformOrigin: "0 50%", transform: `scaleX(${axisK})` }} />
          <div style={{ position: "absolute", left: AXIS.x0, top: AXIS.y, width: (AXIS.x1 - AXIS.x0) * reach, height: 6, borderRadius: 6, background: C.red }} />
          <div style={{ position: "absolute", left: AXIS.x0 + (AXIS.x1 - AXIS.x0) * Math.max(reach, 0.0001) - 14, top: AXIS.y - 11, width: 28, height: 28, borderRadius: 99, background: C.red,
            boxShadow: `0 0 0 8px rgba(189,23,23,.16)`, opacity: T.k(g, "w:strategy+0.3", 0.3) }} />
          {STOPS.map(([s, at], i) => {
            const k = T.k(g, `${at}-0.08`, 0.4);
            const lit = T.k(g, `${at}+0.15`, 0.25);
            return (
              <div key={s} style={{ position: "absolute", left: STOP_X(i) - 80, top: AXIS.y - 8, width: 160, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, k * 1.6),
                transform: `translateY(${(1 - k) * 18}px)` }}>
                <div style={{ width: 22, height: 22, borderRadius: 99, background: interpolateColors(lit, [0, 1], [C.stone, C.red]), border: "4px solid #fff" }} />
                <div style={{ marginTop: 12, fontWeight: 700, fontSize: 36, color: interpolateColors(lit, [0, 1], [C.ink2, C.ink]) }}>{s}</div>
              </div>
            );
          })}
        </>
      )}
      {/* the plan: a bar per item; Today moves through it */}
      {g >= T.f("w:plan-0.1") && [1, 0, 2, 3].map((item, i) => {
        // item 0 is the idea; its row follows the ranking
        const slot = item === 0 ? slotIdea : item === 1 ? slotDep0 : item;
        const [st, len] = BAR[i];
        const k = T.k(g, `w:plan+${(0.07 * i).toFixed(2)}`, 0.55, MOVE);
        const y = ROW(slot).y + 34;
        const owner = T.k(g, `w:team+${(0.06 * i).toFixed(2)}`, 0.45, POP);
        return (
          <React.Fragment key={item}>
            <div style={{ position: "absolute", left: 800 + st, top: y, width: len * k, height: 44, borderRadius: 22, background: item === 0 ? C.red : "#D9D3CA" }} />
            {owner > 0 && <div style={{ position: "absolute", left: 800 + st - 4, top: y - 10, width: 64, height: 64, borderRadius: 99, transform: `scale(${owner})`, border: "4px solid #fff",
              background: [C.redPale, C.stonePale, "#E8DCCF", C.greenPale][i], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 24, boxShadow: SHADOW }}>{PEOPLE[i]}</div>}
          </React.Fragment>
        );
      })}
      {g >= T.f("w:plan") && (() => {
        const x = 800 + 640 * T.k(g, "w:plan+0.2", 2.6, LIN);
        const k = T.k(g, "w:plan+0.2", 0.4);
        return (
          <div style={{ position: "absolute", left: x, top: 420, height: 540, width: 0, borderLeft: `4px dashed ${C.red}`, opacity: k }}>
            <div style={{ position: "absolute", left: -56, top: 546, width: 112, textAlign: "center", fontWeight: 700, fontSize: 28, color: C.red, background: C.canvas }}>Today</div>
          </div>
        );
      })()}
      {/* he leads it: Bruno's photo stays with his consulting work, and the label */}
      {g >= T.f("consult") && (
        <div style={{ position: "absolute", left: 94, top: 60, display: "flex", alignItems: "center", gap: 18, opacity: T.k(g, "consult+0.35", 0.3) }}>
          <div style={{ width: 92, height: 92 }} />
          <div style={{ fontWeight: 700, fontSize: 30, color: "#fff", background: C.red, padding: "10px 22px", borderRadius: 99, transform: `translateX(${(1 - T.k(g, "consult+0.35", 0.45)) * -24}px)` }}>Consulting</div>
        </div>
      )}
    </div>
  );
};

const Item: React.FC<{ g: number; r: { x: number; y: number; w: number; h: number }; k: number; rot: number; num: number; numOn: number; title: string; pill: React.ReactNode }> = ({ r, k, rot, num, numOn, title, pill }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: r.w, height: r.h, borderRadius: 20, background: C.paper, boxShadow: SHADOW, border: `1px solid ${C.line}`, opacity: Math.min(1, k * 1.6),
    filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined, transform: `translate(${r.x}px, ${r.y}px) rotate(${rot}deg)`, willChange: "transform", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px 0 26px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <span style={{ fontWeight: 800, fontSize: 34, color: C.stone, width: numOn > 0 ? 30 : 0, opacity: numOn, overflow: "hidden" }}>{Math.round(num)}</span>
      <span style={{ fontWeight: 700, fontSize: 34, whiteSpace: "nowrap" }}>{title}</span>
    </div>
    {pill}
  </div>
);

