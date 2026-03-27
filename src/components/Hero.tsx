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

      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* Content — bottom-left editorial style */}
      <div className="relative z-10 section-padding max-w-container-lg mx-auto w-full pb-24 pt-40">
        <div className="max-w-3xl animate-fade-up">
          <p className="text-plymouth-gold font-body text-xs uppercase tracking-[0.4em] mb-6">
            417 S Dearborn &nbsp;·&nbsp; Chicago Loop &nbsp;·&nbsp; Est. 1899
          </p>
          <h1 className="font-display text-display-xl text-white mb-8 leading-[0.95] tracking-tight">
            Chicago Has Hotels.
            <br />
            <span className="text-plymouth-gold">Plymouth</span> Is Different.
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-body max-w-xl mb-12 leading-relaxed">
            2, 3 &amp; 4 bedroom suites in a century-old landmark building.
            Apartment-style living. Instant booking.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href="/#booking"
              className="inline-flex items-center gap-3 bg-plymouth-gold text-black px-8 py-4 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-white transition-all duration-300 group"
            >
              Reserve Your Suite
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="/rooms"
              className="inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 text-sm uppercase tracking-[0.2em] hover:border-plymouth-gold hover:text-plymouth-gold transition-all duration-300"
            >
              Explore Rooms
            </a>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10">
        <div className="section-padding max-w-container-lg mx-auto grid grid-cols-3 md:grid-cols-5 divide-x divide-white/10">
          {[
            { value: "18", label: "Suites" },
            { value: "6–11", label: "Floors" },
            { value: "1899", label: "Built" },
            { value: "2BR–4BR", label: "Sizes" },
            { value: "Loop", label: "Location" },
          ].map((stat) => (
            <div key={stat.label} className="py-5 px-4 text-center hidden md:block first:block last:block">
              <p className="font-display text-xl text-white">{stat.value}</p>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-2">
        <span className="text-white/30 text-xs uppercase tracking-[0.3em] rotate-90 mb-8">Scroll</span>
        <div className="w-px h-20 bg-gradient-to-b from-plymouth-gold/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
