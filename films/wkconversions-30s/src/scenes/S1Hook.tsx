import React from "react";
import { AbsoluteFill, Interactive, useCurrentFrame } from "remotion";
import { ARRIVE, C, Camera, CursorArrow, DEPART, DISPLAY, HOOK_THREE, LINEAR, MOVE, Pill, tw } from "../lib";

// Scene 1 · Hook · 0:00–0:03.2 (global frames 0–96)
// VO: "Your visitors give you three seconds."
// A "3" fills the frame; a visitor's cursor arrives beside it. "seconds." and the visitor clear,
// and scene 2's camera starts inside the countdown pill, on this same "3" (see HOOK_THREE).
export const S1_DURATION = 96;
export const S1_END_SCALE = 1.05;

export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  // "seconds." and the visitor clear; the "3" stays for the cut into the countdown
  const out = tw(f, 84, 93, 0, 1, DEPART);

  return (
    <AbsoluteFill>
      <Camera fx={960} fy={540} s={tw(f, 0, S1_DURATION, 1.0, S1_END_SCALE, LINEAR)}>
        <AbsoluteFill>
          <Interactive.Div
            name="Three"
            style={{
              position: "absolute",
              left: HOOK_THREE.left,
              top: HOOK_THREE.top,
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: HOOK_THREE.size,
              lineHeight: 1,
              letterSpacing: "-0.06em",
              color: C.ink,
              transformOrigin: "260px 470px",
              scale: String(tw(f, 0, 16, 0.7, 1, ARRIVE)),
              opacity: tw(f, 0, 5, 0, 1, LINEAR),
            }}
          >
            3
          </Interactive.Div>
          <Interactive.Div
            name="Seconds"
            style={{
              position: "absolute",
              left: 860,
              top: 560,
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 200,
              lineHeight: 1,
              letterSpacing: "-0.05em",
              color: C.blue,
              translate: `${tw(f, 54, 66, 160, 0, ARRIVE) + out * 320}px 0px`,
              opacity: tw(f, 54, 60, 0, 1, LINEAR) * (1 - out),
            }}
          >
            seconds.
          </Interactive.Div>
          {/* the visitor: arrives from outside the frame on "visitors", then reads toward the 3 */}
          <Interactive.Div
            name="Visitor cursor"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              translate: `${tw(f, 12, 26, 2150, 1500, ARRIVE) + tw(f, 26, 82, 0, -90, MOVE) + tw(f, 82, 90, 0, 700, DEPART)}px ${
                tw(f, 12, 26, 760, 330, ARRIVE) + tw(f, 26, 84, 0, 30, MOVE)
              }px`,
            }}
          >
            <CursorArrow size={72} />
            <Pill size={36} color={C.muted} weight={500} style={{ position: "absolute", left: 44, top: 62 }}>
              Visitor
            </Pill>
          </Interactive.Div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};
