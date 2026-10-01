import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Bucket, Detail, Home, MapScreen, Phone, SH, SW, Tap, TabBar, push } from "./app";
import { CLIENTS, NEW_TILE, SKINS, Skin, TILES, TILE_TYPES, Tile } from "./data";
import { Brochure, Chat, Website } from "./Fragments";
import { ARRIVE, C, Cam, Caption, DEPART, FONT, Glow, LINEAR, MOVE, POP, SHADOW, clamp01, keys, lerp, tw, useFonts } from "./lib";
import { Portal, upButtonAt } from "./Portal";
import { POI } from "./rome";

// GoHere · website hero film, cut to the ElevenLabs voice-over (34.8 s; word times force-aligned):
//   0    "What if your visitors had your own app in their pocket?"        a visitor, phone in hand
//   101  "Today, your best places are spread across websites (172), brochures (196) and conversations (228)."
//   268  "GoHere brings them together (299) in your own branded app (335)."  the pieces fly into the phone
//   369  "Your name. (396) Your logo. (426) Your colors."  one app becomes four real client apps, step by step
//   460  "You choose what appears on the homepage."       a tile type is picked; the grid makes room
//   530  "Visitors explore places on the map, open a location (593), and instantly see photos (656),
//        opening hours (678) and directions (710)."     map → pin → place card → the tip page
//   742  "They can save places (749) in bucket lists (775) and share them (801)."
//   829  "You manage the app yourself through the GoHere portal (896)."   the real portal: ↑ moves a tile
//   924  "Want to see your own app?"
//   962  "Get a free preview (968) at gohere.app (999)."   end card to 1110
export const DURATION = 1110;

const PHONE = { w: SW + 28, h: SH + 28 };
// where the phone sits: centre x, centre y, scale
const phoneX = (g: number) => keys(g, [[0, 1290], [826, 1290], [852, 1570], [916, 1570], [944, 960], [962, 960], [990, 1480]]);
const phoneY = (g: number) => keys(g, [[0, 545], [826, 545], [852, 575], [916, 575], [944, 545], [990, 560]]);
const phoneS = (g: number) => keys(g, [[0, 1], [826, 1], [852, 0.84], [916, 0.84], [944, 1], [990, 0.96]]);

// the homepage, live: the tile added at 482, then "Hidden gems" moved up twice in the portal
const ORDER0 = ["rest", "near", "add", "gems", "sights", "contact"];
const ALL: Tile[] = [...TILES.slice(0, 1), NEW_TILE, ...TILES.slice(1)];
const slotAt = (g: number) => (id: string): number => {
  const ins = tw(g, 484, 508, 0, 1, MOVE);
  if (id === "pasta") return g < 506 ? -100 : 1;
  let s = ORDER0.indexOf(id) + (ORDER0.indexOf(id) >= 1 ? ins : 0);
  // portal moves: gems 4 → 3 → 2; add 3 → 4; near 2 → 3
  const m1 = tw(g, 868, 882, 0, 1, MOVE), m2 = tw(g, 886, 900, 0, 1, MOVE);
  if (id === "gems") s -= m1 + m2;
  if (id === "add") s += m1;
  if (id === "near") s += m2;
  return s;
};

/** A phone at its place on the stage. */
const Stage: React.FC<{ x: number; y: number; s: number; o?: number; children: React.ReactNode; rot?: number }> = ({ x, y, s, o = 1, children, rot = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: PHONE.w, height: PHONE.h, transform: `translate(${x - PHONE.w / 2}px, ${y - PHONE.h / 2}px) scale(${s}) rotate(${rot}deg)`, opacity: o }}>
    {children}
  </div>
);

