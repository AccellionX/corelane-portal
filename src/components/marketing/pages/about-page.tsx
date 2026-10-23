import Link from "next/link";
import { FinalCta } from "@/components/marketing/final-cta";
import { Button } from "@/components/ui/button";

const VALUES = [
  {
    title: "One source of truth",
    body: "Customer, billing, and support views share the same store - no stale exports between tools.",
  },
  {
    title: "Calm by default",
    body: "Dense ops data deserves generous spacing, clear hierarchy, and actions that feel intentional.",
  },
  {
    title: "Demo that behaves like product",
    body: "This site is fictional, but every surface mutates the same Zustand state so stakeholders can feel the loop.",
  },
];

export function AboutPage() {
  return (
    <>
      <section className="gradient-mesh border-b border-border/60">
        <div className="page-shell section-space">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">About</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Built for teams who outgrew spreadsheets
            </h1>
            <p className="mt-5 text-pretty text-lg text-muted-foreground">
              Corelane is a fictional SaaS demo from AccellionX - designed to show how a public site,
              customer app, and admin panel stay in sync when they share one operational state.
            </p>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Our story</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Growing operators juggle booking calendars, subscription billing, and support queues
              across tools that never talk to each other. Corelane explores what happens when those
              lanes share one control plane - including live CMS edits that update the homepage the
              moment an admin publishes.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Use the Demo pill to switch roles and surfaces. Refund a payment in Admin and watch
              customer billing reflect it. No backend required.
            </p>
            <Button asChild className="mt-8 rounded-xl bg-indigo-600 hover:bg-indigo-500">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="surface-card p-6">
                <h3 className="font-semibold tracking-tight">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        title="See the full product loop"
        description="Jump into the customer dashboard or admin panel - both read from the same seed data."
      />
    </>
  );
}
