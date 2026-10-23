import Link from "next/link";
import { AuthForm } from "@/components/marketing/auth-form";
import { Logo } from "@/components/logo";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";

  return (
    <section className="gradient-mesh">
      <div className="page-shell flex flex-col items-center py-12 sm:py-16 lg:py-20">
        <Link href="/" className="mb-8 sm:hidden">
          <Logo />
        </Link>
        <div className="mb-8 max-w-md text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {isLogin ? "Welcome back" : "Create your workspace"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin
              ? "Mock sign-in - any valid email and 8+ character password continues to /app."
              : "Mock sign-up - Continue with Google or email lands you in the dashboard."}
          </p>
        </div>
        <AuthForm mode={mode} />
      </div>
    </section>
  );
}
