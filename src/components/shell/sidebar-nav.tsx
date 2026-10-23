"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  hidden?: boolean;
  locked?: boolean;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items
        .filter((item) => !item.hidden)
        .map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/app" &&
              item.href !== "/admin" &&
              pathname.startsWith(item.href));
          const Icon = item.icon;

          if (item.locked) {
            return (
              <Link
                key={`${item.href}:${item.label}`}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground/70 transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                <Lock className="h-3.5 w-3.5 opacity-60" />
              </Link>
            );
          }

          return (
            <Link
              key={`${item.href}:${item.label}`}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                  : "text-muted-foreground hover:bg-zinc-100 hover:text-foreground dark:hover:bg-zinc-800"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
    </nav>
  );
}
