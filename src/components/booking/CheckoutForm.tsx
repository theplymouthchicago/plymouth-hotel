"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { Quote } from "@/lib/types";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  quote: Quote;
  roomName: string;
  couponCode?: string;
}

export function CheckoutForm({ quote, roomName, couponCode }: Props) {
  const [step, setStep] = useState<"guest" | "pay">("guest");
  const [guest, setGuest] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);

  const validateGuest = () => {
    if (!guest.firstName.trim() || !guest.lastName.trim()) return "First and last name are required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(guest.email)) return "Enter a valid email address.";
    if (!/^[+\d().\-\s]{7,}$/.test(guest.phone)) return "Enter a valid phone number.";
    return null;
  };

  const onContinueToPay = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateGuest();
    if (err) return setError(err);
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: quote.quoteId,
          listingId: quote.listingId,
          checkInDate: quote.checkInDate,
          checkOutDate: quote.checkOutDate,
          guestsCount: quote.guestsCount,
          guest,
          expectedTotal: quote.total,
          ...(couponCode ? { couponCode } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment.");
      setClientSecret(data.clientSecret);
      setReservationId(data.reservationId);
      setStep("pay");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      {step === "guest" && (
        <form onSubmit={onContinueToPay} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First name" value={guest.firstName} onChange={(v) => setGuest({ ...guest, firstName: v })} required />
            <Field label="Last name" value={guest.lastName} onChange={(v) => setGuest({ ...guest, lastName: v })} required />
          </div>
          <Field label="Email" type="email" value={guest.email} onChange={(v) => setGuest({ ...guest, email: v })} required />
          <Field label="Phone" type="tel" value={guest.phone} onChange={(v) => setGuest({ ...guest, phone: v })} required />
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={creating}
            className="w-full bg-plymouth-black text-white px-8 py-4 text-sm uppercase tracking-[0.2em] hover:bg-plymouth-gold hover:text-plymouth-black transition-colors disabled:opacity-40"
          >
            {creating ? "Preparing payment…" : "Continue to payment →"}
          </button>
        </form>
      )}

      {step === "pay" && clientSecret && reservationId && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
          <PayStep clientSecret={clientSecret} reservationId={reservationId} guest={guest} roomName={roomName} />
        </Elements>
      )}
    </div>
  );
}

function PayStep({
  reservationId,
  guest,
  roomName,
}: {
  clientSecret: string;
  reservationId: string;
  guest: { firstName: string; lastName: string; email: string; phone: string };
  roomName: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/confirmation/${reservationId}`,
        payment_method_data: {
          billing_details: {
            name: `${guest.firstName} ${guest.lastName}`,
            email: guest.email,
            phone: guest.phone,
          },
        },
      },
      redirect: "if_required",
    });

    if (error) {
      setError(error.message || "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push(`/confirmation/${reservationId}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <p className="text-xs uppercase tracking-[0.2em] text-plymouth-gray mb-2">
        Booking: {roomName}
      </p>
      <div className="bg-plymouth-cream p-5">
        <PaymentElement />
      </div>
      {error && <p className="text-red-700 text-sm">{error}</p>}
      <p className="text-[11px] text-plymouth-gray text-center leading-relaxed">
        By confirming, you agree to our{" "}
        <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-plymouth-black">
          Terms &amp; Booking Policy
        </a>
        .{" "}
        <strong className="text-plymouth-charcoal">Non-refundable</strong> — all cancellations forfeit the full reservation amount.
      </p>
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full bg-plymouth-black text-white px-8 py-4 text-sm uppercase tracking-[0.2em] hover:bg-plymouth-gold hover:text-plymouth-black transition-colors disabled:opacity-40"
      >
        {submitting ? "Processing…" : "Confirm booking"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-plymouth-gray">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-gray-300 px-4 py-3 text-base font-body text-plymouth-black focus:outline-none focus:border-plymouth-gold"
      />
    </label>
  );
}
