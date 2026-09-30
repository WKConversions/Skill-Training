import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { NEVER_CHARGED, REVIEW } from "../data";
import { ARRIVE, C, Cam, DEPART, GOLD, Headline, LINEAR, MOVE, POP, SANS, SERIF, SHADOW, card, clamp01, lerp, tw } from "../lib";
import { Wall } from "../Wall";
import { WHIP } from "./Journey";

// 4c COMFORTABLE 1056–1136 "Top Jobs Abroad made recruitment comfortable."
//   A whip pan lands on someone at ease at work; a verified review from their site, stars landing one by one.
// 5 OUTRO 1136–1350
//   1136 "And the best part?"   the page wipes over the photo; the review card flips, and its back is a
//        receipt that prints: interviews, relocation guidance, contract negotiation, each €0.
//   1176 "It's completely free." the total rolls to €0 and a FREE stamp lands.
//   1240 "Top Jobs Abroad."      everything lifts away and the wall of destinations rises back behind the
//        end card; the cursor clicks "I'm looking for a job".

const Stars: React.FC<{ g: number; at: number }> = ({ g, at }) => (
  <div style={{ display: "flex", gap: 8 }}>
    {[0, 1, 2, 3, 4].map((i) => {
      const k = tw(g, at + i * 3, at + i * 3 + 12, 0, 1, POP);
      return (
        <svg key={i} width={40} height={40} viewBox="0 0 24 24" style={{ scale: String(k), rotate: `${(1 - k) * -40}deg` }}>
          <path d="M12 2.8l2.8 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.1l-5.6 3 1.1-6.3L2.9 9.4l6.3-.9z" fill={C.gold} />
        </svg>
      );
    })}
  </div>
);

