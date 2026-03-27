const TOKEN_URL = "https://booking.guesty.com/oauth2/token";
const API_BASE = "https://booking.guesty.com/api";

let _token: string | null = null;
let _tokenExpiry = 0;

export async function getToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry - 60_000) return _token;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.GUESTY_BOOKING_CLIENT_ID!,
      client_secret: process.env.GUESTY_BOOKING_CLIENT_SECRET!,
    }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
  const data = await res.json();
  _token = data.access_token;
  _tokenExpiry = Date.now() + (data.expires_in ?? 86400) * 1000;
  return _token!;
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
  });
  return res.json();
}
