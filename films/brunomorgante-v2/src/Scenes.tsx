import React from "react";
import { AbsoluteFill, Img, interpolateColors, staticFile } from "remotion";
import { Avatar, C, Card, DEPART, Label, MOVE, Pill, SHADOW, Tie, lerp } from "./lib";
import { timeline } from "./timeline";

// Timing as labels (seconds), from the script at 2.5 words per second; re-time to the recorded voice by
// moving labels only (production/remotion.md).
import WORDS from "./words.json";
// beat labels from the assembled voice-over (sound/vo_timing.json); word labels force-aligned (w:...)
export const T = timeline(30, { hook: 0.1, tangle: 3.669, turn: 7.229, consult: 9.926, coach: 18.01, stage: 25.054, proof: 29.682, quote: 33.835, cta: 39.996, end: 45.84, ...(WORDS as Record<string, number>) });
export const BEATS = [
  ["hook", "Every big project starts as one simple idea."],
  ["tangle", "Then come the deadlines, the dependencies, and the people."],
  ["turn", "That's where Bruno Morgante comes in."],
  ["consult", "As a consultant, he takes it from strategy to execution: the portfolio, the plan, the PMO and the team."],
  ["coach", "As a coach and mentor, he works with people one to one and in groups, from executives to university students."],
  ["stage", "And on stage, his keynotes turn hard lessons into stories that stick."],
  ["proof", "Twenty years of leading projects. More than two hundred people mentored."],
  ["quote", "In the words of one organiser: not just a keynote speaker, a keynote experience."],
  ["cta", "Got an idea that needs to become a result? Let's talk."],
] as const;
export const DURATION = T.f("end");

const H1: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 84, style }) => (
  <div style={{ fontWeight: 700, fontSize: size, lineHeight: 1.06, letterSpacing: "-0.035em", color: C.ink, ...style }}>{children}</div>
);
// storytelling entrance (Krehel): 8–16 px of travel and a blur that sharpens as it lands
const enter = (g: number, at: string, s = 0.45, dy = 14) => {
  const k = T.k(g, at, s);
  return { opacity: Math.min(1, k * 1.6), transform: `translateY(${(1 - k) * dy}px)`, filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined };
};

