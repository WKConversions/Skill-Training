# Writes sound/cues.json from the film's own labels (src/words.json + the beat labels in src/clock.ts), so every
# effect lands on its picture event and a re-timed voice-over moves the sound with the picture.
#   python3 scripts/cues.py && python3 ../../library/scripts/sound_mix.py sound/cues.json public/audio/mix.wav --sheet out/mix.png
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
clock = open(os.path.join(ROOT, "src", "clock.ts")).read()
L = {k: float(v) for k, v in re.findall(r"(\w+): ([\d.]+)", clock[clock.index("timeline(30, {"):clock.index("...WORDS")])}
L.update(json.load(open(os.path.join(ROOT, "src", "words.json"))))
FPS = 30
f = lambda label, d=0.0: round((L[label] + d) * FPS)

S = []
def cue(id, label, d=0.0, db=None, pitch=None, note=""):
    c = {"frame": max(0, f(label, d)), "id": id, "note": note}
    if db is not None: c["db"] = db
    if pitch: c["pitch"] = pitch
    S.append(c)

# 1 turn every Instagram interaction into momentum: the interactions pop in, then spiral into the logo's point
for i in range(4): cue("soundreality-ui-pop-up", "w:every", -0.1 + 0.075 * 3 * i, -8, [0, 2, 4, 7][i], f"interactions pop in ({i + 1})")
cue("soundshelfstudio-ui-swipe-confirm", "w:interaction", 0.0, -5, note="the black block wipes on behind 'interaction'")
cue("soundshelfstudio-ui-swipe-confirm", "w:momentum", 0.25, -7, 2, "the underline under 'momentum.'")
cue("gen-riser-1s", "w:momentum", 0.2, -8, note="the stream accelerates into a spiral")
# 2 with Zapify: the bubble builds, the bolt drops in
cue("gen-shimmer", "w:with", -0.1, -5, note="the bubble opens out of the stream")
cue("gen-impact-soft", "w:zapify", 0.05, -4, note="the bolt lands")
# 3 comments, DMs and story replies
cue("gen-whoosh-medium", "sources", 0.05, -6, note="the logo goes to the corner")
for i in range(3): cue("universfield-bubble-pop-03", "w:comments", 0.1 + 0.18 * i, -9, [0, 2, 4][i], f"comment {i + 1}")
cue("gen-whoosh-short", "w:dms", -0.12, -7, 2, "the inbox card")
cue("gen-whoosh-short", "w:story", -0.12, -7, 4, "the Story card")
cue("soundreality-ui-bubble", "w:replies", 0.0, -7, note="the fire reactions rise")
# 4 can instantly become automated conversations
cue("gen-whoosh-whip", "w:instantly", -0.05, -3, note="the bolt zaps across all three")
for i in range(3): cue("soundshelfstudio-ui-success-bloom" if i == 2 else "ui-pop-sound", "w:instantly", 0.35 + 0.18 * i, -7, [0, 3, 0][i], f"Automated pill {i + 1}")
cue("soundshelfstudio-ui-swipe-confirm", "w:automated", 0.2, -7, note="the mark under 'automated.'")
cue("gen-whoosh-medium", "w:conversations", -0.15, -4, note="the cards merge into the phone")
# 5 send links the moment someone asks
cue("gen-whoosh-deep", "links", -0.05, -5, note="the lavender field opens from the phone; the phone slides left")
cue("universfield-bubble-pop-03", "w:send", 0.05, -8, note="Mike asks")
cue("ui-pop-sound", "w:asks", 0.12, -6, note="the reply")
cue("soundshelfstudio-ui-soft-glass-ping", "w:asks", 0.35, -6, note="the link card")
# 6 capture emails directly through Instagram
cue("gen-whoosh-deep", "emails", -0.05, -6, 2, "the peach field")
cue("universfield-bubble-pop-03", "w:capture", -0.05, -8, note="Jess asks for the meal plan")
cue("ui-pop-sound", "w:emails", 0.0, -7, note="the reply asks for her email")
cue("gen-whoosh-short", "w:through", -0.05, -6, note="the address flies into Subscribers")
cue("soundshelfstudio-ui-success-bloom", "w:through", 0.55, -6, note="it lands in the list")
# 7 respond to comments automatically
cue("gen-whoosh-deep", "comments", -0.05, -6, 4, "the pink field; the post")
for i in range(3): cue("floraphonic-ui-pop-up-15", "w:comments2", 0.0 + 0.25 * i, -8, [0, 3, 7][i], f"DM sent tick {i + 1}")
cue("universfield-new-notification-04", "w:comments2", 0.05, -8, note="the reply DM lands beside the phone")
cue("soundshelfstudio-ui-swipe-confirm", "w:automatically", 0.15, -7, note="the mark under 'automatically.'")
# 8 and turn story reactions into real engagement
cue("gen-whoosh-deep", "story", -0.05, -6, 5, "the mint field; the Story")
cue("soundreality-ui-bubble", "w:reactions", 0.0, -7, 3, "fire reactions")
cue("gen-whoosh-short", "w:into2", -0.05, -7, note="'Story reactions' rolls to 'Real engagement.'")
cue("ui-pop-sound", "w:into2", 0.3, -7, note="Alex's reply")
cue("soundshelfstudio-ui-soft-glass-ping", "w:engagement", 0.1, -6, note="the travel guide link")
# 9 whether you're a creator, brand or agency
cue("gen-whoosh-medium", "who", 0.0, -5, note="the phone leaves; the white page")
for i, w in enumerate(["w:creator", "w:brand", "w:agency"]): cue("ui-pop-sound", w, -0.1, -6, [0, 3, 7][i], f"audience card {i + 1}")
# 10 Zapify helps you stay responsive and keep opportunities moving
cue("gen-whoosh-short", "w:zapify2", -0.1, -7, note="the headline rolls")
for i in range(3):
    cue("soundshelfstudio-ui-radio-select", "w:helps", i * 0.18 + 0.25, -9, [0, 2, 4][i], f"card {i + 1} replies")
