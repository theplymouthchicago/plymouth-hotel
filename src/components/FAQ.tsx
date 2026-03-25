"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How many people can stay?",
    answer:
      "It depends on the unit. The Two-Bedroom sleeps 4, the Three-Bedroom sleeps 6, and the Four-Bedroom sleeps 8. Every bedroom is private with its own door.",
  },
  {
    question: "Is this a hotel or an apartment?",
    answer:
      "Both. You get the space and comfort of a full apartment — private bedrooms, a living room, a full kitchen — with the quality, design, and service of a boutique hotel.",
  },
  {
    question: "Do all units have kitchens?",
    answer:
      "Yes. Every unit has a full kitchen with a stove, oven, refrigerator, dishwasher, cookware, and utensils. Not a kitchenette. Not a hot plate. A real kitchen.",
  },
  {
    question: "Is it good for groups?",
    answer:
      "It was built for groups. Multiple private bedrooms, shared living and dining areas, and a full kitchen so you can split the cost and still have more space than a hotel. Perfect for friend trips, family travel, bachelor/bachelorette parties, and corporate teams.",
  },
  {
    question: "How does self check-in work?",
    answer:
      "You'll receive a digital key via email/text before your arrival. Use it to unlock the building entrance and your suite directly — no front desk, no waiting, no small talk required.",
  },
  {
    question: "What's the cancellation policy?",
    answer:
      "Free cancellation up to 48 hours before check-in for most bookings. Check your specific reservation confirmation for details.",
  },
  {
    question: "Is there parking?",
    answer:
      "We partner with nearby garages for discounted guest parking. Details and reservation links are sent with your booking confirmation. Street parking is also available in the area.",
  },
  {
    question: "Are pets allowed?",
    answer:
      "Please contact us directly to discuss pet accommodations. Policies may vary by unit and length of stay.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-section section-padding bg-plymouth-light" id="faq">
      <div className="max-w-content mx-auto">
        <div className="text-center mb-16">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            FAQ
          </p>
          <h2 className="font-display text-display-lg text-plymouth-black text-balance">
            Questions. Answered.
          </h2>
        </div>

        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="border-b border-plymouth-black/10"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between py-6 text-left group"
              >
                <span className="font-display text-lg text-plymouth-black pr-8 group-hover:text-plymouth-gold transition-colors">
                  {faq.question}
                </span>
                <span
                  className={`shrink-0 w-8 h-8 flex items-center justify-center border border-plymouth-black/20 transition-all duration-300 ${
                    openIndex === index
                      ? "bg-plymouth-gold border-plymouth-gold rotate-45"
                      : "group-hover:border-plymouth-gold"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-plymouth-gray leading-relaxed pr-16">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
