"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import gsap from "gsap";
import Image from "next/image";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, subtotal } = useCart();
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  
  // Create persistent timelines for open/close to avoid re-creation issues
  const openTl = useRef<gsap.core.Timeline | null>(null);
  const closeTl = useRef<gsap.core.Timeline | null>(null);

  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  useEffect(() => {
    // Prep initial states
    gsap.set(panelRef.current, { xPercent: 100 });
    gsap.set(overlayRef.current, { autoAlpha: 0 });

    openTl.current = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    openTl.current
      .to(overlayRef.current, { autoAlpha: 1, duration: 0.4 }, 0)
      .to(panelRef.current, { xPercent: 0, duration: 0.58 }, 0);

    closeTl.current = gsap.timeline({ paused: true, defaults: { duration: 0.46, ease: "power3.out" } });
    closeTl.current
      .to(panelRef.current, { xPercent: 100 }, 0)
      .to(overlayRef.current, { autoAlpha: 0, duration: 0.38 }, 0);
      
    // Cleanup timelines on unmount
    return () => {
      openTl.current?.kill();
      closeTl.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (!openTl.current || !closeTl.current) return;
    
    if (isOpen) {
      document.body.classList.add("cart-open");
      rootRef.current?.classList.add("is-open");
      rootRef.current?.setAttribute("aria-hidden", "false");
      closeTl.current.pause();
      openTl.current.restart();
      
      // Animate items in
      gsap.fromTo(
        ".cart-item",
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.45, ease: "power3.out", delay: 0.22 }
      );
    } else {
      openTl.current.pause();
      closeTl.current.restart().then(() => {
        rootRef.current?.classList.remove("is-open");
        rootRef.current?.setAttribute("aria-hidden", "true");
        document.body.classList.remove("cart-open");
      });
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, closeCart]);

  return (
    <div id="cart-root" aria-live="polite" aria-hidden="true" style={{ zIndex: 9999 }} ref={rootRef}>
      <div className="cart-overlay" onClick={closeCart} ref={overlayRef}></div>
      <aside className="cart-panel" role="dialog" aria-modal={true} aria-labelledby="cart-title" ref={panelRef}>
        <header className="cart-header">
          <h2 id="cart-title">Your Cart</h2>
          <button type="button" className="cart-close-btn" onClick={closeCart} aria-label="Close cart">
            &times;
          </button>
        </header>
        <div className="cart-body" data-lenis-prevent="">
          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            <ul id="cart-items" className="cart-items">
              {items.map((item) => (
                <li className="cart-item" data-id={item.id} key={item.id}>
                  <div className="cart-item-media">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <div className="cart-item-main">
                    <div className="cart-item-top">
                      <p className="cart-item-name">{item.name}</p>
                      <button 
                        type="button" 
                        className="cart-remove-btn" 
                        aria-label="Remove item"
                        onClick={() => removeFromCart(item.id)}
                      >
                        X
                      </button>
                    </div>
                    <p className="cart-item-variant">{item.variant}</p>
                    <div className="cart-item-bottom">
                      <div className="cart-qty">
                        <button type="button" className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.qty - 1)}>-</button>
                        <span className="cart-qty-val">{item.qty}</span>
                        <button type="button" className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
                      </div>
                      <div className="cart-item-price">{money.format(item.price * item.qty)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <footer className="cart-footer">
          <div className="cart-subtotal-row">
            <span>Grand Total</span>
            <strong>{money.format(subtotal)}</strong>
          </div>
          <a href="/checkout" className="cart-btn cart-btn-primary">
            Proceed to Checkout
          </a>
        </footer>
      </aside>
    </div>
  );
}
