"use client";

import Link from "next/link";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { FinalCta } from "@/components/marketing/final-cta";
import { Button } from "@/components/ui/button";

export function FaqPage() {
  return (
    <>
      <section className="gradient-mesh border-b border-border/60">
        <div className="page-shell section-space">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">FAQ</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Questions, answered from the CMS
            </h1>
            <p className="mt-5 text-pretty text-lg text-muted-foreground">
              These items live in the shared store. Update them in Admin → CMS and the accordion
              here (and on Home) re-renders live.
            </p>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl">
            <FaqAccordion />
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <p className="text-sm text-muted-foreground">Still stuck?</p>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
