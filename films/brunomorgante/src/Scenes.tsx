import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Avatar, C, Card, Cursor, Label, MOVE, Pill, SHADOW, Tie, lerp, tw } from "./lib";

// Scene timing at 30 fps, from the script timed at 2.5 words per second (re-time to the recorded voice).
export const BEATS = [
  { id: "s1", from: 0, to: 108, line: "Ideas are easy. Implementation is hard." },
  { id: "s2", from: 108, to: 252, line: "Projects stall, teams lose focus, and good plans stay on paper." },
  { id: "s3", from: 252, to: 372, line: "Bruno Morgante solves problems and delivers results." },
  { id: "s4", from: 372, to: 588, line: "As a consultant, he takes you from strategy to execution: projects, portfolios, PMOs and the teams behind them." },
  { id: "s5", from: 588, to: 792, line: "As a coach and mentor, he helps people grow in leadership, communication and career, from executives to students." },
  { id: "s6", from: 792, to: 948, line: "And on stage, his keynotes turn hard lessons into stories that stick." },
  { id: "s7", from: 948, to: 1116, line: "Twenty years of leading projects. More than two hundred people mentored." },
  { id: "s8", from: 1116, to: 1284, line: "Or, as one organiser put it: not just a keynote speaker, a keynote experience." },
  { id: "s9", from: 1284, to: 1455, line: "Ready to turn your ideas into results? Let's talk. brunomorgante.com" },
] as const;
export const DURATION = 1455;

const H1: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 92, style }) => (
  <div style={{ fontWeight: 700, fontSize: size, lineHeight: 1.06, letterSpacing: "-0.035em", color: C.ink, ...style }}>{children}</div>
);
const rise = (t: number, at: number, d = 22) => ({ opacity: tw(t, at, at + d * 0.6), transform: `translateY(${tw(t, at, at + d, 40, 0)}px)` });

// ---------------------------------------------------------------- 1 · hook: the idea lands at once; the plan won't move
export const S1: React.FC<{ t: number }> = ({ t }) => {
  const note = tw(t, 4, 18);
  const drag = Math.sin(Math.min(1, tw(t, 54, 84, 0, 1, MOVE)) * Math.PI); // dragged, and it snaps back
  return (
    <>
      <div style={{ position: "absolute", left: 130, top: 330 }}>
        <div style={rise(t, 2)}><H1 size={104}>Ideas are easy.</H1></div>
        <div style={{ ...rise(t, 40), marginTop: 14 }}><H1 size={104} style={{ color: C.ink2 }}>Implementation<br />is hard.</H1></div>
      </div>
      {/* the plan: bars that don't start */}
      <Card x={1010} y={430} w={780} h={400} style={{ padding: 34, opacity: tw(t, 26, 40), transform: `translateY(${lerp(40, 0, tw(t, 26, 48))}px)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 600, fontSize: 24 }}>Customer portal · Plan</div><Pill tone="stone">Not started</Pill>
        </div>
        <div style={{ display: "flex", gap: 0, marginTop: 26, color: C.ink2, fontSize: 15, fontWeight: 500 }}>
          {["Q1", "Q2", "Q3", "Q4"].map((q) => <div key={q} style={{ flex: 1, borderLeft: `1px dashed ${C.line}`, paddingLeft: 8 }}>{q}</div>)}
        </div>
        {[["Discovery", 0, 0.28], ["Build", 0.22, 0.62], ["Launch", 0.6, 0.9]].map(([n, a, b], i) => (
          <div key={n as string} style={{ position: "relative", height: 62, marginTop: 14 }}>
            <div style={{ position: "absolute", left: 0, top: 0, fontSize: 16, fontWeight: 500, color: C.ink2 }}>{n}</div>
            <div style={{ position: "absolute", top: 26, left: `${(a as number) * 100}%`, width: `${((b as number) - (a as number)) * 100}%`, height: 28, borderRadius: 8,
              border: `2px dashed ${C.stone}`, background: C.stonePale, transform: `translateX(${i === 0 ? drag * 46 : 0}px)` }} />
          </div>
        ))}
      </Card>
      {/* the idea: one sticky note, already there */}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(1420px, ${lerp(150, 250, note)}px) rotate(${lerp(-14, -4, note)}deg) scale(${lerp(1.2, 1, note)})`, opacity: tw(t, 4, 9),
        width: 300, padding: "28px 28px 34px", background: "#FFF7DA", borderRadius: 6, boxShadow: SHADOW, fontWeight: 600, fontSize: 25, lineHeight: 1.3 }}>
        <div style={{ position: "absolute", left: 110, top: -12, width: 84, height: 26, background: "rgba(168,166,159,.45)", borderRadius: 3 }} />
        New idea: a portal for our customers
      </div>
      <Cursor x={1120 + drag * 46} y={592} press={drag > 0.05 ? 1 : 0} />
    </>
  );
};

