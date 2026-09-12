# Taylored Transformations — Website (V1)

Premium static marketing site for **Taylored Transformations**, the personal
training & transformation coaching business of **Andrew Taylor** (Edmonton, AB).

Positioning: *Edmonton's #1 personal trainer for results.* You're not paying for
workouts — you're investing in results. The entire site funnels toward one goal:
**a completed coaching application** (`apply.html`).

## Stack
- **HTML5 + CSS3 + vanilla JS.** No framework, no build step, no server.
- Progressive enhancement via CDN libraries (all optional, all degrade gracefully):
  - [Lenis](https://github.com/darkroomengineering/lenis) — smooth scrolling
  - [GSAP + ScrollTrigger](https://github.com/greensock/GSAP) — scroll reveals & hero parallax
- If the CDNs fail, the site still works: reveals fall back to `IntersectionObserver`,
  scrolling falls back to native. `prefers-reduced-motion` is fully respected.

## Structure
```
/
  index.html        Homepage (10 sections: hero → proof → method → offer → CTA)
  coaching.html     In-person / online / digital, method, investment philosophy
  results.html      Transformations, filters, before/after sliders
  about.html        Andrew's story (placeholders marked for easy completion)
  shop.html         Product catalog (Shopify-ready markup, no fake checkout)
  apply.html        THE conversion page — premium application form
  robots.txt, sitemap.xml
  /assets
    /css/styles.css   Design system (tokens, components, responsive, reduced-motion)
    /js/main.js       Nav, smooth scroll, reveals, before/after, filters, form
    /images           Drop real images here (see assets/images/README.md)
    /icons/favicon.svg
```

## Run it
It's fully static — just open `index.html`, or serve the folder:
```bash
npx serve .
# or
python -m http.server 8000
```

## Connect the application form (important)
The form in `apply.html` is ready for any static-friendly endpoint. Two options:

1. **No-JS redirect (simplest):** set the `<form action="...">` to your
   Formspree / Web3Forms endpoint. For Web3Forms also uncomment the
   `access_key` hidden input in `apply.html`.
2. **AJAX submit + inline success (recommended):** set `FORM_ENDPOINT` near the
   top of the form section in `assets/js/main.js` to your Formspree / Web3Forms /
   custom API / CRM webhook URL. The JS validates, POSTs `FormData`, and shows an
   inline success/error message.

Until an endpoint is set, the form validates all fields and shows a demo success
message (nothing is sent). A honeypot field (`_gotcha`) is included for spam.

## Add the images
See [`assets/images/README.md`](assets/images/README.md) for the exact filenames.
Every image currently shows a labeled placeholder naming the file it expects —
drop the real file in and it appears automatically. **Start by adding `logo.png`.**

## Brand system (from the logo)
- Colours: black `#000`, surfaces `#111/#171717/#202020`, warm white `#F5F5F3`,
  brand red `#E50914` (tune in `--red` if you sample an exact value from the logo).
- Type: **Saira Condensed** (angular athletic display) + **Inter** (body).
- Tokens live at the top of `assets/css/styles.css` (`:root`). Change once, applies everywhere.

## Deploy
Drop the folder on any static host — Netlify, Vercel, Cloudflare Pages,
GitHub Pages, S3, etc. No configuration required.
