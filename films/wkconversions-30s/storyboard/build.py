# python3 storyboard/build.py "<metrics html>"  -> storyboard/storyboard.html
# Fills the storyboard page with the beat frames (out/test/fNNNN.png, rendered from the project)
# and the web encode of the film (published next to the page as film.mp4).
import base64, io, sys
from PIL import Image

BEATS = [
    dict(n=1, frame=80, tc="0:00.0–0:03.2", role="Hook · importance 1",
         vo="Your visitors give you three seconds.",
         words="“3 seconds.” and a “Visitor” label on the cursor",
         shown="A 900 px “3” fills the left third. A visitor's cursor flies in from the right on “visitors”. “seconds.” lands in blue on the spoken word.",
         motion="The “3” arrives out of depth (70% → 100%, 16 frames). The camera pushes 1.00 → 1.05 the whole time.",
         trans="“seconds.” and the visitor clear, and the “3” stays. The next camera starts 17× inside the countdown pill, its “3” matched to the pixel, and zooms out."),
    dict(n=2, frame=190, tc="0:03.2–0:07.4", role="Problem · importance 1",
         vo="Your product takes a paragraph to explain… so they scroll on.",
         words="None beyond the page itself. The countdown pill runs 3.0s → 0.0s.",
         shown="The visitor's view of a product site. The paragraph keeps extending down the page while the visitor's cursor tries to read it and the countdown runs in real time.",
         motion="A log-scale zoom out of the pill, then a slow push toward the paragraph (1.00 → 1.13). The cursor drifts along the lines, then leaves.",
         trans="On “scroll”, the page is flicked up out of frame with motion blur, and the dot grid follows with momentum."),
    dict(n=3, frame=318, tc="0:07.2–0:12.4", role="Solution (who) · importance 2",
         vo="We're WKConversions: two motion designers…",
         words="“WKConversions” pill, “Two motion designers.”, names and “Motion design” tags",
         shown="Raphael and Karl arrive as two named, blue cursors carrying their portraits, the way collaborators appear in a design tool. The statement builds bottom left, word by word on the voice.",
         motion="Cursors fly in from the left and right edges (14 frames, blurred), then keep working in the hold while the camera pushes 4%.",
         trans="On “…who turn that paragraph”, the text clears and both cursors reach up. They grab the card peeking in at the top and pull the scrolled-away paragraph back down."),
    dict(n=4, frame=440, tc="0:12.4–0:17.4", role="Solution (how) · importance 1",
         vo="…who turn that paragraph into a video people understand in seconds.",
         words="“Invoices”, “Payments”, “Reports”, “Your finance, in one place.”",
         shown="Karl clicks the paragraph. Its lines turn into shapes, the card becomes a playing video, and three lines become three tools that snap into one panel. A check lands on “understand”.",
         motion="Click → lines become bars (1-frame stagger) → card morphs to 16:9 (26 frames) → tiles fly out and dock into rows (3-frame stagger).",
         trans="The camera pulls back and reveals the same page as scene 2, now with a video hero. The countdown stops at 2.1s with a blue check and the visitor comes back and stays. Then the camera pushes through the video.", extra=470),
    dict(n=5, frame=690, tc="0:17.4–0:24.1", role="Showing something (proof) · importance 2",
         vo="ClearScaler put it simply: fast, and better than the brief.",
         words="“Made for ClearScaler” · “…fast and better than the brief.” · Magnus, Co-founder, ClearScaler",
         shown="WKConversions' real animation for ClearScaler plays full frame, then moves left to make room for Magnus's words, which build on the voice.",
         motion="The video slides and scales into the left 56% with a 4° turn toward the quote. The clip keeps playing through the hold, and the camera pushes 4.5%.",
         trans="The clip whips out left, the quote lifts away, and the logo is already writing on underneath."),
    dict(n=6, frame=880, tc="0:23.7–0:30.0", role="Outro / CTA · importance 1",
         vo="Motion design that makes it click.",
         words="The wkc mark · “Motion design that makes it click.” · Start a project → wkconversions.com",
         shown="The site's headline builds word by word and re-centers as it grows. Karl's cursor clicks “Start a project” exactly on “click”, and the button resolves into the address.",
         motion="The mark writes on from left to right. Words arrive with a small rise and blur. On the click the button compresses to 94%, rings, and swaps its label through a slot mask.",
         trans="End card: the camera keeps pushing and Karl's cursor drifts off the button to the last frame."),
]

def data_uri(path, width=1280, quality=82):
    im = Image.open(path).convert("RGB")
    im = im.resize((width, width * 9 // 16), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, "JPEG", quality=quality, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

rows = []
for b in BEATS:
    img = data_uri(f"out/test/f{b['frame']:04d}.png")
    extra = ""
    if b.get("extra"):
        extra = f'<img src="{data_uri(f"out/test/f{b["extra"]:04d}.png", 960)}" alt="Scene {b["n"]}, after the pull-back: the same page with a video hero">'
    rows.append(f'''<article class="beat" id="beat-{b['n']}">
        <figure>
          <img src="{img}" alt="Scene {b['n']} settled frame">
          {extra}
          <figcaption>Scene {b['n']} · frame {b['frame']}{f" and {b['extra']}" if b.get("extra") else ""} · from the build</figcaption>
        </figure>
        <div class="text">
          <div class="head"><h3>{b['n']}</h3><span class="tc">{b['tc']}</span><span class="role">{b['role']}</span></div>
          <p class="vo">{esc(b['vo'])}</p>
          <dl>
            <div><dt>On screen</dt><dd>{esc(b['words'])}</dd></div>
            <div><dt>Shown</dt><dd>{esc(b['shown'])}</dd></div>
            <div><dt>Motion</dt><dd>{esc(b['motion'])}</dd></div>
            <div><dt>Into next</dt><dd>{esc(b['trans'])}</dd></div>
          </dl>
        </div>
      </article>''')

src = open("storyboard/storyboard.src.html").read()
page = (src.replace("{{BEATS}}", "\n      ".join(rows))
           .replace("{{VIDEO}}", "film.mp4")
           .replace("{{POSTER}}", data_uri("out/test/f0880.png", 960, 70))
           .replace("{{METRICS}}", sys.argv[1] if len(sys.argv) > 1 else ""))
open("storyboard/storyboard.html", "w").write(page)
print(len(page) // 1024, "KB")
