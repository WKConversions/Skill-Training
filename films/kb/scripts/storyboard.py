# Builds storyboard/storyboard.html: the film on top, then every beat as a strip of frames from the final render.
#   bash scripts/deliver.sh && python3 scripts/storyboard.py   (publish with files: {"film.mp4": "out/KB-web.mp4"})
import base64, html, os, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BEATS = [
  ("Held back", "0:00", "Technology should make your business move faster, not hold it back.", "off-white", "#F7F7F8", "the K.B badge drops into the jam", [
    (1.2, "“Technology should make…”: the business’s work runs along a lane"),
    (2.4, "“move faster,”: the lane speeds up; “faster” underlined in cyan"),
    (3.3, "“not hold it back.”: a manual step drops in and the work piles up against it"),
    (3.9, "“back.” struck out"),
  ]),
  ("K.B helps", "0:04", "K.B helps companies build smarter systems", "off-white", "#F7F7F8", "the steps line up", [
    (4.45, "“K.B”: their badge lands on the jam, a ring goes out, the jam is blown apart"),
    (5.5, "The badge rides to the corner, like the button of their site’s nav; the steps fly back"),
    (6.6, "“smarter systems.”: they line up into one flow and a pulse ticks every step"),
  ]),
  ("Software, automation, AI", "0:07", "with software, automation and AI.", "off-white", "#F7F7F8", "pale cyan opens; the axis draws", [
    (7.4, "“software”: an operations dashboard that keeps working"),
    (8.3, "“automation”: a workflow with Make and n8n steps, a pulse running down it"),
    (9.4, "“AI”: a support agent answers an order question inside the inbox"),
  ]),
  ("Strategy to implementation", "0:10", "From strategy to implementation,", "pale cyan", "#E4F6FE", "the card becomes a tangle of ideas", [
    (10.3, "“From strategy”: a workshop sketch of the plan on a strategy–implementation axis"),
    (11.3, "“to implementation.”: it rides the axis and turns into the live system, every step ticked"),
  ]),
  ("Practical solutions", "0:12", "we turn complex ideas into practical solutions that work inside your business.", "pale cyan", "#E4F6FE", "the camera pulls out to their tools", [
    (12.9, "“complex ideas”: a tangled line and sticky-note ideas"),
    (14.2, "“into practical solutions.”: the line straightens into a flow of four steps"),
    (16.2, "“inside your business.”: the client’s own app closes round the flow"),
  ]),
  ("Connected", "0:17", "We connect workflows,", "off-white", "#F7F7F8", "the repetitive work", [
    (17.3, "“We connect”: the tools K.B builds with gather round the client’s app"),
    (17.8, "“workflows,”: links draw in and data runs along them"),
  ]),
  ("Automated", "0:18", "automate repetitive processes", "off-white", "#F7F7F8", "the app grows", [
    (18.4, "“Automate”: a stack of copy-order-to-spreadsheet rows"),
    (19.3, "“repetitive”: each one turns automatic"),
    (20.0, "“processes.”: they fold into one rule that runs automatically"),
  ]),
  ("Grows with you", "0:20", "and create technology that grows with you.", "off-white", "#F7F7F8", "lavender-grey opens", [
    (21.0, "“create technology”: the client’s app"),
    (21.8, "“grows”: a dashboard and a mobile app join it"),
    (22.4, "“with you.”: an AI agent joins, and the team grows"),
  ]),
  ("Involved", "0:23", "And we stay involved,", "lavender-grey", "#EBECF4", "the loop forms", [
    (23.4, "K.B joins the client’s own channel; Anna asks for invoices in the flow"),
    (24.2, "“involved.”: K.B answers, and the support work rises beside it"),
  ]),
  ("Continuously improving", "0:24", "continuously improving what we build as your needs evolve.", "lavender-grey", "#EBECF4", "white opens out of the pulse", [
    (25.0, "K.B’s own loop: Diagnose, Build, Run; the pulse goes round it"),
    (26.5, "The system’s version rolls from v1.0 to v1.4 as the loop turns"),
    (27.6, "“as your needs evolve.”: monitoring, backups, a new workflow, an integration update"),
  ]),
  ("Your technical partner", "0:28", "K.B. Your technical partner for building, running and improving the systems behind your business.", "white", "#FFFFFF", "end", [
    (28.7, "“K.B”: their badge, with the tools they build with orbiting it"),
    (30.4, "“Your technical partner”"),
    (32.0, "“for building, running and improving”"),
    (34.0, "“the systems behind your business.”: the systems light up behind the words"),
    (36.3, "Book a free discovery call, and a cursor clicks it"),
  ]),
]

