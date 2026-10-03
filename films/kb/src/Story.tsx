import React from "react";
import { T } from "./clock";
import { ARRIVE, Bloom, DEPART, Iris, LIN, Line, MOVE, Roll, Selector, Typed, type W, centred, lerp, off, track } from "./kinetic";
import { C, FONT, SHADOW } from "./lib";
import { Avatar, Card, Chip, Ico, Logo, Step, Tile, Window } from "./parts";

// K.B · one continuous stage. Their logo (the navy badge, never redrawn) drops into a business held back by a manual
// step and clears it, then rides in the corner like the button of their site's nav. A cyan pulse, the data, runs every
// system K.B builds: along the lined-up steps, strategy into implementation, the straightened flow, the tools, the
// Diagnose, Build, Run loop; at the close the badge grows out of it.
const k = (g: number, pos: string | number, dur = 0.5, ease = ARRIVE) => T.k(g, pos, dur, ease);
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const tl = (g: number, i = 0, a = 7) => `perspective(1800px) rotateY(${(Math.sin(g / 60 + i * 1.7) * a * 0.7).toFixed(3)}deg) rotateX(${(Math.cos(g / 80 + i) * a * 0.35).toFixed(3)}deg)`;
const H = { size: 84, weight: 800, ls: -0.035 };
const head = (words: W[], size = H.size) => centred(words, size, 960, H.weight);

// ---------------------------------------------------------------- 1 · move faster, not hold it back
const FLOW = [["lead", "New lead"], ["quote", "Quote sent"], ["order", "Order"], ["invoice", "Invoice"], ["onboard", "Onboarding"], ["mail", "Follow-up"]] as const;
const WALL = 1190, LANE = 690, SP = 360;
// the lane moves at 160 px/s, and speeds up to 900 px/s on "faster"; it is frozen at the moment the jam starts
const lanePos = (t: number) => {
  const tf = T.s("w:faster"), r = 0.7, v0 = 260, v1 = 1000;
  if (t < tf) return v0 * t;
  const d = Math.min(t - tf, r);
  return v0 * t + ((v1 - v0) * d * d) / (2 * r) + (t > tf + r ? (v1 - v0) * (t - tf - r) : 0);
};
const flowX = (i: number, t: number) => ((lanePos(t) + i * SP) % (SP * FLOW.length)) - 300;
const Hook: React.FC<{ g: number }> = ({ g }) => {
  if (g > T.f("sys+0.6")) return null;
  const t = g / 30, tj = T.s("w:not");
  const jam = k(g, "w:not", 0.55, ARRIVE), back = k(g, "w:back", 0.35, MOVE), wall = k(g, "w:hold-0.1", 0.4, ARRIVE);
  const blast = k(g, "w:kb+0.08", 0.75, DEPART);
  const frozen = FLOW.map((_, i) => flowX(i, Math.min(t, tj)));
  const behind = frozen.map((x, i) => [x, i] as const).filter(([x]) => x < WALL - 40).sort((a, b) => b[0] - a[0]);
  const l1: W[] = [{ t: "Technology", at: "w:technology" }, { t: "should", at: "w:should" }, { t: "make", at: "w:make" }];
  const l2: W[] = [{ t: "your", at: "w:your" }, { t: "business", at: "w:business" }, { t: "move", at: "w:move" }, { t: "faster,", at: "w:faster", accent: true, under: "w:faster+0.2" }];
  const l3: W[] = [{ t: "not", at: "w:not" }, { t: "hold", at: "w:hold" }, { t: "it", at: "w:it" }, { t: "back.", at: "w:back", strike: "w:back+0.12" }];
  return (
    <>
      <Line g={g} words={l1} x={140} y={130} size={80} weight={800} ls={-0.035} out="w:faster+0.45" />
      <Line g={g} words={l2} x={140} y={230} size={80} weight={800} ls={-0.035} out="w:faster+0.5" />
      <Line g={g} words={l3} x={140} y={180} size={96} weight={800} ls={-0.035} out="mark-0.05" />
      {/* the lane */}
      <div style={{ position: "absolute", left: -100, top: LANE + 56, width: 2120, height: 6, borderRadius: 6, background: C.line, opacity: 1 - blast }} />
      {FLOW.map(([icon, label], i) => {
        const pile = behind.findIndex(([, j]) => j === i);
        let x = flowX(i, t), y = LANE, r = 0;
        if (g >= T.f("w:not")) {
          if (pile >= 0) { const px = WALL - 300 - pile * 64; x = lerp(frozen[i], px, jam) - back * 70; y = LANE - pile * 10 * jam; r = (pile % 2 ? 4 : -3) * jam + Math.sin(g / 5 + pile) * 3 * jam * (1 - back * 0.5); x += Math.sin(g / 4 + pile * 2) * 8 * jam; }
          else x = frozen[i] + (t - tj) * 900;
        }
        // the dot lands and the jam is blown apart, outwards from the centre
        const dx = (x + 140 - 960), ang = Math.atan2(y - 560, dx);
        x += Math.cos(ang) * blast * 900; y += Math.sin(ang) * blast * 500; r += blast * (i % 2 ? 30 : -30);
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) rotate(${r}deg)`, opacity: 1 - blast, willChange: "transform" }}>
          <Step icon={icon} label={label} /></div>;
      })}
      {/* the manual step that holds it all back */}
      {wall > 0 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${WALL}px, ${LANE - 40}px) scale(${wall * (1 - blast * 0.4)})`, opacity: 1 - blast, transformOrigin: "50% 50%" }}>
        <Card w={330} h={190} tint={C.redSoft} style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Ico k="sheet" s={40} c={C.red} /><b style={{ fontSize: 28 }}>Copy to spreadsheet</b></div>
          <div style={{ marginTop: 22 }}><Chip s={24} c={C.red} icon="clock">Waiting…</Chip></div>
        </Card></div>}
    </>
  );
};