// the four client apps, built up word by word: name, then logo, then colours
const ClientPhone: React.FC<{ g: number; i: number }> = ({ g, i }) => {
  const cl = SKINS[CLIENTS[i]], base = SKINS.brand;
  const nameK = tw(g, 369 + i * 3, 381 + i * 3, 0, 1, LINEAR), logoK = tw(g, 396 + i * 3, 410 + i * 3, 0, 1, POP), colK = tw(g, 426 + i * 4, 446 + i * 4, 0, 1, MOVE);
  const mid: Skin = { ...base, name: nameK > 0.5 ? cl.name : base.name, logo: logoK > 0.02 ? cl.logo : undefined };
  const flash = (t0: number) => Math.max(0, 1 - Math.abs(g - t0 - 6) / 10);
  return (
    <Phone>
      <Home skin={mid} tiles={TILES} slot={(id) => ORDER0.indexOf(id)} />
      {colK > 0 && (
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - colK) * 100}% 0 0)` }}>
          <Home skin={cl} tiles={TILES} slot={(id) => ORDER0.indexOf(id)} />
        </div>
      )}
      <TabBar active={0} accent={colK > 0.5 ? cl.accent : base.accent} />
      {/* a soft light-green ring marks what just changed */}
      {[369, 396].map((t0, k) => flash(t0 + i * 3) > 0 && (
        <div key={k} style={{ position: "absolute", left: SW / 2 - 130, top: k === 0 ? 118 : 50, width: 260, height: k === 0 ? 56 : 84, borderRadius: 20, border: `4px solid ${C.mint}`,
          opacity: flash(t0 + i * 3), scale: String(1 + 0.08 * (1 - flash(t0 + i * 3))) }} />
      ))}
    </Phone>
  );
};

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  const ready = useFonts();
  if (!ready) return null;

  // ---------------------------------------------------------------- timing
  const hookOut = tw(g, 84, 112, 0, 1, MOVE);
  const gather = tw(g, 290, 322, 0, 1, DEPART);         // the fragments are pulled into the phone
  const phoneIn = tw(g, 300, 338, 0, 1, ARRIVE);
  const fanOut = tw(g, 364, 392, 0, 1, MOVE), fanIn = tw(g, 446, 470, 0, 1, MOVE);
  const fan = fanOut * (1 - fanIn);
  const px = phoneX(g), py = phoneY(g) + (1 - phoneIn) * 120, ps = phoneS(g) * lerp(0.9, 1, phoneIn);
  const sx = (x: number) => px + (x - SW / 2) * ps, sy = (y: number) => py + (y - SH / 2) * ps; // a screen point → the frame

  // the camera eases in on the tip page while it shows photos, hours and directions
  const camS = keys(g, [[0, 1], [640, 1], [668, 1.2], [742, 1.2], [770, 1]]);
  const camX = keys(g, [[0, 960], [640, 960], [668, 1180], [742, 1180], [770, 960]]);
  const camY = keys(g, [[0, 540], [640, 540], [668, 560], [700, 600], [742, 600], [770, 540]]);

  // ---------------------------------------------------------------- the phone's screen
  const skin = SKINS.brand;
  const toMap = tw(g, 530, 538, 0, 1, LINEAR);
  const toDetail = tw(g, 618, 642, 0, 1);
  const toBucket = tw(g, 762, 786, 0, 1);
  const toHome = tw(g, 822, 832, 0, 1, LINEAR);
  const mapView = { mx: keys(g, [[530, 760], [600, 860], [620, 880]]), my: keys(g, [[530, 470], [600, 560], [620, 580]]), ms: keys(g, [[530, 0.6], [620, 0.72]]) };
  const favS: [number, number] = [SW / 2 + (POI.fav[0] - mapView.mx) * mapView.ms, 400 + (POI.fav[1] - mapView.my) * mapView.ms];

  const screen = (
    <>
      {/* home (and again after the bucket list, live with the portal) */}
      {(toMap < 1 || toHome > 0) && (
        <div style={{ position: "absolute", inset: 0, opacity: g < 700 ? 1 - toMap : toHome }}>
          <Home skin={skin} tiles={ALL} slot={slotAt(g)} hl={(id) => (id === "pasta" ? tw(g, 506, 512, 0, 1) * (1 - tw(g, 520, 530, 0, 1)) : id === "gems" ? tw(g, 866, 872, 0, 1) * (1 - tw(g, 904, 914, 0, 1)) : 0)}
            scroll={tw(g, 1000, 1110, 0, 80, MOVE)} />
          <TabBar active={0} accent={skin.accent} />
        </div>
      )}
      {/* map */}
      {toMap > 0 && toDetail < 1 && g < 700 && (
        <div style={{ position: "absolute", inset: 0, opacity: toMap, transform: push(toDetail).outgoing }}>
          <MapScreen g={g} skin={skin} {...mapView} pinsK={(i) => tw(g, 538 + i * 3, 556 + i * 3, 0, 1, POP)} selected={0} card={tw(g, 596, 614, 0, 1)} />
          <TabBar active={1} accent={skin.accent} />
        </div>
      )}
      {/* tip page */}
      {toDetail > 0 && toBucket < 1 && (
        <div style={{ position: "absolute", inset: 0, transform: toBucket > 0 ? push(toBucket).outgoing : push(toDetail).incoming }}>
          <Detail g={g} skin={skin} photo={tw(g, 650, 664, 0, 1, MOVE) + tw(g, 690, 704, 0, 1, MOVE)} hours={tw(g, 676, 690, 0, 1) * (1 - tw(g, 706, 716, 0, 1))}
            route={tw(g, 712, 740, 0, 1, MOVE)} saved={tw(g, 748, 760, 0, 1, LINEAR)} />
        </div>
      )}
      {/* bucket list */}
      {toBucket > 0 && toHome < 1 && (
        <div style={{ position: "absolute", inset: 0, transform: push(toBucket).incoming }}>
          <Bucket skin={skin} added={tw(g, 780, 796, 0, 1)} share={tw(g, 803, 820, 0, 1)} />
        </div>
      )}
      {/* taps */}
      <Tap x={146} y={800} g={g} at={526} />
      <Tap x={favS[0]} y={favS[1] - 22} g={g} at={590} />
      <Tap x={200} y={660} g={g} at={614} />
      <Tap x={75} y={533} g={g} at={706} />
      <Tap x={354} y={76} g={g} at={745} />
      <Tap x={360} y={82} g={g} at={799} />
    </>
  );

  // ---------------------------------------------------------------- portal cursor
  const btn = upButtonAt(4), btn2 = upButtonAt(3);
  const PW = { x: 90 - (1 - tw(g, 826, 856, 0, 1)) * 1300 - tw(g, 904, 924, 0, 1, DEPART) * 1400, y: 230 };
  const cur = tw(g, 846, 864, 0, 1, MOVE);
  const cx = lerp(PW.x + 900, PW.x + btn[0], cur), cy = lerp(PW.y + 700, PW.y + btn[1], cur) + (g > 878 ? -tw(g, 878, 884, 0, 1, MOVE) * (btn[1] - btn2[1]) : 0);
  const pressAt = (t0: number) => Math.max(0, 1 - Math.abs(g - t0) / 4);

  // a slow push through every beat; it eases back during the scene changes, never with a jump
  const pushS = keys(g, [[0, 1], [92, 1.035], [116, 1], [286, 1.04], [300, 1], [362, 1.035], [376, 1], [456, 1.03], [470, 1], [528, 1.03], [540, 1], [640, 1.02],
    [742, 1.02], [760, 1], [822, 1.035], [840, 1], [916, 1.03], [930, 1], [958, 1.02], [972, 1], [1110, 1.05]]);
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Glow g={g} />
      <AbsoluteFill style={{ transformOrigin: "1000px 540px", transform: `scale(${pushS})` }}>

      <Cam x={camX} y={camY} s={camS}>
        {/* 2 · their best places, loose photos that drift in on "best places" and are taken up by the fragments */}
        {g >= 120 && g < 236 && [["trevi", 1180, 560, -6], ["pantheon", 1520, 420, 5], ["alley", 900, 700, 4], ["pasta", 1600, 760, -4], ["colosseum", 1280, 860, 7]].map(([p, x, y, r], i) => {
          const k = tw(g, 124 + i * 5, 150 + i * 5, 0, 1);
          const out = tw(g, 168 + i * 9, 186 + i * 9, 0, 1, DEPART);
          return (
            <div key={p as string} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${(x as number) - 110}px, ${(y as number) - 80 + (1 - k) * 60 + Math.sin((g + i * 30) / 40) * 6}px) rotate(${r}deg) scale(${lerp(0.8, 1, k) * (1 - 0.4 * out)})`,
              opacity: clamp01(k * 2) * (1 - out), width: 220, height: 160, borderRadius: 16, overflow: "hidden", boxShadow: SHADOW, border: "5px solid #fff" }}>
              <Img src={staticFile(`photos/${p}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          );
        })}
        {/* 2 · the fragments */}
        {g >= 160 && gather < 1 && (() => {
          const pull = (x: number, y: number) => ({ x: lerp(x, px, gather), y: lerp(y, py, gather), s: lerp(1, 0.15, gather) });
          const drift = (k: number) => Math.sin((g + k * 40) / 50) * 6;
          const w = pull(140 + 320, 500 + 210), b = pull(900 + 285, 420 + 200), c = pull(1340 + 235, 150 + 120);
          const wk = tw(g, 168, 192, 0, 1), bk = tw(g, 192, 216, 0, 1), ck = tw(g, 224, 246, 0, 1);
          return (
            <>
              {wk > 0 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${w.x - 320 - (1 - wk) * 200}px, ${w.y - 210 + drift(0)}px) rotate(${lerp(-6, -2, wk) + gather * 20}deg) scale(${w.s})`, opacity: clamp01(wk * 2) }}><Website /></div>}
              {bk > 0 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${b.x - 285}px, ${b.y - 200 + (1 - bk) * 240 + drift(1)}px) rotate(${lerp(10, 5, bk) - gather * 20}deg) scale(${b.s})`, opacity: clamp01(bk * 2) }}><Brochure open={bk} /></div>}
              {ck > 0 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${c.x - 235}px, ${c.y - 120 + drift(2)}px) scale(${c.s})` }}><Chat g={g} at={224} /></div>}
            </>
          );
        })()}

        {/* 3–9 · the phone */}
        {g >= 296 && (fan < 0.02 || g > 466) && (
          <Stage x={px} y={py} s={ps} o={clamp01(phoneIn * 2) * (g > 362 && g < 470 ? tw(g, 462, 470, 0, 1, LINEAR) : 1)}>
            <Phone>{screen}</Phone>
          </Stage>
        )}
        {/* 4 · one app becomes four client apps */}
        {fan > 0.001 && CLIENTS.map((id, i) => {
          const fx = 360 + i * 400, fy = 650;
          const k = clamp01(fan * 1.15 - i * 0.05);
          return (
            <Stage key={id} x={lerp(px, fx, k)} y={lerp(py, fy, k)} s={lerp(1, 0.7, k)} rot={lerp(0, (i - 1.5) * 2, k)}>
              <ClientPhone g={g} i={i} />
            </Stage>
          );
        })}
        {/* 5 · the tile picker */}
        {g >= 462 && g < 532 && (() => {
          const k = tw(g, 464, 482, 0, 1) * (1 - tw(g, 520, 532, 0, 1, DEPART));
          const pick = tw(g, 476, 482, 0, 1, LINEAR);
          const fly = tw(g, 484, 506, 0, 1, MOVE);
          const [tx, ty] = [sx(18 + 171 + 12 + 171 / 2), sy(318 + 64)];
          return (
            <>
              <div style={{ position: "absolute", left: 140, top: 640, display: "flex", flexWrap: "wrap", gap: 14, width: 700, opacity: k, translate: `${(1 - k) * -40}px 0px` }}>
                {TILE_TYPES.map((t, i) => (
                  <span key={t} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, padding: "12px 22px", borderRadius: 999, background: i === 0 ? `rgba(163,210,194,${0.4 + 0.6 * pick})` : C.white,
                    border: `2px solid ${i === 0 ? C.mint : C.line}`, color: C.navy, boxShadow: i === 0 && pick > 0 ? SHADOW : undefined, scale: String(i === 0 ? 1 + 0.06 * pick : 1) }}>{t}</span>
                ))}
              </div>
              {fly > 0 && fly < 1 && (
                <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(260, tx, fly) - 85}px, ${lerp(668, ty, fly) - 64 - Math.sin(fly * Math.PI) * 80}px) scale(${lerp(0.7, ps, fly)})`, transformOrigin: "50% 50%" }}>
                  <div style={{ width: 171, height: 128, borderRadius: 14, overflow: "hidden", boxShadow: SHADOW, position: "relative" }}>
                    <Img src={staticFile("photos/pasta.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,.55) 100%)" }} />
                    <div style={{ position: "absolute", left: 12, bottom: 10, fontFamily: FONT, fontWeight: 800, fontSize: 16.5, color: C.white }}>Best pasta in town</div>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </Cam>

      {/* 8 · the portal, sliding in from the left */}
      {g >= 826 && g < 926 && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${PW.x}px, ${PW.y}px)` }}>
          <Portal tiles={ALL} rowPos={slotAt(g)} press={(id) => (id === "gems" ? pressAt(868) + pressAt(886) : 0)} hlRow={g > 862 && g < 914 ? "gems" : undefined} />
        </div>
      )}
      {g >= 840 && g < 930 && (
        <svg width={44} height={44} viewBox="0 0 24 24" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${cx - 6}px, ${cy - 4}px) scale(${1 - 0.15 * (pressAt(868) + pressAt(886))})`,
          filter: "drop-shadow(0 6px 8px rgba(20,20,48,.35))", opacity: tw(g, 840, 846, 0, 1, LINEAR) * (1 - tw(g, 916, 924, 0, 1, LINEAR)) }}>
          <path d="M4 2l15 9-6.5 1.6L16 20l-2.8 1.3-3.4-7.3L4 18z" fill={C.navy} stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      )}

      {/* 1 · the hook: a visitor, phone in hand */}
      {hookOut < 1 && (
        <AbsoluteFill style={{ opacity: 1 - tw(g, 98, 112, 0, 1, LINEAR) }}>
          <Img src={staticFile("photos/visitor.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%",
            transformOrigin: "58% 66%", scale: String(1.04 + 0.05 * tw(g, 0, 84, 0, 1, LINEAR) + 1.4 * hookOut), filter: hookOut > 0 ? `blur(${hookOut * 14}px)` : undefined }} />
          <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(255,255,255,.95) 0%, rgba(255,255,255,.82) 36%, rgba(255,255,255,0) 60%)" }} />
        </AbsoluteFill>
      )}

      {/* ---------------------------------------------------------------- the captions */}
      <Caption g={g} at={2} out={84} x={120} y={330} size={84} lines={[[{ w: "What" }, { w: "if" }, { w: "your" }, { w: "visitors" }], [{ w: "had" }, { w: "your", hl: true }, { w: "own", hl: true }, { w: "app", hl: true }], [{ w: "in" }, { w: "their" }, { w: "pocket?" }]]} />
      <Caption g={g} at={101} out={256} x={120} y={150} size={66} lines={[[{ w: "Today," }, { w: "your" }, { w: "best" }, { w: "places" }], [{ w: "are" }, { w: "spread" }, { w: "across" }, { w: "websites,", hl: true, t: 172 }],
        [{ w: "brochures", hl: true, t: 196 }, { w: "and", t: 218 }, { w: "conversations.", hl: true, t: 228 }]]} />
      <Caption g={g} at={270} out={356} x={120} y={360} size={76} lines={[[{ w: "GoHere" }, { w: "brings" }, { w: "them" }], [{ w: "together", hl: true, t: 299 }, { w: "in" }, { w: "your" }, { w: "own" }], [{ w: "branded", hl: true, t: 335 }, { w: "app.", hl: true, t: 339 }]]} />
      <Caption g={g} at={369} out={452} x={960} y={78} size={78} align="center" lines={[[{ w: "Your", t: 369 }, { w: "name.", hl: true, t: 375 }, { w: "Your", t: 396 }, { w: "logo.", hl: true, t: 401 }, { w: "Your", t: 426 }, { w: "colors.", hl: true, t: 432 }]]} />
      <Caption g={g} at={460} out={524} x={120} y={300} size={76} lines={[[{ w: "You" }, { w: "choose" }, { w: "what" }], [{ w: "appears" }, { w: "on" }, { w: "the" }], [{ w: "homepage.", hl: true, t: 478 }]]} />
      <Caption g={g} at={530} out={638} x={120} y={360} size={76} lines={[[{ w: "Visitors" }, { w: "explore" }], [{ w: "places" }, { w: "on" }, { w: "the" }, { w: "map.", hl: true, t: 573 }]]} />
      <Caption g={g} at={646} out={738} x={120} y={330} size={76} lines={[[{ w: "Photos,", hl: true, t: 656 }], [{ w: "opening", hl: true, t: 678 }, { w: "hours", hl: true, t: 684 }], [{ w: "and", t: 704 }, { w: "directions.", hl: true, t: 710 }]]} />
      <Caption g={g} at={742} out={822} x={120} y={330} size={76} lines={[[{ w: "They", t: 742 }, { w: "can", t: 745 }, { w: "save", t: 749 }, { w: "places", t: 756 }], [{ w: "in", t: 770 }, { w: "bucket", hl: true, t: 775 }, { w: "lists", hl: true, t: 781 }], [{ w: "and", t: 796 }, { w: "share", hl: true, t: 801 }, { w: "them.", t: 808 }]]} />
      <Caption g={g} at={829} out={918} x={100} y={70} size={62} lines={[[{ w: "You" }, { w: "manage" }, { w: "the" }, { w: "app" }, { w: "yourself" }], [{ w: "through" }, { w: "the" }, { w: "GoHere", hl: true, t: 882 }, { w: "portal.", hl: true, t: 896 }]]} />
      <Caption g={g} at={926} out={958} x={120} y={410} size={80} lines={[[{ w: "Want" }, { w: "to" }, { w: "see" }], [{ w: "your", hl: true }, { w: "own", hl: true }, { w: "app?", hl: true }]]} />

      {/* 10 · end card */}
      {g >= 958 && (() => {
        const k = tw(g, 962, 986, 0, 1);
        const press = Math.max(0, 1 - Math.abs(g - 1040) / 5);
        return (
          <>
            <Img src={staticFile("img/gohere-logo-1.png")} style={{ position: "absolute", left: 122, top: 210, width: 360, opacity: k, translate: `${(1 - k) * -30}px 0px` }} />
            <Caption g={g} at={964} out={2000} x={120} y={360} size={86} lines={[[{ w: "Get" }, { w: "a" }, { w: "free", hl: true, t: 968 }, { w: "preview", hl: true, t: 972 }], [{ w: "at" }, { w: "gohere.app", t: 999 }]]} />
            <div style={{ position: "absolute", left: 120, top: 620, display: "flex", gap: 18, alignItems: "center", opacity: tw(g, 1004, 1016, 0, 1, LINEAR), translate: `0px ${tw(g, 1004, 1024, 24, 0)}px` }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.navy, background: C.mint, borderRadius: 999, padding: "20px 38px", scale: String(1 - 0.05 * press),
                boxShadow: "0 16px 30px -14px rgba(94,159,138,.8)" }}>Get your free preview</span>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.navy, padding: "20px 10px" }}>gohere.app</span>
            </div>
            {/* real GoHere apps */}
            <div style={{ position: "absolute", left: 120, top: 800, display: "flex", gap: 34, alignItems: "center", opacity: tw(g, 1020, 1034, 0, 1, LINEAR) }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: C.slate, textTransform: "uppercase" }}>Apps by</span>
              {CLIENTS.map((id, i) => (
                <span key={id} style={{ display: "flex", alignItems: "center", gap: 12, opacity: tw(g, 1022 + i * 4, 1032 + i * 4, 0, 1, LINEAR), translate: `0px ${tw(g, 1022 + i * 4, 1040 + i * 4, 16, 0)}px` }}>
                  <Img src={staticFile(SKINS[id].logo!)} style={{ width: 52, height: 52, borderRadius: 13, boxShadow: "0 6px 14px -6px rgba(20,20,48,.4)" }} />
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 21, color: C.navy, whiteSpace: "nowrap" }}>{SKINS[id].name}</span>
                </span>
              ))}
            </div>
          </>
        );
      })()}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