// one digit column that rolls down to 0
const Roll: React.FC<{ k: number; size: number }> = ({ k, size }) => (
  <span style={{ display: "inline-block", height: size * 1.1, overflow: "hidden", verticalAlign: "bottom" }}>
    <span style={{ display: "grid", translate: `0px ${-(1 - k) * 9 * size * 1.1}px` }}>
      {[0, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((d) => <span key={d} style={{ height: size * 1.1, lineHeight: `${size * 1.1}px` }}>{d}</span>)}
    </span>
  </span>
);

export const Finale: React.FC<{ g: number }> = ({ g }) => {
  if (g < WHIP[0]) return null;
  const enter = (1 - tw(g, WHIP[0], WHIP[1], 0, 1, MOVE)) * 1920;

  // the page wipes over the photo; the review card flips into the receipt
  const wipe = tw(g, 1132, 1158, 0, 1, MOVE);
  const flipOut = tw(g, 1136, 1146, 0, 1, DEPART), flipIn = tw(g, 1146, 1162, 0, 1, ARRIVE);
  const move = tw(g, 1136, 1162, 0, 1, MOVE);
  const print = tw(g, 1150, 1186, 0, 1, LINEAR);
  const stamp = tw(g, 1206, 1216, 0, 1, ARRIVE);
  const hit = g - 1216;
  const shake = hit > 0 && hit < 12 ? Math.sin(hit * 2.2) * (12 - hit) * 0.9 : 0;
  const lift = tw(g, 1236, 1254, 0, 1, DEPART);

  // the end card
  const rise = (x: number, y: number, c: number, j: number): [number, number] => {
    const t0 = 1236 + ((y + 600) / 2400) * 10 + ((c * 5 + j * 3) % 4);
    const k = tw(g, t0, t0 + 26, 0, 1, ARRIVE);
    return [(1 - k) * 1700, (1 - k) * ((c + j) % 2 ? 10 : -10)];
  };
  const endK = tw(g, 1248, 1274, 0, 1, ARRIVE);
  const push = 1 + 0.045 * tw(g, 1256, 1350, 0, 1, LINEAR);
  const cur = tw(g, 1282, 1302, 0, 1, MOVE);
  const press = tw(g, 1302, 1306, 0, 1, LINEAR) * (1 - tw(g, 1307, 1316, 0, 1, ARRIVE));

  return (
    <AbsoluteFill style={{ translate: `${enter}px 0px` }}>
      {/* 4c: at ease at work */}
      {g < 1160 && (
        <AbsoluteFill>
          <Img src={staticFile("people/agent.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 40%",
            scale: String(1.05 + 0.14 * tw(g, WHIP[0], 1160, 0, 1, LINEAR)) }} />
          <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(244,246,251,.96) 0%, rgba(244,246,251,.86) 36%, rgba(244,246,251,0) 62%)" }} />
        </AbsoluteFill>
      )}
      {/* the page taking over for the outro */}
      {wipe > 0 && g < 1256 && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${wipe * 100}%`, background: C.page }} />}

      <div style={{ position: "absolute", inset: 0, translate: `${shake}px ${-lift * 1300}px`, filter: lift > 0 ? `blur(${lift * 6}px)` : undefined,
        transformOrigin: "1300px 560px", scale: String(1 + 0.03 * tw(g, 1080, 1136, 0, 1, LINEAR) - 0.03 * tw(g, 1136, 1160, 0, 1, MOVE) + 0.06 * tw(g, 1160, 1240, 0, 1, LINEAR)) }}>
        <Headline g={g} at={1066} out={1130} x={120} y={150} size={96} lines={[[{ w: "Recruitment," }], [{ w: "made", gold: true }, { w: "comfortable.", gold: true }]]} />

        {/* the review card → (flip) → the receipt */}
        {g >= 1072 && (() => {
          const k = tw(g, 1072, 1094, 0, 1, ARRIVE);
          const back = g >= 1146;
          const ry = back ? lerp(-90, 0, flipIn) : lerp(0, 90, flipOut);
          const x = lerp(120, 1060, move), y = lerp(460, 90, move) + (1 - k) * 200;
          const w = lerp(820, 640, move);
          return (
            <div style={{ position: "absolute", left: x, top: y, width: w, perspective: 1600, opacity: clamp01(k * 2) }}>
              <div style={{ transform: `rotateY(${ry}deg)`, transformOrigin: "50% 50%" }}>
                {!back ? (
                  <div style={{ ...card({ position: "relative", padding: "38px 44px" }) }}>
                    <Stars g={g} at={1080} />
                    <div style={{ fontFamily: SERIF, fontWeight: 600, fontStyle: "italic", fontSize: 50, lineHeight: 1.22, color: C.navy, marginTop: 18 }}>“{REVIEW.quote}”</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 26 }}>
                      <span style={{ width: 60, height: 60, borderRadius: 30, background: C.navy, color: C.goldHi, fontFamily: SANS, fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{REVIEW.initials}</span>
                      <div>
                        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: C.ink }}>{REVIEW.name}</div>
                        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 23, color: C.green }}>● Verified review</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ position: "relative", background: C.white, borderRadius: "24px 24px 0 0", boxShadow: SHADOW, height: lerp(250, 800, print), overflow: "hidden", padding: "40px 48px",
                    boxSizing: "border-box" }}>
                    <Img src={staticFile("img/logo-navy.png")} style={{ width: 250 }} />
                    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: "0.22em", color: C.goldInk, textTransform: "uppercase", marginTop: 20 }}>What you pay</div>
                    <div style={{ height: 2, background: C.line, margin: "26px 0 10px" }} />
                    {NEVER_CHARGED.map((t, i) => {
                      const on = tw(g, 1160 + i * 8, 1170 + i * 8, 0, 1, ARRIVE);
                      return (
                        <div key={t} style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "18px 0", fontFamily: SANS, fontSize: 32, color: C.ink, opacity: on, translate: `0px ${(1 - on) * 16}px` }}>
                          <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{t}</span>
                          <span style={{ flex: 1, borderBottom: `3px dotted ${C.faint}`, translate: "0px -8px" }} />
                          <span style={{ fontWeight: 800 }}>€0</span>
                        </div>
                      );
                    })}
                    <div style={{ borderTop: `3px dashed ${C.faint}`, margin: "18px 0 8px", opacity: tw(g, 1184, 1190, 0, 1, LINEAR) }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: SANS, fontWeight: 800, color: C.navy, opacity: tw(g, 1186, 1192, 0, 1, LINEAR) }}>
                      <span style={{ fontSize: 36 }}>Total</span>
                      <span style={{ fontSize: 76, fontVariantNumeric: "tabular-nums" }}>€<Roll k={tw(g, 1188, 1206, 0, 1, MOVE)} size={76} /></span>
                    </div>
                    {stamp > 0 && (
                      <div style={{ position: "absolute", left: 300, top: 540, width: 230, height: 230, borderRadius: "50%", border: `7px solid ${C.gold}`, display: "grid", placeItems: "center",
                        scale: String(lerp(2.6, 1, stamp)), opacity: clamp01(stamp * 1.6), rotate: `${lerp(-30, -12, stamp)}deg`, background: "rgba(251,243,220,.82)",
                        boxShadow: `inset 0 0 0 10px rgba(251,243,220,.9), inset 0 0 0 13px ${C.gold}` }}>
                        <div style={{ textAlign: "center", color: C.goldInk }}>
                          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: "0.18em" }}>100%</div>
                          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 82, lineHeight: 1 }}>FREE</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        <Headline g={g} at={1142} out={1172} x={120} y={440} size={100} lines={[[{ w: "And" }, { w: "the" }, { w: "best" }, { w: "part?" }]]} />
        <Headline g={g} at={1178} out={1400} x={120} y={330} size={124} gap={4} lines={[[{ w: "It’s" }, { w: "completely" }], [{ w: "free.", gold: true }]]} />
        <div style={{ position: "absolute", left: 124, top: 650, fontFamily: SANS, fontWeight: 600, fontSize: 36, color: C.muted, opacity: tw(g, 1198, 1208, 0, 1, LINEAR),
          translate: `0px ${tw(g, 1198, 1214, 20, 0)}px` }}>Employers pay our placement fee.</div>
      </div>

      {/* 5 the end card over the wall of destinations */}
      {g >= 1236 && (
        <AbsoluteFill style={{ scale: String(push) }}>
          <Cam x={960} y={540} s={0.62}>
            <Wall g={g} drop={rise} />
          </Cam>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(244,246,251,.55), rgba(244,246,251,0) 75%)" }} />
          <div style={{ ...card({ left: 960 - 560, top: 540 - 290 + (1 - endK) * 700, width: 1120, height: 580, borderRadius: 36, display: "grid", justifyItems: "center", alignContent: "center", gap: 34,
            rotate: `${(1 - endK) * 6}deg` }) }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.22em", color: C.goldInk, textTransform: "uppercase" }}>Recruitment across Europe</div>
            <Img src={staticFile("img/logo-navy.png")} style={{ width: 720 }} />
            <div style={{ display: "flex", gap: 22, marginTop: 10 }}>
              <div style={{ position: "relative", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.navy, background: GOLD, borderRadius: 999, padding: "22px 44px",
                scale: String(1 - 0.06 * press), boxShadow: "0 16px 30px -12px rgba(168,132,42,.7)" }}>
                I’m looking for a job
                {g > 1306 && <span style={{ position: "absolute", left: "50%", top: "50%", width: 40 + (g - 1306) * 22, height: 40 + (g - 1306) * 22, translate: "-50% -50%", borderRadius: "50%",
                  border: `3px solid ${C.gold}`, opacity: Math.max(0, 1 - (g - 1306) / 22) }} />}
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.navy, border: `2.5px solid ${C.line}`, borderRadius: 999, padding: "22px 40px" }}>topjobsabroad.com</div>
            </div>
          </div>
          {/* the cursor */}
          {g >= 1280 && (() => {
            const x = lerp(1560, 820, cur) + Math.sin(cur * Math.PI) * 40, y = lerp(1010, 728, cur) + Math.sin(cur * Math.PI) * 30;
            return (
              <svg width={54} height={54} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, scale: String(1 - 0.15 * press), filter: "drop-shadow(0 6px 8px rgba(0,17,53,.35))" }}>
                <path d="M4 2l15 9-6.5 1.6L16 20l-2.8 1.3-3.4-7.3L4 18z" fill={C.navy} stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
              </svg>
            );
          })()}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
