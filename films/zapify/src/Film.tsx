import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { DUR } from "./clock";
import { type Key, MOVE, camera } from "./kinetic";
import { C, Canvas, useFonts } from "./lib";
import { Story } from "./Story";

// Zapify · website film, 1920×1080, 30 fps, timed word by word to Karl's voice-over. The camera breathes:
// a slow push through each beat, released with MOVE on each transition, so it never locks and never jumps.
export const FILM_DURATION = DUR;
const KEYS: Key[] = [
  ["hook", 1.0, 0, 0], ["zap-0.1", 1.04, 0, 0], ["zap+0.6", 1.0, 0, 0, MOVE], ["sources", 1.02, 0, 0], ["sources+0.6", 1.0, 0, 0, MOVE],
  ["auto-0.1", 1.035, 0, 0], ["auto+0.7", 1.0, 0, 0, MOVE], ["links-0.1", 1.03, 0, 0], ["links+0.6", 1.0, 0, 0, MOVE],
  ["emails-0.1", 1.035, 24, 0], ["emails+0.6", 1.0, 0, 0, MOVE], ["comments-0.1", 1.035, 24, 0], ["comments+0.6", 1.0, 0, 0, MOVE],
  ["story-0.1", 1.035, 24, 0], ["story+0.6", 1.0, 0, 0, MOVE], ["who-0.1", 1.035, 24, 0], ["who+0.6", 1.0, 0, 0, MOVE],
  ["resp-0.1", 1.035, 0, 0], ["resp+0.6", 1.0, 0, 0, MOVE], ["less-0.1", 1.035, 0, 0], ["less+0.6", 1.0, 0, 0, MOVE],
  ["more-0.1", 1.035, 0, 0], ["more+0.6", 1.0, 0, 0, MOVE], ["sign-0.1", 1.035, 0, 0], ["sign+0.7", 1.0, 0, 0, MOVE], ["end", 1.04, 0, 0],
];

export const Film: React.FC<{ blurSamples?: number; audio?: "mix" | "vo" | "none" }> = ({ blurSamples = 1, audio = "vo" }) => {
  const g = useCurrentFrame();
  const ready = useFonts();
  const cam = camera(g, KEYS);
  const story = (
    <Canvas>
      {ready && (
        <AbsoluteFill style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s}) rotate(0.02deg)`, transformOrigin: "50% 50%", willChange: "transform" }}>
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
