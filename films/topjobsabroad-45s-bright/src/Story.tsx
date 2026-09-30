import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, useFonts } from "./lib";
import { Finale } from "./scenes/Finale";
import { Help } from "./scenes/Help";
import { Journey } from "./scenes/Journey";
import { Open } from "./scenes/Open";

// Top Jobs Abroad · 45 s, the bright version. The script, timed at about 2.7 words per second:
//   0 hook · 100 problem · 446 solution · 530 showcase (help → start to end → comfortable) · 1136 outro
export const Story: React.FC = () => {
  const g = useCurrentFrame();
  const ready = useFonts();
  if (!ready) return null;
  return (
    <AbsoluteFill style={{ background: C.page }}>
      <Open g={g} />
      <Help g={g} />
      <Journey g={g} />
      <Finale g={g} />
    </AbsoluteFill>
  );
};
