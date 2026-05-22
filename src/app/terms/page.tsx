import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Booking Policy | The Plymouth Chicago",
  description:
    "Cancellation policy, house rules, check-in & check-out times, and booking terms for The Plymouth Chicago.",
};

const GUESTY_TERMS_URL = "https://theplymouthchicago.guestybookings.com/en/terms";

export default function TermsPage() {
  return (
    <main className="bg-plymouth-cream min-h-screen pt-32 pb-20 section-padding">
      <article className="max-w-3xl mx-auto">
        <p className="text-plymouth-brass text-xs uppercase tracking-[0.3em] mb-3">
          Booking
        </p>
        <h1 className="font-display text-display-lg text-plymouth-black mb-6">
          Terms &amp; Booking Policy
        </h1>
        <p className="text-plymouth-charcoal/80 leading-relaxed mb-12">
          The following policies apply to all reservations made directly through
          theplymouthchicago.com. By completing a booking, you agree to these
          terms.
        </p>

        <Section title="Cancellation Policy">
          <p>
            <strong>All direct bookings are non-refundable.</strong> Cancellations
            are subject to a 100% cancellation fee — the full reservation amount
            will be retained whether the cancellation is made before or after
            check-in. We recommend purchasing travel insurance if you are
            uncertain about your dates.
          </p>
          <p className="mt-3 text-sm text-plymouth-charcoal/70">
            This policy reflects the rate-plan configured in our property
            management system (Guesty) for direct bookings. Reservations made
            through Airbnb, VRBO, Booking.com or other channels follow that
            channel&apos;s own cancellation policy, which may differ.
          </p>
        </Section>

        <Section title="Check-In &amp; Check-Out">
          <ul>
            <li>Check-in: <strong>4:00 PM</strong></li>
            <li>Check-out: <strong>11:00 AM</strong></li>
          </ul>
          <p>
            Early check-in or late check-out may be available on request — please
            contact us in advance and we&apos;ll do our best to accommodate.
          </p>
        </Section>

        <Section title="House Rules">
          <ul>
            <li>
              <strong>No smoking.</strong> Smoking is strictly prohibited within
              the unit or on the rooftop.
            </li>
            <li>
              <strong>No pets.</strong> The property is not pet-friendly.
            </li>
            <li>
              <strong>Quiet enjoyment.</strong> Please keep noise levels
              considerate, especially during quiet hours, out of respect for
              fellow residents and neighbors.
            </li>
            <li>
              <strong>Rooftop:</strong> open daily from 8:00 AM to 10:00 PM.
              Guests are responsible for cleaning up after themselves.
            </li>
            <li>
              <strong>Maximum occupancy</strong> is the guest count listed on
              your reservation. Additional guests are not permitted without
              prior approval.
            </li>
          </ul>
        </Section>

        <Section title="Security &amp; Verification">
          <p>
            To comply with legal requirements and building security rules, every
            guest will be asked to:
          </p>
          <ul>
            <li>Provide a copy of a government-issued photo ID</li>
            <li>Confirm contact information</li>
            <li>Provide a valid credit card matching the ID on file</li>
            <li>Complete our verification portal prior to check-in</li>
          </ul>
          <p>
            A <strong>$250 security deposit</strong> is required before check-in.
            The deposit is refunded after check-out provided the unit is left in
            good condition with no damage or rule violations.
          </p>
        </Section>

        <Section title="Climate Control">
          <p>
            As part of The Plymouth&apos;s historic charm, the building operates
            on a centralized, seasonally adjusted climate system — the property
            runs on either heating or cooling depending on the season. Guests
            can personalize their in-unit temperature and open or close windows,
            but cannot switch between heat and air conditioning.
          </p>
        </Section>

        <Section title="Property License">
          <p>
            Chicago Shared Housing Unit License Number:{" "}
            <strong>3069885</strong>.
          </p>
        </Section>

        <Section title="Payment &amp; Confirmation">
          <p>
            Payment is processed at the time of booking via Stripe. You will
            receive a booking confirmation email from Guesty with full
            reservation details and self check-in instructions ahead of arrival.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            For anything not covered here, call{" "}
            <a href="tel:+17088660029" className="underline">
              (708) 866-0029
            </a>{" "}
            or email{" "}
            <a href="mailto:info@theplymouthchicago.com" className="underline">
              info@theplymouthchicago.com
            </a>
            . The full booking-engine terms (including channel-specific clauses)
            are also hosted at{" "}
            <a
              href={GUESTY_TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              theplymouthchicago.guestybookings.com/en/terms
            </a>
            .
          </p>
        </Section>

        <p className="text-xs text-plymouth-charcoal/50 mt-16">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-2xl text-plymouth-black mb-3" dangerouslySetInnerHTML={{ __html: title }} />
      <div className="text-plymouth-charcoal leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-plymouth-brass [&_a:hover]:text-plymouth-black">
        {children}
      </div>
    </section>
  );
}