// ---------------------------------------------------------------- 2 · K.B builds smarter systems
const ROW = [["lead", "New lead"], ["quote", "Quote"], ["order", "Order"], ["invoice", "Invoice"], ["onboard", "Onboarding"]] as const;
const rowX = (i: number) => 125 + i * 345, ROWY = 520;
const System: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("w:helps") || g > T.f("pillars+0.6")) return null;
  const out = k(g, "w:with-0.32", 0.32, DEPART);
  const link = k(g, "w:smarter", 0.6, MOVE), run = k(g, "w:systems", 0.9, LIN);
  const words: W[] = [{ t: "Build", at: "w:build" }, { t: "smarter", at: "w:smarter", accent: true }, { t: "systems.", at: "w:systems", mark: "w:systems+0.25" }];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateX(${-out * 160}px)` }}>
      <Line g={g} words={words} x={head(words, 92)} y={170} size={92} weight={800} ls={-0.035} />
      <div style={{ position: "absolute", left: rowX(0) + 140, top: ROWY + 53, width: rowX(4) - rowX(0), height: 6, borderRadius: 6, background: C.cyan, transformOrigin: "0 50%", transform: `scaleX(${link})` }} />
      {ROW.map(([icon, label], i) => {
        const e = k(g, off("w:build", -0.15 + i * 0.07), 0.55, ARRIVE);
        const done = clamp((run * 4.4 - i) * 2.5);
        // they come back from where the jam threw them, and line up
        const fx = 960 + (i - 2) * 900, fy = i % 2 ? -300 : 1300;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(fx, rowX(i), e)}px, ${lerp(fy, ROWY, e) + Math.sin(g / 16 + i * 1.3) * 10 * e}px) rotate(${(1 - e) * (i % 2 ? 20 : -20)}deg)`, willChange: "transform" }}>
          <Step icon={icon} label={label} done={done} /></div>;
      })}
    </div>
  );
};

// ---------------------------------------------------------------- 3 · software, automation and AI
const PX = [120, 700, 1280], PY = 330, PW = 520, PHh = 470;
const Pillars: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("w:with-0.2") || g > T.f("axis+0.7")) return null;
  const out = k(g, "w:from-0.42", 0.34, DEPART);
  const words: W[] = [{ t: "Software,", at: "w:software", accent: true }, { t: "automation", at: "w:automation", accent: true }, { t: "and", at: "w:and" }, { t: "AI.", at: "w:ai", accent: true, under: "w:ai+0.25" }];
  const e = [k(g, "w:software-0.12", 0.55, ARRIVE), k(g, "w:automation-0.12", 0.55, ARRIVE), k(g, "w:ai-0.12", 0.55, ARRIVE)];
  const t = g / 30;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateX(${-out * 160}px)` }}>
      <Line g={g} words={words} x={head(words)} y={150} size={H.size} weight={800} ls={H.ls} />
      {/* software: a dashboard that keeps working */}
      {e[0] > 0 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${PX[0]}px, ${PY + (1 - e[0]) * 120}px) ${tl(g, 0)}`, opacity: e[0] }}>
        <Window w={PW} h={PHh} title="Operations">
          <div style={{ position: "absolute", left: 30, top: 140, display: "flex", gap: 14 }}>
            {[["Orders", "+12"], ["Open", "4"]].map(([a, b]) => <div key={a} style={{ width: 140, height: 84, borderRadius: 16, background: C.cyanSoft, padding: "12px 16px" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: C.muted }}>{a}</div><div style={{ fontSize: 32, fontWeight: 800, color: C.navy }}>{b}</div></div>)}
            <svg width={150} height={84} viewBox="0 0 150 84"><circle cx={42} cy={42} r={30} fill="none" stroke={C.card} strokeWidth={12} />
              <circle cx={42} cy={42} r={30} fill="none" stroke={C.cyan} strokeWidth={12} strokeDasharray={`${188 * (0.25 + 0.5 * k(g, "w:software", 1.4))} 188`} transform="rotate(-90 42 42)" strokeLinecap="round" /></svg>
          </div>
          <div style={{ position: "absolute", left: 30, bottom: 30, display: "flex", alignItems: "flex-end", gap: 16, height: 190 }}>
            {[0.5, 0.75, 0.6, 0.9, 0.7, 1].map((h, i) => <div key={i} style={{ width: 54, borderRadius: 10, background: i === 5 ? C.cyan : C.navy2,
              height: 190 * h * k(g, off("w:software", i * 0.06), 0.6) * (0.92 + 0.08 * Math.sin(t * 3 + i)) }} />)}
          </div>
        </Window></div>}
      {/* automation: a workflow, with a pulse running down it */}
      {e[1] > 0 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${PX[1]}px, ${PY + (1 - e[1]) * 120}px) ${tl(g, 1)}`, opacity: e[1] }}>
        <Card w={PW} h={PHh} style={{ padding: "34px 40px" }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.navy }}>Workflow</div>
          <div style={{ position: "absolute", left: 79, top: 150, width: 6, height: 230, background: C.card, borderRadius: 6 }} />
          <div style={{ position: "absolute", left: 82 - 9, top: 150 + ((t * 160) % 230) - 9, width: 18, height: 18, borderRadius: 99, background: C.cyan, boxShadow: `0 0 0 6px ${C.cyanSoft}` }} />
          {[["makecom", "Watch new orders"], ["n8n-logo2", "Sync to CRM"], ["", "Send the invoice"]].map(([logo, label], i) => (
            <div key={i} style={{ position: "absolute", left: 40, top: 100 + i * 115, opacity: k(g, off("w:automation", i * 0.12), 0.35), transform: `translateX(${(1 - k(g, off("w:automation", i * 0.12), 0.35)) * 40}px)` }}>
              <Step icon="invoice" logo={logo || undefined} label={label} w={440} h={96} /></div>))}
        </Card></div>}
      {/* AI: an agent answering inside the business */}
      {e[2] > 0 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${PX[2]}px, ${PY + (1 - e[2]) * 120}px) ${tl(g, 2)}`, opacity: e[2] }}>
        <Card w={PW} h={PHh} style={{ padding: "34px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 54, height: 54, borderRadius: 16, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico k="spark" s={30} c={C.cyan} w={2.6} /></div>
            <div><div style={{ fontSize: 30, fontWeight: 800, color: C.navy }}>Support agent</div><div style={{ fontSize: 20, color: C.muted, fontWeight: 600 }}>AI agent · in your inbox</div></div></div>
          <div style={{ marginTop: 34, marginLeft: 60, padding: "16px 20px", borderRadius: "20px 20px 6px 20px", background: C.card, fontSize: 26, fontWeight: 600, minHeight: 72 }}>
            <Typed g={g} text="Where is my order #2041?" at={off("w:ai", -0.6)} cps={26} caret={false} /></div>
          {(() => { const v = k(g, "w:ai+0.35", 0.45, ARRIVE); return v > 0 && <div style={{ marginTop: 18, marginRight: 40, padding: "16px 20px", borderRadius: "20px 20px 20px 6px", background: C.cyanSoft,
            fontSize: 26, fontWeight: 600, transform: `scale(${v})`, transformOrigin: "0 0" }}>It shipped today. Tracking is on its way to you. <span style={{ color: C.cyanDeep }}>✓</span></div>; })()}
        </Card></div>}
    </div>
  );
};

