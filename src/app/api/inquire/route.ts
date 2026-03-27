import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, checkIn, checkOut, guests, room } = body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@theplymouthchicago.com",
      pass: process.env.PLYMOUTH_EMAIL_PASS,
    },
  });

  const text = `
New Reservation Request — The Plymouth Chicago

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Room: ${room || "Not selected"}
Check In: ${checkIn}
Check Out: ${checkOut}
Guests: ${guests}

Reply to this email or call ${phone} to confirm.
  `.trim();

  try {
    await transporter.sendMail({
      from: '"The Plymouth Chicago" <info@theplymouthchicago.com>',
      to: "info@theplymouthchicago.com",
      replyTo: email,
      subject: `Reservation Request — ${room} | ${checkIn} to ${checkOut}`,
      text,
    });

    // Auto-reply to guest
    await transporter.sendMail({
      from: '"The Plymouth Chicago" <info@theplymouthchicago.com>',
      to: email,
      subject: "We received your reservation request — The Plymouth Chicago",
      text: `Hi ${name},\n\nThank you for your interest in The Plymouth Chicago! We received your request for the ${room} Suite (${checkIn} to ${checkOut}, ${guests} guests).\n\nOur team will confirm your reservation within 1 hour. Questions? Call us at (708) 866-0029.\n\nWarm regards,\nThe Plymouth Chicago Team\n417 S Dearborn St, Chicago, IL 60605`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Email error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
