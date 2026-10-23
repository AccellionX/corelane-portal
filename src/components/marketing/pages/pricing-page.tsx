"use client";

import { useState } from "react";
import { FinalCta } from "@/components/marketing/final-cta";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { cn } from "@/lib/utils";

export function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <>
      <section className="gradient-mesh border-b border-border/60">
        <div className="page-shell section-space">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Pricing</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Simple plans that scale with your lanes
            </h1>
            <p className="mt-5 text-pretty text-lg text-muted-foreground">
              Three tiers from the shared store. Annual billing gives you two months free.
            </p>

            <div
              className="mx-auto mt-8 inline-flex rounded-xl border border-border/80 bg-background p-1 shadow-[var(--shadow-soft)]"
              role="group"
              aria-label="Billing period"
            >
              {(
                [
                  { id: "monthly", label: "Monthly" },
                  { id: "annual", label: "Annual" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBilling(opt.id)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition",
                    billing === opt.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.label}
                  {opt.id === "annual" && (
                    <span
                      className={cn(
                        "ml-2 text-[10px] font-semibold uppercase tracking-wide",
                        billing === "annual" ? "text-indigo-100" : "text-indigo-600"
                      )}
                    >
                      −2 mo
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <PricingCards billing={billing} showToggleNote />
          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted-foreground">
            Prices shown are demo figures. Choosing a plan opens the mock sign-up flow and lands in
            the customer dashboard.
          </p>
        </div>
      </section>

      <FinalCta title="Start on Growth free for 14 days" />
    </>
  );
}
