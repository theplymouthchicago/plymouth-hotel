import type { Metadata } from "next";
import Link from "next/link";
import { FAQ as FAQSection } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about The Plymouth Hotel in Chicago — check-in, amenities, cancellations, parking, and more.",
};

const additionalFaqs = [
  {
    category: "Booking & Pricing",
    items: [
      {
        q: "How do I book a suite?",
        a: "You can book directly through our website. Select your dates, choose your suite, and confirm. You'll receive a confirmation email with all the details, including your digital key.",
      },
      {
        q: "Are there discounts for extended stays?",
        a: "Yes. Stays of 7+ nights receive automatic discounts, and 30+ night stays get our best rates. Contact us directly for corporate or long-term pricing.",
      },
      {
        q: "Do you offer corporate rates?",
        a: "We do. If your company sends people to Chicago regularly, we'll set up a corporate account with preferred rates and priority booking. Reach out to our team directly.",
      },
    ],
  },
  {
    category: "During Your Stay",
    items: [
      {
        q: "Is housekeeping included?",
        a: "Weekly housekeeping is included with every stay. Need it more frequently? We offer add-on cleaning services. Your space, your schedule.",
      },
      {
        q: "Can I have guests over?",
        a: "Absolutely. It's your suite. Invite friends for dinner, host a small gathering, or have family visit. We just ask that you respect quiet hours after 10pm and building common areas.",
      },
      {
        q: "What if something breaks or I need help?",
        a: "Text, call, or email our support team — available 24/7. Average response time is under 15 minutes. For emergencies, we'll have someone onsite fast.",
      },
    ],
  },
  {
    category: "Logistics",
    items: [
      {
        q: "What time is check-in and check-out?",
        a: "Check-in starts at 3pm. Check-out is by 11am. Early check-in and late check-out are available upon request, subject to availability.",
      },
      {
        q: "Can I receive packages at the hotel?",
        a: "Yes. We accept packages and deliveries for guests. You'll be notified when something arrives, and we'll hold it securely until you pick it up.",
      },
      {
        q: "Is the building pet-friendly?",
        a: "Select suites are pet-friendly (dogs under 50 lbs). There's a one-time pet cleaning fee. Let us know at booking so we can match you with the right suite.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-plymouth-black pt-32 pb-section section-padding">
        <div className="max-w-container mx-auto text-center">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            FAQ
          </p>
          <h1 className="font-display text-display-xl text-plymouth-white mb-6 text-balance">
            Questions. Answered.
          </h1>
          <p className="text-plymouth-silver text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to know before, during, and after your stay.
            If we missed something, just ask.
          </p>
        </div>
      </section>

      {/* Interactive FAQ accordion (reused component) */}
      <FAQSection />

      {/* Additional categorized FAQs */}
      <section className="py-section section-padding bg-plymouth-cream">
        <div className="max-w-container mx-auto">
          <div className="space-y-16">
            {additionalFaqs.map((category) => (
              <div key={category.category}>
                <h2 className="font-display text-display-sm text-plymouth-black mb-8 pb-4 border-b border-plymouth-black/10">
                  {category.category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {category.items.map((item) => (
                    <div key={item.q}>
                      <h3 className="font-display text-lg text-plymouth-black mb-3">
                        {item.q}
                      </h3>
                      <p className="text-plymouth-gray text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-section section-padding bg-plymouth-black text-center">
        <div className="max-w-container mx-auto">
          <h2 className="font-display text-display-md text-plymouth-white mb-6 text-balance">
            Still Have Questions?
          </h2>
          <p className="text-plymouth-silver text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Our team responds fast — usually under 15 minutes. No bots. No
            phone trees. Real people who actually know the answers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#" className="btn-primary">
              Contact Us
            </Link>
            <Link href="/rooms" className="btn-outline">
              Book Your Stay
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