// ---------------------------------------------------------------- 4 · from strategy to implementation
const AX0 = 300, AX1 = 1620, AXY = 760;
const SKETCH = ["M30 70 h120 v70 h-120 z", "M190 70 h120 v70 h-120 z", "M350 70 h120 v70 h-120 z", "M150 105 h40", "M310 105 h40", "M90 140 v60 h300 v-60"];
const Axis: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("axis-0.1") || g > T.f("complex+0.6")) return null;
  const out = k(g, "complex-0.35", 0.35, DEPART);
  const draw = k(g, "w:from", 0.7, MOVE), go = k(g, "w:to", 1.2, MOVE), clean = k(g, "w:implementation+0.15", 0.6, MOVE);
  const words: W[] = [{ t: "From", at: "w:from" }, { t: "strategy", at: "w:strategy", accent: true }, { t: "to", at: "w:to" }, { t: "implementation.", at: "w:implementation", mark: "w:implementation+0.35" }];
  const cx = lerp(AX0 + 40, AX1 - 520, go);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `scale(${1 - out * 0.6})`, transformOrigin: `${AX1}px ${AXY}px` }}>
      <Line g={g} words={words} x={head(words)} y={150} size={H.size} weight={800} ls={H.ls} />
      <div style={{ position: "absolute", left: AX0, top: AXY, width: AX1 - AX0, height: 6, borderRadius: 6, background: C.navy2, transformOrigin: "0 50%", transform: `scaleX(${draw})`, opacity: 0.35 }} />
      <div style={{ position: "absolute", left: AX0, top: AXY, width: (AX1 - AX0) * go, height: 6, borderRadius: 6, background: C.cyan }} />
      {[["Strategy", AX0, "w:strategy"], ["Implementation", AX1, "w:implementation"]].map(([t, x, at]) => { const v = k(g, at as string, 0.4, ARRIVE);
        return v > 0 && <div key={t as string} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${(x as number) - 120}px, ${AXY + 40}px) scale(${v})` }}><Chip s={28} icon={t === "Strategy" ? "search" : "bolt"}>{t as string}</Chip></div>; })}
      {/* one card rides the axis: a whiteboard sketch that becomes the built system */}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${cx}px, ${AXY - 400}px) scale(${k(g, "w:strategy-0.1", 0.5, ARRIVE)}) ${tl(g, 1, 9)}`, transformOrigin: "50% 100%" }}>
        <Card w={500} h={340} tint={lerp(0, 1, clean) > 0.5 ? C.white : "#FFFFFE"} style={{ padding: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.muted, marginLeft: 12 }}>{clean < 0.5 ? "Workshop · the plan" : "Live · the system"}</div>
          <svg width={500} height={260} viewBox="0 0 500 260" style={{ position: "absolute", left: 0, top: 60, opacity: 1 - clean }}>
            {SKETCH.map((d, i) => <path key={i} d={d} fill="none" stroke={C.navy} strokeWidth={4} strokeLinecap="round" strokeDasharray="10 9" pathLength={1}
              style={{ strokeDasharray: undefined }} opacity={clamp(k(g, off("w:strategy", i * 0.08), 0.4) * 1.2)} />)}
            {["Lead", "Quote", "Invoice"].map((s, i) => <text key={s} x={90 + i * 160} y={112} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill={C.navy}>{s}</text>)}
          </svg>
          <div style={{ position: "absolute", left: 24, top: 110, display: "flex", gap: 14, opacity: clean, transform: `scale(${0.9 + 0.1 * clean})` }}>
            {[["lead", "Lead"], ["quote", "Quote"], ["invoice", "Invoice"]].map(([ic, s], i) => <Step key={s} icon={ic} label={s} w={142} h={86} done={clamp((clean - 0.3 - i * 0.2) * 3)} style={{ padding: "0 12px", gap: 8 }} />)}
          </div>
          <div style={{ position: "absolute", left: 24, bottom: 26, opacity: clean }}><Chip s={22} bg={C.cyanSoft} icon="loop">Runs on every new lead</Chip></div>
        </Card></div>
    </div>
  );
};

