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
            .
          </p>
        </Section>

        <hr className="my-16 border-plymouth-charcoal/15" />

        <p className="text-plymouth-brass text-xs uppercase tracking-[0.3em] mb-3">
          Legal
        </p>
        <h2 className="font-display text-display-md text-plymouth-black mb-6">
          Booking Engine Terms &amp; Conditions
        </h2>
        <p className="text-plymouth-charcoal/80 leading-relaxed mb-10 italic">
          The following terms govern use of the booking platform and apply to
          every reservation made through this site. Mirrored verbatim from{" "}
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

        <Section title="Definitions">
          <p>
            <strong>Affiliate</strong> means an entity that controls, is
            controlled by or is under common control with a party, where
            &ldquo;control&rdquo; means ownership of 50% or more of the shares,
            equity interest or other securities entitled to vote for the
            election of directors or other managing authority.
          </p>
          <p>
            The company is referred to as either &ldquo;the Company&rdquo;,
            &ldquo;We&rdquo;, &ldquo;Us&rdquo; or &ldquo;Our&rdquo; in this
            Agreement.
          </p>
          <p>
            <strong>Device</strong> means any device that can access the
            Service such as a computer, a cellphone or a digital tablet.
          </p>
          <p>
            <strong>Service</strong> refers to the Website.
          </p>
          <p>
            <strong>Terms and Conditions</strong> (also referred as
            &ldquo;Terms&rdquo;) mean these Terms and Conditions that form
            the entire agreement between the parties regarding the use of
            the Service.
          </p>
          <p>
            <strong>Third-party Social Media Service</strong> means any
            services or content (including data, information, products or
            services) provided by a third-party that may be displayed,
            included or made available by the Service.
          </p>
          <p>
            <strong>You</strong> means the individual accessing or using the
            Service, or the company, or other legal entity on behalf of which
            such individual is accessing or using the Service, as applicable.
          </p>
        </Section>

        <Section title="Acknowledgment">
          <p>
            These are the Terms and Conditions governing the use of this
            Service and the agreement that operates between the parties.
            These Terms and Conditions set out the rights and obligations of
            all users regarding the use of the Service.
          </p>
          <p>
            Your access to and use of the Service is conditioned on your
            acceptance of and compliance with these Terms and Conditions.
            These Terms and Conditions apply to all visitors, users and
            others who access or use the Service.
          </p>
          <p>
            By accessing or using the Service you agree to be bound by these
            Terms and Conditions. If You disagree with any part of these
            Terms and Conditions then You may not access the Service.
          </p>
          <p>
            You represent that you are over the age of 18. The Company does
            not permit those under 18 to use the Service.
          </p>
          <p>
            Your access to and use of the Service is also conditioned on your
            acceptance of and compliance with the Privacy Policy of the
            company. Our Privacy Policy describes our policies and procedures
            on the collection, use and disclosure of Your personal
            information when You use the Application or the Website and
            tells You about Your privacy rights and how the law protects You.
            Please read Our Privacy Policy carefully before using Our Service.
          </p>
        </Section>

        <Section title="Links to Other Websites">
          <p>
            Our Service may contain links to third-party web sites or
            services that are not owned or controlled by the Company.
          </p>
          <p>
            The Company has no control over, and assumes no responsibility
            for, the content, privacy policies, or practices of any third
            party web sites or services. You further acknowledge and agree
            that the Company shall not be responsible or liable, directly or
            indirectly, for any damage or loss caused or alleged to be caused
            by or in connection with the use of or reliance on any such
            content, goods or services available on or through any such web
            sites or services.
          </p>
          <p>
            We strongly advise You to read the terms and conditions and
            privacy policies of any third-party web sites or services that
            You visit.
          </p>
        </Section>

        <Section title="Termination">
          <p>
            We may terminate or suspend Your access immediately, without
            prior notice or liability, for any reason whatsoever, including
            without limitation if You breach these Terms and Conditions.
          </p>
          <p>
            Upon termination, Your right to use the Service will cease
            immediately.
          </p>
        </Section>

        <Section title="Limitation of Liability">
          <p>
            Notwithstanding any damages that You might incur, the entire
            liability of the Company and any of its suppliers under any
            provision of this Terms and Your exclusive remedy for all of the
            foregoing shall be limited to the amount actually paid by You
            through the Service or 100 USD if You haven&apos;t purchased
            anything through the Service.
          </p>
          <p>
            To the maximum extent permitted by applicable law, in no event
            shall the Company or its suppliers be liable for any special,
            incidental, indirect, or consequential damages whatsoever
            (including, but not limited to, damages for loss of profits,
            loss of data or other information, for business interruption,
            for personal injury, loss of privacy arising out of or in any
            way related to the use of or inability to use the Service,
            third-party software and/or third-party hardware used with the
            Service, or otherwise in connection with any provision of this
            Terms), even if the Company or any supplier has been advised of
            the possibility of such damages and even if the remedy fails of
            its essential purpose.
          </p>
          <p>
            Some states do not allow the exclusion of implied warranties or
            limitation of liability for incidental or consequential damages,
            which means that some of the above limitations may not apply. In
            these states, each party&apos;s liability will be limited to the
            greatest extent permitted by law.
          </p>
        </Section>

        <Section title="&ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; Disclaimer">
          <p>
            The Service is provided to You &ldquo;AS IS&rdquo; and &ldquo;AS
            AVAILABLE&rdquo; and with all faults and defects without warranty
            of any kind. To the maximum extent permitted under applicable
            law, the Company, on its own behalf and on behalf of its
            Affiliates and its and their respective licensors and service
            providers, expressly disclaims all warranties, whether express,
            implied, statutory or otherwise, with respect to the Service,
            including all implied warranties of merchantability, fitness for
            a particular purpose, title and non-infringement, and warranties
            that may arise out of course of dealing, course of performance,
            usage or trade practice.
          </p>
          <p>
            Without limitation to the foregoing, the Company provides no
            warranty or undertaking, and makes no representation of any kind
            that the Service will meet Your requirements, achieve any
            intended results, be compatible or work with any other software,
            applications, systems or services, operate without interruption,
            meet any performance or reliability standards or be error free
            or that any errors or defects can or will be corrected.
          </p>
          <p>
            Without limiting the foregoing, neither the Company nor any of
            the company&apos;s provider makes any representation or warranty
            of any kind, express or implied: (i) as to the operation or
            availability of the Service, or the information, content, and
            materials or products included thereon; (ii) that the Service
            will be uninterrupted or error-free; (iii) as to the accuracy,
            reliability, or currency of any information or content provided
            through the Service; or (iv) that the Service, its servers, the
            content, or e-mails sent from or on behalf of the Company are
            free of viruses, scripts, trojan horses, worms, malware,
            timebombs or other harmful components.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion of certain types
            of warranties or limitations on applicable statutory rights of a
            consumer, so some or all of the above exclusions and limitations
            may not apply to You. But in such a case the exclusions and
            limitations set forth in this section shall be applied to the
            greatest extent enforceable under applicable law.
          </p>
        </Section>

        <Section title="Governing Law">
          <p>
            The laws of the Company&apos;s incorporation place, excluding its
            conflicts of law rules, shall govern these Terms and Your use of
            the Service. Your use of the Application may also be subject to
            other local, state, national, or international laws.
          </p>
        </Section>

        <Section title="Disputes Resolution">
          <p>
            If You have any concern or dispute about the Service, You agree
            to first try to resolve the dispute informally by contacting the
            Company.
          </p>
        </Section>

        <Section title="United States Legal Compliance">
          <p>
            You represent and warrant that (i) You are not located in a
            country that is subject to the United States government embargo,
            or that has been designated by the United States government as a
            &ldquo;terrorist supporting&rdquo; country, and (ii) You are not
            listed on any United States government list of prohibited or
            restricted parties.
          </p>
        </Section>

        <Section title="Severability and Waiver">
          <p>
            <strong>Severability.</strong> If any provision of these Terms is
            held to be unenforceable or invalid, such provision will be
            changed and interpreted to accomplish the objectives of such
            provision to the greatest extent possible under applicable law
            and the remaining provisions will continue in full force and
            effect.
          </p>
          <p>
            <strong>Waiver.</strong> Except as provided herein, the failure
            to exercise a right or to require the performance of an
            obligation under these Terms shall not affect a party&apos;s
            ability to exercise such right or require such performance at any
            time thereafter nor shall the waiver of a breach constitute a
            waiver of any subsequent breach.
          </p>
        </Section>

        <Section title="Changes to These Terms and Conditions">
          <p>
            We reserve the right, at Our sole discretion, to modify or
            replace these Terms at any time. If a revision is material We
            will make reasonable efforts to provide at least 30 days&apos;
            notice prior to any new terms taking effect. What constitutes a
            material change will be determined at Our sole discretion.
          </p>
          <p>
            By continuing to access or use Our Service after those revisions
            become effective, You agree to be bound by the revised terms. If
            You do not agree to the new terms, in whole or in part, please
            stop using the website and the Service.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>
            If you have any questions about these Terms and Conditions, You
            can contact us by email:{" "}
            <a href="mailto:pgasien@outlook.com" className="underline">
              pgasien@outlook.com
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
