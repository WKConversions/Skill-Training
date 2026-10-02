import React from "react";
import { Img, staticFile } from "remotion";
import { C, Chip, Eyebrow, MOVE, SHADOW, lerp } from "./lib";
import { Iris, Line, LIN, POP, Roll, T, measure, off } from "./kit";
import { AMark, CITY, EmeaDots, GLYPHS, HOME, Tile, markAt } from "./parts";

// Amargier Advisory · one continuous stage. The thread is their mark: two leaning bars that meet, like two partners.
// It forms on "partnerships", lands on Málaga as a pin, EMEA spreads out from there, its businesses link up and
// become an ecosystem round a client's business, the bars return as "the thinking" and "the doing", Cédric's photo
// opens out of the apex, twelve year-ticks lay the mark brick by brick, and the mark closes the film on its own.

type Key = [string, ...(number | ((t: number) => number))[]];
const track = (g: number, keys: Key[]) => {
  let i = 0;
  while (i < keys.length - 1 && g >= T.f(keys[i + 1][0])) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const fa = T.f(a[0]), fb = T.f(b[0]);
  const ease = (typeof b[b.length - 1] === "function" ? b[b.length - 1] : LIN) as (t: number) => number;
  const t = fb > fa ? ease(Math.min(1, Math.max(0, (g - fa) / (fb - fa)))) : 1;
  const va = a.slice(1).filter((v) => typeof v === "number") as number[], vb = b.slice(1).filter((v) => typeof v === "number") as number[];
  return va.map((v, j) => lerp(v, vb[j], t));
};
const HUB = { x: 1290, y: 560, r: 300 };
const CITIES = ["Madrid", "Paris", "London", "Dublin", "Amsterdam", "Zurich", "Milan", "Berlin", "Warsaw", "Stockholm", "Cairo", "Tel Aviv", "Lagos", "Riyadh", "Dubai", "Nairobi", "Johannesburg"] as const;
const LINKS: [number, number][] = [[-1, 1], [-1, 2], [-1, 12], [1, 7], [2, 4], [4, 7], [6, 11], [7, 8], [8, 9], [10, 11], [11, 14], [13, 14], [12, 15], [15, 16], [-1, 6], [-1, 10]];
const ring = (i: number, n: number, r = HUB.r) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return [HUB.x + Math.cos(a) * r, HUB.y + Math.sin(a) * r]; };
const pt = (i: number) => (i < 0 ? HOME : CITY(CITIES[i]));
const DASH = 1 / 50, GAP = 1 / 40;                                 // the dashed "potential" links, in path lengths

