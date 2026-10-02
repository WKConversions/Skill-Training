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

# 1 you know what you're good at. But not always why.
cue("ui-pop-sound", "w:at", 0.3, -5, note="the check lands beside 'good at.'")
cue("gen-whoosh-short", "w:why", -0.05, -7, note="the tangled signal draws in")
cue("soundshelfstudio-ui-swipe-confirm", "w:why", 0.25, -4, note="the lime mark under 'why.'")
# 2 MindMirror turns patterns from your assessment into a clearer picture
cue("gen-whoosh-medium", "mm", 0.35, -3, note="the tangle moves to the centre")
cue("soundshelfstudio-ui-swipe-confirm", "w:mind", 0.05, -6, note="the centre line draws")
cue("gen-shimmer", "w:mind", 0.25, -3, note="the mark opens out of its centre line")
cue("ui-pop-sound", "w:mirror", 0.1, -7, note="the wordmark")
cue("gen-swell", "w:turns", 0.0, -4, note="the scan line sweeps the signal into pattern")
cue("soundshelfstudio-ui-success-bloom", "w:assessment", 0.55, -4, note="the figure is ordered")
cue("gen-whoosh-short", "w:clearer", 0.0, -8, note="the label rolls: a clearer picture")
# 3 the areas
cue("gen-whoosh-short", "areas", 0.3, -6, note="the figure makes room")
for i, w in enumerate(["w:focus", "w:pressure", "w:driven", "w:process"]):
    cue("soundreality-ui-pop-up", w, 0.12, -3, [0, 2, 4, 7][i], f"insight card {i + 1} lands")
# 4 one guided assessment, one visual profile
cue("gen-whoosh-medium", "steps", 0.15, -3, note="the cards gather into the assessment")
for i in range(5): cue("universfield-bubble-pop-03", "w:guided", 0.05 + 0.17 * i, -9 - (3 if i == 5 else 0), [0, 2, 4, 5, 7, 9][i], f"area {i + 1} ticked")
cue("soundshelfstudio-ui-radio-select", "w:one", 0.0, -4, note="01 Assess")
cue("soundshelfstudio-ui-radio-select", "w:one2", -0.25, -4, 2, "02 Analyze")
cue("gen-whoosh-short", "w:one2", -0.15, -11, note="the scan passes the answers")
cue("gen-whoosh-deep", "w:visual", 0.15, -2, note="the card opens on its centre line")
cue("soundshelfstudio-ui-radio-select", "w:visual", 0.05, -4, 4, "03 Understand")
# 5 the profile
cue("ui-pop-sound", "w:natural", 0.1, -5, note="natural strengths")
cue("soundshelfstudio-ui-swipe-confirm", "w:strengths", 0.15, -7, note="the lime underline")
cue("ui-pop-sound", "w:higher", 0.1, -5, -2, "higher-effort areas")
cue("soundshelfstudio-ui-swipe-confirm", "w:conditions", 0.05, -4, note="the best-conditions band opens")
cue("soundshelfstudio-ui-success-bloom", "w:best", 0.15, -2, note="the peak: at your best")
# 6 not another label; more context
cue("gen-whoosh-medium", "label", 0.15, -3, note="the profile folds into the person")
cue("gen-whoosh-deep", "w:not2", 0.1, -4, note="lime floods out of the person")
for i, d in enumerate([("w:another", -0.12), ("w:another", 0.06), ("w:label", -0.12)]): cue("gen-impact-soft", d[0], d[1] + 0.3, -6, -i, f"label tag {i + 1} lands")
cue("soundshelfstudio-ui-swipe-confirm", "w:label", 0.2, -4, note="the labels are struck out")
cue("gen-whoosh-short", "w:label", 0.65, -5, note="they fall away")
cue("gen-whoosh-medium", "w:more", 0.05, -3, note="the figure grows back round the person")
for i in range(6): cue("floraphonic-ui-pop-up-15", "w:context", 0.05 + 0.2 * i, -3 if i == 0 else -6, [0, 2, 4, 5, 7, 9][i], f"area chip {i + 1}")
# 7 understand yourself; more perspective
cue("gen-whoosh-short", "decide", 0.35, -5, note="the figure moves aside")
cue("soundshelfstudio-ui-swipe-confirm", "w:perspective", 0.3, -4, note="the lime mark under 'perspective.'")
# 8 MindMirror. See how your mind works.
cue("gen-whoosh-medium", "sign", 0.2, -3, note="white opens round the figure")
cue("gen-shimmer", "w:mind2", 0.2, -2, note="the mark opens out of its centre line")
cue("ui-pop-sound", "w:works", 0.55, -3, note="Book your MindMirror Scan")

cues = {
    "fps": FPS, "frames": round(L["end"] * FPS), "library": "../../../library/sound",
    "vo": {"file": "../public/audio/vo.wav", "at": 0},
    "music": {"file": "music.flac", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 1.5,
              "note": "Close Up (Michael Ramir C., Mixkit Stock Music Free License) cut by music_fit.py --length 35 --lift 3.85: an entry on 'MindMirror', the last hit at 32.4 s on 'works'"},
    "sfx": sorted(S, key=lambda c: c["frame"]),
}
json.dump(cues, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1, ensure_ascii=False)
print(len(S), "cues")
