import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CITIES } from "../data";
import { EuropeMap, cityAt } from "../Map";
import { ARRIVE, C, Cam, DEPART, Headline, LINEAR, MOVE, P, POP, SANS, SERIF, SHADOW, card, clamp01, lerp, tw } from "../lib";
import { TH, TW, Tile, Wall, nearestTile, tileWorld } from "../Wall";

// 1 HOOK 0–96 "This could be your next top move."
//   The traveller fills the frame: she is one tile of the wall, the camera is simply that close. The
//   camera pulls out (a whip zoom, log-scale, with the roll unwinding) and reveals the moving wall.
// 2 PROBLEM 100–446
//   100 "Finding a job abroad can be difficult."  the wall slides right, the copy builds on the page.
//   150 the wall drops away and its city tiles fly down onto a map of Europe as photo pins; "You" lands.
//   190 "Where to start?"   dotted routes wander out from You and stop short, each on a question mark.
//   262 "Where to look?"    a search window flies in; results pour through it.
//   304 "Who to contact?"   messages leave You; delivered, no reply.
//   346 "How it all works?" the paperwork falls in and piles up.
// 3 SOLUTION 446–530 "That's where Top Jobs Abroad comes in."
//   All of it is pulled into one point and swirls away; the point opens into a white disc with the logo.
//   The logo then flies to the corner and becomes the header of the next scene.

export const MAP1 = { x: 470, y: -10, s: 0.94 };
const F: P = [1340, 560]; // where the chaos collapses and the solution opens
const YOU = () => cityAt("copenhagen", MAP1);

// log-scale zoom, so the pull-back reads at a constant perceived speed
const zoom = (a: number, b: number, t: number) => Math.exp(lerp(Math.log(a), Math.log(b), t));
const WALL_S = 0.66;

