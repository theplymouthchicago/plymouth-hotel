import { guestyOpenFetch, GuestyApiError } from "@/app/api/guesty/open-client";
import type { Quote } from "@/lib/types";

export interface QuoteRequest {
  listingId: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  couponCode?: string;
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
  coupons?: Array<{ code?: string; discountAmount?: number; amount?: number }>;
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
          couponDiscount?: number;
        };
      };
    }>;
  };
}

export async function fetchQuote(req: QuoteRequest): Promise<Quote> {
  if (!req.listingId || !req.checkInDate || !req.checkOutDate || !req.guestsCount) {
    throw new QuoteError("listingId, checkInDate, checkOutDate, guestsCount required", 400);
  }

  const trimmedCoupon = req.couponCode?.trim();
  const body: Record<string, unknown> = {
    listingId: req.listingId,
    checkInDateLocalized: req.checkInDate,
    checkOutDateLocalized: req.checkOutDate,
    guestsCount: req.guestsCount,
    source: "direct",
  };
  if (trimmedCoupon) body.coupons = [trimmedCoupon];

  let data: GuestyQuoteResponse;
  try {
    data = (await guestyOpenFetch("/v1/quotes", {
      method: "POST",
      body: JSON.stringify(body),
    })) as GuestyQuoteResponse;
  } catch (err) {
    if (err instanceof GuestyApiError) {
      // Surface Guesty's coupon errors verbatim so users see "Invalid coupon code" etc.
      const status = err.status >= 400 && err.status < 500 ? 400 : 502;
      throw new QuoteError(err.message, status);
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

  // Guesty surfaces coupon details in either rates.ratePlans[0].money.money.couponDiscount
  // or the top-level coupons[] array — read both, prefer whichever has a value.
  const appliedCoupon = data.coupons?.[0];
  const appliedDiscount =
    money.couponDiscount ??
    appliedCoupon?.discountAmount ??
    appliedCoupon?.amount;
  const couponCodeApplied = appliedCoupon?.code || (trimmedCoupon && appliedDiscount ? trimmedCoupon : undefined);

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
    couponCode: couponCodeApplied,
    discountAmount: appliedDiscount && appliedDiscount > 0 ? appliedDiscount : undefined,
  };
}
