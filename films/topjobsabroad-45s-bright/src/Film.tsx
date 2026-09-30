import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./lib";
import { Story } from "./Story";

// Top Jobs Abroad · 45 s explainer, bright version. 1920×1080, 30 fps. Every scene carries its own camera
// (no global push that resets), and every scene change is a move: a pull-back, a fall, a collapse, a pan.
export const FILM_DURATION = 1350;

const Body: React.FC = () => (
  <AbsoluteFill style={{ background: C.page }}>
    <Story />
  </AbsoluteFill>
);

export const Film: React.FC<{ blurSamples: number }> = ({ blurSamples }) =>
  blurSamples > 1 ? (<CameraMotionBlur samples={blurSamples} shutterAngle={180}><Body /></CameraMotionBlur>) : <Body />;
