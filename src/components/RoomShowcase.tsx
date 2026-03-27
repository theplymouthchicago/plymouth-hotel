import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";

const rooms = [
  {
    name: "The Two-Bedroom",
    tagline: "More space than a hotel. More style than an Airbnb.",
    description:
      "Sleeps 4 comfortably. Full kitchen, private bedrooms, living room. Everything you need to feel at home — with better design than your actual home.",
    features: ["Full kitchen", "King beds", "Living room", "Smart TV", "Fast WiFi", "Self check-in"],
    idealFor: "Couples · Small Families · Business Pairs",
    image: "/images/living-green.jpg",
    alt: "Teal green mural wall living room with dining table and city views",
  },
  {
    name: "The Three-Bedroom",
    tagline: "Bring the whole crew. Nobody has to share a bed.",
    description:
      "Sleeps 6. Three private bedrooms, full kitchen, open living space. Built for groups who want to be together without being on top of each other.",
    features: ["Full kitchen", "3 private bedrooms", "Dining area", "Living room", "Smart TVs", "Self check-in"],
    idealFor: "Friend Groups · Family Travel · Bachelor/ette Parties",
    image: "/images/living-dark.jpg",
    alt: "Dark charcoal mural living room with large windows and city views",
  },
  {
    name: "The Four-Bedroom",
    tagline: "The whole floor. All yours.",
    description:
      "Sleeps 8. Maximum space, maximum privacy. Chicago living at its best. The largest layout we offer — perfect for taking over the entire space.",
    features: ["Full kitchen", "4 private bedrooms", "Multiple bathrooms", "Dining area", "Living room", "Self check-in"],
    idealFor: "Large Groups · Events · Executive Retreats",
    image: "/images/kitchen-navy.jpg",
    alt: "Navy blue open kitchen and living area with full appliances and city view",
  },
];

export function RoomShowcase() {
  return (
    <section className="bg-plymouth-light" id="rooms">
      {/* Section header */}
      <div className="py-section section-padding">
        <ScrollReveal className="max-w-container-lg mx-auto text-center">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Our Suites
          </p>
          <h2 className="font-display text-display-lg text-plymouth-black text-balance">
            Rooms That Earn Their Rate
          </h2>
          <p className="text-plymouth-gray text-lg mt-4 max-w-2xl mx-auto">
            Every suite is designed with intention — real space, real kitchens, real style.
          </p>
        </ScrollReveal>
      </div>

      {/* Full-bleed alternating room cards */}
      {rooms.map((room, index) => (
        <div
          key={room.name}
          className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] lg:min-h-[70vh]"
        >
          {/* Image — full bleed */}
          <div className={`relative min-h-[40vh] sm:min-h-[50vh] lg:min-h-full ${index % 2 === 1 ? "lg:order-2" : ""}`}>
            <Image
              src={room.image}
              alt={room.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className={`flex items-center ${index % 2 === 1 ? "lg:order-1" : ""} ${index % 2 === 0 ? "bg-plymouth-cream" : "bg-plymouth-light"}`}>
            <ScrollReveal className="px-8 md:px-16 lg:px-20 py-14 lg:py-24 max-w-xl mx-auto lg:mx-0">
              <p className="text-plymouth-gold font-body text-xs uppercase tracking-[0.25em] mb-4">
                {room.idealFor}
              </p>
              <h3 className="font-display text-display-md text-plymouth-black mb-3">
                {room.name}
              </h3>
              <p className="font-display text-lg text-plymouth-gray italic mb-6">
                {room.tagline}
              </p>
              <p className="text-plymouth-gray leading-relaxed mb-8">
                {room.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                {room.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1.5 border border-plymouth-black/10 text-plymouth-charcoal text-xs uppercase tracking-wider font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <Link href="/rooms" className="btn-outline-dark group inline-flex items-center gap-3">
                <span>View Suite</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      ))}
    </section>
  );
}
