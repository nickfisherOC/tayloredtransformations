# Image assets — drop-in guide

Every `<img>` on the site points at a filename in this folder. Until a real
file exists, a styled **labeled placeholder** shows in its place (handled by
`assets/js/main.js`). Drop the correctly named file here and it appears
automatically — no code changes needed.

## Brand / logo
| Filename         | Used on            | Notes |
|------------------|--------------------|-------|
| `Logo.jpeg`      | Source (not shown) | The original supplied logo — full colour lockup on a white background. |
| `logo.png`       | Footer + hero      | **Generated** dark-theme knockout of `Logo.jpeg`: white ink + red accents, transparent background, white box removed. Full lockup (monogram + TAYLORED + TRANSFORMATIONS). |
| `logo-mark.png`  | Header (all pages) | **Generated** knockout of the TT monogram only — legible at the slim header size. |
| `og-image.jpg`   | Social sharing (Open Graph) | 1200×630. |

**Regenerating the logo files:** `logo.png` and `logo-mark.png` were produced from
`Logo.jpeg` by a one-off script (`scratchpad/make_logos.py`) that removes the white
background, flips the black ink to white for dark UI, and keeps the red exactly. If you
later get a proper transparent PNG or vector of the logo, just drop replacements in at
`logo.png` (full lockup) and `logo-mark.png` (monogram) — no code changes needed.

## Homepage hero
The homepage hero uses **`andrew1`** — a full-body studio shot of Andrew.
- Source: `andrew1.png` (supplied, 1024×1536).
- Served: `andrew1.webp` (~51 KB) with `andrew1.jpg` (~110 KB) as fallback, via a
  `<picture>` element in `index.html`. Regenerate with the same PIL snippet if you
  swap the source.
- Treatment is pure CSS (no baked-in edits): desktop shows him right-anchored and full
  body next to the headline; mobile shows him as a top/right cover with the text
  overlaid. He's graded monochrome (`grayscale + contrast`) so the red slash/accents
  carry the brand colour, with a soft red halo behind him (`.hero__glow`). Tweak the
  grade in `.hero__subject img` / mobile block in `styles.css`.
- To swap in a different hero shot later, replace `andrew1.webp` / `andrew1.jpg`
  (keep the 2:3-ish portrait framing) — no markup changes needed.

## Andrew photography (in use)
Two supplied screenshots power the interior Andrew imagery. Each is exported to
`<name>.webp` + `<name>.jpg` (via `scratchpad/make_andrew_photos.py`) and displayed
with a **light brand grade** (CSS class `.is-graded` — slight desaturation + contrast,
keeps warmth).
| Served file | Source | Used on |
|-------------|--------|---------|
| `andrew-portrait.webp/.jpg` | `andrew-portrait-src.png` (portrait, eye contact, white tank) | About hero + Homepage "Meet Andrew" |
| `andrew-editorial.webp/.jpg` | `andrew-editorial-src.png` (editorial torso, warm, landscape) | About "Direct. Disciplined." block + Homepage editorial band |
| `og-image.jpg` | cropped from the editorial shot, graded + darkened, 1200×630 | Social share (all pages) |

- The **editorial band** is the full-bleed cinematic strip on the homepage between
  "The Method" and the testimonials (`.editorial-band` in `styles.css`, markup in
  `index.html`). Swap `andrew-editorial.*` to change its background.
- These sources are ~360–624px — fine for these contained/banded spots; swap in
  higher-res originals later for large screens if you have them.

## Photography (see PHOTOGRAPHY DIRECTION in the brief)
| Filename                  | Used on   | Suggested shot |
|---------------------------|-----------|----------------|
| `hero-training.jpg`       | Home hero | Cinematic wide training shot. Dark, high-contrast. 1920×1080+ |
| `andrew-portrait.jpg`     | Home, About | Strong directional-light portrait of Andrew. 4:5 |
| `andrew-coaching.jpg`     | About     | Andrew coaching a client. 4:3 |
| `coaching-inperson.jpg`   | Coaching  | Hands-on in-person session. 4:5 |
| `coaching-online.jpg`     | Coaching  | Athlete training / phone showing program. 4:5 |
| `line-supplements.jpg`    | Shop      | Supplement line product shot. |

## Transformations (before/after — 4:5 portrait each)
`transformation-<name>-before.jpg` and `transformation-<name>-after.jpg` for:
`james`, `sarah`, `mark`, `dan`, `priya`, `chris`, `leah`.

## Client avatars (square)
`client-james.jpg`, `client-sarah.jpg`

## Products (1:1 square)
`product-program.jpg`, `product-program-2.jpg`, `product-nutrition.jpg`,
`product-ebook-2.jpg`, `product-course.jpg`, `product-whey.jpg`,
`product-creatine.jpg`, `product-preworkout.jpg`

## Tips
- Prefer modern formats where possible (WebP/AVIF) — or keep `.jpg` names and
  swap bytes; the markup already uses `loading="lazy"` on below-the-fold images.
- Keep files reasonably sized (hero < ~400KB, others < ~150KB) for performance.
