# Builds storyboard/storyboard.html: the film on top, then every beat as a strip of frames from the final render.
#   bash scripts/deliver.sh && python3 scripts/storyboard.py   (publish with files: {"film.mp4": "out/Amargier-web.mp4"})
import base64, html, os, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BEATS = [
  ("Hook", "0:00", "Great partnerships start with a clear purpose.", "white", "#FFFFFF", "the mark moves to the centre", [
    (0.7, "“Great partnerships”: the long bar of their mark slides in"),
    (1.7, "The short bar leans in to meet it: two partners, one A"),
    (2.8, "“a clear purpose.” in their italic serif, underlined"),
  ]),
  ("Amargier Advisory", "0:03", "At Amargier Advisory,", "white", "#FFFFFF", "the mark lands on Málaga as a pin", [
    (3.9, "The mark moves to the centre; the name builds under it"),
    (4.5, "“Independent advisory. Connected thinking.”"),
  ]),
  ("Across EMEA", "0:04", "we help technology businesses across EMEA", "warm white", "#FAF9F6", "links draw between the businesses", [
    (5.0, "The mark lands on Málaga; warm white opens out of it"),
    (5.9, "EMEA spreads out from Málaga as a dot map"),
    (6.6, "Technology businesses light up, a wave out from Málaga"),
    (7.4, "“across EMEA.”"),
  ]),
  ("Opportunities", "0:07", "turn partnership potential into commercial opportunities.", "warm white", "#FAF9F6", "the businesses gather round a client", [
    (8.6, "“Partnership potential”: dashed links draw between them"),
    (9.6, "“potential” rolls into “Commercial”; the links turn solid"),
    (10.7, "An opportunity on every link: “opportunities.”"),
  ]),
  ("What we do", "0:11", "From go-to-market strategy and ISV ecosystems to partner recruitment, co-selling and hands-on leadership,", "pale blue", "#EEF3F8", "the hub folds away", [
    (11.8, "Pale blue opens; the businesses gather round a client's business"),
    (12.5, "Go-to-market strategy: a route out to the market"),
    (13.8, "ISV ecosystems: the businesses snap into a ring round it"),
    (15.3, "Partner recruitment: three partners join, linked in"),
    (16.3, "Co-selling: the business and a partner, into one Co-sell"),
    (17.5, "Hands-on leadership: Cédric at the centre of it"),
  ]),
  ("Thinking and doing", "0:18", "we connect the thinking with the doing.", "white", "#FFFFFF", "Cédric's photo opens out of the apex", [
    (18.5, "“We connect”: the hub folds away, white opens"),
    (19.3, "The short bar of the mark: “the thinking”"),
    (20.25, "The long bar: “the doing.”, and they connect at the apex"),
  ]),
  ("Experience", "0:20", "Backed by over twelve years of experience,", "warm white", "#FAF9F6", "the year-ticks fly up", [
    (20.9, "Cédric's photo opens out of the mark's apex"),
    (21.8, "“12+” rolls up; a tick for every year"),
    (22.75, "“years of experience.”; Cédric Amargier, Founder, Málaga"),
  ]),
  ("What comes next", "0:23", "we help you build what comes next.", "warm white", "#FAF9F6", "the mark moves up, on its own", [
    (23.6, "The photo leaves; the twelve ticks fly up"),
    (24.3, "…and lay the mark brick by brick: “Build what”"),
    (25.2, "“comes next.”: the mark complete"),
  ]),
  ("Let's talk", "0:25", "Let's talk about growth.", "white", "#FFFFFF", "end", [
    (25.95, "White opens; the mark moves up on its own, kept apart from the line"),
    (26.7, "“Let’s talk about your next move.”"),
    (27.6, "The mark resolves solid; the Let’s talk button"),
    (29.5, "Amargier Advisory · Málaga, Spain · Across EMEA"),
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

page = f"""<title>Amargier Advisory Film</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Gelasio:ital@1&display=swap">
<style>
:root{{--page:#FAF9F6;--card:#FFFFFF;--ink:#0D2139;--muted:#586574;--line:#DCE1E6;--red:#2D5F95;--font:"DM Sans",system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--page:#0B1626;--card:#122136;--ink:#EEF2F7;--muted:#A7B3C1;--line:#24344A;--red:#8FB4DE;color-scheme:dark}}}}
:root[data-theme="dark"]{{--page:#0B1626;--card:#122136;--ink:#EEF2F7;--muted:#A7B3C1;--line:#24344A;--red:#8FB4DE;color-scheme:dark}}
*{{box-sizing:border-box}} body{{background:var(--page);color:var(--ink);font:400 16px/1.6 var(--font);margin:0;padding:32px 16px 80px}}
.wrap{{max-width:1240px;margin:0 auto;display:grid;gap:34px}}
header{{display:grid;gap:14px}} .eyebrow{{font:600 12px/1 var(--font);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}}
h1{{font:500 clamp(32px,5vw,58px)/1.05 var(--font);letter-spacing:-.045em;margin:0;text-wrap:balance}} h1 i{{font-family:"Gelasio",Georgia,serif;font-style:italic;font-weight:400}}
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
<h1>Amargier Advisory: great partnerships, <i>put into practice.</i></h1>
<p>A 30-second website film in Amargier Advisory's own look: white, warm white and a pale blue field, their navy, DM Sans with the italic serif second line of their site, and their A mark. Bright throughout, with calm pacing, readable captions and restrained navy and blue, as the form asks; every phrase of the voice-over gets its own visual.</p>
<p><b>The thread:</b> their mark. Its two leaning bars meet like two partners on “partnerships”; it lands on Málaga and EMEA spreads out from it; technology businesses link up and potential turns into opportunities; they become an ISV ecosystem round a client's business as each service builds on its word, with Cédric at the centre for hands-on leadership; the bars return as the thinking and the doing; his photo opens out of the apex; twelve year-ticks lay the mark brick by brick; and the mark closes the film on its own.</p>
<div class="facts"><span>16:9 · 1920×1080 · 30 fps</span><span>30 s</span><span>Your voice-over (Christina)</span><span>Music + 49 sound effects</span><span>−15 LUFS</span><span>{n_frames} frames below</span></div></header>
<video src="film.mp4" controls playsinline preload="metadata" poster="{frame(17.5, 1280)}"></video>
<section style="display:grid;gap:16px"><h2>Beat by beat</h2>{''.join(beats)}</section>
<section class="two">
<div class="box"><h2>From the form</h2><ul>
<li><b>Shown, as asked:</b> Cédric (his own photo, natural), simple ecosystem diagrams (their hub, an ISV ring, partners), and a clear progression from strategy to partner activation and commercial opportunities.</li>
<li><b>Calm and readable:</b> one move at a time, white space, captions for every service, navy and one restrained blue.</li>
<li><b>Avoided:</b> no handshakes, no busy animation, no growth claims or numbers beyond his 12+ years, no testimonials; Oracle and EDB never appear.</li>
<li><b>The logo stays apart:</b> the mark never locks up with a title or tagline; it closes the film on its own above the line.</li>
<li><b>CTA:</b> “Let’s talk about your next move.” and a Let’s talk button with no destination, as requested.</li>
</ul></div>
<div class="box"><h2>Motion and sound</h2><ul>
<li><b>Transitions grow out of objects:</b> the mark becomes the Málaga pin, colour fields open out of the pin, the hub and the apex, the businesses become the ecosystem, the photo opens from the apex, the year-ticks become the bricks of the mark.</li>
<li><b>Measured:</b> 100% of frames moving, no still frame, no shake.</li>
<li><b>Music:</b> “Valley Sunset” by Alejandro Magaña (Mixkit free licence, commercial use, no credit), cut to the film: it opens up on “At Amargier Advisory”, its last hit lands under the close.</li>
<li><b>Sound effects:</b> 49, each on its picture event; all clear the music, none crowds the voice.</li>
<li><b>Map:</b> EMEA from Natural Earth (public domain).</li>
</ul></div></section>
<div class="box"><h2>Files</h2><ul>
<li><code>Amargier-1080p.mp4</code>: the master, with sound.</li>
<li><code>Amargier-web.mp4</code>: 720p with sound, for the website (the film above).</li>
<li><code>Amargier-web-muted.mp4</code>: 720p without sound, for autoplay.</li>
</ul></div>
</div>
"""
open(os.path.join(ROOT, "storyboard", "storyboard.html"), "w").write(page)
print("storyboard/storyboard.html", len(page) // 1024, "KB,", n_frames, "frames")
