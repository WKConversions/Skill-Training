import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ARRIVE, C, Check, DEPART, Eyebrow, GOLD, Headline, LINEAR, MOVE, POP, Photo, Pill, SANS, SERIF, lerp, tw, useFonts } from "./lib";

// Top Jobs Abroad · 45 s. The script, timed at about 2.7 words per second (frames at 30 fps):
// 1 Hook        0–100     "This could be your next top move."
// 2 Problem     100–440   "Finding a job abroad can be difficult." + the four questions
// 3 Solution    440–530   "That's where Top Jobs Abroad comes in."
// 4 Showcase    530–1130  opportunities · interviews · questions · support → start to end → documents and
//                         relocation → "made recruitment comfortable"
// 5 Outro       1130–1350 "And the best part? It's completely free." → the logo

const CITIES = [
  { id: "madrid", name: "Madrid", country: "Spain", flag: "es" },
  { id: "lisbon", name: "Lisbon", country: "Portugal", flag: "pt" },
  { id: "athens", name: "Athens", country: "Greece", flag: "gr" },
  { id: "barcelona", name: "Barcelona", country: "Spain", flag: "es" },
  { id: "stockholm", name: "Stockholm", country: "Sweden", flag: "se" },
  { id: "porto", name: "Porto", country: "Portugal", flag: "pt" },
  { id: "sliema", name: "Sliema", country: "Malta", flag: "mt" },
  { id: "benalmadena", name: "Benalmádena", country: "Spain", flag: "es" },
];
// scattered (problem) and ordered (solution) positions: center x, y, rotation
const SCATTER: [number, number, number][] = [[1180, 300, -8], [1560, 250, 7], [1780, 620, -5], [1320, 700, 9], [1030, 820, -12], [1620, 900, 6], [1450, 480, -3], [960, 520, 11]];
const GRID = (i: number): [number, number] => [960 + ((i % 4) - 1.5) * 300, 360 + Math.floor(i / 4) * 240];
const CW = 270, CH = 340;

const CityCard: React.FC<{ c: (typeof CITIES)[number]; x: number; y: number; w: number; h: number; rot: number; o: number; label?: number }> = ({ c, x, y, w, h, rot, o, label = 1 }) =>
  o <= 0 ? null : (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, rotate: `${rot}deg`, opacity: o, borderRadius: 18, overflow: "hidden",
      boxShadow: "0 40px 80px -40px rgba(0,0,0,.8)" }}>
      <Photo src={c.id} style={{ inset: 0 }} />
      <div style={{ position: "absolute", left: 20, bottom: 18, right: 16, opacity: label }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Img src={staticFile(`img/flag-${c.flag}.png`)} style={{ width: 26, height: 19, borderRadius: 3 }} />
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 17, letterSpacing: "0.18em", color: C.goldHi, textTransform: "uppercase" }}>{c.country}</span>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: Math.max(26, w * 0.13), color: C.white, marginTop: 6 }}>{c.name}</div>
      </div>
    </div>
  );

