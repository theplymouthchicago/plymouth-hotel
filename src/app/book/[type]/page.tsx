import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { getRoom } from "@/lib/rooms";
import type { Quote } from "@/lib/types";
import { fetchQuote, QuoteError } from "@/lib/booking/quote";
import { CheckoutForm } from "@/components/booking/CheckoutForm";

interface Props {
  params: { type: string };
  searchParams: { checkIn?: string; checkOut?: string; guests?: string };
}

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
          <p className="font-display text-xl italic text-plymouth-charcoal mb-10">{room.tagline}</p>
          <div className="bg-white p-8 shadow-sm">
            <h2 className="font-display text-display-sm text-plymouth-black mb-6">Your details</h2>
            <CheckoutForm quote={quote} roomName={room.name} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 self-start">
          <div className="relative aspect-[4/3] mb-6">
            <Image src={room.image} alt={room.alt} fill className="object-cover" sizes="400px" />
          </div>
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
