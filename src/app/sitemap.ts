import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.theplymouthchicago.com";
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/rooms`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/rooms/2-bedroom`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/rooms/3-bedroom`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/rooms/4-bedroom`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/location`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
