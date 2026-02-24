"use client";
import gsap from "gsap";
import { useEffect, useState } from "react";

interface HamburgerMenuProps {
  /** Override nav items. Defaults to the same links as Hero. */
  items?: { label: string; href: string; target?: string }[];
}

const DEFAULT_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Brochure", href: "#brochure" },
  { label: "Point Table", href: "totalpoints" },
  { label: "Arts", href: "arts" },
  { label: "Sports", href: "sports" },
  { label: "Gallery", href: "https://cucekphotographyclub.club/", target: "_blank" },
];

export default function HamburgerMenu({ items = DEFAULT_ITEMS }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";

      gsap.to(".hm-overlay", {
        clipPath: "circle(150% at 50% 50%)",
        duration: 0.8,
        ease: "power4.inOut",
      });

      gsap.to(".hm-close-btn", {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.4,
      });

      gsap.to(".hm-menu-item", {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.to(".hm-tagline", {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.5,
      });

      // Hamburger → X
      gsap.to(".hm-line1", { rotation: 45, y: 8, backgroundColor: "#ffffff", duration: 0.3, ease: "power2.inOut" });
      gsap.to(".hm-line2", { opacity: 0, duration: 0.2, ease: "power2.inOut" });
      gsap.to(".hm-line3", { rotation: -45, y: -8, backgroundColor: "#ffffff", duration: 0.3, ease: "power2.inOut" });
    } else {
      document.body.style.overflow = "";

      gsap.to(".hm-close-btn", { y: 50, opacity: 0, duration: 0.3, ease: "power3.in" });

      gsap.to(".hm-menu-item", {
        y: 50,
        opacity: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: "power3.in",
      });

      gsap.to(".hm-tagline", { y: 50, opacity: 0, duration: 0.3, ease: "power3.in" });

      gsap.to(".hm-overlay", {
        clipPath: "circle(0% at 50% 50%)",
        duration: 0.8,
        ease: "power4.inOut",
        delay: 0.2,
      });

      // X → Hamburger
      gsap.to(".hm-line1", { rotation: 0, y: 0, backgroundColor: "#ffffff", duration: 0.3, ease: "power2.inOut" });
      gsap.to(".hm-line2", { opacity: 1, duration: 0.2, ease: "power2.inOut", delay: 0.1 });
      gsap.to(".hm-line3", { rotation: 0, y: 0, backgroundColor: "#ffffff", duration: 0.3, ease: "power2.inOut" });
    }
  }, [open]);

  return (
    <>
      {/* ── Full-page overlay ─────────────────────────────────────────────── */}
      <div
        className="hm-overlay fixed inset-0 bg-white z-[100] flex items-center justify-center"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        {/* Close button (inside overlay, top-right) */}
        <button
          onClick={toggleMenu}
          className="hm-close-btn absolute top-8 right-8 md:top-12 md:right-12 w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-black hover:bg-black transition-all duration-300 flex items-center justify-center opacity-0 translate-y-12 group"
        >
          <div className="relative w-6 h-6 md:w-8 md:h-8">
            <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-black group-hover:bg-white -translate-x-1/2 -translate-y-1/2 rotate-45 transition-colors duration-300" />
            <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-black group-hover:bg-white -translate-x-1/2 -translate-y-1/2 -rotate-45 transition-colors duration-300" />
          </div>
        </button>

        {/* Tagline — bottom left */}
        <div className="hm-tagline absolute bottom-8 left-8 md:bottom-12 md:left-12 text-black opacity-0 translate-y-12">
          <p className="text-sm md:text-base italic" style={{ fontFamily: "Astila-Regular" }}>
            Beyond Boundaries
          </p>
          <p className="text-sm md:text-base italic" style={{ fontFamily: "Astila-Regular" }}>
            Now. Here. SATTVA.
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col items-center justify-center gap-2">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.target}
              className="hm-menu-item text-black text-4xl md:text-6xl lg:text-7xl font-bold hover:text-gray-600 transition-colors opacity-0 translate-y-12"
              style={{ fontFamily: "Astila-Regular" }}
              onClick={toggleMenu}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* ── Hamburger button ──────────────────────────────────────────────── */}
      <button
        onClick={toggleMenu}
        className="fixed top-6 right-6 z-[50] bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
      >
        <div className="flex flex-col gap-[6px] w-6">
          <div className="hm-line1 h-[2px] w-full bg-white rounded-full" />
          <div className="hm-line2 h-[2px] w-full bg-white rounded-full" />
          <div className="hm-line3 h-[2px] w-full bg-white rounded-full" />
        </div>
      </button>
    </>
  );
}