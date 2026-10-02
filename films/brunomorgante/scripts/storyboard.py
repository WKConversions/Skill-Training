# Builds storyboard/storyboard.html from the rendered beat frames (out/test/f*.png):
#   node scripts/stills.mjs 96,240,360,576,780,936,1104,1272,1440 && python3 scripts/storyboard.py
import base64, html, io, os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
FRAMES = [96, 240, 360, 576, 780, 936, 1104, 1272, 1440]

BEATS = [
  ("0:00–0:03.6", "Hook", "Ideas are easy. Implementation is hard.", "Ideas are easy. / Implementation is hard.",
   "An idea lands as a sticky note in one quick drop. Beside it, the plan: every bar dashed and grey, “Not started”.",
   "The note drops in 14 frames (the easy part). The cursor drags the first bar; it springs back to where it was (the hard part), on “hard”.",
   "The camera pans right; the sticky note becomes the first row of a project portfolio."),
  ("0:03.6–0:08.4", "Problem", "Projects stall, teams lose focus, and good plans stay on paper.", "none",
   "A portfolio board, one example quarter: Stalled, 6 weeks late, No owner, Still a draft, Blocked. The go-live date keeps moving.",
   "Rows rise 5 frames apart. The go-live date is struck out on each phrase: March, June, September, “October?”. Calm stone and amber, no alarm red: friction, not doom.",
   "The board slides left and shrinks; Bruno's photo slides in from the right."),
  ("0:08.4–0:12.4", "Turn", "Bruno Morgante solves problems and delivers results.", "Bruno Morgante · Consulting · Coaching & Mentoring · Keynote Speaking",
   "Bruno, smiling on stage (his own photo). His name with a short red stroke: the red of the tie in his logo, his mark through the film.",
   "As he arrives, the five statuses flip to green one by one on “solves problems and delivers results” (cause → consequence). His three services pop in as pills.",
   "The camera pushes into the board, which opens into the consulting roadmap."),
  ("0:12.4–0:19.6", "Consulting", "As a consultant, he takes you from strategy to execution: projects, portfolios, PMOs and the teams behind them.", "Consulting · From strategy to execution",
   "Portfolio priorities beside a running roadmap. The cursor lifts ERP migration to priority 1; the bars draw in; a red Today line; “All on track”.",
   "Priorities reorder on “strategy”, bars draw on “execution”, the team avatars join on “the teams behind them”.",
   "The roadmap's quarter lines slide into the day columns of a week calendar."),
  ("0:19.6–0:26.4", "Coaching & Mentoring", "As a coach and mentor, he helps people grow in leadership, communication and career, from executives to students.", "Coaching & Mentoring · From executives to students",
   "Bruno's week: 1:1 sessions from Monday to Friday, each with who and what: Executive · Leadership, Senior manager · Communication, Project manager · Career, a group session, University student · Personal growth.",
   "Each session lands on its word (leadership, communication, career), the student last, on “students”. A slow push across the week.",
   "Friday's card grows and its frame becomes the stage photo."),
  ("0:26.4–0:31.6", "Keynote Speaking", "And on stage, his keynotes turn hard lessons into stories that stick.", "Keynote Speaking · Stories that stick",
   "Bruno on a bright stage (his photo), the title of one of his real keynotes, and his audience in a small inset.",
   "A slow push into the photo; the talk card rises on “keynotes”; the audience inset on “stick”.",
   "The photo slides out left; the first number starts counting."),
  ("0:31.6–0:37.2", "Proof", "Twenty years of leading projects. More than two hundred people mentored.", "20+ · 200+ · Thinkers360 Top 25 Coaching, Top 10 Project Management",
   "The two numbers he states on his site, as the largest things on screen, and his two Thinkers360 badges.",
   "20+ counts up on “twenty years”, 200+ on “two hundred”; the badges drop in after, unspoken.",
   "200+ settles; a quote card rises over it."),
  ("0:37.2–0:42.8", "Social proof", "Or, as one organiser put it: not just a keynote speaker, a keynote experience.", "Bruno is not just a keynote speaker, he is a keynote experience. Grzegorz Ras, PAM Summit 2025 Kraków",
   "One real testimonial from his site, large, with the author's photo; two more real quotes faint behind it.",
   "The card rises; a red stroke underlines “keynote experience” as it is spoken.",
   "The card folds into the logo tile."),
  ("0:42.8–0:48.5", "Call to action", "Ready to turn your ideas into results? Let's talk. brunomorgante.com", "Turn your ideas into results. · Let's talk · brunomorgante.com",
   "His BM logo, the line that answers the hook, the red “Let's talk” button and his address.",
   "The cursor presses “Let's talk” on “let's talk”; the address holds to the end with a slow push.",
   "End."),
]

