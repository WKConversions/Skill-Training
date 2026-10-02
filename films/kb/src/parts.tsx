import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, SHADOW } from "./lib";

// Simple line icons in their navy, drawn at 24×24.
const PATHS: Record<string, string> = {
  lead: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0",
  quote: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5",
  order: "M4 7h16l-1.5 12h-13zM8 7a4 4 0 0 1 8 0",
  invoice: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
  onboard: "M5 12l4 4 10-10",
  sheet: "M4 4h16v16H4zM4 10h16M4 15h16M10 4v16",
  mail: "M3 6h18v12H3zM3 7l9 7 9-7",
  check: "M5 12l4 4 10-10",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  loop: "M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M20 4v5h-5M4 20v-5h5",
  chat: "M4 5h16v11H9l-5 4z",
  chart: "M5 20V10M10 20V4M15 20v-8M20 20v-5",
  phone: "M8 2h8a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM16 16l5 5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
};
export const Ico: React.FC<{ k: string; s?: number; c?: string; w?: number }> = ({ k, s = 28, c = C.navy, w = 2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ display: "block", flex: "none" }}>
    <path d={PATHS[k]} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** K.B's logo, as on their site: the navy badge with the K.B letters in white (`inverted` gives a white badge with
 *  navy letters, `letters` the letters alone in navy), never redrawn. */
export const Logo: React.FC<{ size: number; inverted?: boolean; letters?: boolean; style?: React.CSSProperties }> = ({ size, inverted = false, letters = false, style }) => (
  <Img src={staticFile(`img/${letters ? "kb-letters-navy" : inverted ? "kb-logo-inverted" : "kb-logo"}.png`)}
    style={{ width: size, height: letters ? size * (512 / 438) : size, display: "block", filter: letters ? undefined : "drop-shadow(0 18px 30px rgba(41,58,81,.35))", ...style }} />
);

export const Card: React.FC<{ w: number; h: number; children?: React.ReactNode; style?: React.CSSProperties; tint?: string }> = ({ w, h, children, style, tint = C.white }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 26, background: tint, boxShadow: SHADOW, overflow: "hidden", ...style }}>{children}</div>
);

export const Chip: React.FC<{ children: React.ReactNode; s?: number; bg?: string; c?: string; icon?: string; style?: React.CSSProperties }> = ({ children, s = 28, bg = C.white, c = C.navy, icon, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: s * 0.35, padding: `${s * 0.38}px ${s * 0.7}px`, borderRadius: 999, background: bg, color: c, fontWeight: 700, fontSize: s,
    boxShadow: "0 12px 26px -16px rgba(41,58,81,.45)", whiteSpace: "nowrap", fontFamily: FONT, ...style }}>{icon && <Ico k={icon} s={s * 1.05} c={c} w={2.4} />}{children}</span>
);

/** A step of a process: icon, label and an optional state (a tick in cyan). */
export const Step: React.FC<{ icon: string; label: string; w?: number; h?: number; done?: number; logo?: string; tint?: string; style?: React.CSSProperties }> = ({
  icon, label, w = 280, h = 112, done = 0, logo, tint = C.white, style }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 22, background: tint, boxShadow: SHADOW, display: "flex", alignItems: "center", gap: 18, padding: "0 22px",
    outline: done > 0 ? `${4 * done}px solid ${C.cyan}` : undefined, ...style }}>
    <div style={{ width: 58, height: 58, borderRadius: 16, background: logo ? C.white : C.card, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", border: logo ? `2px solid ${C.card}` : undefined }}>
      {logo ? <Img src={staticFile(`img/logos/${logo}.png`)} style={{ width: 40, height: 40, objectFit: "contain" }} /> : <Ico k={icon} s={32} />}
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, lineHeight: 1.15 }}>{label}</div>
    {done > 0 && <div style={{ position: "absolute", right: -14, top: -14, width: 40, height: 40, borderRadius: 99, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center",
      transform: `scale(${done})` }}><Ico k="check" s={24} c={C.white} w={3} /></div>}
  </div>
);

export const Avatar: React.FC<{ t: string; s?: number; bg?: string; kb?: boolean; style?: React.CSSProperties }> = ({ t, s = 64, bg = C.card, kb = false, style }) => (
  <div style={{ width: s, height: s, borderRadius: 99, background: kb ? C.navy : bg, color: kb ? C.white : C.navy, display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, fontSize: s * 0.36, border: `3px solid ${C.white}`, boxShadow: "0 8px 18px -10px rgba(41,58,81,.5)", flex: "none", overflow: "hidden", fontFamily: FONT, ...style }}>
    {kb ? <Img src={staticFile("img/kb-logo.png")} style={{ width: "100%", height: "100%", borderRadius: 99 }} /> : t}
  </div>
);

/** A browser window: the client's own app. */
export const Window: React.FC<{ w: number; h: number; url?: string; title?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, url = "app.yourbusiness.com", title, children, style }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 26, background: C.white, boxShadow: SHADOW, overflow: "hidden", ...style }}>
    <div style={{ height: 58, background: C.card, display: "flex", alignItems: "center", gap: 10, padding: "0 22px" }}>
      {[0, 1, 2].map((i) => <span key={i} style={{ width: 14, height: 14, borderRadius: 99, background: i === 0 ? "#F7A1A1" : i === 1 ? "#F6D58A" : "#9FDDB2" }} />)}
      <div style={{ marginLeft: 18, flex: 1, height: 34, borderRadius: 10, background: C.white, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", fontSize: 20, color: C.muted, fontWeight: 600 }}>
        <Ico k="shield" s={18} c={C.muted} />{url}</div>
    </div>
    {title && <div style={{ position: "absolute", left: 30, top: 80, fontSize: 30, fontWeight: 800, color: C.navy }}>{title}</div>}
    {children}
  </div>
);

export const Tile: React.FC<{ logo: string; s?: number; style?: React.CSSProperties }> = ({ logo, s = 120, style }) => (
  <div style={{ width: s, height: s, borderRadius: s * 0.24, background: C.white, boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
    <Img src={staticFile(`img/logos/${logo}.png`)} style={{ width: s * 0.62, height: s * 0.62, objectFit: "contain" }} />
  </div>
);

export const Cursor: React.FC<{ press?: number; style?: React.CSSProperties }> = ({ press = 0, style }) => (
  <svg width={46} height={46} viewBox="0 0 24 24" style={{ position: "absolute", transform: `scale(${1 - press * 0.15})`, transformOrigin: "20% 15%", filter: "drop-shadow(0 6px 8px rgba(0,0,0,.25))", ...style }}>
    <path d="M5 3l14 8-6 1.5L10 19z" fill={C.ink} stroke={C.white} strokeWidth={1.5} strokeLinejoin="round" />
  </svg>
);
