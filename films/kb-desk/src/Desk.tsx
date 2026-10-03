import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, HAND } from "./lib";

// The things on the desk, drawn top-down and lit from above. Every object takes its centre (x, y), a rotation, a
// scale and a lift: lifting raises it towards the camera (a little larger, a longer, softer shadow), the way a hand
// would pick it up, so things are placed and picked up instead of appearing.

export const shadowFor = (lift = 0, k = 1) =>
  `0 ${(6 + lift * 34) * k}px ${(16 + lift * 44) * k}px -${4 * k}px rgba(41,58,81,${0.24 - lift * 0.08}), 0 ${(1.5 + lift * 6) * k}px ${(4 + lift * 10) * k}px rgba(41,58,81,${0.12 - lift * 0.04})`;

type Place = { x: number; y: number; r?: number; s?: number; lift?: number; o?: number; z?: number; name?: string };

export const Obj: React.FC<Place & { w: number; h: number; radius?: number | string; bg?: string; shadow?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  x, y, r = 0, s = 1, lift = 0, o = 1, z, w, h, radius = 0, bg, shadow = true, style, children, name }) =>
  o <= 0.001 ? null : (
    <div data-probe={name} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, zIndex: z, borderRadius: radius, background: bg, opacity: o,
      transform: `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${r}deg) scale(${s * (1 + lift * 0.06)})`,
      boxShadow: shadow ? shadowFor(lift, s) : undefined, ...style }}>{children}</div>
  );

/** The desk: the brand's lavender-grey, lit a little brighter in the middle, with the faintest grain. */
export const DeskTop: React.FC = () => (
  <AbsoluteFill style={{
    background: `radial-gradient(1500px 900px at 52% 42%, ${C.deskLight} 0%, ${C.desk} 70%, #DFE2EA 100%)`,
  }}>
    <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(41,58,81,.018) 0 2px, transparent 2px 11px)", opacity: 0.9 }} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- the laptop, open flat, seen from above
export const LAP = { w: 840, lid: 525, deck: 330, bezel: 20 };
/** The main laptop's screen, in frame coordinates at rest (for things that fly into it). */
export const SCREEN = { x: 700, y: 70, w: 800, h: 485 };

