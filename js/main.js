/* ═══════════════════════════════════════════════════
   PISTASIEN — main.js
   GSAP + ScrollTrigger + Lenis + SplitType
═══════════════════════════════════════════════════ */

(() => {
  "use strict";

  /* ── 0. REGISTER GSAP PLUGINS ─────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────────────────
     1. LOADER ANIMATION
  ───────────────────────────────────────────────── */
  function initLoader() {
    const loader   = document.getElementById("loader");
    const brand    = document.getElementById("loader-brand");
    const bar      = document.getElementById("loader-bar");
    const loaderTx = document.getElementById("loader-text");

    // Manually split brand text
    const text = brand.textContent.trim();
    brand.innerHTML = "";
    text.split("").forEach(char => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      brand.appendChild(span);
    });
    const chars = brand.querySelectorAll("span");

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        loader.style.display = "none";
        document.body.style.overflow = "";
        initHeroAnimation();
      }
    });

    // Subtly scale background elements for cinematic depth
    tl.fromTo(loader, 
      { scale: 1 },
      { scale: 1.05, duration: 2.5, ease: "sine.inOut" }, 
      0
    );

    // 1. Text Animation with stagger
    tl.fromTo(chars, 
      { y: 40, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.4, stagger: 0.08, ease: "power3.out" },
      0.2
    );

    // 2. Progress Line (Trailing Effect + Pulse)
    tl.fromTo(bar,
      { x: "-100%" },
      { x: "0%", duration: 2, ease: "power4.inOut" },
      0.4
    );
    tl.to(bar, {
      opacity: 0.4,
      duration: 0.5,
      yoyo: true,
      repeat: 3,
      ease: "power1.inOut"
    }, 0.4);

    // 4. Secondary Text Fade with letter spacing expansion
    tl.fromTo(loaderTx,
      { opacity: 0, letterSpacing: "0.1em" },
      { opacity: 1, letterSpacing: "0.3em", duration: 1.5, ease: "power3.out" },
      0.7
    );

    // Exit Animation (Scale to 1.1, slide up)
    tl.to(loader, {
      scale: 1.1,
      duration: 1.1,
      ease: "power3.inOut"
    }, "+=0.3")
    .to(loader, {
      yPercent: -100,
      duration: 1.5,
      ease: "power4.inOut"
    }, "-=0.4");
  }

  /* ─────────────────────────────────────────────────
     2. LENIS SMOOTH SCROLL
  ───────────────────────────────────────────────── */
  function initLenis() {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return lenis;
  }

  /* ─────────────────────────────────────────────────
     3. NAVBAR SCROLL BEHAVIOR
  ───────────────────────────────────────────────── */
  function initNavbar() {
    const nav = document.getElementById("navbar");
    ScrollTrigger.create({
      start: "80px top",
      onEnter:    () => nav.classList.add("scrolled"),
      onLeaveBack:() => nav.classList.remove("scrolled"),
    });
  }

  /* ─────────────────────────────────────────────────
     4. HERO CINEMATIC ENTRANCE
  ───────────────────────────────────────────────── */
  function initHeroAnimation() {
    /* Scale bg image 1.2→1 */
    gsap.to(".hero-bg-img", {
      scale: 1,
      duration: 2.2,
      ease: "expo.out",
    });

    /* Split title lines into chars */
    const titleLines = document.querySelectorAll(".hero-title .split-line");
    const split = new SplitType(titleLines, { types: "chars" });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.from(split.chars, {
        yPercent: 110,
        opacity: 0,
        stagger: { amount: 0.8, from: "start" },
        duration: 1.5,
      }, 0.2)
      .to("#hero-eyebrow", { opacity: 1, y: 0, duration: 1.2 }, 0.5)
      .to("#hero-sub",     { opacity: 1, y: 0, duration: 1.2 }, 0.75)
      .to("#hero-cta-wrap",{ opacity: 1, y: 0, duration: 1.2 }, 0.95)
      .to("#hero-scroll-hint", { opacity: 1, duration: 1.1 }, 1.3);
  }

  /* ─────────────────────────────────────────────────
     5. SCROLL REVEAL — all .reveal-section elements
  ───────────────────────────────────────────────── */
  function initScrollReveals() {
    const reveals = document.querySelectorAll(".reveal-section");
    reveals.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    });
  }

  /* ─────────────────────────────────────────────────
     6. MARQUEE — infinite loop
  ───────────────────────────────────────────────── */
  function initMarquee() {
    const track = document.getElementById("marquee-track");

    gsap.fromTo(track, 
      { xPercent: 0 },
      {
        xPercent: -50,
        duration: 30,
        ease: "none",
        repeat: -1
      }
    );
  }

  /* ─────────────────────────────────────────────────
     7. CATEGORY CARDS — GSAP hover timelines
  ───────────────────────────────────────────────── */
  function initCategoryCards() {
    document.querySelectorAll(".cat-card").forEach((card) => {
      const img     = card.querySelector(".cat-card-img");
      const overlay = card.querySelector(".cat-card-overlay");
      const title   = card.querySelector(".cat-card-title");
      const link    = card.querySelector(".cat-card-link");

      const tl = gsap.timeline({ paused: true });
      tl.to(img,     { scale: 1.08, duration: 1.4, ease: "expo.out" }, 0)
        .to(overlay, { opacity: 1,  duration: 1.1, ease: "power2.out" }, 0)
        .to(title,   { y: -6, duration: 1.1, ease: "expo.out" }, 0.05)
        .to(link,    { color: "#7a9e4e", duration: 0.8 }, 0);

      card.addEventListener("mouseenter", () => tl.play());
      card.addEventListener("mouseleave", () => tl.reverse());
    });
  }

  /* ─────────────────────────────────────────────────
     8. PRODUCT CARDS — 3D tilt + secondary image
  ───────────────────────────────────────────────── */
  function initProductCards() {
    document.querySelectorAll(".prod-card").forEach((card) => {
      const wrap    = card.querySelector(".prod-img-wrap");
      const img2    = card.querySelector(".prod-img-2");
      const actions = card.querySelector(".prod-actions");

      card.addEventListener("mouseenter", () => {
        gsap.to(img2,    { opacity: 1, duration: 0.8 });
        gsap.to(actions, { y: 0,       duration: 0.8, ease: "expo.out" });
        gsap.to(wrap,    { boxShadow: "0 24px 48px rgba(26,26,20,0.22)", duration: 0.8 });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(img2,    { opacity: 0, duration: 0.4 });
        gsap.to(actions, { y: "100%",  duration: 0.35, ease: "power3.in" });
        gsap.to(wrap,    { boxShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.4 });
        gsap.to(wrap,    { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out" });
      });

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;
        const rx   = ((y / rect.height) - 0.5) * -10;
        const ry   = ((x / rect.width)  - 0.5) * 10;
        gsap.to(wrap, {
          rotateX: rx, rotateY: ry,
          transformPerspective: 800,
          duration: 0.5, ease: "power2.out",
        });
      });
    });
  }

  /* ─────────────────────────────────────────────────
     9. HORIZONTAL SCROLL — TRENDING (GSAP pin)
  ───────────────────────────────────────────────── */
  function initHorizontalScroll() {
    const wrapper = document.getElementById("h-scroll-wrapper");
    const track   = document.getElementById("h-scroll-track");
    const cards   = track.querySelectorAll(".trend-card");

    const totalScroll = track.scrollWidth - wrapper.offsetWidth;

    gsap.to(track, {
      x: () => -totalScroll,
      ease: "none",
      scrollTrigger: {
        trigger: "#trending",
        pin: true,
        scrub: 1.5,
        end: () => `+=${totalScroll}`,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (cards.length - 1),
          duration: { min: 0.8, max: 1.5 },
          ease: "expo.out",
        },
      },
    });
  }

  /* ─────────────────────────────────────────────────
     10. PARALLAX SECTION
  ───────────────────────────────────────────────── */
  function initParallax() {
    gsap.to("#parallax-bg", {
      yPercent: 25,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });
  }

  /* ─────────────────────────────────────────────────
     11. PAGE TRANSITIONS — anchor clicks
  ───────────────────────────────────────────────── */
  function initPageTransitions() {
    const overlay = document.getElementById("page-overlay");

    document.querySelectorAll('a[href^="http"], a[href^="//"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        e.preventDefault();
        gsap.to(overlay, {
          scaleY: 1,
          transformOrigin: "bottom",
          duration: 1.1,
          ease: "expo.inOut",
          onComplete: () => { window.location.href = href; },
        });
      });
    });

    /* Fade-in on page load (after loader) */
    gsap.fromTo(overlay,
      { scaleY: 1, transformOrigin: "top" },
      { scaleY: 0, duration: 0.6, ease: "power3.inOut", delay: 0.1 }
    );
  }

  /* ─────────────────────────────────────────────────
     LOGO IMAGE FALLBACK — if no logo file, use SVG
  ───────────────────────────────────────────────── */
  function setLogoFallback() {
    document.querySelectorAll('img[src="assets/images/logo.png"]').forEach((img) => {
      img.onerror = () => {
        img.style.display = "none";
        const sibling = img.parentElement;
        if (!sibling.querySelector(".logo-text-fallback")) {
          const span = document.createElement("span");
          span.className = "logo-text-fallback";
          span.textContent = "PISTASIEN";
          span.style.cssText =
            "font-family:'Cormorant',serif;font-size:1.2rem;letter-spacing:0.2em;color:inherit;";
          sibling.appendChild(span);
        }
      };
    });
  }

  /* ─────────────────────────────────────────────────
     12. CUSTOM CURSOR & MAGNETIC ZONES
  ───────────────────────────────────────────────── */
  function initCustomCursor() {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if(isTouch) return;

    const cur  = document.getElementById('cur');
    const ring = document.getElementById('cur-ring');
    if (!cur || !ring) return;

    /* ── Cursor follow (Smooth Lerp Optimization) ── */
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    
    gsap.set([cur, ring], { xPercent: -50, yPercent: -50 });
    const curX = gsap.quickTo(cur, "x", { duration: 0.1, ease: 'power3.out' });
    const curY = gsap.quickTo(cur, "y", { duration: 0.1, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: 'power3.out' });

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      curX(mx);
      curY(my);
      ringX(mx);
      ringY(my);
    });

    /* ── Hover state & Push/Pull button scale ── */
    const hoverTargets = 'a, button, .cat-card, .prod-card, .trend-card, [data-antigravity]';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => {
         document.body.classList.add('cur-hover');
         gsap.to(el, { scale: 1.03, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      });
      el.addEventListener('mouseleave', () => {
         document.body.classList.remove('cur-hover');
         gsap.to(el, { scale: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      });
    });

    /* ── ANTIGRAVITY ARROWS ── */
    const REPEL_RADIUS = 90;   // px
    const FORCE        = 2.2;  // repulsion strength
    const DAMPING      = 0.70; // velocity decay
    const SPRING       = 0.09; // snap back to origin
    const MAX_DIST     = 30;   // SUBTLE: reduced max displacement

    const agArrows = [...document.querySelectorAll('[data-antigravity]')].map(el => {
      gsap.set(el, { display: "inline-block" }); // Ensure transforms apply accurately
      const xTo = gsap.quickTo(el, "x", { duration: 0.2, ease: "power2.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.2, ease: "power2.out" });
      const rotTo = gsap.quickTo(el, "rotation", { duration: 0.3, ease: "power2.out" });
      const scaleTo = gsap.quickTo(el, "scale", { duration: 0.2, ease: "power2.out" });

      return {
        el, x: 0, y: 0, vx: 0, vy: 0,
        xTo, yTo, rotTo, scaleTo,
        docLeft: 0, docTop: 0, w: 0, h: 0
      };
    });

    // High performance bound caching (avoids getBoundingClientRect on scroll/mousemove)
    const updateBounds = () => {
       agArrows.forEach(a => {
          gsap.set(a.el, { x: 0, y: 0, rotation: 0, scale: 1 });
          const b = a.el.getBoundingClientRect();
          a.w = b.width;
          a.h = b.height;
          a.docLeft = b.left + window.scrollX;
          a.docTop = b.top + window.scrollY;
          gsap.set(a.el, { x: a.x, y: a.y }); 
       });
    };
    window.addEventListener("resize", updateBounds);
    setTimeout(updateBounds, 250); // initial cache
    
    function tickArrows() {
      const sx = window.scrollX;
      const sy = window.scrollY;

      agArrows.forEach(a => {
        const cx = (a.docLeft - sx) + a.w / 2;
        const cy = (a.docTop - sy)  + a.h / 2;

        const dx   = cx - mx;
        const dy   = cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetGlow = 0;

        /* Repulsion when cursor is close (incorporating edge falloff) */
        if (dist < REPEL_RADIUS && dist > 0) {
          let norm = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          let power = gsap.parseEase("sine.inOut")(norm) * FORCE;
          
          a.vx -= (dx / dist) * power;
          a.vy -= (dy / dist) * power;
          targetGlow = power;
        }

        /* Physics */
        a.vx += -a.x * SPRING;
        a.vy += -a.y * SPRING;
        a.vx *= DAMPING;
        a.vy *= DAMPING;

        a.x = Math.max(-MAX_DIST, Math.min(MAX_DIST, a.x + a.vx));
        a.y = Math.max(-MAX_DIST, Math.min(MAX_DIST, a.y + a.vy));

        /* Rendering */
        a.xTo(a.x);
        a.yTo(a.y);

        /* Velocity effects */
        const mag = Math.sqrt(a.x * a.x + a.y * a.y);
        const rot = Math.atan2(a.y, a.x) * (180 / Math.PI);
        
        a.scaleTo(1 + mag * 0.005); // Tiny scale change based on velocity

        if (mag > 1) {
          a.rotTo(rot * 0.08); // Reduced intensity rotation
        } else {
          a.rotTo(0);
        }
        
        /* Glow Feedback */
        if (targetGlow > (FORCE * 0.5)) {
           gsap.to(a.el, { 
               color: "#a4d36b", 
               filter: "drop-shadow(0 0 8px rgba(164,211,107,0.6))", 
               duration: 0.3,
               overwrite: "auto"
           });
        } else {
           gsap.to(a.el, { 
               clearProps: "color,filter", 
               duration: 0.5,
               overwrite: "auto"
           });
        }
      });
      requestAnimationFrame(tickArrows);
    }

    if (agArrows.length) tickArrows();
  }

  /* ─────────────────────────────────────────────────
     14. FLOWING MENU INJECTION
  ───────────────────────────────────────────────── */
  function initFlowingMenu() {
    const wrap = document.getElementById("flowing-menu-overlay");
    const openBtn = document.getElementById("nav-flowing-btn");
    const closeBtn = document.getElementById("close-flowing-menu");
    if (!wrap || !openBtn || !closeBtn) return;

    openBtn.addEventListener("click", () => {
      wrap.style.opacity = "1";
      wrap.style.pointerEvents = "auto";
    });
    closeBtn.addEventListener("click", () => {
      wrap.style.opacity = "0";
      wrap.style.pointerEvents = "none";
    });

    const items = document.querySelectorAll(".flowing-menu__item");
    const speed = 15;
    const animationDefaults = { duration: 1.1, ease: "expo.out" };

    const distMetric = (x, y, x2, y2) => {
      const xDiff = x - x2;
      const yDiff = y - y2;
      return xDiff * xDiff + yDiff * yDiff;
    };
    const findClosestEdge = (mouseX, mouseY, width, height) => {
      const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
      const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
      return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
    };

    items.forEach(item => {
      const link = item.querySelector(".flowing-menu__item-link");
      const text = item.getAttribute("data-text");
      const image = item.getAttribute("data-image");

      const marquee = document.createElement("div");
      marquee.className = "flowing-marquee";
      const innerWrap = document.createElement("div");
      innerWrap.className = "flowing-marquee__inner-wrap";
      const inner = document.createElement("div");
      inner.className = "flowing-marquee__inner";
      inner.setAttribute("aria-hidden", "true");
      
      innerWrap.appendChild(inner);
      marquee.appendChild(innerWrap);
      item.appendChild(marquee);

      let repetitions = 4;
      const generateParts = () => {
         inner.innerHTML = "";
         for(let i=0; i<repetitions; i++) {
           const part = document.createElement("div");
           part.className = "flowing-marquee__part";
           part.innerHTML = `<span>${text}</span><div class="flowing-marquee__img" style="background-image: url(${image})"></div>`;
           inner.appendChild(part);
         }
      };
      
      const calculateRepetitions = () => {
         generateParts(); // Initially dump 4 parts
         const part = inner.querySelector('.flowing-marquee__part');
         if (!part) return;
         const contentWidth = part.offsetWidth;
         const viewportWidth = window.innerWidth;
         if(contentWidth === 0) return;
         
         const needed = Math.ceil(viewportWidth / contentWidth) + 2;
         const finalRepetitions = Math.max(4, needed);
         if (finalRepetitions !== repetitions) {
            repetitions = finalRepetitions;
            generateParts();
         }
      };

      let animation = null;
      const setupMarquee = () => {
        calculateRepetitions();
        const part = inner.querySelector('.flowing-marquee__part');
        if(!part) return;
        const contentWidth = part.offsetWidth;
        if(contentWidth === 0) return;
        if(animation) animation.kill();
        
        animation = gsap.to(inner, {
          x: -contentWidth,
          duration: speed,
          ease: "none",
          repeat: -1
        });
      };
      
      setTimeout(setupMarquee, 100);
      window.addEventListener("resize", () => setTimeout(setupMarquee, 100));

      link.addEventListener("mouseenter", (ev) => {
        const rect = item.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const edge = findClosestEdge(x, y, rect.width, rect.height);

        gsap.timeline({ defaults: animationDefaults })
            .set(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
            .set(inner, { y: edge === 'top' ? '101%' : '-101%' }, 0)
            .to([marquee, inner], { y: '0%' }, 0);
      });

      link.addEventListener("mouseleave", (ev) => {
        const rect = item.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const edge = findClosestEdge(x, y, rect.width, rect.height);

        gsap.timeline({ defaults: animationDefaults })
            .to(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
            .to(inner, { y: edge === 'top' ? '101%' : '-101%' }, 0);
      });
      
      // Update cursor hover logic explicitly for FlowingMenu items so cursor expands over them
      link.addEventListener("mouseenter", () => document.body.classList.add('cur-hover'));
      link.addEventListener("mouseleave", () => document.body.classList.remove('cur-hover'));
    });
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  function init() {
    setLogoFallback();
    initCustomCursor();
    initFlowingMenu();
    initLoader();
    initLenis();
    initNavbar();
    initScrollReveals();
    initMarquee();
    initCategoryCards();
    initProductCards();
    initHorizontalScroll();
    initParallax();
    initPageTransitions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
