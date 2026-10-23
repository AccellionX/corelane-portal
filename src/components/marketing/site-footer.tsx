import Link from "next/link";
import { Logo } from "@/components/logo";
import { MARKETING_NAV } from "@/components/marketing/nav-links";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-zinc-50/80 dark:bg-zinc-950/50">
      <div className="page-shell py-12 sm:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Corelane unifies bookings, billing, and support so growing teams ship work without
              juggling five dashboards.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Product
              </p>
              <ul className="mt-3 space-y-2">
                {MARKETING_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-foreground/80 transition hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/login" className="text-sm text-foreground/80 transition hover:text-foreground">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-sm text-foreground/80 transition hover:text-foreground">
                    Sign up
                  </Link>
                </li>
                <li>
                  <Link href="/app" className="text-sm text-foreground/80 transition hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Demo
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/admin" className="text-sm text-foreground/80 transition hover:text-foreground">
                    Admin panel
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Corelane Demo
          </p>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Demo built for your Upwork post by AccellionX
          </p>
        </div>
      </div>
    </footer>
  );
}
