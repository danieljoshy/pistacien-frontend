"use client";

/**
 * Home Page — src/app/page.tsx
 *
 * Converted from pages/index.html.
 * All GSAP animations, cursor, cart drawer, flowing menu, loader, etc.
 * are driven by /js/main.js (vanilla JS — temporary; to be migrated to React hooks).
 *
 * Hydration safety: useEffect ensures main.js runs only on the client after mount.
 * The Next.js <Script> with strategy="afterInteractive" handles the same guarantee.
 */

import { useEffect } from "react";
import Image from "next/image";
import { TransitionLink } from "@/components/PageTransition/PageTransition";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

export default function HomePage() {
  useEffect(() => {
    // 1. Initial Loader Animation (migrated from main.js)
    const loader = document.getElementById("loader");
    const brand = document.getElementById("loader-brand");
    const bar = document.getElementById("loader-bar");
    const loaderTx = document.getElementById("loader-text");

    if (loader && brand && bar && loaderTx) {
      const text = brand.textContent?.trim() || "";
      brand.innerHTML = "";
      text.split("").forEach((char) => {
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
        },
      });

      tl.fromTo(loader, { scale: 1 }, { scale: 1.05, duration: 2.5, ease: "sine.inOut" }, 0);
      tl.fromTo(chars, { y: 40, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.4, stagger: 0.08, ease: "power3.out" }, 0.2);
      tl.fromTo(bar, { x: "-100%" }, { x: "0%", duration: 2, ease: "power4.inOut" }, 0.4);
      tl.to(bar, { opacity: 0.4, duration: 0.5, yoyo: true, repeat: 3, ease: "power1.inOut" }, 0.4);
      tl.fromTo(loaderTx, { opacity: 0, letterSpacing: "0.1em" }, { opacity: 1, letterSpacing: "0.3em", duration: 1.5, ease: "power3.out" }, 0.7);
      
      tl.to(loader, { scale: 1.1, duration: 1.1, ease: "power3.inOut" }, "+=0.3")
        .to(loader, { yPercent: -100, duration: 1.5, ease: "power4.inOut" }, "-=0.4");
    } else {
      initHeroAnimation();
    }

    // 2. Hero Cinematic Entrance
    function initHeroAnimation() {
      gsap.to(".hero-bg-img", { scale: 1, duration: 2.2, ease: "expo.out" });

      const titleLines = document.querySelectorAll(".hero-title .split-line");
      const split = new SplitType(titleLines as NodeListOf<HTMLElement>, { types: "chars" });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      if (split.chars) {
        tl.from(split.chars, { yPercent: 110, opacity: 0, stagger: { amount: 0.8, from: "start" }, duration: 1.5 }, 0.2);
      }
      tl.to("#hero-eyebrow", { opacity: 1, y: 0, duration: 1.2 }, 0.5)
        .to("#hero-sub", { opacity: 1, y: 0, duration: 1.2 }, 0.75)
        .to("#hero-cta-wrap", { opacity: 1, y: 0, duration: 1.2 }, 0.95)
        .to("#hero-scroll-hint", { opacity: 1, duration: 1.1 }, 1.3);
    }

    // 3. Scroll Reveals
    const reveals = document.querySelectorAll(".reveal-section");
    reveals.forEach((el) => {
      gsap.to(el, { opacity: 1, y: 0, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    });

    // 4. Parallax
    if (document.getElementById("parallax-bg")) {
      gsap.to("#parallax-bg", { yPercent: 25, ease: "none", scrollTrigger: { trigger: ".parallax-section", start: "top bottom", end: "bottom top", scrub: 1.5 } });
    }

    // 5. Category Cards
    document.querySelectorAll(".cat-card").forEach((card) => {
      const img = card.querySelector(".cat-card-img");
      const overlay = card.querySelector(".cat-card-overlay");
      const title = card.querySelector(".cat-card-title");
      const link = card.querySelector(".cat-card-link");

      const tl = gsap.timeline({ paused: true });
      tl.to(img, { scale: 1.08, duration: 1.4, ease: "expo.out" }, 0)
        .to(overlay, { opacity: 1, duration: 1.1, ease: "power2.out" }, 0)
        .to(title, { y: -6, duration: 1.1, ease: "expo.out" }, 0.05)
        .to(link, { color: "#7a9e4e", duration: 0.8 }, 0);

      card.addEventListener("mouseenter", () => tl.play());
      card.addEventListener("mouseleave", () => tl.reverse());
    });

    // Refresh scroll trigger after DOM manipulation
    ScrollTrigger.refresh();
  }, []);
  return (
    <>
      {/* ═══ LOADER ═══ */}
      <div id="loader">
        <svg style={{ display: "none" }}>
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves={3}
              stitchTiles="stitch"
            />
          </filter>
        </svg>
        <div className="loader-noise"></div>
        <div className="loader-glow"></div>
        <div className="loader-inner">
          <div className="loader-brand" id="loader-brand">
            PISTASIEN
          </div>
          <div className="loader-bar-wrap">
            <div className="loader-bar" id="loader-bar"></div>
          </div>
          <p className="loader-text" id="loader-text">
            Loading Collection...
          </p>
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <section id="hero">
        <div className="hero-bg" id="hero-bg">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=80"
            alt="Hero"
            fill
            className="hero-bg-img"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="hero-bg-overlay"></div>
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow" id="hero-eyebrow">
            Spring / Summer 2025
          </p>
          <h1 className="hero-title" id="hero-title">
            <span className="split-line">Wear Your</span>
            <span className="split-line italic-gold">Story</span>
          </h1>
          <p className="hero-sub" id="hero-sub">
            Luxury fashion for the modern soul. Crafted with intention.
          </p>
          <div className="hero-cta-wrap" id="hero-cta-wrap">
            <a
              href="#collections"
              className="btn-primary btn-explore-transition"
            >
              Explore Collection{" "}
              <span
                data-antigravity=""
                style={{ display: "inline-block", marginLeft: "8px" }}
              >
                &rarr;
              </span>
            </a>
            <a href="#trending" className="btn-ghost">
              View Lookbook{" "}
              <span
                data-antigravity=""
                style={{ display: "inline-block", marginLeft: "8px" }}
              >
                &rarr;
              </span>
            </a>
          </div>
        </div>
        <div className="hero-scroll-hint" id="hero-scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div className="marquee-section" aria-hidden="true">
        <div className="marquee-track" id="marquee-track">
          <span>NEW COLLECTION</span>
          <span className="dot">·</span>
          <span>PISTASIEN</span>
          <span className="dot">·</span>
          <span>SS 2025</span>
          <span className="dot">·</span>
          <span>LUXURY FASHION</span>
          <span className="dot">·</span>
          <span>NEW COLLECTION</span>
          <span className="dot">·</span>
          <span>PISTASIEN</span>
          <span className="dot">·</span>
          <span>SS 2025</span>
          <span className="dot">·</span>
          <span>LUXURY FASHION</span>
          <span className="dot">·</span>
          <span>NEW COLLECTION</span>
          <span className="dot">·</span>
          <span>PISTASIEN</span>
          <span className="dot">·</span>
          <span>SS 2025</span>
          <span className="dot">·</span>
          <span>LUXURY FASHION</span>
          <span className="dot">·</span>
          {/* Half 2 */}
          <span>NEW COLLECTION</span>
          <span className="dot">·</span>
          <span>PISTASIEN</span>
          <span className="dot">·</span>
          <span>SS 2025</span>
          <span className="dot">·</span>
          <span>LUXURY FASHION</span>
          <span className="dot">·</span>
          <span>NEW COLLECTION</span>
          <span className="dot">·</span>
          <span>PISTASIEN</span>
          <span className="dot">·</span>
          <span>SS 2025</span>
          <span className="dot">·</span>
          <span>LUXURY FASHION</span>
          <span className="dot">·</span>
          <span>NEW COLLECTION</span>
          <span className="dot">·</span>
          <span>PISTASIEN</span>
          <span className="dot">·</span>
          <span>SS 2025</span>
          <span className="dot">·</span>
          <span>LUXURY FASHION</span>
          <span className="dot">·</span>
        </div>
      </div>

      {/* ═══ CATEGORIES ═══ */}
      <section id="collections" className="section-pad">
        <div className="container">
          <div className="section-header reveal-section">
            <p className="section-eyebrow">Curated for You</p>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className="categories-grid">
            {[
              {
                index: 0,
                title: "Women",
                href: "#",
                img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
              },
              {
                index: 1,
                title: "Men",
                href: "/men",
                img: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80",
              },
              {
                index: 2,
                title: "Accessories",
                href: "#",
                img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
              },
            ].map(({ index, title, href, img }) => (
              <div className="cat-card reveal-section" data-index={index} key={title}>
                <div className="cat-card-img-wrap">
                  <Image
                    src={img}
                    alt={title}
                    width={800}
                    height={1000}
                    className="cat-card-img"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="cat-card-overlay"></div>
                </div>
                <div className="cat-card-body">
                  <h3 className="cat-card-title">{title}</h3>
                  <TransitionLink href={href} className="cat-card-link">
                    Shop Now
                    <svg
                      data-antigravity=""
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </TransitionLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HORIZONTAL SCROLL — TRENDING ═══ */}
      <section id="trending" className="section-pad">
        <div className="container">
          <div className="section-header reveal-section">
            <p className="section-eyebrow">Right Now</p>
            <h2 className="section-title">Trending Pieces</h2>
          </div>
        </div>
        <div className="h-scroll-wrapper" id="h-scroll-wrapper">
          <div className="h-scroll-track" id="h-scroll-track">
            {[
              {
                pid: "t1",
                name: "Silk Blouse",
                price: "$189",
                img1: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
                img2: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
              },
              {
                pid: "t2",
                name: "Linen Trousers",
                price: "$245",
                img1: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
                img2: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
              },
              {
                pid: "t3",
                name: "Wool Coat",
                price: "$520",
                img1: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&q=80",
                img2: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
              },
              {
                pid: "t4",
                name: "Knit Dress",
                price: "$310",
                img1: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
                img2: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
              },
              {
                pid: "t5",
                name: "Satin Skirt",
                price: "$275",
                img1: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
                img2: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&q=80",
              },
            ].map(({ pid, name, price, img1, img2 }) => (
              <div className="trend-card" data-pid={pid} key={pid}>
                <div className="trend-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img1}
                    alt={name}
                    className="trend-img trend-img-primary"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img2}
                    alt={`${name} alt`}
                    className="trend-img trend-img-secondary"
                  />
                </div>
                <div className="trend-info">
                  <h4>{name}</h4>
                  <p className="trend-price">{price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARALLAX BANNER ═══ */}
      <section id="featured" className="parallax-section">
        <div className="parallax-bg" id="parallax-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=80"
            alt="Featured"
            className="parallax-img"
          />
        </div>
        <div className="parallax-content reveal-section">
          <p className="section-eyebrow light">The Edit</p>
          <h2 className="parallax-title">
            Crafted for
            <br />
            <em>Every Moment</em>
          </h2>
          <a href="#products" className="btn-primary">
            Discover the Edit{" "}
            <span
              data-antigravity=""
              style={{ display: "inline-block", marginLeft: "8px" }}
            >
              &rarr;
            </span>
          </a>
        </div>
      </section>

      {/* ═══ PRODUCTS GRID ═══ */}
      <section id="products" className="section-pad">
        <div className="container">
          <div className="section-header reveal-section">
            <p className="section-eyebrow">The Collection</p>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <div className="products-grid">
            {[
              {
                pid: "p1",
                name: "Cashmere Sweater",
                sub: "Espresso / Ivory",
                price: "$340",
                img1: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700&q=80",
                img2: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&q=80",
              },
              {
                pid: "p2",
                name: "Pleated Midi Dress",
                sub: "Sage / Stone",
                price: "$295",
                img1: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80",
                img2: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=80",
              },
              {
                pid: "p3",
                name: "Tailored Blazer",
                sub: "Charcoal / Camel",
                price: "$420",
                img1: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=80",
                img2: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=700&q=80",
              },
              {
                pid: "p4",
                name: "Classic Trench",
                sub: "Beige / Black",
                price: "$580",
                img1: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=80",
                img2: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700&q=80",
              },
            ].map(({ pid, name, sub, price, img1, img2 }) => (
              <div className="prod-card reveal-section" data-pid={pid} key={pid}>
                <div className="prod-img-wrap">
                  <Image
                    src={img1}
                    alt={name}
                    width={400}
                    height={500}
                    className="prod-img prod-img-1"
                    style={{ objectFit: 'cover' }}
                  />
                  <Image
                    src={img2}
                    alt={`${name} back`}
                    width={400}
                    height={500}
                    className="prod-img prod-img-2"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="prod-actions">
                    <button className="prod-btn-wish" aria-label="Wishlist">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </button>
                    <button className="prod-btn-cart">Add to Cart</button>
                  </div>
                </div>
                <div className="prod-info">
                  <h4 className="prod-name">{name}</h4>
                  <p className="prod-sub">{sub}</p>
                  <p className="prod-price">{price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
