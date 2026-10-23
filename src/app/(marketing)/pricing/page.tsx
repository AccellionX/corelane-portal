import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { PricingPage } from "@/components/marketing/pages/pricing-page";

export const metadata: Metadata = createPageMetadata({
  title: "Pricing",
  description:
    "Starter $19, Growth $49, Scale $129. Save with annual billing - two months free.",
  path: "/pricing",
});

export default function Page() {
  return <PricingPage />;
}