// ---------------------------------------------------------------- 5 · complex ideas into practical solutions, inside your business
const N = 48;
const tangle = Array.from({ length: N }, (_, i) => {
  const u = i / (N - 1);
  return [lerp(330, 1590, u) + Math.sin(u * 31) * 120 * Math.sin(u * Math.PI), 600 + Math.sin(u * 23 + 1) * 170 * Math.sin(u * Math.PI) + Math.cos(u * 47) * 60 * Math.sin(u * Math.PI)];
});
const NOTES = [["Quotes in one click?", 420, 390, -5], ["Sync the CRM", 1180, 360, 4], ["Weekly report, by itself", 760, 800, 3], ["Fewer emails", 1420, 780, -4]] as const;
const NODES = [["lead", "Request"], ["quote", "Quote"], ["mail", "Approval"], ["invoice", "Invoice"]] as const;
const Ideas: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("complex-0.1") || g > T.f("auto+0.7")) return null;
  const draw = k(g, "w:we", 1.2, MOVE), straight = k(g, "w:into", 0.8, MOVE), win = k(g, "w:inside-0.1", 0.7, ARRIVE);
  const zoom = k(g, "connect-0.05", 0.8, MOVE), side = k(g, "auto-0.05", 0.7, MOVE), out = k(g, "grow-0.28", 0.3, DEPART);
  // the window shrinks as the camera pulls out to the client's tools, then moves aside for the repetitive work
  const s = lerp(1, 0.56, zoom) * lerp(1, 0.8, side), gx = lerp(960, lerp(960, 520, side), 1), gy = lerp(560, 600, zoom);
  const pts = tangle.map(([x, y], i) => [lerp(x, lerp(400, 1520, i / (N - 1)), straight), lerp(y, 610, straight)]);
  const d = "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
  const l1: W[] = [{ t: "We", at: "w:we" }, { t: "turn", at: "w:turn" }, { t: "complex", at: "w:complex", accent: true }, { t: "ideas", at: "w:ideas" }];
  const l2: W[] = [{ t: "into", at: "w:into" }, { t: "practical", at: "w:practical", accent: true }, { t: "solutions.", at: "w:solutions", mark: "w:solutions+0.3" }];
  const l3: W[] = [{ t: "That", at: "w:that" }, { t: "work", at: "w:work" }, { t: "inside", at: "w:inside", under: "w:inside+0.2" }, { t: "your", at: "w:your2" }, { t: "business.", at: "w:business2" }];
  const run = k(g, "w:solutions", 1.0, LIN);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - k(g, "connect-0.2", 0.4, DEPART) }}>
        <Roll g={g} at="w:into-0.08" h={110} style={{ position: "absolute", left: 0, top: 120, width: 1920 }}
          a={<div style={{ width: 1920, display: "flex", justifyContent: "center" }}><Line g={g} words={l1} x={0} y={12} size={H.size} weight={800} ls={H.ls} style={{ position: "relative" }} /></div>}
          b={<div style={{ width: 1920, display: "flex", justifyContent: "center" }}><Line g={g} words={l2} x={0} y={12} size={H.size} weight={800} ls={H.ls} style={{ position: "relative" }} /></div>} />
        <Line g={g} words={l3} x={centred(l3, 46, 960, 700)} y={240} size={46} weight={700} ls={-0.02} color={C.muted} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${gx - 960}px, ${gy - 560}px) scale(${s}) ${tl(g, 2, 6)}`, transformOrigin: "960px 560px", opacity: 1 - out }}>
        {/* the client's app closes round the flow */}
        {win > 0 && <div style={{ position: "absolute", left: 260, top: 360, opacity: win, transform: `scale(${lerp(1.18, 1, win)})`, transformOrigin: "700px 250px" }}>
          <Window w={1400} h={500} title="Your business · Sales" /></div>}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={d} fill="none" stroke={straight > 0.6 ? C.cyan : C.navy} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${draw} 1`} />
        </svg>
        {NOTES.map(([t, x, y, r], i) => { const v = k(g, off("w:turn", i * 0.14), 0.4, ARRIVE); const f = straight;
          return v > 0 && f < 1 && <div key={t} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(x, 400 + i * 373 - 120, f)}px, ${lerp(y, 610, f) - 40}px) rotate(${r * (1 - f) + Math.sin(g / 12 + i) * 3}deg) scale(${v * (1 - f * 0.6)})`,
            opacity: 1 - f, padding: "18px 22px", width: 250, borderRadius: 8, background: "#FFF6C9", boxShadow: SHADOW, fontSize: 26, fontWeight: 700, color: C.ink }}>{t}</div>; })}
        {NODES.map(([ic, t], i) => { const v = k(g, off("w:into", 0.35 + i * 0.08), 0.45, ARRIVE);
          return v > 0 && <div key={t} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${400 + i * 373 - 130}px, ${610 - 56 + Math.sin(g / 14 + i * 1.4) * 12}px) scale(${v})` }}>
            <Step icon={ic} label={t} w={260} done={clamp((run * 4 - i) * 2.5)} /></div>; })}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- 6 · we connect workflows: their tools round the client's app
