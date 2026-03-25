const testimonials = [
  {
    quote:
      "We booked for a bachelor party. Four guys, two bedrooms, a full kitchen, and walking distance to everything. Way better than cramming into two hotel rooms.",
    name: "Marcus T.",
    context: "Group Trip — 4 Nights",
    rating: 5,
  },
  {
    quote:
      "I travel to Chicago monthly for work. The Plymouth is the only place I book now. The workspace alone is worth it, but the kitchen and the space make it feel like my own apartment.",
    name: "Sarah K.",
    context: "Business Travel — Monthly Stays",
    rating: 5,
  },
  {
    quote:
      "Self check-in was seamless. The design was incredible. The location was perfect. We're already planning our next trip back.",
    name: "David & Priya R.",
    context: "Couple's Getaway — 3 Nights",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-section section-padding bg-plymouth-cream">
      <div className="max-w-container-lg mx-auto">
        <div className="text-center mb-16">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Guest Reviews
          </p>
          <h2 className="font-display text-display-lg text-plymouth-black text-balance">
            Don&apos;t Take Our Word for It
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-plymouth-white p-10 border border-plymouth-black/5"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-plymouth-gold"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-plymouth-black leading-relaxed mb-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div>
                <p className="font-body font-semibold text-sm text-plymouth-black">
                  {t.name}
                </p>
                <p className="text-plymouth-gray text-xs uppercase tracking-wider mt-1">
                  {t.context}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
