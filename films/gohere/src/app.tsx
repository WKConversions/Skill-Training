import React from "react";
import { Img, staticFile } from "remotion";
import { BUCKET, Skin, Tile } from "./data";
import { C, FONT, MOVE, clamp01, lerp, tw } from "./lib";
import { POI, RIVER, ROADS, PARKS, ROME_H, ROME_W } from "./rome";

// The GoHere app, rebuilt from their app screens (home with tiles, map, tip, bucket list) so it can be
// animated live: 390×844 logical points, as on an iPhone.
export const SW = 390, SH = 844;

const I: Record<string, string> = {
  home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  map: "M9 4l6 2 5-2v14l-5 2-6-2-5 2V6zM9 4v14M15 6v14",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20c1.2-3.6 4-5 7.5-5s6.3 1.4 7.5 5",
  back: "M15 5l-7 7 7 7",
  share: "M12 3v12M7 8l5-5 5 5M5 13v6h14v-6",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 15V11a3 3 0 0 1 3-3h7",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
  fork: "M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 1.5-3 4-3 7h3v11",
  filter: "M4 6h16M7 12h10M10 18h4",
  chev: "M6 9l6 6 6-6",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  chat: "M5 5h14v10H9l-4 4z",
};
export const Icon: React.FC<{ n: string; s?: number; c?: string; w?: number; fill?: string }> = ({ n, s = 22, c = C.navy, w = 1.9, fill = "none" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d={I[n]} fill={fill} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Stars: React.FC<{ n?: number; s?: number; k?: number }> = ({ n = 5, s = 15, k = 1 }) => (
  <span style={{ display: "inline-flex", gap: 2 }}>
    {Array.from({ length: n }, (_, i) => (
      <svg key={i} width={s} height={s} viewBox="0 0 24 24" style={{ scale: String(clamp01(k * 5 - i)) }}><path d="M12 2.8l2.8 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.1l-5.6 3 1.1-6.3L2.9 9.4l6.3-.9z" fill={C.star} /></svg>
    ))}
  </span>
);

/** The iPhone: a dark bezel, the island, and the screen clipped to its corners. */
export const Phone: React.FC<{ children: React.ReactNode; shadow?: boolean }> = ({ children, shadow = true }) => (
  <div style={{ position: "relative", width: SW + 28, height: SH + 28, borderRadius: 68, background: "#17171C",
    boxShadow: shadow ? "0 70px 120px -50px rgba(20,20,48,.55), 0 20px 50px -20px rgba(20,20,48,.3), inset 0 0 0 2px #3A3A44" : "inset 0 0 0 2px #3A3A44" }}>
    <div style={{ position: "absolute", left: 14, top: 14, width: SW, height: SH, borderRadius: 54, overflow: "hidden", background: C.white }}>
      {children}
      <div style={{ position: "absolute", left: SW / 2 - 62, top: 11, width: 124, height: 36, borderRadius: 18, background: "#000" }} />
    </div>
  </div>
);

export const StatusBar: React.FC<{ light?: boolean }> = ({ light }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 34px 0 40px",
    fontFamily: FONT, fontWeight: 700, fontSize: 16, color: light ? C.white : C.navy, zIndex: 20 }}>
    <span>9:41</span>
    <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <span style={{ width: 18, height: 11, borderRadius: 2, background: light ? C.white : C.navy, opacity: 0.9 }} />
      <span style={{ width: 24, height: 12, borderRadius: 3.5, border: `1.5px solid ${light ? C.white : C.navy}`, padding: 1.5, boxSizing: "border-box" }}>
        <span style={{ display: "block", width: "80%", height: "100%", borderRadius: 1.5, background: light ? C.white : C.navy }} />
      </span>
    </span>
  </div>
);

export const TabBar: React.FC<{ active: number; accent: string }> = ({ active, accent }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 84, background: C.white, borderTop: `1px solid ${C.line}`, display: "flex", paddingTop: 10, zIndex: 15 }}>
    {[["home", "Home"], ["map", "Map"], ["heart", "Saved"], ["user", "Profile"]].map(([n, l], i) => (
      <div key={l} style={{ flex: 1, display: "grid", justifyItems: "center", gap: 3, fontFamily: FONT, fontWeight: 700, fontSize: 11, color: i === active ? accent : C.faint }}>
        <Icon n={n} s={24} c={i === active ? accent : C.faint} />{l}
      </div>
    ))}
    <div style={{ position: "absolute", left: SW / 2 - 67, bottom: 8, width: 134, height: 5, borderRadius: 3, background: C.navy }} />
  </div>
);

