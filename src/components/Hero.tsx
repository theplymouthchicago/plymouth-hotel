import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-plymouth-black overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/living-gray-mural.jpg"
        alt="Plymouth Hotel suite with colorful abstract mural, large dining table, and floor-to-ceiling windows"
        fill
        className="object-cover"
        priority
        quality={85}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center section-padding max-w-4xl mx-auto py-32">
        <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-6">
          Chicago&apos;s Design-Forward Hotel
        </p>
        <h1 className="font-display text-display-xl text-plymouth-white mb-6 text-balance">
          Chicago Has Hotels.
          <br />
          Plymouth Is Different.
        </h1>
        <p className="text-plymouth-silver text-lg md:text-xl font-body max-w-2xl mx-auto mb-10 leading-relaxed">
          Apartment-style suites in the Loop. 2, 3, and 4 bedrooms — built for
          groups, longer stays, and guests who want more than a hotel room.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/rooms" className="btn-primary">
            Book Your Stay
          </Link>
          <Link href="/rooms" className="btn-outline">
            Explore Rooms
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-px h-16 bg-gradient-to-b from-plymouth-gold to-transparent" />
      </div>
    </section>
  );
}
