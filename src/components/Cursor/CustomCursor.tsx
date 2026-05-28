"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Media Query Check for touch devices
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice || !curRef.current || !ringRef.current) return;

    const cur = curRef.current;
    const ring = ringRef.current;

    // Use QuickTo for maximum performance and avoiding "resetTo" warnings
    const xToCur = gsap.quickTo(cur, "x", { duration: 0.8, ease: "power3" });
    const yToCur = gsap.quickTo(cur, "y", { duration: 0.8, ease: "power3" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.15, ease: "power3" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.15, ease: "power3" });

    // Initial position
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    gsap.set([cur, ring], { xPercent: -50, yPercent: -50, x: mouse.x, y: mouse.y });

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      xToCur(mouse.x);
      yToCur(mouse.y);
      xToRing(mouse.x);
      yToRing(mouse.y);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Hover elements setup
    const updateHoverStates = () => {
      const hoverTargets = "a, button, .cat-card, .prod-card, .trend-card, [data-antigravity]";
      document.querySelectorAll(hoverTargets).forEach((el) => {
        if (el.matches(".auth-back-home") || (el as any)._hasCursorEvent) return;
        (el as any)._hasCursorEvent = true;

        el.addEventListener("mouseenter", () => {
          document.body.classList.add("cur-hover");
          gsap.to(el, { scale: 1.03, duration: 0.4, ease: "power2.out", overwrite: "auto" });
        });
        el.addEventListener("mouseleave", () => {
          document.body.classList.remove("cur-hover");
          gsap.to(el, { scale: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
        });
      });
    };

    // Run once, and run on DOM updates
    updateHoverStates();
    const observer = new MutationObserver((mutations) => {
      updateHoverStates();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Antigravity Setup
    const REPEL_RADIUS = 90;
    const FORCE = 2.2;
    const DAMPING = 0.70;
    const SPRING = 0.09;
    const MAX_DIST = 30;

    let agArrows = Array.from(document.querySelectorAll<HTMLElement>("[data-antigravity]:not(.auth-back-home)")).map(el => {
      gsap.set(el, { display: "inline-block" });
      const b = el.getBoundingClientRect();
      return {
        el,
        x: 0, y: 0, vx: 0, vy: 0,
        docLeft: b.left + window.scrollX,
        docTop: b.top + window.scrollY,
        w: b.width, h: b.height,
        isGlowing: false,
        xSet: gsap.quickSetter(el, "x", "px"),
        ySet: gsap.quickSetter(el, "y", "px"),
        rotSet: gsap.quickSetter(el, "rotation", "deg"),
        scaleSet: gsap.quickSetter(el, "scale")
      };
    });

    const updateBounds = () => {
      agArrows.forEach(a => {
        gsap.set(a.el, { clearProps: "all" });
        const b = a.el.getBoundingClientRect();
        a.w = b.width;
        a.h = b.height;
        a.docLeft = b.left + window.scrollX;
        a.docTop = b.top + window.scrollY;
        // Re-apply display inline-block
        gsap.set(a.el, { display: "inline-block" });
      });
    };

    window.addEventListener("resize", updateBounds);
    
    // Refresh bounds after navigation routing resolves
    setTimeout(updateBounds, 300);

    let tickerActive = true;
    const tickArrows = () => {
      if (!tickerActive) return;
      const sx = window.scrollX;
      const sy = window.scrollY;

      agArrows.forEach(a => {
        const cx = (a.docLeft - sx) + a.w / 2;
        const cy = (a.docTop - sy) + a.h / 2;
        const dx = cx - mouse.x;
        const dy = cy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetGlow = 0;
        if (dist < REPEL_RADIUS && dist > 0) {
          let norm = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          let power = gsap.parseEase("sine.inOut")(norm) * FORCE;
          a.vx -= (dx / dist) * power;
          a.vy -= (dy / dist) * power;
          targetGlow = power;
        }

        a.vx += -a.x * SPRING;
        a.vy += -a.y * SPRING;
        a.vx *= DAMPING;
        a.vy *= DAMPING;

        a.x = Math.max(-MAX_DIST, Math.min(MAX_DIST, a.x + a.vx));
        a.y = Math.max(-MAX_DIST, Math.min(MAX_DIST, a.y + a.vy));

        const MathMag = Math.sqrt(a.x * a.x + a.y * a.y);
        const rotation = (MathMag > 1) ? (Math.atan2(a.y, a.x) * (180 / Math.PI) * 0.08) : 0;
        const scale = 1 + MathMag * 0.005;

        // Use quickSetter to avoid scale not eligible for reset warnings!
        a.xSet(a.x);
        a.ySet(a.y);
        a.rotSet(rotation);
        a.scaleSet(scale);

        const shouldGlow = targetGlow > (FORCE * 0.5);
        if (shouldGlow && !a.isGlowing) {
          a.isGlowing = true;
          gsap.to(a.el, { color: "#a4d36b", filter: "drop-shadow(0 0 8px rgba(164,211,107,0.6))", duration: 0.3, overwrite: "auto" });
        } else if (!shouldGlow && a.isGlowing) {
          a.isGlowing = false;
          gsap.to(a.el, { clearProps: "color,filter", duration: 0.5, overwrite: "auto" });
        }
      });
      requestAnimationFrame(tickArrows);
    };

    if (agArrows.length) {
      requestAnimationFrame(tickArrows);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", updateBounds);
      observer.disconnect();
      tickerActive = false;
    };
  }, [pathname]);

  return (
    <>
      <div id="cur" ref={curRef}></div>
      <div id="cur-ring" ref={ringRef}></div>
    </>
  );
}
