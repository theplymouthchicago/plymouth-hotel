import { notFound } from "next/navigation";
import Link from "next/link";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { getRoom } from "@/lib/rooms";
import type { Quote } from "@/lib/types";
import { fetchQuote, QuoteError } from "@/lib/booking/quote";
import { checkAvailability } from "@/lib/booking/availability";
import { getListingImages } from "@/lib/listing-images";
import { BookingPanel } from "@/components/booking/BookingPanel";
import { StayIncludes } from "@/components/booking/StayIncludes";
import { ListingLongDescription } from "@/components/booking/ListingLongDescription";
import { FLOORPLAN_LISTINGS, floorplanForSlug } from "@/lib/floorplan-listings";

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

  // Plymouth has 6 physical units per floorplan; the canonical (room.listingId)
  // is preferred because it matches the photos / amenity card, but if it's
  // booked for these dates we route the guest to any other free sibling. All
  // siblings share the same floorplan, sqft, and amenities — so the guest
  // experience is equivalent and the calendar's "available" promise actually
  // holds at booking time.
  const floorplanKey = floorplanForSlug(room.slug);
  const candidates = floorplanKey ? FLOORPLAN_LISTINGS[floorplanKey] : [room.listingId];
  const availResults = await Promise.all(
    candidates.map((id) =>
      checkAvailability(id, checkIn, checkOut).catch(
        // Lenient on per-listing errors — quote on the picked candidate is authoritative.
        () => ({ available: true, blockedDates: [] as string[] }),
      ),
    ),
  );
  const pickedIdx = availResults.findIndex((r) => r.available);
  if (pickedIdx === -1) {
    // No single sibling has the whole range free. Surface concrete
    // alternative sub-windows that DO fit on at least one sibling — much
    // more useful than a flat "conflicting nights" list, since each night
    // may be bookable on SOME unit just not contiguously.
    const alternatives = findAlternatives(availResults, checkIn, checkOut);
    return (
      <UnavailableScreen
        roomSlug={room.slug}
        roomName={room.name}
        checkIn={checkIn}
        checkOut={checkOut}
        guestsCount={guestsNum}
        alternatives={alternatives}
      />
    );
  }
  const bookingListingId = candidates[pickedIdx];

  let quote: Quote;
  try {
    quote = await fetchQuote({
      listingId: bookingListingId,
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
      <div className="max-w-container mx-auto">
        <Link
          href="/rooms"
          className="text-xs uppercase tracking-[0.2em] text-plymouth-charcoal/60 hover:text-plymouth-brass transition-colors"
        >
          ← Back to rooms
        </Link>
        <p className="text-plymouth-brass font-body text-xs uppercase tracking-[0.3em] mt-6 mb-3">
          Confirm your booking
        </p>
        <h1 className="font-display text-display-lg text-plymouth-black mb-2">{room.name}</h1>
        <p className="font-display text-xl italic text-plymouth-charcoal mb-6">{room.tagline}</p>

        <AvailabilityBadge checkIn={checkIn} checkOut={checkOut} nights={nights} />

        <BookingPanel
          initialQuote={quote}
          roomName={room.name}
          roomSlug={room.slug}
          images={images}
          checkIn={checkIn}
          checkOut={checkOut}
          guestsCount={guestsNum}
          nights={nights}
        />

        <div className="mt-12">
          <StayIncludes listingId={room.listingId} roomName={room.name} />
        </div>

        <div className="mb-8">
          <ListingLongDescription listingId={room.listingId} variant="compact" />
        </div>
      </div>
    </main>
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
  roomSlug,
  roomName,
  checkIn,
  checkOut,
  guestsCount,
  alternatives,
}: {
  roomSlug: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  alternatives: { from: string; to: string; nights: number }[];
}) {
  const requestedNights = differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
  return (
    <main className="bg-plymouth-cream min-h-screen pt-32 pb-20 section-padding">
      <div className="max-w-container mx-auto text-center max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-[0.2em] mb-6">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Unavailable
        </div>
        <h1 className="font-display text-display-md text-plymouth-black mb-4">
          No suite is open for all {requestedNights} {requestedNights === 1 ? "night" : "nights"}.
        </h1>
        <p className="text-plymouth-charcoal mb-8">
          We couldn&apos;t find a {roomName} open for the full window from{" "}
          <strong>{format(parseISO(checkIn), "MMM d")}</strong> to{" "}
          <strong>{format(parseISO(checkOut), "MMM d")}</strong>. Each night may
          be open on a different unit, but a reservation has to stay on one
          suite — so we can offer:
        </p>
        {alternatives.length > 0 ? (
          <div className="space-y-3 mb-10">
            {alternatives.map((alt) => {
              const params = new URLSearchParams({
                checkIn: alt.from,
                checkOut: alt.to,
                guests: String(guestsCount),
              });
              return (
                <Link
                  key={`${alt.from}_${alt.to}`}
                  href={`/book/${roomSlug}?${params.toString()}`}
                  className="block border border-plymouth-charcoal/20 bg-white px-5 py-4 hover:border-plymouth-brass hover:bg-plymouth-cream transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display text-lg text-plymouth-black">
                        {format(parseISO(alt.from), "MMM d")} → {format(parseISO(alt.to), "MMM d")}
                      </div>
                      <div className="text-xs uppercase tracking-[0.2em] text-plymouth-charcoal/70 mt-1">
                        {alt.nights} {alt.nights === 1 ? "night" : "nights"} · same floorplan
                      </div>
                    </div>
                    <span className="text-plymouth-brass text-sm uppercase tracking-[0.2em]">
                      Try →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-plymouth-charcoal/70 mb-10 text-sm">
            No alternative window in your range works either. Try different dates entirely, or call us.
          </p>
        )}
        <p className="text-plymouth-charcoal/70 mb-10 text-sm">
          Or call us at (708) 866-0029 and we can sometimes split a longer stay across units.
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

// ──────────────────────────────────────────────────────────────────────────
// Alternative-date suggestions for the UnavailableScreen.
//
// When no single sibling unit has the full requested window free, we look
// for the longest contiguous available runs (≥2 nights) WITHIN that window
// on any sibling and surface them as click-through suggestions. Lets a
// guest who picked Jun 5-9 instantly retry Jun 7-9 if that's all the
// floorplan can offer in their dates.
// ──────────────────────────────────────────────────────────────────────────

function addDaysISO(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function dateRangeISO(from: string, toExclusive: string): string[] {
  const dates: string[] = [];
  const start = new Date(from + "T00:00:00Z");
  const end = new Date(toExclusive + "T00:00:00Z");
  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function findAlternatives(
  availResults: { blockedDates: string[] }[],
  checkIn: string,
  checkOut: string,
): { from: string; to: string; nights: number }[] {
  const allDates = dateRangeISO(checkIn, checkOut);
  const alts: { from: string; to: string; nights: number }[] = [];

  for (const result of availResults) {
    const blocked = new Set(result.blockedDates);
    let runStart: string | null = null;
    let runLen = 0;
    const flush = () => {
      if (runStart && runLen >= 2) {
        alts.push({
          from: runStart,
          to: addDaysISO(runStart, runLen),
          nights: runLen,
        });
      }
      runStart = null;
      runLen = 0;
    };
    for (const d of allDates) {
      if (blocked.has(d)) {
        flush();
      } else {
        if (runStart === null) runStart = d;
        runLen++;
      }
    }
    flush();
  }

  // Sort by longest first, dedupe by exact (from, to), cap to 3.
  alts.sort((a, b) => b.nights - a.nights);
  const seen = new Set<string>();
  return alts
    .filter((a) => {
      const key = `${a.from}_${a.to}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3);
}
