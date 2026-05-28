"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Image from "next/image";
import { TransitionLink } from "@/components/PageTransition/PageTransition";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MENS_PRODUCTS = [
  {
    pid: "m1",
    name: "Double-Breasted Wool Coat",
    sub: "Midnight Blue",
    category: "Coats",
    price: "$890",
    img1: "https://images.unsplash.com/photo-1544441893-675973e31985?w=700&q=80",
    img2: "https://images.unsplash.com/photo-1592878904946-b3cd8ae2438cb?w=700&q=80",
  },
  {
    pid: "m2",
    name: "Classic Silk Shirt",
    sub: "Noir",
    category: "Shirts",
    price: "$240",
    img1: "https://images.unsplash.com/photo-1596392927852-2a42166c40e1?w=700&q=80",
    img2: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&q=80",
  },
  {
    pid: "m3",
    name: "Tailored Linen Trousers",
    sub: "Sand",
    category: "Trousers",
    price: "$320",
    img1: "https://images.unsplash.com/photo-1624378439575-d10cabcbc768?w=700&q=80",
    img2: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=700&q=80",
  },
  {
    pid: "m4",
    name: "Cashmere Turtleneck",
    sub: "Charcoal",
    category: "Shirts",
    price: "$450",
    img1: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700&q=80",
    img2: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&q=80",
  },
  {
    pid: "m5",
    name: "Leather Oxford Shoes",
    sub: "Cognac",
    category: "Shoes",
    price: "$510",
    img1: "https://images.unsplash.com/photo-1614252339475-533eea802cbb?w=700&q=80",
    img2: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&q=80",
  },
  {
    pid: "m6",
    name: "Minimalist Chronograph",
    sub: "Silver / Black",
    category: "Accessories",
    price: "$280",
    img1: "https://images.unsplash.com/photo-1524592094714-a57ee11b5ac8?w=700&q=80",
    img2: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=700&q=80",
  }
];

export default function MensPage() {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");

  useEffect(() => {
    // Custom GSAP entrance for the men's page elements
    const tl = gsap.timeline();
    tl.fromTo(".men-hero-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.3);
    tl.fromTo(".men-hero-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.5);
    tl.fromTo(".men-toolbar", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.7);

    // Initial scale effect for the men's hero model image
    gsap.fromTo(
      ".men-hero-img",
      { scale: 1.1 },
      { scale: 1, duration: 2, ease: "power2.out" }
    );

    const reveals = document.querySelectorAll(".men-reveal");
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    });
  }, [filter, sort]);

  return (
    <>
      {/* ═══ MEN'S COLLECTION HERO ═══ */}
      <section className="men-hero" style={{ position: "relative", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "var(--cream)", marginTop: "4rem" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1544441893-675973e31985?w=1800&q=80"
            alt="Men's Collection"
            fill
            className="men-hero-img"
            style={{ objectFit: "cover", objectPosition: "top center" }}
            priority
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(26,26,20,0.35)" }}></div>
        </div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff", padding: "0 2rem" }}>
          <p className="men-hero-sub" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            The New Standard
          </p>
          <h1 className="men-hero-title" style={{ fontFamily: "var(--font-head)", fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 600, letterSpacing: "-0.01em" }}>
            Men's Collection
          </h1>
        </div>
      </section>

      {/* ═══ FILTER & PRODUCTS GRID ═══ */}
      <section className="section-pad">
        <div className="container">
          
          {/* Toolbar */}
          <div className="men-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(26,26,20,0.1)" }}>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <select 
                style={{ background: "transparent", border: "none", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", outline: "none", fontFamily: "var(--font-body)" }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Coats">Coats</option>
                <option value="Shirts">Shirts</option>
                <option value="Trousers">Trousers</option>
                <option value="Shoes">Shoes</option>
              </select>
            </div>
            <div>
              <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--warm-gray)", marginRight: "1rem" }}>Sort By:</span>
              <select 
                style={{ background: "transparent", border: "none", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", outline: "none", fontFamily: "var(--font-body)" }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="Newest">Newest</option>
                <option value="PriceLowHigh">Price: Low to High</option>
                <option value="PriceHighLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Men's Grid */}
          <div className="products-grid">
            {MENS_PRODUCTS
              .filter(p => filter === "All" || p.category === filter)
              .sort((a, b) => {
                if (sort === "Newest") return 0;
                const priceA = parseInt(a.price.replace("$", ""));
                const priceB = parseInt(b.price.replace("$", ""));
                return sort === "PriceLowHigh" ? priceA - priceB : priceB - priceA;
              })
              .map(({ pid, name, sub, price, img1, img2 }) => (
              <div className="prod-card men-reveal" data-pid={pid} key={pid}>
                <div className="prod-img-wrap">
                  <Image
                    src={img1}
                    alt={name}
                    width={400}
                    height={500}
                    className="prod-img prod-img-1"
                    style={{ objectFit: "cover" }}
                  />
                  <Image
                    src={img2}
                    alt={`${name} back`}
                    width={400}
                    height={500}
                    className="prod-img prod-img-2"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="prod-actions">
                    <button className="prod-btn-wish" aria-label="Wishlist">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
