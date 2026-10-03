import React from "react";
import { Img, staticFile } from "remotion";
import { C, HAND } from "./lib";

// What the screens show, drawn at the size they're read (the laptop's screen is 800 × 485): few, big things, the
// text the viewer must read at 36 px or more. Everything takes progress values from the story; nothing here keeps
// its own time.

const cl = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const Abs: React.FC<{ x: number; y: number; w?: number; h?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>{children}</div>
);
const Title: React.FC<{ text: string; o?: number; eyebrow?: string }> = ({ text, o = 1, eyebrow }) => (
  <Abs x={40} y={eyebrow ? 22 : 30} style={{ opacity: o }}>
    {eyebrow && <div style={{ fontSize: 22, fontWeight: 600, color: C.cyanDeep, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{eyebrow}</div>}
    <div style={{ fontSize: 42, fontWeight: 800, color: C.navy, letterSpacing: "-0.02em" }}>{text}</div>
  </Abs>
);
const Pill: React.FC<{ done: number }> = ({ done }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 46, padding: "0 18px", borderRadius: 23, fontSize: 26, fontWeight: 700,
    background: done > 0.5 ? C.greenSoft : "#EEF0F4", color: done > 0.5 ? C.green : C.grey }}>
    <div style={{ width: 12, height: 12, borderRadius: 6, background: done > 0.5 ? C.green : C.grey }} />
    {done > 0.5 ? "Done" : "Waiting"}
  </div>
);
const Doc: React.FC<{ size?: number; color?: string }> = ({ size = 44, color = C.cyanDeep }) => (
  <div style={{ width: size, height: size, borderRadius: 10, background: C.cyanSoft, position: "relative" }}>
    <div style={{ position: "absolute", left: size * 0.28, top: size * 0.22, width: size * 0.44, height: size * 0.56, borderRadius: 3, border: `3px solid ${color}` }} />
  </div>
);

// ---------------------------------------------------------------- 1 orders → the system
/** rows: arrival 0..1 per row (they slide in from the screen's left edge); status: 0 waiting → 1 done;
 *  gather: the rows sweep into the first tile; tiles: each tile's arrival; arrows: the links drawing. */
export const Orders: React.FC<{ rows: number[]; status: number[]; gather?: number; tiles?: number[]; arrows?: number; count?: number }> = ({
  rows, status, gather = 0, tiles = [0, 0, 0], arrows = 0, count = 7 }) => (
  <>
    <Title text="Orders" o={1 - gather} />
    {rows.map((k, i) => k > 0 && (
      <Abs key={i} x={40 - (1 - k) * 760 + gather * 30} y={lerp(112 + i * 86, 190, gather)} w={720} h={72}
        style={{ display: "flex", alignItems: "center", gap: 20, borderRadius: 14, background: "#F6F7FA", padding: "0 18px", opacity: 1 - gather,
          transform: `scale(${1 - gather * 0.6})`, transformOrigin: "0% 50%" }}>
        <Doc />
        <div style={{ fontSize: 34, fontWeight: 700, color: C.navy, flex: 1 }}>Order {1041 + i}</div>
        <Pill done={status[i] ?? 1} />
      </Abs>
    ))}
    {tiles.some((t) => t > 0) && (
      <>
        <Title text="Your system" o={cl(tiles[0] * 2)} />
        {["Orders", "Invoices", "Shipped"].map((name, i) => {
          const t = tiles[i];
          return t > 0 && (
            <Abs key={name} x={40 + i * 250} y={150 + (1 - t) * 40} w={220} h={250}
              style={{ opacity: cl(t * 1.6), borderRadius: 20, background: i === 0 ? C.navy : C.cyanSoft, padding: 24, color: i === 0 ? C.white : C.navy }}>
              <div style={{ fontSize: 30, fontWeight: 700, opacity: 0.9 }}>{name}</div>
              <div style={{ fontSize: 96, fontWeight: 800, marginTop: 34, letterSpacing: "-0.03em" }}>{count}</div>
            </Abs>
          );
        })}
        {[0, 1].map((i) => (
          <Abs key={i} x={262 + i * 250} y={268} w={26 * cl(arrows * 2 - i)} h={6} style={{ background: C.cyan, borderRadius: 3 }} />
        ))}
      </>
    )}
  </>
);

