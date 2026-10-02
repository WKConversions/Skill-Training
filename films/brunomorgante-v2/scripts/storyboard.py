# Builds storyboard/storyboard.html: the finished film on top, then one frame per beat from the final render.
#   bash scripts/deliver.sh && python3 scripts/storyboard.py   (publish with files: {"film.mp4": "out/BrunoMorgante-web.mp4"})
import base64, html, os, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SECONDS = [2.6, 6.6, 9.2, 17.9, 23.4, 28.6, 33.4, 39.3, 44.0]

BEATS = [
  ("0:00–0:03.7", "Hook", "Every big project starts as one simple idea.",
   "Bruno, smiling (his own photo), and a white card: “Your next project”. The idea is typed into it: “Launch the new platform”.",
   "The card rises and sharpens; the title types out with a red caret. The camera pushes in slowly."),
  ("0:03.7–0:07.2", "Problem", "Then come the deadlines, the dependencies, and the people.",
   "Around the card, the things that tangle a project, each on its word: the deadline moved to September, a blocked data migration, a vendor contract with no owner, legal sign-off waiting, five teams with five priorities.",
   "Each card lands on its word, the pops falling in pitch as the problems pile up. Calm stone and amber, no alarm red: friction, not doom."),
  ("0:07.2–0:09.9", "Turn", "That's where Bruno Morgante comes in.",
   "The tangle clears; his portrait close-up; his name with a short red stroke (the red of the tie in his logo) and his own line: “I solve problems and deliver results.”",
   "A swell of relief as the cards fall away and the music lifts. His name rises on “Bruno”."),
  ("0:09.9–0:18.0", "Consulting", "As a consultant, he takes it from strategy to execution: the portfolio, the plan, the PMO and the team.",
   "Four words across the frame: Strategy, Portfolio, Plan, PMO & team, each with what it means. The project card travels under them.",
   "Each word turns from pale to ink on its spoken word, a select sound rising in pitch; on “team” the card turns “Delivered”."),
  ("0:18.0–0:25.1", "Coaching & Mentoring", "As a coach and mentor, he works with people one to one and in groups, from executives to university students.",
   "Bruno speaking with a client (his photo); “One to one, and in groups”; his four topics; “From executives to university students”.",
   "Push from the consulting beat; the topics land one by one after “mentor”; the range line on “executives”."),
  ("0:25.1–0:29.7", "Keynote Speaking", "And on stage, his keynotes turn hard lessons into stories that stick.",
   "Bruno on stage, graded to his warm palette; “Stories that stick”; the title of one of his real keynotes; his audience in an inset.",
   "A slow push into the photo; the keynote title on “keynotes”; the audience on “stories”."),
  ("0:29.7–0:33.8", "Proof", "Twenty years of leading projects. More than two hundred people mentored.",
   "20+ and 200+ (the numbers on his site) as the largest things on screen, and his two Thinkers360 badges.",
   "20+ counts up on “twenty”, 200+ on “two hundred”; the badges land after “mentored”."),
  ("0:33.8–0:40.0", "Social proof", "In the words of one organiser: not just a keynote speaker, a keynote experience.",
   "One real testimonial from his site, large, with its author: Grzegorz Ras, PAM Summit Kraków.",
   "The quote rises and sharpens; a red stroke underlines “keynote experience” as it is spoken."),
  ("0:40.0–0:45.8", "Call to action", "Got an idea that needs to become a result? Let's talk.",
   "His smiling photo again (the bookend), the BM logo, “Turn your ideas into results.”, the red “Let's talk” button and brunomorgante.com.",
   "The logo, line and button arrive in turn; the last piano chord lands under “Let's talk”; the address holds with a slow push."),
]

def frame(t):
    jpg = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t), "-i", os.path.join(ROOT, "out", "final.mp4"), "-frames:v", "1",
                          "-vf", "scale=1280:720", "-q:v", "4", "-f", "image2", "-c:v", "mjpeg", "-"], capture_output=True, check=True).stdout
    return "data:image/jpeg;base64," + base64.b64encode(jpg).decode()

e = html.escape
rows = "".join(f"""
<article class="beat"><img src="{frame(SECONDS[i])}" alt="Beat {i+1}: {e(b[1])}" width="1280" height="720" loading="lazy">
<div class="txt"><div class="h"><span class="n">{i+1:02d}</span><b>{e(b[1])}</b><span class="tc">{e(b[0])}</span></div>
<p class="vo">“{e(b[2])}”</p>
<dl><dt>Shown</dt><dd>{e(b[3])}</dd><dt>Motion</dt><dd>{e(b[4])}</dd></dl></div></article>""" for i, b in enumerate(BEATS))

