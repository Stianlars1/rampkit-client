import { site } from "@/lib/seo/site";
import { Metadata, ResolvingMetadata } from "next";
import { RampKitApp } from "@/app/(home)/app";
import { SearchParams } from "@/types";

type Props = {
  params: Promise<Record<string, never>>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata(
  { searchParams }: Props,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const sp = await searchParams;
  const hex = (sp.hex ?? "").replace(/^#/, "").toUpperCase();
  const scheme = sp.scheme?.toLowerCase();
  const harmonize = sp.harmonize === "true";

  const titleBits = [
    hex ? `#${hex}` : null,
    scheme ? `${scheme}` : null,
    harmonize ? "harmonized" : null,
  ].filter(Boolean);

  const dynamicTitle = titleBits.length
    ? `${titleBits.join(" • ")} palette`
    : site.tagline;

  return {
    title: dynamicTitle,
    description: site.description,
    alternates: {
      canonical: hex ? `${site.url}/?hex=${hex}` : site.url,
    },
    // Optionally, enrich OG labels according to params too.
    openGraph: { title: `${dynamicTitle} — ${site.name}` },
  };
}

export default async function HomePage() {
  return <RampKitApp />;
}
