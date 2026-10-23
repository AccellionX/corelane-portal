"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav, type NavItem } from "@/components/shell/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCorelaneStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export function AppShell({
  title,
  nav,
  children,
  homeHref,
}: {
  title: string;
  nav: NavItem[];
  children: React.ReactNode;
  homeHref: string;
}) {
  const [open, setOpen] = useState(false);
  const role = useCorelaneStore((s) => s.role);
  const environment = useCorelaneStore((s) => s.environment);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border/60 px-5">
        <Link href={homeHref}>
          <Logo />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarNav items={nav} />
      </div>
      <div className="border-t border-border/60 p-4">
        <p className="text-xs text-muted-foreground">Acting as</p>
        <p className="mt-0.5 text-sm font-medium">{role}</p>
        <Badge variant="outline" className="mt-2 rounded-full text-[10px] uppercase">
          {environment}
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50/80 dark:bg-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-background lg:block">
          {sidebar}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/90 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  {sidebar}
                </SheetContent>
              </Sheet>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button asChild variant="outline" size="sm" className="hidden rounded-xl sm:inline-flex">
                <Link href="/">Marketing site</Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
