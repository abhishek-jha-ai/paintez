import { services } from "@/config/content";
import { seo } from "@/config/seo";
import { siteConfig } from "@/config/site";

/** HousePainter (LocalBusiness) JSON-LD — only verified fields; blanks are omitted. */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HousePainter",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.businessName,
    description: seo.description,
    url: siteConfig.url,
    image: `${siteConfig.url}${seo.ogImage.path}`,
    logo: `${siteConfig.url}/icon.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.state,
      addressCountry: siteConfig.country,
    },
    areaServed: { "@type": "City", name: `${siteConfig.city}, ${siteConfig.state}` },
    ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
    ...(siteConfig.instagram || siteConfig.facebook
      ? { sameAs: [siteConfig.instagram, siteConfig.facebook].filter(Boolean) }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Painting services",
      itemListElement: services
        .filter((s) => s.id !== "more")
        .map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, areaServed: `${siteConfig.city}, ${siteConfig.state}` } })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
