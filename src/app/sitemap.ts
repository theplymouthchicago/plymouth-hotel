import { MetadataRoute } from "next";

const BASE = "https://www.theplymouthchicago.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE,                        lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/rooms`,             lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/rooms/2-bedroom`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/rooms/3-bedroom`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/rooms/4-bedroom`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/location`,          lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/experience`,        lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/faq`,               lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`,           lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
