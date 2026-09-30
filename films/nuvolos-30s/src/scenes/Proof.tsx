import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ARRIVE, C, DEPART, FONT, LINEAR, tw, useFonts } from "../lib";
import { Headline } from "./Story";

// Scene 5 · Proof · 0:22–0:26.5 (global frames 660–800): the network's nodes light up one by one while
// the count reaches 65+ universities, national banks and research institutions (nuvolos.com).
// Scene 6 · Resolution · 0:26.5–0:30 (global frames 790–900): the logo and their line, then the
// network alone again, exactly as the film began, so the hero loops.
export const PROOF_START = 660;
export const PROOF_DURATION = 240;

export const Proof: React.FC = () => {
  const g = PROOF_START + useCurrentFrame();
  const ready = useFonts();
  if (!ready) return null;
  const out = tw(g, 782, 792, 0, 1, DEPART);
  const n = Math.round(65 * tw(g, 672, 748, 0, 1, ARRIVE));
  const logo = tw(g, 800, 824, 0, 1, ARRIVE);
  const end = 1 - tw(g, 866, 890, 0, 1, LINEAR);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 300, opacity: tw(g, 668, 678, 0, 1, LINEAR) * (1 - out), translate: `${tw(g, 668, 684, -50, 0, ARRIVE)}px ${-out * 24}px` }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 230, lineHeight: 0.9, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{n}+</div>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 52, lineHeight: 1.15, color: C.cyan, marginTop: 26 }}>universities, national banks<br />and research institutions</div>
        <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 36, lineHeight: 1.3, color: C.soft, marginTop: 22, opacity: tw(g, 716, 728, 0, 1, LINEAR) }}>
          run reproducible research under full digital sovereignty.</div>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: end }}>
        <div style={{ position: "absolute", left: 960, top: 330, translate: "-50% 0", opacity: tw(g, 800, 808, 0, 1, LINEAR), scale: String(0.94 + 0.06 * logo) }}>
          <Img src={staticFile("img/logo-white.svg")} style={{ width: 560, display: "block", clipPath: `inset(0 ${(1 - tw(g, 804, 830, 0, 1, ARRIVE)) * 72}% 0 0)` }} />
        </div
        >
        <Headline g={g} at={826} out={9999} x={960} y={560} size={60} align="center"
          lines={[[{ w: "The" }, { w: "Unified" }, { w: "Workspace" }, { w: "for" }, { w: "Sovereign", hi: true }, { w: "AI", hi: true }, { w: "&", hi: true }, { w: "Science.", hi: true }]]} />
      </div>
    </AbsoluteFill>
  );
};
