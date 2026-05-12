import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { stripe } from "@/lib/stripe";
import { guestyOpenFetch } from "../../guesty/open-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(pi);
        break;
      }
      case "payment_intent.payment_failed":
      case "payment_intent.canceled": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(pi);
        break;
      }
      default:
        // Ignore other events
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Webhook handler error for ${event.type}:`, message);
    // Return 200 so Stripe doesn't retry endlessly on permanent failures; we log the issue.
    return NextResponse.json({ received: true, error: message });
  }
}

async function handlePaymentSucceeded(pi: Stripe.PaymentIntent) {
  const reservationId = pi.metadata?.reservationId;
  if (!reservationId) {
    console.error(`PaymentIntent ${pi.id} succeeded but has no reservationId metadata`);
    return;
  }

  // Confirm the Guesty reservation.
  try {
    await guestyOpenFetch(`/v1/reservations/${reservationId}`, {
      method: "PUT",
      body: JSON.stringify({ status: "confirmed" }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to confirm Guesty reservation ${reservationId}:`, message);
    // Don't throw — payment is real; this needs ops follow-up but shouldn't trigger retries.
  }

  // Send confirmation email.
  await sendConfirmationEmail({
    reservationId,
    guestEmail: pi.metadata.guestEmail || pi.receipt_email || "",
    guestName: pi.metadata.guestName || "Guest",
    checkInDate: pi.metadata.checkInDate || "",
    checkOutDate: pi.metadata.checkOutDate || "",
    guestsCount: pi.metadata.guestsCount || "",
    total: (pi.amount_received || pi.amount) / 100,
    currency: pi.currency.toUpperCase(),
  });
}

async function handlePaymentFailed(pi: Stripe.PaymentIntent) {
  const reservationId = pi.metadata?.reservationId;
  if (!reservationId) return;
  try {
    await guestyOpenFetch(`/v1/reservations/${reservationId}`, {
      method: "DELETE",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to cancel reservation ${reservationId} after payment failure:`, message);
  }
}

async function sendConfirmationEmail(args: {
  reservationId: string;
  guestEmail: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: string;
  total: number;
  currency: string;
}) {
  if (!args.guestEmail || !process.env.PLYMOUTH_EMAIL_PASS) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@theplymouthchicago.com",
      pass: process.env.PLYMOUTH_EMAIL_PASS,
    },
  });

  const total = args.total.toFixed(2);
  const text = `
Hi ${args.guestName},

Your stay at The Plymouth Chicago is confirmed.

Reservation: ${args.reservationId}
Check-in: ${args.checkInDate}
Check-out: ${args.checkOutDate}
Guests: ${args.guestsCount}
Total charged: ${args.currency} ${total}

You'll receive your check-in instructions and digital key 24 hours before arrival.

Cancellation policy: Free cancellation up to 48 hours before check-in. Cancellations within 48 hours forfeit the first night's rate.

Questions? Reply to this email or call (708) 866-0029.

— The Plymouth Chicago Team
417 S Dearborn St, Chicago, IL 60605
`.trim();

  await transporter.sendMail({
    from: '"The Plymouth Chicago" <info@theplymouthchicago.com>',
    to: args.guestEmail,
    bcc: "info@theplymouthchicago.com",
    subject: `Your Plymouth Chicago stay is confirmed — ${args.checkInDate} to ${args.checkOutDate}`,
    text,
  });
}
