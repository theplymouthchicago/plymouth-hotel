import { guestyOpenFetch, GuestyApiError } from "@/app/api/guesty/open-client";
import type { Quote } from "@/lib/types";

export interface QuoteRequest {
  listingId: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
}

export class QuoteError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "QuoteError";
    this.status = status;
  }
}

interface GuestyQuoteResponse {
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

export async function fetchQuote(req: QuoteRequest): Promise<Quote> {
  if (!req.listingId || !req.checkInDate || !req.checkOutDate || !req.guestsCount) {
    throw new QuoteError("listingId, checkInDate, checkOutDate, guestsCount required", 400);
  }

  let data: GuestyQuoteResponse;
  try {
    data = (await guestyOpenFetch("/v1/quotes", {
      method: "POST",
      body: JSON.stringify({
        listingId: req.listingId,
        checkInDateLocalized: req.checkInDate,
        checkOutDateLocalized: req.checkOutDate,
        guestsCount: req.guestsCount,
        source: "direct",
      }),
    })) as GuestyQuoteResponse;
  } catch (err) {
    if (err instanceof GuestyApiError) {
      throw new QuoteError(err.message, err.status >= 400 && err.status < 500 ? 400 : 502);
    }
    throw new QuoteError(err instanceof Error ? err.message : "Quote failed", 500);
  }

  const ratePlan = data.rates?.ratePlans?.[0];
  const money = ratePlan?.money?.money;
  if (!money) {
    throw new QuoteError("Quote returned no pricing", 502);
  }

  const nights = (ratePlan.days ?? []).map((d) => ({
    date: d.date,
    price: d.price,
  }));

  return {
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
  };
}
