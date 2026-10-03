import React from "react";
import { Composition } from "remotion";
import { Reel } from "./Reel";
export const RemotionRoot: React.FC = () => <Composition id="Reel" component={Reel} durationInFrames={300} fps={30} width={1920} height={1080} />;
