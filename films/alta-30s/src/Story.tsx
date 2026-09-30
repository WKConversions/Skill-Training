import { Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ARRIVE, C, Card, Chip, DEPART, FONT, Headline, LINEAR, MOVE, POP, lerp, tw, useFonts } from "./lib";

// Alta · landing-page hero · 30 s, silent, looping. One continuous stage:
// 1 Hook     0:00–0:05  the three agents rise out of Alta's ball pile: agents that book your meetings
// 2 Katie    0:05–0:11  outbound: 886 prospects, a buying signal, a multichannel sequence
// 3 Alex     0:11–0:17  inbound: a new lead qualified on the spot, the demo on the calendar
// 4 Luna     0:17–0:23  growth: learns what works (LinkedIn is better for VPs, +28% meetings)
// 5 Results  0:23–0:27  one system, every team wins: 3X, 21H, 72%
// 6 Close    0:27–0:30  the logo, "AI acts. Your team wins.", and the ball pile again: the loop

const AGENTS = [
  { name: "Katie", role: "AI Outbound Agent", src: "video/katie.mp4" },
  { name: "Alex", role: "AI Inbound Agent", src: "video/alex.mp4" },
  { name: "Luna", role: "AI Growth Agent", src: "video/luna.mp4" },
];

const Agent: React.FC<{ i: number; x: number; y: number; size: number; o: number; label: number }> = ({ i, x, y, size, o, label }) =>
  o <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, width: size, opacity: o }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.08, overflow: "hidden", background: C.lilac, boxShadow: "0 40px 80px -40px rgba(69,37,110,.55)" }}>
        <Video src={staticFile(AGENTS[i].src)} loop muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ marginTop: size * 0.05, display: "flex", justifyContent: "center", opacity: label }}>
        <Chip bg={C.panel} color={C.ink} size={Math.max(24, size * 0.07)} style={{ border: `1.5px solid ${C.line}`, fontWeight: 500 }}>
          <b style={{ fontWeight: 600 }}>{AGENTS[i].name}</b><span style={{ color: C.faint }}>|</span><span style={{ color: C.muted }}>{AGENTS[i].role}</span>
        </Chip>
      </div>
    </div>
  );

