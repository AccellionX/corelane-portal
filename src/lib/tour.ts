export const TOUR_STORAGE_KEY = "corelane-tour-v1";

export type TourStepId =
  | "content"
  | "public"
  | "settings"
  | "dashboard"
  | "payments"
  | "logs";

export interface TourStep {
  id: TourStepId;
  title: string;
  body: string;
  href: string;
  target: string;
  requireAdmin?: boolean;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "content",
    title: "Edit & publish content",
    body: "Change the hero headline in Admin → Content, then hit Publish. The public site updates instantly from the shared store.",
    href: "/admin/content",
    target: "[data-tour='cms-headline']",
    requireAdmin: true,
  },
  {
    id: "public",
    title: "See it live",
    body: "Here’s the public homepage. If you published a new headline, it should already be reflected here.",
    href: "/",
    target: "[data-tour='hero-headline']",
  },
  {
    id: "settings",
    title: "Switch the core model",
    body: "In Admin → Settings, pick Bookings, Orders, Subscriptions, or Uploads. The user dashboard adapts to that product.",
    href: "/admin/settings?tab=model",
    target: "[data-tour='core-model']",
    requireAdmin: true,
  },
  {
    id: "dashboard",
    title: "Dashboard adapts",
    body: "The sidebar’s core module label and overview cards follow the business model you just selected.",
    href: "/app",
    target: "[data-tour='app-overview']",
  },
  {
    id: "payments",
    title: "Refund a payment",
    body: "Open Payments and refund a paid transaction (Admin role). Linked invoices and the audit log update live.",
    href: "/admin/payments",
    target: "[data-tour='refund-btn']",
    requireAdmin: true,
  },
  {
    id: "logs",
    title: "Export activity",
    body: "Every admin action lands here. Click Export CSV to download a real CSV of this session’s audit trail.",
    href: "/admin/logs",
    target: "[data-tour='export-csv']",
    requireAdmin: true,
  },
];

export interface TourStorage {
  welcomeSeen: boolean;
  tourCompleted: boolean;
}

export function readTourStorage(): TourStorage {
  if (typeof window === "undefined") {
    return { welcomeSeen: false, tourCompleted: false };
  }
  try {
    const raw = window.localStorage.getItem(TOUR_STORAGE_KEY);
    if (!raw) return { welcomeSeen: false, tourCompleted: false };
    return { welcomeSeen: false, tourCompleted: false, ...JSON.parse(raw) };
  } catch {
    return { welcomeSeen: false, tourCompleted: false };
  }
}

export function writeTourStorage(patch: Partial<TourStorage>) {
  if (typeof window === "undefined") return;
  try {
    const next = { ...readTourStorage(), ...patch };
    window.localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
