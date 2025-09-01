import type { MetadataRoute } from "next";
import { site } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // If you later add pages, enrich this list or auto-discover.
  const routes = [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ] as const;

  return routes.map((r) => ({
    url: r.url,
    lastModified: r.lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