const Check: React.FC<{ k: number; color?: string }> = ({ k, color = C.green }) => (
  <svg width={30} height={30} viewBox="0 0 24 24" style={{ scale: String(k), flexShrink: 0 }}>
    <circle cx={12} cy={12} r={11} fill={color} />
    <path d="M6.5 12.5 L10.5 16 L17.5 8.5" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PROSPECTS = [
  ["Maya Brooks", "VP Sales", "Northwind"], ["Jonas Weber", "Head of Growth", "Lumen"], ["Priya Nair", "CRO", "Fieldstone"],
  ["Leo Martins", "Sales Director", "Arcadia"], ["Ava Kim", "Head of Sales", "Brightline"],
];
const AV = ["#F4A7C8", "#C8B0F2", "#F6C343", "#A5B4FC", "#FBCFE8"];

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  const ready = useFonts();
  if (!ready) return null;

  // where each agent is: the hero row, then the featured agent in the left column
  const toFeature = (start: number) => tw(g, start, start + 26, 0, 1, MOVE);
  const agent = (i: number) => {
    const rise = tw(g, 10 + i * 6, 46 + i * 6, 0, 1, ARRIVE);
    const hero = { x: 960 + (i - 1) * 350 - 150, y: 560 + (1 - rise) * 520, size: 300, o: 1, label: tw(g, 40 + i * 6, 50 + i * 6, 0, 1, LINEAR) };
    const slot = { x: 190, y: 330, size: 420 };
    const starts = [150, 350, 530];
    const inK = i === 0 ? toFeature(150) : tw(g, starts[i] - 4, starts[i] + 24, 0, 1, ARRIVE);
    const outK = tw(g, (starts[i + 1] ?? 690) - 6, (starts[i + 1] ?? 690) + 14, 0, 1, DEPART);
    if (g < 150) return hero;
    if (i === 0) {
      return { x: lerp(hero.x, slot.x, inK) - outK * 700, y: lerp(hero.y, slot.y, inK), size: lerp(300, 420, inK), o: 1 - outK, label: 1 };
    }
    // Alex and Luna drop out of the row at 150, come back into the slot on their turn
    const drop = tw(g, 150, 172, 0, 1, DEPART);
    if (g < starts[i] - 4) return { ...hero, y: hero.y + drop * 700, o: 1 - drop };
    return { x: slot.x + (1 - inK) * 900, y: slot.y, size: 420, o: inK * (1 - outK), label: 1, ...(outK > 0 ? { x: slot.x - outK * 700 } : {}) };
  };

  const cardsX = 720;
  const kProspects = tw(g, 168, 190, 0, 1, ARRIVE) * (1 - tw(g, 340, 352, 0, 1, DEPART));
  const kSignal = tw(g, 228, 248, 0, 1, POP) * (1 - tw(g, 342, 354, 0, 1, DEPART));
  const kSeq = tw(g, 256, 276, 0, 1, ARRIVE) * (1 - tw(g, 344, 356, 0, 1, DEPART));
  const kLead = tw(g, 368, 390, 0, 1, ARRIVE) * (1 - tw(g, 520, 532, 0, 1, DEPART));
  const kCal = tw(g, 440, 462, 0, 1, ARRIVE) * (1 - tw(g, 522, 534, 0, 1, DEPART));
  const kInsight = tw(g, 552, 574, 0, 1, POP) * (1 - tw(g, 680, 692, 0, 1, DEPART));
  const kChart = tw(g, 560, 584, 0, 1, ARRIVE) * (1 - tw(g, 682, 694, 0, 1, DEPART));
  const count = Math.round(886 * tw(g, 176, 222, 0, 1, ARRIVE));

  return (
    <AbsoluteFill>
      {/* 1 and 6: their hero's ball pile */}
      <AbsoluteFill style={{ translate: `0px ${tw(g, 150, 184, 0, 520, DEPART)}px`, opacity: g < 200 ? 1 : 0 }}>
        <Sequence from={0} durationInFrames={200} layout="none">
          <Video src={staticFile("video/balls.mp4")} muted style={{ width: 1920, height: 1080, objectFit: "cover", mixBlendMode: "multiply" }} />
        </Sequence>
      </AbsoluteFill>
      <AbsoluteFill style={{ translate: `0px ${(1 - tw(g, 836, 876, 0, 1, ARRIVE)) * 560}px`, opacity: g >= 836 ? 1 : 0 }}>
        <Img src={staticFile("img/balls-first.png")} style={{ width: 1920, height: 1080, objectFit: "cover", mixBlendMode: "multiply" }} />
      </AbsoluteFill>

      {/* 1: the hook, their hero layout: a centered headline over the three agents */}
      <Headline g={g} at={24} out={146} x={960} y={150} size={80} align="center" lines={[[{ w: "AI" }, { w: "agents" }, { w: "that" }], [{ w: "book", b: true }, { w: "your", b: true }, { w: "meetings.", b: true }]]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: FONT, fontWeight: 400, fontSize: 34, color: C.muted,
        opacity: tw(g, 58, 70, 0, 1, LINEAR) * (1 - tw(g, 144, 152, 0, 1, LINEAR)) }}>Find prospects. Qualify leads. Book meetings.</div>

      {[0, 1, 2].map((i) => { const a = agent(i); return <Agent key={i} i={i} {...a} />; })}

      {/* 2: Katie · outbound */}
      <Headline g={g} at={168} out={340} x={190} y={120} size={64} lines={[[{ w: "Katie" }, { w: "finds" }, { w: "the" }, { w: "right" }, { w: "people," }], [{ w: "at" }, { w: "the" }, { w: "right", b: true }, { w: "moment.", b: true }]]} />
      <Card x={cardsX} y={330} w={560} h={600} k={kProspects}>
        <div style={{ padding: "26px 28px", display: "grid", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 600, fontSize: 34, color: C.ink }}>
            <span style={{ width: 16, height: 16, borderRadius: 8, background: C.violet }} /><span style={{ fontVariantNumeric: "tabular-nums" }}>{count}</span> Prospects found
          </div>
          <div style={{ fontFamily: FONT, fontSize: 24, color: C.muted, marginTop: -8 }}>from 50+ data sources</div>
          {PROSPECTS.map(([n, t, co], r) => {
            const k = tw(g, 184 + r * 5, 198 + r * 5, 0, 1, ARRIVE);
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 16, opacity: k, translate: `${(1 - k) * 30}px 0px`, borderTop: `1px solid ${C.line}`, paddingTop: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 26, background: AV[r], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 600, fontSize: 22, color: C.deep }}>{n.split(" ").map((p) => p[0]).join("")}</div>
                <div style={{ display: "grid", gap: 2 }}>
                  <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.ink, lineHeight: 1.1 }}>{n}</div>
                  <div style={{ fontFamily: FONT, fontSize: 24, color: C.muted, lineHeight: 1.1 }}>{t} · {co}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card x={1310} y={330} w={450} k={kSignal} style={{ background: C.deep, border: "none" }}>
        <div style={{ padding: "24px 26px", display: "grid", gap: 10 }}>
          <Chip bg="rgba(255,255,255,0.14)" color="#fff" size={24}>⚡ Champion moved</Chip>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 30, color: "#fff", lineHeight: 1.3 }}>Sarah Chen left Stripe → just joined PayPal as <b style={{ fontWeight: 600 }}>VP Sales</b>.</div>
        </div>
      </Card>
      <Card x={1310} y={640} w={450} k={kSeq}>
        <div style={{ padding: "24px 26px", display: "grid", gap: 14 }}>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.ink }}>Personalized sequence</div>
          {["Email", "LinkedIn", "Call"].map((ch, i) => {
            const on = tw(g, 272 + i * 16, 282 + i * 16, 0, 1, POP);
            return (
              <div key={ch} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 30, display: "flex", justifyContent: "center" }}>{on > 0 ? <Check k={on} color={C.violet} /> : <span style={{ width: 16, height: 16, borderRadius: 8, border: `2px solid ${C.faint}` }} />}</div>
                <Chip on={0.45 + 0.55 * Math.min(1, on)} size={28}>{ch}</Chip>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3: Alex · inbound */}
      <Headline g={g} at={366} out={520} x={190} y={120} size={64} lines={[[{ w: "Alex" }, { w: "qualifies" }, { w: "every" }, { w: "lead," }], [{ w: "instantly.", b: true }]]} />
      <Card x={cardsX} y={330} w={1040} h={260} k={kLead}>
        <div style={{ padding: "26px 30px", display: "grid", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Chip bg={C.lilacSoft} color={C.violet} size={24}>New inbound lead</Chip>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, color: C.ink }}>Emily Carter</div>
            <div style={{ fontFamily: FONT, fontSize: 28, color: C.muted }}>VP Sales · Brightwave</div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {["50–100 employees", "Tech industry", "Budget confirmed"].map((c, i) => {
              const k = tw(g, 394 + i * 10, 404 + i * 10, 0, 1, POP);
              return <Chip key={c} on={0.4 + 0.6 * Math.min(1, k)} size={28} bg={k > 0.5 ? C.greenSoft : "#F3F4F8"} color={k > 0.5 ? C.green : C.muted}>{k > 0 && <Check k={k} />}{c}</Chip>;
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 600, fontSize: 30, color: C.green, opacity: tw(g, 428, 438, 0, 1, LINEAR) }}>
            <Check k={tw(g, 428, 440, 0, 1, POP)} /> Lead is qualified for a sales demo
          </div>
        </div>
      </Card>
      <Card x={cardsX} y={620} w={1040} h={290} k={kCal}>
        <div style={{ padding: "22px 30px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
            <div key={d} style={{ display: "grid", gap: 10 }}>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 26, color: C.muted, textAlign: "center" }}>{d}</div>
              {[0, 1, 2].map((r) => {
                const demo = i === 1 && r === 1;
                const k = demo ? tw(g, 462, 478, 0, 1, POP) : 0;
                return (
                  <div key={r} style={{ height: 54, borderRadius: 10, background: demo && k > 0 ? C.violet : (i + r) % 3 === 0 ? "#F1EDFB" : "#F6F7FB", position: "relative", overflow: "hidden" }}>
                    {demo && k > 0 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, fontWeight: 600, fontSize: 24, color: "#fff", scale: String(k) }}>Demo call</div>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* 4: Luna · growth */}
      <Headline g={g} at={546} out={680} x={190} y={120} size={64} lines={[[{ w: "Luna" }, { w: "learns" }, { w: "what" }, { w: "works," }], [{ w: "and" }, { w: "does", b: true }, { w: "more", b: true }, { w: "of", b: true }, { w: "it.", b: true }]]} />
      <Card x={cardsX} y={330} w={560} k={kInsight} style={{ background: C.lilacSoft, border: `2px solid ${C.lilac}` }}>
        <div style={{ padding: "28px 30px", display: "grid", gap: 12 }}>
          <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 24, color: C.violet, letterSpacing: "0.06em" }}>CONTINUOUS OPTIMIZATION</div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 38, color: C.ink, lineHeight: 1.15 }}>LinkedIn is better for VPs</div>
          <div style={{ fontFamily: FONT, fontSize: 30, color: C.muted, lineHeight: 1.3 }}>Katie switched to: <b style={{ color: C.ink, fontWeight: 600 }}>LinkedIn → Call.</b></div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 44, color: C.green, opacity: tw(g, 600, 610, 0, 1, LINEAR), scale: String(tw(g, 600, 616, 0.8, 1, POP)), transformOrigin: "left center" }}>+28% meetings.</div>
        </div>
      </Card>
      <Card x={1310} y={330} w={450} h={440} k={kChart}>
        <div style={{ padding: "24px 26px" }}>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.ink }}>Meetings booked</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 300, marginTop: 30 }}>
            {[0.32, 0.4, 0.46, 0.58, 0.72, 0.9].map((v, i) => (
              <div key={i} style={{ flex: 1, height: `${v * 100 * tw(g, 570 + i * 5, 594 + i * 5, 0, 1, ARRIVE)}%`, borderRadius: 8, background: i >= 4 ? C.violet : C.lilac }} />
            ))}
          </div>
        </div>
      </Card>

      {/* 5: results */}
      <Headline g={g} at={700} out={812} x={960} y={150} size={72} align="center" lines={[[{ w: "One" }, { w: "system." }, { w: "Every", b: true }, { w: "team", b: true }, { w: "wins.", b: true }]]} />
      {[["3X", "Increase in qualified meetings"], ["21H", "Weekly time saved on manual outreach"], ["72%", "Faster lead response time"]].map(([n, l], i) => {
        const k = tw(g, 712 + i * 7, 734 + i * 7, 0, 1, ARRIVE) * (1 - tw(g, 812, 822, 0, 1, DEPART));
        return (
          <Card key={n} x={960 + (i - 1) * 520 - 240} y={340} w={480} h={300} k={k}>
            <div style={{ padding: "36px 36px", display: "grid", gap: 14 }}>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 120, lineHeight: 1, color: i === 1 ? C.violet : C.ink }}>{n}</div>
              <div style={{ fontFamily: FONT, fontSize: 32, lineHeight: 1.25, color: C.muted }}>{l}</div>
            </div>
          </Card>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: FONT, fontSize: 28, color: C.muted,
        opacity: tw(g, 740, 752, 0, 1, LINEAR) * (1 - tw(g, 812, 820, 0, 1, LINEAR)) }}>Results reported by Mesh with Alta</div>
      {[0, 1, 2].map((i) => {
        const k = tw(g, 716 + i * 6, 740 + i * 6, 0, 1, ARRIVE) * (1 - tw(g, 812, 824, 0, 1, DEPART));
        return <Agent key={`r${i}`} i={i} x={960 + (i - 1) * 150 - 60} y={780 + (1 - k) * 200} size={120} o={k} label={0} />;
      })}

      {/* 6: the close */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", opacity: tw(g, 822, 832, 0, 1, LINEAR) * (1 - tw(g, 872, 892, 0, 1, LINEAR)),
        scale: String(tw(g, 822, 850, 0.92, 1, ARRIVE)) }}>
        <Img src={staticFile("img/alta-logo.svg")} style={{ width: 400 }} />
      </div>
      <Headline g={g} at={836} out={880} x={960} y={470} size={64} align="center" lines={[[{ w: "AI" }, { w: "acts." }, { w: "Your", b: true }, { w: "team", b: true }, { w: "wins.", b: true }]]} />
    </AbsoluteFill>
  );
};

