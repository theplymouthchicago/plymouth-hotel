import { NextRequest, NextResponse } from "next/server";

const GUESTY_HOST = "https://theplymouthchicago.guestybookings.com";

const LISTINGS: Record<string, string> = {
  "2": "69b8610659a0a7001528058c",
  "3": "69b863afab91d0002330efdb",
  "4": "69b866a2139149001c905bfa",
};

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const beds = searchParams.get("beds") ?? "2";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";

  const listingId = LISTINGS[beds] ?? LISTINGS["2"];

  const params = new URLSearchParams({ adults: "2" });
  if (beds) params.set("minOccupancy", beds);
  if (checkIn) params.set("checkIn", checkIn);
  if (checkOut) params.set("checkOut", checkOut);

  const url = `${GUESTY_HOST}/en/properties/${listingId}?${params.toString()}`;
  return NextResponse.redirect(url, { status: 302 });
}
