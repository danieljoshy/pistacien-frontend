import type { Metadata } from "next";
import Script from "next/script";
import { TransitionOverlay } from "@/components/PageTransition/PageTransition";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import CartDrawer from "@/components/Cart/CartDrawer";
import CustomCursor from "@/components/Cursor/CustomCursor";
import GlobalEffects from "@/components/Layout/GlobalEffects";
import FlowingMenu from "@/components/Navbar/FlowingMenu";
import BackToTop from "@/components/BackToTop/BackToTop";

export const metadata: Metadata = {
  title: "Pistasien Clothing - New Collection",
  description:
    "Pistasien Clothing - Discover the new collection. Luxury fashion crafted for the modern soul.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/style.css?v=9" />
      </head>
      <body>
        <CartProvider>
          {/* Global singleton GSAP setups */}
          <GlobalEffects />
          <CustomCursor />
          <BackToTop />
          
          {/* Legacy navigation overlay container */}
          <TransitionOverlay />
          
          <Navbar />
          <FlowingMenu />
          
          {children}
          
          <Footer />
          <CartDrawer />
        </CartProvider>

        {/* Keeping GSAP scripts as a reliable CDN fallback for the underlying `gsap` obj initialization, 
            but all custom logic is now cleanly isolated in React hooks. */}
        <Script
          src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
