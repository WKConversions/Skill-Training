# Cartesian Systems · landing-page hero film

30 s, 1920×1080, 30 fps, silent and looping (hero videos autoplay muted; frames 0 and 899 are both black).
Built in Remotion in Cartesian's own look, harvested from cartesian.systems: the black hero panel, isometric
route lines, olive/yellow-green location pins, white Inter 600 headlines with a light-grey last phrase,
Poppins for UI and numbers, outlined stat cards.

Story: one associate searches → the whole team searches → their existing RFID scans light up every item
on a live map → a straight route to the item, then a same-day pickpath → 750+ stores, $200k, +3.5%, 30 seconds
→ logo and "Location intelligence for every item in your store."

- `src/store.ts`: store plan, items, routes, RFID pulses, when each item is located (pure functions of the frame).
- `src/scenes/StoreWorld.tsx`: the isometric store. `Store.tsx` (0–23 s), `Footprint.tsx`, `Outro.tsx`.
- `npx remotion studio` to edit; `node scripts/stills.mjs 60,390,450` for test frames.
