import React from "react";
import { Img, staticFile } from "remotion";
import { C, MOVE, Pill, SHADOW, lerp } from "./lib";
import { Disc, Iris, Line, LIN, POP, Roll, T, measure, off } from "./kit";

// 7.6–45 s. His red takes the frame when he comes in; coaching opens out of a person on his plan; a red line
// rises like a curtain onto his stage; the mark on "stick." floods the frame red for the numbers; two hundred
// dots become the one organiser; the viewer's idea comes back and becomes a result; his red closes the film.

const RED = C.red;                       // flat, like his brand: a large gradient bands into rings under the camera push
const SAND = "#EDE6DC";
const NIGHT = "#141210";
const Check: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = C.green }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const bleed = (clip: string | undefined, bg: string | undefined, children: React.ReactNode) => (
  <div style={{ position: "absolute", left: -300, top: -300, width: 2520, height: 1680, background: bg, clipPath: clip }}>
    <div style={{ position: "absolute", left: 300, top: 300, width: 1920, height: 1080 }}>{children}</div>
  </div>
);

// ---------------------------------------------------------------- 3 · he comes in: red out of the card, then into his label
const DOCK = { x: 140, y: 106, r: 46 };
export const Turn: React.FC<{ g: number }> = ({ g }) => {
  const grow = T.k(g, "w:that's-0.08", 0.55, MOVE), shrink = T.k(g, "consult", 0.7, MOVE);
  const r = lerp(0, 2300, grow) * (1 - shrink);
  const cx = lerp(960, DOCK.x, shrink), cy = lerp(535, DOCK.y, shrink);
  return (
    <Iris x={cx} y={cy} r={r} bg={RED}>
      <Line g={g} x={140} y={280} size={64} weight={600} color="#fff" out="consult" words={[{ t: "That's", at: "w:that's" }, { t: "where", at: "w:where" }]} />
      <Line g={g} x={130} y={380} size={172} color="#fff" out="consult" words={[{ t: "Bruno", at: "w:bruno-0.05" }]} />
      <Line g={g} x={130} y={556} size={172} color="#fff" out="consult+0.05" words={[{ t: "Morgante", at: "w:morgante-0.05" }]} />
      <Line g={g} x={140} y={790} size={64} weight={600} color="#fff" out="consult+0.1" words={[{ t: "comes", at: "w:comes" }, { t: "in.", at: "w:in" }]} />
    </Iris>
  );
};
/** His photo: arrives big on the red, then travels into the consulting label and stays with his work. */
export const Dock: React.FC<{ g: number }> = ({ g }) => {
  const k = T.k(g, "w:bruno-0.15", 0.5), d = T.k(g, "consult", 0.7, MOVE);
  if (k <= 0) return null;
  const x = lerp(1440, DOCK.x, d), y = lerp(540, DOCK.y, d), r = lerp(320, DOCK.r, d) * lerp(0.8, 1, k);
  return <Disc src="bruno-portrait.jpg" x={x} y={y} r={r} pos="50% 32%" zoom={lerp(1.08, 1, T.k(g, "w:bruno", 2.2, LIN))} ring={lerp(10, 4, d)}
    style={{ opacity: Math.min(1, k * 1.6), filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined }} />;
};

