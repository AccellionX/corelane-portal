import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ContactPage } from "@/components/marketing/pages/contact-page";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: "Reach the Corelane demo team - send a message and get a success toast confirmation.",
  path: "/contact",
});

export default function Page() {
  return <ContactPage />;
}
