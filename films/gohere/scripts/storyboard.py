# python3 scripts/storyboard.py  -> storyboard/storyboard.html (frames pulled from out/final-raw.mp4)
import base64, subprocess, html
SRC = "out/final-raw.mp4"
BEATS = [
  (40, "Hook", "0–3 s", "What if your visitors had your own app in their pocket?", "A visitor, phone in hand, in a sunny square. The camera pushes into her phone."),
  (225, "Problem", "3–9 s", "Today, your best places are spread across websites, brochures and conversations.", "Their best places drift in as loose photos, then a website, a folded brochure and chat messages, each on its word."),
  (330, "Solution", "9–12 s", "GoHere brings them together in your own branded app.", "The pieces are pulled into one phone: the app, in your brand."),
  (440, "Your brand", "12–15 s", "Your name. Your logo. Your colors.", "The app becomes four real GoHere apps, word by word: first their names, then their logos, then their colours. Terschelling Tips, Transavia Tips, Ciao Tutti, BarcelonaTips."),
  (500, "Homepage", "15–17 s", "You choose what appears on the homepage.", "A tile type from the portal's own list is picked; the homepage makes room for the new tile."),
  (612, "Map", "17–21 s", "Visitors explore places on the map, open a location,", "The map tab, pins dropping onto central Rome, a pin tapped and the place card rising."),
  (730, "Tip page", "21–25 s", "and instantly see photos, opening hours and directions.", "The camera eases in on the tip page: photos swipe on “photos”, the hours light up on “opening hours”, Route draws the walk on “directions”."),
  (815, "Bucket list", "25–27 s", "They can save places in bucket lists and share them.", "The heart, the bucket list with the new place on top, the share sheet."),
  (885, "Portal", "27–31 s", "You manage the app yourself through the GoHere portal.", "The real portal: its Home page lists the homepage tiles. ↑ moves Hidden gems up, and the phone updates live."),
  (1080, "Call to action", "31–37 s", "Want to see your own app? Get a free preview at gohere.app.", "The GoHere logo, “Get your free preview”, gohere.app, and four apps already built with GoHere."),
]
def frame(f):
    jpg = subprocess.run(["ffmpeg","-v","error","-ss",f"{f/30:.3f}","-i",SRC,"-frames:v","1","-vf","scale=960:-1","-q:v","4","-f","image2","-c:v","mjpeg","-"],capture_output=True,check=True).stdout
    return "data:image/jpeg;base64,"+base64.b64encode(jpg).decode()
rows = "".join(f'''<article class="beat"><img src="{frame(f)}" alt="{html.escape(n)} frame" loading="lazy">
<div><div class="h"><span class="tc">{t}</span><b>{html.escape(n)}</b></div><p class="vo">“{html.escape(vo)}”</p><p class="w">{html.escape(d)}</p></div></article>''' for f,n,t,vo,d in BEATS)
page = open("scripts/storyboard.template.html").read().replace("{{ROWS}}", rows)
open("storyboard/storyboard.html","w").write(page)
print("ok", len(page))