// ---------------------------------------------------------------- 2 software, automation, AI
export const WebApp: React.FC<{ bars: number }> = ({ bars }) => (
  <>
    <Abs x={0} y={0} w={110} h={485} style={{ background: C.navy }}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 35, top: 40 + i * 74, width: 40, height: 40, borderRadius: 10, background: i === 0 ? C.cyan : "rgba(255,255,255,.18)" }} />)}
    </Abs>
    <Abs x={150} y={30} style={{ fontSize: 22, fontWeight: 600, color: C.cyanDeep, letterSpacing: "0.06em", textTransform: "uppercase" }}>Software</Abs>
    <Abs x={150} y={58} style={{ fontSize: 42, fontWeight: 800, color: C.navy, letterSpacing: "-0.02em" }}>Your web app</Abs>
    <Abs x={150} y={140} w={410} h={300} style={{ borderRadius: 20, background: "#F6F7FA" }}>
      {[0.45, 0.62, 0.5, 0.78, 0.66, 0.92].map((v, i) => {
        const k = cl(bars * 1.6 - i * 0.12);
        return <div key={i} style={{ position: "absolute", left: 30 + i * 62, bottom: 30, width: 40, height: 220 * v * k, borderRadius: 8, background: i === 5 ? C.cyan : C.navy2 }} />;
      })}
    </Abs>
    {[0, 1].map((i) => (
      <Abs key={i} x={590} y={140 + i * 158} w={170} h={142} style={{ borderRadius: 20, background: i === 0 ? C.cyanSoft : "#F6F7FA", opacity: cl(bars * 2 - 0.4 - i * 0.2) }}>
        <div style={{ position: "absolute", left: 22, top: 22, width: 70, height: 12, borderRadius: 4, background: C.grey, opacity: 0.6 }} />
        <div style={{ position: "absolute", left: 22, top: 58, width: 110, height: 40, borderRadius: 8, background: i === 0 ? C.cyanDeep : C.navy2 }} />
      </Abs>
    ))}
  </>
);

