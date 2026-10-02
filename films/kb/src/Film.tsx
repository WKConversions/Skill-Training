import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { DUR } from "./clock";
import { type Key, MOVE, camera } from "./kinetic";
import { C, Canvas, useFonts } from "./lib";
import { Story } from "./Story";

// K.B · website film, 1920×1080, 30 fps, timed word by word to Karl's voice-over. The camera breathes harder than in
// our earlier films (the 3% motion target): a push of about 5% through each beat with a drift, released with MOVE on
// each transition, and a slow sway underneath so it never locks.
export const FILM_DURATION = DUR;
// a lean, not a pan: the push lands a fifth of the way towards the point, so nothing at the edges is cropped
const at = (px: number, py: number, s: number): [number, number, number] => [s, (960 - px) * s * 0.18, (540 - py) * s * 0.18];
const KEYS: Key[] = [
  ["hook", 1.0, 0, 0], ["mark-0.1", ...at(980, 600, 1.06)], ["mark+0.35", 1.0, 0, 0, MOVE], ["pillars-0.1", ...at(960, 520, 1.05)], ["pillars+0.5", 1.0, 0, 0, MOVE],
  ["w:software", 1.02, 0, 0], ["w:ai+0.4", 1.045, 0, 0], ["axis+0.4", 1.0, 0, 0, MOVE], ["w:to", ...at(700, 620, 1.04)], ["w:implementation+0.6", ...at(1240, 620, 1.06)],
  ["complex+0.4", 1.0, 0, 0, MOVE], ["w:ideas+0.3", ...at(960, 560, 1.05)], ["w:inside+0.6", ...at(960, 580, 1.0), MOVE], ["connect+0.5", 1.0, 0, 0, MOVE],
  ["auto-0.1", ...at(960, 560, 1.04)], ["auto+0.5", 1.0, 0, 0, MOVE], ["grow-0.1", ...at(1300, 600, 1.05)], ["grow+0.5", 1.0, 0, 0, MOVE], ["stay-0.1", 1.05, 0, 0],
  ["stay+0.5", 1.0, 0, 0, MOVE], ["improve-0.1", ...at(960, 600, 1.05)], ["improve+0.5", 1.0, 0, 0, MOVE], ["sign-0.1", ...at(960, 620, 1.06)], ["sign+0.6", 1.0, 0, 0, MOVE],
  ["cta", ...at(960, 560, 1.11)], ["end", ...at(960, 600, 1.14)],
];

export const Film: React.FC<{ blurSamples?: number; audio?: "mix" | "vo" | "none" }> = ({ blurSamples = 1, audio = "vo" }) => {
  const g = useCurrentFrame();
  const ready = useFonts();
  const cam = camera(g, KEYS);
  const sx = Math.sin(g / 30) * 38 + Math.sin(g / 83) * 20, sy = Math.cos(g / 41) * 20;
  const zs = 1 + Math.sin(g / 57) * 0.018;
  const story = (
    <Canvas>
      {ready && (
        <AbsoluteFill style={{ transform: `translate(${cam.x + sx}px, ${cam.y + sy}px) scale(${cam.s * zs}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%", willChange: "transform" }}>
          <Story g={g} />
        </AbsoluteFill>
      )}
    </Canvas>
  );
  return (
    <AbsoluteFill style={{ background: C.page }}>
      {blurSamples > 1 ? <CameraMotionBlur samples={blurSamples} shutterAngle={180}>{story}</CameraMotionBlur> : story}
      {audio !== "none" && <Audio src={staticFile(audio === "mix" ? "audio/mix.wav" : "audio/vo.wav")} />}
    </AbsoluteFill>
  );
};