const JOBS = [
  { title: "Danish Speaking Customer Support", city: "Athens", country: "Greece", flag: "gr", code: "DK", photo: "athens", pills: ["Customer Service", "Danish"] },
  { title: "Dutch Customer Support", city: "Sliema", country: "Malta", flag: "mt", code: "NL", photo: "sliema", pills: ["Customer Service", "Dutch"] },
  { title: "Czech Speaking Sales Representative", city: "Madrid", country: "Spain", flag: "es", code: "CZ", photo: "madrid", pills: ["Sales", "Czech"] },
];
const JobCard: React.FC<{ j: (typeof JOBS)[number]; x: number; y: number; s: number; o: number; matched?: number }> = ({ j, x, y, s, o, matched = 0 }) =>
  o <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y + Math.sin((useCurrentFrame() + x) / 22) * 7, width: 440, transformOrigin: "0 0", scale: String(s), opacity: o, borderRadius: 20, overflow: "hidden", background: C.white,
      boxShadow: `0 40px 80px -40px rgba(0,17,53,.45), 0 0 0 ${4 * matched}px ${C.gold}` }}>
      <div style={{ position: "relative", height: 180 }}>
        <Photo src={j.photo} style={{ inset: 0 }} />
        <span style={{ position: "absolute", right: 16, top: 14, fontFamily: SANS, fontWeight: 600, fontSize: 18, color: C.white, background: "rgba(255,255,255,.18)", borderRadius: 999, padding: "5px 12px" }}>Full Time</span>
        <span style={{ position: "absolute", left: 18, bottom: 16, width: 48, height: 48, borderRadius: 24, background: C.navy, color: C.goldHi, fontFamily: SANS, fontWeight: 800, fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,.25)" }}>{j.code}</span>
        {matched > 0 && <span style={{ position: "absolute", right: 16, bottom: 14, fontFamily: SANS, fontWeight: 800, fontSize: 20, color: C.navy, background: GOLD, borderRadius: 999, padding: "7px 14px", scale: String(matched) }}>Matched to you</span>}
      </div>
      <div style={{ padding: "20px 22px 22px", display: "grid", gap: 12 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: C.ink, lineHeight: 1.2 }}>{j.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontSize: 23, color: C.muted }}>
          <Img src={staticFile(`img/flag-${j.flag}.png`)} style={{ width: 28, height: 21, borderRadius: 3 }} /><span style={{ color: C.ink, fontWeight: 600 }}>{j.city}</span> · {j.country}
        </div>
        <div style={{ display: "flex", gap: 10 }}><Pill>{j.pills[0]}</Pill><Pill kind="gold">{j.pills[1]}</Pill></div>
      </div>
    </div>
  );

const Panel: React.FC<{ x: number; y: number; w: number; k: number; children: React.ReactNode; dark?: boolean }> = ({ x, y, w, k, children, dark }) =>
  k <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y + Math.sin((useCurrentFrame() + x + y) / 24) * 7, width: w, borderRadius: 22, background: dark ? C.navy2 : C.white, border: `1.5px solid ${dark ? "rgba(255,255,255,.08)" : C.line}`,
      boxShadow: "0 40px 90px -45px rgba(0,17,53,.5)", padding: "28px 32px", boxSizing: "border-box", opacity: Math.min(1, k * 1.4), translate: `0px ${(1 - k) * 44}px`, scale: String(0.96 + 0.04 * k) }}>
      {children}
    </div>
  );

