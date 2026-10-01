import React from "react";
import { Img, staticFile } from "remotion";
import { PORTAL_NAV, Tile } from "./data";
import { C, FONT, lerp } from "./lib";

// The GoHere portal as it is (app.gohere.app/dashboard): a sidebar, the Home page listing the homepage
// tiles with their order, title and tile type, and ↑ ↓ Edit Delete on each row.
const RED = "#E74C3C", BLUE = "#2D96E3", GREY = "#6C757D", DEL = "#DC3545";
const NAV_ICON: Record<string, string> = {
  Dashboard: "M4 14a8 8 0 1 1 16 0M12 14l4-4", Home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z", Advertorials: "M4 6h16v12H4zM7 10h10M7 14h6",
  Reviews: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z", "Top tips": "M4 10v4h3l7 4V6L7 10zM17 9a4 4 0 0 1 0 6",
  Articles: "M6 4h12v16H6zM9 8h6M9 12h6M9 16h4", Lists: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
};
const ROW_H = 52;

/** rowPos(id) is the row's (fractional) place in the table, so a moved row glides to its new order. */
export const Portal: React.FC<{ tiles: Tile[]; rowPos: (id: string) => number; press: (id: string) => number; hlRow?: string }> = ({ tiles, rowPos, press, hlRow }) => (
  <div style={{ width: 1140, height: 740, borderRadius: 18, background: "#F8F9FC", overflow: "hidden", boxShadow: "0 60px 120px -50px rgba(20,20,48,.5), 0 18px 40px -20px rgba(20,20,48,.25)",
    border: `1.5px solid ${C.line}`, fontFamily: FONT, position: "relative" }}>
    {/* browser chrome */}
    <div style={{ height: 50, background: "#EEF1F5", display: "flex", alignItems: "center", gap: 9, padding: "0 18px", borderBottom: `1.5px solid ${C.line}` }}>
      {["#F2C1B8", "#F4DDA6", "#BFE2C9"].map((b) => <span key={b} style={{ width: 13, height: 13, borderRadius: 7, background: b }} />)}
      <span style={{ marginLeft: 18, width: 520, height: 30, borderRadius: 15, background: C.white, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 16, color: C.slate }}>app.gohere.app/dashboard/tiles/</span>
    </div>
    {/* sidebar */}
    <div style={{ position: "absolute", left: 0, top: 50, bottom: 0, width: 230, borderRight: `1.5px solid ${C.line}`, background: "#F8F9FC", padding: "18px 0" }}>
      <Img src={staticFile("img/portal-logo.png")} style={{ display: "block", width: 56, margin: "0 auto 22px" }} />
      {PORTAL_NAV.map((n) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 26px", fontSize: 18, color: n === "Home" ? RED : "#333" }}>
          <svg width={20} height={20} viewBox="0 0 24 24"><path d={NAV_ICON[n]} fill="none" stroke={n === "Home" ? RED : "#333"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>{n}
        </div>
      ))}
    </div>
    {/* the Home page: the homepage tiles */}
    <div style={{ position: "absolute", left: 230, top: 50, right: 0, bottom: 0, padding: "24px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, borderBottom: `1.5px solid ${C.line}` }}>
        <span style={{ fontWeight: 700, fontSize: 24, color: "#222" }}>Home</span>
        <span style={{ background: BLUE, color: C.white, borderRadius: 5, padding: "9px 16px", fontSize: 17 }}>+ New tile</span>
      </div>
      <div style={{ position: "relative", marginTop: 22 }}>
        <div style={{ display: "flex", height: 44, alignItems: "center", background: "#EEF1F6", fontWeight: 700, fontSize: 16, color: "#555", padding: "0 14px" }}>
          <span style={{ width: 80 }}>Order</span><span style={{ width: 290 }}>Title</span><span style={{ width: 240 }}>Tile type</span><span>Actions</span>
        </div>
        <div style={{ position: "relative", height: ROW_H * tiles.length }}>
          {tiles.map((t) => {
            const p = rowPos(t.id);
            const order = Math.round(p) + 1;
            return (
              <div key={t.id} style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${p * ROW_H}px)`, height: ROW_H, display: "flex", alignItems: "center", padding: "0 14px",
                borderBottom: `1px solid ${C.line}`, fontSize: 16.5, color: "#222", background: hlRow === t.id ? "rgba(163,210,194,.35)" : "#F8F9FC", zIndex: hlRow === t.id ? 2 : 1 }}>
                <span style={{ width: 80 }}>{order}</span>
                <span style={{ width: 290, whiteSpace: "nowrap" }}>{t.label}</span>
                <span style={{ width: 240, whiteSpace: "nowrap", color: "#444" }}>{t.type}</span>
                <span style={{ display: "flex", gap: 6 }}>
                  {["↑", "↓"].map((a, i) => (
                    <span key={a} style={{ width: 32, height: 32, borderRadius: 4, background: GREY, color: C.white, display: "grid", placeItems: "center", fontSize: 17, fontWeight: 700,
                      scale: String(i === 0 ? lerp(1, 0.86, press(t.id)) : 1), filter: i === 0 && press(t.id) > 0 ? "brightness(.8)" : undefined }}>{a}</span>
                  ))}
                  <span style={{ height: 32, borderRadius: 4, background: "#8A9097", color: C.white, padding: "0 12px", display: "grid", placeItems: "center", fontSize: 15 }}>Edit</span>
                  <span style={{ height: 32, borderRadius: 4, background: DEL, color: C.white, padding: "0 12px", display: "grid", placeItems: "center", fontSize: 15 }}>Delete</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
// where a row's ↑ button sits inside the portal window (for the cursor)
export const upButtonAt = (row: number): [number, number] => [230 + 32 + 14 + 80 + 290 + 240 + 16, 50 + 24 + 63 + 22 + 44 + row * ROW_H + ROW_H / 2];
