import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";

export function CTABanner() {
  return (
    <section className="py-section section-padding bg-plymouth-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-plymouth-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-plymouth-gold/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      {/* Gold accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-plymouth-gold/40 to-transparent" />

      <ScrollReveal className="max-w-container mx-auto text-center relative z-10">
        <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-6">
          Don&apos;t Sleep on It
        </p>
        <h2 className="font-display text-display-lg text-plymouth-white mb-6 text-balance">
          18 Suites. One Building.
          <br />
          They Go Fast.
        </h2>
        <p className="text-plymouth-silver text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          Limited inventory means limited availability. The best dates disappear first.
          Lock yours in before someone else does.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#booking" className="btn-primary group inline-flex items-center gap-3">
            <span>Book Your Stay</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
          <Link href="/rooms" className="btn-outline">
            View All Suites
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
