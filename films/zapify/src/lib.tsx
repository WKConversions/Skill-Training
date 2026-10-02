import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile } from "remotion";

// Zapify, from zapify.pro (2 Oct 2026): white pages, near-black heavy type, the gold-to-yellow gradient of their
// buttons, one full yellow section, pastel feature cards, colour-coded chips, a black tilted block behind the hero's
// key word, Instagram's own UI, and the logo: a speech bubble in the Instagram gradient with a yellow bolt.
export const C = {
  white: "#FFFFFF", page: "#FAFAFA", ink: "#0A0A0A", muted: "#5F6368", line: "#E5E5E5",
  gold: "#EAB308", yellow: "#FDE047", yellowField: "#FDE047",
  lavender: "#DDD6FF", pink: "#FCCEE8", butter: "#FEE685", mint: "#A4F4CF", sky: "#B8E6FE", peach: "#FFD7A8", lime: "#D8F999", lilac: "#F6CFFF",
  // their chip text colours (Creators, Influencers, Businesses, Startups, Agencies)
  cPink: "#DB2777", cPurple: "#9333EA", cBlue: "#0284C7", cOrange: "#EA580C", cGreen: "#059669",
  igPink: "#E1306C", igPurple: "#833AB4", igOrange: "#F77737", dm: "#3797F0", like: "#FF3040",
};
export const GOLD = `linear-gradient(90deg, ${C.gold} 0%, ${C.yellow} 100%)`;
export const IG = `linear-gradient(45deg, #FEDA75 0%, #FA7E1E 25%, #D62976 50%, #962FBF 75%, #4F5BD5 100%)`;
export const FONT = "Geist";
export const SHADOW = "0 30px 60px -28px rgba(10,10,10,.25), 0 10px 24px -14px rgba(10,10,10,.12)";
// the kinetic kit's roles (src/kinetic.tsx)
export const KIT = { font: FONT, serif: FONT, ink: C.ink, word: "#B45309", mark: C.yellow, under: C.gold, strike: C.ink };

const faces = [loadFont({ family: FONT, url: staticFile("fonts/geist.woff2"), weight: "400 900" })];
export const fontsLoaded = Promise.all(faces);
export const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsLoaded.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  return ready;
};
export const Canvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.white, fontFamily: `${FONT}, "Noto Color Emoji"`, color: C.ink }}>{children}</AbsoluteFill>
);