def frame(n):
    im = Image.open(os.path.join(ROOT, "out", "test", f"f{n:04d}.png")).convert("RGB").resize((1280, 720), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "JPEG", quality=84)
    return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()

e = html.escape
rows = "".join(f"""
<article class="beat"><img src="{frame(FRAMES[i])}" alt="Beat {i+1}: {e(b[1])}" width="1280" height="720">
<div class="txt"><div class="h"><span class="n">{i+1:02d}</span><b>{e(b[1])}</b><span class="tc">{e(b[0])}</span></div>
<p class="vo">“{e(b[2])}”</p>
<dl><dt>On screen</dt><dd>{e(b[3])}</dd><dt>Shown</dt><dd>{e(b[4])}</dd><dt>Motion</dt><dd>{e(b[5])}</dd><dt>Into the next</dt><dd>{e(b[6])}</dd></dl></div></article>""" for i, b in enumerate(BEATS))

page = f"""<title>Bruno Morgante Film</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<style>
/* Layout: his own palette on a warm light page; the frames first, beat by beat, then notes and questions. */
:root{{--page:#F6F4F1;--card:#FFFFFF;--ink:#121212;--muted:#5C5954;--line:#E4E0DA;--red:#BD1717;--soft:#EEEAE4;--font:"Poppins",system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--page:#141312;--card:#1E1C1A;--ink:#F3F1EE;--muted:#B3AEA6;--line:#34312D;--red:#E0453F;--soft:#262421;color-scheme:dark}}}}
:root[data-theme="dark"]{{--page:#141312;--card:#1E1C1A;--ink:#F3F1EE;--muted:#B3AEA6;--line:#34312D;--red:#E0453F;--soft:#262421;color-scheme:dark}}
*{{box-sizing:border-box}} body{{background:var(--page);color:var(--ink);font:400 16px/1.6 var(--font);padding-inline:20px;padding-block:32px 80px}}
.wrap{{max-width:1180px;margin:0 auto;display:grid;gap:36px}}
header{{display:grid;gap:14px}} .eyebrow{{font:600 12px/1 var(--font);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}}
h1{{font:700 clamp(32px,5vw,54px)/1.08 var(--font);letter-spacing:-.03em;margin:0;text-wrap:balance}} h1 i{{font-style:normal;border-bottom:6px solid var(--red)}}
header p{{margin:0;color:var(--muted);max-width:70ch;font-size:17px}}
.facts{{display:flex;flex-wrap:wrap;gap:8px}} .facts span{{font:600 13px/1 var(--font);padding:9px 14px;border-radius:999px;border:1px solid var(--line);background:var(--card)}}
h2{{font:700 28px/1.15 var(--font);letter-spacing:-.02em;margin:0}}
.beat{{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:26px;align-items:start;padding:16px;border:1px solid var(--line);border-radius:20px;background:var(--card)}}
.beat img{{width:100%;max-width:100%;height:auto;border-radius:12px;display:block;border:1px solid var(--line)}}
.h{{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}} .n{{font:600 13px var(--font);color:var(--red);font-variant-numeric:tabular-nums}} .h b{{font:700 19px var(--font)}}
.tc{{font:500 13px var(--font);color:var(--muted);font-variant-numeric:tabular-nums}}
.vo{{font:600 19px/1.4 var(--font);margin:10px 0 12px}}
dl{{margin:0;display:grid;grid-template-columns:110px minmax(0,1fr);gap:6px 14px;font-size:15px}} dt{{color:var(--muted);font-weight:600}} dd{{margin:0}}
.box{{border:1px solid var(--line);border-radius:20px;padding:22px 26px;background:var(--card);display:grid;gap:10px}} .box ul{{margin:0;padding-left:20px;display:grid;gap:8px}}
.two{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}}
details summary{{cursor:pointer;font-weight:600}} table{{border-collapse:collapse;width:100%;font-size:14px}} td,th{{border-bottom:1px solid var(--line);padding:7px 8px;text-align:left;vertical-align:top}}
.tbl{{overflow-x:auto}}
@media (max-width:820px){{.beat,.two{{grid-template-columns:minmax(0,1fr)}} dl{{grid-template-columns:minmax(0,1fr)}} dt{{margin-top:6px}}}}
</style>
<div class="wrap">
<header><span class="eyebrow">Storyboard · for Karl's approval</span>
<h1>Bruno Morgante: from <i>ideas</i> to results</h1>
<p>A film for brunomorgante.com and LinkedIn, in the direction of the film for Emma (bfound): a light, airy canvas, rebuilt work interfaces with a cursor, numbers that count and real proof, closing on the logo and address. Rebranded to Bruno: his black, white and warm stone, his Poppins type, and the red of the tie in his logo as the one accent. Warm and light, never dark.</p>
<div class="facts"><span>16:9 · 1920×1080 · 30 fps</span><span>≈ 48 s</span><span>Voice-over (script below, 2.5 words/s)</span><span>Music + sound effects</span><span>Frames rendered from the build</span></div></header>
<section style="display:grid;gap:16px"><h2>Beat by beat</h2>{rows}</section>
<section class="two">
<div class="box"><h2>Notes</h2><ul>
<li><b>Script by WKC:</b> Bruno gave no script, so it is written from his site and his message. Every claim is his own: 20+ years, 200+ mentees, the Thinkers360 rankings, the keynote title, the testimonials. Nothing is invented.</li>
<li><b>The hook</b> uses his own line from his About page: “Ideas are easy. Implementation is hard.” The end card answers it: “Turn your ideas into results.”</li>
<li><b>The portfolio and calendar are examples</b> (marked “example” on screen), showing what he does, not a client's real data.</li>
<li><b>Photos:</b> all from his website (stage photos, audience, badges). The testimonial photos appear only with their own quotes, as on his site.</li>
<li><b>Not dark:</b> his site is mostly black sections; the film keeps his colours on a warm light canvas, with the black used for type and one dark card.</li>
<li><b>From the reference</b> (Emma's film, measured: 93% of frames moving, median 2.4% in motion, longest still 0.87 s): the light canvas, the rebuilt interfaces with a cursor, counting numbers, social proof, the logo end card. Not taken: its lavender and blue, its LinkedIn screens and its layouts. Our target is the standard for a confident brief: 95% moving, 1.5% median, nothing still over 0.8 s.</li>
</ul></div>
<div class="box"><h2>Questions for Bruno</h2><ul>
<li><b>Voice:</b> a professional voice-over (which voice, male or female?), or Bruno's own voice? His own voice would suit a speaker.</li>
<li><b>Mantegora:</b> he works through his company Mantegora. Name it in the film, or only Bruno Morgante?</li>
<li><b>Call to action:</b> “Let's talk” to brunomorgante.com, or a booking or contact page?</li>
<li><b>Format:</b> 16:9 for the website and LinkedIn. Add a 1:1 or 4:5 cut for the LinkedIn feed?</li>
<li><b>Music:</b> warm and confident, low under the voice (found or composed to the cut).</li>
</ul></div></section>
<div class="box"><details><summary>Appendix: beat sheet and variety check</summary><div class="tbl"><table>
<tr><th>#</th><th>Beat type</th><th>Strategy (runner-up)</th><th>Composition</th><th>Material</th></tr>
<tr><td>1</td><td>Hook</td><td>Statement + the plan that won't move (an idea pinned on a board)</td><td>Split: type left, UI right</td><td>Type, UI</td></tr>
<tr><td>2</td><td>Problem</td><td>The portfolio, stuck (a slipping calendar)</td><td>One centred card</td><td>UI</td></tr>
<tr><td>3</td><td>Turn</td><td>Bruno arrives and the statuses turn (name card only)</td><td>Photo right, type left</td><td>Photo, UI, type</td></tr>
<tr><td>4</td><td>Process / feature</td><td>Priorities to roadmap (a single Gantt)</td><td>Two panels, full width</td><td>UI</td></tr>
<tr><td>5</td><td>Range</td><td>A week of sessions, exec to student (a ladder of roles)</td><td>Full-width grid</td><td>UI</td></tr>
<tr><td>6</td><td>Emotional</td><td>On stage, full bleed (audience grid)</td><td>Photo full bleed, card left</td><td>Photo</td></tr>
<tr><td>7</td><td>Number / proof</td><td>Two numbers as the largest things (counter in a card)</td><td>Two giant numbers</td><td>Type, badges</td></tr>
<tr><td>8</td><td>Proof</td><td>One real quote, large (a wall of quotes)</td><td>One centred card</td><td>Quote, photo</td></tr>
<tr><td>9</td><td>CTA</td><td>Logo, answer line, button (logo only)</td><td>Centred statement</td><td>Logo, type</td></tr>
</table></div></details></div>
</div>
"""
os.makedirs(os.path.join(ROOT, "storyboard"), exist_ok=True)
open(os.path.join(ROOT, "storyboard", "storyboard.html"), "w").write(page)
print("storyboard/storyboard.html", len(page) // 1024, "KB")
