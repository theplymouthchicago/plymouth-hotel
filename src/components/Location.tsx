import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";

const nearbySpots = [
  { name: "Millennium Park", distance: "5 min walk" },
  { name: "Chicago Riverwalk", distance: "7 min walk" },
  { name: "Art Institute", distance: "8 min walk" },
  { name: "Union Station", distance: "10 min walk" },
  { name: "Magnificent Mile", distance: "15 min walk" },
];

export function Location() {
  return (
    <section className="py-section section-padding bg-plymouth-cream" id="location">
      <div className="max-w-container-lg mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Map placeholder */}
          <ScrollReveal>
            <div className="aspect-square bg-plymouth-dark relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-plymouth-charcoal to-plymouth-dark flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-plymouth-gray mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                  <span className="text-plymouth-gray text-sm uppercase tracking-wider">
                    Printers Row &middot; South Loop
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal delay={150}>
            <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
              Location
            </p>
            <h2 className="font-display text-display-lg text-plymouth-black mb-6 text-balance">
              The Loop. No Compromises.
            </h2>
            <p className="text-plymouth-gray leading-relaxed mb-10">
              Walking distance to Millennium Park, the Riverwalk, the Art Institute,
              major transit hubs, top restaurants, and Chicago&apos;s business district.
              You are in the center of everything.
            </p>

            <div className="space-y-4 mb-10">
              {nearbySpots.map((spot) => (
                <div key={spot.name} className="flex items-center justify-between border-b border-plymouth-black/10 pb-3">
                  <span className="text-plymouth-black font-medium text-sm">
                    {spot.name}
                  </span>
                  <span className="text-plymouth-gold font-body text-sm uppercase tracking-wider">
                    {spot.distance}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/location" className="btn-outline-dark group inline-flex items-center gap-3">
              <span>Explore the Area</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
