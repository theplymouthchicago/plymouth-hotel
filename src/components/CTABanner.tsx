import Link from "next/link";

export function CTABanner() {
  return (
    <section className="py-section section-padding bg-plymouth-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-plymouth-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-plymouth-gold/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="max-w-container mx-auto text-center relative z-10">
        <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-6">
          Ready?
        </p>
        <h2 className="font-display text-display-lg text-plymouth-white mb-6 text-balance">
          Your Room Is Waiting.
          <br />
          Chicago Isn&apos;t Patient.
        </h2>
        <p className="text-plymouth-silver text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Limited suites. Prime location. The kind of stay that makes you
          rethink every hotel you&apos;ve booked before.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/rooms" className="btn-primary">
            Book Your Stay
          </Link>
          <Link href="/rooms" className="btn-outline">
            View All Suites
          </Link>
        </div>
      </div>
    </section>
  );
}
