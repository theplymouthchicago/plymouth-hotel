import { unstable_cache } from "next/cache";

const TOKEN_URL = "https://open-api.guesty.com/oauth2/token";
const API_BASE = "https://open-api.guesty.com";

const fetchToken = unstable_cache(
  async () => {
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
    });
    if (!res.ok) {
      throw new Error(`Open API token fetch failed: ${res.status} - ${await res.text()}`);
    }
    const data = await res.json();
    if (!data.access_token) {
      throw new Error(`No token in response: ${JSON.stringify(data)}`);
    }
    return data.access_token as string;
  },
  ["guesty-open-api-token"],
  { revalidate: 82800 } // 23 hours
);

async function getToken(): Promise<string> {
  return fetchToken();
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
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const err = data as { error?: { message?: string }; message?: string };
    throw new GuestyApiError(
      err?.error?.message || err?.message || `Guesty Open API ${res.status}`,
      res.status,
      data
    );
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
