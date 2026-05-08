import { NextRequest, NextResponse } from "next/server";
import { guestyOpenFetch, GuestyApiError } from "../../guesty/open-client";

interface QuoteBody {
  listingId: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
}

export async function POST(req: NextRequest) {
  let body: QuoteBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { listingId, checkInDate, checkOutDate, guestsCount } = body;
  if (!listingId || !checkInDate || !checkOutDate || !guestsCount) {
    return NextResponse.json(
      { error: "listingId, checkInDate, checkOutDate, guestsCount required" },
      { status: 400 }
    );
  }

  try {
    const data = (await guestyOpenFetch("/v1/quotes", {
      method: "POST",
      body: JSON.stringify({
        listingId,
        checkInDateLocalized: checkInDate,
        checkOutDateLocalized: checkOutDate,
        guestsCount,
        source: "direct",
      }),
    })) as GuestyQuote;

    const ratePlan = data.rates?.ratePlans?.[0];
    const money = ratePlan?.money?.money;
    if (!money) {
      return NextResponse.json(
        { error: "Quote returned no pricing", raw: data },
        { status: 502 }
      );
    }

    const nights = (ratePlan.days ?? []).map((d) => ({
      date: d.date,
      price: d.price,
    }));

    return NextResponse.json({
      quoteId: data._id,
      expiresAt: data.expiresAt,
      currency: money.currency || "USD",
      nights,
      fareAccommodation: money.fareAccommodation ?? 0,
      fareCleaning: money.fareCleaning ?? 0,
      subTotal: money.subTotalPrice ?? 0,
      totalFees: money.totalFees ?? 0,
      totalTaxes: money.totalTaxes ?? 0,
      total: money.hostPayout ?? 0,
      checkInDate: data.checkInDateLocalized,
      checkOutDate: data.checkOutDateLocalized,
      guestsCount: data.guestsCount,
      listingId: data.unitTypeId,
    });
  } catch (err: unknown) {
    if (err instanceof GuestyApiError) {
      return NextResponse.json(
        { error: err.message, status: err.status },
        { status: err.status >= 400 && err.status < 500 ? 400 : 502 }
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    console.error("Quote error:", message);
    return NextResponse.json({ error: "Quote failed" }, { status: 500 });
  }
}

interface GuestyQuote {
  _id: string;
  expiresAt: string;
  checkInDateLocalized: string;
  checkOutDateLocalized: string;
  guestsCount: number;
  unitTypeId: string;
  rates?: {
    ratePlans?: Array<{
      days?: Array<{ date: string; price: number }>;
      money?: {
        money?: {
          currency?: string;
          fareAccommodation?: number;
          fareCleaning?: number;
          subTotalPrice?: number;
          totalFees?: number;
          totalTaxes?: number;
          hostPayout?: number;
        };
      };
    }>;
  };
}
