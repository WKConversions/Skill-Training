import React from "react";
import { AbsoluteFill, Easing, Img, staticFile } from "remotion";
import { BRIEFING, FAQ_A, FAQ_Q, JOBS, MATCH } from "../data";
import { ARRIVE, C, Check, DEPART, GOLD, LINEAR, MOVE, POP, Pill, SANS, SERIF, SHADOW, card, clamp01, lerp, tw } from "../lib";

// 4a HOW WE HELP 530–800, one thread: a real open role is matched, interviewed for and signed.
//   536 "We help you find international opportunities."  their open roles sweep in on a conveyor and
//        slow; one lifts out: Matched to you.
//   606 "Prepare for interviews."  the card steps aside and a video call opens out of its edge; the
//        recruiter's briefing ticks through.
//   644 "Answer your questions."   the video makes room and a chat slides in: a real question from their FAQ.
//   682 "And support you throughout the entire recruitment process."  the page moves on to the contract:
//        every line is walked through, then signed.
//   790 the whole page pans away left; the journey map follows in from the right.

const ITEMS = ["Find international opportunities.", "Prepare for interviews.", "Answer your questions.", "Support, start to finish."];
const ITEM_AT = [540, 606, 644, 682];
export const PAN_OUT: [number, number] = [790, 816];

