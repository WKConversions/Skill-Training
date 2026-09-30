import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, Camera } from "./lib";
import { Story } from "./Story";

// Alta · landing-page hero film · 30 s, 1920×1080, 30 fps, silent and looping: it opens and closes on the
// ball pile from their hero video, so frame 899 flows into frame 0.
export const FILM_DURATION = 900;

// the camera pushes slowly through every beat and resets under each beat's transition
const BEATS = [0, 150, 350, 530, 690, 816, 900];
const push = (g: number) => {
  let i = 0;
  while (i < BEATS.length - 2 && g >= BEATS[i + 1]) i++;
  return 1 + 0.04 * ((g - BEATS[i]) / (BEATS[i + 1] - BEATS[i]));
};

const Body: React.FC = () => {
  const g = useCurrentFrame();
  const s = push(g);
  return (
    <AbsoluteFill style={{ background: C.panel }}>
      {/* the faint dot grid of their hero panel, drifting on a 900-frame cycle */}
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(#DADDEA 1.6px, transparent 2px)`, backgroundSize: "40px 40px",
        backgroundPosition: `${Math.sin((2 * Math.PI * g) / 900) * 40}px ${(g / 900) * 80}px` }} />
      <Camera fx={960} fy={540} s={g < 836 ? s : 1}>
        <Story />
      </Camera>
    </AbsoluteFill>
  );
};

export const Film: React.FC<{ blurSamples: number }> = ({ blurSamples }) =>
  blurSamples > 1 ? (<CameraMotionBlur samples={blurSamples} shutterAngle={180}><Body /></CameraMotionBlur>) : <Body />;
