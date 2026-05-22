import { NextRequest, NextResponse } from "next/server";
import { forceRefreshGuestyToken } from "@/lib/guesty-token-cache";

export const dynamic = "force-dynamic";

// Called by Vercel cron every 12 hours. Pre-fetches a fresh Guesty Open API
// token and writes it to the shared Upstash cache so cold-start Lambdas never
// have to race for one. Also callable manually with ?secret=$CRON_SECRET.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const querySecret = url.searchParams.get("secret");
  const headerSecret = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (querySecret !== expected && headerSecret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const token = await forceRefreshGuestyToken();
    return NextResponse.json({
      ok: true,
      tokenPrefix: token.slice(0, 24) + "...",
      refreshedAt: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("refresh-guesty-token failed:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
