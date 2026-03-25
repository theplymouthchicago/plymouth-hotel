import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Location",
  description:
    "The Plymouth Hotel is located in the heart of Chicago — walking distance to the best dining, nightlife, culture, and transit the city has to offer.",
};

const neighborhoods = [
  {
    name: "Dining",
    description: "World-class restaurants within a 10-minute walk.",
    spots: [
      { name: "Au Cheval", detail: "Legendary burgers, 5 min walk" },
      { name: "Girl & The Goat", detail: "James Beard winner, 8 min walk" },
      { name: "Portillo's", detail: "Chicago classic, 3 min walk" },
      { name: "Avec", detail: "Mediterranean small plates, 7 min walk" },
      { name: "The Dearborn", detail: "American fine dining, 4 min walk" },
    ],
  },
  {
    name: "Culture & Attractions",
    description: "Chicago's best museums, parks, and landmarks at your doorstep.",
    spots: [
      { name: "Art Institute of Chicago", detail: "12 min walk" },
      { name: "Millennium Park & The Bean", detail: "10 min walk" },
      { name: "Chicago Theatre", detail: "5 min walk" },
      { name: "Chicago Riverwalk", detail: "8 min walk" },
      { name: "Navy Pier", detail: "20 min walk / 8 min rideshare" },
    ],
  },
  {
    name: "Nightlife",
    description: "From craft cocktails to late-night energy.",
    spots: [
      { name: "The Aviary", detail: "World-renowned cocktail bar, 8 min" },
      { name: "Lost Lake", detail: "Tiki cocktails, 15 min" },
      { name: "The Violet Hour", detail: "Speakeasy vibes, 12 min" },
      { name: "Celeste", detail: "Rooftop bar, 5 min" },
      { name: "Smart Bar", detail: "Late-night music, 15 min" },
    ],
  },
  {
    name: "Transit & Access",
    description: "Get anywhere in the city — fast.",
    spots: [
      { name: "CTA L Train", detail: "3 min walk to nearest station" },
      { name: "Union Station", detail: "10 min via L or rideshare" },
      { name: "O'Hare International", detail: "40 min via L train" },
      { name: "Midway Airport", detail: "30 min via L train" },
      { name: "Bike Share (Divvy)", detail: "Station across the street" },
    ],
  },
];

export default function LocationPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-plymouth-black pt-32 pb-section section-padding">
        <div className="max-w-container mx-auto text-center">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Location
          </p>
          <h1 className="font-display text-display-xl text-plymouth-white mb-6 text-balance">
            In the Middle of
            <br />
            Everything Worth Doing
          </h1>
          <p className="text-plymouth-silver text-lg max-w-2xl mx-auto leading-relaxed">
            The Plymouth is in the heart of Chicago. Not adjacent to it.
            Not a rideshare away from it. In it.
          </p>
        </div>
      </section>

      {/* Map section */}
      <section className="section-padding bg-plymouth-cream py-section">
        <div className="max-w-container-lg mx-auto">
          <div className="aspect-[21/9] bg-plymouth-dark relative overflow-hidden mb-16">
            <div className="absolute inset-0 bg-gradient-to-br from-plymouth-charcoal to-plymouth-dark flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-plymouth-gray mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                <span className="text-plymouth-gray text-sm uppercase tracking-wider">
                  Interactive Map — Embed Google Maps or Mapbox Here
                </span>
              </div>
            </div>
          </div>

          {/* Neighborhood guides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {neighborhoods.map((hood) => (
              <div key={hood.name} className="bg-plymouth-white p-10 border border-plymouth-black/5">
                <h2 className="font-display text-display-sm text-plymouth-black mb-2">
                  {hood.name}
                </h2>
                <p className="text-plymouth-gray text-sm mb-8">
                  {hood.description}
                </p>
                <div className="space-y-4">
                  {hood.spots.map((spot) => (
                    <div
                      key={spot.name}
                      className="flex items-center justify-between py-3 border-b border-plymouth-black/5 last:border-0"
                    >
                      <span className="font-body font-medium text-sm text-plymouth-black">
                        {spot.name}
                      </span>
                      <span className="text-plymouth-gray text-xs">
                        {spot.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting here */}
      <section className="py-section section-padding bg-plymouth-black text-center">
        <div className="max-w-container mx-auto">
          <h2 className="font-display text-display-md text-plymouth-white mb-6 text-balance">
            Getting Here Is Easy.
            <br />
            Leaving Is the Hard Part.
          </h2>
          <p className="text-plymouth-silver text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Direct L train access from both airports. Rideshare-friendly drop-off.
            Street parking and garage partnerships for drivers.
          </p>
          <Link href="/rooms" className="btn-primary">
            Book Your Stay
          </Link>
        </div>
      </section>
    </>
  );
}
