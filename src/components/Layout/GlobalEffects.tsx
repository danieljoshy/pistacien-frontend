"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GlobalEffects() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    // We instantiate it once and manage its lifecycle to prevent multiple instances on navigation.
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Provide lenis to window object for legacy script interoperability (like back-to-top)
    (window as any).lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      Reflect.deleteProperty(window, 'lenis');
    };
  }, []); // Run only once globally

  useEffect(() => {
    // 2. Global Route Changes Reactions
    // - Refresh scroll triggers
    // - Close flowing menu overlay (re-simulate navigation reset)
    // - Close cart if open
    
    ScrollTrigger.refresh();
    document.body.classList.remove("cart-open");
    document.body.classList.remove("cur-hover");

    // Smooth entry overlay logic from initPageTransitions
    const overlay = document.getElementById("page-overlay");
    if (overlay) {
      gsap.fromTo(
        overlay,
        { scaleY: 1, transformOrigin: "top" },
        { scaleY: 0, duration: 0.6, ease: "power3.inOut", delay: 0.1 }
      );
    }
  }, [pathname]);

  return <div id="page-overlay" />;
}