/** A tap: a soft ring that grows and fades where a finger touched. */
export const Tap: React.FC<{ x: number; y: number; g: number; at: number }> = ({ x, y, g, at }) => {
  const k = (g - at) / 16;
  if (k < -0.3 || k > 1) return null;
  const press = clamp01(1 - Math.abs(k + 0.1) * 3);
  return (
    <>
      <div style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: "rgba(20,20,48,.22)", scale: String(0.6 + 0.4 * press), opacity: press, zIndex: 40 }} />
      {k > 0 && <div style={{ position: "absolute", left: x - 22 - 26 * k, top: y - 22 - 26 * k, width: 44 + 52 * k, height: 44 + 52 * k, borderRadius: "50%", border: `2.5px solid rgba(20,20,48,.35)`, opacity: 1 - k, zIndex: 40 }} />}
    </>
  );
};

// ---------------------------------------------------------------- home
export const TILE_W = 171, TILE_H = 128, GRID_X = 18, GRID_Y = 318, GAP = 12;
export const tileXY = (i: number): [number, number] => [GRID_X + (i % 2) * (TILE_W + GAP), GRID_Y + Math.floor(i / 2) * (TILE_H + GAP)];

export const TileView: React.FC<{ t: Tile; skin: Skin; hl?: number }> = ({ t, skin, hl = 0 }) => (
  <div style={{ position: "relative", width: TILE_W, height: TILE_H, borderRadius: 14, overflow: "hidden", background: t.photo ? "#000" : skin.tile,
    boxShadow: hl > 0 ? `0 0 0 ${3 * hl}px ${C.mint}, 0 16px 30px -12px rgba(20,20,48,.5)` : "0 6px 14px -8px rgba(20,20,48,.35)" }}>
    {t.photo && <Img src={staticFile(`${t.photo}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
    {t.photo && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,.55) 100%)" }} />}
    <div style={{ position: "absolute", left: 12, right: 12, bottom: t.photo ? 10 : undefined, top: t.photo ? undefined : 0, height: t.photo ? undefined : "100%", display: "flex",
      alignItems: t.photo ? "flex-end" : "center", justifyContent: t.photo ? "flex-start" : "center", textAlign: t.photo ? "left" : "center",
      fontFamily: FONT, fontWeight: 800, fontSize: 16.5, lineHeight: 1.2, color: skin.tileInk }}>{t.label}</div>
  </div>
);

export const Header: React.FC<{ skin: Skin; h?: number }> = ({ skin, h = 196 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: h, overflow: "hidden", background: skin.accent }}>
    <Img src={staticFile(`${skin.header}.${skin.header.startsWith("img/") ? "png" : "jpg"}`)} style={{ width: "100%", height: skin.header.startsWith("img/") ? "auto" : "100%", objectFit: "cover",
      objectPosition: skin.headerPos, ...(skin.header.startsWith("img/") ? { position: "absolute", left: -48, top: -32, width: SW * 1.32 } : {}) }} />
    {!skin.header.startsWith("img/") && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.15) 50%, rgba(0,0,0,.35) 100%)" }} />}
    {!skin.header.startsWith("img/") && (
      <div style={{ position: "absolute", left: 0, right: 0, top: skin.logo ? 66 : 92, display: "grid", justifyItems: "center", gap: 8 }}>
        {skin.logo && <Img src={staticFile(skin.logo)} style={{ width: 58, height: 58, borderRadius: 14, boxShadow: "0 6px 16px rgba(0,0,0,.3)" }} />}
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: skin.logo ? 24 : 30, letterSpacing: "0.02em", color: C.white, textShadow: "0 2px 12px rgba(0,0,0,.35)", textTransform: skin.logo ? undefined : "uppercase" }}>{skin.name}</div>
      </div>
    )}
  </div>
);

/** The homepage. `order` lists tile ids in grid order; `pos` can override a tile's slot (for live moves). */
export const Home: React.FC<{ skin: Skin; tiles: Tile[]; slot: (id: string) => number; extra?: React.ReactNode; hl?: (id: string) => number; scroll?: number }> = ({ skin, tiles, slot, extra, hl, scroll = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: C.white }}>
    <div style={{ position: "absolute", inset: 0, translate: `0px ${-scroll}px` }}>
      <Header skin={skin} />
      <div style={{ position: "absolute", left: 18, right: 18, top: 214 }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 21, color: C.navy }}>{skin.welcome}</div>
        <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: 1.4, color: C.slate, marginTop: 6 }}>Here you’ll find everything you need to plan your adventure: the tips, hidden gems and information.</div>
      </div>
      {tiles.map((t) => {
        const s = slot(t.id);
        if (s < -50) return null;
        const r = s - Math.floor(s), i0 = Math.floor(s);
        const [x0, y0] = tileXY(i0), [x1, y1] = tileXY(i0 + 1);
        const x = lerp(x0, x1, r), y = lerp(y0, y1, r);
        return (
          <div key={t.id} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)` }}>
            <TileView t={t} skin={skin} hl={hl ? hl(t.id) : 0} />
          </div>
        );
      })}
      {extra}
    </div>
    <StatusBar light />
  </div>
);