/** pulse 0..1 runs left to right through the three steps; each step checks as the pulse reaches it. */
export const Automation: React.FC<{ pulse: number; k?: number }> = ({ pulse, k = 1 }) => {
  const steps = ["New order", "Invoice", "Email"];
  const cx = [130, 400, 670];
  return (
    <>
      <Abs x={40} y={22} style={{ fontSize: 22, fontWeight: 600, color: C.cyanDeep, letterSpacing: "0.06em", textTransform: "uppercase" }}>Automation</Abs>
      <Abs x={40} y={50} style={{ fontSize: 42, fontWeight: 800, color: C.navy, letterSpacing: "-0.02em" }}>Runs by itself</Abs>
      <Abs x={130} y={268} w={540} h={8} style={{ background: C.line, borderRadius: 4 }} />
      <Abs x={130} y={268} w={540 * cl(pulse)} h={8} style={{ background: C.cyan, borderRadius: 4 }} />
      {steps.map((s, i) => {
        const done = cl((pulse - i / 2) * 8 + 1);
        return (
          <Abs key={s} x={cx[i] - 112} y={170} w={224} h={200} style={{ borderRadius: 22, background: C.white, boxShadow: "0 10px 24px -12px rgba(41,58,81,.35)",
            border: `3px solid ${done > 0.5 ? C.cyan : C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: k }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: done > 0.5 ? C.cyan : C.cyanSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="34" height="34" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={done > 0.5 ? C.white : C.cyanDeep} strokeWidth={3}
                strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - done} /></svg>
            </div>
            <div style={{ fontSize: 34, fontWeight: 700, color: C.navy }}>{s}</div>
          </Abs>
        );
      })}
      {pulse > 0 && pulse < 1 && <Abs x={130 + 540 * pulse - 14} y={258} w={28} h={28} style={{ borderRadius: 14, background: C.cyan, boxShadow: `0 0 0 8px ${C.cyan}33` }} />}
    </>
  );
};

/** q: the customer's question arriving; typed: characters of the agent's answer. */
export const Agent: React.FC<{ q: number; typed: number }> = ({ q, typed }) => {
  const answer = "It ships today. Tracking is in your inbox.";
  const n = Math.max(0, Math.min(answer.length, Math.floor(typed)));
  return (
    <>
      <Abs x={40} y={22} style={{ fontSize: 22, fontWeight: 600, color: C.cyanDeep, letterSpacing: "0.06em", textTransform: "uppercase" }}>AI agent</Abs>
      <Abs x={40} y={50} style={{ fontSize: 42, fontWeight: 800, color: C.navy, letterSpacing: "-0.02em" }}>Answers your customers</Abs>
      <Abs x={40} y={150 + (1 - q) * 30} style={{ opacity: q, maxWidth: 520, padding: "20px 28px", borderRadius: "26px 26px 26px 6px", background: "#F0F1F5", fontSize: 36, fontWeight: 600, color: C.navy }}>
        Where is my order?
      </Abs>
      {typed > 0 && (
        <Abs x={240} y={268} style={{ width: 520, padding: "20px 28px", borderRadius: "26px 26px 6px 26px", background: C.cyanSoft, fontSize: 36, fontWeight: 600, color: C.navy, minHeight: 130 }}>
          {answer.slice(0, n)}<span style={{ opacity: n < answer.length ? 1 : 0, color: C.cyanDeep }}>|</span>
        </Abs>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 3 the plan, built
/** The booking form the notebook sketches, built: parts[0] the title, 1–3 the fields, 4 the button (each 0..1,
 *  sliding in from the screen's left edge). */
export const BookForm: React.FC<{ parts: number[] }> = ({ parts }) => {
  const off = (k: number) => (1 - k) * -520;
  return (
    <>
      {parts[0] > 0 && <Abs x={60 + off(parts[0])} y={34} style={{ fontSize: 46, fontWeight: 800, color: C.navy, letterSpacing: "-0.02em" }}>Book a call</Abs>}
      {["Name", "Email", "Date"].map((f, i) => parts[i + 1] > 0 && (
        <Abs key={f} x={60 + off(parts[i + 1])} y={118 + i * 92} w={680} h={72} style={{ borderRadius: 14, border: `3px solid ${C.line}`, background: "#FAFBFC",
          display: "flex", alignItems: "center", padding: "0 24px", fontSize: 32, fontWeight: 600, color: C.grey }}>{f}</Abs>
      ))}
      {parts[4] > 0 && <Abs x={60 + off(parts[4])} y={400} w={250} h={68} style={{ borderRadius: 34, background: C.cyan, color: C.white, fontSize: 32, fontWeight: 800,
        display: "flex", alignItems: "center", justifyContent: "center" }}>Book</Abs>}
    </>
  );
};

/** The sketch of the same form in the notebook, hand-drawn: draw 0..1 draws it; lifted[i] fades the part that
 *  has lifted off the page. */
export const Sketch: React.FC<{ draw: number; lifted: number[] }> = ({ draw, lifted }) => {
  const seg = (i: number) => cl(draw * 5 - i);
  const box = (x: number, y: number, w: number, h: number, r: number, i: number) => (
    <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke={C.navy} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1 1"
      strokeDashoffset={1 - seg(i)} opacity={1 - lifted[i] * 0.85} />
  );
  return (
    <svg width={470} height={340} style={{ position: "absolute", left: 0, top: 0 }}>
      <text x={40} y={92} fontFamily={HAND} fontSize={44} fill={C.navy} opacity={cl(draw * 5) * (1 - lifted[0] * 0.85)}>book a call</text>
      {box(40, 116, 300, 44, 8, 1)}
      {box(40, 176, 300, 44, 8, 2)}
      {box(40, 236, 300, 44, 8, 3)}
      {box(40, 292, 120, 34, 17, 4)}
      <path d="M360 140 C 400 170, 410 230, 380 280" fill="none" stroke={C.cyanDeep} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1 1"
        strokeDashoffset={1 - cl(draw * 5 - 4)} opacity={1 - lifted[4] * 0.85} />
    </svg>
  );
};

// ---------------------------------------------------------------- 4 the business's own system, growing
/** side: the sections docked from the phone (0..1 each); tiles: Orders, Invoices, Support, Team, Reports (0..1);
 *  people: avatars in the top bar (0..5, fractional arrives the next); auto: the toggle; better: Orders improves. */
export const Business: React.FC<{ side: number[]; tiles: number[]; people: number; auto?: number; better?: number }> = ({ side, tiles, people, auto = 0, better = 0 }) => {
  const names = ["CRM", "Invoices", "Follow-ups", "Support"];
  const colors = [C.navy, C.cyanDeep, "#7B8AA3", C.navy2, "#4FB8E8"];
  const tileNames = ["Orders", "Invoices", "Support", "Team", "Reports"];
  const tilePos = [[225, 120], [410, 120], [595, 120], [225, 300], [410, 300]];
  return (
    <>
      <Abs x={0} y={0} w={200} h={485} style={{ background: "#F3F4F8" }} />
      {names.map((n, i) => side[i] > 0 && (
        <Abs key={n} x={14 - (1 - side[i]) * 400} y={120 + i * 64} w={174} h={52} style={{ borderRadius: 12, background: C.white, display: "flex", alignItems: "center",
          gap: 9, padding: "0 12px", fontSize: 21, fontWeight: 700, whiteSpace: "nowrap", color: C.navy, boxShadow: "0 4px 10px -6px rgba(41,58,81,.3)" }}>
          <div style={{ width: 14, height: 14, borderRadius: 4, background: C.cyan }} />{n}
        </Abs>
      ))}
      <Abs x={230} y={34} style={{ fontSize: 40, fontWeight: 800, color: C.navy, letterSpacing: "-0.02em" }}>Your business</Abs>
      {[0, 1, 2, 3, 4].map((i) => {
        const k = cl(people - i);
        return k > 0 && (
          <Abs key={i} x={724 - i * 38} y={36} w={46} h={46} style={{ borderRadius: 23, background: colors[i], border: `3px solid ${C.white}`, opacity: k, transform: `scale(${0.7 + 0.3 * k})` }} />
        );
      })}
      {auto > 0 && (
        <Abs x={30} y={22} w={150} h={70} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 24, fontWeight: 800, color: C.navy }}>
          <div style={{ width: 64, height: 36, borderRadius: 18, background: lerp(0, 1, auto) > 0.5 ? C.cyan : C.line, position: "relative" }}>
            <div style={{ position: "absolute", left: 4 + auto * 28, top: 4, width: 28, height: 28, borderRadius: 14, background: C.white }} />
          </div>
          Auto
        </Abs>
      )}
      {tiles.map((k, i) => {
        if (k <= 0) return null;
        const [x, y] = tilePos[i];
        const reports = i === 4;
        return (
          <Abs key={i} x={x} y={y + (1 - k) * (reports ? 250 : 30)} w={170} h={160} style={{ opacity: cl(k * 1.6), borderRadius: 18, background: reports ? C.cyanSoft : C.white,
            border: `2px solid ${reports ? C.cyan : C.line}`, padding: "18px 22px", zIndex: reports ? 2 : 1 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.navy }}>{tileNames[i]}</div>
            {i === 0 && (
              <svg width={130} height={80} style={{ position: "absolute", left: 20, top: 62 }}>
                <path d={`M0 ${70} L32 ${60 - better * 6} L64 ${62 - better * 20} L96 ${50 - better * 26} L128 ${44 - better * 36}`} fill="none" stroke={better > 0 ? C.cyan : C.navy2} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {i === 0 && better > 0 && (
              <div style={{ position: "absolute", left: 18, top: 116, padding: "4px 10px", borderRadius: 10, background: C.greenSoft, color: C.green, fontSize: 20, fontWeight: 800, opacity: better }}>Improved</div>
            )}
            {(i === 1 || i === 2 || i === 3) && <div style={{ position: "absolute", left: 20, top: 72, width: 128 - i * 14, height: 44, borderRadius: 10, background: i === 1 ? C.cyanSoft : "#F3F4F8" }} />}
            {reports && [0.5, 0.8, 0.65, 1].map((v, j) => (
              <div key={j} style={{ position: "absolute", left: 20 + j * 34, bottom: 18, width: 30, height: 70 * v * cl(k * 2 - 0.6 - j * 0.1), borderRadius: 6, background: C.cyanDeep }} />
            ))}
          </Abs>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- phone and tablet screens
export const Lock: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(170deg, ${C.cyanSoft}, #F4F6FB)` }}>
    <div style={{ position: "absolute", left: 0, top: 70, width: 210, textAlign: "center", fontSize: 60, fontWeight: 300, color: C.navy }}>9:41</div>
  </div>
);
/** The app the sticky notes become: buttons[i] 0..1 each (sliding in from the left); press 0..1 on Invoices. */
export const PhoneApp: React.FC<{ buttons: number[]; press?: number }> = ({ buttons, press = 0 }) => {
  const names = ["CRM", "Invoices", "Follow-ups", "Support"];
  return (
    <div style={{ position: "absolute", inset: 0, background: C.white }}>
      <div style={{ position: "absolute", left: 18, top: 52, fontSize: 28, fontWeight: 800, color: C.navy }}>Your app</div>
      {names.map((n, i) => buttons[i] > 0 && (
        <div key={n} style={{ position: "absolute", left: 16 + (1 - buttons[i]) * -240, top: 112 + i * 76, width: 178, height: 62, borderRadius: 16,
          background: i === 1 && press > 0 ? lerpColor(press) : C.cyanSoft, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 26, fontWeight: 700,
          color: i === 1 && press > 0.5 ? C.white : C.navy, transform: `scale(${i === 1 ? 1 - Math.sin(Math.PI * Math.min(1, press * 2)) * 0.05 : 1})` }}>{n}</div>
      ))}
    </div>
  );
};
const lerpColor = (k: number) => (k > 0.5 ? C.cyanDeep : C.cyan);

/** The tablet's order form: the same form again and again (cards slide out right as the next slides in). */
export const FormCards: React.FC<{ step: number; auto: number }> = ({ step, auto }) => {
  const i = Math.floor(step), f = step - i;
  const card = (k: number, key: number) => (
    <div key={key} style={{ position: "absolute", left: 40 + k * 380, top: 64, width: 292, height: 170, borderRadius: 16, background: "#F6F7FA", border: `2px solid ${C.line}` }}>
      <div style={{ position: "absolute", left: 20, top: 18, fontSize: 24, fontWeight: 800, color: C.navy }}>Order form</div>
      {[0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: 20, top: 62 + j * 32, width: 200 - j * 40, height: 18, borderRadius: 5, background: C.line }} />)}
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: C.white }}>
      <div style={{ position: "absolute", left: 22, top: 16, fontSize: 22, fontWeight: 800, color: auto > 0.5 ? C.cyanDeep : C.grey, letterSpacing: "0.04em" }}>
        {auto > 0.5 ? "AUTOMATIC" : "BY HAND"}
      </div>
      {card(f, i)}
      {card(f - 1, i + 1)}
    </div>
  );
};

export const MiniBadge: React.FC<{ size: number }> = ({ size }) => <Img src={staticFile("img/kb-logo.png")} style={{ width: size, height: size }} />;
