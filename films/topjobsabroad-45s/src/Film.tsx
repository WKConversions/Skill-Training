import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, Camera } from "./lib";
import { Story } from "./Story";

// Top Jobs Abroad · 45 s explainer, 1920×1080, 30 fps. Hook → problem → solution → showcase → outro,
// timed to their script at about 2.7 words per second so a voice-over can be recorded to it.
export const FILM_DURATION = 1350;

// the camera pushes slowly through every beat and resets under each beat's transition
const BEATS = [0, 96, 446, 526, 806, 1060, 1136, 1222, 1350];
const push = (g: number) => {
  let i = 0;
  while (i < BEATS.length - 2 && g >= BEATS[i + 1]) i++;
  return 1 + 0.05 * ((g - BEATS[i]) / (BEATS[i + 1] - BEATS[i]));
};

const Body: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <Camera fx={960} fy={540} s={push(g)}>
        <Story />
      </Camera>
    </AbsoluteFill>
  );
};

export const Film: React.FC<{ blurSamples: number }> = ({ blurSamples }) =>
  blurSamples > 1 ? (<CameraMotionBlur samples={blurSamples} shutterAngle={180}><Body /></CameraMotionBlur>) : <Body />;