cue("soundshelfstudio-ui-swipe-confirm", "w:responsive", 0.15, -7, note="the mark under 'responsive.'")
for n in range(0, 5, 2): cue("floraphonic-ui-pop-up-15", "w:keep", n * 0.22 + 0.1, -8, [0, 2, 4, 5, 7][n], f"opportunity {n + 1} joins the stream")
cue("gen-swell", "w:moving", -0.1, -8, note="the stream runs off the frame")
# 11 less manual messaging
cue("floraphonic-multi-pop-2", "less", 0.05, -8, note="the copy-paste bubbles stack up")
cue("soundshelfstudio-ui-swipe-confirm", "w:manual", 0.12, -5, -3, "'manual' struck out")
cue("gen-whoosh-short", "w:messaging", 0.15, -6, -2, "the stack collapses into one")
# 12 more conversations working for you every day
cue("gen-whoosh-deep", "more", -0.1, -4, note="the yellow field opens out of the last bubble")
cue("gen-impact-soft", "w:more", 0.0, -9, note="'More'")
for i in range(0, 7, 2): cue("soundreality-ui-pop-up", "w:working", -0.1 + 0.12 * i + 0.13, -8, [0, 4, 7, 12][i // 2], f"{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]} fills with conversations")
cue("soundshelfstudio-ui-swipe-confirm", "w:day", 0.2, -9, note="the underline under 'day.'")
# 13 Zapify. Automate your Instagram DMs and grow on autopilot.
cue("gen-whoosh-medium", "sign", -0.1, -4, note="the white field; the logo returns to the centre")
cue("gen-shimmer", "w:zapify3", 0.05, -5, note="the gold ring; the name")
for i in range(3): cue("universfield-bubble-pop-03", "w:grow", -0.1 + 0.2 * i, -8, [0, 4, 7][i], f"the interactions return ({i + 1})")
cue("soundshelfstudio-ui-swipe-confirm", "w:autopilot", 0.2, -5, note="the mark under 'autopilot.'")
cue("ui-pop-sound", "w:autopilot", 0.45, -4, note="Start free")

cues = {
    "fps": FPS, "frames": round(L["end"] * FPS), "library": "../../../library/sound",
    "vo": {"file": "../public/audio/vo.wav", "at": 0},
    "music": {"file": "music.flac", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 1.5,
              "note": "Tech House vibes (Alejandro Magana, Mixkit Stock Music Free License) cut by music_fit.py --length 39.5 --lift 3.6: an entry on 'with Zapify', the last hit at 35.9 s on 'autopilot'"},
    "sfx": sorted(S, key=lambda c: c["frame"]),
}
json.dump(cues, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1, ensure_ascii=False)
print(len(S), "cues")
