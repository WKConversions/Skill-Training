import React from "react";
import { T } from "./clock";
import { Badge, Calendar, Cup, DeskTop, Laptop, Notebook, Phone, SCREEN, Sheet, Sticky, Tablet } from "./Desk";
import { ARRIVE, DEPART, EASE, lerp } from "./kinetic";
import { C, FONT } from "./lib";
import { Agent, Automation, BookForm, Business, FormCards, Orders, PhoneApp, Sketch, WebApp } from "./Screens";

// K.B · the desk. One top-down desk is the whole film: the business's own work and K.B's badge placed among it.
// Things are placed, picked up and thrown into the screens; the camera only breathes (Film.tsx). Every move takes
// the speed graph that fits it (library: motion/speed-graphs.md): A1 whips into a screen, cut on the fastest frame;
// A2 drop-throughs where one screen replaces another; B3 soft landings; B9 follow-through; B11 lines drawing;
// B13 steps; B2 the badge's last long move. No overshoot, no bounce.

const cl = (t: number) => Math.min(1, Math.max(0, t));
const F = (pos: string) => T.f(pos);
/** progress over `n` frames from frame `a` */
const kf = (g: number, a: number, n: number, ease: (t: number) => number = ARRIVE) => ease(cl((g - a) / n));
/** A1 with unequal sides: before `cut` the thrown thing speeds up over n0 frames, after it the arriving thing slows
 *  over n1 (n1 = n0 × its distance / the thrown distance, so the speed matches across the cut). */
const toss = (g: number, cut: number, n0: number, n1: number) =>
  g < cut ? { side: 0 as const, k: EASE.whipIn(cl((g - (cut - n0)) / n0)) } : { side: 1 as const, k: EASE.whipOut(cl((g - cut) / n1)) };
/** the arriving side's progress only (0 before the cut) */
const landed = (g: number, cut: number, n1: number) => (g < cut ? 0 : EASE.whipOut(cl((g - cut) / n1)));
/** A2 drop-through between two screens: before `cut` the old content falls out (speeding up), after it the new
 *  content falls in from above (slowing). Returns the old/new offsets in px and which one shows. */
const drop = (g: number, cut: number, n = 8, H = 485) =>
  g < cut ? { show: 0, y: EASE.whipIn(cl((g - (cut - n)) / n)) * H } : { show: 1, y: -(1 - EASE.whipOut(cl((g - cut) / n))) * H };
const P = (a: [number, number], b: [number, number], k: number): [number, number] => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

// ---------------------------------------------------------------- where things are
const ROW_Y = (i: number) => SCREEN.y + 148 + i * 86;                      // a list row's centre in the frame
const GATE = (y: number): [number, number] => [SCREEN.x + 12, y];          // the screen's left edge
const BADGE: [number, number] = [1715, 175];

