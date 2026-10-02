import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Coach, Dock, Proof, Quote, Stage, Talk, Turn } from "./Acts";
import { Board } from "./Board";
import { DUR, type Key, T, camera } from "./kit";
import { C, Canvas, MOVE, useFonts } from "./lib";

// Bruno Morgante · film v3: one continuous stage, 1920×1080, 30 fps, timed word by word to Karl's voice-over.
// The camera breathes with the story: a slow push through every beat, released (eased back) on each transition,
// so it never locks and never jumps. Transitions grow out of objects: masks out of a card, a person, a mark, a dot.
export const FILM_DURATION = DUR;

const KEYS: Key[] = [
  ["hook", 1.0, 0, 0], ["tangle", 1.035, 0, 0], ["tangle+0.8", 0.97, 0, 0, MOVE], ["w:that's", 1.0, 0, 0],
  ["w:that's+0.6", 1.02, 0, 0, MOVE], ["consult", 1.05, -20, 0], ["consult+0.75", 1.0, 0, 0, MOVE], ["coach-0.15", 1.035, 0, 0],
  ["coach+0.6", 1.0, 0, 0, MOVE], ["stage-0.05", 1.035, 0, 0], ["stage+0.65", 1.0, 0, 0, MOVE], ["proof-0.1", 1.04, 0, 0],
  ["proof+0.45", 1.0, 0, 0, MOVE], ["quote", 1.035, 0, 0], ["quote+0.85", 1.0, 0, 0, MOVE], ["w:let's-0.12", 1.04, 0, 0],
  ["w:let's+0.5", 1.0, 0, 0, MOVE], ["end", 1.045, 0, 0],
];

export const Film: React.FC<{ blurSamples?: number; audio?: "mix" | "vo" | "none" }> = ({ blurSamples = 1, audio = "vo" }) => {
  const g = useCurrentFrame();
  const ready = useFonts();
  const cam = camera(g, KEYS);
  const on = (a: string, b: string) => g >= T.f(a) && g < T.f(b);
  const story = (
    <Canvas>
      {ready && (
        <AbsoluteFill style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`, transformOrigin: "50% 50%", willChange: "transform" }}>
          {on("hook", "coach+0.75") && <Board g={g} />}
          {on("w:that's-0.1", "consult+0.8") && <Turn g={g} />}
          {on("w:bruno-0.2", "coach+0.6") && <Dock g={g} />}
          {on("coach-0.15", "stage+0.75") && <Coach g={g} />}
          {on("stage-0.1", "proof+0.5") && <Stage g={g} />}
          {on("quote", "end") && <Quote g={g} />}
          {on("proof-0.15", "quote+1.0") && <Proof g={g} />}
          {on("w:let's-0.15", "end") && <Talk g={g} />}
        </AbsoluteFill>
      )}
    </Canvas>
  );
  return (
    <AbsoluteFill style={{ background: C.canvas }}>
      {blurSamples > 1 ? <CameraMotionBlur samples={blurSamples} shutterAngle={180}>{story}</CameraMotionBlur> : story}
      {audio !== "none" && <Audio src={staticFile(audio === "mix" ? "audio/mix.wav" : "audio/vo.wav")} />}
    </AbsoluteFill>
  );
};
