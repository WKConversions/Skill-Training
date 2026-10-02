# Builds storyboard/storyboard.html: the film on top, then every beat as a strip of frames from the final render.
#   bash scripts/deliver.sh && python3 scripts/storyboard.py   (publish with files: {"film.mp4": "out/BrunoMorgante-web.mp4"})
import base64, html, os, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BEATS = [
  ("Hook", "0:00", "Every big project starts as one simple idea.", "paper", "#F6F4F1", "the red mark under “idea.” becomes the project card", [
    (0.8, "“Every big project”: the words build on the voice, “big” in his tie red"),
    (2.4, "“starts as one simple…”"),
    (3.2, "“idea.”: big, and the red mark sweeps under it"),
  ]),
  ("Problem", "0:03", "Then come the deadlines, the dependencies, and the people.", "paper", "#F6F4F1", "his red grows out of the card", [
    (3.9, "The mark becomes the viewer's project card; the title types itself"),
    (5.0, "Deadlines: dates struck out one by one, “30 Sep?” ringed in red"),
    (6.0, "Dependencies: cards pull in on dashed threads"),
    (7.2, "People pile on with questions; everything drifts and the card tilts"),
  ]),
  ("Turn", "0:07", "That's where Bruno Morgante comes in.", "his red", "#BD1717", "the red folds into his Consulting label", [
    (8.0, "His red grows out of the card and takes the frame"),
    (9.0, "“Bruno Morgante”, word by word; his photo lands"),
    (10.3, "The red folds into his label; his photo docks with it"),
  ]),
  ("Consulting", "0:10", "As a consultant, he takes it from strategy to execution: the portfolio, the plan, the PMO and the team.", "paper", "#F6F4F1", "coaching opens out of one person on his plan", [
    (11.8, "The tangle straightens: the cards line up"),
    (12.9, "Strategy → Execution: the axis draws, a red dot travels it"),
    (14.6, "Portfolio: the project moves up to number one"),
    (15.7, "Plan: the bars draw, Today moves through"),
    (16.6, "PMO: every status rolls to On track"),
    (17.5, "Team: the owners dock on the plan, and it's Delivered"),
  ]),
  ("Coaching & Mentoring", "0:17", "As a coach and mentor, he works with people one to one and in groups, from executives to university students.", "warm sand", "#EDE6DC", "the red line rises like a curtain", [
    (18.1, "Coaching opens out of one person on his plan"),
    (19.4, "“Coach & mentor”: a red ring draws round him"),
    (20.9, "One to one: Bruno and you"),
    (22.0, "…and in groups: one becomes five"),
    (23.8, "Executives → University students: the knob travels the range"),
  ]),
  ("Keynote speaking", "0:24", "And on stage, his keynotes turn hard lessons into stories that stick.", "the stage", "#141210", "the mark on “stick.” floods the frame", [
    (24.45, "The red line rises like a curtain onto his stage"),
    (26.4, "“On stage, his keynotes turn hard lessons…”"),
    (27.75, "“hard lessons” rolls into “stories”"),
    (28.95, "“that stick.”, and the red mark"),
  ]),
  ("Proof", "0:29", "Twenty years of leading projects. More than two hundred people mentored.", "his red", "#BD1717", "two hundred dots gather into one organiser", [
    (29.3, "The mark floods the frame red"),
    (30.6, "20+ rolls up like a counter: years of leading projects"),
    (32.7, "A third zero drops in: 200+, one dot per person"),
    (33.85, "People mentored, and his two Thinkers360 badges"),
  ]),
  ("Social proof", "0:34", "In the words of one organiser: not just a keynote speaker, a keynote experience.", "paper", "#F6F4F1", "the project card drops back in", [
    (34.6, "The dots gather into one organiser; the red closes into his photo"),
    (36.7, "His real quote builds on the voice: “Not just a keynote speaker,”"),
    (38.0, "“speaker” is struck out: “he is a keynote…”"),
    (39.1, "“experience.”, with the red mark"),
  ]),
  ("Call to action", "0:39", "Got an idea that needs to become a result? Let's talk.", "paper, then his red", "#BD1717", "end", [
    (40.2, "The viewer's project card drops back in"),
    (41.6, "Idea → Result: the arrow draws, the pill rolls to Result"),
    (42.45, "His red closes the film; his smile, his logo"),
    (44.6, "“Let's talk.” and brunomorgante.com"),
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

page = f"""<title>Bruno Morgante Film</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap">
<style>
:root{{--page:#F6F4F1;--card:#FFFFFF;--ink:#121212;--muted:#5C5954;--line:#E4E0DA;--red:#BD1717;--font:"Poppins",system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--page:#141312;--card:#1E1C1A;--ink:#F3F1EE;--muted:#B3AEA6;--line:#34312D;--red:#E0453F;color-scheme:dark}}}}
:root[data-theme="dark"]{{--page:#141312;--card:#1E1C1A;--ink:#F3F1EE;--muted:#B3AEA6;--line:#34312D;--red:#E0453F;color-scheme:dark}}
*{{box-sizing:border-box}} body{{background:var(--page);color:var(--ink);font:400 16px/1.6 var(--font);margin:0;padding:32px 16px 80px}}
.wrap{{max-width:1240px;margin:0 auto;display:grid;gap:34px}}
header{{display:grid;gap:14px}} .eyebrow{{font:600 12px/1 var(--font);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}}
h1{{font:800 clamp(32px,5vw,58px)/1.05 var(--font);letter-spacing:-.035em;margin:0;text-wrap:balance}} h1 i{{font-style:normal;background:var(--red);color:#fff;padding:0 .12em;border-radius:.08em}}
header p{{margin:0;color:var(--muted);max-width:76ch;font-size:17px}}
.facts{{display:flex;flex-wrap:wrap;gap:8px}} .facts span{{font:600 13px/1 var(--font);padding:9px 14px;border-radius:999px;border:1px solid var(--line);background:var(--card)}}
video{{width:100%;height:auto;border-radius:16px;border:1px solid var(--line);background:#000;display:block}}
h2{{font:800 30px/1.1 var(--font);letter-spacing:-.025em;margin:0}}
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
<header><span class="eyebrow">Film v3 · for Karl's review</span>
<h1>Bruno Morgante: one <i>idea</i>, all the way to a result</h1>
<p>Real motion design, not slides: one continuous stage where every phrase of your voice-over gets its own visual. Type builds word by word on the spoken words, red marks, strikes and rings point at what matters, the colour field changes with the story (paper, his red, warm sand, the stage at night), and every transition grows out of something already on screen.</p>
<p><b>The thread:</b> the viewer's own next project. The word “idea.” becomes its card, deadlines, dependencies and people tangle it, and Bruno's red takes the frame when he comes in. As a consultant he untangles it into a portfolio, a plan, green statuses and a team; as a coach he works one to one and in groups; on stage hard lessons roll into stories that stick. The numbers and one organiser's words prove it, and the idea comes back as a result.</p>
<div class="facts"><span>16:9 · 1920×1080 · 30 fps</span><span>45 s</span><span>Your voice-over (Christina)</span><span>Music + 59 sound effects</span><span>−15 LUFS</span><span>{n_frames} frames below</span></div></header>
<video src="film.mp4" controls playsinline preload="metadata" poster="{frame(9.0, 1280)}"></video>
<section style="display:grid;gap:16px"><h2>Beat by beat</h2>{''.join(beats)}</section>
<section class="two">
<div class="box"><h2>How it moves</h2><ul>
<li><b>Transitions grow out of objects:</b> a mask out of the card (his red), out of a person (coaching), out of a mark (the numbers), into a dot (the organiser); a red line rises like a curtain (the stage); words roll into other words.</li>
<li><b>Kinetic type on the voice:</b> each word rises out of a blur on its spoken word, force-aligned to your recording.</li>
<li><b>Marking:</b> the tie-red mark under key words, red strikes on moved dates and on “speaker”, a hand-drawn ring round “30 Sep?”, a red ring round him as mentor.</li>
<li><b>Camera:</b> a slow push through every beat, released on each transition; motion blur on every move. Measured: 99% of frames moving, no still longer than 0.2 s.</li>
</ul></div>
<div class="box"><h2>Sound and truth</h2><ul>
<li><b>Voice:</b> your ElevenLabs “Christina” read (42.8 s), every word force-aligned, so each animation lands on its word.</li>
<li><b>Music:</b> “Raising Me Higher” (Mixkit free licence, commercial use, no credit), cut to the film: it opens up as Bruno comes in, and its last hit lands on “experience”, ringing out under the close.</li>
<li><b>Sound effects:</b> 59, each on its picture event (pops falling in pitch as problems pile up, selects rising as each consulting stop lights, a success sound on Delivered and on Result). All clear the music; none crowds the voice.</li>
<li><b>Every claim is his:</b> 20+ years, 200+ mentored, the Thinkers360 rankings and Grzegorz Ras's quote in his own words. The project is the viewer's, hypothetical, and claims nothing about a client.</li>
</ul></div></section>
<div class="box"><h2>Files</h2><ul>
<li><code>BrunoMorgante-v3-1080p.mp4</code>: the master, with sound.</li>
<li><code>BrunoMorgante-v3-web.mp4</code>: 720p with sound, for the website and LinkedIn (the film above).</li>
<li><code>BrunoMorgante-v3-web-muted.mp4</code>: 720p without sound, for autoplay.</li>
</ul></div>
</div>
"""
open(os.path.join(ROOT, "storyboard", "storyboard.html"), "w").write(page)
print("storyboard/storyboard.html", len(page) // 1024, "KB,", n_frames, "frames")
