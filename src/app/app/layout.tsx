"use client";

import { UserShell } from "@/components/dashboard/user-shell";

export default function UserAppLayout({ children }: { children: React.ReactNode }) {
  return <UserShell>{children}</UserShell>;
}
