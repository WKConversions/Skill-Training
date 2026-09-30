import React from "react";
import { AbsoluteFill, Interactive, useCurrentFrame } from "remotion";
import { Browser, TIMER_CENTER, TimerPill } from "../Browser";
import { ARRIVE, BODY, C, Camera, CursorArrow, DEPART, DISPLAY, HOOK_THREE, LINEAR, MOVE, PARAGRAPH, PILL_TEXT, Pill, keys, measure, timerText, tw, useFonts } from "../lib";
import { S1_END_SCALE } from "./S1Hook";

// Scene 2 · Problem · 0:03.2–0:07.4 (global frames 96–222)
// VO: "Your product takes a paragraph to explain… so they scroll on."
// The camera starts inside the countdown pill, its "3" exactly where the hook's "3" was, and
// zooms out to the visitor's view of the site: a paragraph that keeps
// going while the three seconds run down. At zero the page is scrolled away.
export const S2_START = 96;
export const S2_DURATION = 126;

export const S2Problem: React.FC = () => {
  const t = useCurrentFrame();
  const ready = useFonts();
  if (!ready) return null;

  // the pill's "3" (world) and the hook's "3" (screen, at the hook camera's last scale).
  // Letter-spacing is added after each glyph, so a glyph's center is half its unspaced width in.
  const pillLs = -0.03 * PILL_TEXT.size;
  const pillW = measure("3.0s", PILL_TEXT.size, DISPLAY, "800", PILL_TEXT.letterSpacing);
  const pill3 = measure("3", PILL_TEXT.size, DISPLAY, "800", PILL_TEXT.letterSpacing) - pillLs;
  const P = { x: TIMER_CENTER.x - pillW / 2 + pill3 / 2, y: TIMER_CENTER.y };
  const hook3 = measure("3", HOOK_THREE.size, DISPLAY, "800");
  const Q = {
    // (-44, -20): measured on the rendered cut, the glyph's side bearing and the pill's centering
    x: (HOOK_THREE.left + hook3 / 2 - 960) * S1_END_SCALE + 960 - 44,
    y: (HOOK_THREE.top + HOOK_THREE.size / 2 - 540) * S1_END_SCALE + 540 - 20,
  };
  const s0 = (HOOK_THREE.size * S1_END_SCALE) / PILL_TEXT.size;

  // camera: a zoom out of the pill (on a log scale, so it reads as one even move) to the full
  // page, then a slow push toward the paragraph
  const z = tw(t, 0, 30, 0, 1, MOVE);
  // during the zoom the camera holds on the pill's "3", which glides from the hook's position
  // to where the page puts it (the page then sits exactly at the full-page framing)
  const fx = t < 30 ? P.x : keys(t, [[30, 960], [118, 820]]);
  const fy = t < 30 ? P.y : keys(t, [[30, 550], [118, 650]]);
  const sx = t < 30 ? Q.x + (P.x - Q.x) * z : 960;
  const sy = t < 30 ? Q.y + (P.y - 10 - Q.y) * z : keys(t, [[30, 540], [118, 560]]);
  const s = t < 30 ? Math.exp(Math.log(s0) * (1 - z)) : keys(t, [[30, 1.0], [118, 1.13]]);

  // the three seconds: 3.0 → 0.0 in real time, from global frame 120 to 210
  const left = 3 - tw(t, 24, 114, 0, 3, LINEAR);

  // "so they scroll on": the page is flicked up and away
  const scroll = tw(t, 111, 123, 0, -1320, DEPART);

  return (
    <AbsoluteFill>
      <Camera fx={fx} fy={fy} sx={sx} sy={sy} s={s}>
        <Browser
          style={{ translate: `0px ${scroll}px` }}
          timer={<TimerPill text={timerText(left)} color={left < 0.05 ? C.muted2 : C.ink} />}
        >
          <Interactive.Div
            name="Paragraph"
            style={{
              position: "absolute",
              left: 300,
              top: 420,
              width: 1180,
              fontFamily: BODY,
              fontWeight: 400,
              fontSize: 31,
              lineHeight: 1.5,
              color: C.muted2,
              // the paragraph keeps extending: a soft-edged reveal travels down the page
              maskImage: `linear-gradient(to bottom, black ${tw(t, 4, 96, 40, 640, MOVE)}px, transparent ${
                tw(t, 4, 96, 40, 640, MOVE) + 90
              }px)`,
              WebkitMaskImage: `linear-gradient(to bottom, black ${tw(t, 4, 96, 40, 640, MOVE)}px, transparent ${
                tw(t, 4, 96, 40, 640, MOVE) + 90
              }px)`,
            }}
          >
            {PARAGRAPH}
          </Interactive.Div>
        </Browser>
        {/* the visitor tries to read, then leaves */}
        <Interactive.Div
          name="Visitor cursor"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            translate: `${tw(t, 16, 30, 1960, 1280, ARRIVE) + tw(t, 30, 108, 0, -360, MOVE) + tw(t, 108, 116, 0, 1100, DEPART)}px ${
              tw(t, 16, 30, 980, 520, ARRIVE) + tw(t, 30, 108, 0, 170, MOVE) + tw(t, 108, 116, 0, -260, DEPART)
            }px`,
          }}
        >
          <CursorArrow size={64} />
          <Pill size={36} color={C.muted} weight={500} style={{ position: "absolute", left: 40, top: 56 }}>
            Visitor
          </Pill>
        </Interactive.Div>
      </Camera>
    </AbsoluteFill>
  );
};