const TOOLS = ["makecom", "n8n-logo2", "supabase", "claude", "odoo-1", "postgresql", "typescript", "datadog-1"];
const tileAt = (i: number) => { const a = -Math.PI / 2 + (i / TOOLS.length) * Math.PI * 2 + 0.2; return [960 + Math.cos(a) * 770, 600 + Math.sin(a) * 330]; };
const Connect: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("connect-0.1") || g > T.f("auto+0.7")) return null;
  const out = k(g, "auto-0.4", 0.4, MOVE);
  const words: W[] = [{ t: "We", at: "w:we2" }, { t: "connect", at: "w:connect", accent: true }, { t: "workflows,", at: "w:workflows", under: "w:workflows+0.2" }];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <Line g={g} words={words} x={head(words, 80)} y={80} size={80} weight={800} ls={H.ls} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {TOOLS.map((_, i) => { const [x, y] = tileAt(i); const l = k(g, off("w:workflows", i * 0.05), 0.45, MOVE);
          const ex = lerp(x, 960, 0.62), ey = lerp(y, 600, 0.62);
          return <g key={i}><line x1={x} y1={y} x2={lerp(x, ex, l)} y2={lerp(y, ey, l)} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" strokeDasharray="2 14" />
            {l >= 1 && [0, 1].map((n) => { const p = ((g / 30) * 0.9 + n * 0.5 + i * 0.13) % 1; return <circle key={n} cx={lerp(x, ex, p)} cy={lerp(y, ey, p)} r={8} fill={C.cyanDeep} />; })}</g>; })}
      </svg>
      {TOOLS.map((logo, i) => { const [x, y] = tileAt(i); const v = k(g, off("w:connect", -0.1 + i * 0.05), 0.45, ARRIVE);
        return v > 0 && <div key={logo} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(x, 960, out) - 60}px, ${lerp(y, 600, out) - 60 + Math.sin(g / 18 + i) * 6}px) scale(${v * (1 - out * 0.7)})` }}><Tile logo={logo} /></div>; })}
    </div>
  );
};

// ---------------------------------------------------------------- 7 · automate repetitive processes
const Repeat: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("auto-0.1") || g > T.f("grow+0.6")) return null;
  const out = k(g, "grow-0.28", 0.3, DEPART), fold = k(g, "w:processes+0.25", 0.6, MOVE);
  const words: W[] = [{ t: "Automate", at: "w:automate", mark: "w:automate+0.25" }, { t: "repetitive", at: "w:repetitive" }, { t: "processes.", at: "w:processes" }];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <Line g={g} words={words} x={head(words, 80)} y={80} size={80} weight={800} ls={H.ls} />
      {Array.from({ length: 7 }, (_, i) => {
        const e = k(g, off("w:automate", -0.15 + i * 0.05), 0.4, ARRIVE), tick = k(g, off("w:repetitive", i * 0.11), 0.25, ARRIVE);
        const y = lerp(250 + i * 104, 520, fold), o = i === 0 ? 1 : 1 - fold;
        return e > 0 && <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${1040 + (1 - e) * 200 + Math.sin(g / 20 + i) * 14}px, ${y}px) ${tl(g, i, 8)}`, opacity: e * o }}>
          <div style={{ width: 720, height: 88, borderRadius: 18, background: C.white, boxShadow: SHADOW, display: "flex", alignItems: "center", gap: 18, padding: "0 22px" }}>
            <Ico k={tick > 0.5 ? "bolt" : "sheet"} s={34} c={tick > 0.5 ? C.cyanDeep : C.muted} />
            <div style={{ flex: 1, fontSize: 26, fontWeight: 700 }}>{i === 0 && fold > 0.5 ? "Order to spreadsheet · every order" : `Copy order #${2041 + i} to the spreadsheet`}</div>
            <div style={{ width: 42, height: 42, borderRadius: 99, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${tick})` }}><Ico k="check" s={24} c={C.white} w={3} /></div>
          </div></div>;
      })}
      {fold > 0 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${1220}px, ${640}px) scale(${fold})` }}><Chip s={28} bg={C.navy} c={C.white} icon="loop">Runs automatically</Chip></div>}
    </div>
  );
};

