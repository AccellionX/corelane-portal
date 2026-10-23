"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarPlus,
  LineChart,
  Plug,
} from "lucide-react";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { FinalCta } from "@/components/marketing/final-cta";
import { FEATURE_ICONS } from "@/components/marketing/feature-icons";
import { LogoStrip } from "@/components/marketing/logo-strip";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Button } from "@/components/ui/button";
import { useCorelaneStore } from "@/lib/store";
import { ShieldCheck } from "lucide-react";

const STEPS = [
  {
    icon: CalendarPlus,
    title: "Connect your lanes",
    description:
      "Import bookings, seats, and customers — or start fresh with a guided workspace setup.",
  },
  {
    icon: Plug,
    title: "Run day-to-day ops",
    description:
      "Confirm capacity, collect payments, and open support threads without leaving Corelane.",
  },
  {
    icon: LineChart,
    title: "See what moves revenue",
    description:
      "Shared analytics keep customer and admin views aligned on the same live numbers.",
  },
];

export function HomePage() {
  const content = useCorelaneStore((s) => s.content);

  return (
    <>
      <section className="relative overflow-hidden gradient-mesh">
        <div className="page-shell section-space">
          <div className="mx-auto max-w-3xl text-center">
            {!content.published && (
              <p className="mb-4 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                Draft content — publish from Admin → CMS
              </p>
            )}
            <p className="mb-5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Corelane
            </p>
              <h1
                data-tour="hero-headline"
                className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]"
              >
                {content.heroHeadline}
              </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              {content.heroSubtext}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-indigo-600 px-6 hover:bg-indigo-500"
              >
                <Link href="/signup">
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link href="/features">See features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LogoStrip />

      <section className="section-space">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Built for operators</h2>
            <p className="mt-3 text-muted-foreground">
              Feature copy is live from the CMS store — edit it in Admin and watch this grid update.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {content.features.map((feature) => {
              const Icon = FEATURE_ICONS[feature.icon] ?? ShieldCheck;
              return (
                <div key={feature.id} className="surface-card p-6 sm:p-7">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space border-t border-border/60 bg-zinc-50/50 dark:bg-zinc-950/40">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
            <p className="mt-3 text-muted-foreground">
              Three steps from empty workspace to shared operational rhythm.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="surface-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                      {i + 1}
                    </span>
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space border-t border-border/60">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Pricing preview</h2>
            <p className="mt-3 text-muted-foreground">
              Same three tiers that power billing in the dashboard.{" "}
              <Link href="/pricing" className="font-medium text-indigo-600 hover:underline">
                Compare annual billing
              </Link>
            </p>
          </div>
          <div className="mt-12">
            <PricingCards billing="monthly" />
          </div>
        </div>
      </section>

      <section className="section-space border-t border-border/60 bg-zinc-50/50 dark:bg-zinc-950/40">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-semibold tracking-tight">FAQ</h2>
              <p className="mt-3 text-muted-foreground">
                Answers from the shared CMS.{" "}
                <Link href="/faq" className="font-medium text-indigo-600 hover:underline">
                  View all
                </Link>
              </p>
            </div>
            <FaqAccordion />
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
