"use client";

import { TransitionLink } from "@/components/PageTransition/PageTransition";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { toggleCart, totalItems } = useCart();

  return (
    <nav id="navbar">
      <div
        className="nav-left-cluster"
        style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
      >
        <button
          className="nav-icon-btn"
          id="nav-flowing-btn"
          aria-label="Open Menu"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <TransitionLink href="/" className="nav-logo" id="nav-logo-link">
          <Image
            src="/images/logo.png"
            alt="Pistasien"
            width={34}
            height={34}
            className="nav-logo-img"
          />
        </TransitionLink>
      </div>
      <ul className="nav-links">
        <li>
          <TransitionLink href="/#collections">Collections</TransitionLink>
        </li>
        <li>
          <TransitionLink href="/#trending">Trending</TransitionLink>
        </li>
        <li>
          <TransitionLink href="/#featured">Featured</TransitionLink>
        </li>
        <li>
          <TransitionLink href="/#products">Shop</TransitionLink>
        </li>
      </ul>
      <div className="nav-actions">
        <button className="nav-icon-btn" aria-label="Search" id="btn-search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
        <button 
          className="nav-icon-btn" 
          aria-label="Cart" 
          id="btn-cart"
          onClick={toggleCart}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span className="cart-badge" style={{ display: totalItems > 0 ? "inline-flex" : "none" }}>
            {totalItems}
          </span>
        </button>
      </div>
      <button
        className="nav-hamburger"
        id="nav-hamburger"
        aria-label="Menu"
      >
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}
