# Writes sound/cues.json from the film's own labels (src/words.json + the beat labels in src/kit.tsx), so every
# effect lands on its picture event and a re-timed voice-over moves the sound with the picture.
#   python3 scripts/cues.py && python3 ../../library/scripts/sound_mix.py sound/cues.json public/audio/mix.wav --sheet out/mix.png
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
kit = open(os.path.join(ROOT, "src", "kit.tsx")).read()
L = {k: float(v) for k, v in re.findall(r"(\w+): ([\d.]+)", kit[kit.index("timeline(30, {"):kit.index("...WORDS")])}
L.update(json.load(open(os.path.join(ROOT, "src", "words.json"))))
FPS = 30
f = lambda label, d=0.0: round((L[label] + d) * FPS)

S = []
def cue(id, label, d=0.0, db=None, pitch=None, note=""):
    c = {"frame": f(label, d), "id": id, "note": note}
    if db is not None: c["db"] = db
    if pitch: c["pitch"] = pitch
    S.append(c)

# 1 great partnerships start with a clear purpose: the two bars meet
cue("gen-whoosh-short", "w:partnerships", 0.1, -6, note="the long bar slides in")
cue("gen-impact-soft", "w:partnerships", 0.62, -6, note="the short bar meets it: the A")
cue("soundshelfstudio-ui-swipe-confirm", "w:purpose", 0.35, -5, note="the underline under 'a clear purpose.'")
# 2 at Amargier Advisory
cue("gen-whoosh-medium", "brand", 0.35, -4, note="the mark moves to the centre")
cue("gen-shimmer", "w:advisory", 0.0, -5, note="the name")
# 3 technology businesses across EMEA
cue("gen-whoosh-medium", "emea", 0.25, -3, note="the mark lands on Malaga as a pin")
cue("gen-swell", "w:we", 0.0, -5, note="EMEA spreads out from Malaga")
for i in range(6): cue("soundreality-ui-pop-up", "w:technology", 0.0 + 0.09 * i, -4, [0, 2, 4, 5, 7, 9][i], f"businesses light up ({i + 1})")
cue("soundshelfstudio-ui-swipe-confirm", "w:emea", 0.4, -2, note="the underline under 'EMEA.'")
# 4 partnership potential into commercial opportunities
cue("gen-whoosh-short", "w:into", 0.05, -7, note="'potential' rolls to 'commercial'")
cue("soundshelfstudio-ui-success-bloom", "w:commercial", 0.15, -4, note="links turn solid")
for i in range(4): cue("universfield-bubble-pop-03", "w:opportunities", 0.0 + 0.15 * i, -8, [0, 2, 4, 7][i], f"opportunity {i + 1}")
# 5 the services build round the client's business
cue("gen-whoosh-medium", "eco", 0.15, -3, note="the businesses gather round a client")
cue("soundshelfstudio-ui-radio-select", "w:strategy", 0.0, -4, note="Go-to-market strategy")
cue("gen-swell", "w:isv", -0.05, -6, note="the ISV ring forms")
for i in range(3): cue("ui-pop-sound", "w:recruitment", -0.05 + 0.12 * i, -6, [0, 2, 4][i], f"partner {i + 1} recruited")
cue("soundshelfstudio-ui-swipe-confirm", "w:co", 0.1, -5, note="co-selling paths converge")
cue("ui-pop-sound", "w:selling", 0.15, -4, note="the Co-sell chip")
cue("gen-shimmer", "w:hands", 0.05, -4, note="Cedric at the centre")
# 6 the thinking with the doing
cue("gen-whoosh-medium", "connect", 0.1, -3, note="the hub folds away")
cue("gen-whoosh-short", "w:thinking", 0.05, -5, note="the short bar: the thinking")
cue("gen-whoosh-short", "w:doing", 0.05, -5, -2, "the long bar: the doing")
cue("gen-impact-soft", "w:doing", 0.38, -13, note="they connect at the apex")
# 7 twelve years of experience
cue("gen-whoosh-deep", "exp", 0.15, -3, note="the photo opens out of the apex")
for i in range(3): cue("floraphonic-ui-pop-up-15", "w:twelve", -0.05 + 0.2 * i, -4, 2 * i, f"the counter rolls ({i + 1})")
cue("soundshelfstudio-ui-swipe-confirm", "w:experience", 0.4, -6, note="the underline")
# 8 build what comes next
cue("gen-whoosh-medium", "build", 0.0, -10, note="the photo leaves; the ticks fly")
for i in range(6): cue("soundreality-ui-pop-up", "w:build", 0.0 + 0.2 * i, -7, [0, 2, 4, 5, 7, 9][i], f"brick {2 * i + 1}")
cue("soundshelfstudio-ui-swipe-confirm", "w:next", 0.4, -6, note="the underline under 'next.'")
# 9 let's talk
cue("gen-whoosh-medium", "cta", 0.15, -4, note="the mark moves up, on its own")
cue("gen-shimmer", "cta", 0.4, -5, note="it resolves into the solid mark")
cue("ui-pop-sound", "w:growth", 0.55, -3, note="the Let's talk button")

cues = {
    "fps": FPS, "frames": round(L["end"] * FPS), "library": "../../../library/sound",
    "vo": {"file": "../public/audio/vo.wav", "at": 0},
    "music": {"file": "music.flac", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 1.5,
              "note": "Valley Sunset (Alejandro Magana, Mixkit Stock Music Free License) cut by music_fit.py --length 30 --lift 3.4: an entry on 'At Amargier Advisory', the last hit at 27.6 s under the close"},
    "sfx": sorted(S, key=lambda c: c["frame"]),
}
json.dump(cues, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1, ensure_ascii=False)
print(len(S), "cues")
