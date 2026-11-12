import { JsonLd, faqLd } from "@/components/seo/JsonLd";
import { BusinessTypes } from "@/sections/BusinessTypes";
import { Faq } from "@/sections/Faq";
import { FeaturesBento } from "@/sections/FeaturesBento";
import { FinalCta } from "@/sections/FinalCta";
import { Hero } from "@/sections/Hero";
import { HowItWorks } from "@/sections/HowItWorks";
import { Integrations } from "@/sections/Integrations";
import { Numbers } from "@/sections/Numbers";
import { PricingSection } from "@/sections/PricingSection";
import { ProductTour } from "@/sections/ProductTour";
import { Solutions } from "@/sections/Solutions";
import { Testimonials } from "@/sections/Testimonials";
import { WhyUs } from "@/sections/WhyUs";

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqLd()} />
      <Hero />
      <BusinessTypes />
      <FeaturesBento />
      <HowItWorks />
      <ProductTour />
      <Solutions />
      <WhyUs />
      <Numbers />
      <Integrations />
      <Testimonials />
      <PricingSection />
      <Faq />
      <FinalCta />
    </>
  );
}