// ---------------------------------------------------------------- the viewer's own next project, carried through the film
const IDEA = "Launch the new platform";
const IdeaCard: React.FC<{ g: number; typed: number; done?: number; w?: number }> = ({ g, typed, done = 0, w = 760 }) => {
  const n = Math.round(IDEA.length * typed);
  return (
    <div style={{ width: w, padding: "34px 40px", borderRadius: 26, background: C.paper, border: `1px solid ${C.line}`, boxShadow: SHADOW }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 600, fontSize: 28, color: C.ink2 }}>Your next project</div>
        {done > 0 ? <span style={{ transform: `scale(${0.85 + 0.15 * done + 0.14 * Math.sin(done * Math.PI)})`, display: "inline-block" }}><Pill tone="green" size={26}>Delivered</Pill></span> : <Pill tone="stone" size={24}>Idea</Pill>}
      </div>
      <div style={{ fontWeight: 700, fontSize: 56, letterSpacing: "-0.03em", marginTop: 16, minHeight: 66 }}>
        {IDEA.slice(0, n)}<span style={{ opacity: typed < 1 && Math.floor(g / 8) % 2 === 0 ? 1 : 0, color: C.red, display: "inline-block", width: 0 }}>|</span><span style={{ opacity: 0 }}>{IDEA.slice(n)}</span>
      </div>
    </div>
  );
};
// zoom crops into the photo (around `origin`), to keep foreground blur and third-party signs out of frame
const Photo: React.FC<{ src: string; x: number; y: number; w: number; h: number; pos?: string; style?: React.CSSProperties; fade?: "left" | "none"; zoom?: number; origin?: string }> = ({ src, x, y, w, h, pos = "50% 30%", style, fade = "left", zoom = 1, origin = "50% 20%" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", ...style }}>
    <Img src={staticFile(`img/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: origin }} />
    {fade === "left" && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(246,244,241,1) 0%, rgba(246,244,241,0) 26%)" }} />}
  </div>
);

// ---------------------------------------------------------------- 1 · hook: Bruno presents one line, typed
export const S1: React.FC<{ g: number }> = ({ g }) => (
  <>
    <Photo src="bruno-smile.jpg" x={760} y={0} w={1160} h={1080} pos="62% 30%" zoom={1.35} origin="58% 8%" style={{ transform: `scale(${lerp(1.06, 1.0, T.k(g, "hook", 3.2, MOVE))})` }} />
    <div style={{ position: "absolute", left: 110, top: 380, ...enter(g, "hook", 0.4) }}><IdeaCard g={g} typed={T.k(g, "hook+0.4", 1.8, MOVE)} /></div>
  </>
);

// ---------------------------------------------------------------- 2 · tangle: deadlines, dependencies, people pile up around it
const AROUND = [
  { x: 90, y: 110, t: "Deadline moved to September", s: "", at: "w:deadlines-0.1" },
  { x: 1230, y: 120, t: "Vendor contract", s: "No owner", at: "w:dependencies-0.1" },
  { x: 80, y: 760, t: "Data migration", s: "Blocked", at: "w:dependencies+0.2" },
  { x: 1300, y: 720, t: "Legal sign-off", s: "Waiting", at: "w:dependencies+0.5" },
  { x: 690, y: 860, t: "5 teams, 5 priorities", s: "people", at: "w:people-0.1" },
];
const Around: React.FC<{ g: number; out?: number }> = ({ g, out = 0 }) =>
  <div style={{ opacity: 1 - out }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {AROUND.map((a, i) => {
        const k = T.k(g, a.at, 0.5);
        const cx = 960, cy = 520, ex = a.x + 260, ey = a.y + 50;
        const mx = (cx + ex) / 2 + (i % 2 ? 240 : -240), my = (cy + ey) / 2 + (i % 3 ? -160 : 180);
        return <path key={i} d={`M${cx},${cy} Q${mx},${my} ${lerp(cx, ex, k)},${lerp(cy, ey, k)}`} fill="none" stroke={C.stone} strokeWidth={3} strokeDasharray="10 10" opacity={k} />;
      })}
    </svg>
    {AROUND.map((a) => (
      <Card key={a.t} x={a.x} y={a.y} w={a.s === "people" ? 560 : 540} style={{ padding: "22px 28px", ...enter(g, a.at, 0.4) }}>
        {a.s === "people" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex" }}>{["PM", "IT", "LG", "FI", "OP"].map((x, i) => <span key={x} style={{ marginLeft: i ? -12 : 0, border: `3px solid #fff`, borderRadius: 99 }}><Avatar initials={x} size={56} /></span>)}</div>
            <div style={{ fontWeight: 700, fontSize: 30 }}>{a.t}</div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{a.t}</div>
            {a.s && <Pill tone={a.s === "Blocked" ? "amber" : "stone"} size={24}>{a.s}</Pill>}
          </div>
        )}
      </Card>
    ))}
  </div>;
export const S2: React.FC<{ g: number }> = ({ g }) => (
  <>
    {/* the hook photo leaves to the right as the tangle builds */}
    {g < T.f("tangle+0.8") && <Photo src="bruno-smile.jpg" x={760 + T.k(g, "tangle", 0.7, DEPART) * 500} y={0} w={1160} h={1080} pos="62% 30%" zoom={1.35} origin="58% 8%" style={{ opacity: 1 - T.k(g, "tangle", 0.7) }} />}
    <Around g={g} />
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(110, 580, T.k(g, "tangle", 1.0, MOVE))}px, ${lerp(380, 420, T.k(g, "tangle", 1.0, MOVE))}px)` }}><IdeaCard g={g} typed={1} /></div>
  </>
);

// ---------------------------------------------------------------- 3 · turn: Bruno points the way; the tangle clears
export const S3: React.FC<{ g: number }> = ({ g }) => {
  const k = T.k(g, "turn", 0.9, MOVE);
  return (
    <>
      <Around g={g + 999} out={T.k(g, "turn", 0.6)} />
      {/* the project steps back while Bruno arrives; it returns in the consulting beat */}
      {g < T.f("turn+0.6") && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(580px, ${420 + T.k(g, "turn", 0.5, DEPART) * 60}px) scale(${1 - 0.06 * T.k(g, "turn", 0.5)})`, opacity: 1 - T.k(g, "turn", 0.5) }}><IdeaCard g={g} typed={1} /></div>}
      <Photo src="bruno-portrait.jpg" x={lerp(1920, 1000, k)} y={0} w={920} h={1080} pos="50% 40%" />
      <div style={{ position: "absolute", left: 120, top: 330 }}>
        <div style={enter(g, "w:bruno-0.1")}><H1 size={120}>Bruno<br />Morgante</H1></div>
        <Tie w={340} k={T.k(g, "w:morgante+0.3", 0.5)} style={{ marginTop: 20 }} />
        <div style={{ ...enter(g, "w:comes"), marginTop: 30, fontWeight: 600, fontSize: 40, color: C.ink }}>I solve problems<br />and deliver results.</div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------- 4 · consulting: four words in a line, the project travelling under them
