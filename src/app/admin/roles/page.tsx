"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { PERMISSION_META } from "@/lib/mock-data";
import { useCorelaneStore } from "@/lib/store";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { UserRole } from "@/lib/types";
import { toast } from "sonner";

const ROLES: UserRole[] = ["Admin", "Manager", "Support", "User"];

export default function AdminRolesPage() {
  const loading = useSimulatedLoading();
  const rolePermissions = useCorelaneStore((s) => s.rolePermissions);
  const setRolePermission = useCorelaneStore((s) => s.setRolePermission);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Toggle capabilities per role. Changes are audited."
      />

      <Card>
        <CardHeader>
          <CardTitle>Permission matrix</CardTitle>
          <CardDescription>
            Admin starts with full access. Support is limited to tickets by default.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left">
                <th className="pb-3 pr-4 font-medium">Permission</th>
                {ROLES.map((r) => (
                  <th key={r} className="pb-3 px-2 text-center font-medium">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_META.map((perm) => (
                <tr key={perm.id} className="border-b border-border/40">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{perm.label}</p>
                    <p className="text-xs text-muted-foreground">{perm.id}</p>
                  </td>
                  {ROLES.map((role) => (
                    <td key={role} className="px-2 py-3 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={!!rolePermissions[role]?.[perm.id]}
                          onCheckedChange={(checked) => {
                            setRolePermission(role, perm.id, checked);
                            toast.message(
                              `${role}: ${perm.id} ${checked ? "on" : "off"}`
                            );
                          }}
                          aria-label={`${role} ${perm.id}`}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
