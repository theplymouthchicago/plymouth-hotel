import type { Metadata } from "next";
import Link from "next/link";
import { ROOMS } from "@/lib/rooms";
import { RoomBookingControls } from "@/components/booking/RoomBookingControls";
import { getListingImages } from "@/lib/listing-images";
import { ListingImageView } from "@/components/booking/ListingImageView";

export const metadata: Metadata = {
  title: "Rooms & Suites — 2, 3 & 4 Bedroom Suites | The Plymouth Chicago",
  description:
    "The Plymouth Chicago offers 2, 3, and 4 bedroom suites in the Loop. Full kitchens, rooftop access, instant booking. 417 S Dearborn St.",
};

// Re-fetch listing images at most every 5 minutes so updates to Guesty
// photos surface on the public site without a redeploy.
export const revalidate = 300;

export default async function RoomsPage() {
  const rooms = await Promise.all(
    ROOMS.map(async (r) => {
      const images = await getListingImages(r.listingId);
      return {
        slug: r.slug,
        name: r.name,
        tagline: r.tagline,
        sqft: `Up to ${r.maxGuests} guests`,
        price: `${r.bedrooms} bedroom${r.bedrooms > 1 ? "s" : ""} · ${r.bathrooms} bath${r.bathrooms > 1 ? "s" : ""}`,
        description: r.description,
        features: r.features,
        idealFor: r.idealFor,
        image: images.primary,
        alt: images.primaryAlt || r.alt,
        gallery: images.gallery.slice(0, 6),
        maxGuests: r.maxGuests,
        listingId: r.listingId,
      };
    })
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-plymouth-black pt-32 pb-20 section-padding" data-section="rooms-hero">
        <div className="max-w-container mx-auto text-center">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Our Suites
          </p>
          <h1 className="font-display text-display-xl text-white mb-6 text-balance">
            Rooms That Earn Their Rate
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            2, 3, and 4 bedroom suites in a century-old Loop landmark. Real
            kitchens, real space, real design — floors 6 through 11.
          </p>
        </div>
      </section>

      {/* Room Listings */}
      <section className="bg-plymouth-offwhite">
        {rooms.map((room, index) => (
          <div
            key={room.name}
            className={`grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] ${index > 0 ? "border-t border-gray-200" : ""}`}
          >
            {/* Image + clickable lightbox */}
            <div className={`relative min-h-[50vw] lg:min-h-full ${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <ListingImageView
                primary={{ url: room.image, alt: room.alt }}
                gallery={room.gallery.filter((g) => g.url !== room.image)}
                variant="rooms-hero"
              />
            </div>

            {/* Content */}
            <div className={`flex items-center px-8 md:px-16 lg:px-20 py-16 lg:py-24 ${index % 2 === 1 ? "lg:order-1" : ""} ${index % 2 === 0 ? "bg-white" : "bg-plymouth-offwhite"}`}>
              <div className="max-w-lg w-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-plymouth-gold text-xs uppercase tracking-[0.25em] font-body">{room.sqft}</span>
                  <span className="w-1 h-1 bg-plymouth-gold rounded-full" />
                  <span className="text-plymouth-gold text-xs uppercase tracking-[0.25em] font-body">{room.price}</span>
                </div>

                <h2 className="font-display text-display-md text-plymouth-black mb-2">
                  {room.name}
                </h2>
                <p className="font-display text-xl text-plymouth-charcoal italic mb-6">
                  {room.tagline}
                </p>
                <p className="text-plymouth-charcoal leading-relaxed mb-8 text-base">
                  {room.description}
                </p>

                <p className="text-plymouth-gold text-xs uppercase tracking-wider mb-6">
                  Ideal for: {room.idealFor}
                </p>

                <h3 className="text-xs uppercase tracking-[0.2em] text-plymouth-black mb-4 font-body">
                  What&apos;s Included
                </h3>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-10">
                  {room.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-plymouth-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-plymouth-charcoal text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <RoomBookingControls roomSlug={room.slug} maxGuests={room.maxGuests} listingId={room.listingId} />

                <Link
                  href={`/rooms/${room.slug}`}
                  className="inline-flex items-center gap-2 mt-6 text-xs uppercase tracking-[0.2em] text-plymouth-charcoal/70 hover:text-plymouth-brass transition-colors"
                >
                  View suite details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="py-20 section-padding bg-plymouth-black text-center">
        <div className="max-w-container mx-auto">
          <p className="text-plymouth-gold text-xs uppercase tracking-[0.3em] mb-4">Ready?</p>
          <h2 className="font-display text-display-md text-white mb-6">
            Your Room Is Waiting.
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
            Instant booking. No inquiry required. Best rate when you book direct.
          </p>
          <a
            href="/#booking"
            className="inline-flex items-center gap-3 bg-plymouth-brass text-plymouth-forest-deep px-10 py-4 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-plymouth-cream transition-colors"
          >
            Book Direct Now
          </a>
        </div>
      </section>
    </>
  );
}
