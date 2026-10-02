import React from "react";
import { Easing } from "remotion";
import { C, Chip, Eyebrow, MOVE, SHADOW, lerp } from "./lib";
import { Iris, Line, LIN, POP, Roll, T, measure, off } from "./kit";
import { Check, DriveBars, Figure, FocusWave, InsightCard, Mark, PressureCurve, ProcessingLoops, Wordmark } from "./parts";

// MindMirror · one continuous stage. The thread is their own figure: tangled signal beside "why", ordered by the
// central scan line into their mirrored pattern as MindMirror turns patterns into a picture; the areas grow out
// of it; the guided assessment ticks through them; the card opens on its centre line into a profile; labels are
// struck off a person and the figure grows back round them as context; it carries into the logo and the CTA.

type K = [string, ...number[]];
/** Values keyed on labels: [pos, v1, v2, …, ease?]; a trailing function eases the segment arriving at that key. */
const track = (g: number, keys: (K | [string, ...(number | ((t: number) => number))[]])[]) => {
  const k = keys as [string, ...(number | ((t: number) => number))[]][];
  let i = 0;
  while (i < k.length - 1 && g >= T.f(k[i + 1][0])) i++;
  const a = k[i], b = k[Math.min(i + 1, k.length - 1)];
  const fa = T.f(a[0]), fb = T.f(b[0]);
  const ease = (typeof b[b.length - 1] === "function" ? b[b.length - 1] : LIN) as (t: number) => number;
  const t = fb > fa ? ease(Math.min(1, Math.max(0, (g - fa) / (fb - fa)))) : 1;
  const va = a.slice(1).filter((v) => typeof v === "number") as number[], vb = b.slice(1).filter((v) => typeof v === "number") as number[];
  return va.map((v, j) => lerp(v, vb[j], t));
};
const ARR = Easing.bezier(0.22, 1, 0.36, 1);
const OUT = Easing.bezier(0.55, 0, 0.9, 0.4);

