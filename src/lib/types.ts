export interface Quote {
  quoteId: string;
  expiresAt: string;
  currency: string;
  nights: { date: string; price: number }[];
  fareAccommodation: number;
  fareCleaning: number;
  subTotal: number;
  totalFees: number;
  totalTaxes: number;
  total: number;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  listingId: string;
}
