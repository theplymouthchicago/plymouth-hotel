const TOKEN_URL = "https://booking.guesty.com/oauth2/token";
const API_BASE = "https://booking.guesty.com/api";

export async function getToken(): Promise<string> {
  // Use Next.js fetch cache to persist token across serverless invocations
  // Revalidate every 23 hours (token is valid for 24h)
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
    next: { revalidate: 82800 }, // Cache for 23 hours
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token fetch failed: ${res.status} - ${err}`);
  }

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`No access_token in response: ${JSON.stringify(data)}`);
  }

  return data.access_token as string;
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
    next: { revalidate: 60 }, // Cache API responses for 60 seconds
  });
  return res.json();
}
