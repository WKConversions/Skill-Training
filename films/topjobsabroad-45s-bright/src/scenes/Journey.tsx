import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { DOCS, JOBS, MATCH, STEPS } from "../data";
import { CITY_XY } from "../europe";
import { EuropeMap } from "../Map";
import { ARRIVE, C, Cam, Check, DEPART, GOLD, Headline, LINEAR, MOVE, P, POP, SANS, SERIF, SHADOW, bez, bezAngle, card, clamp01, keys, lerp, tw } from "../lib";
import { PAN_OUT } from "./Help";

// 4b START TO END 790–1066
//   790 the page pans left; the map comes in with it. You is in Copenhagen, the role is in Athens.
//   800 "From the start through to the end"  a plane flies the route; their six steps light up along it
//        as it passes, the camera travelling with it.
//   880 "Top Jobs Abroad is there for you."  the recruiter rides alongside all the way; the plane lands.
//   940 "Supporting you with the required documents"  the camera pushes into Athens; the paperwork fans
//        out of the pin and is stamped done, one by one.
//  1000 "and your relocation where needed."  a circle opens out of the pin into Athens itself; the new
//        home slides in. Welcome to Athens.
//  1056 a whip pan to the next scene.

const A: P = CITY_XY.copenhagen, B: P = CITY_XY.athens;
const P1: P = [960, 520], P2: P = [1180, 900];
const at = (t: number) => bez(A, P1, P2, B, t);
export const WHIP: [number, number] = [1056, 1076];

const Plane: React.FC<{ x: number; y: number; deg: number }> = ({ x, y, deg }) => (
  <svg width={84} height={84} viewBox="0 0 24 24" style={{ position: "absolute", left: x - 42, top: y - 42, rotate: `${deg + 90}deg`, filter: "drop-shadow(0 10px 12px rgba(0,17,53,.3))" }}>
    <path d="M12 2c.8 0 1.4.9 1.4 2v5.2l7.6 4.4v2l-7.6-2.3v4.9l2.3 1.7V21L12 20l-3.7 1v-1.1l2.3-1.7v-4.9L3 15.6v-2l7.6-4.4V4c0-1.1.6-2 1.4-2z" fill={C.navy} />
  </svg>
);