// ---------------------------------------------------------------- 2 · problem: the portfolio, stuck
const ROWS = [
  { n: "Customer portal", owner: "—", bad: ["stone", "Stalled"], good: ["green", "On track"] },
  { n: "ERP migration", owner: "IT", bad: ["amber", "6 weeks late"], good: ["green", "On track"] },
  { n: "New team onboarding", owner: "No owner", bad: ["amber", "No owner"], good: ["green", "Owner: Ops lead"] },
  { n: "Strategy 2027", owner: "Board", bad: ["stone", "Still a draft"], good: ["green", "Approved"] },
  { n: "Office move", owner: "Facilities", bad: ["amber", "Blocked"], good: ["green", "On track"] },
] as const;
export const Board: React.FC<{ t: number; fixed: (i: number) => number; x: number; y: number; s?: number }> = ({ t, fixed, x, y, s = 1 }) => (
  <Card x={x} y={y} w={1140} r={26} style={{ padding: "34px 40px 26px", transformOrigin: "0 0", transform: `scale(${s})` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
      <div><Label style={{ fontSize: 15 }}>Project portfolio · example</Label><div style={{ fontWeight: 700, fontSize: 34, letterSpacing: "-0.02em", marginTop: 6 }}>This quarter</div></div>
      <div style={{ fontSize: 17, color: C.ink2, fontWeight: 500 }}>5 projects</div>
    </div>
    {ROWS.map((r, i) => {
      const k = fixed(i);
      const p = (k > 0.5 ? r.good : r.bad) as readonly [string, string];
      return (
        <div key={r.n} style={{ display: "grid", gridTemplateColumns: "1fr 240px 250px", alignItems: "center", padding: "17px 0", borderTop: `1px solid ${C.line}`, ...rise(t, 6 + i * 5, 18) }}>
          <div style={{ fontWeight: 600, fontSize: 24 }}>{r.n}</div>
          <div style={{ fontSize: 18, color: C.ink2 }}>{k > 0.5 && i === 2 ? "Ops lead" : r.owner}</div>
          <div style={{ transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, Math.max(0, k)) * Math.PI)})`, transformOrigin: "0 50%" }}><Pill tone={p[0] as "green"} size={18}>{p[1]}</Pill></div>
        </div>
      );
    })}
  </Card>
);
export const S2: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Board t={t} fixed={() => 0} x={390} y={150} />
    {/* the deadline keeps moving */}
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(1110, 1200, tw(t, 40, 120, 0, 1, MOVE))}px, 790px)` }}>
      <Card x={0} y={0} w={420} style={{ padding: "20px 26px", ...rise(t, 30) }}>
        <div style={{ fontSize: 16, color: C.ink2, fontWeight: 500 }}>Go-live</div>
        <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}><s style={{ color: C.ink2 }}>March</s> → <s style={{ color: C.ink2 }}>June</s> → {t > 90 ? "October?" : "September"}</div>
      </Card>
    </div>
  </>
);

// ---------------------------------------------------------------- 3 · turn: Bruno arrives; the statuses turn
export const S3: React.FC<{ t: number }> = ({ t }) => {
  const k = tw(t, 0, 26, 0, 1, MOVE);
  return (
    <>
      <Board t={99} fixed={(i) => tw(t, 40 + i * 6, 52 + i * 6, 0, 1)} x={lerp(390, 96, k)} y={lerp(170, 330, k)} s={lerp(1, 0.66, k)} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 1080, transform: `translateX(${lerp(1920, 1020, k)}px)`, overflow: "hidden" }}>
        <Img src={staticFile("img/bruno-smile.jpg")} style={{ position: "absolute", left: -560, top: 0, height: 1080, width: 1620, objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(246,244,241,1) 0%, rgba(246,244,241,0) 22%)" }} />
      </div>
      <div style={{ position: "absolute", left: 96, top: 120 }}>
        <div style={rise(t, 10)}><H1 size={78}>Bruno Morgante</H1></div>
        <Tie w={250} k={tw(t, 30, 46)} style={{ marginTop: 14 }} />
      </div>
      <div style={{ position: "absolute", left: 96, top: 905, display: "flex", gap: 14, ...rise(t, 60) }}>
        {["Consulting", "Coaching & Mentoring", "Keynote Speaking"].map((s) => <span key={s} style={{ fontWeight: 600, fontSize: 21, padding: "12px 22px", borderRadius: 999, background: C.paper, border: `1px solid ${C.line}`, boxShadow: SHADOW }}>{s}</span>)}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- 4 · consulting: strategy to execution
export const S4: React.FC<{ t: number }> = ({ t }) => {
  const order = tw(t, 50, 74, 0, 1, MOVE); // the cursor lifts the top priority into first place
  const PRI = ["ERP migration", "Customer portal", "Strategy 2027", "New team onboarding"];
  const bars = [[0.02, 0.34], [0.18, 0.58], [0.36, 0.72], [0.6, 0.94]];
  return (
    <>
      <div style={{ position: "absolute", left: 110, top: 96, ...rise(t, 2) }}><Label>Consulting</Label><H1 size={60} style={{ marginTop: 10 }}>From strategy to execution</H1></div>
      {/* portfolio: prioritised */}
      <Card x={110} y={300} w={560} h={640} style={{ padding: 32, ...rise(t, 8) }}>
        <div style={{ fontWeight: 700, fontSize: 26 }}>Portfolio priorities</div>
        {PRI.map((p, i) => {
          const pos = i === 0 ? lerp(1, 0, order) : i === 1 ? lerp(0, 1, order) : i;
          return (
            <div key={p} style={{ position: "absolute", left: 32, right: 32, top: 100 + pos * 120, height: 100, borderRadius: 16, border: `1px solid ${C.line}`, background: i === 0 && order > 0 && order < 1 ? C.paper : C.canvas,
              boxShadow: i === 0 && order > 0 && order < 1 ? SHADOW : undefined, display: "flex", alignItems: "center", gap: 18, padding: "0 22px" }}>
              <span style={{ fontWeight: 700, fontSize: 30, color: Math.round(pos) === 0 ? C.red : C.ink2, width: 34 }}>{Math.round(pos) + 1}</span>
              <span style={{ fontWeight: 600, fontSize: 22 }}>{p}</span>
            </div>
          );
        })}
      </Card>
      {/* the plan, now running */}
      <Card x={720} y={300} w={1090} h={640} style={{ padding: 32, ...rise(t, 14) }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontWeight: 700, fontSize: 26 }}>Roadmap</div><Pill tone="green">All on track</Pill></div>
        <div style={{ display: "flex", marginTop: 24, marginLeft: 230, color: C.ink2, fontSize: 16, fontWeight: 500 }}>{["Q1", "Q2", "Q3", "Q4"].map((q) => <div key={q} style={{ flex: 1, borderLeft: `1px dashed ${C.line}`, paddingLeft: 8, height: 470 }}>{q}</div>)}</div>
        {PRI.map((p, i) => (
          <div key={p} style={{ position: "absolute", left: 32, right: 32, top: 140 + i * 110, height: 60 }}>
            <div style={{ position: "absolute", left: 0, top: 16, width: 220, fontWeight: 600, fontSize: 19 }}>{p}</div>
            <div style={{ position: "absolute", left: 230, right: 0, top: 10, height: 40 }}>
              <div style={{ position: "absolute", left: `${bars[i][0] * 100}%`, width: `${(bars[i][1] - bars[i][0]) * 100 * tw(t, 30 + i * 8, 60 + i * 8)}%`, height: 40, borderRadius: 10, background: i === 0 ? C.ink : C.ink2 }} />
            </div>
          </div>
        ))}
        {/* today */}
        <div style={{ position: "absolute", left: 32 + 230 + 0.41 * 826, top: 96, width: 3, height: 500, background: C.red, opacity: tw(t, 90, 100) }}>
          <div style={{ position: "absolute", top: -34, left: -34, fontSize: 15, fontWeight: 700, color: C.red }}>Today</div>
        </div>
      </Card>
      {/* the team behind it */}
      <div style={{ position: "absolute", left: 1350, top: 975, display: "flex", alignItems: "center", gap: 12, ...rise(t, 110) }}>
        <div style={{ display: "flex" }}>{["PM", "OP", "IT", "HR", "FI"].map((a, i) => <span key={a} style={{ marginLeft: i ? -14 : 0, border: `3px solid ${C.canvas}`, borderRadius: 99 }}><Avatar initials={a} size={50} /></span>)}</div>
        <span style={{ fontWeight: 600, fontSize: 19, color: C.ink2 }}>PMO and delivery team</span>
      </div>
      <Cursor x={lerp(560, 600, order)} y={lerp(560, 420, order)} press={order > 0 && order < 1 ? 1 : 0} />
    </>
  );
};

// ---------------------------------------------------------------- 5 · coaching & mentoring: a week of sessions, exec to student
export const S5: React.FC<{ t: number }> = ({ t }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const sess = [
    { d: 0, top: 0.1, h: 0.22, who: "Executive", topic: "Leadership", a: "EX" },
    { d: 1, top: 0.45, h: 0.22, who: "Senior manager", topic: "Communication", a: "SM" },
    { d: 2, top: 0.2, h: 0.22, who: "Project manager", topic: "Career progression", a: "PM" },
    { d: 3, top: 0.55, h: 0.3, who: "Group session", topic: "Project management", a: "6" },
    { d: 4, top: 0.15, h: 0.22, who: "University student", topic: "Personal growth", a: "ST" },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 110, top: 96, ...rise(t, 2) }}><Label>Coaching & Mentoring</Label><H1 size={60} style={{ marginTop: 10 }}>From executives to students</H1></div>
      <Card x={110} y={300} w={1700} h={660} style={{ padding: "26px 30px", ...rise(t, 8) }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18, height: "100%" }}>
          {days.map((d, i) => (
            <div key={d} style={{ position: "relative", borderLeft: i ? `1px solid ${C.line}` : undefined, paddingLeft: i ? 16 : 0 }}>
              <div style={{ fontWeight: 600, fontSize: 20, color: C.ink2 }}>{d}</div>
              {sess.filter((s) => s.d === i).map((s) => {
                const k = tw(t, 24 + i * 10, 44 + i * 10);
                return (
                  <div key={s.who} style={{ position: "absolute", left: i ? 16 : 0, right: 0, top: 50 + s.top * 520, minHeight: s.h * 520, borderRadius: 16, padding: "16px 18px", background: i === 3 ? C.ink : C.canvas,
                    color: i === 3 ? "#fff" : C.ink, border: `1px solid ${i === 3 ? C.ink : C.line}`, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Avatar initials={s.a} size={44} tone={i === 3 ? "#333" : C.stonePale} /><div style={{ fontWeight: 700, fontSize: 19, lineHeight: 1.2, color: i === 3 ? "#fff" : C.ink }}>{s.who}</div></div>
                    <div style={{ marginTop: 12, fontSize: 17, fontWeight: 500, color: i === 3 ? "#ddd" : C.ink2 }}>1:1 · {s.topic}</div>
                    <div style={{ marginTop: 10, height: 5, width: 60, borderRadius: 5, background: C.red }} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

// ---------------------------------------------------------------- 6 · keynote speaking: on stage
export const S6: React.FC<{ t: number }> = ({ t }) => (
  <>
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile("img/bruno-stage-blue.jpg")} style={{ position: "absolute", left: 300, top: 0, width: 1620, height: 1080, objectFit: "cover", filter: "saturate(0.3) sepia(0.12) brightness(1.04)", transform: `scale(${lerp(1.08, 1.0, tw(t, 0, 150, 0, 1, MOVE))})` }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(246,244,241,1) 0%, rgba(246,244,241,.97) 28%, rgba(246,244,241,0) 50%)" }} />
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 110, top: 300, width: 720 }}>
      <div style={rise(t, 4)}><Label>Keynote Speaking</Label></div>
      <div style={{ ...rise(t, 12), marginTop: 18 }}><H1 size={64}>Stories that stick</H1></div>
      <Card x={0} y={190} w={640} style={{ padding: "26px 30px", ...rise(t, 30) }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.red, letterSpacing: "0.1em", textTransform: "uppercase" }}>Keynote</div>
        <div style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.25, marginTop: 8 }}>Beyond the finish line: the journey of building a winning mindset</div>
        <div style={{ fontSize: 18, color: C.ink2, marginTop: 12 }}>Leadership · Project Management · Personal Growth</div>
      </Card>
    </div>
    <Card x={1320} y={700} w={480} h={300} r={20} style={{ overflow: "hidden", border: "6px solid #fff", ...rise(t, 60) }}>
      <Img src={staticFile("img/audience.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.3) sepia(0.12) brightness(1.04)" }} />
    </Card>
  </>
);

// ---------------------------------------------------------------- 7 · proof: the numbers he states himself
export const S7: React.FC<{ t: number }> = ({ t }) => {
  const n1 = Math.round(tw(t, 10, 50, 0, 20)), n2 = Math.round(tw(t, 40, 90, 0, 200));
  return (
    <>
      <div style={{ position: "absolute", left: 130, top: 250, ...rise(t, 4) }}>
        <div style={{ fontWeight: 800, fontSize: 260, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{n1}+</div>
        <div style={{ fontWeight: 600, fontSize: 34, color: C.ink2, marginTop: 6 }}>years leading projects, programs and PMOs</div>
      </div>
      <div style={{ position: "absolute", left: 1010, top: 250, ...rise(t, 34) }}>
        <div style={{ fontWeight: 800, fontSize: 260, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{n2}+</div>
        <div style={{ fontWeight: 600, fontSize: 34, color: C.ink2, marginTop: 6 }}>people coached and mentored</div>
      </div>
      <div style={{ position: "absolute", left: 130, top: 740, display: "flex", alignItems: "center", gap: 22 }}>
        {["badge-top25-coaching", "badge-top10-pm"].map((n, i) => <Img key={n} src={staticFile(`img/${n}.png`)} style={{ width: 150, borderRadius: 14, boxShadow: SHADOW, ...rise(t, 96 + i * 8) }} />)}
        <span style={{ fontWeight: 600, fontSize: 28, marginLeft: 14, maxWidth: 640, lineHeight: 1.35, ...rise(t, 112) }}>Thinkers360 Top 25 Thought Leader in Coaching, Top 10 in Project Management</span>
      </div>
    </>
  );
};

// ---------------------------------------------------------------- 8 · a real voice: Grzegorz Ras, PAM Summit 2025
export const S8: React.FC<{ t: number }> = ({ t }) => (
  <>
    {[{ img: "edita-kemzuraite", q: "Inspiring, insightful, and full of heart.", n: "Edita Kemzūraitė" }, { img: "sandra-pazdro", q: "…what a true mentor should be like!", n: "Sandra Pazdro" }].map((o, i) => (
      <Card key={o.n} x={i ? 1280 : 140} y={i ? 720 : 140} w={520} style={{ padding: "24px 28px", display: "flex", gap: 18, alignItems: "center", opacity: 0.55 * tw(t, 20 + i * 8, 40 + i * 8) }}>
        <Img src={staticFile(`img/${o.img}.jpg`)} style={{ width: 64, height: 64, borderRadius: 99, objectFit: "cover" }} />
        <div><div style={{ fontWeight: 600, fontSize: 20 }}>“{o.q}”</div><div style={{ fontSize: 16, color: C.ink2, marginTop: 4 }}>{o.n}</div></div>
      </Card>
    ))}
    <Card x={360} y={330} w={1200} r={30} style={{ padding: "56px 64px", ...rise(t, 4) }}>
      <div style={{ fontWeight: 800, fontSize: 120, lineHeight: 0.6, color: C.red, height: 50 }}>“</div>
      <div style={{ fontWeight: 700, fontSize: 54, lineHeight: 1.2, letterSpacing: "-0.025em" }}>Bruno is not just a keynote speaker, he is a keynote experience.</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 34 }}>
        <Img src={staticFile("img/grzegorz-ras.jpg")} style={{ width: 72, height: 72, borderRadius: 99, objectFit: "cover" }} />
        <div><div style={{ fontWeight: 700, fontSize: 23 }}>Grzegorz Ras</div><div style={{ fontSize: 19, color: C.ink2 }}>Host & Organizer, PAM Summit 2025 Kraków</div></div>
      </div>
    </Card>
  </>
);

// ---------------------------------------------------------------- 9 · CTA: the logo, the button, the address
export const S9: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, display: "flex", flexDirection: "column", alignItems: "center", transform: "translateY(230px)" }}>
      <div style={{ width: 170, height: 170, borderRadius: 40, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SHADOW, ...rise(t, 2) }}>
        <Img src={staticFile("img/bm-logo.png")} style={{ width: 150, height: 150 }} />
      </div>
      <div style={{ ...rise(t, 12), marginTop: 40 }}><H1 size={84} style={{ textAlign: "center" }}>Turn your ideas into results.</H1></div>
      <div style={{ display: "flex", gap: 22, alignItems: "center", marginTop: 46, ...rise(t, 34) }}>
        <span style={{ fontWeight: 700, fontSize: 30, color: "#fff", background: C.red, borderRadius: 999, padding: "22px 44px", boxShadow: "0 18px 30px -14px rgba(189,23,23,.7)" }}>Let's talk</span>
        <span style={{ fontWeight: 600, fontSize: 30, color: C.ink }}>brunomorgante.com</span>
      </div>
    </div>
  </>
);
export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];
