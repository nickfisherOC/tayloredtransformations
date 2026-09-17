/* ==========================================================================
   TAYLORED TRANSFORMATIONS — main.js
   Vanilla JS. Enhances progressively. Everything degrades gracefully if
   external libraries (Lenis / GSAP) fail to load or motion is reduced.
   ========================================================================== */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = window.matchMedia("(min-width: 861px)").matches;
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setYear();
    initImageFallbacks();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initReveals();
    initMethodSteps();
    initBeforeAfter();
    initShopFilter();
    initCommitmentScale();
    initForm();
    initCheckout();
    initCursor();
    initMarqueeDuplicate();
    // Signal the inline failsafe that the reveal system is live (keeps content
    // armed for animation). If this never runs, the failsafe reveals everything.
    window.__ttReady = true;
  }

  /* ---------- Checkout links ----------
     Paste your Stripe Payment Link / Gumroad / Lemon Squeezy URL for each
     product key below. Until a key has a URL, its button reveals a short
     "contact to purchase" note instead of a broken/fake checkout.          */
  const CHECKOUT_LINKS = {
    // One-off services
    "training-blueprint": "",   // Taylored Training Blueprint — $199
    "nutrition-blueprint": "",  // Taylored Nutrition Blueprint — $199
    "total-blueprint": "",      // Total Performance Blueprint — $349
    "strategy-session": "",     // 90-Minute Performance Strategy Session — $175 (Calendly/Stripe)
    // Digital products
    "beast-mode-manual": "",    // The Beast Mode Training Manual — $39
    "eat-like-you-mean-it": "", // Eat Like You Mean It — $29
    "supplement-guide": "",     // The Supplement Guide — $19
    "12-week-blueprint": "",    // The 12-Week Beast Mode Blueprint — $49
  };

  function initCheckout() {
    $$("[data-checkout]").forEach((btn) => {
      on(btn, "click", (e) => {
        const key = btn.getAttribute("data-checkout");
        const url = CHECKOUT_LINKS[key];
        if (url) { window.location.href = url; return; }
        // No link configured yet — reveal the contact note, don't fake a purchase
        e.preventDefault();
        const card = btn.closest(".offer, .product, [data-buy-scope]") || btn.parentElement;
        if (card) card.classList.add("is-note-shown");
      });
    });
  }

  /* ---------- Footer year ---------- */
  function setYear() {
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---------- Image fallback (labeled placeholders) ----------
     Any <img data-fallback="LABEL"> that fails to load reveals a
     styled placeholder showing the intended filename. Drop the real
     file in place later and it just works.                        */
  function initImageFallbacks() {
    $$("img[data-fallback]").forEach((img) => {
      const label = img.getAttribute("data-fallback") || "";
      const isLogo = /logo/i.test(label);
      const fail = () => {
        if (isLogo) {
          // Show the "TAYLORED." wordmark instead of a hatched photo box
          const box = img.closest(".brand, .footer-brand") || img.parentElement;
          if (!box) return;
          box.classList.add("logo-missing");
          let wm = box.querySelector(".brand__fallback");
          if (!wm) {
            wm = document.createElement("span");
            wm.className = "brand__fallback";
            wm.setAttribute("aria-hidden", "true");
            wm.innerHTML = "TAYLORED<b>.</b>";
            box.prepend(wm);
          }
          return;
        }
        const holder = img.closest(".media, .product__media, .ba__img, [data-media]") || img.parentElement;
        if (!holder) return;
        holder.classList.add("img-fallback");
        holder.setAttribute("data-label", label);
      };
      if (img.complete && img.naturalWidth === 0) fail();
      on(img, "error", fail);
    });
  }

  /* ---------- Sticky header (scroll state + hide on scroll down) ---------- */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 40);
      if (!document.body.classList.contains("menu-open")) {
        header.classList.toggle("is-hidden", y > 300 && y > last);
      }
      last = y;
    };
    on(window, "scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    const burger = $(".burger");
    const menu = $(".mobile-menu");
    if (!burger || !menu) return;
    const toggle = (force) => {
      const open = force !== undefined ? force : !document.body.classList.contains("menu-open");
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
      document.documentElement.style.overflow = open ? "hidden" : "";
    };
    on(burger, "click", () => toggle());
    $$(".mobile-menu__link, .mobile-menu a.btn").forEach((a) => on(a, "click", () => toggle(false)));
    on(document, "keydown", (e) => { if (e.key === "Escape") toggle(false); });
  }

  /* ---------- Smooth scroll via Lenis (optional) ---------- */
  function initSmoothScroll() {
    if (prefersReduced || typeof window.Lenis === "undefined") {
      enableAnchorScroll(false);
      return;
    }
    try {
      const lenis = new window.Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });
      window.__lenis = lenis;
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);

      // Bridge to GSAP ScrollTrigger if present
      if (window.gsap && window.ScrollTrigger) {
        lenis.on("scroll", window.ScrollTrigger.update);
      }
      enableAnchorScroll(true, lenis);
    } catch (e) {
      enableAnchorScroll(false);
    }
  }

  function enableAnchorScroll(hasLenis, lenis) {
    $$('a[href^="#"]').forEach((a) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      on(a, "click", (e) => {
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (hasLenis && lenis) lenis.scrollTo(target, { offset: -70 });
        else target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      });
    });
  }

  /* ---------- Scroll reveals ----------
     Prefer GSAP ScrollTrigger; fall back to IntersectionObserver. */
  function initReveals() {
    const items = $$("[data-reveal], .reveal-lines");
    if (!items.length) return;

    if (prefersReduced) { items.forEach((el) => el.classList.add("in")); return; }

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      items.forEach((el) => {
        window.ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => el.classList.add("in"),
        });
      });
      // Subtle hero parallax on the subject + red halo
      const heroSubject = $(".hero__subject, .hero__media");
      if (heroSubject) {
        window.gsap.to(heroSubject, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });
      }
      const heroGlow = $(".hero__glow");
      if (heroGlow) {
        window.gsap.to(heroGlow, {
          yPercent: -14,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });
      }
      // Full-bleed editorial band parallax
      $$(".editorial-band__media img").forEach((el) => {
        window.gsap.to(el, {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: el.closest(".editorial-band"), start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      return;
    }

    // Fallback: IntersectionObserver
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        }),
        { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
      );
      items.forEach((el) => io.observe(el));
    } else {
      items.forEach((el) => el.classList.add("in"));
    }
  }

  /* ---------- The Method: highlight active step on scroll ---------- */
  function initMethodSteps() {
    const steps = $$(".method__step");
    const index = $(".method__index");
    if (!steps.length) return;
    const labels = steps.map((s) => s.getAttribute("data-index") || "01");

    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            steps.forEach((s) => s.classList.add("is-dim"));
            en.target.classList.remove("is-dim");
            if (index) index.textContent = labels[steps.indexOf(en.target)];
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    steps.forEach((s) => io.observe(s));
  }

  /* ---------- Before / After sliders ---------- */
  function initBeforeAfter() {
    $$(".ba").forEach((ba) => {
      const after = $(".ba__after", ba);
      const handle = $(".ba__handle", ba);
      const range = $('input[type="range"]', ba);
      if (!after || !range) return;
      const apply = (v) => {
        after.style.clipPath = `inset(0 0 0 ${v}%)`;
        if (handle) handle.style.left = `${v}%`;
      };
      apply(range.value || 50);
      on(range, "input", () => apply(range.value));
      // keyboard already works via range input
    });
  }

  /* ---------- Shop category filter ---------- */
  function initShopFilter() {
    const chips = $$(".chip[data-filter]");
    const products = $$(".product[data-cat]");
    if (!chips.length || !products.length) return;
    chips.forEach((chip) =>
      on(chip, "click", () => {
        const f = chip.getAttribute("data-filter");
        chips.forEach((c) => c.classList.toggle("is-active", c === chip));
        products.forEach((p) => {
          const show = f === "all" || p.getAttribute("data-cat") === f;
          p.style.display = show ? "" : "none";
        });
      })
    );
  }

  /* ---------- Commitment scale (range readout) ---------- */
  function initCommitmentScale() {
    const range = $("#commitment");
    const out = $("#commitment-val");
    if (!range || !out) return;
    const update = () => (out.textContent = range.value);
    on(range, "input", update);
    update();
  }

  /* ---------- Application form: validation + submit ----------
     Set the endpoint in FORM_ENDPOINT below (Formspree / Web3Forms /
     custom API / CRM webhook). Until then it validates + simulates.   */
  const FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

  function initForm() {
    const form = $("#application-form");
    if (!form) return;
    const status = $("#form-status", form) || $("#form-status");

    const showFieldError = (field, msg) => {
      const wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.add("field--error");
      const err = $(".field__error", wrap);
      if (err && msg) err.textContent = msg;
    };
    const clearError = (field) => {
      const wrap = field.closest(".field");
      if (wrap) wrap.classList.remove("field--error");
    };

    $$("input, select, textarea", form).forEach((f) =>
      on(f, "input", () => clearError(f))
    );

    on(form, "submit", async (e) => {
      e.preventDefault();
      let ok = true;
      let firstBad = null;

      $$("[required]", form).forEach((field) => {
        const val = (field.value || "").trim();
        let valid = !!val;
        if (field.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (!valid) { ok = false; showFieldError(field, "This field is required."); firstBad = firstBad || field; }
      });

      if (!ok) {
        if (firstBad) firstBad.focus();
        if (status) { status.className = "form-status is-error"; status.textContent = "Please complete the highlighted fields before submitting."; }
        return;
      }

      const btn = $('button[type="submit"]', form);
      const btnLabel = btn ? btn.querySelector(".btn__label") : null;
      const original = btnLabel ? btnLabel.textContent : "";
      if (btnLabel) btnLabel.textContent = "Sending…";
      if (btn) btn.disabled = true;

      try {
        if (FORM_ENDPOINT) {
          const res = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(form),
          });
          if (!res.ok) throw new Error("Bad response");
        } else {
          // No endpoint configured yet — simulate success for the demo.
          await new Promise((r) => setTimeout(r, 900));
          console.info("[Taylored Transformations] FORM_ENDPOINT is not set in assets/js/main.js. Connect Formspree / Web3Forms / your CRM webhook to receive applications.");
        }
        form.reset();
        if (status) {
          status.className = "form-status is-success";
          status.textContent = "Application received. Andrew reviews every application personally — expect a reply within 48 hours.";
          status.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
        }
      } catch (err) {
        if (status) {
          status.className = "form-status is-error";
          status.textContent = "Something went wrong sending your application. Please email andrew@tayloredtransformations.ca and we'll sort it out.";
        }
      } finally {
        if (btnLabel) btnLabel.textContent = original;
        if (btn) btn.disabled = false;
      }
    });
  }

  /* ---------- Custom cursor (desktop, fine pointer only) ---------- */
  function initCursor() {
    if (!isDesktop || !hasFinePointer || prefersReduced) return;
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.append(dot, ring);
    document.body.classList.add("has-cursor");

    let rx = 0, ry = 0, tx = 0, ty = 0;
    on(window, "mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
    });
    const loop = () => {
      rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$("a, button, .ba, input, select, textarea").forEach((el) => {
      on(el, "mouseenter", () => ring.classList.add("is-hover"));
      on(el, "mouseleave", () => ring.classList.remove("is-hover"));
    });
  }

  /* ---------- Duplicate marquee content for seamless loop ---------- */
  function initMarqueeDuplicate() {
    $$(".marquee__track").forEach((track) => {
      if (track.dataset.dup) return;
      track.dataset.dup = "1";
      track.innerHTML += track.innerHTML;
    });
  }
})();
