import React from "react";
import { Img, staticFile } from "remotion";
import { C, GOLD, IG, SHADOW } from "./lib";

// Instagram's own UI, rebuilt so it can move, with Zapify's flows and the example chats from their site.

export const Ico: React.FC<{ k: "heart" | "comment" | "send" | "link" | "mail" | "check" | "bolt" | "arrow"; s?: number; c?: string; fill?: string }> = ({ k, s = 28, c = C.ink, fill = "none" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {k === "heart" && <path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3.2 5 6.6 5c2 0 3.3 1.1 4.1 2.3h2.6C14.1 6.1 15.4 5 17.4 5c3.4 0 5.3 3.4 3.8 6.4C19 15.6 12 20 12 20z" />}
    {k === "comment" && <path d="M20.5 11.8a8.3 8.3 0 0 1-12 7.4L3.5 20.5l1.4-4.6A8.3 8.3 0 1 1 20.5 11.8z" />}
    {k === "send" && <><path d="M21 3L10.2 13.8" /><path d="M21 3l-6.8 18-4-7.2L3 9.8 21 3z" /></>}
    {k === "link" && <><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2" /><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" /></>}
    {k === "mail" && <><rect x={3} y={5} width={18} height={14} rx={2.5} /><path d="M3.5 6.5L12 13l8.5-6.5" /></>}
    {k === "check" && <path d="M5 12.5l4.5 4.5L19 7" />}
    {k === "bolt" && <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />}
    {k === "arrow" && <path d="M5 12h14M13 6l6 6-6 6" />}
  </svg>
);

/** A round avatar with Instagram's gradient ring and initials. */
export const Avatar: React.FC<{ t: string; s?: number; bg?: string; ring?: boolean }> = ({ t, s = 56, bg = C.lavender, ring = true }) => (
  <span style={{ width: s, height: s, borderRadius: 99, padding: ring ? s * 0.06 : 0, background: ring ? IG : "transparent", flexShrink: 0, display: "inline-flex" }}>
    <span style={{ flex: 1, borderRadius: 99, background: bg, border: ring ? `${s * 0.05}px solid #fff` : undefined, display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: s * 0.36, color: C.ink }}>{t}</span>
  </span>
);

export const PHONE = { w: 430, h: 860 };
/** A phone with an Instagram DM screen: header (who, Active now), the chat, the message bar. */
export const Phone: React.FC<{ who?: string; ini?: string; tint?: string; children?: React.ReactNode; style?: React.CSSProperties; header?: React.ReactNode }> = ({ who, ini = "", tint = C.lavender, children, style, header }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: PHONE.w, height: PHONE.h, borderRadius: 64, background: C.ink, padding: 12, boxShadow: "0 60px 120px -50px rgba(10,10,10,.45), 0 20px 40px -20px rgba(10,10,10,.3)", ...style }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 52, background: C.white, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: 14, width: 120, height: 34, marginLeft: -60, borderRadius: 20, background: C.ink, zIndex: 3 }} />
      {header ?? (who && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 64, height: 86, display: "flex", alignItems: "center", gap: 16, padding: "0 24px", borderBottom: `1.5px solid ${C.line}` }}>
          <Avatar t={ini} s={56} bg={tint} />
          <div><div style={{ fontWeight: 700, fontSize: 26 }}>{who}</div><div style={{ fontSize: 20, color: C.muted, fontWeight: 500 }}>Active now</div></div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 18, right: 18, top: 170, bottom: 96 }}>{children}</div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 24, height: 58, borderRadius: 30, border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 22px", color: C.muted, fontSize: 22 }}>Message…</div>
    </div>
  </div>
);

