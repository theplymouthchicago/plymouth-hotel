const experiences = [
  {
    title: "Check In, Skip the Line",
    description:
      "No front desk. No waiting. Your digital key hits your phone before you even land. Walk in, settle in, done.",
  },
  {
    title: "Cook on Your Terms",
    description:
      "Every suite comes with a full kitchen — not a microwave and a mini-fridge. Stock up at the local market and eat like a local.",
  },
  {
    title: "Work Without Compromise",
    description:
      "High-speed WiFi, ergonomic workspaces, and enough silence to actually get things done. We built for remote workers before it was trendy.",
  },
  {
    title: "Explore the Neighborhood",
    description:
      "We'll point you to the spots the locals actually go — not the tourist traps. Restaurants, bars, coffee, culture. The real Chicago.",
  },
];

export function Experience() {
  return (
    <section className="py-section section-padding bg-plymouth-black" id="experience">
      <div className="max-w-container-lg mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column — header */}
          <div className="lg:sticky lg:top-32">
            <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
              The Experience
            </p>
            <h2 className="font-display text-display-lg text-plymouth-white mb-6 text-balance">
              Not a Hotel Stay.
              <br />
              A Better Way to Travel.
            </h2>
            <p className="text-plymouth-silver leading-relaxed max-w-md">
              We stripped out everything annoying about hotels and kept everything
              that matters. The result? A stay that fits around your life instead of
              the other way around.
            </p>
          </div>

          {/* Right column — cards */}
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={exp.title}
                className="border-l-2 border-plymouth-gold/30 pl-8 py-2 hover:border-plymouth-gold transition-colors duration-300"
              >
                <span className="text-plymouth-gold/40 font-body text-sm mb-2 block">
                  0{index + 1}
                </span>
                <h3 className="font-display text-display-sm text-plymouth-white mb-3">
                  {exp.title}
                </h3>
                <p className="text-plymouth-silver leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