// ---------------------------------------------------------------- 5 · coaching opens out of one person on his plan
const GROUP = [[650, 590], [690, 715], [800, 640], [560, 770]];
export const Coach: React.FC<{ g: number }> = ({ g }) => {
  const r = 2300 * T.k(g, "coach-0.12", 0.7, MOVE);
  const ph = T.k(g, "coach+0.12", 0.6);
  const arc = T.k(g, "w:mentor", 0.9, MOVE);
  const one = T.k(g, "w:coach:one-0.05", 0.4, POP), link = T.k(g, "w:coach:to", 0.35, MOVE);
  const grp = (i: number) => T.k(g, off("w:groups", -0.05, 0.06 * i), 0.45, POP);
  const track = T.k(g, "w:coach:from-0.1", 0.45, MOVE);
  const knob = T.k(g, "w:executives", 1.75, MOVE);
  const univX = 1780 - measure("University students", 48, 700, -0.02);
  return (
    <Iris x={998} y={496} r={r} bg={SAND}>
      <div style={{ position: "absolute", left: 140, top: 106, fontWeight: 700, fontSize: 30, color: "#fff", background: C.red, padding: "10px 22px", borderRadius: 99,
        opacity: T.k(g, "coach+0.3", 0.3), transform: `translateX(${(1 - T.k(g, "coach+0.3", 0.45)) * -24}px)` }}>Coaching & Mentoring</div>
      <Line g={g} x={140} y={190} size={150} words={[{ t: "Coach", at: "w:coach-0.05" }]} />
      <Line g={g} x={140} y={350} size={150} words={[{ t: "&", at: "w:coach:and" }, { t: "mentor", at: "w:mentor-0.05", red: true }]} />
      {/* his photo, with a red ring drawn round it on "mentor" */}
      <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, ph * 1.6), transform: `scale(${lerp(0.82, 1, ph)})`, transformOrigin: "1380px 470px", filter: ph < 1 ? `blur(${(1 - ph) * 10}px)` : undefined }}>
        <Disc src="bruno-speaking.jpg" x={1380} y={470} r={380} pos="58% 22%" zoom={lerp(1.14, 1.04, T.k(g, "coach", 7, LIN))} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={1380} cy={470} r={414} fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={`${0.72 * arc} 1`}
            transform={`rotate(${-120 + T.k(g, "w:mentor", 6, LIN) * 40} 1380 470)`} />
        </svg>
      </div>
      {/* one to one, then a group */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={256} y1={650} x2={lerp(256, 444, link)} y2={650} stroke={C.ink} strokeWidth={4} />
        {GROUP.map(([x, y], i) => { const k = grp(i); return k > 0 && <line key={i} x1={256} y1={650} x2={lerp(500, x, Math.min(1, k))} y2={lerp(650, y, Math.min(1, k))} stroke={C.stone} strokeWidth={3} strokeDasharray="8 8" />; })}
      </svg>
      {T.k(g, "w:works-0.1", 0.4) > 0 && <Disc src="bruno-portrait.jpg" x={200} y={650} r={56} pos="50% 32%" ring={4}
        style={{ transform: `scale(${T.k(g, "w:works-0.1", 0.45, POP)})` }} />}
      {GROUP.map(([x, y], i) => {
        const k = grp(i);
        if (k <= 0) return null;
        return <div key={i} style={{ position: "absolute", left: lerp(500, x, Math.min(1, k)) - 42, top: lerp(650, y, Math.min(1, k)) - 42, width: 84, height: 84, borderRadius: 99, transform: `scale(${k})`,
          background: [C.stonePale, C.redPale, "#E3D6C6", C.greenPale][i], border: "4px solid #fff", boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 26 }}>
          {["AK", "JL", "MS", "TR"][i]}</div>;
      })}
      {one > 0 && <div style={{ position: "absolute", left: 444, top: 594, width: 112, height: 112, borderRadius: 99, background: C.ink, color: "#fff", display: "flex", alignItems: "center",
        justifyContent: "center", fontWeight: 700, fontSize: 32, border: "4px solid #fff", boxShadow: SHADOW, transform: `scale(${one})` }}>You</div>}
      <Roll g={g} at="w:groups-0.08" h={80} style={{ position: "absolute", left: 140, top: 732, width: 760 }}
        a={<Line g={g} x={0} y={12} size={56} weight={700} words={[{ t: "One", at: "w:coach:one" }, { t: "to", at: "w:coach:to" }, { t: "one", at: "w:one2" }]} />}
        b={<Line g={g} x={0} y={12} size={56} weight={700} words={[{ t: "In", at: "w:groups-0.1" }, { t: "groups", at: "w:groups-0.1", red: true }]} />} />
      {/* from executives to university students: the range, and a knob that travels it */}
      <Line g={g} x={140} y={900} size={48} weight={700} ls={-0.02} words={[{ t: "Executives", at: "w:executives-0.05" }]} />
      <Line g={g} x={univX} y={900} size={48} weight={700} ls={-0.02} words={[{ t: "University", at: "w:university-0.05" }, { t: "students", at: "w:students-0.05" }]} />
      <div style={{ position: "absolute", left: 140, top: 987, width: 1640, height: 6, borderRadius: 6, background: "#D3CABD", transformOrigin: "0 50%", transform: `scaleX(${track})` }} />
      <div style={{ position: "absolute", left: 140, top: 987, width: 1640 * knob, height: 6, borderRadius: 6, background: C.red }} />
      {track > 0.5 && <div style={{ position: "absolute", left: 140 + 1640 * knob - 20, top: 970, width: 40, height: 40, borderRadius: 99, background: C.red, border: "5px solid #fff", boxShadow: SHADOW,
        transform: `scale(${T.k(g, "w:executives-0.1", 0.35, POP)})` }} />}
    </Iris>
  );
};

