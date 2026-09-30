# Top Jobs Abroad · 45 s explainer, bright version

45 s, 1920×1080, 30 fps, silent, timed to the client's script at about 2.7 words per second (same timing as the
navy version in `../topjobsabroad-45s`, so one voice-over fits both). Built in Remotion in the light side of
topjobsabroad.com: the #F4F6FB page and white cards, navy type, the gold gradient, Playfair Display headlines
with the key words in gold, Plus Jakarta Sans, and bright city and people photography.

One thread runs through the showcase: a real open role from their site (Danish Speaking Customer Support,
Athens) is matched, interviewed for, signed, flown to and settled into.

| s | beat | on screen |
|---|---|---|
| 0–3 | hook | a traveller fills the frame; the camera pulls back and she is one tile of a moving wall of their destinations |
| 3–6 | problem | the wall slides aside for "Finding a job abroad can be difficult."; its city tiles fall onto a map of Europe as pins |
| 6–15 | problem | Where to start (dotted routes that give up), where to look (a search window pouring results), who to contact (messages, no reply), how it all works (paperwork piling up) |
| 15–18 | solution | all of it collapses into one point that opens into the logo, which flies up to become the header |
| 18–26 | showcase | their open roles on a conveyor, one matched; a video call opens out of it with the interview briefing; a chat slides in with a real FAQ answer; the contract is walked through line by line and signed |
| 26–35 | showcase | the page pans onto the map: a plane flies Copenhagen → Athens past their six steps, the recruiter alongside; the documents are stamped; a circle opens into Athens and the new apartment |
| 35–38 | showcase | a whip pan to someone at ease at work: "Recruitment, made comfortable." with a verified review |
| 38–45 | outro | the review flips into a receipt: interviews, relocation guidance, contract negotiation €0, FREE stamp; the wall rises back behind the end card and the cursor clicks "I'm looking for a job" |

Facts on screen are from their site: destinations and taglines, the open roles, the six steps, the interview
briefing, the FAQ (language, relocation support, "you will never be charged for…"), the review by Øyvind Kato
Olsen. City and people photos: Unsplash (as used on their site) and Pexels, both free for commercial use.
Map: Natural Earth via world-atlas (`src/europe.ts`).

`npx remotion studio` to edit; `node scripts/stills.mjs 30,600,975` for test frames;
`python3 scripts/motion_check.py out/draft.mp4`. Motion check on the draft: 99% of frames moving,
median 5.7% of the frame in motion, longest still 0.17 s.
