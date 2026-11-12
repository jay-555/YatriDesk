import { site } from "@/config/site";
import { planPrice } from "@/lib/pricing";

/** Renders structured data. `<` is escaped so content can't close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function softwareApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    description: site.description,
    url: site.url,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Restaurant point of sale",
    operatingSystem: "Web, Windows, Android, iOS",
    inLanguage: ["en-IN", "hi-IN"],
    offers: site.pricing.tiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: planPrice(tier.monthly, "monthly").perMonth,
      priceCurrency: site.pricing.currency,
      description: `${tier.name} plan, ${tier.unit}, excluding GST`,
    })),
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