// ---------------------------------------------------------------- 6 · the red line rises like a curtain onto his stage
export const Stage: React.FC<{ g: number }> = ({ g }) => {
  const rise = T.k(g, "stage-0.05", 0.65, MOVE);
  const lineY = lerp(990, -80, rise);
  const zoom = lerp(1.14, 1.04, T.k(g, "stage", 5.2, LIN));
  return (
    <>
      {bleed(`inset(${lineY + 300}px 0 0 0)`, NIGHT, (
        <>
          <div style={{ position: "absolute", left: -300, top: -300, width: 2520, height: 1680, overflow: "hidden" }}>
            <Img src={staticFile("img/bruno-stage-blue.jpg")} style={{ position: "absolute", left: 300, top: 300, width: 1920, height: 1080, objectFit: "cover", objectPosition: "70% 10%",
              transform: `scale(${zoom})`, transformOrigin: "70% 16%", filter: "saturate(.34) sepia(.2) brightness(.98) contrast(1.05)" }} />
          </div>
          <div style={{ position: "absolute", inset: -300, background: "linear-gradient(90deg, rgba(20,18,16,.96) 0%, rgba(20,18,16,.96) 18%, rgba(20,18,16,.72) 42%, rgba(20,18,16,0) 66%)" }} />
          <Line g={g} x={140} y={160} size={140} color="#fff" words={[{ t: "On", at: "w:on-0.05" }, { t: "stage,", at: "w:stage-0.05" }]} />
          <Line g={g} x={140} y={378} size={56} weight={600} color="#E9E6E1" ls={-0.02} words={[{ t: "his", at: "w:his" }, { t: "keynotes", at: "w:keynotes" }, { t: "turn", at: "w:turn" }]} />
          <Roll g={g} at="w:into" dur={0.42} h={150} style={{ position: "absolute", left: 140, top: 452, width: 1100 }}
            a={<Line g={g} x={0} y={14} size={124} color="#8E877E" words={[{ t: "hard", at: "w:hard" }, { t: "lessons", at: "w:lessons" }]} />}
            b={<Line g={g} x={0} y={14} size={124} color="#fff" words={[{ t: "stories", at: "w:into" }]} />} />
          <Line g={g} x={140} y={620} size={124} color="#fff" words={[{ t: "that", at: "w:that" }, { t: "stick.", at: "w:stick-0.05", mark: "w:stick+0.12" }]} />
        </>
      ))}
      {rise > 0 && rise < 1 && <div style={{ position: "absolute", left: -300, right: -300, top: lineY - 3, height: 6, background: C.red }} />}
    </>
  );
};
export const STICK = (() => {
  const s = 124;
  return () => ({ x: 140 + measure("that", s) + 0.26 * s - s * 0.1, y: 620 + s * 0.06, w: measure("stick.", s) + s * 0.2, h: s * 1.04 });
})();