export const Story: React.FC<{ g: number }> = ({ g }) => {
  // ---------------------------------------------------------------- the mark's path: forms, centres for the name, lands on Málaga
  const [mx, my, ms, mo] = track(g, [
    ["hook", 1470, 520, 520, 1], ["brand", 1470, 520, 520, 1], ["brand+0.75", 960, 380, 300, 1, MOVE], ["emea-0.1", 960, 380, 300, 1],
    ["emea+0.6", HOME[0] + 4, HOME[1] - 34, 64, 1, MOVE], ["eco", HOME[0] + 4, HOME[1] - 34, 64, 1], ["eco+0.4", HOME[0] + 4, HOME[1] - 34, 64, 0],
  ]);
  const long = T.k(g, "w:partnerships-0.18", 0.75, MOVE), short = T.k(g, "w:partnerships+0.22", 0.75, MOVE);

  // ---------------------------------------------------------------- bright colour fields, each growing out of the object that leads the next beat
  const warmR = 2300 * T.k(g, "emea-0.05", 0.75, MOVE);
  const mistR = 2300 * T.k(g, "eco-0.08", 0.75, MOVE);
  const whiteR = 2300 * T.k(g, "connect-0.12", 0.7, MOVE);
  const apex = markAt(960, 600, 600);
  const warm2R = 2300 * T.k(g, "exp-0.12", 0.7, MOVE);
  const white2R = 2300 * T.k(g, "cta-0.12", 0.7, MOVE);

  return (
    <>
      {warmR > 0 && g < T.f("eco+0.7") && <Iris x={HOME[0]} y={HOME[1]} r={warmR} bg={C.warm} />}
      {mistR > 0 && g < T.f("connect+0.6") && <Iris x={HUB.x} y={HUB.y} r={mistR} bg={C.mist} />}
      {whiteR > 0 && g < T.f("exp+0.6") && <Iris x={HUB.x} y={HUB.y} r={whiteR} bg={C.white} />}
      {warm2R > 0 && g < T.f("cta+0.6") && <Iris x={apex[0]} y={apex[1]} r={warm2R} bg={C.warm} />}
      {white2R > 0 && <Iris x={1300} y={560} r={white2R} bg={C.white} />}

      {/* 1 · great partnerships start with a clear purpose */}
      <Line g={g} x={140} y={250} size={112} out="brand-0.15" words={[{ t: "Great", at: "w:great" }, { t: "partnerships", at: "w:partnerships" }]} />
      <Line g={g} x={140} y={380} size={112} out="brand-0.1" words={[{ t: "start", at: "w:start" }, { t: "with", at: "w:with" }]} />
      <Line g={g} x={140} y={500} size={124} out="brand-0.05" words={[{ t: "a", at: "w:a", serif: true }, { t: "clear", at: "w:clear", serif: true }, { t: "purpose.", at: "w:purpose", serif: true, under: "w:purpose+0.25" }]} />
      {mo > 0 && <AMark x={mx} y={my} size={ms} long={long} short={short} style={{ opacity: mo }} />}
      {g >= T.f("emea+0.3") && g < T.f("eco+0.5") && (
        <div style={{ position: "absolute", left: HOME[0] - 120, top: HOME[1] + 14, width: 240, textAlign: "center", fontSize: 28, fontWeight: 500, color: C.muted,
          opacity: T.k(g, "emea+0.4", 0.4) * (1 - T.k(g, "eco", 0.3)) }}>Málaga</div>
      )}
      {g >= T.f("emea+0.2") && g < T.f("eco+0.4") && [0, 1].map((i) => {
        const p = ((g - T.f("emea+0.2")) / 45 + i * 0.5) % 1;
        return <div key={i} style={{ position: "absolute", left: HOME[0] - 40, top: HOME[1] - 40, width: 80, height: 80, borderRadius: 99, border: `3px solid ${C.blue}`,
          transform: `scale(${0.3 + p * 1.4})`, opacity: (1 - p) * 0.7 * (1 - T.k(g, "eco", 0.3)) }} />;
      })}

      {/* 2 · at Amargier Advisory */}
      {g >= T.f("brand") && g < T.f("emea+0.4") && (() => {
        const S = 100, W = measure("Amargier", S) + measure("Advisory", S) + 0.26 * S;
        return <>
          <Line g={g} x={960 - W / 2} y={570} size={S} out="emea-0.15" words={[{ t: "Amargier", at: "w:amargier-0.05" }, { t: "Advisory", at: "w:advisory-0.05" }]} />
          <div style={{ position: "absolute", left: 0, top: 720, width: 1920, display: "flex", justifyContent: "center", opacity: T.k(g, "w:advisory+0.25", 0.4) * (1 - T.k(g, "emea-0.15", 0.3)) }}>
            <Eyebrow>Independent advisory. Connected thinking.</Eyebrow></div>
        </>;
      })()}

      <Emea g={g} />
      <Eco g={g} />
      <Connect g={g} />
      <Experience g={g} />
      <Build g={g} />
      <Cta g={g} />
    </>
  );
};

