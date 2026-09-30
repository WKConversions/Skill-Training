import { Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Interactive, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BROWSER, Browser, HERO, TimerPill } from "../Browser";
import { ARRIVE, BODY, C, Camera, CursorArrow, DEPART, DISPLAY, LINEAR, MOVE, PARAGRAPH, Pill, Portrait, shadow, tw } from "../lib";
import { CARD, GRIP_K, GRIP_R } from "./S3Founders";

// Scene 4 · Solution (how) · 0:12.8–0:17.4 (global frames 384–522)
// VO: "…who turn that paragraph into a video people understand in seconds."
// Karl clicks the paragraph: its lines turn into shapes, the card becomes a video, and three
// tools snap into one place. The camera pulls back: it's the same page, now with a video hero,
// the countdown stops with time to spare and the visitor stays. Then the camera pushes through
// the video into real work.
export const S4_START = 384;
export const S4_DURATION = 138;

// the camera at the start matches scene 3's last frame exactly: screen = (world − F)·s0 + S
const S0 = 1.3333;
const F0 = { x: HERO.x + HERO.w / 2, y: HERO.y + HERO.h / 2 };
const toWorld = (x: number, y: number) => ({ x: (x - 960) / S0 + F0.x, y: (y - 540) / S0 + F0.y });
const CARD_W = toWorld(CARD.x, CARD.y);
const K0 = toWorld(GRIP_K.x, GRIP_K.y);
const R0 = toWorld(GRIP_R.x, GRIP_R.y);
const INV = 1 / S0; // screen-sized things drawn in world units