export const Laptop: React.FC<Place & { children?: React.ReactNode; sticky?: React.ReactNode }> = ({ children, sticky, ...p }) => {
  const H = LAP.lid + LAP.deck;
  return (
    <Obj {...p} w={LAP.w} h={H} radius={26} shadow={true} style={{ background: "transparent" }}>
      {/* lid with the screen */}
      <div style={{ position: "absolute", left: 0, top: 0, width: LAP.w, height: LAP.lid, borderRadius: "24px 24px 6px 6px", background: C.bezel }}>
        <div style={{ position: "absolute", left: LAP.bezel, top: LAP.bezel, width: LAP.w - 2 * LAP.bezel, height: LAP.lid - 2 * LAP.bezel, borderRadius: 8,
          overflow: "hidden", background: C.white }}>{children}</div>
        <div style={{ position: "absolute", left: LAP.w / 2 - 4, top: 7, width: 8, height: 8, borderRadius: 4, background: "#3A4556" }} />
      </div>
      {/* hinge and deck */}
      <div style={{ position: "absolute", left: 0, top: LAP.lid, width: LAP.w, height: LAP.deck, borderRadius: "6px 6px 28px 28px",
        background: `linear-gradient(180deg, ${C.alu2} 0%, ${C.alu} 8%, ${C.alu} 100%)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: LAP.w, height: 10, background: "linear-gradient(180deg, rgba(30,38,51,.35), rgba(30,38,51,0))" }} />
        <Keys />
        <div style={{ position: "absolute", left: LAP.w / 2 - 140, top: 222, width: 280, height: 92, borderRadius: 14, background: C.alu2,
          boxShadow: "inset 0 1px 2px rgba(41,58,81,.12)" }} />
        {sticky}
      </div>
    </Obj>
  );
};

const Keys: React.FC = () => {
  const rows = [14, 14, 13, 12, 9];
  const kw = 46, kh = 34, gap = 7, top = 30;
  return (
    <>
      {rows.map((n, j) => {
        const width = n * kw + (n - 1) * gap, left = (LAP.w - width) / 2;
        return [...Array(n)].map((_, i) => (
          <div key={`${j}-${i}`} style={{ position: "absolute", left: left + i * (kw + gap), top: top + j * (kh + gap - 4), width: j === 4 && i === 4 ? kw * 3 : kw, height: kh - 4,
            borderRadius: 6, background: C.key, boxShadow: "0 1.5px 0 rgba(41,58,81,.18)", display: j === 4 && i > 4 && i < 7 ? "none" : undefined }} />
        ));
      })}
    </>
  );
};

// ---------------------------------------------------------------- phone and tablet
export const Phone: React.FC<Place & { children?: React.ReactNode }> = ({ children, ...p }) => (
  <Obj {...p} w={230} h={470} radius={40} bg={C.bezel}>
    <div style={{ position: "absolute", left: 10, top: 10, width: 210, height: 450, borderRadius: 32, overflow: "hidden", background: C.white }}>{children}</div>
    <div style={{ position: "absolute", left: 85, top: 18, width: 60, height: 16, borderRadius: 8, background: C.bezel }} />
  </Obj>
);
export const PHONE_SCREEN = { w: 210, h: 450 };

export const Tablet: React.FC<Place & { children?: React.ReactNode }> = ({ children, ...p }) => (
  <Obj {...p} w={400} h={290} radius={30} bg={C.bezel}>
    <div style={{ position: "absolute", left: 14, top: 14, width: 372, height: 262, borderRadius: 18, overflow: "hidden", background: C.white }}>{children}</div>
  </Obj>
);

// ---------------------------------------------------------------- paper, notes, notebook, calendar, cup, badge
/** An order sheet. `stamp` 0 → 1 shows it handled (a cyan tick in the corner). */
export const Sheet: React.FC<Place & { stamp?: number }> = ({ stamp = 0, ...p }) => (
  <Obj {...p} w={200} h={262} radius={4} bg={C.white}>
    <div style={{ position: "absolute", left: 22, top: 24, width: 96, height: 14, borderRadius: 3, background: C.navy }} />
    <div style={{ position: "absolute", left: 22, top: 50, width: 60, height: 9, borderRadius: 3, background: C.cyan, opacity: 0.8 }} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{ position: "absolute", left: 22, top: 84 + i * 24, width: i === 5 ? 90 : 156, height: 8, borderRadius: 3, background: C.line }} />
    ))}
    <div style={{ position: "absolute", left: 120, top: 214, width: 58, height: 24, borderRadius: 4, background: C.cyanSoft }} />
  </Obj>
);

export const Sticky: React.FC<Place & { text: string; bg?: string; size?: number }> = ({ text, bg = C.sticky1, size = 170, ...p }) => (
  <Obj {...p} w={size} h={size} radius={3} bg={bg} style={{ backgroundImage: "linear-gradient(160deg, rgba(255,255,255,.55), rgba(255,255,255,0) 55%)" }}>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontSize: size * 0.25,
      color: C.navy, textAlign: "center", lineHeight: 1.05, padding: 12 }}>{text}</div>
  </Obj>
);

export const Notebook: React.FC<Place & { children?: React.ReactNode }> = ({ children, ...p }) => (
  <Obj {...p} w={470} h={340} radius={10} bg={C.white}>
    {[...Array(11)].map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 0, top: 58 + i * 26, width: 470, height: 2, background: "rgba(56,200,255,.18)" }} />
    ))}
    {[...Array(12)].map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 22 + i * 38, top: -10, width: 14, height: 30, borderRadius: 7, border: `3px solid ${C.grey}`, background: C.desk }} />
    ))}
    {children}
  </Obj>
);

export const Calendar: React.FC<Place & { month: string; marks: number[]; flip?: number; next?: { month: string; marks: number[] } }> = ({ month, marks, flip = 0, next, ...p }) => {
  const page = (m: string, mk: number[]) => (
    <div style={{ position: "absolute", left: 0, top: 34, width: 360, height: 296, background: C.white, borderRadius: "0 0 10px 10px" }}>
      <div style={{ position: "absolute", left: 24, top: 18, fontSize: 38, fontWeight: 800, color: C.navy, letterSpacing: "-0.02em" }}>{m}</div>
      {[...Array(5)].map((_, w) => [...Array(7)].map((__, d) => {
        const k = w === 0 ? 0 : mk[w - 1] ?? 0;
        return (
          <div key={`${w}-${d}`} style={{ position: "absolute", left: 24 + d * 46, top: 82 + w * 42, width: 38, height: 34, borderRadius: 6,
            background: d === 0 && w > 0 ? C.cyanSoft : "#F3F4F8" }}>
            {d === 0 && w > 0 && k > 0 && (
              <Img src={staticFile("img/kb-logo.png")} style={{ position: "absolute", left: 3, top: 1, width: 32, height: 32, opacity: Math.min(1, k * 1.5),
                transform: `scale(${0.6 + 0.4 * k})` }} />
            )}
          </div>
        );
      }))}
    </div>
  );
  return (
    <Obj {...p} w={360} h={330} radius={12} bg="transparent">
      {next && page(next.month, next.marks)}
      {flip < 0.5 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 360, height: 330, transformOrigin: "50% 34px", transform: `scaleY(${Math.cos(flip * Math.PI)})` }}>
          {page(month, marks)}
        </div>
      )}
      <div style={{ position: "absolute", left: 0, top: 0, width: 360, height: 40, borderRadius: "12px 12px 0 0", background: C.navy }}>
        {[...Array(6)].map((_, i) => <div key={i} style={{ position: "absolute", left: 34 + i * 56, top: 14, width: 12, height: 12, borderRadius: 6, background: C.desk }} />)}
      </div>
    </Obj>
  );
};

export const Cup: React.FC<Place> = (p) => (
  <Obj {...p} w={190} h={190} radius={95} bg={C.white}>
    <div style={{ position: "absolute", left: 30, top: 30, width: 130, height: 130, borderRadius: 65, background: C.white, boxShadow: "0 2px 6px rgba(41,58,81,.18)" }} />
    <div style={{ position: "absolute", left: 42, top: 42, width: 106, height: 106, borderRadius: 53, background: `radial-gradient(circle at 40% 38%, #8A6450, ${C.coffee} 70%)` }} />
    <div style={{ position: "absolute", left: 152, top: 80, width: 40, height: 30, borderRadius: 15, border: `10px solid ${C.white}`, boxShadow: "0 2px 6px rgba(41,58,81,.14)" }} />
  </Obj>
);

/** K.B's badge, the real logo (never redrawn). */
export const Badge: React.FC<Place & { size?: number }> = ({ size = 150, ...p }) => (
  <Obj {...p} w={size} h={size} radius={size * 0.1} bg="transparent">
    <Img src={staticFile("img/kb-logo.png")} style={{ width: size, height: size, display: "block" }} />
  </Obj>
);