/** A chat bubble that pops in from its corner on `k` (0 → 1): `me` sends (right, Zapify's gradient), else received (left, grey). */
export const Bubble: React.FC<{ k: number; me?: boolean; children: React.ReactNode; style?: React.CSSProperties; size?: number }> = ({ k, me, children, style, size = 24 }) => {
  if (k <= 0) return null;
  return (
    <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginTop: 12, ...style }}>
      <div style={{ maxWidth: "82%", padding: "14px 18px", borderRadius: 24, borderBottomRightRadius: me ? 8 : 24, borderBottomLeftRadius: me ? 24 : 8,
        background: me ? "linear-gradient(135deg, #7C3AED, #3797F0)" : "#EFEFEF", color: me ? "#fff" : C.ink, fontSize: size, fontWeight: 500, lineHeight: 1.3,
        transformOrigin: me ? "100% 100%" : "0% 100%", transform: `scale(${0.6 + 0.4 * k}) translateY(${(1 - k) * 16}px)`, opacity: Math.min(1, k * 2) }}>{children}</div>
    </div>
  );
};
/** A link preview in a DM: their gold button. */
export const LinkCard: React.FC<{ k: number; title: string; url: string; me?: boolean }> = ({ k, title, url, me = true }) => {
  if (k <= 0) return null;
  return (
    <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginTop: 10 }}>
      <div style={{ width: "78%", borderRadius: 20, overflow: "hidden", border: `1.5px solid ${C.line}`, background: C.white, boxShadow: SHADOW, transformOrigin: "100% 0%",
        transform: `scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2) }}>
        <div style={{ padding: "14px 18px 10px" }}>
          <div style={{ fontSize: 20, color: C.muted, display: "flex", alignItems: "center", gap: 8 }}><Ico k="link" s={20} c={C.muted} />{url}</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{title}</div>
        </div>
        <div style={{ margin: "0 14px 14px", height: 50, borderRadius: 12, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700 }}>Open</div>
      </div>
    </div>
  );
};
export const Typing: React.FC<{ g: number; k: number }> = ({ g, k }) => k <= 0 || k >= 1 ? null : (
  <div style={{ display: "flex", marginTop: 12 }}><div style={{ padding: "16px 20px", borderRadius: 24, background: "#EFEFEF", display: "flex", gap: 7 }}>
    {[0, 1, 2].map((i) => <span key={i} style={{ width: 11, height: 11, borderRadius: 9, background: "#9AA0A6", opacity: 0.4 + 0.6 * Math.max(0, Math.sin(g / 3 - i)) }} />)}
  </div></div>
);

/** Their pastel chip label: white pill, coloured text. */
export const Chip: React.FC<{ children: React.ReactNode; c: string; s?: number; style?: React.CSSProperties; icon?: React.ReactNode }> = ({ children, c, s = 30, style, icon }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: `${s * 0.36}px ${s * 0.75}px`, borderRadius: 999, background: C.white, color: c, fontWeight: 800, fontSize: s,
    boxShadow: SHADOW, whiteSpace: "nowrap", ...style }}>{icon}{children}</span>
);
/** "Automated by Zapify": the gold pill with the bolt. */
export const AutoPill: React.FC<{ k: number; s?: number }> = ({ k, s = 22 }) => k <= 0 ? null : (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: `${s * 0.35}px ${s * 0.7}px`, borderRadius: 999, background: GOLD, fontWeight: 800, fontSize: s,
    transform: `scale(${k})`, boxShadow: "0 10px 20px -10px rgba(234,179,8,.8)", whiteSpace: "nowrap" }}><Ico k="bolt" s={s} c={C.ink} fill={C.ink} />Automated</span>
);

/** Their logo, in two parts so it can build: the gradient bubble, then the bolt. */
export const Logo: React.FC<{ x: number; y: number; s: number; bubble: number; bolt: number; style?: React.CSSProperties }> = ({ x, y, s, bubble, bolt, style }) => {
  // drawn at 300 px and moved and sized by transform, so it glides to the corner without snapping to pixels
  const S = 300, h = (S * 764) / 784;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: S, height: h, transform: `translate(${x - S / 2}px, ${y - h / 2}px) scale(${s / S})`, transformOrigin: "50% 50%",
      willChange: "transform", ...style }}>
      <Img src={staticFile("img/bubble.png")} style={{ position: "absolute", inset: 0, width: S, height: h, opacity: Math.min(1, bubble * 1.5),
        transform: `scale(${0.6 + 0.4 * bubble}) rotate(${(1 - bubble) * -14}deg)`, clipPath: `circle(${bubble * 75}% at center)` }} />
      <Img src={staticFile("img/bolt.png")} style={{ position: "absolute", inset: 0, width: S, height: h, opacity: Math.min(1, bolt * 2),
        transform: `translate(${(1 - bolt) * S * 0.35}px, ${(1 - bolt) * -S * 0.6}px) scale(${0.8 + 0.2 * bolt})` }} />
    </div>
  );
};

/** An illustrated Story frame (a beach at golden hour), with Instagram's progress bar and reply bar. */
export const StoryArt: React.FC<{ w: number; h: number; t: number; children?: React.ReactNode }> = ({ w, h, t, children }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 30, overflow: "hidden", background: "linear-gradient(180deg, #FDBA74 0%, #FDE68A 38%, #7DD3FC 62%, #0EA5E9 100%)" }}>
    <div style={{ position: "absolute", left: w * 0.55, top: h * 0.3, width: w * 0.3, height: w * 0.3, borderRadius: 999, background: "#FFF7D6", boxShadow: "0 0 80px 20px rgba(255,247,214,.8)", transform: `translateY(${t * 6}px)` }} />
    <svg width={w} height={h} viewBox="0 0 100 177" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
      <path d="M0 120 C 20 112, 40 118, 60 113 S 90 116, 100 112 L100 177 L0 177Z" fill="#F5D0A0" />
      <path d="M18 120 C 17 100, 15 86, 20 70" stroke="#3F2A14" strokeWidth={2.2} fill="none" />
      {[[-26, -6], [-12, -14], [6, -14], [20, -4], [-4, -18]].map(([dx, dy], i) => <path key={i} d={`M20 70 q ${dx / 2} ${dy - 4} ${dx} ${dy + 6}`} stroke="#14532D" strokeWidth={3} fill="none" strokeLinecap="round" />)}
    </svg>
    <div style={{ position: "absolute", left: 16, right: 16, top: 14, height: 5, borderRadius: 5, background: "rgba(255,255,255,.45)" }}><div style={{ width: `${Math.min(1, t) * 100}%`, height: 5, borderRadius: 5, background: "#fff" }} /></div>
    <div style={{ position: "absolute", left: 18, top: 32, display: "flex", alignItems: "center", gap: 10, color: "#fff", fontWeight: 700, fontSize: 22 }}><Avatar t="Y" s={42} bg={C.butter} />your_brand</div>
    <div style={{ position: "absolute", left: 18, right: 18, bottom: 22, height: 54, borderRadius: 30, border: "2px solid rgba(255,255,255,.85)", color: "#fff", fontSize: 20, fontWeight: 500, display: "flex", alignItems: "center", padding: "0 20px" }}>Send message</div>
    {children}
  </div>
);