const LINES = 9;
const TILES: { line: number; label: string; spread: [number, number]; row: number }[] = [
  { line: 1, label: "Invoices", spread: [330, 620], row: 0 },
  { line: 4, label: "Payments", spread: [610, 760], row: 1 },
  { line: 7, label: "Reports", spread: [880, 600], row: 2 },
];
const PANEL = { x: 690, y: 500, w: 520, h: 330 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const S4Transform: React.FC = () => {
  const v = useCurrentFrame();

  // camera: hold on the video, pull back to the page, push through the video
  const s = v < 46 ? tw(v, 0, 46, S0, 1.36, LINEAR) : v < 80 ? tw(v, 46, 80, 1.36, 0.98, MOVE) : v < 104 ? tw(v, 80, 104, 0.98, 1.0, LINEAR) : tw(v, 104, 138, 1.0, 1760 / HERO.w, MOVE);
  const fx = v < 46 ? F0.x : v < 104 ? tw(v, 46, 80, F0.x, 960, MOVE) : tw(v, 104, 138, 960, F0.x, MOVE);
  const fy = v < 46 ? F0.y : v < 104 ? tw(v, 46, 80, F0.y, 550, MOVE) : tw(v, 104, 138, 550, F0.y, MOVE);

  // the card becomes the video
  const morph = tw(v, 10, 30, 0, 1, MOVE);
  const box = {
    x: lerp(CARD_W.x, HERO.x, morph),
    y: lerp(CARD_W.y, HERO.y, morph),
    w: lerp(CARD.w * INV, HERO.w, morph),
    h: lerp(CARD.h * INV, HERO.h, morph),
    r: lerp(34 * INV, 24, morph),
  };
  const textOut = tw(v, 6, 14, 1, 0, LINEAR);
  const toClip = tw(v, 108, 116, 0, 1, LINEAR);

  // the page appears around the video: a mask grows from the video's edges to the browser's
  const reveal = tw(v, 46, 76, 0, 1, MOVE);
  const inset = {
    t: (HERO.y - BROWSER.y) * (1 - reveal),
    r: (BROWSER.x + BROWSER.w - HERO.x - HERO.w) * (1 - reveal),
    b: (BROWSER.y + BROWSER.h - HERO.y - HERO.h) * (1 - reveal),
    l: (HERO.x - BROWSER.x) * (1 - reveal),
  };

  // the countdown runs while the video plays and stops when it lands (v36, on "understand")
  const left = 3 - tw(v, 22, 36, 0, 14 / 30, LINEAR);
  const done = v >= 36;

  // Karl clicks the paragraph (v6, on "into"), Raphael steps out; then both leave
  const kx = tw(v, 0, 6, K0.x, 760, MOVE) + tw(v, 16, 26, 0, 1700, DEPART);
  const ky = tw(v, 0, 6, K0.y, 700, MOVE) + tw(v, 16, 26, 0, 700, DEPART);
  const rx = R0.x + tw(v, 4, 14, 0, -700, DEPART);
  const ry = R0.y + tw(v, 4, 14, 0, 240, DEPART);
  const kPress = tw(v, 5, 7, 0, 1, LINEAR) - tw(v, 9, 12, 0, 1, LINEAR);

  return (
    <AbsoluteFill>
      <Camera fx={fx} fy={fy} s={s}>
        <Browser
          style={{
            opacity: v < 44 ? 0 : 1,
            clipPath: `inset(${inset.t}px ${inset.r}px ${inset.b}px ${inset.l}px round ${lerp(24, 40, reveal)}px)`,
          }}
          timer={
            <TimerPill
              text={`${left.toFixed(1)}s`}
              color={done ? C.blueText : C.ink}
              bg={done ? C.soft : C.card}
              border={done ? C.blue : C.border}
              check={done ? tw(v, 36, 44, 0.4, 1, ARRIVE) : 0}
            />
          }
        >
        <div
          style={{
            position: "absolute",
            left: BROWSER.x + BROWSER.w - 420,
            top: HERO.y + 30,
            width: 340,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: 16, width: i === 3 ? 180 : 320, borderRadius: 8, background: C.border, marginBottom: 22 }} />
          ))}
          <div style={{ marginTop: 18, width: 220, height: 64, borderRadius: 32, background: C.ink }} />
        </div>
        </Browser>

        {/* the paragraph card, becoming the video */}
        <Interactive.Div
          name="Video"
          style={{
            position: "absolute",
            left: box.x,
            top: box.y,
            width: box.w,
            height: box.h,
            borderRadius: box.r,
            background: morph > 0 ? `color-mix(in srgb, ${C.soft} ${morph * 100}%, ${C.card})` : C.card,
            border: `${2 * INV}px solid ${C.border}`,
            boxShadow: shadow,
            overflow: "hidden",
          }}
        >
          {/* the paragraph text, at scene 3's screen size */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: CARD.w,
              padding: "56px 64px",
              boxSizing: "border-box",
              transformOrigin: "0 0",
              scale: String(INV),
              fontFamily: BODY,
              fontSize: 30,
              lineHeight: 1.5,
              color: C.muted2,
              opacity: textOut,
            }}
          >
            {PARAGRAPH}
          </div>
          {/* the explainer inside the video */}
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 112,
              width: 300,
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 50,
              lineHeight: 0.96,
              letterSpacing: "-0.05em",
              color: C.ink,
              opacity: tw(v, 38, 44, 0, 1, LINEAR) * (1 - toClip),
              translate: `0px ${tw(v, 38, 48, 30, 0, ARRIVE)}px`,
            }}
          >
            Your finance, <span style={{ color: C.blue }}>in one place.</span>
          </div>
          {/* scrubber: the video is playing */}
          <div style={{ position: "absolute", left: 40, bottom: 26, width: HERO.w - 80, height: 6, borderRadius: 3, background: C.faint, opacity: tw(v, 22, 28, 0, 1, LINEAR) * (1 - toClip) }}>
            <div style={{ width: `${tw(v, 22, 138, 2, 100, LINEAR)}%`, height: "100%", borderRadius: 3, background: C.blue }} />
          </div>
          {/* real work takes over the frame as the camera pushes through */}
          <Sequence from={108} layout="none">
            <div style={{ position: "absolute", inset: 0, opacity: toClip, background: "#000" }}>
              <Video src={staticFile("video/clearscaler-ui.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </Sequence>
        </Interactive.Div>

        {/* the paragraph's lines: they become shapes, three become tools, the tools become one place */}
        {Array.from({ length: LINES }).map((_, i) => {
          const tile = TILES.find((x) => x.line === i);
          const lineX = CARD_W.x + 64 * INV;
          const lineY = CARD_W.y + (56 + i * 45 + 13) * INV;
          const lineW = (i === LINES - 1 ? 520 : 952 - ((i * 37) % 90)) * INV;
          const lineH = 20 * INV;
          const appear = tw(v, 6 + i, 12 + i, 0, 1, LINEAR);
          // follow the card while it morphs
          const bx = lineX + (box.x - CARD_W.x);
          const by = lineY + (box.y - CARD_W.y);
          if (!tile) {
            const out = tw(v, 12 + i, 22 + i, 0, 1, DEPART);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: bx,
                  top: by + out * 40,
                  width: lineW * (1 - out),
                  height: lineH,
                  borderRadius: lineH / 2,
                  background: C.faint,
                  opacity: appear * (1 - out),
                }}
              />
            );
          }
          // bar → separate tile → row of one panel
          const k = TILES.indexOf(tile);
          const toTile = tw(v, 12 + k * 3, 28 + k * 3, 0, 1, MOVE);
          const toRow = tw(v, 30 + k * 2, 42 + k * 2, 0, 1, MOVE);
          const tileRect = { x: tile.spread[0], y: tile.spread[1], w: 250, h: 96 };
          const rowRect = { x: PANEL.x + 30, y: PANEL.y + 84 + tile.row * 76, w: PANEL.w - 60, h: 62 };
          const x = lerp(lerp(bx, tileRect.x, toTile), rowRect.x, toRow);
          const y = lerp(lerp(by, tileRect.y, toTile), rowRect.y, toRow);
          const w = lerp(lerp(lineW, tileRect.w, toTile), rowRect.w, toRow);
          const h = lerp(lerp(lineH, tileRect.h, toTile), rowRect.h, toRow);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: w,
                height: h,
                borderRadius: lerp(lineH / 2, 18, toTile),
                background: toTile > 0.5 ? C.card : C.faint,
                border: toTile > 0.5 ? `2px solid ${C.border}` : "none",
                boxShadow: toTile > 0.5 && toRow < 1 ? "0 20px 40px -24px rgba(5,15,25,.35)" : "none",
                boxSizing: "border-box",
                opacity: appear * (1 - toClip),
                display: "flex",
                alignItems: "center",
                gap: 14,
                paddingLeft: 20,
                overflow: "hidden",
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 32,
                color: C.ink,
                zIndex: 2,
              }}
            >
              <span style={{ width: 22, height: 22, borderRadius: 7, background: C.blue, flexShrink: 0, opacity: tw(v, 20 + k * 2, 26 + k * 2, 0, 1, LINEAR) }} />
              <span style={{ opacity: tw(v, 20 + k * 2, 26 + k * 2, 0, 1, LINEAR), whiteSpace: "nowrap" }}>{tile.label}</span>
            </div>
          );
        })}
        {/* the one place: the panel forms under the tools, and a check lands */}
        <div
          style={{
            position: "absolute",
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: PANEL.h,
            borderRadius: 26,
            background: C.card,
            border: `2px solid ${C.border}`,
            boxShadow: "0 30px 60px -36px rgba(5,15,25,.4)",
            opacity: tw(v, 28, 34, 0, 1, LINEAR) * (1 - toClip),
            scale: String(tw(v, 28, 40, 0.9, 1, ARRIVE)),
            zIndex: 1,
          }}
        >
          <div style={{ position: "absolute", left: 30, top: 30, width: 150, height: 20, borderRadius: 10, background: C.ink, opacity: 0.85 }} />
          <div
            style={{
              position: "absolute",
              right: 26,
              top: 18,
              width: 46,
              height: 46,
              borderRadius: 23,
              background: C.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scale: String(tw(v, 36, 44, 0, 1, ARRIVE)),
            }}
          >
            <svg width={28} height={28} viewBox="0 0 24 24">
              <path d="M4 12.5 L9.5 18 L20 6.5" fill="none" stroke="#FFFFFF" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* the visitor comes back, and stays */}
        <Interactive.Div
          name="Visitor cursor"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 3,
            translate: `${tw(v, 58, 72, 2100, 1130, ARRIVE) + tw(v, 72, 138, 0, -70, MOVE)}px ${tw(v, 58, 72, 1000, 760, ARRIVE) + tw(v, 72, 138, 0, -30, MOVE)}px`,
          }}
        >
          <CursorArrow size={64} />
          <Pill size={36} color={C.muted} weight={500} style={{ position: "absolute", left: 40, top: 56 }}>
            Visitor
          </Pill>
        </Interactive.Div>

        {/* the founders' cursors, carried over from scene 3 */}
        <div style={{ position: "absolute", left: 0, top: 0, zIndex: 4, translate: `${rx}px ${ry}px`, scale: String(INV), transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", left: 30, top: 44, transformOrigin: "0 0", scale: "0.5" }}>
            <Portrait src="img/raphael.png" size={300} ring={8} />
          </div>
          <CursorArrow size={60} color={C.blue} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, zIndex: 4, translate: `${kx}px ${ky}px`, scale: String(INV), transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", left: 30, top: 44, transformOrigin: "0 0", scale: "0.5" }}>
            <Portrait src="img/karl.png" size={300} ring={8} />
          </div>
          <CursorArrow size={60} color={C.blue} press={kPress} />
        </div>
      </Camera>
    </AbsoluteFill>
  );
};


