import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { FaqPage } from "@/components/marketing/pages/faq-page";

export const metadata: Metadata = createPageMetadata({
  title: "FAQ",
  description:
    "Answers about Corelane migration, SSO, refunds, multi-location ops, and resetting the demo.",
  path: "/faq",
});

export default function Page() {
  return <FaqPage />;
}