// ---------------------------------------------------------------- 7 · the mark floods red: 20 years, then 200 people
const COLW = 0.64;                       // digit slot, in em
const Digit: React.FC<{ v: number; size: number }> = ({ v, size }) => (
  <div style={{ width: size * COLW, height: size, overflow: "hidden", position: "relative", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)" }}>
    <div style={{ position: "absolute", left: 0, top: -v * size, filter: `blur(${0}px)` }}>
      {Array.from({ length: 21 }, (_, i) => <div key={i} style={{ height: size, lineHeight: `${size}px`, textAlign: "center" }}>{i % 10}</div>)}
    </div>
  </div>
);
const DOTS = Array.from({ length: 200 }, (_, i) => [i % 20, Math.floor(i / 20)]);
const P = { x: 232, y: 935 };
export const Proof: React.FC<{ g: number }> = ({ g }) => {
  const flood = T.k(g, "proof-0.12", 0.5, MOVE);
  const m = STICK();
  const box = { x: lerp(m.x, -300, flood), y: lerp(m.y, -300, flood), w: lerp(m.w, 2520, flood), h: lerp(m.h, 1680, flood) };
  const shrink = T.k(g, "quote", 0.85, MOVE);
  const leave = T.k(g, "quote-0.1", 0.35);
  const S = 360;
  const tens = 2 * T.k(g, "w:twenty-0.05", 0.75, MOVE), ones = 10 * T.k(g, "w:twenty-0.05", 0.75, MOVE);
  const third = T.k(g, "w:two-0.05", 0.5, MOVE);
  const counterY = 130;
  return (
    <>
      {shrink <= 0 ? (
        <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: lerp(12, 0, flood), background: RED }} />
      ) : (
        <Iris x={P.x} y={P.y} r={2300 * (1 - shrink)} bg={RED} />
      )}
      {/* the word stays on top of its mark as the mark floods the frame, then gives way to the numbers */}
      {flood < 0.6 && <div style={{ position: "absolute", left: m.x + 124 * 0.1, top: 620, fontWeight: 800, fontSize: 124, lineHeight: 1, letterSpacing: "-0.04em", color: "#fff",
        opacity: 1 - flood / 0.6, transform: `scale(${1 + flood * 0.25})`, transformOrigin: "50% 50%" }}>stick.</div>}
      {flood > 0.6 && leave < 1 && (
        <div style={{ position: "absolute", inset: 0, color: "#fff", opacity: 1 - leave, transform: `translateY(${-leave * 40}px)`, filter: leave > 0 ? `blur(${leave * 8}px)` : undefined }}>
          <div style={{ position: "absolute", left: 110, top: counterY, display: "flex", fontWeight: 800, fontSize: S, lineHeight: 1, letterSpacing: "-0.04em",
            opacity: T.k(g, "w:twenty-0.1", 0.25) }}>
            <Digit v={tens} size={S} /><Digit v={ones} size={S} />
            <div style={{ width: S * COLW * third, overflow: "hidden" }}><div style={{ opacity: third, transform: `translateY(${(1 - third) * S * 0.6}px)` }}><Digit v={lerp(6, 10, third)} size={S} /></div></div>
            <div style={{ opacity: T.k(g, "w:years-0.1", 0.3), marginLeft: S * 0.02 }}>+</div>
          </div>
          <Roll g={g} at="w:more-0.05" h={90} style={{ position: "absolute", left: 120, top: counterY + S + 40, width: 1000 }}
            a={<Line g={g} x={0} y={14} size={64} weight={700} color="#fff" ls={-0.02} words={[{ t: "years", at: "w:years" }, { t: "of", at: "w:of" }, { t: "leading", at: "w:leading" }, { t: "projects", at: "w:projects" }]} />}
            b={<Line g={g} x={0} y={14} size={64} weight={700} color="#fff" ls={-0.02} words={[{ t: "people", at: "w:proof:people" }, { t: "mentored", at: "w:mentored" }]} />} />
          {["badge-top25-coaching", "badge-top10-pm"].map((b, i) => {
            const k = T.k(g, `w:mentored+${(0.15 + i * 0.12).toFixed(2)}`, 0.5);
            return <Img key={b} src={staticFile(`img/${b}.png`)} style={{ position: "absolute", left: 1190 + i * 310, top: 600 + (1 - k) * 120, width: 280, borderRadius: 16, boxShadow: "0 30px 60px -20px rgba(0,0,0,.4)", opacity: k }} />;
          })}
        </div>
      )}
      {/* two hundred people, one dot each; then they gather into the one organiser */}
      {g >= T.f("w:two-0.1") && T.k(g, "w:quote:one", 0.5) < 1 && DOTS.map(([c, rw], i) => {
        const k = T.k(g, off("w:two", -0.05, c * 0.035 + rw * 0.025), 0.35, POP);
        const gather = T.k(g, off("quote", ((i % 37) * 3) / 500), 0.62, MOVE);
        const x = lerp(1190 + c * 30, P.x, gather), y = lerp(185 + rw * 30, P.y, gather);
        return <div key={i} style={{ position: "absolute", left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 99, background: "#fff", transform: `scale(${k * (1 - gather * 0.5)})`, opacity: 0.95 }} />;
      })}
    </>
  );
};

