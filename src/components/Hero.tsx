import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-end justify-start bg-plymouth-black overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/living-gray-mural.jpg"
        alt="Plymouth Hotel suite"
        fill
        className="object-cover scale-105 animate-hero-zoom"
        priority
        quality={90}
      />

      {/* Multi-layer overlay — forest tint for warmth */}
      <div className="absolute inset-0 bg-gradient-to-t from-plymouth-forest-deep via-plymouth-forest-deep/55 to-plymouth-forest-deep/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-plymouth-forest-deep/70 via-transparent to-transparent" />

      {/* Content — bottom-left editorial style */}
      <div className="relative z-10 section-padding max-w-container-lg mx-auto w-full pb-24 pt-40">
        <div className="max-w-3xl animate-fade-up">
          <Image
            src="/brand/plymouth-mark.png"
            alt="The Plymouth Chicago"
            width={160}
            height={160}
            priority
            className="h-20 md:h-24 w-auto mb-6 opacity-95"
          />
          <p className="text-plymouth-brass font-body text-xs uppercase tracking-[0.4em] mb-6">
            417 S Dearborn &nbsp;·&nbsp; Chicago Loop &nbsp;·&nbsp; Est. 1899
          </p>
          <h1 className="font-display text-display-xl text-plymouth-cream mb-8 leading-[0.95] tracking-tight">
            Chicago Has Hotels.
            <br />
            <span className="text-plymouth-brass">Plymouth</span> Is Different.
          </h1>
          <p className="text-plymouth-cream/70 text-lg md:text-xl font-body max-w-xl mb-12 leading-relaxed">
            2, 3 &amp; 4 bedroom suites in a century-old landmark building.
            Apartment-style living. Instant booking.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href="/#booking"
              className="inline-flex items-center gap-3 bg-plymouth-brass text-plymouth-forest-deep px-8 py-4 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-plymouth-cream transition-all duration-300 group"
            >
              Reserve Your Suite
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="/rooms"
              className="inline-flex items-center gap-3 border border-plymouth-cream/30 text-plymouth-cream px-8 py-4 text-sm uppercase tracking-[0.2em] hover:border-plymouth-brass hover:text-plymouth-brass transition-all duration-300"
            >
              Explore Rooms
            </a>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-plymouth-cream/10">
        <div className="section-padding max-w-container-lg mx-auto grid grid-cols-3 md:grid-cols-5 divide-x divide-plymouth-cream/10">
          {[
            { value: "30", label: "Suites" },
            { value: "2–11", label: "Floors" },
            { value: "1899", label: "Built" },
            { value: "2BR–4BR", label: "Sizes" },
            { value: "Loop", label: "Location" },
          ].map((stat) => (
            <div key={stat.label} className="py-5 px-4 text-center hidden md:block first:block last:block">
              <p className="font-display text-xl text-plymouth-cream">{stat.value}</p>
              <p className="text-xs text-plymouth-cream/40 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-2">
        <span className="text-plymouth-cream/30 text-xs uppercase tracking-[0.3em] rotate-90 mb-8">Scroll</span>
        <div className="w-px h-20 bg-gradient-to-b from-plymouth-brass/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
