import { loadFont } from "@remotion/fonts";
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Camera3D, EASE3, k3, Laptop3D, mix, Panel3D, Phone3D, Screens, Stage3D, Tile3D, useTex } from "./three_kit";

// The 3D kit's test reel: 1 the K.B badge as a real object, 2 a laptop and a phone with live screens, 3 the
// interface lifting off the screen into layers. Bright, calm, the camera only breathes.
loadFont({ family: "Montserrat", url: staticFile("fonts/montserrat.woff2"), weight: "100 900" });
const UI: React.FC<{ title: string; rows?: number; k?: number }> = ({ title, rows = 3, k = 1 }) => (
  <div style={{ fontFamily: "Montserrat", padding: 48, color: "#293A51", width: "100%", height: "100%", background: "#fff" }}>
    <div style={{ fontSize: 22, fontWeight: 700, color: "#0E8FC4", letterSpacing: "0.08em" }}>YOUR BUSINESS</div>
    <div style={{ fontSize: 64, fontWeight: 800, marginTop: 6 }}>{title}</div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} style={{ marginTop: 26, height: 88, borderRadius: 18, background: "#F4F5F9", display: "flex", alignItems: "center", padding: "0 28px", gap: 22,
        opacity: Math.min(1, Math.max(0, k * 3 - i)) }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#E4F6FE" }} />
        <div style={{ fontSize: 36, fontWeight: 700, flex: 1 }}>Order {1041 + i}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#1FA971", background: "#E3F6EC", borderRadius: 22, padding: "8px 18px" }}>Done</div>
      </div>
    ))}
  </div>
);

export const Reel: React.FC = () => {
  const g = useCurrentFrame();
  const logo = useTex("img/kb-logo.png");
  // shot 1 (0–100): the badge rises off the floor and turns to face us; a long S, no overshoot
  const rise = k3(g, 0, 48, EASE3.longS), turn = k3(g, 10, 60, EASE3.soft), out1 = k3(g, 88, 14, EASE3.depart);
  // shot 2 (100–200): the laptop opens, the phone stands beside it
  const open = k3(g, 96, 36, EASE3.soft), phone = k3(g, 120, 30, EASE3.arrive);
  // shot 3 (200–300): three panels lift off the screen into layers, one after another (B9)
  const lift = [0, 1, 2].map((i) => k3(g, 200 + i * 5, 34, i === 0 ? EASE3.lead : EASE3.follow));
  const s1 = g < 100, s2 = g >= 96;
  return (
    <AbsoluteFill style={{ background: "#F4F5F9" }}>
      <Screens>
      <Stage3D g={g} floorY={s1 ? -2.4 : -0.02}
        camera={<Camera3D g={g} target={s1 ? [0, 0.3, 0] : [0, 2.2, 0]} z={s1 ? 19 : 22} orbit={s1 ? mix(0.25, 0, turn) : mix(-0.35, -0.2, k3(g, 100, 200, EASE3.soft))} push={s1 ? 0 : k3(g, 200, 90, EASE3.soft)} dolly={4} />}>
        {s1 && (
          <Tile3D tex={logo} size={4.4} depth={0.55} material="satin" color="#33475F"
            position={[0, mix(-1.6, 0.3, rise) - out1 * 6, 0]} rotation={[mix(-1.2, -0.05, turn), mix(0.9, 0, turn), mix(0.15, 0, turn)]} />
        )}
        {s2 && (
          <>
            <Laptop3D open={open} position={[-0.6, 0, 0]} rotation={[0, 0.12, 0]} screen={<UI title="Orders" k={k3(g, 132, 30)} />} />
            <Phone3D position={[mix(9, 5.6, phone), 2.15, 1.2]} rotation={[0, -0.25, 0]} screen={<UI title="App" rows={2} />} px={[390, 800]} />
            {lift.map((l, i) => l > 0 && (
              <Panel3D key={i} id={`panel${i}`} w={3.2} h={1.1} px={[640, 220]} position={[mix(-0.6 + (i - 1) * 0.2, -3.5 + i * 3.4, l), mix(2.4 + i * 0.6, 5.2, l), mix(-2.4, 1.6 + i * 0.5, l)]}
                rotation={[0, mix(0.12, 0.25, l), 0]}>
                <div style={{ fontFamily: "Montserrat", width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 22, padding: "0 34px", color: "#293A51" }}>
                  <div style={{ width: 70, height: 70, borderRadius: 18, background: ["#38C8FF", "#293A51", "#E4F6FE"][i] }} />
                  <div style={{ fontSize: 46, fontWeight: 800 }}>{["CRM", "Invoices", "Support"][i]}</div>
                </div>
              </Panel3D>
            ))}
          </>
        )}
      </Stage3D>
      </Screens>
    </AbsoluteFill>
  );
};
