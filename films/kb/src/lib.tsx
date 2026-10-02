import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile } from "remotion";

// K.B, from kruslockbosconsultancy.com (2 Oct 2026): an off-white page, lavender-grey cards, navy as the second
// colour, cyan as the first, Montserrat throughout, and the K.B mark in Copperplate. Written "K.B" everywhere.
export const C = {
  white: "#FFFFFF", page: "#F7F7F8", card: "#EBECF4", navy: "#293A51", navy2: "#3E5674", cyan: "#38C8FF", cyanDeep: "#0E8FC4",
  cyanSoft: "#E4F6FE", ink: "#252525", muted: "#49525B", line: "#D9DCE6", red: "#EF4444", redSoft: "#FDECEC",
};
export const FONT = "Montserrat";
export const MARK = "Copperplate KB";
export const SHADOW = "0 30px 60px -30px rgba(41,58,81,.35), 0 10px 24px -14px rgba(41,58,81,.18)";
export const KIT = { font: FONT, serif: FONT, ink: C.ink, word: C.cyanDeep, mark: C.cyanSoft, under: C.cyan, strike: C.red };

const faces = [loadFont({ family: FONT, url: staticFile("fonts/montserrat.woff2"), weight: "100 900" }),
  loadFont({ family: MARK, url: staticFile("fonts/copperplate-heavy.otf"), weight: "800" })];
export const fontsLoaded = Promise.all(faces);
export const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsLoaded.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  return ready;
};
export const Canvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.page, fontFamily: `${FONT}, "Noto Color Emoji"`, color: C.ink }}>{children}</AbsoluteFill>
);