const JobCard: React.FC<{ j: (typeof JOBS)[number]; matched?: number }> = ({ j, matched = 0 }) => (
  <div style={{ width: 460, borderRadius: 24, overflow: "hidden", background: C.white, boxShadow: `${SHADOW}, 0 0 0 ${5 * matched}px ${C.gold}` }}>
    <div style={{ position: "relative", height: 220 }}>
      <Img src={staticFile(`${j.photo}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <span style={{ position: "absolute", right: 16, top: 16, fontFamily: SANS, fontWeight: 700, fontSize: 20, color: C.ink, background: "rgba(255,255,255,.9)", borderRadius: 999, padding: "6px 14px" }}>Full Time</span>
      <span style={{ position: "absolute", left: 18, bottom: -26, width: 60, height: 60, borderRadius: 30, background: C.navy, color: C.goldHi, fontFamily: SANS, fontWeight: 800, fontSize: 21,
        display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #fff" }}>{j.code}</span>
      {matched > 0 && <span style={{ position: "absolute", right: 16, bottom: 16, fontFamily: SANS, fontWeight: 800, fontSize: 24, color: C.navy, background: GOLD, borderRadius: 999,
        padding: "9px 18px", scale: String(matched), boxShadow: "0 10px 24px -8px rgba(168,132,42,.8)" }}>Matched to you</span>}
    </div>
    <div style={{ padding: "40px 26px 26px", display: "grid", gap: 14 }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.ink, lineHeight: 1.18, minHeight: 76 }}>{j.title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontSize: 26, color: C.muted }}>
        <Img src={staticFile(`img/flag-${j.flag}.png`)} style={{ width: 32, height: 24, borderRadius: 4 }} /><span style={{ color: C.ink, fontWeight: 700 }}>{j.city}</span> · {j.country}
      </div>
      <div style={{ display: "flex", gap: 10 }}><Pill size={22}>{j.pills[0]}</Pill><Pill size={22} kind="gold">{j.pills[1]}</Pill></div>
    </div>
  </div>
);

const Bars: React.FC<{ g: number; on: number }> = ({ g, on }) => (
  <div style={{ display: "flex", gap: 5, alignItems: "center", height: 30 }}>
    {[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ width: 6, borderRadius: 3, background: C.gold, height: 8 + on * (10 + 12 * Math.abs(Math.sin(g / 3.1 + i * 1.7)) * Math.abs(Math.sin(g / 7 + i))) }} />)}
  </div>
);

export const Help: React.FC<{ g: number }> = ({ g }) => {
  if (g < 530 || g > PAN_OUT[1] + 2) return null;
  const pan = tw(g, PAN_OUT[0], PAN_OUT[1], 0, 1, MOVE) * -1920;

  // conveyor: a fast sweep in, a slow drift, a stop with the matched role centred
  const d = 2100 * tw(g, 536, 572, 0, 1, ARRIVE) + 160 * tw(g, 536, 602, 0, 1, Easing.out(Easing.quad));
  const X0 = 1990;
  const lift = tw(g, 584, 600, 0, 1, ARRIVE);
  const matched = tw(g, 590, 602, 0, 1, POP);
  const aside = tw(g, 606, 630, 0, 1, MOVE);
  const othersOut = tw(g, 606, 616, 0, 1, DEPART);

  // the call
  const callK = tw(g, 612, 636, 0, 1, ARRIVE);
  const chatK = tw(g, 646, 668, 0, 1, MOVE);
  const onward = tw(g, 682, 702, 0, 1, DEPART); // the page moves on to the contract
  const W = { x: 640, y: 360, w: 1160, h: 620 };

  return (
    <AbsoluteFill style={{ translate: `${pan}px 0px` }}>
      {/* the header: the logo that flew here from the solution */}
      {g >= 558 && <Img src={staticFile("img/logo-navy.png")} style={{ position: "absolute", left: 90, top: 50, width: 300 }} />}

      {/* the rolling caption */}
      <div style={{ position: "absolute", left: 120, top: 172, display: "flex", gap: 22, alignItems: "baseline", opacity: tw(g, 536, 546, 0, 1, LINEAR) }}>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.22em", color: C.goldInk, textTransform: "uppercase" }}>How we help</span>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: C.faint, fontVariantNumeric: "tabular-nums" }}>0{ITEM_AT.filter((a) => g >= a).length || 1} / 04</span>
      </div>
      {/* a slot: each line rolls up out of it as the next rolls in */}
      <div style={{ position: "absolute", left: 100, top: 206, width: 1500, height: 112, overflow: "hidden" }}>
        {ITEMS.map((t, i) => {
          const inK = tw(g, ITEM_AT[i], ITEM_AT[i] + 16, 0, 1, ARRIVE);
          const outK = i < 3 ? tw(g, ITEM_AT[i + 1], ITEM_AT[i + 1] + 16, 0, 1, ARRIVE) : 0; // same curve as the next line, so they stay one slot apart
          if (inK <= 0 || outK >= 1) return null;
          return (
            <div key={t} style={{ position: "absolute", left: 20, top: 14, fontFamily: SERIF, fontWeight: 600, fontSize: 80, lineHeight: 1.05, color: C.navy, whiteSpace: "nowrap",
              translate: `0px ${(1 - inK) * 112 - outK * 112}px` }}>{t}</div>
          );
        })}
      </div>
      {/* progress through the four: a thin gold line along the foot of the page */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 1030, height: 5, borderRadius: 3, background: C.line, opacity: tw(g, 540, 552, 0, 1, LINEAR) }}>
        <div style={{ width: `${tw(g, 540, 790, 0, 100, LINEAR)}%`, height: "100%", borderRadius: 3, background: GOLD }} />
      </div>

      {/* a · the conveyor of their open roles */}
      {g < 720 && JOBS.map((j, i) => {
        const isM = i === MATCH;
        if (!isM && othersOut >= 1) return null;
        let x = X0 + i * 500 - d, y = 400;
        let s = 1;
        if (isM) {
          s = lerp(1, 1.08, lift) * lerp(1, 0.86, aside);
          y = lerp(400 - 26 * lift, 380, aside);
          x = lerp(x, 120, aside) - onward * 1600;
        } else {
          y += othersOut * 120;
        }
        const dim = isM ? 1 : lerp(1, 0.35, lift);
        return (
          <div key={j.title + j.city} style={{ position: "absolute", left: 0, top: 0, translate: `${x}px ${y}px`, transformOrigin: isM ? "0% 0%" : "50% 50%", scale: String(s), opacity: isM ? 1 : dim * (1 - othersOut),
            filter: !isM && lift > 0 ? `blur(${lift * 3 + othersOut * 6}px)` : undefined, rotate: isM ? `${(1 - lift) * 0 - onward * 6}deg` : undefined, zIndex: isM ? 3 : 1 }}>
            <JobCard j={j} matched={isM ? matched : 0} />
          </div>
        );
      })}

      {/* b · the video call, opening out of the matched card's edge (the camera eases in on it) */}
      <AbsoluteFill style={{ transformOrigin: "1220px 670px", scale: String(1 + 0.05 * tw(g, 606, 700, 0, 1, LINEAR)) }}>
      {callK > 0 && onward < 1 && (
        <div style={{ ...card({ left: W.x - onward * 1700, top: W.y, width: W.w, height: W.h, overflow: "hidden", transformOrigin: "0% 50%", zIndex: 2,
          scale: `${lerp(0.25, 1, callK)} ${lerp(0.7, 1, callK)}`, opacity: clamp01(callK * 2), rotate: `${-onward * 4}deg` }) }}>
          {/* video: the recruiter; it narrows as the chat comes in */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 96, width: lerp(W.w, W.w - 470, chatK), overflow: "hidden", background: C.navy }}>
            <Img src={staticFile("people/recruiter.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 30%", scale: String(1.04 + 0.06 * tw(g, 612, 700, 0, 1, LINEAR)) }} />
            <div style={{ position: "absolute", left: 22, top: 22, display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.94)", borderRadius: 999, padding: "10px 20px 10px 14px" }}>
              <Bars g={g} on={g < 650 || g > 668 ? 1 : 0.2} />
              <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: C.ink }}>Your recruiter</span>
            </div>
            {/* self view: the candidate */}
            <div style={{ position: "absolute", right: 22, bottom: 22, width: 250, height: 164, borderRadius: 16, overflow: "hidden", border: "4px solid #fff", boxShadow: SHADOW,
              scale: String(tw(g, 624, 638, 0.6, 1, ARRIVE)), opacity: tw(g, 624, 630, 0, 1, LINEAR) }}>
              <Img src={staticFile("people/candidate.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "40% 30%" }} />
            </div>
          </div>
          {/* the call bar */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 96, background: C.white, borderTop: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", gap: 18, padding: "0 28px" }}>
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, color: C.ink, flex: 1 }}>Interview prep · {JOBS[MATCH].title}</span>
            {[C.pillBlue, C.pillBlue, "#F25C54"].map((b, i) => <span key={i} style={{ width: 56, height: 56, borderRadius: 28, background: b }} />)}
          </div>
          {/* c · the chat panel */}
          {chatK > 0 && (
            <div style={{ position: "absolute", top: 0, bottom: 96, right: 0, width: 470, background: "#FAFBFE", borderLeft: `1.5px solid ${C.line}`, translate: `${(1 - chatK) * 470}px 0px`,
              padding: "28px 26px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 18, justifyContent: "flex-end" }}>
              <div style={{ alignSelf: "flex-end", maxWidth: 380, background: C.goldPale, color: C.ink, borderRadius: "24px 24px 6px 24px", padding: "16px 22px", fontFamily: SANS, fontWeight: 600,
                fontSize: 29, lineHeight: 1.3, opacity: tw(g, 652, 658, 0, 1, LINEAR), translate: `0px ${tw(g, 652, 668, 40, 0)}px` }}>{FAQ_Q}</div>
              {g >= 662 && g < 674 && (
                <div style={{ display: "flex", gap: 8, background: C.white, borderRadius: 20, padding: "14px 18px", alignSelf: "flex-start", boxShadow: SHADOW }}>
                  {[0, 1, 2].map((dd) => <span key={dd} style={{ width: 12, height: 12, borderRadius: 6, background: C.faint, translate: `0px ${Math.sin((g - dd * 4) / 3) * 4}px` }} />)}
                </div>
              )}
              {g >= 672 && (
                <div style={{ alignSelf: "flex-start", maxWidth: 400, background: C.navy, color: C.white, borderRadius: "24px 24px 24px 6px", padding: "16px 22px", fontFamily: SANS, fontWeight: 600,
                  fontSize: 29, lineHeight: 1.3, opacity: tw(g, 672, 678, 0, 1, LINEAR), translate: `0px ${tw(g, 672, 688, 40, 0)}px` }}>{FAQ_A}</div>
              )}
            </div>
          )}
        </div>
      )}
      {/* b · the briefing, ticking through while the call runs */}
      {g >= 616 && g < 656 && (() => {
        const k = tw(g, 616, 634, 0, 1, ARRIVE), out = tw(g, 646, 655, 0, 1, DEPART);
        return (
          <div style={{ ...card({ left: 700, top: 640 + (1 - k) * 60 + out * 90, width: 600, padding: "28px 32px", opacity: clamp01(k * 2) * (1 - out), zIndex: 4 }) }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.ink, marginBottom: 16 }}>Interview briefing</div>
            {BRIEFING.map((t, i) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: C.ink, opacity: tw(g, 622 + i * 5, 628 + i * 5, 0, 1, LINEAR) }}>
                <Check k={tw(g, 622 + i * 5, 636 + i * 5, 0, 1, ARRIVE)} size={36} />{t}
              </div>
            ))}
          </div>
        );
      })()}

      </AbsoluteFill>
      {/* d · support to the end: one recruiter, and the contract walked through line by line */}
      {g >= 684 && (() => {
        const inK = tw(g, 690, 716, 0, 1, ARRIVE);
        return (
          <AbsoluteFill style={{ transformOrigin: "1150px 700px", scale: String(1 + 0.07 * tw(g, 700, 800, 0, 1, LINEAR)) }}>
            <div style={{ position: "absolute", left: 120 - (1 - inK) * 300, top: 420, width: 560, display: "grid", gap: 26, opacity: clamp01(inK * 2) }}>
              <div style={{ position: "relative", width: 170, height: 170 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", border: "5px solid #fff", boxShadow: SHADOW }}>
                  <Img src={staticFile("people/recruiter.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 30%", scale: "1.7", transformOrigin: "52% 32%" }} />
                </div>
                <span style={{ position: "absolute", right: -4, bottom: 6, width: 48, height: 48, borderRadius: 24, background: GOLD, border: "4px solid #fff" }} />
              </div>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 46, lineHeight: 1.2, color: C.navy }}>One person who owns your search from day one.</div>
            </div>
            <div style={{ ...card({ left: 780 + (1 - inK) * 1300, top: 360, width: 1000, padding: "44px 52px", rotate: `${lerp(5, -1.5, inK)}deg` }) }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: "0.22em", color: C.goldInk, textTransform: "uppercase" }}>Your offer</div>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 50, color: C.navy, marginTop: 10 }}>Employment contract</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 27, color: C.muted, marginTop: 8 }}>{JOBS[MATCH].title} · {JOBS[MATCH].city}, {JOBS[MATCH].country}</div>
              <div style={{ display: "grid", gap: 22, marginTop: 34 }}>
                {[0.92, 0.74, 0.86, 0.62].map((wd, i) => {
                  const hl = tw(g, 704 + i * 10, 716 + i * 10, 0, 1, MOVE);
                  return (
                    <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, height: 34 }}>
                      <div style={{ position: "relative", width: `${wd * 86}%`, height: 14, borderRadius: 7, background: "#DDE3EF" }}>
                        <div style={{ position: "absolute", left: -8, top: -9, bottom: -9, width: `calc(${hl * 100}% + 16px)`, borderRadius: 8, background: "rgba(232,201,106,.42)" }} />
                      </div>
                      <Check k={tw(g, 712 + i * 10, 724 + i * 10, 0, 1, ARRIVE)} size={34} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 36 }}>
                <div style={{ width: 420 }}>
                  <svg width={420} height={90} viewBox="0 0 420 90">
                    <path d="M12 62 C 40 20, 58 16, 62 44 S 70 80, 96 50 S 130 18, 142 46 S 160 72, 190 40 C 210 22, 222 30, 226 48 S 250 70, 280 36 C 300 16, 312 40, 330 50 S 380 44, 408 30"
                      fill="none" stroke={C.navy} strokeWidth={4.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tw(g, 748, 774, 0, 1, MOVE)} />
                  </svg>
                  <div style={{ height: 2, background: C.faint }} />
                  <div style={{ fontFamily: SANS, fontSize: 20, color: C.muted, marginTop: 8 }}>Signed</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#E4F5EC", color: C.green, borderRadius: 999, padding: "14px 24px", fontFamily: SANS, fontWeight: 800, fontSize: 28,
                  scale: String(tw(g, 774, 788, 0, 1, POP)) }}>
                  <Check k={1} size={32} fill={C.green} /> Offer accepted
                </div>
              </div>
            </div>
          </AbsoluteFill>
        );
      })()}
    </AbsoluteFill>
  );
};
