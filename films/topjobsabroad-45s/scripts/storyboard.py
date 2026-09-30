# python3 scripts/storyboard.py  -> storyboard/storyboard.html (frames pulled from out/final-raw.mp4)
import base64, subprocess, html
SRC = "out/final-raw.mp4"
BEATS = [
  (60, "Hook", "0–3 s", "This could be your next top move.", "Madrid at sunset under their navy gradient, the headline in Playfair with the second line in gold."),
  (360, "Problem", "3–15 s", "Finding a job abroad can be difficult. You may not know where to start. Where to look. Who to contact. Or how the process even works.", "The photo shrinks into one of eight city cards (all places they recruit for). The cards scatter with gold question marks, and each question lands with its line."),
  (505, "Solution", "15–18 s", "That's where Top Jobs Abroad comes in.", "The cities fall into order and dim, and the logo arrives over them."),
  (740, "Showcase · what they do", "18–27 s", "We help you find international opportunities. Prepare for interviews. Answer your questions. And support you throughout the entire recruitment process.", "Their checklist ticks through the four services, each shown with proof: three of their real open roles (one matched to you), their interview briefing, a question from their FAQ answered, and a progress tracker."),
  (990, "Showcase · start to end", "27–35 s", "From the start through to the end Top Jobs Abroad is there for you. Supporting you with the required documents and your relocation where needed.", "Their six steps fill in gold from Share Your Story to Settle In, then documents and relocation tick off over Lisbon."),
  (1100, "Showcase · comfortable", "35–38 s", "Top Jobs Abroad made recruitment comfortable.", "A verified review from their site: “I felt well taken care of from start to finish.”"),
  (1190, "Outro · free", "38–41 s", "And the best part? It's completely free.", "“free.” in gold, with the fine print from their site: 100% free for candidates, employers pay the placement fee."),
  (1320, "Outro · logo", "41–45 s", "Top Jobs Abroad.", "Madrid grows back to full frame; the logo, their gold “I’m looking for a job” button and topjobsabroad.com."),
]
def frame(f):
    jpg = subprocess.run(["ffmpeg","-v","error","-ss",f"{f/30:.3f}","-i",SRC,"-frames:v","1","-vf","scale=960:-1","-q:v","4","-f","image2","-c:v","mjpeg","-"],capture_output=True,check=True).stdout
    return "data:image/jpeg;base64,"+base64.b64encode(jpg).decode()
rows = "".join(f'''<article class="beat"><img src="{frame(f)}" alt="{html.escape(n)} frame" loading="lazy">
<div><div class="h"><span class="tc">{t}</span><b>{html.escape(n)}</b></div><p class="vo">“{html.escape(vo)}”</p><p class="w">{html.escape(d)}</p></div></article>''' for f,n,t,vo,d in BEATS)
page = open("scripts/storyboard.template.html").read().replace("{{ROWS}}", rows)
open("storyboard/storyboard.html","w").write(page)
print("ok", len(page))
