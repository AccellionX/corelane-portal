import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { HomePage } from "@/components/marketing/pages/home-page";

export const metadata: Metadata = createPageMetadata({
  title: "Corelane",
  description:
    "Operate every lane from one calm control plane. Bookings, billing, and support unified for growing teams.",
  path: "/",
});

export default function Page() {
  return <HomePage />;
}
