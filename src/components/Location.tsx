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
          {/* Google Map — grayscale to match Plymouth aesthetic */}
          <ScrollReveal>
            <div
              className="aspect-square relative overflow-hidden"
              style={{ filter: "grayscale(1) contrast(1.05) brightness(0.9)" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.847954!2d-87.63217!3d41.87562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca9f29d0c53%3A0x5fee6eaefa67e17a!2s417%20S%20Dearborn%20St%2C%20Chicago%2C%20IL%2060605!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0, border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Plymouth Chicago — 417 S Dearborn St, Chicago IL"
              />
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
                <div
                  key={spot.name}
                  className="flex items-center justify-between border-b border-plymouth-black/10 pb-3"
                >
                  <span className="text-plymouth-black font-medium text-sm">
                    {spot.name}
                  </span>
                  <span className="text-plymouth-gold font-body text-sm uppercase tracking-wider">
                    {spot.distance}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/location"
              className="btn-outline-dark group inline-flex items-center gap-3"
            >
              <span>Explore the Area</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