// ---------------------------------------------------------------- 3–4 · technology businesses across EMEA; potential becomes opportunities
const Emea: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("emea-0.1") || g > T.f("connect+0.7")) return null;
  const hubOut = T.k(g, "connect-0.1", 0.5, MOVE);
  const reveal = T.k(g, "w:we-0.1", 1.7, MOVE);
  const clear = T.k(g, "eco-0.05", 0.9, MOVE);
  const linksOut = T.k(g, "eco-0.05", 0.4);
  const gather = T.k(g, "eco", 0.8, MOVE), toRing = T.k(g, "w:isv-0.1", 0.8, MOVE);
  const order = [...CITIES.keys()].sort((a, b) => Math.hypot(...(CITY(CITIES[a]).map((v, j) => v - HOME[j]) as [number, number])) - Math.hypot(...(CITY(CITIES[b]).map((v, j) => v - HOME[j]) as [number, number])));
  const solid = T.k(g, "w:commercial-0.05", 0.45, MOVE);
  return (
    <>
      <EmeaDots reveal={reveal} out={clear} />
      {/* links: dashed potential, then solid with an opportunity on each */}
      {g >= T.f("w:partnership-0.1") && linksOut < 1 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - linksOut }}>
          {LINKS.map(([a, b], i) => {
            const k = T.k(g, off("w:partnership", -0.05 + i * 0.055), 0.5, MOVE);
            const [x1, y1] = pt(a), [x2, y2] = pt(b);
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.22;
            return <path key={i} d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={C.blue} strokeWidth={lerp(2.5, 3.5, solid)} strokeLinecap="round"
              pathLength={1} strokeDasharray={`${lerp(DASH, 1, solid)} ${lerp(GAP, 0, solid)}`} strokeDashoffset={0}
              style={{ clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` }} opacity={k} />;
          })}
          {LINKS.map(([a, b], i) => {
            const k = T.k(g, off("w:commercial", 0.15 + i * 0.045), 0.4, POP);
            if (k <= 0) return null;
            const [x1, y1] = pt(a), [x2, y2] = pt(b);
            const d = Math.hypot(x2 - x1, y2 - y1), x = (x1 + x2) / 2, y = (y1 + y2) / 2 - d * 0.11;
            return <g key={`o${i}`} transform={`translate(${x} ${y}) scale(${k})`}><circle r={13} fill={C.white} stroke={C.blue} strokeWidth={3} /><circle r={5} fill={C.blue} /></g>;
          })}
        </svg>
      )}
      {/* the businesses: tiles on their cities, a wave out from Málaga; at "ecosystems" they become the ring round a client */}
      {order.map((ci, n) => {
        const k = T.k(g, off("w:technology", -0.05 + n * 0.045), 0.45, POP);
        if (k <= 0) return null;
        const [cx, cy] = CITY(CITIES[ci]);
        const idx = order.indexOf(ci) % 12;
        const loose = [HUB.x + Math.cos(ci * 2.4) * (340 + (ci % 3) * 60), HUB.y + Math.sin(ci * 2.4) * (300 + (ci % 3) * 50)];
        const [rx, ry] = ring(idx, 12);
        const keep = n < 12 ? 1 : 1 - gather;
        const x0 = lerp(lerp(cx, loose[0], gather), rx, toRing), y0 = lerp(lerp(cy, loose[1], gather), ry, toRing);
        const sh = lerp(1, 0.2, hubOut), x = HUB.x + (x0 - HUB.x) * sh, y = HUB.y + (y0 - HUB.y) * sh;
        return <Tile key={ci} x={x} y={y} s={k * keep * lerp(1, 1.25, toRing) * sh} kind={GLYPHS[ci % 4]} style={{ opacity: keep * (1 - hubOut) }} />;
      })}
      {/* the words */}
      <Line g={g} x={146} y={300} size={44} weight={500} color={C.muted} ls={-0.02} out="opp-0.15" words={[{ t: "We", at: "w:we" }, { t: "help", at: "w:help" }]} />
      <Line g={g} x={140} y={380} size={86} out="opp-0.12" words={[{ t: "Technology", at: "w:technology-0.05" }, { t: "businesses", at: "w:businesses-0.05" }]} />
      <Line g={g} x={140} y={490} size={92} out="opp-0.08" words={[{ t: "across", at: "w:across", serif: true }, { t: "EMEA.", at: "w:emea", under: "w:emea+0.3" }]} />
      {g >= T.f("opp-0.1") && (
        <>
          <Roll g={g} at="w:into" dur={0.45} h={120} style={{ position: "absolute", left: 140, top: 370, width: 1000, opacity: 1 - T.k(g, "eco-0.15", 0.3) }}
            a={<Line g={g} x={0} y={10} size={88} words={[{ t: "Partnership", at: "w:partnership-0.05" }, { t: "potential", at: "w:potential-0.05", serif: true }]} />}
            b={<Line g={g} x={0} y={10} size={88} words={[{ t: "Commercial", at: "w:into+0.1" }]} />} />
          <Line g={g} x={140} y={500} size={92} out="eco-0.12" words={[{ t: "opportunities.", at: "w:opportunities-0.05", serif: true, under: "w:opportunities+0.35" }]} />
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 5 · from go-to-market strategy and ISV ecosystems to partner recruitment, co-selling and hands-on leadership
const ITEMS = [["Go-to-market strategy", "w:go"], ["ISV ecosystems", "w:isv"], ["Partner recruitment", "w:partner"], ["Co-selling", "w:co"], ["Hands-on leadership", "w:hands"]] as const;
const PARTNERS = [[-25, "Partner"], [35, "Partner"], [155, "Partner"]] as const;
const Eco: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("eco-0.1") || g > T.f("connect+0.7")) return null;
  const out = T.k(g, "connect-0.1", 0.5, MOVE);
  const core = T.k(g, "eco+0.1", 0.5, POP);
  const ringK = T.k(g, "w:isv-0.1", 0.8, MOVE);
  const strat = T.k(g, "w:strategy-0.1", 0.5, MOVE);
  const co = T.k(g, "w:co-0.05", 0.6, MOVE);
  const lead = T.k(g, "w:hands-0.05", 0.6, MOVE);
  const active = ITEMS.reduce((a, [, at], i) => (g >= T.f(off(at, -0.05)) ? i : a), -1);
  const scale = lerp(1, 0.2, out);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `scale(${scale})`, transformOrigin: `${HUB.x}px ${HUB.y}px` }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="none" stroke={C.sky} strokeWidth={3} pathLength={1} strokeDasharray={`${ringK} 1`} transform={`rotate(-90 ${HUB.x} ${HUB.y})`} />
          <circle cx={HUB.x} cy={HUB.y} r={430} fill="none" stroke={C.sky} strokeWidth={2} strokeDasharray="6 10" opacity={T.k(g, "w:partner-0.1", 0.5)} />
          {/* strategy: a route from the business out to the market */}
          <path d={`M${HUB.x},${HUB.y - 120} L${HUB.x},${HUB.y - 390}`} stroke={C.blue} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={`${strat} 1`} />
          {Array.from({ length: 12 }, (_, i) => { const [x, y] = ring(i, 12); const k = Math.min(1, Math.max(0, ringK * 1.4 - i * 0.03));
            return <line key={i} x1={HUB.x} y1={HUB.y} x2={lerp(HUB.x, x, k)} y2={lerp(HUB.y, y, k)} stroke={C.sky} strokeWidth={2} />; })}
          {/* partners recruited on the outer ring, each linked in */}
          {PARTNERS.map(([a], i) => {
            const k = T.k(g, off("w:recruitment", -0.2 + i * 0.12), 0.5, MOVE);
            const r = (a * Math.PI) / 180, x = HUB.x + Math.cos(r) * 430, y = HUB.y + Math.sin(r) * 430;
            const [nx, ny] = [HUB.x + Math.cos(r) * HUB.r, HUB.y + Math.sin(r) * HUB.r];
            return <line key={i} x1={nx} y1={ny} x2={lerp(nx, x, k)} y2={lerp(ny, y, k)} stroke={C.blue} strokeWidth={3} opacity={k} />;
          })}
          {/* co-selling: the business and a partner, side by side into one opportunity */}
          {co > 0 && <>
            <path d={`M${HUB.x + 120},${HUB.y} C${HUB.x + 300},${HUB.y + 10} ${HUB.x + 380},${HUB.y + 60} ${HUB.x + 470},${HUB.y + 120}`} fill="none" stroke={C.blue} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={`${co} 1`} />
            <path d={`M${HUB.x + Math.cos(0.61) * 430},${HUB.y + Math.sin(0.61) * 430} C${HUB.x + 420},${HUB.y + 260} ${HUB.x + 450},${HUB.y + 180} ${HUB.x + 470},${HUB.y + 120}`} fill="none" stroke={C.blue} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={`${co} 1`} />
          </>}
        </svg>
        {strat > 0 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${HUB.x - 150}px, ${HUB.y - 470}px) scale(${lerp(0.7, 1, strat)})`, opacity: strat, width: 300, display: "flex", justifyContent: "center" }}>
          <Chip size={30} on={1}>Go-to-market</Chip></div>}
        {PARTNERS.map(([a, t], i) => {
          const k = T.k(g, off("w:recruitment", -0.2 + i * 0.12), 0.55, POP);
          if (k <= 0) return null;
          const r = (a * Math.PI) / 180, x = HUB.x + Math.cos(r) * 430, y = HUB.y + Math.sin(r) * 430;
          const fx = HUB.x + Math.cos(r) * 900, fy = HUB.y + Math.sin(r) * 700;
          return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(fx, x, Math.min(1, k)) - 34}px, ${lerp(fy, y, Math.min(1, k)) - 34}px)`, willChange: "transform",
            width: 68, height: 68, borderRadius: 99, background: C.white, border: `3px solid ${C.blue}`, boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth={2.2} strokeLinecap="round"><circle cx={12} cy={8} r={3.5} /><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" /></svg>
            <span style={{ position: "absolute", right: -10, top: -10, width: 30, height: 30, borderRadius: 99, background: C.blue, color: "#fff", fontSize: 24, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>+</span>
            <span style={{ display: "none" }}>{t}</span>
          </div>;
        })}
        {co > 0 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${HUB.x + 400}px, ${HUB.y + 90}px) scale(${T.k(g, "w:selling", 0.45, POP)})` }}><Chip size={30} on={1}>Co-sell</Chip></div>}
        {/* the client's business at the centre; on "hands-on leadership" Cédric is in the middle of it */}
        <div style={{ position: "absolute", left: HUB.x - 120, top: HUB.y - 120, width: 240, height: 240, borderRadius: 999, background: C.navy, transform: `scale(${core})`, boxShadow: SHADOW,
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32, fontWeight: 500, textAlign: "center", lineHeight: 1.15, overflow: "hidden", border: `${lerp(0, 8, lead)}px solid #fff` }}>
          <span style={{ opacity: 1 - lead }}>Your<br />business</span>
          {lead > 0 && <Img src={staticFile("img/cedric.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "52% 22%", opacity: lead, transform: `scale(${lerp(1.25, 1.1, lead)})` }} />}
        </div>
      </div>
      {/* the caption: each service as it is named */}
      <div style={{ position: "absolute", left: 140, top: 236, opacity: T.k(g, "eco+0.15", 0.4) * (1 - out) }}><Eyebrow>What we do</Eyebrow></div>
      {ITEMS.map(([t, at], i) => {
        const k = T.k(g, off(at, -0.08), 0.45);
        if (k <= 0) return null;
        const done = i < active, cur = i === active;
        return (
          <div key={t} style={{ position: "absolute", left: 140, top: 300 + i * 100, display: "flex", alignItems: "center", gap: 22, fontSize: 48, fontWeight: 500, letterSpacing: "-0.03em",
            color: cur ? C.navy : C.muted, opacity: Math.min(1, k * 1.6) * (1 - out), transform: `translateX(${(1 - k) * -30}px)`, filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined }}>
            <span style={{ width: 38, height: 38, borderRadius: 99, border: `3px solid ${cur || done ? C.blue : C.line}`, background: done ? C.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {done && <svg width={22} height={22} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
              {cur && <span style={{ width: 14, height: 14, borderRadius: 99, background: C.blue }} />}
            </span>
            {t}
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- 6 · we connect the thinking with the doing: the mark's two bars, named
const Connect: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("connect-0.1") || g > T.f("exp+0.7")) return null;
  const think = T.k(g, "w:thinking-0.15", 0.65, MOVE), doing = T.k(g, "w:doing-0.15", 0.65, MOVE);
  const spark = T.k(g, "w:doing+0.35", 0.7);
  const leave = T.k(g, "exp-0.12", 0.55, MOVE);
  const [ax, ay] = markAt(960, 600, 600);
  const S = 72, W = measure("We", S) + measure("connect", S) + 0.26 * S;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave, transform: `scale(${lerp(1, 0.3, leave)})`, transformOrigin: `${ax}px ${ay}px` }}>
      <Line g={g} x={960 - W / 2} y={120} size={S} words={[{ t: "We", at: "w:we2" }, { t: "connect", at: "w:connect" }]} />
      <AMark x={960} y={600} size={600} short={think} long={doing} />
      <Line g={g} x={250} y={700} size={76} words={[{ t: "the", at: "w:the", serif: true, color: C.blue }, { t: "thinking", at: "w:thinking-0.05", serif: true, color: C.blue }]} />
      <Line g={g} x={1270} y={520} size={76} words={[{ t: "the", at: "w:the2" }, { t: "doing.", at: "w:doing-0.05" }]} />
      {spark > 0 && spark < 1 && <div style={{ position: "absolute", left: ax - 60, top: ay - 60, width: 120, height: 120, borderRadius: 99, border: `4px solid ${C.blue}`, transform: `scale(${0.2 + spark * 1.3})`, opacity: 1 - spark }} />}
    </div>
  );
};

// ---------------------------------------------------------------- 7 · backed by over twelve years of experience: Cédric
const Digit: React.FC<{ v: number; size: number }> = ({ v, size }) => (
  <div style={{ width: size * 0.6, height: size, overflow: "hidden", position: "relative", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)" }}>
    <div style={{ position: "absolute", left: 0, top: -v * size }}>{Array.from({ length: 21 }, (_, i) => <div key={i} style={{ height: size, lineHeight: `${size}px`, textAlign: "center" }}>{i % 10}</div>)}</div>
  </div>
);
const TICKS = 12;
const tickAt = (i: number) => [150 + i * 50, 760];
const Experience: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("exp-0.15") || g > T.f("cta+0.4")) return null;
  const [ax, ay] = markAt(960, 600, 600);
  const open = T.k(g, "w:backed-0.12", 0.75, MOVE);
  const leave = T.k(g, "build-0.12", 0.5, MOVE);
  const textOut = T.k(g, "build-0.15", 0.35);
  const count = T.k(g, "w:twelve-0.1", 0.8, MOVE);
  const S = 280;
  return (
    <>
      {/* the photo opens out of the mark's apex */}
      <div style={{ position: "absolute", left: 1040, top: 170, width: 640, height: 660, borderRadius: 28, overflow: "hidden", boxShadow: SHADOW,
        clipPath: `circle(${open * 1100}px at ${ax - 1040}px ${ay - 170}px)`, transform: `translateX(${leave * 900}px)`, opacity: 1 - leave * 0.5, willChange: "transform" }}>
        <Img src={staticFile("img/cedric.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", transform: `scale(${lerp(1.12, 1.02, T.k(g, "exp", 2.6, LIN))})` }} />
      </div>
      <div style={{ position: "absolute", left: 1040, top: 860, width: 640, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: T.k(g, "w:backed+0.3", 0.4) * (1 - leave),
        transform: `translateX(${leave * 900}px)` }}>
        <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em" }}>Cédric Amargier</span>
        <span style={{ fontSize: 30, fontWeight: 500, color: C.muted }}>Founder · Málaga, Spain</span>
      </div>
      <div style={{ opacity: 1 - textOut }}>
        <Line g={g} x={146} y={190} size={44} weight={500} color={C.muted} ls={-0.02} words={[{ t: "Backed", at: "w:backed" }, { t: "by", at: "w:by" }, { t: "over", at: "w:over" }]} />
        <div style={{ position: "absolute", left: 130, top: 250, display: "flex", fontSize: S, fontWeight: 500, lineHeight: 1, letterSpacing: "-0.05em", opacity: T.k(g, "w:twelve-0.15", 0.3) }}>
          <Digit v={count} size={S} /><Digit v={count * 2} size={S} /><span style={{ opacity: T.k(g, "w:years-0.1", 0.3), color: C.blue }}>+</span>
        </div>
        <Line g={g} x={146} y={560} size={70} words={[{ t: "years", at: "w:years" }, { t: "of", at: "w:of" }, { t: "experience.", at: "w:experience", serif: true, under: "w:experience+0.3" }]} />
      </div>
      {/* a tick per year, drawn as the number counts */}
      {Array.from({ length: TICKS }, (_, i) => {
        const k = T.k(g, off("w:twelve", -0.1 + i * 0.05), 0.3);
        const fly = T.k(g, off("w:build", -0.15 + i * 0.04), 0.5, MOVE);
        if (k <= 0 || fly >= 1) return null;
        const [x, y] = tickAt(i);
        const [tx, ty] = [1300 + (i - 6) * 20, 760];
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 8, height: 44, borderRadius: 4, background: i === TICKS - 1 ? C.blue : C.navy,
          transform: `translate(${lerp(x, tx, fly)}px, ${lerp(y, ty, fly) - (1 - k) * 20}px) scale(${1 - fly * 0.6})`, opacity: Math.min(1, k * 2) * (1 - fly), willChange: "transform" }} />;
      })}
    </>
  );
};

// ---------------------------------------------------------------- 8 · we help you build what comes next: the twelve ticks lay the mark
const Build: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("build-0.15")) return null;
  const bricks = T.k(g, "w:build-0.05", 1.3, LIN);
  const [x, y, s] = track(g, [["build", 1300, 560, 560], ["cta-0.1", 1300, 560, 560], ["cta+0.65", 960, 330, 230, MOVE], ["end", 960, 330, 236]]);
  const out = T.k(g, "cta-0.15", 0.35);
  return (
    <>
      {/* laid brick by brick, then resolved into their solid mark for the close */}
      <AMark x={x} y={y} size={s} bricks={bricks} n={6} style={{ opacity: 1 - T.k(g, "cta+0.35", 0.4) }} />
      {g >= T.f("cta+0.35") && <AMark x={x} y={y} size={s} style={{ opacity: T.k(g, "cta+0.35", 0.4) }} />}
      <div style={{ opacity: 1 - out }}>
        <Line g={g} x={146} y={290} size={44} weight={500} color={C.muted} ls={-0.02} words={[{ t: "We", at: "w:we3" }, { t: "help", at: "w:help2" }, { t: "you", at: "w:you" }]} />
        <Line g={g} x={140} y={370} size={116} words={[{ t: "Build", at: "w:build" }, { t: "what", at: "w:what" }]} />
        <Line g={g} x={140} y={500} size={124} words={[{ t: "comes", at: "w:comes", serif: true }, { t: "next.", at: "w:next", serif: true, under: "w:next+0.3" }]} />
      </div>
    </>
  );
};

