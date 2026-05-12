const TOKEN_URL = "https://open-api.guesty.com/oauth2/token";
const API_BASE = "https://open-api.guesty.com";

// Module-scope memoization: persists for the lifetime of the Lambda instance.
// Tokens are valid for several hours; we re-fetch only when expired or absent.
let cachedToken: { value: string; expiresAt: number } | null = null;
let pendingTokenFetch: Promise<string> | null = null;

async function fetchTokenOnce(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.GUESTY_OPEN_API_CLIENT_ID!,
      client_secret: process.env.GUESTY_OPEN_API_CLIENT_SECRET!,
      scope: "open-api",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Open API token fetch failed: ${res.status} - ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) {
    throw new Error(`No token in response: ${JSON.stringify(data)}`);
  }
  // expires_in is typically 24 hours; refresh 5 minutes early to avoid edge cases.
  const ttlMs = (data.expires_in ?? 86400) * 1000 - 5 * 60 * 1000;
  cachedToken = { value: data.access_token, expiresAt: Date.now() + ttlMs };
  return data.access_token;
}

async function getToken(): Promise<string> {
  if (process.env.GUESTY_STATIC_TOKEN) return process.env.GUESTY_STATIC_TOKEN;
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  // Coalesce concurrent token fetches so we never burn rate limit during cold starts.
  if (!pendingTokenFetch) {
    pendingTokenFetch = fetchTokenOnce().finally(() => {
      pendingTokenFetch = null;
    });
  }
  return pendingTokenFetch;
}

export async function guestyOpenFetch(path: string, opts?: RequestInit) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(opts?.headers ?? {}),
    },
    cache: "no-store",
  });
  // Refresh token + retry once on 401 (token may have been revoked or expired early).
  if (res.status === 401) {
    cachedToken = null;
    const fresh = await getToken();
    const retry = await fetch(`${API_BASE}${path}`, {
      ...opts,
      headers: {
        Authorization: `Bearer ${fresh}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(opts?.headers ?? {}),
      },
      cache: "no-store",
    });
    return parseGuestyResponse(retry, path);
  }
  return parseGuestyResponse(res, path);
}

async function parseGuestyResponse(res: Response, path: string) {
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const err = data as { error?: { message?: string; data?: unknown }; message?: string };
    const errData = err?.error?.data;
    const dataDetail = Array.isArray(errData) ? errData.join("; ") : typeof errData === "string" ? errData : "";
    const detail =
      [err?.error?.message, dataDetail, err?.message].filter(Boolean).join(" — ") ||
      (text ? text.slice(0, 300) : `Guesty Open API ${res.status}`);
    console.error(`Guesty Open API ${res.status} on ${path}:`, text.slice(0, 500));
    throw new GuestyApiError(detail, res.status, data);
  }
  return data;
}

export class GuestyApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "GuestyApiError";
    this.status = status;
    this.body = body;
  }
}