export const Story: React.FC<{ g: number }> = ({ g }) => {
  // ============================================================ 1 · move faster, not hold it back
  // three order sheets slide onto the desk and are thrown into the screen, each quicker than the last
  const sheetsIn = [
    { a: -8, n: 20, rest: [330, 600, -4], cut: F("w:make") + 6, n0: 10, n1: 14 },
    { a: 14, n: 18, rest: [345, 655, 3], cut: F("w:move") + 4, n0: 8, n1: 11 },
    { a: 34, n: 16, rest: [318, 625, -2], cut: F("w:faster") + 4, n0: 7, n1: 10 },
  ];
  const rowArrive = sheetsIn.map((s) => landed(g, s.cut, s.n1));
  // the next sheet stops short and the work piles up on it; a note "by hand" on top
  const pileIn = [
    { a: F("w:not"), from: [-240, 650], rest: [330, 640, -3], drop: false },
    { a: F("w:hold"), from: [300, 620], rest: [340, 628, 4], drop: true },
    { a: F("w:hold") + 4, from: [330, 640], rest: [322, 650, -6], drop: true },
    { a: F("w:hold") + 8, from: [345, 630], rest: [336, 638, 2], drop: true },
  ];
  const row3 = kf(g, F("w:not") + 2, 14, EASE.whipOut);                     // the next row arrives, waiting
  // ============================================================ 2 · K.B helps companies build smarter systems
  const badgeIn = kf(g, F("w:kb") - 4, 20);
  const pileCuts = [0, 1, 2, 3].map((i) => F("w:build") + 1 + i * 3);      // the pile goes in, one sheet after another
  const done3 = g >= pileCuts[0] + 10 ? 1 : 0;
  const gather = kf(g, F("w:systems") - 3, 10, EASE.longS);
  const tiles = [0, 1, 2].map((i) => kf(g, F("w:systems") + i * 3, 8));
  const arrows = kf(g, F("w:systems") + 4, 8, EASE.steady);
  // ============================================================ 3 · with software, automation and AI (the screen drops through)
  const cutSoft = F("w:software") + 2, cutAuto = F("w:automation") + 4, cutAI = F("w:ai") + 3, cutPlan = F("w:implementation") - 12;
  // ============================================================ 4 · from strategy to implementation
  const nbIn = kf(g, F("w:from") - 4, 20, EASE.soft), nbOut = kf(g, F("w:we") - 6, 12, DEPART);
  const draw = kf(g, F("w:strategy") + 2, 22, EASE.steady);
  const partCuts = [0, 1, 2, 3, 4].map((i) => F("w:implementation") + 2 + i * 3);
  const partFrom: [number, number][] = [[175, 592], [255, 688], [255, 748], [255, 808], [165, 859]];
  const partGate: [number, number][] = [[SCREEN.x + 12, SCREEN.y + 60], [SCREEN.x + 12, SCREEN.y + 154], [SCREEN.x + 12, SCREEN.y + 246], [SCREEN.x + 12, SCREEN.y + 338], [SCREEN.x + 12, SCREEN.y + 434]];
  // ============================================================ 5 · complex ideas into practical solutions
  const notes = [
    { t: "CRM?", bg: C.sticky1, at: [250, 345, -8] },
    { t: "invoices", bg: C.sticky2, at: [415, 372, 7] },
    { t: "follow-ups", bg: C.sticky3, at: [270, 505, 4] },
    { t: "support", bg: C.sticky1, at: [432, 525, -6] },
  ];
  const noteIn = notes.map((_, i) => kf(g, F("w:complex") - 6 + i * 5, 14));
  const phoneIn = kf(g, F("w:practical") - 20, 18, EASE.soft);
  const PHONE: [number, number] = [330, 800];
  const noteCuts = notes.map((_, i) => F("w:practical") + 2 + i * 5);
  const btnGate = (i: number): [number, number] => [PHONE[0] - 105 + 12, PHONE[1] - 235 + 10 + 112 + i * 76 + 31];
  // ============================================================ 6 · that work inside your business
  const press = kf(g, F("w:work") - 2, 10, EASE.easy);
  const cutBiz = F("w:inside") - 8;
  const dockCuts = [0, 1, 2, 3].map((i) => F("w:inside") + 2 + i * 3);
  const people = cl((g - (F("w:your2") - 2)) / 7) * 3 + cl((g - (F("w:grows") + 4)) / 8) * 2;
  // ============================================================ 7 · we connect workflows
  const tabIn = kf(g, F("w:we2") - 10, 18, EASE.soft);
  const TAB: [number, number] = [330, 360];
  const cables = [0, 1, 2].map((i) => kf(g, F("w:connect") + i * 5, 12, EASE.steady));
  // ============================================================ 8 · automate repetitive processes
  const stepper = EASE.lead(cl((g - F("w:automate")) / 6)) + EASE.lead(cl((g - F("w:repetitive")) / 5)) + EASE.lead(cl((g - (F("w:repetitive") + 9)) / 4));
  const flow = Math.max(0, g - F("w:processes")) / 10;                       // then it runs by itself, steadily
  const auto = kf(g, F("w:processes"), 10, EASE.sweep);
  const leaveL = kf(g, F("w:and2") - 6, 12, DEPART);                      // tablet and phone leave
  const unplug = kf(g, F("w:and2") - 8, 8, DEPART);
  // ============================================================ 9 · technology that grows with you
  const tilesGrow = [kf(g, F("w:technology2") - 4, 12), kf(g, F("w:technology2") + 2, 12)];
  const sideIn = [kf(g, F("w:grows") - 6, 20, EASE.soft), kf(g, F("w:grows"), 20, EASE.soft)];
  const sideOut = kf(g, F("w:and3") - 4, 12, DEPART);
  const cupOut = kf(g, F("w:grows") - 10, 12, DEPART);
  // ============================================================ 10–11 · we stay involved, continuously improving
  const calIn = kf(g, F("w:and3") + 2, 20, EASE.soft), calOut = kf(g, F("w:kb2") - 10, 12, DEPART);
  const marks = [0, 1, 2, 3].map((i) => kf(g, F("w:stay") + 1 + i * 5, 7));
  const flip = kf(g, F("w:continuously") - 2, 14, EASE.easy);
  const marks2 = [0, 1, 2, 3].map((i) => kf(g, F("w:continuously") + 14 + i * 4, 6));
  const better = kf(g, F("w:improving") - 2, 18, EASE.soft);
  const needIn = kf(g, F("w:as") - 2, 14);
  const needCut = F("w:evolve") + 2;
  // ============================================================ 12–15 · K.B, the partner; the sign-off
  const lapOut = kf(g, F("w:kb2") - 8, 16, DEPART);
  const toMiddle = kf(g, F("w:kb2") - 4, 30, EASE.longS);
  const word = (pos: string) => kf(g, F(pos) - 3, 12);

  // ---------------------------------------------------------------- the laptop's screen
  const orders = (
    <Orders rows={[rowArrive[0], rowArrive[1], rowArrive[2], row3]} status={[1, 1, 1, done3]} gather={gather} tiles={tiles} arrows={arrows} count={7} />
  );
  const sectionsDocked = dockCuts.map((c) => landed(g, c, 8));
  const reports = landed(g, needCut, 12);
  const business = <Business side={sectionsDocked} tiles={[1, 1, tilesGrow[0], tilesGrow[1], reports]} people={people} auto={auto} better={better} />;
  const screens: [number, React.ReactNode, number][] = [
    [0, orders, 8],
    [cutSoft, <WebApp key="w" bars={kf(g, cutSoft + 4, 16)} />, 6],
    [cutAuto, <Automation key="a" pulse={kf(g, cutAuto + 4, 16, EASE.steady)} />, 6],
    [cutAI, <Agent key="i" q={kf(g, cutAI + 2, 8)} typed={Math.max(0, g - (cutAI + 8)) * 1.6} />, 6],
    [cutPlan, <BookForm key="b" parts={partCuts.map((c) => landed(g, c, 12))} />, 8],
    [cutBiz, business, 8],
  ];
  let si = 0;
  for (let i = 0; i < screens.length; i++) if (g >= screens[i][0] - screens[i][2]) si = i;     // the screen in play (its drop starts n frames before its cut)
  const screen = (() => {
    if (si === 0) return screens[0][1];
    const d = drop(g, screens[si][0], screens[si][2]);
    const node = d.show === 0 ? screens[si - 1][1] : screens[si][1];
    return <div data-probe={`screen${si}-${d.show}`} style={{ position: "absolute", inset: 0, transform: `translateY(${d.y}px)` }}>{node}</div>;
  })();

  // ---------------------------------------------------------------- the desk
  const lapY = 478 + lapOut * 1250;
  const thrown: React.ReactNode[] = [];

  // order sheets (and the pile) → the list
  sheetsIn.forEach((s, i) => {
    const t = toss(g, s.cut, s.n0, s.n1);
    if (t.side === 1) return;
    const arr = kf(g, s.a, s.n, EASE.soft);
    const rest: [number, number] = [lerp(-240, s.rest[0], arr), s.rest[1]];
    const [x, y] = P(rest, GATE(ROW_Y(i)), t.k);
    thrown.push(<Sheet key={`s${i}`} name={`sheet${i}`} x={x} y={y} r={lerp(s.rest[2], 0, t.k)} s={lerp(1, 0.32, t.k)} lift={t.k > 0 ? 0.6 : 0} z={20 + i} />);
  });
  pileIn.forEach((p, i) => {
    if (g < p.a - 2) return;
    const t = toss(g, pileCuts[i], 7, 10);
    if (t.side === 1) return;
    const k = kf(g, p.a, p.drop ? 10 : 16, p.drop ? ARRIVE : EASE.soft);
    const rest: [number, number] = p.drop ? [p.rest[0], p.rest[1]] : [lerp(p.from[0], p.rest[0], k), p.rest[1]];
    const [x, y] = P(rest, GATE(ROW_Y(3)), t.k);
    thrown.push(<Sheet key={`p${i}`} name={`pile${i}`} x={x} y={y} r={lerp(p.rest[2], 0, t.k)} s={lerp(p.drop ? lerp(1.12, 1, k) : 1, 0.32, t.k)}
      lift={p.drop ? (1 - k) * 0.9 + (t.k > 0 ? 0.6 : 0) : t.k > 0 ? 0.6 : 0} o={p.drop ? cl(k * 3) : 1} z={30 + i} />);
  });
  const byHand = kf(g, F("w:back") - 2, 12), byHandOut = kf(g, F("w:build") - 2, 10, DEPART);
  if (byHand > 0 && byHandOut < 1)
    thrown.push(<Sticky key="hand" name="byhand" text="by hand" bg={C.sticky2} size={150} x={lerp(350, -160, byHandOut)} y={lerp(560, 300, byHandOut)} r={lerp(9, -20, byHandOut)}
      s={lerp(1.1, 1, byHand)} lift={(1 - byHand) * 0.9 + byHandOut * 0.6} o={cl(byHand * 3)} z={40} />);

  // the notebook and its sketch → the booking form
  const nb: [number, number] = [lerp(-260, 300, nbIn) - nbOut * 560, lerp(1240, 720, nbIn) + nbOut * 200];
  const lifted = partCuts.map((c) => (g >= c - 9 ? 1 : 0));
  if (nbIn > 0 && nbOut < 1)
    thrown.push(<Notebook key="nb" name="notebook" x={nb[0]} y={nb[1]} r={3} z={10}><Sketch draw={draw} lifted={lifted} /></Notebook>);
  partCuts.forEach((c, i) => {
    const t = toss(g, c, 9, 12);
    if (t.side === 1 || g < c - 9) return;
    const [x, y] = P(partFrom[i], partGate[i], t.k);
    thrown.push(
      <div key={`part${i}`} data-probe={`part${i}`} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) scale(${lerp(1, 0.8, t.k)})`, zIndex: 25 }}>
        {i === 0 ? <div style={{ transform: "translate(-70px, -30px)", fontFamily: "Hand KB", fontSize: 44, color: C.cyanDeep, whiteSpace: "nowrap" }}>book a call</div>
          : <div style={{ transform: `translate(${i === 4 ? -60 : -150}px, ${i === 4 ? -17 : -22}px)`, width: i === 4 ? 120 : 300, height: i === 4 ? 34 : 44, borderRadius: i === 4 ? 17 : 8,
            border: `4px solid ${C.cyan}`, background: "rgba(228,246,254,.6)" }} />}
      </div>,
    );
  });

  // sticky notes → the phone's app → docked inside the business's system
  notes.forEach((n, i) => {
    if (noteIn[i] <= 0) return;
    const t = toss(g, noteCuts[i], 8, 10);
    if (t.side === 1) return;
    const rest: [number, number] = [lerp(-180, n.at[0], noteIn[i]), lerp(n.at[1] - 60, n.at[1], noteIn[i])];
    const wob = Math.sin((g - F("w:ideas")) / 9 + i) * (g > F("w:ideas") ? 1.5 : 0);
    const [x, y] = P(rest, btnGate(i), t.k);
    thrown.push(<Sticky key={`n${i}`} name={`note${i}`} text={n.t} bg={n.bg} x={x} y={y} r={lerp(n.at[2] + wob, 0, t.k)} s={lerp(1, 0.38, t.k)} lift={(1 - noteIn[i]) * 0.5 + (t.k > 0 ? 0.6 : 0)} z={30 + i} />);
  });
  const btn = noteCuts.map((c) => landed(g, c, 10));
  const phoneX = lerp(-240, PHONE[0], phoneIn) - leaveL * 620;
  const docking = dockCuts.map((c) => toss(g, c, 12, 8));
  dockCuts.forEach((c, i) => {
    const t = docking[i];
    if (t.side === 1 || t.k <= 0) return;
    const from = btnGate(i), to: [number, number] = [SCREEN.x + 12, SCREEN.y + 146 + i * 64];
    const [x, y] = P([from[0] + 89, from[1]], to, t.k);
    thrown.push(<div key={`dock${i}`} data-probe={`dock${i}`} style={{ position: "absolute", left: 0, top: 0, width: 160, height: 54, borderRadius: 14, background: C.cyanSoft, zIndex: 26,
      transform: `translate(${x - 80}px, ${y - 27}px) scale(${lerp(1, 0.9, t.k)})`, boxShadow: "0 12px 24px -12px rgba(41,58,81,.4)", fontFamily: FONT,
      display: "flex", alignItems: "center", padding: "0 14px", fontSize: 24, fontWeight: 700, color: C.navy }}>{["CRM", "Invoices", "Follow-ups", "Support"][i]}</div>);
  });
  const btnLeft = btn;                                                         // the app stays on the phone; copies dock into the laptop

  // cables between the devices, with data running along them
  const cablePts: [number, number][][] = [
    [[TAB[0] + 200, TAB[1]], [570, TAB[1]], [600, 300], [690, 300]],
    [[PHONE[0] + 115, PHONE[1]], [570, PHONE[1]], [600, 740], [690, 740]],
    [[TAB[0], TAB[1] + 145], [TAB[0], 540], [PHONE[0], 540], [PHONE[0], PHONE[1] - 235]],
  ];
  const cablePaths = cablePts.map(([a, b, c, d]) => `M ${a[0]} ${a[1]} C ${b[0]} ${b[1]}, ${c[0]} ${c[1]}, ${d[0]} ${d[1]}`);
  const onCable = (i: number, t: number): [number, number] => {
    const [a, b, c, d] = cablePts[i], u = 1 - t;
    return [0, 1].map((j) => u * u * u * a[j] + 3 * u * u * t * b[j] + 3 * u * t * t * c[j] + t * t * t * d[j]) as [number, number];
  };

  return (
    <>
      <div style={{ position: "absolute", left: -120, top: -120, width: 2160, height: 1320 }}><DeskTop /></div>

      {/* the cup: a calm detail on the right */}
      {cupOut < 1 && <Cup name="cup" x={1725 + cupOut * 500} y={860} r={0} />}

      {/* the main laptop */}
      <Laptop name="laptop" x={1100} y={lapY} z={5}
        sticky={null}>{screen}</Laptop>

      {/* the side laptops: the system grows with the team */}
      {sideIn[0] > 0 && sideOut < 1 && (
        <Laptop name="laptopL" x={lerp(-420, 330, sideIn[0]) - sideOut * 760} y={600} r={6} s={0.42} z={6}>
          <div style={{ position: "absolute", inset: 0 }}><Business side={[1, 1, 1, 1]} tiles={[1, 1, 1, 1, 0]} people={4} auto={1} /></div>
        </Laptop>
      )}
      {sideIn[1] > 0 && sideOut < 1 && (
        <Laptop name="laptopR" x={lerp(2340, 1710, sideIn[1]) + sideOut * 760} y={640} r={-6} s={0.42} z={6}>
          <div style={{ position: "absolute", inset: 0 }}><Business side={[1, 1, 1, 1]} tiles={[1, 1, 1, 1, 0]} people={5} auto={1} /></div>
        </Laptop>
      )}

      {/* the tablet and the phone */}
      {tabIn > 0 && leaveL < 1 && (
        <Tablet name="tablet" x={lerp(-300, TAB[0], tabIn) - leaveL * 620} y={TAB[1]} r={-3} z={12}>
          <FormCards step={stepper + flow} auto={auto} />
        </Tablet>
      )}
      {phoneIn > 0 && leaveL < 1 && (
        <Phone name="phone" x={phoneX} y={PHONE[1]} r={-4} lift={0} z={12}>
          <PhoneApp buttons={btnLeft} press={press} />
        </Phone>
      )}
      {cables[0] > 0 && unplug < 1 && (
        <svg data-probe="cables" width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, zIndex: 11, overflow: "visible" }}>
          {cablePaths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={C.cyan} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1"
              strokeDashoffset={1 - cables[i] * (1 - unplug)} opacity={0.95} />
          ))}
          {g > F("w:connect") + 16 && [0, 1, 2].map((i) => {
            const speed = g > F("w:processes") ? 1 / 14 : 1 / 30;
            const p = ((g - F("w:connect")) * speed + i * 0.33) % 1;
            const [cx, cy] = onCable(i % 2, p);
            return <circle key={i} r={9} fill={C.white} stroke={C.cyanDeep} strokeWidth={4} cx={cx} cy={cy} opacity={1 - unplug} />;
          })}
        </svg>
      )}

      {/* the calendar: K.B there every week */}
      {calIn > 0 && calOut < 1 && (
        <Calendar name="calendar" x={lerp(-280, 330, calIn) - calOut * 700} y={640} r={3} month={"October"} marks={marks} flip={flip}
          next={{ month: "November", marks: marks2 }} z={8} />
      )}

      {/* a new need: a note on the laptop → the reports tile */}
      {(() => {
        if (needIn <= 0) return null;
        const t = toss(g, needCut, 9, 12);
        if (t.side === 1) return null;
        const [x, y] = P([1290, 800], [SCREEN.x + 495, SCREEN.y + 478], t.k);
        return <Sticky name="need" text="reports?" bg={C.sticky1} size={150} x={x} y={y} r={lerp(7, 0, t.k)} s={lerp(lerp(1.1, 1, needIn), 0.4, t.k)} lift={(1 - needIn) * 0.8 + (t.k > 0 ? 0.6 : 0)} z={30} />;
      })()}

      {thrown}

      {/* K.B's badge: placed at the desk, and what stays */}
      {badgeIn > 0 && (() => {
        const [bx, by] = P([lerp(2050, BADGE[0], badgeIn), lerp(-180, BADGE[1], badgeIn)], [960, 392], toMiddle);
        const sz = lerp(1, 340 / 150, toMiddle);
        return <Badge name="badge" x={bx} y={by} r={lerp(lerp(-13, -6, badgeIn), 0, toMiddle)} s={sz} lift={(1 - badgeIn) * 1 + Math.sin(Math.PI * toMiddle) * 0.5} z={50} />;
      })()}

      {/* the sign-off: the badge and the words */}
      {g >= F("w:your4") - 4 && (
        <div data-probe="line1" style={{ position: "absolute", left: 0, top: 640, width: 1920, display: "flex", justifyContent: "center", gap: 22, fontSize: 68, fontWeight: 800, color: C.navy,
          letterSpacing: "-0.03em", zIndex: 60 }}>
          {[["Your", "w:your4"], ["technical", "w:technical"], ["partner", "w:partner"]].map(([w, at]) => (
            <span key={w} style={{ display: "inline-block", opacity: word(at), transform: `translateY(${(1 - word(at)) * 26}px)` }}>{w}</span>
          ))}
        </div>
      )}
      {g >= F("w:building") - 4 && (() => {
        const d = drop(g, F("w:systems2") - 1, 9, 140);
        const line1 = (
          <div style={{ display: "flex", justifyContent: "center", gap: 26, fontSize: 58, fontWeight: 700, color: C.cyanDeep }}>
            {[["Building", "w:building"], ["running", "w:running"], ["improving", "w:improving2"]].map(([w, at], i) => (
              <span key={w} style={{ display: "inline-flex", gap: 26, opacity: word(at), transform: `translateY(${(1 - word(at)) * 22}px)` }}>
                {i > 0 && <span style={{ color: C.cyan }}>·</span>}
                <span style={{ position: "relative" }}>{w}
                  <span style={{ position: "absolute", left: 0, bottom: -6, height: 9, borderRadius: 5, background: C.cyan, opacity: 0.55,
                    width: `${100 * kf(g, F(at) + 4, 10, EASE.steady)}%` }} />
                </span>
              </span>
            ))}
          </div>
        );
        const line2 = <div style={{ textAlign: "center", fontSize: 58, fontWeight: 700, color: C.navy2 }}>the systems behind your business.</div>;
        return (
          <div data-probe="line2" style={{ position: "absolute", left: 0, top: 748, width: 1920, height: 100, overflow: "hidden", zIndex: 60 }}>
            <div style={{ position: "absolute", left: 0, top: 10, width: 1920, transform: `translateY(${d.y}px)` }}>{d.show === 0 ? line1 : line2}</div>
          </div>
        );
      })()}
      {g >= F("cta") && (() => {
        const k = kf(g, F("cta"), 18);
        return (
          <div data-probe="cta" style={{ position: "absolute", left: 960 - 330, top: 868 + (1 - k) * 30, width: 660, height: 92, borderRadius: 46, background: C.cyan, opacity: k, zIndex: 60,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 800, color: C.white, boxShadow: "0 20px 40px -20px rgba(14,143,196,.6)" }}>
            Book a free discovery call
          </div>
        );
      })()}
    </>
  );
};
