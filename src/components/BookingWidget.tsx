"use client";

import Script from "next/script";

export function BookingWidget() {
  return (
    <section className="py-section section-padding bg-plymouth-black relative overflow-hidden" id="booking">
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
