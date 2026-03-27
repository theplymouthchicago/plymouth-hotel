import { unstable_cache } from "next/cache";

const TOKEN_URL = "https://booking.guesty.com/oauth2/token";
const API_BASE = "https://booking.guesty.com/api";

// Fetch and cache token for 23 hours across all serverless instances
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
        client_id: process.env.GUESTY_BOOKING_CLIENT_ID!,
        client_secret: process.env.GUESTY_BOOKING_CLIENT_SECRET!,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Token fetch failed: ${res.status} - ${err}`);
    }

    const data = await res.json();
    if (!data.access_token) {
      throw new Error(`No token in response: ${JSON.stringify(data)}`);
    }

    return data.access_token as string;
  },
  ["guesty-booking-token"],
  { revalidate: 82800 } // 23 hours
);

export async function getToken(): Promise<string> {
  // Static token env var bypasses rate-limited endpoint
  if (process.env.GUESTY_STATIC_TOKEN) return process.env.GUESTY_STATIC_TOKEN;
  return fetchToken();
}

export async function guestyFetch(path: string, opts?: RequestInit) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(opts?.headers ?? {}),
    },
    next: { revalidate: 120 },
  });
  return res.json();
}
