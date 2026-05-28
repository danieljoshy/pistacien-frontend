"use client";

import { useRef, useEffect } from "react";
import { TransitionLink } from "@/components/PageTransition/PageTransition";
import gsap from "gsap";

export default function FlowingMenu() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = overlayRef.current;
    if (!wrap) return;

    const openBtn = document.getElementById("nav-flowing-btn");
    const closeBtn = document.getElementById("close-flowing-menu");

    const open = () => {
      wrap.style.opacity = "1";
      wrap.style.pointerEvents = "auto";
    };
    const close = () => {
      wrap.style.opacity = "0";
      wrap.style.pointerEvents = "none";
    };

    openBtn?.addEventListener("click", open);
    closeBtn?.addEventListener("click", close);

    const animDefaults = { duration: 1.1, ease: "expo.out" };
    const speed = 15;

    const distMetric = (x: number, y: number, x2: number, y2: number) => {
      const dx = x - x2, dy = y - y2;
      return dx * dx + dy * dy;
    };

    const findClosestEdge = (mx: number, my: number, w: number, h: number) =>
      distMetric(mx, my, w / 2, 0) < distMetric(mx, my, w / 2, h) ? "top" : "bottom";

    wrap.querySelectorAll<HTMLElement>(".flowing-menu__item").forEach((item) => {
      const link = item.querySelector(".flowing-menu__item-link");
      const text = item.dataset.text || "";
      const image = item.dataset.image || "";
      if (!link) return;

      const marquee = document.createElement("div");
      marquee.className = "flowing-marquee";
      const innerWrap = document.createElement("div");
      innerWrap.className = "flowing-marquee__inner-wrap";
      const inner = document.createElement("div");
      inner.className = "flowing-marquee__inner";
      innerWrap.appendChild(inner);
      marquee.appendChild(innerWrap);
      item.appendChild(marquee);

      const buildParts = (reps: number) => {
        inner.innerHTML = "";
        for (let i = 0; i < reps; i++) {
          const p = document.createElement("div");
          p.className = "flowing-marquee__part";
          p.innerHTML = `<span>${text}</span><div class="flowing-marquee__img" style="background-image:url(${image})"></div>`;
          inner.appendChild(p);
        }
      };

      let anim: gsap.core.Tween | null = null;
      const setup = () => {
        buildParts(4);
        const part = inner.querySelector<HTMLElement>(".flowing-marquee__part");
        if (!part) return;
        const w = part.offsetWidth;
        if (!w) return;
        const reps = Math.max(4, Math.ceil(window.innerWidth / w) + 2);
        buildParts(reps);
        anim?.kill();
        anim = gsap.to(inner, { x: -w, duration: speed, ease: "none", repeat: -1 });
      };
      setTimeout(setup, 100);
      window.addEventListener("resize", () => setTimeout(setup, 100));

      link.addEventListener("mouseenter", (ev) => {
        const e = ev as MouseEvent;
        const r = item.getBoundingClientRect();
        const edge = findClosestEdge(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
        gsap.timeline({ defaults: animDefaults })
          .set(marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
          .set(inner, { y: edge === "top" ? "101%" : "-101%" }, 0)
          .to([marquee, inner], { y: "0%" }, 0);
      });

      link.addEventListener("mouseleave", (ev) => {
        const e = ev as MouseEvent;
        const r = item.getBoundingClientRect();
        const edge = findClosestEdge(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
        gsap.timeline({ defaults: animDefaults })
          .to(marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
          .to(inner, { y: edge === "top" ? "101%" : "-101%" }, 0);
      });
    });

    return () => {
      openBtn?.removeEventListener("click", open);
      closeBtn?.removeEventListener("click", close);
    };
  }, []);

  return (
    <div
      id="flowing-menu-overlay"
      className="flowing-menu-wrap"
      ref={overlayRef}
      style={{ opacity: 0, pointerEvents: "none" }}
    >
      <button
        id="close-flowing-menu"
        className="nav-icon-btn"
        aria-label="Close menu"
        style={{ position: "absolute", top: "1.5rem", right: "2.5rem", zIndex: 10000, color: "var(--cream)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <nav className="flowing-menu">
        <div className="flowing-menu__item" data-text="Home" data-image="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80">
          <TransitionLink className="flowing-menu__item-link" href="/">Home</TransitionLink>
        </div>
        <div className="flowing-menu__item" data-text="Men" data-image="https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80">
          <TransitionLink className="flowing-menu__item-link" href="/men">Men</TransitionLink>
        </div>
        <div className="flowing-menu__item" data-text="Login" data-image="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80">
          <TransitionLink className="flowing-menu__item-link" href="/auth">Login</TransitionLink>
        </div>
        <div className="flowing-menu__item" data-text="About" data-image="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&q=80">
          <a className="flowing-menu__item-link" href="#">About</a>
        </div>
      </nav>
    </div>
  );
}
