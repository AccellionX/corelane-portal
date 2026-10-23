import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { FeaturesPage } from "@/components/marketing/pages/features-page";

export const metadata: Metadata = createPageMetadata({
  title: "Features",
  description:
    "Explore Corelane features — capacity, revenue, contextual support, and admin controls.",
  path: "/features",
});

export default function Page() {
  return <FeaturesPage />;
}
