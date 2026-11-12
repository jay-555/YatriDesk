import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: `The terms that apply when you use the ${site.name} website and service.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of service" updated="12 November 2026">
      <p>
        These terms apply to your use of the {site.name} website. Your subscription to the {site.name} product is
        covered by the agreement you accept when you sign up.
      </p>
      <h2>Using this website</h2>
      <ul>
        <li>Content on this site is for general information and may change without notice.</li>
        <li>Prices shown are indicative and exclude GST until confirmed on your invoice.</li>
        <li>Product screens shown are illustrations; the product may look slightly different.</li>
      </ul>
      <h2>Free trial</h2>
      <p>
        Trials give you full access for a limited period. We may change or end the trial offer at any time; it does
        not affect trials already started.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms? Write to{" "}
        <a href={`mailto:${site.contact.email}`} className="font-semibold text-brand underline">
          {site.contact.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
