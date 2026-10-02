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

# 1 hook: the word "idea." gets its red mark, the mark becomes the card, the title is typed
cue("soundshelfstudio-ui-swipe-confirm", "w:idea", 0.2, -3, note="the red mark sweeps under 'idea.'")
cue("gen-whoosh-short", "tangle", 0.3, -4, note="the mark becomes the project card")
cue("floraphonic-ui-pop-up-15", "tangle", 0.5, -2, note="typing, first half")
cue("floraphonic-ui-pop-up-15", "tangle", 0.95, -2, -2, "typing, second half")
# 2 the tangle: things pile on, the pops falling in pitch
for i in range(3): cue("soundreality-ui-pop-up", "w:deadlines", 0.25 * i + 0.1, -4, -i, f"date {i + 1} lands")
cue("soundshelfstudio-ui-swipe-confirm", "w:deadlines", 0.95, -6, note="the red ring round '30 Sep?'")
for i, d in enumerate([-0.05, 0.12, 0.29]): cue("soundreality-ui-pop-up", "w:dependencies", d + 0.15, -4, -3 - i, f"dependency {i + 1} lands")
cue("floraphonic-multi-pop-1", "w:people", 0.15, -4, note="the people pile on")
# 3 he comes in
cue("gen-swell", "w:that's", 0.0, -2, note="his red grows out of the card: relief")
cue("gen-whoosh-medium", "w:that's", 0.2, -4, note="the red sweeps the frame")
cue("ui-pop-sound", "w:bruno", 0.1, -5, note="his photo lands")
cue("gen-whoosh-short", "consult", 0.35, -4, note="the red folds into his Consulting label")
# 4 consulting
cue("gen-whoosh-medium", "w:takes", 0.42, -4, note="the tangle straightens into a portfolio")
cue("soundshelfstudio-ui-swipe-confirm", "w:strategy", 0.3, -5, note="the axis draws: strategy to execution")
for i, w in enumerate(["w:portfolio", "w:plan", "w:p", "w:team"]):
    cue("soundshelfstudio-ui-radio-select", w, 0.15, -3 if i < 3 else -6, [0, 2, 4, 7][i], f"stop {i + 1} lights (rising)")
cue("gen-whoosh-short", "w:portfolio", 0.57, -6, note="the project moves up to number one")
for i in range(4): cue("universfield-bubble-pop-03", "w:p", 0.3 + 0.12 * i, -7, [0, 2, 4, 7][i], f"status {i + 1} turns green")
cue("floraphonic-multi-pop-1", "w:team", 0.3, -10, note="the team docks on the plan")
cue("soundshelfstudio-ui-success-bloom", "w:team", 0.45, note="the project: Delivered")
# 5 coaching
cue("gen-whoosh-deep", "coach", 0.2, -3, note="coaching opens out of one person")
cue("soundshelfstudio-ui-swipe-confirm", "w:mentor", 0.25, -5, note="the red ring draws round him")
cue("ui-pop-sound", "w:coach:one", 0.05, -5, note="you, one to one")
for i in range(4): cue("universfield-bubble-pop-03", "w:groups", 0.0 + 0.06 * i, -6, [0, 2, 4, 7][i], f"group member {i + 1}")
cue("soundshelfstudio-ui-swipe-confirm", "w:executives", 0.1, -5, note="the knob sets off along the range")
cue("ui-pop-sound", "w:executives", 1.7, -6, note="the knob reaches students")
# 6 stage
cue("gen-whoosh-deep", "stage", 0.28, -2, note="the red line rises like a curtain")
cue("gen-whoosh-short", "w:into", 0.2, -5, note="'hard lessons' rolls into 'stories'")
cue("soundshelfstudio-ui-swipe-confirm", "w:stick", 0.25, -3, note="the red mark on 'stick.'")
# 7 numbers
cue("gen-whoosh-medium", "proof", 0.12, -2, note="the mark floods the frame")
for i in range(3): cue("floraphonic-ui-pop-up-15", "w:twenty", 0.05 + 0.22 * i, 0, 2 * i, f"the counter rolls ({i + 1})")
cue("ui-pop-sound", "w:two", 0.3, -3, note="a third zero: 200")
cue("floraphonic-multi-pop-1", "w:two", 0.55, -5, note="two hundred dots")
cue("gen-impact-soft", "w:mentored", 0.62, -7, note="Top 25 badge lands")
cue("gen-impact-soft", "w:mentored", 0.74, -8, note="Top 10 badge lands")
# 8 the quote
cue("gen-whoosh-medium", "quote", 0.3, -4, note="the dots gather into one organiser")
cue("gen-impact-soft", "w:quote:in", 0.45, -6, note="the quote mark swings in")
cue("soundshelfstudio-ui-swipe-confirm", "w:a2", 0.06, -5, note="'speaker' is struck out")
cue("soundshelfstudio-ui-swipe-confirm", "w:experience", 0.3, -3, note="the red mark on 'experience.'")
# 9 the idea comes back; let's talk
cue("gen-impact-soft", "w:got", 0.38, -4, note="the card lands")
cue("soundshelfstudio-ui-swipe-confirm", "w:become", 0.1, -5, note="the arrow draws: idea to result")
cue("soundshelfstudio-ui-success-bloom", "w:result", 0.05, -1, note="Idea becomes Result")
cue("gen-whoosh-medium", "w:let's", 0.15, -2, note="his red closes the film")
cue("gen-shimmer", "w:let's", 0.2, -3, note="his logo")
cue("ui-pop-sound", "w:talk", 0.45, -4, note="the address button")

cues = {
    "fps": FPS, "frames": round(L["end"] * FPS), "library": "../../../library/sound",
    "vo": {"file": "../public/audio/vo.wav", "at": 0},
    "music": {"file": "music.flac", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 1.5,
              "note": "Raising Me Higher (Mixkit Stock Music Free License) cut by music_fit.py --length 45 --lift 7.6: an entry at 7.6 s as Bruno comes in; the last hit at 39.3 s on 'experience', ringing out under the close"},
    "sfx": sorted(S, key=lambda c: c["frame"]),
}
json.dump(cues, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1, ensure_ascii=False)
print(len(S), "cues")