export const Journey: React.FC<{ g: number }> = ({ g }) => {
  if (g < PAN_OUT[0] || g > WHIP[1] + 2) return null;
  const enter = (1 - tw(g, PAN_OUT[0], PAN_OUT[1], 0, 1, MOVE)) * 1920;
  const whip = tw(g, WHIP[0], WHIP[1], 0, 1, MOVE) * -1920;

  const pt = tw(g, 818, 906, 0, 1, MOVE);
  const [px, py] = at(pt);
  const camX = keys(g, [[816, 760], [906, 1060], [944, 1369], [1000, 1369]]);
  const camY = keys(g, [[816, 440], [906, 840], [944, 822], [1000, 812]]);
  const camS = keys(g, [[816, 1.12], [906, 1.3], [944, 1.9], [1000, 2.02]]);
  const toScreen = (p: P): P => [960 + (p[0] - camX) * camS, 540 + (p[1] - camY) * camS];
  const athens = toScreen(B);

  // the route: a faint dotted guide, and the gold line the plane lays down
  const guide = tw(g, 812, 830, 0, 1, MOVE);
  const trail: P[] = [], full: P[] = [];
  for (let k = 0; k <= 60; k++) { const t = k / 60; full.push(at(t)); if (t <= pt) trail.push(at(t)); }
  trail.push([px, py]);

  const reveal = tw(g, 1000, 1034, 0, 1, MOVE);

  return (
    <AbsoluteFill style={{ translate: `${enter + whip}px 0px` }}>
      <AbsoluteFill style={{ background: C.page }} />
      <Cam x={camX} y={camY} s={camS}>
        <EuropeMap m={{ x: 0, y: 0, s: 1 }} />
        <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
          <polyline points={full.slice(0, Math.max(2, Math.round(guide * 60) + 1)).map((p) => p.join(",")).join(" ")} fill="none" stroke={C.navy} strokeOpacity={0.3}
            strokeWidth={5} strokeLinecap="round" strokeDasharray="1 12" />
          <polyline points={trail.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.gold} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* the six steps along the way */}
        {STEPS.map((s, i) => {
          const t = i / 5, [x, y] = at(t);
          const lit = tw(g, 818 + t * 88 - 4, 818 + t * 88 + 8, 0, 1, POP);
          const side = 1;
          const gone = tw(g, 932, 942, 0, 1, DEPART);
          return (
            <React.Fragment key={s}>
              <div style={{ position: "absolute", left: x - 15, top: y - 15, width: 30, height: 30, borderRadius: 15, background: lit > 0.5 ? C.gold : C.white, border: `4px solid ${C.gold}`,
                boxSizing: "border-box", scale: String(0.8 + 0.3 * lit), opacity: guide }} />
              {lit > 0 && i > 0 && i < 5 && (
                <div style={{ position: "absolute", top: y - 30, left: side > 0 ? x + 34 : undefined, right: side < 0 ? 1920 - x + 34 : undefined, display: "flex", alignItems: "center", gap: 12,
                  background: C.white, borderRadius: 16, padding: "10px 18px", boxShadow: SHADOW, whiteSpace: "nowrap", opacity: clamp01(lit) * (1 - gone), translate: `${(1 - clamp01(lit)) * side * -30}px ${-gone * 30}px` }}>
                  <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 18, color: C.goldInk, letterSpacing: "0.1em" }}>0{i + 1}</span>
                  <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, color: C.ink }}>{s}</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
        {/* You, in Copenhagen */}
        <div style={{ position: "absolute", left: A[0] - 40, top: A[1] - 40, width: 80, height: 80, borderRadius: "50%", background: C.navy, color: C.white, fontFamily: SANS, fontWeight: 800,
          fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", border: `5px solid ${C.goldHi}`, boxSizing: "border-box", boxShadow: SHADOW }}>You</div>
        <div style={{ position: "absolute", left: A[0] + 52, top: A[1] - 24, background: C.white, borderRadius: 14, padding: "8px 16px", boxShadow: SHADOW, fontFamily: SANS, fontWeight: 800, fontSize: 24,
          color: C.ink, whiteSpace: "nowrap", opacity: 1 - tw(g, 932, 942, 0, 1, DEPART) }}><span style={{ color: C.goldInk }}>01 </span>{STEPS[0]}</div>
        {/* Athens */}
        <div style={{ position: "absolute", left: B[0] - 44, top: B[1] - 44, width: 88, height: 88, borderRadius: "50%", overflow: "hidden", border: "5px solid #fff", boxShadow: SHADOW,
          scale: String(tw(g, 812, 828, 0.6, 1, ARRIVE)) }}>
          <Img src={staticFile("photos/athens.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {g > 904 && g < 940 && [0, 1].map((r) => {
          const k = clamp01((g - 904 - r * 9) / 24);
          return <div key={r} style={{ position: "absolute", left: B[0] - 44 - 50 * k, top: B[1] - 44 - 50 * k, width: 88 + 100 * k, height: 88 + 100 * k, borderRadius: "50%", border: `3px solid ${C.gold}`, opacity: 1 - k }} />;
        })}
        <div style={{ position: "absolute", left: B[0] + 58, top: B[1] - 26, background: C.white, borderRadius: 14, padding: "8px 16px", boxShadow: SHADOW, fontFamily: SANS, fontWeight: 800, fontSize: 24,
          color: C.ink, whiteSpace: "nowrap", opacity: tw(g, 896, 906, 0, 1, LINEAR) * (1 - tw(g, 936, 944, 0, 1, LINEAR)) }}><span style={{ color: C.goldInk }}>06 </span>{STEPS[5]}</div>
        {/* the plane, and the recruiter riding alongside */}
        {pt > 0 && pt < 1 && <Plane x={px} y={py} deg={bezAngle(A, P1, P2, B, pt)} />}
        {pt > 0 && (() => {
          const [rx, ry] = at(Math.max(0, pt - 0.07));
          const k = tw(g, 832, 846, 0, 1, ARRIVE) * (1 - tw(g, 930, 940, 0, 1, DEPART));
          return k > 0 && (
            <div style={{ position: "absolute", right: 1920 - rx + 40, top: ry - 36, display: "flex", alignItems: "center", gap: 12, background: C.white, borderRadius: 999, padding: "6px 20px 6px 6px",
              boxShadow: SHADOW, opacity: k, scale: String(lerp(0.8, 1, k)), whiteSpace: "nowrap" }}>
              <span style={{ width: 58, height: 58, borderRadius: 29, overflow: "hidden", border: `3px solid ${C.goldHi}` }}>
                <Img src={staticFile("people/recruiter.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 30%", scale: "1.7", transformOrigin: "52% 32%" }} />
              </span>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, color: C.ink }}>Your recruiter</span>
            </div>
          );
        })()}
      </Cam>

      <Headline g={g} at={806} out={934} x={120} y={130} size={92} lines={[[{ w: "From" }, { w: "the" }, { w: "start" }], [{ w: "to", gold: true }, { w: "the", gold: true }, { w: "end.", gold: true }]]} />
      <Headline g={g} at={884} out={934} x={120} y={352} size={48} gap={2} lines={[[{ w: "We’re" }, { w: "there" }, { w: "for" }, { w: "you." }]]} />

      {/* the paperwork, fanned out of the pin and stamped done */}
      {g >= 940 && reveal < 1 && (
        <>
          <div style={{ position: "absolute", left: 100, top: 92, fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.22em", color: C.goldInk, textTransform: "uppercase",
            opacity: tw(g, 944, 954, 0, 1, LINEAR), background: C.page, borderRadius: 999, padding: "14px 22px", boxShadow: SHADOW }}>Required documents</div>
          {DOCS.map((d, i) => {
            const t0 = 946 + i * 5;
            const k = tw(g, t0, t0 + 20, 0, 1, ARRIVE);
            const tx = 470 + i * 490, ty = 330 + (i === 1 ? -40 : 0);
            const x = lerp(athens[0], tx, k), y = lerp(athens[1], ty, k);
            const stamp = tw(g, 962 + i * 9, 972 + i * 9, 0, 1, ARRIVE);
            const hit = g - (972 + i * 9);
            const shake = hit > 0 && hit < 10 ? Math.sin(hit * 2.4) * (10 - hit) * 0.8 : 0;
            return (
              <div key={d} style={{ ...card({ left: x - 200 + shake, top: y - 110, width: 400, height: 220, padding: "30px 32px", scale: String(lerp(0.7, 1, k)), opacity: clamp01(k * 2),
                rotate: `${(i - 1) * 4 * k}deg` }) }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: C.goldPale, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={34} height={34} viewBox="0 0 24 24"><path d={["M4 5h16v14H4zM8 9h5M8 13h8M8 16h6", "M3 9l9-5 9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18", "M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6z"][i]}
                    fill="none" stroke={C.goldInk} strokeWidth={1.9} strokeLinejoin="round" strokeLinecap="round" /></svg>
                </div>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.ink, marginTop: 22, whiteSpace: "nowrap" }}>{d}</div>
                {stamp > 0 && (
                  <div style={{ position: "absolute", right: 22, top: 22, width: 92, height: 92, borderRadius: "50%", border: `4px solid ${C.gold}`, color: C.goldInk, display: "flex", alignItems: "center",
                    justifyContent: "center", scale: String(lerp(2.2, 1, stamp)), opacity: clamp01(stamp * 1.5), rotate: "-14deg", background: "rgba(251,243,220,.9)" }}>
                    <Check k={1} size={52} />
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* relocation: a circle opens out of the pin into Athens */}
      {reveal > 0 && (
        <div style={{ position: "absolute", inset: 0, clipPath: `circle(${lerp(40, 2300, reveal)}px at ${athens[0]}px ${athens[1]}px)` }}>
          <Img src={staticFile("photos/athens.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%",
            scale: String(lerp(1.35, 1.06, reveal) + 0.05 * tw(g, 1034, 1076, 0, 1, LINEAR)) }} />
          <div style={{ ...card({ left: 1080 + (1 - tw(g, 1012, 1036, 0, 1, ARRIVE)) * 900, top: 170, width: 700, height: 480, overflow: "hidden", rotate: "3deg", padding: 0 }) }}>
            <Img src={staticFile("people/unpacking.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          {g >= 1022 && (
            <div style={{ position: "absolute", left: 1150, top: 610, display: "flex", alignItems: "center", gap: 14, background: C.white, borderRadius: 999, padding: "14px 26px 14px 16px",
              boxShadow: SHADOW, transformOrigin: "50% -60px", rotate: `${Math.sin((g - 1022) / 5) * 14 * Math.exp(-(g - 1022) / 14)}deg`, scale: String(tw(g, 1022, 1034, 0.6, 1, ARRIVE)) }}>
              <Check k={tw(g, 1026, 1040, 0, 1, ARRIVE)} size={40} />
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.ink }}>Finding an apartment</span>
            </div>
          )}
          <div style={{ ...card({ left: 120, top: 800 + (1 - tw(g, 1018, 1040, 0, 1, ARRIVE)) * 300, padding: "26px 40px", display: "flex", alignItems: "center", gap: 22 }) }}>
            <Img src={staticFile(`img/flag-${JOBS[MATCH].flag}.png`)} style={{ width: 54, height: 40, borderRadius: 5 }} />
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 64, color: C.navy }}>Welcome to <span style={{ color: C.goldInk }}>Athens.</span></span>
          </div>
        </div>
      )}
      {g >= 1000 && reveal < 1 && <div style={{ position: "absolute", left: athens[0] - 30, top: athens[1] - 30, width: 60, height: 60, borderRadius: 30, background: GOLD, opacity: 1 - reveal }} />}
    </AbsoluteFill>
  );
};
