import React from "react";
import { AbsoluteFill, Img, Interactive, staticFile, useCurrentFrame } from "remotion";
import { ARRIVE, BODY, C, Camera, CursorArrow, DISPLAY, LINEAR, MOVE, Portrait, keys, measure, tw, useFonts } from "../lib";

// Scene 6 · Outro / CTA · 0:23.7–0:30.0 (global frames 725–900)
// VO: "Motion design that makes it click."
// The brand's statement builds word by word, re-centering as it grows; Karl's cursor clicks
// "Start a project" on "click", and the button resolves into the address.
export const S6_START = 712;
export const S6_DURATION = 188;

const SIZE = 140;
const LINES: { w: string; at: number; blue?: boolean }[][] = [
  [
    { w: "Motion", at: 50 },
    { w: "design", at: 62 },
    { w: "that", at: 74 },
  ],
  [
    { w: "makes", at: 86, blue: true },
    { w: "it", at: 96, blue: true },
    { w: "click.", at: 106, blue: true },
  ],
];
const CLICK = 106;

const measureDisplay = (text: string, size: number) => measure(text, size, DISPLAY, "800", "-0.05em");

export const S6Outro: React.FC = () => {
  const z = useCurrentFrame();
  const ready = useFonts();
  if (!ready) return null;

  const space = measureDisplay(" ", SIZE);
  const press = tw(z, CLICK - 3, CLICK, 0, 1, LINEAR) - tw(z, CLICK + 1, CLICK + 8, 0, 1, ARRIVE);
  const swap = tw(z, CLICK + 2, CLICK + 12, 0, 1, MOVE);
  const labelA = measure("Start a project", 44, BODY, "600");
  const labelB = measure("wkconversions.com", 44, BODY, "600");
  const btnW = 88 + labelA + (labelB - labelA) * swap;

  return (
    <AbsoluteFill>
      <Camera fx={960} fy={540} s={keys(z, [[0, 1.07], [40, 1.0], [188, 1.04]], ARRIVE)}>
        {/* the handwritten mark writes on, left to right */}
        <Img
          name="WKC mark"
          src={staticFile("img/wkc-mark.svg")}
          style={{
            position: "absolute",
            left: 960 - 150,
            top: 118,
            width: 300,
            clipPath: `inset(0 ${tw(z, 0, 26, 100, 0, MOVE)}% 0 0)`,
            translate: `0px ${tw(z, 0, 24, 18, 0, ARRIVE)}px`,
          }}
        />
        {LINES.map((line, li) => {
          const widths = line.map((x) => measureDisplay(x.w, SIZE));
          const progress = line.map((x) => tw(z, x.at, x.at + 10, 0, 1, ARRIVE));
          const visible = widths.reduce((acc, wd, i) => acc + (wd + (i > 0 ? space : 0)) * progress[i], 0);
          let cursor = 960 - visible / 2;
          return (
            <div key={li} style={{ position: "absolute", left: 0, top: 330 + li * SIZE * 0.98, height: SIZE, width: 1920 }}>
              {line.map((x, i) => {
                const left = cursor + (i > 0 ? space * progress[i] : 0);
                cursor = left + widths[i] * progress[i];
                return (
                  <span
                    key={x.w}
                    style={{
                      position: "absolute",
                      left,
                      top: 0,
                      fontFamily: DISPLAY,
                      fontWeight: 800,
                      fontSize: SIZE,
                      lineHeight: 1,
                      letterSpacing: "-0.05em",
                      whiteSpace: "nowrap",
                      color: x.blue ? C.blue : C.ink,
                      opacity: tw(z, x.at, x.at + 5, 0, 1, LINEAR),
                      translate: `0px ${tw(z, x.at, x.at + 10, 44, 0, ARRIVE)}px`,
                      filter: `blur(${tw(z, x.at, x.at + 7, 9, 0, LINEAR)}px)`,
                    }}
                  >
                    {x.w}
                  </span>
                );
              })}
            </div>
          );
        })}

        {/* the call to action: pressed on "click", it resolves into the address */}
        <Interactive.Div
          name="CTA button"
          style={{
            position: "absolute",
            left: 960 - btnW / 2,
            top: 700,
            width: btnW,
            height: 104,
            borderRadius: 52,
            background: C.blue,
            overflow: "hidden",
            boxShadow: "0 30px 60px -30px rgba(18,102,201,.55)",
            opacity: tw(z, 79, 85, 0, 1, LINEAR),
            translate: `0px ${tw(z, 79, 93, 60, 0, ARRIVE)}px`,
            scale: String(1 - press * 0.06),
          }}
        >
          {[
            { text: "Start a project", y: -swap * 104 },
            { text: "wkconversions.com", y: (1 - swap) * 104 },
          ].map((l) => (
            <div
              key={l.text}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: 104,
                lineHeight: "104px",
                textAlign: "center",
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 44,
                color: "#FFFFFF",
                whiteSpace: "nowrap",
                translate: `0px ${l.y}px`,
              }}
            >
              {l.text}
            </div>
          ))}
        </Interactive.Div>
        {/* the click's ring */}
        <div
          style={{
            position: "absolute",
            left: 960 - btnW / 2,
            top: 700,
            width: btnW,
            height: 104,
            borderRadius: 52,
            border: `4px solid ${C.blue}`,
            boxSizing: "border-box",
            opacity: z > CLICK ? tw(z, CLICK, CLICK + 20, 0.6, 0, LINEAR) : 0,
            scale: String(tw(z, CLICK, CLICK + 20, 1, 1.35, ARRIVE)),
          }}
        />

        {/* Karl's cursor arrives and clicks */}
        <Interactive.Div
          name="Karl cursor"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            translate: `${tw(z, 73, 93, 2050, 1080, ARRIVE) + tw(z, 93, CLICK - 3, 0, 20, MOVE) + tw(z, CLICK + 10, 188, 0, 60, MOVE)}px ${
              tw(z, 73, 93, 1150, 780, ARRIVE) + tw(z, 93, CLICK - 3, 0, -14, MOVE) + tw(z, CLICK + 10, 188, 0, 40, MOVE)
            }px`,
          }}
        >
          <div style={{ position: "absolute", left: 30, top: 44 }}>
            <Portrait src="img/karl.png" size={110} ring={5} />
          </div>
          <CursorArrow size={60} color={C.blue} press={press} />
        </Interactive.Div>
      </Camera>
    </AbsoluteFill>
  );
};
