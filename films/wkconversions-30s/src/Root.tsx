import React from "react";
import { AbsoluteFill, Composition, useCurrentFrame } from "remotion";
import { Canvas, FILM_DURATION, Film } from "./Film";
import { S1Hook, S1_DURATION } from "./scenes/S1Hook";
import { S2Problem, S2_DURATION, S2_START } from "./scenes/S2Problem";
import { S3Founders, S3_DURATION, S3_START } from "./scenes/S3Founders";
import { S4Transform, S4_DURATION, S4_START } from "./scenes/S4Transform";
import { S5Proof, S5_DURATION, S5_START } from "./scenes/S5Proof";
import { S6Outro, S6_DURATION, S6_START } from "./scenes/S6Outro";

// Each scene is also its own composition, on the film's canvas, so it has its own timeline in Studio.
const Scene: React.FC<{ start: number; children: React.ReactNode }> = ({ start, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Canvas g={start + f} />
      {children}
    </AbsoluteFill>
  );
};

const base = { fps: 30, width: 1920, height: 1080 };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={FILM_DURATION} defaultProps={{ blurSamples: 8 }} {...base} />
    <Composition id="S1-Hook" component={() => <Scene start={0}><S1Hook /></Scene>} durationInFrames={S1_DURATION} {...base} />
    <Composition id="S2-Problem" component={() => <Scene start={S2_START}><S2Problem /></Scene>} durationInFrames={S2_DURATION} {...base} />
    <Composition id="S3-Founders" component={() => <Scene start={S3_START}><S3Founders /></Scene>} durationInFrames={S3_DURATION} {...base} />
    <Composition id="S4-Transform" component={() => <Scene start={S4_START}><S4Transform /></Scene>} durationInFrames={S4_DURATION} {...base} />
    <Composition id="S5-Proof" component={() => <Scene start={S5_START}><S5Proof /></Scene>} durationInFrames={S5_DURATION} {...base} />
    <Composition id="S6-Outro" component={() => <Scene start={S6_START}><S6Outro /></Scene>} durationInFrames={S6_DURATION} {...base} />
  </>
);
