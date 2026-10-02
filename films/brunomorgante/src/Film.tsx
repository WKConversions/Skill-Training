import React from "react";
import { useCurrentFrame } from "remotion";
import { BEATS, DURATION, SCENES } from "./Scenes";
import { Canvas, useFonts } from "./lib";

// Bruno Morgante · LinkedIn and website film, 1920×1080, 30 fps. Storyboard build: every beat is its
// scene component; transitions and the camera are added in the animation pass.
export const FILM_DURATION = DURATION;
export const Film: React.FC<{ blurSamples?: number }> = () => {
  const g = useCurrentFrame();
  const ready = useFonts();
  const i = Math.max(0, BEATS.findIndex((b) => g >= b.from && g < b.to));
  const S = SCENES[i];
  return <Canvas>{ready && <S t={g - BEATS[i].from} />}</Canvas>;
};
