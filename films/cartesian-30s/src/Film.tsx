import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C, LINEAR, tw } from "./lib";
import { FOOT_DURATION, FOOT_START, Footprint } from "./scenes/Footprint";
import { OUTRO_DURATION, OUTRO_START, Outro } from "./scenes/Outro";
import { RouteLines } from "./scenes/Overlays";
import { STORE_DURATION, Store } from "./scenes/Store";

// Cartesian Systems · landing-page hero film · 30 s, 1920×1080, 30 fps, silent (hero videos autoplay
// muted), and looping: frame 899 and frame 0 are both black with the route lines retracted.
export const FILM_DURATION = 900;

const Body: React.FC = () => {
  const g = useCurrentFrame();
  const lines = tw(g, 0, 30, 0, 1, LINEAR) * (1 - tw(g, 884, 899, 0, 1, LINEAR));
  const lineOpacity = g < 650 ? 0.45 : g < 824 ? tw(g, 650, 690, 0.45, 0.2, LINEAR) : tw(g, 824, 844, 0.2, 1, LINEAR);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <RouteLines progress={lines} opacity={lineOpacity} shift={tw(g, 0, 900, 0, -60, LINEAR)} />
      <Sequence name="1–4 Store" durationInFrames={STORE_DURATION}>
        <Store />
      </Sequence>
      <Sequence name="5 Footprint" from={FOOT_START} durationInFrames={FOOT_DURATION}>
        <Footprint />
      </Sequence>
      <Sequence name="6 Outro" from={OUTRO_START} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};

export const Film: React.FC<{ blurSamples: number }> = ({ blurSamples }) =>
  blurSamples > 1 ? (
    <CameraMotionBlur samples={blurSamples} shutterAngle={180}>
      <Body />
    </CameraMotionBlur>
  ) : (
    <Body />
  );
