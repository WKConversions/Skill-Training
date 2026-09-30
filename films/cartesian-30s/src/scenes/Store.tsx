import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ARRIVE, C, Camera, LINEAR, MOVE, UI, iso, tw, useFonts } from "../lib";
import { A, TEE, TEE_FOUND, posOn } from "../store";
import { Headline, ItemCard, Pill } from "./Overlays";
import { StoreWorld } from "./StoreWorld";

// Scenes 1–4 · 0:00–0:23 (global frames 0–690), one continuous store:
// 1 Search   0:01–0:05  one associate walks the aisles and keeps missing the item
// 2 Problem  0:05–0:10  the camera pulls back: the whole team is searching
// 3 Solution 0:10–0:16  the RFID scans they already do light every item up on a live map
// 4 Show     0:16–0:22  a straight route to the item; then a same-day order on the optimal pickpath
// then the store pulls away into the footprint scene.
export const STORE_DURATION = 700;

const CENTER = iso(500, 350);
const follow = (g: number): [number, number] => {
  let x = 0, y = 0;
  for (let k = 0; k < 6; k++) { const [px, py] = iso(...posOn(A, Math.max(30, g - k * 5))); x += px; y += py; }
  return [x / 6, y / 6];
};
const TEE_XY = iso(TEE.x, TEE.y, TEE.z);

export const Store: React.FC = () => {
  const g = useCurrentFrame();
  const ready = useFonts();
  if (!ready) return null;

  // camera: close on the first associate, back to the whole store, in on the item, back, away
  const fa = follow(g);
  const toWide = tw(g, 150, 250, 0, 1, MOVE);
  const toTee = tw(g, 478, 530, 0, 1, MOVE) * (1 - tw(g, 556, 600, 0, 1, MOVE));
  const away = tw(g, 648, 700, 0, 1, MOVE);
  const fx0 = fa[0] + (CENTER[0] - fa[0]) * toWide;
  const fy0 = fa[1] + (CENTER[1] - fa[1]) * toWide;
  const fx = fx0 + (TEE_XY[0] - fx0) * toTee;
  const fy = fy0 + (TEE_XY[1] - fy0) * toTee;
  const s0 = tw(g, 0, 150, 1.62, 1.45, LINEAR) + (keys3(g) - 1.45) * toWide;
  const s = (s0 + (1.3 + tw(g, 520, 560, 0, 0.07, LINEAR) - s0) * toTee) * (1 - away) + 0.34 * away;
  const sx = tw(g, 150, 250, 1150, 1080, MOVE) + (1180 - 1080) * toTee + (960 - 1080) * away;
  const sy = tw(g, 150, 250, 600, 560, MOVE) + (540 - 560) * toTee + (540 - 560) * away;

  const seconds = Math.floor(Math.max(0, g - 40) * 1.9);
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const status =
    g < 300 ? (<><span style={{ width: 14, height: 14, borderRadius: 7, background: C.muted, display: "inline-block" }} /><span style={{ color: C.grey }}>Searching</span><span style={{ color: C.muted, fontVariantNumeric: "tabular-nums" }}>{clock}</span></>)
    : g < TEE_FOUND ? (<><span style={{ width: 14, height: 14, borderRadius: 7, background: C.mapBlue, display: "inline-block", opacity: 0.6 + 0.4 * Math.sin(g / 3) }} /><span style={{ color: C.blue }}>Reading store</span></>)
    : (<><svg width={30} height={30} viewBox="0 0 24 24"><path d="M4 12.5 L9.5 18 L20 6.5" fill="none" stroke={C.pin} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg><span style={{ color: C.pin }}>Located · Aisle 3</span></>);

  return (
    <AbsoluteFill>
      <Camera fx={fx} fy={fy} sx={sx} sy={sy} s={s}>
        <StoreWorld g={g} draw={tw(g, 0, 34, 0, 1, LINEAR)} />
      </Camera>
      <AbsoluteFill style={{ opacity: 1 - tw(g, 646, 660, 0, 1, LINEAR) }}>
        <ItemCard g={g} enter={34} exit={556} status={status} />
        <Headline g={g} at={46} out={142} x={80} y={880} lines={[[{ w: "Somewhere" }, { w: "in" }, { w: "this" }, { w: "store.", grey: true }]]} />
        <Headline g={g} at={160} out={292} x={80} y={880} lines={[[{ w: "Your" }, { w: "team" }, { w: "is" }, { w: "still", grey: true }, { w: "searching.", grey: true }]]} />
        <Headline g={g} at={306} out={472} x={80} y={800} gap={3}
          lines={[[{ w: "Your" }, { w: "RFID" }, { w: "scans," }, { w: "turned" }, { w: "into" }], [{ w: "a", grey: true }, { w: "live", grey: true }, { w: "map", grey: true }, { w: "of", grey: true }, { w: "every", grey: true }, { w: "item.", grey: true }]]} />
        <div style={{ position: "absolute", left: 80, top: 700, opacity: tw(g, 392, 400, 0, 1, LINEAR) * (1 - tw(g, 470, 476, 0, 1, LINEAR)), translate: `${tw(g, 392, 404, -40, 0, ARRIVE)}px 0px` }}>
          <Pill>No new hardware</Pill>
        </div>
        <Headline g={g} at={488} out={560} x={80} y={880} lines={[[{ w: "Go" }, { w: "straight" }, { w: "to", grey: true }, { w: "it.", grey: true }]]} />
        <Headline g={g} at={562} out={648} x={80} y={880} lines={[[{ w: "Same-day" }, { w: "orders," }, { w: "on" }, { w: "the" }, { w: "optimal", grey: true }, { w: "path.", grey: true }]]} />
        <div style={{ position: "absolute", left: 80, top: 790, fontFamily: UI, fontWeight: 500, fontSize: 30, color: C.muted, letterSpacing: "0.08em",
          opacity: tw(g, 558, 566, 0, 1, LINEAR) * (1 - tw(g, 646, 652, 0, 1, LINEAR)) }}>FAST SAME-DAY FULFILLMENT</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// the store-wide scale between the pull-back and the item push-in
function keys3(g: number) {
  return g < 300 ? tw(g, 240, 300, 0.9, 0.93, LINEAR) : g < 480 ? tw(g, 300, 480, 0.93, 0.98, LINEAR) : g < 600 ? 0.98 : tw(g, 600, 648, 0.98, 0.94, LINEAR);
}
