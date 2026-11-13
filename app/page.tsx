import { AboutSection } from "@/components/sections/about";
import { GeneratorStudio } from "@/components/sections/generator-studio";
import { Hero } from "@/components/sections/hero";
import { SecuritySection } from "@/components/sections/security";
import { ToolsSection } from "@/components/sections/tools-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "A privacy-first cryptographic toolkit for generating passwords, API keys, hex strings, Base64 data, SHA-256 hashes, and UUID v4 identifiers entirely in the browser.",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a browser with the Web Crypto API",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Cryptographically secure password generation",
    "API key generation with custom prefixes",
    "Hex and Base64 token generation",
    "SHA-256 hashing via crypto.subtle",
    "UUID v4 generation",
    "Entropy and strength estimation",
    "No server-side processing or data storage",
  ],
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Hero />
        <GeneratorStudio />
        <ToolsSection />
        <SecuritySection />
        <AboutSection />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
    </>
  );
}
