import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { DUR, T } from "./clock";
import { lerp } from "./kinetic";
import { C, Canvas, useFonts } from "./lib";
import { Story } from "./Story";

// K.B · website film, 1920×1080, 30 fps, timed word by word to Karl's voice-over. The camera only breathes: one slow,
// continuous push and drift over the whole film, never a pan or a quick zoom on a transition (Karl: those read as
// spikes), and it comes to rest for the sign-off so only the logo and the words move there.
export const FILM_DURATION = DUR;
const smooth = (t: number) => t * t * (3 - 2 * t);

export const Film: React.FC<{ blurSamples?: number; audio?: "mix" | "vo" | "none" }> = ({ blurSamples = 1, audio = "vo" }) => {
  const g = useCurrentFrame();
  const ready = useFonts();
  const rest = smooth(Math.min(1, Math.max(0, (g - T.f("sign-0.6")) / 30)));   // the drift eases out over a second
  const push = Math.max(0, g - T.f("sign")) / (T.f("end") - T.f("sign"));          // the sign-off: one slow, straight push
  const breath = 1.02 + Math.sin(g / 100) * 0.018, sx = Math.sin(g / 80) * 20 * (1 - rest), sy = Math.cos(g / 110) * 11 * (1 - rest);
  const cs = lerp(breath, 1 + push * 0.04, rest);
  const story = (
    <Canvas>
      {ready && (
        <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${cs}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%", willChange: "transform" }}>
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