// ---------------------------------------------------------------- map
/** The map: central Rome from OpenStreetMap, with tip pins. (mx, my) is the map point at the screen centre. */
export const MapScreen: React.FC<{ g: number; skin: Skin; mx: number; my: number; ms: number; pinsK: (i: number) => number; selected: number; card: number }> = ({ g, skin, mx, my, ms, pinsK, selected, card }) => {
  const toS = (p: [number, number]): [number, number] => [SW / 2 + (p[0] - mx) * ms, 400 + (p[1] - my) * ms];
  const PINS: [number, number][] = [POI.fav, POI.pantheon, POI.navona, POI.trevi, POI.campo, [560, 300], [980, 820], [1020, 420], [640, 700], [300, 600]];
  return (
    <div style={{ position: "absolute", inset: 0, background: "#EEF0EC", overflow: "hidden" }}>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", transformOrigin: "0 0",
        transform: `translate(${SW / 2 - mx * ms}px, ${400 - my * ms}px) scale(${ms})` }} width={ROME_W} height={ROME_H}>
        <path d={PARKS} fill="#CFE8C9" stroke="none" />
        <path d={RIVER} fill="none" stroke="#AEDAF0" strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
        <path d={ROADS.minor} fill="none" stroke="#FFFFFF" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d={ROADS.ped} fill="none" stroke="#F8F8F4" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <path d={ROADS.major} fill="none" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        <path d={ROADS.major} fill="none" stroke="#F6E7B8" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {PINS.map((p, i) => {
        const k = pinsK(i);
        if (k <= 0) return null;
        const [x, y] = toS(p);
        const sel = i === selected ? clamp01(card * 3) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - 19}px, ${y - 44 - (1 - k) * 30}px) scale(${(0.6 + 0.4 * k) * (1 + 0.25 * sel)})`,
            transformOrigin: "50% 100%", opacity: clamp01(k * 2) }}>
            <svg width={38} height={46} viewBox="0 0 38 46">
              <path d="M19 45C19 45 3 28 3 18a16 16 0 0 1 32 0c0 10-16 27-16 27z" fill={sel > 0.5 ? skin.accent : C.white} stroke={skin.accent} strokeWidth={2.5} />
              <g transform="translate(9 8) scale(0.85)"><path d={i % 3 === 0 ? I.fork : I.heart} fill="none" stroke={sel > 0.5 ? C.white : skin.accent} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" /></g>
            </svg>
          </div>
        );
      })}
      {/* the search bar and Map / List toggle */}
      <div style={{ position: "absolute", left: 16, right: 16, top: 58, height: 50, borderRadius: 14, background: C.white, boxShadow: "0 8px 20px -10px rgba(20,20,48,.35)",
        display: "flex", alignItems: "center", gap: 10, padding: "0 16px", fontFamily: FONT, fontWeight: 700, fontSize: 16, color: C.navy }}>
        <Icon n="search" s={20} c={C.slate} /> Rome<span style={{ flex: 1 }} /><Icon n="filter" s={20} c={C.slate} />
      </div>
      <div style={{ position: "absolute", left: SW / 2 - 70, top: 122, width: 140, height: 34, borderRadius: 17, background: C.white, display: "flex", padding: 3, boxSizing: "border-box",
        boxShadow: "0 6px 14px -8px rgba(20,20,48,.35)", fontFamily: FONT, fontWeight: 800, fontSize: 14 }}>
        <span style={{ flex: 1, borderRadius: 14, background: skin.accent, color: C.white, display: "grid", placeItems: "center" }}>Map</span>
        <span style={{ flex: 1, display: "grid", placeItems: "center", color: C.slate }}>List</span>
      </div>
      {/* the place card that rises when a pin is tapped */}
      {card > 0 && (
        <div style={{ position: "absolute", left: 14, right: 14, top: 0, transform: `translateY(${lerp(SH, 588, card)}px)`, height: 150, borderRadius: 18, background: C.white,
          boxShadow: "0 -6px 30px -10px rgba(20,20,48,.35)", display: "flex", gap: 14, padding: 12, boxSizing: "border-box" }}>
          <Img src={staticFile("photos/trattoria.jpg")} style={{ width: 126, height: 126, borderRadius: 12, objectFit: "cover" }} />
          <div style={{ display: "grid", alignContent: "center", gap: 6, fontFamily: FONT }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: C.navy, lineHeight: 1.15 }}>Your favourite restaurant</div>
            <Stars />
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: C.slate }}><Icon n="fork" s={15} c={C.slate} />Restaurant · 350 m</div>
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 10, bottom: 92, fontFamily: FONT, fontSize: 9.5, color: "#7A7F8C" }}>© OpenStreetMap contributors</div>
      <StatusBar />
    </div>
  );
};

// ---------------------------------------------------------------- tip page
export const Detail: React.FC<{ g: number; skin: Skin; photo: number; hours: number; route: number; saved: number }> = ({ g, skin, photo, hours, route, saved }) => {
  const photos = ["trattoria", "pasta", "ristorante"];
  return (
    <div style={{ position: "absolute", inset: 0, background: C.white }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: 300, overflow: "hidden" }}>
        <div style={{ display: "flex", width: SW * 3, height: "100%", transform: `translateX(${-photo * SW}px)` }}>
          {photos.map((p) => <Img key={p} src={staticFile(`photos/${p}.jpg`)} style={{ width: SW, height: "100%", objectFit: "cover" }} />)}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 12, display: "flex", justifyContent: "center", gap: 6 }}>
          {photos.map((p, i) => <span key={p} style={{ width: 7, height: 7, borderRadius: 4, background: C.white, opacity: 0.45 + 0.55 * clamp01(1 - Math.abs(photo - i)) }} />)}
        </div>
        <div style={{ position: "absolute", left: 16, top: 56, width: 40, height: 40, borderRadius: 20, background: C.white, display: "grid", placeItems: "center" }}><Icon n="back" s={20} /></div>
        <div style={{ position: "absolute", right: 16, top: 56, width: 40, height: 40, borderRadius: 20, background: C.white, display: "grid", placeItems: "center", scale: String(1 + 0.35 * Math.sin(clamp01(saved * 1.5) * Math.PI)) }}>
          <Icon n="heart" s={21} c={saved > 0.3 ? "#E5484D" : C.navy} fill={saved > 0.3 ? "#E5484D" : "none"} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, top: 318, fontFamily: FONT }}>
        <div style={{ fontWeight: 800, fontSize: 24, color: C.navy }}>Your favourite restaurant</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}><Stars s={17} /><span style={{ fontSize: 14, color: C.slate }}>Restaurant · Rome</span></div>
        <div style={{ marginTop: 16, height: 50, borderRadius: 25, background: skin.accent, color: C.white, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 16 }}>Make a reservation</div>
        {/* opening hours */}
        <div style={{ position: "relative", marginTop: 14, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 14, fontSize: 15, color: C.navy,
          background: hours > 0 ? `rgba(163,210,194,${0.5 * hours})` : "transparent", boxShadow: hours > 0 ? `0 0 0 ${2 * hours}px ${C.mint}` : undefined }}>
          <Icon n="clock" s={19} c={C.green} /><span style={{ fontWeight: 800, color: C.green }}>Open</span><span>· Closes at 23:00</span><span style={{ flex: 1 }} /><Icon n="chev" s={18} c={C.slate} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {[["route", "Route"], ["phone", "Call"], ["globe", "Website"]].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, height: 42, borderRadius: 21, border: `1.5px solid ${i === 0 && route > 0 ? skin.accent : C.line}`, background: i === 0 && route > 0 ? `rgba(20,20,48,${0.06 * route})` : C.white,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 700, fontSize: 14, color: C.navy }}><Icon n={n} s={17} />{l}</div>
          ))}
        </div>
        {/* directions: a walking route on a small map */}
        <div style={{ marginTop: 14, height: 150, borderRadius: 16, overflow: "hidden", position: "relative", background: "#EEF0EC", opacity: clamp01(route * 3), translate: `0px ${(1 - clamp01(route * 2)) * 20}px` }}>
          <svg style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${175 - POI.fav[0] * 0.55}px, ${75 - POI.fav[1] * 0.55}px) scale(0.55)` }} width={ROME_W} height={ROME_H}>
            <path d={RIVER} fill="none" stroke="#AEDAF0" strokeWidth={34} />
            <path d={ROADS.minor + " " + ROADS.ped} fill="none" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" />
            <path d={ROADS.major} fill="none" stroke="#FFFFFF" strokeWidth={13} strokeLinecap="round" />
            <path d={`M${POI.pantheon[0]} ${POI.pantheon[1]} L${POI.pantheon[0] + 60} ${POI.pantheon[1] + 30} L${POI.fav[0] - 40} ${POI.fav[1] - 10} L${POI.fav[0]} ${POI.fav[1]}`} fill="none" stroke={skin.accent}
              strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} pathLength={1} strokeDashoffset={1 - clamp01(route * 1.3 - 0.2)} />
          </svg>
          <div style={{ position: "absolute", left: 175 + (POI.pantheon[0] - POI.fav[0]) * 0.55 - 9, top: 75 + (POI.pantheon[1] - POI.fav[1]) * 0.55 - 9, width: 18, height: 18, borderRadius: 9, background: "#2F7CF6", border: "3px solid #fff", boxSizing: "border-box" }} />
          <div style={{ position: "absolute", right: 10, bottom: 10, background: C.white, borderRadius: 10, padding: "6px 10px", fontWeight: 800, fontSize: 13, color: C.navy }}>6 min walk</div>
        </div>
      </div>
      <StatusBar light />
    </div>
  );
};

