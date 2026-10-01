import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { C } from "./lib";
import { DURATION, Story } from "./Story";

// GoHere · website hero film, 1920×1080, 30 fps, cut to the voice-over. The sound is one finished mix
// (voice, music bed, effects; sound/cues.json through library/scripts/sound_mix.py), in two versions:
// "found" (a licensed library track cut to the film) and "composed" (scored for it by music_make.py).
// The audio sits outside the motion blur (inside it, every blur sample would play it again).
export const FILM_DURATION = DURATION;

export const Film: React.FC<{ blurSamples: number; music?: "found" | "composed" | "none" }> = ({ blurSamples, music = "found" }) => (
  <AbsoluteFill style={{ background: C.white }}>
    {blurSamples > 1 ? <CameraMotionBlur samples={blurSamples} shutterAngle={180}><Story /></CameraMotionBlur> : <Story />}
    <Audio src={staticFile(music === "none" ? "audio/vo.mp3" : `audio/mix-${music}.wav`)} />
  </AbsoluteFill>
);
