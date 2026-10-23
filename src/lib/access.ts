import type { DemoRole } from "./types";

export type AdminSection =
  | "analytics"
  | "users"
  | "roles"
  | "plans"
  | "payments"
  | "support"
  | "content"
  | "logs"
  | "settings";

const ACCESS: Record<DemoRole, AdminSection[]> = {
  Admin: [
    "analytics",
    "users",
    "roles",
    "plans",
    "payments",
    "support",
    "content",
    "logs",
    "settings",
  ],
  Manager: [
    "analytics",
    "users",
    "plans",
    "payments",
    "support",
    "content",
    "logs",
    "settings",
  ],
  Support: ["users", "support"],
};

export function canAccessSection(role: DemoRole, section: AdminSection): boolean {
  return ACCESS[role].includes(section);
}

export function canRefundPayments(role: DemoRole): boolean {
  return role === "Admin";
}

export function canMutateUsers(role: DemoRole): boolean {
  return role === "Admin" || role === "Manager";
}

export function sectionFromPath(pathname: string): AdminSection | null {
  if (!pathname.startsWith("/admin")) return null;
  if (pathname === "/admin" || pathname === "/admin/") return "analytics";
  if (pathname.startsWith("/admin/users")) return "users";
  if (pathname.startsWith("/admin/roles")) return "roles";
  if (pathname.startsWith("/admin/plans")) return "plans";
  if (pathname.startsWith("/admin/payments")) return "payments";
  if (pathname.startsWith("/admin/support")) return "support";
  if (pathname.startsWith("/admin/content")) return "content";
  if (pathname.startsWith("/admin/logs")) return "logs";
  if (pathname.startsWith("/admin/settings")) return "settings";
  return null;
}

export function defaultAdminHref(role: DemoRole): string {
  if (role === "Support") return "/admin/users";
  return "/admin";
}

export function restrictedMessage(role: DemoRole, section: AdminSection): string {
  if (role === "Manager" && section === "roles") {
    return "Restricted - ask an Admin for access.";
  }
  if (role === "Support") {
    return "Restricted - Support can only view Users and Support. Ask an Admin for access.";
  }
  return "Restricted - ask an Admin for access.";
}
