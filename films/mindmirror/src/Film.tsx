import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { DUR, type Key, camera } from "./kit";
import { C, Canvas, MOVE, useFonts } from "./lib";
import { Story } from "./Story";

// MindMirror · website film, 1920×1080, 30 fps, timed word by word to Karl's voice-over. The camera breathes:
// a slow push through each beat, released on the transitions; in the profile it travels to each part as it is named.
export const FILM_DURATION = DUR;
const at = (px: number, py: number, s: number): [number, number, number] => [s, (960 - px) * s, (540 - py) * s];
const KEYS: Key[] = [
  ["hook", 1.0, 0, 0], ["mm", 1.035, 0, 0], ["mm+0.75", 1.0, 0, 0, MOVE], ["areas", 1.03, 0, 0], ["areas+0.6", 1.0, 0, 0, MOVE],
  ["steps", 1.03, 0, 0], ["steps+0.5", 1.0, 0, 0, MOVE], ["w:natural-0.15", 1.02, 0, 0],
  ["w:natural+0.45", ...at(900, 660, 1.18), MOVE], ["w:higher-0.15", ...at(905, 660, 1.19)], ["w:higher+0.45", ...at(1350, 660, 1.18), MOVE],
  ["w:conditions-0.15", ...at(1352, 662, 1.19)], ["w:conditions+0.45", ...at(1160, 820, 1.15), MOVE], ["w:best-0.1", ...at(1162, 818, 1.16)],
  ["w:best+0.5", ...at(1180, 600, 1.05), MOVE], ["label-0.1", ...at(1180, 598, 1.06)], ["label+0.5", 1.0, 0, 0, MOVE],
  ["w:more-0.05", 1.03, 0, 0], ["w:more+0.6", 1.0, 0, 0, MOVE], ["decide", 1.03, 0, 0], ["decide+0.6", 1.0, 0, 0, MOVE],
  ["w:perspective-0.1", 1.04, 0, 0], ["w:perspective+0.7", 0.95, 0, 0, MOVE], ["sign", 0.96, 0, 0], ["sign+0.8", 1.0, 0, 0, MOVE], ["end", 1.045, 0, 0],
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
