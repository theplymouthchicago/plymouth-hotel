import { NextRequest, NextResponse } from "next/server";
import { fetchQuote, QuoteError } from "@/lib/booking/quote";

export async function POST(req: NextRequest) {
  let body: { listingId: string; checkInDate: string; checkOutDate: string; guestsCount: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const quote = await fetchQuote(body);
    return NextResponse.json(quote);
  } catch (err) {
    if (err instanceof QuoteError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : String(err);
    console.error("Quote error:", message);
    return NextResponse.json({ error: "Quote failed" }, { status: 500 });
  }
}
