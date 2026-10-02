import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { BEATS, DURATION, SCENES, T } from "./Scenes";
import { C, Canvas, DEPART, lerp, tw, useFonts } from "./lib";

// Bruno Morgante · LinkedIn and website film, 1920×1080, 30 fps, timed to the voice-over.
// Every beat sits under a slow camera push (4% over the beat, linear, on its own layer so the type glides; render
// with library/scripts/render_chunks.sh). Beats 1→2→3 hand over inside the scenes (the project card is
// carried, the tangle clears); every later change is a push: the outgoing beat drifts left and softens
// while the next one forms (its own entrances start on its label).
export const FILM_DURATION = DURATION;
const HANDOVER = 14;                                       // frames of overlap at a push
const PUSHED = new Set(["consult", "coach", "stage", "proof", "quote", "cta"]);

const Beat: React.FC<{ i: number; g: number; out?: number }> = ({ i, g, out = 0 }) => {
  const [label] = BEATS[i];
  const [a, b] = [T.f(label), i + 1 < BEATS.length ? T.f(BEATS[i + 1][0]) : T.f("end")];
  const push = 1 + 0.04 * Math.min(1, Math.max(0, (g - a) / (b + HANDOVER - a)));   // linear: the camera never settles
  const S = SCENES[i];
  return (
    <AbsoluteFill style={{ background: C.canvas, opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined,
      transform: `translateX(${-out * 90}px) scale(${push})`, transformOrigin: "50% 50%", willChange: "transform" }}>
      <S g={g} />
    </AbsoluteFill>
  );
};

export const Film: React.FC<{ blurSamples?: number; audio?: "mix" | "vo" | "none" }> = ({ blurSamples = 1, audio = "mix" }) => {
  const g = useCurrentFrame();
  const ready = useFonts();
  let i = 0;
  BEATS.forEach(([l], j) => { if (g >= T.f(l)) i = j; });
  const L = T.f(BEATS[i][0]);
  const handing = i > 0 && PUSHED.has(BEATS[i][0]) && g < L + HANDOVER;
  const out = handing ? tw(g, L, L + HANDOVER, 0, 1, DEPART) : 0;
  const story = (
    <Canvas>
      {ready && <>
        <Beat i={i} g={g} />
        {handing && <Beat i={i - 1} g={g} out={out} />}
      </>}
    </Canvas>
  );
  return (
    <AbsoluteFill style={{ background: C.canvas }}>
      {blurSamples > 1 ? <CameraMotionBlur samples={blurSamples} shutterAngle={180}>{story}</CameraMotionBlur> : story}
      {audio !== "none" && <Audio src={staticFile(audio === "mix" ? "audio/mix.wav" : "audio/vo.wav")} />}
    </AbsoluteFill>
  );
};
export { lerp };
