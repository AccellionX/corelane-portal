"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { FinalCta } from "@/components/marketing/final-cta";
import { FEATURE_ICONS } from "@/components/marketing/feature-icons";
import { Button } from "@/components/ui/button";
import { useCorelaneStore } from "@/lib/store";

const EXTRAS = [
  {
    title: "Role-aware demos",
    body: "Switch Admin, Manager, or Support from the Demo pill and see which actions stay available.",
  },
  {
    title: "Audit everything",
    body: "Suspend users, refund charges, and publish CMS copy - each action lands in the audit log.",
  },
  {
    title: "Invoice PDFs",
    body: "Customer billing can export invoices with jsPDF using the same store-backed amounts.",
  },
];

export function FeaturesPage() {
  const features = useCorelaneStore((s) => s.content.features);

  return (
    <>
      <section className="gradient-mesh border-b border-border/60">
        <div className="page-shell section-space">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Features</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Everything your lanes need in one plane
            </h1>
            <p className="mt-5 text-pretty text-lg text-muted-foreground">
              Core pillars below come from the live CMS store. Edit titles or descriptions in Admin
              and this page updates immediately.
            </p>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell grid gap-6 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = FEATURE_ICONS[feature.icon] ?? ShieldCheck;
            return (
              <div key={feature.id} className="surface-card p-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">{feature.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-space border-t border-border/60 bg-zinc-50/50 dark:bg-zinc-950/40">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Also in the demo</h2>
            <p className="mt-3 text-muted-foreground">
              Product flourishes wired into the shared Zustand store.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {EXTRAS.map((item) => (
              <div key={item.title} className="surface-card p-6">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
