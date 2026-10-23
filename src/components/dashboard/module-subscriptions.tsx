"use client";

import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/dashboard/progress";
import { selectCurrentUser, useCorelaneStore } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import Link from "next/link";

export function ModuleSubscriptions() {
  const loading = useSimulatedLoading();
  const user = useCorelaneStore(selectCurrentUser);
  const plans = useCorelaneStore((s) => s.plans);
  const addons = useCorelaneStore((s) => s.addons);
  const usageMeters = useCorelaneStore((s) => s.usageMeters);
  const toggleAddon = useCorelaneStore((s) => s.toggleAddon);
  const plan = plans.find((p) => p.id === user.plan);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-56" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <EmptyState
        title="No active subscription"
        description="Choose a plan from Billing to activate usage meters and add-ons."
        actionLabel="Go to Billing"
        onAction={() => {
          window.location.href = "/app/billing";
        }}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        description="Active plan, usage meters, and optional add-ons."
        actions={
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/app/billing">Manage billing</Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Active plan</CardDescription>
            <CardTitle className="text-3xl">{plan.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {formatCurrency(plan.price)}
              <span className="text-sm font-normal text-muted-foreground"> / month</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {plan.features.slice(0, 4).map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage this period</CardTitle>
            <CardDescription>Soft limits for your current plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {usageMeters.map((m) => (
              <div key={m.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{m.label}</span>
                  <span className="text-muted-foreground">
                    {m.used.toLocaleString()} / {m.limit.toLocaleString()} {m.unit}
                  </span>
                </div>
                <Progress value={Math.min(100, (m.used / m.limit) * 100)} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add-ons</CardTitle>
          <CardDescription>Toggle extras for this workspace (demo)</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/60">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{addon.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(addon.price)} / month
                </p>
              </div>
              <Button
                size="sm"
                variant={addon.active ? "outline" : "default"}
                className={
                  addon.active
                    ? "rounded-xl"
                    : "rounded-xl bg-indigo-600 hover:bg-indigo-500"
                }
                onClick={() => {
                  toggleAddon(addon.id);
                  toast.message(addon.active ? "Add-on removed" : "Add-on enabled");
                }}
              >
                {addon.active ? "Remove" : "Add"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
