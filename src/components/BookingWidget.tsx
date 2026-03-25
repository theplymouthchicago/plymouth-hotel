"use client";

import { useEffect } from "react";

export function BookingWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.guesty.com/widget.js";
    script.setAttribute("data-id", "abc123");
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="py-section section-padding bg-plymouth-offwhite" id="booking">
      <div className="max-w-container mx-auto">
        <div className="text-center mb-12">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Reserve
          </p>
          <h2 className="font-display text-display-md text-plymouth-black mb-4">
            Book Direct. Best Rate.
          </h2>
          <p className="text-plymouth-charcoal text-lg max-w-xl mx-auto">
            Skip the third-party fees. Book directly for the best available rate and flexible terms.
          </p>
        </div>
        {/* Guesty widget renders here */}
        <div id="guesty-booking-widget" className="min-h-[400px]" />
      </div>
    </section>
  );
}
