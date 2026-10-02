import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { DUR, type Key, camera } from "./kit";
import { C, Canvas, MOVE, useFonts } from "./lib";
import { Story } from "./Story";

// Amargier Advisory · website film, 1920×1080, 30 fps, timed word by word to Karl's voice-over. The camera breathes:
// a slow push through each beat, released on the transitions, calm as the brief asks; it leans into each new thing.
export const FILM_DURATION = DUR;
const at = (px: number, py: number, s: number): [number, number, number] => [s, (960 - px) * s, (540 - py) * s];
const KEYS: Key[] = [
  ["hook", 1.0, 0, 0], ["brand", 1.035, 0, 0], ["brand+0.75", 1.0, 0, 0, MOVE], ["emea-0.1", 1.03, 0, 0], ["emea+0.7", 1.0, 0, 0, MOVE],
  ["opp", 1.03, -20, 0], ["opp+0.8", ...at(960, 560, 1.05), MOVE], ["eco-0.1", ...at(960, 556, 1.07)], ["eco+0.7", 1.0, 0, 0, MOVE],
  ["w:co-0.2", 1.03, 0, 0], ["w:co+0.5", ...at(990, 560, 1.045), MOVE], ["w:hands-0.1", ...at(992, 560, 1.05)], ["w:hands+0.6", ...at(1010, 560, 1.07), MOVE],
  ["connect-0.1", ...at(1012, 560, 1.075)], ["connect+0.6", 1.0, 0, 0, MOVE], ["exp-0.1", 1.035, 0, 0], ["exp+0.6", 1.0, 0, 0, MOVE],
  ["build-0.1", 1.035, 0, 0], ["build+0.6", 1.0, 0, 0, MOVE], ["cta-0.1", 1.035, 0, 0], ["cta+0.7", 1.0, 0, 0, MOVE], ["end", 1.04, 0, 0],
];

export const Film: React.FC<{ blurSamples?: number; audio?: "mix" | "vo" | "none" }> = ({ blurSamples = 1, audio = "vo" }) => {
  const g = useCurrentFrame();
  const ready = useFonts();
  const cam = camera(g, KEYS);
  const story = (
    <Canvas>
      {ready && (
        <AbsoluteFill style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`, transformOrigin: "50% 50%", willChange: "transform" }}>
          <Story g={g} />
        </AbsoluteFill>
      )}
    </Canvas>
  );
  return (
    <AbsoluteFill style={{ background: C.white }}>
      {blurSamples > 1 ? <CameraMotionBlur samples={blurSamples} shutterAngle={180}>{story}</CameraMotionBlur> : story}
      {audio !== "none" && <Audio src={staticFile(audio === "mix" ? "audio/mix.wav" : "audio/vo.wav")} />}
    </AbsoluteFill>
  );
};