// ---------------------------------------------------------------- 8 · technology that grows with you
const Grow: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("grow-0.1") || g > T.f("stay+0.7")) return null;
  const e = k(g, "grow", 0.6, ARRIVE), out = k(g, "stay-0.32", 0.3, DEPART), pull = k(g, "w:grows", 2.6, MOVE);
  const words: W[] = [{ t: "Technology", at: "w:technology2" }, { t: "that", at: "w:that2" }, { t: "grows", at: "w:grows", accent: true }, { t: "with", at: "w:with2" }, { t: "you.", at: "w:you", under: "w:you+0.2" }];
  const mods: [string, string, number, number, string][] = [["chart", "Dashboard", -560, -40, "w:grows"], ["phone", "Mobile app", 560, -40, "w:grows+0.25"], ["spark", "AI agent", 0, 250, "w:with2"]];
  const team = Math.round(lerp(2, 7, k(g, "w:with2", 0.9, LIN)));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <Line g={g} words={words} x={head(words, 80)} y={80} size={80} weight={800} ls={H.ls} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${lerp(1.02, 0.97, pull)}) ${tl(g, 3, 7)}`, transformOrigin: "960px 560px" }}>
        <div style={{ position: "absolute", left: 960 - 330, top: 400, transform: `scale(${e})`, transformOrigin: "50% 50%" }}>
          <Window w={660} h={280} title="Your business" style={{ transform: `scale(1.15)` }}>
            <div style={{ position: "absolute", left: 30, top: 140, display: "flex", gap: 12 }}>{["Request", "Quote", "Invoice"].map((s, i) => <Step key={s} icon={["lead", "quote", "invoice"][i]} label={s} w={190} h={84} style={{ padding: "0 12px", gap: 10 }} />)}</div>
          </Window></div>
        {mods.map(([ic, t, dx, dy, at]) => { const v = k(g, at, 0.8, ARRIVE);
          return v > 0 && <div key={t} style={{ position: "absolute", left: 0, top: 0, opacity: Math.min(1, v * 2), transform: `translate(${960 + dx * v - 150}px, ${540 + dy * v - 70}px) scale(${v})` }}>
            <Card w={300} h={140} style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 26px" }}><div style={{ width: 64, height: 64, borderRadius: 18, background: C.cyanSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico k={ic} s={36} /></div>
              <b style={{ fontSize: 28 }}>{t}</b></Card>
            <div style={{ position: "absolute", left: dx > 0 ? -60 : dx < 0 ? 300 : 148, top: dy > 0 ? -40 : 66, width: dx === 0 ? 6 : 60, height: dx === 0 ? 40 : 6, background: C.cyan, borderRadius: 6 }} /></div>; })}
        <div style={{ position: "absolute", left: 0, top: 930, width: 1920, display: "flex", justifyContent: "center", gap: 0 }}>
          {Array.from({ length: team }, (_, i) => <Avatar key={i} t={"ALMRSJT"[i]} s={74} bg={[C.card, C.cyanSoft, "#DCE7F5"][i % 3]} style={{ marginLeft: i ? -14 : 0, transform: `scale(${i >= 2 ? k(g, off("w:with2", (i - 2) * 0.18), 0.35, ARRIVE) : 1})` }} />)}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 9 · and we stay involved: K.B in the client's own channel
const Stay: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("stay-0.1") || g > T.f("improve+0.7")) return null;
  const e = k(g, "stay", 0.6, ARRIVE), out = k(g, "improve-0.35", 0.3, DEPART);
  const words: W[] = [{ t: "And", at: "w:and3" }, { t: "we", at: "w:we3" }, { t: "stay", at: "w:stay", accent: true }, { t: "involved.", at: "w:involved", mark: "w:involved+0.25" }];
  const msg = (who: React.ReactNode, name: string, text: React.ReactNode, at: string, mine = false) => { const v = k(g, at, 0.45, ARRIVE);
    return v > 0 && <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginTop: 26, transform: `translateY(${(1 - v) * 30}px)`, opacity: v }}>{who}
      <div><div style={{ fontSize: 22, fontWeight: 800, color: mine ? C.navy : C.muted }}>{name}</div><div style={{ fontSize: 28, fontWeight: 600, marginTop: 4 }}>{text}</div></div></div>; };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <Line g={g} words={words} x={head(words, 88)} y={90} size={88} weight={800} ls={H.ls} />
      <div style={{ position: "absolute", left: 960 - 470, top: 260 + (1 - e) * 120, opacity: e, transform: tl(g, 4, 9) }}>
        <Card w={940} h={600} style={{ padding: "30px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 20, borderBottom: `2px solid ${C.card}` }}>
            <b style={{ fontSize: 32, color: C.navy }}># ops-systems</b>
            <div style={{ marginLeft: "auto", display: "flex" }}>{["A", "L", "M", "R"].map((t, i) => <Avatar key={t} t={t} s={56} style={{ marginLeft: i ? -12 : 0 }} />)}
              <Avatar t="" kb s={56} style={{ marginLeft: -12, transform: `scale(${k(g, "w:stay", 0.4, ARRIVE)})` }} /></div>
          </div>
          {msg(<Avatar t="A" s={60} />, "Anna · Operations", "Could invoices run through the flow too?", "w:we3-0.1")}
          {msg(<Avatar t="" kb s={60} />, "K.B", <>On it. It goes live tomorrow, and we will watch the first runs with you.</>, "w:involved", true)}
          {msg(<Avatar t="" kb s={60} />, "K.B", <span style={{ color: C.cyanDeep }}>Invoices are live ✓</span>, "w:involved+0.8", true)}
        </Card></div>
      {[["Monitoring", "check"], ["Backups", "shield"], ["Uptime monitoring", "chart"], ["Integration updated", "loop"], ["Alert resolved", "check"], ["Deploy", "bolt"]].map(([t, ic], n) => {
        const p = ((g / 30 - T.s("stay")) / 6 + n / 6) % 1; if (g / 30 < T.s("stay")) return null;
        const side = n % 2 ? 1 : -1, x = 960 + side * (560 + (n % 3) * 30), y = lerp(900, 260, p);
        return <div key={t} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - 120}px, ${y}px)`, opacity: Math.sin(Math.PI * p) * e }}><Chip s={24} bg={C.white} icon={ic}>{t}</Chip></div>; })}
    </div>
  );
};

