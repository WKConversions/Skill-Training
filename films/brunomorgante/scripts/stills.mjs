// node scripts/stills.mjs 0,45,120 [samples]  -> out/test/f0000.png ... (frames of the Film composition)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "fs";
import path from "path";

const frames = process.argv[2].split(",").map(Number);
const samples = Number(process.argv[3] || 1);
const browserExecutable = fs.readdirSync("/opt/pw-browsers").filter((d) => d.startsWith("chromium_headless_shell"))
  .map((d) => `/opt/pw-browsers/${d}/chrome-linux/headless_shell`)[0];
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const inputProps = { blurSamples: samples };
const composition = await selectComposition({ serveUrl, id: "Film", inputProps, browserExecutable });
fs.mkdirSync("out/test", { recursive: true });
for (const frame of frames) {
  await renderStill({ serveUrl, composition, frame, inputProps, browserExecutable, output: `out/test/f${String(frame).padStart(4, "0")}.png` });
  process.stdout.write(`${frame} `);
}
console.log("done");
