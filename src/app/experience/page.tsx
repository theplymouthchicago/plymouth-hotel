import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Experience | Boutique Suites in Chicago's Loop",
  description: "Life at The Plymouth is what a hotel stay should feel like — spacious, curated, self-directed. Full kitchens, separate bedrooms, rooftop access, and zero resort fees.",
};

const pillars = [
  {
    number: "01",
    title: "Arrive on Your Terms",
    description:
      "No front desk. No key cards. No waiting behind a family of six while someone argues about their reservation. Your digital key arrives before you do. Walk in, settle in, done.",
    details: [
      "Digital key sent before arrival",
      "Smart lock — phone or code entry",
      "24/7 arrival flexibility",
      "Luggage storage available",
    ],
  },
  {
    number: "02",
    title: "Live Like a Local",
    description:
      "Every suite has a full kitchen because room service is overpriced and Uber Eats gets old after day two. Stock the fridge, cook breakfast, invite people over. This is your place.",
    details: [
      "Full-size kitchen appliances",
      "Cookware, dishes, utensils included",
      "Grocery delivery partnerships",
      "Local market recommendations",
    ],
  },
  {
    number: "03",
    title: "Work Without the Workaround",
    description:
      "We don't just throw a desk in the corner and call it 'business-friendly.' Dedicated workspaces, ergonomic seating, lighting that doesn't make you want to close your laptop, and WiFi that handles video calls without drama.",
    details: [
      "Dedicated workspace in every suite",
      "High-speed WiFi (500+ Mbps)",
      "Ergonomic desk chair",
      "Multiple power outlets at desk",
    ],
  },
  {
    number: "04",
    title: "Design That Means Something",
    description:
      "Every piece of furniture, every light fixture, every texture was chosen by someone who actually cares about design. Not a purchasing department. Not a bulk catalog. Individual curation, suite by suite.",
    details: [
      "Individually designed suites",
      "Local art in every room",
      "Premium materials throughout",
      "Thoughtful lighting design",
    ],
  },
  {
    number: "05",
    title: "Space to Spread Out",
    description:
      "Our smallest suite is twice the size of a standard hotel room. Multi-bedroom layouts let groups travel together without sacrificing personal space. Living areas, dining spaces, kitchens — real rooms, not just a bed with a bathroom.",
    details: [
      "650–1,200+ sq ft layouts",
      "Separate living and sleeping areas",
      "Multi-bedroom options",
      "Full-size bathrooms",
    ],
  },
];

export default function ExperiencePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-plymouth-black pt-32 pb-section section-padding">
        <div className="max-w-container mx-auto text-center">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            The Experience
          </p>
          <h1 className="font-display text-display-xl text-plymouth-white mb-6 text-balance">
            Hotels Are Broken.
            <br />
            We Fixed the Parts That Matter.
          </h1>
          <p className="text-plymouth-silver text-lg max-w-2xl mx-auto leading-relaxed">
            We didn&apos;t reinvent hospitality. We just stopped doing the things
            that don&apos;t make sense anymore.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-section section-padding bg-plymouth-cream">
        <div className="max-w-container mx-auto">
          <div className="space-y-24">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
              >
                <div className="lg:col-span-1">
                  <span className="text-plymouth-gold/30 font-display text-display-md">
                    {pillar.number}
                  </span>
                </div>
                <div className="lg:col-span-5">
                  <h2 className="font-display text-display-md text-plymouth-black mb-4">
                    {pillar.title}
                  </h2>
                  <p className="text-plymouth-gray leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="lg:col-span-1" />
                <div className="lg:col-span-5">
                  <div className="bg-plymouth-white p-8 border border-plymouth-black/5">
                    <h3 className="font-body text-xs uppercase tracking-wider text-plymouth-gold mb-6">
                      The Details
                    </h3>
                    <ul className="space-y-4">
                      {pillar.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-3">
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
                          <span className="text-plymouth-gray text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-section section-padding bg-plymouth-black text-center">
        <div className="max-w-container mx-auto">
          <h2 className="font-display text-display-md text-plymouth-white mb-6 text-balance">
            Ready to Experience It?
          </h2>
          <p className="text-plymouth-silver text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            The difference isn&apos;t in the description. It&apos;s in the stay.
          </p>
          <Link href="/rooms" className="btn-primary">
            Book Your Stay
          </Link>
        </div>
      </section>
    </>
  );
}
