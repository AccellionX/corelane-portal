"use client";

import { ModuleBookings } from "@/components/dashboard/module-bookings";
import { ModuleOrders } from "@/components/dashboard/module-orders";
import { ModuleSubscriptions } from "@/components/dashboard/module-subscriptions";
import { ModuleFiles } from "@/components/dashboard/module-files";
import { useCorelaneStore } from "@/lib/store";

export default function CoreModulePage() {
  const coreModule = useCorelaneStore((s) => s.coreModule);

  switch (coreModule) {
    case "orders":
      return <ModuleOrders />;
    case "subscriptions":
      return <ModuleSubscriptions />;
    case "uploads":
      return <ModuleFiles title="Files" />;
    case "bookings":
    default:
      return <ModuleBookings />;
  }
}
