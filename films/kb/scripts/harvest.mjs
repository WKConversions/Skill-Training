import { createRequire } from "module";
const { chromium } = createRequire(import.meta.url)("/opt/node22/lib/node_modules/playwright");
import fs from "fs";
const shells = fs.readdirSync("/opt/pw-browsers").filter(d => d.startsWith("chromium_headless_shell"));
const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${shells[0]}/chrome-linux/headless_shell` });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
// Chrome doesn't trust the sandbox proxy's CA; Node does (NODE_EXTRA_CA_CERTS), so every request is fetched
// from Node and handed to the page. Media (the hero video) is skipped.
await p.route("**/*", async (route) => {
  const r = route.request();
  if (["media"].includes(r.resourceType())) return route.abort();
  try {
    const res = await fetch(r.url(), { method: r.method(), headers: { ...r.headers(), "user-agent": "Mozilla/5.0" }, body: r.postData() ?? undefined, redirect: "follow" });
    const buf = Buffer.from(await res.arrayBuffer());
    const h = {}; res.headers.forEach((v, k) => { if (!["content-encoding", "content-length", "transfer-encoding"].includes(k)) h[k] = v; });
    await route.fulfill({ status: res.status, headers: h, body: buf });
  } catch (e) { await route.abort(); }
});
const base = "https://kruslockbosconsultancy.com";
const urls = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];
const ext = fs.readFileSync("../../library/scripts/site_extract.js", "utf8");
for (const u of urls) {
  const name = u === "/" ? "home" : u.replace(/\W+/g, "_").replace(/^_|_$/g, "");
  await p.goto(base + u, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(e => console.log("goto", e.message));
  await p.waitForTimeout(4000);
  for (let y = 0; y < 12000; y += 700) { await p.mouse.wheel(0, 700); await p.waitForTimeout(150); }
  await p.waitForTimeout(2500);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.screenshot({ path: `harvest/${name}.png`, fullPage: true });
  fs.writeFileSync(`harvest/text_${name}.txt`, await p.evaluate(() => document.body.innerText));
  const info = await p.evaluate(ext);
  fs.writeFileSync(`harvest/brand_${name}.json`, JSON.stringify(info, null, 1));
  const links = await p.evaluate(() => [...new Set([...document.querySelectorAll("a[href]")].map(a => a.getAttribute("href")))]);
  fs.writeFileSync(`harvest/links_${name}.txt`, links.join("\n"));
  console.log(name, "ok");
}
await b.close();