export const Story: React.FC<{ g: number }> = ({ g }) => {
  // ---------------------------------------------------------------- the figure's path through the film
  const [fx, fy, fs, fo] = track(g, [
    ["hook", 1580, 600, 0.42, 0], ["w:why-0.1", 1580, 600, 0.42, 0], ["w:why+0.4", 1580, 600, 0.42, 1, ARR], ["mm", 1580, 600, 0.44, 1],
    ["mm+0.75", 960, 520, 0.92, 1, MOVE], ["areas", 960, 520, 0.95, 1], ["areas+0.6", 960, 560, 0.62, 1, MOVE], ["steps", 960, 560, 0.64, 1],
    ["steps+0.45", 960, 560, 0.5, 0, MOVE], ["w:more-0.05", 960, 600, 0.1, 0], ["w:more+0.8", 960, 600, 0.8, 1, MOVE], ["decide", 960, 600, 0.82, 1],
    ["decide+0.7", 1450, 560, 0.55, 1, MOVE], ["sign", 1450, 560, 0.56, 1], ["sign+0.8", 960, 420, 0.8, 0.6, MOVE], ["end", 960, 420, 0.84, 0.6],
  ]);
  const scanY = lerp(150, 900, T.k(g, "w:turns-0.05", 1.45, MOVE));
  const scanOn = g >= T.f("w:turns-0.1") && g < T.f("w:assessment+0.8");
  const ordered = g >= T.f("w:assessment+0.6") ? 1 : 0;
  const axis = T.k(g, "w:mind-0.1", 0.45, MOVE) * (1 - T.k(g, "w:picture", 0.4));
  const markK = T.k(g, "w:mind-0.02", 0.5, MOVE) * (1 - T.k(g, "steps", 0.3));

  // ---------------------------------------------------------------- colour fields: white → off-white for the method → lime for "not another label" → off-white → white
  const offR = 2300 * T.k(g, "steps-0.05", 0.6, MOVE);
  const limeR = 2300 * T.k(g, "w:not2-0.08", 0.5, MOVE);
  const off2R = 2300 * T.k(g, "w:more-0.08", 0.6, MOVE);
  const whiteR = 2300 * T.k(g, "sign-0.05", 0.7, MOVE);
  const [ax, ay, ar] = track(g, [["label-0.1", 290, 330, 50], ["label+0.5", 960, 600, 110, MOVE], ["decide", 960, 600, 110], ["decide+0.7", 1450, 560, 74, MOVE],
    ["sign", 1450, 560, 74], ["sign+0.8", 960, 400, 74, MOVE], ["end", 960, 400, 74]]);

  return (
    <>
      {offR > 0 && g < T.f("sign+0.8") && <Iris x={960} y={560} r={offR} bg={C.off} />}
      {limeR > 0 && g < T.f("w:more+0.7") && <Iris x={ax} y={ay} r={limeR} bg={C.lime} />}
      {off2R > 0 && g < T.f("sign+0.8") && <Iris x={ax} y={ay} r={off2R} bg={C.off} />}
      {whiteR > 0 && <Iris x={ax} y={ay} r={whiteR} bg={C.white} />}

      {/* 1 · you know what you're good at. But not always why. */}
      <Line g={g} x={140} y={250} size={108} out="mm-0.15" words={[{ t: "You", at: "w:you" }, { t: "know", at: "w:know" }, { t: "what", at: "w:what" }]} style={{ opacity: lerp(1, 0.32, T.k(g, "w:but", 0.4)) }} />
      <Line g={g} x={140} y={372} size={108} out="mm-0.12" words={[{ t: "you're", at: "w:you're" }, { t: "good", at: "w:good", color: C.olive }, { t: "at.", at: "w:at", color: C.olive }]}
        style={{ opacity: lerp(1, 0.32, T.k(g, "w:but", 0.4)) }} />
      {/* what you know: a check lands beside it */}
      {T.k(g, "w:at+0.2", 0.4) > 0 && <div style={{ position: "absolute", left: 140 + measure("you're good at.", 108) + 34, top: 386, opacity: lerp(1, 0.32, T.k(g, "w:but", 0.4)) * (1 - T.k(g, "mm-0.12", 0.3)),
        transform: `scale(${T.k(g, "w:at+0.2", 0.45, POP)})` }}><Check k={T.k(g, "w:at+0.2", 0.5)} size={84} /></div>}
      <Line g={g} x={140} y={560} size={108} out="mm-0.08" words={[{ t: "But", at: "w:but" }, { t: "not", at: "w:not" }, { t: "always", at: "w:always" }, { t: "why.", at: "w:why-0.04", mark: "w:why+0.18" }]} />

      {/* the figure: tangled beside "why", ordered by the scan line, then the thread of the film */}
      <Figure g={g} cx={fx} cy={fy} s={fs} order={ordered} scanY={scanOn ? scanY : ordered ? 1e9 : -1e9} opacity={fo} draw={T.k(g, "w:why-0.1", 0.9, MOVE)} />
      {axis > 0 && <div style={{ position: "absolute", left: 959, top: fy - 360 * fs, width: 3, height: 720 * fs, background: C.lime, transformOrigin: "50% 0", transform: `scaleY(${axis})` }} />}
      {scanOn && scanY > fy - 400 * fs && scanY < fy + 400 * fs && (
        <div style={{ position: "absolute", left: fx - 640 * fs, top: scanY - 2, width: 1280 * fs, height: 4, background: C.lime, borderRadius: 4, boxShadow: `0 0 0 6px rgba(171,203,82,.18)` }}>
          <div style={{ position: "absolute", left: -10, top: -8, width: 20, height: 20, borderRadius: 99, background: C.olive }} />
          <div style={{ position: "absolute", right: -10, top: -8, width: 20, height: 20, borderRadius: 99, background: C.olive }} />
        </div>
      )}
      <Mark x={fx} y={fy} w={210 * (fs / 0.92)} k={markK} />
      {g >= T.f("w:mirror-0.1") && g < T.f("w:patterns+0.6") && <div style={{ opacity: T.k(g, "w:mirror-0.05", 0.35) * (1 - T.k(g, "w:patterns", 0.4)) }}><Wordmark x={960} y={860} w={380} /></div>}
      <Roll g={g} at="w:clearer-0.05" h={44} style={{ position: "absolute", left: 0, top: 96, width: 1920, opacity: T.k(g, "w:assessment-0.2", 0.35) * (1 - T.k(g, "areas", 0.3)) }}
        a={<div style={{ width: 1920, display: "flex", justifyContent: "center" }}><Eyebrow>From your assessment</Eyebrow></div>}
        b={<div style={{ width: 1920, display: "flex", justifyContent: "center" }}><Eyebrow>A clearer picture</Eyebrow></div>} />
      {g >= T.f("w:picture-0.2") && g < T.f("areas+0.5") && (
        <div style={{ position: "absolute", right: 140, bottom: 92, fontSize: 32, fontWeight: 500, color: C.muted, opacity: T.k(g, "w:picture-0.1", 0.35) * (1 - T.k(g, "areas", 0.3)),
          transform: `translateY(${(1 - T.k(g, "w:picture-0.1", 0.45)) * 16}px)` }}>Complexity becomes clarity</div>
      )}

      <Areas g={g} />
      <Assessment g={g} />
      <Profile g={g} hideAvatar={g >= T.f("label-0.1")} />
      <Labels g={g} ax={ax} ay={ay} ar={ar} fx={fx} fy={fy} fs={fs} />
      <Decide g={g} />
      <Sign g={g} />
    </>
  );
};