def frame(t, w=960):
    jpg = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", os.path.join(ROOT, "out", "final.mp4"), "-frames:v", "1",
                          "-vf", f"scale={w}:-2", "-q:v", "5", "-f", "image2", "-c:v", "mjpeg", "-"], capture_output=True, check=True).stdout
    return "data:image/jpeg;base64," + base64.b64encode(jpg).decode()

e = html.escape
n_frames = sum(len(b[6]) for b in BEATS)
beats = []
for i, (name, tc, vo, field, sw, into, shots) in enumerate(BEATS):
    cells = "".join(f"""<figure><img src="{frame(t)}" alt="{e(cap)}" width="960" height="540" loading="lazy"><figcaption><span class="t">{int(t // 60)}:{t % 60:04.1f}</span>{e(cap)}</figcaption></figure>""" for t, cap in shots)
    beats.append(f"""
<section class="beat"><div class="bh"><span class="n">{i + 1:02d}</span><b>{e(name)}</b><span class="tc">{tc}</span><span class="sw" style="background:{sw}"></span><span class="tc">{e(field)}</span></div>
<p class="vo">“{e(vo)}”</p><div class="frames">{cells}</div><p class="into">Into the next: {e(into)}</p></section>""")

page = f"""<title>K.B Film</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap">
<style>
:root{{--page:#F7F7F8;--card:#FFFFFF;--ink:#252525;--muted:#49525B;--line:#DCDFE8;--acc:#0E8FC4;--navy:#293A51;--font:"Montserrat",system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--page:#101722;--card:#18212F;--ink:#EEF2F7;--muted:#A7B3C1;--line:#26324A;--acc:#38C8FF;--navy:#9DB7DA;color-scheme:dark}}}}
:root[data-theme="dark"]{{--page:#101722;--card:#18212F;--ink:#EEF2F7;--muted:#A7B3C1;--line:#26324A;--acc:#38C8FF;--navy:#9DB7DA;color-scheme:dark}}
*{{box-sizing:border-box}} body{{background:var(--page);color:var(--ink);font:400 16px/1.6 var(--font);margin:0;padding:32px 16px 80px}}
.wrap{{max-width:1240px;margin:0 auto;display:grid;gap:34px}}
header{{display:grid;gap:14px}} .eyebrow{{font:600 12px/1 var(--font);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}}
h1{{font:800 clamp(30px,5vw,56px)/1.05 var(--font);letter-spacing:-.035em;margin:0;text-wrap:balance;color:var(--navy)}} h1 span{{color:var(--acc)}}
header p{{margin:0;color:var(--muted);max-width:78ch;font-size:17px}} header p b{{color:var(--ink)}}
.facts{{display:flex;flex-wrap:wrap;gap:8px}} .facts span{{font:600 13px/1 var(--font);padding:9px 14px;border-radius:999px;border:1px solid var(--line);background:var(--card)}}
video{{width:100%;height:auto;border-radius:16px;border:1px solid var(--line);background:#000;display:block}}
h2{{font:800 28px/1.1 var(--font);letter-spacing:-.03em;margin:0}}
.beat{{border:1px solid var(--line);border-radius:20px;background:var(--card);padding:18px;display:grid;gap:10px}}
.bh{{display:flex;gap:12px;align-items:center;flex-wrap:wrap}} .n{{font:800 13px var(--font);color:var(--acc);font-variant-numeric:tabular-nums}} .bh b{{font:800 19px var(--font)}}
.tc{{font:500 13px var(--font);color:var(--muted);font-variant-numeric:tabular-nums}} .sw{{width:18px;height:18px;border-radius:6px;border:1px solid var(--line)}}
.vo{{font:600 18px/1.4 var(--font);margin:0}}
.frames{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}}
figure{{margin:0;display:grid;gap:6px}} figure img{{width:100%;height:auto;display:block;border-radius:10px;border:1px solid var(--line)}}
figcaption{{font-size:14px;line-height:1.4}} figcaption .t{{font-weight:800;color:var(--acc);margin-right:8px;font-variant-numeric:tabular-nums}}
.into{{margin:0;font-size:14px;color:var(--muted)}}
.box{{border:1px solid var(--line);border-radius:20px;padding:22px 26px;background:var(--card);display:grid;gap:10px}} .box ul{{margin:0;padding-left:20px;display:grid;gap:8px}}
.two{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}} code{{font-size:.9em}}
@media (max-width:820px){{.two{{grid-template-columns:minmax(0,1fr)}}}}
</style>
<div class="wrap">
<header><span class="eyebrow">Website film · for Karl's review</span>
<h1>K.B: the systems behind <span>your business.</span></h1>
<p>A 37-second website film in K.B's own look: their off-white page and lavender-grey cards, navy and cyan, Montserrat, and their logo badge exactly as on their site. Bright throughout, professional and technical, and every phrase of the voice-over gets its own visual.</p>
<p><b>The thread:</b> a business's own work. It runs, then jams behind a manual step; the K.B badge drops in and clears it; the steps line up into a smarter system that a cyan pulse runs; the system is shown as software, automation and an AI agent, rides from strategy to implementation, straightens from tangled ideas into a flow inside the client's own app, connects to the tools K.B builds with, automates the repetitive rows, grows with the team, and K.B stays in the client's channel and turns its own Diagnose, Build, Run loop as the system improves. The badge closes the film with the call to book a free discovery call.</p>
<div class="facts"><span>16:9 · 1920×1080 · 30 fps</span><span>37.5 s</span><span>Your voice-over (Christina)</span><span>Music + 67 sound effects</span><span>−15 LUFS</span><span>{n_frames} frames below</span></div></header>
<video src="film.mp4" controls playsinline preload="metadata" poster="{frame(17.8, 1280)}"></video>
<section style="display:grid;gap:16px"><h2>Phrase by phrase</h2>{''.join(beats)}</section>
<section class="two">
<div class="box"><h2>From the form and the site</h2><ul>
<li><b>Shown, as asked:</b> software (a dashboard, a mobile app), automation (workflows with Make and n8n), an AI agent, connected workflows, and K.B alongside the client from strategy through implementation to ongoing support.</li>
<li><b>Their words:</b> Diagnose, Build, Run; monitoring, backups, integration updates and new workflows from their support plans; the tools are the ones they list as the tools they build with; "Book a free discovery call".</li>
<li><b>Named K.B everywhere</b>, never "K.B Consultancy", and the logo is their own badge, never redrawn.</li>
<li><b>Avoided:</b> no futuristic AI, no robots, nothing abstract for its own sake, no one-off agency look; the site's hero video was not used; their numbers are left out because the script doesn't say them.</li>
<li><b>Illustrative:</b> the client's workflow, the team in the channel and the version numbers claim nothing.</li>
</ul></div>
<div class="box"><h2>Motion and sound</h2><ul>
<li><b>Measured:</b> every phrase of the voice-over brings a new visual; something moves in every frame; a typical frame changes 3% or more of its area, the new target, with screens on gently tilting 3D planes, chips orbiting the loop and tool tiles orbiting the close.</li>
<li><b>Transitions grow out of objects:</b> the badge clears the jam, the steps come back from where it threw them, the plan turns into the live system on the axis, the tangle straightens into the flow, the camera pulls out of the client's app to their tools, colour fields open out of the pulse.</li>
<li><b>Music:</b> "Raising Me Higher" by Ahjay Stelino (Mixkit free licence, commercial use, no credit), cut to open up on "K.B helps".</li>
<li><b>Sound effects:</b> 67 from your library, including the new pack's gears, data and cinematic whooshes, each on its picture event.</li>
</ul></div></section>
<div class="box"><h2>Files</h2><ul>
<li><code>KB-1080p.mp4</code>: the master, with sound.</li>
<li><code>KB-web.mp4</code>: 720p with sound, for the website (the film above).</li>
<li><code>KB-web-muted.mp4</code>: 720p without sound, for autoplay.</li>
</ul></div>
</div>
"""
open(os.path.join(ROOT, "storyboard", "storyboard.html"), "w").write(page)
print("storyboard/storyboard.html", len(page) // 1024, "KB,", n_frames, "frames")
