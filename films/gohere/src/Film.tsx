import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { C } from "./lib";
import { DURATION, Story } from "./Story";

// GoHere · website hero film, 1920×1080, 30 fps, cut to the voice-over. The audio sits outside the
// motion blur (inside it, every blur sample would play it again).
export const FILM_DURATION = DURATION;

export const Film: React.FC<{ blurSamples: number }> = ({ blurSamples }) => (
  <AbsoluteFill style={{ background: C.white }}>
    {blurSamples > 1 ? <CameraMotionBlur samples={blurSamples} shutterAngle={180}><Story /></CameraMotionBlur> : <Story />}
    <Audio src={staticFile("audio/vo.mp3")} />
  </AbsoluteFill>
);