// ---------------------------------------------------------------- 3 · how you focus, respond to pressure, stay driven and process information
const AREAS = [
  { at: "w:focus", x: 80, y: 96, num: "01", tag: "Attention, in context.", title: "Focus", chart: (k: number) => <FocusWave k={k} /> },
  { at: "w:pressure", x: 1348, y: 96, num: "03", tag: "Understand the shift.", title: "Pressure", chart: (k: number) => <PressureCurve k={k} /> },
  { at: "w:driven", x: 80, y: 616, num: "02", tag: "Find your momentum.", title: "Drive", chart: (k: number) => <DriveBars k={k} /> },
  { at: "w:process", x: 1348, y: 616, num: "05", tag: "Your way of making sense.", title: "Processing", chart: (k: number) => <ProcessingLoops k={k} /> },
];
const Areas: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("w:focus-0.2") || g > T.f("steps+0.7")) return null;
  const gather = T.k(g, "steps-0.08", 0.55, MOVE);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - gather }}>
        {AREAS.map((a, i) => {
          const k = T.k(g, off(a.at, 0.05), 0.45, MOVE);
          const tx = a.x + 246, ty = a.y + 185;
          const sx = lerp(960, tx, 0.42), sy = lerp(560, ty, 0.42);
          return <line key={i} x1={sx} y1={sy} x2={lerp(sx, lerp(960, tx, 0.78), k)} y2={lerp(sy, lerp(560, ty, 0.78), k)} stroke={C.lime} strokeWidth={3} strokeDasharray="8 8" />;
        })}
      </svg>
      {AREAS.map((a, i) => {
        const k = T.k(g, off(a.at, -0.12), 0.5, ARR);
        if (k <= 0) return null;
        const chartK = T.k(g, off(a.at, 0.2), 1.0, MOVE);
        const x = lerp(lerp(740, a.x, k), 740, gather), y = lerp(lerp(395, a.y, k), 260, gather);
        const sc = lerp(lerp(0.4, 1.12, k), 0.92, gather);
        return <InsightCard key={a.title} num={a.num} tag={a.tag} title={a.title} chart={a.chart(chartK)} tint={i % 3 === 0}
          style={{ left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${x}px, ${y}px) scale(${sc})`, opacity: Math.min(1, k * 1.8) * (1 - gather), filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined, willChange: "transform" }} />;
      })}
      {g >= T.f("areas") && <div style={{ position: "absolute", left: 0, top: 50, width: 1920, display: "flex", justifyContent: "center", opacity: T.k(g, "areas+0.1", 0.35) * (1 - gather) }}><Eyebrow>The areas of insight</Eyebrow></div>}
    </>
  );
};

// ---------------------------------------------------------------- 4 · one guided assessment. One visual profile.
const STEPS = [["01", "Assess", "w:one-0.05"], ["02", "Analyze", "w:one2-0.3"], ["03", "Understand", "w:visual-0.05"]] as const;
const ROWS = ["Focus", "Drive", "Pressure response", "Mental energy", "Processing style", "Adaptability"];
const CARD = { x: 560, y: 230, w: 800, h: 640 };
const Assessment: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("steps-0.1") || g > T.f("profile+1.2")) return null;
  const k = T.k(g, "steps+0.15", 0.5, ARR);
  const split = T.k(g, "w:visual-0.12", 0.6, MOVE);
  const scan = T.k(g, "w:one2-0.3", 0.45, MOVE);
  const stepsOut = T.k(g, "w:visual+0.15", 0.35);
  const prog = T.k(g, "w:guided", 1.2, LIN);
  const card = (clip?: string, dx = 0) => (
    <div style={{ position: "absolute", left: 0, top: 0, width: CARD.w, height: CARD.h, borderRadius: 30, background: C.white, border: `1.5px solid ${C.border}`, boxShadow: SHADOW,
      padding: "40px 52px", clipPath: clip, transform: `translate(${CARD.x + dx}px, ${CARD.y + (1 - k) * 40}px) scale(${lerp(0.92, 1, k)})`, opacity: Math.min(1, k * 1.6) * (1 - split * 0.9), willChange: "transform" }}>
      <Eyebrow style={{ fontSize: 24 }}>01 · Assess</Eyebrow>
      <div style={{ fontSize: 58, fontWeight: 500, letterSpacing: "-0.04em", marginTop: 16 }}>Guided assessment</div>
      <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
        {ROWS.map((r, i) => (
          <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 34, fontWeight: 500, color: T.k(g, off("w:guided", -0.1 + i * 0.17), 0.3) > 0.5 ? C.ink : C.muted }}>
            {r}<Check k={T.k(g, off("w:guided", -0.1 + i * 0.17), 0.35)} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 52, right: 52, bottom: 40, height: 10, borderRadius: 10, background: C.soft }}>
        <div style={{ width: `${prog * 100}%`, height: 10, borderRadius: 10, background: C.lime }} />
      </div>
      {/* 02 · Analyze: the scan line passes over the answers */}
      {scan > 0 && scan < 1 && <div style={{ position: "absolute", left: -20, right: -20, top: lerp(0, CARD.h, scan), height: 4, background: C.lime, boxShadow: "0 0 0 6px rgba(171,203,82,.2)" }} />}
    </div>
  );
  return (
    <>
      {/* their three steps, lit as the voice reaches them */}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: T.k(g, "steps+0.38", 0.3) * (1 - stepsOut) }}>
        <div style={{ position: "absolute", left: 560, top: 128, width: 800, height: 4, background: C.border }} />
        <div style={{ position: "absolute", left: 560, top: 128, width: 800 * lerp(0, 0.5, T.k(g, "w:one2-0.3", 0.4, MOVE)) + 400 * T.k(g, "w:visual-0.05", 0.4, MOVE), height: 4, background: C.lime }} />
        {STEPS.map(([n, s, at], i) => {
          const lit = T.k(g, at, 0.3);
          return (
            <div key={s} style={{ position: "absolute", left: 560 + i * 400 - 120, top: 100, width: 240, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 60, height: 60, borderRadius: 99, border: `2px solid ${lit > 0.5 ? C.lime : C.line}`, background: lit > 0.5 ? C.lime : C.white, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 24, fontWeight: 500, transform: `scale(${1 + 0.15 * Math.sin(lit * Math.PI)})` }}>{n}</div>
              <div style={{ fontSize: 34, fontWeight: 500, color: lit > 0.5 ? C.ink : C.muted }}>{s}</div>
            </div>
          );
        })}
      </div>
      {/* the card opens on its centre line into the profile */}
      {split <= 0 ? card() : <>{card(`inset(0 50% 0 0)`, -split * 620)}{card(`inset(0 0 0 50%)`, split * 620)}</>}
    </>
  );
};

// ---------------------------------------------------------------- 5 · your natural strengths, higher-effort areas, best conditions (their example profile)
const Profile: React.FC<{ g: number; hideAvatar: boolean }> = ({ g, hideAvatar }) => {
  if (g < T.f("w:visual-0.15") || g > T.f("label+0.6")) return null;
  const k = T.k(g, "w:visual-0.1", 0.6, ARR);
  const leave = T.k(g, "label-0.1", 0.55, MOVE);
  const nat = T.k(g, "w:natural-0.08", 0.45), hi = T.k(g, "w:higher-0.08", 0.45), cond = T.k(g, "w:conditions-0.15", 0.55, MOVE);
  const best = T.k(g, "w:best", 0.5);
  const rise = (v: number) => ({ opacity: Math.min(1, v * 1.6), transform: `translateY(${(1 - v) * 24}px)`, filter: v < 1 ? `blur(${(1 - v) * 6}px)` : undefined });
  return (
    <div style={{ position: "absolute", left: 200, top: 150, width: 1520, height: 800, borderRadius: 30, background: C.white, border: `1.5px solid ${C.border}`, boxShadow: SHADOW, overflow: "hidden",
      opacity: Math.min(1, k * 1.5) * (1 - leave), transform: `scale(${lerp(0.94, 1, k) * lerp(1, 0.7, leave)})`, transformOrigin: "90px 180px", willChange: "transform" }}>
      {/* sidebar */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 400, height: 800, background: C.off, borderRight: `1.5px solid ${C.border}`, padding: "40px 40px" }}>
        <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>MindMirror <span style={{ fontWeight: 400, color: C.muted }}>/ profile</span></div>
        <div style={{ width: 100, height: 100, borderRadius: 99, background: C.sage, marginTop: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 500, opacity: hideAvatar ? 0 : 1 }}>A</div>
        <div style={{ fontSize: 38, fontWeight: 500, letterSpacing: "-0.03em", marginTop: 22 }}>Alex’s MindMirror</div>
        <div style={{ display: "inline-block", marginTop: 14, fontSize: 28, fontWeight: 500, color: C.muted, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "6px 14px", background: C.white }}>Illustrative profile</div>
        <div style={{ marginTop: 48, fontSize: 22, fontWeight: 600, letterSpacing: "0.16em", color: C.muted }}>YOUR PATTERNS</div>
        {["Focus pattern", "Drive pattern", "Pressure response", "Processing style"].map((p, i) => (
          <div key={p} style={{ marginTop: i ? 6 : 16, fontSize: 30, fontWeight: 500, padding: "12px 16px", borderRadius: 12, background: i === 0 ? C.soft : "transparent", border: i === 0 ? `1.5px solid ${C.sage}` : "1.5px solid transparent" }}>{p}</div>
        ))}
      </div>
      {/* overview */}
      <div style={{ position: "absolute", left: 480, top: 44, right: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.16em", color: C.muted }}>YOUR PATTERN OVERVIEW</div>
        <div style={{ fontSize: 28, fontWeight: 500, color: C.ink, borderBottom: `3px solid ${C.lime}` }}>Example, not a result</div>
      </div>
      <div style={{ position: "absolute", left: 480, top: 100, width: 1000, height: 300, borderRadius: 20, border: `1.5px solid ${C.border}`, background: "#FAFBF8" }}>
        <div style={{ position: "absolute", left: 28, top: 22, fontSize: 28, fontWeight: 500 }}>Focus pattern</div>
        <div style={{ position: "absolute", left: 70, top: 60 }}><FocusWave k={T.k(g, "w:profile", 1.2, MOVE)} w={860} h={200} peak={best} /></div>
        <div style={{ position: "absolute", left: 28, bottom: 18, fontSize: 28, fontWeight: 500, color: C.muted }}>Exploration</div>
        <div style={{ position: "absolute", right: 28, bottom: 18, fontSize: 28, fontWeight: 500, color: C.muted }}>Sustained attention</div>
      </div>
      <div style={{ position: "absolute", left: 480, top: 440, width: 480, ...rise(nat) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 500, color: C.muted }}><span style={{ width: 14, height: 14, borderRadius: 99, background: C.lime }} />Natural strengths</div>
        <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 10 }}>Staying with a complex idea</div>
        <div style={{ height: 6, borderRadius: 6, background: C.lime, marginTop: 10, width: 470, transformOrigin: "0 50%", transform: `scaleX(${T.k(g, "w:strengths", 0.4, MOVE)})` }} />
      </div>
      <div style={{ position: "absolute", left: 1000, top: 440, width: 480, ...rise(hi) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 500, color: C.muted }}><span style={{ width: 14, height: 14, borderRadius: 99, border: `3px solid ${C.olive}` }} />Higher-effort areas</div>
        <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 10 }}>Frequent changes of context</div>
        <div style={{ height: 0, borderTop: `5px dashed ${C.olive}`, marginTop: 12, width: 470, transformOrigin: "0 50%", transform: `scaleX(${T.k(g, "w:areas", 0.4, MOVE)})` }} />
      </div>
      <div style={{ position: "absolute", left: 480, top: 590, width: 1000, height: 160, borderRadius: 20, background: C.soft, border: `1.5px solid ${C.sage}`, transformOrigin: "0 50%",
        transform: `scaleX(${lerp(0.2, 1, cond)})`, opacity: Math.min(1, cond * 2), display: "flex", alignItems: "center", gap: 28, padding: "0 36px" }}>
        <svg width={56} height={56} viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: cond }}><path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z" fill="none" stroke={C.olive} strokeWidth={1.8} /></svg>
        <div style={{ opacity: Math.max(0, cond * 2 - 1) }}>
          <div style={{ fontSize: 28, fontWeight: 500, color: C.muted }}>Best working conditions</div>
          <div style={{ fontSize: 42, fontWeight: 500, letterSpacing: "-0.03em", marginTop: 6 }}>Protected time for deep work</div>
        </div>
        <div style={{ marginLeft: "auto" }}><Check k={best} size={56} /></div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 6 · not another label. More context about the way you work.
const TAGS = [
  { t: "Introvert", x: 330, y: 500, r: -8, from: [-700, -200], at: "w:another-0.12" },
  { t: "Type A", x: 1250, y: 430, r: 7, from: [900, -260], at: "w:another+0.06" },
  { t: "Perfectionist", x: 1110, y: 790, r: -5, from: [800, 500], at: "w:label-0.12" },
];
const CHIPS = [["Focus", 470, 330], ["Drive", 1330, 300], ["Pressure", 330, 700], ["Energy", 1420, 640], ["Processing", 1180, 900], ["Adaptability", 560, 900]] as const;
const Labels: React.FC<{ g: number; ax: number; ay: number; ar: number; fx: number; fy: number; fs: number }> = ({ g, ax, ay, ar }) => {
  if (g < T.f("label-0.1") || g > T.f("end")) return null;
  const fade = 1 - T.k(g, "w:mind2-0.05", 0.4);
  const chipsOut = T.k(g, "decide-0.1", 0.4, MOVE);
  return (
    <>
      <Line g={g} x={140} y={100} size={120} out="w:more-0.12" words={[{ t: "Not", at: "w:not2" }, { t: "another", at: "w:another" }, { t: "label.", at: "w:label" }]} />
      {TAGS.map((tg) => {
        const k = T.k(g, tg.at, 0.45, POP);
        if (k <= 0) return null;
        const strike = T.k(g, "w:label+0.08", 0.3, MOVE);
        const fall = T.k(g, "w:label+0.45", 0.65, OUT);
        if (fall >= 1) return null;
        return (
          <div key={tg.t} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${tg.x + tg.from[0] * (1 - k)}px, ${tg.y + tg.from[1] * (1 - k) + fall * 900}px) rotate(${tg.r + fall * 30}deg)`, willChange: "transform",
            display: "flex", alignItems: "center", gap: 18, padding: "18px 34px 18px 24px", borderRadius: "16px 40px 40px 16px", background: C.white, boxShadow: SHADOW, fontSize: 48, fontWeight: 500, letterSpacing: "-0.02em" }}>
            <span style={{ width: 18, height: 18, borderRadius: 99, border: `3px solid ${C.muted}` }} />
            <span style={{ position: "relative" }}>{tg.t}<span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 6, borderRadius: 6, background: C.ink, transformOrigin: "0 50%", transform: `scaleX(${strike})` }} /></span>
          </div>
        );
      })}
      {/* the person, then context round them: their figure grows back, and the six areas around it */}
      <Line g={g} x={140} y={100} size={120} out="decide-0.12" words={[{ t: "More", at: "w:more" }, { t: "context.", at: "w:context", color: C.olive }]} />
      <Line g={g} x={146} y={250} size={52} weight={500} color={C.muted} ls={-0.02} out="decide-0.1"
        words={[{ t: "about", at: "w:about" }, { t: "the", at: "w:the2" }, { t: "way", at: "w:way" }, { t: "you", at: "w:you4" }, { t: "work.", at: "w:work" }]} />
      {CHIPS.map(([c, x, y], i) => {
        const k = T.k(g, off("w:context", -0.1 + i * 0.2), 0.45, POP);
        if (k <= 0 || chipsOut >= 1) return null;
        return <div key={c} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(ax - 80, x, k * (1 - chipsOut))}px, ${lerp(ay - 30, y, k * (1 - chipsOut))}px) scale(${k * (1 - chipsOut)})`, willChange: "transform" }}>
          <Chip size={34} on={T.k(g, off("w:context", 0.1 + i * 0.2), 0.3)}>{c}</Chip></div>;
      })}
      <div style={{ position: "absolute", left: ax - ar, top: ay - ar, width: 2 * ar, height: 2 * ar, borderRadius: 99, background: C.sage, border: `${Math.max(4, ar * 0.06)}px solid #fff`, boxShadow: SHADOW,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: ar * 0.8, fontWeight: 500, opacity: fade }}>A</div>
    </>
  );
};

