import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_APP_URL || "https://proofloop-eta.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/pricing", "/login", "/signup", "/embed", "/privacy", "/terms"];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
