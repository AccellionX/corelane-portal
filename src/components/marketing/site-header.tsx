"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { MARKETING_NAV } from "@/components/marketing/nav-links";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    cn(
      "text-sm transition hover:text-foreground",
      pathname === href ? "font-medium text-foreground" : "text-muted-foreground"
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="page-shell flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Corelane home" className="shrink-0">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {MARKETING_NAV.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild className="hidden rounded-xl sm:inline-flex">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="hidden rounded-xl bg-indigo-600 hover:bg-indigo-500 sm:inline-flex">
            <Link href="/signup">Get started</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[min(100vw-2rem,20rem)] flex-col p-0">
              <SheetTitle className="sr-only">Main navigation</SheetTitle>
              <div className="flex h-16 shrink-0 items-center border-b border-border/60 px-5">
                <Logo />
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                {MARKETING_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-3 py-3 text-sm font-medium transition",
                      pathname === item.href
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                        : "text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="shrink-0 space-y-2 border-t border-border/60 p-4">
                <Button asChild variant="outline" className="w-full rounded-xl">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500">
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    Get started
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