page = f"""<title>Bruno Morgante Film</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<style>
/* His own palette on a warm light page; the film first, then the beats, then notes. */
:root{{--page:#F6F4F1;--card:#FFFFFF;--ink:#121212;--muted:#5C5954;--line:#E4E0DA;--red:#BD1717;--font:"Poppins",system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--page:#141312;--card:#1E1C1A;--ink:#F3F1EE;--muted:#B3AEA6;--line:#34312D;--red:#E0453F;color-scheme:dark}}}}
:root[data-theme="dark"]{{--page:#141312;--card:#1E1C1A;--ink:#F3F1EE;--muted:#B3AEA6;--line:#34312D;--red:#E0453F;color-scheme:dark}}
*{{box-sizing:border-box}} body{{background:var(--page);color:var(--ink);font:400 16px/1.6 var(--font);padding-inline:16px;padding-block:32px 80px;margin:0}}
.wrap{{max-width:1180px;margin:0 auto;display:grid;gap:36px}}
header{{display:grid;gap:14px}} .eyebrow{{font:600 12px/1 var(--font);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}}
h1{{font:700 clamp(32px,5vw,54px)/1.08 var(--font);letter-spacing:-.03em;margin:0;text-wrap:balance}} h1 i{{font-style:normal;border-bottom:6px solid var(--red)}}
header p{{margin:0;color:var(--muted);max-width:72ch;font-size:17px}}
.facts{{display:flex;flex-wrap:wrap;gap:8px}} .facts span{{font:600 13px/1 var(--font);padding:9px 14px;border-radius:999px;border:1px solid var(--line);background:var(--card)}}
video{{width:100%;height:auto;border-radius:16px;border:1px solid var(--line);background:#000;display:block}}
h2{{font:700 28px/1.15 var(--font);letter-spacing:-.02em;margin:0}}
.beat{{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:26px;align-items:start;padding:16px;border:1px solid var(--line);border-radius:20px;background:var(--card)}}
.beat img{{width:100%;max-width:100%;height:auto;border-radius:12px;display:block;border:1px solid var(--line)}}
.h{{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}} .n{{font:600 13px var(--font);color:var(--red);font-variant-numeric:tabular-nums}} .h b{{font:700 19px var(--font)}}
.tc{{font:500 13px var(--font);color:var(--muted);font-variant-numeric:tabular-nums}}
.vo{{font:600 19px/1.4 var(--font);margin:10px 0 12px}}
dl{{margin:0;display:grid;grid-template-columns:90px minmax(0,1fr);gap:6px 14px;font-size:15px}} dt{{color:var(--muted);font-weight:600}} dd{{margin:0}}
.box{{border:1px solid var(--line);border-radius:20px;padding:22px 26px;background:var(--card);display:grid;gap:10px}} .box ul{{margin:0;padding-left:20px;display:grid;gap:8px}}
.two{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}}
code{{font-size:.9em}}
@media (max-width:820px){{.beat,.two{{grid-template-columns:minmax(0,1fr)}} dl{{grid-template-columns:minmax(0,1fr)}} dt{{margin-top:6px}}}}
</style>
<div class="wrap">
<header><span class="eyebrow">Film v2 · for Karl's review</span>
<h1>Bruno Morgante: from one <i>idea</i> to a result</h1>
<p>A 46-second film for brunomorgante.com and LinkedIn, in the direction of the film for Emma (bfound): one idea carried through the whole film, a calm camera, clean type and real proof, closing on the logo and address. Rebranded to Bruno: a warm off-white canvas, his ink and stone, his Poppins type, the red of the tie in his logo as the one accent, and his own photos. Light, never dark.</p>
<p><b>Thesis:</b> the viewer's own next project runs through the film. It starts as one line, gets tangled in deadlines, dependencies and people, and Bruno untangles it three ways: structure as a consultant, people as a coach and mentor, conviction on stage. Bruno leads every beat, and his smiling photo is the first and the last frame.</p>
<div class="facts"><span>16:9 · 1920×1080 · 30 fps</span><span>45.8 s</span><span>Voice-over (placeholder voice)</span><span>Music + 36 sound effects</span><span>−15 LUFS</span></div></header>
<video src="film.mp4" controls playsinline preload="metadata" poster="{frame(0.5)}"></video>
<section style="display:grid;gap:16px"><h2>Beat by beat</h2>{rows}</section>
<section class="two">
<div class="box"><h2>Notes</h2><ul>
<li><b>Voice-over is a placeholder:</b> a synthetic voice (Piper “ryan”). Replace it with a recorded read, or Bruno's own voice. Every animation is keyed to the spoken words, so the picture follows a new read after it is force-aligned.</li>
<li><b>Music:</b> “Piano Reflections” (Mixkit free licence, commercial use, no credit), cut to the film: piano under the problem, the lift on “That's where Bruno Morgante comes in”, the last chord under “Let's talk”.</li>
<li><b>Sound effects:</b> 36, each on its frame, all clearing the music by 3 dB or more and none crowding the voice.</li>
<li><b>Every claim is his own:</b> 20+ years, 200+ mentees, the Thinkers360 rankings, the keynote title and the testimonial, all from his site. The project card is hypothetical and addressed to the viewer, so it claims nothing about a client.</li>
<li><b>Photos:</b> all from his website, a different one per beat (his smiling photo returns only as the bookend); no slide content or third-party logos on screen.</li>
<li><b>Measured:</b> no tells against his facts; the frames within his measured palette; every text pair at 4.5:1 contrast or better; nothing the viewer must read under 28 px.</li>
</ul></div>
<div class="box"><h2>What changed from v1</h2><ul>
<li>A person leads every beat: Bruno in the first and the last frame, his photo in five beats.</li>
<li>One idea runs through the film (the viewer's project card) instead of a new interface in every beat.</li>
<li>No fake cursor, since this plays in a feed; no “example” labels; type sized for a phone.</li>
<li>Each beat changes material (photo, type, interface, numbers), with white cards in two beats at most.</li>
<li>One quote, large, instead of a wall of quotes.</li>
</ul></div></section>
<div class="box"><h2>Files</h2><ul>
<li><code>BrunoMorgante-1080p.mp4</code>: the master, with sound.</li>
<li><code>BrunoMorgante-web.mp4</code>: 720p for the website and LinkedIn, with sound (the film above).</li>
<li><code>BrunoMorgante-web-muted.mp4</code>: 720p without sound, for autoplay on the website.</li>
</ul></div>
</div>
"""
os.makedirs(os.path.join(ROOT, "storyboard"), exist_ok=True)
open(os.path.join(ROOT, "storyboard", "storyboard.html"), "w").write(page)
print("storyboard/storyboard.html", len(page) // 1024, "KB")
