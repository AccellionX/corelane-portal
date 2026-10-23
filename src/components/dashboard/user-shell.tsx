"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Bell,
  CreditCard,
  FileText,
  FolderUp,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Search,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav, type NavItem } from "@/components/shell/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { selectCurrentUser, useCorelaneStore } from "@/lib/store";
import { MODULE_META } from "@/lib/module-meta";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function UserShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const coreModule = useCorelaneStore((s) => s.coreModule);
  const notifications = useCorelaneStore((s) => s.notifications);
  const user = useCorelaneStore(selectCurrentUser);
  const moduleMeta = MODULE_META[coreModule];

  const unread = useMemo(
    () => notifications.filter((n) => n.userId === user.id && !n.read).length,
    [notifications, user.id]
  );

  const nav: NavItem[] = useMemo(() => {
    const items: NavItem[] = [
      { href: "/app", label: "Overview", icon: LayoutDashboard },
      { href: moduleMeta.href, label: moduleMeta.label, icon: moduleMeta.icon },
      { href: "/app/billing", label: "Billing", icon: CreditCard },
      { href: "/app/invoices", label: "Invoices", icon: FileText },
    ];
    if (coreModule !== "uploads") {
      items.push({ href: "/app/uploads", label: "Uploads", icon: FolderUp });
    }
    items.push(
      { href: "/app/notifications", label: "Notifications", icon: Bell },
      { href: "/app/support", label: "Support", icon: LifeBuoy },
      { href: "/app/settings", label: "Settings", icon: Settings }
    );
    return items;
  }, [moduleMeta, coreModule]);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border/60 px-5">
        <Link href="/app" onClick={() => setMobileOpen(false)}>
          <Logo />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-2" onClick={() => setMobileOpen(false)}>
        <SidebarNav items={nav} />
      </div>
      <div className="border-t border-border/60 p-4">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.company}</p>
      </div>
    </div>
  );

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim().toLowerCase();
    if (!q) return;
    if (q.includes("invoice")) router.push("/app/invoices");
    else if (q.includes("bill")) router.push("/app/billing");
    else if (q.includes("support") || q.includes("ticket")) router.push("/app/support");
    else if (q.includes("file") || q.includes("upload")) router.push("/app/uploads");
    else if (q.includes("notif")) router.push("/app/notifications");
    else router.push("/app/module");
  };

  return (
    <div className="min-h-screen bg-zinc-50/80 dark:bg-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-background lg:block">
          {sidebar}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/90 px-3 backdrop-blur-xl sm:gap-4 sm:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
                {sidebar}
              </SheetContent>
            </Sheet>

            <form onSubmit={onSearch} className="relative min-w-0 flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoices, tickets, files…"
                className="h-9 rounded-xl border-border/70 bg-zinc-50/80 pl-9 dark:bg-zinc-900/50"
              />
            </form>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <ThemeToggle className="hidden sm:inline-flex" />

              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl"
                asChild
              >
                <Link href="/app/notifications" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
                  <Bell className="h-4 w-4" />
                  {unread > 0 && (
                    <span
                      className={cn(
                        "absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white"
                      )}
                    >
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 rounded-xl px-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback
                        className="text-[11px] font-semibold text-white"
                        style={{ backgroundColor: `hsl(${user.avatarHue} 55% 45%)` }}
                      >
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="ml-2 hidden text-sm font-medium md:inline">
                      {user.name.split(" ")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/app/settings">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/app/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8" data-path={pathname}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
