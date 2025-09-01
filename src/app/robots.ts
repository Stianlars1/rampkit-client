import type { MetadataRoute } from "next";
import { site } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Example: disallow any future private pages:
      // { userAgent: "*", disallow: ["/private/"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