const STEPS = ["Share Your Story", "Meet Your Recruiter", "Access Hidden Roles", "Prepare to Impress", "Negotiate with Confidence", "Settle In"];
const StepIcon: React.FC<{ i: number; on: number }> = ({ i, on }) => {
  const col = on > 0.5 ? C.navy : C.gold;
  const d = [
    "M5 6h14v9H9l-4 3z", "M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 20c1-3.5 4-5 7-5s6 1.5 7 5", "M8 14a4 4 0 1 1 3-6.5l8 8-2 2-1.5-1.5-1.5 1.5-1.5-1.5",
    "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z", "M7 3h7l4 4v14H7zM10 12h6M10 16h6", "M4 11l8-7 8 7v9h-5v-6h-6v6H4z",
  ][i];
  return (
    <div style={{ width: 70, height: 70, borderRadius: 16, background: on > 0.5 ? GOLD : "rgba(200,168,75,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={36} height={36} viewBox="0 0 24 24"><path d={d} fill="none" stroke={col} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" /></svg>
    </div>
  );
};

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  const ready = useFonts();
  if (!ready) return null;

  // ---------- backgrounds ----------
  const light = tw(g, 526, 546, 0, 1, MOVE) * (1 - tw(g, 786, 806, 0, 1, MOVE));

  // the hero photo: full frame at the start, then it becomes the Madrid card; it grows back at the end
  const shrink = tw(g, 96, 128, 0, 1, MOVE);
  const grow = tw(g, 1222, 1256, 0, 1, MOVE);
  const bx = lerp(lerp(960, SCATTER[0][0], shrink), 960, grow), by = lerp(lerp(540, SCATTER[0][1], shrink), 540, grow);
  const bw = lerp(lerp(1920, CW, shrink), 1920, grow), bh = lerp(lerp(1080, CH, shrink), 1080, grow);
  const heroOn = g < 128 || g >= 1222;

  // ---------- the cities: scattered (problem) → ordered (solution) ----------
  const order = tw(g, 446, 480, 0, 1, MOVE);
  const citiesOut = tw(g, 520, 536, 0, 1, DEPART);
  const drift = (i: number) => [Math.sin(g / 31 + i) * 10, Math.cos(g / 27 + i * 2) * 8];

  // ---------- 4 showcase ----------
  const item = g < 606 ? 0 : g < 644 ? 1 : g < 682 ? 2 : 3;
  const helpOn = tw(g, 540, 556, 0, 1, ARRIVE) * (1 - tw(g, 786, 796, 0, 1, DEPART));
  const HELP = ["Find international opportunities", "Prepare for interviews", "Answer your questions", "Support the whole process"];
  const HELP_AT = [540, 606, 644, 682];

  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <AbsoluteFill style={{ background: C.page, opacity: light }} />

      {/* the cities of the problem and solution */}
      {g >= 96 && g < 540 && CITIES.map((c, i) => {
        if (i === 0 && g < 128) return null;
        const inK = i === 0 ? 1 : tw(g, 104 + i * 4, 130 + i * 4, 0, 1, ARRIVE);
        const [dx, dy] = drift(i);
        const [sxp, syp, rot] = SCATTER[i];
        const [gx, gy] = GRID(i);
        const x = lerp(sxp + dx + (1 - inK) * 400, gx, order), y = lerp(syp + dy, gy, order);
        const w = lerp(CW, 270, order), h = lerp(CH, 210, order);
        const dim = lerp(1, 0.16, tw(g, 458, 480, 0, 1, LINEAR));
        return <CityCard key={c.id} c={c} x={x} y={y} w={w} h={h} rot={lerp(rot, 0, order)} o={inK * dim * (1 - citiesOut)} />;
      })}
      {/* question marks on the scattered cards */}
      {[1, 3, 5, 6].map((i, k) => {
        const on = tw(g, 196 + k * 50, 210 + k * 50, 0, 1, POP) * (1 - tw(g, 440, 450, 0, 1, LINEAR));
        if (on <= 0) return null;
        const [dx, dy] = drift(i);
        return <div key={i} style={{ position: "absolute", left: SCATTER[i][0] + dx + 90, top: SCATTER[i][1] + dy - 190, width: 64, height: 64, borderRadius: 32, background: GOLD,
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 44, color: C.navy, scale: String(on) }}>?</div>;
      })}

      {/* the hero photo */}
      {heroOn && (
        <div style={{ position: "absolute", left: bx - bw / 2, top: by - bh / 2, width: bw, height: bh, borderRadius: 18 * Math.max(shrink, 1 - grow), overflow: "hidden", rotate: `${SCATTER[0][2] * shrink * (1 - grow)}deg` }}>
          <div style={{ position: "absolute", inset: 0, scale: String(1.08 - 0.06 * tw(g, 0, 100, 0, 1, LINEAR) + 0.05 * tw(g, 1240, 1350, 0, 1, LINEAR)) }}>
            <Photo src="madrid" style={{ inset: 0 }} shade={1.1} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,17,53,.35)" }} />
        </div>
      )}

      {/* 1 hook */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, display: "flex", justifyContent: "center", opacity: tw(g, 4, 14, 0, 1, LINEAR) * (1 - tw(g, 88, 96, 0, 1, LINEAR)) }}>
        <Eyebrow>Recruitment across Europe</Eyebrow>
      </div>
      <Headline g={g} at={10} out={92} x={960} y={420} size={110} align="center" lines={[[{ w: "This" }, { w: "could" }, { w: "be" }, { w: "your" }], [{ w: "next", gold: true }, { w: "top", gold: true }, { w: "move.", gold: true }]]} />

      {/* 2 problem */}
      <Headline g={g} at={108} out={182} x={140} y={360} size={84} lines={[[{ w: "Finding" }, { w: "a" }, { w: "job" }, { w: "abroad" }], [{ w: "can", gold: true }, { w: "be", gold: true }, { w: "difficult.", gold: true }]]} />
      {["Where to start?", "Where to look?", "Who to contact?", "How it all works?"].map((q, i) => {
        const at = [190, 262, 304, 346][i];
        const k = tw(g, at, at + 12, 0, 1, ARRIVE);
        const next = [262, 304, 346, 9999][i];
        const dim = tw(g, next, next + 8, 1, 0.3, LINEAR);
        const out = tw(g, 432, 442, 0, 1, DEPART);
        if (k <= 0 || out >= 1) return null;
        return <div key={q} style={{ position: "absolute", left: 140, top: 250 + i * 120, fontFamily: SERIF, fontWeight: 600, fontSize: 84, lineHeight: 1, color: i === 3 ? C.goldHi : C.white,
          whiteSpace: "nowrap", opacity: k * dim * (1 - out), translate: `${(1 - k) * -40}px ${-out * 20}px`, filter: `blur(${(1 - k) * 6}px)` }}>{q}</div>;
      })}

      {/* 3 solution: the logo over the ordered destinations */}
      {g >= 454 && g < 540 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "grid", justifyItems: "center", gap: 26, opacity: tw(g, 454, 464, 0, 1, LINEAR) * (1 - citiesOut), scale: String(tw(g, 454, 486, 0.92, 1, ARRIVE)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 64, color: C.white }}>That’s where</div>
          <Img src={staticFile("img/logo-white.png")} style={{ width: 760 }} />
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 64, color: C.goldHi, opacity: tw(g, 492, 502, 0, 1, LINEAR) }}>comes in.</div>
        </div>
      )}

      {/* 4a what they do: the list on the left, the proof on the right */}
      {helpOn > 0 && (
        <div style={{ position: "absolute", left: 140, top: 225, width: 640, opacity: helpOn }}>
          <Eyebrow style={{ marginBottom: 30 }}>How we help</Eyebrow>
          {HELP.map((h, i) => {
            const on = tw(g, HELP_AT[i], HELP_AT[i] + 12, 0, 1, ARRIVE);
            const cur = item === i;
            return (
              <div key={h} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 34, opacity: 0.25 + 0.75 * on * (cur ? 1 : 0.55), translate: `${(1 - on) * -30}px 0px` }}>
                {on > 0.05 ? <Check k={Math.min(1, on * 1.2)} size={46} /> : <span style={{ width: 46, height: 46, borderRadius: 23, border: `3px solid ${C.faint}` }} />}
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 54, lineHeight: 1.05, color: C.ink }}>{h}</div>
              </div>
            );
          })}
        </div>
      )}
      {/* a · opportunities: three of their real open roles; one is matched */}
      {JOBS.map((j, i) => {
        const k = tw(g, 546 + i * 6, 570 + i * 6, 0, 1, ARRIVE) * (1 - tw(g, 604, 616, 0, 1, DEPART) * (i === 1 ? 0 : 1));
        const matched = i === 1 ? tw(g, 584, 596, 0, 1, POP) : 0;
        const toSide = i === 1 ? tw(g, 604, 628, 0, 1, MOVE) : 0;
        const out = i === 1 ? tw(g, 780, 792, 0, 1, DEPART) : 0;
        const x = lerp(900 + i * 330, 900, toSide), y = lerp(300 + (i === 1 ? -30 : 20), 230, toSide);
        return <JobCard key={j.code} j={j} x={x} y={y} s={lerp(0.72, 0.8, toSide)} o={k * (1 - out)} matched={matched} />;
      })}
      {/* b · interviews: their briefing, in their words */}
      <Panel x={1300} y={230} w={520} k={tw(g, 612, 632, 0, 1, ARRIVE) * (1 - tw(g, 780, 792, 0, 1, DEPART))}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.ink, marginBottom: 18 }}>Interview briefing</div>
        {["The company culture", "The hiring manager", "What sets strong candidates apart"].map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, fontFamily: SANS, fontSize: 26, color: C.ink, opacity: tw(g, 620 + i * 6, 628 + i * 6, 0, 1, LINEAR) }}>
            <Check k={tw(g, 620 + i * 6, 632 + i * 6, 0, 1, POP)} size={30} />{t}
          </div>
        ))}
      </Panel>
      {/* c · questions: a real one from their FAQ */}
      {(() => {
        const k = tw(g, 648, 664, 0, 1, ARRIVE) * (1 - tw(g, 780, 792, 0, 1, DEPART));
        const r = tw(g, 664, 680, 0, 1, ARRIVE) * (1 - tw(g, 780, 792, 0, 1, DEPART));
        return (
          <>
            {k > 0 && <div style={{ position: "absolute", left: 1300, top: 545, width: 520, display: "flex", justifyContent: "flex-end", opacity: k, translate: `0px ${(1 - k) * 30}px` }}>
              <div style={{ background: C.white, border: `1.5px solid ${C.line}`, borderRadius: "22px 22px 6px 22px", padding: "16px 22px", fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.ink, maxWidth: 440 }}>Do I need to speak the local language?</div>
            </div>}
            {r > 0 && <div style={{ position: "absolute", left: 1300, top: 655, width: 520, display: "flex", gap: 12, alignItems: "flex-end", opacity: r, translate: `0px ${(1 - r) * 30}px` }}>
              <span style={{ width: 52, height: 52, borderRadius: 26, background: C.navy, color: C.goldHi, fontFamily: SANS, fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>R</span>
              <div style={{ background: C.navy, borderRadius: "22px 22px 22px 6px", padding: "16px 22px", fontFamily: SANS, fontSize: 25, color: C.white, lineHeight: 1.35 }}>Almost never. Only the language in the job title.</div>
            </div>}
          </>
        );
      })()}
      {/* d · support through the whole process */}
      <Panel x={900} y={790} w={920} k={tw(g, 686, 706, 0, 1, ARRIVE) * (1 - tw(g, 780, 792, 0, 1, DEPART))}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          {["Profile", "Recruiter call", "Interviews", "Offer"].map((t, i) => {
            const on = tw(g, 700 + i * 14, 710 + i * 14, 0, 1, POP);
            return (
              <React.Fragment key={t}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: on > 0.5 ? C.ink : C.faint }}>
                  {on > 0.05 ? <Check k={on} size={30} /> : <span style={{ width: 30, height: 30, borderRadius: 15, border: `2.5px solid ${C.faint}` }} />}{t}
                </div>
                {i < 3 && <div style={{ flex: 1, height: 4, borderRadius: 2, background: C.line, overflow: "hidden" }}><div style={{ width: `${tw(g, 706 + i * 14, 716 + i * 14, 0, 100, LINEAR)}%`, height: "100%", background: GOLD }} /></div>}
              </React.Fragment>
            );
          })}
        </div>
      </Panel>

      {/* 4b from the start to the end: their six steps */}
      <Headline g={g} at={800} out={920} x={140} y={170} size={84} lines={[[{ w: "From" }, { w: "the" }, { w: "start" }], [{ w: "to", gold: true }, { w: "the", gold: true }, { w: "end.", gold: true }]]} />
      {g >= 800 && g < 1062 && (() => {
        const on = tw(g, 804, 820, 0, 1, ARRIVE) * (1 - tw(g, 1048, 1060, 0, 1, DEPART));
        const fill = tw(g, 826, 912, 0, 1, LINEAR);
        const toReloc = tw(g, 922, 950, 0, 1, MOVE);
        return (
          <div style={{ position: "absolute", left: 140, top: lerp(520, 150, toReloc), width: 1640, opacity: on * (1 - toReloc * 0.0) }}>
            <div style={{ position: "absolute", left: 35, right: 35, top: 34, height: 4, background: "rgba(255,255,255,.12)", borderRadius: 2 }}>
              <div style={{ width: `${fill * 100}%`, height: "100%", background: GOLD, borderRadius: 2 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 18 }}>
              {STEPS.map((s, i) => {
                const lit = fill >= i / 5 - 0.001 ? 1 : 0;
                const k = tw(g, 808 + i * 4, 824 + i * 4, 0, 1, ARRIVE);
                const faded = i < 5 ? tw(g, 922, 940, 1, 0.35, LINEAR) : 1;
                return (
                  <div key={s} style={{ display: "grid", gap: 16, justifyItems: "start", opacity: k * faded, translate: `0px ${(1 - k) * 30}px` }}>
                    <StepIcon i={i} on={lit} />
                    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18, letterSpacing: "0.16em", color: C.gold }}>STEP 0{i + 1}</div>
                    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, lineHeight: 1.2, color: C.white }}>{s}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
      {/* documents and relocation, over Lisbon */}
      {g >= 922 && g < 1062 && (() => {
        const k = tw(g, 930, 956, 0, 1, ARRIVE) * (1 - tw(g, 1048, 1060, 0, 1, DEPART));
        return (
          <div style={{ position: "absolute", inset: 0, opacity: k }}>
            <Photo src="lisbon" style={{ left: 1000, top: 380, width: 780, height: 560, borderRadius: 24 }} />
            <div style={{ position: "absolute", left: 1040, top: 860, fontFamily: SERIF, fontWeight: 600, fontSize: 52, color: C.white }}>Welcome to Lisbon.</div>
            <Panel x={140} y={420} w={780} k={k} dark>
              <Eyebrow style={{ marginBottom: 22 }}>Documents &amp; relocation</Eyebrow>
              {["Required documents", "NIE / tax number", "Bank account", "Finding an apartment"].map((t, i) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18, fontFamily: SANS, fontWeight: 600, fontSize: 34, color: C.white, opacity: tw(g, 952 + i * 14, 962 + i * 14, 0, 1, LINEAR) }}>
                  <Check k={tw(g, 952 + i * 14, 966 + i * 14, 0, 1, POP)} size={40} />{t}
                </div>
              ))}
            </Panel>
          </div>
        );
      })()}

      {/* 4c made comfortable: a real review */}
      <Headline g={g} at={1064} out={1128} x={960} y={190} size={84} align="center" lines={[[{ w: "Recruitment," }, { w: "made", gold: true }, { w: "comfortable.", gold: true }]]} />
      <Panel x={460} y={400} w={1000} k={tw(g, 1070, 1090, 0, 1, ARRIVE) * (1 - tw(g, 1122, 1132, 0, 1, DEPART))}>
        <div style={{ fontSize: 34, color: C.gold, letterSpacing: 6, marginBottom: 14 }}>★★★★★</div>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontStyle: "italic", fontSize: 50, lineHeight: 1.25, color: C.ink }}>“I felt well taken care of from start to finish.”</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 26 }}>
          <span style={{ width: 56, height: 56, borderRadius: 28, background: C.navy, color: C.goldHi, fontFamily: SANS, fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>ØO</span>
          <div><div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, color: C.ink }}>Øyvind Kato Olsen</div><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, color: C.green }}>● Verified review</div></div>
        </div>
      </Panel>

      {/* 5 the best part */}
      <Headline g={g} at={1136} out={1170} x={960} y={470} size={96} align="center" lines={[[{ w: "And" }, { w: "the" }, { w: "best" }, { w: "part?" }]]} />
      <Headline g={g} at={1176} out={1222} x={960} y={360} size={150} align="center" gap={5} lines={[[{ w: "It’s" }, { w: "completely" }], [{ w: "free.", gold: true }]]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", fontFamily: SANS, fontSize: 34, color: C.faint,
        opacity: tw(g, 1192, 1202, 0, 1, LINEAR) * (1 - tw(g, 1218, 1224, 0, 1, LINEAR)) }}>100% free for candidates. Employers pay our placement fee.</div>

      {/* the close, over Madrid again */}
      {g >= 1240 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "grid", justifyItems: "center", gap: 34, opacity: tw(g, 1240, 1250, 0, 1, LINEAR), scale: String(tw(g, 1240, 1272, 0.93, 1, ARRIVE)) }}>
          <Eyebrow>Recruitment across Europe</Eyebrow>
          <Img src={staticFile("img/logo-white.png")} style={{ width: 900 }} />
          <div style={{ display: "flex", gap: 20, marginTop: 20, opacity: tw(g, 1262, 1272, 0, 1, LINEAR), translate: `0px ${tw(g, 1262, 1278, 30, 0, ARRIVE)}px` }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.navy, background: GOLD, borderRadius: 999, padding: "20px 40px", scale: String(1 - 0.05 * (tw(g, 1296, 1300, 0, 1, LINEAR) - tw(g, 1302, 1310, 0, 1, ARRIVE))) }}>I’m looking for a job</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.white, border: "2px solid rgba(255,255,255,.5)", borderRadius: 999, padding: "20px 36px" }}>topjobsabroad.com</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
