# Builds storyboard/storyboard.html: the film on top, then every beat as a strip of frames from the final render.
#   bash scripts/deliver.sh && python3 scripts/storyboard.py   (publish with files: {"film.mp4": "out/Zapify-web.mp4"})
import base64, html, os, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BEATS = [
  ("Hook", "0:00", "Turn every Instagram interaction into momentum.", "white", "#FFFFFF", "the interactions spiral into the logo", [
    (0.6, "“Turn every”: hearts, comments, shares and Story rings pop in around the line"),
    (1.6, "“interaction” in a black block, the tilted word block of their hero"),
    (2.6, "“into momentum.”, underlined in gold"),
    (3.25, "The interactions peel off and spiral, faster and faster, into one point"),
  ]),
  ("With Zapify", "0:03", "With Zapify,", "white, a yellow glow", "#FEF9C3", "the logo rides to the corner, like their nav", [
    (3.75, "Their speech bubble opens out of the spiral"),
    (4.2, "The bolt drops in; a gold ring; “Zapify”"),
  ]),
  ("Comments, DMs, Story replies", "0:04", "comments, DMs and story replies", "white", "#FFFFFF", "the bolt zaps across all three", [
    (4.95, "Comments: a post that says Comment “LINK”, and the comments arrive"),
    (5.7, "DMs: the inbox fills, sarah.styles, mike.reviews, jess.fitness, alex.travels"),
    (6.75, "Story replies: a Story with fire reactions rising off it"),
  ]),
  ("Instantly automated", "0:07", "can instantly become automated conversations.", "white", "#FFFFFF", "the three cards merge into one phone", [
    (7.55, "“Instantly”: the bolt zaps across the three cards"),
    (8.45, "Each one stamped Automated; “automated.” marked in yellow"),
    (9.3, "They merge into one phone: their hero chat, Send the Link, Follow Profile"),
  ]),
  ("Send links", "0:10", "Send links the moment someone asks.", "lavender", "#DDD6FF", "the peach field opens out of the phone", [
    (10.4, "Lavender opens out of the phone; it slides left: “Send links”, Mike asks"),
    (11.4, "“the moment someone…”: the reply is already typing"),
    (12.05, "“asks.”: the Canon R50 link card, and Mike adds it to his cart"),
  ]),
  ("Capture emails", "0:12", "Capture emails directly through Instagram.", "peach", "#FFD7A8", "the pink field", [
    (12.75, "Peach: Jess wants the free meal plan; “Capture emails”"),
    (13.5, "Her address types in, in the DM: “directly”"),
    (14.4, "“through Instagram.”: it flies into the Subscribers list"),
  ]),
  ("Respond to comments", "0:14", "Respond to comments automatically.", "pink", "#FCCEE8", "the mint field", [
    (15.3, "Pink: the post fills with comments, each ticked DM sent"),
    (16.3, "“automatically.”: Sarah's DM with Shop the Look lands beside the phone"),
  ]),
  ("Story reactions", "0:17", "And turn story reactions into real engagement.", "mint", "#A4F4CF", "the phone leaves; the page white", [
    (18.1, "Mint: the Story, and the fire reactions rise"),
    (19.2, "“Story reactions” rolls to “Real engagement.”; Alex's chat"),
    (20.3, "The Bali Travel Guide link; “engagement.” marked"),
  ]),
  ("Creators, brands, agencies", "0:21", "Whether you're a creator, brand or agency,", "page white", "#FAFAFA", "the headline rolls", [
    (21.6, "“Whether you’re a…”: the Creators card"),
    (22.4, "Brands"),
    (23.3, "Agencies"),
  ]),
  ("Responsive", "0:24", "Zapify helps you stay responsive and keep opportunities moving.", "page white", "#FAFAFA", "the copy-paste stack", [
    (24.6, "A new message pings each card, and the bolt answers: Replied"),
    (25.5, "“Stay responsive.”, marked"),
    (26.6, "“Keep opportunities moving.”: leads, clicks and subscribers stream off along a gold track"),
  ]),
  ("Less manual", "0:28", "Less manual messaging.", "page white", "#FAFAFA", "the yellow field opens out of the last bubble", [
    (28.0, "A stack of “Here’s the link! (copy, paste)” bubbles; “Less manual”"),
    (28.5, "“manual” struck out, and the bubbles"),
    (29.1, "They collapse into one, and their yellow opens out of it"),
  ]),
  ("More conversations", "0:29", "More conversations working for you every day.", "their yellow", "#FDE047", "the white field; the logo returns", [
    (29.9, "“More conversations”, on their yellow"),
    (30.9, "“working for you”: Monday to Sunday fills with conversations"),
    (31.9, "“every day.”, underlined"),
  ]),
  ("Sign-off", "0:32", "Zapify. Automate your Instagram DMs and grow on autopilot.", "white", "#FFFFFF", "end", [
    (32.9, "White opens; the logo returns to the centre; “Zapify”"),
    (34.6, "“Automate your Instagram DMs”"),
    (35.7, "“and grow on…”: the opening’s interactions return and circle the card"),
    (37.5, "“autopilot.” marked; Start free; No credit card required · Cancel anytime"),
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

page = f"""<title>Zapify Film</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap">
<style>
:root{{--page:#FAFAFA;--card:#FFFFFF;--ink:#0A0A0A;--muted:#5F6368;--line:#E5E5E5;--acc:#B45309;--yel:#FDE047;--font:"Geist",system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--page:#0B0B0C;--card:#161618;--ink:#F5F5F5;--muted:#A1A1AA;--line:#27272A;--acc:#FBBF24;color-scheme:dark}}}}
:root[data-theme="dark"]{{--page:#0B0B0C;--card:#161618;--ink:#F5F5F5;--muted:#A1A1AA;--line:#27272A;--acc:#FBBF24;color-scheme:dark}}
*{{box-sizing:border-box}} body{{background:var(--page);color:var(--ink);font:400 16px/1.6 var(--font);margin:0;padding:32px 16px 80px}}
.wrap{{max-width:1240px;margin:0 auto;display:grid;gap:34px}}
header{{display:grid;gap:14px}} .eyebrow{{font:600 12px/1 var(--font);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}}
h1{{font:800 clamp(32px,5vw,60px)/1.02 var(--font);letter-spacing:-.045em;margin:0;text-wrap:balance}}
h1 mark{{background:var(--yel);color:#0A0A0A;padding:0 .12em;border-radius:.1em}}
header p{{margin:0;color:var(--muted);max-width:76ch;font-size:17px}} header p b{{color:var(--ink)}}
.facts{{display:flex;flex-wrap:wrap;gap:8px}} .facts span{{font:600 13px/1 var(--font);padding:9px 14px;border-radius:999px;border:1px solid var(--line);background:var(--card)}}
video{{width:100%;height:auto;border-radius:16px;border:1px solid var(--line);background:#000;display:block}}
h2{{font:800 30px/1.1 var(--font);letter-spacing:-.035em;margin:0}}
.beat{{border:1px solid var(--line);border-radius:20px;background:var(--card);padding:18px;display:grid;gap:10px}}
.bh{{display:flex;gap:12px;align-items:center;flex-wrap:wrap}} .n{{font:800 13px var(--font);color:var(--acc);font-variant-numeric:tabular-nums}} .bh b{{font:800 20px var(--font)}}
.tc{{font:500 13px var(--font);color:var(--muted);font-variant-numeric:tabular-nums}} .sw{{width:18px;height:18px;border-radius:6px;border:1px solid var(--line)}}
.vo{{font:600 19px/1.4 var(--font);margin:0}}
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
<h1>Zapify: every interaction, <mark>on autopilot.</mark></h1>
<p>A 39-second website film in Zapify's own look: white, black heavy Geist type, their gold-to-yellow gradient, their full yellow section, pastel fields and coloured chips, the black tilted word block of their hero, and their logo. Bright throughout, and every phrase of the voice-over gets its own visual.</p>
<p><b>The thread:</b> their logo. The opening's interactions spiral into it; its bolt zaps across a post, the inbox and a Story and turns each into an automated conversation; one phone then carries Zapify's own four example chats from their use-case pages, each in a colour field that opens out of the phone; the bolt answers creators, brands and agencies; manual copy-paste is struck out and collapses into their yellow; and at the close the opening's interactions circle the logo on their own, on autopilot.</p>
<div class="facts"><span>16:9 · 1920×1080 · 30 fps</span><span>39.5 s</span><span>Your voice-over</span><span>Music + 72 sound effects</span><span>−15 LUFS</span><span>{n_frames} frames below</span></div></header>
<video src="film.mp4" controls playsinline preload="metadata" poster="{frame(16.3, 1280)}"></video>
<section style="display:grid;gap:16px"><h2>Phrase by phrase</h2>{''.join(beats)}</section>
<section class="two">
<div class="box"><h2>From their site</h2><ul>
<li><b>Their examples, not invented ones:</b> the Comment “LINK” post and its comments, the hero DM flow, and the chats of mike.reviews, jess.fitness, sarah.styles and alex.travels come from zapify.pro and its use-case pages.</li>
<li><b>Their words:</b> the feature chips (Link Delivery, Email Collection, Comment to DM, Story Automation), Creators · Brands · Agencies, Start free, No credit card required · Cancel anytime.</li>
<li><b>Left out:</b> the site's big numbers (DMs sent, users), because the script doesn't say them, and the free tools pages.</li>
<li><b>Illustrative:</b> @yourcreator, @yourbrand, @youragency, the week of conversations and the opportunity labels (all things their dashboard tracks); they claim no numbers.</li>
</ul></div>
<div class="box"><h2>Motion and sound</h2><ul>
<li><b>Transitions grow out of objects:</b> the interactions become the logo, the bolt turns the sources into automated conversations, the cards merge into the phone, every colour field opens out of the phone, the last copy-paste bubble opens their yellow, the logo comes back for the sign-off.</li>
<li><b>Measured on the draft:</b> 25 of 25 phrases bring a new visual, with no voice over a held frame; 98% of frames moving.</li>
<li><b>Music:</b> “Tech House vibes” by Alejandro Magaña (Mixkit free licence, commercial use, no credit), cut to the film: it opens up on “With Zapify”, its last hit lands on “autopilot”.</li>
<li><b>Sound effects:</b> 72, each on its picture event, none crowding the voice.</li>
</ul></div></section>
<div class="box"><h2>Files</h2><ul>
<li><code>Zapify-1080p.mp4</code>: the master, with sound.</li>
<li><code>Zapify-web.mp4</code>: 720p with sound, for the website (the film above).</li>
<li><code>Zapify-web-muted.mp4</code>: 720p without sound, for autoplay.</li>
</ul></div>
</div>
"""
open(os.path.join(ROOT, "storyboard", "storyboard.html"), "w").write(page)
print("storyboard/storyboard.html", len(page) // 1024, "KB,", n_frames, "frames")
