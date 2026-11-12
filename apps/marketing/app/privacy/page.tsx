import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${site.name} collects, uses and protects your information.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="12 November 2026">
      <p>
        This policy explains what information {site.name} collects when you visit this website or request a demo,
        and how we use it.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Details you give us in forms: your name, mobile number, restaurant name, city and business type.</li>
        <li>Basic technical data such as browser type and pages visited, only if you accept analytics cookies.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To contact you about the demo or integration you asked about.</li>
        <li>To improve this website, using aggregated analytics.</li>
      </ul>
      <p>We do not sell your information. We share it only with service providers who help us run our business.</p>
      <h2>Cookies</h2>
      <p>
        Essential cookies keep the site working and remember your preferences (theme, language, cookie choice).
        Analytics cookies are used only if you choose &quot;Accept&quot; in the cookie banner.
      </p>
      <h2>Your choices</h2>
      <p>
        You can ask us to see, correct or delete your information by writing to{" "}
        <a href={`mailto:${site.contact.email}`} className="font-semibold text-brand underline">
          {site.contact.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
