import React from "react";
import { BODY, C, DISPLAY, PILL_TEXT, shadow } from "./lib";

// The visitor's view of "your product's" website. World rect: (180,110) 1560×880.
// Used by the problem scene (paragraph hero) and again by the transform scene
// (video hero), so the before and after happen on the same page.
export const BROWSER = { x: 180, y: 110, w: 1560, h: 880, bar: 96 };
// The timer pill's center in world coordinates (the hook's "3" shrinks into it).
export const TIMER_CENTER = { x: BROWSER.x + BROWSER.w - 160, y: BROWSER.y + BROWSER.bar / 2 };
// The hero slot under the page headline.
export const HERO = { x: 300, y: 420, w: 960, h: 540 };

export const Browser: React.FC<{
  timer: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ timer, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: BROWSER.x,
      top: BROWSER.y,
      width: BROWSER.w,
      height: BROWSER.h,
      borderRadius: 40,
      background: C.card,
      boxShadow: shadow,
      border: `2px solid ${C.border}`,
      overflow: "hidden",
      ...style,
    }}
  >
    {/* top bar */}
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: BROWSER.bar,
        background: C.surface,
        borderBottom: `2px solid ${C.border}`,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 36 + i * 30,
            top: BROWSER.bar / 2 - 9,
            width: 18,
            height: 18,
            borderRadius: 9,
            background: C.faint,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 520,
          top: 25,
          width: 520,
          height: 44,
          borderRadius: 22,
          background: C.card,
          border: `2px solid ${C.border}`,
          fontFamily: BODY,
          fontWeight: 500,
          fontSize: 24,
          lineHeight: "44px",
          textAlign: "center",
          color: C.muted2,
        }}
      >
        yourproduct.com
      </div>
    </div>
    {timer}
    {/* site nav */}
    <div style={{ position: "absolute", left: 120, top: 148, width: 150, height: 26, borderRadius: 13, background: C.ink, opacity: 0.85 }} />
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        style={{ position: "absolute", left: 900 + i * 130, top: 154, width: 96, height: 14, borderRadius: 7, background: C.border }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 214,
        width: 1360,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: 64,
        letterSpacing: "-0.05em",
        lineHeight: 0.96,
        color: C.ink,
      }}
    >
      One platform for modern finance teams.
    </div>
    {/* hero content, positioned in world coordinates (offset by the browser origin) */}
    <div style={{ position: "absolute", left: -BROWSER.x, top: -BROWSER.y, width: 1920, height: 1080 }}>{children}</div>
  </div>
);

export const TimerPill: React.FC<{
  text: string;
  color?: string;
  bg?: string;
  border?: string;
  check?: number;
  style?: React.CSSProperties;
}> = ({ text, color = C.ink, bg = C.card, border = C.border, check = 0, style }) => (
  <div
    style={{
      position: "absolute",
      left: TIMER_CENTER.x - BROWSER.x - 130,
      top: TIMER_CENTER.y - BROWSER.y - 36,
      width: 260,
      height: 72,
      borderRadius: 36,
      background: bg,
      border: `2px solid ${border}`,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      fontFamily: DISPLAY,
      fontWeight: 800,
      fontSize: PILL_TEXT.size,
      letterSpacing: PILL_TEXT.letterSpacing,
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1,
      color,
      ...style,
    }}
  >
    {check > 0 ? (
      <svg width={40} height={40} viewBox="0 0 24 24" style={{ scale: String(check) }}>
        <path d="M4 12.5 L9.5 18 L20 6.5" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : null}
    {text}
  </div>
);