// ---------------------------------------------------------------- 9 · let's talk about your next move (the mark on its own above)
const Cta: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("cta")) return null;
  const S = 96;
  const words = [{ t: "Let’s", at: "w:let's" }, { t: "talk", at: "w:talk" }, { t: "about", at: "w:about" }, { t: "your", at: "w:growth", serif: true }, { t: "next", at: "w:growth+0.12", serif: true },
    { t: "move.", at: "w:growth+0.24", serif: true, under: "w:growth+0.6" }];
  const W = words.reduce((a, w) => a + measure(w.t, S, w.serif ? 400 : 500, w.serif ? -0.02 : -0.045, !!w.serif), 0) + 0.26 * S * (words.length - 1);
  const btn = T.k(g, "w:growth+0.5", 0.5);
  const foot = T.k(g, "w:growth+0.9", 0.5);
  return (
    <>
      <Line g={g} x={960 - W / 2} y={540} size={S} words={words} />
      <div style={{ position: "absolute", left: 0, top: 730, width: 1920, display: "flex", justifyContent: "center", opacity: btn, transform: `translateY(${(1 - btn) * 24}px)` }}>
        <div style={{ background: C.navy, color: "#fff", fontSize: 38, fontWeight: 500, padding: "24px 48px", borderRadius: 12, boxShadow: SHADOW }}>Let’s talk</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 920, width: 1920, textAlign: "center", fontSize: 30, fontWeight: 500, color: C.muted, opacity: foot }}>Amargier Advisory · Málaga, Spain · Across EMEA</div>
    </>
  );
};
