"use client";

import { useEffect, useRef } from "react";

export default function BackToTop() {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handleScroll = () => {
      btn.classList.toggle("is-visible", window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    const handleClick = () => {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    btn.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      btn.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <button id="back-to-top" aria-label="Back to top" ref={btnRef}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  );
}
