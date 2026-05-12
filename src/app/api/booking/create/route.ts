import { NextRequest, NextResponse } from "next/server";
import { guestyOpenFetch, GuestyApiError } from "../../guesty/open-client";
import { checkAvailability } from "@/lib/booking/availability";
import { stripe } from "@/lib/stripe";

interface CreateBody {
  quoteId: string;
  listingId: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  expectedTotal: number;
  couponCode?: string;
}

export async function POST(req: NextRequest) {
  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { quoteId, listingId, checkInDate, checkOutDate, guestsCount, guest, expectedTotal, couponCode } = body;
  if (
    !quoteId ||
    !listingId ||
    !checkInDate ||
    !checkOutDate ||
    !guestsCount ||
    !guest?.email ||
    !guest?.firstName ||
    !guest?.lastName ||
    !guest?.phone ||
    !expectedTotal
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Re-check availability with Guesty — guards against dates being taken between
  // page-load and pay (someone else booked, host blocked the night, etc).
  try {
    const avail = await checkAvailability(listingId, checkInDate, checkOutDate);
    if (!avail.available) {
      return NextResponse.json(
        {
          error: "Those dates are no longer available — please pick new dates.",
          blockedDates: avail.blockedDates,
          code: "UNAVAILABLE",
        },
        { status: 409 },
      );
    }
  } catch {
    // Calendar fetch failures shouldn't block payment — re-quote below will catch hard errors.
  }

  // Re-quote server-side so we never trust client-supplied prices.
  // Coupon code (if any) goes through so the discount is reflected in the charge.
  let serverTotal: number;
  let currency: string;
  try {
    const reQuoteBody: Record<string, unknown> = {
      listingId,
      checkInDateLocalized: checkInDate,
      checkOutDateLocalized: checkOutDate,
      guestsCount,
      source: "direct",
    };
    if (couponCode?.trim()) reQuoteBody.coupons = [couponCode.trim()];
    const reQuote = (await guestyOpenFetch("/v1/quotes", {
      method: "POST",
      body: JSON.stringify(reQuoteBody),
    })) as { rates?: { ratePlans?: Array<{ money?: { money?: { hostPayout?: number; currency?: string } } }> } };
    const money = reQuote.rates?.ratePlans?.[0]?.money?.money;
    serverTotal = money?.hostPayout ?? 0;
    currency = (money?.currency || "USD").toLowerCase();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Re-quote failed: ${message}` }, { status: 502 });
  }

  if (!serverTotal || Math.abs(serverTotal - expectedTotal) > 0.01) {
    return NextResponse.json(
      {
        error: "Price has changed since quote — please refresh and confirm.",
        serverTotal,
        expectedTotal,
      },
      { status: 409 }
    );
  }

  // Normalize phone to E.164-ish (digits with leading +). Guesty accepts free-form but cleaner data downstream.
  const rawPhone = (guest.phone || "").trim();
  const digitsOnly = rawPhone.replace(/[^\d+]/g, "");
  const normalizedPhone =
    digitsOnly.startsWith("+") ? digitsOnly :
    digitsOnly.length === 10 ? `+1${digitsOnly}` :
    digitsOnly.length === 11 && digitsOnly.startsWith("1") ? `+${digitsOnly}` :
    digitsOnly ? `+${digitsOnly}` : "";

  // Create Guesty reservation in inquiry status (holds inventory; confirmed by webhook on Stripe success).
  const reservationPayload: Record<string, unknown> = {
    listingId,
    checkInDateLocalized: checkInDate,
    checkOutDateLocalized: checkOutDate,
    guestsCount,
    source: "direct",
    status: "inquiry",
    guest: {
      firstName: guest.firstName.trim(),
      lastName: guest.lastName.trim(),
      email: guest.email.trim().toLowerCase(),
      phone: normalizedPhone,
    },
  };
  if (couponCode?.trim()) reservationPayload.coupons = [couponCode.trim()];
  let reservationId: string;
  try {
    const reservation = (await guestyOpenFetch("/v1/reservations", {
      method: "POST",
      body: JSON.stringify(reservationPayload),
    })) as { _id?: string };
    if (!reservation?._id) {
      throw new Error("Reservation created without _id");
    }
    reservationId = reservation._id;
  } catch (err) {
    console.error("Reservation create failed. Payload:", JSON.stringify(reservationPayload));
    if (err instanceof GuestyApiError) {
      console.error("Guesty error body:", JSON.stringify(err.body));
      return NextResponse.json(
        { error: `Guesty reservation failed: ${err.message}` },
        { status: err.status >= 500 ? 502 : 400 }
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Reservation failed: ${message}` }, { status: 500 });
  }

  // Create Stripe PaymentIntent (manual capture — capture on webhook after Guesty confirms).
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(serverTotal * 100),
      currency,
      automatic_payment_methods: { enabled: true },
      receipt_email: guest.email,
      description: `The Plymouth Chicago — ${checkInDate} to ${checkOutDate}`,
      metadata: {
        reservationId,
        listingId,
        quoteId,
        checkInDate,
        checkOutDate,
        guestsCount: String(guestsCount),
        guestName: `${guest.firstName} ${guest.lastName}`,
        guestEmail: guest.email,
        ...(couponCode?.trim() ? { couponCode: couponCode.trim() } : {}),
      },
    });

    return NextResponse.json({
      reservationId,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      total: serverTotal,
      currency,
    });
  } catch (err) {
    // Stripe failed AFTER reservation created — try to cancel the inquiry to free inventory.
    try {
      await guestyOpenFetch(`/v1/reservations/${reservationId}`, {
        method: "DELETE",
      });
    } catch {
      console.error(`Failed to clean up reservation ${reservationId} after Stripe error`);
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Payment setup failed: ${message}` }, { status: 502 });
  }
}