const STEP = [["Strategy", "why it matters"], ["Portfolio", "what comes first"], ["Plan", "who does what, by when"], ["PMO & team", "people who deliver"]];
export const S4: React.FC<{ g: number }> = ({ g }) => {
  const at = ["w:strategy", "w:portfolio", "w:plan", "w:team"];
  const travel = T.k(g, "w:strategy", 5.0, MOVE), done = T.k(g, "w:team+0.35", 0.45);
  return (
    <>
      <div style={{ position: "absolute", left: 110, top: 110, ...enter(g, "consult") }}><Label style={{ fontSize: 26 }}>Consulting</Label><H1 size={64} style={{ marginTop: 12 }}>From strategy to execution</H1></div>
      {STEP.map(([w, d], i) => {
        const k = T.k(g, at[i], 0.5);
        return (
          <div key={w} style={{ position: "absolute", left: 110 + i * 425, top: 360 }}>
            <div style={{ fontWeight: 700, fontSize: 68, letterSpacing: "-0.035em", color: interpolateColors(k, [0, 1], [C.stonePale, C.ink]) }}>{w}</div>
            <Tie w={120} k={k} style={{ marginTop: 10 }} />
            <div style={{ fontWeight: 600, fontSize: 30, color: C.ink2, marginTop: 16, opacity: k }}>{d}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(110, 1040, travel)}px, 690px) rotate(${Math.sin(travel * Math.PI) * -1.2}deg)` }}><div style={enter(g, "consult+0.4")}><IdeaCard g={g} typed={1} done={done} /></div></div>
    </>
  );
};

// ---------------------------------------------------------------- 5 · coaching & mentoring: Bruno in conversation; the topics, the range
export const S5: React.FC<{ g: number }> = ({ g }) => (
  <>
    <Photo src="bruno-speaking.jpg" x={0} y={0} w={860} h={1080} pos="50% 25%" fade="none" style={{ transform: `translateX(${lerp(-80, 0, T.k(g, "coach", 0.8, MOVE))}px)` }} />
    <div style={{ position: "absolute", left: 980, top: 130 }}>
      <div style={enter(g, "coach+0.1")}><Label style={{ fontSize: 26 }}>Coaching & Mentoring</Label><H1 size={60} style={{ marginTop: 12 }}>One to one,<br />and in groups</H1></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 50 }}>
        {["Leadership", "Communication", "Career progression", "Personal growth"].map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, ...enter(g, `w:mentor+${0.3 + i * 0.45}`, 0.4) }}>
            <span style={{ width: 14, height: 14, borderRadius: 99, background: C.red }} /><span style={{ fontWeight: 700, fontSize: 46, letterSpacing: "-0.02em" }}>{t}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 56, fontWeight: 600, fontSize: 34, color: C.ink2, ...enter(g, "w:executives-0.1") }}>From executives to university students</div>
    </div>
  </>
);

// ---------------------------------------------------------------- 6 · keynote speaking: the stage and the room
export const S6: React.FC<{ g: number }> = ({ g }) => (
  <>
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile("img/bruno-stage-blue.jpg")} style={{ position: "absolute", left: 300, top: 0, width: 1620, height: 1080, objectFit: "cover", filter: `saturate(0.3) sepia(0.12) brightness(1.04) blur(${(1 - T.k(g, "stage", 0.5)) * 8}px)`, transformOrigin: "75% 8%", transform: `scale(${lerp(1.42, 1.34, T.k(g, "stage", 5, MOVE))})` }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(246,244,241,1) 0%, rgba(246,244,241,.97) 30%, rgba(246,244,241,0) 50%)" }} />
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 110, top: 260, width: 700 }}>
      <div style={enter(g, "stage+0.1")}><Label style={{ fontSize: 26 }}>Keynote Speaking</Label></div>
      <div style={{ ...enter(g, "stage+0.3"), marginTop: 16 }}><H1 size={84}>Stories<br />that stick</H1></div>
      <div style={{ ...enter(g, "w:keynotes"), marginTop: 40, fontWeight: 600, fontSize: 32, lineHeight: 1.3, color: C.ink }}>“Beyond the finish line: the journey of building a winning mindset”</div>
    </div>
    <div style={{ position: "absolute", left: 1290, top: 650, width: 520, height: 330, borderRadius: 18, overflow: "hidden", border: "6px solid #fff", boxShadow: SHADOW, ...enter(g, "w:stories", 0.5) }}>
      <Img src={staticFile("img/audience.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.3) sepia(0.12) brightness(1.04)" }} />
    </div>
  </>
);

// ---------------------------------------------------------------- 7 · proof: the numbers he states, and his two rankings
export const S7: React.FC<{ g: number }> = ({ g }) => {
  const n1 = Math.round(20 * T.k(g, "w:twenty", 0.8, MOVE)), n2 = Math.round(200 * T.k(g, "w:two", 1.0, MOVE));
  return (
    <>
      <div style={{ position: "absolute", left: 130, top: 200, ...enter(g, "proof") }}>
        <div style={{ fontWeight: 800, fontSize: 280, lineHeight: 0.9, letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums" }}>{n1}+</div>
        <div style={{ fontWeight: 600, fontSize: 36, marginTop: 14 }}>years leading projects<br />and PMOs</div>
      </div>
      <div style={{ position: "absolute", left: 760, top: 200, ...enter(g, "w:more") }}>
        <div style={{ fontWeight: 800, fontSize: 280, lineHeight: 0.9, letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums" }}>{n2}+</div>
        <div style={{ fontWeight: 600, fontSize: 36, marginTop: 14 }}>people coached<br />and mentored</div>
      </div>
      <div style={{ position: "absolute", left: 1500, top: 190, display: "flex", flexDirection: "column", gap: 24 }}>
        {["badge-top25-coaching", "badge-top10-pm"].map((b, i) => <Img key={b} src={staticFile(`img/${b}.png`)} style={{ width: 230, borderRadius: 16, boxShadow: SHADOW, ...enter(g, `w:mentored+${0.2 + i * 0.25}`, 0.4) }} />)}
      </div>
      <div style={{ position: "absolute", left: 130, top: 860, fontWeight: 600, fontSize: 30, color: C.ink2, ...enter(g, "w:mentored+0.6") }}>Thinkers360: Top 25 Thought Leader in Coaching, Top 10 in Project Management</div>
    </>
  );
};

// ---------------------------------------------------------------- 8 · a real voice, large
export const S8: React.FC<{ g: number }> = ({ g }) => {
  const u = T.k(g, "w:experience", 0.6, MOVE);
  return (
    <div style={{ position: "absolute", left: 160, top: 250, width: 1600 }}>
      <div style={{ fontWeight: 700, fontSize: 80, lineHeight: 1.15, letterSpacing: "-0.03em", ...enter(g, "quote", 0.6) }}>
        “Bruno is not just a keynote speaker, he is a <span style={{ position: "relative", whiteSpace: "nowrap" }}>keynote experience.”
          <span style={{ position: "absolute", left: 0, bottom: -2, height: 10, width: "100%", background: C.red, borderRadius: 8, transformOrigin: "0 50%", transform: `scaleX(${u})` }} /></span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 60, ...enter(g, "quote+1.0") }}>
        <Img src={staticFile("img/grzegorz-ras.jpg")} style={{ width: 96, height: 96, borderRadius: 99, objectFit: "cover" }} />
        <div><div style={{ fontWeight: 700, fontSize: 34 }}>Grzegorz Ras</div><div style={{ fontWeight: 500, fontSize: 28, color: C.ink2 }}>Host & Organizer, PAM Summit 2025 Kraków</div></div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 9 · CTA: Bruno again, the answer to the hook, his logo and address
export const S9: React.FC<{ g: number }> = ({ g }) => (
  <>
    <Photo src="bruno-smile.jpg" x={lerp(1920, 900, T.k(g, "cta", 0.9, MOVE))} y={0} w={1020} h={1080} pos="64% 30%" zoom={1.35} origin="60% 8%" />
    <div style={{ position: "absolute", left: 120, top: 260 }}>
      <div style={{ width: 150, height: 150, borderRadius: 36, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SHADOW, ...enter(g, "cta+0.3") }}><Img src={staticFile("img/bm-logo.png")} style={{ width: 132, height: 132 }} /></div>
      <div style={{ ...enter(g, "cta+0.8"), marginTop: 44 }}><H1 size={88}>Turn your ideas<br />into results.</H1></div>
      <div style={{ display: "flex", gap: 26, alignItems: "center", marginTop: 54, ...enter(g, "w:let's-0.2") }}>
        <span style={{ fontWeight: 700, fontSize: 36, color: "#fff", background: C.red, borderRadius: 999, padding: "24px 48px", boxShadow: "0 18px 30px -14px rgba(189,23,23,.7)" }}>Let's talk</span>
        <span style={{ fontWeight: 600, fontSize: 36 }}>brunomorgante.com</span>
      </div>
    </div>
  </>
);
export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];
