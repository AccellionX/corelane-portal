"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  ScrollText,
  Settings,
  Shield,
  Users,
  Wallet,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav, type NavItem } from "@/components/shell/sidebar-nav";
import { AdminGate } from "@/components/admin/admin-gate";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { canAccessSection, type AdminSection } from "@/lib/access";
import { useCorelaneStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV_DEF: { href: string; label: string; icon: NavItem["icon"]; section: AdminSection }[] = [
  { href: "/admin", label: "Analytics", icon: LayoutDashboard, section: "analytics" },
  { href: "/admin/users", label: "Users", icon: Users, section: "users" },
  { href: "/admin/roles", label: "Roles & Permissions", icon: Shield, section: "roles" },
  { href: "/admin/plans", label: "Services & Plans", icon: Wallet, section: "plans" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, section: "payments" },
  { href: "/admin/support", label: "Support", icon: LifeBuoy, section: "support" },
  { href: "/admin/content", label: "Content", icon: FileText, section: "content" },
  { href: "/admin/logs", label: "Activity Logs", icon: ScrollText, section: "logs" },
  { href: "/admin/settings", label: "Settings", icon: Settings, section: "settings" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const environment = useCorelaneStore((s) => s.environment);
  const role = useCorelaneStore((s) => s.role);
  const isProd = environment === "production";

  const nav: NavItem[] = useMemo(() => {
    return NAV_DEF.map((item) => {
      const allowed = canAccessSection(role, item.section);
      if (role === "Support") {
        return {
          href: item.href,
          label: item.label,
          icon: item.icon,
          hidden: !allowed,
        };
      }
      if (role === "Manager" && item.section === "roles") {
        return {
          href: item.href,
          label: item.label,
          icon: item.icon,
          locked: true,
        };
      }
      return {
        href: item.href,
        label: item.label,
        icon: item.icon,
        hidden: !allowed,
      };
    });
  }, [role]);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border/60 px-5">
        <Link href="/admin" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-2" onClick={() => setOpen(false)}>
        <SidebarNav items={nav} />
      </div>
      <div className="border-t border-border/60 p-4">
        <p className="text-xs text-muted-foreground">Acting as</p>
        <p className="mt-0.5 text-sm font-medium">{role}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50/80 dark:bg-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-background lg:block">
          {sidebar}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/90 px-3 backdrop-blur-xl sm:gap-4 sm:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                {sidebar}
              </SheetContent>
            </Sheet>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Admin panel
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <span
                data-tour="env-badge"
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition",
                  isProd
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800"
                    : "bg-amber-50 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800"
                )}
              >
                <span
                  className={cn(
                    "mr-1.5 h-1.5 w-1.5 rounded-full",
                    isProd ? "bg-emerald-500" : "bg-amber-500"
                  )}
                />
                {isProd ? "Production" : "Staging"}
              </span>
              <ThemeToggle />
              <Button asChild variant="outline" size="sm" className="hidden rounded-xl sm:inline-flex">
                <Link href="/">Public site</Link>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <AdminGate>{children}</AdminGate>
          </main>
        </div>
      </div>
    </div>
  );
}
