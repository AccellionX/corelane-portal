import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { AuthPage } from "@/components/marketing/pages/auth-page";

export const metadata: Metadata = createPageMetadata({
  title: "Login",
  description: "Sign in to your Corelane workspace. Mock auth redirects to the customer dashboard.",
  path: "/login",
});

export default function Page() {
  return <AuthPage mode="login" />;
}
