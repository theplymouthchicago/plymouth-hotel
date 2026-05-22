import { get as edgeConfigGet } from "@vercel/edge-config";

// Shared Guesty Open API token cache backed by Vercel Edge Config.
//
// Why Edge Config: Guesty's /oauth2/token endpoint is hard-limited to 5
// requests per DAY per client_id. On 2026-05-20, our previous static-token
// pattern silently expired, every cold-start Lambda raced to refresh, the 5/day
// budget was burned in seconds, and Guesty locked the entire account for ~2
// hours until the next 00:00 UTC reset.
//
// Architecture:
//   - The cron at /api/internal/refresh-guesty-token is the SOLE writer. It
//     fetches one token every 12h via the Vercel API and stores it in Edge
//     Config under the key `guesty_open_api_token`.
//   - Lambdas at runtime ONLY READ. They never call /oauth2/token unless
//     Guesty returns 401/403 on an actual API call (in which case a single
//     direct-fetch retry runs, using 1 of 5 daily budget).
//   - This guarantees we never burn more than ~3 of 5 daily tokens under
//     normal operation (2 cron refreshes + headroom for retries).

const TOKEN_URL = "https://open-api.guesty.com/oauth2/token";
const EDGE_CONFIG_KEY = "guesty_open_api_token";

export interface StoredToken {
  value: string;
  expiresAt: number; // unix ms
}

async function readFromEdgeConfig(): Promise<string | null> {
  // @vercel/edge-config reads the EDGE_CONFIG env var automatically.
  if (!process.env.EDGE_CONFIG) return null;
  try {
    const stored = (await edgeConfigGet<StoredToken>(EDGE_CONFIG_KEY)) ?? null;
    if (!stored?.value || !stored.expiresAt) return null;
    if (stored.expiresAt <= Date.now() + 60_000) return null; // 1-min skew buffer
    return stored.value;
  } catch (err) {
    console.warn("Edge Config read failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

// Direct OAuth fetch — only called from cron (proactive) or 401/403 retry (rare).
async function fetchTokenDirect(): Promise<StoredToken> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.GUESTY_OPEN_API_CLIENT_ID!,
      client_secret: process.env.GUESTY_OPEN_API_CLIENT_SECRET!,
      scope: "open-api",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 429) {
      const reset = res.headers.get("retry-after") ?? res.headers.get("ratelimit-reset");
      throw new Error(
        `Guesty OAuth 429 — daily 5-token budget exhausted; resets in ${reset}s`,
      );
    }
    throw new Error(`Guesty OAuth ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("Guesty OAuth response missing access_token");
  return {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 86400) * 1000,
  };
}

// Write a new token to Edge Config via the Vercel API. Requires VERCEL_API_TOKEN
// and EDGE_CONFIG_ID. Cron-only path.
async function writeToEdgeConfig(token: StoredToken): Promise<void> {
  const vercelToken = process.env.VERCEL_API_TOKEN;
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (!vercelToken || !edgeConfigId) {
    throw new Error("VERCEL_API_TOKEN and EDGE_CONFIG_ID required to write Edge Config");
  }
  const url = `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${teamId ? `?teamId=${teamId}` : ""}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${vercelToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [{ operation: "upsert", key: EDGE_CONFIG_KEY, value: token }],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Edge Config write failed: ${res.status} ${body.slice(0, 200)}`);
  }
}

// Per-Lambda fallback cache (cold start memo) so a Lambda that did a 401/403
// fetch doesn't re-fetch on its next request before the next cron run.
let lambdaFallbackToken: StoredToken | null = null;

export async function getSharedGuestyToken(): Promise<string> {
  const fromEdge = await readFromEdgeConfig();
  if (fromEdge) return fromEdge;
  if (lambdaFallbackToken && lambdaFallbackToken.expiresAt > Date.now() + 60_000) {
    return lambdaFallbackToken.value;
  }
  // Edge Config is empty / stale (e.g. first deploy before cron runs). Fall
  // through to a direct fetch — costs 1 of 5 daily tokens but unblocks the
  // booking flow until the next cron tick fills the cache.
  const fresh = await fetchTokenDirect();
  lambdaFallbackToken = fresh;
  return fresh.value;
}

// Verify the Vercel API token can write to Edge Config BEFORE we burn a Guesty
// token. A no-op upsert against a sentinel key is cheap and tells us the API
// token is still valid. If this fails, refuse to fetch — otherwise we'd burn
// a Guesty token (1 of 5 daily) with no way to persist it.
async function verifyEdgeConfigWritable(): Promise<void> {
  const vercelToken = process.env.VERCEL_API_TOKEN;
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (!vercelToken || !edgeConfigId) {
    throw new Error("VERCEL_API_TOKEN/EDGE_CONFIG_ID missing — cannot persist refreshed token");
  }
  const url = `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${teamId ? `?teamId=${teamId}` : ""}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${vercelToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [{ operation: "upsert", key: "_last_refresh_probe", value: { at: new Date().toISOString() } }],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Vercel API write probe failed: ${res.status} ${body.slice(0, 200)}`);
  }
}

// Called by the cron + by the 401/403 retry path. Fetches a new token and
// writes it to Edge Config so every other Lambda picks it up on next read.
//
// Idempotency: if Edge Config already has a token with >6h remaining, skip the
// fetch entirely. This prevents double-fetches from cron retries + Vercel deploy
// hooks, which is what burned today's 5-token budget post-reset on 2026-05-21.
//
// Safety: verify write-ability BEFORE the Guesty fetch. We'd rather fail loud
// than burn a Guesty token and leak it on a stale Vercel API token.
export async function forceRefreshGuestyToken(): Promise<string> {
  // Idempotency guard — short-circuit if Edge Config already has a healthy token.
  const existing = await readFromEdgeConfig();
  if (existing) {
    // readFromEdgeConfig already does a 1-min skew buffer; require a longer
    // buffer here so we refresh ~6h before expiry, not at the last second.
    const r = await import("@vercel/edge-config").then((m) => m.get<StoredToken>(EDGE_CONFIG_KEY));
    if (r && r.expiresAt > Date.now() + 6 * 3600 * 1000) {
      return r.value;
    }
  }
  await verifyEdgeConfigWritable();
  const fresh = await fetchTokenDirect();
  lambdaFallbackToken = fresh;
  await writeToEdgeConfig(fresh);
  return fresh.value;
}