// ---------------------------------------------------------------- bucket list + share
export const Bucket: React.FC<{ skin: Skin; added: number; share: number; scroll?: number }> = ({ skin, added, share, scroll = 0 }) => {
  const rows = [{ name: "Your favourite restaurant", photo: "photos/trattoria" }, ...BUCKET];
  return (
    <div style={{ position: "absolute", inset: 0, background: C.white }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 108, background: skin.accent, display: "flex", alignItems: "flex-end", padding: "0 18px 14px", gap: 12, fontFamily: FONT, color: C.white, boxSizing: "border-box" }}>
        <Icon n="back" s={22} c={C.white} />
        <div style={{ flex: 1, fontWeight: 800, fontSize: 19 }}>Bucket list Rome</div>
        <div style={{ scale: String(1 + 0.3 * Math.sin(clamp01(share * 2) * Math.PI)) }}><Icon n="share" s={23} c={C.white} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 108, bottom: 84, overflow: "hidden" }}>
        <div style={{ translate: `0px ${-scroll}px` }}>
          {rows.map((r, i) => {
            const k = i === 0 ? added : 1;
            return (
              <div key={r.name} style={{ height: 86 * (i === 0 ? clamp01(k * 1.4) : 1), overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 18px", borderBottom: `1px solid ${C.line}`, fontFamily: FONT,
                  background: i === 0 ? `rgba(163,210,194,${0.45 * clamp01(k * 2) * (1 - clamp01(share * 1.5))})` : C.white, opacity: i === 0 ? clamp01(k * 2 - 0.4) : 1 }}>
                  <Img src={staticFile(`${r.photo}.jpg`)} style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover" }} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 16.5, color: C.navy }}>{r.name}</div><div style={{ fontSize: 13, color: C.slate, marginTop: 3 }}>Rome, Italy</div></div>
                  <Icon n="heart" s={22} c="#E5484D" fill="#E5484D" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* the share sheet */}
      {share > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(20,20,48,${0.3 * share})`, zIndex: 30 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 330, transform: `translateY(${lerp(SH, SH - 330, share)}px)`, background: C.white, borderRadius: "22px 22px 0 0", zIndex: 31,
            padding: "20px 22px", boxSizing: "border-box", fontFamily: FONT }}>
            <div style={{ width: 40, height: 5, borderRadius: 3, background: C.line, margin: "0 auto 18px" }} />
            <div style={{ fontWeight: 800, fontSize: 18, color: C.navy }}>Share “Bucket list Rome”</div>
            <div style={{ fontSize: 13.5, color: C.slate, marginTop: 4 }}>5 places</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
              {[["chat", "Messages", "#34C759"], ["mail", "Mail", "#2F7CF6"], ["link", "Copy link", C.navy], ["share", "More", C.faint]].map(([n, l, col], i) => (
                <div key={l} style={{ display: "grid", justifyItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: C.navy, opacity: clamp01(share * 3 - i * 0.4) }}>
                  <span style={{ width: 62, height: 62, borderRadius: 18, background: col, display: "grid", placeItems: "center" }}><Icon n={n} s={28} c={C.white} w={2.2} /></span>{l}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <TabBar active={2} accent={skin.accent} />
      <StatusBar light />
    </div>
  );
};

// a pushed screen slides in from the right, the old one slides a third of the way left
export const push = (k: number) => ({ incoming: `translateX(${(1 - MOVE(clamp01(k))) * SW}px)`, outgoing: `translateX(${-MOVE(clamp01(k)) * SW * 0.3}px)` });
export { tw };
