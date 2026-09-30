# python3 scripts/storyboard.py  -> storyboard/storyboard.html (frames pulled from out/final-raw.mp4)
import base64, subprocess, html
SRC = "out/final-raw.mp4"
BEATS = [
  (30, "Hook", "0–3 s", "This could be your next top move.", "A traveller fills the frame. She is one tile of a wall of their destinations: the camera pulls back in one move, the roll unwinding, and the wall is moving."),
  (170, "Problem", "3–6 s", "Finding a job abroad can be difficult.", "The wall slides aside for the headline, then its tiles drop away one by one; the city tiles fly down onto a map of Europe and become photo pins."),
  (420, "Problem · the questions", "6–15 s", "You may not know where to start. Where to look. Who to contact. Or how the process even works.", "Each question adds to the pile: dotted routes that wander out of You and give up, a search window pouring results, messages delivered with no reply, paperwork falling in."),
  (500, "Solution", "15–18 s", "That's where Top Jobs Abroad comes in.", "All of it collapses into one point, which opens into a white disc with the logo. The logo then flies to the corner and becomes the header."),
  (600, "Showcase · opportunities", "18–20 s", "We help you find international opportunities.", "Their real open roles sweep in on a conveyor and slow down; one lifts out: Matched to you. It is the thread for the rest of the film."),
  (640, "Showcase · interviews and questions", "20–23 s", "Prepare for interviews. Answer your questions.", "A video call opens out of the card's edge; the recruiter's briefing ticks through. The video makes room for a chat with a real question from their FAQ."),
  (770, "Showcase · support", "23–26 s", "And support you throughout the entire recruitment process.", "The page moves on to the contract: every line is highlighted and checked, then signed. Offer accepted."),
  (870, "Showcase · start to end", "26–31 s", "From the start through to the end Top Jobs Abroad is there for you.", "The page pans onto the map. A plane flies Copenhagen to Athens and their six steps light up as it passes, with the recruiter riding alongside."),
  (975, "Showcase · documents", "31–33 s", "Supporting you with the required documents", "The camera pushes into Athens; the paperwork fans out of the pin and is stamped, one card at a time."),
  (1040, "Showcase · relocation", "33–35 s", "and your relocation where needed.", "A circle opens out of the pin into Athens itself; the new apartment slides in. Welcome to Athens."),
  (1110, "Showcase · comfortable", "35–38 s", "Top Jobs Abroad made recruitment comfortable.", "A whip pan to someone at ease at work, and a verified review from their site, the stars landing one by one."),
  (1215, "Outro · free", "38–41 s", "And the best part? It's completely free.", "The review card flips; its back is a receipt that prints interviews, relocation guidance and contract negotiation at €0. The total rolls to €0 and a FREE stamp lands."),
  (1320, "Outro · logo", "41–45 s", "Top Jobs Abroad.", "Everything lifts away and the wall rises back behind the end card; the cursor clicks “I’m looking for a job”."),
]
def frame(f):
    jpg = subprocess.run(["ffmpeg","-v","error","-ss",f"{f/30:.3f}","-i",SRC,"-frames:v","1","-vf","scale=960:-1","-q:v","4","-f","image2","-c:v","mjpeg","-"],capture_output=True,check=True).stdout
    return "data:image/jpeg;base64,"+base64.b64encode(jpg).decode()
rows = "".join(f'''<article class="beat"><img src="{frame(f)}" alt="{html.escape(n)} frame" loading="lazy">
<div><div class="h"><span class="tc">{t}</span><b>{html.escape(n)}</b></div><p class="vo">“{html.escape(vo)}”</p><p class="w">{html.escape(d)}</p></div></article>''' for f,n,t,vo,d in BEATS)
page = open("scripts/storyboard.template.html").read().replace("{{ROWS}}", rows)
open("storyboard/storyboard.html","w").write(page)
print("ok", len(page))
