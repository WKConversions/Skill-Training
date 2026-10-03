import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile } from "remotion";

// K.B, from kruslockbosconsultancy.com: an off-white page, lavender-grey cards, navy second, cyan first, Montserrat,
// the K.B badge. The desk is the brand's lavender-grey, lit from above; the objects are white, aluminium and navy.
export const C = {
  white: "#FFFFFF", page: "#F7F7F8", desk: "#E7E9F0", deskLight: "#F1F2F7", card: "#EBECF4", navy: "#293A51", navy2: "#3E5674",
  cyan: "#38C8FF", cyanDeep: "#0E8FC4", cyanSoft: "#E4F6FE", ink: "#252525", muted: "#6B737D", line: "#D9DCE6",
  alu: "#DFE2E8", alu2: "#D2D6DE", key: "#C7CCD6", bezel: "#1E2633", green: "#1FA971", greenSoft: "#E3F6EC", grey: "#9AA1AB",
  sticky1: "#E4F6FE", sticky2: "#EBECF4", sticky3: "#FFFFFF", coffee: "#6F4E3C",
};
export const FONT = "Montserrat";
export const HAND = "Hand KB";
export const KIT = { font: FONT, serif: FONT, ink: C.ink, word: C.cyanDeep, mark: C.cyanSoft, under: C.cyan, strike: C.navy };

const faces = [loadFont({ family: FONT, url: staticFile("fonts/montserrat.woff2"), weight: "100 900" }),
  loadFont({ family: HAND, url: staticFile("fonts/NothingYouCouldDo-Regular.ttf"), weight: "400" })];
export const fontsLoaded = Promise.all(faces);
export const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsLoaded.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  return ready;
};
export const Canvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.desk, fontFamily: FONT, color: C.ink }}>{children}</AbsoluteFill>
);
