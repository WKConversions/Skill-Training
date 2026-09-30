import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ARRIVE, C, LINEAR, UI, tw, useFonts } from "../lib";
import { Headline } from "./Overlays";

// Scene 6 · Resolution · 0:27.5–0:30 (global frames 824–900)
// The mark and wordmark over their hero's route lines, with their promise; then everything clears to
// black so the hero video loops back into its first frame.
export const OUTRO_START = 824;
export const OUTRO_DURATION = 76;

export const Outro: React.FC = () => {
  const z = useCurrentFrame();
  const g = OUTRO_START + z;
  const ready = useFonts();
  if (!ready) return null;
  const end = tw(g, 886, 899, 1, 0, LINEAR);
  const k = tw(g, 834, 854, 0, 1, ARRIVE);
  return (
    <AbsoluteFill style={{ opacity: end }}>
      <div style={{ position: "absolute", left: 0, top: 360, width: 1920, display: "flex", justifyContent: "center", alignItems: "center", gap: 30,
        opacity: tw(g, 834, 840, 0, 1, LINEAR), scale: String(0.94 + 0.06 * k) }}>
        <div style={{ width: 118, height: 118, borderRadius: 26, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center",
          rotate: `${(1 - k) * -12}deg` }}>
          <Img src={staticFile("img/cartesian-mark.svg")} style={{ width: 84, height: 84 }} />
        </div>
        <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 118, lineHeight: 1, letterSpacing: "-0.045em", color: C.ink,
          clipPath: `inset(0 ${(1 - tw(g, 836, 858, 0, 1, ARRIVE)) * 100}% 0 0)` }}>cartesian</div>
      </div>
      <Headline g={g} at={850} out={9999} x={960} y={560} size={56} gap={3} align="center"
        lines={[[{ w: "Location" }, { w: "intelligence" }, { w: "for" }, { w: "every" }, { w: "item" }, { w: "in" }, { w: "your" }, { w: "store.", grey: true }]]} />
    </AbsoluteFill>
  );
};