const Pin: React.FC<{ x: number; y: number; src: string; size?: number; o?: number; ring?: number }> = ({ x, y, src, size = 64, o = 1, ring = 0 }) => (
  <>
    {ring > 0 && ring < 1 && <div style={{ position: "absolute", left: x - size / 2 - 30 * ring, top: y - size / 2 - 30 * ring, width: size + 60 * ring, height: size + 60 * ring,
      borderRadius: "50%", border: `3px solid ${C.gold}`, opacity: (1 - ring) * o }} />}
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", overflow: "hidden", border: "4px solid #fff",
      boxShadow: "0 14px 30px -10px rgba(0,17,53,.45)", opacity: o, boxSizing: "border-box" }}>
      <Img src={staticFile(`photos/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  </>
);

const Badge: React.FC<{ x: number; y: number; k: number; size?: number }> = ({ x, y, k, size = 50 }) =>
  k <= 0 ? null : (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", background: C.gold, color: C.white,
      fontFamily: SERIF, fontWeight: 600, fontSize: size * 0.62, display: "flex", alignItems: "center", justifyContent: "center", scale: String(k),
      boxShadow: "0 10px 24px -8px rgba(168,132,42,.7)" }}>?</div>
  );

// dotted routes that wander out of You and give up
const ROUTES = ["lisbon", "barcelona", "sliema", "athens", "stockholm"];
const route = (i: number): P[] => {
  const A = YOU(), B = cityAt(ROUTES[i], MAP1);
  const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const pts: P[] = [];
  for (let k = 0; k <= 48; k++) {
    const s = k / 48, reach = 0.6 + 0.08 * Math.sin(i * 2.1);
    const w = Math.sin(s * Math.PI * (2.2 + i * 0.35) + i * 1.3) * 52 * Math.sin(s * Math.PI * 0.9);
    pts.push([A[0] + dx * reach * s + nx * w, A[1] + dy * reach * s + ny * w]);
  }
  return pts;
};

const DOCS = [
  { t: "CV", x: 1150, y: 690, r: -9 }, { t: "Contract", x: 1330, y: 760, r: 6 }, { t: "Tax number?", x: 1500, y: 680, r: -4 },
  { t: "Bank account?", x: 1230, y: 870, r: 11 }, { t: "Apartment?", x: 1440, y: 890, r: -7 }, { t: "Health insurance?", x: 1620, y: 810, r: 8 },
];
const QUESTIONS = ["Where to start?", "Where to look?", "Who to contact?", "How it all works?"];
const Q_AT = [192, 262, 304, 346];

export const Open: React.FC<{ g: number }> = ({ g }) => {
  if (g > 560) return null;

  // ---------- hook camera: tracking the traveller tile, then one pull-back out to the whole wall ----------
  const pull = tw(g, 84, 136, 0, 1, MOVE);
  const tile = tileWorld(2, 0, g);
  const camS = g < 84 ? lerp(3.72, 3.98, g / 84) : zoom(3.98, WALL_S, pull);
  const camX = lerp(tile[0], 960, pull), camY = lerp(tile[1], 540, pull);
  const camR = lerp(8, 0, pull);
  // once the camera has settled (g ≥ 136) world → screen is a plain scale about the centre
  const proj = (p: [number, number]): [number, number] => [960 + (p[0] - 960) * WALL_S, 540 + (p[1] - 540) * WALL_S];

  // ---------- the wall: slides right, then drops away ----------
  const slide = tw(g, 90, 128, 0, 1, MOVE);
  const wtx = 1400 * slide, wty = 0;
  // each tile drops in turn, the right-hand and lower ones first, tipping as they go
  const drop = (x: number, y: number, c: number, j: number): [number, number] => {
    const t0 = 148 + ((2400 - x) / 2400) * 12 + ((1800 - y) / 2600) * 8 + ((c * 7 + j * 3) % 5);
    const k = tw(g, t0, t0 + 26, 0, 1, DEPART);
    return [k * 2600, k * ((c + j) % 2 ? 14 : -14)];
  };
  // the city tiles that fly down to the map (picked once, as the fall begins)
  const flights = g >= 146 && g < 214
    ? CITIES.map((c, i) => ({ c, i, t: nearestTile(c.id, 146, 1400, 0, proj) })).filter((f) => f.t)
    : [];

  // ---------- problem timing ----------
  const mapOn = g >= 140;
  const pinsLanded = (i: number) => tw(g, 150 + i * 3, 184 + i * 3, 0, 1, MOVE);
  const implode = tw(g, 446, 478, 0, 1, DEPART);
  const chaos = g >= 146 && implode < 1;
  const you = YOU();
  const youK = tw(g, 176, 190, 0, 1, ARRIVE);

  // ---------- solution ----------
  const disc = tw(g, 468, 504, 0, 1, ARRIVE);
  const logoIn = tw(g, 478, 500, 0, 1, ARRIVE);
  const toHeader = tw(g, 528, 556, 0, 1, MOVE);

  return (
    <AbsoluteFill style={{ background: C.page }}>
      {/* the map under the wall */}
      <AbsoluteFill style={{ transformOrigin: "1400px 420px", scale: String(1 + 0.07 * tw(g, 180, 470, 0, 1, LINEAR)) }}>
      {mapOn && disc < 1 && <EuropeMap m={MAP1} fadeLeft={[560, 860]} hl={tw(g, 400, 410, 0, 1, LINEAR)} />}

      {/* the world of the hook: the wall under the camera */}
      {g < 196 && (
        <Cam x={camX} y={camY} s={camS} r={camR}>
          <Wall g={g} tx={wtx} ty={wty} drop={g >= 146 ? drop : undefined} hide={flights.map((f) => `${f.t![0]}:${f.t![1]}`)} />
        </Cam>
      )}
      {/* the wall fades into the page under the copy column. A gradient laid over it, not a mask: a mask
          would also clip the wall to its layer's box, cutting its edges once the camera pulls out */}
      {g < 196 && slide > 0 && (
        <AbsoluteFill style={{ background: `linear-gradient(90deg, ${C.page} 0px, ${C.page} ${lerp(-500, 820, slide)}px, rgba(244,246,251,0) ${lerp(-200, 1040, slide)}px)` }} />
      )}
      {/* a soft white scrim for the hook headline */}
      {g < 100 && <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(244,246,251,.94) 0%, rgba(244,246,251,.78) 34%, rgba(244,246,251,0) 58%)", opacity: 1 - tw(g, 82, 96, 0, 1, LINEAR) }} />}
      <Headline g={g} at={8} out={82} x={120} y={390} size={104} lines={[[{ w: "This" }, { w: "could" }, { w: "be" }, { w: "your" }], [{ w: "next", gold: true }, { w: "top", gold: true }, { w: "move.", gold: true }]]} />
      {g < 92 && <div style={{ position: "absolute", left: 124, top: 320, fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.22em", color: C.goldInk, textTransform: "uppercase",
        opacity: tw(g, 4, 12, 0, 1, LINEAR) * (1 - tw(g, 80, 88, 0, 1, LINEAR)), translate: `${tw(g, 4, 20, -30, 0)}px 0px` }}>Recruitment across Europe</div>}

      {/* city tiles flying from the wall to their pins */}
      {flights.map(({ c, i, t }) => {
        const e = pinsLanded(i);
        if (e >= 1) return null;
        const [sx, sy] = proj(tileWorld(t![0], t![1], g, wtx, wty));
        const [px, py] = cityAt(c.id, MAP1);
        // an arcing path: the tile lifts toward the camera a little on the way
        const x = lerp(sx, px, e), y = lerp(sy, py, e) - Math.sin(e * Math.PI) * 60;
        // the card keeps the wall's layout (520×340) and is scaled exactly as the camera scaled it, so its
        // text and borders stay the same size as it leaves; it ends as a 256 box at 0.25 = the 64 px pin
        const sc = lerp(WALL_S, 0.25, e);
        const W2 = lerp(TW, 256, e), H2 = lerp(TH, 256, e);
        return (
          <div key={c.id} style={{ position: "absolute", left: 0, top: 0, width: W2, height: H2, transform: `translate(${x - W2 / 2}px, ${y - H2 / 2}px) rotate(${lerp(-8, 0, e)}deg) scale(${sc})`,
            overflow: "hidden", borderRadius: lerp(20, 128, e), border: `${(4 * e) / sc}px solid #fff`, boxSizing: "border-box", boxShadow: "0 30px 60px -30px rgba(0,17,53,.35)", zIndex: 5 }}>
            <Tile id={c.id} label={1 - clamp01((e - 0.45) * 3)} />
          </div>
        );
      })}

      {/* ---------- the chaos, all in one group so it can collapse into F ---------- */}
      {chaos && (
        <AbsoluteFill style={{ transformOrigin: `${F[0]}px ${F[1]}px`, transform: `rotate(${-40 * implode}deg) scale(${1 - implode})`, opacity: 1 - tw(g, 470, 478, 0, 1, LINEAR) }}>
          {/* the routes */}
          {ROUTES.map((_, i) => {
            const k = tw(g, 192 + i * 8, 232 + i * 8, 0, 1, MOVE);
            if (k <= 0) return null;
            const pts = route(i), n = Math.max(2, Math.round(k * 48) + 1), shown = pts.slice(0, n);
            const end = shown[shown.length - 1];
            return (
              <React.Fragment key={i}>
                <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
                  <polyline points={shown.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.navy} strokeOpacity={0.8} strokeWidth={8} strokeLinecap="round"
                    strokeDasharray="1 17" strokeDashoffset={-g * 1.1} />
                </svg>
                <Badge x={end[0]} y={end[1]} k={tw(g, 226 + i * 8, 240 + i * 8, 0, 1, POP)} />
              </React.Fragment>
            );
          })}
          {/* the pins: their destinations, calling */}
          {g >= 150 && CITIES.map((c, i) => {
            if (pinsLanded(i) < 1 && flights.some((f) => f.i === i)) return null;
            const [x, y] = cityAt(c.id, MAP1);
            const popK = flights.some((f) => f.i === i) || g >= 214 ? 1 : tw(g, 170 + i * 3, 186 + i * 3, 0, 1, POP);
            const ring = ((g - 190 - i * 11) % 60) / 60;
            return <div key={c.id} style={{ position: "absolute", inset: 0, scale: String(popK), transformOrigin: `${x}px ${y}px` }}><Pin x={x} y={y} src={c.id} ring={g > 190 ? ring : 0} o={clamp01(popK * 2)} /></div>;
          })}
          {/* You */}
          {youK > 0 && (
            <>
              <div style={{ position: "absolute", left: you[0] - 40, top: you[1] - 40 - (1 - youK) * 160, width: 80, height: 80, borderRadius: "50%", background: C.navy, color: C.white,
                fontFamily: SANS, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", border: `5px solid ${C.goldHi}`, boxSizing: "border-box",
                boxShadow: SHADOW, opacity: youK }}>You</div>
              {g > 188 && g < 214 && <div style={{ position: "absolute", left: you[0] - 40 - (g - 188) * 2.5, top: you[1] - 40 - (g - 188) * 2.5, width: 80 + (g - 188) * 5, height: 80 + (g - 188) * 5,
                borderRadius: "50%", border: `3px solid ${C.gold}`, opacity: 1 - (g - 188) / 26 }} />}
            </>
          )}
          {/* where to look: a search window, results pouring through it */}
          {g >= 262 && (() => {
            const k = tw(g, 262, 282, 0, 1, ARRIVE);
            const typed = "jobs abroad".slice(0, Math.max(0, Math.floor((g - 270) / 1.6)));
            const scroll = Math.max(0, g - 284) * 9;
            return (
              <div style={{ ...card({ left: 1090 + (1 - k) * 1100, top: 470, width: 700, height: 420, overflow: "hidden", rotate: `${lerp(8, -3, k)}deg`, zIndex: 3 }) }}>
                <div style={{ height: 52, background: "#F7F8FC", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", gap: 9, padding: "0 20px" }}>
                  {["#F2C1B8", "#F4DDA6", "#BFE2C9"].map((b) => <span key={b} style={{ width: 13, height: 13, borderRadius: 7, background: b }} />)}
                </div>
                <div style={{ margin: "22px 24px 10px", height: 64, borderRadius: 32, border: `2px solid ${C.line}`, display: "flex", alignItems: "center", gap: 14, padding: "0 24px",
                  fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.ink }}>
                  <svg width={28} height={28} viewBox="0 0 24 24"><circle cx={10.5} cy={10.5} r={6.5} fill="none" stroke={C.muted} strokeWidth={2.4} /><path d="M15.5 15.5 L21 21" stroke={C.muted} strokeWidth={2.4} strokeLinecap="round" /></svg>
                  {typed}<span style={{ width: 3, height: 32, background: C.ink, opacity: Math.floor(g / 8) % 2 }} />
                </div>
                <div style={{ position: "relative", height: 280, overflow: "hidden" }}>
                  {Array.from({ length: 40 }, (_, r) => {
                    const y = 10 + r * 64 - scroll;
                    if (y < -70 || y > 300 || g < 284 + r * 1.2) return null;
                    return (
                      <div key={r} style={{ position: "absolute", left: 24, right: 24, top: y, height: 50, display: "flex", alignItems: "center", gap: 16 }}>
                        <span style={{ width: 44, height: 44, borderRadius: 10, background: [C.landHi, C.goldPale, C.pillBlue][r % 3] }} />
                        <div style={{ flex: 1, display: "grid", gap: 8 }}>
                          <span style={{ height: 12, width: `${55 + ((r * 37) % 40)}%`, borderRadius: 6, background: "#D9DFEC" }} />
                          <span style={{ height: 10, width: `${30 + ((r * 23) % 35)}%`, borderRadius: 5, background: "#E8ECF4" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
          {/* who to contact: messages that are delivered and never answered */}
          {["Hello?", "Who do I contact?", "Anyone there?"].map((t, i) => {
            const k = tw(g, 306 + i * 6, 322 + i * 6, 0, 1, ARRIVE);
            if (k <= 0) return null;
            const tx = 1080, ty = 130 + i * 104;
            const x = lerp(you[0] - 60, tx, k), y = lerp(you[1], ty, k);
            return (
              <div key={t} style={{ position: "absolute", left: x, top: y, scale: String(lerp(0.6, 1, k)), transformOrigin: "100% 50%", display: "grid", justifyItems: "end", gap: 4, zIndex: 4 }}>
                <div style={{ background: C.white, border: `1.5px solid ${C.line}`, borderRadius: "22px 22px 6px 22px", padding: "14px 24px", fontFamily: SANS, fontWeight: 600, fontSize: 34,
                  color: C.ink, boxShadow: SHADOW, whiteSpace: "nowrap" }}>{t}</div>
                <div style={{ fontFamily: SANS, fontSize: 18, color: C.muted, opacity: tw(g, 318 + i * 6, 326 + i * 6, 0, 1, LINEAR) }}>Delivered ✓</div>
              </div>
            );
          })}
          {g >= 330 && g < 350 && (
            <div style={{ position: "absolute", left: 1100, top: 450, display: "flex", gap: 8, background: C.white, borderRadius: 20, padding: "14px 18px", boxShadow: SHADOW,
              opacity: tw(g, 330, 334, 0, 1, LINEAR) * (1 - tw(g, 344, 350, 0, 1, LINEAR)), zIndex: 4 }}>
              {[0, 1, 2].map((d) => <span key={d} style={{ width: 12, height: 12, borderRadius: 6, background: C.faint, translate: `0px ${Math.sin((g - d * 4) / 3) * 4}px` }} />)}
            </div>
          )}
          {/* how it all works: paperwork falls in and piles up */}
          {DOCS.map((d, i) => {
            const t0 = 350 + i * 7;
            const drop = tw(g, t0, t0 + 14, 0, 1, DEPART), settle = tw(g, t0 + 14, t0 + 24, 0, 1, ARRIVE);
            if (drop <= 0) return null;
            const y = lerp(-240, d.y, drop) - Math.sin(settle * Math.PI) * 14;
            return (
              <div key={d.t} style={{ ...card({ left: d.x - 140, top: y - 78, width: 280, height: 156, borderRadius: 16, padding: "20px 22px", rotate: `${lerp(d.r * 3, d.r, drop)}deg`, zIndex: 6 }) }}>
                <div style={{ width: 44, height: 8, borderRadius: 4, background: C.gold, marginBottom: 14 }} />
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 31, color: C.ink, whiteSpace: "nowrap" }}>{d.t}</div>
                <div style={{ height: 9, width: "70%", borderRadius: 5, background: C.line, marginTop: 14 }} />
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      </AbsoluteFill>

      {/* ---------- the copy column ---------- */}
      <Headline g={g} at={108} out={184} x={120} y={250} size={84} lines={[[{ w: "Finding" }, { w: "a" }, { w: "job" }, { w: "abroad" }], [{ w: "can" }, { w: "be" }, { w: "difficult.", gold: true }]]} />
      {g >= 112 && g < 196 && (() => {
        const k = tw(g, 112, 138, 0, 1, ARRIVE), out = tw(g, 180, 194, 0, 1, DEPART);
        return (
          <div style={{ position: "absolute", left: 120, top: 520 + (1 - k) * 420 + out * 480, width: 620, height: 400, borderRadius: 24, overflow: "hidden", boxShadow: SHADOW, rotate: `${(1 - k) * 6}deg` }}>
            <Img src={staticFile("people/confused.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.05 + 0.05 * tw(g, 112, 196, 0, 1, LINEAR)) }} />
          </div>
        );
      })()}
      {QUESTIONS.map((q, i) => {
        const at = Q_AT[i];
        const k = tw(g, at, at + 16, 0, 1, ARRIVE);
        if (k <= 0) return null;
        const n = Q_AT.filter((a) => g >= a).length; // how many are showing
        const cur = n - 1 === i;
        const lift = tw(g, Q_AT[n - 1], Q_AT[n - 1] + 16, 0, 1, ARRIVE);
        const exit = tw(g, 446 + i * 3, 462 + i * 3, 0, 1, DEPART);
        const y = 300 + i * 118 - (n - 1 - (1 - lift)) * 40;
        return (
          <div key={q} style={{ position: "absolute", left: 120 - exit * 800, top: y + (1 - k) * 70, fontFamily: SERIF, fontWeight: 600, fontSize: cur ? 88 : 76, lineHeight: 1,
            color: cur ? C.navy : C.faint, opacity: k, filter: `blur(${(1 - k) * 8 + exit * 6}px)`, whiteSpace: "nowrap" }}>{q}</div>
        );
      })}

      {/* ---------- the solution: the point opens into a white disc ---------- */}
      {g >= 460 && (
        <>
          <div style={{ position: "absolute", left: F[0] - lerp(12, 2300, disc), top: F[1] - lerp(12, 2300, disc), width: lerp(24, 4600, disc), height: lerp(24, 4600, disc),
            borderRadius: "50%", background: disc > 0 ? C.white : C.gold, boxShadow: disc < 1 ? "0 0 0 10px rgba(200,168,75,.35)" : undefined,
            scale: String(tw(g, 460, 468, 0, 1, POP)) }} />
          <AbsoluteFill style={{ transformOrigin: "960px 560px", scale: String(1 + 0.07 * tw(g, 482, 530, 0, 1, LINEAR) * (1 - toHeader)) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 72, color: C.navy,
            opacity: tw(g, 474, 482, 0, 1, LINEAR) * (1 - tw(g, 526, 532, 0, 1, LINEAR)), translate: `0px ${tw(g, 474, 492, 40, 0) - tw(g, 526, 534, 0, 40, DEPART)}px`,
            filter: `blur(${tw(g, 474, 484, 8, 0, LINEAR)}px)` }}>That’s where</div>
          {(() => {
            // centred at 960,565, 820 wide → header at 90,50, 300 wide
            const w = lerp(820, 300, toHeader), cx = lerp(960, 90 + 150, toHeader), cy = lerp(565, 50 + 36, toHeader);
            return g < 558 && (
              <Img src={staticFile("img/logo-navy.png")} style={{ position: "absolute", left: cx - w / 2, top: cy - (w * 203) / 852 / 2, width: w,
                opacity: logoIn, scale: String(lerp(0.82, 1, logoIn)), filter: `blur(${(1 - logoIn) * 10}px)` }} />
            );
          })()}
          <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 72, color: C.goldInk,
            opacity: tw(g, 494, 502, 0, 1, LINEAR) * (1 - tw(g, 526, 532, 0, 1, LINEAR)), translate: `0px ${tw(g, 494, 512, 40, 0) + tw(g, 526, 534, 0, 40, DEPART)}px`,
            filter: `blur(${tw(g, 494, 504, 8, 0, LINEAR)}px)` }}>comes in.</div>
          </AbsoluteFill>
        </>
      )}
    </AbsoluteFill>
  );
};
