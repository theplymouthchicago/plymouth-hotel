"use client";

import Script from "next/script";
import { useEffect } from "react";

export function BookingWidget() {
  useEffect(() => {
    // Guesty widget calls window.open() which mobile browsers block as a popup.
    // Intercept it and navigate in-tab instead.
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

    const buildBookingUrl = () => {
      const checkIn = (document.querySelector(".__super-input.check-in") as HTMLInputElement)?.value;
      const checkOut = (document.querySelector(".__super-input.check-out") as HTMLInputElement)?.value;
      const city = (document.querySelector(".guesty-root-element select") as HTMLSelectElement)?.value || "Chicago";

      const params = new URLSearchParams({ city, country: "United+States" });
      if (checkIn) params.set("checkIn", checkIn);
      if (checkOut) params.set("checkOut", checkOut);
      return `${SITE_URL}/en/properties?${params.toString()}`;
    };

    const setup = () => {
      const picker = document.querySelector(".lightpick") as HTMLElement;
      const submitBtn = document.querySelector(".guesty-search-submit-btn") as HTMLElement;
      if (!picker || !submitBtn) return false;

      // Prevent Lightpick from hiding the calendar while user is selecting dates
      observer = new MutationObserver(() => {
        if (isSelecting && picker.classList.contains("is-hidden")) {
          picker.classList.remove("is-hidden");
        }
      });

      observer.observe(picker, {
        attributes: true,
        attributeFilter: ["class"],
      });

      clickHandler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isCalendarClick =
          target.closest(".lightpick") ||
          target.closest(".__super-input") ||
          target.closest(".guesty-search-widget__datepicker");

        isSelecting = !!isCalendarClick;
      };

      // Capture-phase handler fires before Guesty's handler.
      // Navigate directly so mobile browsers never see window.open().
      submitHandler = (e: Event) => {
        e.stopPropagation();
        window.location.href = buildBookingUrl();
      };

      document.addEventListener("click", clickHandler);
      submitBtn.addEventListener("click", submitHandler, { capture: true });
      return true;
    };

    const interval = setInterval(() => {
      if (setup()) clearInterval(interval);
    }, 500);

    return () => {
      window.open = originalOpen;
      clearInterval(interval);
      observer?.disconnect();
      if (clickHandler) document.removeEventListener("click", clickHandler);
      const submitBtn = document.querySelector(".guesty-search-submit-btn");
      if (submitBtn && submitHandler) {
        submitBtn.removeEventListener("click", submitHandler, { capture: true });
      }
    };
  }, []);

  return (
    <section className="py-section section-padding bg-plymouth-black relative" id="booking">
      {/* Subtle gold accent */}
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

        {/* Guesty Search Bar Widget */}
        <div className="max-w-4xl mx-auto">
          <div
            id="search-widget_IO312PWQ"
            className="guesty-root-element guesty-widget__container"
          />
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

      {/* Guesty Search Bar Script */}
      <Script
        id="guesty-search-bar"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
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
          `,
        }}
      />
    </section>
  );
}