// ---------------------------------------------------------------- 8 · one organiser's words; "speaker" gives way to "experience"
export const Quote: React.FC<{ g: number }> = ({ g }) => {
  const q = T.k(g, "w:quote:in+0.2", 0.6);
  const gz = T.k(g, "quote+0.55", 0.4);
  return bleed(undefined, C.canvas, (
    <>
      <div style={{ position: "absolute", left: 112, top: 40, fontWeight: 800, fontSize: 360, lineHeight: 1, color: C.red, opacity: q, transform: `rotate(${(1 - q) * -12}deg) scale(${lerp(0.7, 1, q)})`, transformOrigin: "30% 60%" }}>“</div>
      <Line g={g} x={140} y={290} size={108} out="w:got-0.2" words={[{ t: "Not", at: "w:not" }, { t: "just", at: "w:just" }, { t: "a", at: "w:quote:a" }]} />
      <Line g={g} x={140} y={414} size={108} out="w:got-0.16" words={[{ t: "keynote", at: "w:keynote" }, { t: "speaker,", at: "w:speaker", strike: "w:a2-0.08" }]} />
      <Line g={g} x={140} y={538} size={108} out="w:got-0.12" words={[{ t: "he", at: "w:a2-0.05" }, { t: "is", at: "w:a2+0.05" }, { t: "a", at: "w:a2+0.12" }, { t: "keynote", at: "w:keynote2" }]} />
      <Line g={g} x={140} y={662} size={108} out="w:got-0.08" words={[{ t: "experience.", at: "w:experience-0.05", mark: "w:experience+0.15" }]} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - T.k(g, "w:got-0.2", 0.3) }}>
        <Disc src="grzegorz-ras.jpg" x={P.x} y={P.y} r={62} pos="50% 22%" ring={4} style={{ opacity: gz, transform: `scale(${lerp(0.4, 1, gz)})` }} />
        <Line g={g} x={330} y={890} size={40} weight={700} ls={-0.02} words={[{ t: "Grzegorz Ras", at: "w:organizer-0.1" }]} />
        <Line g={g} x={330} y={944} size={30} weight={600} ls={-0.01} color={C.ink2} words={[{ t: "Host & Organizer, PAM Summit 2025, Kraków", at: "w:organizer+0.1" }]} />
      </div>
      <Cta g={g} />
    </>
  ));
};

