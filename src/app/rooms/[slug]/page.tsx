import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ROOMS, getRoom } from "@/lib/rooms";
import { getListingImages } from "@/lib/listing-images";
import { ListingImageView } from "@/components/booking/ListingImageView";
import { RoomBookingControls } from "@/components/booking/RoomBookingControls";
import { ListingLongDescription } from "@/components/booking/ListingLongDescription";

// Per-floorplan detail page mirroring the section structure used on the
// Guesty-hosted property page. Pulls long-form content from the canonical
// listing's publicDescription so any edit Plymouth makes in Guesty
// (Description / The Space / Neighborhood / etc.) surfaces here without
// a redeploy.

export const revalidate = 300;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return ROOMS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = getRoom(params.slug);
  if (!room) return { title: "Suite | The Plymouth Chicago" };
  return {
    title: `${room.name} — ${room.bedrooms} Bedroom Suite | The Plymouth Chicago`,
    description: room.description,
  };
}

export default async function RoomDetailPage({ params }: Props) {
  const room = getRoom(params.slug);
  if (!room) notFound();

  const images = await getListingImages(room.listingId);

  return (
    <main className="bg-plymouth-cream min-h-screen">
      {/* Hero image */}
      <section className="relative w-full bg-plymouth-black aspect-[16/10] sm:aspect-[16/8] max-h-[70vh] overflow-hidden">
        <ListingImageView
          primary={{ url: images.primary, alt: images.primaryAlt || room.alt }}
          gallery={images.gallery.filter((g) => g.url !== images.primary)}
          variant="rooms-hero"
        />
      </section>

      <div className="max-w-container mx-auto section-padding pt-16 pb-20">
        <Link
          href="/rooms"
          className="text-xs uppercase tracking-[0.2em] text-plymouth-charcoal/60 hover:text-plymouth-brass transition-colors"
        >
          ← Back to all suites
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
          {/* Content column */}
          <article className="lg:col-span-2">
            <header className="mb-12">
              <p className="text-plymouth-brass text-xs uppercase tracking-[0.3em] mb-3">
                Suite
              </p>
              <h1 className="font-display text-display-lg text-plymouth-black mb-2">
                {room.name}
              </h1>
              <p className="font-display text-xl italic text-plymouth-charcoal mb-4">
                {room.tagline}
              </p>
              <p className="text-plymouth-charcoal/70 text-sm uppercase tracking-[0.2em]">
                {room.bedrooms} bedroom · {room.bathrooms} bath · sleeps up to{" "}
                {room.maxGuests}
              </p>
            </header>

            <ListingLongDescription listingId={room.listingId} variant="display" />
          </article>

          {/* Sticky booking widget */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 bg-white border border-plymouth-charcoal/15 p-6">
              <p className="text-plymouth-brass text-xs uppercase tracking-[0.3em] mb-2">
                Check availability
              </p>
              <h2 className="font-display text-2xl text-plymouth-black mb-1">
                {room.name}
              </h2>
              <p className="text-plymouth-charcoal/70 text-sm mb-6">
                Up to {room.maxGuests} guests · Free instant booking
              </p>
              <RoomBookingControls
                roomSlug={room.slug}
                maxGuests={room.maxGuests}
                listingId={room.listingId}
              />
              <p className="text-[11px] text-plymouth-charcoal/60 mt-4 leading-relaxed">
                <strong>Non-refundable.</strong> All cancellations forfeit the
                full reservation amount.{" "}
                <Link href="/terms" className="underline hover:text-plymouth-black">
                  See full policy
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

