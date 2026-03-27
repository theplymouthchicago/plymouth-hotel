import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Rooms & Suites | The Plymouth Chicago",
  description:
    "The Plymouth Chicago offers 2, 3, and 4 bedroom suites in the Loop. Full kitchens, rooftop access, instant booking. 417 S Dearborn St.",
};

const BOOKING_BASE = "https://theplymouthchicago.guestybookings.com/en/properties";

const rooms = [
  {
    name: "The Two Bedroom",
    tagline: "More space than a hotel. More style than an Airbnb.",
    sqft: "Up to 4 guests",
    price: "2 bedrooms · 1 bath",
    listingId: "69b8610659a0a7001528058c",
    description:
      "Two private bedrooms, full kitchen, living room, and city views. Built for couples, small families, or business pairs who refuse to compromise on space or design.",
    features: [
      "2 private bedrooms",
      "Full kitchen with dishwasher",
      "Living & dining area",
      "High-speed WiFi",
      "55\" Smart TV",
      "In-unit washer/dryer",
      "Self check-in",
      "Rooftop access",
    ],
    idealFor: "Couples · Small Families · Business Pairs",
    image: "/images/living-green.jpg",
    alt: "Two bedroom suite living room with teal mural and dining table",
  },
  {
    name: "The Three Bedroom",
    tagline: "Bring the whole crew. Nobody has to share a bed.",
    sqft: "Up to 6 guests",
    price: "3 bedrooms · 2 baths",
    listingId: "69b863afab91d0002330efdb",
    description:
      "Three private bedrooms, two full bathrooms, and an open living space designed for groups who want to be together without being on top of each other. Chicago's most underrated group stay.",
    features: [
      "3 private bedrooms",
      "2 full bathrooms",
      "Full kitchen",
      "Open living & dining area",
      "Smart TVs throughout",
      "In-unit washer/dryer",
      "Self check-in",
      "Rooftop + lobby lounge",
    ],
    idealFor: "Friend Groups · Bachelorette Parties · Family Travel",
    image: "/images/living-dark.jpg",
    alt: "Three bedroom suite with dark charcoal mural and large windows",
  },
  {
    name: "The Four Bedroom",
    tagline: "The whole floor. All yours.",
    sqft: "Up to 10 guests",
    price: "4 bedrooms · 2 baths",
    listingId: "69b866a2139149001c905bfa",
    description:
      "Four bedrooms for up to 10 guests. Maximum space, maximum privacy. The largest layout in the building — ideal for executive retreats, large family gatherings, or groups that want to arrive together and leave together.",
    features: [
      "4 private bedrooms",
      "2 full bathrooms",
      "Full kitchen",
      "Dining table for 8+",
      "Multiple living areas",
      "In-unit washer/dryer",
      "Self check-in",
      "Rooftop, lobby lounge, conference room",
    ],
    idealFor: "Large Groups · Corporate Retreats · Special Events",
    image: "/images/kitchen-navy.jpg",
    alt: "Four bedroom suite open kitchen and living area with navy accents",
  },
];

export default function RoomsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-plymouth-black pt-32 pb-20 section-padding">
        <div className="max-w-container mx-auto text-center">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Our Suites
          </p>
          <h1 className="font-display text-display-xl text-white mb-6 text-balance">
            Rooms That Earn Their Rate
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            2, 3, and 4 bedroom suites in a century-old Loop landmark. Real
            kitchens, real space, real design — floors 6 through 11.
          </p>
        </div>
      </section>

      {/* Room Listings */}
      <section className="bg-plymouth-offwhite">
        {rooms.map((room, index) => (
          <div
            key={room.name}
            className={`grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] ${index > 0 ? "border-t border-gray-200" : ""}`}
          >
            {/* Image */}
            <div className={`relative min-h-[50vw] lg:min-h-full ${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <Image
                src={room.image}
                alt={room.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Content */}
            <div className={`flex items-center px-8 md:px-16 lg:px-20 py-16 lg:py-24 ${index % 2 === 1 ? "lg:order-1" : ""} ${index % 2 === 0 ? "bg-white" : "bg-plymouth-offwhite"}`}>
              <div className="max-w-lg w-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-plymouth-gold text-xs uppercase tracking-[0.25em] font-body">{room.sqft}</span>
                  <span className="w-1 h-1 bg-plymouth-gold rounded-full" />
                  <span className="text-plymouth-gold text-xs uppercase tracking-[0.25em] font-body">{room.price}</span>
                </div>

                <h2 className="font-display text-display-md text-plymouth-black mb-2">
                  {room.name}
                </h2>
                <p className="font-display text-xl text-plymouth-charcoal italic mb-6">
                  {room.tagline}
                </p>
                <p className="text-plymouth-charcoal leading-relaxed mb-8 text-base">
                  {room.description}
                </p>

                <p className="text-plymouth-gold text-xs uppercase tracking-wider mb-6">
                  Ideal for: {room.idealFor}
                </p>

                <h3 className="text-xs uppercase tracking-[0.2em] text-plymouth-black mb-4 font-body">
                  What&apos;s Included
                </h3>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-10">
                  {room.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-plymouth-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-plymouth-charcoal text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={`${BOOKING_BASE}/${room.listingId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-plymouth-black text-white px-8 py-4 text-sm uppercase tracking-[0.2em] hover:bg-plymouth-gold hover:text-black transition-all duration-300 group"
                >
                  Book This Suite
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="py-20 section-padding bg-plymouth-black text-center">
        <div className="max-w-container mx-auto">
          <p className="text-plymouth-gold text-xs uppercase tracking-[0.3em] mb-4">Ready?</p>
          <h2 className="font-display text-display-md text-white mb-6">
            Your Room Is Waiting.
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
            Instant booking. No inquiry required. Best rate when you book direct.
          </p>
          <a
            href="/#booking"
            className="inline-flex items-center gap-3 bg-plymouth-gold text-black px-10 py-4 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-white transition-colors"
          >
            Book Direct Now
          </a>
        </div>
      </section>
    </>
  );
}
