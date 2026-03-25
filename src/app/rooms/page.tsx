import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description:
    "Explore The Plymouth Hotel's design-forward suites in Chicago. Studio, two-bedroom, and executive layouts — each with full kitchens, real space, and curated interiors.",
};

const rooms = [
  {
    name: "The Studio Suite",
    tagline: "For the solo traveler who refuses to compromise.",
    sqft: "650+ sq ft",
    price: "From $189/night",
    description:
      "A full living space, not a room with a bed. Open-plan layout with dedicated workspace, a kitchen that actually functions, and enough room to spread out and stay awhile. King bed, walk-in shower, premium linens, and the kind of silence you don't expect in the city.",
    features: [
      "King bed with premium linens",
      "Full kitchen with dishwasher",
      "Dedicated work desk",
      "Walk-in rainfall shower",
      "55\" Smart TV",
      "High-speed WiFi",
      "In-unit washer/dryer",
      "Smart lock entry",
    ],
    idealFor: "Solo travelers, business trips, weekend getaways",
  },
  {
    name: "The Two-Bedroom",
    tagline: "Bring the crew. Split the cost. Keep the style.",
    sqft: "1,200+ sq ft",
    price: "From $329/night",
    description:
      "Two private bedrooms, a shared living area that doesn't feel like an afterthought, and a full kitchen. Built for groups who want to be together without being on top of each other. Each bedroom has its own bathroom, because sharing shouldn't extend to everything.",
    features: [
      "2 private bedrooms",
      "2 full bathrooms",
      "Full kitchen with dining area",
      "Spacious living room",
      "Queen + King beds",
      "55\" Smart TVs in each room",
      "In-unit washer/dryer",
      "Smart lock entry",
    ],
    idealFor: "Friend groups, family travel, bachelor/bachelorette parties",
  },
  {
    name: "The Executive Suite",
    tagline: "When the trip is work, but the room shouldn't feel like it.",
    sqft: "900+ sq ft",
    price: "From $269/night",
    description:
      "Premium finishes, an oversized workspace, and a layout designed for productivity without sacrificing comfort. Corner unit with city views, rain shower, and a kitchen stocked with better-than-hotel-grade everything.",
    features: [
      "King bed with luxury linens",
      "Oversized executive workspace",
      "Full kitchen with premium appliances",
      "Rain shower + soaking tub",
      "City views",
      "65\" Smart TV",
      "In-unit washer/dryer",
      "Smart lock entry",
    ],
    idealFor: "Business travelers, extended stays, corporate retreats",
  },
];

export default function RoomsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-plymouth-black pt-32 pb-section section-padding">
        <div className="max-w-container mx-auto text-center">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Our Suites
          </p>
          <h1 className="font-display text-display-xl text-plymouth-white mb-6 text-balance">
            Rooms That Earn Their Rate
          </h1>
          <p className="text-plymouth-silver text-lg max-w-2xl mx-auto leading-relaxed">
            Every suite is designed with intention — real space, real kitchens,
            real style. No two are the same. Pick the layout that fits your trip.
          </p>
        </div>
      </section>

      {/* Room Listings */}
      <section className="py-section section-padding bg-plymouth-cream">
        <div className="max-w-container-lg mx-auto space-y-24">
          {rooms.map((room, index) => (
            <div key={room.name} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Image */}
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="aspect-[4/3] bg-plymouth-dark relative overflow-hidden sticky top-28">
                  <div className="absolute inset-0 bg-gradient-to-br from-plymouth-charcoal to-plymouth-dark flex items-center justify-center">
                    <span className="text-plymouth-gray text-sm uppercase tracking-wider">
                      Photo Placeholder
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-plymouth-gold font-body text-xs uppercase tracking-wider">
                    {room.sqft}
                  </span>
                  <span className="w-1 h-1 bg-plymouth-gold rounded-full" />
                  <span className="text-plymouth-gold font-body text-xs uppercase tracking-wider">
                    {room.price}
                  </span>
                </div>

                <h2 className="font-display text-display-md text-plymouth-black mb-2">
                  {room.name}
                </h2>
                <p className="font-display text-xl text-plymouth-gray italic mb-6">
                  {room.tagline}
                </p>
                <p className="text-plymouth-gray leading-relaxed mb-8">
                  {room.description}
                </p>

                <p className="text-plymouth-gold font-body text-xs uppercase tracking-wider mb-3">
                  Ideal for: {room.idealFor}
                </p>

                <h3 className="font-body text-sm uppercase tracking-wider text-plymouth-black mb-4 mt-8">
                  What&apos;s Included
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-10">
                  {room.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <svg
                        className="w-4 h-4 text-plymouth-gold shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      <span className="text-plymouth-gray text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/rooms" className="btn-primary">
                  Book This Suite
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-section section-padding bg-plymouth-black text-center">
        <div className="max-w-container mx-auto">
          <h2 className="font-display text-display-md text-plymouth-white mb-6 text-balance">
            Not Sure Which Suite?
          </h2>
          <p className="text-plymouth-silver text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Tell us about your trip — group size, dates, priorities — and we&apos;ll match you
            with the right room.
          </p>
          <Link href="#" className="btn-primary">
            Get a Recommendation
          </Link>
        </div>
      </section>
    </>
  );
}
