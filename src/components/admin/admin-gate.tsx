"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { RestrictedScreen } from "@/components/admin/restricted-screen";
import {
  canAccessSection,
  defaultAdminHref,
  restrictedMessage,
  sectionFromPath,
} from "@/lib/access";
import { useCorelaneStore } from "@/lib/store";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = useCorelaneStore((s) => s.role);
  const section = sectionFromPath(pathname);

  useEffect(() => {
    if (role === "Support" && (pathname === "/admin" || pathname === "/admin/")) {
      router.replace(defaultAdminHref(role));
    }
  }, [role, pathname, router]);

  if (section && !canAccessSection(role, section)) {
    return (
      <RestrictedScreen role={role} message={restrictedMessage(role, section)} />
    );
  }

  return <>{children}</>;
}
