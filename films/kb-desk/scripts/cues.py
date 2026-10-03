# Writes sound/cues.json for the desk film from its own labels (src/words.json + the beats in src/clock.ts), each
# effect on its picture event, placed by the move's speed graph: a whoosh's peak on the cut of a whip, a tap on the
# frame something is set down, a pop when a row or button lands (library: motion/sound.md). Sounds picked by ear for
# a calm, premium, human desk (scripts/sfx_hear.py pick … "calm premium soft paper office desk"); the moves that
# carry no meaning are left to the music.
#   python3 scripts/cues.py && python3 ../../library/scripts/sound_mix.py sound/cues.json public/audio/mix.wav --sheet out/mix.png
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
clock = open(os.path.join(ROOT, "src", "clock.ts")).read()
L = {k: float(v) for k, v in re.findall(r"(\w+): ([\d.]+)", clock[clock.index("timeline(30, {"):clock.index("...WORDS")])}
L.update(json.load(open(os.path.join(ROOT, "src", "words.json"))))
FPS = 30
F = lambda label: round(L[label] * FPS)

S = []
def cue(id, frame, db, pitch=None, note=""):
    c = {"frame": max(0, int(frame)), "id": id, "note": note, "db": db + 6}   # a full track under a calm film: the bed ducks 8 dB and the effects sit 6 dB up
    if pitch: c["pitch"] = pitch
    S.append(c)

WH, SOFT, TAP, POP, TICK = "gen-whoosh-short", "cinematic-low-whoosh", "ui-backspace", "floraphonic-casual-click-pop-ui-2", "kenney-tick-001"
# 1 move faster, not hold it back
cue(WH, F("w:make") + 6, -13, None, "sheet 1 thrown into the screen (the cut)")
cue(WH, F("w:move") + 4, -13, 2, "sheet 2, quicker")
cue(WH, F("w:faster") + 4, -12, 4, "sheet 3, quicker still")
cue(TAP, F("w:not") + 13, -13, None, "the next sheet stops short")
cue(TAP, F("w:back") + 9, -13, -3, "the note 'by hand' on top")
# 2 K.B helps companies build smarter systems
cue("gen-impact-soft", F("w:kb") + 13, -8, None, "the K.B badge is placed on the desk")
cue(SOFT, F("w:build") + 1, -12, None, "the pile goes into the screen")
cue(POP, F("w:systems") + 6, -15, None, "the system's tiles")
# 3 software, automation, AI: the screen drops through
cue(WH, F("w:software") + 2, -14, None, "drops through to the web app")
cue(WH, F("w:automation") + 4, -14, 2, "drops through to the automation")
for i in range(3): cue(TICK, F("w:automation") + 8 + i * 8, -13, [0, 2, 4][i], f"step {i + 1} runs")
cue(WH, F("w:ai") + 3, -14, 4, "drops through to the AI agent")
cue("soundshelfstudio-ui-radio-select", F("w:ai") + 12, -14, None, "the agent answers")
# 4 from strategy to implementation
cue(SOFT, F("w:implementation") + 2, -12, None, "the sketch lifts off the page into the screen")
# 5 complex ideas into practical solutions
cue(TAP, F("w:complex") + 4, -15, None, "the notes land")
cue(TAP, F("w:practical") - 4, -14, -2, "the phone is set down")
cue(WH, F("w:practical") + 2, -14, None, "the notes go into the phone")
cue(POP, F("w:practical") + 14, -16, None, "the app's buttons")
# 6 that work inside your business
cue("cinematic-click", F("w:work"), -11, None, "Invoices tapped")
cue(SOFT, F("w:inside") + 2, -13, None, "the app docks inside it")
# 7 we connect workflows
cue(TAP, F("w:we2") + 6, -14, None, "the tablet is set down")
cue("gen-swell", F("w:connect"), -14, None, "the cables draw")
# 8 automate repetitive processes
for i, w in enumerate(["w:automate", "w:repetitive"]): cue(TAP, F(w) + 4, -13, [0, 2][i], "the same form again")
cue(TAP, F("w:repetitive") + 12, -13, 4, "and again")
cue("kenney-switch-005", F("w:processes") + 5, -10, None, "Auto switches on")
cue("data-collect", F("w:processes") + 2, -18, None, "the forms run by themselves")
# 9 technology that grows with you
cue(POP, F("w:technology2") + 2, -15, None, "a tile joins")
cue(WH, F("w:grows") + 4, -15, -2, "two more laptops slide in")
# 10–11 we stay involved, continuously improving
for i in range(4): cue(TICK, F("w:stay") + 5 + i * 5, -14, [0, 2, 4, 7][i], f"K.B on Monday {i + 1}")
cue(WH, F("w:continuously") + 4, -17, 3, "the page turns")
cue(POP, F("w:improving") + 8, -17, None, "Improved")
cue(TAP, F("w:as") + 9, -13, None, "a new note on the laptop")
cue(WH, F("w:evolve") + 2, -13, 2, "the note goes into the screen")
cue(POP, F("w:evolve") + 10, -15, 4, "the reports tile")
# 12–15 K.B, the partner
cue(SOFT, F("w:kb2") - 6, -16, None, "the desk clears")
cue("gen-swell", F("w:kb2") - 2, -13, None, "the badge comes to the middle")
cue(POP, F("cta") + 12, -10, None, "Book a free discovery call")

cues = {
    "fps": FPS, "frames": round(L["end"] * FPS), "library": "../../../library/sound",
    "vo": {"file": "../public/audio/vo.wav", "at": 0},
    "music": {"file": "music.flac", "at": 0, "duck_db": 8, "fade_in": 0.3, "fade_out": 1.5,
              "note": "Raising Me Higher (Ahjay Stelino, Mixkit Stock Music Free License), cut by music_fit.py --length 37.5 --lift 4.3 for the first K.B film: same voice-over, same timing"},
    "sfx": sorted(S, key=lambda c: c["frame"]),
}
json.dump(cues, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1, ensure_ascii=False)
print(len(S), "cues")
