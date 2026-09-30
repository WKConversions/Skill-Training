# Asset strategy

For every scene, decide what it is made of: pure motion graphics, shapes, typography, icons, UI, brand
assets, charts, an external image, external video, a screenshot, a generated image, a texture, or a
combination. Decide mixed media once, at the art-direction stage (does this film combine photography
with graphics?), not scene by scene; a film that switches material every shot looks assembled.

## Order of preference

1. **The client's own assets:** logo, product screens, product photos, team photos, real numbers,
   real customer names as their site presents them (harvesting below).
2. **Built graphics:** shapes, type, rebuilt UI, charts, in the chosen style.
3. **External imagery** (photo, video, generated): only when it genuinely improves the scene.

Good reasons for an external image: real human context, a recognizable physical object, an
environment or location, lifestyle, emotion, a real-world example, product context, a strong visual
metaphor, or deliberate contrast between reality and digital graphics. Never use imagery as
decoration.

## Style and truth constraints

- **The chosen style decides how imagery may appear:** follow the Imagery line in its definition
  (`styles/README.md`). If a scene truly needs what its style forbids, flag it for Karl instead of
  breaking the style.
- **Never invent the client's facts:** features, numbers, customers, results. Never present stock
  people as the client's customers or team; when a line is about the team, use real team photos or
  no people.
- **Third-party logos** (integrations, customers) appear only as the client's site presents them.
- **Licensing:** external photos and footage must be licensed for commercial use; record source and
  license with the asset. Generated images are for illustrative context only, never as proof.
- **Resolution:** treat low-resolution screenshots as references for rebuilding, never enlarge them.

## Harvesting the client's website

Before the storyboard, collect everything the video can use from the client's website and save it in
the project's `assets/` folder with an `assets.md` listing each file, what it is and where it came
from. For client work the client's brand wins: use supplied brand assets, otherwise take colors,
fonts, radii and easing from their live site (computed CSS) and say where the values came from.

Collect:
- **Logo:** SVG first (inline in the header, or an .svg file), otherwise the largest PNG; light and
  dark versions if the site has both; the favicon and share image as fallbacks.
- **Brand:** colors (CSS variables, buttons, links, backgrounds), fonts (families, weights and tracking
  for headlines and body), corner radii, shadows, button style, easing curves.
- **Product:** interface screenshots and mockups, product photos, illustrations, icon style (outline
  or filled).
- **Words and proof:** headline and tagline, value propositions, feature and product names, numbers,
  pricing, calls to action, testimonials, customer logos.
- **Tools:** the integrations and platforms the product works with.
- **Other pages** when they matter: product or features, pricing, about.

How:
1. **With a browser tool** (the complete route): open the site, let it load, scroll once so lazy
   content appears, and run `scripts/site_extract.js` in the page. It returns brand values, the logo's
   markup, image addresses and the page text. Save the logo's SVG markup straight to a file. Download
   images inside the page with `scripts/grab.js`, which returns each file as base64 to decode and
   save; when an image can't be fetched that way, keep a screenshot of it instead. Screenshot the hero
   and product sections for reference.
2. **Without a browser tool:** fetch the pages as text for the copy, names and image addresses, and
   ask Karl for the logo and product screenshots.
3. The build machine usually can't download from websites directly. Try once, then use the browser.

## Asset requests

When a scene needs an external image or clip that isn't at hand, write an asset request. Put all
requests in the storyboard's "Asset requests" section, and as a JSON block, so Karl or a future tool
can fulfil them (`production/tool-requests.md`).

```
ASSET ID: S04-A
SCENE: 4
ASSET TYPE: Photography | Photo cut-out | Stock video | Generated image | Screenshot | Texture
SOURCE PREFERENCE: client site > licensed stock > generated
SEARCH QUERY:
SUBJECT:
ACTION:
COMPOSITION:
SUBJECT POSITION:
BACKGROUND:
LIGHTING:
MOOD:
COLOR CHARACTERISTICS:
CAMERA ANGLE:
ASPECT RATIO:
CROP REQUIREMENTS:
LICENSE: commercial use required
WHY THIS ASSET IS NEEDED:
FALLBACK IF NOT FOUND: what the scene becomes without it
```

Example:

```
ASSET TYPE: Photography
SEARCH QUERY: startup founder reviewing analytics on laptop dark modern office
SUBJECT: Entrepreneur at laptop
ACTION: Looking at analytics
COMPOSITION: Medium shot with negative space on right
SUBJECT POSITION: Left third
LIGHTING: Soft cinematic low-key
MOOD: Focused, premium, ambitious
ASPECT RATIO: 16:9
CROP REQUIREMENTS: Must remain usable when cropped vertically
WHY THIS ASSET IS NEEDED: Gives the abstract concept of business growth a human context.
FALLBACK IF NOT FOUND: The growth line draws across the frame without the person.
```
