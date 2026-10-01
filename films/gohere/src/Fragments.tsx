import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, SHADOW, clamp01, lerp } from "./lib";

// "Today, your best places are spread across websites, brochures and conversations."
// Three loose fragments of a destination's knowledge, each arriving on its word; later they are pulled
// into the phone and become its tiles.

const Bar: React.FC<{ w: string; h?: number; c?: string; mt?: number }> = ({ w, h = 10, c = "#DDE1EA", mt = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: c, marginTop: mt }} />
);

export const Website: React.FC = () => (
  <div style={{ width: 640, height: 420, borderRadius: 18, background: C.white, boxShadow: SHADOW, overflow: "hidden", border: `1.5px solid ${C.line}` }}>
    <div style={{ height: 44, background: "#F3F5F8", display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: `1.5px solid ${C.line}` }}>
      {["#F2C1B8", "#F4DDA6", "#BFE2C9"].map((b) => <span key={b} style={{ width: 12, height: 12, borderRadius: 6, background: b }} />)}
      <span style={{ marginLeft: 14, flex: 1, height: 24, borderRadius: 12, background: C.white }} />
    </div>
    <div style={{ display: "flex", gap: 18, padding: 20 }}>
      <Img src={staticFile("photos/rome-view.jpg")} style={{ width: 250, height: 180, borderRadius: 12, objectFit: "cover" }} />
      <div style={{ flex: 1, fontFamily: FONT }}>
        <div style={{ fontWeight: 800, fontSize: 26, color: C.navy, lineHeight: 1.15 }}>Things to do in Rome</div>
        <Bar w="90%" mt={16} /><Bar w="75%" mt={10} /><Bar w="82%" mt={10} /><Bar w="60%" mt={10} />
      </div>
    </div>
    <div style={{ display: "flex", gap: 14, padding: "0 20px" }}>
      {["trevi", "pantheon", "alley"].map((p) => (
        <div key={p} style={{ flex: 1 }}>
          <Img src={staticFile(`photos/${p}.jpg`)} style={{ width: "100%", height: 90, borderRadius: 10, objectFit: "cover" }} />
          <Bar w="80%" mt={10} h={8} />
        </div>
      ))}
    </div>
  </div>
);

export const Brochure: React.FC<{ open: number }> = ({ open }) => (
  <div style={{ display: "flex", perspective: 1600 }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ width: 190, height: 400, background: i === 1 ? "#FFFDF7" : "#FFFBF0", boxShadow: "0 30px 60px -30px rgba(20,20,48,.45)", padding: 16, boxSizing: "border-box",
        transform: i === 0 ? `rotateY(${lerp(70, 14, open)}deg)` : i === 2 ? `rotateY(${lerp(-70, -14, open)}deg)` : undefined, transformOrigin: i === 0 ? "100% 50%" : "0% 50%",
        borderRadius: i === 0 ? "8px 0 0 8px" : i === 2 ? "0 8px 8px 0" : 0, fontFamily: FONT }}>
        {i === 1 ? (
          <>
            <div style={{ fontWeight: 900, fontSize: 24, color: "#B8442E", letterSpacing: "0.04em" }}>ROMA</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#8A6A4A", marginBottom: 12 }}>City guide</div>
            <Img src={staticFile("photos/colosseum.jpg")} style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 4 }} />
            <Bar w="90%" mt={14} h={7} c="#E8DCC8" /><Bar w="70%" mt={8} h={7} c="#E8DCC8" /><Bar w="80%" mt={8} h={7} c="#E8DCC8" />
          </>
        ) : (
          <>
            <Img src={staticFile(`photos/${i === 0 ? "trevi" : "trattoria"}.jpg`)} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 4 }} />
            {[0, 1, 2, 3, 4, 5].map((r) => <Bar key={r} w={`${60 + ((r * 17 + i * 11) % 35)}%`} mt={r === 0 ? 14 : 8} h={7} c="#E8DCC8" />)}
          </>
        )}
      </div>
    ))}
  </div>
);

export const Chat: React.FC<{ g: number; at: number }> = ({ g, at }) => {
  const msgs: [string, boolean][] = [["Any tips for dinner tonight?", false], ["Ask at the info desk!", true], ["Where was that gelato place again?", false]];
  return (
    <div style={{ display: "grid", gap: 12, width: 470 }}>
      {msgs.map(([t, me], i) => {
        const k = clamp01((g - at - i * 7) / 12);
        return (
          <div key={t} style={{ justifySelf: me ? "end" : "start", maxWidth: 400, padding: "14px 20px", borderRadius: me ? "22px 22px 6px 22px" : "22px 22px 22px 6px",
            background: me ? C.mint : C.white, boxShadow: SHADOW, fontFamily: FONT, fontWeight: 700, fontSize: 25, color: C.navy, opacity: k, translate: `0px ${(1 - k) * 24}px`, scale: String(lerp(0.9, 1, k)) }}>{t}</div>
        );
      })}
    </div>
  );
};
