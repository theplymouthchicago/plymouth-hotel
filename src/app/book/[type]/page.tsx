import { notFound } from "next/navigation";
import Link from "next/link";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { getRoom } from "@/lib/rooms";
import type { Quote } from "@/lib/types";
import { fetchQuote, QuoteError } from "@/lib/booking/quote";
import { checkAvailability } from "@/lib/booking/availability";
import { getListingImages } from "@/lib/listing-images";
import { CheckoutForm } from "@/components/booking/CheckoutForm";
import { ListingImageView } from "@/components/booking/ListingImageView";

interface Props {
  params: { type: string };
  searchParams: { checkIn?: string; checkOut?: string; guests?: string };
}

export const revalidate = 300;

export default async function BookPage({ params, searchParams }: Props) {
  const room = getRoom(params.type);
  if (!room) notFound();

  const { checkIn, checkOut, guests } = searchParams;
  if (!checkIn || !checkOut || !guests) {
    return <MissingParams roomSlug={room.slug} />;
  }

  const guestsNum = parseInt(guests, 10);
  if (!Number.isFinite(guestsNum) || guestsNum < 1 || guestsNum > room.maxGuests) {
    return <MissingParams roomSlug={room.slug} message={`This suite holds 1–${room.maxGuests} guests.`} />;
  }

  // Validate availability with Guesty before showing pricing/payment.
  const availability = await checkAvailability(room.listingId, checkIn, checkOut).catch(
    () => ({ available: true, blockedDates: [] as string[] }), // be lenient on calendar fetch errors — quote will be authoritative
  );
  if (!availability.available) {
    return (
      <UnavailableScreen
        roomSlug={room.slug}
        roomName={room.name}
        checkIn={checkIn}
        checkOut={checkOut}
        blockedDates={availability.blockedDates}
      />
    );
  }

  let quote: Quote;
  try {
    quote = await fetchQuote({
      listingId: room.listingId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestsCount: guestsNum,
    });
  } catch (err) {
    const message = err instanceof QuoteError ? err.message : (err instanceof Error ? err.message : "Quote failed");
    return <QuoteErrorScreen roomSlug={room.slug} message={message} />;
  }

  const images = await getListingImages(room.listingId);
  const nights = differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));

  return (
    <main className="bg-plymouth-cream min-h-screen pt-32 pb-20 section-padding">
      <div className="max-w-container mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
        <div>
          <Link
            href="/rooms"
            className="text-xs uppercase tracking-[0.2em] text-plymouth-gray hover:text-plymouth-gold transition-colors"
          >
            ← Back to rooms
          </Link>
          <p className="text-plymouth-gold font-body text-xs uppercase tracking-[0.3em] mt-6 mb-3">
            Confirm your booking
          </p>
          <h1 className="font-display text-display-lg text-plymouth-black mb-2">{room.name}</h1>
          <p className="font-display text-xl italic text-plymouth-charcoal mb-6">{room.tagline}</p>

          <AvailabilityBadge
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
          />

          <div className="bg-white p-8 shadow-sm">
            <h2 className="font-display text-display-sm text-plymouth-black mb-6">Your details</h2>
            <CheckoutForm quote={quote} roomName={room.name} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 self-start">
          <ListingImageView
            primary={{ url: images.primary, alt: images.primaryAlt }}
            gallery={images.gallery.filter((g) => g.url !== images.primary)}
            variant="book-sidebar"
          />
          <div className="bg-white p-6 shadow-sm">
            <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-plymouth-gray mb-4">
              <span>{format(parseISO(checkIn), "MMM d")} — {format(parseISO(checkOut), "MMM d")}</span>
              <span>{nights} {nights === 1 ? "night" : "nights"}</span>
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-plymouth-gray mb-6">
              {guestsNum} {guestsNum === 1 ? "guest" : "guests"}
            </div>

            <PriceBreakdown quote={quote} />
          </div>
          <p className="text-[11px] text-plymouth-gray text-center mt-4 leading-relaxed">
            You won&apos;t be charged until you confirm your booking on the next step.
            <br />
            Free cancellation up to 48 hours before check-in.
          </p>
        </aside>
      </div>
    </main>
  );
}

