"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCorelaneStore } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PricingCards({
  billing,
  showToggleNote = false,
}: {
  billing: "monthly" | "annual";
  showToggleNote?: boolean;
}) {
  const plans = useCorelaneStore((s) => s.plans);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((plan) => {
        const monthly = plan.price;
        const display =
          billing === "annual" ? Math.round((monthly * 10) / 12) : monthly;
        const billedAnnually = monthly * 10;

        return (
          <div
            key={plan.id}
            className={cn(
              "surface-card relative flex flex-col p-6 sm:p-7",
              plan.highlighted && "ring-2 ring-indigo-600"
            )}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-6 rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-medium text-white">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            <p className="mt-6">
              <span className="text-4xl font-semibold tracking-tight">
                {formatCurrency(display)}
              </span>
              <span className="text-muted-foreground"> / month</span>
            </p>
            {billing === "annual" && (
              <p className="mt-1 text-xs text-muted-foreground">
                Billed {formatCurrency(billedAnnually)} / year
                {showToggleNote ? " · 2 months free" : ""}
              </p>
            )}
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={cn(
                "mt-8 w-full rounded-xl",
                plan.highlighted && "bg-indigo-600 hover:bg-indigo-500"
              )}
              variant={plan.highlighted ? "default" : "outline"}
            >
              <Link href="/signup">Choose {plan.name}</Link>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
