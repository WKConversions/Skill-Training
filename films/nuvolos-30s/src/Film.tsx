import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Camera, LINEAR, tw } from "./lib";
import { NODES, Network } from "./scenes/Network";
import { PROOF_DURATION, PROOF_START, Proof } from "./scenes/Proof";
import { STORY_DURATION, Story } from "./scenes/Story";

// Nuvolos · landing-page hero film · 30 s, 1920×1080, 30 fps, silent and looping: the network drifts on
// a 900-frame cycle and every overlay has cleared by the last frame, so frame 899 flows into frame 0.
export const FILM_DURATION = 900;
const ORDER = [...NODES].sort((a, b) => a.x - b.x).map((n) => n.id);

const Body: React.FC = () => {
  const g = useCurrentFrame();
  // behind the story the network recedes a little; for the proof its nodes light up one by one
  const dim = g < 20 ? 1 : g < 650 ? tw(g, 20, 50, 1, 0.55, LINEAR) : g < 790 ? tw(g, 650, 670, 0.55, 1, LINEAR) : tw(g, 790, 810, 1, 0.7, LINEAR) + tw(g, 862, 895, 0, 0.3, LINEAR);
  const lit = (n: (typeof NODES)[number]) => {
    if (g < 656 || g > 790) return 1;
    const i = ORDER.indexOf(n.id) / ORDER.length;
    return tw(g, 656, 670, 1, 0.15, LINEAR) + tw(g, 676 + i * 70, 686 + i * 70, 0, 0.85, ARRIVE_L);
  };
  return (
    <AbsoluteFill>
      <Network g={g} lit={lit} dim={dim} />
      <Camera fx={1100} fy={540} sx={1100} s={push(g)}>
        <Sequence name="1–4 Story" durationInFrames={STORY_DURATION}><Story /></Sequence>
        <Sequence name="5–6 Proof and logo" from={PROOF_START} durationInFrames={PROOF_DURATION}><Proof /></Sequence>
      </Camera>
    </AbsoluteFill>
  );
};
// the camera pushes slowly through every beat and resets under each beat's transition
const BEATS = [0, 150, 300, 470, 560, 660, 790, 900];
const push = (g: number) => {
  let i = 0;
  while (i < BEATS.length - 2 && g >= BEATS[i + 1]) i++;
  return 1 + 0.045 * ((g - BEATS[i]) / (BEATS[i + 1] - BEATS[i]));
};
const ARRIVE_L = (t: number) => 1 - Math.pow(1 - t, 3);

export const Film: React.FC<{ blurSamples: number }> = ({ blurSamples }) =>
  blurSamples > 1 ? (<CameraMotionBlur samples={blurSamples} shutterAngle={180}><Body /></CameraMotionBlur>) : <Body />;
