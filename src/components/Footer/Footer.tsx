"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionLink } from "@/components/PageTransition/PageTransition";
import SplitType from "split-type";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    // Wordmark Entrance (Split chars)
    const wordmark = footer.querySelector<HTMLElement>(".footer-wordmark");
    if (wordmark) {
      const split = new SplitType(wordmark, { types: "chars" });
      if (split.chars) {
        gsap.fromTo(
          split.chars,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footer,
              start: "top 75%",
            },
          }
        );
      }
    }

    // Wrap Parallax
    gsap.to(".footer-wordmark-wrap", {
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: footer,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
      },
    });

    // Staggered columns
    const cols = footer.querySelectorAll(".footer-col");
    if (cols.length) {
      gsap.fromTo(cols,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: footer,
            start: "top 85%",
            once: true
          }
        }
      );
    }
  }, []);

  return (
    <footer className="site-footer" id="site-footer" ref={footerRef}>
      <div className="footer-divider"></div>
      <div className="footer-grid-wrap">
        <div className="container footer-grid">
          <div className="footer-col" data-footer-col="">
            <p className="footer-col-heading">Contact</p>
            <ul className="footer-col-list">
              <li><a href="#" className="footer-link">About Us</a></li>
              <li><a href="#" className="footer-link">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-col" data-footer-col="">
            <p className="footer-col-heading">Connect</p>
            <ul className="footer-col-list">
              <li><a href="#" className="footer-link">Instagram</a></li>
              <li><a href="#" className="footer-link">WhatsApp</a></li>
              <li><a href="#" className="footer-link">LinkedIn</a></li>
            </ul>
          </div>
          <div className="footer-col" data-footer-col="">
            <p className="footer-col-heading">Collections</p>
            <ul className="footer-col-list">
              <li><a href="#" className="footer-link">Women</a></li>
              <li><TransitionLink href="/men" className="footer-link">Men</TransitionLink></li>
              <li><a href="#" className="footer-link">Accessories</a></li>
              <li><a href="#" className="footer-link">Home</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-wordmark-wrap" data-footer-wordmark="">
        <span className="footer-wordmark">PISTASIEN</span>
      </div>
      <div className="footer-legal">
        <span className="footer-legal-copy">&copy; 2026 PISTASIEN</span>
        <div className="footer-legal-links">
          <a href="#" className="footer-legal-link">Privacy Policy</a>
          <span className="footer-legal-sep">&mdash;</span>
          <a href="#" className="footer-legal-link">Terms &amp; Conditions</a>
          <span className="footer-legal-sep">&mdash;</span>
          <a href="#" className="footer-legal-link">Return Policy</a>
        </div>
      </div>
    </footer>
  );
}
