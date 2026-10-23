import { Suspense } from "react";
import { AdminSettingsClient } from "./settings-client";
import { Skeleton } from "@/components/ui/skeleton";

function SettingsFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<SettingsFallback />}>
      <AdminSettingsClient />
    </Suspense>
  );
}
