"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Rooms", href: "/rooms" },
  { label: "Experience", href: "/experience" },
  { label: "Location", href: "/location" },
  { label: "FAQ", href: "/faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-plymouth-forest/95 backdrop-blur-md shadow-xl border-b border-plymouth-cream/10"
            : "bg-gradient-to-b from-plymouth-forest-deep/80 to-transparent"
        }`}
      >
        <nav className="section-padding max-w-container-lg mx-auto flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <Image
              src="/brand/plymouth-mark.png"
              alt="The Plymouth Chicago"
              width={140}
              height={140}
              priority
              className="h-12 w-auto md:h-14"
            />
            <span className="hidden sm:block font-display text-lg md:text-xl text-plymouth-cream tracking-[0.18em] uppercase leading-none">
              The Plymouth
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-plymouth-cream/70 text-xs font-body uppercase tracking-[0.2em] hover:text-plymouth-cream transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Book Now CTA — always visible */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="/#booking"
              className={`px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 ${
                scrolled
                  ? "bg-plymouth-brass text-plymouth-forest-deep hover:bg-plymouth-cream"
                  : "bg-plymouth-cream/10 backdrop-blur-sm border border-plymouth-cream/30 text-plymouth-cream hover:bg-plymouth-brass hover:border-plymouth-brass hover:text-plymouth-forest-deep"
              }`}
            >
              Book Now
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span className={`block w-5 h-px bg-plymouth-cream transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`block w-5 h-px bg-plymouth-cream transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-px bg-plymouth-cream transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-plymouth-forest-deep z-40 flex flex-col items-center justify-center gap-10 transition-all duration-500 lg:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <Image
          src="/brand/plymouth-mark.png"
          alt="The Plymouth Chicago"
          width={180}
          height={180}
          className="h-24 w-auto mb-2 opacity-90"
        />
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="text-plymouth-cream font-display text-4xl tracking-wider hover:text-plymouth-brass transition-colors"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            {link.label}
          </Link>
        ))}
        <a
          href="/#booking"
          onClick={() => setMobileOpen(false)}
          className="mt-4 px-10 py-4 bg-plymouth-brass text-plymouth-forest-deep text-sm uppercase tracking-[0.2em] font-medium hover:bg-plymouth-cream transition-colors"
        >
          Book Now
        </a>
      </div>

      {/* Floating Book Now — appears on scroll, bottom of screen mobile */}
      <div className={`fixed bottom-6 right-6 z-40 lg:hidden transition-all duration-500 ${scrolled && !mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <a
          href="/#booking"
          className="flex items-center gap-2 bg-plymouth-brass text-plymouth-forest-deep px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold shadow-2xl hover:bg-plymouth-cream transition-colors"
        >
          Book Now
        </a>
      </div>
    </>
  );
}
