import React from "react";
import { AbsoluteFill, Interactive, useCurrentFrame } from "remotion";
import { ARRIVE, BODY, C, Camera, CursorArrow, DEPART, DISPLAY, LINEAR, MOVE, PARAGRAPH, Pill, Portrait, keys, shadow, tw } from "../lib";

// Scene 3 · Solution (who) · 0:07.2–0:12.4 (global frames 216–372)
// VO: "We're WKConversions: two motion designers…"
// Raphael and Karl arrive as two named cursors, the way collaborators appear in a design tool.
// On "…who turn that paragraph", they reach up and pull the scrolled-away paragraph back down.
export const S3_START = 216;
export const S3_DURATION = 156;

// Where the paragraph card lands (screen = world here; scene 4 starts from exactly this state).
export const CARD = { x: 420, y: 260, w: 1080, h: 560 };
export const GRIP_R = { x: 560, y: CARD.y + CARD.h };
export const GRIP_K = { x: 1360, y: CARD.y + CARD.h };

const Founder: React.FC<{
  name: string;
  src: string;
  x: number;
  y: number;
  u: number;
  shrink: number;
  labels: number;
  press: number;
}> = ({ name, src, x, y, shrink, labels, press }) => (
  <div style={{ position: "absolute", left: 0, top: 0, translate: `${x}px ${y}px` }}>
    <div style={{ position: "absolute", left: 30, top: 44, transformOrigin: "0 0", scale: String(1 - shrink * 0.5) }}>
      <Portrait src={src} size={300} ring={8} />
      <div style={{ position: "absolute", left: 0, top: 322, opacity: labels, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
        <Pill size={40}>{name}</Pill>
        <Pill size={36} color={C.muted} weight={500}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: C.blue, display: "inline-block" }} />
          Motion design
        </Pill>
      </div>
    </div>
    <CursorArrow size={60} color={C.blue} press={press} />
  </div>
);

export const S3Founders: React.FC = () => {
  const u = useCurrentFrame();

  // the pull: cursors reach up to the card peeking in at the top, grab it on u118, drag it down
  const reach = tw(u, 104, 118, 0, 1, MOVE);
  const drag = tw(u, 120, 148, 0, 1, ARRIVE);
  const cardY = -640 + reach * 140 + drag * (CARD.y + 500);
  const grabbed = u >= 118;
  const press = tw(u, 116, 120, 0, 1, LINEAR) - tw(u, 148, 152, 0, 1, LINEAR);

  const rx = grabbed ? GRIP_R.x : tw(u, 6, 20, -360, 880, ARRIVE) + tw(u, 20, 104, 0, 34, MOVE) + reach * (GRIP_R.x - 914);
  const ry = grabbed ? cardY + CARD.h : tw(u, 6, 20, 60, 110, ARRIVE) + tw(u, 20, 104, 0, 14, MOVE) + reach * (-500 + CARD.h - 124);
  const kx = grabbed ? GRIP_K.x : tw(u, 12, 26, 2300, 1440, ARRIVE) + tw(u, 26, 104, 0, -30, MOVE) + reach * (GRIP_K.x - 1410);
  const ky = grabbed ? cardY + CARD.h : tw(u, 12, 26, 760, 280, ARRIVE) + tw(u, 26, 104, 0, 12, MOVE) + reach * (-500 + CARD.h - 292);

  const shrink = tw(u, 102, 122, 0, 1, MOVE);
  const labels = tw(u, 100, 106, 1, 0, LINEAR);
  const textOut = tw(u, 102, 108, 0, 1, DEPART);

  return (
    <AbsoluteFill>
      <Camera fx={960} fy={540} s={keys(u, [[0, 1.0], [100, 1.04], [156, 1.0]])}>
        <Interactive.Div
          name="Eyebrow"
          style={{
            position: "absolute",
            left: 150,
            top: 640,
            opacity: tw(u, 36, 42, 0, 1, LINEAR) * (1 - textOut),
            translate: `${tw(u, 36, 46, -60, 0, ARRIVE)}px ${textOut * 50}px`,
          }}
        >
          <Pill size={36} bg={C.blue} border={C.blue} color="#FFFFFF">
            WKConversions
          </Pill>
        </Interactive.Div>
        <Interactive.Div
          name="Headline"
          style={{
            position: "absolute",
            left: 150,
            top: 740,
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 124,
            lineHeight: 0.96,
            letterSpacing: "-0.05em",
            color: C.ink,
            whiteSpace: "nowrap",
            opacity: 1 - textOut,
            translate: `0px ${textOut * 60}px`,
          }}
        >
          {[
            { w: "Two", at: 74, c: C.ink },
            { w: "motion", at: 82, c: C.blue },
            { w: "designers.", at: 90, c: C.blue },
          ].map(({ w, at, c }) => (
            <span
              key={w}
              style={{
                display: "inline-block",
                marginRight: "0.22em",
                color: c,
                opacity: tw(u, at, at + 5, 0, 1, LINEAR),
                translate: `0px ${tw(u, at, at + 9, 40, 0, ARRIVE)}px`,
                filter: `blur(${tw(u, at, at + 7, 8, 0, LINEAR)}px)`,
              }}
            >
              {w}
            </span>
          ))}
        </Interactive.Div>

        {/* the paragraph that was scrolled away, pulled back down */}
        <Interactive.Div
          name="Paragraph card"
          style={{
            position: "absolute",
            left: CARD.x,
            top: 0,
            width: CARD.w,
            height: CARD.h,
            translate: `0px ${cardY}px`,
            borderRadius: 34,
            background: C.card,
            border: `2px solid ${C.border}`,
            boxShadow: shadow,
            boxSizing: "border-box",
            padding: "56px 64px",
            overflow: "hidden",
            fontFamily: BODY,
            fontWeight: 400,
            fontSize: 30,
            lineHeight: 1.5,
            color: C.muted2,
          }}
        >
          {PARAGRAPH}
        </Interactive.Div>

        <Founder name="Raphael Wind" src="img/raphael.png" x={rx} y={ry} u={u} shrink={shrink} labels={labels} press={press} />
        <Founder name="Karl van Kessel" src="img/karl.png" x={kx} y={ky} u={u} shrink={shrink} labels={labels} press={press} />
      </Camera>
    </AbsoluteFill>
  );
};
