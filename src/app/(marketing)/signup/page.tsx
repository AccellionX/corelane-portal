import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { AuthPage } from "@/components/marketing/pages/auth-page";

export const metadata: Metadata = createPageMetadata({
  title: "Sign up",
  description: "Create a Corelane workspace. Mock sign-up continues into the customer dashboard.",
  path: "/signup",
});

export default function Page() {
  return <AuthPage mode="signup" />;
}