// ---------------------------------------------------------------- 7 · so you can understand yourself better and make decisions with more perspective
const Decide: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("decide-0.1") || g > T.f("sign+0.6")) return null;
  return (
    <>
      <Line g={g} x={140} y={250} size={96} out="sign-0.15" words={[{ t: "Understand", at: "w:understand" }, { t: "yourself", at: "w:yourself" }]} />
      <Line g={g} x={140} y={362} size={96} out="sign-0.12" words={[{ t: "better.", at: "w:better", color: C.olive }]} />
      <Line g={g} x={140} y={560} size={96} out="sign-0.09" words={[{ t: "Make", at: "w:make" }, { t: "decisions", at: "w:decisions" }, { t: "with", at: "w:with" }]} />
      <Line g={g} x={140} y={672} size={96} out="sign-0.06" words={[{ t: "more", at: "w:more2" }, { t: "perspective.", at: "w:perspective", mark: "w:perspective+0.2" }]} />
    </>
  );
};

// ---------------------------------------------------------------- 8 · MindMirror. See how your mind works.
const Sign: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("sign")) return null;
  const S = 104;
  const words = [["See", "w:see"], ["how", "w:how2"], ["your", "w:your5"], ["mind", "w:mind3"], ["works.", "w:works"]] as const;
  const W = words.reduce((a, [t]) => a + measure(t, S), 0) + 0.26 * S * (words.length - 1);
  const btn = T.k(g, "w:works+0.35", 0.5);
  const scan = T.k(g, "w:mirror2-0.1", 0.7, MOVE);
  return (
    <>
      <Mark x={960} y={400} w={240} k={T.k(g, "w:mind2-0.05", 0.55, MOVE)} />
      {scan > 0 && scan < 1 && <div style={{ position: "absolute", left: 360, width: 1200, top: lerp(220, 600, scan), height: 4, background: C.lime, boxShadow: "0 0 0 6px rgba(171,203,82,.2)" }} />}
      <div style={{ opacity: T.k(g, "w:mirror2-0.05", 0.4), transform: `translateY(${(1 - T.k(g, "w:mirror2-0.05", 0.5)) * 20}px)` }}><Wordmark x={960} y={560} w={380} /></div>
      <Line g={g} x={960 - W / 2} y={730} size={S} words={words.map(([t, at]) => ({ t, at, color: t === "works." ? C.olive : undefined }))} />
      <div style={{ position: "absolute", left: 0, top: 890, width: 1920, display: "flex", justifyContent: "center", opacity: btn, transform: `translateY(${(1 - btn) * 24}px)` }}>
        <div style={{ background: C.lime, color: C.ink, fontSize: 40, fontWeight: 500, padding: "24px 44px", borderRadius: 14, boxShadow: SHADOW }}>Book your MindMirror Scan</div>
      </div>
    </>
  );
};
