"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import type { Quote } from "@/lib/types";
import { CheckoutForm } from "./CheckoutForm";
import { ListingImageView } from "./ListingImageView";

interface ListingImage {
  primary: string;
  primaryAlt: string;
  gallery: { url: string; alt: string }[];
}

interface Props {
  initialQuote: Quote;
  roomName: string;
  images: ListingImage;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  nights: number;
}

export function BookingPanel({
  initialQuote,
  roomName,
  images,
  checkIn,
  checkOut,
  guestsCount,
  nights,
}: Props) {
  const [quote, setQuote] = useState<Quote>(initialQuote);
  const [code, setCode] = useState<string>("");
  const [applying, setApplying] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  const appliedCode = quote.couponCode;
  const discount = quote.discountAmount ?? 0;

  async function applyCode() {
    const trimmed = code.trim();
    if (!trimmed) return;
    setApplying(true);
    setPromoError(null);
    try {
      const res = await fetch("/api/booking/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: quote.listingId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestsCount,
          couponCode: trimmed,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.error || "That code didn't work. Try another.");
        return;
      }
      if (!data.discountAmount && !data.couponCode) {
        setPromoError("That code isn't valid for these dates.");
        return;
      }
      setQuote(data as Quote);
      setCode("");
    } catch (err) {
      setPromoError(err instanceof Error ? err.message : "Could not apply code.");
    } finally {
      setApplying(false);
    }
  }

  async function removeCode() {
    setApplying(true);
    setPromoError(null);
    try {
      const res = await fetch("/api/booking/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: quote.listingId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestsCount,
        }),
      });
      const data = await res.json();
      if (res.ok) setQuote(data as Quote);
    } finally {
      setApplying(false);
    }
  }

  return (
    <div>
      <div className="mb-10">
        <ListingImageView
          primary={{ url: images.primary, alt: images.primaryAlt }}
          gallery={images.gallery.filter((g) => g.url !== images.primary)}
          variant="book-sidebar"
        />
      </div>

      <div className="bg-white p-8 shadow-sm max-w-2xl mx-auto">
        <h2 className="font-display text-display-sm text-plymouth-black mb-6">Your details</h2>

        <CheckoutForm quote={quote} roomName={roomName} couponCode={appliedCode} />

        <div className="border border-plymouth-charcoal/15 p-5 mt-8">
          <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-plymouth-charcoal/70 mb-4">
            <span>
              {format(parseISO(checkIn), "MMM d")} — {format(parseISO(checkOut), "MMM d")}
            </span>
            <span>
              {nights} {nights === 1 ? "night" : "nights"}
            </span>
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-plymouth-charcoal/70 mb-6">
            {guestsCount} {guestsCount === 1 ? "guest" : "guests"}
          </div>

          <PriceBreakdown quote={quote} discount={discount} />

          <PromoSection
            code={code}
            setCode={setCode}
            appliedCode={appliedCode}
            discount={discount}
            currency={quote.currency}
            applying={applying}
            error={promoError}
            onApply={applyCode}
            onRemove={removeCode}
          />
          <p className="text-[11px] text-plymouth-charcoal/60 mt-5 leading-relaxed">
            You won&apos;t be charged until you confirm your booking on the next step.{" "}
            <strong>Non-refundable.</strong> All cancellations forfeit the full reservation amount.{" "}
            <a href="/terms" className="underline hover:text-plymouth-black">See full policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

function PriceBreakdown({ quote, discount }: { quote: Quote; discount: number }) {
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
      {discount > 0 && (
        <Row
          label={`Promo${quote.couponCode ? ` (${quote.couponCode})` : ""}`}
          value={`− ${fmt(discount)}`}
          highlight
        />
      )}
      <div className="h-px bg-gray-200 my-3" />
      <div className="flex justify-between font-display text-lg text-plymouth-black">
        <span>Total</span>
        <span>{fmt(quote.total)}</span>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`flex justify-between ${
        highlight ? "text-emerald-700 font-medium" : "text-plymouth-charcoal"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function PromoSection({
  code,
  setCode,
  appliedCode,
  discount,
  currency,
  applying,
  error,
  onApply,
  onRemove,
}: {
  code: string;
  setCode: (v: string) => void;
  appliedCode?: string;
  discount: number;
  currency: string;
  applying: boolean;
  error: string | null;
  onApply: () => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState<boolean>(!!appliedCode);
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

  if (appliedCode && discount > 0) {
    return (
      <div className="mt-5 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-emerald-700">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>
              <strong className="font-medium">{appliedCode}</strong> applied — saved {fmt(discount)}
            </span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={applying}
            className="text-xs uppercase tracking-[0.15em] text-plymouth-charcoal/60 hover:text-plymouth-charcoal underline underline-offset-2"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 border-t border-gray-100 pt-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm text-plymouth-brass hover:text-plymouth-charcoal underline underline-offset-2"
        >
          Have a promo code?
        </button>
      ) : (
        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] text-plymouth-charcoal/70 mb-2">
            Promo code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ENTER CODE"
              autoComplete="off"
              className="flex-1 border border-gray-300 px-3 py-2 text-sm font-mono tracking-wide focus:outline-none focus:border-plymouth-brass"
              disabled={applying}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onApply();
                }
              }}
            />
            <button
              type="button"
              onClick={onApply}
              disabled={applying || !code.trim()}
              className="bg-plymouth-forest text-plymouth-cream px-4 py-2 text-xs uppercase tracking-[0.15em] hover:bg-plymouth-brass hover:text-plymouth-forest-deep disabled:opacity-40 transition-colors"
            >
              {applying ? "…" : "Apply"}
            </button>
          </div>
          {error && <p className="text-red-700 text-xs mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}
