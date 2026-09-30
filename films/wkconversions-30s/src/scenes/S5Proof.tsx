import { Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, Interactive, staticFile, useCurrentFrame } from "remotion";
import { ARRIVE, BODY, C, Camera, DEPART, DISPLAY, LINEAR, MOVE, Pill, Portrait, keys, shadow, tw } from "../lib";

// Scene 5 · Showing something (proof) · 0:17.4–0:24.5 (global frames 522–735)
// VO: "ClearScaler put it simply: fast, and better than the brief."
// Real work: WKConversions' own animation for ClearScaler keeps playing while the video makes room
// for the client's words (Magnus's testimonial on wkconversions.com).
export const S5_START = 522;
export const S5_DURATION = 200;

// the clip continues from scene 4, where it started on global frame 492
const CLIP_OFFSET = S5_START - 492;

export const S5Proof: React.FC = () => {
  const w = useCurrentFrame();

  const move = tw(w, 48, 72, 0, 1, MOVE);
  const exit = tw(w, 186, 198, 0, 1, DEPART);
  const vx = 80 + (100 - 80) * move - exit * 1500;
  const vy = 45 + (236 - 45) * move;
  const vw = 1760 + (1080 - 1760) * move;
  const vh = 990 + (608 - 990) * move;
  const quoteOut = tw(w, 188, 194, 0, 1, DEPART);
  const attribOut = tw(w, 190, 196, 0, 1, DEPART);

  const words: { w: string; at: number; blue?: boolean }[] = [
    { w: "“…fast", at: 72 },
    { w: "and", at: 84 },
    { w: "better", at: 94, blue: true },
    { w: "than", at: 106, blue: true },
    { w: "the", at: 114, blue: true },
    { w: "brief.”", at: 124, blue: true },
  ];

  return (
    <AbsoluteFill>
      <Camera fx={960} fy={540} s={keys(w, [[0, 1.0], [48, 1.0], [200, 1.045]], LINEAR)}>
        <Interactive.Div
          name="ClearScaler video"
          style={{
            position: "absolute",
            left: vx,
            top: vy,
            width: vw,
            height: vh,
            borderRadius: 44 - 14 * move,
            overflow: "hidden",
            background: "#000",
            boxShadow: shadow,
            rotate: `y ${4 * move}deg`,
          }}
        >
          <Video src={staticFile("video/clearscaler-ui.mp4")} trimBefore={CLIP_OFFSET} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 28,
              opacity: tw(w, 6, 12, 0, 1, LINEAR),
              translate: `0px ${tw(w, 6, 16, -30, 0, ARRIVE)}px`,
            }}
          >
            <Pill size={36}>
              <Img src={staticFile("img/clearscaler.png")} style={{ width: 44, height: 44, borderRadius: 10, margin: "-6px 0" }} />
              Made for ClearScaler
            </Pill>
          </div>
        </Interactive.Div>

        <Interactive.Div
          name="Quote"
          style={{
            position: "absolute",
            left: 1270,
            top: 250,
            width: 580,
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 84,
            lineHeight: 0.98,
            letterSpacing: "-0.05em",
            color: C.ink,
            opacity: 1 - quoteOut,
            translate: `0px ${-70 * quoteOut}px`,
          }}
        >
          {words.map(({ w: word, at, blue }) => (
            <span
              key={word}
              style={{
                display: "inline-block",
                marginRight: "0.22em",
                color: blue ? C.blue : C.ink,
                opacity: tw(w, at, at + 5, 0, 1, LINEAR),
                translate: `0px ${tw(w, at, at + 9, 36, 0, ARRIVE)}px`,
                filter: `blur(${tw(w, at, at + 7, 8, 0, LINEAR)}px)`,
              }}
            >
              {word}
            </span>
          ))}
        </Interactive.Div>

        <Interactive.Div
          name="Attribution"
          style={{
            position: "absolute",
            left: 1270,
            top: 640,
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: tw(w, 132, 140, 0, 1, LINEAR) * (1 - attribOut),
            translate: `0px ${tw(w, 132, 146, 40, 0, ARRIVE) - 70 * attribOut}px`,
          }}
        >
          <Portrait src="img/magnus.png" size={112} ring={5} />
          <div style={{ fontFamily: BODY, fontSize: 36, lineHeight: 1.25 }}>
            <div style={{ fontWeight: 600, color: C.ink }}>Magnus</div>
            <div style={{ fontWeight: 400, color: C.muted }}>Co-founder, ClearScaler</div>
          </div>
        </Interactive.Div>
      </Camera>
    </AbsoluteFill>
  );
};
