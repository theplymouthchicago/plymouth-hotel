import { NextRequest, NextResponse } from "next/server";
import { guestyFetch } from "../client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!listingId || !from || !to) {
    return NextResponse.json({ error: "listingId, from, to required" }, { status: 400 });
  }

  try {
    const data = await guestyFetch(
      `/listings/${listingId}/calendar?from=${from}&to=${to}`
    );
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch calendar" }, { status: 500 });
  }
}
