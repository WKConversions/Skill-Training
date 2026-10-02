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
    if db is not None: c["db"] = db + 4   # the bed is a full corporate track: every effect sits 4 dB higher than our sparser films
    if pitch: c["pitch"] = pitch
    S.append(c)

# 1 move faster, not hold it back: the lane, the jam, the manual step
cue("kenney-scroll-003", "w:make", 0.0, -10, note="the work items run along the lane")
cue("cinematic-fast-whoosh", "w:faster", 0.05, -9, note="the lane speeds up")
cue("soundshelfstudio-ui-swipe-confirm", "w:faster", 0.2, -8, note="the underline under 'faster,'")
cue("kenney-error-005", "w:hold", -0.05, -6, note="the manual step drops in; the work piles up")
cue("ui-backspace", "w:not", 0.0, -9, note="items jam against it")
cue("soundshelfstudio-ui-swipe-confirm", "w:back", 0.12, -6, -3, "'back.' struck out")
# 2 K.B: the badge drops in and clears the jam
cue("riser", "w:kb", -0.7, -12, note="build into the badge")
cue("gen-impact-soft", "w:kb", 0.0, -3, note="the K.B badge lands")
cue("cinematic-fast-normal-whoosh", "w:kb", 0.08, -6, note="the jam is blown apart")
# 3 build smarter systems: the steps return and line up, the pulse runs them
cue("cinematic-mediam-whoosh", "w:build", -0.2, -9, note="the steps fly back in")
cue("gen-whoosh-medium", "w:build", -0.15, -8, note="the badge goes to the corner")
cue("middle-gear", "w:smarter", 0.05, -9, note="they lock into one row")
for i in range(0, 5, 2): cue("kenney-select-004", "w:systems", 0.2 * i, -9, [0, 4, 7][i // 2], f"step {i + 1} ticks")
cue("soundshelfstudio-ui-swipe-confirm", "w:systems", 0.25, -8, note="the mark under 'systems.'")
# 4 software, automation and AI
cue("sweet-ui-open", "w:software", -0.12, -7, note="the dashboard")
cue("smooth-pop", "w:automation", -0.12, -7, note="the workflow")
cue("data-collect-2", "w:automation", 0.2, -12, note="the pulse runs the workflow")
cue("premium-and-smooth-pop", "w:ai", -0.12, -7, note="the support agent")
cue("ui-typing", "w:ai", -0.6, -14, note="the question types in")
cue("kenney-glass-001", "w:ai", 0.35, -7, note="the agent answers")
# 5 from strategy to implementation
cue("cinematic-low-whoosh", "axis", -0.25, -7, note="pale cyan opens; the axis draws")
cue("kenney-pluck-001", "w:strategy", 0.0, -8, note="Strategy")
cue("rjd-riser", "w:to", 0.1, -12, note="the card rides the axis")
cue("kenney-confirmation-002", "w:implementation", 0.2, -7, note="the plan becomes the live system")
# 6 complex ideas into practical solutions, inside your business
cue("cinematic-data", "w:we", 0.0, -10, note="the tangle draws")
for i in range(4): cue("universfield-bubble-pop-03", "w:turn", 0.14 * i, -11, [0, 3, 5, 7][i], f"idea note {i + 1}")
cue("ui-stretch", "w:into", 0.0, -8, note="the tangle straightens into a flow")
for i in range(0, 4, 2): cue("kenney-select-004", "w:solutions", 0.25 * i, -9, [0, 5][i // 2], f"flow step {i + 1} ticks")
cue("ui-premium-open", "w:inside", -0.1, -10, note="the client's app closes round the flow")
# 7 we connect workflows
cue("cinematic-fast-whoosh", "connect", -0.1, -3, note="the camera pulls out to their tools")
for i in range(0, 8, 2): cue("floraphonic-ui-pop-up-15", "w:connect", -0.1 + 0.05 * i, -10, [0, 2, 4, 7][i // 2], f"tool tile {i + 1}")
cue("data-whoosh", "w:workflows", 0.0, -9, note="the links draw; data runs along them")
# 8 automate repetitive processes
cue("kenney-scroll-001", "w:automate", -0.15, -5, note="the copy-paste rows stack")
cue("long-speed-gear", "w:repetitive", 0.0, -9, note="each row turns automatic")
cue("smooth-and-premium-gear", "w:processes", 0.25, -9, note="they fold into one rule")
cue("kenney-confirmation-001", "w:processes", 0.6, -7, note="Runs automatically")
# 9 technology that grows with you
cue("cinematic-mediam-whoosh", "grow", -0.1, -9, note="the client's app")
cue("normal-pop", "w:grows", 0.0, -7, note="a dashboard joins")
cue("normal-pop", "w:grows", 0.25, -8, 3, "a mobile app joins")
cue("normal-pop", "w:with2", 0.0, -8, 7, "an AI agent joins")
cue("data-collect", "w:with2", 0.1, -14, note="the team grows")
# 10 and we stay involved
cue("cinematic-low-whoosh", "stay", -0.15, -8, note="the lavender field opens")
cue("universfield-new-notification-04", "w:we3", -0.1, -7, note="Anna asks in the channel")
cue("kenney-glass-004", "w:involved", 0.0, -8, note="K.B replies")
cue("soundshelfstudio-ui-success-bloom", "w:involved", 0.8, -7, note="Invoices are live")
# 11 continuously improving: the loop
cue("smooth-riser", "improve", -0.5, -13, note="the loop forms")
for i, w in enumerate(["w:improving", "w:build2", "w:needs", "w:evolve"]): cue("soundreality-ui-pop-up", w, 0.0, -11, [0, 2, 4, 7][i], f"support item {i + 1}")
cue("soft-gear-2", "w:continuously", 0.0, -11, note="the version dial rolls")
# 12 K.B. Your technical partner
cue("cinematic-fast-normal-whoosh", "sign", -0.15, 0, note="white opens out of the pulse")
cue("gen-impact-deep", "w:kb2", 0.0, -6, note="the badge")
cue("soundshelfstudio-ui-swipe-confirm", "w:partner", 0.25, -7, note="the mark under 'partner'")
cue("cinematic-data-collect-2", "w:behind", 0.0, -4, note="the systems behind light up")
cue("ui-pop-sound", "cta", 0.0, -4, note="Book a free discovery call")
cue("cinematic-click", "cta", 1.2, -4, note="the cursor clicks it")

cues = {
    "fps": FPS, "frames": round(L["end"] * FPS), "library": "../../../library/sound",
    "vo": {"file": "../public/audio/vo.wav", "at": 0},
    "music": {"file": "music.flac", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 1.5,
              "note": "Raising Me Higher (Ahjay Stelino, Mixkit Stock Music Free License) cut by music_fit.py --length 37.5 --lift 4.3: an entry on 'K.B helps'"},
    "sfx": sorted(S, key=lambda c: c["frame"]),
}
json.dump(cues, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1, ensure_ascii=False)
print(len(S), "cues")
