"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultAdminHref } from "@/lib/access";
import type { DemoRole } from "@/lib/types";

export function RestrictedScreen({
  role,
  message = "Restricted - ask an Admin for access.",
}: {
  role: DemoRole;
  message?: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-in fade-in-0 duration-300">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 shadow-[var(--shadow-soft)] dark:bg-zinc-800">
        <Lock className="h-6 w-6" />
      </div>
      <h1 className="mt-6 text-xl font-semibold tracking-tight">Restricted</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Current demo role: <span className="font-medium text-foreground">{role}</span>
      </p>
      <Button asChild className="mt-8 rounded-xl bg-indigo-600 hover:bg-indigo-500">
        <Link href={defaultAdminHref(role)}>Go to allowed area</Link>
      </Button>
    </div>
  );
}
