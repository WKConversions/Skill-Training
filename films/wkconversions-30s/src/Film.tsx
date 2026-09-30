import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { ARRIVE, DotGrid, LINEAR, MOVE, tw } from "./lib";
import { S1Hook, S1_DURATION } from "./scenes/S1Hook";
import { S2Problem, S2_DURATION, S2_START } from "./scenes/S2Problem";
import { S3Founders, S3_DURATION, S3_START } from "./scenes/S3Founders";
import { S4Transform, S4_DURATION, S4_START } from "./scenes/S4Transform";
import { S5Proof, S5_DURATION, S5_START } from "./scenes/S5Proof";
import { S6Outro, S6_DURATION, S6_START } from "./scenes/S6Outro";

// WKConversions · who we are · 30 s, 1920×1080, 30 fps.
// VO (timed at ~2.5 words/s until a recording exists):
//  0.4–2.8   "Your visitors give you three seconds."
//  3.6–7.8   "Your product takes a paragraph to explain… so they scroll on."
//  8.3–10.5  "We're WKConversions: two motion designers"
// 10.7–15.1  "who turn that paragraph into a video people understand in seconds."
// 18.0–22.2  "ClearScaler put it simply: fast, and better than the brief."
// 25.4–27.8  "Motion design that makes it click."
export const FILM_DURATION = 900;

/** The page canvas under every scene: a slow constant drift, flicked up when the page is scrolled away. */
export const Canvas: React.FC<{ g: number }> = ({ g }) => {
  const y = -0.35 * g - tw(g, 207, 226, 0, 620, ARRIVE) + tw(g, 334, 364, 0, 260, ARRIVE);
  const x = -0.12 * g - tw(g, 708, 724, 0, 520, MOVE);
  const scale = tw(g, 434, 468, 1, 0.82, MOVE) * tw(g, 488, 522, 1, 1.5, MOVE) * tw(g, 522, 760, 1, 0.82, LINEAR);
  return <DotGrid x={x} y={y} scale={scale} />;
};

const FilmBody: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Canvas g={g} />
      <Sequence name="1 Hook" durationInFrames={S1_DURATION}>
        <S1Hook />
      </Sequence>
      <Sequence name="2 Problem" from={S2_START} durationInFrames={S2_DURATION}>
        <S2Problem />
      </Sequence>
      <Sequence name="3 Founders" from={S3_START} durationInFrames={S3_DURATION}>
        <S3Founders />
      </Sequence>
      <Sequence name="4 Transform" from={S4_START} durationInFrames={S4_DURATION}>
        <S4Transform />
      </Sequence>
      <Sequence name="5 Proof" from={S5_START} durationInFrames={S5_DURATION}>
        <S5Proof />
      </Sequence>
      <Sequence name="6 Outro" from={S6_START} durationInFrames={S6_DURATION}>
        <S6Outro />
      </Sequence>
    </AbsoluteFill>
  );
};

export const Film: React.FC<{ blurSamples: number }> = ({ blurSamples }) =>
  blurSamples > 1 ? (
    <CameraMotionBlur samples={blurSamples} shutterAngle={180}>
      <FilmBody />
    </CameraMotionBlur>
  ) : (
    <FilmBody />
  );


