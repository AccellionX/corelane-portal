import {
  CalendarDays,
  CreditCard,
  FolderOpen,
  Package,
  type LucideIcon,
} from "lucide-react";
import type { CoreModule } from "./types";

export const MODULE_META: Record<
  CoreModule,
  { label: string; href: string; icon: LucideIcon; description: string }
> = {
  bookings: {
    label: "Bookings",
    href: "/app/module",
    icon: CalendarDays,
    description: "Calendar holds and capacity",
  },
  orders: {
    label: "Orders",
    href: "/app/module",
    icon: Package,
    description: "Fulfillment and tracking",
  },
  subscriptions: {
    label: "Subscriptions",
    href: "/app/module",
    icon: CreditCard,
    description: "Plans, usage, and add-ons",
  },
  uploads: {
    label: "Files",
    href: "/app/uploads",
    icon: FolderOpen,
    description: "Shared file library",
  },
};
