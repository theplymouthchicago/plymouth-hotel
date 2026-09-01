"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GUESTY_HOST = "https://theplymouthchicago.guestybookings.com";

// Primary listing IDs per floorplan — goes to property detail page
// (bypasses search results which use window.open() on mobile)
const LISTINGS: Record<string, string> = {
  "2": "69b8610659a0a7001528058c",
  "3": "69b863afab91d0002330efdb",
  "4": "69b866a2139149001c905bfa",
};

export function BookingWidget() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [beds, setBeds] = useState("2");

  const today = new Date().toISOString().split("T")[0];
  const canBook = !!(checkIn && checkOut && checkOut > checkIn);

  const handleBook = () => {
    if (!canBook) return;
    const listingId = LISTINGS[beds];
    const params = new URLSearchParams({ checkIn, checkOut, minOccupancy: beds, adults: "2" });
    window.location.href = `${GUESTY_HOST}/en/properties/${listingId}?${params.toString()}`;
  };

  useEffect(() => {
    // Guesty desktop widget calls window.open() — intercept and navigate in-tab instead.
    const originalOpen = window.open.bind(window);
    window.open = (url?: string | URL, target?: string, features?: string) => {
      if (url && (target === "_blank" || target === undefined)) {
        window.location.href = url.toString();
        return null;
      }
      return originalOpen(url, target, features);
    };

    let observer: MutationObserver | null = null;
    let clickHandler: ((e: MouseEvent) => void) | null = null;
    let submitHandler: ((e: Event) => void) | null = null;
    let isSelecting = false;

    const SITE_URL = "https://theplymouthchicago.guestybookings.com";

    const toDateStr = (timestamp: string) => {
      const d = new Date(Number(timestamp));
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const buildBookingUrl = () => {
      const startEl = document.querySelector(".lightpick__day.is-start-date") as HTMLElement;
      const endEl = document.querySelector(".lightpick__day.is-end-date") as HTMLElement;
      const checkInVal = startEl?.dataset?.time
        ? toDateStr(startEl.dataset.time)
        : (document.querySelector(".__super-input.check-in") as HTMLInputElement)?.value || "";
      const checkOutVal = endEl?.dataset?.time
        ? toDateStr(endEl.dataset.time)
        : (document.querySelector(".__super-input.check-out") as HTMLInputElement)?.value || "";
      const city = (document.querySelector(".guesty-root-element select") as HTMLSelectElement)?.value || "Chicago";
      const params = new URLSearchParams({ city, country: "United States" });
      if (checkInVal) params.set("checkIn", checkInVal);
      if (checkOutVal) params.set("checkOut", checkOutVal);
      return `${SITE_URL}/en/properties?${params.toString()}`;
    };

    const setupSubmit = () => {
      const submitBtn = document.querySelector(".guesty-search-submit-btn") as HTMLElement;
      if (!submitBtn || submitHandler) return false;
      submitHandler = (e: Event) => {
        const target = e.target as HTMLElement;
        if (!target) return;
        const btn = document.querySelector(".guesty-search-submit-btn");
        if (target !== btn && !target.closest(".guesty-search-submit-btn")) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        window.location.href = buildBookingUrl();
      };
      document.addEventListener("click", submitHandler, { capture: true });
      document.addEventListener("touchend", submitHandler, { capture: true });
      return true;
    };

    const setupPicker = () => {
      const picker = document.querySelector(".lightpick") as HTMLElement;
      if (!picker || observer) return false;
      observer = new MutationObserver(() => {
        if (isSelecting && picker.classList.contains("is-hidden")) {
          picker.classList.remove("is-hidden");
        }
      });
      observer.observe(picker, { attributes: true, attributeFilter: ["class"] });
      clickHandler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isCalendarClick =
          target.closest(".lightpick") ||
          target.closest(".__super-input") ||
          target.closest(".guesty-search-widget__datepicker");
        isSelecting = !!isCalendarClick;
      };
      document.addEventListener("click", clickHandler);
      return true;
    };

    const interval = setInterval(() => {
      setupSubmit();
      setupPicker();
      if (submitHandler && observer) clearInterval(interval);
    }, 300);

    return () => {
      window.open = originalOpen;
      clearInterval(interval);
      observer?.disconnect();
      if (clickHandler) document.removeEventListener("click", clickHandler);
      if (submitHandler) {
        document.removeEventListener("click", submitHandler, { capture: true });
        document.removeEventListener("touchend", submitHandler, { capture: true });
      }
    };
  }, []);

  return (
    <section className="py-section section-padding bg-plymouth-black relative" id="booking">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-plymouth-gold/30 to-transparent" />

      <div className="max-w-container mx-auto relative z-10">
        <div className="text-center mb-10">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Reserve
          </p>
          <h2 className="font-display text-display-md text-white mb-4">
            Book Direct. Best Rate.
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Skip the third-party fees. Book directly for the best available rate
            and flexible terms.
          </p>
        </div>

        {/* Guesty Search Bar Widget — desktop only */}
        <div className="hidden md:block max-w-4xl mx-auto">
          <div
            id="search-widget_IO312PWQ"
            className="guesty-root-element guesty-widget__container"
          />
        </div>

        {/* Mobile booking form — native inputs, navigates directly to property detail page */}
        <div className="md:hidden max-w-sm mx-auto">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-plymouth-gold mb-1.5">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => { setCheckIn(e.target.value); setCheckOut(""); }}
                className="w-full bg-white/10 border border-plymouth-gold/40 px-3 py-3 text-sm text-white focus:outline-none focus:border-plymouth-gold"
                style={{ colorScheme: "dark" }}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-plymouth-gold mb-1.5">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-white/10 border border-plymouth-gold/40 px-3 py-3 text-sm text-white focus:outline-none focus:border-plymouth-gold"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-plymouth-gold mb-1.5">
              Bedrooms
            </label>
            <select
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              className="w-full bg-white/10 border border-plymouth-gold/40 px-3 py-3 text-sm text-white focus:outline-none focus:border-plymouth-gold appearance-none"
              style={{ colorScheme: "dark" }}
            >
              <option value="2">2 Bedroom — up to 4 guests</option>
              <option value="3">3 Bedroom — up to 6 guests</option>
              <option value="4">4 Bedroom — up to 10 guests</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleBook}
            disabled={!canBook}
            className="w-full bg-plymouth-gold text-plymouth-black font-body font-semibold text-sm uppercase tracking-[0.2em] py-4 hover:bg-plymouth-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Availability →
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          Instant booking &middot; Secure checkout &middot; Best rate guaranteed
        </p>
      </div>

      {/* Guesty Search Bar CSS */}
      <link
        rel="stylesheet"
        href="https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.css"
      />

      {/* Guesty Search Bar Script — desktop only (md = 768px) */}
      <Script
        id="guesty-search-bar"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (window.innerWidth >= 768) {
              (function(e,t,a,n,c,r){
                function s(t){e.console.log("[Guesty Embedded Widget]:",t)}
                var i,d,l,o,y,m,g,h,p,u;
                o=function(){try{e[a].create(r).catch(function(e){s(e.message)})}catch(e){s(e.message)}};
                h=false;y=c;
                m=function(){h||this.readyState&&"complete"!=this.readyState||(h=true,o())};
                (g=t.createElement("script")).type="text/javascript";
                g.src=y;g.async="true";g.onload=g.onreadystatechange=m;
                p=g;(u=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,u);
              })(window,document,"GuestySearchBarWidget",null,
                "https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.js",
                {"siteUrl":"theplymouthchicago.guestybookings.com","color":"#c9a84c"});
            }
          `,
        }}
      />
    </section>
  );
}
