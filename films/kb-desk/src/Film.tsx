import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { DUR } from "./clock";
import { breathe } from "./kinetic";
import { C, Canvas, useFonts } from "./lib";
import { Story } from "./Story";

// K.B · the desk, 1920×1080, 30 fps, on the same voice-over as the first K.B film. The camera only breathes (Karl,
// K.B: pans and quick zooms read as spikes): one slow drift over the whole desk that comes to rest for the sign-off,
// then one slow push.
export const FILM_DURATION = DUR;

export const Film: React.FC<{ blurSamples?: number; audio?: "mix" | "vo" | "none" }> = ({ blurSamples = 1, audio = "vo" }) => {
  const g = useCurrentFrame();
  const ready = useFonts();
  const cam = breathe(g, "sign");
  const story = (
    <Canvas>
      {ready && (
        <AbsoluteFill style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%", willChange: "transform" }}>
          <Story g={g} />
        </AbsoluteFill>
      )}
    </Canvas>
  );
  return (
    <AbsoluteFill style={{ background: C.desk }}>
      {blurSamples > 1 ? <CameraMotionBlur samples={blurSamples} shutterAngle={180}>{story}</CameraMotionBlur> : story}
      {audio !== "none" && <Audio src={staticFile(audio === "mix" ? "audio/mix.wav" : "audio/vo.wav")} />}
    </AbsoluteFill>
  );
};
