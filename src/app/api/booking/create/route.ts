import { NextRequest, NextResponse } from "next/server";
import { guestyOpenFetch, GuestyApiError } from "../../guesty/open-client";
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
}

export async function POST(req: NextRequest) {
  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { quoteId, listingId, checkInDate, checkOutDate, guestsCount, guest, expectedTotal } = body;
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

  // Re-quote server-side so we never trust client-supplied prices.
  let serverTotal: number;
  let currency: string;
  try {
    const reQuote = (await guestyOpenFetch("/v1/quotes", {
      method: "POST",
      body: JSON.stringify({
        listingId,
        checkInDateLocalized: checkInDate,
        checkOutDateLocalized: checkOutDate,
        guestsCount,
        source: "direct",
      }),
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

  // Create Guesty reservation in inquiry status (holds inventory; confirmed by webhook on Stripe success).
  let reservationId: string;
  try {
    const reservation = (await guestyOpenFetch("/v1/reservations", {
      method: "POST",
      body: JSON.stringify({
        listingId,
        checkInDateLocalized: checkInDate,
        checkOutDateLocalized: checkOutDate,
        guestsCount,
        source: "direct",
        status: "inquiry",
        guest: {
          firstName: guest.firstName,
          lastName: guest.lastName,
          email: guest.email,
          phone: guest.phone,
        },
      }),
    })) as { _id?: string };
    if (!reservation?._id) {
      throw new Error("Reservation created without _id");
    }
    reservationId = reservation._id;
  } catch (err) {
    if (err instanceof GuestyApiError) {
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
