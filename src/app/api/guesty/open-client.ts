import { getSharedGuestyToken, forceRefreshGuestyToken } from "@/lib/guesty-token-cache";

const API_BASE = "https://open-api.guesty.com";

export async function guestyOpenFetch(path: string, opts?: RequestInit) {
  // Emergency kill-switch: bypass ALL Guesty traffic from this Lambda. Used
  // when Guesty's OAuth endpoint is locked in a rate-limit storm so we let the
  // window drain without piling on. Callers should catch and degrade.
  if (process.env.GUESTY_BOOKING_MAINTENANCE === "true") {
    throw new GuestyApiError("Guesty client paused (maintenance)", 503, null);
  }

  const token = await getSharedGuestyToken();
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

  // On 401/403 the cached token is dead. Force-refresh and retry once.
  if (res.status === 401 || res.status === 403) {
    const fresh = await forceRefreshGuestyToken();
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
