"use client";

import { useEffect } from "react";

export function BookingWidget() {
  useEffect(() => {
    // Load Guesty Search Bar CSS (same integration as thedreamrentals.com)
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href =
      "https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.css";
    link.media = "all";
    document.head.appendChild(link);

    // Load Guesty Search Bar JS
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <section
      className="py-section section-padding bg-plymouth-offwhite"
      id="booking"
    >
      <div className="max-w-container mx-auto">
        <div className="text-center mb-12">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Reserve
          </p>
          <h2 className="font-display text-display-md text-plymouth-black mb-4">
            Book Direct. Best Rate.
          </h2>
          <p className="text-plymouth-charcoal text-lg max-w-xl mx-auto">
            Skip the third-party fees. Book directly for the best available rate
            and flexible terms.
          </p>
        </div>

        {/* Guesty Search Bar Widget — same integration as thedreamrentals.com */}
        <div
          id="search-widget_IO312PWQ"
          className="guesty-root-element guesty-widget__container"
        />
      </div>
    </section>
  );
}