// ---------------------------------------------------------------- 9 · the idea comes back, becomes a result; then "Let's talk"
const CTA_CARD = { x: 580, y: 300, w: 760, h: 310 };
const Cta: React.FC<{ g: number }> = ({ g }) => {
  const drop = T.k(g, "w:got-0.05", 0.6, POP);
  if (drop <= 0) return null;
  const straight = T.k(g, "w:result", 0.45, MOVE);
  const rot = lerp(-8, -2.5, drop) * (1 - straight);
  const S = 110, gap = 40;
  const wIdea = measure("Idea", S), wRes = measure("Result", S), arrowW = 150;
  const x0 = 960 - (wIdea + arrowW + wRes + 2 * gap) / 2;
  const arrow = T.k(g, "w:become-0.05", 0.4, MOVE);
  return (
    <>
      <div style={{ position: "absolute", left: CTA_CARD.x, top: lerp(-420, CTA_CARD.y, drop), width: CTA_CARD.w, height: CTA_CARD.h, borderRadius: 26, background: C.paper, boxShadow: SHADOW,
        border: `1px solid ${C.line}`, transform: `rotate(${rot}deg)`, padding: "38px 44px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 600, fontSize: 30, color: C.ink2 }}>Your next project</div>
          <Roll g={g} at="w:result-0.02" h={52} a={<Pill tone="stone" size={26}>Idea</Pill>}
            b={<span style={{ display: "inline-block", transform: `scale(${1 + 0.14 * Math.sin(T.k(g, "w:result+0.1", 0.4) * Math.PI)})` }}><Pill tone="green" size={26}>Result <Check size={24} /></Pill></span>} />
        </div>
        <div style={{ fontWeight: 700, fontSize: 64, lineHeight: 1.12, letterSpacing: "-0.03em", marginTop: 22 }}>Launch the new platform</div>
      </div>
      <Line g={g} x={x0} y={720} size={S} words={[{ t: "Idea", at: "w:cta:idea-0.05" }]} />
      <svg width={arrowW} height={S} style={{ position: "absolute", left: x0 + wIdea + gap, top: 720 }}>
        <line x1={6} y1={S * 0.56} x2={6 + (arrowW - 20) * arrow} y2={S * 0.56} stroke={C.ink} strokeWidth={12} strokeLinecap="round" />
        {arrow > 0.85 && <path d={`M${arrowW - 46},${S * 0.56 - 30} L${arrowW - 12},${S * 0.56} L${arrowW - 46},${S * 0.56 + 30}`} fill="none" stroke={C.ink} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      <Line g={g} x={x0 + wIdea + arrowW + 2 * gap} y={720} size={S} words={[{ t: "Result", at: "w:result-0.05", red: true }]} />
    </>
  );
};
export const Talk: React.FC<{ g: number }> = ({ g }) => {
  const r = 2300 * T.k(g, "w:let's-0.12", 0.6, MOVE);
  const ph = T.k(g, "w:let's", 0.6);
  const btn = T.k(g, "w:talk+0.3", 0.5);
  return (
    <Iris x={960} y={455} r={r} bg={RED}>
      <div style={{ position: "absolute", left: 140, top: 170, width: 150, height: 150, borderRadius: 36, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 30px 60px -24px rgba(0,0,0,.5)", opacity: T.k(g, "w:let's", 0.35), transform: `translateY(${(1 - T.k(g, "w:let's", 0.5)) * 30}px)` }}>
        <Img src={staticFile("img/bm-logo.png")} style={{ width: 132, height: 132 }} />
      </div>
      <Line g={g} x={130} y={380} size={200} color="#fff" words={[{ t: "Let's", at: "w:let's-0.05" }]} />
      <Line g={g} x={130} y={580} size={200} color="#fff" words={[{ t: "talk.", at: "w:talk-0.05" }]} />
      <div style={{ position: "absolute", left: 140, top: 850, display: "flex", alignItems: "center", gap: 18, padding: "22px 40px", borderRadius: 99, background: "#fff", color: C.ink,
        fontWeight: 700, fontSize: 44, opacity: btn, transform: `translateY(${(1 - btn) * 30}px)`, boxShadow: "0 30px 60px -24px rgba(0,0,0,.45)" }}>
        brunomorgante.com
        <svg width={40} height={40} viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke={C.red} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <Disc src="bruno-smile.jpg" x={1370} y={540} r={370} pos="63% 30%" zoom={lerp(1.6, 1.5, T.k(g, "w:let's", 3, LIN))} ring={10}
        style={{ opacity: Math.min(1, ph * 1.6), transform: `scale(${lerp(0.8, 1, ph)})`, filter: ph < 1 ? `blur(${(1 - ph) * 10}px)` : undefined }} />
    </Iris>
  );
};
