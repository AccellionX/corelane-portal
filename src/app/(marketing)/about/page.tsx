import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { AboutPage } from "@/components/marketing/pages/about-page";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Learn why Corelane exists - a calm control plane for bookings, billing, and support.",
  path: "/about",
});

export default function Page() {
  return <AboutPage />;
}