// ---------------------------------------------------------------- 10 · continuously improving: K.B's Diagnose, Build, Run loop
export const RING = { x: 960, y: 620, r: 270 };
const STOPS = [["Diagnose", -90, "search"], ["Build", 30, "bolt"], ["Run", 150, "loop"]] as const;
const CHIPS = [["Monitoring", "w:improving", -560, -110], ["Backups", "w:build2", 300, -120], ["New workflow", "w:needs", 330, 200], ["Integration update", "w:evolve", -470, 200]] as const;
export const ringAngle = (g: number) => -90 + (Math.max(0, g / 30 - T.s("improve")) / 1.6) * 360;
const Improve: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("improve-0.1") || g > T.f("sign+0.7")) return null;
  const e = k(g, "improve", 0.6, ARRIVE), out = k(g, "sign-0.4", 0.35, DEPART);
  const words: W[] = [{ t: "Continuously", at: "w:continuously", accent: true }, { t: "improving", at: "w:improving" }];
  const l2: W[] = [{ t: "as", at: "w:as" }, { t: "your", at: "w:your3" }, { t: "needs", at: "w:needs" }, { t: "evolve.", at: "w:evolve", under: "w:evolve+0.2" }];
  const a = ringAngle(g);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <Line g={g} words={words} x={head(words, 84)} y={70} size={84} weight={800} ls={H.ls} />
      <Line g={g} words={l2} x={centred(l2, 44, 960, 700)} y={180} size={44} weight={700} ls={-0.02} color={C.muted} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: e }}>
        <circle cx={RING.x} cy={RING.y} r={RING.r} fill="none" stroke={C.card} strokeWidth={14} />
        <circle cx={RING.x} cy={RING.y} r={RING.r} fill="none" stroke={C.cyan} strokeWidth={22} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * RING.r * 0.38} ${2 * Math.PI * RING.r}`}
          transform={`rotate(${a - 80} ${RING.x} ${RING.y})`} />
      </svg>
      {STOPS.map(([t, deg, ic], i) => { const r = (deg * Math.PI) / 180, v = k(g, off("improve", i * 0.12), 0.45, ARRIVE);
        const lit = Math.abs(((a - deg) % 360 + 360) % 360) < 40;
        return <div key={t} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${RING.x + Math.cos(r) * RING.r - 110}px, ${RING.y + Math.sin(r) * RING.r - 40}px) scale(${v * (lit ? 1.08 : 1)})` }}>
          <Chip s={30} icon={ic} bg={lit ? C.navy : C.white} c={lit ? C.white : C.navy} style={{ width: 220, justifyContent: "center" }}>{t}</Chip></div>; })}
      <div style={{ position: "absolute", left: RING.x - 150, top: RING.y - 70, width: 300, textAlign: "center", opacity: e }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.muted, marginBottom: 78, marginTop: -60 }}>Your system</div>
        <Selector g={g} items={["v1.0", "v1.1", "v1.2", "v1.3", "v1.4"]} to={4} at="w:continuously" dur={3.0} size={58} weight={800} pill={C.cyan} color={C.navy} />
      </div>
      {CHIPS.map(([t, at, dx, dy]) => { const v = k(g, at, 0.45, ARRIVE);
        return v > 0 && <div key={t} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${RING.x + Math.cos(Math.atan2(dy, dx) + g / 110) * Math.hypot(dx, dy) * 1.25 - 90}px, ${RING.y + Math.sin(Math.atan2(dy, dx) + g / 110) * Math.hypot(dx, dy) * 0.55}px) scale(${v})` }}><Chip s={24} bg={C.cyanSoft} icon="check">{t}</Chip></div>; })}
    </div>
  );
};

// ---------------------------------------------------------------- 11 · K.B. Your technical partner …
export const SIGN = { x: 960, y: 290, size: 230 };
const Sign: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("sign-0.1")) return null;
  const badge = k(g, "w:kb2-0.1", 0.7, ARRIVE);
  const l1: W[] = [{ t: "Your", at: "w:your4" }, { t: "technical", at: "w:technical" }, { t: "partner", at: "w:partner", mark: "w:partner+0.25" }];
  const l2: W[] = [{ t: "for", at: "w:for" }, { t: "building,", at: "w:building", accent: true }, { t: "running", at: "w:running", accent: true }, { t: "and", at: "w:and4" }, { t: "improving", at: "w:improving2", accent: true }];
  const l3: W[] = [{ t: "the", at: "w:the" }, { t: "systems", at: "w:systems2" }, { t: "behind", at: "w:behind", under: "w:behind+0.2" }, { t: "your", at: "w:your5" }, { t: "business.", at: "w:business3" }];
  const btn = k(g, "cta", 0.7, ARRIVE);
  return (
    <>
      {badge > 0 && <div style={{ position: "absolute", left: SIGN.x - SIGN.size / 2, top: SIGN.y - SIGN.size / 2, opacity: badge, transform: `translateY(${(1 - badge) * 30}px)` }}><Logo size={SIGN.size} /></div>}
      <Line g={g} words={l1} x={centred(l1, 72, 960, 800)} y={500} size={72} weight={800} ls={H.ls} />
      <Line g={g} words={l2} x={centred(l2, 52, 960, 700)} y={606} size={52} weight={700} ls={-0.02} />
      <Line g={g} words={l3} x={centred(l3, 52, 960, 700)} y={678} size={52} weight={700} ls={-0.02} color={C.muted} />
      {btn > 0 && <div style={{ position: "absolute", left: 0, top: 830, width: 1920, display: "flex", justifyContent: "center", opacity: btn, transform: `translateY(${(1 - btn) * 24}px)` }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "26px 54px", borderRadius: 999, background: C.navy, color: C.white, fontSize: 36, fontWeight: 800, boxShadow: SHADOW }}>
          Book a free discovery call <Ico k="arrow" s={34} c={C.cyan} w={2.6} />
        </div></div>}
    </>
  );
};

// ---------------------------------------------------------------- the stage
export const Story: React.FC<{ g: number }> = ({ g }) => {
  // the pulse, the data: it runs every system K.B builds, orbits the loop, and the badge grows out of it at the close
  const run0 = rowX(0) + 140, run1 = rowX(4) + 140;
  let [dx, dy, dr] = track(g, [
    ["hook", run0, ROWY + 56, 0], ["w:systems-0.25", run0, ROWY + 56, 0], ["w:systems-0.1", run0, ROWY + 56, 20, ARRIVE], ["w:systems+0.9", run1, ROWY + 56, 20], ["w:with+0.2", 1080, 268, 0, MOVE],
    ["w:from", AX0, AXY + 3, 0], ["w:from+0.3", AX0, AXY + 3, 22, ARRIVE], ["w:to", AX0, AXY + 3, 22], ["w:to+1.2", AX1, AXY + 3, 22, MOVE],
    ["complex-0.1", AX1, AXY + 3, 22], ["w:complex", 330, 600, 22, MOVE], ["w:into", 330, 600, 22], ["w:solutions", 400, 610, 22, MOVE], ["w:solutions+1.0", 1520, 610, 22],
    ["connect-0.05", 1520, 610, 22], ["connect+0.8", 960, 600, 26, MOVE], ["auto-0.05", 960, 600, 26], ["auto+0.7", 960, 560, 0, MOVE],
    ["improve", RING.x, RING.y - RING.r, 0], ["improve+0.4", RING.x, RING.y - RING.r, 22, ARRIVE], ["sign-0.15", RING.x, RING.y - RING.r, 22],
    ["sign+0.2", RING.x, RING.y - RING.r, 0, MOVE], ["end", RING.x, RING.y - RING.r, 0],
  ]);
  if (g >= T.f("improve+0.4") && g < T.f("sign+0.2")) { const a = (ringAngle(g) * Math.PI) / 180; dx = RING.x + Math.cos(a) * RING.r; dy = RING.y + Math.sin(a) * RING.r; }
  const ring = k(g, "w:kb", 0.7, ARRIVE);
  // the badge drops into the jam on "K.B", holds, then rides in the corner like the round button of their nav
  const drop = k(g, "w:kb-0.32", 0.32, (t: number) => t * t), toCorner = k(g, "w:build-0.15", 0.7, MOVE), cornerOut = k(g, "sign-0.2", 0.4, DEPART);
  const settle = Math.sin(Math.PI * k(g, "w:kb", 0.3, LIN)) * 0.06;
  const bx = lerp(960, 92, toCorner), by = lerp(lerp(-240, 540, drop), 74, toCorner), bs = lerp(300, 76, toCorner);
  // fields grow out of the dot, so each colour change is a move
  const cyanF = 2400 * k(g, "axis-0.1", 0.8, MOVE), pageF = 2400 * k(g, "connect-0.1", 0.8, MOVE), cardF = 2400 * k(g, "stay-0.1", 0.8, MOVE), whiteF = 2400 * k(g, "sign-0.15", 0.8, MOVE);
  return (
    <>
      {cyanF > 0 && g < T.f("connect+0.8") && <Iris x={1530} y={620} r={cyanF} bg={C.cyanSoft} />}
      {pageF > 0 && g < T.f("stay+0.8") && <Iris x={1520} y={610} r={pageF} bg={C.page} />}
      {cardF > 0 && g < T.f("sign+0.7") && <Iris x={960} y={960} r={cardF} bg={C.card} />}
      {whiteF > 0 && <Iris x={RING.x} y={RING.y} r={whiteF} bg={C.white} />}
      <Bloom g={g} x={1700} y={140} r={300} color={C.cyan} k={0.8} drift={25} />
      <Bloom g={g + 400} x={180} y={980} r={280} color="#9DB7DA" k={0.7} drift={25} />

      <Hook g={g} />
      {drop > 0 && cornerOut < 1 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 300, transform: `translate(${bx - 150}px, ${by - 150}px) scale(${(bs / 300) * (1 - settle)}, ${(bs / 300) * (1 + settle)})`,
          transformOrigin: "50% 50%", opacity: 1 - cornerOut, willChange: "transform" }}><Logo size={300} /></div>)}
      <System g={g} />
      <Pillars g={g} />
      <Axis g={g} />
      <Ideas g={g} />
      <Connect g={g} />
      <Repeat g={g} />
      <Grow g={g} />
      <Stay g={g} />
      <Improve g={g} />
      <Sign g={g} />
      {ring > 0 && ring < 1 && <div style={{ position: "absolute", left: 960 - 200, top: 540 - 200, width: 400, height: 400, borderRadius: 999, border: `8px solid ${C.cyan}`, transform: `scale(${0.1 + ring * 1.8})`, opacity: 1 - ring }} />}
      {dr > 0.5 && <div style={{ position: "absolute", left: 0, top: 0, width: 2 * dr, height: 2 * dr, borderRadius: 99, background: C.cyan, transform: `translate(${dx - dr}px, ${dy - dr}px)`,
        boxShadow: `0 0 0 ${dr * 0.5}px #38C8FF2E`, willChange: "transform" }} />}
    </>
  );
};
