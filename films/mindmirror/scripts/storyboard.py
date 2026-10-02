# Builds storyboard/storyboard.html: the film on top, then every beat as a strip of frames from the final render.
#   bash scripts/deliver.sh && python3 scripts/storyboard.py   (publish with files: {"film.mp4": "out/MindMirror-web.mp4"})
import base64, html, os, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BEATS = [
  ("Hook", "0:00", "You know what you're good at. But not always why.", "white", "#FFFFFF", "the tangle moves to the centre", [
    (0.6, "“You know what…”: the words build on the voice"),
    (1.5, "“good at.” in their olive, and a check lands"),
    (2.6, "“But not always why.”: the first line steps back"),
    (3.3, "“why.” gets a lime mark; tangled signal draws in beside it"),
  ]),
  ("MindMirror", "0:03", "MindMirror turns patterns from your assessment into a clearer picture", "white", "#FFFFFF", "the figure makes room for the areas", [
    (4.0, "The tangle moves to the centre; a centre line draws"),
    (4.5, "Their mark opens out of its own centre line; the wordmark"),
    (5.3, "The scan line sweeps down: above it, the signal orders into their mirrored pattern"),
    (6.9, "A clearer picture: “Complexity becomes clarity”"),
  ]),
  ("The areas", "0:07", "of how you focus, respond to pressure, stay driven and process information.", "white", "#FFFFFF", "the cards gather into one assessment", [
    (8.3, "Focus: their insight card flies out of the figure, its wave draws"),
    (9.6, "Pressure: the curve that shifts"),
    (10.7, "Drive: the bars of momentum grow"),
    (12.0, "Processing: the mirrored loops"),
  ]),
  ("Assessment", "0:12", "One guided assessment. One visual profile.", "off-white", "#F7F8F3", "the card opens on its centre line", [
    (12.75, "The cards gather into the guided assessment; 01 Assess lights"),
    (13.75, "The areas tick off one by one"),
    (14.1, "02 Analyze: the scan line passes over the answers"),
    (14.75, "The card opens on its centre line into the profile; 03 Understand"),
  ]),
  ("The profile", "0:15", "Your natural strengths, your higher-effort areas, and the conditions in which you tend to perform at your best.", "off-white", "#F7F8F3", "the profile folds into the person", [
    (15.9, "Their example profile, marked “Illustrative” and “Example, not a result”"),
    (16.9, "Natural strengths: the camera moves to it, a lime underline"),
    (18.3, "Higher-effort areas: a dashed olive underline"),
    (20.1, "Best working conditions: the band opens"),
    (21.7, "“At your best”: the peak of the pattern is marked"),
  ]),
  ("Not a label", "0:22", "Not another label. More context about the way you work.", "lime, then off-white", "#ABCB52", "the figure moves aside", [
    (22.45, "The profile folds into the person; lime floods out of them"),
    (23.0, "Labels fly in and are struck out"),
    (23.5, "…and fall away"),
    (24.4, "The figure grows back round the person"),
    (25.4, "More context: the six areas around them, as on their site"),
  ]),
  ("Perspective", "0:25", "So you can understand yourself better and make decisions with more perspective.", "off-white", "#F7F8F3", "white opens round the figure", [
    (26.6, "“Understand yourself”"),
    (27.5, "“better.”"),
    (28.45, "“Make decisions with…”"),
    (29.45, "“more perspective.”: a lime mark, and the camera pulls back"),
  ]),
  ("Sign-off", "0:30", "MindMirror. See how your mind works.", "white", "#FFFFFF", "end", [
    (30.35, "White opens; their mark opens out of its centre line"),
    (31.1, "The wordmark, under the figure"),
    (32.5, "“See how your mind works.”"),
    (34.4, "Book your MindMirror Scan"),
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

page = f"""<title>MindMirror Film</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
<style>
:root{{--page:#F7F8F3;--card:#FFFFFF;--ink:#111713;--muted:#66706A;--line:#E8ECE6;--red:#708932;--font:"Inter",system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--page:#111713;--card:#18201B;--ink:#F1F4EE;--muted:#A9B2AB;--line:#2A332D;--red:#ABCB52;color-scheme:dark}}}}
:root[data-theme="dark"]{{--page:#111713;--card:#18201B;--ink:#F1F4EE;--muted:#A9B2AB;--line:#2A332D;--red:#ABCB52;color-scheme:dark}}
*{{box-sizing:border-box}} body{{background:var(--page);color:var(--ink);font:400 16px/1.6 var(--font);margin:0;padding:32px 16px 80px}}
.wrap{{max-width:1240px;margin:0 auto;display:grid;gap:34px}}
header{{display:grid;gap:14px}} .eyebrow{{font:600 12px/1 var(--font);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}}
h1{{font:500 clamp(32px,5vw,58px)/1.05 var(--font);letter-spacing:-.045em;margin:0;text-wrap:balance}} h1 i{{font-style:normal;color:var(--red)}}
header p{{margin:0;color:var(--muted);max-width:76ch;font-size:17px}}
.facts{{display:flex;flex-wrap:wrap;gap:8px}} .facts span{{font:600 13px/1 var(--font);padding:9px 14px;border-radius:999px;border:1px solid var(--line);background:var(--card)}}
video{{width:100%;height:auto;border-radius:16px;border:1px solid var(--line);background:#000;display:block}}
h2{{font:500 30px/1.1 var(--font);letter-spacing:-.035em;margin:0}}
.beat{{border:1px solid var(--line);border-radius:20px;background:var(--card);padding:18px;display:grid;gap:10px}}
.bh{{display:flex;gap:12px;align-items:center;flex-wrap:wrap}} .n{{font:700 13px var(--font);color:var(--red);font-variant-numeric:tabular-nums}} .bh b{{font:700 20px var(--font)}}
.tc{{font:500 13px var(--font);color:var(--muted);font-variant-numeric:tabular-nums}} .sw{{width:18px;height:18px;border-radius:6px;border:1px solid var(--line)}}
.vo{{font:600 19px/1.4 var(--font);margin:0}}
.frames{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}}
figure{{margin:0;display:grid;gap:6px}} figure img{{width:100%;height:auto;display:block;border-radius:10px;border:1px solid var(--line)}}
figcaption{{font-size:14px;line-height:1.4}} figcaption .t{{font-weight:700;color:var(--red);margin-right:8px;font-variant-numeric:tabular-nums}}
.into{{margin:0;font-size:14px;color:var(--muted)}}
.box{{border:1px solid var(--line);border-radius:20px;padding:22px 26px;background:var(--card);display:grid;gap:10px}} .box ul{{margin:0;padding-left:20px;display:grid;gap:8px}}
.two{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}} code{{font-size:.9em}}
@media (max-width:820px){{.two{{grid-template-columns:minmax(0,1fr)}}}}
</style>
<div class="wrap">
<header><span class="eyebrow">Website film · for Karl's review</span>
<h1>MindMirror: see how your mind <i>works.</i></h1>
<p>A 35-second website film in MindMirror's own bright look: white and off-white, their lime and olive, Inter, the brain/M mark and the mirrored contour lines of their site. Every phrase of the voice-over gets its own visual, on one continuous stage.</p>
<p><b>The thread:</b> their mirrored figure. It starts as tangled signal beside “why”, a central scan line orders it into their pattern as MindMirror turns patterns into a picture, the areas of insight grow out of it, the guided assessment ticks through them, the card opens on its centre line into their example profile, labels are struck off a person and the figure grows back round them as context, and it carries into the logo and “Book your MindMirror Scan”.</p>
<div class="facts"><span>16:9 · 1920×1080 · 30 fps</span><span>35 s</span><span>Your voice-over (Christina)</span><span>Music + 50 sound effects</span><span>−15 LUFS</span><span>{n_frames} frames below</span></div></header>
<video src="film.mp4" controls playsinline preload="metadata" poster="{frame(6.9, 1280)}"></video>
<section style="display:grid;gap:16px"><h2>Beat by beat</h2>{''.join(beats)}</section>
<section class="two">
<div class="box"><h2>From the form</h2><ul>
<li><b>Shown, as asked:</b> the brain/M logo (revealed from its centre line), signals becoming organized, mirrored and symmetrical animation, a central scanning line, Focus, Drive, Pressure, Energy and Processing, natural strengths and higher-effort areas, an example profile, and complexity → pattern → insight.</li>
<li><b>Avoided:</b> no hospitals, doctors, MRI or glowing brains, no cyberpunk interface, no particles, no percentages or scores, no medical or mind-reading claims, nothing spiritual.</li>
<li><b>Truth:</b> the profile is their own “Alex's MindMirror”, marked “Illustrative profile” and “Example, not a result” as on their site; the charts are their illustrative visualizations, without numbers.</li>
</ul></div>
<div class="box"><h2>Motion and sound</h2><ul>
<li><b>Transitions grow out of the figure:</b> the scan line orders it, cards fly out of it and gather back, the card opens on its centre line, colour floods out of the person, the figure grows back round them.</li>
<li><b>Measured:</b> 100% of frames moving, median 1.6% of the frame in motion, no still frame, no shake.</li>
<li><b>Music:</b> “Close Up” by Michael Ramir C. (Mixkit free licence, commercial use, no credit), cut to the film: it opens up on “MindMirror”, its last hit lands on “works”.</li>
<li><b>Sound effects:</b> 50, each on its picture event; all clear the music, none crowds the voice.</li>
</ul></div></section>
<div class="box"><h2>Files</h2><ul>
<li><code>MindMirror-1080p.mp4</code>: the master, with sound.</li>
<li><code>MindMirror-web.mp4</code>: 720p with sound, for the website (the film above).</li>
<li><code>MindMirror-web-muted.mp4</code>: 720p without sound, for autoplay.</li>
</ul></div>
</div>
"""
open(os.path.join(ROOT, "storyboard", "storyboard.html"), "w").write(page)
print("storyboard/storyboard.html", len(page) // 1024, "KB,", n_frames, "frames")
