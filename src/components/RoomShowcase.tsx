import Image from "next/image";
import Link from "next/link";

const rooms = [
  {
    name: "The Two-Bedroom",
    tagline: "More space than a hotel. More style than an Airbnb.",
    description:
      "Sleeps 4 comfortably. Full kitchen, private bedrooms, living room. Everything you need to feel at home — with better design than your actual home.",
    features: ["Full kitchen", "King beds", "Living room", "Smart TV", "Fast WiFi", "Self check-in"],
    idealFor: "Couples traveling together, small families, business pairs",
    cta: "Book the Two-Bedroom",
    image: "/images/living-green.jpg",
    alt: "Teal green mural wall living room with dining table and city views",
  },
  {
    name: "The Three-Bedroom",
    tagline: "Bring the whole crew. Nobody has to share a bed.",
    description:
      "Sleeps 6. Three private bedrooms, full kitchen, open living space. Built for groups who want to be together without being on top of each other.",
    features: ["Full kitchen", "3 private bedrooms", "Dining area", "Living room", "Smart TVs", "Self check-in"],
    idealFor: "Friend groups, family travel, corporate teams, bachelor/bachelorette",
    cta: "Book the Three-Bedroom",
    image: "/images/living-dark.jpg",
    alt: "Dark charcoal mural living room with large windows and city views",
  },
  {
    name: "The Four-Bedroom",
    tagline: "The whole floor. All yours.",
    description:
      "Sleeps 8. Maximum space, maximum privacy. Chicago living at its best. The largest layout we offer — perfect for taking over the entire space.",
    features: ["Full kitchen", "4 private bedrooms", "Multiple bathrooms", "Dining area", "Living room", "Self check-in"],
    idealFor: "Large groups, events, multi-family travel, executive retreats",
    cta: "Book the Four-Bedroom",
    image: "/images/kitchen-navy.jpg",
    alt: "Navy blue open kitchen and living area with full appliances and city view",
  },
];

export function RoomShowcase() {
  return (
    <section className="py-section section-padding bg-plymouth-light" id="rooms">
      <div className="max-w-container-lg mx-auto">
        <div className="text-center mb-16">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Our Suites
          </p>
          <h2 className="font-display text-display-lg text-plymouth-black text-balance">
            Rooms That Earn Their Rate
          </h2>
          <p className="text-plymouth-gray text-lg mt-4 max-w-2xl mx-auto">
            Every suite is designed with intention — real space, real kitchens, real style.
            Pick the layout that fits your trip.
          </p>
        </div>

        <div className="space-y-20">
          {rooms.map((room, index) => (
            <div
              key={room.name}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Image */}
              <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={room.image}
                    alt={room.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.2em] mb-3">
                  {room.idealFor}
                </p>
                <h3 className="font-display text-display-md text-plymouth-black mb-3">
                  {room.name}
                </h3>
                <p className="font-display text-xl text-plymouth-gray italic mb-6">
                  {room.tagline}
                </p>
                <p className="text-plymouth-gray leading-relaxed mb-8">
                  {room.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-4 py-2 bg-plymouth-black/5 text-plymouth-black text-xs uppercase tracking-wider font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Link href="/rooms" className="btn-outline-dark">
                  {room.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