function PriceBreakdown({ quote }: { quote: Quote }) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: quote.currency }).format(n);
  return (
    <div className="space-y-2 text-sm">
      <Row label="Accommodation" value={fmt(quote.fareAccommodation)} />
      {quote.fareCleaning > 0 && <Row label="Cleaning fee" value={fmt(quote.fareCleaning)} />}
      {quote.totalFees > 0 && quote.totalFees !== quote.fareCleaning && (
        <Row label="Other fees" value={fmt(quote.totalFees - quote.fareCleaning)} />
      )}
      <Row label="Taxes" value={fmt(quote.totalTaxes)} />
      <div className="h-px bg-gray-200 my-3" />
      <div className="flex justify-between font-display text-lg text-plymouth-black">
        <span>Total</span>
        <span>{fmt(quote.total)}</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-plymouth-charcoal">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function AvailabilityBadge({
  checkIn,
  checkOut,
  nights,
}: {
  checkIn: string;
  checkOut: string;
  nights: number;
}) {
  return (
    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-5 py-4 mb-8">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </span>
      <div className="flex-1">
        <p className="text-emerald-800 font-display text-base leading-tight">
          Available — your dates are open.
        </p>
        <p className="text-emerald-700/80 text-xs uppercase tracking-[0.2em] mt-1">
          {format(parseISO(checkIn), "MMM d")} — {format(parseISO(checkOut), "MMM d")}
          {" · "}
          {nights} {nights === 1 ? "night" : "nights"}
          {" · "}
          confirmed with Guesty
        </p>
      </div>
    </div>
  );
}

function UnavailableScreen({
  roomName,
  checkIn,
  checkOut,
  blockedDates,
}: {
  roomSlug: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  blockedDates: string[];
}) {
  return (
    <main className="bg-plymouth-cream min-h-screen pt-32 pb-20 section-padding">
      <div className="max-w-container mx-auto text-center max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-[0.2em] mb-6">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Unavailable
        </div>
        <h1 className="font-display text-display-md text-plymouth-black mb-4">
          Those dates are taken.
        </h1>
        <p className="text-plymouth-charcoal mb-2">
          {roomName} is booked between{" "}
          <strong>{format(parseISO(checkIn), "MMM d")}</strong> and{" "}
          <strong>{format(parseISO(checkOut), "MMM d")}</strong>.
        </p>
        {blockedDates.length > 0 && (
          <p className="text-plymouth-charcoal/70 text-sm mb-2">
            Conflicting nights:{" "}
            {blockedDates.slice(0, 6).map((d) => format(parseISO(d), "MMM d")).join(", ")}
            {blockedDates.length > 6 ? ` +${blockedDates.length - 6} more` : ""}
          </p>
        )}
        <p className="text-plymouth-charcoal/70 mb-10 text-sm">
          Try different dates, or call us at (708) 866-0029 and we&apos;ll help find an open suite.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/rooms"
            className="inline-block bg-plymouth-brass text-plymouth-forest-deep px-8 py-4 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-plymouth-cream transition-colors border border-plymouth-brass"
          >
            ← Pick different dates
          </Link>
          <a
            href="tel:+17088660029"
            className="inline-block border border-plymouth-charcoal/30 text-plymouth-charcoal px-8 py-4 text-sm uppercase tracking-[0.2em] hover:border-plymouth-charcoal transition-colors"
          >
            Call us
          </a>
        </div>
      </div>
    </main>
  );
}

function MissingParams({ message }: { roomSlug: string; message?: string }) {
  return (
    <main className="bg-plymouth-cream min-h-screen pt-32 pb-20 section-padding">
      <div className="max-w-container mx-auto text-center">
        <h1 className="font-display text-display-md mb-4">Pick your dates</h1>
        <p className="text-plymouth-gray mb-8">{message ?? "Choose check-in and check-out dates to see availability and pricing."}</p>
        <Link
          href={`/rooms`}
          className="inline-block bg-plymouth-black text-white px-8 py-4 text-sm uppercase tracking-[0.2em]"
        >
          Choose dates →
        </Link>
      </div>
    </main>
  );
}

function QuoteErrorScreen({ message }: { roomSlug: string; message: string }) {
  return (
    <main className="bg-plymouth-cream min-h-screen pt-32 pb-20 section-padding">
      <div className="max-w-container mx-auto text-center max-w-2xl">
        <h1 className="font-display text-display-md mb-4">We couldn&apos;t price these dates</h1>
        <p className="text-plymouth-gray mb-2">{message}</p>
        <p className="text-plymouth-gray mb-8 text-sm">Try different dates, or call us at (708) 866-0029.</p>
        <Link
          href={`/rooms`}
          className="inline-block bg-plymouth-black text-white px-8 py-4 text-sm uppercase tracking-[0.2em]"
        >
          ← Back to rooms
        </Link>
      </div>
    </main>
  );
}
