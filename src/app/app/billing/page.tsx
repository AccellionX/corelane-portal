"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { selectCurrentUser, useCorelaneStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { PlanId } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const loading = useSimulatedLoading();
  const user = useCorelaneStore(selectCurrentUser);
  const plans = useCorelaneStore((s) => s.plans);
  const paymentMethod = useCorelaneStore((s) => s.paymentMethod);
  const transactions = useCorelaneStore((s) => s.transactions);
  const changePlan = useCorelaneStore((s) => s.changePlan);
  const updatePaymentMethod = useCorelaneStore((s) => s.updatePaymentMethod);

  const [planOpen, setPlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(user.plan);

  const plan = plans.find((p) => p.id === user.plan);
  const history = transactions
    .filter((t) => t.userId === user.id)
    .slice(0, 8);
  const list = history.length ? history : transactions.slice(0, 8);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Plan, payment method, and charge history."
      />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardDescription>Current plan</CardDescription>
            <CardTitle className="mt-1 text-3xl">{plan?.name}</CardTitle>
            <p className="mt-2 text-muted-foreground">
              {formatCurrency(plan?.price ?? 0)} / month
            </p>
          </div>
          <Button
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
            onClick={() => {
              setSelectedPlan(user.plan);
              setPlanOpen(true);
            }}
          >
            Change plan
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment method</CardTitle>
          <CardDescription>Stripe-style card on file</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-600 text-white shadow-md">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">
                {paymentMethod.brand} ···· {paymentMethod.last4}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              updatePaymentMethod({
                brand: "Mastercard",
                last4: "5512",
                expMonth: 11,
                expYear: 2029,
              });
              toast.success("Payment method updated (mock)");
            }}
          >
            Update card
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing history</CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <EmptyState
              title="No charges yet"
              description="Subscription payments will show up here."
            />
          ) : (
            <div className="divide-y divide-border/60">
              {list.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(t.date)} · {t.paymentMethod}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{formatCurrency(t.amount)}</span>
                    <StatusBadge value={t.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={planOpen} onOpenChange={setPlanOpen}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Change plan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {plans.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlan(p.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition",
                  selectedPlan === p.id
                    ? "border-indigo-600 ring-2 ring-indigo-600/20"
                    : "border-border/70 hover:border-border"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm">{formatCurrency(p.price)}/mo</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
              onClick={() => {
                changePlan(user.id, selectedPlan);
                toast.success(`Switched to ${selectedPlan}`);
                setPlanOpen(false);
              }}
            >
              Confirm change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
